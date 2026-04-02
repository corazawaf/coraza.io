---
title: "Flujo de ejecución"
description: "Aprenda a controlar el flujo de ejecución de las reglas de Coraza utilizando directivas y acciones especiales."
lead: "El flujo de ejecución de Coraza puede modificarse utilizando directivas y acciones especiales."
date: 2020-10-06T08:48:57+00:00
lastmod: 2020-10-06T08:48:57+00:00
draft: false
images: []
weight: 100
toc: true
---

## Fases

Las fases son un concepto abstracto diseñado para adaptarse a la mayoría de los flujos de ejecución de servidores web y ofrecer más oportunidades para detener una solicitud.

```kroki {type=mermaid}
flowchart TD
    A["Solicitud entrante"] --> B["Fase 1\nCabeceras de solicitud"]
    B -->|"Interrumpida"| X["Devolver error"]
    B -->|"Pasa"| C["Fase 2\nCuerpo de la solicitud"]
    C -->|"Interrumpida"| X
    C -->|"Pasa"| D["Backend / Servidor de origen"]
    D --> E["Fase 3\nCabeceras de respuesta"]
    E -->|"Interrumpida"| X
    E -->|"Pasa"| F["Fase 4\nCuerpo de la respuesta"]
    F -->|"Interrumpida"| X
    F -->|"Pasa"| G["Enviar respuesta al cliente"]
    G --> H["Fase 5\nRegistro"]
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

### Fase 1: Cabeceras de solicitud

Esta fase procesará las reglas con las siguientes variables:

- Datos de conexión HTTP, como direcciones IP, puertos y versión del protocolo
- URI y argumentos GET
- Cabeceras de solicitud: cookies, content-type y content-length

### Fase 2: Cuerpo de la solicitud

Esta fase procesará las reglas con las siguientes variables:

- Argumentos POST
- Argumentos multipart y archivos
- Datos JSON y XML
- Cuerpo crudo de la solicitud (Raw Request Body)

### Fase 3: Cabeceras de respuesta

Esta fase procesará las reglas con las siguientes variables:

- Código de estado de la respuesta
- Cabeceras de respuesta: content-length y content-type

### Fase 4: Cuerpo de la respuesta

Esta fase procesará las reglas con las siguientes variables:

- Cuerpo crudo de la respuesta (Raw Response Body)

### Fase 5: Registro

Esta fase evaluará las reglas de la fase 5, guardará las colecciones persistentes y escribirá la entrada de registro. Esta fase no es disruptiva y puede ejecutarse después de que la respuesta haya sido enviada al cliente.

## Cómo se ordenan las reglas

Las reglas **no se** ordenan por ID, sino por fase y orden de compilación. Por ejemplo:

```seclang
SecAction "id:1,phase:3,logdata:'first rule',log"
SecAction "id:150,phase:2,logdata:'second rule',log"
SecAction "id:300,phase:1,logdata:'third rule',log"
```

Esto evaluará las reglas según su fase, no según su ID, y mostrará el siguiente `logdata`:

```seclang
third rule
second rule
first rule
```

## Secmarkers

[SecMarker](#) es una directiva que crea una regla abstracta, sin reglas, operadores ni acciones, que solo funciona como marcador de posición para indicar a la transacción bajo qué SecMarker nos encontramos.

```seclang
SecMarker BEGIN_HOST_CHECK

SecRule &REQUEST_HEADERS:Host "@eq 0" "phase:1,id:1,pass"
SecRule REQUEST_HEADERS:Host "^$" "phase:1,id:2,pass"

SecMarker END_HOST_CHECK
```

Esto "marcará" las reglas 1 y 2 como `BEGIN_HOST_CHECK`, que será utilizado por la acción [skipAfter]({{< relref "actions#skipafter" >}}) para saltar las reglas siguientes hasta que se alcance el "SecMarker" indicado, por ejemplo:

```seclang
SecAction "id:1, phase:1,skipAfter:END_HOST_CHECK"
SecMarker BEGIN_HOST_CHECK

SecRule &REQUEST_HEADERS:Host "@eq 0" "phase:1,id:2,pass"
SecRule REQUEST_HEADERS:Host "^$" "phase:1,id:3,pass"

SecMarker END_HOST_CHECK
SecAction "id:4,phase:1,pass"
```

En el ejemplo anterior, las reglas 2 y 3 serán omitidas porque están marcadas como ```BEGIN_HOST_CHECK``` y no como ```END_HOST_CHECK```, que es lo esperado por ```skipAfter```.

## Otros controladores de flujo

La acción [Skip]({{< relref "actions#skip" >}}) también puede utilizarse para saltar las N reglas siguientes, por ejemplo:

```seclang
SecAction "id:1,phase:1, skip:1"

# The following rule won't be evaluated
SecAction "id:2"

# This rule will be evaluated
SecAction "id:3"
```
