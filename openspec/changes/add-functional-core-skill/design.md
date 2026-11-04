# Design

## Context

Scope — [#75](https://github.com/antonsmolko/gost-spec/issues/75), мотивация —
[proposal](proposal.md). База — merged PR #74, main `82f9d7c`; #70 закрыта.
Owner выбрал отдельный `gost-functional-core` в общем marketplace, English content.
Это новый outcome на `feature/gost-spec-75-functional-core-skill`, prefix
`[gost-spec-75]`; layout #71 и scripts/tests #62/#63 не являются prerequisites.

Baseline на момент планирования: один готовый shell plugin с bootstrap skill, один
single-plugin checker и native каталоги. Shell recipe проверял старые development
artifacts common/svelte 0.0.0; это не доказательство совместимости новых версий.
Новый skill ещё отсутствует. Все пять npm-workspaces остаются прежними.

### Baselines

- [Agent Skills format](https://agentskills.io/specification),
  [OpenAI plugin packaging](https://developers.openai.com/plugins/build/plugins),
  [Claude local marketplace sources](https://code.claude.com/docs/en/plugin-marketplaces).
- Maintained example: [официальный каталог Anthropic, snapshot a2e251d](https://github.com/anthropics/claude-plugins-official/blob/a2e251d9b97b909bf728b3e84fc8d17e6aba0063/.claude-plugin/marketplace.json).
  Используется тот же поддерживаемый local-source способ, что уже проверен в #70.
- Публичный [gost-kit FC API](https://github.com/antonsmolko/gost-kit/tree/fbf8a5182a87fd279ce541edff098d5ec3135e6d/packages/common/src/fc)
  и [сопровождаемый пример](https://github.com/antonsmolko/gost-kit/tree/fbf8a5182a87fd279ce541edff098d5ec3135e6d/examples/functional-core).
  Local clean main совпадает с remote main `fbf8a5182a87fd279ce541edff098d5ec3135e6d`.
  Common metadata — 0.1.0; исходники/тесты прочитаны, публикация и runtime-проверка
  этого artifact в новом consumer на этапе планирования не заявляются.

Конкретная инфраструктурная потребность — добавить второй независимо устанавливаемый
plugin. Повторно проектировать installer, registry или release tool для этого не нужно.

## Goals / Non-Goals

**Goal:** агент получает короткую инструкцию FC-разработки с проверяемым recipe
и реализует запрошенную бизнес-логику внутри существующей композиции.

**Non-Goals:** новый store/shell, обязательный Svelte/FSD layout, presenter
skill, изменение gost-kit, миграция asc-admin, принятие стандартов или настоящий
release/tag. Совместимость не достигается автоматическим upgrade зависимостей.

## Decisions

### Separate skill and plugin

Owner выбрал независимый plugin вместо включения framework-free workflow в
`gost-svelte-shell`. Существующий shell plugin целиком заморожен на его текущем
содержимом и версии 0.2.0 unreleased. Новый plugin — 0.1.0 unreleased; числовое
совпадение с версией common не означает совместимости или общей release-версии.

```text
plugins/gost-functional-core/
  .codex-plugin/plugin.json
  .claude-plugin/plugin.json
  README.md
  CHANGELOG.md
  LICENSE
  assets/icon.png
  skills/gost-functional-core/SKILL.md
  skills/gost-functional-core/references/functional-core.md
```

Восемь файлов повторяют работающую форму поставки. Используем существующие
public GOST icon/license, без symlink и без копирования private consumer source.
Короткий SKILL.md описывает workflow и существенные инварианты, recipe — конкретный
публичный API и маленький проверяемый пример. Новый executable helper не нужен.
Описание маршрутизирует запросы именно к gost-kit FC, а не к любой TypeScript задаче.
Другой skill/harness не является обязательной зависимостью.

### Feature workflow and API constraints

Вход: запрос фичи, project instructions, установленные common metadata/exports,
существующая root composition и её проверки. Typed application data доверены
только после внешней границы; это не runtime validator API payloads. Missing
artifact/export или неподтверждённая совместимость — incomplete зависимых шагов.
Recipe фиксирует реальные tarball/source/version, не обещает registry release.

Основная последовательность: определить feature contracts → реализовать pure
handlers → подключить их к имеющемуся root → проверить transitions/effect flow.
Подтверждённые по исходникам неочевидные правила:

- `define.reducer<FeatureState, FeatureAction, RootEffect, RootState>()` задаёт
  handler table; `reducing(...)` создаёт root reducer с `{ state, effects }`.
  Handler возвращает Draft: state/effects необязательны; предоставленный state
  заменяет соответствующий уровень целиком, это не implicit partial patch.
- Local action type заканчивается `Action`, effect — `Effect`. Routing scope
  выводится через `ScopedActions`; property для `scope(key, handlers)` может
  называться иначе, чем namespace в `reducing`. Root state читается явно через
  аргументы, а не hidden import store. Новые типовые ошибки не закрываются `any`.
- Фича содержит `state.ts`, `action.ts`, `reducer.ts`, `reducer.test.ts` в существующем
  layout. Она не определяет effect types/effector. Reducer описывает уже имеющиеся
  эффекты приложения; receivers API-эффекта преобразуют ответ/`ApiError[]` в root
  actions. Приложение исполняет эффект и dispatch-ит возвращённые actions через
  общий AppEffector/RootEffector. Отсутствующий shared contract/handler — incomplete,
  его проектирование/реализация (включая ApiEffect API) — отдельная задача gost-kit/app.
  Существующий общий обработчик не меняется при реализации фичи.
- `dispatch` commit-ит state до effects и ждёт свои effects/awaited nested
  dispatch, но catches execution errors и не доказывает бизнес-успех. Результат
  моделируется state/result actions. Нет обещания автоматической cancellation,
  rollback effects или защиты от устаревших ответов.

Store/bootstrap и framework bindings не пересоздаются. При отсутствии совместимой
основы интеграция явно incomplete: подключение подходящего shell — отдельная
задача. Типы/пути/DTO mappers подстраиваются под проект; внутренняя конвенция
gost-kit «один тип — один файл» не становится глобальным требованием потребителя.
UI/presenter и соседние бизнес-фичи остаются в их запрошенной области работы.

Reducer — чистый `(state, action) → { state, effects }`. Unit tests используют
готовые root/feature state factories с overrides, без ручной сборки root state.
Независимые сценарии группируются по action/case и проверяют поля state и описания
effects/их параметры. Result actions подаются напрямую с собственным исходным
состоянием, без цепочки из результата другого теста. Dispatch, store и выполнение
effects проверяются отдельно на application boundary. Фабрика нового feature
state поддерживает overrides по фактическому define.state контракту; существующие
root factories переиспользуются/дополняются только в composition point.

### Two entries with existing validation boundaries

Оба `gost` каталога содержат shell и новый FC plugin как отдельные entries;
Codex использует local source object, Claude — relative path string. Нет
cross-plugin dependencies, отдельного same-repository SHA или resolver.
Release prefix нового plugin — `gost-functional-core-v<version>`; тег выбирает
весь marketplace snapshot, а не смешивает произвольные ревизии разных entries.
Версия тега совпадает с manifests/changelog, опубликованный тег не перемещается
и не переиспользуется. Выпуск следует обычному PR/merge и отдельному approval
на проверенный итоговый main commit. Фактические теги и публикация исключены из apply.

Checker сохраняет `checkPluginDistribution(root)` и CLI default/root/exit codes.
Ему нужны два конкретных описания plugin identity и допустимых файлов, один общий
проход catalog integrity и проверка каждого дерева. Это ограниченная адаптация
под текущую потребность, не общий рефакторинг #62 и не новый public configuration API.
Missing/duplicate/unknown catalog identity, source redirect, несовпадение versions,
повреждённый JSON/reference и symlink/escaping/file URI дают read-only diagnostics
с файлом, причиной и идентичностью при необходимости. Non-file external URI
сохраняют прежнее поведение. Каждый reference ограничен своим plugin root,
переход к соседнему plugin не считается допустимым. Root `skills/` guard сохраняется.

### Behavioral evaluation and fixtures

Один `fixtures/functional-core-feature-development/` — plain TypeScript consumer с заданной
root composition, готовыми application API/alert handlers, fake imperative dependency
и соседним состоянием. Synthetic app contract/handler задаются как входы evaluation,
а не определяют универсальный gost-kit ApiEffect; файл общего обработчика заморожен. Только
публичные imports реального packed common artifact из disposable gost-kit copy,
никаких source-path/workspace imports. Svelte/browser для этих проверок не нужны.
Fixture probes имеют явный entry point, не auto-discovered test filename:
root `node --test` не должен запускать их повторно вне подготовленного consumer.
Проверки новых validator branches остаются в существующих integration tests.

До написания SKILL выполнить baseline задачи без него в изолированном consumer,
сохранив наблюдавшееся поведение и ошибки, если они возникнут. Не выдавать успешный
baseline за RED. После написания независимый агент получает тот же реалистичный
запрос и установленный skill без подсказки ожидаемого решения; проверяются реальные
файлы/types/tests. Отдельные cases: создание фичи, её изменение/повтор и missing
artifact/composition. Не проверять качество навыка совпадением текста Markdown.

Native verification — fresh profiles Codex/Claude, полный Git URL выбранного
disposable snapshot, установка FC отдельно и рядом с shell, repeat FC, discovery
и сравнение всех установленных файлов. Installation не применяется к app;
проверяются synthetic files и personal fingerprints, configs не переписываются
перед inventory. Отсутствующий harness/evidence оставляет native readiness incomplete.
Не требуется заново повторять все исторические shell legacy/update сценарии:
старые regression cases сохраняются, shell tree должен остаться идентичным.

## Risks / Trade-offs

- Shell recipe использует более старый common baseline → проверять реальный
  consumer API, не обновлять shell/package версии ради совпадения с примером.
- Package install/format успешен, feature workflow не работает → независимое
  применение skill и consumer behavior checks обязательны отдельно от metadata.
- Второй plugin может нарушить старые gates → сначала RED catalog/content cases,
  затем сохранить все существующие regression cases и full suite.
- Recipe может разрастись → оставить только подтверждённые API детали и один
  пример; новые бизнес/transport/framework политики не вводить.

## Review and tracking

Источники: public #75, merged PR #74/#73, official/upstream baselines выше.
Owner decision об отдельном plugin — private input, not a public basis; публичный
actionable scope фиксируется в #75. Planning artifacts и handoff сообщают
нулевой implementation progress; основная spec меняется только при будущем sync.
При завершении плана #75 получит immutable ссылки и результат independent review.
Merge, release и изменения реального потребителя не следуют из согласования плана.

### Planning verification

Историческая проверка planning PR #76: все четыре artifacts готовы; implementation
на тот момент 0/7. Strict change
validation и обе main specs проходят, staged whitespace чистый. Текущий неизменный
код прошёл `npm run check` 90/90 на Node 26.11.1 с packed artifacts/external
consumers; это baseline, не проверка ещё не созданного skill или нового common
consumer. Отдельный Git-tree audit — 114 Markdown, 180 path links + 2 same-file
anchors, 0 errors; path-list SHA256
`b72de126460f6d935c1ec66e2a583d0428c336b1586a55954bd45886d8d9d1c6`.

Независимое fresh-context review всех семи planning/handoff файлов завершено
без actionable findings. Проверены public #75 (comments отсутствуют), merged
PR #74/#70 status, current specs/checker/catalogs, actual FC API/example на
`fbf8a5182a87fd279ce541edff098d5ec3135e6d`, сохранение прежних native scenarios,
scope/gates, strict/whitespace и 34 локальные ссылки изменённых Markdown без ошибок.
Reviewer не запускал full runtime suite, consumer или native установку.

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| Independent review: private input, not a public basis; actionable scope [#75](https://github.com/antonsmolko/gost-spec/issues/75) | Полнота и согласованность плана | 7 planning/handoff files | Reviewed, no actionable findings | Contracts/API/boundaries и verification tasks согласованы; ограничения review перечислены выше |

### PR 76 review round 1

Прочитаны все страницы reviews, inline threads и PR comments, а также #75 и её
comments: 1 review с пустым body, 1 inline finding, 1 summary, 0 issue comments.
Предыдущие review-confirmed результаты сохранены; новых контрактов или gates нет.

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| [R1 inline](https://github.com/antonsmolko/gost-spec/pull/76#discussion_r4466115621) | Имя fixture сокращено относительно capability | design.md, будущий fixture path | Fixed | План использует `fixtures/functional-core-feature-development/`, соответствующий capability `functional-core-feature-development`; старый путь нигде более не использовался, fixture ещё не создана |
| [Review summary](https://github.com/antonsmolko/gost-spec/pull/76#issuecomment-6627876009), [review](https://github.com/antonsmolko/gost-spec/pull/76#pullrequestreview-5766530518) | Blocking findings отсутствуют; единственное замечание — R1 | Все 7 planning/handoff files | Recorded; R1 fixed | Независимый reviewer воспроизвёл strict validation, counters, links/audit и API/source checks; замечание о локальном untracked directory не относится к PR и не требует изменения |

Это correction имени в плане, без изменения поведения, требований, acceptance
criteria или task count (0/7). По AGENTS.md § Review handling 6 wording-only
исправление не требует ещё одного independent review. Исходный полный независимый
review и его ограничения остаются выше; runtime/plugin/fixture не создаются.

После R1 повторно проверены полный diff PR и остальные artifacts/публичные criteria
#75: других ссылок на прежний fixture path и конфликтующих требований нет.
Strict change и обе main specs проходят; `git diff --check` чистый. Свежий
`npm run check` — 90/90 на Node 26.11.1, включая packed artifacts/external
consumers. Отдельный Git-tree link audit снова дал 114 Markdown, 180 path links
+ 2 same-file anchors и 0 errors; path-list hash прежний. Это проверки текущего
репозитория, а не ещё отсутствующего skill. Новых runtime tests для имени пути нет.

### GitHub issue edits

#75 фиксирует отдельный plugin, outcome и acceptance criteria. Статус дополняется
готовым планом, 0/7, immutable artifact links и результатом review после push.
#70 закрыта merge PR #74; публичные записи #70/PR #74 обновлены фактом merge
`82f9d7c`, без изменения прежних criteria или release gates. Никакие runtime,
каталоги, версии, пакеты или consumer source текущим планом не менялись.
PR #76 review R1 меняет только имя будущей fixture; criteria и статус #75 (0/7)
сохранены. В #75/PR #76 добавляются ссылки на этот ledger и review-fix commit;
изменения outcome, dependencies или approval gates не потребовались.

## Implementation evidence

Первые результаты ниже описывают историческую реализацию до owner correction
в PR #77. Они не подтверждают исправленную границу effect ownership. Актуальные
требования — в Decisions и specs, результаты исправления — в разделе
[PR77 correction](#pr77-correction).

### Task 1.1 — real artifact and baseline

Apply authorized after PR #76 review. Source snapshot gost-kit fbf8a518 copied
with git archive into a disposable directory; offline npm ci and npm pack
produced a real common 0.1.0 tarball. The source repository was not built or
modified. Inspected public types and generated package exports. Framework-free
fixture typechecks with that artifact. Its explicit probe failed first with
“requested staff feature is missing”. A separate no-skill agent then implemented
the quoted synthetic request in an external copy: check and behaviour probes
both passed; author reran them and inspected generated code. This successful
agent baseline is not RED and does not establish an advantage for the skill.
The missing-feature probe is the observed RED.

Initial fixture typing exposed effecting's three generic parameters; the
baseline composition now uses its actual handler-table tuple. No casts or
framework dependency were added. Evaluation raw logs are temporary, not durable
public artifacts; reproduction inputs are in the committed fixture README.

### Tasks 1.2–1.3 — skill and observable feature application

New English SKILL/reference is self-contained. Recipe's complete TypeScript
block compiled against the actual common tarball. Author executed its reducer
on frozen inputs and checked full state, preserved preferences, effect shape,
success/failure through createDispatch and onError collection: passed. Bundled
quick_validate passed in a disposable Python environment (PyYAML was absent
from system Python); no repo tooling dependency was added.

A fresh-context agent, with only the installed skill/reference and a separate
consumer's public package artifacts, implemented the same README request.
Author inspected resulting code and reran check/probe: passed. Agent then added
ClearStaffAction with observed RED→GREEN, checked original probes, and repeated
the original request without edits/duplicate registrations. Source SHA256 after
change and before/after repeat was
`e477b58e61f446e621e3d654fdeebac0b200dba15e20fee1eb9f2d2646837904`;
recipe source and package metadata/lock remained unchanged. Imperative dependency
is typed/trusted; no stale-response protection or concurrency policy is claimed.

Fresh missing-artifact copy: no common in node_modules; TS2307 and dependent
typing errors, no source edit or dependency replacement, explicitly incomplete.
A failed tsc build emitted dist JS; that is not working integration. Fresh
missing-composition copy: no src application, TS18003, no replacement store or
source edits; explicitly incomplete pending original composition/handler inputs.
These are independent behavioural observations, not a claim that Markdown
format or successful baseline proves an improvement over a capable agent.

### Task 2.1 — two concrete distributions

New 8-file plugin 0.1.0 unreleased and both local catalog entries added. Existing
shell tree/version and five npm-workspaces unchanged. Tests ran before checker
changes: a valid two-entry distribution failed under old single-entry logic,
FC metadata/link diagnostics and root-skills case failed. Missing/duplicate/
unknown/redirect cases exist for each catalog; FC version mismatch/cross-plugin
references are checked. After minimal adaptation all 53 distribution tests and
typecheck pass (42 existing + 11 added). Root skill-source prohibition is now
also enforced by the gate, retaining the previous repository assertion.
Checker API/CLI, exit codes, JSON diagnostics, SemVer, required files, URI/file
containment and per-plugin allowlist remain; catalogs are read in one common
pass, each plugin tree checked independently with identity-qualified diagnostics.
README/product design/roadmap point to both independent source skills; no generic
registry, installer/config API or broad #62/#63 refactor was introduced.

### Task 2.2 — native installation and file equality

Codex 0.166.0 / Claude Code 2.1.308, fresh disposable CODEX_HOME and
CLAUDE_CONFIG_DIR, synthetic app cwd. Personal credentials were not copied;
subprocess environment was restricted to system variables and those temporary
profile selectors. HOME was not reassigned. Personal config/registry files and
synthetic app were fingerprinted before/after and unchanged.

Final isolated snapshot `f2228ae` contains the exact two plugin trees and
catalogs. A temporary tag gost-functional-core-v0.1.0 belongs only to this
disposable repository; no gost-spec release/tag was created or moved. Full URL
`http://127.0.0.1:52376/cgi-bin/git/origin-final.git` was served by standard
Python CGI HTTP server plus git-http-backend (temporary wrapper, not product
tooling). First attempt with Python's --directory failed before cloning; running
CGI server with its actual cwd corrected that environment setup. This is not
a harness failure. It does not prove public GitHub hosting availability.

Both harnesses executed the README forms with that URL and fixture tag: FC
installed alone, repeat, install shell alongside, fresh inventories. Codex
app-server initialize → skills/list with forceReload in a new process discovered
one active FC skill alone and both distinct native names when coexisting; skill
and local reference were readable. Config was not reset before inventory and
its hash was unchanged. Claude fresh plugin details parsed exactly one FC skill
both alone and alongside shell; plugin list showed versions 0.1.0 / 0.2.0.
This is local native inventory/discovery, not a model invocation or public-host
proof. All eight files of each installed plugin in both harnesses matched the
selected final snapshot byte-for-byte, with no extra files.

### Task 3.1 — integration checks

Full npm run check: 101/101 on Node 26.11.1 and npm-exec Node 26.0.0, including
real npm document tarballs/external consumers. Strict change and both main specs
pass; whitespace clean. Separate real common tarball has SHA256
`516c0c518aa08655b1fdfc3bf082c2e5ed094f8f9b8b70c857c922f03e453b5c`;
only package metadata/license/changelog and dist are packed, no private inputs
or source workspace imports. Full code/doc diff inspected against reviewed plan,
including unchanged distribution main spec, roadmap and public #75 criteria.
Shell tree/version, all five npm packages/lock and actual asc-admin/gost-kit
sources unchanged. Main spec delta remains for a separately requested sync/archive.
PR #76 is now merged as `6ea9b317e19e7c21f5f155214fb115df7f4f3672` after
GitHub initially returned 502/merge-in-progress; no alternate main push was used.

Separate final tracked-tree Markdown audit: 119 files, 192 path links + 2
same-file anchors, zero errors. Path-list SHA256
`b2c3c72a828886f09027ef68a14f408bf0c0b40e01d0a2fdb0fcce0830a0a7bc`.

### Task 3.2 — independent complete-result review

Fresh-context reviewer inspected complete implementation diff at `0a3db5b`
against approved #75 requirements and main `6ea9b31`, actual API/source, generated
consumers and installed native trees. No actionable findings. Independently
reproduced full 101/101 suite on both supported Node versions, strict change
and both main specs, consumer check/probe and ClearStaffAction behaviour, plus
recipe extracted from HEAD compiled and exercised with frozen inputs, routing,
full replacement and success/failure. Fresh native Codex inventory and Claude
details were read; all 8 files per plugin in each harness matched HEAD.
Separate audit: 119 Markdown / 192 path links / no missing paths; shell/packages/
lock diff empty. Reviewer did not rerun complete historical installation/repeat
or agent missing-input/repeat workflows: those were assessed from existing
evidence and resulting artifacts. Public hosting/release/real app are unverified.

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| Independent implementation review: private input, not a public basis; actionable scope [#75](https://github.com/antonsmolko/gost-spec/issues/75) | Complete-result contracts, behaviour, distribution and scope | Full implementation diff, fixture, new plugin, both catalogs, checker/tests and docs | Reviewed, no actionable findings | Independent checks and exact limits above; original author also inspected generated code and reran consumer/recipe probes |

### Implementation GitHub issue edits

#75's current status was updated to 6/7 with final review pending, while its old
planning status was explicitly marked historical. Acceptance criteria, dependencies
and approval gates were retained. PR #76 body records actual delivery to main
`6ea9b31` and keeps its planning-only scope. Implementation [PR #77](https://github.com/antonsmolko/gost-spec/pull/77) now presents
the single agreed outcome; all 7 tasks are complete after the clean review.
Final #75/PR #77 status records 7/7 and the evidence link. The issue remains open through
review and the separately requested sync/archive workflow. No real tag/release
or consumer action follows from this implementation.

## PR77 correction

Scope remains #75, prefix gost-spec-75, the same feature skill outcome. Owner
clarified the intended architecture in the public thread below and authorized
rewriting the example/instructions. Receiver details and four-file feature
structure from conversation are private input, not a public basis; the public
actionable basis is updated #75 criteria plus the owner thread. No new generic
ApiEffect API, transport, CLI/refactor product or consumer migration is included.

Read all pages: 6 summary reviews with empty bodies, 6 inline comments including
the owner's thread and its independent follow-up, 1 PR summary, 0 #75 comments.
Earlier checks/closures are retained as history; new owner/source evidence
reopens effect ownership despite the earlier clean private review.

### PR77 R1

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| [Owner](https://github.com/antonsmolko/gost-spec/pull/77#discussion_r4466379001), [verification](https://github.com/antonsmolko/gost-spec/pull/77#discussion_r4466495749) | Feature effectors contradict application ownership | SKILL/reference, fixture, proposal/design/spec/tasks, docs/handoff, #75 | Fixed | Feature FC now consists of state/action/reducer/reducer.test; imports existing app contracts, receivers return actions, existing app handler dispatches them. No feature effects/effector or ApiEffect definition/implementation in skill. Missing shared effect/handler is incomplete. Existing app effector preserved byte-for-byte in independent application |

### PR77 R2

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| [Failure path](https://github.com/antonsmolko/gost-spec/pull/77#discussion_r4466500663) | String(error) recipe path conflicts with bare-message fixture assertion | reference, fixture/probe | Fixed | Removed transport/error normalization from the feature example. Receiver passes ApiError[] with code/message/path unchanged; application normalizes externally. Regression tests inspect complete arrays and receiver-returned actions, plus actual shared-handler failure flow |

### PR77 R3

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| [State initializer](https://github.com/antonsmolko/gost-spec/pull/77#discussion_r4466507172) | Factory claim did not show define.state | reference state.ts | Fixed | Example now explicitly calls define.state with a factory returning fresh errors; all four code blocks compiled, colocated reducer test executed |

### PR77 R4

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| [Checker cleanup](https://github.com/antonsmolko/gost-spec/pull/77#discussion_r4466507363) | Duplicated JSON guard and redundant identity diagnostic | scripts/check-plugin-distribution.ts | Declined in this PR | Review confirms correct behaviour on real/adversarial trees; duplicate diagnostics do not hide invalid input. This is optional checker cleanup rather than a feature-skill defect. Approved #75 limits gate adaptation; existing broad refactor #62 owns readability work. No new resolver/API or unapproved task added |

### PR77 R5

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| [Catalog order](https://github.com/antonsmolko/gost-spec/pull/77#discussion_r4466507532) | Tests required positional entries while gate matches names | distribution tests | Fixed | All catalog assertions and mutations select entries by identity. Added a behaviour case reversing both catalogs; gate accepts either order. No new order constraint |

### PR77 R6

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| [PR summary](https://github.com/antonsmolko/gost-spec/pull/77#issuecomment-6628695308) | Shared icon may look accidental | plugin README/icon/LICENSE | Clarified | README explicitly identifies intentional shared GOST branding; native plugin names/descriptions distinguish purpose. Same MIT holder/license is intentional; no unique artwork requirement exists |

### Correction verification

Before instruction changes, a strengthened behaviour probe rejected the previous
generated feature: LoadStaffEffect != ApiEffect. This is observed RED for the
reported ownership defect, separate from the earlier successful no-skill baseline.
Fresh fixture gives a synthetic existing app contract/handler as input; it does
not publish a universal gost-kit ApiEffect contract. Public recipe contains only
four FC files importing given app types, no transport/effector implementation.
All four blocks typechecked against the real common tarball and supplied app
contracts; reducer.test executed with frozen inputs, success/error receivers,
complete state replacement and preserved neighbour state.

An independent agent applied the corrected installed skill to a fresh disposable
consumer: four FC files, app state/action/reducer composition, no effect types or
effector added. Author read generated files and reran check, probe and four
colocated feature tests: passed. Existing app effector SHA256 before/after
`0c499012ecb17b8315f037d4b596a17ffb21020820f8cddf86fa9af1aefc8553`.
A ClearStaffAction change went RED→GREEN; repeating original request preserved
all source hashes and the new action. Missing-handler fresh copy left actual
integration explicitly incomplete (missing app/effector import), with optional
pure feature code/tests passing and no replacement handler/store/adapter.
Previous missing-artifact/composition evidence remains scoped to the unchanged
artifact/bootstrap rule, not the new ownership proof.

Both native harnesses reran alone/repeat/coexistence and fresh inventory/read
in new isolated profiles against exact final 8-file plugin trees in disposable
snapshot `367fb85`, loopback full Git URL on port 52377. The final run uses
origin-current.git and fresh codex-current/claude-current profiles; the earlier
12b693d proof remains historical after the root-integration wording was narrowed. All installed file
sets/bytes match, personal config/registry and synthetic app fingerprints unchanged.
No real repository tag/release or public-host/asc-admin readiness is claimed.
Full check is 102/102 on Node 26.0.0 and 26.11.1, including packed document
artifacts/external consumers; distribution suite is 54/54. Strict change/main
specs and skill format pass. Original package/shell trees and versions unchanged.

### Correction GitHub issue edits

#75 criteria now explicitly require the four FC files, existing app effects/receivers
and unchanged AppEffector/RootEffector; shared infrastructure gaps are incomplete.
The previous blanket directory-convention exclusion is narrowed to outer layout/
FSD/one-type-per-file, preserving the owner's four-file FC instruction.
ApiEffect design/implementation stays separate gost-kit/app work. Current status
marks the previous 7/7 as historical and this correction in progress. PR #77
body/final #75 status and thread replies point to these individual dispositions
after verification. No new outcome/dependency or release gate is introduced.

Separate correction audit: 119 tracked Markdown, 192 path links + 3 same-file
anchors, zero errors; path-list SHA256 remains
`b2c3c72a828886f09027ef68a14f408bf0c0b40e01d0a2fdb0fcce0830a0a7bc`.

### Correction independent review

Fresh-context reviewer inspected the entire PR diff against main including the
latest correction and public #75/PR77 sources. No actionable findings. Independently
reran 102/102 on both Node versions, strict change/main specs, consumer check/probe
and 4 tests, plus extracted four-block recipe check/test. Missing-handler integration
fails TS2307 as expected, with no substitute handler/store; app effector unchanged.
All 8 files per plugin in both native current profiles match the current source,
14 recorded native commands succeed and inventories/fingerprints agree. Link/path
audit and unchanged shell/npm/lock boundaries pass. This reviewer assessed native
install/repeat history, independent agent interactions and historical unavailable-
artifact/composition cases from supplied evidence rather than rerunning all those
workflows. Public hosting, release and real consumer readiness remain unverified.

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| Independent correction review: private input, not a public basis; actionable scope [#75](https://github.com/antonsmolko/gost-spec/issues/75) and [owner thread](https://github.com/antonsmolko/gost-spec/pull/77#discussion_r4466379001) | Complete owner-corrected result including R1–R6 | Full PR diff and staged correction | Reviewed, no actionable findings | Independently reproduced checks/limits above; final task/status bookkeeping introduces no new contract |

All 7 tasks are complete again after the corrected behaviour, native byte proof
and independent review. Final public issue/PR tracking uses 102 tests and the new
commit; individual thread replies link to R1–R6 above. No merge/release is included.

## PR77 factory-based reducer tests

Public [owner review](https://github.com/antonsmolko/gost-spec/pull/77#discussion_r4466695817)
reopens reducer-test guidance. Full private example/conversation is private input,
not a public basis; the public actionable scope is that thread and revised #75
criteria. Only the testing principle is used: no private domain code, URLs, class
names or business rules are copied into the published plugin/fixture.

Sources read across all pages: 12 inline comments (including prior responses),
12 reviews with empty bodies, 2 PR summaries, 0 #75 comments. Earlier R1–R6
dispositions remain as recorded; new evidence changes the reducer test method,
not the previously corrected application ownership or packaging contracts.

### PR77 R7

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| [Owner tests](https://github.com/antonsmolko/gost-spec/pull/77#discussion_r4466695817), public #75 criteria | Reducer tests need existing state factories and independent pure action cases | SKILL/reference, fixture state factory/README, proposal/design/spec/tasks, handoff, #75/PR77 | Fixed | Root/feature factories supply inputs with scenario overrides; describe/action/scenario groups assert returned state/effect descriptions. Result actions are supplied directly, not chained from previous outcomes. Unit tests neither create a store/dispatcher nor execute effects; separate app probe retains integration coverage |

The previous published test was pure but hand-built root state and chained
request/result transitions in one case. Earlier generated unit tests also mixed
in dispatch/application work. Both representations now follow the intended
boundary. Different action classes/method names in the owner's private example
are not requirements; the existing project's actual API/runner is retained.

An additional real behaviour defect was found first: the old recipe's state
factory ignored scenario options, so createUserState({status:'loading'}) returned
idle. Observed RED against the actual compiled previous recipe; after the
factory applied options this check passed, preserving fresh default arrays.
The example imports the existing rootState factory and uses feature-state
factory overrides. All four current blocks compile with real common artifacts;
the grouped reducer.test example passes 12 tests / 6 suites.

Fresh independent skill application in a disposable consumer creates the four
FC files, extends the existing root factory/composition and reuses the app effector.
Author inspected generated sources and reran typecheck, app probe and 7 reducer
unit tests. Unit inputs come from root/feature factories; result actions are
independent; no store/dispatch/effect execution occurs in those unit tests.
App integration and receiver execution remain in the external probe. App effector
SHA256 remains 0c499012ecb17b8315f037d4b596a17ffb21020820f8cddf86fa9af1aefc8553.
This application did not repeat all historical change/missing-input scenarios;
those earlier proofs remain scoped to the unchanged composition/artifact rules.

Both full suites pass 102/102 on Node 26.0.0 and 26.11.1; strict change/main
specs, skill format and whitespace pass. Native verification repeated in fresh
profiles against temporary snapshot 639ef8d and full loopback Git URL on port
52381: alone/repeat/coexistence, fresh inventory/read, all eight files per plugin
match, personal registry/config and synthetic app fingerprints unchanged. No
real release/tag/public-host readiness or real consumer mutation is included.

### Factory-test GitHub issue edits

#75 criteria now explicitly distinguish reducer unit cases built with existing
state factories/overrides from application integration probes. Current status
marks this correction in progress; prior head d4abb39 remains historical for
its previous example. Same outcome/prefix, dependencies and approval gates.
Final issue/PR tracking and public reply point to R7 after the complete-result
review. Sync/archive and release are separate owner-authorized steps.

### Factory-test final verification and review

Separate tracked-tree audit: 119 Markdown, 192 path links + 3 same-file anchors,
zero errors, unchanged path-list hash b2c3c72a828886f09027ef68a14f408bf0c0b40e01d0a2fdb0fcce0830a0a7bc.
Fresh-context independent review of the complete PR diff including R7 found no
actionable findings. Reproduced 102/102 on both supported Node versions, four-
block recipe typecheck and 12 tests/6 suites, factory overrides/fresh arrays/
frozen inputs/neighbours/receivers/direct result actions, generated consumer
typecheck/7 unit tests and separate integration probe. Recipe sources exactly
match the four blocks; TypeScript emission matches executed artifacts. Both
current native profiles contain each plugin's exact 8 files/bytes. Strict
change/main specs, links/anchors, whitespace and unchanged shell/npm/lock pass.

Reviewer assessed historical RED, native interaction history and prior change/
missing-input workflows from supplied evidence rather than rerunning those full
interactions. No public-host install, release or real consumer readiness verified.

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| Independent R7 review: private input, not a public basis; actionable scope [#75](https://github.com/antonsmolko/gost-spec/issues/75) and [owner tests](https://github.com/antonsmolko/gost-spec/pull/77#discussion_r4466695817) | Complete result with factory-built pure reducer unit cases | Full PR diff and R7 correction | Reviewed, no actionable findings | Independently reproduced checks and limits above; R1–R6 dispositions retained |

All 7 tasks complete after R7 verification/review. Final issue/PR status and R7
reply link to this commit's ledger, with 102 full-suite, 12 recipe and 7 generated
unit tests reported separately. No merge/sync/archive/release performed.
