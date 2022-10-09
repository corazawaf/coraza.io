---
title: "Extending"
description: "Easily extend Coraza with your own Operators, Actions, Audit Loggers and Persistence engines."
lead: "Plugins can be used to extend Coraza functionalities, right now, you can only extend Rule Actions, Rule Operators and Rule Transactions, but in the near future you may be able to add many additional functionalities."
date: 2020-10-06T08:48:57+00:00
lastmod: 2020-10-06T08:48:57+00:00
draft: false
images: []
menu:
  docs:
    parent: "reference"
weight: 0
toc: true
---

- **Rule Operators:** Create rule operators like @even to detect even numbers
- **Rule Transformations:** Create rule transformations like t:rot13 to encode your values in ROT13
- **Rule Actions:** Create rule actions like challenge to redirect a malicious request to some bot detection system

The plugin interface provides three functions to extend rule operators, transformations and actions. Each one of them must match it's proper type or interface and be registered using the ```plugins``` package. 

* **Operators**: ```type PluginOperatorWrapper() types.RuleOperator```
* **Actions**: ```type PluginOperatorWrapper() types.RuleAction```
* **Transformations**: ```type Transformation = func(input string, tools *transformations.Tools) string```

After defining the plugins, we must register them using the ```plugins.Register...``` function inside the init function ```func init(){}```.

* **Operators**: ```operators.RegisterPlugin(operator PluginOperatorWrapper)```
* **Actions**: ```actions.RegisterPlugin(action PluginActionWrapper)```
* **Transformations**: ```transformations.RegisterPlugin(transformation transformations.Transformation)```

**Important:** Some integrations like Traefik does not support plugins, because we cannot control how the integration is compiled by Pilot.

## Installing a plugin

Plugin model is based on Caddy plugins system, they must be compiled within the project just by importing them like this:

```go
import(
    "github.com/jptosso/coraza-waf/v2"
    _ "github.com/someone/somecorazaplugin"
)
```

## Creating Rule Actions

### Rule Action interface

```go
type RuleAction interface {
	// Initializes an action, will be done during compilation
	Init(*Rule, string) error
	// Evaluate will be done during rule evaluation
	Evaluate(*Rule, *Transaction)
	// Type will return the rule type, it's used by Evaluate
	// to choose when to evaluate each action
	Type() types.RuleActionType
}
```

### Action types

Each action can have one type that defines in which part of the rule lifetime it will be evaluated.

- **ACTION_TYPE_DISRUPTIVE**: Cause Coraza to do something. In many cases something means block transaction, but not in all. For example, the allow action is classified as a disruptive action, but it does the opposite of blocking. There can only be one disruptive action per rule (if there are multiple disruptive actions present, or inherited, only the last one will take effect), or rule chain (in a chain, a disruptive action can only appear in the first rule).
- **ACTION_TYPE_NONDISRUPTIVE**: Do something, but that something does not and cannot affect the rule processing flow. Setting a variable, or changing its value is an example of a non-disruptive action. Non-disruptive action can appear in any rule, including each rule belonging to a chain.
- **ACTION_TYPE_FLOW**: These actions affect the rule flow (for example skip or skipAfter).
- **ACTION_TYPE_METADATA**: Meta-data actions are used to provide more information about rules. Examples include id, rev, severity and msg.
- **ACTION_TYPE_DATA**: - Not really actions, these are mere containers that hold data used by other actions. For example, the status action holds the status that will be used for blocking (if it takes place).

### Creating a custom action

```go
type id15 struct{}

// Initializes an action, will be done during compilation
func (id15) Init(rule *coraza.Rule, _ string) error {
	rule.Id = 15
	return nil
}

// Evaluate will be done during rule evaluation
func (id15) Evaluate(_ *coraza.Rule, _ *coraza.Transaction) {}

// ACTION_TYPE_DATA will be only evaluated while compiling the rule, Evaluate won't be called
func (id15) Type() int {
	return coraza.ACTION_TYPE_DATA
}

// Tripwire to match coraza.RuleAction type
var _ coraza.RuleAction = &id15{}
```

### Transforming the action to plugin

Once the action is created, it must be wrapper inside a ```type PluginActionWrapper = func() types.RuleAction``` in order to be registered.

```go
import(
    "github.com/jptosso/coraza-waf/v2/actions"
    "github.com/jptosso/coraza-waf/v2/types"
)

func init() {
	actions.RegisterPlugin("id15", func() types.RuleAction {
		return &id15{}
	})
}
```

