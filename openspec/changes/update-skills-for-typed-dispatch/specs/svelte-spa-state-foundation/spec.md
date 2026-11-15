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

#### Scenario: Verify the published typed dispatch pair
- **WHEN** the recipe targets common 0.4.0 and svelte 0.3.0
- **THEN** external npm consumers verify typed namespace/action dispatch with separate payloads, reactive UI and awaited result dispatch
- **AND** invalid-path reporting distinguishes its original path from execution errors carrying normalized actions
- **AND** factory/reset/context behavior and existing application behavior remain verified
