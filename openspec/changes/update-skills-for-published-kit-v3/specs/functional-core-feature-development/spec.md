## MODIFIED Requirements

### Requirement: Pure transitions and explicit effect flow
Reducers MUST выполнять чистые детерминированные immutable transitions без I/O, скрытого store или мутации входов. При замене state SHALL возвращаться полное состояние соответствующего уровня. Фича MUST использовать готовые effects приложения и MUST NOT определять effect types/effector. Исполнение и обработка внешних данных MUST оставаться на уровне приложения; контракт и реализация ApiEffect — отдельная работа gost-kit/app.

#### Scenario: Verify feature transitions
- **WHEN** reducer обрабатывает action при неизменяемых исходных feature/root states
- **THEN** результат содержит ожидаемые полное состояние и описания effects
- **AND** исходные данные и не относящееся к фиче состояние не изменяются

#### Scenario: Complete an asynchronous business operation
- **WHEN** запрошенная фича использует внешний эффект
- **THEN** reducer описывает существующий эффект приложения; его callbacks преобразуют результат API-операции (после mapper, если он задан) или ApiError[] в actions фичи, а общий обработчик приложения исполняет эффект и dispatch-ит эти actions через ту же композицию
- **AND** бизнес-успех/ошибка проверяются по соответствующему состоянию, а не выводятся из завершения dispatch

#### Scenario: Distinguish routing from state location
- **WHEN** action namespace отличается от имени свойства feature state
- **THEN** handler routing и адаптация state подключаются по их реальным публичным контрактам
- **AND** типовые ошибки не скрываются assertions или обходом проверки структуры state

## ADDED Requirements

### Requirement: Mapped API operation guidance
Для совместимого опубликованного API skill SHALL показывать описание операции с DTO→domain mapper, чистое создание эффекта reducer и исполнение общим effector приложения. Успешный callback MUST получать результат mapper; ошибка MUST преобразовываться в action по фактическому контракту пакета. Примеры SHALL проверять типы и выполнение нескольких операций, сохраняя разделение reducer unit и app integration tests.

#### Scenario: Domain result from an API operation
- **WHEN** опубликованный API поддерживает операцию с mapper
- **THEN** reducer возвращает описание эффекта без выполнения mapper или запроса
- **AND** общий обработчик выполняет запрос и преобразование, затем dispatch-ит action с доменной моделью

#### Scenario: Failed request or mapping
- **WHEN** запрос либо mapper завершается ошибкой
- **THEN** проверка подтверждает error action и фактическую категорию ошибки без ложного success action
- **AND** исключения callbacks/dispatch различаются с ошибками запроса или mapper

#### Scenario: Multiple response types
- **WHEN** root effect объединяет операции с разными ответами
- **THEN** проверки типов сохраняют связь операции, параметров, результата mapper и result actions
- **AND** несовместимость не скрывается any, assertions или частными imports
