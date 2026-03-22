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

## Content generators

The seclang reference docs (directives, actions, operators) are auto-generated from the Coraza Go source:

```sh
go run mage.go generate
```

## License

Apache 2.0 - see [LICENSE](LICENSE).
