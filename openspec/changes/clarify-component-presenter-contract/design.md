# Design

## Context

Scope — [#78](https://github.com/antonsmolko/gost-spec/issues/78), мотивация —
[proposal](proposal.md). Owner уже перечислил критерии и уточнил read-only
`$derived`, state ownership и один intent action. План не вводит новый runtime.

База main `31930c40818972cecea725a828e9478f6144248f` содержит skill FC после
PR #77: application effects отдельно, unit reducer tests используют state factories.
Архив/sync #75 pending и не меняет порядок #78 → #79.

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
| If/else-if | `{#if isLoaded}`, `{#if viewState.isLoaded}` с готовым boolean | Object/data truthiness, сравнение, `&&`/`||`, тернарное выражение, negation, function call в condition |
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
SVELTE-STATE-001 как Pending, с точной revison/source; не удалять rationale
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
представляет один нормативный PR #78 с complete valid/invalid examples и
independent review. Ни consumer source, ни runtime, ни готовые source skills
не меняются. При отклонении текста предложить исправление proposed-документов;
не мигрировать приложения автоматически. Sync/archive #75 — отдельный pending
учёт, не prerequisite нового плана. Merge/release не следуют из принятия плана.

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
