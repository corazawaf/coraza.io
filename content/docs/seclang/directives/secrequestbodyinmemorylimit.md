---
title: "SecRequestBodyInMemoryLimit"
description: "Configures the maximum request body size that Coraza will store in memory."
syntax: "SecRequestBodyInMemoryLimit [LIMIT_IN_BYTES]"
default: "131072 (128 KB)"
date: ""
lastmod: "2023-01-26T14:57:12&#43;01:00"
draft: false
images: []
weight: 100
toc: true
type: seclang/directives
---

When a multipart/form-data request is being processed, once the in-memory limit is reached,
the request body will start to be streamed into a temporary file on disk.

