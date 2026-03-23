## Copilot Instructions for coraza.io

Before working on this repository, read the full project conventions in [AGENTS.md](../AGENTS.md) at the repository root. It contains all rules for:

- **Multilingual content**: how translations work, which directories to update, translation style guidelines
- **Plugins and connectors**: how to add/modify entries in the YAML data files
- **Go tooling**: how to run generators and tests

### Your primary responsibilities

1. **Keep translations in sync.** When English content in `content/en/` is added or modified, generate the corresponding Spanish translation in `content/es/` following the translation style rules in AGENTS.md.
2. **Do not translate plugin/connector data.** The files `data/plugins.yaml` and `data/connectors.yaml` are always in English. Only the `_index.md` listing pages have translated versions.
3. **Translate prose, not code.** Code blocks, front matter keys, Hugo shortcodes, and technical identifiers stay in English. Only translate the human-readable text values.
4. **Maintainers review translations.** You produce the translations; maintainers verify quality and accuracy before merging.

### On PR reviews

When reviewing a pull request, if you notice that content was added or modified in `content/en/` but the corresponding `content/es/` file is missing or was not updated, **suggest adding the translation file** as part of the review. Flag it as a required change — every English content file must have a Spanish counterpart.
