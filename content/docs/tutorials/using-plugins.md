---
title: "Using Plugins"
description: "Plugins can extend most Coraza functionalities like operators, actions, transformations, body processors, and audit logging."
lead: "Plugins can extend most Coraza functionalities like operators, actions, transformations, body processors, and audit logging."
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

## Overview

Plugins are imported by calling the respective registration functions from the `github.com/corazawaf/coraza/v3/experimental/plugins` package:

- `plugins.RegisterOperator(...)`
- `plugins.RegisterAction(...)`
- `plugins.RegisterBodyProcessor(...)`
- `plugins.RegisterTransformation(...)`

Most plugins register themselves automatically via Go's `init()` function. You just need to import them with a blank identifier:

```go
package main

import (
    "github.com/corazawaf/coraza/v3"
    _ "github.com/someorg/my-awesome-plugin"
)
```

## Available Official Plugins

### coraza-geoip

Adds MaxMind GeoIP2 database support to Coraza, enabling geo-based rules.

```go
import _ "github.com/corazawaf/coraza-geoip"
```

Repository: [github.com/corazawaf/coraza-geoip](https://github.com/corazawaf/coraza-geoip)

### coraza-coreruleset

Embeds the OWASP Core Rule Set for use with Coraza without manual file management.

```go
import "github.com/corazawaf/coraza-coreruleset"
```

Repository: [github.com/corazawaf/coraza-coreruleset](https://github.com/corazawaf/coraza-coreruleset)

See the [Core Ruleset tutorial]({{< relref "coreruleset" >}}) for usage details.
