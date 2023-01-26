---
title: "Include"
description: "Include and evaluate a file or file pattern."
syntax: "Include /path/coreruleset/rules/*.conf"
default: ""
date: ""
lastmod: "2023-01-26T14:57:12&#43;01:00"
draft: false
images: []
weight: 100
toc: true
type: seclang/directives
---

Include loads a file or a list of files from the filesystem using golang Glob syntax.
Quoting [Glob documentation](https://pkg.go.dev/path/filepath#Glob):
&gt; The syntax of patterns is the same as in Match. The pattern may describe hierarchical
&gt; names such as /usr/*/bin/ed (assuming the Separator is ‘/’).
&gt; Glob ignores file system errors such as I/O errors reading directories. The only possible returned error is ErrBadPattern, when pattern is malformed.

