# Proposal

## Why

Skill подключения shell всё ещё иллюстрирует development-пакеты 0.0.0 и размещает context в app. Нужен проверенный рецепт опубликованных пакетов с доступом к полному store из бизнес-компонентов через отдельный src/store.

## What Changes

- Обновить shell skill/reference: store и корневая композиция в src/store, bootstrap/provider в src/app, useStore для потребителей.
- Показать явную адаптацию границ проекта: публичный context accessor доступен бизнес-компонентам; shared UI получает props/callbacks.
- Проверить опубликованные common@0.2.1 и svelte@0.1.1 в синтетическом SPA и зафиксировать фактические артефакты, API, engines и peer range.
- Расширить проверку двумя частями состояния, общим доступом, изоляцией экземпляров и диагностикой отсутствующего provider; сохранить проверки повторного подключения и прежнего поведения.

## Capabilities

### New Capabilities

Нет.

### Modified Capabilities

- `svelte-spa-state-foundation`: context-доступ к полной корневой композиции через отдельный store-модуль и проверка опубликованных артефактов.

## Impact

[#87](https://github.com/antonsmolko/gost-spec/issues/87): plugins/gost-svelte-shell, его private fixture/evaluation и внутренние tracking-документы. План не меняет реализацию skill, main specs, пакеты или версии. Реализация не включает FC recipe, reset, API mapper, middleware, persistence и миграцию asc-admin. Нормативное принятие, archive, merge и выпуск остаются отдельными решениями.

Сопровождающий учёт carrier-ветки: таблица очереди gost-spec/gost-kit со статусами, связанная с handoff и #88, обновляется вне контракта capability.
