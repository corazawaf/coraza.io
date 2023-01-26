---
title: "SecAction"
description: "Unconditionally processes the action list it receives as the first and only parameter."
syntax: "SecAction &#34;action1,action2,action3,... This directive is commonly used to set variables and initialize persistent collections using the initcol action. 	The syntax of the parameter is identical to that of the third parameter of SecRule. For example: ``` SecAction &#34;nolog,phase:1,initcol:RESOURCE=%{REQUEST_FILENAME}&#34; ```"
default: ""
date: ""
lastmod: "2023-01-26T14:57:12&#43;01:00"
draft: false
images: []
weight: 100
toc: true
type: seclang/directives
---


