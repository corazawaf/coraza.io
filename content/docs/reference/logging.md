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

## Logging Engines

All loggers are configured using the SecAuditLog directive, you can use as many loggers as you want. You can get or create additional loggers using plugins.

```
# syntax is: SecAuditLog ENGINE [keyvalue options]
SecAuditLog engine_name \
              format=json \
              some_variable=some_value \
              more_setup=with_values
# or simply one line
SecAuditLog engine_name format=json some_variable=some_value
```

**Important:** Keep in mind using many loggers will lock the current routine and slow down your webserver.

### Syslog

Syslog audit logger will write a TCP or UDP syslog packet to the specified host and port. Useful for SIEMs and log collectors.

- **network:** tcp or udp (default: tcp)
- **format:** format from logging formats (default: cef)
- **host:** host:port (default: 127.0.0.1:514)

**Example:**
```modsecurity
SecAuditLog syslog \
    network=udp \
    format=cef \
    host=somehost:514
```

### Concurrent

Concurrent logger creates a directory structured based on the transaction's timestamp and an audit file based on the specified format. It's useful for high concurrency implementations.

- **format:** format from logging formats (default: json)
- **path:** absolute path where directories are going to be created (default: /opt/coraza/var/log/audit/)
- **dirmode:**  octal unix permissions for new audit directories (default: 0600)
- **filemode:** octal unix permissions for new audit files (default: 0600)

**Example:**
```modsecurity
SecAuditLog concurrent \
    format=cef \
    path=/opt/coraza/var/log/audit/ \
    dirmode=0600 \
    filemode=0600
```

### Serial

Serial logger will write one log entry per line.

- **format:** format from logging formats (default: cef)
- **path:** path to the audit log (default: /opt/coraza/var/log/coraza.log)
- **filemode:** if the file does not exist, this octal mode will be used to create it (default: 0600)

**Example:**
```modsecurity
SecAuditLog serial \
    format=cef \
    path=/opt/coraza/var/log/audit.log \
    filemode=0600
```

**Note:** This audit file can be safely rotated, avoid creating giant log files as it will slow down the log writing process.

## Logging Formats

### JSON

This is the core structure data structure used to build any other format, it's defined 

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

### CEF

**Fields available for CEF processing:**

- **id:** Transaction id
- **url:** Request full url
- **method:** Request method
- **clientIp:** Client IP address in string format
- **serverIp:** Server IP address in string format
- **files:** Number of files uploaded
- **host:** Request hostname
- **httpVersion:** HTTP version (1.1, 1.0, 2...)
- **reqbodylen:** Request Body Length in bytes
- **resbodylen:** Response Body Length in bytes
- **requestMime:** Request mime type
- **responseMime:** Response mime type
- **respStatus:** Response status code
- **rules:** List of rules id separated by (,).
- **msgs:** List of messages wrapped within (") and separated by (,).
