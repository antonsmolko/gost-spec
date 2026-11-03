# Tasks

Контракт — [layout](specs/standard-package-layout/spec.md) и
[plugin independence](specs/state-foundation-plugin-distribution/spec.md),
решения — [design](design.md), outcome — [#71](https://github.com/antonsmolko/gost-spec/issues/71).
Это готовый план; реализация не начата.

## 1. База и RED

- [ ] 1.1 Интегрировать main baseline PR69 перед реализацией; подтвердить actual publication/unreleased legacy status, сохранить документы/ID/status/level, версии и plugin hashes. При существующем registry release остановиться до решения о миграции; не расширять PR69.
- [ ] 1.2 До runtime changes запустить failing behavior tests для four-package layout и installed FSD ownership, а также negative core/TS/general-frontend accepted без FSD и positive с accepted FSD profile. Сохранить остальные malformed/example-header отказы и проверить причины RED.

## 2. Перенос и gates

- [ ] 2.1 Перенести TypeScript/frontend/Svelte workspaces по mapping, перенести FSD в frontend/core/architecture/fsd, удалить unreleased legacy workspace и согласовать root workspaces/lock/repository metadata. Сохранить четыре npm identity/version, document-only interfaces и stable FSD ID/semantics/status; FSD applicability — явно выбравшие его frontend-проекты.
- [ ] 2.2 Обновить accepted-header verification/fixtures под FSD profile внутри installed frontend package без изменения публичного helper API и ослабления core/TS/FSD minimum; не фиксировать candidate ID как единственный допустимый. GREEN подтверждает различие FSD и иных frontend approvals, отсутствие unintended writes и сохранение остальных failure cases.

## 3. Документы и артефакты

- [ ] 3.1 Согласовать current README/Changesets/AGENTS/product design/handoff/inventory/content-approval/release guidance с четырьмя пакетами; обновить #20/#26 только в ownership/package wording с dedicated ledger и сохранёнными criteria/closure. Исправить входящие Markdown links, сохранив исторические факты архивов и все proposed/Pending решения.
- [ ] 3.2 Проверить реальные tarballs всех четырёх workspaces, выбранный subset и внешний offline consumer: FSD поставляется standards-frontend, links разрешаются без checkout/workspace links, legacy package/private/runtime interfaces отсутствуют, licenses/exports/metadata корректны. Подтвердить независимый synthetic version bump и точный inventory артефактов.

## 4. Завершение

- [ ] 4.1 Запустить полный check на Node 26.0.0 и 26.11.1 и обязательные Changesets/packed checks; отдельно проверить полный diff, unchanged plugin/catalog/source pin и текущие контракты/issue bodies/links/anchors.
- [ ] 4.2 Провести independent whole-result review с source-linked ledger без открытых findings; подготовить отдельный implementation PR71. Не смешивать release tags70/refactor62/test relocation63; merge, публикация, принятие содержания и применение к asc-admin остаются отдельными разрешаемыми действиями.
