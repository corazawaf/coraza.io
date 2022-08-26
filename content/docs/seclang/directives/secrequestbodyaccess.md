---
title: "SecRequestBodyAccess"
description: "Configures whether request bodies will be buffered and processed by Coraza."
syntax: "SecRequestBodyAccess On|Off"
default: Off
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

This directive is required if you want to inspect the data transported request bodies (e.g., POST parameters). Request buffering is also required in order to make reliable blocking possible. The possible values are:

- **On:** buffer request bodies
- **Off:** do not buffer request bodies
