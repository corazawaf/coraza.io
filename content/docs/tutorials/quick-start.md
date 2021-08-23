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

If you are not looking to use Coraza WAF as a library and you want a working WAF implementation or integration, check ...
## Requirements


- Download and install [Libinjection](https://github.com/libinjection/libinjection)
- Install libpcre (```apt install libpcre++-dev``` for ubuntu)
- Golang 1.16+

You can use the [coraza-waf](#) Docker image to develop and build you projects.

## Add Coraza to your go project

```sh
go get github.com/jptosso/coraza-waf@latest
```

### Create a WAF instance

WAF instances are the main container for settings and rules which are inherited by transactions that will process requests, responses and logging. A WAF instance can be created like this:

```go
package main
import (
  coraza"github.com/jptosso/coraza-waf"
)
func initCoraza(){
  coraza.NewWaf()
}
```


### Adding rules to a Waf Instance

Seclang rules syntax is used to create Coraza Rules which will be evaluated by transactions and apply disruptive actions like deny(403) or just log the event. See the Seclang references.

Rules are unmarshaled using the seclang package which provides functionalities to compile rules from files or strings.

```go
package main
import (
  coraza"github.com/jptosso/coraza-waf"
  "github.com/jptosso/coraza-waf/seclang"
)
func parseRules(waf *coraza.Waf){
  parser, _ := seclang.NewParser(waf)
  parser.FromString(`SecAction "id:1,phase:1,deny:403,log"`)
}
```

### Creating a transaction

Transactions are created for each http request, they are concurrent-safe and they handle [Phases](#) to evaluate rules and generate audit and interruptions. A transaction can be created using ```waf.NewTransaction()```.

#### Handling an interruption

Interruptions are created by Transactions to tell the web server or application what action is required, based on the rules actions. Interruptions can be retrieved using ```tx.Interruption()```, a nil Interruption means there is no action needed (pass) and a non-nil interruption means the web server must do something like denying the request. For example:

```go
//...
tx := waf.NewTransaction()
// Add some variables and process some phases
if it := tx.Interruption();it != nil {
  switch it.Action {
    case "deny":
      rw.WriteStatus(it.Status)
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
- **AddRequestHeader**: Must be run for each HTTP header, it will create headers variables and cookies.
- **ProcessRequestHeaders**: Evaluates phase 1 rules with all the variables felt before. This functions is disruptive.
- **RequestBodyBuffer.Write**: Writes to the request body buffer, you can just ```io.Copy(tx.RequestBodyBuffer, someReader)```
- **ProcessRequestBody**: Evaluates phase 2 rules with the ```REQUEST_BODY``` and POST variables. There are other cases like MULTIPART, JSON and XML

```go
tx := waf.NewTransaction()
// 127.0.0.1:55555 -> 127.0.0.1:80
tx.ProcessConnection("127.0.0.1", 55555, "127.0.0.1", 80)
// Request URI was /some-url?with=args
tx.ProcessUri("/some-url?with=args")
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

Responses are harder to handler, that's why there is no helper to do that. Many integrations requires you to create "body interceptors" or other kind of functions.

There is a special helper, ```IsProcessableResponseBody``` that returns **true** if the request can be intercepted by Coraza
In the magical case that you are handling an http.Response or a bytes buffer, you can use:

```go
tx := waf.NewTransaction()
//parse request...
tx.AddResponseHeader("some", "header")
if it := tx.ProcessResponseHeaders(200); it != nil {
  return processInterruption(it)
}
if !tx.IsProcessableResponseBody() {
  // We stream the response to the client
  sw.WriteStatus(200)
  sw.Write(res.Body)
  sw.Close()
  return
}

//Add response data from a string or bytes:
tx.ResponseBodyBuffer.Write([]byte("some response data"))
//Or dump a Response.Body buffer into Coraza
io.Copy(tx.ResponseBodyBuffer, res.Body)

sw.WriteStatus(200)
sw.Write(tx.ResponseBodyBuffer.Reader())
sw.Close()
```

#### Handling logging

Logging is a mandatory phase that has to be processed even if the transaction was disrupted. The best way to force calling ```ProcessLogging()``` is to use defer, for example:

```go
//...
tx := waf.NewTransaction()
defer tx.ProcessLogging()
//Process phases
```