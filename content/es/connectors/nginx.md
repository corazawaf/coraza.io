---
title : "NGINX"
description: "Módulo de Coraza WAF para NGINX."
lead: "Ejecuta Coraza WAF como un módulo dinámico de NGINX usando libcoraza."
date: 2024-01-01T00:00:00+00:00
lastmod: 2024-01-01T00:00:00+00:00
draft: false
images: []
repo: https://github.com/corazawaf/coraza-nginx
official: true
compatibility: [v3.x]
author: Coraza Contributors
logo: /images/connectors/nginx.svg
---

## Descripcion general

[coraza-nginx](https://github.com/corazawaf/coraza-nginx) integra Coraza WAF con NGINX como un módulo dinámico. Utiliza [libcoraza](https://github.com/corazawaf/libcoraza), el binding en C para Coraza, para proporcionar capacidades de WAF dentro de NGINX.

## Estado

Este conector es actualmente **experimental**. Para despliegues de Coraza en producción con NGINX, considera usar el [conector proxy-wasm](/es/connectors/proxy-wasm/) con una configuración basada en Envoy.

## Instalacion

Consulta el [repositorio de coraza-nginx](https://github.com/corazawaf/coraza-nginx) para instrucciones de compilación e instalación.
