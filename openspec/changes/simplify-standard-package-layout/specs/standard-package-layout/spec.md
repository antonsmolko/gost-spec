# Spec Delta

## Purpose

Предоставить понятные независимо версионируемые пакеты инженерных документов:
общие правила, TypeScript и frontend с общей архитектурой и особенностями Svelte.
Упрощение размещения сохраняет явные границы применимости, принятия и выпуска.

## ADDED Requirements

### Requirement: Four independently versioned document packages
Репозиторий SHALL содержать четыре document-only workspace: `packages/core`, `packages/typescript`, `packages/frontend/core`, `packages/frontend/svelte`. Они MUST сохранять npm-имена `@antonsmolko/standards-core`, `@antonsmolko/standards-typescript`, `@antonsmolko/standards-frontend`, `@antonsmolko/standards-svelte` соответственно и независимые версии.

#### Scenario: Inspect the workspace inventory
- **WHEN** проверяется подготовленное дерево репозитория
- **THEN** root workspace list, lockfile и package metadata согласованы с четырьмя путями и именами
- **AND** старые domains/technologies/stacks workspaces не образуют дополнительные пакеты или дубли документов

#### Scenario: Version one package independently
- **WHEN** synthetic fixture подготавливает изменение версии одного workspace
- **THEN** остальные пакеты не получают неявный version bump
- **AND** публичные interfaces остаются документальными, без runtime exports, installer или resolver

### Requirement: Rules belong to their applicability area
Общие инженерные правила MUST находиться в core, правила TypeScript — в typescript, общая архитектура интерфейса и профиль FSD — в frontend/core, особенности Svelte — в frontend/svelte. FSD SHALL применяться только к frontend-проектам, явно выбравшим его; выбор frontend-пакета MUST NOT сам по себе предписывать FSD или Svelte.

#### Scenario: Read framework-independent FSD rules
- **WHEN** frontend-проект явно выбирает профиль FSD
- **THEN** его слои и import boundaries описаны в standards-frontend без ограничения на Svelte
- **AND** логика разрешённых/запрещённых импортов, ID, уровень и proposed статус существующего правила сохранены

#### Scenario: Use frontend standards without FSD
- **WHEN** frontend-проект не выбирает FSD
- **THEN** общие UI-правила остаются применимыми по своей области
- **AND** наличие FSD-документа в пакете не требует создавать FSD-слои

### Requirement: Installed documents are self-contained
Каждый пакет MUST поставлять README, LICENSE, CHANGELOG и необходимые документы. Локальные ссылки SHALL разрешаться после установки настоящих tarballs во внешнем потребителе, без исходного checkout или workspace links. Поставка MUST исключать private материалы, fixtures и исполняемые интерфейсы.

#### Scenario: Install all packages or a selected subset
- **WHEN** внешний consumer устанавливает четыре подготовленных tarballs либо выбранный применимый subset
- **THEN** README и references читаются внутри установленных пакетов
- **AND** FSD-документ находится в standards-frontend, а не в дублирующем standards-svelte-spa

### Requirement: Layout changes preserve content approval gates
Перенос MUST сохранять нормативные ID, proposed/Pending статусы и отдельное разрешение публикации. Первый accepted-content minimum SHALL по-прежнему требовать применимые принятые правила core, TypeScript и FSD-профиля; перенос FSD в frontend-пакет MUST NOT заменять его любым другим frontend-правилом.

#### Scenario: An unrelated frontend acceptance does not replace FSD
- **WHEN** synthetic fixture имеет accepted core/TypeScript и только общее UI-правило frontend
- **THEN** проверка принятого набора не засчитывает FSD minimum
- **AND** успешные packaging tests не принимают реальные proposed документы

#### Scenario: The same FSD rule is accepted in its new package
- **WHEN** synthetic fixture содержит подтверждённые core/TypeScript и прежнее FSD-правило в standards-frontend
- **THEN** проверка учитывает тот же содержательный minimum независимо от прежнего имени stack package
- **AND** реальные owner decisions и release approval остаются отдельными действиями

### Requirement: Legacy package removal has an explicit boundary
Legacy standards-svelte-spa SHALL удаляться как самостоятельный пакет только при подтверждённом unreleased состоянии. Если обнаружена фактическая публикация, изменение MUST остановиться до отдельного решения о миграции. Перенос MUST NOT менять runtime, каталоги и выбор версии плагина или приложение-потребитель.

#### Scenario: Publication contradicts the unreleased baseline
- **WHEN** перед removal обнаружена существующая публичная версия legacy пакета
- **THEN** реализация сообщает необходимость пересогласовать consumer migration
- **AND** deprecation, unpublish и молчаливая подмена пакета не выполняются
