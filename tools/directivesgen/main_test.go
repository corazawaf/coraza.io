package main

import "testing"

func TestAddsLinksToDirectives(t *testing.T) {
	tests := map[string][2]string{
		"empty":                      {"", ""},
		"no directives":              {"foo", "foo"},
		"directive at the beginning": {"`SecDefaultAction`", "[`SecDefaultAction`](#secdefaultaction)"},
		"directive at the end":       {"something `SecDefaultAction`", "something [`SecDefaultAction`](#secdefaultaction)"},
		"directive in the middle":    {"something `SecDefaultAction` something", "something [`SecDefaultAction`](#secdefaultaction) something"},
	}
	for name, test := range tests {
		t.Run(name, func(t *testing.T) {
			input := test[0]
			expectedOutput := test[1]

			if want, have := expectedOutput, addsLinksToDirectives(input); want != have {
				t.Errorf("unexpected output: want %q, have %q", want, have)
			}
		})
	}
}
