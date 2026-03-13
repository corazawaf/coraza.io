---
title : "Traefik"
description: "Coraza WAF integration for Traefik via http-wasm."
lead: "Deploy Coraza WAF with Traefik using http-wasm middleware."
date: 2024-01-01T00:00:00+00:00
lastmod: 2024-01-01T00:00:00+00:00
draft: false
images: []
repo: https://github.com/jcchavezs/coraza-http-wasm-traefik
official: false
compatibility: [v3.x]
author: jcchavezs
logo: /images/connectors/traefik.svg
---

**DISCLAIMER: This project is still in early stages and it can be used to get a grasp on the Coraza + Traefik integration over Wasm. If you are looking for production grade performance I recommend you look into [Coraza native integration with Traefik](https://traefik.io/press/traefik-labs-accelerates-path-towards-api-runtime-governance)**

This repository publishes the coraza-http-wasm as a plugin and also contains examples on how to run coraza-http-wasm as a traefik plugin.

The wasm executable is built in the [coraza-http-wasm](https://github.com/jcchavezs/coraza-http-wasm/tree/main) repository.

## Getting started

You can run the docker compose example:

```console
docker compose up traefik
```

and do test calls:

- `curl -I 'http://localhost:8080/admin'` will return a 403 as per the configuration rules.
- `curl -I 'http://localhost:8080/anything'` will return a 200 as there is not matching rule.

To try out other kind of rules, you can locally modify the `config-dynamic.yaml` file in the section middlewares:

```yaml
http:
# ...
  middlewares:
    waf:
      plugin:
        coraza:
          directives:
            - SecRuleEngine On
            - SecDebugLog /dev/stdout
            - SecDebugLogLevel 9
            - SecRule REQUEST_URI "@streq /admin" "id:101,phase:1,log,deny,status:403"
```

For more information about the available directives go to [coraza docs](https://coraza.io/docs).
