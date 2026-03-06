---
title : "Apache APISIX"
description: "Coraza WAF integration for Apache APISIX."
lead: "Use Coraza WAF with Apache APISIX via the proxy-wasm integration."
date: 2024-01-01T00:00:00+00:00
lastmod: 2024-01-01T00:00:00+00:00
draft: false
images: []
repo: https://github.com/corazawaf/coraza-proxy-wasm
official: true
compatibility: [v3.x]
menu:
  connectors:
    parent: "connectors"
---

## Overview

[Apache APISIX](https://apisix.apache.org/) supports Coraza WAF through its proxy-wasm integration. APISIX can load the [coraza-proxy-wasm](https://github.com/corazawaf/coraza-proxy-wasm) filter to provide web application firewall capabilities.

## Getting Started

See the [Apache APISIX blog post on Coraza integration](https://apisix.apache.org/blog/2023/09/08/APISIX-integrates-with-Coraza/) for setup instructions.

For the proxy-wasm filter configuration, see the [Proxy-Wasm connector documentation](/connectors/proxy-wasm/).
