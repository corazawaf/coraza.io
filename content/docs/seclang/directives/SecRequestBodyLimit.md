---
title: SecRequestBodyLimit
description: Configures the maximum request body size Coraza will accept for buffering.
syntax: SecRequestBodyLimit [LIMIT_IN_BYTES]
default: 134217728 (131072 KB)
date: 
lastmod: "2023-01-30T14:25:50+01:00"
draft: false
images: []
versions: v3.0+
weight: 100
toc: true
type: seclang/directives
---

Anything over the limit will be rejected with status code 413 (Request Entity Too Large).
There is a hard limit of 1 GB.

