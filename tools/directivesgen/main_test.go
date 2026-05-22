package main

import "testing"

func TestNormalizeSecLangFences(t *testing.T) {
	tests := map[string][2]string{
		"empty": {"", ""},
		"no fences": {"some text\nmore text", "some text\nmore text"},
		"apache fence": {"```apache\nSecRule\n```", "```seclang\nSecRule\n```"},
		"bare opening fence": {"```\nSecRule\n```", "```seclang\nSecRule\n```"},
		"already seclang fence": {"```seclang\nSecRule\n```", "```seclang\nSecRule\n```"},
		"other language fence preserved": {"```go\nfunc main() {}\n```", "```go\nfunc main() {}\n```"},
		"mixed fences": {
			"prose\n```apache\nSecRule\n```\nmore\n```\nother\n```",
			"prose\n```seclang\nSecRule\n```\nmore\n```seclang\nother\n```",
		},
		"bare_opening_fence_after_closed_block": {
			"```seclang\nSecRule\n```\n```\nother\n```",
			"```seclang\nSecRule\n```\n```seclang\nother\n```",
		},
	}
	for name, test := range tests {
		t.Run(name, func(t *testing.T) {
			input := test[0]
			expectedOutput := test[1]

			if want, have := expectedOutput, normalizeSecLangFences(input); want != have {
				t.Errorf("unexpected output:\nwant: %q\nhave: %q", want, have)
			}
		})
	}
}

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
