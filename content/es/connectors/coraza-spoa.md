---
title : "HAProxy Coraza SPOA"
description: "Agente SPOE de Coraza para HAProxy."
lead: "Despliega Coraza WAF como agente SPOE de HAProxy para inspección de tráfico HTTP."
date: 2022-05-26T00:00:00+00:00
lastmod: 2022-05-26T00:00:00+00:00
draft: false
images: []
compatibility: []
repo: https://github.com/corazawaf/coraza-spoa
official: true
author: Coraza Contributors
logo: /images/connectors/haproxy.svg
weight: 100
---

Coraza SPOA es un demonio del sistema que integra el Firewall de Aplicaciones Web (WAF) Coraza como servicio de respaldo para HAProxy. Está escrito en Go, admite conjuntos de reglas ModSecurity SecLang y es 100 % compatible con el OWASP Core Rule Set v4.

HAProxy incluye un [Stream Processing Offload Engine](https://www.haproxy.com/blog/extending-haproxy-with-the-stream-processing-offload-engine) [SPOE](https://raw.githubusercontent.com/haproxy/haproxy/master/doc/SPOE.txt) para delegar el procesamiento de solicitudes a un Stream Processing Offload Agent (SPOA). Coraza SPOA incorpora el [Motor Coraza](https://github.com/corazawaf/coraza), carga el conjunto de reglas y filtra las solicitudes HTTP o las respuestas de la aplicación que HAProxy reenvía para su inspección.

## Compilación

### Build

El comando `go run mage.go build` compilará el código fuente y generará el ejecutable `coraza-spoa` dentro de la carpeta `build/`.

## Configuración

## Coraza SPOA

El archivo de configuración de ejemplo es [example/coraza-spoa.yaml](https://github.com/corazawaf/coraza-spoa/blob/main/example/coraza-spoa.yaml); puede copiarlo y modificar la información de configuración correspondiente. El servicio puede iniciarse ejecutando el siguiente comando:

```
coraza-spoa -config /etc/coraza-spoa/coraza-spoa.yaml
```

## HAProxy SPOE

Configure HAProxy para intercambiar mensajes con el SPOA. El archivo de configuración SPOE de ejemplo es [coraza.cfg](https://github.com/corazawaf/coraza-spoa/blob/main/example/haproxy/coraza.cfg); puede copiarlo y modificar la información de configuración correspondiente. El directorio predeterminado para colocar el archivo de configuración es `/etc/haproxy/coraza.cfg`.

```ini
# /etc/haproxy/coraza.cfg
spoe-agent coraza-agent
    ...
    use-backend coraza-spoa

spoe-message coraza-req
    args app=str(sample_app) id=unique-id src-ip=src ...
```

El nombre de aplicación definido en `config.yaml` debe coincidir con el nombre `app=`.

El backend definido en `use-backend` debe coincidir con un backend de `haproxy.cfg` que dirija las solicitudes al demonio SPOA accesible en `127.0.0.1:9000`.

En lugar del nombre de aplicación codificado `str(sample_app)`, puede utilizar variables de HAProxy; por ejemplo, el nombre del frontend `fe_name`.

## HAProxy

Configure HAProxy con un frontend que contenga una sentencia `filter` para reenviar las solicitudes al SPOA y denegar las peticiones en función de la acción devuelta. Añada también una sección de backend referenciada por `use-backend` en `coraza.cfg`.

```haproxy
# /etc/haproxy/haproxy.cfg
frontend web
    filter spoe engine coraza config /etc/haproxy/coraza.cfg
    ...
    http-request deny deny_status 403 hdr waf-block "request" if { var(txn.coraza.action) -m str deny }
    ...

backend coraza-spoa
    mode tcp
    option spop-check
    server s1 127.0.0.1:9000 check
```

Un ejemplo completo de configuración de HAProxy puede encontrarse en [example/haproxy/coraza.cfg](https://github.com/corazawaf/coraza-spoa/blob/main/example/haproxy/coraza.cfg).

Dado que en el archivo de configuración SPOE (coraza.cfg) se declara el uso del backend [coraza-spoa](https://github.com/corazawaf/coraza-spoa/blob/main/example/haproxy/coraza.cfg#L13) para comunicarse con el servicio, también es necesario definirlo en el [archivo de HAProxy](https://github.com/corazawaf/coraza-spoa/blob/main/example/haproxy/haproxy.cfg#L50).

Si desea acceder al servicio coraza-spoa desde otra máquina, recuerde modificar las directivas de red de enlace (IPAddressAllow/IPAddressDeny) en [contrib/coraza-spoa.service](https://github.com/corazawaf/coraza-spoa/blob/main/contrib/coraza-spoa.service).

## Registro de HAProxy

Para obtener visibilidad completa de las acciones del WAF directamente desde los registros de HAProxy, puede utilizar las variables de transacción exportadas por el agente Coraza-SPOA.

### Variables disponibles

El agente rellena las siguientes variables en el ámbito `txn`:

* **`txn.coraza.id`**: El identificador único de la transacción.
* **`txn.coraza.status`**: El código de estado HTTP determinado por el WAF (p. ej., 403).
* **`txn.coraza.anomaly_score`**: La puntuación de anomalía entrante total de la solicitud.
* **`txn.coraza.rules_hit`**: El recuento total de reglas de ataque activadas.
* **`txn.coraza.rule_ids`**: Una lista separada por comas de los IDs de regla activados (si está habilitado).
* **`txn.coraza.error`**: Contiene errores relacionados con SPOA si la transacción falla.

### Formatos de registro de ejemplo

Puede incorporar estas variables en la directiva `log-format` de `haproxy.cfg`.

**1. Seguimiento de puntuación estándar**
Use este formato para la monitorización general de niveles de amenaza y recuentos de reglas:

```haproxy
log-format "%ci:%cp\ [%t]\ %ft\ %b/%s\ %Th/%Ti/%TR/%Tq/%Tw/%Tc/%Tr/%Tt\ %ST\ %B\ %CC\ %CS\ %tsc\ %ac/%fc/%bc/%sc/%rc\ %sq/%bq\ %hr\ %hs\ %{+Q}r\ %[var(txn.coraza.id)]\ spoa-error:\ %[var(txn.coraza.error)]\ waf-hit:\ %[var(txn.coraza.status)]\ score:%[var(txn.coraza.anomaly_score)]\ rules_hit:%[var(txn.coraza.rules_hit)]"
```

**2. Depuración extendida (con IDs de regla)**
Use este formato si necesita identificar exactamente qué reglas se activaron para resolver falsos positivos.

> **Nota:** La exportación de los IDs de regla específicos requiere una activación explícita en la configuración de Coraza.
```coraza.cfg
spoe-message coraza-req

    args app= ... exportRuleIDs=bool(true)

spoe-message coraza-res

    args app= ... exportRuleIDs=bool(true)

  .....
```
```haproxy
log-format "%ci:%cp\ [%t]\ %ft\ %b/%s\ %Th/%Ti/%TR/%Tq/%Tw/%Tc/%Tr/%Tt\ %ST\ %B\ %CC\ %CS\ %tsc\ %ac/%fc/%bc/%sc/%rc\ %sq/%bq\ %hr\ %hs\ %{+Q}r\ %[var(txn.coraza.id)]\ spoa-error:\ %[var(txn.coraza.error)]\ waf-hit:\ %[var(txn.coraza.status)]\ rule_ids:\ %[var(txn.coraza.rule_ids)]\ rules-hit:\ %[var(txn.coraza.rules_hit)]"
```

### Reglas personalizadas y asignación de rangos de IDs

Para evitar conflictos con el OWASP Core Rule Set (CRS) y garantizar que el agente SPOA exporte métricas precisas a HAProxy (`rules_hit` y `rule_ids`), debe respetar estrictamente los siguientes rangos de IDs de regla para reglas locales:

* **Infraestructura y listas blancas (IDs: 100000 - 189999):** Use este rango para listas blancas de IP, desactivación de reglas CRS específicas o ajuste fino (p. ej., límites de GeoIP). Las reglas en este rango son **ignoradas intencionalmente** por el contador de ataques del agente SPOA para evitar falsos positivos en las métricas de HAProxy.
* **Reglas de ataque personalizadas y de refuerzo (IDs: 190000 - 199999):** Use este rango para bloqueos de seguridad reales y reglas de refuerzo personalizadas. Las reglas en este rango son monitorizadas activamente. Si se activan, incrementarán el contador `rules_hit` y sus IDs se exportarán en la variable `rule_ids`.

## Docker

- Compile la imagen coraza-spoa: `cd ./example ; docker compose build`
- Inicie haproxy, coraza-spoa y un servidor de prueba: `docker compose up`
- Realice una solicitud que sea bloqueada por el WAF: `curl http://localhost:8080/\?x\=/etc/passwd`
