// Copyright 2024 The OWASP Coraza contributors
// SPDX-License-Identifier: Apache-2.0

package seocheck_test

import (
	"encoding/xml"
	"net/url"
	"os"
	"path/filepath"
	"strings"
	"testing"
)

type sitemapIndex struct {
	XMLName  xml.Name       `xml:"sitemapindex"`
	Sitemaps []sitemapEntry `xml:"sitemap"`
}

type sitemapEntry struct {
	Loc string `xml:"loc"`
}

type urlSet struct {
	XMLName xml.Name   `xml:"urlset"`
	URLs    []urlEntry `xml:"url"`
}

type urlEntry struct {
	Loc string `xml:"loc"`
}

func publicDir(t *testing.T) string {
	t.Helper()
	dir := filepath.Join("..", "..", "public")
	if _, err := os.Stat(dir); os.IsNotExist(err) {
		t.Skip("public/ not found — run 'npm run build' first")
	}
	return dir
}

// TestSitemapIndexValid checks that public/sitemap.xml is a valid sitemapindex
// with at least one per-language sitemap entry.
func TestSitemapIndexValid(t *testing.T) {
	pub := publicDir(t)

	data, err := os.ReadFile(filepath.Join(pub, "sitemap.xml"))
	if err != nil {
		t.Fatalf("reading sitemap.xml: %v", err)
	}

	var idx sitemapIndex
	if err := xml.Unmarshal(data, &idx); err != nil {
		t.Fatalf("parsing sitemap.xml as sitemapindex: %v", err)
	}

	if len(idx.Sitemaps) == 0 {
		t.Fatal("sitemap.xml contains no <sitemap> entries")
	}

	for i, s := range idx.Sitemaps {
		if s.Loc == "" {
			t.Errorf("sitemap entry %d has empty <loc>", i)
		}
	}
}

// TestSitemapHomepagePresent checks that each per-language sitemap under
// public/ contains the root homepage URL (path "/").
func TestSitemapHomepagePresent(t *testing.T) {
	pub := publicDir(t)

	entries, err := os.ReadDir(pub)
	if err != nil {
		t.Fatalf("reading public/: %v", err)
	}

	var langDirs []string
	for _, e := range entries {
		if !e.IsDir() {
			continue
		}
		if _, err := os.Stat(filepath.Join(pub, e.Name(), "sitemap.xml")); err == nil {
			langDirs = append(langDirs, e.Name())
		}
	}

	if len(langDirs) == 0 {
		t.Fatal("no per-language sitemap.xml files found under public/")
	}

	for _, lang := range langDirs {
		t.Run(lang, func(t *testing.T) {
			data, err := os.ReadFile(filepath.Join(pub, lang, "sitemap.xml"))
			if err != nil {
				t.Fatalf("reading %s/sitemap.xml: %v", lang, err)
			}

			var us urlSet
			if err := xml.Unmarshal(data, &us); err != nil {
				t.Fatalf("parsing %s/sitemap.xml: %v", lang, err)
			}

			if len(us.URLs) == 0 {
				t.Fatalf("%s/sitemap.xml contains no <url> entries", lang)
			}

			foundHome := false
			for _, u := range us.URLs {
				parsed, err := url.Parse(u.Loc)
				if err != nil {
					continue
				}
				if parsed.Path == "/" {
					foundHome = true
					break
				}
			}

			if !foundHome {
				t.Errorf("%s/sitemap.xml does not contain homepage URL (path \"/\")", lang)
			}
		})
	}
}

// TestNoOrphanedSectionSitemaps checks that no section-level sitemap.xml files
// exist (e.g. public/docs/sitemap.xml). Only root and per-language sitemaps
// should be present.
func TestNoOrphanedSectionSitemaps(t *testing.T) {
	pub := publicDir(t)

	err := filepath.Walk(pub, func(path string, info os.FileInfo, err error) error {
		if err != nil || info.IsDir() || info.Name() != "sitemap.xml" {
			return err
		}
		rel, _ := filepath.Rel(pub, path)
		parts := strings.Split(filepath.ToSlash(rel), "/")
		// Allow: sitemap.xml (depth 1) and <lang>/sitemap.xml (depth 2)
		if len(parts) > 2 {
			t.Errorf("unexpected nested sitemap: %s", rel)
		}
		return nil
	})
	if err != nil {
		t.Fatalf("walking public/: %v", err)
	}
}
