# Proposal

## Why

Нужен skill, который помогает выносить вычисления представления из компонентов
в чистые, легко тестируемые функции. Он не должен требовать FC/store или смешивать
presentation calculations с бизнес-состоянием и обработкой событий.

## What Changes

- Добавить английский skill `gost-view-presenter` для создания/изменения pure
  presenters, их композиции и использования готовых результатов компонентом.
- Поставлять его отдельным plugin 0.1.0 unreleased в marketplace `gost` для
  Codex/Claude, независимо от shell и functional-core plugins.
- Проверить generated code: обычные input/output tests без store/FC, отдельно
  Svelte 5 reactive/component integration. Это первый проверяемый UI target,
  а не обязательная зависимость чистых TypeScript presenters.
- Сохранять существующие источники данных, callbacks, state ownership и
  event workflows проекта. Не устанавливать/менять FC/shell ради presenter.

## Capabilities

### New Capabilities

- `component-presentation-development`: portable skill выделения/изменения
  чистых presentation functions, интеграции готового view data и их проверки.

### Modified Capabilities

Нет. Существующий distribution contract уже допускает несколько независимых
plugins; третий plugin использует этот workflow без изменения требований shell.
Контракт #78 не переписывается: его pure/rendering части служат источником,
но полный FC/presenter contract не навязывается проекту этим skill.

## Impact

Будущая реализация: `plugins/gost-view-presenter/`, третий local entry в обоих
каталогах, минимальное расширение существующего checker/tests, synthetic fixture
без FC/common/shell и текущая документация. Содержимое двух прежних plugins,
пять npm-версий и proposed/Pending неизменны. Нет нового presenter runtime,
линтера, automatic dependency upgrade, миграции asc-admin или реального release.

Scope — [#79](https://github.com/antonsmolko/gost-spec/issues/79); база main
`f0a936c36458225dd58a896e7f5f6257dcf99821` после archive PR83. Ветка плана
`feature/gost-spec-79-presenter-skill-plan`, prefix `[gost-spec-79]`.
Owner уточнил независимость presenter от FC и имя `gost-view-presenter`.
Сейчас создаётся только план; implementation progress0/6.
