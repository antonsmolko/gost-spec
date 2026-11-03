# Proposal

## Why

Владелец выбрал понятное разделение: общие инженерные правила, TypeScript и
frontend с общей архитектурой и Svelte. FSD не зависит от Svelte; отдельный
`stacks/frontend/svelte-spa` сейчас содержит только этот архитектурный профиль.

## What Changes

- **BREAKING**: вместо пяти workspaces оставить четыре:
  `packages/core`, `packages/typescript`, `packages/frontend/core`,
  `packages/frontend/svelte`.
- Перенести FSD в frontend/core; убрать пустой unreleased stack package.
  Четыре surviving npm-имени и независимые версии сохраняются.
- Сохранить ID, proposed/Pending статусы и смысл правил; applicability FSD
  описывает frontend-проекты, явно выбравшие FSD, без привязки к Svelte.
- Обновить workspace/lock metadata, tarball/consumer проверки, текущие ссылки,
  inventory и approval guidance. Сохранить содержательный release minimum:
  core + TypeScript + FSD, а не любой frontend-документ вместо FSD.

## Capabilities

### New Capabilities

- `standard-package-layout`: четыре document-only пакета с понятным размещением,
  ownership правил и сохранёнными границами принятия/выпуска.

### Modified Capabilities

- `state-foundation-plugin-distribution`: отвязать сохранение независимых версий
  стандартов от исторического числительного «пять»; поставка плагина не меняется.

## Impact

Root workspaces/lock, package repository.directory/README/changelog, FSD document,
artifact/accepted-header fixtures, AGENTS, architecture/inventory/approval docs
и package wording issues20/26. Общие и frontend правила разделяются по области
применимости; пакет frontend не делает FSD обязательным для всех проектов.

Outcome — [#71](https://github.com/antonsmolko/gost-spec/issues/71), ветка
`feature/gost-spec-71-standard-package-layout`, prefix `[gost-spec-71]`.
Владелец явно согласовал четыре пакета вместо прежних пяти; metadata/publication
решения проверяются перед removal. Релизные теги #70, рефакторинг #62, перенос
тестов #63, принятие контента, merge/publication и применение к asc-admin отдельно.
Archive PR69 не расширяется; перед реализацией нужно интегрировать его базу.
