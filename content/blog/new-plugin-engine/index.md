---
title: "New Plugin Engine"
description: "Extend Coraza capabilities with Plugins."
lead: "Coraza is designed to be the minimal core for a strong Web Application Firewall, using as few dependencies as possible. Therefore, plugins are required to extend it's capabilities and enable additional features like: Bot protection with CAPTCHA, openapi enforcement, DLP and more."
date: 2021-09-05T13:32:04-03:00
lastmod: 2021-09-05T13:32:04-03:00
draft: false
weight: 50
images: ["new-plugin-engine.jpg"]
contributors: ["Juan Pablo Tosso"]
---



## Installing a plugin

Plugin model is based on Caddy plugins system, they must be compiled within the project just by importing them like this:

```go
import(
    "github.com/jptosso/coraza-waf"
    _ "github.com/someone/somecorazaplugin"
)
```

**Important**: Some integrations like Traefik does not support plugins, because we cannot control how the integration is compiled by Pilot.

## Plugins capabilities

Plugins now support:

* **Rule Operators**: Create rul operators like ```@even``` to detect even numbers
* **Rule Transformations**: Create rule transformations like ```t:rot13``` to encode your values in ROT13
* **Rule Actions**: Create rule actions like ```challenge``` to redirect a malicious request to some bot detection system

Plugins will support in the near future:

* **Persistence engines**: More engines to store key-value objects, like Redis
* **Logging engines**: More logging capabilities like Elasticsearch writer or Splunk writer
* **Logging formats**: Add additional logging formats
* **Directives**: New directives to extend the Waf initialization

## The Plugin interface

The plugin interface provides three methods to extend rule operators, transformations and actions. Each one of them must match it's proper type or interface and be registered using the ```plugins``` package. 

* **Operators**: ```type PluginOperatorWrapper() coraza.Operator```
* **Actions**: ```type PluginOperatorWrapper() coraza.RuleAction```
* **Transformations**: ```type Transformation = func(input string, tools *transformations.Tools) string```

After defining the plugins, we must register them using the ```plugins.Register...``` function inside the init function ```func init(){}```.

* **Operators**: ```plugins.RegisterOperator(operator PluginOperatorWrapper)```
* **Actions**: ```plugins.RegisterAction(action PluginActionWrapper)```
* **Transformations**: ```plugins.RegisterTransformation(transformation transformations.Transformation)```

### Sample Plugin

```go
import(
    "strconv"
    "github.com/jptosso/coraza-waf"
    "github.com/jptosso/coraza-waf/plugins"
)
func init() {
	plugins.RegisterOperator("even", func() coraza.Operator {
		return &opEven{}
	})
}

type opEven struct{}

func (opEven) Init(_ string) error {
	return nil
}

func (opEven) Evaluate(_ *coraza.Transaction, input string) bool {
	i, _ := strconv.Atoi(input)
	return i%2 == 0
}

var _ coraza.Operator = &opEven{}
```