---
title : "NGINX"
description: "Coraza WAF module for NGINX."
lead: "Run Coraza WAF as a dynamic NGINX module using libcoraza."
date: 2024-01-01T00:00:00+00:00
lastmod: 2024-01-01T00:00:00+00:00
draft: false
images: []
repo: https://github.com/corazawaf/coraza-nginx
official: true
compatibility: [v3.x]
menu:
  connectors:
    parent: "connectors"
---

## Overview

[coraza-nginx](https://github.com/corazawaf/coraza-nginx) integrates Coraza WAF with NGINX as a dynamic module. It uses [libcoraza](https://github.com/corazawaf/libcoraza), the C binding for Coraza, to provide WAF capabilities within NGINX.

## Status

This connector is currently **experimental**. For production Coraza deployments with NGINX, consider using the [proxy-wasm connector](/connectors/proxy-wasm/) with an Envoy-based setup.

## Installation

See the [coraza-nginx repository](https://github.com/corazawaf/coraza-nginx) for build and installation instructions.
