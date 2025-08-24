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
	"io/fs"
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
	Blocks           []DocBlock
}

type DocBlock struct {
	Name             string
	Description      string
	Syntax           string
	Default          string
	Date             string
	LastModification string
	Content          string
}

var (
	//go:embed templates/directives.md
	directivesTemplate string

	//go:embed templates/operators.md
	operatorsTemplate string
)

const (
	directivesOutput = "./content/docs/seclang/directives.md"
	operatorsOutput  = "./content/docs/seclang/operators.md"
)

var directivesRegex = regexp.MustCompile("(`Sec[a-zA-Z0-9]+`)")

func main() {
	updateOperators()
	updateDirectives()
}

func updateDirectives() {
	tmpl, err := template.New("directives").Parse(directivesTemplate)
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

	dstf, err := os.Create(directivesOutput)
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

			page.Blocks = append(page.Blocks, parseDocblock(fn.Doc.Text(), directivesRegex))
		}
		return true
	})

	writePage(page, tmpl, dstf)
}

func writePage(page Page, tmpl *template.Template, dstf *os.File) {
	sort.Slice(page.Blocks, func(i, j int) bool {
		return page.Blocks[i].Name < page.Blocks[j].Name
	})

	content := bytes.Buffer{}
	err := tmpl.Execute(&content, page)
	if err != nil {
		log.Fatal(err)
	}

	_, err = dstf.WriteString(html.UnescapeString(content.String()))
	if err != nil {
		log.Fatal(err)
	}
}

func updateOperators() {
	tmpl, err := template.New("operators").Parse(operatorsTemplate)
	if err != nil {
		log.Fatal(err)
	}

	dirpath := path.Join(os.Args[1], "internal/operators")
	fset := token.NewFileSet()
	pkgs, err := parser.ParseDir(fset, dirpath, func(fi fs.FileInfo) bool { return true }, parser.ParseComments)
	if err != nil {
		log.Fatal(err)
	}

	dstf, err := os.Create(operatorsOutput)
	if err != nil {
		log.Fatal(err)
	}
	defer dstf.Close()

	page := Page{
		LastModification: time.Now().Format(time.RFC3339),
	}

	for _, pkg := range pkgs {
		for _, f := range pkg.Files {
			ast.Inspect(f, func(n ast.Node) bool {
				switch fn := n.(type) {
				case *ast.FuncDecl:
					if fn.Doc == nil {
						return true
					}

					if !strings.HasPrefix(fn.Name.String(), "newOperator") {
						return true
					}

					page.Blocks = append(page.Blocks, parseDocblock(fn.Doc.Text(), nil))
				}
				return true
			})
		}
	}

	writePage(page, tmpl, dstf)
}

func parseDocblock(doc string, linker *regexp.Regexp) DocBlock {
	d := DocBlock{}

	fieldAppenders := map[string]func(d *DocBlock, value string){
		"Name":        func(d *DocBlock, value string) { d.Name = value },
		"Description": func(d *DocBlock, value string) { d.Description += value },
		"Syntax":      func(d *DocBlock, value string) { d.Syntax += value },
		"Default":     func(d *DocBlock, value string) { d.Default += value },
	}

	previousKey := ""
	scanner := bufio.NewScanner(strings.NewReader(doc))
	for scanner.Scan() {
		if len(strings.TrimSpace(scanner.Text())) == 0 {
			continue
		}

		if strings.HasPrefix(scanner.Text(), "---") {
			break
		}

		key, value, ok := strings.Cut(scanner.Text(), ": ")
		if !ok {
			key = previousKey
			value = " " + scanner.Text()
		}

		if fn, ok := fieldAppenders[key]; ok {
			fn(&d, value)
			previousKey = key
		} else if previousKey != "" {
			fieldAppenders[previousKey](&d, value)
		} else {
			log.Fatalf("unknown field %q", key)
		}
	}

	for scanner.Scan() {
		d.Content += decorateExample(decorateNote(scanner.Text())) + "\n"
	}

	if linker != nil {
		d.Description = addsLinksToDirectives(d.Description, linker)
		d.Content = addsLinksToDirectives(d.Content, linker)
	}

	return d
}

func decorateNote(s string) string {
	return strings.Replace(s, "Note:", "**Note:**", -1)
}

func decorateExample(s string) string {
	return strings.Replace(s, "Example:", "**Example:**", -1)
}

func addsLinksToDirectives(s string, linker *regexp.Regexp) string {
	return linker.ReplaceAllStringFunc(s, func(s string) string {
		return "[" + s + "](#" + strings.ToLower(s[1:len(s)-1]) + ")"
	})
}
