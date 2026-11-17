# Typed dispatch release preparation

Public scope: [#112](https://github.com/antonsmolko/gost-spec/issues/112).
Prerequisite [archive PR #113](https://github.com/antonsmolko/gost-spec/pull/113)
remains separately reviewable, prefix[gost-spec-109]. This branch uses
[gost-spec-112] and starts from that archive for a focused stacked diff.
Preparation permission is private input, not a public basis; public actionable
source is #112. Merge and new tags require their separate approvals.

## Existing supported distribution

Reuse [OpenAI native plugins](https://developers.openai.com/plugins/build/plugins),
[Claude native marketplaces](https://code.claude.com/docs/en/plugin-marketplaces)
and the [maintained upstream
catalog](https://github.com/anthropics/claude-plugins-official/blob/main/.claude-plugin/marketplace.json).
The concrete need is delivery of #109's already verified recipes, not new tooling.
The runbook/catalog/native procedures are unchanged.

| Plugin | Candidate | Planned tag, unavailable until approved publication |
| --- | --- | --- |
| gost-functional-core | 0.3.0 | gost-functional-core-v0.3.0 |
| gost-svelte-shell | 0.4.0 | gost-svelte-shell-v0.4.0 |
| gost-feature | 0.2.0 | gost-feature-v0.2.0 |

Presenter 0.1.1 remains byte-identical and installable in the same snapshot without
a new presenter tag. Existing tags stay immutable; all three new tags, if approved,
select one verified final main. Plugin versions stay independent of gost-kit.
Remove only the three unreleased heading suffixes: changelog content is identified
by manifest version, while publication requires an actual approved immutable tag.
No second content/version bump is needed for an unissued candidate.

## Verification and delivery

Use two fresh isolated native profiles, public branch source, install/repeat all
four, discovery/details, real config ref/clone HEAD and complete installed maps.
Compare all files to the committed source, including changed changelogs. Check
personal config/installed-marketplace fingerprints before/after; no model turn
or asc-admin edit. Record commands, versions, source, map formula/digests and any
failed attempt. Missing/mismatched source, CLI failure or unreadable files leave
readiness incomplete; never substitute old cache/loopback proof.

Reuse #109's actual npm common 0.4 / svelte 0.3 and reducer/API/browser evidence because
all skill/recipe/fixture bytes remain unchanged. Run root check/strict/link audit,
protected-path/full-diff/issue conflict scan and independent complete review.
Retarget to main after approved archive merge and require both Verify jobs before
release-preparation merge. Verify the resulting main/payload, present its exact
SHA/composition for explicit release approval, then create only absent immutable
tags. Verify each final tag in both hosts and update delivery checkpoints. Until
those steps succeed, publication tasks/issue closure remain pending.

## Native preparation evidence

Public source a38fd24 was pushed before checks. Codex 0.169.0 and Claude 2.1.308
each used a separate fresh CODEX_HOME/CLAUDE_CONFIG_DIR and empty cwd, unchanged
HOME, parent HERDR/session variables removed and temporary HTTP/1.1/low-speed
Git settings. Both CLI versions were read from the actual command output.
All native commands exited zero without retries: install/repeat all four,
inventory/discovery/details and complete installed file maps. Actual selected
refs and clone HEADs identify the branch/source, not an old cache. Fresh Codex
app-server initialize(experimentalApi), initialized, skills/list(forceReload)
returned four unique enabled @gost skills and zero errors; Claude details showed
Skills (1) per plugin. Personal protected fingerprints matched before/after.

Codex sequence in its disposable profile:

```sh
codex plugin marketplace add https://github.com/antonsmolko/gost-spec.git --ref feature/gost-spec-112-typed-dispatch-release --json
for plugin_name in gost-feature gost-functional-core gost-svelte-shell gost-view-presenter; do
  codex plugin add "$plugin_name@gost" --json
  codex plugin add "$plugin_name@gost" --json
done
codex plugin list --json
```

Claude sequence in its different disposable profile:

```sh
claude plugin marketplace add 'https://github.com/antonsmolko/gost-spec.git#feature/gost-spec-112-typed-dispatch-release' --json
for plugin_name in gost-feature gost-functional-core gost-svelte-shell gost-view-presenter; do
  claude plugin install "$plugin_name@gost" --json
  claude plugin install "$plugin_name@gost" --json
done
claude plugin list --json
for plugin_name in gost-feature gost-functional-core gost-svelte-shell gost-view-presenter; do
  claude plugin details "$plugin_name@gost"
done
```

All eight complete maps (66 actual files) equal git-show at the source below.
Digest is SHA256 of UTF-8 json.dumps(relative-path to file SHA256, sort_keys=True,
separators=(',', ':')). Three maps change only for neutral changelog headings;
presenter remains byte-identical. This branch proof is not final-tag, model,
update/rollback or asc-admin execution proof. Runtime evidence remains the
archived #109 verification of identical skill/recipe/fixture bytes.

Source: `a38fd2494acc3f3860feac734345d26778f00f2a`.

| Plugin | Version | Files per host | Complete map SHA256 in both hosts |
| --- | --- | --- | --- |
| gost-feature | 0.2.0 | 9 | b2d20a04b07f1234190519e7fc5f6e72304a547d7d50b65c5ddd48bef36ff89a |
| gost-functional-core | 0.3.0 | 8 | 6bf504fc6d08da454bf9b5f20f067d3825bc95ed19ffa20fb09b9970b119b24e |
| gost-svelte-shell | 0.4.0 | 8 | 89e66da8c4fc3309227bffbdf35679a94347f1337a6b11e333c1267f782f2b4d |
| gost-view-presenter | 0.1.1 | 8 | 88e9becde94292712994188b30e1b445fc7e418edbcfaa50a6dc46928fcee2ac |

## Review ledger and issue edits

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| [#112](https://github.com/antonsmolko/gost-spec/issues/112) | Prepare delivery of verified typed dispatch recipes | Three changelogs, runbook/checkpoints | Preparation implemented; publication pending | Native source/maps above; skills/recipes/fixtures/manifests/catalogs retained |
| [#112](https://github.com/antonsmolko/gost-spec/issues/112), private review input, not a public basis | Older baseline wording could confuse shell-plugin and npm binding versions | Runbook | Clarified | Explicit @gost-kit/common@0.3.0 / @gost-kit/svelte@0.2.0 names |

Archive prerequisite is open PR #113; this release preparation is open PR #114
stacked on it. #106/#109 retain completed criteria/closure and current verified
main canonical links until separately approved archive delivery. #112 gains this
preparation/native/review checkpoint and immutable ledger URL, without checking
its publication criterion. Preparation request/permission remains private input,
not a public basis; #112 is the public actionable scope. Three planned tag names
were confirmed absent before preparation; existing remote refs were recorded and
will be compared again before completion. No tag mutation or publication.

## Final preparation verification

The local-link audit uses marked heading tokens, removes inline HTML and
punctuation, lowercases text and replaces each whitespace character with one
hyphen without collapsing. Duplicate slugs get -1/-2 suffixes; explicit HTML ids
are included. Tracked relative targets and fragments are checked against the
selected tree, excluding URI links from local counts.

Root 121/121, strict 15/15, tracked Markdown 180/308/36/0 and diff --check pass.
Complete diff against archive base 84c9497 inspected; protected skills/references,
manifests, fixtures, catalogs, presenter and five normative packages are unchanged.
Existing remote refs match the before snapshot exactly; three planned names remain
absent. No delta contracts change. Relevant unchanged docs/specs and live issue
criteria/dependencies were checked separately from tests for conflicting release
or compatibility claims. Both original issue closures remain intact.

Independent complete-result review PASS, no open actionable findings after the
wording clarification above. Private review input, not a public basis; public
scope is #112/PR #114. Reviewer independently recomputed eight installed maps,
checked source/ref/clone HEADs, all actual command receipts, fresh Codex discovery,
Claude details and before/after/current personal fingerprints, remote refs and
absence of planned tags; checked full root/strict/link logs and complete diff.
Only GOST plugin skills are counted; ambient personal skill metadata can still
be discovered despite separate plugin profiles. No claim of model invocation or
complete isolation of all personal skill discovery is made.

PR #114 is ready for review, stacked on #113. Preparation tasks 1/2 are complete;
publication task 3 remains pending separate integration/final-main approval and
final-tag checks. Only runbook/checkpoint/evidence text changed after a38fd24;
all installed plugin bytes remain those native-verified maps. After approved
merges, the merging agent verifies actual main, updates canonical current URLs
on the delivered SHA and presents exact final SHA/three tags for release approval.

## PR 114 published review response

Read both inline threads (one page, no next cursor), the full submitted
[review](https://github.com/antonsmolko/gost-spec/pull/114#pullrequestreview-5927615513)
and the empty PR-comment list, plus all PR #113 sources. Prior verified closures
remain closed. Base fixes are incorporated by merge dea0385; this round adds no
new runtime, requirement, native-packaging or approval contract.

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| <a id="pr114-r1"></a>[R1](https://github.com/antonsmolko/gost-spec/pull/114#discussion_r4591521226) | Words and numbers compressed | New plan/evidence, handoff; inherited archive text | Fixed | Check/version/source/task labels separated; base archive formatting included from PR #113 |
| <a id="pr114-r2"></a>[R2](https://github.com/antonsmolko/gost-spec/pull/114#discussion_r4591521243) | Long runbook line/warning wrapping | Release guide | Fixed | Baseline and future-tag warning have separate wrapped paragraphs |
| <a id="pr114-r3"></a>[Review item 1](https://github.com/antonsmolko/gost-spec/pull/114#pullrequestreview-5927615513) | Stacked PR has no CI evidence yet | CI status, merge sequence | Acknowledged; existing gate retained | API reports zero check-runs on reviewed head 8c05c45; after approved #113 merge, retarget #114 to main and wait for both Verify jobs on the actual head before merge |
| <a id="pr114-r4"></a>[Review item 2](https://github.com/antonsmolko/gost-spec/pull/114#pullrequestreview-5927615513) | Audit counts omit anchor method | Design and inherited archive report | Fixed | marked/slug/id/local-target method recorded beside counts in both documents |
| <a id="pr114-r5"></a>[Review item 3](https://github.com/antonsmolko/gost-spec/pull/114#pullrequestreview-5927615513) | Readiness stamp is stale | Readiness | Fixed in base and inherited | Stamp is 2026-11-17, the actual correction date |
| <a id="pr114-r6"></a>[Review item 4](https://github.com/antonsmolko/gost-spec/pull/114#pullrequestreview-5927615513) | Handoff repeats delivery and calls current work next | Handoff | Fixed | One delivery paragraph; release preparation described as current, with its open PR #114 |

Review item 5's systemic spacing is covered by R1. The complete submitted review
and both inline threads receive replies linked to these entries. The absence of
CI is explicitly not a green-check claim; no workflow/branch-protection change is
introduced. The approved existing integration sequence is preserved, with actual
CI verification required before any future merge. No merge is authorized now.

This is an editorial-only round under AGENTS.md rule 6's wording/link exception;
no new independent review is required. Complete final diff and relevant unchanged
specs/archive/payload/issue claims are checked separately from runtime tests.
Existing native evidence remains tied to a38fd24; no plugin bytes change here,
so it is not relabelled as a new native run. Issue #112 stays open with task 3
pending final-main approval/publication/final-tag evidence. Closed #106/#109 and
all immutable tags remain unchanged. Current issue/PR pointers will reference
this immutable response while retaining actual delivered-main canonical URLs.

Review-round checks: root 121/121, strict 15/15, marked audit
180 files / 308 local links / 36 fragments / 0 errors, and whitespace checks
passed. The complete final diff and relevant unchanged contracts were inspected.
Protected plugin/package/fixture/catalog and archived requirement bytes are
unchanged from the reviewed preparation source. A fresh check-runs read confirms
zero jobs for the still-stacked PR; no CI success is inferred from local checks.
