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

OWASP Core Ruleset is not plug and play technology, there might be some tweaking required in order to make it work, please check the official coreruleset file for more information.

**Important:** OWASP Core Ruleset requires libinjection and libpcre, see [Installing libinjection & libpcre](/docs/tutorials/dependencies/).

## Installation

Core Ruleset can be normally installed by importing each required file in the following order:

1. [Modsecurity sample configuration](https://github.com/SpiderLabs/ModSecurity/blob/v3/master/modsecurity.conf-recommended)
2. [Core Ruleset sample configuration](https://github.com/coreruleset/coreruleset/blob/v3.4/dev/crs-setup.conf.example)
3. [CRS Rule files](https://github.com/coreruleset/coreruleset/tree/v3.4/dev/rules)

For example:

```sh
wget https://raw.githubusercontent.com/SpiderLabs/ModSecurity/v3/master/modsecurity.conf-recommended -o f1.conf
git clone https://github.com/coreruleset/coreruleset
cat f1.conf coreruleset/crs-setup.conf.example coreruleset/rules/*.conf > my-coreruleset-file.conf
```

For Coraza the file modsecurity.conf-recommended must be replaced with the Coraza version: [https://github.com/jptosso/coraza-waf/blob/master/coraza.conf-recommended](https://github.com/jptosso/coraza-waf/blob/master/coraza.conf-recommended)

**Important:** For most configurations, the .data files provided by coreruleset/rules/ must be in the same path as the included configurations file, for example, if you import your rules from ```/etc/coraza/rules/*.conf```, your data files must be under ```/etc/coraza/rules/*.data```.


## Configuration

Please check [https://coreruleset.org/installation/](https://coreruleset.org/installation/) for configuration examples.

## Important considerations

Coraza WAF on based in ModSecurity but is taking a different way, we are working hard with the Core Ruleset project to keep compatibility simple but there are some tweaks that has to be made in order to use CRS.

## Compatibility issues

Coraza WAF implementations are different from Nginx and Apache. Some rules are designed to fix issues releated to the web server and might not be compatible with Coraza. That doesn't mean you are not protected, it just means you are not vulnerable. Specific issues related to this integration are going to be posted here.


## What is not working

* DDOS protection
