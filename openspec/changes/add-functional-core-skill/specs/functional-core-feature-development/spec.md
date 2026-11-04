# Spec Delta

## Purpose

Обеспечить повторяемую разработку бизнес-фич через публичный functional-core API gost-kit, с чистыми переходами, явной интеграцией effects и проверяемым результатом независимо от UI-фреймворка.

## ADDED Requirements

### Requirement: Framework-independent feature guidance
Skill `gost-functional-core` SHALL направлять создание и изменение запрошенной бизнес-фичи через `@gost-kit/common` на английском языке. Его применение MUST NOT требовать Svelte или другого UI-фреймворка, переустройства проекта под FSD либо переноса не относящихся к задаче модулей.

#### Scenario: Create a feature without a UI framework
- **WHEN** агент применяет skill к запрошенной TypeScript-фиче в проекте с совместимой FC-композицией
- **THEN** state, actions и reducers реализуются через публичный common API без framework imports в functional core
- **AND** расположение файлов соответствует проекту, а не обязательному новому шаблону

#### Scenario: Change an existing FC feature
- **WHEN** запрос изменяет уже существующую FC-фичу
- **THEN** агент сохраняет её совместимые контракты и меняет только необходимые transitions, effect flow и интеграцию
- **AND** соседние бизнес-фичи и presenter/UI архитектура не переписываются автоматически

### Requirement: Actual artifact compatibility
До зависимого кода skill MUST требовать проверку фактически доступных common artifacts, публичных exports и совместимости с root composition. Версия в примере MUST NOT считаться доказательством публикации или совместимости. Отсутствующий либо несовместимый API SHALL приводить к явному incomplete, без выдуманной реализации библиотеки или автоматического upgrade.

#### Scenario: Use a real common artifact
- **WHEN** проект использует подтверждённый пакет либо предоставленный реальный tarball с нужным публичным API
- **THEN** код импортирует библиотеку через package root и проверяется с этими артефактами
- **AND** отчёт указывает фактическую версию и источник

#### Scenario: Required inputs are unavailable
- **WHEN** нужный artifact, export или совместимость не подтверждены
- **THEN** агент сообщает конкретный отсутствующий вход и непроверенную часть результата
- **AND** не заменяет библиотеку самодельным store, не импортирует private source и не обновляет зависимости без отдельной задачи

### Requirement: Pure transitions and explicit effect flow
Functional core MUST описывать детерминированные immutable transitions и effects без выполнения I/O, доступа к скрытому store или мутации входов. При замене state SHALL возвращаться полное состояние соответствующего уровня композиции. Выполнение effects и обработка внешних данных MUST оставаться на явной imperative границе.

#### Scenario: Verify feature transitions
- **WHEN** reducer обрабатывает action при неизменяемых исходных feature/root states
- **THEN** результат содержит ожидаемые полное состояние и описания effects
- **AND** исходные данные и не относящееся к фиче состояние не изменяются

#### Scenario: Complete an asynchronous business operation
- **WHEN** запрошенная фича использует внешний эффект
- **THEN** reducer описывает эффект, существующий либо явно подключённый handler выполняет его, а result action проходит через ту же композицию
- **AND** бизнес-успех/ошибка проверяются по соответствующему состоянию, а не выводятся из завершения dispatch

#### Scenario: Distinguish routing from state location
- **WHEN** action namespace отличается от имени свойства feature state
- **THEN** handler routing и адаптация state подключаются по их реальным публичным контрактам
- **AND** типовые ошибки не скрываются assertions или обходом проверки структуры state

### Requirement: Reuse the existing application composition
Skill SHALL расширять существующую state/action/reducer/effector композицию только в пределах запрошенной фичи. Он MUST сохранять store instance и совместимые global effect handlers. Подключение или замена shell MUST NOT выполняться как скрытая часть разработки фичи.