After properly importing the plugin, you may be able to create rules with ```id15``` action, for example:

```
SecAction "id15, nolog, pass"
```

## Creating Rule Transformations

Transformations are the easiest components to extend, each transformation implements the ```transformations.Transformation``` type and can be registered directly using ```plugins.RegisterPlugin(transformation transformations.Transformation)```. 

The *Tools struct is designed to add additional functionalities like logging and unicode mapping.

### Transformation Type

```go
type Transformation = func(input string, tools *Tools) string
```

### Example

```go
import (
  "github.com/jptosso/coraza-waf/v2/transformations"
  "strings"
)

func transformationToLowercase(input string) (string, error) {
	return strings.ToLower(input)
}

func init() {
  transformations.RegisterPlugin("tolower2", transformationToLowercase)
}
```

## Creating Rule Operators

### Rule Operator interface

```go
// Operator interface is used to define rule @operators
type Operator interface {
	// Init is used during compilation to setup and cache
	// the operator
	Init(string) error
	// Evaluate is used during the rule evaluation,
	// it returns true if the operator succeeded against
	// the input data for the transaction
	Evaluate(*Transaction, string) bool
}
```

### Creating a custom operator

```go
type opEven struct{}

func (opEven) Init(_ string) error {
	return nil
}

func (opEven) Evaluate(_ *coraza.Transaction, input string) bool {
	i, _ := strconv.Atoi(input)
	return i%2 == 0
}

//Tripwire
var _ coraza.Operator = &opEven{}
```

### Transforming the operator to plugin

Once the operator is created, it must be wrapper inside a ```type PluginOperatorWrapper = func() coraza.Operator``` in order to be registered.

```go
import(
    "github.com/jptosso/coraza-waf/v2/operators"
    "github.com/jptosso/coraza-waf/v2/types"
)

func init() {
	operators.RegisterPlugin("even", func() types.Operator {
		return &opEven{}
	})
}
```

After properly importing the plugin, you may be able to create rules with ```even``` operator, for example:

```
SecRule ARGS:id "@even" "id:1, nolog, pass"
```

## Testing your plugin

There are no special helpers to test plugins but you may use the seclang compiler to achieve this, for example, if we want to test that the tolower2 transformation works we must write the following test:

```go
import(
    "github.com/jptosso/coraza-waf/v2/seclang"
    "github.com/jptosso/coraza-waf/v2/types"
    "github.com/jptosso/coraza-waf/v2/transformations"
    "strings"
    "testing"
)

func TestToLower2(t *testing.T){
  waf := coraza.NewWaf()
  parser, _ := seclang.NewParser(waf)
  if err := parser.FromString(`SecRule ARGS:id "lowercase" "id:1, t:tolower2"`); err != nil{
    t.Error(err)
  }
  str := "TOLowEr"
  if strings.ToLower(str) != transformationToLowercase(str) {
    t.Error("Transformation tolower2 failed")
  }
}
```

## Adding plugins to Coraza Plugin Repository

This feature will be available soon, in the meantime, you can edit this site and add plugins to ```plugins.html```.

The site will update it's database every 60 minutes, searching for projects with the ```coraza-plugin``` topic.

If the site fails to add the plugin to the database, it will create an issue with the details.

### Requirements

* The project must be public in github.
* The project must have the ```coraza-plugin``` keyword.
* The project must have a valid ```.coraza.yml``` file in the root path.
* The project must have a valid ```go.mod``` file

### .coraza.yml

This file will be used in the future by the Coraza Public Plugin Repository, it's not required by the plugin itself.

```.coraza.yml``` must be placed in the root directory of your repository and it must contain the following valid yaml structure:

```yaml
# We only accept alphanumeric and -.  ([\w-])
name: some-plugin
author: Your Full name or whatever you want to show
repository: github.com/path/to-project
# Coraza Plugin repository will only accept projects with apache2, MIT and BSD licenses,
# we might accept more in the future
license: apache2
description: Short description to display in plugins.coraza.io
# We are using Ruby Gem version syntax: https://guides.rubygems.org/patterns/#pessimistic-version-constraint
# The min supported Coraza version, each item represents an AND operator
version: 
  - ">= v1.1"
  - "< v2"
  # or ~> that is identical to the previous statements
  - "~> v1.1"
tags:
  - Add some tags
  - For filtering
defs:
  - name: even
    type: action|operator|transformation
    description: Will match if the number is even
```
