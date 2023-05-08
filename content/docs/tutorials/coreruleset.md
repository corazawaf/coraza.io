---
title: "OWASP Core Ruleset"
description: "OWASP Core Ruleset is the most robust open source WAF rule set available in the internet, compatible with Coraza"
lead: "OWASP Core Ruleset is the most robust open source WAF rule set available in the internet, compatible with Coraza."
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

## Installation

Core Ruleset can be installed by importing each required file in the following order:

```sh
wget https://raw.githubusercontent.com/corazawaf/coraza/v3/dev/coraza.conf-recommended -O coraza.conf
git clone https://github.com/coreruleset/coreruleset
```

1. coraza.conf
2. coreruleset/crs-setup.conf.example
3. coreruleset/rules/*.conf

For example:

```go
func initCoraza(){
  cfg := coraza.NewWafConfig()
    .WithDirectivesFromFile("coraza.conf")
    .WithDirectivesFromFile("coreruleset/crs-setup.conf.example")
    .WithDirectivesFromFile("coreruleset/rules/*.conf")
  waf, err := coraza.NewWaf(cfg)
  if err != nil {
    panic(err)
  }
}
```

## Configuration

Please check [https://coreruleset.org/installation/](https://coreruleset.org/installation/) for configuration examples.
