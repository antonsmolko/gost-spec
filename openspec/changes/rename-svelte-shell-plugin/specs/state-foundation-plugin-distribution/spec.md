# Spec Delta

## MODIFIED Requirements

### Requirement: Native marketplace installation in both harnesses
Плагин SHALL устанавливаться через штатный Git-маркетплейс каждого из Codex и Claude Code с идентичностью `gost-svelte-shell` и единственным skill того же имени. Оба каталога MUST поставлять одну идентичность плагина и один общий skill, без собственного installer и ручного копирования skill пользователем.

#### Scenario: Install into Codex
- **WHEN** пользователь добавляет каталог поддерживаемой ревизии репозитория и устанавливает плагин штатными средствами Codex
- **THEN** в новой сессии Codex обнаруживается skill `gost-svelte-shell` установленного плагина с нативным пространством имён
- **AND** для установки не требуется приложение-потребитель

#### Scenario: Install into Claude Code
- **WHEN** пользователь добавляет каталог выбранной поставки с закреплённым commit плагина и устанавливает его штатными средствами Claude Code
- **THEN** в новой сессии Claude Code обнаруживается тот же skill с нативным пространством имён плагина
- **AND** состав skill совпадает с поставкой для Codex

## ADDED Requirements

### Requirement: Explicit migration between plugin identities
Переход с `gost-svelte-spa-state` на `gost-svelte-shell` SHALL описываться как смена идентичности с явным удалением прежней установки и установкой новой. Документация MUST описывать явный возврат к прежнему ID из его прежнего catalog/content pin и MUST NOT обещать автоматическое переименование штатным update. Миграция поставки MUST NOT изменять приложение или расширять совместимость skill.

#### Scenario: Replace an existing installation
- **WHEN** пользователь выполняет документированный переход со старого plugin ID на новый штатными средствами поддерживаемого харнеса
- **THEN** после нужного перезапуска обнаруживается один новый skill с доступным recipe, а старый plugin skill больше не активен
- **AND** код приложения сохраняется

#### Scenario: New installation uses the shorter name
- **WHEN** пользователь впервые устанавливает новую поставку
- **THEN** документация, каталог, metadata и native discovery согласованы с `gost-svelte-shell`
- **AND** поддержка существующего Svelte 5 SPA и обязательная основа fc/shell сохраняются

#### Scenario: A migration cannot finish
- **WHEN** установка новой поставки после удаления старой не завершается
- **THEN** результат явно сообщает incomplete и фактически активную идентичность
- **AND** прежний plugin ID не выдаётся за успешную установку нового

#### Scenario: Explicit return to the previous delivery
- **WHEN** пользователь следует документированному возврату: удаляет установленную новую идентичность, если она есть, выбирает прежний catalog/content pin и явно устанавливает прежний ID штатными средствами поддерживаемого харнеса
- **THEN** после нужного перезапуска активен один прежний plugin skill с доступным recipe и содержимым прежнего pin, а новый plugin skill не активен
- **AND** код приложения сохраняется; возврат не выдаётся за успешную миграцию на новый ID и не выполняется как скрытый fallback
