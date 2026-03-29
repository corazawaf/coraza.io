// Copyright 2024 The OWASP Coraza contributors
// SPDX-License-Identifier: Apache-2.0

package seocheck_test

import (
	"bufio"
	"os"
	"path/filepath"
	"strings"
	"testing"
)

// TestAllPagesHaveDescription walks every markdown file under content/ and
// fails if any page outside contributors/ has a missing or empty description
// front-matter field.
func TestAllPagesHaveDescription(t *testing.T) {
	contentBase := filepath.Join("..", "..", "content")

	err := filepath.Walk(contentBase, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		if info.IsDir() || !strings.HasSuffix(info.Name(), ".md") {
			return nil
		}

		rel, _ := filepath.Rel(contentBase, path)
		rel = filepath.ToSlash(rel)

		// Skip contributor pages — they are profile stubs, not content pages.
		if strings.Contains(rel, "/contributors/") {
			return nil
		}

		desc, err := extractFrontMatterDescription(path)
		if err != nil {
			t.Errorf("%s: could not read file: %v", rel, err)
			return nil
		}

		if desc == "" {
			t.Errorf("%s: missing or empty description", rel)
		}

		return nil
	})

	if err != nil {
		t.Fatalf("walking content/: %v", err)
	}
}

// extractFrontMatterDescription reads the YAML front matter from a markdown
// file and returns the value of the description key. Returns "" if the field
// is absent or empty.
func extractFrontMatterDescription(path string) (string, error) {
	f, err := os.Open(path)
	if err != nil {
		return "", err
	}
	defer f.Close()

	scanner := bufio.NewScanner(f)

	// Expect the first line to open the front matter block.
	if !scanner.Scan() || strings.TrimSpace(scanner.Text()) != "---" {
		return "", nil
	}

	for scanner.Scan() {
		line := scanner.Text()
		if strings.TrimSpace(line) == "---" {
			break
		}
		// Match top-level "description:" (case-insensitive).
		// Leading whitespace would indicate a nested key — skip those.
		lower := strings.ToLower(line)
		after, ok := strings.CutPrefix(lower, "description:")
		if !ok {
			continue
		}
		desc := strings.TrimSpace(after)
		desc = strings.Trim(desc, `"'`)
		return desc, nil
	}

	return "", nil
}
