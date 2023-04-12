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

Plugins are imported by calling the respective helpers:
- `plugins.RegisterOperator(...)`
- `plugins.RegisterAction(...)`
- `plugins.RegisterBodyProcessor(...)`
- `plugins.RegisterTransformation(...)`

Most plugins will register themselves automatically, but some will require you to call the respective helper.

Self-registering plugins will use init() to call the respective registration helper, and they can be imported like this:

```go
package main

include(
  "github.com/coraza-waf/coraza/3"
  _ "github.com/someorg/my-awesome-plugin
)
```
