---
title: "SecAction"
description: "Unconditionally processes the action list it receives as the first and only parameter. The syntax of the parameter is identical to that of the third parameter of SecRule."
syntax: SecAction "action1,action2,action3,…
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

This directive is commonly used to set variables and initialize persistent collections using the initcol action. For example:

```
SecAction nolog,phase:1,initcol:RESOURCE=%{REQUEST_FILENAME}
```
