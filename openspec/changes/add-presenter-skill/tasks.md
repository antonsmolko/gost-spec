# Tasks

План #79; implementation0/6. [Design](design.md) фиксирует scope/baseline,
[spec](specs/component-presentation-development/spec.md) — observable behaviour.
Публичный skill/recipe/README — English, план — русский.

## 1. Presentation workflow

- [ ] 1.1 Создать synthetic Svelte5 fixture без common/shell/FC по выбранному upstream baseline и unit/browser probes; до skill проверить RED на отсутствующих/неверных calculations и baseline задачи без skill, не называть успешный baseline RED. README описывает одинаковый запрос, input/context, команды и independent evidence; strict browser server policy исключает переиспользование stale server. Проверить отсутствие FC dependencies/imports и контроль сохранности callbacks/соседних файлов.
- [ ] 1.2 Написать краткий English `gost-view-presenter` skill и recipe с ordinary pure functions, явными inputs/context, independent/composed outputs, component binding и готовыми values/booleans/rows; не требовать FC/state manager и не менять events/data source. Pure unit tests без DOM/store и отдельно Svelte types/build/browser подтверждают complete synthetic пример; policy-negative cases классифицируются вручную. Pinned authoritative source/revision/status и missing-source incomplete проверены без author checkout; формат skill не заменяет behaviour.
- [ ] 1.3 Независимо применить skill к extraction/new/change/repeat/no-calculation и missing-input/source cases в disposable consumers. Проверить generated files, pure output/immutability/composition tests, reactive input/branch/row updates и preserved callbacks в Chromium; сохранить запросы/результаты/limitations. Не создавать дублирующий presenter/store, не добавлять FC, не заявлять чужие framework adapters или lint proofs. Исправлять только наблюдённые проблемы инструкции; recipe/docs отражают actual evidence.

## 2. Independent plugin delivery

- [ ] 2.1 Собрать plugin0.1.0 unreleased с двумя manifests и local entries в обоих marketplaces. До изменения checker получить RED на absent/mismatched third plugin, duplicate/redirect/cross-plugin paths; затем добавить только нужный descriptor/coverage, сохранить прежние gates/root-skills guard/regressions. README/changelog/root source listing содержат actual identity/tag forms/границы. Проверить полное дерево, ссылочный containment, корректные diagnostics и byte-неизменность shell/FC plugins и пяти npm-пакетов; не выполнять рефакторинг #62.
- [ ] 2.2 В disposable native profiles Codex/Claude установить plugin отдельно/рядом с прежними, повторить установку, fresh discovery/read reference, сравнить все installed bytes с выбранным Git snapshot и личные/app fingerprints до/после. Сохранить команды/версии/URL/revision и честные ограничения loopback/public-host evidence; missing harness не закрывает задачу. Публичный README согласовать с реально проверенными штатными формами установки, без auto-application и настоящего release/tag.

## 3. Integration and review

- [ ] 3.1 Выполнить full npm run check на обоих Node с real packs/external consumers, strict change/main specs и whitespace. Отдельно проверить complete diff, unchanged contracts/#79 criteria, links/anchors и source/status compatibility; обновить handoff/product overview/roadmap/#79 и evidence. Провести независимое fresh-context review всего результата, закрыть findings с canonical dispositions/replies, представить один implementation PR. Сохранить proposed/Pending и отдельные merge/release gates; #71/#62/#63/asc-admin не изменяются.

## Workflow follow-up

- После review/approval этого плана — отдельный apply request.
- Merge implementation, sync/archive и реальный выпуск/тег требуют отдельных указаний.
- Другие framework adapters, business/FC/events changes и app migration — отдельный scope.
