---
title: "Benchmarks"
description: ""
lead: ""
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

## Tests description

- Tests are performed using OWASP Core Ruleset v4 and go benchmarks.
- The benchmark tool supports coraza v2, v3 and modsecurity.
- Modsecurity is executed using CGO.
- There are currently 4 test-cases and 7 variations:
  - JSON request: 1kb and 100kb payload
  - URLENCODED request: 1kb and 100kb payload
  - Multipart file upload: 1kb and 100kb payload
  - GET request: no body

## Results

**Machine specs:** Apple M1 Pro (10 cores, 16 GB RAM)

Values are requests analyzed per second. The higher the value, the better results.

| Test                      | Coraza v2 | Coraza v3 | Modsecurity |
|---------------------------|-----------|-----------|-------------|
| Simple JSON Request       | 639       | 903       | **1011**    |
| Giant JSON Request        | 603       | **908**    | 847        |
| Multipart Request         | 606       | 817       | **976**     |
| Giant Multipart Request   | 573       | 781       | **958**         |
| Simple GET Request        | 654       | 955       | **1135**        |
| Simple URLENCODED Request | 624       | **892**       | 842         |
| Giant URLENCODED Request  | 632       | **871**       | 840         |

**Test Versions:**

- **Coraza v3:** v3.0.0-dev (no tag)
- **Coraza v2:** v2.0.1
- **Modsecurity v3:** v3.0.7

## Run your own benchmarks

### Using golang

```sh
# compile modsecurity: https://github.com/SpiderLabs/ModSecurity/wiki/Compilation-recipes-for-v3.x
git clone https://github.com/jptosso/coraza-benchmark
cd coraza-benchmark
go test -bench=. ./...
```

### Using Docker

```sh
docker run jptosso/coraza-benchmark:latest
```
