---
title: SecRequestBodyNoFilesLimit
description: Configures the maximum request body size Coraza will accept for buffering, excluding the size of any files being transported in the request. This directive is useful to reduce susceptibility to DoS attacks when someone is sending request bodies of very large sizes. Web applications that require file uploads must configure SecRequestBodyLimit to a high value, but because large files are streamed to disk, file uploads will not increase memory consumption. However, it’s still possible for someone to take advantage of a large request body limit and send non-upload requests with large body sizes. This directive eliminates that loophole.
syntax: SecRequestBodyNoFilesLimit 131072
default: 1048576 (1 MB)
date: 
lastmod: "2023-01-30T13:00:45+01:00"
draft: false
images: []
weight: 100
toc: true
type: seclang/directives
---

Generally speaking, the default value is not small enough. For most applications, you
should be able to reduce it down to 128 KB or lower. Anything over the limit will be
rejected with status code 413 (Request Entity Too Large). There is a hard limit of 1 GB.

