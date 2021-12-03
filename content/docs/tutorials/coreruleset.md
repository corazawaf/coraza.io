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

**Important:** OWASP Core Ruleset requires [coraza-libinjection](https://github.com/jptosso/coraza-libinjection) and [coraza-pcre](https://github.com/jptosso/coraza-pcre) plugins to work. There is an upcoming fork that removes the need for the plugins by removing a few features and rewriting some @rx operators to RE2 instead of PCRE.

## Installation

Core Ruleset can be normally installed by importing each required file in the following order:

```sh
wget https://raw.githubusercontent.com/jptosso/coraza-waf/v2/master/coraza.conf-recommended -o coraza.conf
git clone https://github.com/coreruleset/coreruleset
```

1. coraza.conf
2. coreruleset/crs-setup.conf.example
3. coreruleset/rules/*.conf

For example:

```go
func initCoraza(){
  waf := coraza.NewWaf()
  parser, _ := seclang.NewParser(waf)
  files := []string{
    "coraza.conf",
    "coreruleset/crs-setup.conf.example",
    "coreruleset/rules/*.conf",
  }
  for _, f := range files {
    if err := parser.FromFile(f); err != nil {
      panic(err)
    }
  }
}
```


## Configuration

Please check [https://coreruleset.org/installation/](https://coreruleset.org/installation/) for configuration examples.