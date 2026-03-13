---
title : "Envoy"
description: "Coraza WAF HTTP filter plugin for Envoy proxy."
lead: "Web Application Firewall HTTP filter plugin for Envoy that leverages the Coraza WAF engine."
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

A Web Application Firewall (WAF) HTTP filter plugin for Envoy that leverages the [Coraza](https://coraza.io/) WAF engine to provide layer 7 security for web applications.

For more information, see the [Built on Envoy listing](https://builtonenvoy.io/extensions/coraza-waf/).

## Core capabilities

- **OWASP ModSecurity Core Rule Set (CRS)** integration for protection against common web attacks
- Request inspection to identify malicious patterns and anomalies
- Response inspection to prevent data leakage
- Customizable rule engine supporting tailored security policies
- Operating modes including detection-only and active blocking
- Detailed audit logging for security events

## Configuration

The WAF supports OWASP ModSecurity Core Rule Set configuration. Example enabling active blocking mode with CRS rules to detect and prevent SQL injection attacks:

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

The plugin can be deployed with custom rule configurations tailored to specific security requirements.
