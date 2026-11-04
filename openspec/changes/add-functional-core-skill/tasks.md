# Tasks

План #75, реализация 0/7. [Design](design.md) фиксирует API baseline и границы;
[feature spec](specs/functional-core-feature-development/spec.md) — поведение,
[distribution delta](specs/state-foundation-plugin-distribution/spec.md) —
сохранность shell plugin при двух entries. Skill/reference/README пишутся на английском.

## 1. Проверяемый feature workflow

- [ ] 1.1 Подготовить framework-free fixture и реалистичные feature probes с реальным packed common artifact из изолированной копии проверенного gost-kit source. До создания skill наблюдать отказ probes на отсутствующей фиче и выполнить baseline задачи без skill; записать фактические результаты, не объявляя успешный baseline RED. Проверить public package imports и отсутствие Svelte/source-path зависимостей.
- [ ] 1.2 Написать краткий SKILL.md и `references/functional-core.md` на основании API и наблюдавшихся ошибок: state/actions/reducers, effects/result actions, namespace/property composition и reuse root. Recipe должен компилироваться с реальным artifact; pure transitions, full-state replacement и сохранность соседнего состояния проверяются поведенчески. Формат skill проверяется отдельно и не заменяет эти проверки.
- [ ] 1.3 Выполнить независимое применение skill к созданию и изменению фичи, повторному вызову и отсутствующим artifact/composition в disposable consumers. Проверить реальные generated files, type checks, effects/result flow, отсутствие I/O в reducers, неизменность bootstrap/соседних частей и честный incomplete; исправлять только подтверждённые проблемы инструкции. Сохранить запросы, команды, результаты и ограничения evaluation.

## 2. Отдельная поставка в общем marketplace

- [ ] 2.1 Собрать self-contained plugin 0.1.0 unreleased с двумя manifests, README/changelog/license/icon и добавить local entries в оба каталога. До изменения checker выполнить RED для второго plugin, missing/duplicate/mismatched entries и cross-plugin path; затем минимально адаптировать checker/tests до GREEN, сохранив все существующие regression cases и root `skills/` guard. Обновить source/distribution указатели в `README.md`, `docs/superpowers/specs/2026-10-11-engineering-standards-design.md` и `docs/superpowers/plans/2026-10-11-engineering-standards-independent-packages.md`, проверить ссылки; shell tree/version и пять npm-workspaces должны остаться неизменными.
- [ ] 2.2 В изолированных native профилях обоих харнесов проверить FC install отдельно, repeat, установку рядом с shell и fresh discovery/read recipe; сравнить все файлы с выбранным disposable Git snapshot. Проверить отсутствие auto-application, сохранность synthetic app/personal fingerprints и config во время inventory; README содержит фактически проверенные полные Git URL формы и ограничения public-host evidence. Missing harness/evidence не закрывает задачу.

## 3. Итоговая интеграционная проверка

- [ ] 3.1 Запустить full `npm run check` на обоих поддерживаемых Node с реальными packed artifacts/external consumers, strict OpenSpec и whitespace. Отдельно проверить полный diff, unchanged contracts, ссылки/якоря и scope; обновить handoff/#75 и design evidence, различая baseline старой реализации, native installation и применение нового skill. Убедиться, что #71/#62/#63 и asc-admin не изменены.
- [ ] 3.2 Провести независимое fresh-context review полного результата по #75, specs и AGENTS.md; зафиксировать findings/dispositions и устранить открытые проблемы. Готовность требует working skill behavior и обоих native proofs, а не только Markdown/gate success; представить один implementation PR без автоматического merge/release.

## Workflow follow-up

- Apply начинается отдельным запросом после ревью этого плана.
- Sync/archive завершённого change и merge требуют своих запросов.
- Настоящий tag `gost-functional-core-v<version>` и выпуск — только после
  отдельного release approval на проверенный итоговый main commit.
- Presenter skill и технические задачи остаются самостоятельными outcomes.
