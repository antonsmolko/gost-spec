# Design

## Context

[#87](https://github.com/antonsmolko/gost-spec/issues/87), [proposal](proposal.md).
Текущие SKILL.md/foundation.md допускают context, но пример хранит его в app/state;
compatibility — development commit с версиями 0.0.0. Baseline fixture намеренно
не содержит FC/shell: интеграция проверяется во внешней disposable-копии.
Текущий FSD-профиль требует явных исключений для нестандартных зависимостей.

Registry metadata 2026-11-07 подтверждают наличие common@0.2.1 и svelte@0.1.1:
engines обоих ^26.0.0; зависимость shell common ^0.2.0, Svelte peer ^5.57.2.
Это кандидаты, а не уже проверенная runtime-связка. Источник метаданных —
`npm view` для точных версий. При apply записать integrity и фактически
установленное дерево; проверить public declarations из опубликованных артефактов.

Upstream baseline: [typed Svelte context](https://svelte.dev/docs/svelte/context),
[createContext](https://svelte.dev/docs/svelte/svelte#createContext),
[Vite Svelte TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-svelte-ts),
[Svelte browser testing](https://svelte.dev/docs/svelte/testing#End-to-end-tests-with-Playwright).
Context обеспечивает передачу экземпляра; это не новая store-библиотека.
[FSD layers](https://feature-sliced.design/docs/reference/layers) — источник
обычного направления импортов; согласованная схема ниже является адаптацией.

## Goals / Non-Goals

**Goals:** проверенная published baseline, полный типизированный store через
context, воспроизводимый пример импортов и браузерная проверка экземпляров.

**Non-Goals:** смена архитектуры всех Svelte-проектов, новые интерфейсы доступа
для каждой фичи, бизнес-миграция, API mapper/reset/routing/persistence из соседних
задач. Пять нормативных пакетов и proposed/Pending статусы сохраняются.

## Decisions

### Один store и отдельный публичный context

Согласованный вариант: src/store содержит rootState/rootReducer, effector,
конструирование и context; src/app выполняет bootstrap и устанавливает provider.
Бизнес-компонент получает `const store = useStore()` при инициализации,
читает полный store.state и использует общий dispatch. Выбор state в UI сохраняет
реактивное чтение getter; однократное destructuring state недопустимо.

Конкретный пример разделит store/core.ts (композиция), store/create-store.ts
(фабрика), store/context.ts (useStore/provideStore), store/index.ts (публичный
accessor). Context использует createContext и тип Store, полученный из корневых
контрактов через import type; runtime не импортирует фабрику или UI. Bootstrap
импортирует фабрику и provider напрямую. Публичный accessor не реэкспортирует
фабрику, reducers или feature UI. Композиция импортирует только core entrypoints
бизнес-модулей. Граф проверяется по фактическим imports, включая aliases.
Это предложенные имена файлов примера, не обязательная миграция потребителя.

Shared UI получает props/callbacks. RootState с составом фич остаётся в store;
перенос в shared и any/casts не используются для обхода типов. Обычные бизнес-
компоненты получают полный контракт: изоляция обеспечивается соглашением импортов,
а не узкими портами.

Альтернативы рассмотрены владельцем: context в app вызывает upward imports;
узкие feature interfaces добавляют невыбранную абстракцию; общий singleton
мешает изоляции экземпляров. Существующее совместимое подключение сохраняется:
skill проверяет его и не переподключает принудительно.

### Пустая интеграция и отдельный probe

Основной результат подключения остаётся пустым store с never actions/effects.
Синтетические два state slices и компоненты-потребители вводятся в отдельной
копии для демонстрации композиции, полного доступа и проверки поведения.
Factory создаёт новый store на root instance, модуль context хранит ключ,
а не глобальное бизнес-состояние. Без provider accessor сообщает ошибку;
никакого fallback singleton. Поддерживается client SPA, не SSR-контракт.

Во внешней копии: published packages, consumer checks/build, браузерная цепочка
UI → action → reducer → UI и effect → result action. Два потомка одного provider
проверяют общий экземпляр; два root instances — независимость. Отдельно missing
provider, повторное применение без второго store и сохранение legacy greeting.
Occupied port policy `reuseExistingServer: false` сохраняется. Recipe snippets
должны соответствовать проверенному коду; прошлые development evidence остаются
историей, не подтверждением новой связки.

### Поставка и очередь

Apply обновляет только shell skill/reference и потребительские инструкции,
fixture/evaluation и согласованные metadata/changelog. Изменённое содержимое
получает следующую версию shell plugin 0.2.1 unreleased в обоих manifests;
остальные plugins и пять npm-версий сохраняются. Native discovery проверяется
для нового содержимого в изолированных профилях обоих harnesses; installation
из public host и релизный tag требуют отдельной проверки/решения.

[Таблица очереди](../../../docs/architecture/2026-11-07-asc-admin-readiness.md)
хранит статусы обеих сессий и ссылки на evidence. GitHub open не означает,
что сторонняя сессия уже начала реализацию. В этой ветке prefix [gost-spec-87].
Таблица — внутренний учёт согласованной очереди #88, не новый runtime outcome.

## Risks / Trade-offs

- Полный store связывает компоненты с root contract → явная применимость,
  публичный accessor и проверка отсутствия runtime cycles.
- Registry metadata не доказывают работу → install/check/build/browser из
  точных опубликованных артефактов. При несовместимых engines/peers или недоступном
  пакете dependent integration incomplete, без скрытого upgrade потребителя.
- Baseline среды и нового пакета могут различаться → опубликованные пакеты
  требуют Node 26; отдельно проверить среду реального потребителя перед установкой.
- Новая skill revision не обновляет asc-admin → release/update и применение
  остаются отдельными действиями. Бизнес-код asc-admin сюда не переносится.

## Migration Plan

План описывает будущий apply; сейчас skill/fixture/версии не меняются.
После проверок и независимого review — отдельная доставка PR. Merge, archive,
нормативное принятие и выпуск разрешаются отдельно. Rollback skill выполняется
переустановкой предыдущего проверенного snapshot; ранее изменённое приложение
откатывается отдельно через его version control.

## GitHub issue edits

#87 уточняется с учётом выбранной модульной адаптации вместо строгого FSD;
исходные критерии context/артефактов и границы сохранены. #88 получает ссылку на
таблицу по запросу владельца держать очередь рядом со статусами. Scope/closure
#88 не расширяются реализацией #87. Canonical planning/review evidence — этот
файл; результаты apply добавляются только после реальных проверок.

## Planning verification and independent review

Проверка плана на 2026-11-07: 4/4 artifacts, реализация тогда 0/6.
Текущее выполнение — в таблице очереди. Strict change и все 5 main specs проходят;
full npm run check 114/114 на Node 26.11.1, whitespace чист. Проверка ссылок
отдельна от runtime suite: 141 tracked Markdown, 255 локальных ссылок, 0 ошибок
(marked link/image tokens, без code/URI, проверка путей и heading anchors).
Полный staged diff — только planning/tracking; skill, plugins, fixture, пакеты
и main specs не менялись. Это не runtime-сертификация опубликованной связки.

Независимый reviewer получил артефакты и требования без рабочей переписки,
прочитал полный diff, действующие skill/reference/fixture/FSD и public #87/#88,
#89, gost-kit #35/#34. No material findings. Самостоятельно проверены strict
change, main specs 5/5 и whitespace; full-suite/link evidence проверены по логам.
Полные bodies gost-kit #32/#33 недоступны reviewer из-за TLS timeout; open
state/title #33 проверены. Native/runtime compatibility не запускались при review
плана. Короткие последующие правки статуса/evidence не меняют контракт.

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| Separate agent (private input, not a public basis), paired with public [#87](https://github.com/antonsmolko/gost-spec/issues/87) requirements | Complete planning consistency | Nine-file plan/tracking diff | No material findings | Independent checks and limits above |

## PR90 published review

Прочитаны все страницы inline threads/replies, три первоначальных review с пустыми summary bodies
и [итоговый комментарий](https://github.com/antonsmolko/gost-spec/pull/90#issuecomment-6711924229).
Замечания относятся к wording/tracking; требования дельты и шесть задач реализации
сохранены. Предыдущие verified dispositions не переоткрываются.

### PR90 R1 — dated handoff

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| [Handoff date](https://github.com/antonsmolko/gost-spec/pull/90#discussion_r4503404277) | New checkpoint had no date below historical stamp | Session handoff | Fixed | Snapshot explicitly dated 2026-11-07; old date remains historical; current execution points to readiness table |

### PR90 R2 — one current execution counter

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| [Repeated progress](https://github.com/antonsmolko/gost-spec/pull/90#discussion_r4503405236) | Volatile status duplicated in overview documents | Roadmap/product design/handoff, public gost-spec #87/#88 and PR90 | Fixed | Overviews and current GitHub presentation point to readiness table; dated planning verification retains historical task count |

### PR90 R3 — bookkeeping scope

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| [Proposal scope](https://github.com/antonsmolko/gost-spec/pull/90#discussion_r4503405826) | Internal queue listed as capability behaviour | proposal/design/tasks | Fixed | Queue moved to Impact as carrier bookkeeping; task 3.2 still updates evidence/tracking, not a new capability requirement |

### PR90 review GitHub issue edits and verification

Current gost-spec #87/#88/PR90 wording uses the readiness table for execution status.
Public pinned evidence points to this corrected ledger; gost-spec #88 retains
its own scope and links the same queue. All inline and summary replies point to
R1–R3 here. This is wording/link-only, so a second independent contract review
is not required by AGENTS.md section 6.

Complete final diff and relevant unchanged spec/task/skill and issue boundaries
checked separately from tests. Strict change/main specs, whitespace and Markdown
path/anchor audit pass. Runtime/full-suite result above remains the planning
baseline, not a rerun for editorial corrections. No implementation or release.

## Implementation evidence — published baseline

PR90 доставлен main `aaf21f4bd25cb8092550990454483aa29e808e01`; apply на
feature/gost-spec-87-shell-context-implementation. Исходный full check 114/114.
Pre-flight: task1 артефакты → task2 imports/types; task2 content → task3 metadata/
discovery; interfaces совпадают, изменений контракта плана не требуется.

Task 1.1: внешний npm install точных published common@0.2.1/svelte@0.1.1,
Svelte 5.57.2, Node 26.11.1, TS 5.9.3, Vite 8.3.5. Public declarations проверены;
пустой store/context реально собраны bundler. Consumer check: 0 errors/warnings,
build pass, Chromium legacy 1/1. Это отдельная внешняя копия, не workspace import.
Исходный baseline fixture в репозитории не получает бизнес-состояния.

Контроль без skill: агент разместил Root contracts в shared/store, composition
в app. Check/build/legacy прошли, но при добавлении реальных slices shared должен
был бы знать состав приложения; это наблюдаемая причина нового recipe.
Probe RED: без подключения отсутствуют два context-потребителя; браузерная
проверка shared state падает. После подключения два slices, effect/result,
изоляция roots и missing provider проходят. Первые диагностические output
элементы probe конфликтовали с legacy getByRole(status); заменены на span,
legacy source/assertions сохранены. Нет изменения библиотечного runtime.

### Context, forward evaluation and native installation

Tasks 2.1–2.3: обновлены English skill/reference и baseline instructions.
10 fenced source blocks побайтово совпадают с проверенными empty/probe modules;
Svelte autofixer для трёх probe components: issues/suggestions пусты. Validator
skill-creator: valid (PyYAML только в disposable venv). Обнаружен фиксированный
allowlist одного recipe: probe оставлен в foundation.md, без расширения checker.

Probe: consumer check 0 errors/warnings, build pass, Chromium 5/5: shared
updates, другой root не меняется, effect/result action, missing provider и legacy.
Независимый агент применил skill к чистому SPA и получил отдельный src/store,
пустой результат, check/build и legacy 1/1; дополнительный empty-accessor probe
прошёл 2/2 без page errors, full two-slice probe 5/5. Повтор сохранил все 14
source/config hashes и один factory/provider. Недоступная shell 999.0.0 дала
registry E404/incomplete, без замены и без создания foundation.

Отдельный metadata-only сценарий target Node ^24.0.0 дал incomplete из-за
library engines ^26.0.0; engines/config/dependencies не изменены. Harness был
Node 26: исполнение на Node 24 не заявляется. Первый legacy run независимой
оценки transiently получил visitor вместо Ada; неизменённые повторный run,
финальный repeat и оба probes прошли. Причина не воспроизведена; возможный dev
reload не выдаётся за диагноз. Browser evidence — Vite dev, не preview/SSR.
Исходный greeting и assertions сохранены.

Артефакты registry install (lock integrity):

| Package | Source | Integrity |
| --- | --- | --- |
| @gost-kit/common@0.2.1 | https://registry.npmjs.org/@gost-kit/common/-/common-0.2.1.tgz | sha512-HzWGY9dgaD7lSsyFLlOuLE00pyTX5AOU8e4RukS7mJwNZIoEg5UVryFcLS2DPLN1hq1CblkFyPE6xTHLqNPm/w== |
| @gost-kit/svelte@0.1.1 | https://registry.npmjs.org/@gost-kit/svelte/-/svelte-0.1.1.tgz | sha512-3svjz72GU9h7j3RRfimA4sXjVH5kF/3opeCv9rPHR6l5HmdtFxOaXWtkhFvy81I4jVsP8GM7VQthT3w35Z+QWg== |

Task 3.1: shell plugin 0.2.1 unreleased в двух manifests/changelog/README.
Version expectation RED (0.2.0 ≠ 0.2.1), GREEN и distribution gate проходят.
Codex 0.167.0 / Claude 2.1.308 установили local marketplace snapshot в fresh
CODEX_HOME/CLAUDE_CONFIG_DIR: один shell skill, repeat без дубля, coexistence
с FC/presenter. Все 8 файлов каждого из трёх plugins точны в обоих профилях;
остальные plugin/package/catalog trees побайтово равны main aaf21f4.

Codex initialize → skills/list(forceReload) и plugin/read показывают активный
shell 0.2.1; после coexistence найдены ровно три gost plugin skills. Claude
plugin details: shell 0.2.1, Skills(1), без agents/hooks/MCP. Config hash до/после
Codex discovery совпал; personal config/registry fingerprints сохранены.
Первый plugin/read probe передал directory вместо catalog file; исправление
helper дало успешный результат, это не дефект Codex/плагина. Установка проверена
из local directory snapshot, не public GitHub/release tag и не model invocation.
Публичный release/tag не создавался. Raw logs/source copies — disposable
/tmp/gost87-kvv4Tn; committed recipe и этот ledger фиксируют воспроизводимые
inputs/checks и ограничения.

### Final implementation verification and GitHub issue edits

Независимый reviewer получил полный staged diff и требования без рабочей
переписки: no material findings. Самостоятельно выполнены full npm run check
114/114 (Node 26.11.1, реальные packs/external consumers), strict change/main
specs 5/5, distribution gate/whitespace, external check/build/Chromium 5/5 и
Svelte autofixer. Проверены фактический ациклический граф imports, десять source
blocks, legacy/config bytes и 8 файлов × 3 plugins × 2 профиля. Native discovery
проверено по existing local profiles/evidence, не повторялось reviewer.
Repo-wide link parser reviewer не повторял: прочитал результат 141 Markdown /
260 локальных ссылок / 0 ошибок. Preview/SSR/public-host/model invocation не
проверялись. Ни один исходный бизнес-модуль не перенесён.

Все страницы public gost-spec #87 и PR90 threads/replies/reviews/comments прочитаны;
R1–R3 closures сохранены. Историческая запись PR90 уточняет три первоначальных
review; три empty-body reply reviews также прочитаны, требований они не добавляют.
Таблица очереди обновлена; gost-kit #32–#35 остаются open по свежему API snapshot.
Текущее выполнение публикуется в таблице; #87 фиксирует результат и границы,
доставка представлена [PR #91](https://github.com/antonsmolko/gost-spec/pull/91);
актуальные pinned evidence и таблица связаны с ним через gost-spec #87/#88.

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| Separate agent (private input, not a public basis), public [gost-spec #87](https://github.com/antonsmolko/gost-spec/issues/87) requirements | Complete implementation consistency | Full eleven-file result | No material findings | Independent reruns, exact bytes and limits above |

Task 3.2: полный diff, неизменённые main specs/packages/другие plugins/catalogs,
imports и ссылки проверены отдельно от runtime tests. Shell content version
0.2.1 unreleased, остальные версии сохранены. Merge, sync/archive, принятие
нормативного содержания и выпуск остаются отдельными решениями владельца.

Implementation presentation: [PR #91](https://github.com/antonsmolko/gost-spec/pull/91)
содержит весь результат #87; шесть задач выполнены. Таблица использует стабильную
ссылку доставки, GitHub issue/PR presentation указывает последнюю полную ревизию
ledger. Main specs, нормативные статусы и release gates не менялись; отдельные
merge/archive/release решения не подразумеваются представлением реализации.
