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

## Integration checkpoint

Archive PR #113 delivered main 4cfe0ee, verified tree-identical to reviewed
9006d10. Archive canonical-link follow-up completed in the merging session.
PR #114 retargeted to main immediately; the branch includes delivered main
ancestry. Only delivery/status bookkeeping changes after reviewed 93d9d7a;
all plugin bytes still equal native-verified a38fd24. Both Verify jobs must pass
on this final head before its owner-authorized merge. This authorizes no tags;
after merge the actual main/payload will be verified and exact SHA/three tags
presented for separate release approval. Task 3 remains incomplete until final
publication, final-tag native checks and delivery evidence are complete.

## Published typed dispatch release

This section supersedes the preparation checkpoints above. PR #114 delivered
main **2dee4ab890de24aaea71c85aca966c3f77dbf0c1** after both Verify jobs passed
on final head 3e008b1. Actual main tree equals that head and all 33 plugin files
match native-verified a38fd24. The owner explicitly approved the exact three
tags on that main commit (private input, not a public basis); public actionable
scope is [#112](https://github.com/antonsmolko/gost-spec/issues/112) and
[merged PR #114](https://github.com/antonsmolko/gost-spec/pull/114).

### Immutable tags and source

A fresh remote preflight confirmed the approved main SHA, manifests/changelog
versions and absence of all three names. Full pre-publication check passed
121/121. Annotated tags were created and pushed atomically in one successful
attempt; remote objects and peeled commits were then verified. All previous
remote tag refs/objects/targets stayed identical. No tag was moved or deleted.

| Tag | Annotated object | Peeled commit |
| --- | --- | --- |
| gost-functional-core-v0.3.0 | 698ca3416dfc6ca8fe484bae7c6d9741688955d8 | 2dee4ab890de24aaea71c85aca966c3f77dbf0c1 |
| gost-svelte-shell-v0.4.0 | 7767aa62eeb0039796e55d93e7ae61872652431f | 2dee4ab890de24aaea71c85aca966c3f77dbf0c1 |
| gost-feature-v0.2.0 | b4de8a498ea78ee5e40ea24598cc2be1907a557d | 2dee4ab890de24aaea71c85aca966c3f77dbf0c1 |

### Each final tag in both hosts

Each of the three tags was installed independently in Codex 0.169.0 and Claude
Code 2.1.308: six fresh host/tag profiles, each with all four plugins installed
twice. Inventory, actual config selector, clone HEAD, all installed files and
fresh discovery/details were verified. All six source HEADs equal the approved
main; all 24 complete installed maps (198 files) equal git-show at that commit.
Versions, file counts and all four map digests are identical to the table in
Native preparation evidence. The same sorted relative-path/file-hash JSON
SHA256 formula applies; corrected changelogs and every reference/icon/manifest
are included. Every native command exited zero; there were no failed attempts
or retries in this publication/final-tag verification run.

For each TAG below, new CODEX_HOME and CLAUDE_CONFIG_DIR directories were created
before commands. HOME stayed unchanged; empty cwd, removed parent HERDR/Codex
session variables and temporary HTTP/1.1/low-speed Git settings follow the earlier
procedure. Personal config/settings/installed-plugins/marketplaces fingerprints
match before/after the whole run. Ambient non-plugin skill metadata can still
be discovered; only unique enabled @gost plugin entries count as GOST discovery.

Codex sequence, repeated in a fresh profile for each of the three literal tags:

```sh
codex plugin marketplace add https://github.com/antonsmolko/gost-spec.git --ref "$TAG" --json
for plugin_name in gost-functional-core gost-svelte-shell gost-feature gost-view-presenter; do
  codex plugin add "$plugin_name@gost" --json
  codex plugin add "$plugin_name@gost" --json
done
codex plugin list --json
```

A fresh app-server then received initialize(experimentalApi=true), initialized,
and skills/list(empty cwd, forceReload=true). Each result contained four unique
enabled @gost skills and zero errors. The actual marketplaces.gost.ref and clone
HEAD, not a version string alone, were checked against TAG/approved main.

Claude sequence, separately for each tag in its own fresh profile:

```sh
claude plugin marketplace add "https://github.com/antonsmolko/gost-spec.git#$TAG" --json
for plugin_name in gost-functional-core gost-svelte-shell gost-feature gost-view-presenter; do
  claude plugin install "$plugin_name@gost" --json
  claude plugin install "$plugin_name@gost" --json
done
claude plugin list --json
for plugin_name in gost-functional-core gost-svelte-shell gost-feature gost-view-presenter; do
  claude plugin details "$plugin_name@gost"
done
```

Each details result showed Skills (1). Actual known_marketplaces.source.ref,
clone HEAD and enabled inventory versions matched TAG/main. This proves native
final-tag delivery/read/repeat/coexistence; it does not certify a model turn,
asc-admin change, real application navigation or a new update/rollback test.
Earlier runtime evidence remains #109's verified npm consumer behavior; no
npm publication or normative content acceptance was performed.

### Release-session ledger and issue edits

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| [#112](https://github.com/antonsmolko/gost-spec/issues/112), [PR #114](https://github.com/antonsmolko/gost-spec/pull/114) | Complete explicitly approved publication and final delivery proof | Runbook, README, handoff/readiness, tasks, #112 | Technical release complete; report delivery pending | Three verified remote objects/peeled main, six final-tag profiles, 24 exact maps and unchanged personal fingerprints |
| [#112](https://github.com/antonsmolko/gost-spec/issues/112) | Preserve the original final-delivery/closure gate | Task tracking and report | Split bookkeeping, no scope change | Task 3 records successful publication/verification; unchecked task 4 retains separately approved report merge, canonical delivery verification and closure |

#112's current checkpoint/PR links will point to this immutable report commit;
the issue stays open until final report delivery. Existing #106/#109 closures
and criteria stay intact. Current runbook selects a real new tag, distinguishes
presenter's unchanged content from its old snapshot tag, and preserves earlier
snapshot/rollback compatibility limits. This report changes only root docs and
bookkeeping, never approved plugin/tag payloads. After approved report merge,
the merging agent verifies resulting main and updates current canonical URLs to
that verified delivered SHA in the same session before closing #112.

### Final report verification and independent review

Full check 121/121, strict 15/15, marked audit 180 tracked Markdown files /
312 local links / 39 fragments / 0 errors and git diff --check pass. The audit
uses the heading/slug/explicit-id method documented above. Complete final diff,
relevant unchanged distribution/FC/shell/modular contracts and issue/dependency
claims were inspected separately from runtime tests. No plugin/package/fixture/
catalog or tag payload changes occur in this report.

Independent whole-result review PASS: private review input, not a public basis;
public actionable scope remains #112/merged PR #114. Reviewer independently
verified all remote objects/peeled targets and retained old refs, all six actual
config selectors/clone HEADs, inventories/discovery/details, all 48 successful
install/repeat receipts, recomputed 24 maps (198 files) against approved source
and compared before/after/current protected fingerprints. Every digest/count
matches this evidence. Complete diff and unchanged contracts have no technical
findings; task 4/report-delivery gate remains pending.

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| [#112](https://github.com/antonsmolko/gost-spec/issues/112), private review input, not a public basis | Old issue footer's no-tags/pending wording can read as current | Live #112 | Fixed | Footer explicitly marked Historical review follow-up before merge/publication; current published checkpoint stays at top; new word/number compression corrected |

That issue-only clarification does not alter criteria or closure. Final report
is ready for review; publication approval does not imply approval to merge this
new report PR. After approved delivery, current canonical URLs switch to verified
main in the same session and #112 closes only when its final criteria are met.

## PR 115 published review response

Read all six inline threads (one complete page, no next cursor), the submitted
[review](https://github.com/antonsmolko/gost-spec/pull/115#pullrequestreview-5945736893)
and empty PR-comment list. The review independently confirms the publication,
source, counts and live-state facts; earlier verified closures remain closed.
This round only clarifies consumer wording and consolidates status references.

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| <a id="pr115-r1"></a>[R1](https://github.com/antonsmolko/gost-spec/pull/115#discussion_r4605116689) | Independent plugin/gost-kit version statement was dropped | Release guide | Fixed | Explicit independence restored beside npm version context |
| <a id="pr115-r2"></a>[R2](https://github.com/antonsmolko/gost-spec/pull/115#discussion_r4605116698) | Handoff calls published versions candidates | Handoff | Fixed | Uses versions of this delivery and refers to the release section for current status |
| <a id="pr115-r3"></a>[R3](https://github.com/antonsmolko/gost-spec/pull/115#discussion_r4605116710) | Handoff repeats publication/pending status | Handoff | Fixed | Archive paragraph contains archive facts only; release paragraph records publication once, following paragraph retains one report-delivery/closure status |
| <a id="pr115-r4"></a>[R4](https://github.com/antonsmolko/gost-spec/pull/115#discussion_r4605116718) | Readiness duplicates changing release status | Readiness | Fixed | S9 and earlier context sections link to one current release section; compatibility section carries implementation facts only |
| <a id="pr115-r5"></a>[R5](https://github.com/antonsmolko/gost-spec/pull/115#discussion_r4605116728) | Four installs/repeats is numerically ambiguous | Release guide | Fixed | All four plugins installed twice each: eight receipts per profile, 48 overall, matching existing native evidence |
| <a id="pr115-r6"></a>[R6](https://github.com/antonsmolko/gost-spec/pull/115#discussion_r4605116741) | Compatibility paragraph became one long prose line | Readiness | Fixed | Paragraph rewritten/wrapped with a reference to the sole current release status |

The complete submitted review is covered by these entries and individual replies.
No runtime, version, requirement, tag or approval gate changes. Under AGENTS.md
rule 6's wording/link-only exception, this editorial correction requires no new
independent review; original complete native/result review remains in force.
The full final diff, relevant unchanged contracts and issue/status claims are
checked separately from tests. #112 stays open until approved report delivery;
current issue/PR response links update to this immutable receipt. Published tags
retain their approved SHA, and this round makes no new installation/model claim.

Review-round checks pass: full check 121/121, strict 15/15, marked audit
180 tracked files / 316 local links / 43 fragments / 0 errors and clean
whitespace. The increased local-link counts are status-section references,
resolved with the documented marked/slug/explicit-id method. Complete final PR
diff and relevant unchanged spec/archive/payload/issue contracts were inspected
separately from tests; only four editorial documents change in this round.

## Final delivery and archive checkpoint

This checkpoint supersedes earlier pending report/closure statements, which are
retained as historical evidence. [PR #115](https://github.com/antonsmolko/gost-spec/pull/115)
was approved and merged to main `d44554906488f57edca179513571e46a7685b8b5`.
Its tree exactly equals reviewed head `1321d727f508a99cb637a97434113a3c1a3658e4`;
both Verify jobs passed. Report sections and all six response anchors exist.
Current canonical links in #112/PR #115 were updated to that verified main in
the merging session; [#112](https://github.com/antonsmolko/gost-spec/issues/112)
is closed as completed. Task 4 is now checked using that recorded completion.

Archive scope: move this release-only change, retain its metadata/evidence and
update inbound relative links and current handoff/readiness. No delta specs exist
(`skip_specs: true`), so main specifications remain unchanged. Earlier native
proof and publication receipts retain their original source SHA and limits;
published tags, plugin payload, packages and fixtures are unchanged.
The archive is prepared for a separately approved PR merge.

### GitHub issue edits

No release criteria or closure states are changed for this archive. #112's
archive-preparation comment and the archive PR link identify this follow-up;
its current canonical evidence remains delivered main d445549 until archive
merge. After separately approved archive merge, verify the resulting archive
and anchors and update current issue/PR canonical pointers to that delivered
archive SHA in the same session. Historical immutable evidence links stay valid.


### Archive verification

Full check passes 121/121; strict validation passes 14/14 active changes/main
specs (one fewer active change after this archive). The marked local-link audit
passes: 180 tracked Markdown files, 316 local links, 43 fragments, zero errors;
heading/slug/explicit-id rules are documented above. Whitespace checks pass.
Complete staged diff and relevant unchanged contracts were inspected separately
from tests. Proposal/metadata are byte-identical; the old design is preserved
verbatim with this final checkpoint appended, and tasks differ only by the
verified fourth completion. Main specs, plugins, packages, fixtures and catalogs
are unchanged. No new native installation or runtime evidence is claimed.

Independent complete-result review PASS, no actionable findings. Separate agent
received repository artifacts and requirements without the author's working
conversation and independently verified the full staged diff, exact evidence
preservation, protected trees, live PR #115 merge/tree/checks, #112 closure and
canonical links, all review replies, and the 180/316/43/0 link audit. This is
private input, not a public basis; public actionable scope remains #112 and its
[archive follow-up](https://github.com/antonsmolko/gost-spec/issues/112#issuecomment-6960057189).
No new native/runtime claim or release approval is inferred from this review.
