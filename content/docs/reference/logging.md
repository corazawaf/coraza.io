---
title: "Logging"
description: "..."
lead: "..."
date: 2020-10-06T08:48:57+00:00
lastmod: 2020-10-06T08:48:57+00:00
draft: false
images: []
menu:
  docs:
    parent: "reference"
weight: 100
toc: true
---

## Logging Formats

### JSON

This is the core structure data structure used to build any other format:

```json
{
  "transaction": {
    "timestamp": "02/Jan/2006:15:04:20 -0700",
    "unix_timestamp": 1629575755,
    "id": "ABCDEFGHIJKMNLAB",
    "client_ip": "127.0.0.1",
    "client_port": 54481,
    "host_ip": "127.0.0.1",
    "host_port": 80,
    "server_id": "something",
    "request": {
      "method": "POST",
      "uri": "/something.php",
      "http_version": "1.1",
      "body": "some-body=with-values",
      "headers": {
        "Content-Type": ["application/x-www-form-urlencoded"],
        "Accept": ["text/html"]
      },
      "files": [{
        "name": "filename.pdf",
        "size": 1024,
        "mime": "application/pdf"
      }]
    },
    "response": {
      "status": 200,
      "headers": {
        "Set-Cookie": ["somecookie=forever; Secure", "someothercookie=wow"],
        "Content-Type": ["text/html"]
      }
    },
    "producer": {
      "connector": "github.com/jptosso/coraza-caddy",
      "version": "1.0",
      "server": "Caddy 2",
      "rule_engine": "CORERULESET/3.3",
      "stopwatch": "1417762077443733 384389; combined=20536, p1=354, p2=2901, p3=11, p4=16692, p5=578, sr=72, sw=0, l=0, gc=0"
    }
  },
  "messages": [{
    "actionset": "Warning",
    "message": "Pattern match \"\\\\< ?script\\\\b\" at ARGS_NAMES:<script.",
    "data": {
	    "file": "/etc/coraza/crs/rules.conf",
	    "line": 4485,
	    "id": 100521,
	    "rev": "1",
	    "msg": "some message",
	    "data": "some logdata",
	    "severity": 5,
	    "ver": "OWASP_CRS\/3",
	    "maturity": 10,
	    "accuracy": 10,
	    "tags": ["some-tag", "more-tags"]
    }
  }]
}
```