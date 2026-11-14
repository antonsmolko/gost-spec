# Modular feature development

## Purpose

Обеспечить создание и развитие модульной frontend-фичи с общими данными,
независимыми сценариями и проверяемыми примерами состояния, API и UI.

## ADDED Requirements

### Requirement: Explicit modular feature structure
Skill SHALL создавать и изменять запрошенную модульную фичу с common и отдельными сценариями, сохраняя совместимый существующий проект. Архитектурные правила SHALL находиться в frontend-пакете с явной применимостью и proposed-статусом; выбор framework MUST NOT означать их автоматическое принятие.

#### Scenario: Create a modular feature
- **WHEN** агент создаёт users с общими частями и сценариями list/create/update
- **THEN** реально общие модули размещаются в common, а каждый сценарий содержит нужные app, data, domain и ui
- **AND** страницы находятся в ui/pages, компоненты и presenters — в ui/components; пустые каталоги заранее не создаются

#### Scenario: Extend a compatible feature
- **WHEN** запрошено изменение существующего сценария
- **THEN** агент сохраняет совместимые модули и переносит код в common только при реальном совместном использовании
- **AND** изменение не становится миграцией всего проекта или обязательным внедрением FSD

### Requirement: Public scenario boundaries
Сценарии SHALL использовать common и публичные общеприкладные контракты без импорта внутренностей друг друга. Common MUST NOT зависеть от сценариев. Примеры MUST показывать публичные entrypoints и направленные зависимости конкретных модулей app/data/domain/ui.

#### Scenario: Check permitted imports
- **WHEN** проверяется цельный пример фичи
- **THEN** fc использует описания операций, операции — мапперы, мапперы — DTO и доменные типы; доменные сущности не зависят от fc/data
- **AND** нет циклов исполнения, обратного импорта common → scenario или скрытых межсценарных зависимостей

#### Scenario: Complete creation and open the list
- **WHEN** создание пользователя успешно завершено
- **THEN** create описывает переход к list через существующий эффект приложения
- **AND** list при открытии сам инициирует свежую загрузку; create не меняет его state и не использует внутренние actions

### Requirement: Mapped API operation boundary
Описание конкретной API-операции SHALL связывать DTO→domain mapper с типом успешного результата. Reducer MUST возвращать описание готового API-эффекта с callbacks в actions; общий application handler SHALL выполнять запрос и mapping до успешного callback. Data/api MUST NOT знать actions/reducers, а UI MUST NOT выполнять запрос напрямую.

#### Scenario: Receive domain data
- **WHEN** операция списка получает успешный API-ответ
- **THEN** mapper преобразует DTO в доменные данные до result action
- **AND** reducer creation не выполняет запрос или mapper; общий клиент не содержит users-модели

#### Scenario: Reject failed or malformed data
- **WHEN** запрос либо mapping завершается ошибкой или обязательные данные некорректны
- **THEN** пример сохраняет фактическую обработку ошибки опубликованного API и не создаёт ложный success action
- **AND** недоверенные данные проверяются на своей границе и не скрываются assertions/defaults

### Requirement: Independent state and pure reducer tests
Каждый сценарий SHALL иметь собственные state/actions/reducer с явными ключами root state и namespace actions. Reducer MUST быть чистой функцией state/action → state/effects. Unit tests MUST использовать готовые root/feature state factories с overrides и проверять описания эффектов отдельно от их исполнения.

#### Scenario: Verify transitions with factories
- **WHEN** проверяются intent и result actions сценария
- **THEN** независимые cases сгруппированы по action/сценарию и проверяют returned state, effect parameters, неизменность входов и соседних slices
- **AND** result actions подаются напрямую; dispatch, запросы и handlers в unit tests не исполняются

#### Scenario: Compose several scenarios
- **WHEN** list и create включаются в существующую root composition
- **THEN** каждый имеет отдельный scope состояния и явно заданную маршрутизацию actions, их имена не обязаны совпадать
- **AND** общий store и application handlers сохраняются; feature effects/effector не создаются

### Requirement: Presentation and store integration
Пример SHALL показывать получение существующего store через публичный context, чистый presenter и реактивное отображение страницы. Presenter MUST принимать явные именованные inputs/context и возвращать готовый типизированный результат без вызова другого presenter. Logical UI-state SHALL принадлежать FC; компонент передаёт intent actions.

#### Scenario: Render and update a scenario
- **WHEN** меняется состояние списка либо пользователь отправляет форму создания
- **THEN** UI реактивно отображает ready поля/условия/строки, а намерение передаётся одним action
- **AND** presenter unit tests и browser checks отображения/событий проверяются отдельно

#### Scenario: Use a connected store
- **WHEN** feature component получает store через существующий provider
- **THEN** доступ использует публичный store/context entrypoint без runtime-импорта app bootstrap
- **AND** новый store/provider не создаётся; отсутствие provider либо совместимой основы сообщается явно

### Requirement: Scoped application and honest prerequisites
До изменений skill MUST проверять установленный API, существующие composition/effects/context и запрос пользователя. Недостающие артефакты или контракты SHALL оставлять зависимую часть incomplete. Время reset на навигации, guards, защита от поздних ответов и persistence MUST NOT объявляться готовыми за счёт структуры фичи.

#### Scenario: Required integration is missing
- **WHEN** отсутствует совместимый пакет, provider или нужный application effect/handler
- **THEN** агент называет отсутствующий вход и непроверенную интеграцию
- **AND** не выдумывает API, не обновляет зависимости и не подключает shell скрытой частью задачи

#### Scenario: Bound routing and persistence claims
- **WHEN** пример показывает create → list и открытие сценария
- **THEN** он явно отделяет свои проверенные lifecycle условия от реального router/reset timing и отсутствия мерцаний
- **AND** reference/пример явно ссылается на store/context [gost-spec #87](https://github.com/antonsmolko/gost-spec/issues/87) и границы маршрутизации [gost-spec #89](https://github.com/antonsmolko/gost-spec/issues/89), не выдавая незавершённый рецепт за доступный API
- **AND** фильтры/формы не сохраняются по умолчанию; persistence и навигационная интеграция остаются отдельными задачами

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

### Requirement: Independent self-contained plugin delivery
Skill `gost-feature` SHALL поставляться по-английски отдельным независимо версионируемым plugin общего marketplace для Codex и Claude. References MUST читаться внутри plugin root без исходного checkout или обязательной установки соседних skills. Поставка SHALL сохранять текущие plugin payload, версии npm и неизменяемые release tags; merge/release approval остаётся отдельным.

#### Scenario: Install and discover the plugin
- **WHEN** оба харнеса штатно устанавливают один проверенный candidate snapshot в чистые профили
- **THEN** обнаруживается один gost-feature skill, все references читаются, версии/полные installed bytes совпадают с источником
- **AND** повтор и coexistence сохраняют существующие plugins и личные профили; установка не запускает skill и не меняет приложение

#### Scenario: Reject incomplete delivery
- **WHEN** entry отсутствует/дублируется, metadata не совпадает, reference отсутствует или файловая ссылка выходит за plugin root
- **THEN** существующая проверка сообщает конкретный файл/причину; разрешённые внешние URI не считаются локальными файлами
- **AND** отсутствие native evidence явно означает incomplete; будущий release tag не нужен для draft checks и не объявляется существующим
