---
title: "SecRequestBodyLimit"
description: "Configures the maximum request body size Coraza will accept for buffering."
syntax: "SecRequestBodyLimit 134217728"
default: 134217728 (131072 KB)
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

Anything over the limit will be rejected with status code 413 (Request Entity Too Large). There is a hard limit of 1 GB.

