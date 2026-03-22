// Copyright 2024 The OWASP Coraza contributors
// SPDX-License-Identifier: Apache-2.0

// readmesync fetches README.md files from GitHub repositories referenced in
// connector and plugin content pages, and updates the page body while
// preserving the YAML front matter.
package main

import (
	"bufio"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
)

// sections to sync: directory path relative to content/en/
var sections = []string{
	"content/en/connectors",
	"content/en/plugins",
}

func main() {
	for _, section := range sections {
		entries, err := os.ReadDir(section)
		if err != nil {
			log.Fatalf("reading %s: %v", section, err)
		}
		for _, e := range entries {
			if e.IsDir() || e.Name() == "_index.md" || !strings.HasSuffix(e.Name(), ".md") {
				continue
			}
			path := filepath.Join(section, e.Name())
			if err := syncFile(path); err != nil {
				log.Printf("WARN: %s: %v", path, err)
			}
		}
	}
}

func syncFile(path string) error {
	data, err := os.ReadFile(path)
	if err != nil {
		return err
	}

	frontMatter, _, err := splitFrontMatter(string(data))
	if err != nil {
		return err
	}

	if extractField(frontMatter, "sync") == "false" {
		return nil
	}

	repo := extractField(frontMatter, "repo")
	if repo == "" {
		return fmt.Errorf("no repo field")
	}

	owner, repoName, err := parseGitHubURL(repo)
	if err != nil {
		return err
	}

	readme, err := fetchREADME(owner, repoName)
	if err != nil {
		return err
	}

	// Strip leading title (# ...) and badges from README since front matter has title
	readme = stripLeadingHeader(readme)

	// Convert relative image/link URLs to absolute GitHub URLs
	readme = resolveRelativeURLs(readme, owner, repoName)

	out := frontMatter + "\n" + readme
	if !strings.HasSuffix(out, "\n") {
		out += "\n"
	}

	if err := os.WriteFile(path, []byte(out), 0644); err != nil {
		return err
	}

	fmt.Printf("synced %s from %s/%s\n", path, owner, repoName)
	return nil
}

// splitFrontMatter splits a Hugo content file into front matter (including delimiters)
// and body content.
func splitFrontMatter(content string) (frontMatter, body string, err error) {
	scanner := bufio.NewScanner(strings.NewReader(content))

	// Find opening ---
	if !scanner.Scan() || strings.TrimSpace(scanner.Text()) != "---" {
		return "", "", fmt.Errorf("no front matter found")
	}

	var fm strings.Builder
	fm.WriteString("---\n")

	for scanner.Scan() {
		line := scanner.Text()
		if strings.TrimSpace(line) == "---" {
			fm.WriteString("---\n")
			// Rest is body
			var b strings.Builder
			for scanner.Scan() {
				b.WriteString(scanner.Text())
				b.WriteString("\n")
			}
			return fm.String(), b.String(), nil
		}
		fm.WriteString(line)
		fm.WriteString("\n")
	}

	return "", "", fmt.Errorf("unclosed front matter")
}

// extractField extracts a simple YAML field value from front matter text.
func extractField(frontMatter, key string) string {
	scanner := bufio.NewScanner(strings.NewReader(frontMatter))
	prefix := key + ":"
	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())
		if strings.HasPrefix(line, prefix) {
			val := strings.TrimSpace(strings.TrimPrefix(line, prefix))
			val = strings.Trim(val, `"'`)
			return val
		}
	}
	return ""
}

// parseGitHubURL extracts owner and repo from a GitHub URL.
func parseGitHubURL(url string) (owner, repo string, err error) {
	url = strings.TrimSuffix(url, "/")
	url = strings.TrimSuffix(url, ".git")

	parts := strings.Split(url, "/")
	if len(parts) < 2 {
		return "", "", fmt.Errorf("invalid GitHub URL: %s", url)
	}

	return parts[len(parts)-2], parts[len(parts)-1], nil
}

// fetchREADME downloads the README.md from a GitHub repo, trying main then master branch.
func fetchREADME(owner, repo string) (string, error) {
	for _, branch := range []string{"main", "master"} {
		url := fmt.Sprintf("https://raw.githubusercontent.com/%s/%s/%s/README.md", owner, repo, branch)
		resp, err := http.Get(url)
		if err != nil {
			continue
		}
		defer resp.Body.Close()

		if resp.StatusCode == http.StatusOK {
			body, err := io.ReadAll(resp.Body)
			if err != nil {
				return "", err
			}
			return string(body), nil
		}
	}
	return "", fmt.Errorf("README.md not found for %s/%s", owner, repo)
}

