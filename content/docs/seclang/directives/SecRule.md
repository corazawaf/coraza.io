---
title: "SecRule"
description: "Creates a rule that will analyze the selected variables using the selected operator."
syntax: "SecRule VARIABLES OPERATOR [ACTIONS]"
default: ""
date: ""
lastmod: "2023-01-26T20:49:29+01:00"
draft: false
images: []
weight: 100
toc: true
type: seclang/directives
---

Example: SecRule ARGS "@rx attack" "phase:1,log,deny,id:1"

Every rule must provide one or more variables along with the operator that should
be used to inspect them. If no actions are provided, the default list will be used.
(There is always a default list, even if one was not explicitly set with SecDefaultAction.)
If there are actions specified in a rule, they will be merged with the default list
to form the final actions that will be used. (The actions in the rule will overwrite
those in the default list.) Refer to SecDefaultAction for more information.
