// Copyright 2023 The OWASP Coraza contributors
// SPDX-License-Identifier: Apache-2.0

package main

import (
	"bufio"
	"bytes"
	_ "embed"
	"go/ast"
	"go/parser"
	"go/token"
	"html"
	"html/template"
	"log"
	"os"
	"path"
	"regexp"
	"sort"
	"strings"
	"time"
)

type Page struct {
	LastModification string
	Directives       []Directive
}

type Directive struct {
	Name             string
	Description      string
	Syntax           string
	Default          string
	Date             string
	LastModification string
	Content          string
}

//go:embed template.md
var contentTemplate string

const dstFile = "./content/en/docs/seclang/directives.md"

func main() {
	tmpl, err := template.New("directive").Funcs(template.FuncMap{"codeSpan": codeSpan}).Parse(contentTemplate)
	if err != nil {
		log.Fatal(err)
	}

	filepath := path.Join(os.Args[1], "internal/seclang/directives.go")
	src, err := os.ReadFile(filepath)
	if err != nil {
		log.Fatal(err)
	}

	fset := token.NewFileSet()
	f, err := parser.ParseFile(fset, "directives.go", src, parser.ParseComments)
	if err != nil {
		log.Fatal(err)
	}

	dstf, err := os.Create(dstFile)
	if err != nil {
		log.Fatal(err)
	}
	defer dstf.Close()

	page := Page{
		LastModification: time.Now().Format(time.RFC3339),
	}

	ast.Inspect(f, func(n ast.Node) bool {
		switch fn := n.(type) {

		// catching all function declarations
		// other intersting things to catch FuncLit and FuncType
		case *ast.FuncDecl:
			fnName := fn.Name.String()
			if !strings.HasPrefix(fnName, "directive") {
				return true
			}

			if fn.Doc == nil {
				return true
			}

			directiveName := fnName[9:]

			page.Directives = append(page.Directives, parseDirective(directiveName, fn.Doc.Text()))
		}
		return true
	})

	sort.Slice(page.Directives, func(i, j int) bool {
		return page.Directives[i].Name < page.Directives[j].Name
	})

	// Links are added once every directive is known, so that mentions of
	// directives without an entry in the page do not become dead anchors.
	documented := make(map[string]bool, len(page.Directives))
	for _, d := range page.Directives {
		documented[strings.ToLower(d.Name)] = true
	}
	for i := range page.Directives {
		d := &page.Directives[i]
		d.Description = addsLinksToDirectives(d.Description, documented)
		d.Content = addsLinksToDirectives(d.Content, documented)
	}

	content := bytes.Buffer{}
	err = tmpl.Execute(&content, page)
	if err != nil {
		log.Fatal(err)
	}

	_, err = dstf.WriteString(html.UnescapeString(content.String()))
	if err != nil {
		log.Fatal(err)
	}
}

func parseDirective(name string, doc string) Directive {
	d := Directive{
		Name: name,
	}

	fieldAppenders := map[string]func(d *Directive, value string){
		"Description": func(d *Directive, value string) { d.Description += value },
		"Syntax":      func(d *Directive, value string) { d.Syntax += value },
		"Default":     func(d *Directive, value string) { d.Default += value },
	}

	previousKey := ""
	scanner := bufio.NewScanner(strings.NewReader(doc))
	for scanner.Scan() {
		if strings.HasPrefix(scanner.Text(), "directive") {
			continue
		}

		if len(strings.TrimSpace(scanner.Text())) == 0 {
			continue
		}

		if strings.HasPrefix(scanner.Text(), "---") {
			break
		}

		// Some directives go straight to the example, without the "---"
		// that separates the fields from the content.
		if strings.HasPrefix(scanner.Text(), "Example:") {
			d.Content += decorateExample(scanner.Text()) + "\n"
			break
		}

		key, value, ok := strings.Cut(scanner.Text(), ": ")
		if _, isField := fieldAppenders[key]; !ok || !isField {
			// Not a field: the whole line continues the previous one, even
			// when it happens to contain a colon.
			if previousKey == "" {
				log.Fatalf("unknown field %q", key)
			}
			key = previousKey
			value = " " + scanner.Text()
		}

		fieldAppenders[key](&d, value)
		previousKey = key
	}

	for scanner.Scan() {
		d.Content += decorateExample(decorateNote(scanner.Text())) + "\n"
	}

	d.Content = normalizeSecLangFences(d.Content)

	return d
}

// normalizeSecLangFences converts all SecLang code fences in s to use the
// "seclang" language identifier. It first replaces explicit "```apache" fences,
// then converts bare "```" opening fences (tracked via inCode state) to
// "```seclang", leaving closing fences and other language fences untouched.
func normalizeSecLangFences(s string) string {
	s = strings.ReplaceAll(s, "```apache", "```seclang")

	var buf strings.Builder
	inCode := false
	for _, line := range strings.Split(s, "\n") {
		if line == "```" {
			if !inCode {
				buf.WriteString("```seclang\n")
				inCode = true
				continue
			}
			inCode = false
		} else if strings.HasPrefix(line, "```") && !inCode {
			inCode = true
		}
		buf.WriteString(line + "\n")
	}
	result := buf.String()
	// Remove the trailing newline added by the final iteration if the original
	// string did not end with one.
	if !strings.HasSuffix(s, "\n") && strings.HasSuffix(result, "\n") {
		result = result[:len(result)-1]
	}
	return result
}

func decorateNote(s string) string {
	return decorateLabel(s, "Note:")
}

func decorateExample(s string) string {
	return decorateLabel(s, "Example:")
}

// decorateLabel makes label bold, without doubling the markers when the
// source comment already wrote it in bold.
func decorateLabel(s string, label string) string {
	bold := "**" + label + "**"
	return strings.ReplaceAll(strings.ReplaceAll(s, bold, label), label, bold)
}

var directivesRegex = regexp.MustCompile("(`Sec[a-zA-Z0-9]+`)")

// addsLinksToDirectives turns backticked directive names into links to their
// section, leaving untouched the ones that are not in documented, which is
// keyed by lowercased directive name.
func addsLinksToDirectives(s string, documented map[string]bool) string {
	return directivesRegex.ReplaceAllStringFunc(s, func(s string) string {
		anchor := strings.ToLower(s[1 : len(s)-1])
		if !documented[anchor] {
			return s
		}
		return "[" + s + "](#" + anchor + ")"
	})
}

// codeSpan wraps s in an inline code span, using a longer delimiter when s
// itself contains backticks.
func codeSpan(s string) string {
	if strings.Contains(s, "`") {
		return "`` " + s + " ``"
	}
	return "`" + s + "`"
}
