---
title: "Upgrave to v3 🆕"
description: "This tutorial details the steps requiring to upgrade your Coraza v2 application to Coraza v3."
date: 2020-11-16T13:59:39+01:00
lastmod: 2020-11-16T13:59:39+01:00
draft: false
images: []
menu:
  docs:
    parent: "tutorials"
weight: 1100
toc: true
---

We made a big effort for v3 to keep the API similar to the previous version. But some minor changes are still needed for migrating to the new major release.

This tutorial details the steps requiring to upgrade your Coraza v2 application to Coraza v3.

### Seclang parser

NewParser now panics instead of returning an error, and it doesn't need the _waf_ as parameter.

```go
// old code:
parser, err := seclang.NewParser(waf)
// new code:
parser := seclang.NewParser()
```

### Directives and rules

No changes required.

### Plugins Interfaces

Soon
