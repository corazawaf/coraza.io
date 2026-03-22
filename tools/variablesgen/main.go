// Copyright 2024 The OWASP Coraza contributors
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
	Variables        []Variable
}

type Variable struct {
	Name        string
	Description string
	Content     string
}

//go:embed template.md
var contentTemplate string

const dstFile = "./content/en/docs/seclang/variables.md"

func main() {
	tmpl, err := template.New("variable").Parse(contentTemplate)
	if err != nil {
		log.Fatal(err)
	}

	if len(os.Args) < 2 {
		log.Fatalf("usage: %s <coraza-path>", os.Args[0])
	}

	corazaPath := os.Args[1]

	nameMap := parseNameMap(path.Join(corazaPath, "internal/variables/variablesmap.gen.go"))

	variablesFile := path.Join(corazaPath, "internal/variables/variables.go")
	variables := parseVariables(variablesFile, nameMap)

	sort.Slice(variables, func(i, j int) bool {
		return variables[i].Name < variables[j].Name
	})

	dstf, err := os.Create(dstFile)
	if err != nil {
		log.Fatal(err)
	}
	defer dstf.Close()

	page := Page{
		LastModification: time.Now().Format(time.RFC3339),
		Variables:        variables,
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

// parseNameMap reads variablesmap.gen.go and builds a mapping from Go constant
// name to SecLang variable name (e.g., "Args" -> "ARGS").
func parseNameMap(filepath string) map[string]string {
	data, err := os.ReadFile(filepath)
	if err != nil {
		log.Fatal(err)
	}

	nameMap := make(map[string]string)
	re := regexp.MustCompile(`case\s+(\w+):\s*\n\s*return\s+"([^"]+)"`)
	matches := re.FindAllStringSubmatch(string(data), -1)
	for _, m := range matches {
		nameMap[m[1]] = m[2]
	}
	return nameMap
}

// parseVariables reads variables.go and extracts variables with structured documentation.
func parseVariables(filepath string, nameMap map[string]string) []Variable {
	src, err := os.ReadFile(filepath)
	if err != nil {
		log.Fatal(err)
	}

	fset := token.NewFileSet()
	f, err := parser.ParseFile(fset, "variables.go", src, parser.ParseComments)
	if err != nil {
		log.Fatal(err)
	}

	var variables []Variable

	for _, decl := range f.Decls {
		genDecl, ok := decl.(*ast.GenDecl)
		if !ok || genDecl.Tok != token.CONST {
			continue
		}

		for _, spec := range genDecl.Specs {
			valueSpec, ok := spec.(*ast.ValueSpec)
			if !ok {
				continue
			}

			if valueSpec.Doc == nil {
				continue
			}

			goName := valueSpec.Names[0].Name
			docText := valueSpec.Doc.Text()

			// Only process constants that have structured documentation
			if !strings.Contains(docText, "Description:") {
				continue
			}

			seclangName, ok := nameMap[goName]
			if !ok {
				log.Printf("Warning: no SecLang name mapping for %q, skipping", goName)
				continue
			}

			v := parseVariable(seclangName, docText)
			variables = append(variables, v)
		}
	}

	return variables
}

func parseVariable(name string, doc string) Variable {
	v := Variable{
		Name: name,
	}

	inContent := false
	inDescription := false
	afterBlankLine := false
	scanner := bufio.NewScanner(strings.NewReader(doc))

	for scanner.Scan() {
		line := scanner.Text()

		if strings.HasPrefix(line, "---") {
			inContent = true
			inDescription = false
			continue
		}

		if inContent {
			v.Content += line + "\n"
			continue
		}

		if desc, found := strings.CutPrefix(line, "Description: "); found {
			v.Description = desc
			inDescription = true
			afterBlankLine = false
			continue
		}

		if inDescription {
			trimmed := strings.TrimSpace(line)
			if len(trimmed) == 0 {
				afterBlankLine = true
				continue
			}
			if afterBlankLine {
				v.Description += "\n\n" + trimmed
				afterBlankLine = false
			} else {
				v.Description += " " + trimmed
			}
		}
	}

	v.Description = strings.TrimRight(v.Description, "\n ")

	// Replace apache language hints with modsecurity for proper syntax highlighting
	v.Content = strings.ReplaceAll(v.Content, "```apache", "```modsecurity")
	v.Content = strings.TrimRight(v.Content, "\n")

	return v
}
