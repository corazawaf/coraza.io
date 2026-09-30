---
title: "Coraza 3.8.0 Is Out"
description: "FIPS 140-3 support, a new rule action, prefilter performance and correctness work, a batch of transformation fixes, and the security advisories coming for this release."
date: 2026-09-30
draft: true
images: []
contributors: ["Felipe Zipitria"]
---

Coraza 3.8.0 shipped on 30 September, five months after 3.7.0. Here's what's in it.

---

## FIPS 140-3 support

[PR #1678](https://github.com/corazawaf/coraza/pull/1678).

Coraza now builds in a FIPS 140-3 compliant mode. If you run in a regulated environment where the cryptographic primitives in your dependency chain need to be certified, this is for you.

## A new `accuracy` rule action

[PR #1693](https://github.com/corazawaf/coraza/pull/1693).

The `accuracy` action is now registered and available in rules, alongside the existing `maturity` action. Both let rule authors annotate confidence in a rule's detection quality, which downstream tooling (and rule sets like CRS) can use to tune sensitivity.

## More prefilter work

Following on from the `@rx` prefiltering work covered in the [Oslo post]({{< ref "/blog/oslo-march-2026" >}}), two more performance improvements landed for other operators:

- [PR #1597](https://github.com/corazawaf/coraza/pull/1597) replaces the Aho-Corasick matcher backing the `anyRequired` prefilter with an indexed bitmap matcher.
- [PR #1601](https://github.com/corazawaf/coraza/pull/1601) adds a minimum-length prefilter to the `@pm` operator, so short inputs skip pattern matching entirely.

Same idea as before: cheap checks first, full evaluation only when it's actually needed.

The `@rx` prefilter itself also got a correctness fix: [PR #1724](https://github.com/corazawaf/coraza/pull/1724) tightens how anchored patterns are handled. The prefilter used to assume that an extracted literal next to a `^` or `$` anchor was actually adjacent to it in the pattern; it wasn't always, which could let the prefilter rule out a match too eagerly. It now verifies adjacency before applying the prefix/suffix optimisation, restoring the fail-safe guarantee described in the Oslo post — the prefilter can only say "maybe" too often, never "no" when the real answer is "yes". This only affects builds using the opt-in `coraza.rule.rx_prefilter` tag.

## Transformation correctness

A cluster of fixes went into how transformation functions handle edge cases in their input encoding:

- `urlDecodeUni` now implements Unicode best-fit mapping ([#1649](https://github.com/corazawaf/coraza/pull/1649))
- `base64DecodeExt` skips invalid bytes instead of stopping ([#1664](https://github.com/corazawaf/coraza/pull/1664)) and accepts the base64url alphabet ([#1652](https://github.com/corazawaf/coraza/pull/1652))
- `compressWhitespace` decodes runes instead of indexing raw bytes ([#1659](https://github.com/corazawaf/coraza/pull/1659))
- `cssDecode` encodes hex escapes as UTF-8 instead of truncating them ([#1658](https://github.com/corazawaf/coraza/pull/1658))
- `jsDecode` decodes ES2015+ `\u{...}` extended Unicode escapes ([#1657](https://github.com/corazawaf/coraza/pull/1657))
- `normalisePathWin` strips Windows trailing dots/spaces and ADS suffixes ([#1660](https://github.com/corazawaf/coraza/pull/1660)), and both `normalisePath` and `normalisePathWin` no longer report a false `changed=true` when the path is untouched ([#1672](https://github.com/corazawaf/coraza/pull/1672))

None of these are exotic inputs — they're the kind of encoding corner cases that show up in real traffic. If you maintain custom rules or a body processor that leans on these transformations, it's worth a look.

## Rule management fixes

- `SecRuleRemoveByPath`, and friends no longer skip chain children when removing targets, tags, or messages ([#1622](https://github.com/corazawaf/coraza/pull/1622))
- `SecRuleUpdateTarget` now applies to the stored rule rather than a loop copy, so updates actually stick ([#1701](https://github.com/corazawaf/coraza/pull/1701))

## Also worth knowing

- Architecture Decision Records (ADRs) now live in the repository, with records backfilled for every release from 3.0.x through 3.7.0 ([#1690](https://github.com/corazawaf/coraza/pull/1690) and follow-ups)
- An `AGENTS.md` was added for LLM-assisted contributions ([#1535](https://github.com/corazawaf/coraza/pull/1535))
- Routine dependency updates across `golang.org/x/net`, `x/crypto`, `x/mod`, and `x/text`

---

## Security

We'll be publishing a batch of security advisories for issues reported and fixed in this release. As always, they'll appear on the [repository's Security Advisories page](https://github.com/corazawaf/coraza/security/advisories) once ready — we don't pre-announce specifics ahead of a fix being available.

Two related process changes already landed: `SECURITY.md` was updated ([#1634](https://github.com/corazawaf/coraza/pull/1634)), and vulnerability reports must now disclose any AI tooling used in the research behind them ([#1720](https://github.com/corazawaf/coraza/pull/1720)).

If you find a security issue in Coraza, please report it through the process in [SECURITY.md](https://github.com/corazawaf/coraza/blob/main/SECURITY.md) rather than opening a public issue.

---

We'll update this post with the advisories once they're published.
