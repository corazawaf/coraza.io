---
title: SecResponseBodyLimitAction
description: Controls what happens once a response body limit, configured with SecResponseBodyLimit, is encountered.
syntax: SecResponseBodyLimitAction Reject|ProcessPartial
default: 
date: 
lastmod: "2023-01-30T14:25:50+01:00"
draft: false
images: []
versions: v3.0+
weight: 100
toc: true
type: seclang/directives
---

By default, Coraza will reject a response body that is longer than specified.
Some web sites, however, will produce very long responses, making it difficult
to come up with a reasonable limit. Such sites would have to raise the limit
significantly to function properly, defying the purpose of having the limit in
the first place (to control memory consumption). With the ability to choose what
happens once a limit is reached, site administrators can choose to inspect only
the first part of the response, the part that can fit into the desired limit, and
let the rest through. Some could argue that allowing parts of responses to go
uninspected is a weakness. This is true in theory, but applies only to cases in
which the attacker controls the output (e.g., can make it arbitrary long). In such
cases, however, it is not possible to prevent leakage anyway. The attacker could
compress, obfuscate, or even encrypt data before it is sent back, and therefore
bypass any monitoring device.

