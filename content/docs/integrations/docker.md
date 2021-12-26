---
title: "Docker"
description: "One page summary of how to start a new Doks project."
lead: "One page summary of how to start a new Doks project."
date: 2020-11-16T13:59:39+01:00
lastmod: 2020-11-16T13:59:39+01:00
draft: false
images: []
menu:
  docs:
    parent: "integrations"
weight: 110
toc: true
---

By default each image is powered by Caddy, future versions may use different implementations like ```jptosso/coraza-waf@1.0.0-caddy``` or ```jptosso/coraza-waf@1.0.0-traefik```.

## Hosting some simple static server

```
$ docker run --name my-waf -p 8080:8080 -v /path/to/config:/coraza:ro -d jptosso/coraza-caddy
```

Alternatively, a simple Dockerfile can be used to generate a new image that includes the necessary content (which is a much cleaner solution than the bind mount above):

```
FROM jptosso/coraza-caddy
COPY static-settings-directory /coraza
```

Place this file in the same directory as your directory of content ("static-settings-directory"), ``run docker build -t my-waf .``, then start your container:

```
$ docker run --name my-waf -d some-waf-server
```

``static-settings-directory`` must contain a Caddyfile, see (Caddyfile documentation)[#]

## Exposing external port

```
$ docker run --name my-waf -d -p 9090:9090 some-waf-server
```

Then you can hit http://localhost:9090 or http://host-ip:9090 in your browser.
