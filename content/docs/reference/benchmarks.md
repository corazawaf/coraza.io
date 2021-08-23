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

## Results

### 1. Without rules GET

### 2. Without rules POST Multipart

### 3. Without rules POST XML

### 4. With CRS GET

### 5. With CRS POST Multipart

### 6. With CRS POST XML

## Methodology

## Run your own benchmarks

First make sure you meet all the requirements:

- golang 1.16+
- libpcre and libinjection installed
- gcc compiler
- libinjection installed
- python 3

```sh
git clone https://github.com/jptosso/coraza-benchmark --depth=1
cd coraza-benchmark
make all
./run-benchmarks.sh
./parse-results.sh
```

This will print the tables with the benchmark results.

You may also run the docker image from the Dockerfile using ```docker build -t coraza-benchmark .```