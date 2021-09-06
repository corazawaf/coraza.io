---
title: "Introducing Coraza v1"
description: ""
lead: ""
date: 2021-09-03T18:49:54-04:00
lastmod: 2021-09-03T18:49:54-04:00
draft: true
weight: 50
images: ["say-hello-to-doks.jpg"]
contributors: []
---

# Coraza WAF, a working modsecurity alternative

During my sysadmin days I always tried to encourage companies to adopt open source software, teaching them to load balance with Nginx instead of purchasing an expensive load balancer and eventually replacing their Web Application Firewall with Modsecurity.

Since these days, the internet has been driven to another path, monolitic applications had evolved into microservices, baremetal servers had evolved into cloud containers and we may keep going the whole day.

Modsecurity and Coreruleset were like the hammer and the nail, they weren't useful without each other, but there is a problem, Coreruleset has evolved so much and Modsecurity haven't been able to keep up with their needs of enhancements and new features in order to keep making better and more efficient rules.

I noticed that problem a few years ago and I thought about the main features required for a Modsecurity port:

* The programming language should be compiled and superfast
* It must fully support OWASP CRS
* It must be easy to extend
* It must be compatible with enterprise-grade web servers like nginx

The best alternative to meet those requirements was to use Golang, it's a super efficient and easy to learn programming language and it has CGO, which provides interfaces to connect golang with C programs like [Libinjection](https://github.com/libinjection/libinjection) (Provides SQL injection and XSS detection features) and **PCRE** (Provides support for the regular expressions used by Modsecurity and CRS), and also allows us to export GO functions to C.

Exporting this implementation to C was quite a challenge and in the way I found [Caddy Server](https://caddyserver.com/), an enterprise-grade, Golang, web server and reverse proxy with interesting additional features like automatic TLS

## Coraza WAF now

Coraza WAF is currently production ready, it's been tested against millions of attacks


## Current challenges

**Finding contributors and testers:**

**Removing CGO:**

**Ingress Controller:**

**Benchmarking:** 

## Some links

* [Coraza WAF]()
* [Coraza Caddy]()
* [Caddy Server]()
* [Wordpress + Coraza WAF + Docker tutorial](https://medium.com/@jptosso/implementing-coraza-waf-with-docker-a55a995f055e)