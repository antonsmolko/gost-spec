# Spec Delta

## MODIFIED Requirements

### Requirement: Independent plugin version
Плагин MUST иметь собственную SemVer-версию и changelog. Идентичность и версия в метаданных обоих харнесов MUST совпадать. Изменение версии плагина MUST NOT менять версии пакетов стандартов или объявлять обновлёнными runtime-зависимости и приложения.

#### Scenario: Prepare a plugin-only update
- **WHEN** в disposable копии подготавливается следующая версия плагина
- **THEN** оба харнеса видят одинаковые identity/version и соответствующий changelog
- **AND** версии и содержимое npm-пакетов стандартов, а также код приложения-потребителя не меняются
