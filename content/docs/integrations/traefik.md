---
title: "Traefik"
description: "Integrate Coraza WAF with your Traefik implementation."
lead: "Use Coraza rules within your traefik projects."
date: 2020-11-16T13:59:39+01:00
lastmod: 2020-11-16T13:59:39+01:00
draft: false
images: []
menu:
  docs:
    parent: "integrations"
weight: 110
toc: true
---

**Important:** Coraza Traefik plugin is a draft and it's under development. Please send us your feedback!

**Important 2:** Coraza Traefik Plugin does not support CGO, hence it **does not** support OWASP CRS.

To learn how to use this plugin go to https://pilot.traefik.io/plugins and select **install**.

## Configuration directives

- **directives:** Write your Coraza rules as a string or multilien string.
- **include:**: Include a file containing Coraza rules, supports wildcards (*).