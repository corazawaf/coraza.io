---
title: "Include"
description: "Include and evaluate a file or file pattern."
syntax: "Include /path/coreruleset/rules/*.conf"
date: 2020-10-06T08:48:57+00:00
lastmod: 2020-10-06T08:48:57+00:00
draft: false
images: []
weight: 100
toc: true
versions: v2.1+
tinygo: No
type: seclang/directives
---

Include loads a file or a list of files from the filesystem using [golang Glob](https://pkg.go.dev/path/filepath#Glob) syntax.

Quoting golang documentation:
> The syntax of patterns is the same as in Match. The pattern may describe hierarchical names such as /usr/*/bin/ed (assuming the Separator is '/').<br>Glob ignores file system errors such as I/O errors reading directories. The only possible returned error is ErrBadPattern, when pattern is malformed.`
