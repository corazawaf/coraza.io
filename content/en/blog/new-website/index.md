---
title: "The Coraza Website, Rebuilt"
description: "After six years on the same setup, coraza.io gets a proper overhaul — same foundation, better structure, and open for translations."
date: 2026-03-23
draft: false
images: []
contributors: ["Juan Pablo Tosso"]
---

The Coraza website has been running on the same setup since around 2020. It did the job, but it was showing its age. We've given it a proper overhaul. If you're feeling nostalgic, here's [what it looked like before](https://web.archive.org/web/20260305214828/https://coraza.io/).

## Same Doks, Six Years Later

The site still runs on Hugo with the Doks theme, now upgraded to version 2 (built on Thulite). The core workflow hasn't changed — if you've contributed before, you'll feel right at home. What has changed is the theme itself: better navigation, a modern layout, and improved performance. The homepage got a full redesign to better showcase what Coraza does and how it fits into your stack.

## Plugins and Connectors: Now in YAML

This is probably the most practical change for contributors.

Previously, every plugin and connector had its own markdown page with frontmatter, descriptions, and layout boilerplate. Adding a new one meant copying an existing page, editing several fields, and hoping you got the template right. It was more ceremony than necessary for what is essentially a catalogue entry.

Now, all plugin and connector metadata lives in two YAML files: `data/plugins.yaml` and `data/connectors.yaml`. Adding a new plugin looks like this:

```yaml
- title: "My Plugin"
  lead: "What it does in one line."
  author: "Your Name"
  repo: "https://github.com/org/repo"
  official: false
  compatibility: ["v3.x"]
  logo: false
```

One entry, one PR. The site generates the listing pages automatically from the data. No templates to touch, no markdown files to create.

## Translations Are Open

We've added internationalisation support across the site. The homepage, navigation, and UI strings now use Hugo's i18n system, so every user-facing string can be translated without touching layout code.

Spanish is the first translation alongside English, and we're looking for contributors to help bring the documentation to more languages. The process is documented in the repository — you create the corresponding content files in `content/{lang}/` and add translation strings to `i18n/{lang}.toml`. CI checks enforce that all languages have the same file structure, so nothing falls through the cracks.

If you're a native speaker of any language and want to help make Coraza more accessible, we'd welcome your contribution.

## What Changed

- Homepage fully redesigned and internationalised
- Plugin and connector pages replaced with a data-driven YAML approach
- Theme upgraded to Doks v2 (Thulite)
- Content parity between languages enforced in CI
- Easier contribution workflow for both content and translations

The source is on [GitHub](https://github.com/corazawaf/coraza.io). PRs are welcome.
