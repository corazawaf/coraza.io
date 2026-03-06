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
menu:
  connectors:
    parent: "connectors"
---

## Overview

Coraza can be integrated with [Traefik](https://traefik.io/) using the http-wasm middleware. The [coraza-http-wasm-traefik](https://github.com/jcchavezs/coraza-http-wasm-traefik) project provides an example of running Coraza WAF as a Traefik middleware via http-wasm.

## How It Works

Traefik supports http-wasm guest modules as middleware. Coraza is compiled to a Wasm module and loaded by Traefik at runtime, providing WAF capabilities for all incoming requests.

## Getting Started

See the [coraza-http-wasm-traefik repository](https://github.com/jcchavezs/coraza-http-wasm-traefik) for setup instructions and configuration examples.
