---
title: "Use Cases"
description: "One library, unlimited use cases, use Coraza on every project!"
lead: "Discover some use cases ready to be integrated within your projects."
date: 2020-11-16T13:59:39+01:00
lastmod: 2020-11-16T13:59:39+01:00
draft: false
images: []
menu:
  docs:
    parent: "integrations"
weight: 10
toc: true
---

## Reverse Proxy

Coraza can be used as a reverse proxy to intercept requests to audit and deny attacks.

**Current Reverse Proxy Implementations:**

* Caddy
* Yaegi (Comming soon)

## Application Server

FastCGI is a binary protocol for interfacing interactive programs with a web server.

**Languages supporting FastCGI API:** Ada, Delphi, Lazarus Free Pascal, C, C++, Chicken Scheme, Common Lisp, D, Eiffel, Erlang, GnuCOBOL, Go, Guile Scheme, Haskell, VSI BASIC for OpenVMS, Java, Lua, node.js, OCaml, Perl, PHP (via php-fpm, or HipHop for PHP), Python, Ruby, Rust, SmallEiffel, Smalltalk: FasTalk and Dolphin Smalltalk, Tcl, WebDNA, Vala (via C bindings), Xojo

**Implementations supporting FastCGI:**

* Caddy

## Containers and K8s

Deploy within containers environments and integrate Coraza with your microservices.

* [Caddy](/docs/integrations/caddy): Docker (Kubernetes is comming soon)
* Traefik: Kubernetes and Docker (soon) 

## Embedded within golang projects

Use Coraza as a library or one of our plugins for many golang frameworks or the raw net/http stack.

* net/http (golang)
* gin framework
* any other project
