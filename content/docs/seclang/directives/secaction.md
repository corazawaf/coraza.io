---
title: "SecAction"
description: "Unconditionally processes the action list it receives as the first and only parameter."
syntax: "SecAction "action1,action2,action3,...""
default: ""
date: ""
lastmod: "2023-01-26T20:49:29+01:00"
draft: false
images: []
weight: 100
toc: true
type: seclang/directives
---

This directive is commonly used to set variables and initialize persistent collections using the initcol action.
The syntax of the parameter is identical to that of the third parameter of SecRule. For example:

Example:
```
SecAction "nolog,phase:1,initcol:RESOURCE=%{REQUEST_FILENAME}"
```

