package main

import (
	"bufio"
	_ "embed"
	"fmt"
	"go/ast"
	"go/parser"
	"go/token"
	"html/template"
	"log"
	"os"
	"strings"
	"time"
)

type Directive struct {
	Name                 string
	Description          string
	Syntax               string
	Default              string
	Date                 string
	LastModification     string
	Content              string
	VersionCompatibility string
}

//go:embed template.md
var contentTemplate string

func main() {
	tmpl, err := template.New("directive").Parse(contentTemplate)
	if err != nil {
		log.Fatal(err)
	}

	fset := token.NewFileSet() // positions are relative to fset

	src, err := os.ReadFile("../coraza/internal/seclang/directives.go")
	if err != nil {
		log.Fatal(err)
	}

	f, err := parser.ParseFile(fset, "directives.go", src, parser.ParseComments)
	if err != nil {
		log.Fatal(err)
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

			directiveName := fnName[9:]

			if fn.Doc == nil {
				return true
			}

			f, err := os.Create(fmt.Sprintf("./content/docs/seclang/directives/%s.md", directiveName))
			if err != nil {
				log.Fatal(err)
			}
			defer f.Close()

			d := parseDirective(directiveName, fn.Doc.Text())

			err = tmpl.Execute(f, d)
			if err != nil {
				log.Fatal(err)
			}
		}
		return true
	})
}

func parseDirective(name string, doc string) Directive {
	d := Directive{
		Name:             name,
		LastModification: time.Now().Format(time.RFC3339),
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

		key, value, ok := strings.Cut(scanner.Text(), ": ")
		if !ok {
			key = previousKey
			value = " " + scanner.Text()
		}

		switch key {
		case "Description":
			d.Description += value
		case "Syntax":
			d.Syntax += value
		case "Default":
			d.Default += value
		case "Version Compatibility":
			d.VersionCompatibility += value
		}
		previousKey = key
	}

	for scanner.Scan() {
		d.Content += scanner.Text() + "\n"
	}

	return d
}
