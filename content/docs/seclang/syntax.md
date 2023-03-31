---
title: "Syntax"
description: ""
lead: ""
date: 2020-10-06T08:48:57+00:00
lastmod: 2020-10-06T08:48:57+00:00
draft: false
images: []
menu:
  docs:
    parent: "seclang"
weight: 10
toc: true
---

The original language for configuring the ModSecurity Apache module was a set of extension directives to the Apache config language. This extension allows you to generate your Security Policy where you take an access control decision based on a set of parameters. Directives can be used to configure the engine itself, but also to send directives to the engine for access control. Directives look like the examples below:

```modsecurity
SecDirective1 some options
SecDirective2 "some option between brackets \" and escaped"
```

```
SecSampleDirective this \
    directive \
    is splitted \
    in lines

```

## Rule syntax

Rules are a special directive that must contain variables, operator and actions: ```SecRule VARIABLES "@OPERATOR OPERATOR_ARGUMENTS" "ACTIONS"```.

* All rules **must** have a unique ID action, for example ```"id:1"```.
* If there is no **phase** action, the phase will default to 2 (request headers).
* Rules can contain only one disruptive action
* More default actions can be set with [SecDefaultAction]({{< relref "directives/#SecDefaultAction" >}})

```
SecRule REMOTE_ADDR "127.0.0.1" "id:1, phase:1, pass, log, logdata:'Request from localhost'"
```

### Variables

Variables are a structure of KEY:VALUE(S), some variables are mapped objects that contains ```KEY:[VALUE1,VALUE2,VALUE3]```, while other are just ```KEY:VALUE```. If you request a variable without any parameter, it will return all of values for each key, if it is a ```KEY:VALUE``` variable it will just return a single value. Variable parameters use the syntax ```VARIABLE:PARAMETER```.

**Variable key**

Variables can be queried for a specific case insesitive key, for example:

```
SecRule REQUEST_HEADERS:user-agent "@contains firefox" "id:1, pass, log, logdata:'someone used firefox to access'"
```

**Variable with regex**

(v2 Only): PCRE compatible regex can be used to query a mapped VARIABLE like ARGS, the following example will match all parameters (get and post) where the key begins with ```param``` and the value of this argument is ```someval```.

```
SecRule ARGS:/^param.*$/ "someval" "id:1"
```

{{< alert icon="👉" text="Only RE2 will be supported in v3." />}}

**Variable count**

You can count the number of values available for a collection using the **&** prefix, for example:

```
# You want to block requests without host header
SecRule &REQUEST_HEADERS:host "@eq 0" "id:1, deny, status:403"
```

**Variable exceptions**

You can remove specific target keys from the variables list using the **!** prefix, for example:

```
# We want to apply some Sql Injection validations against the REQUEST_HEADERS
SecRule REQUEST_HEADERS "@detectSQLi" "id:1,deny,status:403"

# There is a false positive for some User-Agents so we want to ignore the 
# User-Agent header:
SecRule REQUEST_HEADERS|!REQUEST_HEADERS:User-Agent "@detectSQLi" "id:2,deny,status:403"

## The second rule will be evaluated for each request header except User-Agent.
```

**Multiple Variables**

You may evaluate multiple variables by separating them win pipe (|), for example:

```
SecRule VARIABLE1|VARIABLE2|VARIABLE3:/some-regex/|!VARIABLE3:id "!@rx \w+" "id:1,pass"
```

#### XPATH variables

If the body processor is set to process JSON or XML, you may use the special variables **XML** and **JSON**, for example:

```
SecAction "id:1, phase:1,ctl:setRequestBodyProcessor=XML,pass,nolog"
# We are denying a book because we don't like it
SecRule XML:/bookstore/book[last()] "name of the book" "id:2,phase:2,log,logdata:'We don´t like this book!',deny,status:403"
```

See [https://github.com/antchfx/xpath](https://github.com/antchfx/xpath) for more information about XPATH support.

### Operators

Operators are functions that returns true or false. Only one operator can be used per rule, unless you use chains. The syntax for an operator is: ```"@OPERATOR ARGUMENTS"```, you can negate the result using ```"!@OPERATOR ARGUMENTS"```.

{{< alert icon="👉">}}

* If you don't indicate any operator, the default used operator will be ```@rx```.

* Operators must begin with **@**.
{{</alert>}}

### Actions

Actions are key-value instructions for the rule that will be triggered per compilation, interruption or transaction depending on the action type.

Actions values are optional, the key-value syntax is ```key:value``` and some actions can be reused as much as you want, like **t**.

**Action types:**

* **Non-disruptive actions** - Do something, but that something does not and cannot affect the rule processing flow. Setting a variable, or changing its value is an example of a non-disruptive action. Non-disruptive action can appear in any rule, including each rule belonging to a chain.
* **Flow actions** - These actions affect the rule flow (for example skip or skipAfter).
* **Meta-data actions** - Meta-data actions are used to provide more information about rules. Examples include id, rev, severity and msg.
* **Data actions** - Not really actions, these are mere containers that hold data used by other actions. For example, the status action holds the status that will be used for blocking (if it takes place).

### Default Actions

`SecDefaultAction` is used to define a default list of actions per phase. The default phases will be added to each rule and can be overwritten by using the specified action again.

If you define default actions, you are forced to indicate a **phase** and a **disruptive action**.

```
SecDefaultAction "phase:1, deny, status:403"

# This rule will deny the request with status 403 because of the default actions
SecAction "id:2, phase:1"

# This rule will be triggered but it will pas instead of deny
SecAction "id:3, phase:1, pass"
```

### SecAction

SecActions are used to create rules that will always match, they don´t contain operator nor variables.

## Macro Expansion

Macro expansions are special messages that can be transformed into it's evaluated value, the syntax is: ```%{VARIABLE.KEY}```, for example ```%{REQUEST_HEADERS:host}``` will return the content of the request header "Host".

```
SecAction "id:1, log, logdata:'Transaction %{unique_id}'"

# we assign a variable to tx.argcount
SecRule &ARGS "!@eq 0" "id:2, setvar:'tx.argcount=%{MATCHED_VAR}', pass"
# we print the args count to the log
SecAction "id:3, log, logdata:'%{tx.argcount} arguments found.'"
```
