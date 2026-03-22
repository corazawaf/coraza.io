---
title: "OWASP Core Ruleset"
description: "OWASP Core Ruleset es el conjunto de reglas WAF de código abierto más robusto disponible en internet, compatible con Coraza."
lead: "OWASP Core Ruleset es el conjunto de reglas WAF de código abierto más robusto disponible en internet, compatible con Coraza."
date: 2020-10-13T15:21:01+02:00
lastmod: 2020-10-13T15:21:01+02:00
draft: false
images: []
weight: 130
toc: true
---

## Usando coraza-coreruleset (Recomendado)

La forma más fácil de usar CRS con Coraza es a traves del paquete Go [coraza-coreruleset](https://github.com/corazawaf/coraza-coreruleset), que incorpora el Core Rule Set y la configuración recomendada de Coraza para que no necesites gestionar archivos manualmente.

```go
package main

import (
    "github.com/corazawaf/coraza/v3"
    "github.com/corazawaf/coraza-coreruleset"
)

func main() {
    waf, err := coraza.NewWAF(
        coraza.NewWAFConfig().
            WithRootFS(coreruleset.FS).
            WithDirectivesFromFile("@coraza.conf-recommended").
            WithDirectivesFromFile("@crs-setup.conf.example").
            WithDirectivesFromFile("@owasp_crs/*.conf"),
    )
    if err != nil {
        panic(err)
    }
    // Use waf...
    _ = waf
}
```

## Instalacion manual

Si prefieres gestionar los archivos de CRS manualmente:

```sh
wget https://raw.githubusercontent.com/corazawaf/coraza/main/coraza.conf-recommended -O coraza.conf
git clone https://github.com/coreruleset/coreruleset
```

Luego carga los archivos en orden:

1. coraza.conf
2. coreruleset/crs-setup.conf.example
3. coreruleset/rules/*.conf

```go
func initCoraza() {
    cfg := coraza.NewWAFConfig().
        WithDirectivesFromFile("coraza.conf").
        WithDirectivesFromFile("coreruleset/crs-setup.conf.example").
        WithDirectivesFromFile("coreruleset/rules/*.conf")
    waf, err := coraza.NewWAF(cfg)
    if err != nil {
        panic(err)
    }
    _ = waf
}
```

## Configuración

Por favor consulta [https://coreruleset.org/docs/deployment/install/](https://coreruleset.org/docs/deployment/install/) para ejemplos de configuración.
