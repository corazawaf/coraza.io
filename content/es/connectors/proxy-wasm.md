---
title : "Proxy-Wasm (Envoy/Istio)"
description: "Coraza WAF como filtro proxy-wasm para Envoy e Istio."
lead: "Despliega Coraza WAF como un filtro proxy-wasm para Envoy, Istio y otros proxies compatibles con proxy-wasm."
date: 2024-01-01T00:00:00+00:00
lastmod: 2024-01-01T00:00:00+00:00
draft: false
images: []
repo: https://github.com/corazawaf/coraza-proxy-wasm
official: true
compatibility: [v3.x]
author: Coraza Contributors
logo: /images/connectors/envoy.svg
---

## Descripcion general

[coraza-proxy-wasm](https://github.com/corazawaf/coraza-proxy-wasm) es un filtro proxy-wasm que ejecuta Coraza WAF dentro de Envoy, Istio y otros proxies compatibles con proxy-wasm. Utiliza la ABI de proxy-wasm para integrarse con el proxy anfitrion.

## Características

- Se ejecuta como un filtro Wasm dentro del proxy
- Compatible con el OWASP Core Rule Set
- Soporta inspeccion del cuerpo de solicitudes y respuestas
- Funciona con Envoy, Istio y otros hosts proxy-wasm

## Instalacion con Envoy

Descarga la última versión desde [GitHub Releases](https://github.com/corazawaf/coraza-proxy-wasm/releases) y configura Envoy para cargar el filtro Wasm:

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

## Instalacion con Istio

Para Istio, despliega el filtro Wasm usando un recurso `WasmPlugin`. Consulta la [documentación de coraza-proxy-wasm](https://github.com/corazawaf/coraza-proxy-wasm) para instrucciones detalladas de integración con Istio.
