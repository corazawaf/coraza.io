---
title: "Benchmarks"
description: "Performance benchmarks comparing Coraza v3 with ModSecurity."
lead: "Coraza v3 delivers competitive performance against ModSecurity while running as a pure Go library."
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

## Tests Description

- Tests are performed using OWASP Core Ruleset v4 and Go benchmarks.
- ModSecurity is executed using CGO.
- There are currently 4 test-cases and 7 variations:
  - JSON request: 1kb and 100kb payload
  - URLENCODED request: 1kb and 100kb payload
  - Multipart file upload: 1kb and 100kb payload
  - GET request: no body

## Results

**Machine specs:** Apple M1 Pro (10 cores, 16 GB RAM)

Values are requests analyzed per second. The higher the value, the better.

| Test                      | Coraza v3 | ModSecurity v3 |
|---------------------------|-----------|----------------|
| Simple JSON Request       | 903       | **1011**       |
| Giant JSON Request        | **908**   | 847            |
| Multipart Request         | 817       | **976**        |
| Giant Multipart Request   | 781       | **958**        |
| Simple GET Request        | 955       | **1135**       |
| Simple URLENCODED Request | **892**   | 842            |
| Giant URLENCODED Request  | **871**   | 840            |

**Test Versions:**

- **Coraza v3:** v3.0.0-dev
- **ModSecurity v3:** v3.0.7

> These benchmarks should be re-run with the latest releases. The numbers above provide a general comparison of performance characteristics.

## Run Your Own Benchmarks

### Using Go

```sh
git clone https://github.com/corazawaf/coraza-benchmark
cd coraza-benchmark
go test -bench=. ./...
```

### Using Docker

```sh
docker run corazawaf/coraza-benchmark:latest
```
