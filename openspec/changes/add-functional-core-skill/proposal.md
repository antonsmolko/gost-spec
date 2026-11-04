# Proposal

## Why

Существующий `gost-svelte-shell` подключает основу приложения, но не описывает
повседневную разработку бизнес-фич через functional core. Нужен отдельный skill,
который помогает реализовать state/actions/reducers и effect flow по реальному
API gost-kit, сохраняя независимость от UI-фреймворка.

## What Changes

- Добавить английский skill `gost-functional-core` и компактный Public API recipe:
  создание/изменение запрошенной FC-фичи, включение в существующую композицию,
  чистые переходы и описания готовых эффектов приложения с receivers, проверка результата.
  FC фичи — state/action/reducer и colocated reducer test; эффекторы остаются
  на уровне приложения, контракт ApiEffect не проектируется этим skill.
- Поставлять его отдельным plugin версии 0.1.0 unreleased в общем marketplace
  `gost` для Codex и Claude Code; имеющийся shell plugin не менять.
- Дополнить существующие каталоги и их проверки ровно необходимым для двух
  независимых плагинов; сохранить текущие validation/privacy/containment gates.
- Проверить применение skill на framework-free consumer с реальным common
  artifact, а установку/discovery — в двух изолированных native профилях.

## Capabilities

### New Capabilities

- `functional-core-feature-development`: portable skill разработки FC-фич по
  публичному `@gost-kit/common` и его независимая native поставка.

### Modified Capabilities

- `state-foundation-plugin-distribution`: существующий shell plugin остаётся
  отдельной поставкой при появлении второго plugin в том же каталоге.

## Impact

Новый `plugins/gost-functional-core/`, обе marketplace entries, минимальные
изменения distribution checker/tests, один framework-free fixture и текущая
документация. Готовый `plugins/gost-svelte-shell/`, его версия/recipe, пять
npm-workspaces и нормативные статусы не меняются.

Outcome — [#75](https://github.com/antonsmolko/gost-spec/issues/75), ветка
`feature/gost-spec-75-functional-core-skill`, prefix `[gost-spec-75]`; база —
merged archive PR #74 (`82f9d7c`). Планирование не создаёт сам skill и не начинает
runtime-реализацию. Presenter, #71/#62/#63, переписывание asc-admin и настоящий
релиз/tag/publication остаются отдельными работами.
