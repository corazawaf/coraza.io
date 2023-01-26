---
title: "SecRequestBodyLimit"
description: "Configures the maximum request body size Coraza will accept for buffering."
syntax: "SecRequestBodyLimit 134217728"
default: "134217728 (131072 KB)"
date: ""
lastmod: "2023-01-26T14:57:12&#43;01:00"
draft: false
images: []
weight: 100
toc: true
type: seclang/directives
---

Anything over the limit will be rejected with status code 413 (Request Entity Too Large).
There is a hard limit of 1 GB.

