---
title : "Traefik"
description: "Integracion de Coraza WAF para Traefik mediante http-wasm."
lead: "Despliega Coraza WAF con Traefik usando middleware http-wasm."
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

## Descripcion general

Coraza puede integrarse con [Traefik](https://traefik.io/) usando el middleware http-wasm. El proyecto [coraza-http-wasm-traefik](https://github.com/jcchavezs/coraza-http-wasm-traefik) proporciona un ejemplo de cómo ejecutar Coraza WAF como middleware de Traefik mediante http-wasm.

## Como funciona

Traefik soporta módulos guest http-wasm como middleware. Coraza se compila a un módulo Wasm y es cargado por Traefik en tiempo de ejecución, proporcionando capacidades de WAF para todas las solicitudes entrantes.

## Primeros pasos

Consulta el [repositorio de coraza-http-wasm-traefik](https://github.com/jcchavezs/coraza-http-wasm-traefik) para instrucciones de configuración y ejemplos.
