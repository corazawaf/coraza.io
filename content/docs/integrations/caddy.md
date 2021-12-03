---
title: "Caddy Server"
description: "Caddy server is a high performance web server and reverse proxy."
lead: "Caddy server is a high performance web server and reverse proxy."
date: 2020-10-13T15:21:01+02:00
lastmod: 2020-10-13T15:21:01+02:00
draft: false
images: []
menu:
  docs:
    parent: "integrations"
weight: 130
toc: true
---

Caddy with Coraza supports autotls (with let´s encrypt), FastCGI, content rendering and reverse proxy.

## Installing

### Building dependencies

Install golang 1.16 or 1.17.

### Using go install

```sh
go install github.com/jptosso/coraza-caddy/caddy@latest
```

### Downloading pre-compiled version from Caddy

Go to [https://caddyserver.com/download](https://caddyserver.com/download), select your **platform**, select **Coraza-Waf** and select **Download**.

### Using the package installer

**Debian/Ubuntu:**
```sh
```

**Centos/Rhel:**
```sh
```

### Building from source

```sh
git clone https://github.com/jptosso/coraza-caddy
cd coraza-caddy
go get ./...
go build -o caddy caddy/main.go
```

### Building with XCaddy

```sh
go install github.com/caddyserver/xcaddy@latest
xcaddy build --with github.com/jptosso/coraza-caddy@latest
```

## Configuration directives

```caddyfile
{
    # order coraza first is required, otherwise Coraza won't work
    order coraza_waf first
}

:8080 {
	coraza_waf {
    # you can write directives in Caddyfile
		directives `
			SecAction "id:1,pass,log"
			SecRule REQUEST_URI "/test5" "id:2, deny, log, phase:1"
			SecRule REQUEST_URI "/test6" "id:4, deny, log, phase:3"
		`
		# or include some files with wildcards
		include /coraza/crs/*.conf
	}
	respond "test123"
}
```