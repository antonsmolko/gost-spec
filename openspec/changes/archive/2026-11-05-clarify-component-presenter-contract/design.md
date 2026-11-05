# Design

## Context

Scope — [#78](https://github.com/antonsmolko/gost-spec/issues/78), мотивация —
[proposal](proposal.md). Owner уже перечислил критерии и уточнил read-only
`$derived`, state ownership и один intent action. План не вводит новый runtime.

База main `31930c40818972cecea725a828e9478f6144248f` содержит skill FC после
PR #77: application effects отдельно, unit reducer tests используют state factories.
Архив/sync #75 выполнен в PR #82; статус доставки проверяется по PR. Порядок #78 → #79 сохраняется.

Наблюдаемые противоречия текущих документов:

- FRONTEND-ARCH-001 — proposed seed с общей ответственностью, без точной границы
  local UI-state и root/feature state.
- FRONTEND-ARCH-002 сохраняет чистоту/композицию, но допускает «simple expressions»
  и local interaction state в UI. Это нужно заменить конкретным контрактом.
- SVELTE-STATE-001 рекомендует derived computations. Нельзя истолковать пересмотр
  как запрет `$derived`, read-only binding или вызова presenter.
- FSD профиль не требует presenter/store сам по себе; его layer policy и новый
  FC/presenter contract остаются разными решениями потребителя.
- Inventory ещё относит stateful presenter conventions к separate design pending;
  новая редакция должна уточнить именно принятую область, сохранив API/form policies.

### Baselines and discovery

- [Svelte $derived](https://svelte.dev/docs/svelte/$derived),
  [if blocks](https://svelte.dev/docs/svelte/if),
  [markup/events](https://svelte.dev/docs/svelte/basic-markup),
  [each](https://svelte.dev/docs/svelte/each), [bindings](https://svelte.dev/docs/svelte/bind).
  CLI `@sveltejs/mcp` list-sections/get-documentation использован для этих разделов.
  Svelte допускает более широкие expressions и overrides derived; выбранная
  здесь policy строже framework syntax и не объявляет derived автоматически read-only.
- Maintained [gost-kit example fbf8a518](https://github.com/antonsmolko/gost-kit/tree/fbf8a5182a87fd279ce541edff098d5ec3135e6d/examples/functional-core/src):
  `UserForm.svelte` выбирает feature и вызывает pure `userPresenter` в `$derived`,
  events dispatch-ят один action; shell содержит собственный `$state.raw` binding.
  Pure presenter tests используют `userState` factory; это подходящий baseline.
- Тот же UserForm использует `{#if viewState.loadedUser}`, а GlobalAlert —
  `{#if alert}`. Object truthiness не соответствует новому ready-boolean правилу.
  Пример — наблюдаемый исходник, не доказательство новой policy. Read-only
  svelte-autofixer UserForm вернул issues/suggestions пустыми: он не проверяет
  эту архитектуру. Исходники gost-kit не менялись.
- [Presentation Model](https://martinfowler.com/eaaDev/PresentationModel.html) —
  историческая архитектурная база. Pure-function presenters и FC ownership —
  выбранная policy проекта, а не обязательное требование паттерна Fowler.

## Goals / Non-Goals

**Goal:** понятный англоязычный proposed-контракт с проверяемыми примерами для
проектов, явно выбирающих этот FC/presenter подход. Сохранить чистую композицию
presenters и минимальные stateless компоненты без ненужных обёрток.

**Non-Goals:** принять содержание вместо owner review, создать skill #79,
ESLint rules/config, presenter/state runtime, поменять shell/FC API, FSD layout,
версии/имена пяти пакетов, подключить или мигрировать приложения.

## Decisions

### State and presentation ownership

Logical feature/UI state — например открытая модалка, выбранная вкладка,
черновик формы — находится в root/feature state и меняется intent actions через
reducer. Presenter получает state/context явно, возвращает view state, не
мутирует входы, не делает I/O и не владеет альтернативным mutable store.
Reducer читает актуальное состояние, возвращает state/effects без dispatch/I/O;
готовые handlers приложения исполняют effects. В FC action передаётся необходимый
стабильный payload, а не DOM node/event; событие может передаваться между UI
handlers/adapters для browser plumbing. Реализация реактивного shell
сохраняется и не подпадает под запрет второго UI-store.

Чистые функции с общей работой можно объединять; независимые можно вызывать
отдельно и компоновать. Не вводить обязательный монолитный presenter или новое
API создания presenter. Если props уже готовы и вычислений нет, отдельный
presenter не нужен; компонент остаётся в том же ownership/event контракте.

Раннюю идею mutable state внутри presenter и прежнее разрешение mutable logical
UI-state в компоненте заменить явно, а не оставить рядом как противоречащие исключения.

### Inputs, validation and missing data

Presenter получает данные по явному контракту приложения и явный context.
Сохранить TS-TYPES-001 и прежнюю границу FRONTEND-ARCH-002: unknown external
responses проверяются до доверенного typed state на application/transport boundary,
а не в presenter. DOM value — payload, не доказательство доменной валидности:
строка draft может быть допустимым входом action/state, но не автоматически
валидным доменным значением. Проверка бизнес-ограничений и error actions остаются
в предусмотренных контрактом FC/application местах. Не создавать общий validator API.

Loading/empty/error, null/отсутствие данных допустимы только как явные варианты
state contract, которые presenter отображает предсказуемо. Malformed response,
неизвестный shape или отсутствующий обязательный вход не скрываются assertions,
неоговорёнными defaults или вторым store; ошибка/отсутствующая готовность отражается
в приложении и verification report. Presenter не объявляется validator произвольных
данных. Tests/examples различают корректный empty/error state и непроверенный payload.

### Ready values and condition syntax

Это bounded policy для выбранного контракта, не запрет синтаксиса framework.
Положительные и отрицательные примеры должны различать контекст выражения:

| Контекст | Допустимо | Требует переноса/изменения |
| --- | --- | --- |
| Вывод значения | `{viewState.title}`, готовый prop, поле готового row | Formatting, mapping, фильтрация и domain/presentation decisions в компоненте |
| If/else-if | `{#if isLoaded}`, `{#if viewState.isLoaded}` с готовым boolean | Object/data truthiness, сравнение, `&&`/`\|\|`, тернарное выражение, negation, function call в condition |
| Список | Итерация готового массива, чтение полей/готового стабильного ключа | Inline filter/sort/map или вычисление доступности/представления элемента |
| Read-only reactivity | Feature selection, alias/чтение готового поля, вызов pure presenter | Presentation calculation, записанная inline в component `$derived`, override derived как mutable UI-state |
| Event payload | Передать стабильный payload (`event.currentTarget.value`, checked, id row); DOM event остаётся в UI plumbing | Преобразовать/нормализовать бизнес-данные, выбрать action по business state, dispatch chain |

Обычный else допустим. Boolean переменная должна быть готовым результатом
presenter либо готовым входным prop; простое имя не доказывает происхождение.
Переименование локального сравнения в `isLoaded` не делает его допустимым.
Вычисления сравнения/negation/fallback выполняются в pure presenter, где они
нужны для представления; domain decisions остаются в reducer.

```svelte
<!-- Allowed binding shape; use the project's actual APIs -->
<script lang="ts">
  const user = $derived(root.state.user);
  const viewState = $derived(presentUser(user));
</script>
{#if viewState.isLoaded}
  <h2>{viewState.title}</h2>
{/if}
```

```svelte
<!-- Policy violations even though Svelte syntax may accept them -->
{#if status !== 'loading' && data}...{/if}
{#if !viewState.isLoading}...{/if}
```

Реализация предоставит complete typed examples, в том числе anti-example
локального `$derived` со сравнением под готовым именем. При сомнении в типе/
происхождении входа требуется проследить источник и явно оставить непроверенное;
не объявлять helper чистым или boolean готовым только по имени.

### One intent and browser plumbing

Для логического feature/UI-намерения компонентная граница передаёт один action. Например,
submit передаёт SubmitAction; reducer решает, какой request/следующий state/effect
нужен. Условия выбора OneAction/TwoAction и несколько dispatch для одного workflow
не прячутся в UI helper. Прямое изменение feature/root state или two-way binding
к нему в обход dispatch недопустимы; ready value + event → intent сохраняет ввод.

DOM/event plumbing — preventDefault, передача event payload, focus/selection,
элементные refs, lifecycle/подключение стороннего widget — остаётся в component/
adapter в пределах браузерной механики. Refs/handles и внутренний state shell
не являются вторым owner логического UI-state. Widget callbacks передают intent;
их бизнес-выбор и доменное состояние не прячутся во внутреннем widget model.
Показать пары valid/invalid, включая focus-only plumbing vs выбор бизнес-action.
Не вводить blanket запрет `$state`/`$derived` по одному имени rune.
Browser-only handler, например focus/text selection без изменения logical state,
может не dispatch-ить ни одного action. Stateless/shared component может передать
intent callback родителю/adapter; один action отправляет соответствующая FC-граница,
а не обязательно каждый промежуточный UI handler.

### Affected representations and adoption

Обновить два frontend документа с сохранением IDs/Status proposed. В
SVELTE-STATE-001 и Svelte README пояснить совмещение с FC/presenter policy, не
навязывая её всем Svelte-проектам. FSD profile/README сохраняет свой scope и
не объявляет presenter обязательным от выбора layer layout; связанный контракт
применяется, только если выбран отдельно.

Inventory/approval tracking отражают пересматриваемые FRONTEND-ARCH-001/002 и
SVELTE-STATE-001 как Pending, с точной revision/source; не удалять rationale
Local-only/API/form topics под предлогом presenter-контракта. Принятие новой
английской редакции и release approval — отдельные owner decisions. Пять пакетов
независимо версионируются; текущие 0.1.0 не меняются на этапе планирования.

### Verification and downstream work

Pure presenter и FC tests проверяют отдельно. FC reducer cases используют
готовые state factories/overrides и проверяют state/effect descriptions.
Реактивное обновление component проверяется отдельно: pure tests и успешная
компиляция не доказывают UI binding или происхождение произвольного helper.

Для documentation-only реализации переиспользовать штатные checks, реальные
packs/внешние consumers и disposable compilation/check предложенных TS/Svelte
примеров. Positive и policy-negative примеры могут одинаково компилироваться;
manual review обязан проверить отличие по контракту. Не добавлять regex tests
формулировок или собственный линтер для доказательства содержания.

[#79](https://github.com/antonsmolko/gost-spec/issues/79) использует согласованный
контракт позже; имя/plugin/version выбираются в его дизайне. В gost-kit
[#15](https://github.com/antonsmolko/gost-kit/issues/15) уже закрыта, это не
доказательство публикации или готовности специальных архитектурных гарантий.
[#6](https://github.com/antonsmolko/gost-kit/issues/6),
[#16](https://github.com/antonsmolko/gost-kit/issues/16),
[#17](https://github.com/antonsmolko/gost-kit/issues/17),
[#18](https://github.com/antonsmolko/gost-kit/issues/18),
[#19](https://github.com/antonsmolko/gost-kit/issues/19) открыты и имеют отдельный
scope. Нельзя обещать автоматическую проверку purity/provenance именованного helper.

## Risks / Trade-offs

- Слишком строгая трактовка запретит необходимую UI binding → examples различают
  selection/presenter call, ready props и browser plumbing от presentation logic.
- Helper скрывает business/presentation calculation → review проходит зависимости,
  входы/выходы, а не принимает идентификатор за доказательство.
- Текст не совпадает с package compatibility или historical #42 → обновить все
  актуальные representations, историю оставить историей; #42 не переоткрывать.
- Новая политика объявлена принятой через зелёные тесты → явно сохранить proposed,
  Pending и отдельные gates #20/#26.

## Migration Plan

Сначала owner review этого плана, затем отдельный apply request. Реализация
представляет один нормативный PR для issue #78 с complete valid/invalid examples и
independent review. Ни consumer source, ни runtime, ни готовые source skills
не меняются. При отклонении текста предложить исправление proposed-документов;
не мигрировать приложения автоматически. Sync/archive #75 выполнен в PR #82; статус доставки проверяется по PR,
это не prerequisite нового плана. Merge/release не следуют из принятия плана.

## Review and issue tracking

Public basis — #78 (comments отсутствовали при discovery), #79 и связанные
gost-kit issues. Исследованы актуальные standards/inventory/approval и исторический
presenter-composition; источники и scope выше. Проверка плана и independent
review будут записаны до создания planning PR. Private input при наличии
маркируется и сопоставляется публичному actionable source.

### Planning verification

Four artifacts complete; implementation 0/6. Strict change and both current main
specs pass; whitespace clean. Baseline npm run check 102/102 on Node 26.11.1,
including real packed documents/external consumers; this checks unchanged current
code, not the unimplemented normative revision or skill #79. Separate Git-tree
audit: 123 Markdown, 196 path links + 3 same-file anchors, 0 errors; path-list
SHA256 448bf01274ef0670faf061fab983c6fd43c251e4b59935b938c35dff0a8dbb56.
No custom source checker, component/runtime or normative package change was made.

### GitHub issue edits

#75/PR #77 record actual merge 31930c4 and retain reviewed-head verification
links. #75 stays open for its separate archive/sync, without extending its
implementation criteria. #78 will receive immutable planning/PR links and 0/6
status after push; #79 remains dependent on agreed #78 and its own later design.
The #15 gost-kit closed state is observed, not inferred publication/readiness.

### Independent planning review

Fresh-context review of all six planning/handoff files checked public #78/#79
(comments absent), historical #42 closure, merged #77/open #75, related kit issue
states, current normative documents/approval gates and baseline source. Two
planning findings were fixed across their affected artifacts and independently
rechecked; no actionable findings remain. Final counts: 7 requirements / 15
scenarios, implementation 0/6. Strict change and whitespace rerun pass; initial
review also verified both main specs and separate 123-file /196-path/3-anchor
audit. No runtime suite rerun by reviewer; this is not readiness of unimplemented
normative examples, future runtime/skill/lint or content acceptance.

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| Independent review: private input, not a public basis; actionable scope [#78 browser/event criteria](https://github.com/antonsmolko/gost-spec/issues/78) | Universal one-action wording conflicted with focus-only browser plumbing | proposal/design/spec/tasks | Fixed; independently closed | Rule now targets logical feature/UI intent at FC boundary; focus/text-selection plumbing permits zero actions, shared UI can forward intent callback |
| Independent review: private input, not a public basis; actionable scope [#78](https://github.com/antonsmolko/gost-spec/issues/78) and [existing TS-TYPES-001](https://github.com/antonsmolko/gost-spec/blob/31930c40818972cecea725a828e9478f6144248f/packages/technologies/typescript/docs/runtime-boundaries.md) | Explicit inputs omitted trust/validation/missing-data contract | design/spec/tasks | Fixed; independently closed | App boundary validates external inputs, raw DOM payload is not valid domain data by assertion, presenter consumes documented state variants without a new validator or hidden recovery |

Independent review now reports no actionable findings. Main normative documents,
all five packages, plugins/catalogs, runtime/checker/tests remain untouched by
this planning result. Owner review of the concrete plan precedes apply.

### PR80 published review

All pages read: 5 reviews with empty bodies, 5 inline findings and 1 public
summary; #78 has no comments. [Summary](https://github.com/antonsmolko/gost-spec/pull/80#issuecomment-6638719710)
confirms the complete six-file planning diff, strict checks, counters, sources
and dependency states without blockers. Prior independently confirmed closures
remain valid. The five minor corrections below do not alter requirements,
gates, applicability or task count: 7 requirements /15 scenarios, 0/6.

#### PR80 R1

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| [Task coverage](https://github.com/antonsmolko/gost-spec/pull/80#discussion_r4471602572) | Task 1.2 omitted explicit browser-plumbing examples | tasks.md 1.2 | Fixed | Example list now includes valid/invalid focus-only zero-action handler, refs/lifecycle/widget wiring, hidden business selection/logical state ownership. This restates existing spec/design coverage without a new obligation |

#### PR80 R2

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| [Issue/PR identity](https://github.com/antonsmolko/gost-spec/pull/80#discussion_r4471602874) | PR #78 wording misidentified an issue | design Migration Plan | Fixed | Now says one normative PR for issue #78; no existing/future PR number assumed |

#### PR80 R3

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| [Repeated word](https://github.com/antonsmolko/gost-spec/pull/80#discussion_r4471603086) | Duplicated plan wording inherited in handoff | handoff PR76 sentence | Fixed | Removed second plan word; delivery/commit/history unchanged |

#### PR80 R4

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| [Typo](https://github.com/antonsmolko/gost-spec/pull/80#discussion_r4471603323) | revison misspelling | design adoption section | Fixed | Corrected to revision/source |

#### PR80 R5

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| [Prefix spelling](https://github.com/antonsmolko/gost-spec/pull/80#discussion_r4471603570) | Handoff omitted prefix brackets | handoff #78 | Fixed | Prefix shown as [gost-spec-78], consistent with committed proposal/actual commits |

These are task-list/wording/typo corrections against unchanged spec/design
requirements. No contract or gate changes, new normative content or runtime code;
AGENTS review rule 6 allows this wording-only round without another independent
review. Existing independent planning review and public verification remain
recorded with their limits. Full final six-file diff and unchanged requirement/
issue criteria were rechecked; no conflicting active wording remains.

#### PR80 review issue edits

#78 acceptance criteria/dependencies stay unchanged. Its planning status and
PR80 description receive the review-fix commit and canonical R1–R5 links, still
0/6 and no normative acceptance. Each inline/summary reply points to this ledger.

PR80 round verification: strict change and both main specs pass; whitespace
clean; final tracked-tree audit remains 123 Markdown /196 path links /3 same-file
anchors /0 errors, same path-list hash. Fresh npm run check passes 102/102 on
Node26.11.1 including real packs/external consumers. Proposal/spec/schema are
byte-identical to planning commit 589b01f; only the task-list omission, wording
corrections and this ledger changed. No runtime tests added for prose fixes.

## Implementation evidence

Owner authorized merge/apply after published planning review. PR #80 merged at
4b5361a324160b3e607ba04655a9812d9dbd5af3; implementation branch
feature/gost-spec-78-component-presenter-implementation, prefix gost-spec-78.
Task1.1 replaces the two proposed frontend documents with the agreed ownership,
ready-rendering, intent/browser and validated-input boundaries. Existing IDs,
required levels and proposed status retained. Manual trace against all seven
requirements/fifteen scenarios confirms textual coverage, with scoped stateless
and browser-only exceptions. Complete synthetic code examples are being checked
under task1.2; no claim of automated architecture/provenance validation.

Tasks1.2/2.1 verification: both complete TS modules and six Svelte components
were extracted from the new normative documents into a disposable consumer.
TypeScript and svelte-check report 0 errors/0 warnings; Vite production build
passes, including policy-negative BadView/BadEditor/BadBrowser. Each negative construct was
manually classified (truthiness/condition/derived/formatting/local store/business
selection/dispatch chain); successful syntax is not policy approval. MCP
autofixer checked all six; BrowserInput had two advisory attachment alternatives
for bind:this; BadBrowser had one equivalent advisory. These were retained deliberately to demonstrate valid refs, not correctness
defects. No automatic architecture/provenance checker added.

Pure probes checked eight status/collection variants, presenter composition,
frozen inputs and factory-built editor action transitions with preserved root
neighbours. Separate Chromium probe executed the exact three positive published
components in a temporary harness with real common/svelte 0.1.0 artifacts built
from isolated public source fbf8a518, Svelte5.57.2. It verified eight reactive
view variants, one action per logical event, draft through FC, zero-action focus,
widget callback and lifecycle cleanup, with no page errors. Vite strictPort at
4190 prevents silent server reuse. Artifacts/source/probes remain disposable;
no real app/widget vendor integration is claimed. Raw unknown responses were not
validated by these examples: their application contract/TS-TYPES-001 boundary
was reviewed separately; no payload validator is provided or promised.

Svelte/FSD compatibility was reviewed as four separate selection cases: standalone
Svelte derived rule, combined read-only binding, combined invalid inline
presentation calculation, combined invalid logical-state writes. FSD retains
its import directions and never implicitly selects a presenter/state library.

Task2.2 tracking: frontend/Svelte/FSD READMEs/changelogs align with the two
frontend rules, inventory adds narrow proposed ownership and retains the original
Local-only/API/form pending row/rationale. Approval tracking adds Pending rows for
FRONTEND-ARCH-001/SVELTE-STATE-001 and revises existing FRONTEND-ARCH-002 source,
without an acceptance decision. Product design/roadmap/handoff point to #78 and
dependent #79. #78 current progress 4/6, #79 dependency checkpoint only, PR #80
body records actual merge; criteria/dependencies unchanged. #79 exclusion in
task3.1 refers to implementation, not the dependency metadata required by 2.2.

Changesets 3.0.3 add --empty created lazy-snakes-type.md under the existing
unreleased-proposed policy, without version preparation or release. All five
0.1.0 identities and lock unchanged. First offline verification install used an
unavailable svelte-check pin and failed before useful checks; corrected to the
existing fixture's 4.7.7 and pinned toolchain, no repo dependency change. Earlier
failed attempts are not counted as evidence. No code-text regex tests added.


### Final audit — task3.1

Fresh full npm run check passes 102/102 on Node26.11.1 and26.0.0, including
real package packing/external consumers. All five tarballs were additionally
inspected: core11/frontend6/Svelte5/TypeScript9/FSD5 entries; packed Markdown
matches source bytes and no internal review/config/OpenSpec directories enter
packages. Strict change and both main specs pass; changeset status has no bumps,
whitespace clean. Versions/lock/runtime/plugins/scripts/tests unchanged.

Separate complete staged diff inspection and search of unchanged TS-TYPES-001,
README selection policy, state/effect contracts and public #78/#79 bodies found
no conflicting active obligations. Manual classification covers all six complete
components, including three intentionally syntax-valid policy-negative examples;
pure, type/build and Chromium evidence remain distinct. Markdown audit covers
124 files,206 local path links,3 same-file anchors,0 errors; path-list SHA256
`db09aaf144514da115617444916e454394f2a57f4c40e62150ac029c2dd0e290`.
No claim of automated architecture enforcement, generic validation or real app
migration. Task3.1 complete; independent complete-result review remains task3.2.

### Implementation GitHub issue edits

#78 current-status section records PR80's actual merge, implementation progress
and separated verification evidence. Original criteria, dependencies and owner
approval gates are preserved; historical planning/review records stay historical.
#79 receives only a dependency checkpoint: #78 normative review/decision pending,
no skill implementation or preselected distribution. PR80's description records
its actual merge. Public actionable source for implementation/review is
[#78](https://github.com/antonsmolko/gost-spec/issues/78), not private samples.

### Independent implementation review

Fresh-context separate reviewer inspected the complete nineteen-file result,
all seven requirements/fifteen scenarios, eight published code examples and
relevant unchanged contracts. Sources read: public [#78](https://github.com/antonsmolko/gost-spec/issues/78),
[#79](https://github.com/antonsmolko/gost-spec/issues/79), all PR80 inline
findings/replies and summary reviews; previous confirmed closures retained.
Reviewer found no actionable findings. Private agent input is not a public
basis; actionable requirements are the linked issues and committed spec/design.

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| Separate agent review (private input, not a public basis); public #78 requirements above | Complete-result consistency check | All nineteen implementation files / #78 | No actionable findings | Independently matched all eight extracted examples, ran pure probes and TS/Svelte checks, inspected five actual packs, whitespace and both 102/102 suite logs; checked unchanged contracts, proposed/Pending and package boundaries |

Reviewer inspected browser/link evidence without rerunning Chromium/full suite.
Author reran Chromium successfully after final audit. Synthetic checks do not
prove arbitrary helper purity, unknown-data validation, actual vendor widget
integration or migration. Implementation [PR #81](https://github.com/antonsmolko/gost-spec/pull/81) presents
the complete outcome; task3.2 complete,6/6. Merge, normative acceptance, sync/archive
and release retain separate decisions.

Final tracking: #78 current status and PR81 description updated to6/6 with
canonical evidence; original criteria/Pending gates preserved. #79 dependency
checkpoint remains unimplemented. This final bookkeeping changes no contract.

### PR81 published review

Read every page of PR81 inline comments, summary reviews and PR/issue78
comments at reviewed head `3edc7eb`; four inline findings and two summary
findings. Empty reviews contain no additional findings. Public summary:
[verification](https://github.com/antonsmolko/gost-spec/pull/81#pullrequestreview-5775208324).
Prior reviewer-confirmed planning/implementation closures remain valid.

#### PR81 R1

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| [Idle wording](https://github.com/antonsmolko/gost-spec/pull/81#discussion_r4472865280) | Ready initial message conflates ready values with ready status | presenter-composition.md | Fixed | Else explicitly renders the initial Not requested message for idle |

#### PR81 R2

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| [Classification](https://github.com/antonsmolko/gost-spec/pull/81#discussion_r4472868627) | Verification names only two negative components | presenter-composition.md | Fixed | Names BadView, BadEditor and BadBrowser; readonly state property does not make nested fields immutable |

#### PR81 R3

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| [Effect representation](https://github.com/antonsmolko/gost-spec/pull/81#discussion_r4472868855) | Plain reducer/no-effects type is not explicitly distinguished from library handler API | state-ownership.md | Fixed | Explicitly labels plain reducer and never-array/empty-array as illustrative no-effects representation; integration uses actual reducer/state/action/effect contracts. Code unchanged; existing recipe distinguishes define.reducer handlers from reducing normalization |

#### PR81 R4

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| [Inventory](https://github.com/antonsmolko/gost-spec/pull/81#discussion_r4472869024) | Svelte compatibility ID lacks navigable inventory row | requirements-inventory.md | Fixed | New Svelte technology row links existing SVELTE-STATE-001 with unchanged applicability/verification; approval remains Pending |

#### PR81 R5

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| [Summary item1](https://github.com/antonsmolko/gost-spec/pull/81#pullrequestreview-5775208324) | Proposal names planning branch as current | proposal.md | Fixed | Historical planning base/branch explicitly labelled; implementation branch and main4b5361a given |

#### PR81 R6

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| [Summary item2](https://github.com/antonsmolko/gost-spec/pull/81#pullrequestreview-5775208324) | PR-body relative ledger anchor resolves against main before merge | PR81 description | Fixed | Replaced with full commit-pinned blob URL; final round link uses its pushed review-fix commit |

These corrections clarify existing wording, classification and navigation; no
contract/gate or code change. Under AGENTS rule6 this wording/link-only round
needs no new independent review; existing independent result retained. The full
final PR diff and unchanged contracts/issue bodies were checked separately from
runtime tests. No conflicting active wording found; all six findings addressed.
Tasks remain6/6 and proposed/Pending/package versions unchanged.

#### PR81 review GitHub issue edits

#78 gets only the review-fix revision and canonical dispositions link; criteria,
dependencies and content gate unchanged. #79 dependency stays unchanged. PR81
body links to committed evidence. Each inline finding and summary receives a
reply linking its ledger entry, with no unrecorded disposition.

Round verification: fresh npm run check102/102 on Node26.11.1, including
real packs/external consumers; strict change/both main specs and whitespace pass.
All eight code fences byte-identical to reviewed head; prior two-Node/type/pure/
Chromium evidence remains applicable without reruns for unchanged code. Separate
final tracked-tree link audit:124 Markdown/207 path links/3 anchors/0 errors,
same path-list hash as task3.1. The extra path link is the Svelte inventory row.

Archive checkpoint 2026-11-05: #75 синхронизирован и перенесён в
[архив](../2026-11-04-add-functional-core-skill/design.md) через
[PR #82](https://github.com/antonsmolko/gost-spec/pull/82); фактический статус
доставки проверяется по PR. Sync/archive #78 пока не выполнялся.


## Archive and spec sync — 2026-11-05

Owner explicitly selected synchronization and archival. All artifacts complete,
tasks6/6, implementation PR81 merged at82eda95; archive base is main d4ea4ac
with #75 archive delivered by PR82. New main frontend-component-presentation
spec copies Purpose and seven requirements/fifteen scenarios verbatim except
canonical H1 and Requirements header. No other main spec, normative document,
plugin/runtime/package version or acceptance/release gate changes.

Change moved to2026-11-05-clarify-component-presenter-contract with metadata,
proposal/tasks/delta preserved; relative links in moved artifacts and incoming
repository links are rebased. Earlier statements in archived artifacts describe
their dated planning/implementation stages, including historical pending archive
and issue status, not current delivery. Handoff/roadmap/product overview expose
the main spec and archive; #79 remains unimplemented and gets its own plan.

### Archive GitHub issue edits and delivery procedure

#78 current status links the archive PR and evidence, stays open until verified
archive delivery; #79 dependency checkpoint reflects the same state. #75 is
already closed after PR82/main d4ea4ac. Original issue criteria/dependencies and
proposed/Pending unchanged. On a separately owner-authorized archive merge,
verify actual main SHA, update #78/#79 public checkpoints and close #78; do not
close #79, accept content, create tags or publish. Tracked archive references
use stable PR delivery links once available, without unconditional pending claims
that become false at merge. No direct main commits are part of that procedure.

### Archive verification

Full npm run check102/102 on Node26.11.1 and26.0.0, including actual package
packs/external consumers. Strict main specs4/4 and whitespace pass. Exact
comparison confirms new main equals the complete delta with canonical title/
header normalization, including Purpose. Metadata/delta byte-identical;
proposal/tasks differ only in the required sibling-archive link rebase. All
three previous main specs and runtime/plugin/package/test/fixture scope unchanged.
Separate full diff/unchanged-contract inspection and tracked Markdown audit:
126 files,217 local path links,3 same-file anchors,0 errors. Path-list SHA256:
`baa37a8b4afea17d86cc272a1f4e8463c8c28a7aec078f86d678025043b39a9c`.
Reproduce the path-list hash from a reviewed commit at repository root:

```sh
node --input-type=module <<'NODE'
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
const paths = execFileSync('git', ['ls-tree', '-r', '--name-only', '-z', 'HEAD'], { encoding: 'utf8' })
  .split('\0').filter(Boolean).filter(path => path.endsWith('.md')).sort();
const separator = String.fromCharCode(0x0a);
console.log(paths.length, createHash('sha256').update(paths.join(separator) + separator, 'utf8').digest('hex'));
NODE
```

This selects all tracked .md paths, JavaScript default sort, UTF-8 and a final LF.
It hashes paths only, not document content or link results. Archived historical
runtime/browser evidence is retained, not rerun as new archive behaviour. The
previously disclosed unfinished #71 planning change still lacks deltas and is
outside this archive; strict main-spec validation does not claim strict-all success.

### Independent archive review

Separate fresh-context reviewer examined the complete archive diff against
d4ea4ac, public #75/#78/#79 and PR81/82 states, all PR81 inline findings/replies
and summary, preserving confirmed R1–R6 closures. No actionable findings.
Reviewer independently confirmed exact normalized main7/15, metadata/delta byte
identity, tasks6/6, #75 sibling-link rebase and absence of old active-path links.
Unchanged frontend/Svelte/FSD/validation/inventory/approval contracts retain scope
and proposed/Pending. Both102/102 logs and126/217/3/0 audit inspected; runtime/
browser checks not rerun. Public issue updates follow actual PR creation.

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| Separate agent (private input, not a public basis); public [#78](https://github.com/antonsmolko/gost-spec/issues/78) completed scope | Complete sync/archive result | Full archive diff / #78 | No actionable findings | Independent exact-transfer and cross-document review above; supplied suite/link evidence inspected with stated limits |

Archive presented in [PR83](https://github.com/antonsmolko/gost-spec/pull/83).
#78/#79 public current checkpoints updated with its URL/evidence and separate
merge/closure procedure. Both issues remain open; #79 unimplemented. Current
handoff/roadmap/product overview link PR83 without predicting its merge state.
