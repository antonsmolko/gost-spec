# Design

## Context

Мотивация — [proposal](proposal.md). Публичный scope —
[#70](https://github.com/antonsmolko/gost-spec/issues/70).
[PR #69](https://github.com/antonsmolko/gost-spec/pull/69) доставлен в main
как `57c70bd`; его основная distribution spec — база этой дельты.
Ветка `feature/gost-spec-70-plugin-release-tags`, prefix `[gost-spec-70]`.

Наблюдаемое состояние до реализации: Claude использует `git-subdir` с SHA
`f567ab5ad04b139b25a75c9d65c735abe51c3065`, Codex — локальный источник.
Checker читает историческое Git-дерево; integration fixture создаёт content commit.
Плагин содержит восемь файлов и имеет версию 0.1.0 unreleased. Публичных релизных
тегов пока нет. Это исходное состояние, а не evidence нового способа установки.

### Official baseline

- [OpenAI plugin packaging](https://developers.openai.com/plugins/build/plugins):
  локальный source в каталоге, регистрация Git marketplace с `--ref`.
- [Claude marketplace guide](https://code.claude.com/docs/en/plugin-marketplaces):
  строковый source относительно корня маркетплейса.
- [Claude native commands](https://code.claude.com/docs/en/plugins/cli-reference#plugin-marketplace-add):
  `owner/repo#ref` выбирает branch/tag; refresh сохраняет выбранный ref.
- Поддерживаемый upstream-пример: [официальный каталог Anthropic, snapshot
  a2e251d](https://github.com/anthropics/claude-plugins-official/blob/a2e251d9b97b909bf728b3e84fc8d17e6aba0063/.claude-plugin/marketplace.json),
  entry `agent-sdk-dev`, source `./plugins/agent-sdk-dev`.

Read-only help подтверждён для Codex 0.166.0 и Claude Code 2.1.308.
У Claude нет флага `--ref` в help: используется documented source fragment.
Сведения из документации и help не подменяют будущую native-проверку тега.
Конкретная потребность проекта — выбирать один выпуск общего дерева в обоих
харнесах без зависимости от способа merge. Штатных источников достаточно:
собственный installer, release CLI и resolver не вводятся.

## Goals / Non-Goals

**Goals:** один выбранный snapshot, одинаковые установленные файлы, обычный PR
и тег после merge, работоспособная проверка файлов до появления тега.

**Non-Goals:** реальный выпуск, изменение skill/recipe или fc/shell поведения,
перенос стандартов #71, общий рефакторинг #62, размещение тестов #63,
применение к asc-admin, автоматизация создания тегов и новые public APIs.
Нормативные content/compatibility gates #20/#26 сохраняются независимо от
результатов проверок плагина.

## Decisions

### Approaches

Выбран согласованный владельцем выпуск через SemVer и Git-теги. Каталоги
указывают на локальное общее дерево внутри выбранного snapshot.
Прежний внутренний SHA оставлял отдельные content/catalog commits и требования
к истории merge. Тег в самом plugin source сохранял бы два уровня выбора ревизии.
Публикация через npm добавила бы другой канал поставки без текущей необходимости.
Эти альтернативы не нужны для выбранного outcome.

### Catalog and filesystem contract

Claude entry получает `source: "./plugins/gost-svelte-shell"`.
Codex сохраняет `{ "source": "local", "path": "./plugins/gost-svelte-shell" }`.
В обоих остаются marketplace `gost` и единственная identity `gost-svelte-shell`.
Нет source SHA, URL или отдельного ref у записи плагина.

Вход обычного checker — явно переданный root либо cwd. JSON и файловые пути
считаются непроверенными. Источники должны точно соответствовать указанным
формам и общему plugin directory; внешние Git sources, иной path или legacy
`git-subdir` дают диагностическое сообщение с каталогом и причиной.
Сохраняются object-JSON validation, SemVer/equality manifests, changelog entry,
восемь обязательных файлов, отсутствие постороннего содержимого, защита от symlink
и escaping/encoded/file-URI путей. Внешние non-file URI не становятся локальными
путями. Защита от повторного authoring tree `skills/` в тестах сохраняется.

`checkPluginDistribution(root): Promise<string[]>`, read-only поведение и CLI
сохраняются: пустой diagnostics/exit 0 означает только корректность файлов,
diagnostics/exit 1 — ошибку поставки, лишние аргументы/exit 2 — ошибку вызова.
Отсутствующие/нечитаемые файлы и invalid/null JSON дают диагностику, а не успех.
Удаляется только Git-object/source-pin validation и связанная fixture-подготовка.
Проверка корректной копии без `.git` не запускает Git и не обращается в сеть.

### Version and tag contract

Релизный тег имеет вид `gost-svelte-shell-v<manifest-version>` и выбирает
**весь snapshot маркетплейса**. Он не разрешает сочетать разные ревизии его
записей. Версии плагинов и npm-пакетов при этом остаются независимыми.

Проектное решение для реализации: подготовить **0.2.0 unreleased** в обоих
manifests и changelog. Это смена delivery contract до 1.0; minor соответствует
действующей политике плагина и отличает новый выпуск от кешей 0.1.0.
Пример 0.1.1 из обсуждения не является уже опубликованным выпуском.
Все пять npm-workspaces, их содержимое и версии остаются прежними.
Фразу «five standards packages» в plugin README и соответствующем требовании
заменяем формулировкой без количества: это устраняет зависимость #71 от plugin edit.

Порядок выпуска: подготовка версии → проверенный PR → merge любым обычным
методом → проверка фактического результирующего main commit → отдельное
разрешение конкретного выпуска → создание и push тега на этот commit.
Обычные рабочие commits тегов не получают. Даже если main уже продвинулся,
выбирается проверенный результирующий commit этого выпуска, а не случайный HEAD.
Фактическое plugin/catalog дерево должно совпадать с проверенной поставкой.

Release verification — отдельная ручная процедура, не новый режим draft checker:
получить точный тег, разрешить его через `git rev-parse '<tag>^{commit}'`,
проверить принадлежность результирующей ревизии истории main, содержимое обоих
каталогов, manifest SemVer, changelog и installed hashes. Annotated и lightweight
теги разрешаются до commit одинаково. Отсутствующий тег/не-commit, неподходящая
ревизия, version mismatch или попытка переиспользования опубликованного тега
означают отказ подтверждать выпуск. Не выполнять force-update тега; новый
выпуск получает новую версию. До первого release approval реальные теги не создаются.

Теги доверены сопровождающему; их неизменяемость — политика выпуска, не
криптографическая гарантия Git. Evidence хранит resolved commit и hashes, чтобы
перемещение тега можно было выявить. Branch protection и подпись тегов здесь не вводятся.
Native host способен установить плохо названный тег: release verification обязан
обнаружить mismatch, но не обещает, что сам host реализует наш version gate.

### Native selection and cache behavior

Документируемые формы регистрации после доступности выпуска:

```sh
codex plugin marketplace add antonsmolko/gost-spec --ref gost-svelte-shell-v0.2.0
codex plugin add gost-svelte-shell@gost
claude plugin marketplace add 'antonsmolko/gost-spec#gost-svelte-shell-v0.2.0'
claude plugin install gost-svelte-shell@gost
```

В apply они проверяются на disposable Git origin с релизными тегами; конкретные
команды update/remove/re-add/reinstall фиксируются по фактическому результату
тех же native CLI. Смена тега должна явно менять registration ref, одного refresh
не достаточно. При необходимости перерегистрации заранее описывается, что removal
может удалить другие плагины и их данные; записывается наблюдаемый native результат.
Не обещаем бесшовный upgrade или сохранение кешей/данных через удаление.

Успех требует новой сессии/discovery и equality всех восьми установленных файлов
выбранному дереву, единственного active skill, доступного recipe и ожидаемых
identity/version. При отказе команды или наличии stale cache отчёт указывает
фактическую активную поставку и incomplete. Нет fallback на main/иной тег.
Повторная установка того же тега не должна дублировать skill.

### Migration and rollback

Уже установленный `gost-svelte-shell` 0.1.0 переводится с SHA workflow на
выбранный опубликованный тег через явную перерегистрацию и native reinstall/update.
Старый ID `gost-svelte-spa-state` сначала явно удаляется: автоматический rename
по-прежнему не обещается. Новый способ не меняет приложение и совместимость recipe.

Для новых релизов возврат — явный выбор прежнего существующего тега и проверка
installed tree. Первому выпуску не придумываем несуществующий предыдущий тег.
Legacy-возврат к old ID без release tag сохраняет прежнюю условную процедуру:
Codex выбирает старый catalog commit; Claude требует восстановленного мейнтейнером
старого catalog entry, old ID, content SHA и matching Codex delivery. Это отдельная
legacy-поставка, не требование вернуть `source.sha` в текущий release catalog.
Пока она недоступна, сообщаем unavailable и фактическую identity.

## Risks / Trade-offs

- Кеш host может сохранить прежние файлы → отличающаяся версия и проверка всех
  установленных bytes после update/rollback; version string не является evidence.
- Refresh фиксированного тега не выбирает новый выпуск → явная смена registration.
- Недоступность сети/CLI → native readiness incomplete, file check остаётся отдельным.
- Тег выбирает весь каталог → это прямо описано, per-plugin resolver не добавляется.
- Слишком широкая правка checker → сохранить непиновые отрицательные проверки;
  общий рефакторинг остаётся #62.

## Migration Plan

1. RED: тест корректной file-only копии и локального Claude source, отказ от
   перенаправления/legacy source; зафиксировать падение текущего checker.
2. Минимально изменить каталоги/checker/fixtures; подготовить 0.2.0 unreleased
   и count-neutral документацию без изменения skill/recipe и стандартов.
3. В disposable origin смоделировать обычный squash в main, затем два локальных
   release tags разных версий с различимым содержимым. Fresh main-only checkout
   и экспорт без `.git` должны проходить file check. Публичный origin не менять.
4. В каждом харнесе проверить install/discovery/read, repeat, явный переход A→B,
   возврат B→A, недоступный тег и неверно названный тег/version mismatch.
   Отдельно проверить переход legacy 0.1.0 и old ID; отсутствие legacy rollback
   отмечать явно, не выдавать за успешный возврат.
5. Использовать отдельные `CODEX_HOME`/`CLAUDE_CONFIG_DIR`, synthetic SPA и
   зафиксированные CLI versions. Инициализация config однократна; helper не должен
   перезаписывать его перед discovery. Проверить hashes synthetic app и личных
   профилей до/после без копирования credentials и без записи в asc-admin.
6. Полный suite на Node 26.0.0 и 26.11.1, real packed artifacts/external consumers,
   strict OpenSpec, audit ссылок и независимое whole-result review. Публичную
   установку не заявлять на основании loopback/native экспериментов.
7. Обновить текущие architecture/roadmap/handoff и #70, сохраняя архивные факты.
   Реализация оформляется отдельным PR с одобрением перед merge; настоящий тег требует отдельного
   release approval. После завершения #70 можно реализовывать layout #71.

## Review ledger

Sources read: public issue [#70](https://github.com/antonsmolko/gost-spec/issues/70)
и все его comments (на этапе планирования список пуст), merged
[PR #69](https://github.com/antonsmolko/gost-spec/pull/69), official baselines выше.
Предыдущие закрытые findings PR #69 не переоткрываются: их контракт — исходная база,
а не дефект текущей реализации, которую этот план ещё не изменяет.

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| [#70](https://github.com/antonsmolko/gost-spec/issues/70) | Зависимость content/catalog commits от истории merge | Distribution delta, design, tasks | Planned | Local snapshot sources и раздельные draft/release проверки определены выше; реализация ещё не начата |
| Independent review: private input, not a public basis; actionable scope [#70](https://github.com/antonsmolko/gost-spec/issues/70) | Проверка полноты и согласованности плана | Все шесть planning/handoff файлов | Reviewed, no actionable findings | Fresh-context reviewer независимо проверил полный diff, сохранение сценариев/gates, native baseline, issue dependencies, strict validation и 31 локальную ссылку изменённых Markdown; runtime/native эксперименты не запускал |

### GitHub issue edits

В #70 статус draft заменён на подготовленные четыре артефакта и 0/9 выполненных
implementation tasks, review in progress и явный порядок #69 → #70 → #71.
Review завершено без actionable findings; итоговый статус #70 дополнен этим
результатом, 0/9 и immutable ссылками на сохранённые артефакты после push.
Критерии #70 не расширяются; #54/#55/#64 и #20/#26 не редактируются этим планом.
Private owner decisions — private input, not a public basis; публичная actionable
основа — требования #70. Планирование не разрешает merge или настоящий выпуск.

### Planning verification

Strict validation change и обеих main specs проходит; полный `npm run check`
прошёл 72/72 на Node 26.0.0 и 26.11.1, включая real packed artifacts/external
consumers. Это проверка неизменной текущей реализации, а не нового tag workflow.
Изменены только шесть planning/handoff файлов относительно main `57c70bd`;
runtime, каталоги, plugin bytes, npm-workspaces и версии неизменны.

Отдельно выполнен воспроизводимый Git-tree audit командой из
[PR65-R3](https://github.com/antonsmolko/gost-spec/blob/57c70bd/openspec/changes/archive/2026-11-01-package-state-foundation-plugin/design.md#pr65-r3):
109 Markdown, 172 path links + 2 same-file anchors, 0 errors;
Markdown path-list SHA256 `f2fd9d7d3a660eb734733827dad9b1b3d64ab7c98c1c58f594695d2e9253b234`.
Проверены полный diff, неизменные README/product-design/roadmap с прежним SHA
контрактом и issue #70/#71/#20/#26. Прежние документы пока описывают действующую
реализацию; tasks 1.2/2.2/4.1 заменяют эти формулировки при apply. Зависимость
#69 → #70 → #71 согласована, gates #20/#26 остаются прежними.
Независимое fresh-context review всего плана завершено без actionable findings:
reviewer отдельно подтвердил неизменность runtime diff, полноту delta scenarios,
official baseline, public dependencies, strict validation и 31 локальную ссылку
изменённых Markdown без ошибок. Он не повторял full suite и native experiments.
Будущие RED/GREEN/native результаты не заявляются как уже полученные.