#### Scenario: Extend a connected application
- **WHEN** совместимые root state, reducer, effector и store уже доступны
- **THEN** новая фича включается в их composition point с сохранением прежних частей
- **AND** handler одного типа эффекта не дублируется и второй store/provider не создаётся

#### Scenario: A composition is missing
- **WHEN** задача требует работающей интегрированной фичи, но совместимого composition point нет
- **THEN** агент сообщает о необходимом отдельном подключении основы и incomplete интеграции
- **AND** локальный reducer test не выдаётся за готовность приложения

#### Scenario: Repeat the task
- **WHEN** skill применяется повторно к уже реализованной фиче
- **THEN** агент проверяет либо изменяет существующий модуль без дублирования state slices, action routing или effect registration

### Requirement: Observable application of the skill
Готовность skill SHALL подтверждаться результатом его применения к реалистичной изолированной задаче, а не только форматом Markdown. Проверки MUST включать type compatibility публичных imports, переходы, effect/result flow и сохранность соседнего состояния. Отсутствующие проверки SHALL оставаться видимыми в отчёте.

#### Scenario: Evaluate a generated feature
- **WHEN** независимый агент получает skill и framework-free fixture с реальным common artifact
- **THEN** созданная фича проходит consumer type checks и поведенческие probes без доступа к исходному workspace библиотеки
- **AND** отдельно проверены изменения и повторное применение, а не только чтение текста skill

#### Scenario: Evidence is incomplete
- **WHEN** часть требуемой интеграции или проверок недоступна
- **THEN** отчёт различает проверенную FC-логику и непроверенную готовность приложения
- **AND** успешная компиляция сама по себе не объявляется доказательством всего бизнес-поведения

### Requirement: Independent native plugin delivery
Plugin `gost-functional-core` SHALL иметь собственные SemVer/changelog и один одноимённый skill в общем marketplace `gost` для Codex и Claude Code. Оба харнеса MUST устанавливать одинаковое содержимое из выбранного snapshot. Опубликованные version tags MUST NOT перемещаться или переиспользоваться. Установка MUST NOT запускать skill, менять приложение или автоматически обновлять другие плагины.

#### Scenario: Install the plugin in both harnesses
- **WHEN** каждый харнес штатно устанавливает functional-core plugin из одного доступного snapshot в изолированный профиль
- **THEN** в свежей сессии обнаруживается один skill с правильной идентичностью и читаемым recipe
- **AND** manifests/version и все установленные файлы соответствуют выбранной поставке

#### Scenario: Keep plugin versions independent
- **WHEN** подготавливается новая версия functional-core plugin
- **THEN** shell plugin и npm-пакеты сохраняют свои версии и содержимое
- **AND** release tag выбирает весь marketplace snapshot и требует отдельного release approval

#### Scenario: Repeat a native installation
- **WHEN** functional-core plugin повторно устанавливается из той же поставки
- **THEN** доступен один логический skill с прежним содержимым recipe
- **AND** установленный shell plugin не удаляется и не подменяется

### Requirement: Self-contained isolated plugin content
Новый plugin MUST содержать собственные инструкции и references без cross-plugin links, private consumer source или доступа к исходному checkout. Проверка каталогов SHALL отличать две ожидаемые идентичности и отклонять missing/duplicate/mismatched entries, перенаправление source и выход файловых ссылок за пределы соответствующего plugin root.

#### Scenario: Read an independently installed plugin
- **WHEN** functional-core plugin установлен без shell plugin и без доступа к авторскому checkout
- **THEN** его skill и recipe читаются полностью из собственной поставки
- **AND** инструкция не требует наличия другого AI-инструмента или skill

#### Scenario: Reject an inconsistent catalog or content
- **WHEN** одна entry отсутствует, продублирована, выбирает другой source либо reference уходит в соседний plugin
- **THEN** проверка сообщает файл и причину и не объявляет поставку готовой
- **AND** прежние metadata/privacy/URI/containment проверки shell plugin сохраняются
