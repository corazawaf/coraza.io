// Copyright 2023 The OWASP Coraza contributors
// SPDX-License-Identifier: Apache-2.0

//go:build mage
// +build mage

package main

import (
	"github.com/magefile/mage/sh"
)

func Generate() error {
	if err := sh.RunV("go", "run", "tools/directivesgen/main.go"); err != nil {
		return err
	}

	return nil
}
