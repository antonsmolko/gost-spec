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

**Non-Goals:** новый store/shell, обязательный Svelte/FSD/file layout, presenter
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
- I/O выполняют effect handlers. Уже имеющийся global handler переиспользуется;
  новый регистрируется только при необходимости фичи, с уникальным владельцем
  effect type. `effecting` использует известные типизированные таблицы с проверкой
  покрытия; consumer не строит новый универсальный effect pipeline.
- `dispatch` commit-ит state до effects и ждёт свои effects/awaited nested
  dispatch, но catches execution errors и не доказывает бизнес-успех. Результат
  моделируется state/result actions. Нет обещания автоматической cancellation,
  rollback effects или защиты от устаревших ответов.

Store/bootstrap и framework bindings не пересоздаются. При отсутствии совместимой
основы интеграция явно incomplete: подключение подходящего shell — отдельная
задача. Типы/пути/DTO mappers подстраиваются под проект; внутренняя конвенция
gost-kit «один тип — один файл» не становится глобальным требованием потребителя.
UI/presenter и соседние бизнес-фичи остаются в их запрошенной области работы.

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
root composition, fake imperative dependency и соседним состоянием. Только
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
