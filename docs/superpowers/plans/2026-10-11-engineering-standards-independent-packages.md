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

Упаковка и независимое версионирование skill до распространения, применение в
потребителе и план миграции его фич остаются отдельными согласуемыми работами.
