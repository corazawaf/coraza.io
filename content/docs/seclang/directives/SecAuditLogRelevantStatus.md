---
title: SecAuditLogRelevantStatus
description: Configures which response status code is to be considered relevant for the purpose of audit logging.
syntax: SecAuditLogRelevantStatus [REGEX]
default: 
date: 
lastmod: "2023-01-30T13:00:45+01:00"
draft: false
images: []
weight: 100
toc: true
type: seclang/directives
---

The main purpose of this directive is to allow you to configure audit logging for
only the transactions that have the status code that matches the supplied regular
expression.

Example:
```
SecAuditLogRelevantStatus "^(?:5|40[1235])"
```
The example provided would log all 5xx and 4xx level status codes,
except for 404s. Although you could achieve the same effect with a rule in phase 5,
SecAuditLogRelevantStatus is sometimes better, because it continues to work even when SecRuleEngine
is disabled.

Note: Must have SecAuditEngine set to RelevantOnly. Additionally, the auditlog action
is present by default in rules, this will make the engine bypass the SecAuditLogRelevantStatus
and send rule matches to the audit log regardless of status. You must specify noauditlog in the
rules manually or set it in SecDefaultAction.

