---
title: "OWASP Core Ruleset"
description: "OWASP Core Ruleset is the most robust open source WAF rule set available on the internet, compatible with Coraza."
lead: "OWASP Core Ruleset is the most robust open source WAF rule set available on the internet, compatible with Coraza."
date: 2020-10-13T15:21:01+02:00
lastmod: 2020-10-13T15:21:01+02:00
draft: false
images: []
menu:
  docs:
    parent: "tutorials"
weight: 130
toc: true
---

## Using coraza-coreruleset (Recommended)

The easiest way to use CRS with Coraza is via the [coraza-coreruleset](https://github.com/corazawaf/coraza-coreruleset) Go package, which embeds the Core Rule Set and the recommended Coraza configuration so you don't need to manage files manually.

```go
package main

import (
    "github.com/corazawaf/coraza/v3"
    "github.com/corazawaf/coraza-coreruleset"
)

func main() {
    waf, err := coraza.NewWAF(
        coraza.NewWAFConfig().
            WithRootFS(coreruleset.FS).
            WithDirectivesFromFile("@coraza.conf-recommended").
            WithDirectivesFromFile("@crs-setup.conf.example").
            WithDirectivesFromFile("@owasp_crs/*.conf"),
    )
    if err != nil {
        panic(err)
    }
    // Use waf...
    _ = waf
}
```

## Manual Installation

If you prefer to manage CRS files manually:

```sh
wget https://raw.githubusercontent.com/corazawaf/coraza/main/coraza.conf-recommended -O coraza.conf
git clone https://github.com/coreruleset/coreruleset
```

Then load the files in order:

1. coraza.conf
2. coreruleset/crs-setup.conf.example
3. coreruleset/rules/*.conf

```go
func initCoraza() {
    cfg := coraza.NewWAFConfig().
        WithDirectivesFromFile("coraza.conf").
        WithDirectivesFromFile("coreruleset/crs-setup.conf.example").
        WithDirectivesFromFile("coreruleset/rules/*.conf")
    waf, err := coraza.NewWAF(cfg)
    if err != nil {
        panic(err)
    }
    _ = waf
}
```

## Configuration

Please check [https://coreruleset.org/docs/deployment/install/](https://coreruleset.org/docs/deployment/install/) for configuration examples.
