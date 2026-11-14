# Proposal

## Why

FC, shell и presenter skills уже доступны, но не объясняют, как собрать из них
модульную фичу с общими данными и независимыми сценариями. [#88](https://github.com/antonsmolko/gost-spec/issues/88)
фиксирует согласованную архитектуру; нужен skill с проверяемым цельным примером.

## What Changes

- Описать frontend-архитектуру `users/common`, `list`, `create`, `update`:
  публичные границы, зависимости app/data/domain/ui и взаимодействие сценариев.
- Добавить английский skill `gost-feature` с коротким порядком работы,
  кодом к каждому правилу и полным синтетическим примером list/create.
- Показать реальные API operations с mapper, FC-фабрики и reducer unit tests,
  общий store/context, presenter, страницы и переход create → list.
- Подготовить отдельный plugin `gost-feature@0.1.0` unreleased в двух каталогах
  `gost`, проверить применение, повтор и изолированную native поставку.

## Capabilities

### New Capabilities

- `modular-feature-development`: создание, изменение и проверка модульной
  frontend-фичи с общими частями и независимыми сценариями.

### Modified Capabilities

Нет. FC, shell, presenter и механизм поставки сохраняют действующие контракты.

## Impact

Реализация затронет `packages/domains/frontend/architecture/modular-features.md`
(новый proposed FRONTEND-ARCH-003), README/changelog frontend-пакета и его minor
changeset; остальные четыре нормативных пакета сохраняются. Принятие нового
proposed-документа и выпуск пакета не выполняются автоматически.

Новые plugin/fixture: `plugins/gost-feature/`, `fixtures/modular-feature/`.
Дополняются оба marketplace, существующий distribution checker и его tests,
корневой README, handoff, таблица очереди и requirements inventory; при начале
content review нового ID — Pending row в content-approval. Новая plugin-версия независима;
существующие три plugin payload и опубликованные теги сохраняются.

База — main `2923ff04ee5ac04dbf02453555e577a65b82d12b`;
ветка `feature/gost-spec-88-modular-feature-skill`, префикс `[gost-spec-88]`.
Этот PR содержит план; реализация следует после согласования. Reset timing,
реальный router/guard, persisted state, миграция asc-admin и выпуск — отдельные
работы. Подробности — в design и tasks этого change.
