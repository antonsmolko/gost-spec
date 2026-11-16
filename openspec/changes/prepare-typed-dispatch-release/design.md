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
and the [maintained upstream catalog](https://github.com/anthropics/claude-plugins-official/blob/main/.claude-plugin/marketplace.json).
The concrete need is delivery of #109's already verified recipes, not new tooling.
The runbook/catalog/native procedures are unchanged.

| Plugin | Candidate | Planned tag, unavailable until approved publication |
| --- | --- | --- |
| gost-functional-core | 0.3.0 | gost-functional-core-v0.3.0 |
| gost-svelte-shell | 0.4.0 | gost-svelte-shell-v0.4.0 |
| gost-feature | 0.2.0 | gost-feature-v0.2.0 |

Presenter0.1.1 remains byte-identical and installable in the same snapshot without
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

Reuse #109's actual npm common0.4/svelte0.3 and reducer/API/browser evidence because
all skill/recipe/fixture bytes remain unchanged. Run root check/strict/link audit,
protected-path/full-diff/issue conflict scan and independent complete review.
Retarget to main after approved archive merge and require both Verify jobs before
release-preparation merge. Verify the resulting main/payload, present its exact
SHA/composition for explicit release approval, then create only absent immutable
tags. Verify each final tag in both hosts and update delivery checkpoints. Until
those steps succeed, publication tasks/issue closure remain pending.
