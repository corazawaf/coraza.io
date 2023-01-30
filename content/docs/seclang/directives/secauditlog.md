---
title: SecAuditLog
description: Defines the path to the main audit log file (serial logging format) or the concurrent logging index file (concurrent logging format).
syntax: SecAuditLog /path/to/audit.log
default: 
date: 
lastmod: "2023-01-30T13:00:45+01:00"
draft: false
images: []
weight: 100
toc: true
type: seclang/directives
---

When used in combination with mlogc (only possible with concurrent logging), this
directive defines the mlogc location and command line.

```apache
SecAuditLog "|/path/to/mlogc /path/to/mlogc.conf"
```
Note: Writing to programs using pipe (|) is not implemented yet.

Note: This audit log file is opened on startup when the server typically still runs
as root. You should not allow non-root users to have write privileges for this file
or for the directory.

