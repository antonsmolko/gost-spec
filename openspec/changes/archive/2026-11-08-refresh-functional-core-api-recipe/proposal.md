# Proposal

## Why

[#93](https://github.com/antonsmolko/gost-spec/issues/93): FC recipe и synthetic fixture сохраняют receiverSuccess/receiverError, хотя опубликованный common@0.2.1 использует onSuccess/onError. Fixture не должна маскировать несовместимость собственным ApiEffect.

## What Changes

- Исправить reference и fixture под реальные public ApiEffect/createApiHandler.
- Проверить TypeScript snippets и state/action → state/effects отдельно от app integration.
- Обновить FC plugin revision и очередь после доставки #87.

## Capabilities

Нет изменения нормативных требований: это исправление примера для существующего контракта `functional-core-feature-development`; skip_specs: true.

## Impact

FC plugin, private fixture и tracking/evidence. Без mapper-extension, нового API, FSD, shell/остальных plugins/пяти npm-пакетов и миграции asc-admin. Короткий план и реализация в одном PR; merge/archive/release отдельно.
