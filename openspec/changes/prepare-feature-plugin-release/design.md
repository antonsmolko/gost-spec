# Feature release preparation

Public scope: [#106](https://github.com/antonsmolko/gost-spec/issues/106).
Prerequisite [#102](https://github.com/antonsmolko/gost-spec/issues/102) is
[PR #107](https://github.com/antonsmolko/gost-spec/pull/107), commit 9cb9f49;
its README-only outcome is independently reviewable. This release PR is stacked
on that branch and uses [gost-spec-106]; #102 retains [gost-spec-102].
The owner's request authorizes preparation, not merge or tags.

## Baseline and choices

Main 2ebe704 contains completed #88/PR #104 and archive/sync PR #105.
All eight requirements/sixteen scenarios are in the main specification; prior
review closures are retained. #88/#96/#97 remain completed.

Reuse official [OpenAI packaging](https://developers.openai.com/plugins/build/plugins),
[Claude marketplace](https://code.claude.com/docs/en/plugin-marketplaces) and
the [maintained Anthropic catalog](https://github.com/anthropics/claude-plugins-official/blob/main/.claude-plugin/marketplace.json).
The project needs one identified snapshot with four readable plugins, not a new
installer, catalog pin, runtime migration or special Git merge history.

| Plugin | Candidate | Reason | Future tag, absent until approved publication |
| --- | --- | --- | --- |
| gost-feature | 0.1.0 | First delivered modular-feature content | gost-feature-v0.1.0 |
| gost-functional-core | 0.2.1 | Compatible README availability correction in #102 | gost-functional-core-v0.2.1 |
| gost-svelte-shell | 0.3.1 | Compatible README availability correction in #102 | gost-svelte-shell-v0.3.1 |
| gost-view-presenter | 0.1.1 | Compatible README/changelog availability correction in #102 | gost-view-presenter-v0.1.1 |

Each changed distribution gets its own documentation patch, not a feature/minor
bump. Feature 0.1.0 stays unchanged. All four candidate tags should select the
same checked final main snapshot if that exact composition is later approved.
Five npm package versions, gost-kit dependencies and every SKILL/reference stay
unchanged. Existing annotated tag objects remain FC d68e6718b821eb521cf3af1219d05c75ea25d09d
and shell 381952862d1527b73b22181118d9c88c5da0ca84, both peeling to
64714fcc9929ce3eb0ea7676dfabaa883f5069f7. Never move them.

## Verification contract

Inputs are the committed public candidate ref and its resolved Git commit,
both local catalogs, exact plugin manifests/files, native configs/inventories
and existing approved source tag. Validate identities/versions/changelog,
containment/links, exact source and the complete installed relative-path to
SHA256 map. Count only enabled GOST plugin skills in native discovery. A native
version string or cached source path alone is insufficient.

In separate disposable CODEX_HOME/CLAUDE_CONFIG_DIR profiles, install the prior
published snapshot and its three plugins, record its source/bytes, then use
native uninstall/marketplace remove/add to select the public candidate branch.
Install all four, repeat each, inspect discovery/details and every installed
file including corrected READMEs. Verify feature standalone, then restore the
other three and verify coexistence. Verify old remote refs and personal profile
fingerprints before/after; keep profiles and sanitized receipts outside product.
No model turn, consumer edit or personal marketplace change is needed.

Record exact commands, selectors, clone HEADs, host versions and full-map digests
with their derivation. Map digest is SHA256 of UTF-8 json.dumps(relative-path to
file SHA256, sort_keys=True, separators=(',', ':')). Check both README shell
syntax and actual native command forms. A candidate branch proves draft native
delivery only, not availability of future tags or application behavior.

Missing artifact/ref/host, malformed metadata, mismatched bytes, unsupported
discovery or failed command leaves native readiness incomplete. Preserve the
actual failed attempt and selected source; retry only with a recorded correction.
Do not silently substitute loopback/local evidence. After install failure report
actual active inventory, including an empty profile after removal.

Existing application/browser evidence remains tied to delivered #88/#96 because
their source and dependencies do not change. Root full check includes packed
document consumers; compare all unchanged fixtures/packages/skills explicitly.
Link audit uses marked headings and one whitespace to one hyphen, no collapsing,
with duplicate suffixes -1/-2; record file/link/fragment counts and errors.

## Integration, publication and follow-up

Review/merge PR #107 first after owner approval; retarget this stacked release
PR to main and recheck its full diff/CI. Merge requires separate owner approval.
The merging agent verifies actual resulting main and candidate plugin bytes,
updates live issue/PR canonical links to a verified immutable delivered SHA,
and presents the exact main commit, four versions/tags and receipts for explicit
release approval. The preparation request grants no tag or npm publication.

Only after that approval confirm all four tag names are absent, create/push
immutable tags on the approved main and verify their remote objects/peeled
commits. Install every final tag in both hosts with fresh isolated profiles or
explicit re-registration between tags, matching all files and selected refs.
Failure leaves #106 incomplete; do not move tags. Update installation instructions
and queue/issue checkpoints from final evidence. #102's final README criterion
is verified on this candidate and its final tag delivery remains independently
auditable. The historical tags keep their frozen READMEs.

## Review ledger and issue edits

Public acceptance basis is #102/#106 and the existing distribution spec. Private
reports are supplementary input, not a public basis. Record every finding with
source, affected representation, disposition and evidence; prior closures stay
closed unless new evidence is explicitly recorded. Issue edits affect current
checkpoints/dependencies only; #88/#97 criteria and closures are unchanged.

## Candidate evidence

Pending preparation checks; do not infer completion from the planned commands.
