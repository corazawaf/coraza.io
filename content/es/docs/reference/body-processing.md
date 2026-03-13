---
title: "Procesamiento del cuerpo"
description: "Cómo Coraza maneja el procesamiento del cuerpo de solicitudes y respuestas, incluyendo los procesadores de cuerpo soportados."
lead: "Coraza almacena en buffer los cuerpos de solicitudes y respuestas para permitir una inspección y bloqueo confiables. Esta página explica el pipeline de procesamiento del cuerpo y los procesadores disponibles."
date: 2020-10-06T08:48:57+00:00
lastmod: 2020-10-06T08:48:57+00:00
draft: false
images: []
weight: 0
toc: true
---

## BodyBuffer

BodyBuffer se utiliza para manejar eficientemente cuerpos grandes. Coraza necesita almacenar el cuerpo en buffer para hacer posible un bloqueo confiable. Versiones futuras podrían implementar una solución más eficiente.

`BodyBuffer.Reader` es un `io.Reader` que lee desde un buffer en memoria o desde un archivo. El uso de archivos está deshabilitado para tinygo.

**Importante:** Copiar un Reader a BodyBuffer probablemente vaciará el reader original. En la mayoría de los casos tendrás que mantener dos copias del reader, una para Coraza y otra para tu aplicación. Simplemente puedes reemplazar el puntero de tu reader con el puntero del reader de BodyBuffer.

## Procesadores de cuerpo

Los procesadores de cuerpo están diseñados para manejar solicitudes y respuestas en el mismo contexto. La mayoría de los procesadores pueden manejar una solicitud o una respuesta, pero hay casos de procesadores de cuerpo como JSON, que pueden manejar solicitud y respuesta en diferente contexto. La correlación solicitud-respuesta es responsabilidad del procesador, y el caso de uso actual es GraphQL.

| Procesador de cuerpo      | Solicitud | Respuesta | Correlación | Soporte Tinygo |
|---------------------------|-----------|-----------|-------------|----------------|
| URLEncoded                | Sí        | No        | No          | Sí             |
| XML (Soporte parcial)     | Sí        | Sí        | No          | No             |
| Multipart                 | Sí        | No        | No          | Sí             |
| JSON                      | Sí        | Sí        | No          | Sí             |
| GraphQL                   | PD        | PD        | Sí          | PD             |

```kroki {type=mermaid}
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
