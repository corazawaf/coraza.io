---
title: "haproxy"
description: "Protect your applications using the official Coraza SPOA for haproxy"
lead: "Protect your applications using the official Coraza SPOA for haproxy."
date: 2021-09-05T14:03:09-03:00
lastmod: 2021-09-05T14:03:09-03:00
draft: false
images: []
menu: 
  docs:
    parent: "integrations"
weight: 999
toc: true
---

**WORK IN PROGRESS, APIs and configurations might change** 

HAProxy supports a custom offloading engine called [SPOE](https://www.haproxy.org/download/1.7/doc/SPOE.txt) and it can be used to redirect requests and responses to Coraza and generate disruptive actions.

## Installing the Coraza Agent for SPOE

### Method 1: go install

```
go install github.com/jptosso/coraza-server/cmd/coraza-server@master
wget https://github.com/jptosso/coraza-server/blob/master/config.sample.yml -o config.yml
```

### Method 2: Docker

```
docker run -p 9000:9000 jptosso/coraza-server
```

You might replace the config yml with ```-v ./path/to/localconfig.yml:/coraza/config.yml```

## Creating a WAF instance

Each waf instance must be created using different ports, currently, only the following configuration fields are available:

config.yml:
```yaml
log_level: debug
agents:
  -
    transactions_active_limit: 100000
    bind: 0.0.0.0:9000
    protocol: spoa
    include:
      - ./docs/samplerules.conf
  -
    transactions_active_limit: 100000
    bind: 0.0.0.0:9001
    protocol: spoa
    include:
      - ./docs/samplerules2.conf      
```

Now you may starte the Coraza Server using the following command:

```sh
coraza-server -f config.yml
```

## Add the Coraza Agent to HAProxy

First of all, we are going to create a file named coraza.cfg, that will contain the instructions for the SPOE:

```apache
[coraza-waf]
spoe-agent coraza-agent
    messages coraza-req coraza-res
    option var-prefix coraza
    timeout hello 2s
    timeout idle  2m
    timeout processing 10ms
    use-backend coraza-servers
    log global
    
spoe-message coraza-req
    args unique-id src method path query req.ver req.hdrs req.body_size req.body
    event on-frontend-http-request

spoe-message coraza-res
    args unique-id status res.ver res.hdrs res.body_size res.body
    event on-http-response	 
```

Note ```use-backend coraza-servers``` must point to a valid backend created in the haproxy main configuration file.

Main haproxy configurations:

```
global
    log stdout format raw local0
defaults
    timeout connect 5s
    timeout client 1m
    timeout server 1m
    log global
    
frontend testsite.com
    unique-id-format %[uuid()]
    bind 0.0.0.0:80
    mode http
    filter spoe engine coraza-waf config coraza.cfg
    http-request deny if { var(txn.coraza.fail) -m int eq 1 }
    http-response deny if { var(txn.coraza.fail) -m int eq 1 }
    use_backend test_backend


backend test_backend
    mode http
    server s1 coraza.io
    server s2 coraza.io

backend coraza-servers
    mode tcp
    server coraza-spoa1 127.0.0.1:9000
```

```apache
backend coraza-servers
    mode tcp
    server coraza-spoa1 127.0.0.1:9000
```

This will define the Coraza Agent servers, you must use as many as you want.

```apache
    filter spoe engine coraza-waf config coraza.cfg
    http-request deny if { var(txn.coraza.fail) -m int eq 1 }
    http-response deny if { var(txn.coraza.fail) -m int eq 1 }
```
This  will include the coraza.cfg, deny the request if phase 1 or 2 are disrupted and deny the response if phases 3 or 4 are disrupted.