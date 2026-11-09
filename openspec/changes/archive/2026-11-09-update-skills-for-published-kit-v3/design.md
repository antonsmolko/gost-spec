# Design

## Context

[#96](https://github.com/antonsmolko/gost-spec/issues/96); мотивация — [proposal](proposal.md). Baseline — README и публичные declarations реально скачанных npm common@0.3.0 / svelte@0.2.0, а не sibling workspace. FC сейчас использует старый createApiHandler/двухпараметрический ApiEffect; shell передаёт initState как значение. Оба контракта несовместимы с новыми пакетами.

## Goals / Non-Goals

Цель — пригодные для копирования английские примеры и проверяемое применение к synthetic consumer. Существующий один store/context и границы миграции сохраняются. Library semantics проверяются в объёме используемых примеров, без повторного написания всей suite gost-kit. Маршрутизация, мерцания, persistence, миграция asc-admin и выпуск не входят.

## Decisions

- Использовать публичные defineApiOperation/createApiEffect/createApiEffector из common@0.3.0: data-layer operation с mapper возвращает domain model; reducer создаёт только description, общий app effector выполняет I/O и dispatch. Не сохранять старый ручной object effect с потерей operation identity.
- Примеры проверять с несколькими операциями/разными ответами. Контракты операции доверяют generated schema статически; runtime validation отвечает приложение. Некорректный response/mapper должен показывать реальную contract failure, callback/dispatch exceptions — execution boundary, не backend error. Отсутствующий callback трактуется по библиотеке; отсутствие зависимости — incomplete.
- initState передавать фабрикой. Defaults вложенных scopes создаются заново. reset вызывается явно, принимает excluded по корневым ключам; сохраняет существующие исключённые scopes по ссылке. Factory один раз на reset; shared onError синхронный, различает kind reset и dispatch. Начальная ошибка фабрики выходит из создания; reset error сообщает reporter и сохраняет state при factory failure. Нет обещания отмены запросов/безмерцающей навигации.
- Проверки с настоящими registry artifacts во внешних directories: сначала RED старых snippets на новых declarations, затем type/build, чистые factory-based unit tests и app/API/browser probes. Внешние fake transports выбираются при создании клиента. Markdown examples проверяются как source, не текстовыми regex-тестами.
- Сохранить draft plugin versions в compatibility outcome: они уже unreleased; pending changelog отражает новые compatibility contracts, а финальная новая версия и объединение pending changelog принадлежат зависимой [#97](https://github.com/antonsmolko/gost-spec/issues/97). Не заявлять прежние версии как выпущенный новый compatibility artifact.

## Risks / Trade-offs

- Новые API могут быть недоступны у потребителя → проверять exports/engines/peers перед изменениями, не обновлять среду молча.
- Code snippets могут разойтись с fixture → компилировать скопированные blocks и выполнять внешние consumers; отсутствие доказательства отражать явно.
- Public-host release требует отдельной проверки → местная проверка plugin bytes не заменяет установку по финальным тегам в #97.

## Migration Plan

Поставить только через [implementation PR #98](https://github.com/antonsmolko/gost-spec/pull/98) для #96, независимое ревью полного результата; merge требует решения владельца. #97 подготавливает конкретные release candidates после доставки. Применение к asc-admin — в его сессии. Откат content PR не откатывает потребительские приложения автоматически.

## Verification and review ledger

Evidence заполняется по фактическим результатам. Review sources и dispositions: `Source | Finding | Affected files/issues | Disposition | Evidence`. Private input помечается `private input, not a public basis` и сопоставляется публичным требованиям #96.

## GitHub issue edits

- Созданы #96 (совместимость) и #97 (выпуск), #97 зависит от #96; критерии не смешивают публикацию и compatibility evidence.
- Review round2: в #97 явно зафиксированы minor bump обоих изменённых plugins и placeholder-статус нынешних patch headings; окончательные версии и release approval остаются отдельной задачей. PR98 исправляет счётчик app integration на7 с aborted. Критерии #96 и закрытия предыдущих findings сохранены.
- #88: текущие указатели #93/архива заменены на #96/#97 без расширения критериев #88; предыдущая baseline сохранена как история. #96: добавлен implementation checkpoint и уточнён текущий routing prerequisite. Проверка GitHub выявила перенос gost-kit #33 → asc-admin #72 и отложенный статус #89; очередь отражает этот уже согласованный порядок, без новых механизмов.

### Artifact and compatibility evidence

2026-11-08, Node26.11.1 / TypeScript5.9.3. Registry tarballs installed outside workspace; no source imports. common0.3.0 engines ^26.0.0; svelte0.2.0 engines ^26.0.0, common ^0.3.0, peer Svelte ^5.57.2.

| Artifact | Registry source | Integrity |
| --- | --- | --- |
| common0.3.0 | [tarball](https://registry.npmjs.org/@gost-kit/common/-/common-0.3.0.tgz) | `sha512-XRKHjbW3/31u38SxF09tJBzIMLk23FyAOI6JoKtSqMOJGc9X9B5/0YIITb5aVEsvpsoWxJnJPE8obKuu+4oBWw==` |
| svelte0.2.0 | [tarball](https://registry.npmjs.org/@gost-kit/svelte/-/svelte-0.2.0.tgz) | `sha512-7nSr5Tz2UF2BxSX/Y8o05nxzRmsBud2RLxa6e2DFWqiOi1Yd02lryDEJELubQnKtBti/jyv0elM9ljE42lakQA==` |

All 264 common and 8 shell installed files match inspected tarball bytes. Fresh external install uses lockfile registry source/integrity; source fixture remains intentionally unconnected, without kit dependencies. FC external consumer installs exact common itself.

- RED: old FC blocks fail against common0.3.0: ApiEffect needs 3 generics; createApiHandler is absent. Old shell empty recipe fails: initState value is not factory. Captured before edits to the respective recipes.
- FC GREEN: seven complete copied TS blocks compile; reducer unit13/13; exact recipe app effector integration7 cases (mapped success, backend errors, network, empty HTTP errors, nonJSON, aborted, mapper failure); committed feature probe also dispatches these7 scenarios; preferences preserved and pure reducer performs no request. Separate committed fixture `probe:api`12/12 checks multiple response types, async mapper, failure categories, callback/dispatch exceptions and omitted callbacks. Negative compile cases preserve body/result/action-role/operation correlation.
- Shell GREEN: extracted empty recipe check/build and Chromium1/1; disposable probe check/build and Chromium7/7. Svelte5.57.2, Vite8.3.5, plugin7.3.1, Playwright1.64.1. Two consumers, isolated roots, effect result dispatch, full/excluded reset references and factory count, reset/factory/reducer failures, missing provider. Autofixer clean on all three Svelte components. Occupied4187 rejected before cases. Re-extracted empty connection passes again; repeat produces identical four store modules and one provider. Missing artifacts produce unresolved public imports with no fallback. These last two are deterministic checks, not separate natural-language shell agent executions.
- Tooling boundary: Svelte official context/state documentation retrieved with maintained `@sveltejs/mcp` CLI. Existing Vite fixture remains upstream baseline; no custom state/reset implementation added.
- Limits: public-host plugin installation, final tag install and release are #97. These consumer checks certify the documented artifacts/contracts, not asc-admin's environment or migration.


### Forward application and repository checks

Independent agent application (private input, not a public basis; actionable public basis — [#96 acceptance criteria](https://github.com/antonsmolko/gost-spec/issues/96)): fresh framework-free consumer with exact common0.3.0 passes check/build,8 factory-built pure reducer cases, feature integration and12 API cases. Existing API operations/effector bytes preserved; initial missing-feature probe fails before implementation. Follow-up and repeat preserve unrelated modules and one registration. Fresh missing-artifact and missing-composition inputs explicitly remain incomplete without a fallback. The latter typechecks remaining files but fails integration, illustrating the distinction. No separate no-skill model control or new-session repeat measurement is claimed.

Repository checks: npm run check 114/114 on Node26.0.0 and26.11.1, both skill validators, strict change and all 5 main specs pass. Parser-based repository audit at pre-review snapshot:149 tracked Markdown,268 local links,24 fragments,0 failures. Full changed diff and relevant unchanged published contracts/issue bodies inspected separately from runtime tests; historical archived baselines remain dated. Existing npm standards package versions/manifests, marketplace catalogs and presenter plugin unchanged. Fixture baselines intentionally omit the target feature/connection, and dependencies are installed only in external copies; no source lockfile update is required.


### Independent review — round 1

Independent agent reviewed complete diff and requirements without author's working conversation. Source reports are private input, not a public basis; each actionable finding is grounded in public #96 requirements or public #88/PR98 representations below. Read all pages of #96/#97 comments (empty) and PR98 inline comments/reviews/issue comments (empty), issue88 current body, existing main specs and relevant unchanged consumer docs. Existing #88 R1–R3 reviewer-confirmed closures retained. Targeted reviewer checks: fresh FC typecheck/API12, shell check and parser audit pass; browser/full suite evidence above is implementation evidence, not a claimed independent rerun.

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| [#88 public requirements/representations](https://github.com/antonsmolko/gost-spec/issues/88), independent agent private input, not a public basis | R1: remaining paragraphs call0.2.1 the current baseline and routing a library task | #88 body | Fixed | Previous0.2.1 labelled historical, current0.3/#96 made explicit; canonical asc-admin72 application-first wording and deferred89 restored; criteria and prior closures preserved |
| [#96 compatibility criteria](https://github.com/antonsmolko/gost-spec/issues/96), independent agent private input, not a public basis | R2: root README calls checked shell artifacts development artifacts | README.md | Fixed | Source skills now names checked npm artifacts/environment/limits, matching recipe |
| [PR98 public description](https://github.com/antonsmolko/gost-spec/pull/98), independent agent private input, not a public basis | R3: ledger URL in PR prose is repository-relative | PR98 description | Fixed | Absolute branch blob URL used for the committed design ledger |

Additional wording correction: migration plan distinguishes issue96 from implementation PR98. Issue88 current queue link selects the active #96 branch table; its dated old archive checkpoints remain historical. #96/#97 now link implementation PR98; closure remains delivery-dependent.

Scoped confirmation: independent reviewer reread live #88 and PR98, inspected the entire representation-fix diff and confirmed R1–R3 fixed with no new/open findings. Final outcome: spec compliance PASS, quality PASS; release checks remain #97. Full PR diff and unchanged-contract conflict audit completed separately from runtime checks.


### Published review — round 2

Read all pages of PR98 inline comments (4), summary reviews (1), PR issue comments (1 prior checkpoint) and issue96 comments (0); sources captured on2026-11-09 at head df51af3. Published summary independently reproduced root114/114, strict13/13, npm metadata/integrity/file counts, fixture API12, copied recipe13 and Svelte/type checks; retained as reviewer evidence with its stated limits. Prior R1–R3 closures remain closed.

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| [Inline count](https://github.com/antonsmolko/gost-spec/pull/98#discussion_r4507830793) | R4: integration count6 omits aborted from the seven-case committed fixture | design.md, PR98 body | Fixed | Original exact-recipe harness had6 cases; fixture had7. Added aborted to the exact-recipe harness and reran successfully:7/7. Both counts now explicitly7 and named list includes aborted; no retrospective claim that the old six-case harness ran seven |
| [Inline imports](https://github.com/antonsmolko/gost-spec/pull/98#discussion_r4507830795) | R5: blanket type-only import claim includes runtime feature/test imports | functional-core.md | Fixed | Statement scoped to app contract modules; reducer operation and unit factory imports explicitly runtime values |
| [Inline versions](https://github.com/antonsmolko/gost-spec/pull/98#discussion_r4507830798) | R6: patch headings could be released despite feature-level changes | issue97, design.md, queue | Fixed | Issue97 acceptance explicitly requires minor bumps for these two updates and marks0.1.1/0.2.1 unreleased headings as placeholders, not releasable candidates. Independent exact versions and approval still belong to97; no version/tag changed here |
| [Inline boundary](https://github.com/antonsmolko/gost-spec/pull/98#discussion_r4507830800) | R7: fixture README attributes createApiEffect to preserved app boundary | fixture README | Fixed | Names all three supplied modules and only APIs used by them; separates feature/probe use of createApiEffect |

[Published summary](https://github.com/antonsmolko/gost-spec/pull/98#pullrequestreview-5819697560) reconciled with all four entries; its compatibility evidence is retained. Runtime/source blocks, probes, dependencies, main specs and plugin versions are unchanged by these editorial fixes. The additional aborted run extended only the external verification harness. Source links and complete final diff/conflict checks are verified separately from runtime tests.

Round2 verification: npm run check114/114 on Node26.11.1, strict OpenSpec13/13, parser audit149 Markdown/268 local links/24 fragments/0 errors, whitespace clean. Independent review of the complete final PR diff, public requirements, live issue97/PR98 and relevant unchanged contracts confirms R4–R7 fixed, R1–R3 retained closed, spec compliance PASS and quality PASS. Reviewer independently repeated exact-recipe integration7/7 including aborted. Supplemental agent report is private input, not a public basis; public actionable sources remain the four inline comments and summary linked above. Delivery/release and owner approval boundaries are unchanged.


## Archive and spec sync — 2026-11-09

Implementation delivered through [PR98](https://github.com/antonsmolko/gost-spec/pull/98), main6ca71a6; merge approved by owner and merged main check114/114. Owner explicitly requested archive and selected sync+archive. All artifacts done, tasks5/5; no warnings/incomplete work. Archive/schema: `2026-11-09-update-skills-for-published-kit-v3`, spec-driven; metadata/proposal/tasks/deltas preserved.

Inline spec sync reused the current specs-rule snapshot (no extra rules). Existing titles/Purpose preserved; no new capability created. FC: one existing requirement's API-result scenario updated verbatim from delta and one requirement added, yielding8 requirements/22 scenarios. Shell: one requirement added, yielding10/18. Every delta block compared against its main block after sync: identical; unaffected requirement blocks unchanged. No delta operation headers copied into main specs. Only after successful comparison and strict spec validation was the complete change directory moved, including `.openspec.yaml`.

Delivery is [archive PR99](https://github.com/antonsmolko/gost-spec/pull/99) for issue96. Issue96 remains open until that PR reaches main; release preparation97 remains separate. This sync/archive does not change plugin/fixture/package bytes, library compatibility, versions or release approval. Consumer/browser/native evidence above belongs to implementation; those checks are not claimed as repeated for the documentation move.

### Archive GitHub issue edits

Updated issue96/97 checkpoints to name archive PR99 and pending delivery; issue88 current table pointer selects the archive branch and its active queue paragraph distinguishes merged implementation98, pending archive99 and subsequent release97. Their own criteria, prior review closures and release gates are preserved. Historical implementation checkpoints remain labelled; mutable current pointers must not target the removed active directory. Queue/handoff current pointers updated in this archive outcome.

Archive verification: full suite114/114 on Node26.11.1, strict12/12, whitespace clean. Fresh post-move link audit repeated on2026-11-09 at clean head `ee0258c79c382c0a2219f841f182e08857a636ec`: parser scan using marked18.1.1 lexer/walkTokens over git-tracked Markdown (`git ls-files`); URI links excluded, relative targets and heading fragments checked with dependencies installed. Result:149 tracked Markdown/268 local links/24 fragments/0 errors. This is a fresh post-move run at that snapshot, not reused implementation pre-review evidence. All six artifacts compared to implementation6ca71a6: metadata/proposal/tasks/deltas byte-identical, existing design prefix preserved with archive evidence appended. Plugin/fixture/package/catalog files unchanged. Independent reviewer inspected complete diff, exact delta/main comparison, unaffected blocks and pointers: spec compliance PASS, quality PASS, no findings. Supplemental review report is private input, not a public basis; public actionable basis is issue96 and merged implementation PR98. Current GitHub checkpoint edits are listed above; issue96 remains open pending archive delivery.

Scoped independent confirmation after PR99 creation: live issues96/97/88 match final queue/design pointers and pending delivery; prior public-pointer limitation resolved, no new findings.


### Post-merge delivery follow-up

Owner: the agent performing the explicitly owner-approved merge of PR99 in this gost-spec session. After merge, verify PR99's merged commit is on origin/main, update the local main checkout and run its applicable checks. Only after successful delivery verification, refresh live issue96/97/88 checkpoints and their current queue/ledger pointers to the delivered main snapshot; close issue96 as completed. Issue88 criteria/prior closures remain unchanged, and issue97 proceeds separately with its existing release gate.

Repository tracking must go through a PR: the first PR for issue97 refreshes S3/current checkpoint and handoff with the delivered archive, delivery evidence and closed96 status. Until then the queue states the PR/dependency and delivery rule rather than claiming an already-merged PR is awaiting review. This is status bookkeeping under97's existing queue/handoff criterion, not an additional release outcome or authorization to merge/publish.

### PR99 published review

Read all PR99 thread pages (2 threads, hasNextPage false), all summary reviews (1) and PR comments (0) on2026-11-09 at head ee0258c. [Published summary](https://github.com/antonsmolko/gost-spec/pull/99#pullrequestreview-5831859978) independently confirms sync preservation,8/22 and10/18 counts, full114/114, strict12/12 and CI on both Node versions; its evidence remains attributed to that review. Prior R1–R7 closures remain closed.

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| [Post-merge follow-up](https://github.com/antonsmolko/gost-spec/pull/99#discussion_r4517313231) | R8: pending wording becomes stale after merge; no explicit owner/step for delivery refresh and96 closure | queue, archive ledger, live96/97/88 follow-up | Fixed | Queue states dependency/delivery rule; named merge agent verifies main, refreshes live checkpoints/pointers and closes96. First97 PR records persistent S3/handoff delivery status; no direct-main edit or release implied |
| [Audit provenance](https://github.com/antonsmolko/gost-spec/pull/99#discussion_r4517313242) | R9: link counts lack method/snapshot and could be mistaken for historical results | archive ledger, PR99 description | Fixed | Fresh clean-head post-move parser scan at ee0258c recorded above; review-fix candidate is scanned again with method/snapshot and current counts recorded below and in PR description |

### Review GitHub issue edits

Issue96/97 follow-up points to the explicit post-merge owner/steps above; current pending delivery state stays factual until delivery is verified. Issue88's existing acceptance criteria and prior closures remain untouched; its live pointers refresh in the assigned post-merge step. PR99 audit line identifies parser method and checked snapshot. No changes to synced requirements, archived source artifacts, plugin versions, packages or release approval.

Review-fix verification2026-11-09: fresh post-move parser audit of the candidate working tree based on head ee0258c (including these delivery/provenance edits), marked18.1.1 lexer/walkTokens + git-tracked Markdown, installed dependencies, filesystem targets and heading-fragment validation:149 Markdown/268 local links/25 fragments/0 errors. The added delivery-follow-up fragment explains24→25; the149/268/24 snapshot above is explicitly the earlier clean-head run. Full npm check114/114 on Node26.11.1, strict12/12, whitespace clean. Complete final PR diff inspected; relevant unchanged specs, queue, public96/97 criteria/dependencies and handoff freshness rule checked separately from runtime tests. Only delivery wording/provenance clarified, with no changed requirements or approval gates; the wording-only exception in AGENTS6 applies, so no additional independent contract review is required. Published reviewer-confirmed sync preservation and R1–R7 closures retained.