// stripLeadingHeader removes the leading H1 title (markdown or HTML) and any
// badge lines that immediately follow it (common in GitHub READMEs).
func stripLeadingHeader(readme string) string {
	lines := strings.Split(readme, "\n")

	i := 0
	// Skip leading blank lines
	for i < len(lines) && strings.TrimSpace(lines[i]) == "" {
		i++
	}

	// Skip H1 title: either markdown "# ..." or HTML "<h1>...</h1>" block
	if i < len(lines) && strings.HasPrefix(strings.TrimSpace(lines[i]), "# ") {
		i++
	} else if i < len(lines) && strings.Contains(strings.ToLower(lines[i]), "<h1") {
		// Skip until closing </h1>
		for i < len(lines) {
			hasClose := strings.Contains(strings.ToLower(lines[i]), "</h1>")
			i++
			if hasClose {
				break
			}
		}
	}

	// Skip badge/decoration lines
	for i < len(lines) {
		line := strings.TrimSpace(lines[i])
		if line == "" {
			i++
			continue
		}
		if strings.HasPrefix(line, "[![") ||
			strings.HasPrefix(line, "[!") ||
			strings.HasPrefix(line, "![") ||
			strings.HasPrefix(line, "<a href") ||
			strings.HasPrefix(line, "<a ") ||
			strings.HasPrefix(line, "</a>") ||
			strings.HasPrefix(line, "<p align") ||
			strings.HasPrefix(line, "<p>") ||
			strings.HasPrefix(line, "</p>") ||
			strings.HasPrefix(line, "<img") ||
			strings.HasPrefix(line, "<br") ||
			strings.HasPrefix(line, "<div") ||
			strings.HasPrefix(line, "</div>") ||
			strings.HasPrefix(line, "---") {
			i++
			continue
		}
		break
	}

	// Skip any trailing blank lines at the junction
	for i < len(lines) && strings.TrimSpace(lines[i]) == "" {
		i++
	}

	return strings.Join(lines[i:], "\n")
}

// resolveRelativeURLs converts relative markdown image and link references to
// absolute GitHub URLs so they render correctly on the website.
func resolveRelativeURLs(readme, owner, repo string) string {
	base := fmt.Sprintf("https://github.com/%s/%s/blob/main/", owner, repo)
	rawBase := fmt.Sprintf("https://raw.githubusercontent.com/%s/%s/main/", owner, repo)

	lines := strings.Split(readme, "\n")
	for i, line := range lines {
		// Convert relative image paths: ![alt](./path) or ![alt](path)
		// but not absolute URLs or anchors
		line = resolveMarkdownRefs(line, "![", "](", ")", rawBase)
		line = resolveMarkdownRefs(line, "[", "](", ")", base)
		lines[i] = line
	}
	return strings.Join(lines, "\n")
}

// resolveMarkdownRefs finds markdown references and makes relative paths absolute.
func resolveMarkdownRefs(line, prefix, mid, suffix, base string) string {
	var result strings.Builder
	remaining := line

	for {
		// Find the next reference
		pIdx := strings.Index(remaining, mid)
		if pIdx < 0 {
			result.WriteString(remaining)
			break
		}

		// Check there's a prefix before mid
		beforeMid := remaining[:pIdx]
		prefixIdx := strings.LastIndex(beforeMid, prefix)
		if prefixIdx < 0 {
			result.WriteString(remaining[:pIdx+len(mid)])
			remaining = remaining[pIdx+len(mid):]
			continue
		}

		// Find closing suffix
		afterMid := remaining[pIdx+len(mid):]
		sIdx := strings.Index(afterMid, suffix)
		if sIdx < 0 {
			result.WriteString(remaining[:pIdx+len(mid)])
			remaining = remaining[pIdx+len(mid):]
			continue
		}

		url := afterMid[:sIdx]

		// Write everything up to the URL
		result.WriteString(remaining[:pIdx+len(mid)])

		// Only resolve if it's a relative path (not http/https/# /mailto)
		if !strings.HasPrefix(url, "http://") &&
			!strings.HasPrefix(url, "https://") &&
			!strings.HasPrefix(url, "#") &&
			!strings.HasPrefix(url, "/") &&
			!strings.HasPrefix(url, "mailto:") {
			url = strings.TrimPrefix(url, "./")
			result.WriteString(base + url)
		} else {
			result.WriteString(url)
		}

		result.WriteString(suffix)
		remaining = afterMid[sIdx+len(suffix):]
	}

	return result.String()
}
