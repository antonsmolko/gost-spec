# Feature release preparation

Public scope: [#106](https://github.com/antonsmolko/gost-spec/issues/106).
Prerequisite [#102](https://github.com/antonsmolko/gost-spec/issues/102) is
[PR #107](https://github.com/antonsmolko/gost-spec/pull/107), commit 55a8307;
its documentation-only outcome is independently reviewable. This release PR is stacked
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
bump. Feature version stays 0.1.0; its changelog preamble is made neutral too. All four candidate tags should select the
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

## Historical candidate evidence - 338e1dc, before published review

Public candidate source `338e1dcaccecca3e390807afff1ae756f18f3950` was pushed
before native checks. Codex 0.169.0 and Claude Code 2.1.308 each used a new,
separate disposable profile and empty cwd. HOME stayed unchanged; personal
CODEX_HOME/CLAUDE_CONFIG_DIR profiles were not used or rewritten. No model turn.

Executed baseline: public gost-svelte-shell-v0.3.0 resolved to
64714fcc9929ce3eb0ea7676dfabaa883f5069f7 in both native clones. Three installed
plugins and all files matched that commit: FC 0.2.0 / shell 0.3.0 / presenter
0.1.0, eight files each; feature absent. Baseline native selector and full maps
were recorded before uninstall/removal. Candidate selection then produced four
unique enabled plugins, including the new feature. Each install was repeated;
all file maps, versions, selected native ref and clone HEAD matched 338e1dc.

Compact merged representation of the two independently executed per-host
sequences, not one combined executable run: each host ran only its own commands
in its own separate disposable profile. The native command forms were:

```sh
codex plugin marketplace add https://github.com/antonsmolko/gost-spec.git --ref gost-svelte-shell-v0.3.0 --json
claude plugin marketplace add 'https://github.com/antonsmolko/gost-spec.git#gost-svelte-shell-v0.3.0' --json
for plugin_name in gost-svelte-shell gost-functional-core gost-view-presenter; do
  codex plugin add "$plugin_name@gost" --json
  claude plugin install "$plugin_name@gost" --json
done
codex plugin list --json
claude plugin list --json
for plugin_name in gost-svelte-shell gost-functional-core gost-view-presenter; do
  codex plugin remove "$plugin_name@gost" --json
  claude plugin uninstall "$plugin_name@gost" --json
done
codex plugin marketplace remove gost --json
claude plugin marketplace remove gost --json
codex plugin list --json
claude plugin list --json
codex plugin marketplace add https://github.com/antonsmolko/gost-spec.git --ref feature/gost-spec-106-feature-release --json
claude plugin marketplace add 'https://github.com/antonsmolko/gost-spec.git#feature/gost-spec-106-feature-release' --json
for plugin_name in gost-svelte-shell gost-functional-core gost-view-presenter gost-feature; do
  codex plugin add "$plugin_name@gost" --json
  codex plugin add "$plugin_name@gost" --json
  claude plugin install "$plugin_name@gost" --json
  claude plugin install "$plugin_name@gost" --json
done
codex plugin list --json
claude plugin list --json
```

The intermediate inventory was empty in both profiles; baseline cache is not
candidate evidence. Native selectors were checked in Codex marketplaces.gost.ref
and Claude known_marketplaces source.ref, not inferred from cache path text.
Both actual marketplace clones resolved to the exact candidate source above.
Codex fresh app-server initialize/initialized then skills/list with empty cwd
and forceReload returned four unique enabled GOST skills and zero errors;
generic personal skill metadata is outside these GOST counts. Claude plugin
details for each entry reported Skills (1), matching identity/version.

| Plugin | Candidate | Files per host | Installed full-map SHA256, identical in both hosts |
| --- | --- | --- | --- |
| gost-feature | 0.1.0 | 9 | a988c8a4f1ab4b3a6001971ee7c70ad875d7fead0c51bbb13759fa7e61fe9384 |
| gost-functional-core | 0.2.1 | 8 | bd9b7f8d911eddd5d264dded7bcb202a2baa65b5226111c8dd16407ad8194e65 |
| gost-svelte-shell | 0.3.1 | 8 | a27b09a938970fabc01b47c13f440b625b3a16b9e6dda2762af74ff91ca60612 |
| gost-view-presenter | 0.1.1 | 8 | 88e9becde94292712994188b30e1b445fc7e418edbcfaa50a6dc46928fcee2ac |

Each digest uses the full-map derivation above, comparing every installed
relative path and byte to git-show at 338e1dc. This covers all corrected README
and changelog bytes as well as manifests/skill/references/license/icon.
Removing the old three plugins through native commands left one enabled feature
with working discovery/details and readable references in each host; restoring
those three returned all four. Full maps/selectors/discovery passed again after
restoration. Personal fingerprints of Codex config, Claude settings, installed
inventory and marketplace registry matched before/after. #102's final installed
README acceptance criterion is evidenced here; its PR/issue is not auto-merged
or closed by these checks.

All 18 shell blocks in the release guide/four READMEs parse with sh -n. Supported
native command forms actually ran against the old public tag and candidate ref;
the README environment guard checks selection, while prose still requires the
reader to verify tag availability, plugin presence/version. No future tag was
passed off as released or installed. The documented rollback target is the old
pair snapshot without feature; update old-to-candidate was executed, a reverse
rollback was not executed and no earlier feature release is claimed.

Remote matching-refs API confirmed only the two existing annotated tags/objects
above, unchanged; all four future names are absent. The first matching-refs read
hit a TLS handshake timeout; a bounded retry succeeded. This was a read-only tag
query, not a failed native install or evidence of tag publication. Every native
baseline/candidate/install/repeat/standalone/restoration command returned zero.
Final-main and final-tag checks remain pending separate approval.

## Initial preparation verification and issue edits - before published review

Author full check passes 121/121 (including packed document consumers), strict
15/15 and marked audit 170 Markdown / 298 local links / 28 fragments / 0 errors;
diff check clean. Complete final release-only diff versus #107 and combined
snapshot versus main were inspected separately from native checks, including
unchanged distribution/feature specs and live #102/#106 dependencies. No
skill/recipe, feature payload, fixture, catalog, normative package/version or
old tag changed. The one presenter version assertion follows the new metadata;
no runtime behavior or new gate was introduced.

Independent candidate review PASS, no actionable findings: public basis
#102/#106 and distribution requirements; the separate report is private input,
not a public basis. Reviewer independently recomputed eight installed full maps
and digest derivation against git 338e1dc, native selectors/clone HEADs,
standalone/coexistence/discovery, corrected README shell forms and personal
fingerprints. Earlier #88/#97 closures remain closed. Final receipt/PR bookkeeping
is checked separately before reporting preparation complete.

#102 now links its prerequisite PR #107 and records final native README evidence
from this candidate, while remaining open pending its approved delivery. #106
links both scoped PRs/prefixes and records prepared versions, checks/limits;
only completed candidate/version/native criteria are checked. Approval/publication
criteria and release tasks 4/5 stay pending. No original criteria text or prior
closure was broadened. Current queue/handoff correct delivered PR #105/main
2ebe704 and its completed canonical-link follow-up, then point to PR #108.

Final independent review of complete receipts/checkpoints PASS, no open findings.
Both isolated native results and all eight maps/selectors were independently
audited; all 18 shell blocks parse and fresh root 121/121 plus strict 15/15 logs
pass. Public #102/#106 requirements are the basis; the private review report is
supplementary, not a public basis. Updated issues/PRs preserve distinct scopes
and approval gates. No historical confirmed finding is reopened.

Preparation tasks 1-3 are complete; release tasks 4-5 remain pending explicit
merge/release approval and final-tag checks. PR #108 is ready for review, stacked
on prerequisite PR #107. Canonical evidence links use an immutable receipt
commit; after approved merge replace current pointers with the verified delivered
main SHA in the same merge session. Only receipts/status changed after native
source 338e1dc; plugin payloads remain byte-identical to that checked candidate.

## PR #108 review round

Read both inline threads (hasNextPage=false), two empty summary reviews and all
four PR-level comments, plus the complete PR #107 summary/two threads and current
#102/#106 bodies/comments. The R1 cross-reference in PR #108 points to the wrong
comment ID; the actual prerequisite source is PR107-R1 linked below. Previous
PASS/native receipts describe their named snapshots; new changelog bytes require
renewed candidate evidence, so preparation tasks 2/3 are reopened. Earlier
confirmed review closures remain closed, not silently reclassified.

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| <a id="pr108-r1"></a> [PR108-R1 FC](https://github.com/antonsmolko/gost-spec/pull/108#discussion_r4578732350), [shell](https://github.com/antonsmolko/gost-spec/pull/108#discussion_r4578732417), [PR107-R1](https://github.com/antonsmolko/gost-spec/pull/107#discussion_r4578555023) | Release inherits incomplete FC/shell changelog normalization without a disposition | changelogs, prerequisite #102/PR #107 and this ledger | Fixed; fresh native checks passed | Neutral preambles fixed in prerequisite 55a8307 and merged here; versions unchanged; old native receipts explicitly historical |
| <a id="pr108-r2"></a> [PR108-R2](https://github.com/antonsmolko/gost-spec/pull/108#issuecomment-6895668571) | Published-pair paragraph was captured inside the four-plugin prepared section | docs/plugin-releases.md | Fixed | Moved it back to the introduction about the existing published pair; one gost registration rule retained |
| <a id="pr108-r3"></a> [PR108-R3](https://github.com/antonsmolko/gost-spec/pull/108#issuecomment-6895674405) | Interleaved host commands called an exact executable sequence | this design evidence | Fixed | Explicit merged representation of two separate executions; each host ran only its own commands in its own profile; no claim that the combined block ran |
| <a id="pr108-r4"></a> [PR108-R4](https://github.com/antonsmolko/gost-spec/pull/108#issuecomment-6895675088) | Impact omitted root README | proposal Impact | Fixed | Root README explicitly listed; published instruction scope unchanged |
| <a id="pr108-r5"></a> [PR108-R5](https://github.com/antonsmolko/gost-spec/pull/108#issuecomment-6895676012) | Duplicate blank lines in release records | design and readiness | Fixed | One blank line between paragraphs/sections |
| <a id="pr108-i1"></a> [#106 neutral publication contract](https://github.com/antonsmolko/gost-spec/issues/106), PR108-R1 complete-snapshot audit | Feature changelog had the same prepared preamble | feature changelog, proposal/design/#106 scope statements | Fixed | Same neutral preamble across all four candidates; feature SKILL/reference/example unchanged, initial version 0.1.0 retained; new complete-feature digest recorded below |
| [PR107-R1](https://github.com/antonsmolko/gost-spec/pull/107#discussion_r4578555023); independent review private input, not a public basis | I2: current prerequisite pointer and retained-feature scope still described the pre-review snapshot | design opening and task 1 | Fixed | Current prerequisite is 55a8307/documentation-only; retained feature content explicitly means SKILL/recipe/example, with changelog correction declared |

### Review-round issue edits

#102/PR #107 now cover all three neutral changelogs and the precise 10 checked /
8 modified shell-block distinction. #106/PR #108 explicitly include the feature
changelog preamble correction; the earlier entire-feature-byte preservation
claim is superseded only for that metadata text, not its skill/example content.
Native/whole-outcome readiness is reopened until new-source checks and review.
Criteria, independent branch prefixes, release approval and earlier closures stay
unchanged; neither PR is merged and no tag is created by these fixes.

### Renewed native evidence for PR #107/#108 fixes

The public candidate was committed and pushed as
`ae26a2e7ededf2dc7ee3941e725934296a0f55ae` before new checks. Both hosts used
new separate disposable profiles, not the old 338e1dc caches. Codex 0.169.0 and
Claude 2.1.308 each repeated the per-host sequence above: public old tag baseline
and full maps, explicit remove/re-registration with empty intermediate inventory,
then candidate install/repeat, discovery/details, standalone feature, restoration
and a final full-map/source/ref check. Every native command returned zero.
Both actual selected refs and clone HEADs identify ae26a2e; inventories and fresh
Codex discovery show four enabled GOST skills (one when standalone), zero errors;
Claude details show Skills (1) per entry. Personal fingerprints match before/after.

| Plugin | Version | Files per host | New complete-map SHA256 in both hosts |
| --- | --- | --- | --- |
| gost-feature | 0.1.0 | 9 | 1a15e2b4653ebf928244d6685ff2f6084cbed6e9acc480b25c3ac25046af7903 |
| gost-functional-core | 0.2.1 | 8 | ad9fcbff94228756ae5b8ce0e4dd52b109350c7bb49acd0ad006088052677a6b |
| gost-svelte-shell | 0.3.1 | 8 | 134f537a4a1fdd16bc4251bb69fd2dadbb903f71014de81ef653c0005fbb4a19 |
| gost-view-presenter | 0.1.1 | 8 | 88e9becde94292712994188b30e1b445fc7e418edbcfaa50a6dc46928fcee2ac |

Digest derivation remains the complete sorted relative-path/file-hash JSON
formula above; all installed files were compared to git-show at ae26a2e.
The three changed maps reflect changelog corrections; presenter map is unchanged
but was installed and verified again. All four preambles are now identical.
Feature SKILL/reference/example, all other skills/recipes, fixtures, five npm
packages/versions and catalogs remain unchanged. No runtime or verification gate
was added, and existing remote tag objects/peeled commits remain unchanged;
all four planned names remain absent. Reverse rollback/model/application/final-tag
checks were not performed; their earlier stated limits remain in force.

This renewed evidence also satisfies #102's installed candidate documentation
criterion for its prerequisite 55a8307. That ledger retains its pre-native
review-fix checkpoint; current combined native evidence is here, not a claim that
338e1dc verified new changelog bytes. Neither issue is closed or PR merged.
Preparation task 2 is complete again; task 3 waits for final review/replies and
updated current canonical pointers. Release tasks 4/5 remain pending approval.

### Review-round final verification

Author full checks pass 121/121, strict 15/15, marked 170/298/28/0 and diff check.
The complete PR107 diff, release-only diff against prerequisite 55a8307 and
combined diff against main 2ebe704 were inspected, including unchanged specs,
linked issues/dependencies and all changed publication/snapshot claims.
No package/fixture/catalog/skill/recipe/runtime or release-gate changes beyond
the explicitly declared neutral changelog metadata; existing tags are unchanged.

Independent complete-result review PASS: public basis is all linked PR107/108
findings and #102/#106; the private report is supplementary input, not a public
basis. Reviewer independently ran 121/121, strict 15/15, links 170/298/28/0,
shell syntax 18/18, protected-path and whitespace checks, verified existing
remote tags/absence of future names, all eight fresh installed maps and digests,
both actual selectors/clone HEADs, native discovery, standalone/restoration and
personal fingerprints. Minor opening pointer/task-scope findings I2 were fixed;
new blank-line recurrence is removed as part of R5. No open technical findings.

The prerequisite ledger remains a named pre-native review-fix checkpoint at
55a8307; final current combined native evidence/dispositions are here. Replies
for each inline finding use its individual canonical anchor; each PR summary and
all four PR108 top-level comments are covered by source-linked aggregate replies.
Current issues/PR bodies point to immutable review/evidence commits, preserve
independent scopes and release approval, and identify old source as historical.
Preparation tasks 1-3 are complete again; release tasks 4/5 remain pending.
Only records/status change after native candidate ae26a2e; all installed plugin
bytes remain those independently checked against that exact commit.

## Published feature release

This section supersedes the preparation checkpoints above. Prerequisite PR #107
merged as `7ee001dd555bfcc380bd42e2db00310ae6853494`; #102 is completed. PR #108
was retargeted to main, both Node 26.0.0/26.11.1 Verify jobs passed on synchronized
head f35dc7d, and it merged as **f1c6f936b408f61f063089eded234ad23bf6e076**.
Its tree equals reviewed c2db83a; all 33 plugin files equal native-verified ae26a2e.
Post-merge and pre-publication checks passed 121/121; main CI passed both Node jobs.
The owner then explicitly authorized these four tags on that exact commit
(private input, not a public basis). Public actionable scope/evidence is
[#106](https://github.com/antonsmolko/gost-spec/issues/106) and
[merged PR #108](https://github.com/antonsmolko/gost-spec/pull/108).

### Immutable remote tags

A fresh remote read confirmed all four names absent before creation. Annotated
local tags were created on F1, then pushed atomically. The first push exceeded a
40-second deadline; subsequent remote reads confirmed none had appeared. A retry
using the existing local objects and a temporary gh credential helper succeeded.
No credential/configuration change was saved to a personal profile. Every remote
annotated object and peeled commit was then checked; no tag was moved/deleted.
The two previous tag objects and their 64714fc target remain unchanged.

| Tag | Annotated object | Peeled commit |
| --- | --- | --- |
| gost-feature-v0.1.0 | 78d052b30cdb0dc52b1296e8f02d9f7f61dd74fc | f1c6f936b408f61f063089eded234ad23bf6e076 |
| gost-functional-core-v0.2.1 | d1bfedf4e3a17ef9206867cf023da929f881ab0f | f1c6f936b408f61f063089eded234ad23bf6e076 |
| gost-svelte-shell-v0.3.1 | 383862825ba2a7b8e49c12b7ca86574995945190 | f1c6f936b408f61f063089eded234ad23bf6e076 |
| gost-view-presenter-v0.1.1 | 860fe4f1b4c009afebcb629ef9334fed413f3858 | f1c6f936b408f61f063089eded234ad23bf6e076 |

### Final-tag native verification

Codex 0.169.0 and Claude Code 2.1.308 each installed **each of the four final tags**
in a fresh isolated profile: eight successful host/tag combinations. Each
profile installed all four plugins, repeated each installation, inspected native
inventory/discovery/details, and compared every installed file to git-show F1.
There are 32 complete installed maps; versions, file counts and map digests are
identical to the four rows under Renewed native evidence above. No source files
changed between candidate proof, F1 and published tag delivery.

The exact per-profile command sequence is below; TAG was assigned each of the
four literal names in the table, with new CODEX_HOME and CLAUDE_CONFIG_DIR
folders for every run. Those folders existed before invoking the native CLI;
HOME stayed unchanged. The working directory was empty. HERDR variables,
CODEX_THREAD_ID and CODEX_INTERNAL_ORIGINATOR_OVERRIDE were removed from child
environments; temporary GIT_CONFIG_COUNT selected HTTP/1.1 and low-speed timeouts.
These commands are separate host sequences, not a combined personal-profile script.

Codex sequence, once for each tag in a fresh profile:

```sh
codex plugin marketplace add https://github.com/antonsmolko/gost-spec.git --ref "$TAG" --json
for plugin_name in gost-feature gost-functional-core gost-svelte-shell gost-view-presenter; do
  codex plugin add "$plugin_name@gost" --json
  codex plugin add "$plugin_name@gost" --json
done
codex plugin list --json
```

A fresh `codex app-server` then received initialize with experimentalApi enabled,
initialized, and skills/list with the empty cwd and forceReload=true. Each result
had no errors and exactly four unique enabled @gost plugin skills. Generic
personal skill metadata, if returned, was excluded from that count. The actual
marketplaces.gost.ref in that disposable config and the clone HEAD were checked
against TAG/F1; a native inventory version alone was not accepted as proof.

Claude sequence, once for each tag in a fresh profile:

```sh
claude plugin marketplace add "https://github.com/antonsmolko/gost-spec.git#$TAG" --json
for plugin_name in gost-feature gost-functional-core gost-svelte-shell gost-view-presenter; do
  claude plugin install "$plugin_name@gost" --json
  claude plugin install "$plugin_name@gost" --json
done
claude plugin list --json
for plugin_name in gost-feature gost-functional-core gost-svelte-shell gost-view-presenter; do
  claude plugin details "$plugin_name@gost"
done
```

Each details result showed Skills (1); actual known_marketplaces source.ref,
clone HEAD and all enabled versions matched TAG/F1. Every final successful native
command exited zero. Seven combinations succeeded on the first attempt; the
Codex/shell combination twice hit the 50-second marketplace-add deadline with
empty stdout/stderr and no completed clone. A third fresh profile succeeded with
the same command/environment. Failed profiles were retained separately, not
counted as successes or reused as source evidence. The scratch retry helper's
final generic message mentions eight/32 even for its single-profile run; the
verified aggregate separately joins seven first-run summaries with that one
retry summary and checks all eight distinct host/tag pairs and 32 actual maps.

Receipts are private local diagnostics, not a public acceptance basis; this
committed summary retains commands, versions, selectors, objects, digest formula,
results and failures. Personal config/settings/marketplace/installed-plugin
fingerprints matched before/after the complete run. No model turn, asc-admin edit,
npm publication, content acceptance or new dispatch migration occurred. The
candidate update/standalone proof remains the earlier ae26a2e evidence; final-tag
checks do not relabel it as a new application/rollback test. The runbook now
selects an actual published tag, including the earlier-pair rollback limitation.

### Release-session ledger and issue edits

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| [#106](https://github.com/antonsmolko/gost-spec/issues/106), [PR #108](https://github.com/antonsmolko/gost-spec/pull/108) | Complete the separately authorized final publication and delivery checks | Runbook, README, queue/handoff, tasks, #106 | Completed technical publication; report review/merge remains pending | Four remote objects/peeled F1 and eight native combinations above; no tag rewrite |
| [gost-kit #44](https://github.com/antonsmolko/gost-kit/issues/44), [gost-spec #109](https://github.com/antonsmolko/gost-spec/issues/109) | Consumer skills need migration to newer published dispatch | Queue/handoff, #109 | Separate issue and implementation outcome | #106 retains common 0.3.0 / svelte 0.2.0 baseline; no unrelated skill/runtime edits |

Live #106 records actual tag publication/final verification and retains its
criteria; closure waits for this report's delivery. #102/#88/#96/#97 remain
completed, with no scope expansion. #109 records the new owner-requested consumer
migration with its own prefix, independent of #106. No release approval for that
future composition is inferred from this publication.

### Final report verification and independent review

Author full check passed 121/121, strict all 15/15, tracked Markdown audit
170 files /301 local links /33 fragments /0 errors, and git diff --check.
The complete report diff and relevant unchanged specs/README/checkpoint documents
were inspected separately from runtime tests. No plugin/package/fixture/catalog
or skill files changed from F1; main spec contracts and prior R1-R5/I1/I2 closures
are retained. Live #106/#109 scope/dependencies were checked for conflicts.

Independent complete-result review PASS. Private review input, not a public
basis; public basis is #106's actual open/report-pending checkpoint and merged
PR #108. The reviewer independently read the complete diff, verified all four
remote objects/peeled commits plus old refs, recomputed all 32 installed maps
(264 actual files), checked eight selectors/clone HEADs, fresh native discovery
and Claude details, and compared personal before/after fingerprints. Reviewer
strict 15/15, links 170/301/33/0 and whitespace audit also passed.
A task-status clarification was fixed: completed task 5 covers technical final-tag
verification/recording; unchecked task 6 explicitly retains approved report
merge, delivery verification, canonical-link follow-up and issue closure.
Final independent reinspection confirmed no open actionable findings. This report
is ready for review; its merge is not inferred from the earlier tag approval.

## PR 110 published review response

Read all three inline threads (one complete page, no next cursor), three submitted
reviews and the [summary](https://github.com/antonsmolko/gost-spec/pull/110#issuecomment-6926660879)
on 4d659b3. Earlier verified closures remain closed. This is an editorial correction
of release instructions/status, without new runtime, packaging or release gates.

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| <a id="pr110-r1"></a>[R1](https://github.com/antonsmolko/gost-spec/pull/110#discussion_r4590373129) | Historical-source wording over-includes the current change procedure | release guide | Fixed | Pair-install commands are distinguished explicitly from re-registration to the current release |
| <a id="pr110-r2"></a>[R2](https://github.com/antonsmolko/gost-spec/pull/110#discussion_r4590375860) | Remove/add plugin sets differ in copied commands | release guide | Fixed | Both host blocks remove all four listed plugins; absent-plugin exception retained |
| <a id="pr110-r3"></a>[R3](https://github.com/antonsmolko/gost-spec/pull/110#discussion_r4590377790) | Private approval attribution omitted in secondary views | handoff/readiness | Fixed | Both label private input and link public #106 and canonical publication evidence |

The summary and its three bodyless submitted reviews are covered by these
individual source-linked dispositions. #106/#109 checkpoints/PR descriptions
will link this response on an immutable commit; no issue criteria/closures change.

## Report delivered — PR 110

PR #110 merged as 3b200afc34eabd7b586121fa2c060cd043b3ac16. The actual main tree
is identical to reviewed63d3271. Post-merge root121/121, strict15/15 and Markdown
170/303/35/0 pass; no plugin/tag/runtime bytes changed. Current #106/PR #110
canonical links were verified and updated to that delivered SHA in this session;
#106 is closed completed. Task6 is complete. Earlier pending checkpoints above
are historical. This record accompanies the already-authorized #111 integration
as queue/delivery bookkeeping, not a separate implementation or tag publication.
