---
title: "Coraza 3.8.0 and 3.8.1 Are Out"
description: "Twelve security advisories, FIPS 140-3 support, a new rule action, prefilter work, a batch of transformation fixes, and the behaviour changes to check before you upgrade."
date: 2026-10-02
draft: false
images: []
contributors: ["Felipe Zipitria"]
---

Coraza 3.8.0 shipped on 30 September, nearly six months after 3.7.0. Coraza 3.8.1 followed on 2 October. It is a security release: it completes several fixes that were only partial in 3.8.0, fixes a process crash, and fixes two 3.8.0 regressions.

**Upgrade to 3.8.1.** This applies to everyone, including users still on 3.7.x or earlier. Most of the issues below affect every 3.x release.

---

## Before you upgrade

{{< callout context="warning" >}}
**Running without rules 200004 and 200005 from `coraza.conf-recommended`?** `SecArgumentsLimit` defaults to 1000 even when it is not set. Since 3.8.0, arguments beyond that limit are dropped from the tail, and only `ARGUMENTS_LIMIT_REACHED` is set. This covers arguments from the query string and from urlencoded and JSON bodies. If no rule acts on that flag, Coraza does not inspect those arguments. CRS on its own and older vendored copies of `coraza.conf-recommended` both fall into this case. Add rules 200004 and 200005 from `coraza.conf-recommended`, or an equivalent rule on `ARGUMENTS_LIMIT_REACHED`.
{{< /callout >}}

### Coming from 3.7.x

