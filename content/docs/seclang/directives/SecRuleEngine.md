---
title: SecRuleEngine
description: Configures the rules engine.
syntax: SecRuleEngine On|Off|DetectionOnly
default: Off
date: 
lastmod: "2023-01-30T14:25:50+01:00"
draft: false
images: []
versions: v3.0+
weight: 100
toc: true
type: seclang/directives
---

The possible values are:
- On: process rules
- Off: do not process rules
- DetectionOnly: process rules but never executes any disruptive actions
(block, deny, drop, allow, proxy and redirect)

