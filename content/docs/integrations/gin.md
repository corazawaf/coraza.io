---
title: "Gin"
description: "Protect your gin-gonic applications using the official Coraza Middleware."
lead: "Protect your gin-gonic applications using the official Coraza Middleware."
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

## Installing

Import the middleware using:
```sh
go get github.com/jptosso/coraza-gin
```

## Using the middleware

Add the middleware to your code:
```go
import(
    //...
    "github.com/jptosso/coraza-waf"
    "github.com/jptosso/coraza-waf/seclang"
    corazagin"github.com/jptosso/coraza-gin"
)
func main() {
    // Creates a router without any middleware by default
    r := gin.New()
    waf := coraza.NewWaf()
    // Add some rules...
    // Use the Coraza Gin Middleware
    r.Use(corazagin.Coraza(waf))

    // Per route middleware, you can add as many as you desire.
    r.GET("/mypath", MyFunction(), Endpoint)

    // Listen and serve on 0.0.0.0:8080
    r.Run(":8080")
}
```

## Additional options

Additional options like error pages will come in the near future.