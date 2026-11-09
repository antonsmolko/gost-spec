# Proposal

## Why

Опубликованные common@0.3.0 и svelte@0.2.0 изменили API операций и создания store. Текущие recipes используют прежние контракты; asc-admin нужны проверенные инструкции перед выпуском skills.

## What Changes

- Обновить FC recipe/fixture: API operations, mapper DTO→domain, createApiEffect и общеприкладной createApiEffector.
- Обновить shell recipe/fixture: фабричный initState, reset({ excluded }), реактивность и общий onError.
- Проверить реальные npm-артефакты во внешних consumers и согласовать очередь #96 → #97.

## Capabilities

### New Capabilities

Нет.

### Modified Capabilities

- `functional-core-feature-development`: проверенные операции и типизированные mapped results в API-примерах.
- `svelte-spa-state-foundation`: фабричная инициализация, явный reset и обработка ошибок store.

## Impact

Два английских skill/reference, fixtures, дельты и учёт #96. Без новых API gost-kit, маршрутизации, persisted state и миграции приложения. Версии/changelog и выпуск остаются отдельной #97; текущее содержимое unreleased.
