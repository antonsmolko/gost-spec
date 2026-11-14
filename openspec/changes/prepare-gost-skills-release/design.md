# Design

Release result: both approved tags on `64714fcc9929ce3eb0ea7676dfabaa883f5069f7` are published and final-tag native checks passed. Earlier candidate/pending statements below describe their named pre-publication snapshots; current evidence is in Published release verification. Final documentation delivery is tracked separately.

## Context and baseline

[#97](https://github.com/antonsmolko/gost-spec/issues/97) после #96: реализация PR #98 и архив PR #99 доставлены, main `02591a2`; #96 закрыта. Применяется существующий distribution contract; новые packaging механизмы не нужны.

Официальная baseline: [OpenAI packaging](https://developers.openai.com/plugins/build/plugins), [Claude marketplaces](https://code.claude.com/docs/en/plugin-marketplaces) и поддерживаемый [Anthropic catalog example](https://github.com/anthropics/claude-plugins-official/blob/main/.claude-plugin/marketplace.json). Нужда проекта — проверить общий каталог с локальными plugin sources из выбранного Git snapshot в двух CLI. Legacy Codex manifest остаётся поддерживаемым; переход к другому формату не входит.

## Decisions

FC 0.2.0 и shell 0.3.0 — независимые minor bumps с содержательными обновлениями API operations и factory/reset. Старые 0.1.1/0.2.1 были unreleased placeholders, не релизами. Presenter 0.1.0 и npm versions сохраняются. Оба native manifests и changelog получают одну candidate version каждого plugin; version headings описывают подготовленное содержимое, а нейтральная status note отличает его от публикации, которая подтверждается matching immutable tag. Это позволяет проверить окончательные plugin bytes до approval и тегировать тот же main без промежуточной правки changelog; catalogs продолжают выбирать local tree snapshot, без SHA pins.

Проверка: native CLI в disposable CODEX_HOME/CLAUDE_CONFIG_DIR, без смены HOME и без вызова моделей. Сначала public GitHub baseline snapshot, затем candidate feature ref; install/repeat/update/coexistence/discovery подтверждаются CLI inventory и сравнением всех installed bytes. CLI listing не выдаётся за model invocation. Личные профили/потребители не меняются. Неуспешный публичный доступ не заменяется loopback evidence. Unavailable source/ref/version/hash mismatch означает failed/incomplete, без выдуманной установки или обхода проверки.

Final release tags создаются только после merge preparation PR и явного approval конкретных версий/состава/main commit/evidence. Оба тега выбирают один окончательный main snapshot; различаются именем/версией plugin. Существующие теги не перемещаются. До approval выпуск остаётся неподтверждённым и final-tag checks невыполненными. После разрешения конкретного final main: создать теги на нём, проверить remote commit и native installation тегов; changelog/manifest bytes уже подготовлены и проверены в preparation PR. Любое изменение candidate bytes после проверки требует повторной проверки затронутой поставки.

## Risks and delivery

Один marketplace registration выбирает snapshot для обоих plugins. Смена ref требует штатного refresh/reinstall/update; не обещать обновление других plugins само по себе. Для rollback выбирается существующий предыдущий tag/ref и выполняется явная переустановка; если старого публичного release нет, не выдумывать его. Первое подключение/upgrade asc-admin выполняются отдельно его агентом.

## Verification/review ledger

Sources/findings: Source | Finding | Affected files/issues | Disposition | Evidence. Private input labels and public actionable sources сохраняются. Проверки/ограничения заполняются по фактическим данным.

## GitHub issue edits

#97 будет фиксировать candidate versions, preparation PR, native evidence и отдельный release approval checkpoint. #96 delivery closure/queue обновляются этим первым PR по задаче #97 по плану PR #99; критерии 88 не расширяются.


### Native baseline — 2026-11-10

Codex 0.167.0 / Claude 2.1.308, Node 26.11.1. Fresh isolated profiles and empty working directory; HOME unchanged, inherited HERDR/CODEX_THREAD_ID stripped; no model/API invocation. Public GitHub checkout of `02591a2` confirmed in each native marketplace clone. Both installed FC 0.1.1, shell 0.2.1 and presenter 0.1.0, then repeated all three installs. All 8 files per plugin in each installed cache match that actual Git snapshot. These are previous unpublished draft versions, not old release tags.

Codex accepted --ref commit SHA. Claude URL#SHA failed because its clone expects a branch/tag; retried URL#main and verified resolved `02591a2`. The failed SHA attempt is not install evidence and does not support SHA URLs for Claude. Consumer commands use version tags. No GOST tags returned by git ls-remote --tags at preparation start; no previous public rollback tag assumed.


### Historical public GitHub candidate verification — before published review

Public source `https://github.com/antonsmolko/gost-spec.git`, branch `feature/gost-spec-97-skills-release`; both native clones resolved `45aa5c1eb1284d560a72c3cdcc23a7373f0a0a8f`. This is candidate-ref evidence, not final-tag/main-release evidence. Logs record actual source/checkout; no loopback/local directory substitute.

In each isolated profile, removed the installed FC/shell pair and marketplace using the documented native commands; subsequent inventory was empty (marketplace removal also removed presenter). Registered public candidate branch and installed/restored all 3; repeated each install. Fresh process inventories show exactly one enabled entry per plugin: FC 0.2.0, shell 0.3.0, presenter 0.1.0. Every 8-file installed tree matches candidate source in both hosts; presenter bytes match baseline too. This verifies actual replacement 0.1.1→0.2.0 and 0.2.1→0.3.0, repeat and coexistence without changing the unchanged plugin's contents.

Codex fresh app-server handshake then `skills/list` with empty cwd and forceReload=true reports exactly 3 enabled namespaced GOST skills from the isolated cache paths; no model turn started. This uses the [supported discovery protocol](https://learn.chatgpt.com/docs/app-server). Claude fresh `plugin details <id>` reports Skills (1) with correct name for each installed plugin. `details --json` is unsupported in 2.1.308; that failed attempt is not evidence, the plain command succeeds. Native discovery differs from invoking a model/applying a skill; no model completion or asc-admin behavior is claimed.

Both temporary profiles use distinct CODEX_HOME/CLAUDE_CONFIG_DIR, empty cwd and unchanged HOME. Fingerprints of personal Codex config, Claude settings/installed-plugin/marketplace records are unchanged after all CLI/app-server checks. No personal source/cache was modified. Only temporary verification helpers/logs exist outside repository; no new distribution tooling introduced.

### Historical preparation gates — before publication

Root npm check 114/114 on Node 26.11.1, strict 13/13; parser audit 153 tracked Markdown/271 local links/24 fragments/0 errors (marked 18.1.1 + git ls-files, preparation working tree based on `02591a2`, captured before `45aa5c1`; later review-fix repeat named separately below). Existing distribution gate accepts both candidates and catalogs. No scripts/tests/runtime sources changed; native and npm standards checks use existing tooling. Final tag names are still absent; no released version, final-tag installation, release approval or real consumer update is claimed. Tasks 4/5 remain pending by design, not marked complete by candidate evidence.


Candidate payload identities (Git tree content only, not required history/pins): FC 0.2.0 `685df0d310a7069a80e7cc7df3b363dd9181a975`, shell 0.3.0 `4517cfafa96a7feef1cd63009c30acb1bf0a9e50`, unchanged presenter 0.1.0 `c4ef014c81ad3f5bf8ea350ab1224639f77a97e1`. Any merge method is allowed: compare actual final main payload, not ancestry of `45aa5c1`. The source commit is verification evidence only. Both catalog files, all SKILL/references/fixtures and five npm packages are byte-identical to `02591a2`.


### Historical retained native commands and installed identities

All commands below ran from the same empty temporary cwd with isolated CODEX_HOME/CLAUDE_CONFIG_DIR. Profile paths are deliberately omitted; no config/auth contents are published. Baseline registration used the full Codex SHA ref `02591a250d0f24d2a4f3644a98813b00385162ec` and Claude URL#main resolved to that commit, followed by native install/repeat of all 3. Exact successful candidate transition commands:

```sh
codex plugin remove gost-functional-core@gost --json
codex plugin remove gost-svelte-shell@gost --json
codex plugin marketplace remove gost --json
codex plugin list --json
codex plugin marketplace add https://github.com/antonsmolko/gost-spec.git --ref feature/gost-spec-97-skills-release --json
for plugin_name in gost-functional-core gost-svelte-shell gost-view-presenter; do
  codex plugin add "$plugin_name@gost" --json
  codex plugin add "$plugin_name@gost" --json
done
codex plugin list --json
claude plugin uninstall gost-functional-core@gost --json
claude plugin uninstall gost-svelte-shell@gost --json
claude plugin marketplace remove gost --json
claude plugin list --json
claude plugin marketplace add 'https://github.com/antonsmolko/gost-spec.git#feature/gost-spec-97-skills-release' --json
for plugin_name in gost-functional-core gost-svelte-shell gost-view-presenter; do
  claude plugin install "$plugin_name@gost" --json
  claude plugin install "$plugin_name@gost" --json
done
claude plugin list --json
claude plugin details gost-functional-core@gost
claude plugin details gost-svelte-shell@gost
claude plugin details gost-view-presenter@gost
```

Both marketplace Git HEADs were checked with `git rev-parse HEAD` and `git remote get-url origin`: public source above, commit `45aa5c1`. Equality method enumerated **all 8 relative paths** in each installed plugin, calculated SHA256 of each file's bytes, and compared the full map with candidate checkout. The following digest is SHA256 of UTF-8 `json.dumps(path_to_sha256, sort_keys=True, separators=(',', ':'))`; Codex, Claude and source maps are identical:

| Plugin | Version | Installed-content map SHA256 (both hosts) |
| --- | --- | --- |
| gost-functional-core | 0.2.0 | 97dd0b472b94bfbea24b62e161a545a62a0bd45dd00da9b1133114c1467f6913 |
| gost-svelte-shell | 0.3.0 | 6264333e518af58fcf1ea9a19b119a14064728b499acb8fa3929d2a181408c13 |
| gost-view-presenter | 0.1.0 | 7df3a69d9f03f9fed4e027b36b6b167702d1944214dbc3612ea914c639f045ea |

Fresh Codex protocol sequence: initialize(clientInfo name/version), initialized notification, skills/list(cwds=[empty cwd],forceReload=true); 3 expected enabled namespaced skills from CODEX_HOME cache, 0 errors. Claude details each shows Skills (1), correct name/version. No model turn/API invocation. Baseline/removal/candidate inventories and file maps establish replacement/repeat/coexistence; native details alone do not establish bytes.

### Independent review

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| [Distribution Verify before release contract](https://github.com/antonsmolko/gost-spec/blob/02591a250d0f24d2a4f3644a98813b00385162ec/openspec/specs/state-foundation-plugin-distribution/spec.md), independent agent private input, not a public basis | R1: native counts/source commit retained without exact successful commands and installed-content hashes | design ledger | Fixed | Sanitized exact native sequence, source/ref/commit, Git tree IDs, reproducible 8-file-map digests and comparison method now retained; reviewer independently verified both public clones and caches |

Scoped independent confirmation: R1 fixed. Reviewer independently recomputed all 3 documented installed-content digests from source and both host caches (9 equal results), inspected retained exact commands/method, and found no new conflict. Preparation spec compliance PASS, quality PASS, no open findings. Final-main/tag checks remain separate pending tasks 4/5.

Preparation delivery is [PR #100](https://github.com/antonsmolko/gost-spec/pull/100); issue #97 current checkpoint records chosen candidates and public native evidence, preserves final-main/release approval and pending tasks 4/5. Historical placeholder note in issue #97 now names concrete candidates without claiming publication. This PR fulfills PR #99’s required persistent S3/handoff update for delivered/closed 96. After owner-approved merge, the merging agent verifies actual main/payload and presents that concrete release candidate for separate tag approval; issue #97 stays open until final-tag checks succeed. Repository checkpoints remain PR-mediated, while live issue #97 is updated per release step.

Final preparation checks: npm check 114/114 on Node 26.11.1, strict 13/13; fresh marked 18.1.1/git-tracked Markdown scan of review-fixed working tree based on `35d63fd`: 153/271/24 with 0 errors, dependencies installed and heading fragments checked. Complete final PR diff/unchanged-document and issue-contract/dependency checks completed separately from native/runtime checks. At the pre-review snapshot, plugin payload matched `45aa5c1`; the published-review README corrections below require renewed native verification.


### Published PR #100 review

Sources read: all six inline threads (hasNextPage=false), all six summary reviews (empty bodies) and both PR comments including the [full review summary](https://github.com/antonsmolko/gost-spec/pull/100#issuecomment-6778215206), at head `5492d31`. Published verification of counts, prior hashes and source compatibility is retained as evidence for that snapshot; R1 remains closed. The following minor fixes do not change requirements or release gates.

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| [Ledger spacing](https://github.com/antonsmolko/gost-spec/pull/100#discussion_r4529995442) | R2: glued identifiers/versions/counts in canonical prose | design, proposal, public checkpoint text | Fixed | Spaces and readable PR/issue identifiers restored; recorded commands, hashes and versions preserved |
| [Queue spacing](https://github.com/antonsmolko/gost-spec/pull/100#discussion_r4530006486) | R3: queue checkpoint has glued counts/versions | readiness queue | Fixed | Status/count/version tokens separated without changing evidence values |
| [Existing registration](https://github.com/antonsmolko/gost-spec/pull/100#discussion_r4530006668) | R4: plugin install blocks do not route existing gost registration to explicit selection | both plugin READMEs | Fixed | Fresh-registration guard links each plugin's self-contained update/rollback section; no implicit ref substitution |
| [Second tag](https://github.com/antonsmolko/gost-spec/pull/100#discussion_r4530006875) | R5: final-tag checklist leaves second tag selection ambiguous | release guide | Fixed | Separate fresh profile per tag/host, or explicit re-registration procedure before second tag; retained plugins restored |
| [Impact](https://github.com/antonsmolko/gost-spec/pull/100#discussion_r4530007082) | R6: affected-representation list omits root README and handoff | proposal Impact | Fixed | Root README, session handoff, queue, guide and change artifacts named; scope unchanged |
| [README formatting](https://github.com/antonsmolko/gost-spec/pull/100#discussion_r4530007388) | R7: unwrapped line/double blank in distributed FC README | FC README | Fixed | Paragraph wrapping restored and duplicate blank removed |

Because README bytes changed, the original `45aa5c1` trees/digests above are historical receipts, not current-payload claims. Both affected installed payloads must be rechecked from the updated public candidate before readiness is claimed. Only documentation/formatting changed: native command blocks, plugin versions, SKILL/recipes, catalogs, runtime and approval gates remain unchanged. Final release tasks 4/5 remain pending.


### Fresh verification after published-review payload fixes

Actual public source `https://github.com/antonsmolko/gost-spec.git`, candidate branch resolved to `55266a52bb1c5521aedb8cced0ad35268b075698` in both native checkouts. Fresh temporary profiles first installed public `5492d31` (Codex full SHA ref; Claude candidate branch verified at that commit), then followed the retained re-registration sequence above after the fix push. Added `plugin marketplace list --json` before each transition to confirm an existing `gost` registration. Removed the pair and marketplace, observed empty inventories, registered the updated ref, reinstalled/restored all three plugins and repeated each installation. All commands succeeded; no local/loopback source substituted.

Codex 0.167.0 and Claude 2.1.308 each expose exactly one enabled FC 0.2.0, shell 0.3.0 and presenter 0.1.0. Every installed 8-file map equals the corresponding source map. Codex fresh initialize/initialized/skills-list process reports three enabled namespaced skills from isolated caches, zero discovery errors; Claude fresh plugin-details calls each report one skill with correct identity/version. No model turn. Personal profile fingerprints unchanged; HOME retained and profiles/cwd isolated. The historical commands still apply, and both updated README self-links resolve to their own update procedure.

Current payload identities (Git tree and reproducible installed-map digest formula above):

| Plugin | Version | Git tree | Installed-content map SHA256 (both hosts) |
| --- | --- | --- | --- |
| gost-functional-core | 0.2.0 | `2dd204209ddf9c7f00a5c1e70d9518ac0178a7ea` | `d344caaaa7b97e714e46d2af00858626a9de247b1f49ddf4e26cbad99427c0cf` |
| gost-svelte-shell | 0.3.0 | `2da690afd1f38a3a3dfc15255b05492c8fafa678` | `399b22999f56bc37ee42d239284f7e943f737ea7c0361996d60b43cc71fcd281` |
| gost-view-presenter | 0.1.0 | `c4ef014c81ad3f5bf8ea350ab1224639f77a97e1` | `7df3a69d9f03f9fed4e027b36b6b167702d1944214dbc3612ea914c639f045ea` |

Only the two README payloads changed from the original receipt; presenter and all manifests/changelogs/SKILL/recipes/catalogs/runtime/npm packages are unchanged by this review round. These current identities replace the old receipt for future final-main comparison. Same candidate versions are intentional: no release tag has been published. Final-main approval and actual final-tag installation remain pending tasks 4/5.


Published-review verification: full npm check 114/114 on Node 26.11.1, strict OpenSpec 13/13, whitespace clean. Fresh marked 18.1.1 lexer/walkTokens scan over git-tracked Markdown, with installed dependencies and heading-fragment checks, at the review-fix working tree based on `55266a5`: 153 files / 274 local links / 27 fragments / 0 errors. The three new same-file guards/procedure links explain the increase from the historical 271/24. Exact historical native command blocks and all prior digest values were retained unchanged while surrounding prose was spaced.

Complete final PR diff and relevant unchanged main contract/issue criteria checked separately from native/runtime verification. Public issue #97 and PR description now distinguish the old receipt from the renewed payload, with readable version/count tokens. All six threads and the published summary have dispositions R2–R7; prior R1 closure is retained. These are documentation clarifications of existing behavior, not contract or gate changes; the wording-only exception in AGENTS §6 applies. No additional independent contract review is claimed; renewed native checks above cover the changed installed bytes. Final tasks 4/5 and separate release approval remain unchanged.


## Published release verification

Owner explicitly approved the previously presented pair/main after PR #100 merge. The approval is private input, not a public basis; [public candidate checkpoint](https://github.com/antonsmolko/gost-spec/pull/100#issuecomment-6778794084) records the exact versions/tags/main before approval. Both absent names were created as annotated tags and pushed atomically without force. Remote annotated objects and peeled commit were independently read back; neither tag was moved.

| Released tag | Remote tag object | Peeled release commit |
| --- | --- | --- |
| gost-functional-core-v0.2.0 | `d68e6718b821eb521cf3af1219d05c75ea25d09d` | `64714fcc9929ce3eb0ea7676dfabaa883f5069f7` |
| gost-svelte-shell-v0.3.0 | `381952862d1527b73b22181118d9c88c5da0ca84` | `64714fcc9929ce3eb0ea7676dfabaa883f5069f7` |

Exact tag publication commands after absence/manifests/changelog/source checks:

```sh
git tag -a gost-functional-core-v0.2.0 64714fcc9929ce3eb0ea7676dfabaa883f5069f7 -m '[gost-spec-97]: Release gost-functional-core 0.2.0'
git tag -a gost-svelte-shell-v0.3.0 64714fcc9929ce3eb0ea7676dfabaa883f5069f7 -m '[gost-spec-97]: Release gost-svelte-shell 0.3.0'
git -c http.version=HTTP/1.1 push --atomic origin refs/tags/gost-functional-core-v0.2.0 refs/tags/gost-svelte-shell-v0.3.0
git ls-remote --tags origin 'gost-functional-core-v0.2.0*' 'gost-svelte-shell-v0.3.0*'
```

### Final native matrix

Four fresh isolated profiles, one per tag/host, with empty cwd, distinct CODEX_HOME/CLAUDE_CONFIG_DIR and unchanged HOME. Native commands used the real public GitHub source; each checkout HEAD equalled the peeled release commit above. Each installed/restored FC 0.2.0, shell 0.3.0 and unchanged presenter 0.1.0, repeated each installation, then verified one enabled entry per plugin and exactly 8 files matching `git show <release-commit>:plugins/<name>/...`. All installed maps reproduce the three **current** digests in the renewed receipt above; historical `45aa5c1` digests were not used.

| Source tag | Codex 0.167.0 | Claude Code 2.1.308 |
| --- | --- | --- |
| gost-functional-core-v0.2.0 | install/repeat/content/discovery PASS | install/repeat/content/details PASS |
| gost-svelte-shell-v0.3.0 | install/repeat/content/discovery PASS | install/repeat/content/details PASS |

For each tag value below, the commands ran in the corresponding fresh host/tag profile; paths/auth data are omitted. No local/loopback substitution:

```sh
codex plugin marketplace add https://github.com/antonsmolko/gost-spec.git --ref "$tag" --json
claude plugin marketplace add "https://github.com/antonsmolko/gost-spec.git#$tag" --json
for plugin_name in gost-functional-core gost-svelte-shell gost-view-presenter; do
  codex plugin add "$plugin_name@gost" --json
  codex plugin add "$plugin_name@gost" --json
  claude plugin install "$plugin_name@gost" --json
  claude plugin install "$plugin_name@gost" --json
done
codex plugin list --json
claude plugin list --json
claude plugin details gost-functional-core@gost
claude plugin details gost-svelte-shell@gost
claude plugin details gost-view-presenter@gost
```

`tag` was bound to each literal tag name in the matrix. Codex fresh initialize/initialized/skills-list(forceReload) returned three enabled namespaced GOST skills from isolated caches, zero errors. Claude details reported one expected skill per plugin. No model turn or asc-admin application was run.

Both hosts additionally switched the first tag's profile to the second tag using the documented remove-pair/remove-marketplace/add-selected-ref/reinstall/restore sequence. Verified selected native ref, three unique versions, restored presenter and all 8-file maps again. These tags share contents; this proves deliberate source selection/re-registration, while actual earlier version upgrade evidence remains in the candidate receipt. No older published-version rollback is claimed.

An initial probe incorrectly searched marketplace-list text for the selected tag; Codex listing omits ref and the profile path was a misleading match. That harness assertion was discarded. Corrected verification reads Codex's native `[marketplaces.gost].ref` and Claude's `known_marketplaces.json` source.ref, not path text. The first Codex profile was reset through native CLI and all four selections/discovery cases plus both explicit transitions were rerun successfully. No manual config writes, product failure or tag changes were involved. Personal config/settings/installed-plugin/marketplace fingerprints remained unchanged after the completed checks.

Current Git trees and all three installed-content map SHA256 values match the renewed `55266a5` receipt and the approved release main. Plugin/catalog/package/fixture/skill bytes are unchanged by this verification branch. The guide now reports actual publication and verified final-tag installation; this ledger/handoff/queue and tasks record completed work, not additional release content. Tags remain on the approved commit even as documentation main advances.

### Final GitHub checkpoint and delivery

Issue #97 stays open pending delivery of the final verification PR; release publication/native checks themselves are complete, tasks 5/5. Current #96/#97/#88 checkpoints distinguish delivered preparation, published immutable tags and pending report delivery. After explicit approval to merge this report, the merging agent verifies main contains it and closes #97 as completed; no tag recreation/movement or second release approval is required. File checkpoints remain PR-mediated, live issue status updated per step. No application migration or normative-content acceptance is implied.


### Release verification GitHub issue edits

Live #96/#97/#88 checkpoints were refreshed after final-tag checks: both tags are published on the approved main and native verification passed; approval/final-tag work is no longer described as pending. Only durable verification-report delivery remains pending. Issue #96 stays closed, #97 stays open until report delivery, and #88 criteria/prior closures remain unchanged. [Public publication/checkpoint receipt](https://github.com/antonsmolko/gost-spec/issues/97#issuecomment-6779307093) records the tags, revision, matrix and follow-up. Final verification report: [PR #101](https://github.com/antonsmolko/gost-spec/pull/101); #97 closes only after approved merge and delivery verification. This report link is also recorded in #96/#97/#88 checkpoints.

### Final verification review

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| [Public #97 release/checkpoint criteria](https://github.com/antonsmolko/gost-spec/issues/97), independent agent private input, not a public basis | R8: old live checkpoints still described approval/tag checks as pending while final ledger claimed publication | #96/#97/#88, issue-edit ledger | Fixed | All three bodies now distinguish published/verified release and pending report delivery; dedicated issue-edit evidence and public receipt recorded above |


Independent final review completed on 2026-11-11: specification compliance and quality PASS, no open findings. The reviewer independently read remote tag objects/peels, recomputed all 12 installed file maps, checked retained native inventory/discovery/transition receipts and personal-file fingerprints, and refreshed all three live checkpoints to confirm R8 closure. This agent report is private input, not a public basis; the public release/checkpoint criteria and publication receipt above are its actionable basis. Prior R1–R7 closures are retained. No further merge/publication authority is implied.

Final documentation verification on this branch: full npm check 114/114 on Node 26.11.1; strict OpenSpec 13/13; whitespace clean. Fresh marked 18.1.1 lexer/walkTokens scan over git-tracked Markdown with local heading-fragment checks: 153 files / 273 local links / 29 fragments / 0 errors. The complete five-file diff and relevant unchanged contracts were reviewed separately from runtime/native checks; plugins, catalogs, packages, fixtures, scripts and tests remain unchanged from the approved release commit.


### PR #101 published review — 2026-11-14

Read all PR #101 inline threads (2, hasNextPage=false), both summary reviews
(empty bodies), all PR comments (none), the PR description and live #97 criteria.
Prior R1–R8 closures are retained. The earlier independent PASS records that
review round; it does not claim R9/R10 were absent from the later public review.

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| [R9 owner review](https://github.com/antonsmolko/gost-spec/pull/101#discussion_r4542354695) | Frozen READMEs retain prepared/unreleased wording; presenter example selects an absent tag | consumer guide, release ledger, #97; next-release README work #102 | Fixed current disclosure; embedded README correction explicitly deferred by owner request to next substantive release | Guide now distinguishes publication from frozen preparation wording, explains changelog tag condition and gives presenter installation from an existing pair snapshot; [follow-up #102](https://github.com/antonsmolko/gost-spec/issues/102) records owner agreement, responsible next-release maintainer and acceptance criteria. No existing tag or payload changed |
| [R10 owner review](https://github.com/antonsmolko/gost-spec/pull/101#discussion_r4542357303) | S4 result column still reads as a pending approval dependency | readiness S4 | Fixed | Result now states versions/changelog, native installation and tags were checked after separate approval; asc-admin update remains next |

R9 boundary: both pair tags exist and peel to the approved release commit;
`gost-view-presenter-v0.1.0` is absent. Presenter bytes are available through the
shared pair snapshot; its own README command is not an available tag-install
path. Preparation wording in immutable FC/shell READMEs does not negate existing
tags, but is a consumer-facing limitation and must be disclosed. Current guide
clarifies this now; #102 changes future payload in its own release PR. #97
criteria/closure remain unchanged. No tag movement or new publication is allowed
by this documentation fix.

#### GitHub issue edits for PR #101 review

Created #102 from the owner's public R9 request, linked carrier #97 / PR #101,
retained [gost-spec-97] for this report branch and preserved carrier criteria.
Updated #97 checkpoint with the limitation, follow-up and actual report PR link.
Consumer documentation contains the actionable limitation only, not review or
roadmap details. These are wording/disclosure corrections, not contract/gate
changes; AGENTS §6 wording-only exception applies to this review round.


Review-fix verification: npm check 114/114 on Node 26.11.1; strict OpenSpec
13/13; git diff --check clean. Fresh marked lexer/walkTokens scan of 153 tracked
Markdown files: 273 local links / 29 fragments / 0 errors. Complete final PR diff
inspected with unchanged distribution spec, proposal, root README and live #97
criteria checked separately for conflicts. Remote tag objects/peels unchanged;
no presenter-specific tag returned. Plugin/catalog/package/fixture/script/test
bytes remain identical to the approved release commit. No renewed native install
is claimed or needed for this documentation-only clarification.
