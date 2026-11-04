# План реализации пакетов стандартов

Основание: [#30](https://github.com/antonsmolko/engineering-standards/issues/30), merge [PR #31](https://github.com/antonsmolko/engineering-standards/pull/31), [актуальный дизайн](../specs/2026-10-11-engineering-standards-design.md). Подробные задачи перехода — [OpenSpec tasks](../../../openspec/changes/simplify-project-scope/tasks.md). Новые механизмы будущих работ выбираются в их собственных design/implementation PR.

## Завершённая база

Workspaces, документы/ID, npm-метаданные и tarball/consumer tests созданы ранее. #8 закрепила Node 26 и TypeScript helpers. #9 закрыта после check в PR #29; оставшийся критерий Changesets перенесён в #34 и реализован в PR #38 без реального bump. #30/PR #31 завершили только планирование.

## Последовательность

| Этап | Задача | Независимо проверяемый результат |
| --- | --- | --- |
| Согласование документов/roadmap | #32 | Активные design/plan/handoff/README и задачи соответствуют новому scope; история и gates сохранены |
| Переход к пяти пакетам | #33 | Пять пакетов документов с README и ручным подключением; check и внешние tarball-сценарии проходят |
| Независимые версии | #34 | Штатные Changesets команды и независимые версии/changelog, проверенные на fixtures без реального bump |
| Verification CI | #18 | Проверки/состав артефактов и доступность в consumer подтверждаются CI; fixtures проверяют content gate без публикации |
| Подготовка публикации | #35 | Процесс проверен на synthetic документах без registry writes; конкретная автоматика определяется отдельно |
| Принятие реальных стандартов | #20 | Решения владельца по core/TypeScript/Svelte SPA с ревизиями и evidence; минимум три применимых accepted ID |
| Первый явно одобренный выпуск | #26, отдельный выпуск | Пять реальных артефактов прошли аудит и content gate, опубликованы по конкретному разрешению и проверены из registry |

#20 собирает первый accepted набор постепенно, через конкретные задачи по реальным проблемам. Массовое ревью всех drafts не требуется; нерассмотренные тексты остаются proposed. Кандидаты не предрешают owner decisions, reviewed revisions и отдельные acceptance commits обязательны. Пока нет минимум одного применимого accepted ID из каждой core/TypeScript/Svelte SPA, #20 остаётся открытой. Proposed presenter #42/PR #41 не выполняет этот минимум. Технические #33/#34/#18/#35 завершены; реальный выпуск #26 требует и первого принятого набора, и отдельного approval/audit/registry verification.

## Сохраняемые условия

- Пять существующих имён/путей и независимые версии; private root без общей release-версии.
- Node ^26.0.0, нижняя граница 26.0.0 и закреплённая 26.11.1 проверяются согласно [политике](../../architecture/2026-10-11-session-handoff.md#проверки-и-рабочий-процесс).
- При runtime изменениях: RED → GREEN; перед завершением full suite и реальные artifacts/external consumer. Документальные этапы проверяются на согласованность и ссылки, без имитации runtime-тестов текста.
- Существующие тексты/ID/черновой статус и evidence принятия сохраняются. Content approval, приватность/лицензии и явное разрешение публикации — независимые gates.
- Merge требует явного разрешения. Начало следующего этапа не разрешает выпуск, изменение принятого содержания или редактирование потребителя.
- Установленный пакет применяется целиком; нет механизма выбора ID, resolver, managed files, manifests/schema или собственных release APIs.

## Отложенные работы

#10–#16/#23 закрыты как not planned: прежние CLI/resolver/generation/config/vertical-slice планы сняты с scope, их runtime-возможности не объявляются реализованными. Общие заготовки #24/#25 также закрыты как not planned; frontend/Svelte темы сохранены в inventory и превращаются в задачи только при конкретном use case. #17/#19 ранее заменены проверками #18, подготовкой #35 и выпуском #26; #21/#22 объединены в #20. Подтверждённые closures и исторические review ledgers сохраняются.

Будущие модули, новые технологии и двуязычность требуют отдельной потребности и согласования. Это не обещание реализации CLI после выпуска.

## История

[Прежний подробный план](https://github.com/antonsmolko/engineering-standards/blob/d483438/docs/superpowers/plans/2026-10-11-engineering-standards-independent-packages.md), review-response документы и [план выполненного check](2026-10-13-workspace-checks.md) — исторические свидетельства. Старые номера Tasks и release-engine APIs не задают текущую реализацию.

## Общие TypeScript helpers

Новый proposed TS-COMMON-001 описан в [change](../../../openspec/changes/archive/2026-10-31-reuse-common-types-and-guards/proposal.md).
Это самостоятельное дополнение содержания: переиспользование @gost-kit/common
для явно выбравших эту policy проектов, эквивалентные guard checks и единые
импорты. Организация типов по файлам не навязывается потребителю; Local-only и
прежнее rationale в inventory сохраняются. Нынешний текст pending,
не меняет #20/#26, версии и разрешения выпуска. Review-исправления —
[#52](https://github.com/antonsmolko/gost-spec/issues/52), самостоятельная гигиена
репозитория — [#53](https://github.com/antonsmolko/gost-spec/issues/53); будущие PR
разделяются по этим результатам. Carrier #51 и его критерии не расширяются.

Change #52 архивирован 2026-10-31 с выполненными 6/6 задачами документации и
ревью. Это завершение предложения, а не content acceptance: TS-COMMON-001
остаётся proposed/Pending; OpenSpec-дельт для синхронизации нет.

## Исходный skill подключения fc/shell

Одобренный [OpenSpec change](../../../openspec/changes/archive/2026-10-31-integrate-svelte-spa-state-foundation/proposal.md)
реализован в [#54](https://github.com/antonsmolko/gost-spec/issues/54): один
переносимый skill подключения основы к существующему Svelte 5 SPA, с независимым
synthetic consumer и поведенческой проверкой. Tasks/evidence находятся в change,
отдельный дублирующий план не создаётся. Это не dependency первого нормативного
выпуска пяти пакетов и не реализация их отложенных CLI/config API.

Change архивирован 2026-10-31; основной
[контракт возможности](../../../openspec/specs/svelte-spa-state-foundation/spec.md)
содержит согласованные требования и сценарии без изменения текста.

Упаковка и независимое версионирование выделены в #55 ниже. Применение в
потребителе и план миграции его фич остаются отдельными согласуемыми работами.


## Общий plugin и два маркетплейса — #55

[Change](../../../openspec/changes/archive/2026-11-01-package-state-foundation-plugin/proposal.md)
и [issue #55](https://github.com/antonsmolko/gost-spec/issues/55) поставляют
существующий skill в одном plugin root с независимыми version/changelog и двумя
нативными каталогами. Исторический этап #55 использовал отдельный content pin;
нынешний способ поставки определён в
[#70](https://github.com/antonsmolko/gost-spec/issues/70) и его
[архивном плане](../../../openspec/changes/archive/2026-11-04-simplify-plugin-release-versioning/proposal.md):
оба каталога выбирают локальный plugin tree выбранного snapshot маркетплейса,
пользователь указывает одинаковый релизный тег обоим харнесам. Проверка файлов
работает без `.git` и без будущего тега. Native install/discovery, repeat,
update/rollback и отказы недоступного выпуска проверяются отдельно в disposable
профилях. Реализация #70 доставлена в main через PR #73; change завершён 9/9,
основная spec синхронизирована (11 требований / 27 сценариев). Evidence — в
архиве #70; факты прежнего этапа остаются в своих архивах.
Историческая упаковка #55 — отдельный outcome carrier #54 с retained prefix
[gost-spec-52]. Обновление #70 имеет собственную issue-ветку и prefix [gost-spec-70].
Criteria и closure #54, пять npm-версий и gates #20/#26 не расширяются.
Реализация не означает публикацию, release tags или применение skill к asc-admin.

При архивировании change #55 2026-11-01 после 13/13 задач была создана основная
[спецификация поставки](../../../openspec/specs/state-foundation-plugin-distribution/spec.md)
из Purpose, 8 требований и 14 сценариев той дельты без изменения текста.
Текущий контракт дополнен архивированием #64, описанным ниже.
Архивирование не меняет версии, content approval или release gates.

## Новое имя Svelte shell — #64

[Change](../../../openspec/changes/archive/2026-11-03-rename-svelte-shell-plugin/proposal.md)
завершён и архивирован 2026-11-03: plugin/skill identity `gost-svelte-shell`,
прежняя основа и SPA scope сохранены.
Старые установки переходят явно через uninstall/install; авто-rename не обещается.
Content P2f567ab5 восстановлен в main ancestry через repair68; tree match сохранён.
Это отдельный outcome от archive #55, refactor #62 и relocation #63; их критерии
и release/content gates сохраняются. На этапе архивирования #64 основная
distribution spec содержала 9 требований / 19 сценариев; это исторический снимок.
Текущее состояние после синхронизации #70 в
[PR #74](https://github.com/antonsmolko/gost-spec/pull/74) — 11 требований /
27 сценариев. Progress/evidence #64 находятся в архиве его change.


## Разработка functional-core фич — #75

[Change](../../../openspec/changes/add-functional-core-skill/proposal.md) добавляет
отдельный английский skill/plugin `gost-functional-core` для существующей
framework-independent FC-композиции. Общий marketplace содержит две entries.
FC фичи содержит state/action/reducer/test без собственных effect types/effector;
использует готовые эффекты приложения с receivers. Контракт ApiEffect и общий
AppEffector/RootEffector принадлежат отдельной работе gost-kit/app.
Плагины имеют независимые версии и local source внутри выбранного snapshot. Готовый shell
plugin 0.2.0 и пять npm-workspaces не меняются. Проверки различают реальный common
artifact, применение skill в disposable TypeScript consumer и native установку
в обоих харнесах; metadata success не заменяет бизнес-поведение.
Прогресс и ограничения — [tasks](../../../openspec/changes/add-functional-core-skill/tasks.md)
и [evidence](../../../openspec/changes/add-functional-core-skill/design.md#implementation-evidence).
Presenter, #71/#62/#63, реальный выпуск и asc-admin остаются отдельными outcomes.


## Контракт component/presenter/FC — #78

План [clarify-component-presenter-contract](../../../openspec/changes/clarify-component-presenter-contract/proposal.md)
доставлен через PR #80, main 4b5361a. Реализация пересматривает proposed frontend
ownership/presentation и scoped Svelte/FSD compatibility, не принимая норм и
не меняя пять версий. Примеры проверяются отдельно как pure functions, Svelte
syntax/types и реальная UI binding; compiler success не равен architecture approval.
Progress/evidence — [tasks](../../../openspec/changes/clarify-component-presenter-contract/tasks.md)
и [design](../../../openspec/changes/clarify-component-presenter-contract/design.md#implementation-evidence).
[#79](https://github.com/antonsmolko/gost-spec/issues/79) получает свой skill design
после согласования этого контракта. ESLint/runtime/package-layout и реальные
потребители сохраняют самостоятельный scope; archive/sync #75 остаётся pending.
