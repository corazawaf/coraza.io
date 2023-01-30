---
title: {{ .Name }}
description: {{ .Description }}
syntax: {{ .Syntax }}
default: {{ .Default }}
date: {{ .Date }}
lastmod: "{{ .LastModification }}"
draft: false
images: []
versions: v3.0+
weight: 100
toc: true
type: seclang/directives
---
{{ .Content }}
