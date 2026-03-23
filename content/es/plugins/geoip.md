---
title : "GeoIP"
description: "Añade soporte de base de datos Maxmind GeoIP2 a Coraza"
lead: "Añade soporte de base de datos Maxmind GeoIP2 a Coraza"
date: 2020-10-06T08:48:23+00:00
lastmod: 2020-10-06T08:48:23+00:00
logo: false
author: Coraza Contributors
repo: https://github.com/corazawaf/coraza-geoip
official: true
compatibility: [v3.x]
---

## Introducción

Este plugin habilita la funcionalidad de búsqueda GeoIP para Coraza Web Application Firewall (WAF) mediante el uso de una base de datos GeoIP. Con esto, puede rastrear y filtrar solicitudes de forma eficiente en función de su origen geográfico.

## Características

- Integración sin fricciones con Coraza WAF.
- Mapeo eficiente de IP a ubicación geográfica.
- Acciones personalizables basadas en país, región o ciudad.

## Requisitos previos

- Coraza WAF instalado y configurado.
- Base de datos GeoIP (por ejemplo, MaxMind GeoLite2 o cualquier base de datos compatible).

## Instalación

1. Añada el módulo Go a su proyecto:

   ```bash
   go get github.com/corazawaf/coraza-geoip
   ```

2. Importe el plugin en su proyecto y configúrelo (tipos de base de datos admitidos: `country`, `city`):

   #### Usando un archivo de base de datos embebido (si el acceso al sistema de archivos local no está disponible, por ejemplo, WebAssembly)

   ```go
   import (
        _ "embed"
       geo "github.com/corazawaf/coraza-geoip"
   )

   //go:embed geoip-database.mmdb
   var geoIpDatabase []byte

   func init() {
       geo.RegisterGeoDatabase(geoIpDatabase, "country")
   }
   ```

   #### Usando un archivo de base de datos local

   ```go
      import (
        _ "embed"
       geo "github.com/corazawaf/coraza-geoip"
   )


   func init() {
       geo.RegisterGeoDatabaseFromFile("geoip-database.mmdb", "city")
   }
   ```

## Uso

Una vez configurado, Coraza WAF comenzará a utilizar la base de datos GeoIP para determinar la ubicación geográfica de las direcciones IP entrantes. A continuación, puede crear reglas para permitir, bloquear o registrar solicitudes según su origen geográfico.

Consulte también la [documentación de Coraza WAF sobre el uso de "@geoLookup"](https://coraza.io/docs/seclang/operators/#geolookup) y la [documentación sobre el uso de plugins](https://coraza.io/docs/tutorials/using-plugins/) para obtener más información.
