# frontend-component-presentation Specification

## Purpose

Определить проверяемый контракт frontend-компонентов, presenters и functional core: владение состоянием, готовые UI-значения, реактивные привязки и intent actions без смешения ответственности.

## Requirements

### Requirement: Explicit state ownership
Для проектов, выбравших этот контракт, logical feature/UI state MUST читаться из root/feature state и меняться через dispatch/reducer. Presenter SHALL вычислять view state из явных входов без альтернативного mutable store, мутаций или I/O. Реализация reactive state binding в imperative shell MUST сохраняться.

#### Scenario: Change logical UI state
- **WHEN** пользователь открывает modal, меняет tab или draft поля
- **THEN** component передаёт intent action, а reducer вычисляет новый state и effects
- **AND** component/presenter не становится вторым owner этого состояния

#### Scenario: Preserve reactive shell
- **WHEN** существующий shell реализует реактивную state binding
- **THEN** его реализация не запрещается правилами о logical UI-state компонента
- **AND** UI читает snapshot/binding через существующий проектный API

### Requirement: Precise ready-value rendering
Component SHALL отображать готовые значения и допускать if/else-if с готовым boolean, обычный else и итерацию готовых списков. Presentation comparisons, logical combinations, ternaries, negation, formatting и collection transformations MUST вычисляться вне component в pure presenter. Object/data truthiness SHALL NOT считаться готовым boolean.

#### Scenario: Display ready fields and booleans
- **WHEN** props/view state содержат title, isLoaded и готовые rows
- **THEN** component отображает поля, проверяет isLoaded и итерирует rows без presentation calculations
- **AND** обычные else/else-if и чтение полей элемента допустимы

#### Scenario: Move condition calculations
- **WHEN** condition содержит сравнение, комбинацию, negation, ternary, function call или object truthiness
- **THEN** presentation condition переносится в presenter и становится именованным boolean
- **AND** переименование локального calculation в простую переменную не выдаётся за соблюдение контракта

### Requirement: Read-only reactive bindings
Контракт SHALL разрешать read-only feature selection и вызов pure presenter в реактивной привязке. Presentation calculations внутри component derived MUST переноситься в presenter. Контракт MUST различать policy read-only usage и framework capability переопределять derived; имя переменной или helper не доказывает происхождение/чистоту.

#### Scenario: Select and present feature state
- **WHEN** Svelte component выбирает root.state.user через $derived и вызывает presenter с выбранным state
- **THEN** такая реактивная привязка допустима и сохраняет обновление представления
- **AND** собственный mutable presenter/UI store не создаётся

#### Scenario: Hide calculations behind a name
- **WHEN** component вычисляет presentation condition внутри derived или helper и передаёт результат простым именем в markup
- **THEN** review прослеживает calculation и требует вынести его в presenter
- **AND** компиляция или подходящее имя не считаются доказательством purity/provenance

### Requirement: Intent-only event handling
Обработчик logical feature/UI intent MUST передавать одно намерение одним action через FC-границу. Выбор бизнес-ветки и dispatch chains SHALL оставаться в FC/application workflow. Reducer MUST возвращать state/effects без dispatch/I/O. Browser-only plumbing MAY не отправлять action и MUST NOT владеть логическим UI-state.

#### Scenario: Submit one intent
- **WHEN** UI-событие инициирует workflow с business condition
- **THEN** компонент передаёт один intent action и необходимый стабильный payload; DOM event/node остаются на UI-границе
- **AND** reducer использует актуальный state; I/O исполняют существующие effects приложения

#### Scenario: Keep browser mechanics separate
- **WHEN** component/adapter выполняет preventDefault, focus, refs или widget wiring
- **THEN** browser plumbing допустим в этих границах
- **AND** он не скрывает business branching, второй domain/UI store или прямую запись feature state
- **AND** focus-only handler может отправлять ноль actions; shared UI может передать intent callback до FC-границы

### Requirement: Composable presenters and simple components
Presenter calculations MUST быть pure с явными inputs/context из проверенного application state; validation недоверенных данных остаётся на app boundaries. Они SHALL допускать композицию функций и документированные loading/empty/error варианты. Контракт SHALL NOT требовать монолитного presenter, конкретного API или обёртки для stateless component с готовыми props.

#### Scenario: Compose presentation calculations
- **WHEN** экрану нужны независимые calculations и связанные вычисления
- **THEN** готовые pure functions можно использовать отдельно или скомпоновать
- **AND** их зависимости/результаты тестируются без store и component mounting

#### Scenario: Render a simple shared component
- **WHEN** stateless/shared component получает готовые значения/boolean/list и callback намерения
- **THEN** ему не требуется отдельный presenter без работы для него
- **AND** допустимые UI bindings и event boundary сохраняются

#### Scenario: Preserve validated-input boundaries
- **WHEN** приложение получает unknown external data, raw DOM payload или состояние с отсутствующими данными
- **THEN** application boundaries/FC сохраняют предусмотренную валидацию; raw payload не объявляется валидным доменным значением
- **AND** presenter обрабатывает документированные state variants, не валидирует arbitrary input и не скрывает missing required inputs неоговорёнными defaults

### Requirement: Consistent proposed documentation
Frontend, Svelte и выбранный FSD профиль SHALL согласованно описывать применимость и сочетание контрактов, не навязывая FC/presenter от выбора framework/layers. IDs, proposed/Pending и отдельные content/release gates MUST сохраняться. #79 и специальные lint rules SHALL оставаться отдельными outcomes без обещания их готовности.

#### Scenario: Review revised standards
- **WHEN** новая редакция contract и examples подготовлена
- **THEN** README/inventory/approval отражают те же scope и responsibilities
- **AND** согласование плана или зелёные checks не переводят нормы в accepted

#### Scenario: Keep downstream scopes separate
- **WHEN** presenter skill или lint rules ещё не доставлены
- **THEN** документация различает инструкцию/manual review и реально доступные проверки
- **AND** не создаёт новый runtime/skill/линтер или миграцию приложения в этом outcome

### Requirement: Observable examples and verification limits
Контракт MUST содержать valid/invalid examples для UI states, bindings/events, presenters и browser plumbing. Pure presenter/FC tests и reactive/component verification SHALL быть разделены; FC unit cases используют готовые state factories. Успешные compiler/autofixer checks MUST NOT объявляться доказательством соблюдения архитектуры или происхождения helper.

#### Scenario: Verify positive and policy-negative examples
- **WHEN** примеры проходят syntax/type checks
- **THEN** review отдельно классифицирует их по контракту с объяснением
- **AND** синтаксически корректный anti-example не объявляется архитектурно допустимым

#### Scenario: Distinguish pure tests and UI integration
- **WHEN** presenter/FC input-output tests успешны
- **THEN** отчёт сохраняет отдельную проверку reactive updates и component interaction
- **AND** не приписывает pure tests или будущим lint rules отсутствующие гарантии
