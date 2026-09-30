---
title: "Ya está aquí Coraza 3.8.0"
description: "Soporte FIPS 140-3, una nueva acción de regla, mejoras de rendimiento y corrección en los prefiltros, una serie de correcciones en las transformaciones, y los avisos de seguridad que llegan para esta versión."
date: 2026-09-30
draft: true
images: []
contributors: ["Felipe Zipitria"]
---

Coraza 3.8.0 se publicó el 30 de septiembre, cinco meses después de la 3.7.0. Esto es lo que trae.

---

## Soporte FIPS 140-3

[PR #1678](https://github.com/corazawaf/coraza/pull/1678).

Coraza ahora se puede compilar en un modo compatible con FIPS 140-3. Si trabajas en un entorno regulado donde las primitivas criptográficas de tu cadena de dependencias necesitan estar certificadas, esto es para ti.

## Una nueva acción de regla: `accuracy`

[PR #1693](https://github.com/corazawaf/coraza/pull/1693).

La acción `accuracy` ya está registrada y disponible en las reglas, junto a la acción `maturity` existente. Ambas permiten a quien escribe la regla anotar la confianza en la calidad de detección, algo que herramientas externas (y conjuntos de reglas como CRS) pueden usar para ajustar la sensibilidad.

## Más trabajo en los prefiltros

Continuando con el trabajo de prefiltrado de `@rx` que cubrimos en la [entrada de Oslo]({{< ref "/blog/oslo-march-2026" >}}), llegaron dos mejoras de rendimiento más para otros operadores:

- [PR #1597](https://github.com/corazawaf/coraza/pull/1597) reemplaza el matcher de Aho-Corasick detrás del prefiltro `anyRequired` por un matcher de bitmap indexado.
- [PR #1601](https://github.com/corazawaf/coraza/pull/1601) añade un prefiltro de longitud mínima al operador `@pm`, de forma que las entradas cortas se saltan la búsqueda de patrones por completo.

La misma idea de siempre: comprobaciones baratas primero, evaluación completa solo cuando realmente hace falta.

El propio prefiltro de `@rx` también recibió una corrección: [PR #1724](https://github.com/corazawaf/coraza/pull/1724) ajusta cómo se manejan los patrones anclados. El prefiltro asumía que un literal extraído junto a un ancla `^` o `$` estaba realmente adyacente a ella en el patrón; no siempre era así, lo que podía hacer que el prefiltro descartara una coincidencia de forma demasiado agresiva. Ahora verifica la adyacencia antes de aplicar la optimización de prefijo/sufijo, restableciendo la garantía "fail-safe" descrita en la entrada de Oslo: el prefiltro solo puede decir "quizás" con demasiada frecuencia, nunca "no" cuando la respuesta real es "sí". Esto solo afecta a las compilaciones que usan la etiqueta opcional `coraza.rule.rx_prefilter`.

## Corrección en las transformaciones

Entró un conjunto de correcciones sobre cómo las funciones de transformación manejan casos límite en la codificación de su entrada:

- `urlDecodeUni` ahora implementa el mapeo Unicode "best-fit" ([#1649](https://github.com/corazawaf/coraza/pull/1649))
- `base64DecodeExt` salta los bytes inválidos en lugar de detenerse ([#1664](https://github.com/corazawaf/coraza/pull/1664)) y acepta el alfabeto base64url ([#1652](https://github.com/corazawaf/coraza/pull/1652))
- `compressWhitespace` decodifica runas en lugar de indexar bytes crudos ([#1659](https://github.com/corazawaf/coraza/pull/1659))
- `cssDecode` codifica los escapes hexadecimales como UTF-8 en lugar de truncarlos ([#1658](https://github.com/corazawaf/coraza/pull/1658))
- `jsDecode` decodifica los escapes Unicode extendidos `\u{...}` de ES2015+ ([#1657](https://github.com/corazawaf/coraza/pull/1657))
- `normalisePathWin` elimina los puntos y espacios finales de Windows y los sufijos ADS ([#1660](https://github.com/corazawaf/coraza/pull/1660)), y tanto `normalisePath` como `normalisePathWin` dejan de reportar un falso `changed=true` cuando la ruta no se modificó ([#1672](https://github.com/corazawaf/coraza/pull/1672))

Ninguno de estos es un caso exótico: son el tipo de particularidad de codificación que aparece en tráfico real. Si mantienes reglas propias o un procesador de cuerpo que se apoya en estas transformaciones, vale la pena revisarlo.

## Correcciones en la gestión de reglas

- `SecRuleRemoveByPath`, y compañía, ya no se saltan las reglas encadenadas (chains) al eliminar targets, tags o mensajes ([#1622](https://github.com/corazawaf/coraza/pull/1622))
- `SecRuleUpdateTarget` ahora se aplica sobre la regla almacenada y no sobre una copia del bucle, así que las actualizaciones quedan realmente aplicadas ([#1701](https://github.com/corazawaf/coraza/pull/1701))

## También vale la pena saberlo

- Los Architecture Decision Records (ADR) ya viven en el repositorio, con registros retroactivos para cada versión desde la 3.0.x hasta la 3.7.0 ([#1690](https://github.com/corazawaf/coraza/pull/1690) y siguientes)
- Se añadió un `AGENTS.md` para contribuciones asistidas por LLM ([#1535](https://github.com/corazawaf/coraza/pull/1535))
- Actualizaciones de dependencias de rutina en `golang.org/x/net`, `x/crypto`, `x/mod` y `x/text`

---

## Seguridad

Publicaremos un lote de avisos de seguridad por incidencias reportadas y corregidas en esta versión. Como siempre, aparecerán en la [página de Security Advisories del repositorio](https://github.com/corazawaf/coraza/security/advisories) en cuanto estén listos — no anticipamos detalles antes de que exista una corrección disponible.

Ya entraron dos cambios de proceso relacionados: se actualizó `SECURITY.md` ([#1634](https://github.com/corazawaf/coraza/pull/1634)), y a partir de ahora los reportes de vulnerabilidades deben indicar qué herramientas de IA se usaron en la investigación que hay detrás ([#1720](https://github.com/corazawaf/coraza/pull/1720)).

Si encuentras un problema de seguridad en Coraza, repórtalo siguiendo el proceso descrito en [SECURITY.md](https://github.com/corazawaf/coraza/blob/main/SECURITY.md) en lugar de abrir un issue público.

---

Actualizaremos esta entrada con los avisos en cuanto se publiquen.
