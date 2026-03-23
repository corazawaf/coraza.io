# Agent Instructions for coraza.io

## Multilingual Content

This site supports multiple languages. Content is written in English first, and AI agents (GitHub Copilot, Claude, etc.) are responsible for generating and maintaining translations. Maintainers review translation quality.

### Language directories

- `content/en/` — English (default, source of truth)
- `content/es/` — Spanish (Spain)

### Rules

1. **When adding a new page**, create the file in `content/en/` first. Then create the translated version in all other language directories with the same path.
2. **When deleting a page**, remove it from all language directories.
3. **When modifying structure** (renaming files, moving sections, changing front matter keys like `weight`, `draft`, `toc`), apply the same structural changes to all languages.
4. **When modifying code examples**, apply to all languages — code is language-neutral.
5. **Translation of prose** is expected to differ between languages, but the file must exist in every language directory.
6. **Generated files** (`directives.md`, `actions.md`, `operators.md`) are generated into `content/en/` by the Go tools in `tools/`. After regeneration, the Spanish versions must be updated too (see Translation Workflow below).

### Writing Style and Tone

This is a technical documentation site for a security engineering project. Write like an engineer talking to other engineers — direct, precise, and grounded in how things actually work.

#### General principles (all languages)

- **Be direct.** State what something does, how to use it, and what to watch out for. No filler, no preamble, no "In this section we will explore...".
- **Be specific.** Use concrete terms: function names, file paths, config keys, error messages. Vague descriptions help nobody.
- **Be honest about limitations.** If something is experimental, has known issues, or requires specific conditions, say so plainly. Don't hedge with marketing language.
- **No AI voice.** Do not write like a chatbot. Avoid phrases like "It's important to note that...", "This powerful feature allows you to...", "Simply run the following command...", "Let's dive into...". Just explain the thing.
- **No unnecessary enthusiasm.** Words like "easily", "seamlessly", "robust", "leverage", "empower" add nothing. Describe behaviour, not feelings about behaviour.
- **Assume competence.** The reader knows what a reverse proxy is, what Go modules are, and how HTTP works. Don't explain prerequisites that any engineer deploying a WAF would already know. Do explain things specific to Coraza.
- **Prefer short sentences.** One idea per sentence. If a sentence has three commas and a semicolon, split it.
- **Use active voice.** "The module loads rules from the file" not "The rules are loaded from the file by the module".
- **Structure with headers and code blocks.** Engineers scan documentation. Use headings to let them jump to what they need. Put commands and config in fenced code blocks with the correct language tag.

#### English (British)

- **Variant**: British English. Use British spelling: "behaviour" not "behavior", "colour" not "color", "initialise" not "initialize", "catalogue" not "catalog", "licence" (noun) not "license".
- **Punctuation**: Use Oxford commas. Place punctuation outside quotation marks unless it is part of the quoted material.
- **Tone**: Dry, factual, technical. Think man pages and RFCs, not blog posts. It is fine to be terse.
- **Contractions**: Acceptable in prose ("don't", "isn't", "you'll"). Avoid in headings.

#### Spanish (Spain — castellano)

- **Variant**: Peninsular Spanish (Spain), not Latin American. Use "vosotros" forms where appropriate, not "ustedes". Use "ordenador" not "computadora", "fichero" not "archivo" (for file in system context).
- **Register**: Formal technical register, but not stiff. Address the reader with "tú" in tutorials and guides, "se" impersonal constructions in reference documentation.
- **Accents are mandatory**: á, é, í, ó, ú, ñ, ü — always. Missing accents are bugs.
- **Technical terms stay in English**: ModSecurity, SecLang, WAF, Coraza, Go, proxy, middleware, plugin, reverse proxy, request, response, header, body, etc. Do not invent Spanish translations for established English technical terms. When introducing a term for the first time, you may add a brief parenthetical explanation in Spanish if it aids clarity.
- **Sentence structure**: Spanish naturally runs longer than English. That's fine, but still prefer clarity over elegance. Break up run-on sentences. Don't nest three subordinate clauses.
- **No literal translation.** Translate the meaning, not the words. English technical writing is terse; Spanish needs different phrasing to sound natural. Restructure sentences to flow in Spanish rather than mirroring English word order.
- **Articles and prepositions**: Spanish requires more articles than English. Don't drop them for brevity — "el módulo carga las reglas" not "módulo carga reglas".

### Translation Mechanics

- **Code identifiers** (directive names, variable names, action names, operator names) are never translated.
- **Code blocks** are never translated — they are language-neutral.
- **Front matter keys** stay in English; only translate their string **values** (`title`, `description`, `lead`).
- **Hugo shortcodes** (`{{</* callout */>}}`, etc.) are preserved exactly as-is.
- **URLs and links** are not translated, but internal links within Spanish content should use the `/es/` prefix where appropriate.

### Translation Workflow

#### New or modified English content

When English content changes, the corresponding translations must be updated to match:

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
- **AI agents are responsible for producing translations. Maintainers are responsible for reviewing them.**

### Validation

Run the content parity test to verify all languages have the same file structure:

```sh
go test ./tools/i18ncheck/...
```

This test is also enforced in CI via GitHub Actions.

## Plugins and Connectors

Plugin and connector metadata lives in YAML data files, **not** as individual content pages. The data is always in English and is not translated.

### Files

- `data/plugins.yaml` — list of all plugins
- `data/connectors.yaml` — list of all connectors

### Adding a plugin or connector

Add a new entry to the appropriate YAML file with these fields:

```yaml
- title: "Name"
  lead: "One-line description."
  author: "Author or Organization"
  repo: "https://github.com/org/repo"
  official: false       # true only if maintained by the Coraza project
  compatibility: ["v3.x"]
  logo: false           # or "/images/connectors/name.svg" for connectors
```

For connectors with a logo, place the SVG in `static/images/connectors/`.

### What IS translated

Only the listing page titles and descriptions are translated. These live in the `_index.md` files:

- `content/en/plugins/_index.md` / `content/es/plugins/_index.md`
- `content/en/connectors/_index.md` / `content/es/connectors/_index.md`

### What is NOT translated

The YAML data files (`data/plugins.yaml`, `data/connectors.yaml`) are always in English. Individual plugin/connector names, descriptions, and author names stay in English across all locales.

## Go Tooling

### Do not build binaries inside the project directory

The Go tools in `tools/` (e.g. `readmesync`, `directivesgen`, `actionsgen`, `operatorsgen`, `i18ncheck`) must **never** have their binaries built or placed inside the project tree. Use `go run ./tools/<name>/...` instead of `go build`. If you must build, output to a temporary directory outside the project (e.g. `go build -o /tmp/<name> ./tools/<name>/...`).

Stray binaries pollute the git status and risk being committed. The `.gitignore` blocks common patterns, but prevention is better than cleanup.
