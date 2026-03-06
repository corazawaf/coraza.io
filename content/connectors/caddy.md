---
title : "Caddy"
description: "Coraza WAF module for the Caddy web server."
lead: "Deploy Coraza WAF as a Caddy module for HTTP and reverse proxy protection."
date: 2020-10-06T08:48:45+00:00
lastmod: 2020-10-06T08:48:45+00:00
draft: false
images: []
repo: https://github.com/corazawaf/coraza-caddy
official: true
compatibility: [v3.x]
menu:
  connectors:
    parent: "connectors"
---

## Overview

[coraza-caddy](https://github.com/corazawaf/coraza-caddy) is a Caddy module that integrates Coraza WAF directly into the Caddy web server. It provides HTTP web application firewall capabilities using Coraza and is compatible with the OWASP Core Rule Set.

## Installation

Build Caddy with the Coraza module using [xcaddy](https://github.com/caddyserver/xcaddy):

```sh
xcaddy build --with github.com/corazawaf/coraza-caddy/v2
```

## Caddyfile Configuration

```caddyfile
{
    order coraza_waf first
}

:8080 {
    coraza_waf {
        directives `
            SecRuleEngine On
            SecRequestBodyAccess On
            SecResponseBodyAccess On
            SecResponseBodyMimeType application/json
            Include @coraza.conf-recommended
            Include @crs-setup.conf.example
            Include @owasp_crs/*.conf
            SecRule REMOTE_ADDR "@ipMatch 127.0.0.1" "id:1,phase:1,deny,status:403"
        `
    }
    reverse_proxy localhost:8081
}
```

## Directives

The `coraza_waf` directive accepts the following subdirectives:

- **directives** - Inline SecLang directives
- **include** - Include directives from a file
- **load_owasp_crs** - Automatically load the embedded OWASP Core Rule Set

For full documentation, see the [coraza-caddy repository](https://github.com/corazawaf/coraza-caddy).
