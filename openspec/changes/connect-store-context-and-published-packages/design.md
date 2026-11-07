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

Прочитаны все страницы inline threads/replies, три review с пустыми summary bodies
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
