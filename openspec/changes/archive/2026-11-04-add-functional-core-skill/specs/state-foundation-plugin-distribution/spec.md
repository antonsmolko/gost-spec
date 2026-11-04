# Spec Delta

## MODIFIED Requirements

### Requirement: Native marketplace installation in both harnesses
Плагин SHALL устанавливаться штатными Git-маркетплейсами Codex и Claude Code как `gost-svelte-shell` с единственным skill того же имени. Оба каталога MUST выбирать одно общее дерево shell-плагина из выбранного snapshot без собственного installer и ручного копирования. Каталоги SHALL допускать отдельные независимо версионируемые плагины; их установка MUST NOT менять идентичность, содержимое или версию shell-плагина.

#### Scenario: Install into Codex
- **WHEN** пользователь добавляет каталог существующего release tag репозитория и устанавливает плагин штатными средствами Codex
- **THEN** в новой сессии Codex обнаруживается skill `gost-svelte-shell` установленного плагина с нативным пространством имён
- **AND** для установки не требуется приложение-потребитель

#### Scenario: Install into Claude Code
- **WHEN** пользователь добавляет каталог того же release tag и устанавливает плагин штатными средствами Claude Code
- **THEN** в новой сессии Claude Code обнаруживается тот же skill с нативным пространством имён плагина
- **AND** версия и полное дерево плагина совпадают с поставкой для Codex

#### Scenario: Another plugin shares the marketplace
- **WHEN** пользователь отдельно устанавливает `gost-functional-core` из того же marketplace snapshot
- **THEN** `gost-svelte-shell` остаётся отдельной доступной для установки entry со своей identity/version и одним skill
- **AND** при установке обоих плагинов их skills различаются по native namespace; второй не подменяет первый и не запускает подключение основы
