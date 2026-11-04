# Design

## Context

Scope — [#75](https://github.com/antonsmolko/gost-spec/issues/75), мотивация —
[proposal](proposal.md). База — merged PR #74, main `82f9d7c`; #70 закрыта.
Owner выбрал отдельный `gost-functional-core` в общем marketplace, English content.
Это новый outcome на `feature/gost-spec-75-functional-core-skill`, prefix
`[gost-spec-75]`; layout #71 и scripts/tests #62/#63 не являются prerequisites.

Наблюдаемое состояние: один готовый shell plugin с bootstrap skill, один
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

Все четыре planning artifacts готовы; implementation остаётся 0/7. Strict change
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
