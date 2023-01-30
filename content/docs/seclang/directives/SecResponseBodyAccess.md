---
title: SecResponseBodyAccess
description: Configures whether response bodies are to be buffered.
syntax: SecResponseBodyAccess On|Off
default: Off This directive is required if you plan to inspect HTML responses and implement response blocking. Possible values are:buffer response bodies (but only if the response MIME type matches the list configured with SecResponseBodyMimeType).do not buffer response bodies.
date: 
lastmod: "2023-01-30T13:00:45+01:00"
draft: false
images: []
weight: 100
toc: true
type: seclang/directives
---


