---
title : "Coraza Core Ruleset"
description: "Embeds the OWASP Core Rule Set for easy integration with Coraza"
lead: "Embeds the OWASP Core Rule Set and recommended Coraza configuration as a Go package, eliminating the need for manual file management."
date: 2024-01-01T00:00:00+00:00
lastmod: 2024-01-01T00:00:00+00:00
logo: false
author: Coraza Contributors
repo: https://github.com/corazawaf/coraza-coreruleset
official: true
compatibility: [v3.x]
---

Coraza Coreruleset is a Go package meant to provide the [OWASP CRS](https://github.com/coreruleset/coreruleset) in an easy and consumable way to be embedded in a Go application. Alongside the unmodified CRS, the [Coraza configuration file](https://github.com/corazawaf/coraza/blob/main/coraza.conf-recommended) is also provided.
## Usage

In order to use CRS, you need to load the coreruleset FileSystem:

```go
import "github.com/corazawaf/coraza-coreruleset/v4"

func main() {
    // ...
    waf, err := coraza.NewWAF(
        coraza.NewWAFConfig().
            WithDirectives("Include @owasp_crs/REQUEST-911-METHOD-ENFORCEMENT.conf").
            WithRootFS(coreruleset.FS),
    )
    // ...
}
```

You can also combine both CRS and your local files by combining the filesystems:

```go
import (
    "github.com/corazawaf/coraza-coreruleset/v4"
    "github.com/jcchavezs/mergefs"
    "github.com/jcchavezs/mergefs/io"
 )

// ...

func main() {
    // ...
    waf, err := coraza.NewWAF(
        coraza.NewWAFConfig().
            WithDirectives(`
                Include @owasp_crs/REQUEST-911-METHOD-ENFORCEMENT.conf
                Include my/local/rule.conf
            `).
            WithRootFS(mergefs.Merge(coreruleset.FS, io.OSFS)),
    )
    // ...
}
```

## How to update to a newer CRS and Coraza config version

1. Update the `crsVersion` and `corazaVersion` constants in [`version.go`](/version.go) with the wished [CRS](https://github.com/coreruleset/coreruleset) and [Coraza](https://github.com/corazawaf/coraza) commit SHA or tags.
2. Run `go run mage.go downloadDeps`.
3. Double check the changes made under the `/rules` and `/tests` directories.
3. Commit your changes.