- **`SecArgumentsLimit`** (default 1000) now also applies to urlencoded and JSON request bodies. Rules 200004 and 200005 reject requests that exceed it. If your APIs legitimately send more values, raise the limit.
- **New rule 200009** in `coraza.conf-recommended` returns 400 for URIs that fail to parse. That includes invalid path escapes (`/50%off`, `%zz`), a bad port, or a missing leading `/`.
- **`URLENCODED_ERROR` is no longer set when the request URI fails to parse.** Use the new `URI_PARSE_ERROR` variable instead. Rule 200009 relies on it.
- **Rule 200003** now returns 400 for multipart parts with malformed or duplicate headers. These used to hide uploaded files from rule inspection. A part with only `filename*` now goes to `FILES` instead of `ARGS_POST`.
- **`SecDefaultAction`** was removed from `coraza.conf-recommended` ([#1630](https://github.com/corazawaf/coraza/pull/1630)).
- **API breaks for connector and plugin authors.** New methods on `plugintypes.TransactionVariables` break external implementations at compile time. New `types/variables` constants were inserted mid-`iota`, which renumbers every constant after them. Rebuild against 3.8.1 rather than relying on stored numeric values.

### Coming from 3.8.0

- **Duplicate `Content-Type` headers:** the first header now selects the body processor. This matches what `Header.Get` reads, and so what a typical backend sees. Before, the last matching header won.
- **`filename*` with numbered continuations** (`filename*0=`, `filename*0*=`, ...) now sets `MULTIPART_STRICT_ERROR`, so rule 200003 rejects the request with 400.
- **JSON bodies over the flattening memory budget** now set `REQBODY_ERROR`, so rule 200002 rejects them with 400. Before, they were only truncated.
- **Empty cookie names:** `REQUEST_COOKIES` and `REQUEST_COOKIES_NAMES` can now contain an entry named `""` (for example, from `Cookie: =value`), and `&REQUEST_COOKIES` counts it. This deliberately deviates from ModSecurity v2 and v3, which skip such cookies. Some backends, such as Node's `cookie` package, pass them to the application. A bare `=` is still skipped.
- **Regex `ctl` target removals** (`ctl:ruleRemoveTargetById=N;ARGS:/re/`) no longer remove entries named `""` unless the regex matches the empty string.
- **JSON array-length entries** (`json.a` holding the array length) no longer count towards `SecArgumentsLimit`.
- **`coraza.conf-recommended`** now sets `SecArgumentsLimit 1000` explicitly. Before, it was commented out. The limit applies per source: `ARGS_GET`, `ARGS_PATH`, `ARGS_POST`, and `RESPONSE_ARGS`.

3.8.1 also fixes two regressions from 3.8.0:

- With `SecRequestBodyLimitAction ProcessPartial`, rule 200003 rejected every multipart upload larger than the body limit ([#1725](https://github.com/corazawaf/coraza/pull/1725)).
- A JSON array with exactly `SecArgumentsLimit` elements was rejected ([#1729](https://github.com/corazawaf/coraza/pull/1729)).

---

## Security advisories

All twelve advisories are published on the [repository's Security Advisories page](https://github.com/corazawaf/coraza/security/advisories). Each one has the full details and affected versions.

### Fixed in 3.8.1

These were partially fixed in 3.8.0. Users on 3.8.0 are still affected.

| Advisory | Severity | Affected | Summary |
| --- | --- | --- | --- |
| [GHSA-6gcq-wc29-5xf2](https://github.com/corazawaf/coraza/security/advisories/GHSA-6gcq-wc29-5xf2) | High | 3.0.0 – 3.8.0 | A deeply nested JSON request or response body could crash the process with an unrecoverable stack overflow. |
| [GHSA-6r3q-mjv7-xr8m](https://github.com/corazawaf/coraza/security/advisories/GHSA-6r3q-mjv7-xr8m) (CVE-2026-41510) | High | 3.0.0 – 3.8.0 | Arguments beyond `SecArgumentsLimit` were dropped silently, so flooding parameters could hide a payload from `ARGS` rules. 3.8.1 also bounds JSON array-length entries, which closes a memory-exhaustion path. |
| [GHSA-5gj4-9gm7-2fx2](https://github.com/corazawaf/coraza/security/advisories/GHSA-5gj4-9gm7-2fx2) | Medium | 3.0.0 – 3.8.0 | Distinct JSON keys could collapse into the same `ARGS_POST` name and overwrite each other, hiding a value from inspection. |
| [GHSA-w253-m66g-rx24](https://github.com/corazawaf/coraza/security/advisories/GHSA-w253-m66g-rx24) | Medium | 3.0.4 – 3.8.0 | An urlencoded `Content-Type` with a parameter (such as `; charset=UTF-8`) skipped body processing. |
| [GHSA-3wr7-993q-jrff](https://github.com/corazawaf/coraza/security/advisories/GHSA-3wr7-993q-jrff) | Medium | < 3.8.1 | A multipart `filename*` parameter could present one filename to Coraza and a different one to the backend. 3.8.1 also fixes a CPU-exhaustion path in the duplicate-parameter check that 3.8.0 introduced. |
| [GHSA-g4qm-m288-5cp9](https://github.com/corazawaf/coraza/security/advisories/GHSA-g4qm-m288-5cp9) | Medium | < 3.8.1 | Control characters at the edges of cookie names and values made Coraza and the backend disagree about which cookie they received. |

### Fixed in 3.8.0

| Advisory | Severity | Affected | Summary |
| --- | --- | --- | --- |
| [GHSA-prpw-wwv7-xjjr](https://github.com/corazawaf/coraza/security/advisories/GHSA-prpw-wwv7-xjjr) (CVE-2026-41504) | Medium | 3.0.0 – 3.7.0 | The Native audit-log format wrote request and response data without escaping CR/LF, allowing log forgery. The JSON and OCSF formats were not affected. |
| [GHSA-r3rm-qphw-hh76](https://github.com/corazawaf/coraza/security/advisories/GHSA-r3rm-qphw-hh76) (CVE-2026-41508) | Medium | 3.4.0 – 3.7.0 | A truncated multipart body did not set `MULTIPART_STRICT_ERROR`, so rule 200003 never fired. |
| [GHSA-pc5q-qfxp-ggqv](https://github.com/corazawaf/coraza/security/advisories/GHSA-pc5q-qfxp-ggqv) | Medium | 3.0.0 – 3.7.0 | An off-by-one in `t:jsDecode` turned every octal escape into a null byte, so octal-encoded payloads bypassed rules using that transformation. |
| [GHSA-3c6w-j9xm-8h2h](https://github.com/corazawaf/coraza/security/advisories/GHSA-3c6w-j9xm-8h2h) | Medium | 3.0.0 – 3.7.0 | The JSON response body processor had no recursion limit, so a deeply nested response could keep a core busy for seconds. |
| [GHSA-rp9v-7xv3-r6g3](https://github.com/corazawaf/coraza/security/advisories/GHSA-rp9v-7xv3-r6g3) | Medium | 3.0.0 – 3.7.0 | The multipart processor held a file descriptor open for every file part until the request finished, so many small parts could exhaust the descriptor table. |
| [GHSA-x26q-wvhg-fh4m](https://github.com/corazawaf/coraza/security/advisories/GHSA-x26q-wvhg-fh4m) | Medium | 3.0.0 – 3.7.0 | When the request URI failed to parse, `QUERY_STRING` and `ARGS_GET` were left empty. This mainly affects integrations that don't go through `net/http`. |

Thanks to everyone who reported and analysed these: @oguzylmzx, @MushroomWasp, @airween, @janmrow, @HackingRepo, @zuesdevil, @WalTeR-RE, and @claude.

Two related process changes landed in this cycle. `SECURITY.md` was updated ([#1634](https://github.com/corazawaf/coraza/pull/1634)). Vulnerability reports must now disclose any AI tooling used in the research behind them ([#1720](https://github.com/corazawaf/coraza/pull/1720)), and triage now scores exploitability preconditions ([#1722](https://github.com/corazawaf/coraza/pull/1722)).

If you find a security issue in Coraza, report it through the process in [SECURITY.md](https://github.com/corazawaf/coraza/blob/main/SECURITY.md) rather than opening a public issue.

---

## FIPS 140-3 support

[PR #1678](https://github.com/corazawaf/coraza/pull/1678).

Coraza now runs under Go's FIPS 140-3 mode. Coraza detects it at runtime with `crypto/fips140.Enabled()`, so there is no build tag, and default builds are unchanged. Turn it on the usual Go way, for example with `GODEBUG=fips140=on`.

MD5 and SHA-1 are not FIPS-approved, so `t:md5` and `t:sha1` don't work in this mode. They stay registered so that rule sets still load; CRS uses `t:sha1` in rules 901320 and 901410. In FIPS mode, these transformations fail at evaluation time and the engine logs a warning. The operator then sees the untransformed value, so the rule stops matching instead of interrupting the transaction. CI runs the full suite and the CRS regression tests under both `fips140=on` and `fips140=only`.

## A new `accuracy` rule action

[PR #1693](https://github.com/corazawaf/coraza/pull/1693).

The `accuracy` action was documented, and the field was already emitted to the audit log, but the action itself was never registered. Rules using it failed to parse with `invalid action "accuracy"`. It now works the same way as `maturity`. It is a metadata action that takes a value from 1 to 9 and stores it on the rule.

## More prefilter work

Following on from the `@rx` prefiltering work covered in the [Oslo post]({{< ref "/blog/oslo-march-2026" >}}), two more performance improvements landed for other operators:

- [PR #1597](https://github.com/corazawaf/coraza/pull/1597) replaces the Aho-Corasick matcher behind the `anyRequired` prefilter with an indexed bitmap matcher.
- [PR #1601](https://github.com/corazawaf/coraza/pull/1601) adds a minimum-length prefilter to the `@pm` operator, so short inputs skip pattern matching entirely.

Same idea as before: cheap checks first, full evaluation only when it's needed.

The `@rx` prefilter itself also got a correctness fix. [PR #1724](https://github.com/corazawaf/coraza/pull/1724) tightens how anchored patterns are handled. The prefilter assumed that a literal extracted next to a `^` or `$` anchor was adjacent to it in the pattern. It wasn't always, so the prefilter could rule out a match too eagerly. It now verifies adjacency before applying the prefix/suffix optimisation. That restores the fail-safe guarantee described in the Oslo post: the prefilter can say "maybe" too often, but never "no" when the real answer is "yes". This only affects builds that use the opt-in `coraza.rule.rx_prefilter` tag.

[PR #1695](https://github.com/corazawaf/coraza/pull/1695) also removes a mutex from random string generation by switching to `math/rand/v2`.

## Transformation correctness

A cluster of fixes changes how transformation functions handle edge cases in their input encoding:

- `urlDecodeUni` now implements Unicode best-fit mapping ([#1649](https://github.com/corazawaf/coraza/pull/1649)).
- `base64DecodeExt` skips invalid bytes instead of stopping ([#1664](https://github.com/corazawaf/coraza/pull/1664)), and it accepts the base64url alphabet ([#1652](https://github.com/corazawaf/coraza/pull/1652)).
- `compressWhitespace` decodes runes instead of indexing raw bytes ([#1659](https://github.com/corazawaf/coraza/pull/1659)).
- `cssDecode` encodes hex escapes as UTF-8 instead of truncating them ([#1658](https://github.com/corazawaf/coraza/pull/1658)).
- `jsDecode` decodes ES2015+ `\u{...}` extended Unicode escapes ([#1657](https://github.com/corazawaf/coraza/pull/1657)).
- `normalisePathWin` strips Windows trailing dots, trailing spaces, and ADS suffixes ([#1660](https://github.com/corazawaf/coraza/pull/1660)).
- `normalisePath`, `normalisePathWin`, `cmdLine`, and `urlDecodeUni` no longer report `changed=true` when the input is untouched ([#1672](https://github.com/corazawaf/coraza/pull/1672), [#1631](https://github.com/corazawaf/coraza/pull/1631)).

None of these are exotic inputs. They're the kind of encoding corner cases that show up in real traffic. If you maintain custom rules or a body processor that relies on these transformations, check them against your rules.

## Engine and rule management fixes

- `ctl:ruleRemoveTargetById`, `ctl:ruleRemoveTargetByTag`, and `ctl:ruleRemoveTargetByMsg` now apply to chain children ([#1622](https://github.com/corazawaf/coraza/pull/1622)).
- `SecRuleUpdateTarget` now applies to the stored rule rather than a loop copy, so updates take effect ([#1701](https://github.com/corazawaf/coraza/pull/1701)).
- `rule.msg` is expanded at match time ([#1606](https://github.com/corazawaf/coraza/pull/1606)).
- Glob `Include` results are no longer re-anchored to the current directory ([#1689](https://github.com/corazawaf/coraza/pull/1689)).
- Pooled transactions now reset `detectionOnlyInterruption` and `ForceResponseBodyVariable` on reuse ([#1641](https://github.com/corazawaf/coraza/pull/1641), [#1642](https://github.com/corazawaf/coraza/pull/1642)).
- The JSON body processor fills `ARGS_POST` even when the body is invalid JSON ([#1615](https://github.com/corazawaf/coraza/pull/1615)).

## Also worth knowing

- `libinjection-go` is updated to v0.3.3 ([#1707](https://github.com/corazawaf/coraza/pull/1707)).
- Architecture Decision Records (ADRs) now live in the repository, with records backfilled for every release from 3.0.x to 3.7.0 ([#1690](https://github.com/corazawaf/coraza/pull/1690) and follow-ups).
- `AGENTS.md` is now the single guide for contributors and coding agents ([#1535](https://github.com/corazawaf/coraza/pull/1535)).
- Every directive in the documentation now has SecLang examples ([#1694](https://github.com/corazawaf/coraza/pull/1694)), and the `SecArgumentsLimit` and multipart variable docs were corrected ([#1727](https://github.com/corazawaf/coraza/pull/1727), [#1728](https://github.com/corazawaf/coraza/pull/1728)).
- Routine dependency updates landed across `golang.org/x/net`, `x/crypto`, `x/mod`, and `x/text`.

## Known limitations

These are tracked for a later release:

- Multipart form fields are not counted against `SecArgumentsLimit`.
- `SecUploadFileLimit` is parsed but not enforced.

---

Full changelogs: [3.8.0](https://github.com/corazawaf/coraza/releases/tag/v3.8.0) and [3.8.1](https://github.com/corazawaf/coraza/releases/tag/v3.8.1).
