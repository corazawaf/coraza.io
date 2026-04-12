---
title: "Uso de Plugins"
description: "Los plugins amplian la mayoria de las funcionalidades de Coraza: operadores, acciones, transformaciones, procesadores de cuerpo y auditoria."
lead: "Los plugins pueden extender la mayoría de las funcionalidades de Coraza como operadores, acciones, transformaciones, procesadores de cuerpo y registro de auditoría."
date: 2021-09-05T14:03:58-03:00
lastmod: 2021-09-05T14:03:58-03:00
draft: false
images: []
weight: 999
toc: true
---

## Descripcion general

Los plugins se importan llamando a las funciones de registro respectivas del paquete `github.com/corazawaf/coraza/v3/experimental/plugins`:

- `plugins.RegisterOperator(...)`
- `plugins.RegisterAction(...)`
- `plugins.RegisterBodyProcessor(...)`
- `plugins.RegisterTransformation(...)`

La mayoria de los plugins se registran automáticamente a traves de la función `init()` de Go. Solo necesitas importarlos con un identificador en blanco:

```go
package main

import (
    "github.com/corazawaf/coraza/v3"
    _ "github.com/someorg/my-awesome-plugin"
)
```

## Plugins oficiales disponibles

### coraza-geoip

Agrega soporte de base de datos MaxMind GeoIP2 a Coraza, habilitando reglas basadas en geolocalizacion.

```go
import _ "github.com/corazawaf/coraza-geoip"
```

Repositorio: [github.com/corazawaf/coraza-geoip](https://github.com/corazawaf/coraza-geoip)

### coraza-coreruleset

Incorpora el OWASP Core Rule Set para usar con Coraza sin necesidad de gestionar archivos manualmente.

```go
import "github.com/corazawaf/coraza-coreruleset"
```

Repositorio: [github.com/corazawaf/coraza-coreruleset](https://github.com/corazawaf/coraza-coreruleset)

Consulta el [tutorial de Core Ruleset]({{< relref "coreruleset" >}}) para detalles de uso.
