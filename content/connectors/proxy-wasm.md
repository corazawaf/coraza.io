---
title : "Proxy-Wasm (Envoy/Istio)"
description: "Coraza WAF as a proxy-wasm filter for Envoy and Istio."
lead: "Deploy Coraza WAF as a proxy-wasm filter for Envoy, Istio, and other proxy-wasm compatible proxies."
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

[coraza-proxy-wasm](https://github.com/corazawaf/coraza-proxy-wasm) is a proxy-wasm filter that runs Coraza WAF inside Envoy, Istio, and other proxy-wasm compatible proxies. It uses the proxy-wasm ABI to integrate with the host proxy.

## Features

- Runs as a Wasm filter inside the proxy
- Compatible with OWASP Core Rule Set
- Supports request and response body inspection
- Works with Envoy, Istio, and other proxy-wasm hosts

## Installation with Envoy

Download the latest release from [GitHub Releases](https://github.com/corazawaf/coraza-proxy-wasm/releases) and configure Envoy to load the Wasm filter:

```yaml
static_resources:
  listeners:
    - name: main
      address:
        socket_address:
          address: 0.0.0.0
          port_value: 8080
      filter_chains:
        - filters:
            - name: envoy.filters.network.http_connection_manager
              typed_config:
                "@type": type.googleapis.com/envoy.extensions.filters.network.http_connection_manager.v3.HttpConnectionManager
                http_filters:
                  - name: envoy.filters.http.wasm
                    typed_config:
                      "@type": type.googleapis.com/envoy.extensions.filters.http.wasm.v3.Wasm
                      config:
                        vm_config:
                          runtime: "envoy.wasm.runtime.v8"
                          code:
                            local:
                              filename: "coraza-proxy-wasm.wasm"
                        configuration:
                          "@type": type.googleapis.com/google.protobuf.StringValue
                          value: |
                            {
                              "directives_map": {
                                "default": [
                                  "SecRuleEngine On",
                                  "SecRequestBodyAccess On",
                                  "Include @coraza.conf-recommended",
                                  "Include @crs-setup.conf.example",
                                  "Include @owasp_crs/*.conf"
                                ]
                              },
                              "default_directives": "default"
                            }
                  - name: envoy.filters.http.router
                    typed_config:
                      "@type": type.googleapis.com/envoy.extensions.filters.http.router.v3.Router
```

## Installation with Istio

For Istio, deploy the Wasm filter using a `WasmPlugin` resource. See the [coraza-proxy-wasm documentation](https://github.com/corazawaf/coraza-proxy-wasm) for detailed Istio integration instructions.
