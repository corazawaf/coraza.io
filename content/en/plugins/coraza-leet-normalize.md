---
title: "Leet Normalize"
description: "Normalizes leet-speak, Cyrillic/Greek homoglyphs, and zero-width Unicode characters for WAF evasion prevention"
lead: "Normalizes leet-speak, Cyrillic/Greek homoglyphs, and zero-width Unicode characters for WAF evasion prevention"
date: 2026-03-19T00:00:00+00:00
lastmod: 2026-03-19T00:00:00+00:00
logo: false
author: Traceable AI
repo: https://github.com/Traceableai/coraza-leet-normalize
official: false
compatibility: [v3.x]
---

## Introduction

This plugin registers a `t:confusableNormalize` transformation for Coraza WAF that normalizes visually confusable characters to their ASCII Latin equivalents and strips zero-width Unicode characters. It enables existing regex-based WAF rules to catch evasion attempts that use character substitution.

## Features

- Leet-speak normalization (0→o, 1→i, 3→e, 4→a, 5→s, 7→t, @→a, $→s)
- Cyrillic homoglyph normalization (15 mappings)
- Greek homoglyph normalization (6 mappings)
- Zero-width character stripping (ZWSP, ZWNJ, ZWJ, BOM, soft hyphen, word joiner, Mongolian vowel separator)
- Single-pass O(n) processing, ~219 ns/op, 1 allocation
- TinyGo compatible

## Installation

Add the module to your project:

```bash
go get github.com/Traceableai/coraza-leet-normalize
```

## Usage

Import the plugin with a blank identifier so the `init()` function registers the transformation:

```go
import (
    "github.com/corazawaf/coraza/v3"
    _ "github.com/Traceableai/coraza-leet-normalize"
)
```

Then use `t:confusableNormalize` in any SecLang rule:

```
SecRule ARGS "@rx (?i)access\s+denied" \
    "id:1001,phase:2,t:none,t:urlDecodeUni,t:confusableNormalize,deny"
```

The recommended transformation ordering is:

```
t:none,t:urlDecodeUni,t:confusableNormalize
```

See the [full documentation](https://github.com/Traceableai/coraza-leet-normalize) for complete mapping tables and usage notes.
