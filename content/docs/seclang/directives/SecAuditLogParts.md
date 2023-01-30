---
title: SecAuditLogParts
description: Defines which parts of each transaction are going to be recorded in the audit log. Each part is assigned a single letter; when a letter appears in the list then the equivalent part will be recorded. See below for the list of all parts.
syntax: SecAuditLogParts [PARTLETTERS]
default: ABCFHZ
date: 
lastmod: "2023-01-30T14:25:50+01:00"
draft: false
images: []
versions: v3.0+
weight: 100
toc: true
type: seclang/directives
---

The format of the audit log format is documented in detail in the Audit Log Data
Format Documentation.

Example:
```apache
SecAuditLogParts ABCFHZ
```

Available audit log parts:

- A: Audit log header (mandatory).
- B: Request headers.
- C: Request body (present only if the request body exists and Coraza is configured
to intercept it. This would require SecRequestBodyAccess to be set to on).
- D: Reserved for intermediary response headers; not implemented yet.
- E: Intermediary response body (present only if Coraza is configured to intercept
response bodies, and if the audit log engine is configured to record it. Intercepting
response bodies requires SecResponseBodyAccess to be enabled). Intermediary response
body is the same as the actual response body unless Coraza intercepts the intermediary
response body, in which case the actual response body will contain the error message.
- F: Final response headers.
- G: Reserved for the actual response body; not implemented yet.
- H: Audit log trailer.
- I: This part is a replacement for part C. It will log the same data as C in all cases except when
multipart/form-data encoding in used. In this case, it will log a fake application/x-www-form-urlencoded
body that contains the information about parameters but not about the files. This is handy if
you don’t want to have (often large) files stored in your audit logs.
- J: This part contains information about the files uploaded using multipart/form-data encoding.
- K: This part contains a full list of every rule that matched (one per line) in the order they were
matched. The rules are fully qualified and will thus show inherited actions and default operators.
- Z: Final boundary, signifies the end of the entry (mandatory).

