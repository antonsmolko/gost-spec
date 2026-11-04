# Design

## Context

Мотивация — [proposal](proposal.md). Публичный scope —
[#70](https://github.com/antonsmolko/gost-spec/issues/70).
[PR #69](https://github.com/antonsmolko/gost-spec/pull/69) доставлен в main
как `57c70bd`; его основная distribution spec — база этой дельты.
Ветка `feature/gost-spec-70-plugin-release-tags`, prefix `[gost-spec-70]`.
Это ветка исходного плана; его PR #72 вмержен как `b8d4211`. Реализация идёт
от этого main commit на `feature/gost-spec-70-release-tag-delivery` с тем же
issue prefix. Датированные review/planning snapshots ниже сохраняют свой scope.

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
`git-subdir` дают диагностическое сообщение с каталогом и причиной. Для Claude
различаются отсутствующий source, legacy Git source, неправильный тип и иной
path; сообщение также называет ожидаемый относительный путь без вывода URL/SHA.
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
codex plugin marketplace add https://github.com/antonsmolko/gost-spec.git --ref gost-svelte-shell-v0.2.0
codex plugin add gost-svelte-shell@gost
claude plugin marketplace add 'https://github.com/antonsmolko/gost-spec.git#gost-svelte-shell-v0.2.0'
claude plugin install gost-svelte-shell@gost
```

В apply эти полные Git URL формы проверяются на disposable Git origin с релизными
тегами; доступность и установка с публичного GitHub не заявляются. Конкретные
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
7. В task 1.2 обновить общий дизайн
   `docs/superpowers/specs/2026-10-11-engineering-standards-design.md` и roadmap
   `docs/superpowers/plans/2026-10-11-engineering-standards-independent-packages.md`,
   в task 2.2 — plugin README, в task 4.1 — handoff и #70. Проверить отсутствие
   предписаний content SHA для новой релизной поставки в этих документах,
   сохраняя отдельную legacy-процедуру возврата и архивные факты.
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

## PR #72 review follow-up — 2026-11-04

Прочитаны все страницы inline comments, summary reviews и PR comments
[PR #72](https://github.com/antonsmolko/gost-spec/pull/72): два inline findings,
два reviews без summary text, PR comments отсутствуют на момент чтения.
Предыдущее независимое review относится к исходному плану `017d4ee`;
новые публичные findings проверены отдельно, прежние closures не переоткрыты.

### PR72-R1

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| [Inline review](https://github.com/antonsmolko/gost-spec/pull/72#discussion_r4460498669) | Обновление SHA-контракта общего product design не закреплено явно за задачей | tasks.md task 1.2, design Migration Plan step 7, #70 | Fixed | Task 1.2 явно называет общий дизайн и roadmap с полными путями и требует проверки отсутствия content-SHA предписаний для новой релизной поставки; legacy-возврат сохраняется. Migration Plan связывает каждый документ с задачей. Scope уже включал эти документы; runtime-контракт и число задач не изменены |

### PR72-R2

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| [Inline review](https://github.com/antonsmolko/gost-spec/pull/72#discussion_r4460500810) | Слитные issue numbers в публичном proposal | proposal.md, #70 planning status | Fixed | Восстановлены `carrier #54`, `gates #20/#26`, `Рефакторинг #62`, `tests #63`; также исправлены `PR #67` и `PR #69`. Исторические номера и ссылки не меняются |

### GitHub issue edits for this round

В #70 planning status уточняется явная ответственность task 1.2 за общий дизайн
и roadmap; добавляются ссылки на PR72-R1/R2, корректируются слитные references
`Refactor62/test-location63`. Результат review и проверки обновляются в PR #72.
Acceptance criteria, зависимости #69 → #70 → #71, 0/9 implementation progress
и release/content gates остаются прежними; #71 и старые carrier issues не меняются.

### Verification for this round

Уточнение покрытия документов не меняет решения о native sources, release tags
или область реализации. Свежий полный `npm run check` проходит 72/72 на Node
26.0.0 и 26.11.1, включая packed artifacts/external consumers. Strict validation
change и двух main specs, `git diff --check origin/main` проходят. Отдельный
Git-tree audit: 109 Markdown, 172 path links + 2 same-file anchors, 0 errors;
команда и path-list hash совпадают с Planning verification выше.

Проверен полный шестифайловый diff PR и текущие unchanged product design,
roadmap и issue dependencies. Fresh-context independent review полного результата
подтвердило исправление R1/R2 без новых actionable findings; reviewer независимо
проверил strict validation, whitespace, все local links/anchors и публичные
#70/#71/#20/#26, merged PR #69 и все источники PR #72. Он не запускал full suite,
native experiments и сетевой аудит внешних URL. Review — private input, not a
public basis; actionable sources — публичные R1/R2 выше.
Реализация и native experiments не начаты. Публичные статусы и source-linked
ответы в оба inline threads завершаются после commit/push; их доставку независимое
review не подтверждает. Пустые summary reviews не содержат отдельных findings.

## Apply evidence — 2026-11-04

### Filesystem checks and prepared content

Новые behavior tests запущены до runtime-правок: два ожидаемых RED отказа —
старый checker отклонял локальный Claude source и принимал legacy Git source.
После минимальной замены source validation все 25 distribution tests проходят.
Удалены pin-only cases и Git preparation fixture; остальные отрицательные
проверки, CLI root/exit codes, root `skills/` guard и boundary checks сохранены.
Корректная копия без `.git` проходит и CLI с пустым PATH (без запуска Git).

Подготовлена 0.2.0 unreleased, оба каталога выбирают общее локальное дерево.
Plugin README описывает полный manual tag lifecycle и проверенные native команды,
стал независимым от количества npm-пакетов. Skill/recipe, все пять npm-пакетов
и их версии неизменны. Main spec сохраняет прежний снимок до отдельного sync;
актуальную дельту задаёт этот change. Общий product design и roadmap обновлены
по task 1.2, сохраняя отдельную legacy-процедуру.

### Disposable native verification

Codex 0.166.0, Claude Code 2.1.308. Исходный run проверял snapshot `f81a24b`;
его временные файлы не являются долговременными артефактами. Исторический
loopback origin `http://127.0.0.1:52331/origin.git` обслуживался штатным
`git-http-backend` с временным HTTP/CGI adapter. Public GitHub source и реальные
профили не менялись; это native loopback evidence, а не публичная установка.
Два профиля и synthetic SPA из трёх файлов; конфигурация инициализирована один раз.
Credentials не копировались, environment subprocesses ограничен системными
переменными. HOME не переназначался; персональные config/registry проверялись
только fingerprints. Standalone user skills, видимые Codex, не засчитывались
как plugin discovery.

| Fixture delivery | Resolved commit | Version / selection |
| --- | --- | --- |
| A, lightweight tag | `83c1adcb1bc38e1408cbd8b753305d1622e60bde` | `gost-svelte-shell-v0.2.0` |
| B, annotated tag | `5a563a4ab0d5b7e646ea6c5a3d248f734b0216a5` | `gost-svelte-shell-v0.2.1` |
| Legacy same ID catalog | `eadb38bbfe8b849e7f0a4b90a58d9021fbf58bd1` | branch `legacy-new`, 0.1.0 |
| Legacy old ID catalog | `18b389f509d1f3a61b7ed7c9ccb6c17408f6f283` | branch `legacy-old`, 0.1.0 |

A и B подготовлены в отдельных fixture-ветках и squash-merged в fixture main;
теги созданы на итоговых commits. B отличается manifests, changelog и README
marker. Свежий clone `--single-branch --branch main` и экспорт его файлов без
`.git` проходят checker; side-branch objects для поставки не требуются.

| Native scenario | Codex | Claude Code |
| --- | --- | --- |
| Fresh A, repeat A | один active skill, 8 файлов A | один enabled skill, 8 файлов A |
| Явный A → B, refresh B | 0.2.1, 8 файлов B; ref сохраняется | 0.2.1, 8 файлов B; ref сохраняется |
| Явный B → A | 0.2.0, 8 файлов A | 0.2.0, 8 файлов A |
| SHA-based 0.1.0 → A | явная перерегистрация, один новый skill | явная перерегистрация, один новый skill |
| Old ID → A | old удалён, затем один new skill | old удалён, затем один new skill |
| Недоступный тег после удаления | add/install exit 1, inventory пуст | add/install exit 1, registry пуст |
| Old ID недоступен в новом каталоге | install exit 1, фактический A сохранён | install exit 1, фактический A сохранён |
| Неверно названный тег v9.9.9 → A bytes | host install возможен; release verification отказ | host install возможен; release verification отказ |

33 verification records подтверждают actual identity/version, fingerprints
приложения и шести personal paths. Для каждой установленной поставки сравнены
все восемь файлов и прочитан recipe; hashes Codex/Claude совпадают с Git blobs.
Codex discovery — новый `codex --no-daemon app-server`, initialize/initialized,
`skills/list` с `cwds` synthetic SPA и `forceReload: true`; config hash до/после
discovery одинаков. Claude использует свежие CLI `plugin list --json` и
`plugin details`, включая `Skills (1)`.

Проверенные native формы — команды plugin README с loopback `.git` URL вместо
публичного GitHub `.git` URL: Codex `marketplace add <url> --ref <tag>`, Claude
`marketplace add '<url>#<tag>'`. Переключение: явный plugin remove/uninstall,
marketplace remove/add с нужным ref, install, restart/discovery. Refresh —
Codex `marketplace upgrade gost`, Claude `marketplace update gost`.
Наблюдаемое удаление marketplace различается: Claude удаляет установленный plugin
и сообщает о saved options/data; Codex оставляет enabled cached plugin до явного
`plugin remove`. Поэтому руководство явно удаляет plugin и требует actual inventory.

Первоначальный legacy trial не засчитан: временный сервер по умолчанию запрещал
fetch ancestor SHA (`Server does not allow request for unadvertised object`).
Прямой Git fetch воспроизвёл отказ; поддерживаемая настройка
[`uploadpack.allowReachableSHA1InWant`](https://git-scm.com/docs/git-config#Documentation/git-config.txt-uploadpackallowReachableSHA1InWant)
только в disposable bare origin исправила его. Профиль восстановлен native-командами,
затем оба legacy перехода повторены успешно. Это исправление test server,
не исключение нового release contract; реальные registry/config вручную не правились.

### Release verification and reproducibility

Manual procedure из plugin README выполнена на A/B: точный `refs/tags/<tag>^{commit}`,
main ancestry, оба manifest versions, changelog и полные installed hashes.
Отсутствующий tag, v9.9.9 с версией 0.2.0 и version-matching tag на legacy
commit вне main history не подтверждаются как выпуск;
обычный `git tag <existing-tag> <other-commit>` без force отказал в переиспользовании.
Теги fixture не публиковались. Исторические legacy catalogs подготовлены из
публичных plugin trees `b8d4211` и `385a0bce`; их pins — локальные fixture commits.
Восстановленная old catalog delivery проверена отдельно; существование старого
релизного тега не предполагалось.

Для воспроизведения native проверки: скопировать текущий plugin и оба каталога
в disposable Git repo, подготовить A в feature branch, squash в main и создать
локальный тег A; для B изменить только manifests/changelog и README marker,
повторить squash/tag (один тег annotated). Обслужить bare clone штатным
git-http-backend на loopback. Выполнить команды README с отдельными
CODEX_HOME/CLAUDE_CONFIG_DIR и synthetic cwd, сверить все installed файлы через
`git show <resolved-commit>:plugins/gost-svelte-shell/<path>` и SHA256.
Для legacy source использовать опубликованный исторический tree и доступный
SHA в этом же temporary origin; его server должен разрешать reachable SHA fetch.
Временные scripts/logs/JSON использовались только для локальной проверки в
датированном запуске; они не являются публичными артефактами или воспроизводимыми
ссылками и могут быть удалены системой. Повторная проверка не должна зависеть
от сохранности прежнего run: новый disposable repo и профили создаются заново
по процедуре выше. Публичная основа — контракты, команды и hashes в этом документе,
версионированные исходники/тесты и CI, а не локальные временные файлы.

SHA256 A исходного implementation snapshot `f81a24b` (до review-правки README):

```json
{
  ".claude-plugin/plugin.json": "f84bc3a0999941a4fc64497d155109b211475248b677c5486631c3ce0eca00ce",
  ".codex-plugin/plugin.json": "e00818390a7897fabb894d8905ebe9ee494b47b2fb38d5c699e2f76699b5a076",
  "CHANGELOG.md": "7aec1cb65f61c7eff792354b44a26f441f1f1932119c54059c967fa688bf690c",
  "LICENSE": "b30836d02111b64583c4eab07aef8f9ba79f7b699359521f740d5cab428b9666",
  "README.md": "0c4058aeeff6244dde8aa67425e2891325b7b7bee02c0988af874f88b6e336da",
  "assets/icon.png": "195c6abf4e183791242be0a91ddd9bf8b5c2369d80fbf037e342c69b983383ec",
  "skills/gost-svelte-shell/SKILL.md": "f6fce0d94a821fc18762e36e0adedf6b10f358aa9bc2a47f5930a59d22de2315",
  "skills/gost-svelte-shell/references/foundation.md": "30e97531684243b931c18a714c89dfbf5ceb8f621c1785f2c228dd68cfd22f8a"
}
```

### Apply verification and issue edits

Реализация оформляется отдельным main-target PR после merged plan #72. В #70
фиксируются branch, native evidence, фактический progress и verification;
PR #72 отмечается доставленным планом, а не завершённой реализацией #70.
Scope #71, исходные criteria/closure #54/#55/#64 и gates #20/#26 сохраняются.
Merge реализации, публичные tags/releases, archive/sync и применение к asc-admin
не выполняются автоматически. Итоговые suite/link checks и independent review
завершают tasks 4.1/4.2 ниже.

Свежие полные checks: 73/73 на Node 26.0.0 и 26.11.1, включая real packed
artifacts и external consumers. Distribution subset — 25/25, typecheck успешен.
Strict validation активной дельты и обеих main specs, whitespace check проходят.
Отдельно проверены полный diff, неизменные contracts/пакеты/recipe и публичные
dependencies; repository-wide Git-tree audit — 109 Markdown, 174 path links +
2 same-file anchors, 0 errors. Path-list SHA256 прежний, набор Markdown не менялся.
Personal fingerprints и synthetic SPA после native проверки сохранены; остановлен
только собственный loopback server. Native profiles и raw records были доступны
при исходном review; их дальнейшее хранение не гарантируется и не требуется
публичной процедурой воспроизведения.
Independent whole-result review завершено без actionable findings. Fresh-context
reviewer прочитал полный 12-file diff, artifacts, product design/roadmap/handoff,
public #70/#71/#20/#26 и все источники PR #72. Независимо выполнены full check
73/73 на Node 26.11.1, strict change/main specs, whitespace и link audit выше.
Все 33 native records и 149 command logs сопоставлены с actual Git blobs,
raw inventory и helpers; A совпадает с текущим plugin. Node 26.0.0 и native
команды reviewer не повторял. Review — private input, not a public basis;
публичный actionable scope — #70. Previous R1/R2 closures сохранены.

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| Independent review: private input, not a public basis; scope [#70](https://github.com/antonsmolko/gost-spec/issues/70) | Проверка полного результата реализации | 12 changed files, all native evidence | Reviewed, no actionable findings | Независимый full check 73/73, strict/link/contract review и проверка 33 native records по Git blobs; ограничения повторного запуска перечислены выше |

Implementation tasks 9/9; следующий delivery step — отдельный PR, затем явное
решение о merge. Реальные tags/releases и archive/sync требуют отдельных запросов.

## PR #73 review follow-up — 2026-11-04

Прочитаны все страницы inline comments, summary reviews и PR comments
[PR #73](https://github.com/antonsmolko/gost-spec/pull/73): пять inline findings,
один review без summary text, PR comments отсутствовали при чтении.
Предыдущий clean review относится к исходному snapshot `f81a24b`; публичные
findings этого раунда проверены отдельно. Закрытые PR72-R1/R2 сохраняются.

### PR73-R1

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| [Inline review](https://github.com/antonsmolko/gost-spec/pull/73#discussion_r4460864141) | GitHub shorthand в README не соответствует исполненной loopback Git URL форме | plugin README, design native forms, #70 | Fixed; вывод из отказа `#SHA` на `#tag` отклонён | Все регистрации в README/design используют полный `.git` URL и явно ограничивают evidence loopback-host. Новая fresh установка текущих восьми файлов прошла в обоих харнесах. Неподдержанный произвольный SHA и документированный branch/tag selector — разные случаи; отказ первого не является доказательством отказа второго |

[Официальный Claude command reference](https://code.claude.com/docs/en/plugins/cli-reference#plugin-marketplace-add)
описывает branch/tag ref и для GitHub source, и для полного `.git` URL;
[OpenAI plugin reference](https://developers.openai.com/plugins/build/plugins)
поддерживает Git URL и `--ref`. Это documented baseline, а не evidence установки
из публичного GitHub. Публичного release tag ещё нет, он не создаётся этим review.

### PR73-R2

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| [Inline review](https://github.com/antonsmolko/gost-spec/pull/73#discussion_r4460864147) | Недостаточно Codex source negative cases | plugin-distribution.test.ts | Fixed | 13 случаев: missing/null/string/array, remote/missing kind, missing/different/absolute/escaping path, extra ref/SHA/URL. Каждый подтверждает отказ с файлом каталога и отсутствие исправления данных checker-ом |

Дополнительно проверены три mutation-копии production checker вне рабочего дерева:
удаление `source.source !== "local"` вызывает два отказа новых тестов, удаление
path comparison — четыре, удаление проверки лишних keys — три. Неизменный checker
проходит все 13. Воспроизведение: в disposable копии удалить по одному указанному
условию и запустить `node --test --test-name-pattern='Codex snapshot' tests/integration/plugin-distribution.test.ts`.
Mutations не входят в поставку и не подменяют обычный suite.

### PR73-R3

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| [Inline review](https://github.com/antonsmolko/gost-spec/pull/73#discussion_r4460864153) | Blanket Claude source diagnostic не различает причины отказа | checker, tests, design source contract | Fixed | Сообщение различает missing, legacy git-subdir, неверный тип и неправильный path; сохраняет файл каталога и ожидаемый relative path, не выводит произвольные URL/SHA. Девять diagnostic tests наблюдались RED до runtime-правки и GREEN после |

### PR73-R4

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| [Inline review](https://github.com/antonsmolko/gost-spec/pull/73#discussion_r4460864163) | Эфемерные run/helper paths читаются как долговременные evidence references | design reproducibility and evidence | Fixed | Конкретные временные filesystem paths удалены из публичного описания; local logs отмечены как временные материалы исходного review. Воспроизведение создаёт новый repo/server/profiles по сохранённым командам и не зависит от прежних файлов |

Публичная основа file/runtime gates — committed checker/tests, команда Git-tree
audit выше и [CI Node 26.0.0](https://github.com/antonsmolko/gost-spec/actions/runs/41723617951/job/126222527174),
[CI Node 26.11.1](https://github.com/antonsmolko/gost-spec/actions/runs/41723617951/job/126222526835)
исходного `f81a24b`. Эти CI не выдаются за native proof; наблюдавшиеся native
результаты зафиксированы с hashes и процедурой, а сырые private local logs не
объявляются доступными для будущего читателя. Публикация private профилей и
temporary helper tooling не требуется для исправления этого finding.

### PR73-R5

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| [Inline review](https://github.com/antonsmolko/gost-spec/pull/73#discussion_r4460864166) | Удаление `.git` из file-only fixture — no-op | plugin-distribution.test.ts | Fixed | Вместо удаления тест явно требует отсутствие `.git` до вызова checker; CLI по-прежнему запускается с пустым PATH. Возврат Git-метаданных в fixture теперь нарушит явную precondition, а не будет скрыт удалением |

### Current content and native evidence

Изменился только README среди восьми plugin files. Исходные 33 records и hash
блок A выше относятся к `f81a24b`; они не объявляются hashes нового README.
Для текущего дерева выполнена новая fresh установка с tag selection в двух
новых disposable profiles: один active skill, recipe доступен, все восемь
файлов равны текущим исходникам и друг другу. Остальные семь SHA256 совпадают
с исходным блоком A; новый README SHA256 —
`1fc0e50985a3d93e701ca6fc7529c3d5ee4b1572cd8e9b3b97dcb2991d6f941c`.
Локальный fixture tag разрешился в `4c2d236f6b4f2520d121583d54f707bdf6e8f02c`.
Проверка выполнялась на полном loopback Git URL с теми же CLI versions,
без подмены config перед discovery; synthetic SPA и шесть personal fingerprints
сохранились. Это не проверка публичной GitHub установки или доступности release tag.

### GitHub issue edits for this round

#70 и PR #73 получают текущие test counts, source-linked dispositions R1–R5,
уточнение Git URL формы и ограничения native evidence. Предыдущий implementation
snapshot `f81a24b` с 73/73 и 33 records сохраняется как исторический.
Scope/dependencies #69/#72 → #70 → #71, 9/9 tasks, skill/recipe и пять пакетов
не меняются. Старые carrier issues и content/release gates не редактируются.

### Verification for this round

Distribution tests: RED 33 passed / 9 failed до изменения Claude diagnostic,
затем GREEN 42/42. Полный `npm run check` — 90/90 на Node 26.0.0 и 26.11.1,
включая реальные packed artifacts/external consumers. Strict change и обе main
specs, whitespace проходят. Отдельный tracked-tree audit: 109 Markdown,
174 path links + 2 same-file anchors, 0 errors; path-list hash не изменился.
Проверены полный 12-file PR diff, unchanged contracts/пакеты/recipe и public
dependencies. Остановлен только собственный временный сервер; personal
fingerprints после нового native run сохранены.

Независимое fresh-context whole-result review подтвердило исправление R1–R5
без новых actionable findings. Reviewer независимо запустил full suite 90/90
на Node 26.11.1, strict/whitespace/link checks; сверил два новых native records
со всеми восемью cache/source/Git blobs, raw commands и inventory. Он не повторял
Node 26.0.0, mutation probes, native CLI и полный аудит прежних 33 records.
Review — private input, not a public basis; actionable scope — публичные findings
PR #73 выше. Tracking и source-linked ответы в threads завершаются после push;
их доставку это review не подтверждает. Merge, tag/release и consumer changes
не выполнялись.

## Archive and spec synchronization — 2026-11-04

Реализация доставлена в main через
[PR #73](https://github.com/antonsmolko/gost-spec/pull/73), commit
`ba02bbd6b9af0e4e8db4bf7496d3c7c27e236142`; tree совпадает с reviewed `8e1dc77`.
Предыдущие planning/apply/review записи описывают свои исторические snapshots.
Публичный scope — [#70](https://github.com/antonsmolko/gost-spec/issues/70).
Согласование sync/archive — private input, not a public basis; публичное основание
scope — завершённый change #70 и merged implementation PR #73.

При исходном архивировании все четыре артефакта имели status done, CLI подтвердил
9/9 задач. В исходном sync `ae41a75` единственная дельта
`state-foundation-plugin-distribution` синхронизирована: четыре MODIFIED
и три ADDED блока перенесены полностью, `Claude catalog pins the plugin source`
удалён. Основная спецификация теперь содержит 11 требований / 27 сценариев;
title/Purpose и четыре не затронутых requirement blocks сохранены. Все старые
scenario names обновляемых требований присутствуют в дельте; их удаления нет.
После исходного sync дельта ничего дополнительно не применяла, operation headers
в main spec отсутствуют. Последующее уточнение legacy scope из review PR #74
описано ниже; оригинальная дельта сохраняется как история. Исходная fc/shell spec не меняется.

Change перенесён в `openspec/changes/archive/2026-11-04-simplify-plugin-release-versioning/`.
Исходные `.openspec.yaml`, proposal, tasks и delta сохранены byte-for-byte;
design дополнен только этим ledger. Из active list выбранный change исчез.
Обновлены входящие ссылки, product design/roadmap и handoff. Это один
documentation outcome на `feature/gost-spec-70-release-tag-archive`, prefix
`[gost-spec-70]`; ни runtime, ни plugin tree/catalogs/version, ни npm-пакеты,
ни release/content gates не меняются. Новый native прогон не требуется и
не заявляется. 0.2.0 остаётся unreleased, публичных тегов и применения к asc-admin нет.

### GitHub issue edits for archive delivery

В #70 статус дополняется завершённым sync/archive с отдельным documentation PR
и canonical archived ledger; прежние implementation/review snapshots остаются
историческими. Criteria и closure #70 и других issues не изменяются автоматически.
Skills остаются на английском. Следующие functional-core/presenter skills и
технические задачи #71/#62/#63 не реализуются и не объединяются с этим PR.

### Archive verification

Проверки исходного sync `ae41a75`: title/Purpose и четыре untouched blocks равны
исходному main; все семь transferred blocks равны дельте; removed block отсутствует, 9/9 tasks
и original metadata сохранены. Incoming links и полный documentation diff
проверены отдельно от runtime suite. Strict main-spec validation — 2/2,
whitespace проходит. Свежий полный `npm run check` — 90/90 на Node 26.0.0 и
26.11.1 с packed artifacts/external consumers; это проверка неизменной реализации,
а не новый native эксперимент. Отдельный Git-tree audit — 109 Markdown,
175 path links + 2 same-file anchors, 0 errors; Markdown path-list SHA256
`33f344a41d4cc1e97c8b1c97fac7fcdf6754b6e350070657b958610c35ce95e8`.

Независимое fresh-context whole-result review всех девяти файлов — без actionable
findings. Reviewer самостоятельно сравнил transferred/untouched blocks и артефакты,
проверил active list, scope/gates, incoming links, strict/whitespace, public #70,
merged PR #73 со всеми review sources и задачи #71/#62/#63; запустил full check
90/90 на Node 26.11.1. Node 26.0.0 и native CLI он не повторял. Review — private
input, not a public basis; actionable scope — public #70 и merged PR #73.
Обновление GitHub tracking и создание archive PR выполняются после commit/push;
данное review не подтверждает их доставку. Авторизация archive не означает merge
этого documentation PR, публикацию или применение skill к приложению.

## PR #74 review follow-up — 2026-11-04

Прочитаны все страницы inline comments, summary reviews и PR comments
[PR #74](https://github.com/antonsmolko/gost-spec/pull/74): два inline findings,
два reviews без summary text и один PR comment с ещё тремя findings. Reviewer
подтвердил исходные block/artifact/link/runtime проверки `ae41a75`; они остаются
evidence того snapshot. Закрытые PR72/PR73 dispositions не переоткрываются.

### PR74-R1

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| [Inline review](https://github.com/antonsmolko/gost-spec/pull/74#discussion_r4465221372) | В main spec неявно разграничены legacy rollback и gate новой релизной поставки | main distribution spec, archive ledger, #70 | Clarified | Сценарий возврата явно требует отдельный исторический snapshot и проверку его процессом. Текущий checker продолжает отклонять legacy git-subdir; успешная его проверка не является условием исторического возврата, а legacy-каталог не объявляется новой поставкой и не меняет текущий snapshot |

Это уточнение уже описанного scope в Migration Plan/README, а не новый installer,
validator mode или ослабление containment. Runtime/checker/каталоги не меняются.
В main добавлены только две AND-строки существующего legacy-сценария. Счётчики
остаются 11 требований / 27 сценариев. Оригинальная архивная delta не переписана:
шесть transferred blocks по-прежнему равны ей; седьмой (`Explicit migration
between plugin identities`) дополнен указанным clarification в этом review.
Title/Purpose и четыре untouched blocks сохранены. Утверждение о равенстве всех
семи блоков выше теперь явно относится к исходному sync `ae41a75`.

### PR74-R2

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| [PR review, finding 2](https://github.com/antonsmolko/gost-spec/pull/74#issuecomment-6626085937) | Roadmap смешивает нынешние 11/27 и 9/19 этапа #64 | implementation roadmap | Fixed | 9/19 явно обозначены историческим snapshot архивирования #64, а текущее состояние после #70/PR #74 — 11/27 |

### PR74-R3

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| [Inline review](https://github.com/antonsmolko/gost-spec/pull/74#discussion_r4465224648) | Формулировка после merged PR #73 неоднозначно атрибутирует sync | product design | Clarified | Implementation явно связан с PR #73; синхронизация основной spec и архивирование явно связаны с отдельным documentation PR #74 |

### PR74-R4

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| [PR review, finding 4](https://github.com/antonsmolko/gost-spec/pull/74#issuecomment-6626085937) | Product design описывает завершённую поставку как обновляющуюся | product design | Fixed | «Поставка обновлена в #70», с прямой ссылкой на implementation PR #73; архивный scope и границы выпуска сохранены |

### PR74-R5

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| [PR review, finding 5](https://github.com/antonsmolko/gost-spec/pull/74#issuecomment-6626085937) | В live handoff результат 72/72 читается как текущий | session handoff | Fixed | Проверка main-only 72/72 отнесена к историческому этапу PR #68; 9/19 явно относятся к rename #64. Актуальный implementation suite остаётся 90/90 в блоке #70 |

### GitHub issue edits for this round

#70 и PR #74 дополняются source-linked dispositions R1–R5 и явным описанием
review clarification поверх исходного byte-exact sync. Оригинальные artifacts,
9/9 tasks, 11/27 counts, зависимости и criteria/gates сохраняются. Публичные
счётчики и атрибуция исправляются без изменения implementation PR #73 или
создания release/tag/consumer изменений. Исторические snapshots не выдаются
за новые native проверки.

### Verification for this round

Strict main specs — 2/2, whitespace проходит. Свежий полный `npm run check` —
90/90 на Node 26.0.0 и 26.11.1, включая packed artifacts/external consumers.
Отдельный tracked-tree audit: 109 Markdown, 175 path links + 2 same-file anchors,
0 errors; path-list SHA256 `33f344a41d4cc1e97c8b1c97fac7fcdf6754b6e350070657b958610c35ce95e8`.
Шесть delta blocks равны оригиналу; седьмой отличается ровно двумя AND-строками,
title/Purpose и четыре untouched blocks сохранены. Четыре исходных архивных
артефакта и префикс original design равны базе; metadata/tasks не переписаны.

Независимое fresh-context whole-result review девяти файлов — без actionable
findings. Reviewer подтвердил R1–R5 и отсутствие bypass текущего gate, прочитал
все public PR74 sources и #70/#71/#62/#63, сверил merged PR72/PR73. Самостоятельно
выполнил strict/whitespace/link checks, block/artifact comparison и full check
90/90 на Node 26.11.1. Node 26.0.0 и native CLI он не повторял. Review — private
input, not a public basis; actionable sources — public findings выше.
Обновление public tracking и replies выполняется после push; их доставку это
review не подтверждает. Runtime не менялся, новых release/consumer действий нет.
