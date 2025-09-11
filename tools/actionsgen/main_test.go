package main

import "testing"

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

func TestPage(t *testing.T) {
	// Test the Page struct initialization
	page := Page{
		LastModification: "2024-01-01T00:00:00Z",
		Actions: []Action{
			{
				Name:        "test",
				ActionGroup: "Disruptive",
				Description: "Test action",
				Example:     "Test example",
			},
		},
	}

	if page.LastModification != "2024-01-01T00:00:00Z" {
		t.Errorf("LastModification: want %q, have %q", "2024-01-01T00:00:00Z", page.LastModification)
	}

	if len(page.Actions) != 1 {
		t.Errorf("Actions length: want %d, have %d", 1, len(page.Actions))
	}

	if page.Actions[0].Name != "test" {
		t.Errorf("First action name: want %q, have %q", "test", page.Actions[0].Name)
	}
}

func TestAction(t *testing.T) {
	// Test the Action struct initialization
	action := Action{
		Name:        "testAction",
		ActionGroup: "Non-disruptive",
		Description: "Test description",
		Example:     "Test example",
		Phases:      "1, 2",
	}

	if action.Name != "testAction" {
		t.Errorf("Name: want %q, have %q", "testAction", action.Name)
	}

	if action.ActionGroup != "Non-disruptive" {
		t.Errorf("ActionGroup: want %q, have %q", "Non-disruptive", action.ActionGroup)
	}

	if action.Description != "Test description" {
		t.Errorf("Description: want %q, have %q", "Test description", action.Description)
	}

	if action.Example != "Test example" {
		t.Errorf("Example: want %q, have %q", "Test example", action.Example)
	}

	if action.Phases != "1, 2" {
		t.Errorf("Phases: want %q, have %q", "1, 2", action.Phases)
	}
}
