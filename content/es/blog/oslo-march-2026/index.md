---
title: "Oslo, Regex, y un WAF que por fin vuela"
description: "Nos juntamos en Noruega, tomamos algunas decisiones, y lanzamos dos de las mejoras de rendimiento más grandes que ha tenido Coraza en mucho tiempo."
date: 2026-03-31
draft: false
images: []
contributors: ["Juan Pablo Tosso"]
---

¡Fuimos a Oslo! Felipe, Jose Carlos y yo nos reunimos en el [OWASP Project Summit](https://projectsummit.owasp.org/) a principios de marzo y pasamos una semana juntos en persona. Talleres, cenas largas, y un montón de conversaciones que habrían tardado meses en GitHub. Fue muy bueno estar ahí. Después del summit, Felipe y yo — junto con un par de colegas de OWASP — nos fuimos a Tromsø a ver la aurora boreal. Impresionante, de verdad. Literalmente escribimos código de Coraza ahí, bajo las auroras. No está mal como oficina.

{{< figure src="oslo-team.jpg" alt="El equipo de Coraza en el OWASP Project Summit en Oslo, Noruega" caption="Oslo, marzo 2026." >}}

Igual, acá va lo técnico.

---

## La memoización está activada por defecto ahora

[PR #1540](https://github.com/corazawaf/coraza/pull/1540) — merged el 18 de marzo.

Ya teníamos memoización para los builders de regex y Aho-Corasick hace rato, pero estaba escondida detrás de un build tag (`memoize_builders`) que casi nadie sabía que existía. O sea, la mayoría de los usuarios recompilaban los mismos patrones desde cero cada vez que creaban una instancia del WAF.

Lo cambiamos. La memoización está activada por defecto ahora. Si por alguna razón no la quieres, la puedes desactivar con `coraza.no_memoize`.

La ganancia real no es la velocidad de inicio — es la memoria. Sin memoización, cada instancia de CRS que creas compila todos los patrones de regex y Aho-Corasick desde cero y guarda su propia copia. Cada instancia nueva agrega ~21.5 MiB. Con memoización, los patrones compilados se comparten, así que cada instancia adicional cuesta ~2.1 MiB. Con 10 instancias del WAF pasas de ~215 MiB a ~21 MiB. Una reducción de 10x, y escala — mientras más instancias, más grande la diferencia.

Eso fue lo que nos convenció de activarlo por defecto. Si corres múltiples tenants, usas Caddy con recargas frecuentes, o levantas instancias del WAF dinámicamente, esto es para ti.

Hay un pequeño breaking change: `internal/memoize` pasó de una función `Do()` a nivel de paquete a un struct `Memoizer`, y ahora fluye por `OperatorOptions`. El valor cero significa sin memoización, así que es compatible hacia atrás — pero si estás construyendo operadores personalizados, revisa que tu código todavía compile.

También encontramos un bug específico de TinyGo: `sync.Map.Range()` en TinyGo tiene un lock que no se puede re-entrar, lo que causaba un deadlock durante la limpieza del caché. Lo arreglamos recolectando las claves primero y borrando después de que termina el `Range`.

---

## Prefiltrado de @rx — saltarse el regex antes de ejecutarlo

[PR #1534](https://github.com/corazawaf/coraza/pull/1534) — en revisión.

El operador `@rx` siempre ha sido el costo más grande por request en Coraza. CRS tiene cientos de reglas de regex y para tráfico normal la gran mayoría retorna falso. Igual estás pagando el costo completo de evaluarlas.

Este PR hace un análisis en tiempo de compilación del AST del regex para construir pre-checks baratos. Tres cosas:

1. **Chequeo de longitud mínima** — ¿el input es más corto que el match más corto posible? Skip.
2. **Prefiltro de literales requeridos** — extrae substrings literales que deben aparecer en cualquier match, los verifica con `strings.Contains` o Aho-Corasick primero. ¿No están? Skip al regex.
3. **Menos allocations** — reemplaza `FindStringSubmatch` por `FindStringSubmatchIndex` en el path de captura.

Los dos primeros requieren el build tag `coraza.rule.rx_prefilter`. El de allocations siempre está activo.

Benchmarks en inputs que no hacen match (que es la mayoría de tu tráfico):

- Solo regex: ~997 ns/op
- Con prefiltro: ~146 ns/op — aproximadamente **6.8x más rápido**

El diseño es conservador a propósito. Si la extracción de literales es incierta, simplemente corre el regex completo. Un bug solo puede hacer que el prefiltro diga "quizás" con más frecuencia de lo necesario — nunca puede decir "no" cuando la respuesta es "sí". Probado contra los 294 patrones `@rx` de CRS v4.24.0, 96.466 inputs, cero falsos negativos.

---

## Otras cosas de marzo

Nada masivo, pero algunas cosas que vale la pena saber:

- Mejor manejo de errores de transformación de reglas
- Arreglado un problema de CI donde los tests de escala no chequeaban `testing.Short()`, lo que hacía que las builds de TinyGo se colgaran por horas
- Limpieza general de cómo los operadores reciben su configuración del WAF al inicializarse

---

Ah, y una cosa más — Coraza cumple 10 años este mes. Empezó en marzo de 2016 en Talca, una ciudad del sur de Chile. Una década después estamos en Noruega escribiendo código de WAF bajo la aurora boreal. No está mal.

Oslo valió la pena. Algunas decisiones son más rápidas en persona — como si la memoización debería estar activada por defecto, que es una conversación de cinco minutos, no tres semanas de comentarios en GitHub. Me alegra que lo hayamos hecho.

¡Más cosas pronto!

— Juan Pablo Tosso

{{< figure src="tromso.jpg" alt="Aurora boreal en Tromsø, Noruega" caption="Tromsø. Sí, fue así de bueno." >}}
