---
title: "Introducción"
description: "Introducción a Coraza Web Application Firewall. Comienza a proteger tus aplicaciones web en unos pocos pasos."
lead: "Bienvenido a Coraza Web Application Firewall, este proyecto es un port en Golang de ModSecurity con el objetivo de convertirse en el primer Web Application Firewall de código abierto de nivel empresarial, lo suficientemente flexible y potente para servir como base para muchos proyectos."
date: 2020-10-06T08:48:57+00:00
lastmod: 2020-10-06T08:48:57+00:00
draft: false
images: []
weight: 100
toc: true
---

<h1>
  <img src="https://coraza.io/images/logo_shield_only.png" align="left" height="46px" alt=""/>&nbsp;
  <span>Coraza - Web Application Firewall</span>
</h1>

<a href="https://github.com/corazawaf/coraza/actions/workflows/regression.yml"><img src="https://github.com/corazawaf/coraza/actions/workflows/regression.yml/badge.svg" alt="Regression Tests"></a>
<a href="#"><img src="https://img.shields.io/badge/Coreruleset%20Compatibility-100%25-brightgreen" alt="Coreruleset Compatibility"></a>
<a href="https://github.com/corazawaf/coraza/actions/workflows/codeql-analysis.yml"><img src="https://github.com/corazawaf/coraza/actions/workflows/codeql-analysis.yml/badge.svg" alt="CodeQL"></a>
<a href="https://codecov.io/gh/corazawaf/coraza"><img src="https://codecov.io/gh/corazawaf/coraza/branch/v3/dev/graph/badge.svg?token=6570804ZC7" alt="codecov"></a>
<a href="https://www.repostatus.org/#active"><img src="https://www.repostatus.org/badges/latest/active.svg" alt="Project Status: Active"></a>
<a href="https://owasp.org/www-project-coraza-web-application-firewall"><img src="https://img.shields.io/badge/owasp-lab%20project-brightgreen" alt="OWASP Lab Project"></a>
<a href="https://godoc.org/github.com/corazawaf/coraza/v3"><img src="https://godoc.org/github.com/corazawaf/coraza?status.svg" alt="GoDoc"></a>

Coraza es un Web Application Firewall (WAF) de código abierto, nivel empresarial y alto rendimiento, listo para proteger tus aplicaciones más preciadas. Esta escrito en Go, soporta conjuntos de reglas ModSecurity SecLang y es 100% compatible con el OWASP Core Rule Set.

