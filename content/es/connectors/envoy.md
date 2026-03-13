---
title : "Envoy"
description: "Plugin de filtro HTTP Coraza WAF para Envoy proxy."
lead: "Plugin de filtro HTTP Web Application Firewall para Envoy que aprovecha el motor Coraza WAF."
date: 2024-01-01T00:00:00+00:00
lastmod: 2024-01-01T00:00:00+00:00
draft: false
images: []
repo: https://github.com/united-security-providers/coraza-envoy-go-filter
official: false
sync: false
compatibility: [v3.x]
author: United Security Providers
logo: /images/connectors/envoy.svg
---

Un plugin de filtro HTTP Web Application Firewall (WAF) para Envoy que aprovecha el motor [Coraza](https://coraza.io/) WAF para proporcionar seguridad en capa 7 para aplicaciones web.

Para más información, consulta el [listado en Built on Envoy](https://builtonenvoy.io/extensions/coraza-waf/).

## Capacidades principales

- Integración con **OWASP ModSecurity Core Rule Set (CRS)** para protección contra ataques web comunes
- Inspección de solicitudes para identificar patrones maliciosos y anomalías
- Inspección de respuestas para prevenir fugas de datos
- Motor de reglas personalizable con soporte para políticas de seguridad a medida
- Modos de operación incluyendo solo detección y bloqueo activo
- Registro de auditoría detallado para eventos de seguridad

## Configuración

El WAF soporta la configuración de OWASP ModSecurity Core Rule Set. Ejemplo habilitando el modo de bloqueo activo con reglas CRS para detectar y prevenir ataques de inyección SQL:

```yaml
filter_chains:
  - filters:
    - name: envoy.filters.network.http_connection_manager
      typed_config:
        "@type": type.googleapis.com/envoy.extensions.filters.network.http_connection_manager.v3.HttpConnectionManager
        stat_prefix: ingress_http
        http_filters:
          - name: envoy.filters.http.golang
            typed_config:
              "@type": type.googleapis.com/envoy.extensions.filters.http.golang.v3alpha.Config
              library_id: coraza-waf
              library_path: /etc/envoy/coraza-waf.so
              plugin_name: coraza-waf
              plugin_config:
                "@type": type.googleapis.com/xds.type.v3.TypedStruct
                value:
                  directives: |
                    {
                      "waf1": {
                        "simple_directives": [
                          "SecRuleEngine On",
                          "Include @coraza.conf-recommended",
                          "Include @crs-setup.conf.example",
                          "Include @owasp_crs/*.conf"
                        ]
                      }
                    }
                  default_directive: "waf1"
```

El plugin puede desplegarse con configuraciones de reglas personalizadas adaptadas a requisitos de seguridad específicos.
