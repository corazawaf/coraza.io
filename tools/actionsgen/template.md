---
title: "Actions"
description: "Actions available in Coraza"
lead: "The action of a rule defines how to handle HTTP requests that have matched one or more rule conditions."
date: 2020-10-06T08:48:57+00:00
lastmod: "{{ .LastModification }}"
draft: false
images: []
menu:
  docs:
    parent: "seclang"
weight: 100
toc: true
---

[//]: <> (This file is generated by tools/actionsgen. DO NOT EDIT.)

Actions are defined as part of a `SecRule` or as parameter for `SecAction` or `SecDefaultAction`. A rule can have no or serveral actions which need to be separated by a comma.

Actions can be categorized by how they affect overall processing:

* **Disruptive actions** - Cause Coraza to do something. In many cases something means block transaction, but not in all. For example, the allow action is classified as a disruptive action, but it does the opposite of blocking. There can only be one disruptive action per rule (if there are multiple disruptive actions present, or inherited, only the last one will take effect), or rule chain (in a chain, a disruptive action can only appear in the first rule).
{{"{{"}}< alert icon="👉" >{{"}}"}}
Disruptive actions will NOT be executed if the `SecRuleEngine` is set to `DetectionOnly`. If you are creating exception/allowlisting rules that use the allow action, you should also add the `ctl:ruleEngine=On` action to execute the action.
{{"{{"}}< /alert >{{"}}"}}
* **Non-disruptive actions** - Do something, but that something does not and cannot affect the rule processing flow. Setting a variable, or changing its value is an example of a non-disruptive action. Non-disruptive action can appear in any rule, including each rule belonging to a chain.
* **Flow actions** - These actions affect the rule flow (for example skip or skipAfter).
* **Meta-data actions** - used to provide more information about rules. Examples include id, rev, severity and msg.
* **Data actions** - Not really actions, these are mere containers that hold data used by other actions. For example, the status action holds the status that will be used for blocking (if it takes place).

{{ range .Actions }}
## {{ .Name }}

**Description**: {{ .Description }}

**Action Group**: {{ .ActionGroup }}

{{ if .Phases }}
**Processing Phases**: {{ .Phases }}
{{ end }}

**Example**:
{{ .Example }}
{{ end }}