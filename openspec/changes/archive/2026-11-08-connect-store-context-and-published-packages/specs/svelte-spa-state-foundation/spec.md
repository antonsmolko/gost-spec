# Spec Delta

## MODIFIED Requirements

### Requirement: Explicit dependency compatibility
Skill SHALL проверять фактические версии, публичные API, engines и peer dependencies выбранных артефактов и документировать проверенную опубликованную связку. При недоступных артефактах или неподтверждённой совместимости он MUST сообщать ограничение и MUST NOT заявлять успешное подключение либо заменять библиотеку собственной реализацией.

#### Scenario: Unavailable package
- **WHEN** требуемый пакет отсутствует в доступном источнике установки
- **THEN** агент сообщает, какой артефакт необходим, и не использует неподтверждённую команду установки как доказательство успеха

#### Scenario: Verify a published pair
- **WHEN** рецепт обозначает опубликованную связку как проверенную
- **THEN** evidence содержит версии, источник и идентичность реально установленных пакетов, среду и результаты проверок
- **AND** одних registry metadata или локального workspace недостаточно

#### Scenario: Incompatible consumer environment
- **WHEN** среда потребителя не удовлетворяет engines либо peer range выбранной связки
- **THEN** skill сообщает конкретную несовместимость и оставляет зависимое подключение incomplete
- **AND** не обновляет среду потребителя молча

## ADDED Requirements

### Requirement: Typed application store context
Для согласованной модульной схемы skill SHALL предоставлять отдельный store-модуль с полной корневой композицией и типизированным context-доступом. Bootstrap SHALL создавать один store на экземпляр приложения. Потребители MUST сохранять реактивное чтение полного state и общий dispatch через публичный accessor без импорта bootstrap или runtime-циклов. Схема SHALL быть явной адаптацией границ проекта.

#### Scenario: Connect business components
- **WHEN** два бизнес-компонента получают store через context
- **THEN** оба используют один экземпляр с типизированным полным state и dispatch
- **AND** изменение одной из двух синтетических частей состояния наблюдаемо потребителями
- **AND** shared UI получает готовые props/callbacks, не импортируя состояние бизнес-фич

#### Scenario: Provider ownership
- **WHEN** bootstrap создаёт подключение
- **THEN** provider устанавливается при инициализации корневого компонента
- **AND** создание store и сборка reducers/effectors отделены от публичного доступа компонентов
- **AND** корневые контракты не переносятся в shared для обхода направления импортов

#### Scenario: Isolate application instances
- **WHEN** два экземпляра приложения подключены одновременно
- **THEN** каждый имеет свой store
- **AND** dispatch в одном не меняет состояние другого

#### Scenario: Missing provider
- **WHEN** компонент запрашивает store без provider
- **THEN** подключение выдаёт понятную диагностику отсутствующего context
- **AND** не создаёт запасной store автоматически

#### Scenario: Preserve existing access conventions
- **WHEN** проект уже имеет совместимое подключение или другую согласованную архитектуру
- **THEN** skill учитывает её при проверке и повторном применении
- **AND** не вводит второй store/provider и не навязывает модульную схему всем Svelte-проектам
