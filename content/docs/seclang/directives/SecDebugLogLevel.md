---
title: "SecDebugLogLevel"
description: " Configures the verboseness of the debug log data."
syntax: "SecDebugLogLevel 4"
default: 2
date: 2020-10-06T08:48:57+00:00
lastmod: 2020-10-06T08:48:57+00:00
draft: false
images: []
weight: 100
toc: true
versions: v1.0+
tinygo: Yes
type: seclang/directives
---

Depending on the implementation, errors ranging from 1 to 2 might be directly logged to the connector error log. For example, level 2 (error) logs will be written to caddy server error logs.

The possible values for the debug log level are:

- **0:** Fatal
- **1:** Panic
- **2:** Error
- **3:** Warning
- **4:** details of how transactions are handled
- **5:** log everything, including very detailed debugging information

All levels over 5 will be considered as 5.