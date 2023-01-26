---
title: "SecResponseBodyLimit"
description: "Configures the maximum response body size that will be accepted for buffering."
syntax: "SecResponseBodyLimit [LIMIT_IN_BYTES]"
default: "524288 (512 KB)"
date: ""
lastmod: "2023-01-26T20:49:29+01:00"
draft: false
images: []
weight: 100
toc: true
type: seclang/directives
---

Anything over this limit will be rejected with status code 500 (Internal Server Error).
This setting will not affect the responses with MIME types that are not selected for
buffering. There is a hard limit of 1 GB.
