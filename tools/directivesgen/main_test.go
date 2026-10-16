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
		"undocumented directive":     {"`SecTmpDir` and `SecDefaultAction`", "`SecTmpDir` and [`SecDefaultAction`](#secdefaultaction)"},
		"directive in another case":  {"`SecDefaultACTION`", "[`SecDefaultACTION`](#secdefaultaction)"},
	}
	documented := map[string]bool{"secdefaultaction": true}
	for name, test := range tests {
		t.Run(name, func(t *testing.T) {
			input := test[0]
			expectedOutput := test[1]

			if want, have := expectedOutput, addsLinksToDirectives(input, documented); want != have {
				t.Errorf("unexpected output: want %q, have %q", want, have)
			}
		})
	}
}

func TestDecorateNote(t *testing.T) {
	tests := map[string][2]string{
		"no note":      {"some text", "some text"},
		"plain note":   {"Note: be careful", "**Note:** be careful"},
		"already bold": {"**Note:** be careful", "**Note:** be careful"},
	}
	for name, test := range tests {
		t.Run(name, func(t *testing.T) {
			input := test[0]
			expectedOutput := test[1]

			if want, have := expectedOutput, decorateNote(input); want != have {
				t.Errorf("unexpected output: want %q, have %q", want, have)
			}
		})
	}
}

func TestParseDirective(t *testing.T) {
	tests := map[string]struct {
		doc      string
		expected Directive
	}{
		"fields and content": {
			doc: "Description: Does something.\nSyntax: SecFoo On|Off\nDefault: Off\n---\nSome details.\n\nExample:\n```seclang\nSecFoo On\n```\n",
			expected: Directive{
				Name:        "SecFoo",
				Description: "Does something.",
				Syntax:      "SecFoo On|Off",
				Default:     "Off",
				Content:     "Some details.\n\n**Example:**\n```seclang\nSecFoo On\n```\n\n",
			},
		},
		"continuation line with a colon": {
			doc: "Description: Does something.\nDoing it logs a warning: be careful.\nSyntax: SecFoo On|Off\n---\n",
			expected: Directive{
				Name:        "SecFoo",
				Description: "Does something. Doing it logs a warning: be careful.",
				Syntax:      "SecFoo On|Off",
			},
		},
		"example without separator": {
			doc: "Description: Does something.\nSyntax: SecFoo\n\nExample:\n```seclang\nSecFoo\n```\n",
			expected: Directive{
				Name:        "SecFoo",
				Description: "Does something.",
				Syntax:      "SecFoo",
				Content:     "**Example:**\n```seclang\nSecFoo\n```\n\n",
			},
		},
	}
	for name, test := range tests {
		t.Run(name, func(t *testing.T) {
			if want, have := test.expected, parseDirective("SecFoo", test.doc); want != have {
				t.Errorf("unexpected directive:\nwant: %+v\nhave: %+v", want, have)
			}
		})
	}
}

func TestCodeSpan(t *testing.T) {
	tests := map[string][2]string{
		"plain":          {"SecFoo On|Off", "`SecFoo On|Off`"},
		"with backticks": {"SecFoo NAME `...`", "`` SecFoo NAME `...` ``"},
	}
	for name, test := range tests {
		t.Run(name, func(t *testing.T) {
			if want, have := test[1], codeSpan(test[0]); want != have {
				t.Errorf("unexpected output: want %q, have %q", want, have)
			}
		})
	}
}
