---
title : "HAProxy Coraza SPOA"
description: "Coraza HAPoxy SPOE agent."
lead: ""
date: 2022-05-26T00:00:00+00:00
lastmod: 2022-05-26T00:00:00+00:00
draft: false
images: []
menu:
  connectors:
    parent: "connectors"
compatibility: []
repo: https://github.com/corazawaf/coraza-spoa
weight: 100
---

## Overview

[Coraza SPOA](https://github.com/corazawaf/coraza-spoa) runs the Coraza Web
Application Firewall (WAF) as a backing service for HAProxy. It already embeds
the [Coraza Engine](https://github.com/corazawaf/coraza) and processes requests
for HAProxy.

There are multiple components involved in the request processing, so here are
some terms you should know:

HAProxy includes a Stream Processing Offload Engine (SPOE) to offload request
processing to a Stream Processing Offload Agent (SPOA). Data is exchanged
between the HAProxy filter and the agent via a binary protocol over TCP called
the Stream Processing Offload Procotol (SPOP).

HAProxy forwards incoming HTTP Requests and the Responses to the agent (SPOA)
for WAF processing, a message is returned by the agent with the result of the
scan.

The following diagram shows a HTTP Request & Response flow:
<br/>
<br/>
![HAPROXY-CORAZA-FLOW](/images/connectors/coraza_spoa_flow.jpg)
<br/>
<br/>

## Building the Agent

If you wish to complile Coraza SPOA from source, you'll first need Go installed
on your machine. Go version 1.16+ is required. Additionally you will need to
install: `pkg-config make gcc`.

Clone the coraza-spoa repository:

```sh
git clone https://github.com/corazawaf/coraza-spoa.git
```

To compile a development version of coraza-spoa, run `go run mage.go build`.
This will download all dependencies and compile a `coraza-spoa` binary.

## Configuration Overview

Since the configuration is split-up in a couple of files, here is a quick rundown:

- /etc/haproxy/haproxy.cfg - HAProxy Main Configuration
- /etc/haproxy/coraza.cfg  - HAProxy SPOE Configuration
- /etc/coraza-spoa/config.yml - Coraza SPOA Main Configuration
- /etc/coraza-spoa/coraza.conf - Coraza Engine Configuration

To perform the configuration:

Start by adding a filter statement to an HAProxy frontend, which turns on
stream processing. The filter links to a separate SPOE configuration file, in
which you configure how HAProxy SPOE communicates with the Coraza SPOA
agent.

Coraza SPOA main configuration file is in `/etc/coraza-spoa/config.yml`.

The following diagram shows how all of the configuration files are linked and
which component they configure.
<br/>
<br/>
![Haproxy-Coraza-Configuration-Files](/images/connectors/coraza_spoa_config.jpg)
<br/>
<br/>

## HAProxy Configuration

Below is a example haproxy.cfg configuration:

```conf
global
    log stdout format raw local0

defaults
    log global
    option httplog

frontend test
    mode http
    bind *:80
    log-format "%ci:%cp\ [%t]\ %ft\ %b/%s\ %Th/%Ti/%TR/%Tq/%Tw/%Tc/%Tr/%Tt\ %ST\ %B\ %CC\ %CS\ %tsc\ %ac/%fc/%bc/%sc/%rc\ %sq/%bq\ %hr\ %hs\ %{+Q}r\ %[var(txn.coraza.id)]\ spoa-error:\ %[var(txn.coraza.error)]\ waf-hit:\ %[var(txn.coraza.status)]"

    # Emulate Apache behavior by only allowing http 1.0, 1.1, 2.0
    http-request deny deny_status 400 if !HTTP
    http-request deny deny_status 400 if !HTTP_1.0 !HTTP_1.1 !HTTP_2.0

    # Set coraza app in HAProxy config to allow customized configs per host.
    # You can also just leave this as is or even replace the use of a variable
    # inside the coraza.cfg.
    http-request set-var(txn.coraza.app) str(sample_app)

    # !! Every http-request line will be executed before this !!
    # Execute coraza request check.
    filter spoe engine coraza config /etc/haproxy/coraza.cfg
    http-request send-spoe-group coraza coraza-req

    # Currently haproxy cannot use variables to set the code or deny_status, so this needs to be manually configured here
    http-request redirect code 302 location %[var(txn.coraza.data)] if { var(txn.coraza.action) -m str redirect }
    http-response redirect code 302 location %[var(txn.coraza.data)] if { var(txn.coraza.action) -m str redirect }

    http-request deny deny_status 403 hdr waf-block "request"  if { var(txn.coraza.action) -m str deny }
    http-response deny deny_status 403 hdr waf-block "response" if { var(txn.coraza.action) -m str deny }

    http-request silent-drop if { var(txn.coraza.action) -m str drop }
    http-response silent-drop if { var(txn.coraza.action) -m str drop }

    # Deny in case of an error, when processing with the Coraza SPOA
    http-request deny deny_status 500 if { var(txn.coraza.error) -m int gt 0 }
    http-response deny deny_status 500 if { var(txn.coraza.error) -m int gt 0 }

    use_backend test_backend

backend test_backend
    mode http
    http-request return status 200 content-type "text/plain" string "Welcome!\n"

backend coraza-spoa
    option spop-check
    mode tcp
    server s1 127.0.0.1:9000 check
```

The HAProxy SPOE gets activated by the `filter` statement in `frontent test`.

Configuration of the SPOE behavior is then defined in `coraza.cfg`. This
includes messages to exchange, which backend HAProxy should use internally to
exchange messages with the SPOA, and some other details.

After a HTTP Request or Response has been scanned by the Coraza Engine, it will
inform HAProxy by setting the `txn.coraza.fail` variable. For scored requests
the variable is set to `1` and the request should get blocked, clean requests
should pass if `txn.coraza.fail` is set to a value of `0`.

Blocking a HTTP Request or Response is handled in the HAProxy `frontend test`
configuration via the `http-request deny` and `http-response deny`
statements.

Additionally in case the Coraza SPOA failed processing the request, it will get
blocked with a `deny_status 500`. By default HAProxy would just disable the
`filter` if Coraza takes too long to process the request.

## HAProxy SPOE Configuration

The HAProxy SPOE is configured in the `/etc/haproxy/coraza.cfg`:

```conf
# https://github.com/haproxy/haproxy/blob/master/doc/SPOE.txt
# /usr/local/etc/haproxy/coraza.cfg
[coraza]
spoe-agent coraza-agent
    # Process HTTP requests only (the responses are not evaluated)
    messages    coraza-req
    # Comment the previous line and add coraza-res, to process responses also.
    #messages   coraza-req     coraza-res
    groups      coraza-req      coraza-res
    option      var-prefix      coraza
    option      set-on-error    error
    timeout     hello           2s
    timeout     idle            2m
    timeout     processing      500ms
    use-backend coraza-spoa
    log         global

spoe-message coraza-req
    # Arguments are required to be in this order
    args app=var(txn.coraza.app) src-ip=src src-port=src_port dst-ip=dst dst-port=dst_port method=method path=path query=query version=req.ver headers=req.hdrs body=req.body
    event on-frontend-http-request

spoe-message coraza-res
    # Arguments are required to be in this order
    args app=var(txn.coraza.app) id=var(txn.coraza.id) version=res.ver status=status headers=res.hdrs body=res.body
    event on-http-response

spoe-group coraza-req
    messages coraza-req

spoe-group coraza-res
    messages coraza-res

```

It defines processing timeouts and the messages to exchange via the SPOP protocol.

That's it for the HAProxy side, let's configure the `coraza-spoa` service,
which should listen on `127.0.0.1:9000` to exchange the `spoe-message` with
HAProxy.

## Coraza Configuration

Coraza SPOA is configured via the `/etc/coraza-spoa/config.yml`:

```yaml
# The SPOA server bind address
bind: 127.0.0.1:9000

# The log level configuration, one of: debug/info/warn/error/panic/fatal
log_level: info
# The log file path
log_file: /var/log/coraza-spoa/server.log
# The log format, one of: console/json
log_format: console

# Optional default application to use when the app from the request
# does not match any of the declared application names
default_application: sample_app

applications:
  # name is used as key to identify the directives
  - name: sample_app
    # Get the coraza.conf from https://github.com/corazawaf/coraza
    #
    # Download the OWASP CRS from https://github.com/coreruleset/coreruleset/releases
    # and copy crs-setup.conf, the rules & plugins directories to /etc/coraza-spoa
    directives: |
      Include /etc/coraza-spoa/coraza.conf
      Include /etc/coraza-spoa/crs-setup.conf
      SecRuleEngine On
      Include /etc/coraza-spoa/plugins/*-config.conf
      Include /etc/coraza-spoa/plugins/*-before.conf
      Include /etc/coraza-spoa/rules/*.conf
      Include /etc/coraza-spoa/plugins/*-after.conf

    # HAProxy configured to send requests only, that means no cache required
    response_check: false

    # The transaction cache lifetime in milliseconds (60000ms = 60s)
    transaction_ttl_ms: 60000

    # The log level configuration, one of: debug/info/warn/error/panic/fatal
    log_level: info
    # The log file path
    log_file: /var/log/coraza-spoa/coraza-agent.log
    # The log format, one of: console/json
    log_format: console

```

Since Coraza SPOA is only a daemon which exchanges SPOP protocol messages with
HAProxy, the configuration is quite simple.

Coraza SPOA also embeds the [Coraza Engine](https://github.com/corazawaf/coraza) and the
[OWASP Coreruleset](https://coreruleset.org), which are configured by the files
listed in the `include` section:

- [/etc/coraza-spoa/coraza.conf](https://github.com/corazawaf/coraza/blob/v2/master/coraza.conf-recommended) - Coraza Engine Configuration
- [/etc/coraza-spoa/crs-setup.conf](https://github.com/coreruleset/coreruleset/blob/v4.0/dev/crs-setup.conf.example) - Core Ruleset Main
- [/etc/coraza-spoa/rules/*.conf](https://github.com/coreruleset/coreruleset/tree/v4.0/dev/rules) - Core Ruleset Rules
- [/etc/coraza-spoa/plugins/*.conf](https://github.com/coreruleset/coreruleset/tree/v4.0/dev/plugins) - Core Ruleset Plugins

Once the coraza-spoa daemon is running you can begin with the
[Coraza Engine](https://coraza.io/docs/seclang/directives/) and
[Coreruleset configuration](https://coreruleset.org/docs/).

## HELP

If you need help & support you could check the #coraza channel in the OWASP Slack: [https://owasp.org/slack/invite](https://owasp.org/slack/invite)
