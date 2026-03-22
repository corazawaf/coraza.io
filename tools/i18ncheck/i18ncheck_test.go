// Copyright 2024 The OWASP Coraza contributors
// SPDX-License-Identifier: Apache-2.0

package i18ncheck_test

import (
	"os"
	"path/filepath"
	"sort"
	"strings"
	"testing"
)

// contentLanguages returns sorted language codes by listing subdirectories under content/.
// Each subdirectory (e.g. content/en, content/es) represents a language.
func contentLanguages(t *testing.T, contentBase string) []string {
	t.Helper()

	entries, err := os.ReadDir(contentBase)
	if err != nil {
		t.Fatalf("reading content directory: %v", err)
	}

	var langs []string
	for _, e := range entries {
		// Only consider two-letter directory names (ISO 639-1 language codes)
		if e.IsDir() && len(e.Name()) == 2 {
			langs = append(langs, e.Name())
		}
	}
	sort.Strings(langs)

	if len(langs) < 2 {
		t.Fatalf("expected at least 2 language directories under %s, got %d: %v", contentBase, len(langs), langs)
	}

	return langs
}

// contentFiles returns the sorted list of relative .md file paths under a content directory.
func contentFiles(t *testing.T, dir string) []string {
	t.Helper()

	var files []string
	err := filepath.Walk(dir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		if info.IsDir() {
			return nil
		}
		if strings.HasSuffix(info.Name(), ".md") {
			rel, err := filepath.Rel(dir, path)
			if err != nil {
				return err
			}
			files = append(files, rel)
		}
		return nil
	})
	if err != nil {
		t.Fatalf("walking %s: %v", dir, err)
	}
	sort.Strings(files)
	return files
}

func TestContentParity(t *testing.T) {
	contentBase := filepath.Join("..", "..", "content")

	langs := contentLanguages(t, contentBase)

	// Collect files per language
	langFiles := make(map[string][]string)
	for _, lang := range langs {
		dir := filepath.Join(contentBase, lang)
		langFiles[lang] = contentFiles(t, dir)
	}

	// Use first language as reference
	ref := langs[0]
	refFiles := langFiles[ref]

	for _, lang := range langs[1:] {
		t.Run(ref+"_vs_"+lang, func(t *testing.T) {
			files := langFiles[lang]

			refSet := make(map[string]bool, len(refFiles))
			for _, f := range refFiles {
				refSet[f] = true
			}

			langSet := make(map[string]bool, len(files))
			for _, f := range files {
				langSet[f] = true
			}

			// Check for files in reference but missing in this language
			for _, f := range refFiles {
				if !langSet[f] {
					t.Errorf("file %q exists in %q but is missing in %q", f, ref, lang)
				}
			}

			// Check for files in this language but missing in reference
			for _, f := range files {
				if !refSet[f] {
					t.Errorf("file %q exists in %q but is missing in %q", f, lang, ref)
				}
			}
		})
	}
}
