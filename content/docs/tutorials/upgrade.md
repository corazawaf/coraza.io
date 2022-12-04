---
title: "Upgrave to v3 🆕"
description: "This tutorial details the steps requiring to upgrade your Coraza v2 application to Coraza v3."
date: 2020-11-16T13:59:39+01:00
lastmod: 2020-11-16T13:59:39+01:00
draft: false
images: []
menu:
  docs:
    parent: "tutorials"
weight: 1100
toc: true
---

This tutorial details the steps requiring to upgrade your Coraza v2 application to Coraza v3.

### Seclang parser

NewParser now panics instead of returning an error.

```go
// old code:
parser, err := seclang.NewParser(waf)
// new code:
parser := seclang.NewParser()
```

### Transaction
Transactions now takes a `context.Background` as an argument.

```go
// old code:
tx := waf.NewTransaction()
// new code:
tx := waf.NewTransaction(context.Background())
```

Example of a transaction timeout using context
```go
ctxTimeout, cancel := context.WithTimeout(context.Background(), time.Second*3)
defer cancel()
go func(){
  tx := waf.NewTransaction(ctxTimeout)
}()

select {
case <-ctxTimeout.Done():
  fmt.Printf("Transaction cancelled: %v\n", ctxTimeout.Err())
}
```

### Directives and rules

No changes required.


### Plugins Interfaces

Soon