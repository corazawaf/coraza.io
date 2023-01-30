---
title: Include
description: Include and evaluate a file or file pattern.
syntax: Include [PATH_TO_CONF_FILES]
default: 
date: 
lastmod: "2023-01-30T14:25:50+01:00"
draft: false
images: []
versions: v3.0+
weight: 100
toc: true
type: seclang/directives
---

Include loads a file or a list of files from the filesystem using golang Glob syntax.

Example:
```apache
Include /path/coreruleset/rules/*.conf
```

Quoting [Glob documentation](https://pkg.go.dev/path/filepath#Glob):
> The syntax of patterns is the same as in Match. The pattern may describe hierarchical
> names such as /usr/*/bin/ed (assuming the Separator is ‘/’).
> Glob ignores file system errors such as I/O errors reading directories. The only possible returned error is ErrBadPattern, when pattern is malformed.

