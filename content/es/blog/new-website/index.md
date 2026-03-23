---
title: "El sitio web de Coraza, reconstruido"
description: "Después de seis años con la misma base, coraza.io recibe una renovación completa — misma base, mejor estructura y abierta a traducciones."
date: 2026-03-23
draft: false
images: []
contributors: ["Juan Pablo Tosso"]
---

El sitio web de Coraza ha funcionado con la misma configuración desde aproximadamente 2020. Cumplía su función, pero empezaba a quedarse anticuado. Le hemos dado una renovación a fondo. Si te entra la nostalgia, aquí tienes [cómo se veía antes](https://web.archive.org/web/20260305214828/https://coraza.io/).

## El mismo Doks, seis años después

El sitio sigue funcionando con Hugo y el tema Doks, ahora actualizado a la versión 2 (basado en Thulite). El flujo de trabajo no ha cambiado — si has contribuido antes, te resultará familiar. Lo que sí ha cambiado es el tema en sí: mejor navegación, un diseño moderno y mejor rendimiento. La página principal se ha rediseñado por completo para mostrar mejor qué hace Coraza y cómo encaja en tu infraestructura.

## Plugins y connectors: ahora en YAML

Este es probablemente el cambio más práctico para los contribuidores.

Antes, cada plugin y connector tenía su propia página markdown con frontmatter, descripciones y plantillas. Añadir uno nuevo significaba copiar una página existente, editar varios campos y cruzar los dedos para que la plantilla quedase bien. Demasiada ceremonia para lo que en esencia es una entrada de catálogo.

Ahora, todos los metadatos de plugins y connectors viven en dos ficheros YAML: `data/plugins.yaml` y `data/connectors.yaml`. Añadir un nuevo plugin tiene esta pinta:

```yaml
- title: "My Plugin"
  lead: "What it does in one line."
  author: "Your Name"
  repo: "https://github.com/org/repo"
  official: false
  compatibility: ["v3.x"]
  logo: false
```

Una entrada, un PR. El sitio genera las páginas de listado automáticamente a partir de los datos. Sin plantillas que tocar, sin ficheros markdown que crear.

## Las traducciones están abiertas

Hemos añadido soporte de internacionalización en todo el sitio. La página principal, la navegación y los textos de la interfaz ahora usan el sistema i18n de Hugo, así que cada cadena de texto visible se puede traducir sin tocar el código de los layouts.

El español es la primera traducción junto al inglés, y estamos buscando contribuidores que nos ayuden a llevar la documentación a más idiomas. El proceso está documentado en el repositorio — creas los ficheros de contenido correspondientes en `content/{lang}/` y añades las cadenas de traducción en `i18n/{lang}.toml`. Las comprobaciones de CI aseguran que todos los idiomas tengan la misma estructura de ficheros, para que nada se quede atrás.

Si hablas de forma nativa cualquier idioma y quieres ayudar a que Coraza sea más accesible, tu contribución será bienvenida.

## Qué ha cambiado

- Página principal completamente rediseñada e internacionalizada
- Las páginas de plugins y connectors sustituidas por un enfoque basado en datos YAML
- Tema actualizado a Doks v2 (Thulite)
- Paridad de contenido entre idiomas verificada en CI
- Flujo de contribución más sencillo tanto para contenido como para traducciones

El código fuente está en [GitHub](https://github.com/corazawaf/coraza.io). Los PRs son bienvenidos.
