---
title: "SecRequestBodyInMemoryLimit"
description: "Configures the maximum request body size that Coraza will store in memory."
syntax: "SecRequestBodyInMemoryLimit LIMIT_IN_BYTES"
default: 131072 (128 KB)
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

When a multipart/form-data request is being processed, once the in-memory limit is reached, the request body will start to be streamed into a temporary file on disk.

{{< alert icon="👉" text="If a tinygo implementation is not capable of writing files, this feature will be disabled." />}}


