## MODIFIED Requirements

### Requirement: Code-backed guidance and application evidence
Skill SHALL поставлять код с путями файлов для каждого архитектурного правила, связанный с одним цельным синтетическим примером. Готовность MUST подтверждаться реальными внешними пакетами, выполнением, проверкой import graph, изменением и повторным применением skill; компиляция одна не доказывает архитектуру или работающее приложение.

#### Scenario: Verify the complete example
- **WHEN** пример и reference проверяются в изолированном consumer
- **THEN** все полные source blocks соответствуют проверенным файлам, типы и поведение проверены на фактических npm artifacts, включая отрицательные type/import cases
- **AND** отчёт фиксирует версии/источник, public exports, unit/integration/browser результаты и ограничения отдельно

#### Scenario: Apply and repeat the skill
- **WHEN** независимый агент применяет skill к synthetic foundation, меняет сценарий и повторяет запрос
- **THEN** полученная фича проходит заданные проверки и сохраняет соседние модули
- **AND** повтор не дублирует slices, публичные exports, handlers или providers; отсутствие основы даёт incomplete

#### Scenario: Verify payload actions across a complete scenario
- **WHEN** the complete example uses the published typed dispatch API
- **THEN** UI intent calls use namespace/action paths and separate payloads, API callbacks return typed dispatch objects, and reducers read action.payload
- **AND** direct reducer cases use factory-built states and internal scope/type/payload actions while integration separately executes callbacks and awaited nested dispatch
- **AND** public type checks reject mismatched namespace/action/payload pairs and the full listing matches the checked consumer
