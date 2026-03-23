# coraza.io

The official website for [OWASP Coraza Web Application Firewall](https://coraza.io).

Built with [Hugo](https://gohugo.io/) and [Doks v2](https://getdoks.org/) (Thulite).

## Prerequisites

- [Node.js](https://nodejs.org/) >= 20
- [Go](https://golang.org/) >= 1.24 (for content generators)

## Development

```sh
npm install
npm run dev
```

## Build

```sh
npm run build
```

## Adding Plugins and Connectors

Plugins and connectors are defined as YAML data files, not as individual content pages. Their data is always in English regardless of the site locale.

### Adding a plugin

Add an entry to `data/plugins.yaml`:

```yaml
- title: "My Plugin"
  lead: "Short description of what it does."
  author: "Author Name"
  repo: "https://github.com/org/repo"
  official: false
  compatibility: ["v3.x"]
  logo: false
```

### Adding a connector

Add an entry to `data/connectors.yaml`:

```yaml
- title: "My Connector"
  lead: "Short description of what it does."
  author: "Author Name"
  repo: "https://github.com/org/repo"
  official: false
  compatibility: ["v3.x"]
  logo: "/images/connectors/my-connector.svg"
```

If you provide a `logo`, place the SVG file in `static/images/connectors/`. Set `logo` to `false` if there is no logo.

### Fields

| Field           | Description                                      |
|-----------------|--------------------------------------------------|
| `title`         | Display name                                     |
| `lead`          | One-line description shown on the card           |
| `author`        | Author or organization name                      |
| `repo`          | GitHub repository URL                            |
| `official`      | `true` if maintained by the Coraza project       |
| `compatibility` | List of compatible Coraza versions (e.g. `v3.x`) |
| `logo`          | Path to SVG logo or `false`                      |

### Languages

Plugin and connector data is **not translated** — it stays in English in the YAML files. Only the listing page titles and descriptions (`content/{lang}/plugins/_index.md` and `content/{lang}/connectors/_index.md`) are translated per locale.

## Content generators

The seclang reference docs (directives, actions, operators) are auto-generated from the Coraza Go source:

```sh
go run mage.go generate
```

## License

Apache 2.0 - see [LICENSE](LICENSE).
