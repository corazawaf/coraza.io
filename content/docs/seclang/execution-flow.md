---
title: "Execution flow"
description: "Learn how to control Coraza rules execution flow using special directives and actions."
lead: "Coraza execution flow can be altered using special directives and actions."
date: 2020-10-06T08:48:57+00:00
lastmod: 2020-10-06T08:48:57+00:00
draft: false
images: []
menu:
  docs:
    parent: "seclang"
weight: 100
toc: true
---

## Phases

Phases are an abstract concept designed to fit most web servers execution flows and give it more oportunities to stop a request.

<figure>
<img src="/images/execution_flow.png" style="border-1 img-fluid" data-sizes="auto" width="100%">
</figure>

### Phase 1: Request Headers

This phase will process rules with the following variables:

- HTTP connection data, like IPs, ports and protocol version
- URI and GET arguments
- Request Headers: cookies, content-type and content-length

### Phase 2: Request Body

This phase will process rules with the following variables:

- POST arguments
- Multipart arguments and files
- JSON and XML data
- Raw Request Body

### Phase 3: Response Headers

This phase will process rules with the following variables:

- Response status code
- Response headers: content-length and content-type

### Phase 4: Response Body

This phase will process rules with the following variables:

- Raw Response body

### Phase 5: Logging

This phase will evaluate phase 5 rules, save persistent collections and write the log entry. This phase is not disruptive and it may run after the response was sent to the client.

## How rules are sorted

Rules **are not** sorted by id, they are sorted by phase and compilation order. For example:

```
SecAction "id:1, phase:3, logdata:'first rule', log"
SecAction "id:150, phase:2, logdata:'second rule', log"
SecAction "id:300, phase: 1, logdata:'third rule', log"
```

This will evaluate the rules based on it's phase, not it's id, and show the following logdata:
```
third rule
second rule
third rule
```

## Secmarkers

[SecMarker](#) is a directive that  creates an abstract rule, without rules, operators and actions, that will only work as a placeholder to tell the transaction under which SecMarker we are.

```
SecMarker BEGIN_HOST_CHECK

SecRule &REQUEST_HEADERS:Host "@eq 0" "phase:1,id:1, pass"
SecRule REQUEST_HEADERS:Host "^$" "phase:1,id:2, pass"

SecMarker END_HOST_CHECK
```

This will "mark" rules 1 and 2 as BEGIN_HOST_CHECK, which will be used by [skipAfter](#) action to skip the following rules after the "SecMark" was reached, for example:

```
SecAction "id:1, phase:1, skipAfter:END_HOST_CHECK"
SecMarker BEGIN_HOST_CHECK

SecRule &REQUEST_HEADERS:Host "@eq 0" "phase:1,id:2, pass"
SecRule REQUEST_HEADERS:Host "^$" "phase:1,id:3, pass"

SecMarker END_HOST_CHECK
SecAction "id:4, phase:1, pass"
```

In the example above, rules 2 and 3 will be skipped because they are marked as ```BEGIN_HOST_CHECK``` and not ```END_HOST_CHECK``` as expected by ```skipAfter```.

## Other flow controllers

[Skip](#) action can also be used to skip the N following rules, for example:

```
SecAction "id:1,phase:1, skip:1"

# The following rule won't be evaluated
SecAction "id:2"

# This rule will be evaluated
SecAction "id:3"
```
