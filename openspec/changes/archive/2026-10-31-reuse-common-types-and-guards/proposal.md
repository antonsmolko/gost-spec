# Proposal

Исправление proposed стандарта: [#52](https://github.com/antonsmolko/gost-spec/issues/52).
Carrier [#51](https://github.com/antonsmolko/gost-spec/issues/51), retained prefix
`[gost-spec-52]`; критерии и закрытие carrier не меняются. Гигиена репозитория —
отдельный outcome [#53](https://github.com/antonsmolko/gost-spec/issues/53), не часть
будущего PR стандарта.

## Why

Владелец запросил использовать перенесённые в gost-kit общие типы и guard,
а также закрепить это в gost-spec. Конкретный случай — functional-core example:
Nlx/Ulx/Vdx, async callbacks, устранение локальных AnyFunction и объединение
value/type imports. Запрос в рабочем диалоге — private input, not a public basis;
публичный текст требования самодостаточен, приватный код не копируется.

## What Changes

Добавить proposed/required TS-COMMON-001: обязательное переиспользование
@gost-kit/common при точном совпадении контракта в проектах, явно выбравших эту
library policy, публичные импорты и объединение value/type imports. Организация
типов по файлам остаётся конвенцией проекта потребителя. Сохранить прежнюю
Local-only disposition и rationale до отдельного content decision: pending
стандарт не заменяет принятое положение.

## Capabilities

Новый документ, skip_specs: true. Упаковка и выполнение standards не меняются.

## Impact

Только TypeScript standard, индексы, design/plan/handoff, pending content decision
и empty changeset. Библиотека остаётся отдельным неопубликованным проектом;
документальный пакет не устанавливает её автоматически. Нового runtime,
автолинтера, принятия точного текста, версий, merge или публикации нет.
Историческая работа была local-only без issue. Review-исправления отслеживаются
в #52 на carrier-ветке `feature/gost-spec-51-state-foundation-plan`. PR не создан;
интеграция стандарта, гигиена и реализация skill должны оставаться разными PR.
