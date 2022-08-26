---
title: "SecArgumentSeparator"
description: "Specifies which character to use as the separator for application/x-www-form- urlencoded content."
syntax: "SecArgumentSeparator <separator>"
default: "&"
date: 2020-10-06T08:48:57+00:00
lastmod: 2020-10-06T08:48:57+00:00
draft: false
images: []
weight: 100
toc: true
versions: v1.0+
tinygo: true
type: seclang/directives
---

This directive is needed if a backend web application is using a nonstandard argument separator. Applications are sometimes (very rarely) written to use a semicolon separator. You should not change the default setting unless you establish that the application you are working with requires a different separator. If this directive is not set properly for each web application, then Coraza will not be able to parse the arguments appropriately and the effectiveness of the rule matching will be significantly decreased.

