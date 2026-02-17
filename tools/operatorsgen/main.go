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
	"path/filepath"
	"sort"
	"strings"
	"time"
)

type Page struct {
	LastModification string
	Operators        []Operator
}

type Operator struct {
	Name        string
	Description string
	Example     string
	Note        string
}

//go:embed template.md
var contentTemplate string

const dstFile = "./content/docs/seclang/operators.md"

func main() {
	tmpl, err := template.New("operator").Parse(contentTemplate)
	if err != nil {
		log.Fatal(err)
	}

	var files []string

	if len(os.Args) < 2 {
		log.Fatalf("usage: %s <coraza-path>", os.Args[0])
	}

	root := path.Join(os.Args[1], "internal/operators")
	err = filepath.Walk(root, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			log.Printf("error walking %q: %v", path, err)
			return err
		}

		// get all files that are not test files
		if !info.IsDir() && !strings.HasSuffix(info.Name(), "_test.go") && info.Name() != "operators.go" {
			files = append(files, path)
		}

		return nil
	})

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

	for _, file := range files {
		page = getOperatorFromFile(file, page)
	}

	sort.Slice(page.Operators, func(i, j int) bool {
		return page.Operators[i].Name < page.Operators[j].Name
	})

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

func getOperatorFromFile(file string, page Page) Page {
	src, err := os.ReadFile(file)
	if err != nil {
		log.Fatal(err)
	}
	fSet := token.NewFileSet()
	f, err := parser.ParseFile(fSet, file, src, parser.ParseComments)
	if err != nil {
		log.Fatal(err)
	}

	// Look for struct type declarations that represent operators
	for _, decl := range f.Decls {
		genDecl, ok := decl.(*ast.GenDecl)
		if !ok || genDecl.Tok != token.TYPE {
			continue
		}

		// Default documentation for all specs in this GenDecl.
		groupDoc := ""
		if genDecl.Doc != nil {
			groupDoc = genDecl.Doc.Text()
		}

		for _, spec := range genDecl.Specs {
			typeSpec, ok := spec.(*ast.TypeSpec)
			if !ok {
				continue
			}

			// Check if it's a struct type
			_, isStruct := typeSpec.Type.(*ast.StructType)
			if !isStruct {
				continue
			}

			// Get the type name (this is the operator name)
			operatorName := typeSpec.Name.Name

			// Skip internal types (e.g., binaryRX, fromFile types)
			operatorNameLower := strings.ToLower(operatorName)
			if strings.Contains(operatorNameLower, "binary") || strings.HasPrefix(operatorNameLower, "from") {
				continue
			}

			// Prefer doc comments directly attached to the TypeSpec, if any.
			specDoc := groupDoc
			if typeSpec.Doc != nil && typeSpec.Doc.Text() != "" {
				specDoc = typeSpec.Doc.Text()
			}

			// Only add if there's documentation with structured fields
			if specDoc != "" && strings.Contains(specDoc, ":") {
				operator := parseOperator(operatorName, specDoc)
				// Skip if no description was extracted (unstructured docs)
				if operator.Description != "" {
					page.Operators = append(page.Operators, operator)
				}
			}
		}
	}

	return page
}

func parseOperator(name string, doc string) Operator {
	var key string
	var value string
	var ok bool

	o := Operator{
		Name: name,
	}

	fieldAppenders := map[string]func(o *Operator, value string){
		"Description":   func(o *Operator, value string) { o.Description += value },
		"Example":       func(o *Operator, value string) { o.Example += value },
		"Example usage": func(o *Operator, value string) { o.Example += value },
		"Note":          func(o *Operator, value string) { o.Note += value },
		// Skip these fields - they're internal implementation details
		"Arguments": func(o *Operator, value string) {},
		"Returns":   func(o *Operator, value string) {},
	}

	previousKey := ""
	scanner := bufio.NewScanner(strings.NewReader(doc))
	for scanner.Scan() {
		line := scanner.Text()
		if len(strings.TrimSpace(line)) == 0 {
			continue
		}

		// There are two types of comments. One is a key-value pair, the other is a continuation of the previous key
		// E.g.
		// Description: Returns true if...                <= first one, key value pair
		// Example:                                        <= second one, key in a line, value in the next lines
		// ```
		// SecRule ...
		// ```
		//
		if strings.HasSuffix(line, ":") {
			key = line[:len(line)-1]
			value = ""
		} else {
			key, value, ok = strings.Cut(line, ": ")
			if !ok {
				key = previousKey
				if previousKey == "Example" || previousKey == "Note" {
					value = "\n" + line
				} else if previousKey == "Description" {
					// Handle description formatting - preserve line breaks for better readability
					trimmedLine := strings.TrimSpace(line)
					if trimmedLine == "" {
						value = "\n"
					} else if o.Description == "" {
						// This is the first line of description
						value = line
					} else {
						value = "\n" + line
					}
				} else {
					value = " " + line
				}
			}
		}

		if fn, foundOk := fieldAppenders[key]; foundOk {
			fn(&o, value)
			previousKey = key
		} else if previousKey != "" {
			fieldAppenders[previousKey](&o, value)
		} else if key != "" {
			// Unknown field that we haven't seen before - log and skip
			log.Printf("Warning: skipping unknown field %q in operator %q", key, name)
		}
		// If key is empty and previousKey is empty, just skip the line
	}
	return o
}
