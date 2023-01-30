---
title: SecAuditLogFileMode
description: Configures the mode (permissions) of any files created for concurrent audit logs using an octal mode (as used in chmod). See SecAuditLogDirMode for controlling the mode of created audit log directories.
syntax: SecAuditLogFileMode octal_mode|"default"
default: 0600
date: 
lastmod: "2023-01-30T13:00:45+01:00"
draft: false
images: []
weight: 100
toc: true
type: seclang/directives
---

Example:
```apache
SecAuditLogFileMode 00640
```

