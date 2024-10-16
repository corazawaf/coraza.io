// Copyright 2024 The OWASP Coraza contributors
// SPDX-License-Identifier: Apache-2.0

package main

import (
	"bufio"
	"bytes"
	_ "embed"
	"fmt"
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
	Actions          []Action
}

type Action struct {
	Name        string
	ActionGroup string
	Description string
	Example     string
	Phases      string
}

//go:embed template.md
var contentTemplate string

const dstFile = "./content/docs/seclang/actions.md"

func main() {
	tmpl, err := template.New("action").Parse(contentTemplate)
	if err != nil {
		log.Fatal(err)
	}

	var files []string

	root := path.Join("../coraza", "/internal/actions")

	err = filepath.Walk(root, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			fmt.Println(err)
			return nil
		}

		// get all files that are not test files
		if !info.IsDir() && !strings.HasSuffix(info.Name(), "_test.go") && info.Name() != "actions.go" {
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
		page = getActionFromFile(file, page)
	}

	sort.Slice(page.Actions, func(i, j int) bool {
		return page.Actions[i].Name < page.Actions[j].Name
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

func getActionFromFile(file string, page Page) Page {
	src, err := os.ReadFile(file)
	if err != nil {
		log.Fatal(err)
	}
	fSet := token.NewFileSet()
	f, err := parser.ParseFile(fSet, file, src, parser.ParseComments)
	if err != nil {
		log.Fatal(err)
	}

	actionDoc := ""
	ast.Inspect(f, func(n ast.Node) bool {
		switch ty := n.(type) {
		case *ast.GenDecl:
			if ty.Doc.Text() != "" {
				actionDoc += ty.Doc.Text()
			}
		case *ast.TypeSpec:
			typeName := ty.Name.String()
			if !strings.HasSuffix(typeName, "Fn") {
				return true
			}
			if len(typeName) < 3 {
				return true
			}

			actionName := typeName[0 : len(typeName)-2]
			page.Actions = append(page.Actions, parseAction(actionName, actionDoc))
		}
		return true
	})
	return page
}

func parseAction(name string, doc string) Action {
	var key string
	var value string
	var ok bool

	d := Action{
		Name: name,
	}

	fieldAppenders := map[string]func(d *Action, value string){
		"Description":       func(a *Action, value string) { d.Description += value },
		"Action Group":      func(a *Action, value string) { d.ActionGroup += value },
		"Example":           func(a *Action, value string) { d.Example += value },
		"Processing Phases": func(a *Action, value string) { d.Phases += value },
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
		// Action Group: Non-disruptive                <= first one, key value pair
		// Example:                                    <= second one, key in a line, value in the next lines
		// This action is used to generate a response.
		//
		if strings.HasSuffix(line, ":") {
			key = line[:len(line)-1]
			value = ""
		} else {
			key, value, ok = strings.Cut(line, ": ")
			if !ok {
				key = previousKey
				value = " " + line
			}
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
	return d
}
