---
title: "Oslo, Regex, and a WAF That Finally Flies"
description: "We met in Norway, made some decisions, and shipped two of the biggest performance improvements Coraza has seen in a while."
date: 2026-03-31
draft: false
images: []
contributors: ["Juan Pablo Tosso"]
---

So we went to Oslo! Felipe, Jose Carlos, and I got together at the [OWASP Project Summit](https://projectsummit.owasp.org/) in early March and spent a week actually talking to each other in person for once. Workshops, long dinners, and a lot of conversations that would've taken months on GitHub. It was really good to be there. After the summit, Felipe and I — along with a couple of OWASP folks — took a trip up to Tromso to watch the northern lights. Breathtaking, honestly. We literally wrote some Coraza code up there, under the auroras. Not a bad office.

{{< figure src="oslo-team.jpg" alt="The Coraza team at the OWASP Project Summit in Oslo, Norway" caption="Oslo, March 2026." >}}

Anyway, here's what came out of it on the technical side.

---

## Memoization is on by default now

[PR #1540](https://github.com/corazawaf/coraza/pull/1540) — merged March 18.

We had memoization for regex and Aho-Corasick builders for a while already, but it was behind a build tag (`memoize_builders`) that basically nobody knew about. So most users were recompiling the same patterns from scratch every single time a WAF instance was created. Not great.

We flipped it. Memoization is on by default now. If you don't want it for some reason, opt out with `coraza.no_memoize`.

The real win here isn't startup speed — it's memory. Without memoization, every CRS instance you create compiles all the regex and Aho-Corasick patterns from scratch and keeps its own copy. Each new instance adds ~21.5 MiB. With memoization, the compiled patterns are shared, so each additional instance costs ~2.1 MiB. Run 10 WAF instances and you go from ~215 MiB down to ~21 MiB. That's a 10x reduction, and it scales — the more instances, the bigger the gap.

That's what convinced us to turn this on by default. If you run multiple tenants, use Caddy with frequent reloads, or spin up WAF instances dynamically, this one's for you.

There's a small breaking change: `internal/memoize` went from a package-level `Do()` function to a `Memoizer` struct, and it now flows through `OperatorOptions`. Zero value means no memoization, so it's backward compatible — but if you're building custom operators, double check your code still compiles.

Also hit a fun TinyGo bug: `sync.Map.Range()` in TinyGo holds a lock that you can't re-enter, which caused a deadlock during cleanup. Fixed by collecting the keys first, then deleting after the range finishes.

---

## @rx prefiltering — skip the regex before you even run it

[PR #1534](https://github.com/corazawaf/coraza/pull/1534) — in review.

`@rx` is the heaviest thing Coraza does per request. CRS has hundreds of regex rules and most of them return false for normal traffic. You're still paying the full cost to evaluate them though.

This PR does a compile-time pass over the regex AST to build cheap pre-checks. Three things:

1. **Minimum length check** — input shorter than the shortest possible match? Skip.
2. **Required literal prefilter** — extracts literal substrings that must appear in any match, checks them with `strings.Contains` or Aho-Corasick first. Not there? Skip the regex.
3. **Less allocations** — swaps `FindStringSubmatch` for `FindStringSubmatchIndex` in the capturing path.

The first two need the `coraza.rule.rx_prefilter` build tag. The allocation fix is always on.

Benchmarks on non-matching inputs (which is most of your traffic):

- Regex only: ~997 ns/op
- With prefilter: ~146 ns/op — about **6.8x faster**

The whole thing is designed to fail safe. If literal extraction is uncertain, it just runs the full regex. A bug can only make the prefilter say "maybe" too often — it can never say "no" when the real answer is "yes". Tested against all 294 `@rx` patterns from CRS v4.24.0, 96,466 inputs, zero false negatives.

Unicode is handled too — Go's `(?i)` has some non-ASCII fold cases for `s` and `k`, so if a case-insensitive prefilter sees non-ASCII input it just passes through to the regex.

---

## Other stuff from March

Nothing massive, but a few things worth knowing:

- Better handling of rule transformation errors
- Fixed a CI issue where scale tests weren't checking `testing.Short()`, which was causing TinyGo builds to time out for hours
- Some cleanup on how operators get their config from the WAF at init time

---

Oslo was worth it. Some decisions are just faster in person — like whether memoization should be on by default, which is a five-minute conversation, not three weeks of GitHub comments. Happy we did it.

More to come soon!

— Juan Pablo Tosso

{{< figure src="tromso.jpg" alt="Northern lights in Tromso, Norway" caption="Tromso. Yeah, it was that good." >}}
