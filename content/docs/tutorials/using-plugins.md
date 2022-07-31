---
title: "Using Plugins"
description: "Plugins can extend most Coraza functionalities like, audit logging, geo ip, operators, actions, transformations and body processors."
lead: "Plugins can extend most Coraza functionalities like, audit logging, geo ip, operators, actions, transformations and body processors."
date: 2021-09-05T14:03:58-03:00
lastmod: 2021-09-05T14:03:58-03:00
draft: false
images: []
menu: 
  docs:
    parent: "tutorials"
weight: 999
toc: true
---

Plugins must be included in your project's main package, for example:

```go
package main

include(
  "github.com/corazawaf/coraza/v2"
  _ "github.com/jptosso/coraza-libinjection"
)
```

The previous code will automatically add the @detectXSS and @detectSQLi operators. (Please note this plugin requires libinjection)