---
title: "Quick Start"
description: "One page summary of how to start a new Coraza WAF project."
lead: "One page summary of how to start a new Coraza WAF project."
date: 2020-11-16T13:59:39+01:00
lastmod: 2020-11-16T13:59:39+01:00
draft: false
images: []
menu:
  docs:
    parent: "tutorials"
weight: 110
toc: true
---

If you are not looking to use Coraza WAF as a library and you want a working WAF implementation or integration, check the integrations page.

<!-- @TODO: Update links for integration page -->

## Requirements

- Golang 1.18+

## Add Coraza to your go project

```sh
go install github.com/corazawaf/coraza/v3@latest
```

### Create a WAF instance

WAF instances are the main container for settings and rules which are inherited by transactions that will process requests, responses and logging. A WAF instance can be created like this:

```go
package main
import (
  "github.com/corazawaf/coraza/v3"
)
func initCoraza(){
  cfg := coraza.NewWAFConfig()
  waf, err := coraza.NewWAF(cfg)
}
```

### Adding rules to a Waf Instance

Seclang rules syntax is used to create Coraza rules, which will be evaluated by transactions and apply disruptive actions like deny(403) or just log the event. See the Seclang references.

Rules can be added using the ```coraza.NewWAFConfig().WithDirectives()``` method:
```go
package main

import (
  "github.com/corazawaf/coraza/v3"
)

func createWAF() coraza.WAF {
  waf, err := coraza.NewWAF(coraza.NewWAFConfig().WithDirectives(`SecAction "id:1,phase:1,deny:403,log"`))
  if err != nil {
    panic(err)
  }
  return waf
}
```

### Creating a transaction

Transactions are created for each http request, they are concurrent-safe and they handle [Phases](#) to evaluate rules and generate audits and interruptions. A transaction can be created using ```waf.NewTransaction()```.
ID of the transaction can also be specified using ```waf.NewTransactionWithID(id)```.

#### Handling an interruption

Interruptions are created by Transactions to tell the web server or application what action is required based on the rules of action. Interruptions can be retrieved using ```tx.Interruption()```, a nil Interruption means there is no action needed (pass) and a non-nil interruption means the web server must do something like denying the request. For example:

```go
//...
tx := waf.NewTransaction()
// Add some variables and process some phases
if it := tx.Interruption();it != nil {
  switch it.Action() {
    case "deny":
      rw.WriteStatus(it.Status())
      rw.Write([]byte("Some error message"))
      return
  }
}
```

#### Handling a request

There are two ways to handle a Request, you can manually process each phase for the request or you can send a http.Request to Coraza.

To process an http.Request struct you must use the ```tx.ProcessRequest(req)``` helper. ProcessRequest will evaluate phases 1 and 2, and will stop the execution flow if the transaction was disrupted. **Important**: req.Body will be read replaced with a new pointer, pointing to a buffer or file created by Coraza.

To manually process a request we must run 5 functions in the following order:

- **ProcessConnection**: Creates variables with connection information like IP addresses and ports.
- **ProcessUri**: Creates variables from strings extracted from the Request Line, these are method, url and protocol.
- **AddRequestHeader**: Must be run for each HTTP header, it will create headers, variables and cookies.
- **ProcessRequestHeaders**: Evaluates phase 1 rules with all the variables felt before. This function is disruptive.
- **RequestBodyBuffer.Write**: Writes to the request body buffer, you can just ```io.Copy(tx.RequestBodyBuffer, someReader)```
- **ProcessRequestBody**: Evaluates phase 2 rules with the ```REQUEST_BODY``` and POST variables. There are other cases like MULTIPART, JSON and XML

```go
tx := waf.NewTransaction()
// 127.0.0.1:55555 -> 127.0.0.1:80
tx.ProcessConnection("127.0.0.1", 55555, "127.0.0.1", 80)
// Request URI was /some-url?with=args
tx.ProcessURI("/some-url?with=args")
// We add some headers
tx.AddRequestHeader("Host", "somehost.com")
tx.AddRequestHeader("Cookie", "some-cookie=with-value")
// Content-Type is important to tell coraza which BodyProcessor must be used
tx.AddRequestHeader("Content-Type", "application/x-www-form-urlencoded")
// We process phase 1 (Request)
if it := tx.ProcessRequestHeaders();it != nil {
  return processInterruption(it)
}
// We add urlencoded POST data
tx.RequestBodyBuffer.Write([]byte("somepost=data&with=paramenters"))
// We process phase 2 (Request Body)
if it := tx.ProcessRequestBody();it != nil {
  return processInterruption(it)
}
```

#### Handling a response

Responses are harder to handle, that's why there is no helper to do that. Many integrations require you to create "body interceptors" or other kinds of functions.

There is a special helper, ```IsProcessableResponseBody``` that returns **true** if the request can be intercepted by Coraza.
A body interceptor must be created to buffer the body into the transaction, call ```ProcessResponseBody``` then send this buffer back to the server.

#### Handling logging

Logging is a mandatory phase that has to be processed even if the transaction was disrupted. The best way to force calling ```ProcessLogging()``` is to use defer, for example:

```go
//...
tx := waf.NewTransaction()
defer tx.ProcessLogging()
//Process phases
```

#### Handling full requests and response
Coraza http package contains a middleware that can be used to handle a full request and response. This middleware can be used with any web framework that supports http.Handler.

```go
package main

import (
  txhttp "github.com/corazawaf/coraza/v3/http"
)

func main() {
	waf, _ := coraza.NewWAF(coraza.NewWAFConfig())
	http.Handle("/", txhttp.WrapHandler(waf, http.HandlerFunc(exampleHandler)))
	fmt.Println("Server is running. Listening port: 8090")
	log.Fatal(http.ListenAndServe(":8090", nil))
}
```
