---
title: SecDebugLogLevel
description: Configures the verboseness of the debug log data.
syntax: SecDebugLogLevel [LOG_LEVEL]
default: 2
date: 
lastmod: "2023-01-30T14:25:50+01:00"
draft: false
images: []
versions: v3.0+
weight: 100
toc: true
type: seclang/directives
---

Depending on the implementation, errors ranging from 1 to 2 might be directly
logged to the connector error log. For example, level 2 (error) logs will be
written to caddy server error logs.
The possible values for the debug log level are:

- 0: Fatal
- 1: Panic
- 2: Error
- 3: Warning
- 4: details of how transactions are handled
- 5: log everything, including very detailed debugging information

All levels over 5 will be considered as 5.

