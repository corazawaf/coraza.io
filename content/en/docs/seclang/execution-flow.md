---
title: "Execution flow"
description: "Learn how to control Coraza rules execution flow using special directives and actions."
lead: "Coraza execution flow can be altered using special directives and actions."
date: 2020-10-06T08:48:57+00:00
lastmod: 2020-10-06T08:48:57+00:00
draft: false
images: []
weight: 100
toc: true
---

## Phases

Phases are an abstract concept designed to fit most web servers execution flows and give it more oportunities to stop a request.

```kroki {type=mermaid}
flowchart TD
    A["Incoming Request"] --> B["Phase 1\nRequest Headers"]
    B -->|"Disrupted"| X["Return Error"]
    B -->|"Pass"| C["Phase 2\nRequest Body"]
    C -->|"Disrupted"| X
    C -->|"Pass"| D["Backend / Origin Server"]
    D --> E["Phase 3\nResponse Headers"]
    E -->|"Disrupted"| X
    E -->|"Pass"| F["Phase 4\nResponse Body"]
    F -->|"Disrupted"| X
    F -->|"Pass"| G["Send Response to Client"]
    G --> H["Phase 5\nLogging"]
    X --> H

    style A fill:#4a90d9,stroke:#2c6fad,color:#fff
    style B fill:#f5a623,stroke:#d48b0e,color:#fff
    style C fill:#f5a623,stroke:#d48b0e,color:#fff
    style D fill:#7ed321,stroke:#5da016,color:#fff
    style E fill:#f5a623,stroke:#d48b0e,color:#fff
    style F fill:#f5a623,stroke:#d48b0e,color:#fff
    style G fill:#7ed321,stroke:#5da016,color:#fff
    style H fill:#9b59b6,stroke:#7d3c98,color:#fff
    style X fill:#d0021b,stroke:#a3011a,color:#fff
```

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

```modsecurity
SecAction "id:1,phase:3,logdata:'first rule',log"
SecAction "id:150,phase:2,logdata:'second rule',log"
SecAction "id:300,phase:1,logdata:'third rule',log"
```

This will evaluate the rules based on it's phase, not its id, and show the following `logdata`:

```modsecurity
third rule
second rule
first rule
```

## Secmarkers

[SecMarker](#) is a directive that creates an abstract rule, without rules, operators and actions, that will only work as a placeholder to tell the transaction under which SecMarker we are.

```modsecurity
SecMarker BEGIN_HOST_CHECK

SecRule &REQUEST_HEADERS:Host "@eq 0" "phase:1,id:1,pass"
SecRule REQUEST_HEADERS:Host "^$" "phase:1,id:2,pass"

SecMarker END_HOST_CHECK
```

This will "mark" rules 1 and 2 as `BEGIN_HOST_CHECK`, which will be used by [skipAfter]({{< relref "actions#skipafter" >}}) action to skip the following rules after the "SecMark" was reached, for example:

```modsecurity
SecAction "id:1, phase:1,skipAfter:END_HOST_CHECK"
SecMarker BEGIN_HOST_CHECK

SecRule &REQUEST_HEADERS:Host "@eq 0" "phase:1,id:2,pass"
SecRule REQUEST_HEADERS:Host "^$" "phase:1,id:3,pass"

SecMarker END_HOST_CHECK
SecAction "id:4,phase:1,pass"
```

In the example above, rules 2 and 3 will be skipped because they are marked as ```BEGIN_HOST_CHECK``` and not ```END_HOST_CHECK``` as expected by ```skipAfter```.

## Other flow controllers

[Skip]({{< relref "actions#skip" >}}) action can also be used to skip the N following rules, for example:

```modsecurity
SecAction "id:1,phase:1, skip:1"

# The following rule won't be evaluated
SecAction "id:2"

# This rule will be evaluated
SecAction "id:3"
```
