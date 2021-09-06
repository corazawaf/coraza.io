---
title: "Introduction"
description: "Introduction to Coraza Web Application Firewall. Start protecting your web applications in few steps."
lead: "Welcome to Coraza Web Application Firewall, this project is a Golang port of ModSecurity with the goal to become the first enterprise-grade Open Source Web Application Firewall, flexible and powerful enough to serve as the baseline for many projects."
date: 2020-10-06T08:48:57+00:00
lastmod: 2020-10-06T08:48:57+00:00
draft: false
images: []
menu:
  docs:
    parent: "tutorials"
weight: 100
toc: true
---

![Build Status](https://github.com/jptosso/coraza-waf/actions/workflows/regression.yml/badge.svg)
![CodeQL](https://github.com/jptosso/coraza-waf/workflows/CodeQL/badge.svg)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=jptosso_coraza-waf&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=jptosso_coraza-waf)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=jptosso_coraza-waf&metric=coverage)](https://sonarcloud.io/dashboard?id=jptosso_coraza-waf)
[![GoDoc](https://godoc.org/github.com/jptosso/coraza-waf?status.svg)](https://godoc.org/github.com/jptosso/coraza-waf)
[![Project Status: Active – The project has reached a stable, usable state and is being actively developed.](https://www.repostatus.org/badges/latest/active.svg)](https://www.repostatus.org/#active)

<div align="center">
	<img src="https://coraza.io/images/logo.png" width="50%">
</div>

## Prerequisites

* Linux distribution (Debian and Centos are recommended, Windows is not supported yet)
* Golang compiler v1.16 or v1.17

### Optional requirements

In this Coraza version, you can set CGO_ENABLED to 1 or 0, if you set it to 1, you will be required to link libinjection and libpcre to enable PCRE expressions, @detectSQLi and @detectXSS, if you set it to 0 you won't need any dynamic library but your implementation won't support @detectSQLi, @detectXSS nor PCRE expressions, **which means OWASP CRS won't work**.

Future versions of Coraza will fully remove CGO.

|             | CGO Enabled | CGO Disabled |
|-------------|-------------|--------------|
| @detectSQLi | Yes         | No           |
| @detectXSS  | Yes         | No           |
| PCRE regex  | Yes         | No           |
| RE2 regex   | Yes         | Yes          |
| OWASP CRS   | Yes         | No           |

In case you have to use CGO, the requirements are the following:

* libpcre-dev (``apt install libpcre++-dev`` for Ubuntu)
* **CGO_ENABLED** environmental variable must be set to 1
* libinjection must be installed and linked

For instructions to install libinjection see this tutorial.

## Running the test suite

Run the go tests:

```sh
go test ./...
go test -race ./...
```

## Your first Coraza WAF project

```go
package main
import(
	"fmt"
	coraza"github.com/jptosso/coraza-waf"
	"github.com/jptosso/coraza-waf/seclang"
)

func main() {
	// First we initialize our waf and our seclang parser
	waf := coraza.NewWaf()
	parser, _ := seclang.NewParser(waf)

	// Now we parse our rules
	parser.FromString(`SecRule REMOTE_ADDR "@rx .*" "id:1,phase:1,drop"`)

	// Then we create a transaction and assign some variables
	tx := waf.NewTransaction()
	tx.ProcessConnection("127.0.0.1", 8080, "127.0.0.1", 12345)

	tx.ProcessRequestHeaders()

	// Finally we check the transaction status
	if tx.Interrupted() {
		fmt.Println("Transaction was interrupted")
	}
}
```

### Integrate with any framework

Using the standard net/http library:

```go
package main
import(
	engine"github.com/jptosso/coraza-waf"
	"github.com/jptosso/coraza-waf/seclang"
	"net/http"
)

func SomeErrorPage(w http.ResponseWriter) {
	w.WriteHeader(403)
	w.Write([]byte("WAF ERROR")
}

func someHandler(waf *engine.Waf) http.Handler {
  return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
    tx := waf.NewTransaction()
	tx.ProcessRequest(r)
	if tx.Interruption != nil {
		SomeErrorPage(w)
	}
  })
}
```

Responses are harder to handle, because we must intercept the response writers and integrate them with the Coraza BodyReader.

### Handling HTTP responses with Coraza

Responses are usually long buffers, so duplicating the response or buffering it in memory is hard. 
In order to avoid issues while handling long buffers Coraza provides the engine.BodyReader struct, it will handle long buffers storing them to temporary files if needed.

```go
func someHandler(waf *engine.Waf) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		tx := waf.NewTransaction()
		tx.ProcessRequest(r)
		if tx.Interruption != nil {
			SomeErrorPage(w)
		}
		// We will use the Coraza response reader:
		tx.ProcessResponseHeaders()
		tx.ResponseBuffer.Write([]byte("Some of the response body"))
		tx.ProcessResponseBody()
		// We will dump the buffered response into the response writer:
		io.Copy(w, tx.ResponseBuffer)
	})
}

```

## Compatibility status

Coraza is compatible with most Modsecurity features but we have removed Lua support and persistent collections. Both are going to be replaced with better functionalities. 

OWASP Core Ruleset is fully compatible, except for DDOS protection.

## Why Coraza WAF?

### Philosophy

* **Simplicity:** Anyone should be able to understand and modify Coraza WAF's source code
* **Extensibility:** It should be easy to extend Coraza WAF with new functionalities
* **Innovation:** Coraza WAF isn't just a ModSecurity port, it must include awesome new functions (in the meantime it's just a port :sweat_smile:)
* **Community:** Coraza WAF is a community project and everyone's idea will be heard

## Coraza WAF implementations

* [Caddy Plugin (Reverse Proxy and Web Server)](https://github.com/jptosso/coraza-caddy) (Stable)
* [Traefik Plugin (Reverse Proxy and Web Server)](#) (soon)
* [Gin Middleware (Web Framework)](#) (soon)
* [Buffalo Plugin (Web Framework)](#) (soon)

## Some useful tools

* [Go FTW](#): rule testing engine
* [Coraza Sandbox](#): rule testing sandbox with web interface
* [Coraza Benchmark](#): benchmark Coraza and Modsecurity against multiple use-cases


## Troubleshooting

Create an issue or a discussion thread.

## How to contribute

Contributions are welcome, there are so many TODOs, also functionalities, fixes, bug reports and any help you can provide. Just send your PR.

```sh
cd /path/to/coraza
egrep -Rin "TODO|FIXME" -R --exclude-dir=vendor *
```

## Useful links

## Special thanks

* Modsecurity team for creating SecLang
* OWASP Coreruleset team for the CRS and their feedback

## About

The name **Coraza** is trademarked, **Coraza** is a registered trademark of Juan Pablo Tosso.

* Author on Twitter [@jptosso](https://twitter.com/jptosso)