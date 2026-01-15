package main

import (
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func TestParseAction(t *testing.T) {
	tests := map[string]struct {
		name     string
		doc      string
		expected Action
	}{
		"simple action": {
			name: "test",
			doc:  "Action Group: Disruptive\n\nDescription: This is a test action.\n\nExample:\n```\nSecRule ARGS \"@rx test\" \"phase:2,block,id:1\"\n```",
			expected: Action{
				Name:        "test",
				ActionGroup: "Disruptive",
				Description: "This is a test action.",
				Example:     "\n```\nSecRule ARGS \"@rx test\" \"phase:2,block,id:1\"\n```",
			},
		},
		"action with phases": {
			name: "test2",
			doc:  "Action Group: Non-disruptive\n\nDescription: This action works in multiple phases.\n\nProcessing Phases: 1, 2, 3\n\nExample:\n```\nSecAction \"phase:1,setvar:tx.test=1,id:2\"\n```",
			expected: Action{
				Name:        "test2",
				ActionGroup: "Non-disruptive",
				Description: "This action works in multiple phases.",
				Phases:      "1, 2, 3",
				Example:     "\n```\nSecAction \"phase:1,setvar:tx.test=1,id:2\"\n```",
			},
		},
		"action with complex description": {
			name: "test3",
			doc:  "Action Group: Disruptive\n\nDescription: This action has a complex description.\nIt spans multiple lines and has bullet points.\n\n- First bullet point\n- Second bullet point\n\nExample:\n```\nSecRule ARGS \"@rx complex\" \"phase:2,block,id:3\"\n```",
			expected: Action{
				Name:        "test3",
				ActionGroup: "Disruptive",
				Description: "This action has a complex description.\nIt spans multiple lines and has bullet points.\n- First bullet point\n- Second bullet point",
				Example:     "\n```\nSecRule ARGS \"@rx complex\" \"phase:2,block,id:3\"\n```",
			},
		},
		"action with empty fields": {
			name: "test4",
			doc:  "Action Group: Meta-data\n\nDescription: Simple description only.",
			expected: Action{
				Name:        "test4",
				ActionGroup: "Meta-data",
				Description: "Simple description only.",
				Example:     "",
				Phases:      "",
			},
		},
		"action with description on separate line": {
			name: "test5",
			doc:  "Action Group: Disruptive\n\nDescription:\nThis is a description that starts on a new line.\n\nExample:\n```\nSecAction \"phase:1,id:5\"\n```",
			expected: Action{
				Name:        "test5",
				ActionGroup: "Disruptive",
				Description: "This is a description that starts on a new line.",
				Example:     "\n```\nSecAction \"phase:1,id:5\"\n```",
			},
		},
	}

	for name, test := range tests {
		t.Run(name, func(t *testing.T) {
			result := parseAction(test.name, test.doc)

			if result.Name != test.expected.Name {
				t.Errorf("Name: want %q, have %q", test.expected.Name, result.Name)
			}
			if result.ActionGroup != test.expected.ActionGroup {
				t.Errorf("ActionGroup: want %q, have %q", test.expected.ActionGroup, result.ActionGroup)
			}
			if result.Description != test.expected.Description {
				t.Errorf("Description: want %q, have %q", test.expected.Description, result.Description)
			}
			if result.Phases != test.expected.Phases {
				t.Errorf("Phases: want %q, have %q", test.expected.Phases, result.Phases)
			}
			if result.Example != test.expected.Example {
				t.Errorf("Example: want %q, have %q", test.expected.Example, result.Example)
			}
		})
	}
}

func TestGetActionFromFile(t *testing.T) {
	// Create a temporary directory for test files
	tmpDir := t.TempDir()

	tests := map[string]struct {
		fileContent string
		expected    []Action
	}{
		"single action with full documentation": {
			fileContent: `package actions

// Action Group: Disruptive
//
// Description: Denies access to the request.
//
// Example:
// ` + "```" + `
// SecRule ARGS "@rx test" "phase:2,deny,id:1"
// ` + "```" + `
type DenyFn struct{}
`,
			expected: []Action{
				{
					Name:        "Deny",
					ActionGroup: "Disruptive",
					Description: "Denies access to the request.",
					Example:     "\n" + "```" + "\nSecRule ARGS \"@rx test\" \"phase:2,deny,id:1\"\n" + "```",
					Phases:      "",
				},
			},
		},
		"action with processing phases": {
			fileContent: `package actions

// Action Group: Non-disruptive
//
// Description: Sets a variable.
//
// Processing Phases: 1, 2, 3, 4, 5
//
// Example:
// ` + "```" + `
// SecAction "phase:1,setvar:tx.test=1,id:2"
// ` + "```" + `
type SetvarFn struct{}
`,
			expected: []Action{
				{
					Name:        "Setvar",
					ActionGroup: "Non-disruptive",
					Description: "Sets a variable.",
					Example:     "\n" + "```" + "\nSecAction \"phase:1,setvar:tx.test=1,id:2\"\n" + "```",
					Phases:      "1, 2, 3, 4, 5",
				},
			},
		},
		"multiple actions in one file": {
			fileContent: `package actions

// Action Group: Disruptive
//
// Description: Blocks the request.
type BlockFn struct{}

// Action Group: Non-disruptive
//
// Description: Logs a message.
type LogFn struct{}
`,
			expected: []Action{
				{
					Name:        "Block",
					ActionGroup: "Disruptive",
					Description: "Blocks the request.",
					Example:     "",
					Phases:      "",
				},
				{
					Name:        "Log",
					ActionGroup: "Non-disruptive",
					Description: "Logs a message.",
					Example:     "",
					Phases:      "",
				},
			},
		},
		"file with no action types": {
			fileContent: `package actions

// Some random comment
type SomeOtherType struct{}
`,
			expected: []Action{},
		},
		"appends to existing page": {
			fileContent: `package actions

// Action Group: Disruptive
//
// Description: New action.
type NewActionFn struct{}
`,
			expected: []Action{
				{
					Name:        "ExistingAction",
					ActionGroup: "Non-disruptive",
					Description: "Existing action",
					Example:     "",
					Phases:      "",
				},
				{
					Name:        "NewAction",
					ActionGroup: "Disruptive",
					Description: "New action.",
					Example:     "",
					Phases:      "",
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

			// Test getActionFromFile
			var page Page
			// For the "appends to existing page" test, start with an existing action
			if name == "appends to existing page" {
				page = Page{
					Actions: []Action{
						{
							Name:        "ExistingAction",
							ActionGroup: "Non-disruptive",
							Description: "Existing action",
							Example:     "",
							Phases:      "",
						},
					},
				}
			}
			result := getActionFromFile(testFile, page)

			// Verify the number of actions
			if len(result.Actions) != len(test.expected) {
				t.Errorf("Number of actions: want %d, got %d", len(test.expected), len(result.Actions))
			}

			// Verify each action
			for i, expectedAction := range test.expected {
				if i >= len(result.Actions) {
					break
				}
				gotAction := result.Actions[i]

				if gotAction.Name != expectedAction.Name {
					t.Errorf("Action[%d].Name: want %q, got %q", i, expectedAction.Name, gotAction.Name)
				}
				if gotAction.ActionGroup != expectedAction.ActionGroup {
					t.Errorf("Action[%d].ActionGroup: want %q, got %q", i, expectedAction.ActionGroup, gotAction.ActionGroup)
				}
				if gotAction.Description != expectedAction.Description {
					t.Errorf("Action[%d].Description: want %q, got %q", i, expectedAction.Description, gotAction.Description)
				}
				if gotAction.Example != expectedAction.Example {
					t.Errorf("Action[%d].Example: want %q, got %q", i, expectedAction.Example, gotAction.Example)
				}
				if gotAction.Phases != expectedAction.Phases {
					t.Errorf("Action[%d].Phases: want %q, got %q", i, expectedAction.Phases, gotAction.Phases)
				}
			}
		})
	}
}

func TestExtractPackageDoc(t *testing.T) {
	tmpDir := t.TempDir()

	tests := map[string]struct {
		fileContent string
		expected    string
	}{
		"package with doc comment": {
			fileContent: `// Package actions provides implementations for various ModSecurity actions.
// This is a multi-line package comment.
package actions`,
			expected: "Package actions provides implementations for various ModSecurity actions.\nThis is a multi-line package comment.",
		},
		"package without doc comment": {
			fileContent: `package actions

type SomeFn struct{}`,
			expected: "",
		},
		"package with single line doc": {
			fileContent: `// Package actions provides action implementations.
package actions`,
			expected: "Package actions provides action implementations.",
		},
		"package with whitespace in doc": {
			fileContent: `// Package actions provides action implementations.
//
// This package contains various actions.
package actions`,
			expected: "Package actions provides action implementations.\n\nThis package contains various actions.",
		},
	}

	for name, test := range tests {
		t.Run(name, func(t *testing.T) {
			testFile := filepath.Join(tmpDir, strings.ReplaceAll(t.Name(), "/", "_")+".go")
			err := os.WriteFile(testFile, []byte(test.fileContent), 0644)
			if err != nil {
				t.Fatalf("Failed to create test file: %v", err)
			}

			result := extractPackageDoc(testFile)
			if result != test.expected {
				t.Errorf("want %q, got %q", test.expected, result)
			}
		})
	}
}

func TestExtractPackageDocFileNotFound(t *testing.T) {
	result := extractPackageDoc("/nonexistent/file.go")
	if result != "" {
		t.Errorf("Expected empty string for non-existent file, got %q", result)
	}
}

func TestGetPackageDescription(t *testing.T) {
	tmpDir := t.TempDir()

	tests := map[string]struct {
		setup    func(string) error
		expected string
	}{
		"finds doc.go first": {
			setup: func(dir string) error {
				docGo := `// Package actions from doc.go
package actions`
				actionsGo := `// Package actions from actions.go
package actions`
				otherGo := `// Package actions from other.go
package actions`

				if err := os.WriteFile(filepath.Join(dir, "doc.go"), []byte(docGo), 0644); err != nil {
					return err
				}
				if err := os.WriteFile(filepath.Join(dir, "actions.go"), []byte(actionsGo), 0644); err != nil {
					return err
				}
				return os.WriteFile(filepath.Join(dir, "other.go"), []byte(otherGo), 0644)
			},
			expected: "Package actions from doc.go",
		},
		"falls back to actions.go if no doc.go": {
			setup: func(dir string) error {
				actionsGo := `// Package actions from actions.go
package actions`
				otherGo := `// Package actions from other.go
package actions`

				if err := os.WriteFile(filepath.Join(dir, "actions.go"), []byte(actionsGo), 0644); err != nil {
					return err
				}
				return os.WriteFile(filepath.Join(dir, "other.go"), []byte(otherGo), 0644)
			},
			expected: "Package actions from actions.go",
		},
		"finds any go file if no doc.go or actions.go": {
			setup: func(dir string) error {
				otherGo := `// Package actions from other.go
package actions`
				return os.WriteFile(filepath.Join(dir, "other.go"), []byte(otherGo), 0644)
			},
			expected: "Package actions from other.go",
		},
		"skips test files": {
			setup: func(dir string) error {
				testGo := `// Package actions from test file
package actions`
				otherGo := `// Package actions from regular file
package actions`

				if err := os.WriteFile(filepath.Join(dir, "actions_test.go"), []byte(testGo), 0644); err != nil {
					return err
				}
				return os.WriteFile(filepath.Join(dir, "other.go"), []byte(otherGo), 0644)
			},
			expected: "Package actions from regular file",
		},
		"returns empty string if no package doc found": {
			setup: func(dir string) error {
				noDocGo := `package actions

type SomeFn struct{}`
				return os.WriteFile(filepath.Join(dir, "nodoc.go"), []byte(noDocGo), 0644)
			},
			expected: "",
		},
		"returns empty string for empty directory": {
			setup: func(dir string) error {
				return nil
			},
			expected: "",
		},
		"handles files without package doc gracefully": {
			setup: func(dir string) error {
				file1 := `package actions

type SomeFn struct{}`
				file2 := `// Package actions has documentation
package actions`

				if err := os.WriteFile(filepath.Join(dir, "file1.go"), []byte(file1), 0644); err != nil {
					return err
				}
				return os.WriteFile(filepath.Join(dir, "file2.go"), []byte(file2), 0644)
			},
			expected: "Package actions has documentation",
		},
	}

	for name, test := range tests {
		t.Run(name, func(t *testing.T) {
			testDir := filepath.Join(tmpDir, strings.ReplaceAll(t.Name(), "/", "_"))
			err := os.MkdirAll(testDir, 0755)
			if err != nil {
				t.Fatalf("Failed to create test directory: %v", err)
			}

			err = test.setup(testDir)
			if err != nil {
				t.Fatalf("Setup failed: %v", err)
			}

			result := getPackageDescription(testDir)
			if result != test.expected {
				t.Errorf("want %q, got %q", test.expected, result)
			}
		})
	}
}

func TestGetPackageDescriptionNonExistentDir(t *testing.T) {
	result := getPackageDescription("/nonexistent/directory")
	if result != "" {
		t.Errorf("Expected empty string for non-existent directory, got %q", result)
	}
}
