---
title: "SecRuleEngine"
description: "Configures the audit logging engine."
syntax: "SecAuditEngine RelevantOnly"
default: "Off"
date: ""
lastmod: "2023-01-26T14:57:12&#43;01:00"
draft: false
images: []
weight: 100
toc: true
type: seclang/directives
---


The SecAuditEngine directive is used to configure the audit engine, which logs complete
transactions. Coraza is currently able to log most, but not all transactions. Transactions
involving errors (e.g., 400 and 404 transactions) use a different execution path, which
Coraza does not support.

The possible values for the audit log engine are as follows:

- **On:** log all transactions
- **Off:** do not log any transactions
- **RelevantOnly:** only the log transactions that have triggered a warning or an error, or have a status code that is considered to be relevant (as determined by the SecAuditLogRelevantStatus directive)

Note : If you need to change the audit log engine configuration on a per-transaction basis (e.g., in response to some transaction data), use the ctl action. The following example demonstrates how SecAuditEngine is used:

```apache
SecAuditEngine RelevantOnly
SecAuditLog logs/audit/audit.log
SecAuditLogParts ABCFHZ
SecAuditLogType concurrent
SecAuditLogStorageDir logs/audit
SecAuditLogRelevantStatus ^(?:5|4(?!04))
```