* Sitio web: https://coraza.io
* Foro: [Discusiones en Github](https://github.com/corazawaf/coraza/discussions)
* Comunidad OWASP en Slack (#coraza): https://owasp.org/slack/invite
* Prueba de reglas: [Coraza Playground](https://playground.coraza.io)

<br/>

Características principales:

* ⇲ **Reemplazo directo** - Coraza es un motor alternativo que tiene compatibilidad parcial con ~Trustwave~[OWASP ModSecurity Engine](https://github.com/owasp-modsecurity/modsecurity/) y soporta conjuntos de reglas SecLang estándar de la industria.

* 🔥 **Seguridad** - Coraza ejecuta el [OWASP CRS](https://coreruleset.org) para proteger tus aplicaciones web de una amplia gama de ataques, incluyendo el OWASP Top Ten, con un mínimo de falsas alertas. CRS protege contra muchas categorías de ataques comunes, incluyendo Inyección SQL (SQLi), Cross Site Scripting (XSS), Inyección de código PHP y Java, HTTPoxy, Shellshock, Detección de Scripts/Escáner/Bots y Fugas de Metadatos y Errores.

* 🔌 **Extensible** - Coraza es una biblioteca en su núcleo, con muchas integraciones para desplegar instancias de Web Application Firewall en tus propias instalaciones. Registradores de auditoría, motores de persistencia, operadores, acciones, crea tus propias funcionalidades para extender Coraza tanto como desees.

* 🚀 **Rendimiento** - Desde sitios web enormes hasta blogs pequeños, Coraza puede manejar la carga con un impacto mínimo en el rendimiento. Consulta nuestros [Benchmarks](https://coraza.io/docs/reference/benchmarks)

* ﹡ **Simplicidad** - Cualquier persona puede entender y modificar el código fuente de Coraza. Es fácil extender Coraza con nuevas funcionalidades.

* 💬 **Comunidad** - Coraza es un proyecto comunitario, se aceptan contribuciones y todas las ideas serán consideradas. Encuentra la guia para contribuir en el documento [CONTRIBUTION](https://github.com/corazawaf/coraza/blob/main/CONTRIBUTING.md).

<br/>

## Integraciones

El Proyecto Coraza mantiene implementaciones y plugins para los siguientes servidores:

* [Plugin para Caddy Reverse Proxy y Webserver](https://github.com/corazawaf/coraza-caddy) - estable, necesita mantenedor
* [Extension Proxy WASM](https://github.com/corazawaf/coraza-proxy-wasm) para proxies con soporte proxy-wasm (ej. Envoy) - estable, aun en desarrollo
* [Plugin HAProxy SPOE](https://github.com/corazawaf/coraza-spoa) - vista previa
* [Plugin para Traefik Proxy](https://github.com/jptosso/coraza-traefik) - vista previa, necesita mantenedor
* [Middleware para Gin Web Framework](https://github.com/jptosso/coraza-gin) - vista previa, necesita mantenedor
* [Apache HTTP Server](https://github.com/corazawaf/coraza-server) - experimental
* [Nginx](https://github.com/corazawaf/coraza-server) - experimental
* [Biblioteca C de Coraza](https://github.com/corazawaf/libcoraza) - experimental

## Plugins

* [Coraza GeoIP](https://github.com/corazawaf/coraza-geoip) (vista previa)

## Requisitos previos

* Compilador Golang v1.18+
* Distribucion Linux (Debian o Centos recomendado) o Mac. Windows aun no esta soportado.


## Uso de Coraza Core

Coraza puede usarse como biblioteca para tu programa en Go para implementar un middleware de seguridad o integrarlo con aplicaciones y servidores web existentes.

```go
package main

import (
	"fmt"
	"github.com/corazawaf/coraza/v3"
)

func main() {
	// First we initialize our waf and our seclang parser
	waf, err := coraza.NewWAF(coraza.NewWAFConfig().
		WithDirectives(`SecRule REMOTE_ADDR "@rx .*" "id:1,phase:1,deny,status:403"`))
	// Now we parse our rules
	if err != nil {
		fmt.Println(err)
	}

	// Then we create a transaction and assign some variables
    tx := waf.NewTransaction()
	defer func() {
		tx.ProcessLogging()
		tx.Close()
	}()
	tx.ProcessConnection("127.0.0.1", 8080, "127.0.0.1", 12345)

	// Finally we process the request headers phase, which may return an interruption
	if it := tx.ProcessRequestHeaders(); it != nil {
		fmt.Printf("Transaction was interrupted with status %d\n", it.Status)
	}
}
```
[Examples/http-server](./examples/http-server/) proporciona un ejemplo para practicar con Coraza.

### Etiquetas de compilación

Las etiquetas de compilación de Go pueden ajustar ciertas funcionalidades en tiempo de compilación. Estas son solo para casos de uso avanzados y no tienen garantías de compatibilidad entre versiones menores - usar con precaución.

- coraza.disabled_operators.* - excluye el operador especificado de la compilación. Particularmente útil si se sobreescribe el operador con `operators.Register` para reducir el tamano del binario / la sobrecarga de inicio.
- `coraza.rule.multiphase_valuation` - habilita la evaluación de variables de reglas en las fases en que estan listas, no solo en la fase para la que la regla esta definida.

## Herramientas

* [Go FTW](https://github.com/coreruleset/go-ftw): Motor de pruebas de reglas
* [Coraza Playground](https://playground.coraza.io/): Interfaz web sandbox para probar reglas
* [OWASP Core Ruleset](https://github.com/coreruleset/coreruleset/): Excelente conjunto de reglas, compatible con Coraza

## Desarrollo

Coraza solo requiere Go para el desarrollo. Puedes ejecutar `mage.go` para emitir comandos de desarrollo.

Ver la lista de comandos

```shell
go run mage.go -l
```

Por ejemplo, para formatear tu código antes de enviarlo, ejecuta

```shell
go run mage.go format
```

## Contribuir

Las contribuciones son bienvenidas! Por favor consulta [CONTRIBUTING.md](./CONTRIBUTING.md) para orientación.

## Agradecimientos

* Al equipo de Modsecurity por crear ModSecurity
* Al equipo de OWASP Coreruleset por el CRS y su ayuda

### Empresas/Productos que usan Coraza

* [Traefik](https://owasp.org/blog/2024/03/19/traefik_owasp)
* [United Security Providers AG](https://www.united-security-providers.ch/)
* [Ambassador Labs](https://www.getambassador.io/docs/edge-stack/latest/howtos/web-application-firewalls)
* [Apache APISIX](https://apisix.apache.org/blog/2023/09/08/APISIX-integrates-with-Coraza/)
* [Wallarm API Firewall](https://github.com/wallarm/api-firewall)

### Coraza en X/Twitter

- [@corazaio](https://twitter.com/corazaio)

## Donaciones

Para donaciones, consulta el [sitio de donaciones](https://owasp.org/donate/?reponame=www-project-coraza-web-application-firewall&title=OWASP+Coraza+Web+Application+Firewall)

## Gracias a todas las personas que han contribuido

No podriamos haberlo logrado sin ustedes!

<a href="https://github.com/corazawaf/coraza/graphs/contributors">
<img src="https://contrib.rocks/image?repo=corazawaf/coraza" />
</a>

Hecho con [contrib.rocks](https://contrib.rocks).
