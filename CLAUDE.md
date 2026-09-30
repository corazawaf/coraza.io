# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

The official website for OWASP Coraza WAF (coraza.io), built with Hugo + Doks v2 (Thulite theme). Content is Markdown; a handful of Go CLI tools generate reference docs from the `corazawaf/coraza` source.

**Also read `AGENTS.md`** — it is the primary instructions file for this repo (multilingual content rules, writing style/tone per language, plugin/connector YAML schema, testing conventions, known pitfalls). This file only adds what AGENTS.md doesn't cover.

## Commands

```sh
npm install              # install JS deps
npm run dev               # Hugo dev server at localhost:1313
npm run build              # production build (minified)
npm test                   # Puppeteer tests in tests/navigation.test.js (needs dev server running on :1313)
go run mage.go generate    # regenerate seclang reference docs (directives/actions/operators/variables) from coraza source
go test ./tools/i18ncheck/...   # verify en/es content parity (also enforced in CI)
go test ./...                    # run all Go tests (tools/*gen have main_test.go)
```

Single Jest test: `npx jest tests/navigation.test.js -t "<test name>"`
Single Go test: `go run mage.go generate` runs all generators together (no per-tool flag); to test one generator directly: `go test ./tools/actionsgen/...` (or `directivesgen`, `operatorsgen`, `variablesgen`).

**Never `go build` the tools in `tools/`** — always `go run ./tools/<name>/...`. Building leaves stray binaries in the project tree that pollute `git status`. If you must build, output outside the repo (`go build -o /tmp/<name> ./tools/<name>/...`).

## Architecture

- `content/en/`, `content/es/` — Markdown content, mirrored 1:1 per AGENTS.md's translation rules. `content/en/docs/seclang/{directives,actions,operators,variables}.md` are generated, not hand-edited.
- `data/plugins.yaml`, `data/connectors.yaml` — plugin/connector registry (English only, not content pages). Rendered by `layouts/plugins/` and `layouts/connectors/`.
- `layouts/` — Hugo templates: `_partials/` (shared), `shortcodes/` (used in content Markdown), `plugins/`, `connectors/` (list/single views for the YAML-driven sections).
- `assets/{scss,js,svgs,images}/` — site assets processed by Hugo Pipes; `assets/js/` bundles are per-page/component, imported individually (see AGENTS.md's Bootstrap import pitfall).
- `tools/` — standalone Go programs (`directivesgen`, `actionsgen`, `operatorsgen`, `variablesgen`, `readmesync`, `i18ncheck`) invoked via `magefile.go`'s `Generate()` target. Each `*gen` tool reads Go source from `.vendor/github.com/corazawaf/coraza/v3` (populated by `go mod vendor -o .vendor`) and renders its `template.md` into `content/en/docs/seclang/`. `Generate()` also reverts any generated file whose only diff is a `lastmod:` timestamp change, to avoid noisy no-op diffs.
- `i18ncheck` is a test package (`tools/i18ncheck/i18ncheck_test.go`), not a CLI — it's run via `go test`, and asserts `content/en/` and `content/es/` have matching file trees.
- `config/_default/`, `config/production/`, `config/next/` — Hugo environment configs (base params, prod-specific overrides, an in-progress/next config).
- `tests/navigation.test.js` — Puppeteer smoke tests against a running dev server; extend when adding interactive UI or new pages/sections.
