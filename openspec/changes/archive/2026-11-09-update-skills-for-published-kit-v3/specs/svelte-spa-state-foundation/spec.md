## ADDED Requirements

### Requirement: Factory initialization and explicit reset
Для совместимого опубликованного API skill SHALL подключать store с фабрикой свежих начальных данных и описывать явный полный reset либо reset с исключениями корневых scopes. Reset MUST сохранять идентичность store/dispatch и реактивно заменять состояние по контракту пакета. Skill MUST различать исходную ошибку создания, ошибки reset и dispatch, не связывая reset автоматически с маршрутизацией.

#### Scenario: Reset observable state
- **WHEN** два потребителя одного store наблюдают явный reset
- **THEN** оба отображают свежие значения сбрасываемых scopes
- **AND** исключённый существующий scope сохраняет значение и ссылку, а другой экземпляр приложения не меняется

#### Scenario: Fresh initial data
- **WHEN** создаются два store или выполняются последовательные resets
- **THEN** фабрика создаёт новые вложенные defaults без общего mutable состояния
- **AND** вся фабрика вызывается один раз на reset, включая reset с исключениями

#### Scenario: Report errors by execution boundary
- **WHEN** фабрика при первоначальном создании бросает исключение либо ошибка возникает при reset или dispatch
- **THEN** инструкция и проверки различают исходное исключение создания и события общего error reporter по фактическому API
- **AND** ошибка фабрики reset не меняет текущее состояние; API error callback, возвращающий action, не выдаётся за store reporter
