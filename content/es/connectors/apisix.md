---
title : "Apache APISIX"
description: "Integracion de Coraza WAF para Apache APISIX."
lead: "Usa Coraza WAF con Apache APISIX mediante la integración proxy-wasm."
date: 2024-01-01T00:00:00+00:00
lastmod: 2024-01-01T00:00:00+00:00
draft: false
images: []
repo: https://github.com/corazawaf/coraza-proxy-wasm
official: true
compatibility: [v3.x]
author: Coraza Contributors
logo: /images/connectors/apisix.svg
---

## Descripcion general

[Apache APISIX](https://apisix.apache.org/) soporta Coraza WAF a traves de su integración proxy-wasm. APISIX puede cargar el filtro [coraza-proxy-wasm](https://github.com/corazawaf/coraza-proxy-wasm) para proporcionar capacidades de firewall de aplicaciones web.

## Primeros pasos

Consulta la [publicación del blog de Apache APISIX sobre la integración con Coraza](https://apisix.apache.org/blog/2023/09/08/APISIX-integrates-with-Coraza/) para instrucciones de configuración.

Para la configuración del filtro proxy-wasm, consulta la [documentación del conector Proxy-Wasm](/es/connectors/proxy-wasm/).
