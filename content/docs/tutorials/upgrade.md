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

In this guide, we will outline the necessary steps to upgrade from Coraza v2 to v3. Coraza v3 brings improvements in performance, usability, and extensibility, making it an essential update for users of the library. Follow these steps to ensure a smooth transition.

### 1. Update your dependencies
First, update your project's dependencies to use Coraza v3:

```sh
go get -u github.com/corazawaf/coraza/v3
```

Make sure to replace any import statements in your project with the new import path:

```go
import (
    "github.com/corazawaf/coraza/v3"
)
```

### 2. Initialize the WAF
In v3, you no longer need to create a separate seclang.Parser. Instead, you can create and configure the WAF using the coraza.NewWAF() function and coraza.NewWAFConfig() method:

```go
waf, err := coraza.NewWAF(coraza.NewWAFConfig().WithDirectives(`SecRule REMOTE_ADDR "@rx .*" "id:1,phase:1,deny,status:403"`))
```

In v3, the Transaction struct has been replaced with an interface called coraza.Transaction. When creating a new transaction, use the waf.NewTransaction() method:

```go
tx := waf.NewTransaction()
```

The Clean() method has been renamed in v3. Instead, use the Close() method to release resources associated with the transaction:
```go
defer func() {
    tx.ProcessLogging()
    tx.Close()
}()
```

### 4. Process phases
The transaction processing methods in v3 remain mostly the same, with minor changes in naming:

- There are new helpers to add body buffer
- SetHostname was added
- AddArguments was separated into AddPostArgument, AddGetArgument, AddPathArgument

### 5. Plugins
The plugins interface were moved into the experimental package. See the plugins documentation.