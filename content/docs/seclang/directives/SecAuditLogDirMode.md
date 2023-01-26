---
title: "SecAuditLogDirMode"
description: "Configures the mode (permissions) of any directories created for the concurrent audit logs, using an octal mode value as parameter (as used in chmod)."
syntax: "SecAuditLogDirMode octal_mode|"default""
default: "0600"
date: ""
lastmod: "2023-01-26T20:49:29+01:00"
draft: false
images: []
weight: 100
toc: true
type: seclang/directives
---

The default mode for new audit log directories (0600) only grants read/write access
to the owner.
Example:
```apache
SecAuditLogDirMode 02750
```

