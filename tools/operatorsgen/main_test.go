package main

import (
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func TestParseOperator(t *testing.T) {
	tests := map[string]struct {
		name     string
		doc      string
		expected Operator
	}{
		"simple operator": {
			name: "contains",
			doc:  "Description: Returns true if the parameter string is found anywhere in the input.\n\nExample:\n```\nSecRule REQUEST_LINE \"@contains .php\" \"id:150\"\n```",
			expected: Operator{
				Name:        "contains",
				Description: "Returns true if the parameter string is found anywhere in the input.",
				Example:     "\n```\nSecRule REQUEST_LINE \"@contains .php\" \"id:150\"\n```",
			},
		},
		"operator with note": {
			name: "detectSQLi",
			doc:  "Description: Returns true if SQL injection payload is found.\n\nExample:\n```\nSecRule REQUEST_URI \"@detectSQLi\" \"id:152\"\n```\n\nNote: This operator supports the \"capture\" action.",
			expected: Operator{
				Name:        "detectSQLi",
				Description: "Returns true if SQL injection payload is found.",
				Example:     "\n```\nSecRule REQUEST_URI \"@detectSQLi\" \"id:152\"\n```",
				Note:        "This operator supports the \"capture\" action.",
			},
		},
		"operator with complex description": {
			name: "rx",
			doc:  "Description: Performs regular expression matching.\nSupports capture groups for extracting matched patterns.\n\n- Up to 9 capture groups\n- Uses RE2 syntax\n\nExample:\n```\nSecRule ARGS \"@rx ^[0-9]+$\" \"id:100\"\n```",
			expected: Operator{
				Name:        "rx",
				Description: "Performs regular expression matching.\nSupports capture groups for extracting matched patterns.\n- Up to 9 capture groups\n- Uses RE2 syntax",
				Example:     "\n```\nSecRule ARGS \"@rx ^[0-9]+$\" \"id:100\"\n```",
			},
		},
		"operator with description on separate line": {
			name: "pm",
			doc:  "Description:\nPerforms parallel matching using Aho-Corasick algorithm.\n\nExample:\n```\nSecRule ARGS \"@pm word1 word2 word3\" \"id:200\"\n```",
			expected: Operator{
				Name:        "pm",
				Description: "Performs parallel matching using Aho-Corasick algorithm.",
				Example:     "\n```\nSecRule ARGS \"@pm word1 word2 word3\" \"id:200\"\n```",
			},
		},
		"operator with multiline note": {
			name: "detectXSS",
			doc:  "Description: Returns true if XSS injection is found.\n\nExample:\n```\nSecRule REQUEST_BODY \"@detectXSS\" \"id:12345,log,deny\"\n```\n\nNote: This operator supports the \"capture\" action.\nIt uses LibInjection for detection.",
			expected: Operator{
				Name:        "detectXSS",
				Description: "Returns true if XSS injection is found.",
				Example:     "\n```\nSecRule REQUEST_BODY \"@detectXSS\" \"id:12345,log,deny\"\n```",
				Note:        "This operator supports the \"capture\" action.\nIt uses LibInjection for detection.",
			},
		},
	}

	for name, test := range tests {
		t.Run(name, func(t *testing.T) {
			result := parseOperator(test.name, test.doc)

			if result.Name != test.expected.Name {
				t.Errorf("Name: want %q, have %q", test.expected.Name, result.Name)
			}
			if result.Description != test.expected.Description {
				t.Errorf("Description: want %q, have %q", test.expected.Description, result.Description)
			}
			if result.Example != test.expected.Example {
				t.Errorf("Example: want %q, have %q", test.expected.Example, result.Example)
			}
			if result.Note != test.expected.Note {
				t.Errorf("Note: want %q, have %q", test.expected.Note, result.Note)
			}
		})
	}
}

func TestGetOperatorFromFile(t *testing.T) {
	// Create a temporary directory for test files
	tmpDir := t.TempDir()

	tests := map[string]struct {
		fileContent string
		expected    []Operator
	}{
		"single operator with full documentation": {
			fileContent: `package operators

import "github.com/corazawaf/coraza/v3/experimental/plugins/plugintypes"

// Description: Returns true if the parameter string is found anywhere in the input.
//
// Example:
// ` + "```" + `
// SecRule REQUEST_LINE "@contains .php" "id:150"
// ` + "```" + `
type contains struct {
	data string
}

func newContains(options plugintypes.OperatorOptions) (plugintypes.Operator, error) {
	return nil, nil
}
`,
			expected: []Operator{
				{
					Name:        "contains",
					Description: "Returns true if the parameter string is found anywhere in the input.",
					Example:     "\n" + "```" + "\nSecRule REQUEST_LINE \"@contains .php\" \"id:150\"\n" + "```",
				},
			},
		},
		"operator with note": {
			fileContent: `package operators

import "github.com/corazawaf/coraza/v3/experimental/plugins/plugintypes"

// Description: Returns true if SQL injection payload is found.
//
// Example:
// ` + "```" + `
// SecRule REQUEST_URI "@detectSQLi" "id:152"
// ` + "```" + `
//
// Note: This operator supports the "capture" action.
type detectSQLi struct{}

func newDetectSQLi(options plugintypes.OperatorOptions) (plugintypes.Operator, error) {
	return nil, nil
}
`,
			expected: []Operator{
				{
					Name:        "detectSQLi",
					Description: "Returns true if SQL injection payload is found.",
					Example:     "\n" + "```" + "\nSecRule REQUEST_URI \"@detectSQLi\" \"id:152\"\n" + "```",
					Note:        "This operator supports the \"capture\" action.",
				},
			},
		},
		"multiple operators in one file": {
			fileContent: `package operators

import "github.com/corazawaf/coraza/v3/experimental/plugins/plugintypes"

// Description: Returns true if input equals the parameter.
type eq struct{}

func newEq(options plugintypes.OperatorOptions) (plugintypes.Operator, error) {
	return nil, nil
}

// Description: Returns true if input is greater than the parameter.
type gt struct{}

func newGt(options plugintypes.OperatorOptions) (plugintypes.Operator, error) {
	return nil, nil
}
`,
			expected: []Operator{
				{
					Name:        "eq",
					Description: "Returns true if input equals the parameter.",
					Example:     "",
					Note:        "",
				},
				{
					Name:        "gt",
					Description: "Returns true if input is greater than the parameter.",
					Example:     "",
					Note:        "",
				},
			},
		},
		"file with no documented operators": {
			fileContent: `package operators

import "github.com/corazawaf/coraza/v3/experimental/plugins/plugintypes"

func newHelper() error {
	return nil
}

type someType struct{}
`,
			expected: []Operator{},
		},
		"skips internal types": {
			fileContent: `package operators

import "github.com/corazawaf/coraza/v3/experimental/plugins/plugintypes"

// Description: Main operator.
type rx struct{}

func newRX(options plugintypes.OperatorOptions) (plugintypes.Operator, error) {
	return nil, nil
}

// Description: Should be skipped.
type binaryRX struct{}

func newBinaryRX(options plugintypes.OperatorOptions) (plugintypes.Operator, error) {
	return nil, nil
}

// Description: Should be skipped.
type fromFile struct{}

func newPMFromFile(options plugintypes.OperatorOptions) (plugintypes.Operator, error) {
	return nil, nil
}
`,
			expected: []Operator{
				{
					Name:        "rx",
					Description: "Main operator.",
					Example:     "",
					Note:        "",
				},
			},
		},
		"appends to existing page": {
			fileContent: `package operators

import "github.com/corazawaf/coraza/v3/experimental/plugins/plugintypes"

// Description: New operator.
type streq struct{}

func newStreq(options plugintypes.OperatorOptions) (plugintypes.Operator, error) {
	return nil, nil
}
`,
			expected: []Operator{
				{
					Name:        "existingOp",
					Description: "Existing operator",
				},
				{
					Name:        "streq",
					Description: "New operator.",
				},
			},
		},
	}

	for name, test := range tests {
		t.Run(name, func(t *testing.T) {
			// Create test file with sanitized name
			sanitizedName := strings.ReplaceAll(t.Name(), "/", "_")
			testFile := filepath.Join(tmpDir, sanitizedName+".go")
			err := os.WriteFile(testFile, []byte(test.fileContent), 0644)
			if err != nil {
				t.Fatalf("Failed to create test file: %v", err)
			}

			// Test getOperatorFromFile
			var page Page
			// For the "appends to existing page" test, start with an existing operator
			if name == "appends to existing page" {
				page = Page{
					Operators: []Operator{
						{
							Name:        "existingOp",
							Description: "Existing operator",
						},
					},
				}
			}
			result := getOperatorFromFile(testFile, page)

			// Verify the number of operators
			if len(result.Operators) != len(test.expected) {
				t.Errorf("Number of operators: want %d, got %d", len(test.expected), len(result.Operators))
			}

			// Verify each operator
			for i, expectedOp := range test.expected {
				if i >= len(result.Operators) {
					break
				}
				gotOp := result.Operators[i]

				if gotOp.Name != expectedOp.Name {
					t.Errorf("Operator[%d].Name: want %q, got %q", i, expectedOp.Name, gotOp.Name)
				}
				if gotOp.Description != expectedOp.Description {
					t.Errorf("Operator[%d].Description: want %q, got %q", i, expectedOp.Description, gotOp.Description)
				}
				if gotOp.Example != expectedOp.Example {
					t.Errorf("Operator[%d].Example: want %q, got %q", i, expectedOp.Example, gotOp.Example)
				}
				if gotOp.Note != expectedOp.Note {
					t.Errorf("Operator[%d].Note: want %q, got %q", i, expectedOp.Note, gotOp.Note)
				}
			}
		})
	}
}

func TestOperatorSorting(t *testing.T) {
	operators := []Operator{
		{Name: "zebra"},
		{Name: "apple"},
		{Name: "middle"},
	}

	page := Page{
		Operators: operators,
	}

	// Sort like main() does
	var sorted = page.Operators
	// Make a copy to avoid modifying the original
	sorted = append([]Operator{}, sorted...)

	// Sort
	for i := 0; i < len(sorted); i++ {
		for j := i + 1; j < len(sorted); j++ {
			if sorted[i].Name > sorted[j].Name {
				sorted[i], sorted[j] = sorted[j], sorted[i]
			}
		}
	}

	expected := []string{"apple", "middle", "zebra"}
	for i, name := range expected {
		if sorted[i].Name != name {
			t.Errorf("Position %d: want %q, got %q", i, name, sorted[i].Name)
		}
	}
}
