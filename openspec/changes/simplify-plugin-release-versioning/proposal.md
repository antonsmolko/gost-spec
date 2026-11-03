# Proposal

## Why

Внутренний `source.sha` того же репозитория потребовал отдельных content/catalog
commits и восстановления истории после squash PR67. Владелец выбрал обычный
релизный порядок: версия плагина, PR, merge, затем тег на полученном main commit.

## What Changes

- **BREAKING**: оба native каталога выбирают общий plugin directory из выбранного
  snapshot маркетплейса; Claude больше не закрепляет отдельный content SHA.
- SemVer плагина и неизменяемый тег `gost-svelte-shell-v<version>` обозначают
  выпуск. Тег создаётся после merge и отдельного release approval; не на каждый commit.
- Описать выбор одного release tag обоими харнесами, обновление, возврат и
  переход с прежнего SHA workflow без скрытого fallback на main.
- Убрать Git-object dependency из обычной проверки рабочего дерева, сохранив
  проверки identity/version, self-containment, references и приватности.

## Capabilities

### New Capabilities

Нет: меняется существующий способ поставки.

### Modified Capabilities

- `state-foundation-plugin-distribution`: локальные источники внутри snapshot,
  SemVer/tag lifecycle, согласованный выбор/обновление/возврат в обоих харнесах.

## Impact

Каталоги, distribution checker и его integration tests, plugin README/changelog,
architecture/handoff и действующий distribution contract. Skill instructions и
recipe, Svelte 5 SPA scope и независимость версий пакетов стандартов сохраняются.
Упрощение их layout/количества выделено в #71; этот outcome их не меняет.

Outcome — [#70](https://github.com/antonsmolko/gost-spec/issues/70), отдельный
follow-up #55/#64. База контракта включает archive PR69; он остаётся отдельным
documentation outcome. План создаётся поверх его snapshot; реализация/main-target
PR начинаются после его интеграции. Новая ветка
`feature/gost-spec-70-plugin-release-tags`, prefix `[gost-spec-70]`.
Criteria/closure старого carrier54 и gates20/26 не меняются.

Рефакторинг62, перенос tests63, переименование stack пакета/папки, npm registry,
MCP servers, публичные tags/releases и применение к asc-admin не входят в outcome.
