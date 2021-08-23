---
title: "OWASP Core Ruleset"
description: "Caddy server is a high performance web server and reverse proxy."
lead: "Caddy server is a high performance web server and reverse proxy."
date: 2020-10-13T15:21:01+02:00
lastmod: 2020-10-13T15:21:01+02:00
draft: false
images: []
menu:
  docs:
    parent: "tutorials"
weight: 130
toc: true
---

**Important:** OWASP Core Ruleset requires libinjection and libpcre, hence ```CGO_ENABLED=1```.

## Installation

## Configuration

## Important considerations

Coraza WAF on based in ModSecurity but is taking a different way, we are working hard with the Core Ruleset project to keep compatibility simple but there are some tweaks that has to be made in order to use CRS.

## Compatibility issues

Coraza WAF implementations are different from Nginx and Apache. Some rules are designed to fix issues releated to the web server and might not be compatible with Coraza. That doesn´t mean you are not protected, it just means you are not vulnerable. Specific issues related to this integration are going to be posted here.


## What is not working

* DDOS protection

## Auto CRS with Docker