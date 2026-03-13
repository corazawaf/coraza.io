# Agent Instructions for coraza.io

## Multilingual Content

This site supports multiple languages. All content changes **must** be applied to every language directory:

- `content/en/` — English (default)
- `content/es/` — Spanish (Spain)

### Rules

1. **When adding a new page**, create the file in all language directories with the same path.
2. **When deleting a page**, remove it from all language directories.
3. **When modifying structure** (renaming files, moving sections, changing front matter keys like `weight`, `draft`, `toc`), apply the same structural changes to all languages.
4. **When modifying code examples**, apply to all languages — code is language-neutral.
5. **Translation of prose** is expected to differ between languages, but the file must exist in every language directory.
6. **Generated files** (`directives.md`, `actions.md`, `operators.md`) are generated into `content/en/` by the Go tools in `tools/`. After regeneration, the Spanish versions must be updated too (see Translation Workflow below).

### Translation Style

- **Spanish variant**: Spain (castellano), formal technical tone.
- **Accents are mandatory**: always use proper tildes — á, é, í, ó, ú, ñ, ü.
- **Technical terms** stay in English: ModSecurity, SecLang, WAF, Coraza, Go, proxy, middleware, plugin, etc.
- **Code identifiers** (directive names, variable names, action names, operator names) are never translated.
- **Code blocks** are never translated — they are language-neutral.
- **Front matter keys** stay in English; only translate their string **values** (`title`, `description`, `lead`).
- **Hugo shortcodes** (`{{</* callout */>}}`, etc.) are preserved exactly as-is.
- **URLs and links** are not translated, but internal links within Spanish content should use the `/es/` prefix where appropriate.

### Translation Workflow

#### New or modified English content

When English content changes, the Spanish translation must be updated to match:

1. Make the change in `content/en/`.
2. Open the corresponding file in `content/es/`.
3. Apply the same structural changes (new sections, removed sections, updated code blocks).
4. Translate any new or changed prose into Spanish (Spain).
5. Run `go test ./tools/i18ncheck/...` to verify file parity.

#### Generated files

The Go tools in `tools/` generate `directives.md`, `actions.md`, and `operators.md` into `content/en/` only.

After regeneration:

1. Run `go run mage.go generate` — this updates `content/en/docs/seclang/{directives,actions,operators}.md`.
2. For each generated file, diff the new English version against the current Spanish version.
3. Apply structural changes (new entries, removed entries, updated code examples) to the Spanish file.
4. Translate any new descriptive text into Spanish.
5. Do **not** simply overwrite the Spanish file with the English one — that would lose all translations.

#### Keeping translations in sync

- Every PR that touches `content/en/` files must also update the corresponding `content/es/` files.
- If a PR only changes code examples or front matter structure, the Spanish file can be updated mechanically (same change).
- If a PR changes prose, the Spanish file needs a proper translation of the changed text.
- The CI parity check (`go test ./tools/i18ncheck/...`) ensures no files are missing, but does **not** check translation quality or staleness.

### Validation

Run the content parity test to verify all languages have the same file structure:

```sh
go test ./tools/i18ncheck/...
```

This test is also enforced in CI via GitHub Actions.

## Go Tooling

### Do not build binaries inside the project directory

The Go tools in `tools/` (e.g. `readmesync`, `directivesgen`, `actionsgen`, `operatorsgen`, `i18ncheck`) must **never** have their binaries built or placed inside the project tree. Use `go run ./tools/<name>/...` instead of `go build`. If you must build, output to a temporary directory outside the project (e.g. `go build -o /tmp/<name> ./tools/<name>/...`).

Stray binaries pollute the git status and risk being committed. The `.gitignore` blocks common patterns, but prevention is better than cleanup.
