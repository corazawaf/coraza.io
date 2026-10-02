---
title: "Ya están aquí Coraza 3.8.0 y 3.8.1"
description: "Doce avisos de seguridad, soporte FIPS 140-3, una nueva acción de regla, trabajo en los prefiltros, una serie de correcciones en las transformaciones y los cambios de comportamiento que conviene revisar antes de actualizar."
date: 2026-10-02
draft: false
images: []
contributors: ["Felipe Zipitria"]
---

Coraza 3.8.0 se publicó el 30 de septiembre, casi seis meses después de la 3.7.0. Le siguió Coraza 3.8.1 el 2 de octubre. Es una versión de seguridad: completa varias correcciones que en la 3.8.0 solo eran parciales, corrige un fallo que tumbaba el proceso y arregla dos regresiones de la 3.8.0.

**Actualiza a la 3.8.1.** Vale para todo el mundo, también para quien siga en la 3.7.x o anteriores. La mayoría de los problemas que se describen abajo afectan a todas las versiones 3.x.

---

## Antes de actualizar

{{< callout context="warning" >}}
**¿Usas Coraza sin las reglas 200004 y 200005 de `coraza.conf-recommended`?** `SecArgumentsLimit` vale 1000 por defecto aunque no se configure. Desde la 3.8.0, los argumentos que superan ese límite se descartan por el final y solo se activa `ARGUMENTS_LIMIT_REACHED`. Esto incluye los argumentos de la query string y de los body urlencoded y JSON. Si ninguna regla actúa sobre ese indicador, Coraza no inspecciona esos argumentos. Es el caso de CRS por sí solo y de las copias antiguas de `coraza.conf-recommended` incluidas en otros proyectos. Añade las reglas 200004 y 200005 de `coraza.conf-recommended`, o una regla equivalente sobre `ARGUMENTS_LIMIT_REACHED`.
{{< /callout >}}

### Si vienes de la 3.7.x

