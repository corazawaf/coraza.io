---
title: "Body Processing"
description: "How Coraza handles request and response body processing, including supported body processors."
lead: "Coraza buffers request and response bodies to enable reliable inspection and blocking. This page explains the body processing pipeline and available processors."
date: 2020-10-06T08:48:57+00:00
lastmod: 2020-10-06T08:48:57+00:00
draft: false
images: []
menu:
  docs:
    parent: "reference"
weight: 0
toc: true
---

## BodyBuffer

BodyBuffer is used to effectively handle large bodies. Coraza has to buffer the body in order to make reliable blocking possible. Future versions might implement a more efficient solution.

`BodyBuffer.Reader` is a `io.Reader` that reads from either a memory buffer or a file. Using files is disabled for tinygo.

**Important:** Copying a Reader to BodyBuffer will most likely flush the original reader. In most cases you will have to keep two copies of the reader, one for coraza, and one for your application. You can simply replace your reader pointer with the BodyBuffer reader pointer.

## Body Processors

Body processors are designed to handle requests and responses in the same context. Most processors can handle either a request or a response, but there are cases of body processors like JSON, that can handle request and response in different context. Request-Response correlation is the responsibility of the processor, and the current use-case is GraphQL.

| Body Processor            | Request | Response | Correlation | Tinygo support |
|---------------------------|---------|----------|-------------|----------------|
| URLEncoded                | Yes     | No       | No          | Yes            |
| XML (Partial Support)     | Yes     | Yes      | No          | No             |
| Multipart                 | Yes     | No       | No          | Yes            |
| JSON                      | Yes     | Yes      | No          | Yes            |
| GraphQL                   | TBD     | TBD      | Yes         | TBD            |

```mermaid
flowchart TD
    A[Request Arrives] --> B{RequestBodyAccess On?}
    B -->|No| G[Skip to Phase 3]
    B -->|Yes| C{Content-Type?}
    C -->|application/x-www-form-urlencoded| D[URLEncoded Processor]
    C -->|multipart/form-data| E[Multipart Processor]
    C -->|application/json| F[JSON Processor]
    C -->|application/xml| F2[XML Processor]
    C -->|Other| H{ForceRequestBodyVariable?}
    H -->|Yes| D
    H -->|No| G
    D --> I[Populate ARGS_POST, REQUEST_BODY]
    E --> J[Populate FILES, FILES_NAMES, etc.]
    F --> K[Populate REQUEST_BODY]
    F2 --> L[Populate XML variables]
    I --> M[Evaluate Phase 2 Rules]
    J --> M
    K --> M
    L --> M
```
