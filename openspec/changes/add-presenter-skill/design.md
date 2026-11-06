# Design

## Context

[Задача #79](https://github.com/antonsmolko/gost-spec/issues/79) — skill разработки
presenters. Назначение описано в [proposal](proposal.md), поведение — в
[spec](specs/component-presentation-development/spec.md). План вмержен PR84,
реализация 6/6 на базе main `2add3a850768fd4c559c3751a72890ab09594046`.

В репозитории уже есть два плагина, общий маркетплейс Codex/Claude и проверка
поставки. Для нового skill достаточно добавить ещё одну запись и сохранить
проверки существующих плагинов.

## Goals / Non-Goals

**Результат:** skill помогает вынести вычисления представления из компонента,
написать чистые функции, проверить их результаты и подключить к отображению.
Первый рабочий пример и проверка UI — Svelte 5. Функции пишутся на TypeScript.

**Границы:** изменяются запрошенные вычисления и их привязка к компоненту.
Источники данных, зависимости, состояние и обработка событий проекта сохраняются.
Выпуск, применение к asc-admin и отдельные работы #71/#62/#63 требуют своих задач.

## Decisions

### Presenter

Presenter принимает данные и контекст, например locale, и возвращает значения
для отображения: текст, признаки видимости, строки списка. При одинаковых входах
результат одинаковый; входные данные остаются неизменными. Побочные эффекты
выполняются за пределами presenter.

Связанные вычисления удобно объединять, когда у них есть общая промежуточная
работа. Независимые presenters получают только нужные им данные и могут вызываться
одним компонентом. Presenter не вызывает другие presenters. Входы передаются
именованным объектом, тип результата объявляется явно. Компонент использует готовые
значения и вызывает presenter через принятую в проекте реактивную привязку.
Если компонент уже получает всё готовым, дополнительная функция ему не нужна.

### Примеры и расположение файлов

В `plugins/gost-view-presenter/skills/gost-view-presenter/SKILL.md` будет краткий
порядок работы. Перед реализацией агент читает
`references/view-presenter.md` — полный пример с пояснениями:

1. Исходный компонент: форматирование названий, расчёт признаков отображения,
   подготовка списка.
2. `catalog.presenter.ts`: независимая подготовка строк и связанных признаков
   loading/empty/error/success и строк списка в одном `catalogPresenter`.
3. `catalog.presenter.test.ts`: входные данные, ожидаемые результаты, nullable
   варианты, сохранность входов и полный `ViewState`.
4. `Catalog.svelte`: вызов presenter в реактивной привязке, отображение готовых
   значений, boolean-условия и список.
5. Небольшой компонент с готовыми props как пример, где выделять нечего.

Полный рабочий пример размещается в `fixtures/view-presenter/`.
Короткое имя fixture выбрано по предмету примера — view presenter; имя capability
описывает весь workflow разработки. Пути согласованы во всех артефактах. Presenter и его
unit-тест находятся рядом. Отдельные браузерные проверки меняют входные данные,
проверяют текст/ветки/строки и вызывают существующий callback. Пример использует
обычные props и данные. Инструкция в reference и проверяемый пример согласуются;
код из reference проверяется компилятором и тестами.

Примеры используют synthetic catalog data. Отдельно разбираются ошибки:
мутация входов, скрытые зависимости, вычисления в компоненте под готовым именем
и однократный snapshot, переставший обновляться. Компиляция такого примера
и его архитектурная оценка — разные проверки.

### Входные данные и проверка результата

Агент читает существующий компонент, типы props/context, функции подготовки
данных и команды проверки. Уточняет ожидаемое отображение. Отсутствующий
обязательный вход или неопределённое поведение указывает до зависимых изменений.

Presenter обрабатывает состояния, предусмотренные входным контрактом, включая
nullable/loading/empty/error/success. Проверка внешних данных остаётся на
существующей границе приложения. Обязательные данные не подменяются догадками,
casts или случайными defaults.

Проверки выполняются на двух уровнях:

- Unit-тесты вызывают обычные функции и сравнивают результат с ожиданием,
  проверяют полный результат и неизменность входов.
- Проверки компонента подтверждают обновление представления при изменении
  данных и сохранность существующих событий.

Отчёт перечисляет изменённые файлы, фактические проверки и оставшиеся проблемы.
Поддержка других UI-фреймворков подтверждается собственными примерами. Доступные
проектные lint-команды используются вместе с ручной проверкой вычислений.

### Источники рекомендаций

Чистые функции и готовые данные описаны в
[FRONTEND-ARCH-002](../../../packages/domains/frontend/architecture/presenter-composition.md)
и [контракте #78](../../specs/frontend-component-presentation/spec.md).
В recipe будет полный pinned GitHub URL на FRONTEND-ARCH-002 из main f0a936c,
с revision/status и точными разделами о вычислениях и отображении. Проверенная
копия той же ревизии также подходит. При недоступном источнике агент указывает,
какие рекомендации остались непроверенными.

Внутренний reference поставляется вместе со skill. Нормативные ссылки остаются
ссылками на исходные документы, recipe объясняет применение на примере.
Proposed-статус сохраняется. Правила состояния и событий из более широкого
контракта #78 применяются согласно уже выбранной архитектуре проекта;
сам presenter работает с переданными данными.

### Плагин и проверка поставки

Выбран отдельный `gost-view-presenter` версии 0.1.0 unreleased в маркетплейсе
`gost`. Он содержит English skill/reference, два manifests, README, changelog,
license и icon. Имя, версия и дерево совпадают для обоих харнесов. Существующие
shell/FC plugins и пять npm-пакетов сохраняют своё содержимое и версии.

Checker расширяется третьим конкретным descriptor. Проверки охватывают
пропущенные/дублирующиеся entries, identity/version, источник, JSON, ссылки,
symlinks, границы plugin root и прежний root-skills guard. Сначала подтверждается
отказ на повреждённой поставке, затем весь набор regression checks проходит.

В isolated Codex/Claude profiles проверяются отдельная установка, соседство
с другими плагинами, повтор, fresh discovery/read reference и совпадение всех
installed bytes с выбранным Git snapshot. Личные настройки и synthetic app
сравниваются до/после. Используется существующий release-tag workflow:
`gost-view-presenter-v<version>` выбирает snapshot маркетплейса.
Loopback-проверка помечается отдельно от публичной установки; настоящий выпуск
следует отдельному разрешению на проверенный main commit.

### Проверка skill на задачах

До написания skill выполняется тот же запрос в disposable consumer: наблюдается
baseline и отказ probes на отсутствующих/неверных вычислениях. Успешный baseline
фиксируется как успешный.

После подготовки skill независимый агент выполняет выделение, создание,
изменение и повторную задачу, проверяет простой компонент и отсутствующий
обязательный input/source. Оценка опирается на generated files, unit/browser
results и сохранность соседних файлов. Формат SKILL.md проверяется отдельно.
Непроверенный харнес, failing checks или missing inputs остаются видимыми
ограничениями результата.

### Базовые инструменты

- [Agent Skills specification](https://agentskills.io/specification),
  [OpenAI packaging](https://developers.openai.com/plugins/build/plugins),
  [Claude marketplaces](https://code.claude.com/docs/en/plugin-marketplaces).
- Maintained example: [официальный Anthropic catalog, snapshot a2e251d](https://github.com/anthropics/claude-plugins-official/blob/a2e251d9b97b909bf728b3e84fc8d17e6aba0063/.claude-plugin/marketplace.json).
  Новый plugin использует уже поддерживаемые local sources.
- [Vite Svelte TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-svelte-ts)
  и [Svelte testing guidance](https://svelte.dev/docs/svelte/testing) задают основу
  fixture. Из существующей fixture переиспользуется проверенная toolchain:
  Svelte5.57.2, TypeScript5.9.3, svelte-check4.7.7, Vite8.3.5,
  plugin-svelte7.3.1, Playwright1.64.1. Доступность проверяется при apply.

## Risks / Trade-offs

- Unit-тесты могут пропустить устаревшее отображение — для него есть отдельные
  браузерные проверки изменения входов.
- Установленный skill может потерять доступ к нормативному источнику —
  используются pinned source или проверенная копия, missing evidence указывается.
- Третий plugin может нарушить поставку прежних — сохраняются regression checks
  и сравнение содержимого двух прежних плагинов.

## Migration Plan

После review плана начинается отдельный apply. Готовый plugin устанавливается
из выбранного snapshot. Его установка и удаление сохраняют приложение;
перерегистрация marketplace описывает последствия для остальных entries.
Merge, принятие нормативного содержания, archive и выпуск — отдельные действия.

## Review and issue tracking

Публичный scope — [#79](https://github.com/antonsmolko/gost-spec/issues/79),
план — [PR #84](https://github.com/antonsmolko/gost-spec/pull/84). #75/#78 завершены
и закрыты. Все четыре artifacts готовы; текущая реализация 6/6.

### GitHub issue edits

В #79 зафиксированы выбранное имя, отдельная поставка, English content,
назначение presenter, примеры и критерии проверки. Уточнение владельца заменило
раннюю обязательную привязку к FC; это изменение границ записано здесь для
согласования истории задачи. Выбор был private input, not a public basis;
публичная actionable source — обновлённая #79. Текущая редакция излагает назначение и ожидаемый результат;
история согласования остаётся в этом разделе.

### Initial planning verification — superseded by editorial round

All four planning artifacts complete; implementation0/6, seven proposed
requirements/fifteen scenarios. Strict change and all four main specs pass;
whitespace clean. Fresh unchanged-runtime baseline npm run check102/102 on
Node 26.11.1, including real packs/external consumers; no new skill/native/browser
readiness is claimed. Separate complete staged diff and unchanged source/issue
criteria inspection:130 tracked Markdown,226 path links,3 same-file anchors,
zero errors. Path-list SHA256
`1eeb6c0e7a8f5785bf93fff210f6fd80f6ad213b6ef986d1e25b55570672c2ac`:
Git ls-tree -r --name-only -z on reviewed tree; select .md, JavaScript default
sort, join with LF and final LF, UTF-8 SHA256. Link counts use marked18.1.1
lexer/walkTokens, exclude code examples/URI/absolute targets, validate tracked
local targets and heading anchors. The known unfinished #71 change is outside
scope; strict main specs do not imply strict-all success.

### Independent planning review

Fresh-context separate reviewer examined all eight changed files, seven
requirements/fifteen scenarios and six tasks, unchanged #78 contracts, catalogs
and fixture baseline. Public #79 freshly read (no comments); #75/#78 closed,
PR83/main f0a936c verified. No actionable findings: pure/no-FC scope, existing
source/events, pinned external rules, independent delivery/evaluation gates and
0/6 consistent. Reviewer did not independently rerun runtime/link scripts.

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| Separate agent (private input, not a public basis); actionable public [#79](https://github.com/antonsmolko/gost-spec/issues/79) | Complete planning result against corrected pure scope | All eight planning/tracking files | No actionable findings | Fresh-context contract/criteria/dependency review above; author verification separate, implementation not performed |

Planning outcome presented in [PR84](https://github.com/antonsmolko/gost-spec/pull/84).
#79 current title/criteria record pure FC-independent scope and chosen identity;
its planning checkpoint links this complete committed design/review record.
All artifacts complete, implementation0/6. No apply/skill/runtime/merge/release.


### Editorial round — purpose and examples

Owner requested direct purpose-first wording across the full plan and asked for
example locations. Public actionable scope/criteria: [#79](https://github.com/antonsmolko/gost-spec/issues/79).
Proposal, design, spec, tasks, handoff/product overview/roadmap, issue and PR
now describe preparing view data, pure tests and component use. Context about
previous FC scope stays only in issue-edit history. Full before/presenter/test/
after reference and working Svelte fixture are specified, with colocated unit
tests and separate browser checks. Same7 requirements/15 scenarios,0/6 tasks.

Fresh strict change/main specs and whitespace pass; unchanged-runtime baseline
check102/102 Node 26.11.1 passes. Separate latest Markdown audit130/229/3/0,
same path-list hash as initial verification. The initial226-link result above
is historical. Complete final diff and current #79 criteria checked separately;
plugins/packages/main specs/runtime/fixtures unchanged.

Fresh-context independent review of the complete revised plan found no actionable
findings, including scope preservation and explicit examples. Reviewer read public
#79, #75/#78 closed states and PR84 discussions (no published findings), compared
main/previous plan; did not rerun runtime/link scripts.

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| Separate agent (private input, not a public basis); public #79 criteria above | Purpose-first rewrite and example coverage | Entire planning/tracking result | No actionable findings | Independent full-result comparison; counts7/15 and0/6 preserved, author checks separate |

On publication, #79 and PR84 descriptions/pinned evidence point to the complete
correction revision. No implementation, normative acceptance, merge or release performed.

### PR84 published review

Read all pages of inline threads, summary review and PR/issue comments at7b40de2,
including the reviewer's staged editorial snapshot. Public sources:
[summary](https://github.com/antonsmolko/gost-spec/pull/84#issuecomment-6669209451),
[review](https://github.com/antonsmolko/gost-spec/pull/84#pullrequestreview-5791995042).
Prior counters/source/scope closures retained. Seven findings addressed below.

#### PR84 R1

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| [Roadmap delivery](https://github.com/antonsmolko/gost-spec/pull/84#discussion_r4485966087) | PR83 lookup wording less precise than verified delivery | roadmap | Fixed | Records merged PR83/main f0a936c and closed #78 |

#### PR84 R2

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| [Product delivery](https://github.com/antonsmolko/gost-spec/pull/84#discussion_r4485966103) | Product overview retains PR83 status lookup | product design | Fixed | Same known delivered/closed state as handoff |

#### PR84 R3

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| [Contract traceability](https://github.com/antonsmolko/gost-spec/pull/84#discussion_r4485966113) | Editorial simplification obscures explicit implementation boundaries | delta requirements1/5/7 | Fixed | Explicitly excludes adding state infrastructure for presenter, new lint rules/configs, duplicated normative rules or widened source applicability. Purpose stays direct and positive; props/data scenario and dependency preservation remain |

#### PR84 R4

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| [Summary item1](https://github.com/antonsmolko/gost-spec/pull/84#issuecomment-6669209451) | PR body/pin still describes pre-editorial226-link result | PR84/#79/evidence | Fixed | Published body/evidence pin updated to complete correction revision,229-link audit; pre-editorial evidence explicitly historical |

#### PR84 R5

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| [Summary item2](https://github.com/antonsmolko/gost-spec/pull/84#issuecomment-6669209451) | Heading lacks preceding blank line | design | Fixed | Blank line added before initial verification heading |

#### PR84 R6

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| [Summary item3](https://github.com/antonsmolko/gost-spec/pull/84#issuecomment-6669209451) | Fixture path differs from capability-name pattern | fixture path in plan | Retained with rationale | view-presenter names the subject of the example; capability names the wider workflow. All paths consistent; rationale recorded in examples section |

#### PR84 R7

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| [Summary item4](https://github.com/antonsmolko/gost-spec/pull/84#issuecomment-6669209451) | Awkward explanation of current prose/history | design | Fixed | Says current text states purpose/result, history remains in issue-edit section |

### PR84 review issue edits

#79 and PR84 descriptions state purpose, examples and verification concisely;
pinned evidence points at this complete revision. #79 criteria, examples and
separate implementation/approval gates remain consistent. Replies link each
finding to this ledger; no implementation work performed, counts7/15 and0/6.

PR84 round verification: fresh baseline npm run check102/102 Node 26.11.1,
strict change/four main specs and whitespace pass. Separate final Markdown
audit130/229/3/0; same path-list hash. Complete final diff and unchanged main
contracts/current #79 criteria reviewed for conflicts. Existing independent
editorial review retained; this review round restores explicit wording for
already-agreed boundaries and updates status/links, not scope or gates. Runtime,
plugin/package/fixture/main-spec files unchanged, implementation0/6.

## Implementation evidence

Initial implementation evidence at PR85 head `1eb123d`; the naming, parameter
shape and presenter-calling convention are superseded by the review round below.
Original evaluation/native results are historical for that earlier tree.

Owner authorized merge/apply; PR84 merged main `2add3a8`. Branch
feature/gost-spec-79-view-presenter-implementation, prefix `[gost-spec-79]`.
Earlier planning/review verification above is historical. All 6/6 tasks complete after independent review and presentation in PR85.

- Pure RED: module absent, test fails ERR_MODULE_NOT_FOUND. GREEN: 10 ordinary
  tests cover seven static status/list variants, nullable/blank labels, explicit
  context, frozen inputs, composition and determinism. Reference has six complete
  blocks byte-identical to fixture; tests colocated with presenter. Svelte checks
  report 0 errors/warnings, production build succeeds; all four components checked
  with upstream MCP autofixer without issues/suggestions.
- Client: two Chromium probes run both extracted/original components through
  idle/loading/empty/rows/changed rows/error/null-error and Refresh/Activate.
  A disposable one-time-snapshot mutation fails the same reactive probe;
  occupied-port probe confirms rejection before tests (reuseExistingServer:false).
- Baseline agent without skill succeeded (13 tests, types/build, 2 browser cases);
  not reported as an agent failure. Separate skill-assisted agent read installed
  Codex skill and verified source f0a936c, produced actual code in disposable
  consumer: 12 tests, types/build, 2 browser cases. Separate label-update copy passes
  live context change and 3 browser cases; repeat keeps source hashes unchanged,
  ready-only component preserved. Missing-date/context/source case records an
  actual incomplete response; 13 source hashes unchanged, no timezone/default
  invented. This constrained case verifies missing-input handling, not new date logic.
- Distribution RED: absent third manifest and checker accepts missing third tree;
  after one descriptor/local entries, 56 tests pass including missing/mismatched/
  duplicated presenter and cross-plugin links. Diagnostics assertions were aligned
  to existing wording, no diagnostic contract changed. Old plugins and npm trees
  unchanged. Skill format validator passes in temporary PyYAML environment.
- Native: Codex 0.166.0 / Claude 2.1.308, fresh temporary CODEX_HOME/CLAUDE_CONFIG_DIR,
  no credential copies or config resets. Final disposable snapshot `43e30033a04ae8c3bb92d148ac054d02df7ebf5e`,
  fixture tag gost-view-presenter-v0.1.0, full smart-HTTP Git URL
  http://127.0.0.1:4193/cgi-bin/git/final.git. Both README command forms install
  presenter alone/repeat, then shell/FC alongside. New Codex app-server
  initialize→skills/list(forceReload) discovers one presenter alone and three
  native plugin skills together; config hash unchanged across discovery. Claude
  fresh plugin details reports exactly one presenter skill alone/together;
  inventory confirms 0.1.0. All 8 files of all 3 plugins match source in both
  profiles; personal config/registry and synthetic-app fingerprints unchanged.
  Initial dumb-HTTP source cannot support Claude shallow clone; corrected to
  standard git-http-backend CGI in disposable environment. Unsupported details
  --json flag was removed per CLI help. These setup failures are not readiness
  evidence. No public-host install, model invocation, real release/tag or app
  migration is claimed; reference/installed files and generated code are separate.

Evaluation requests/commands/results and before/after source checks are retained
in disposable artifacts under /tmp/gost79-apply (not distributed/private input,
not a public basis). Public actionable scope remains #79 and this committed
synthetic fixture/reference. No code-text regex quality tests or new lint rules.

### Implementation GitHub issue edits

#79 current status links implementation progress/evidence and eventual PR;
criteria retain pure presenter scope, concrete examples and separate approvals.
PR84 records actual merge. Handoff/product overview/roadmap/root README expose
the third skill; published plugin README contains consumer usage and verification
limits, not internal issue/review tracking. #75/#78 remain closed; #79 stays open
for review and later separately requested sync/archive.

Final integration audit before independent review: full 114/114 on both Node 26.0.0
and 26.11.1; strict change/all four main specs and whitespace pass. All five
actual document tarballs inspected (11/6/5/9/5 entries, Markdown exact and no
internal directories). Full 36-file diff and relevant unchanged standards/issue
contracts inspected separately from tests. Markdown 135/239 path links/3 anchors/
0 errors; path-list SHA256 `17abdbeea72cf3063ab081afd4b4b02a87018972bd78eef9fa076acab2ea7d37`
(method as initial verification: sorted tracked .md paths with LF). Existing
plugins/npm files and main specs unchanged. #79 current progress 5/6 and PR84
actual merge updated publicly; implementation PR/review is the remaining task.

### Independent implementation review

Fresh-context reviewer inspected the complete 36-file result, specs/tasks, current
public #79/PR84 and retained R1–R7 closures. No actionable findings. Independently
ran full 114/114 Node 26.11.1, distribution 56/56, strict change/four main specs and
whitespace; copied fixture externally and reproduced pure 10, types: 0 warnings,
build/browser: 2, four clean MCP checks and six exact reference blocks. Native
profiles/install/byte/fingerprint evidence and lower-Node log inspected rather
than fully rerun; no public release/app migration claim.

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| Separate agent (private input, not a public basis); actionable public [#79](https://github.com/antonsmolko/gost-spec/issues/79) | Complete implementation/contract consistency | All 36 implementation files | No actionable findings | Independent reruns and limits above; current issue status rechecked |

Implementation PR presentation completes task 3.1; its merge, later sync/archive,
normative acceptance and release retain separate owner decisions.


Implementation presented in [PR85](https://github.com/antonsmolko/gost-spec/pull/85),
all 6/6 tasks complete. #79 and PR85 current status/pinned evidence point to this
complete revision. Issue remains open for review/later sync/archive; merge and
release still separate. Final status update changes no code or contract.

## PR85 published review

Read all pages of inline threads, summary reviews, PR comments and issue79
comments at `1eb123d`. Twelve inline comments, including the owner's API/nesting
requests, plus the [summary review](https://github.com/antonsmolko/gost-spec/pull/85#pullrequestreview-5805140235).
Prior verified behaviour/installation closures remain historical; changed API and
instruction are reverified below. Public #79 records the clarified convention.

### PR85 R1–R2 — presenter names

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| [Rows name](https://github.com/antonsmolko/gost-spec/pull/85#discussion_r4496184167), [status name](https://github.com/antonsmolko/gost-spec/pull/85#discussion_r4496186947) | Use namePresenter naming | fixture/reference/skill | Superseded in the full example by owner's selected single presenter | The example exports catalogPresenter only; rows/status helper-presenters were removed. Skill records namePresenter naming and independent component-level calls |

### PR85 R3 — named inputs and explicit output

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| [Named parameters](https://github.com/antonsmolko/gost-spec/pull/85#discussion_r4496192451) | Named Params object and explicit ViewState | presenter/tests/reference/skill/spec | Fixed | catalogPresenter({ input, labels }): ViewState; API test first failed missing named export, then all 10 behaviour cases pass |

### PR85 R4 — reactive call

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| [Component call](https://github.com/antonsmolko/gost-spec/pull/85#discussion_r4496198055) | Invoke new API in derived binding | Catalog.svelte/reference | Fixed | $derived(catalogPresenter({ input, labels })); types/build and both browser scenarios pass |

### PR85 R5 — prepare the initial task

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| [Overwrite instruction](https://github.com/antonsmolko/gost-spec/pull/85#discussion_r4496209692) | Replacement wording ambiguous | fixture README | Fixed | Explicitly overwrite Catalog.svelte contents from BeforeCatalog.svelte; remove only the presenter module, preserving App import |

### PR85 R6–R10 — readable evidence and commands

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| [Evidence](https://github.com/antonsmolko/gost-spec/pull/85#discussion_r4496209710), [roadmap](https://github.com/antonsmolko/gost-spec/pull/85#discussion_r4496209725), [handoff](https://github.com/antonsmolko/gost-spec/pull/85#discussion_r4496209743), [fixture](https://github.com/antonsmolko/gost-spec/pull/85#discussion_r4496209750), [reference](https://github.com/antonsmolko/gost-spec/pull/85#discussion_r4496209755) | Words/numbers/revisions lack spaces | Five linked documents | Fixed | Restored Node/version/count spacing and code formatting for hashes across implementation evidence; commands and source facts unchanged |

### PR85 R11 — changelog format

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| [Changelog](https://github.com/antonsmolko/gost-spec/pull/85#discussion_r4496209762) | Match existing plugin entry style | new plugin CHANGELOG | Fixed | Bulleted version entry, same 0.1.0 unreleased |

### PR85 R12 — independent presenters

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| [No nested presenters](https://github.com/antonsmolko/gost-spec/pull/85#discussion_r4496228809) | Presenter must not call another presenter | skill/reference/fixture/#79/delta/design/tasks/overview | Fixed | Component may call several independent presenters; full example uses one catalogPresenter that directly prepares all fields. Current composition wording replaced, earlier evaluations labelled historical |

The existing #78 source permits broader function composition; this skill's
selected convention is narrower. Its applicability is explicit in the recipe;
main specs/npm normative documents and their proposed status are unchanged.
No runtime library/API or other feature outcome added.

### PR85 review GitHub issue edits

#79 criteria now state named inputs, explicit result and independent component
calls, with no presenter-to-presenter calls. PR85 description and pinned evidence
will identify the final corrected revision and current results. Inline replies
and the summary point to these dispositions. Merge/release remain separate.

Review-round evidence: fresh full check 114/114 on Node 26.0.0 and 26.11.1;
unit tests 10/10, external fixture Svelte/TypeScript 0 errors/warnings, build and
both Chromium routes pass. Six reference blocks exactly match checked source;
Svelte MCP autofixer clean. A new independent application of the installed skill
produced the named-parameter/typed-result API and direct calculations, passed
10 tests/types/build/browser 2 and repeated without source changes. It preserved
input/probes/package/ReadyLabel hashes. It did not exercise live label changes
or every nullable/status combination in browser; pure probes cover explicit
label context and additional status variants.

Fresh native snapshot `d34766ac9f119ac9f245ae61a4026a73c74655fa` with a tag only
inside the disposable fixture repository was installed from
http://127.0.0.1:4194/cgi-bin/git/review.git. Codex 0.167.0 / Claude 2.1.308:
alone, repeat and coexistence with the other two plugins, fresh skills/list and
plugin details, all 8 files of all 3 plugins byte-identical in both profiles.
Personal config/registry and synthetic-app fingerprints unchanged. Native config
was not rewritten for discovery. This is loopback installation/inventory, not
public-host release or a model invocation. Old native/evaluation evidence above
is preserved as historical, not used to certify the changed installed content.

#79 live examples/unit criteria also replace old composition wording with
independent presenters and complete ViewState, matching the clarified criterion.

Independent fresh-context review of the complete result and correction found no
open findings. Reviewer read all public PR85 threads/reviews and current #79,
confirmed stale composition wording fixed, reran 10 tests, exact six-block
comparison, Svelte autofixer and whitespace. Full-suite/browser/build/native/
evaluator results were inspected rather than fully rerun. Old closures retained;
current contract/scope/release gates consistent.

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| Separate agent (private input, not a public basis); public #79 and R12 above | Old composition wording in live issue examples/tests | #79 | Fixed and independently confirmed | Replaced by independent component calls and complete ViewState |

Final round audit: full 114/114 on both supported Nodes, strict change/four main
specs, whitespace and Markdown 135/239/3/0 pass; same path-list hash as original
implementation. Full final diff and relevant unchanged contracts/issue bodies
checked separately from runtime tests. Existing plugins/npm trees and main specs
unchanged. Code changes are the presenter API/example requested by this review;
all 6/6 tasks remain complete, merge and release are separate.