- **`SecArgumentsLimit`** (1000 por defecto) ahora también se aplica a los body urlencoded y JSON de la request. Las reglas 200004 y 200005 rechazan las requests que lo superan. Si tus APIs envían legítimamente más valores, sube el límite.
- **Nueva regla 200009** en `coraza.conf-recommended`. Devuelve 400 para las URIs que no se pueden parsear: escapes de ruta inválidos (`/50%off`, `%zz`), un puerto incorrecto o la falta de la `/` inicial.
- **`URLENCODED_ERROR` ya no se activa cuando falla el parseo de la URI de la request.** Usa en su lugar la nueva variable `URI_PARSE_ERROR`, de la que depende la regla 200009.
- **La regla 200003** ahora devuelve 400 para las partes multipart con headers mal formados o duplicados. Antes, esas partes ocultaban los ficheros subidos a la inspección de las reglas. Una parte que solo tiene `filename*` va ahora a `FILES` en lugar de a `ARGS_POST`.
- **`SecDefaultAction`** se eliminó de `coraza.conf-recommended` ([#1630](https://github.com/corazawaf/coraza/pull/1630)).
- **Cambios incompatibles en la API para quien desarrolla conectores y plugins.** Los nuevos métodos de `plugintypes.TransactionVariables` rompen en tiempo de compilación las implementaciones externas. Además, las nuevas constantes de `types/variables` se insertaron en mitad del `iota`, lo que renumera todas las constantes que van detrás. Recompila contra la 3.8.1 y no dependas de valores numéricos guardados.

### Si vienes de la 3.8.0

- **Headers `Content-Type` duplicados:** ahora el primer header es el que selecciona el procesador de body. Coincide con lo que lee `Header.Get` y, por tanto, con lo que ve un backend típico. Antes ganaba el último header que coincidiera.
- **`filename*` con continuaciones numeradas** (`filename*0=`, `filename*0*=`, ...): ahora activa `MULTIPART_STRICT_ERROR`, así que la regla 200003 rechaza la request con un 400.
- **Los body JSON que superan el presupuesto de memoria del aplanado** ahora activan `REQBODY_ERROR`, así que la regla 200002 los rechaza con un 400. Antes solo se truncaban.
- **Nombres de cookie vacíos:** `REQUEST_COOKIES` y `REQUEST_COOKIES_NAMES` pueden contener ahora una entrada con nombre `""` (por ejemplo, a partir de `Cookie: =value`), y `&REQUEST_COOKIES` la cuenta. Es una desviación intencionada respecto a ModSecurity v2 y v3, que ignoran esas cookies. Algunos backends, como el paquete `cookie` de Node, sí se las pasan a la aplicación. Un `=` aislado se sigue ignorando.
- **Las eliminaciones de targets con regex en `ctl`** (`ctl:ruleRemoveTargetById=N;ARGS:/re/`) ya no eliminan las entradas con nombre `""`, salvo que la regex coincida con la cadena vacía.
- **Las entradas de longitud de array JSON** (`json.a` con la longitud del array) ya no cuentan para `SecArgumentsLimit`.
- **`coraza.conf-recommended`** ahora fija `SecArgumentsLimit 1000` de forma explícita. Antes estaba comentado. El límite se aplica por origen: `ARGS_GET`, `ARGS_PATH`, `ARGS_POST` y `RESPONSE_ARGS`.

La 3.8.1 también corrige dos regresiones de la 3.8.0:

- Con `SecRequestBodyLimitAction ProcessPartial`, la regla 200003 rechazaba cualquier subida multipart mayor que el límite de body ([#1725](https://github.com/corazawaf/coraza/pull/1725)).
- Se rechazaba un array JSON con exactamente `SecArgumentsLimit` elementos ([#1729](https://github.com/corazawaf/coraza/pull/1729)).

---

## Avisos de seguridad

Los doce avisos están publicados en la [página de Security Advisories del repositorio](https://github.com/corazawaf/coraza/security/advisories). Cada uno incluye todos los detalles y las versiones afectadas.

### Corregidos en la 3.8.1

La 3.8.0 solo los corregía parcialmente, así que quien esté en la 3.8.0 sigue afectado.

| Aviso | Severidad | Afectadas | Resumen |
| --- | --- | --- | --- |
| [GHSA-6gcq-wc29-5xf2](https://github.com/corazawaf/coraza/security/advisories/GHSA-6gcq-wc29-5xf2) | Alta | 3.0.0 – 3.8.0 | Un body JSON de request o response con mucho anidamiento podía tumbar el proceso con un desbordamiento de pila irrecuperable. |
| [GHSA-6r3q-mjv7-xr8m](https://github.com/corazawaf/coraza/security/advisories/GHSA-6r3q-mjv7-xr8m) (CVE-2026-41510) | Alta | 3.0.0 – 3.8.0 | Los argumentos que superaban `SecArgumentsLimit` se descartaban sin aviso, así que inundar la request de parámetros podía ocultar un payload a las reglas sobre `ARGS`. La 3.8.1 también limita las entradas de longitud de array JSON, lo que cierra una vía de agotamiento de memoria. |
| [GHSA-5gj4-9gm7-2fx2](https://github.com/corazawaf/coraza/security/advisories/GHSA-5gj4-9gm7-2fx2) | Media | 3.0.0 – 3.8.0 | Claves JSON distintas podían acabar con el mismo nombre en `ARGS_POST` y sobrescribirse, lo que ocultaba un valor a la inspección. |
| [GHSA-w253-m66g-rx24](https://github.com/corazawaf/coraza/security/advisories/GHSA-w253-m66g-rx24) | Media | 3.0.4 – 3.8.0 | Un `Content-Type` urlencoded con un parámetro (como `; charset=UTF-8`) hacía que no se procesara el body. |
| [GHSA-3wr7-993q-jrff](https://github.com/corazawaf/coraza/security/advisories/GHSA-3wr7-993q-jrff) | Media | < 3.8.1 | Un parámetro multipart `filename*` podía mostrar un nombre de fichero a Coraza y otro distinto al backend. La 3.8.1 también corrige una vía de agotamiento de CPU que la 3.8.0 introdujo en la comprobación de parámetros duplicados. |
| [GHSA-g4qm-m288-5cp9](https://github.com/corazawaf/coraza/security/advisories/GHSA-g4qm-m288-5cp9) | Media | < 3.8.1 | Los caracteres de control en los extremos de los nombres y valores de cookie hacían que Coraza y el backend no coincidieran en qué cookie habían recibido. |

### Corregidos en la 3.8.0

| Aviso | Severidad | Afectadas | Resumen |
| --- | --- | --- | --- |
| [GHSA-prpw-wwv7-xjjr](https://github.com/corazawaf/coraza/security/advisories/GHSA-prpw-wwv7-xjjr) (CVE-2026-41504) | Media | 3.0.0 – 3.7.0 | El formato Native del audit log escribía los datos de la request y la response sin escapar CR/LF, lo que permitía falsificar entradas del log. Los formatos JSON y OCSF no estaban afectados. |
| [GHSA-r3rm-qphw-hh76](https://github.com/corazawaf/coraza/security/advisories/GHSA-r3rm-qphw-hh76) (CVE-2026-41508) | Media | 3.4.0 – 3.7.0 | Un body multipart truncado no activaba `MULTIPART_STRICT_ERROR`, así que la regla 200003 nunca saltaba. |
| [GHSA-pc5q-qfxp-ggqv](https://github.com/corazawaf/coraza/security/advisories/GHSA-pc5q-qfxp-ggqv) | Media | 3.0.0 – 3.7.0 | Un error de desplazamiento en uno en `t:jsDecode` convertía cada escape octal en un byte nulo, así que los payloads codificados en octal evadían las reglas que usaban esa transformación. |
| [GHSA-3c6w-j9xm-8h2h](https://github.com/corazawaf/coraza/security/advisories/GHSA-3c6w-j9xm-8h2h) | Media | 3.0.0 – 3.7.0 | El procesador de body JSON de las responses no tenía límite de recursión, así que una response con mucho anidamiento podía mantener ocupado un núcleo durante segundos. |
| [GHSA-rp9v-7xv3-r6g3](https://github.com/corazawaf/coraza/security/advisories/GHSA-rp9v-7xv3-r6g3) | Media | 3.0.0 – 3.7.0 | El procesador multipart mantenía abierto un descriptor de fichero por cada parte con fichero hasta que terminaba la request, así que muchas partes pequeñas podían agotar la tabla de descriptores. |
| [GHSA-x26q-wvhg-fh4m](https://github.com/corazawaf/coraza/security/advisories/GHSA-x26q-wvhg-fh4m) | Media | 3.0.0 – 3.7.0 | Cuando fallaba el parseo de la URI de la request, `QUERY_STRING` y `ARGS_GET` quedaban vacías. Afecta sobre todo a las integraciones que no pasan por `net/http`. |

Gracias a todas las personas que reportaron y analizaron estos problemas: @oguzylmzx, @MushroomWasp, @airween, @janmrow, @HackingRepo, @zuesdevil, @WalTeR-RE y @claude.

En este ciclo también entraron dos cambios de proceso relacionados. Se actualizó `SECURITY.md` ([#1634](https://github.com/corazawaf/coraza/pull/1634)). Además, los reportes de vulnerabilidades deben indicar ahora qué herramientas de IA se usaron en la investigación ([#1720](https://github.com/corazawaf/coraza/pull/1720)), y el triaje puntúa ahora las precondiciones de explotabilidad ([#1722](https://github.com/corazawaf/coraza/pull/1722)).

Si encuentras un problema de seguridad en Coraza, repórtalo siguiendo el proceso descrito en [SECURITY.md](https://github.com/corazawaf/coraza/blob/main/SECURITY.md) en lugar de abrir un issue público.

---

## Soporte FIPS 140-3

[PR #1678](https://github.com/corazawaf/coraza/pull/1678).

Coraza ahora funciona con el modo FIPS 140-3 de Go. Coraza lo detecta en tiempo de ejecución con `crypto/fips140.Enabled()`, así que no hace falta ninguna build tag y las compilaciones por defecto no cambian. Se activa de la forma habitual en Go, por ejemplo con `GODEBUG=fips140=on`.

MD5 y SHA-1 no están aprobados por FIPS, así que `t:md5` y `t:sha1` no funcionan en este modo. Siguen registradas para que los conjuntos de reglas carguen; CRS usa `t:sha1` en las reglas 901320 y 901410. En modo FIPS, estas transformaciones fallan al evaluarse y el motor registra un aviso. El operador recibe entonces el valor sin transformar, así que la regla deja de coincidir en lugar de interrumpir la transacción. La CI ejecuta la suite completa y los tests de regresión de CRS tanto con `fips140=on` como con `fips140=only`.

## Una nueva acción de regla: `accuracy`

[PR #1693](https://github.com/corazawaf/coraza/pull/1693).

La acción `accuracy` estaba documentada y el campo ya se emitía en el audit log, pero la acción nunca se había registrado. Las reglas que la usaban fallaban al parsearse con `invalid action "accuracy"`. Ahora funciona igual que `maturity`: es una acción de metadatos que acepta un valor del 1 al 9 y lo guarda en la regla.

## Más trabajo en los prefiltros

Continuando con el trabajo de prefiltrado de `@rx` que contamos en la [entrada de Oslo]({{< ref "/blog/oslo-march-2026" >}}), llegaron dos mejoras de rendimiento más para otros operadores:

- [PR #1597](https://github.com/corazawaf/coraza/pull/1597) reemplaza el matcher de Aho-Corasick que hay detrás del prefiltro `anyRequired` por un matcher de bitmap indexado.
- [PR #1601](https://github.com/corazawaf/coraza/pull/1601) añade un prefiltro de longitud mínima al operador `@pm`, de forma que las entradas cortas se saltan por completo la búsqueda de patrones.

La misma idea de siempre: primero las comprobaciones baratas y la evaluación completa solo cuando hace falta.

El propio prefiltro de `@rx` también recibió una corrección. [PR #1724](https://github.com/corazawaf/coraza/pull/1724) ajusta cómo se manejan los patrones anclados. El prefiltro daba por hecho que un literal extraído junto a un ancla `^` o `$` estaba pegado a ella en el patrón. No siempre era así, y el prefiltro podía descartar una coincidencia antes de tiempo. Ahora comprueba esa adyacencia antes de aplicar la optimización de prefijo/sufijo. Así se recupera la garantía "fail-safe" descrita en la entrada de Oslo: el prefiltro puede decir "quizás" más veces de la cuenta, pero nunca "no" cuando la respuesta real es "sí". Esto solo afecta a las compilaciones que usan la etiqueta opcional `coraza.rule.rx_prefilter`.

[PR #1695](https://github.com/corazawaf/coraza/pull/1695) también elimina un mutex de la generación de cadenas aleatorias al pasar a `math/rand/v2`.

## Corrección en las transformaciones

Un conjunto de correcciones cambia cómo manejan las funciones de transformación los casos límite en la codificación de su entrada:

- `urlDecodeUni` ahora implementa el mapeo Unicode "best-fit" ([#1649](https://github.com/corazawaf/coraza/pull/1649)).
- `base64DecodeExt` salta los bytes inválidos en lugar de detenerse ([#1664](https://github.com/corazawaf/coraza/pull/1664)) y acepta el alfabeto base64url ([#1652](https://github.com/corazawaf/coraza/pull/1652)).
- `compressWhitespace` decodifica runas en lugar de indexar bytes crudos ([#1659](https://github.com/corazawaf/coraza/pull/1659)).
- `cssDecode` codifica los escapes hexadecimales como UTF-8 en lugar de truncarlos ([#1658](https://github.com/corazawaf/coraza/pull/1658)).
- `jsDecode` decodifica los escapes Unicode extendidos `\u{...}` de ES2015+ ([#1657](https://github.com/corazawaf/coraza/pull/1657)).
- `normalisePathWin` elimina los puntos y espacios finales de Windows y los sufijos ADS ([#1660](https://github.com/corazawaf/coraza/pull/1660)).
- `normalisePath`, `normalisePathWin`, `cmdLine` y `urlDecodeUni` ya no indican `changed=true` cuando la entrada no se modifica ([#1672](https://github.com/corazawaf/coraza/pull/1672), [#1631](https://github.com/corazawaf/coraza/pull/1631)).

Ninguno de estos casos es exótico. Son el tipo de particularidad de codificación que aparece en el tráfico real. Si mantienes reglas propias o un procesador de body que se apoya en estas transformaciones, comprueba que siguen funcionando como esperas.

## Correcciones en el motor y en la gestión de reglas

- `ctl:ruleRemoveTargetById`, `ctl:ruleRemoveTargetByTag` y `ctl:ruleRemoveTargetByMsg` ahora se aplican también a las reglas encadenadas (chains) ([#1622](https://github.com/corazawaf/coraza/pull/1622)).
- `SecRuleUpdateTarget` se aplica ahora sobre la regla almacenada y no sobre una copia del bucle, así que los cambios se quedan aplicados ([#1701](https://github.com/corazawaf/coraza/pull/1701)).
- `rule.msg` se expande en el momento de la coincidencia ([#1606](https://github.com/corazawaf/coraza/pull/1606)).
- Los resultados de un `Include` con glob ya no se vuelven a anclar al directorio actual ([#1689](https://github.com/corazawaf/coraza/pull/1689)).
- Las transacciones reutilizadas del pool reinician ahora `detectionOnlyInterruption` y `ForceResponseBodyVariable` ([#1641](https://github.com/corazawaf/coraza/pull/1641), [#1642](https://github.com/corazawaf/coraza/pull/1642)).
- El procesador de body JSON rellena `ARGS_POST` aunque el body no sea JSON válido ([#1615](https://github.com/corazawaf/coraza/pull/1615)).

## También vale la pena saberlo

- `libinjection-go` se actualizó a la v0.3.3 ([#1707](https://github.com/corazawaf/coraza/pull/1707)).
- Los Architecture Decision Records (ADR) ya están en el repositorio, con registros retroactivos para cada versión desde la 3.0.x hasta la 3.7.0 ([#1690](https://github.com/corazawaf/coraza/pull/1690) y siguientes).
- `AGENTS.md` es ahora la guía única para contribuidores y agentes de código ([#1535](https://github.com/corazawaf/coraza/pull/1535)).
- Todas las directivas de la documentación tienen ahora ejemplos en SecLang ([#1694](https://github.com/corazawaf/coraza/pull/1694)), y se corrigió la documentación de `SecArgumentsLimit` y de las variables multipart ([#1727](https://github.com/corazawaf/coraza/pull/1727), [#1728](https://github.com/corazawaf/coraza/pull/1728)).
- Hubo las actualizaciones de dependencias habituales en `golang.org/x/net`, `x/crypto`, `x/mod` y `x/text`.

## Limitaciones conocidas

Están previstas para una versión posterior:

- Los campos de formularios multipart no cuentan para `SecArgumentsLimit`.
- `SecUploadFileLimit` se parsea pero no se aplica.

---

Changelogs completos: [3.8.0](https://github.com/corazawaf/coraza/releases/tag/v3.8.0) y [3.8.1](https://github.com/corazawaf/coraza/releases/tag/v3.8.1).
