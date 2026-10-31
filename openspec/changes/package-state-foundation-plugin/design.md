# Design

## Context

Мотивация и границы — [proposal](proposal.md); новый контракт —
[distribution spec](specs/state-foundation-plugin-distribution/spec.md).
Текущий [контракт подключения](../../specs/svelte-spa-state-foundation/spec.md)
остаётся без изменений.

Наблюдаемое состояние на 2026-10-31: общий skill состоит из
`skills/gost-svelte-spa-state/SKILL.md` и `references/foundation.md`;
`fixtures/svelte-spa-state-foundation` — отдельный synthetic consumer.
Private root содержит ровно пять документальных npm workspaces; Changesets
управляет ими. Плагинов, их версий и marketplace metadata пока нет.
`.gitignore` исключает `/.agents/` и `/.claude/` целиком. В рабочем дереве
есть отдельно staged archives; их нельзя смешивать с результатом #55.

Локально доступны Codex CLI 0.166.0 и Claude Code 2.1.308: просмотрены
`--version` и справки `plugin`, `plugin marketplace`, `codex plugin add`.
Это подтверждает наличие CLI-команд, но не установленный или работающий плагин.

### Official baseline and maintained examples

- [Codex packaging](https://developers.openai.com/plugins/build/plugins):
  skills в плагине, Git-маркетплейс `.agents/plugins/marketplace.json`,
  supported compatibility manifest `.codex-plugin/plugin.json`.
- [OpenAI maintained example](https://github.com/openai/plugins/tree/0722921d5542fc593105c27bd52630babd8b8c2a/plugins/boltz-api-cli):
  прочитаны дерево и manifest; `skills`, name и version заданы в metadata.
  Заимствуются структура и нативная загрузка, а не биологические команды,
  инструменты или сервисы этого плагина.
- [Claude marketplace walkthrough](https://code.claude.com/docs/en/plugin-marketplaces)
  и [manifest reference](https://code.claude.com/docs/en/plugins-reference):
  `.claude-plugin/marketplace.json`, plugin source внутри репозитория,
  `.claude-plugin/plugin.json` и стандартный каталог `skills/`.
- [Claude marketplace source reference](https://code.claude.com/docs/en/plugins/marketplace-reference):
  у Git marketplace source есть `ref`, вход CLI — `owner/repo#ref` или
  Git URL с `#ref`; plugin source `sha` — отдельное поле другого контракта.
- [Anthropic maintained example](https://github.com/anthropics/claude-plugins-official/tree/a7ba5b93db0c7c8d17f3f1d25853adca79598a1a/plugins/claude-md-management):
  прочитаны дерево и manifest; один plugin root с metadata и skills.

Конкретная потребность проекта — доставить один уже проверенный skill в оба
харнеса. Штатные Git-каталоги удовлетворяют её без собственного installer,
registry, dependency resolver или release CLI. Формат portable root `plugin.json`
также описан OpenAI; он не нужен для этого минимального двуххарнесного пакета.

## Goals / Non-Goals

**Goals:** одно устанавливаемое содержимое и логическая версия; независимые
нативные каталоги; доказательства реальной установки из независимого Git checkout;
граница пакета, внутри которой разрешаются все skill references.

**Non-Goals:** новый npm workspace, интеграция плагина в npm publication flow,
MCP/hooks/agents, официальный каталог вендора и новые возможности skill.
Публикация исходников в release-ветку, release tags и merge требуют отдельного
разрешения. Локальные disposable Git commits для тестов выпуском не являются.

## Decisions

### Shared plugin directory

Владелец выбрал один репозиторий с общим skill и двумя каталогами вместо
двух репозиториев с синхронизацией. Предлагаемая реализация:

```text
.agents/plugins/marketplace.json
.claude-plugin/marketplace.json
plugins/gost-svelte-spa-state/
  .codex-plugin/plugin.json
  .claude-plugin/plugin.json
  skills/gost-svelte-spa-state/
    SKILL.md
    references/foundation.md
  README.md
  LICENSE
  CHANGELOG.md
```

Перенести skill в plugin root без изменения его поведения. Удалить прежнюю
авторскую копию, переадресовать входящие ссылки, включая относительные ссылки
исторических артефактов, если иначе они сломаются. Исторические критерии,
evidence и факты запусков не переписываются. References остаются относительными
внутри skill. Fixtures и внутренняя документация остаются вне plugin root.
Не использовать symlinks или ссылки на исходный checkout в поставке.

Оба native manifests имеют name `gost-svelte-spa-state` и одну логическую
version. Codex manifest явно указывает `skills`; Claude использует стандартную
структуру. Каталоги с именем `gost` ссылаются на этот же plugin root штатными
source-полями. Названия и размещение — проектное предложение, а не уже
существующие опубликованные интерфейсы. Два манифеста необходимы для нативных
форматов; их общие name/version проверяются на равенство, содержимое skill
не дублируется. Root portable manifest и генератор адаптеров здесь избыточны.

### Narrow public catalog exception

Заменить исключение всего `/.agents/` правилами, разрешающими обход только
`.agents/plugins/` и отслеживание только `marketplace.json`, с остальным
содержимым по-прежнему ignored. Проверить `git check-ignore` и actual tracked
files для `.agents/skills`, произвольного private файла и публичного каталога.
`/.claude/` остаётся ignored; публичная `.claude-plugin/` — другое имя каталога.
Запрещён широкий `git add -f .agents`.

### Independent version without a new release tool

Начальная предлагаемая версия плагина — `0.1.0`, отдельная от пяти пакетов
стандартов и development versions gost-kit. Общие name/version хранятся в
двух необходимых manifests; нет третьей схемы и генератора. Проверка отклоняет
рассинхрон. Changelog общий, в plugin root. Обновление включает оба manifests,
changelog и выбранную Git-ревизию; само поле version не доказывает состав.

Использовать SemVer: совместимое исправление — patch, совместимое расширение —
minor, breaking change до 1.0 — minor, начиная с 1.0 — major. Changelog
описывает изменение поведения/совместимости и нужные действия пользователя.
Changesets пяти npm-пакетов не расширяется: Git plugin не npm-пакет, а его
ручная подготовка версии не требует собственного versioning API. В тестах
проверить переход `0.1.0` → `0.1.1` на synthetic совместимом изменении
описания, не меняющем обязательный состав fc/shell.

### Inputs, validation and failure

Входы: maintained plugin metadata/catalogs, выбранная полная Git SHA и
зафиксированные версии харнесов. Метаданные берутся из этого репозитория;
не считать произвольный внешний каталог доверенным источником инструкций.
Для испытаний использовать только созданные проектом disposable поставки.

Read-only repository check проверяет SemVer, равенство identity/version,
совпадение двух catalog targets, существование локальных skill/references и их файловый containment,
разрешённый состав plugin root и отсутствие symlinks. JSON parse/missing file,
невалидный путь и несоответствие дают nonzero с конкретным файлом/причиной.
При ошибке metadata не объявлять installable. Проверка внутренней согласованности
не подменяет проверки нативных CLI. Нужен узкий check в существующем `npm run check`,
а не новый installer/manifest framework.

Внешние HTTP(S) URI документации отделяются от файловых ссылок: они не обязаны
существовать внутри plugin root и не вызывают containment-отказ. Проверка
поставки не проверяет сетевую доступность внешних документов. Локальные пути,
включая `file:` URI, percent-encoded пути и реальные targets после разрешения
ссылок, проверяются на существование и нахождение внутри plugin root.
URI-схема `file:` не является исключением из файлового containment.
Положительный случай — имеющаяся HTTPS-ссылка recipe на gost-kit; отрицательные —
выход файлового пути/`file:` URI за plugin root и отсутствующий локальный reference.

Не предполагать, что харнес сам проверяет все относительные Markdown-ссылки
или скрывает сломанный reference. Именно project check обязан это отклонять.
Недоступный Git source, неподдерживаемый CLI или ошибка авторизации/загрузки
дают incomplete с точной причиной; не подменять установку ручным копированием.

### Isolated native installation and update proof

Тестовый источник — отдельный temporary Git repository, содержащий только два
каталога и сам плагин. Создать две локальные immutable commit SHA для исходной
и synthetic patch-поставки; никаких tags/push/publish. Отсутствие остального
checkout проверяет самодостаточность. Каждый харнес получает свой temporary
profile/config/cache и внешний synthetic SPA с начальными hashes.

Сначала проверить официально поддержанные переменные/опции изоляции профилей
и их фактические пути; не менять системный `HOME` и личные настройки. Не
копировать credentials. Если профиль без авторизации не позволяет открыть
нативную сессию или обнаружить skill, записать blocker; файловые проверки
сами по себе не подтверждают session discovery. Допустимо прочитать inventory
штатной командой, если она показывает загруженный skill и references; иначе
нужна новая изолированная сессия с явным чтением установленного skill/recipe.

Codex baseline: `codex plugin marketplace add <source> --ref <sha>`, затем
`codex plugin add gost-svelte-spa-state@gost`; Claude baseline:
`claude plugin marketplace add '<git-source>#<sha>'`, затем
`claude plugin install gost-svelte-spa-state@gost`. Проверить синтаксис выбора
Git SHA native round trip до включения команд в consumer README;
у Claude CLI нет Codex-флага `--ref`. В обоих случаях установка должна
пройти через marketplace, а не только `--plugin-dir`. Для локального Git
источника использовать поддерживаемый Git source, а не path-only режим,
который может читать рабочее дерево вместо выбранного commit.

Для каждого харнеса фиксировать команды, version, выбранную SHA, установленную
plugin version, место загрузки и hashes skill/recipe. Повторить установку:
один логический plugin/skill; затем выбрать вторую SHA штатным способом
обновления/перерегистрации каталога и проверить после restart новую version и
изменённые bytes. Отдельно проверить отказ для недоступного source и project
check negatives. Инструкция отката использует тот же механизм выбора старой
SHA; его поддержку подтвердить native round trip, не обещать SemVer-selector
или независимый per-plugin Git pin, если харнес предоставляет только pin каталога.

Установка, повтор и обновление сохраняют hashes synthetic SPA; skill не
запускается автоматически. Сравнение source/installed bytes и сохранение
существующих поведенческих проверок защищают scope без повторной разработки
fc/shell. Это проверка доставки, не реальная миграция приложения.

## Risks / Trade-offs

- [Два формата metadata] → проверка name/version/targets и обе native установки.
- [Git SHA фиксирует весь marketplace] → явно документировать granularity pin;
  логические версии будущих плагинов остаются независимыми. Это не обещание
  независимого выбора всех версий одним харнесом.
- [Меняющиеся возможности харнесов] → записать проверенные версии и источник
  команд; несовместимость означает incomplete, а не фиктивный успех.
- [Ослабление ignore] → allowlist одного public catalog, negative checks
  приватных путей и аудит реально staged/packed содержимого.
- [Установка без доступа к моделям] → сохранить частичные результаты и blocker;
  CLI help/schema validation не засчитывать как native discovery.
- [Старые ссылки после переноса] → поиск всех входящих ссылок, минимальные
  link-only правки, неизменность исторического содержания и gates.

## Migration Plan

После отдельного apply-запроса выделить #55 в собственный implementation PR;
если сохраняется carrier-ветка, отделить diff/base от #51–#54 и архивирования.
Вначале зафиксировать RED на выбранных проверяемых нарушениях поставки, затем
перенести skill, добавить native metadata и read-only checks, выполнить
изолированные native installation/update/rollback и полный suite.

Обновить README Current implementation/Source skills, ссылки fixture,
общий product design, roadmap, handoff и связанные issue representations.
Во время планирования эти документы не объявляют реализацию уже существующей;
их правки входят в apply. После независимого review и согласования владельца
допустим отдельный merge/release процесс. Отмена до выпуска — возврат patch;
откат установленного плагина — проверенный выбор предыдущей SHA.

## Review and evidence

Канонический ledger этого нового change — этот раздел design; до его коммита
issue #55 содержит публичную постановку. Исходные решения владельца — private
input, not a public basis; публичное actionable основание —
[#55](https://github.com/antonsmolko/gost-spec/issues/55) и baseline links выше.

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| #55; official Codex packaging | Публичный Codex catalog расположен внутри ignored `.agents/` | `.gitignore`, catalog, tests | Planned: узкое исключение и проверки приватных путей | Наблюдаемые root ignore rules; baseline в Context |
| [#55](https://github.com/antonsmolko/gost-spec/issues/55); independent agent review (private input, not a public basis) | Полнота/согласованность нового плана и preservation gates | Все пять файлов change, #54/#55, существующие skill/spec/docs | Reviewed: actionable findings отсутствуют | Отдельный агент без рабочего разговора автора прочитал весь change, source/recipe, ignore/check configuration, затронутые docs, issue bodies/comments, official docs, pinned examples и native CLI help; runtime работа ещё не выполнена |

### GitHub issue edits

- Создана #55 с запросом владельца, criteria, baseline, carrier #54 и retained
  prefix `[gost-spec-52]`; реализация отдельно после apply.
- В body #54 добавлена ссылка на #55 и описание owner-requested addition;
  прежние criteria/closure и ограничения выпуска сохранены. PR отсутствует.
- В body #55 добавлены пути созданных артефактов и результат планового review;
  критерии реализации и отдельность apply/release сохранены.

### Planning verification — 2026-10-31 (historical snapshot)

`openspec validate package-state-foundation-plugin --strict` прошёл; четыре
плановых артефакта созданы, 13 implementation tasks остаются unchecked.
Проверены все пять локальных Markdown-ссылок: отсутствующих targets нет.
Полный новый planning diff и релевантные неизменённые README/design/roadmap/
handoff, source skill/recipe и main spec сверены отдельно от runtime tests.
Прочитаны bodies #54/#55/#20/#26 и все страницы comments #54/#55 (comments нет);
PR для текущей ветки отсутствует. Пакетные release/content gates не изменены.

Независимое review полного плана не выявило actionable findings. Команды
установки, изоляция профилей, session discovery и update/rollback здесь
спроектированы, но ещё не выполнены. Runtime и package files не изменялись;
новый full suite не запускался. Предыдущие staged archives сохранены отдельно;
новые файлы change не staged, коммит и push не выполнялись. Прежние review
closures архивных changes не переоткрываются.

### Review round — 2026-11-01

Прочитан полный supplied review summary владельца (private input, not a public
basis), текущие bodies #55/#52/#54/#20, все страницы comments #55/#52 (comments
нет), предыдущие ledgers и затронутые неизменённые документы. Публичное
actionable основание — [#55](https://github.com/antonsmolko/gost-spec/issues/55)
для поставки и [#52](https://github.com/antonsmolko/gost-spec/issues/52) для
согласованности common-стандарта; критерии carrier #54 не расширяются.

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| Owner review R1 (private input, not a public basis); [#55](https://github.com/antonsmolko/gost-spec/issues/55) | «Ссылка за пределы плагина» смешивала внешние URI и файловые пути | Distribution spec, design, tasks 1.1/2.1; #55 | Fixed in planning | Контракт разрешает внешние HTTP(S) documentation URI; локальные пути и `file:` URI проверяются на containment. Добавлены HTTPS-positive и escaping-file-URI-negative scenarios; future task count остаётся 13, выполнено 0 |
| Owner review R2–R4 (private input, not a public basis); [#52](https://github.com/antonsmolko/gost-spec/issues/52), [#20](https://github.com/antonsmolko/gost-spec/issues/20) | Охват approval ledger, порядок TS-COMMON-001 и форматирование таблиц | Approval/inventory/TypeScript README | Dispositions recorded in common review ledger | [Common ledger](../archive/2026-10-31-reuse-common-types-and-guards/review.md#review-round--2026-11-01) сохраняет разделение pending/reviewed и все content gates |
| Owner observation (private input, not a public basis); repository Git state | Local main отставал от origin/main; несколько outcomes в рабочем дереве | Local refs, carrier branch | Main fast-forwarded; outcome separation retained | После fetch проверен ancestor relationship и atomic update-ref main: 6fa4b3b → 475c313. Текущая ветка/HEAD и прежний index не менялись; commit/push/merge не выполнялись |

#### GitHub issue edits — review

Body #55 уточнён: файловые links и `file:` URI подчиняются containment;
внешние HTTP(S) documentation URI допустимы и не проверяются как local files.
В #52 записаны отдельные R2–R4 dispositions. Зависимости, scope carrier,
отдельность apply и approval gates сохранены. Итоговые проверки и независимое
review текущего уточнения записываются ниже; прежнее review не отменяется,
но его вывод не служит evidence проверки нового текста.

#### Verification — review 2026-11-01

Строгая OpenSpec-валидация прошла; implementation tasks остаются 0/13.
Full `npm run check` на Node 26.11.1 и 26.0.0 прошёл по 48/48, включая реальные
packed document artifacts и external consumers. Отдельный document audit:
29 относительных ссылок/якорей в семи затронутых документах разрешаются;
inventory cells и значения семи owner decisions сохранены, все 13 ID proposed.
Полный diff текущего review сопоставлен с before snapshot и неизменёнными
source/recipe/main spec; package versions, runtime и нормативный текст не менялись.
Новые тесты текстовых формулировок не добавлялись; native plugin installation
остаётся будущей работой, её evidence здесь не заявляется.

Независимое fresh-context review от 2026-11-01 завершено без actionable findings:
проверены весь текущий change/diff, source/recipe, main spec, архитектурные
документы, issue bodies и cross-ledger links. Reviewer подтвердил URI/file
разделение, partial approval log, порядок/формат таблиц и preservation gates.
Review — private input, not a public basis; публичное основание — #55/#52/#20
и документы выше. Проверяющий не менял файлы и не заявлял native install evidence.
