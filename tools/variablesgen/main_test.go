package main

import (
	"os"
	"path/filepath"
	"testing"
)

func TestParseVariable(t *testing.T) {
	tests := map[string]struct {
		name     string
		doc      string
		expected Variable
	}{
		"simple variable": {
			name: "QUERY_STRING",
			doc:  "Description: Contains the query string part of a request URI.\n---\n```modsecurity\nSecRule QUERY_STRING \"attack\" \"id:34\"\n```\n",
			expected: Variable{
				Name:        "QUERY_STRING",
				Description: "Contains the query string part of a request URI.",
				Content:     "```modsecurity\nSecRule QUERY_STRING \"attack\" \"id:34\"\n```",
			},
		},
		"variable with multiline description": {
			name: "ARGS",
			doc:  "Description: ARGS is a collection and can be used on its own\n(means all arguments including the POST Payload).\n---\nSome extra content here.\n",
			expected: Variable{
				Name:        "ARGS",
				Description: "ARGS is a collection and can be used on its own (means all arguments including the POST Payload).",
				Content:     "Some extra content here.",
			},
		},
		"variable with colon in description": {
			name: "ARGS_NAMES",
			doc:  "Description: Contains all request parameter names. This example rule allows only two argument names: p and a:\n---\n```modsecurity\nSecRule ARGS_NAMES \"!^(p|a)$\" \"id:13\"\n```\n",
			expected: Variable{
				Name:        "ARGS_NAMES",
				Description: "Contains all request parameter names. This example rule allows only two argument names: p and a:",
				Content:     "```modsecurity\nSecRule ARGS_NAMES \"!^(p|a)$\" \"id:13\"\n```",
			},
		},
		"variable without content": {
			name: "UNIQUE_ID",
			doc:  "Description: This variable holds the unique id for the transaction.\n",
			expected: Variable{
				Name:        "UNIQUE_ID",
				Description: "This variable holds the unique id for the transaction.",
				Content:     "",
			},
		},
	}

	for name, test := range tests {
		t.Run(name, func(t *testing.T) {
			result := parseVariable(test.name, test.doc)

			if result.Name != test.expected.Name {
				t.Errorf("Name: want %q, have %q", test.expected.Name, result.Name)
			}
			if result.Description != test.expected.Description {
				t.Errorf("Description: want %q, have %q", test.expected.Description, result.Description)
			}
			if result.Content != test.expected.Content {
				t.Errorf("Content: want %q, have %q", test.expected.Content, result.Content)
			}
		})
	}
}

func TestParseNameMap(t *testing.T) {
	tmpDir := t.TempDir()
	content := `package variables

func (v RuleVariable) Name() string {
	switch v {
	case Args:
		return "ARGS"
	case QueryString:
		return "QUERY_STRING"
	default:
		return "INVALID_VARIABLE"
	}
}
`
	mapFile := filepath.Join(tmpDir, "variablesmap.gen.go")
	if err := os.WriteFile(mapFile, []byte(content), 0644); err != nil {
		t.Fatal(err)
	}

	nameMap := parseNameMap(mapFile)

	if want, have := "ARGS", nameMap["Args"]; want != have {
		t.Errorf("Args mapping: want %q, have %q", want, have)
	}
	if want, have := "QUERY_STRING", nameMap["QueryString"]; want != have {
		t.Errorf("QueryString mapping: want %q, have %q", want, have)
	}
	if _, ok := nameMap["default"]; ok {
		t.Error("should not include 'default' case")
	}
}

func TestParseVariables(t *testing.T) {
	tmpDir := t.TempDir()

	variablesContent := `package variables

type RuleVariable byte

const (
	// Description: Contains the query string part of a request URI.
	// ---
	// ` + "```" + `modsecurity
	// SecRule QUERY_STRING "attack" "id:34"
	// ` + "```" + `
	QueryString RuleVariable = iota
	// UniqueID is the unique id of the transaction
	UniqueID
	// Description: This variable holds the IP address of the remote client.
	RemoteAddr
)
`
	variablesFile := filepath.Join(tmpDir, "variables.go")
	if err := os.WriteFile(variablesFile, []byte(variablesContent), 0644); err != nil {
		t.Fatal(err)
	}

	nameMap := map[string]string{
		"QueryString": "QUERY_STRING",
		"UniqueID":    "UNIQUE_ID",
		"RemoteAddr":  "REMOTE_ADDR",
	}

	variables := parseVariables(variablesFile, nameMap)

	// Only QueryString and RemoteAddr have Description: prefix
	if len(variables) != 2 {
		t.Fatalf("expected 2 variables, got %d", len(variables))
	}

	// Find QUERY_STRING
	found := false
	for _, v := range variables {
		if v.Name == "QUERY_STRING" {
			found = true
			if v.Description != "Contains the query string part of a request URI." {
				t.Errorf("QUERY_STRING description: %q", v.Description)
			}
			if v.Content != "```modsecurity\nSecRule QUERY_STRING \"attack\" \"id:34\"\n```" {
				t.Errorf("QUERY_STRING content: %q", v.Content)
			}
		}
	}
	if !found {
		t.Error("QUERY_STRING not found in parsed variables")
	}
}
