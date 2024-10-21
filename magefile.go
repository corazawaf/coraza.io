// Copyright 2023 The OWASP Coraza contributors
// SPDX-License-Identifier: Apache-2.0

//go:build mage
// +build mage

package main

import (
  "bufio"
  "strings"

  "github.com/magefile/mage/sh"
)

func Generate() error {
  if err := sh.RunV("go", "mod", "vendor", "-o", ".vendor"); err != nil {
    return err
  }

  if err := sh.RunV("go", "run", "tools/directivesgen/main.go", ".vendor/github.com/corazawaf/coraza/v3"); err != nil {
    return err
  }

  if err := sh.RunV("go", "run", "tools/actionsgen/main.go", ".vendor/github.com/corazawaf/coraza/v3"); err != nil {
    return err
  }

  // get all changes in content/docs
  allFilesChangedNames, err := sh.Output("git", "diff", "--name-only", "content/docs")
  if err != nil {
    return err
  }

  // get those changes in content/docs that are not lastmod changes only
  actuallyChangedDiff, err := sh.Output("git", "diff", "-I", "lastmod:", "content/docs")
  if err != nil {
    return err
  }

  // get the files that were not changed besides the lastmod. This is important to not to introduce massive changes
  // in docs when they are actually not changed.
  actuallyUnmodifiedFiles := diff(strings.Split(allFilesChangedNames, "\n"), diffToFilenames(actuallyChangedDiff))
  for _, file := range actuallyUnmodifiedFiles {
    if err := sh.RunV("git", "checkout", "-q", file); err != nil {
      return err
    }
  }

  return nil
}

// diffToFilenames parses a git diff and returns the filenames that were changed
func diffToFilenames(diff string) []string {
  scanner := bufio.NewScanner(strings.NewReader(diff))
  filenames := make([]string, 0)

  for scanner.Scan() {
    line := scanner.Text()
    // Check if the line starts with "diff --git"
    if !strings.HasPrefix(line, "diff --git") {
      continue
    }

    // line is "diff --git a/path/to/file b/path/to/file"
    parts := strings.Split(line, " ")
    if parts[2][2:] == parts[3][2:] {
      filenames = append(filenames, parts[2][2:])
    }
  }

  return filenames
}

// diff returns the difference between two slices of strings
func diff(list1 []string, list2 []string) []string {
  var diff []string

  // Loop two times, first to find slice1 strings not in slice2,
  // second loop to find slice2 strings not in slice1
  for i := 0; i < 2; i++ {
    for _, s1 := range list1 {
      found := false
      for _, s2 := range list2 {
        if s1 == s2 {
          found = true
          break
        }
      }
      // String not found. We add it to return slice
      if !found {
        diff = append(diff, s1)
      }
    }
    // Swap the slices, only if it was the first loop
    if i == 0 {
      list1, list2 = list2, list1
    }
  }

  return diff
}

func Test() error {
  return sh.RunV("go", "test", "./...")
}
