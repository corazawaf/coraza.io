---
title: "SecDefaultAction"
description: "Defines the default list of actions, which will be inherited by the rules in the same configuration context."
syntax: "SecDefaultAction \"phase:2,log,auditlog,deny,status:403,tag:'SLA 24/7'\""
default: "phase:2,log,auditlog,pass"
date: 2020-10-06T08:48:57+00:00
lastmod: 2020-10-06T08:48:57+00:00
draft: false
images: []
weight: 100
toc: true
versions: v1.0+
tinygo: Yes
type: seclang/directives
---

Every rule following a previous SecDefaultAction directive in the same configuration context will inherit its settings unless more specific actions are used. 

Rulesets like OWASP Core Ruleset uses this to define operation modes:
- You can set the default disruptive action to block for phases 1 and 2 and you can force a phase 3 rule to be disrupted if the thread score is high.
- You can set the default disruptive action to deny and each risky rule will interrupt the connection.

**Important: **Every SecDefaultAction directive must specify a disruptive action and a processing phase and cannot contain metadata actions.

