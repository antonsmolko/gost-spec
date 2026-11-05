# Spec Delta

## Purpose

Обеспечить повторяемое выделение и изменение чистых presentation-функций, проверку их результатов и корректное использование готовых данных компонентом без зависимости от FC или конкретного state manager.

## ADDED Requirements

### Requirement: Independent presentation workflow
Skill `gost-view-presenter` SHALL на английском направлять создание и изменение presenters как pure functions с явными inputs/context. Он MUST NOT требовать FC, store, dispatch, shell или устанавливать их ради presentation logic. Источник данных и обработка событий остаются контрактами проекта.

#### Scenario: Extract calculations without FC
- **WHEN** компонент с обычными props содержит presentation calculations
- **THEN** skill выносит их в pure functions, компонент получает готовые результаты
- **AND** не добавляет common/shell/store/actions/reducers

#### Scenario: Preserve an existing application
- **WHEN** входные данные уже поступают из FC или другого state manager
- **THEN** существующие data bindings, callbacks и event behaviour сохраняются
- **AND** presenter не импортирует и не изменяет этот источник

### Requirement: Pure composable functions
Presenters MUST быть детерминированными, не мутировать inputs и не выполнять I/O или hidden store reads. Связанные вычисления SHALL группироваться при общей работе, независимые могут оставаться отдельными; композиция MUST NOT требовать monolithic presenter или нового runtime API.

#### Scenario: Test independent and combined calculations
- **WHEN** есть связанные status outputs и независимое форматирование списка
- **THEN** обе функции доступны отдельно и могут быть скомпонованы с явными inputs
- **AND** tests подтверждают результаты, неизменность inputs и отсутствие скрытого state

#### Scenario: Hidden dependency is found
- **WHEN** presenter читает store, время или locale неявно либо вызывает side effect
- **THEN** зависимость передаётся явно, а I/O остаётся за пределами presenter
- **AND** недоступный обязательный context не скрывается выдуманным default

### Requirement: Ready view data and reactive integration
Skill SHALL переносить presentation conditions, formatting и collection transformations из компонента в presenter; компонент использует ready fields/booleans/lists. Реактивная привязка вызова presenter MUST сохранять обновления при изменении inputs. Простому компоненту без вычислений дополнительный presenter не требуется.

#### Scenario: Move inline presentation logic
- **WHEN** компонент содержит formatting, filter/map/sort или condition calculation, в том числе внутри derived/helper
- **THEN** calculations переносятся в presenter, markup использует готовые значения
- **AND** if/else-if читает ready boolean, обычный else и ready row fields допустимы

#### Scenario: Keep simple components simple
- **WHEN** компонент уже получает ready props и не выполняет calculations
- **THEN** skill не создаёт пустую presenter-обёртку
- **AND** существующие события и browser plumbing сохраняются

#### Scenario: Change reactive inputs
- **WHEN** inputs presenter меняются в Svelte 5 component
- **THEN** отображение, boolean branches и rows обновляются через существующую binding
- **AND** нет one-time snapshot или второй mutable копии представления

### Requirement: Explicit input contracts and source boundaries
Skill MUST проверять типы/варианты inputs, существующие conventions и доступность источников правил. Он SHALL использовать документированные nullable/loading/empty/error состояния, сохраняя validation на внешних границах приложения. Presenter MUST NOT объявляться validator unknown data или маскировать missing required inputs assertions/defaults.

#### Scenario: Use documented variants
- **WHEN** input contract включает loading, empty, error, success или nullable fields
- **THEN** presenter tests покрывают предусмотренные outputs и условия отображения
- **AND** unknown input не выдаётся за validated domain data

#### Scenario: Required information is missing
- **WHEN** contracts, context или доступный authoritative source не позволяют определить requested behaviour
- **THEN** агент сообщает конкретный missing input и incomplete зависимой работы
- **AND** не выдумывает source API или новое validation/state infrastructure

### Requirement: Observable skill evaluation
Готовность skill MUST подтверждаться generated code и поведением, отдельно от формата Markdown и compiler success. Pure presenter input/output tests SHALL выполняться без store/component mounting; reactive/component integration проверяется отдельно. Syntax-valid anti-examples MUST классифицироваться manual review, без обещания автоматического доказательства purity/provenance.

#### Scenario: Evaluate creation change and repeat
- **WHEN** независимый агент применяет установленный skill в disposable consumer к созданию, изменению и повторной задаче
- **THEN** generated functions/tests/components проверяются по результатам и reactive behaviour
- **AND** unrelated files, source bindings и callbacks сохранены, повтор не создаёт дублирующую композицию

#### Scenario: Distinguish verification layers
- **WHEN** TypeScript/Svelte checks или pure tests проходят
- **THEN** отчёт отдельно содержит actual component evidence и manual policy classification
- **AND** отсутствие browser/harness evidence не заменяется утверждением complete

### Requirement: Separate native plugin delivery
Plugin `gost-view-presenter` SHALL иметь собственные SemVer/changelog и единое дерево skill/reference для Codex и Claude. Оба каталога MUST выбирать его local source в одном marketplace snapshot. Содержимое/версии shell и FC plugins MUST сохраняться; установка сама по себе не применяет skill к приложению.

#### Scenario: Install independently and alongside existing plugins
- **WHEN** plugin устанавливается в изолированных native profiles обоих харнесов отдельно и рядом с shell/FC
- **THEN** fresh discovery показывает отдельный skill с читаемым reference и совпадающими файлами
- **AND** повторная установка не дублирует skill, app и личные настройки сохранены

#### Scenario: Reject invalid delivery
- **WHEN** отсутствует skill/reference, не совпадают identities/versions либо local path выходит за plugin root
- **THEN** validation сообщает конкретный файл/причину и не подтверждает поставку
- **AND** успешный format check без native evidence не засчитывается за установку

### Requirement: Authoritative rules and separate approval
Skill SHALL ссылаться на существующие pure/rendering источники с revision/status, не создавать второй нормативный источник и не навязывать полный FC/presenter contract. Его поставка MUST NOT принимать proposed нормы, мигрировать приложения, публиковать пакеты или создавать release tags без отдельных решений.

#### Scenario: Read rules without the author checkout
- **WHEN** установленный skill читает recipe и selected authoritative pure/rendering sources
- **THEN** internal references находятся внутри plugin, normative sources доступны по зафиксированным внешним ссылкам или supplied verified copies
- **AND** missing source явно обозначается как incomplete, а не заменяется выдуманными правилами

#### Scenario: Prepare an unreleased plugin
- **WHEN** plugin metadata, checks и review готовы
- **THEN** версия0.1.0 остаётся unreleased, пять npm-пакетов и proposed/Pending не меняются
- **AND** реальный tag/release, merge и применение в asc-admin требуют отдельных указаний
