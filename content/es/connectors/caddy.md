---
title : "Caddy"
description: "Módulo de Coraza WAF para el servidor web Caddy."
lead: "Despliega Coraza WAF como un módulo de Caddy para protección HTTP y de proxy inverso."
date: 2020-10-06T08:48:45+00:00
lastmod: 2020-10-06T08:48:45+00:00
draft: false
images: []
repo: https://github.com/corazawaf/coraza-caddy
official: true
compatibility: [v3.x]
author: Coraza Contributors
logo: /images/connectors/caddy.svg
---

El módulo de Caddy de [OWASP Coraza](https://github.com/corazawaf/coraza) proporciona capacidades de Web Application Firewall para Caddy.

OWASP Coraza WAF es 100 % compatible con OWASP Coreruleset y la sintaxis de Modsecurity.

## Primeros pasos

`go run mage.go -l` muestra todos los comandos disponibles:

```bash
▶ go run mage.go -l
Targets:
  buildCaddy        builds the plugin.
  buildCaddyLinux   builds the plugin with GOOS=linux.
  buildExample       builds the example deployment.
  check              runs lint and tests.
  coverage           runs tests with coverage and race detector enabled.
  doc                runs godoc, access at http://localhost:6060
  e2e                runs e2e tests with a built plugin against the example deployment.
  format             formats code in this repository.
  ftw                runs CRS regressions tests.
  lint               verifies code quality.
  precommit          installs a git hook to run check when committing
  reloadExample      reload the test environment.
  runExample         spins up the test environment, access at http://localhost:8080.
  teardownExample    tears down the test environment.
  test               runs all tests.
```

## Sintaxis del plugin

```caddy
coraza_waf {
 directives `
  Include /path/to/config.conf
  SecAction "id:1,pass,log"
 `
}
```

Ejemplo de uso:

**Importante:** `order coraza_waf first` debe incluirse siempre en tu Caddyfile para que el módulo de Coraza funcione correctamente.

```caddy
{
    order coraza_waf first
}

http://127.0.0.1:8080 {
 coraza_waf {
  directives `
   SecAction "id:1,pass,log"
   SecRule REQUEST_URI "/test5" "id:2, deny, log, phase:1"
   SecRule REQUEST_URI "/test6" "id:4, deny, log, phase:3"
   Include file1.conf
   Include file2.conf
   Include /some/path/*.conf
  `
 }
 reverse_proxy http://192.168.1.15:8080
}
```

## Compilar Caddy con Coraza WAF

Ejecuta:

```shell
xcaddy build --with github.com/corazawaf/coraza-caddy/v2
```

## Pruebas

Puedes ejecutar la suite de pruebas con el siguiente comando:

```shell
go run mage.go test
```

## Usar OWASP Core Ruleset

Puedes cargar OWASP CRS indicando el campo `load_owasp_crs` y a continuación cargando los archivos CRS en las directivas tal como se describe en la documentación de [coraza-coreruleset](https://github.com/corazawaf/coraza-coreruleset).

```caddy
:8080 {
 coraza_waf {
  load_owasp_crs
  directives `
   Include @coraza.conf-recommended
   Include @crs-setup.conf.example
   Include @owasp_crs/*.conf
   SecRuleEngine On
  `
 }

 reverse_proxy httpbin:8081
}
```

## Ejecutar el ejemplo

### Docker

```bash
go run mage.go buildExample runExample
curl -i localhost:8080/
```

### Local

```bash
# en la terminal 1
go run github.com/mccutchen/go-httpbin/v2/cmd/go-httpbin@v2.9.0 -port 8081

# en la terminal 2
go run mage.go buildCaddy
./build/caddy run --config example/Caddyfile --adapter caddyfile

# en la terminal 3
curl -i localhost:8080/
```

## Responder con un mensaje o página HTML personalizada

Para responder con un mensaje o página HTML personalizada, puedes aprovechar la directiva [handle_errors](https://caddyserver.com/docs/caddyfile/directives/handle_errors):

```caddy
handle_errors 403 {
 header X-Blocked "true"
 respond "Your request was blocked. Request ID: {http.request.header.x-request-id}"
}
```
o
```caddy
handle_errors {
 @block_codes `{err.status_code} in [403]`
 handle @block_codes {
  root    * /path/to/html/dir
  rewrite * /{err.status_code}.html
  file_server
 }
}
```

Es posible usar la directiva [templates](https://caddyserver.com/docs/caddyfile/directives/templates) para renderizar datos de forma dinámica. Consulta el archivo [`example/403.html`](https://github.com/corazawaf/coraza-caddy/blob/main/example/403.html) para ver un ejemplo.
