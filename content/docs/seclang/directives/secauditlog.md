---
title: "SecAuditLog"
description: "Defines the path to the main audit log file (serial logging format) or the concurrent logging index file (concurrent logging format). When used in combination with mlogc (only possible with concurrent logging), this directive defines the mlogc location and command line."
syntax: "SecAuditLog /path/to/audit.log"
date: 2020-10-06T08:48:57+00:00
lastmod: 2020-10-06T08:48:57+00:00
draft: false
images: []
weight: 100
toc: true
versions: v1.0+
tinygo: Partial, file writing is not available on all platforms.
type: seclang/directives
---

{{< alert icon="👉" text="Writing to programs using pipe (|) is not implemented yet." />}}

```apache
SecAuditLog "|/path/to/mlogc /path/to/mlogc.conf"
```

**Note :** This audit log file is opened on startup when the server typically still runs as root. You should not allow non-root users to have write privileges for this file or for the directory.
