# Design

## Context

Мотивация и границы — [proposal](proposal.md); новый контракт —
[distribution spec](specs/state-foundation-plugin-distribution/spec.md).
Текущий [контракт подключения](../../../specs/svelte-spa-state-foundation/spec.md)
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
- [Maintained Claude catalog example](https://github.com/anthropics/claude-plugins-official/blob/a7ba5b93db0c7c8d17f3f1d25853adca79598a1a/.claude-plugin/marketplace.json):
  запись `42crunch-api-security-testing` использует `git-subdir` с
  `url/path/ref/sha`. Это baseline source-формата; доступность нашего pin и
  обе native установки должны подтверждаться отдельными проверками.
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
  assets/icon.png
```

Перенести skill в plugin root без изменения его поведения. Удалить прежнюю
авторскую копию, переадресовать входящие ссылки, включая относительные ссылки
исторических артефактов, если иначе они сломаются. Исторические критерии,
evidence и факты запусков не переписываются. References остаются относительными
внутри skill. Fixtures и внутренняя документация остаются вне plugin root.
Не использовать symlinks или ссылки на исходный checkout в поставке.

Оба native manifests имеют name `gost-svelte-spa-state` и одну логическую
version. Codex manifest явно указывает `skills`; Claude использует стандартную
структуру. Каталоги с именем `gost` доставляют это же дерево через разные нативные
source-поля: Codex — относительный local path выбранной Git-ревизии каталога,
Claude — `git-subdir` с `url`, `path` и полным `sha` подготовленного содержимого. Названия и размещение — проектное предложение, а не уже
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
соответствие источников двух каталогов общей поставке, существование локальных
skill/references и их файловый containment,
разрешённый состав plugin root и отсутствие symlinks. JSON parse/missing file,
невалидный путь и несоответствие дают nonzero с конкретным файлом/причиной.
При ошибке metadata не объявлять installable. Проверка внутренней согласованности
не подменяет проверки нативных CLI. Нужен узкий check в существующем `npm run check`,
а не новый installer/manifest framework.

CLI принимает необязательный единственный `repository-root`, по умолчанию cwd;
лишние аргументы дают usage/nonzero, а переданный путь не игнорируется.
`npm run check` запускает gate текущего checkout один раз до suite; тесты
validator используют общий disposable fixture factory и отдельные изменения
внешних inputs, без повторной валидации всего текущего checkout.

Внешние HTTP(S) URI документации отделяются от файловых ссылок: они не обязаны
существовать внутри plugin root и не вызывают containment-отказ. Проверка
поставки не проверяет сетевую доступность внешних документов. Локальные пути,
включая `file:` URI, percent-encoded пути и реальные targets после разрешения
ссылок, проверяются на существование и нахождение внутри plugin root.
URI-схема `file:` не является исключением из файлового containment.
Та же классификация применяется к другим внешним URI со схемой, включая
`mailto:` и `ftp:`: они не являются локальными путями. Это только разделение
URI/файловых ссылок, без проверки доступности или исполнения URI. JSON metadata
обязана быть объектом; `null`, массив и scalar дают диагностику с путём файла,
не прерывая независимые проверки остальных metadata/files.
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

Codex baseline остаётся `codex plugin marketplace add <source> --ref <catalog-SHA>`,
затем `codex plugin add gost-svelte-spa-state@gost`. Для Claude использовать
`claude plugin marketplace add <git-source>` и
`claude plugin install gost-svelte-spa-state@gost`; каталог выбирает plugin SHA.
`#SHA` при добавлении Claude marketplace не используется. Установка проходит
через native marketplace, без `--plugin-dir`, ручного копирования или локального
checkout у пользователя. Синтаксис и discovery подтверждаются в будущем apply.

### Claude source pin and two-stage catalog preparation

Владелец явно запросил `source.sha` в каталоге. Для monorepo запись Claude имеет
`source: { source: "git-subdir", url: <repository>, path: "plugins/gost-svelte-spa-state", sha: <full-SHA> }`.
Production URL — `https://github.com/antonsmolko/gost-spec.git`; в изолированных
испытаниях допустим только специально созданный локальный Git source вместо
этого URL. `sha` — полный lowercase 40-символьный commit ID, не имя ветки,
не placeholder и не сокращение. `path` не выходит за repository root.

Подготовка имеет два шага: сначала зафиксировать готовое plugin tree в commit P;
затем подготовить каталог C с `source.sha = P`. Каталог не ссылается на свой
собственный ещё неизвестный hash. Codex в C использует относительный plugin root,
bytes которого должны совпадать с этим деревом в P. Сопровождающий выбирает
поставку для Claude; обычный пользователь добавляет удалённый каталог и
использует native install/update, не выбирая произвольную SHA CLI-флагом.

Read-only validation проверяет формат/source type, repository URL/path, разрешение
P и равенство manifests, версии и всех plugin files между P и поставкой Codex.
Использовать штатное чтение Git tree, без собственного resolver/installer.
Проверка не объявляет pin доступным, если источник нельзя прочитать. Ошибки
сети/доступа, отсутствующий commit, неправильный path, расхождение bytes/версии
или невалидный pin означают incomplete; запрещена подстановка HEAD или ветки.
Offline проверка Git tree из имеющейся истории не доказывает доступность SHA
на публичном remote. До отдельного разрешения публикации native evidence
получают только на disposable Git source; незапушенный source commit не
объявляется доступным пользователям через GitHub.

В temporary Git repository подготовить пары P0/C0 и P1/C1: commit plugin content
и следующий commit catalog, который на него ссылается. Catalog commit содержит
соответствующее plugin tree для Codex. Никаких release tags/push в публичный
репозиторий. Для обновления подготовить новую пару и выполнить штатное refresh/
update; для отката каталог снова выбирает ранее проверенную поставку. При
откате Codex получает соответствующий catalog commit, а Claude — catalog entry
с прежним plugin SHA. Проверить сам native downgrade и установленные bytes;
это не обещание, что любой харнес принимает произвольный version selector.

### Discovery proof preserves installed configuration

Создание профиля и первоначального config выполняется один раз до установки.
Helper imports и inventory checks не должны создавать/перезаписывать config,
registry или marketplace registrations. Сохранить config сразу после native
install и проверить неизменность на этапе discovery. Прежний отрицательный
результат Codex не является доказательством дефекта харнеса: helper имел
побочную запись config при импорте. Повторить fresh-process inventory без этой
записи и подтвердить, что найден ровно skill установленного plugin path с
ожидаемым recipe, а не одноимённый исходник из авторского checkout.
Native inventory и чтение именно установленного reference остаются обязательны;
если inventory не подтверждает загрузку, нужна новая изолированная сессия.

Для каждого харнеса фиксировать команды, version, выбранную SHA, установленную
plugin version, место загрузки и hashes skill/recipe. Повторить установку:
один логический plugin/skill; затем выбрать вторую SHA штатным способом
обновления/перерегистрации каталога и проверить после restart новую version и
изменённые bytes. Отдельно проверить отказ для недоступного source и project
check negatives. Инструкция отката использует соответствующий catalog commit для Codex и
прежний plugin pin в каталоге Claude. Подтвердить native round trip; не обещать
пользовательский SemVer/SHA-selector, которого нет у конкретного харнеса.

Установка, повтор и обновление сохраняют hashes synthetic SPA; skill не
запускается автоматически. Сравнение source/installed bytes и сохранение
существующих поведенческих проверок защищают scope без повторной разработки
fc/shell. Это проверка доставки, не реальная миграция приложения.

## Risks / Trade-offs

- [Два формата metadata] → проверка name/version/targets и обе native установки.
- [Разные уровни pinning] → отдельно записывать Codex catalog SHA и Claude
  plugin SHA; native user workflow остаётся разным. Равенство версии без
  совпадения дерева не подтверждает общую поставку.
- [Каталог подготовлен раньше commit содержимого] → сначала P, затем C;
  отсутствие P или публичной доступности не заменять неподтверждённой SHA.
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
откат установленного плагина — проверенный возврат соответствующей поставки
через native механизм каждого харнеса.

## Review and evidence

Канонический ledger этого нового change — этот раздел design; до его коммита
issue #55 содержит публичную постановку. Исходные решения владельца — private
input, not a public basis; публичное actionable основание —
[#55](https://github.com/antonsmolko/gost-spec/issues/55) и baseline links выше.

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| #55; official Codex packaging | Публичный Codex catalog расположен внутри ignored `.agents/` | `.gitignore`, catalog, tests | Implemented locally during apply | Узкое исключение открывает только `.agents/plugins/marketplace.json`; он один показан `git ls-files .agents`, private sentinels и `.agents/skills/` остаются ignored |
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
| Owner review R2–R4 (private input, not a public basis); [#52](https://github.com/antonsmolko/gost-spec/issues/52), [#20](https://github.com/antonsmolko/gost-spec/issues/20) | Охват approval ledger, порядок TS-COMMON-001 и форматирование таблиц | Approval/inventory/TypeScript README | Dispositions recorded in common review ledger | [Common ledger](../2026-10-31-reuse-common-types-and-guards/review.md#review-round--2026-11-01) сохраняет разделение pending/reviewed и все content gates |
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

## Apply evidence — 2026-11-01, paused at native verification (historical snapshot)

Владелец явно вызвал `$openspec-apply-change package-state-foundation-plugin`.
База implementation diff — `3a52702`; carrier и prefix сохранены. Предыдущие
архивы уже закоммичены отдельно, исходное дерево было чистым. Выполнено 6/13
задач (1.1–1.4, 2.1–2.2); дальнейшие пункты не засчитываются частично.

### Completed work and checks

- До реализации сохранены hashes skill/recipe и всех файлов пяти пакетов.
  Три structure tests упали из-за отсутствующих plugin root, catalogs и
  локального reference. Затем negative validator tests упали на пустом stub;
  после реализации все 16 distribution tests проходят. Диагностика malformed
  JSON дополнительно уточнена до конкретного metadata path.
- Одно дерево skill перенесено в `plugins/gost-svelte-spa-state/skills/` без
  изменения bytes; оба manifests версии 0.1.0, README/LICENSE/CHANGELOG и
  оригинальная PNG-иконка находятся внутри plugin root. `claude plugin validate`
  принял плагин и каталог без warnings; отдельно выдаёт advice добавить install
  line в README, который будет завершён после подтверждения native workflow.
- Read-only `check-plugin-distribution.ts` включён в `npm run check`: проверяет
  identity/version, catalog targets, required/allowed files, symlinks,
  changelog и локальные Markdown-ссылки. Внешние HTTP(S) documentation URI
  разрешены без сетевой проверки; локальные пути и `file:` URI подчинены
  containment. Synthetic 0.1.1 принят только с согласованными manifests/changelog.
- README и fixture ссылаются на новое размещение; прежние прямые Markdown
  ссылки обнаружены в root README и handoff. Исторические упоминания прежнего
  пути как датированного snapshot не переписывались. Проверены 42 локальные
  ссылки в текущем затронутом наборе — отсутствующих targets нет.
- Full check на Node 26.11.1 и 26.0.0: по 64/64, включая реальные packed
  document artifacts/external consumers. Native installation tests этим
  suite не заменяются; итоговое review реализации ещё не выполнено.

### Native experiment and blockers

Изолированный temporary Git source содержит только оба catalogs и восемь
plugin files. Две synthetic ревизии: 0.1.0 —
`ab8662029c788d713c770b0b3d183de40d94ad7f`, 0.1.1 —
`98006f3bc9d88abc96f55fd4b823001cd1c09004`. Для clone использован локальный
loopback HTTP Git source; tags/push/publish не выполнялись. Profiles заданы
штатными `CODEX_HOME` и `CLAUDE_CONFIG_DIR`; системный HOME не менялся,
credentials не копировались. Источники:
[Codex state locations](https://learn.chatgpt.com/docs/config-file/config-advanced#config-and-state-locations)
и [Claude configuration directory](https://code.claude.com/docs/en/env-vars).
Перед/после проверены hashes шести личных config/registry paths и всех 13
файлов synthetic SPA — изменений нет. Это проверка указанных файлов, не
доказательство отсутствия любых иных обращений харнесов к системным defaults.

Codex CLI 0.166.0: `plugin marketplace add <git-source> --ref <SHA> --json`
и `plugin add gost-svelte-spa-state@gost --json` прошли. Установлены восемь
файлов версии 0.1.0; hashes skill/recipe совпадают с исходниками:
`c6580ecec5dc4ae55939bd91b48f9611bdd6541ba5eecb341ee7ebfb42b0698d` и
`30e97531684243b931c18a714c89dfbf5ceb8f621c1785f2c228dd68cfd22f8a`.
Новый native app-server ответил на `skills/list` без ошибок, но список не
содержал skill этого плагина. Установка подтверждена, discovery ещё нет;
на этом этапе причина не была установлена, завершение 3.2 не заявлялось.
Последующее расследование обнаружило перезапись config в helper; см. уточнение
ниже. Этот отрицательный результат не считается доказательством дефекта Codex.

Claude Code 2.1.308: `plugin marketplace add '<git-source>#<SHA>' --json`
отказал при clone: `fatal: Remote branch ab8662029c788d713c770b0b3d183de40d94ad7f not found in upstream origin`.
Реальный CLI использовал SHA как имя remote branch. Поэтому запланированное
pinning marketplace по произвольной SHA для этого CLI не подтверждено.
Официальный `sha` в [plugin source reference](https://code.claude.com/docs/en/plugins/marketplace-reference)
относится к source конкретного плагина, а не к marketplace `ref`; возможное
изменение механизма требует согласованного обновления design/tasks и проверки,
а не молчаливого перехода на плавающую ветку, создания release tags или
ручного копирования skill. Claude plugin install не выполнялся после отказа.

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| Native CLI result; [#55](https://github.com/antonsmolko/gost-spec/issues/55) | Marketplace `#SHA` не работает как произвольный commit pin в Claude 2.1.308 | Design native workflow, tasks 3.1/3.3/3.4 | Superseded plan mechanism; native source.sha verification pending | Фактический clone отказал с Remote branch SHA not found; 3.3/3.4 не выполнены |
| Native app-server result; [#55](https://github.com/antonsmolko/gost-spec/issues/55) | Установленный Codex plugin ещё не подтверждён в skills inventory | Task 3.2 | Prior negative invalidated by helper side effect; fresh verification pending | Install JSON и восемь cache files присутствуют; новый `skills/list` не содержит skill; результат нельзя засчитать как discovery |

### Evidence location and issue edits

Временные logs/snapshots:
`/var/folders/mb/0tk4p1xj2bnd8j95_hzrbqqr0000gn/T/gost-plugin-55-c8llyrs6`.
RED/GREEN/full-check logs также сохранены с prefix `/tmp/gost-plugin-55-`.
В #55 записан явный apply-запрос, 6/13 и оба незакрытых пункта проверки;
в #54 сохранена ссылка на отдельный outcome без расширения criteria/closure.
Реализация не закоммичена, merge и выпуск не выполнялись. Следующий шаг —
уточнить механизм native pinning/доставки и обновить план по решению владельца.


## Plan revision — Claude source pin and discovery, 2026-11-01

Владелец явно вызвал `$openspec-update-change package-state-foundation-plugin`
с запросом закрепить Claude через `source.sha` и скорректировать установку/
discovery. Это подтверждение правки существующих proposal/spec/design/tasks;
реализация и настройки харнесов в текущем update не меняются.

### Reconciled decisions and progress

Для Claude выбран native `git-subdir` в том же репозитории с полными URL/path/SHA;
source commit P подготавливается раньше catalog commit C. Для Codex остаётся
catalog Git pin и local plugin source. Поставки сопоставляются по полному tree,
а не по совпадению source-строк или одной версии. Пользователь Claude ставит
выбранную сопровождающим каталога поставку штатно. Main spec fc/shell не меняется.

Повторно открыты 1.3 и 2.1, потому что текущий каталог/validator реализуют прежний
relative-path контракт. Прогресс теперь 4/13; уже полученное evidence для
1.1/1.2/1.4/2.2 сохранено. Никакая native проверка не засчитана заочно. Все
остальные pending пункты и отдельность content/release approval сохранены.

### Correction to the Codex experiment

Read-only inspection временного helper показал unconditional
`config.toml.write_text(...)` на уровне импортируемого модуля. Discovery probe
импортировал этот модуль после установки. В результате config изолированного
Codex profile содержал только initial credential-store setting, а не настройки
после install. Это ошибка author test harness, не доказанная проблема Codex.
Проверить гипотезу повторным native install/discovery с config fingerprints и
без повторной инициализации обязан следующий apply; успех пока не заявляется.
Личный profile не перезаписывался. Прежние logs сохраняются с этим ограничением.

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| Owner request (private input, not a public basis); [#55](https://github.com/antonsmolko/gost-spec/issues/55); official Claude source reference | Pin относился к неправильному уровню source | Proposal, spec, design, tasks 1.3/2.1/3.1–3.4 | Planning corrected; implementation pending | Native plugin source.sha заменяет marketplace #SHA; P/C и совпадение tree описаны, current runtime/catalog не менялись |
| Author probe source; [#55](https://github.com/antonsmolko/gost-spec/issues/55) | Helper портил config перед discovery | Design evidence, tasks 3.1/3.2 | Prior negative withdrawn; retest required | Import-time write обнаружен read-only inspection; новый protocol сохраняет послеустановочный config и проверяет installed path |

### GitHub issue edits — plan revision

В #55 отражены source-контракт, 4/13 и ненадёжность прежнего отрицательного
inventory Codex. Carrier #54 получает ссылку на revised plan и сохранённый
отдельный outcome; criteria/closure #54 и gates #20/#26 не расширяются.
Обновление затрагивает только existing planning artifacts и issue tracking.

### Revision verification and independent review

Строгая валидация `openspec validate package-state-foundation-plugin --strict`
прошла; CLI подтверждает 4/13. Все шесть относительных ссылок/якорей в четырёх
плановых артефактах разрешаются. Hash-снимок 17 implementation/config/consumer-doc
files совпал до/после update, включая skill/recipe, catalogs, scripts и tests:
runtime не редактировался и full suite заново не запускался. Полный planning
revision diff сопоставлен с существующими source/checker/docs/CI отдельно от
тестов; текущая реализация старого source-контракта явно остаётся pending.

Независимый reviewer без рабочего разговора автора прочитал весь revised change,
его diff, исходные требования, relevant unchanged contracts и official docs.
Содержательных замечаний к плану не найдено. Первоначальное замечание об отставших
issue bodies закрыто после повторного чтения актуальных #55/#54.

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| Independent reviewer (private input, not a public basis); [#55](https://github.com/antonsmolko/gost-spec/issues/55), [#54](https://github.com/antonsmolko/gost-spec/issues/54) | Во время review issue tracking ещё показывал прежний прогресс | Issue bodies, design tracking note | Fixed and reviewer-confirmed closed | Обе issue синхронизированы с source.sha/P/C, 4/13 и обязательным native retest; reviewer перечитал их и подтвердил отсутствие оставшихся actionable findings |

Новые planning files не создавались; `.openspec.yaml` и main spec сохранены.
Native pinning, discovery, update/rollback остаются непроверенными после правки
плана, а прежние успешные runtime checks описывают только старую реализацию.
Следующий шаг — отдельный `$openspec-apply-change package-state-foundation-plugin`.

## Checker review — 2026-11-01

Прочитан полный supplied summary семи находок (private input, not a public basis),
текущий diff/checker/tests/catalogs и предыдущий plan-update ledger. Публичное
actionable основание — [#55](https://github.com/antonsmolko/gost-spec/issues/55),
включая согласованный новый контракт и явно открытые tasks 1.3/2.1. Отдельного
public review thread/file не предоставлено. Предыдущие reviewer-confirmed
closures не переоткрываются без новой причины.

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| Owner R1 (private input, not a public basis); [#55](https://github.com/antonsmolko/gost-spec/issues/55) | Текущий green checker не реализует новый source.sha MUST | Catalog/checker/tests, tasks 1.3/2.1 | Confirmed open implementation gap, retained in the owner-requested revised plan | Прогресс остаётся 4/13; задачи заново открыты именно по этой причине. Нового apply после update ещё не было. Green ниже относится к старой реализации и не подтверждает новый контракт. Контракт не ослабляется; требуется продолжение apply и настоящее содержимое source commit |
| Owner R2 (private input, not a public basis); [#55](https://github.com/antonsmolko/gost-spec/issues/55) | Неполный index мог дать MODULE_NOT_FOUND/сломанные ссылки после commit | Full #55 diff, staged snapshot | Physical staging fixed; no commit readiness claim for R1 | Явно staged весь согласованный набор, включая script/tests/plugin files/catalogs и удаления старого skill. Проверяется экспорт полного Git index в disposable дерево; коммит не выполняется, пока новое source.sha требование остаётся открытым |
| Owner R3 (private input, not a public basis); [#55](https://github.com/antonsmolko/gost-spec/issues/55) | mailto:/ftp: ошибочно считались local paths | Checker, tests, design | Fixed with RED/GREEN | URI со схемой классифицируются отдельно, file: остаётся под containment; test использует реальные mailto/ftp ссылки и пустой список filesystem diagnostics |
| Owner R4 (private input, not a public basis); [#55](https://github.com/antonsmolko/gost-spec/issues/55) | JSON null вызывал TypeError без filename и останавливал независимые проверки | Checker JSON reader, tests | Fixed with RED/GREEN | Проверяется JSON object; null/array/scalar дают filename/reason. Тест с null и одновременно отсутствующим recipe подтверждает обе диагностики без TypeError |
| Owner R5 (private input, not a public basis); [#55](https://github.com/antonsmolko/gost-spec/issues/55) | Layout design не перечислял обязательную icon.png | Design layout | Fixed | В дерево добавлен assets/icon.png; bytes существующей оригинальной иконки не менялись |
| Owner R6 (private input, not a public basis); [#55](https://github.com/antonsmolko/gost-spec/issues/55) | CLI молча игнорировал root argument | Checker CLI, tests, design | Fixed with RED/GREEN | CLI принимает один optional root; тест запускает его из здорового cwd с повреждённым отдельным root и получает нужную ошибку reference; лишние аргументы дают usage/exit 2 |
| Owner R7 (private input, not a public basis); [#55](https://github.com/antonsmolko/gost-spec/issues/55) | Дублирование fixture setup и повторный scan текущего checkout | Tests, design | Fixed | Общий factory используется всеми mutation tests; standalone npm check gate сканирует checkout один раз, дублирующий whole-checkout test удалён. Тесты отдельных disposable изменений сохранены |

### Review verification and tracking

Три regression tests сначала упали по ожидаемым причинам; после исправлений
проходят. После consolidation — 18 distribution tests; suite/gate остаются
проверкой текущей частичной реализации. Результаты экспортированного index,
полного suite и независимого review записываются ниже отдельно. Это review
исправления текущего чекера, а не завершение source.sha/native installation.
В #55 отражены все семь dispositions и явное сохранение R1; issue criteria,
carrier prefix, ownership и approval gates не меняются.

Проверен экспорт полного staged tree `41ef8bde0d3e21c9633cb2bb293aff2ebc9656e1`
в независимую temporary папку без исходного checkout; только tooling dependencies
подключены отдельно. Full check этого снимка прошёл 66/66 на Node 26.11.1 и
26.0.0, включая настоящие document tarballs/external consumers. Это проверка
целостности staged files и старой runtime-реализации, не выполнение R1.
Отдельно проверены 46 локальных ссылок/якорей, отсутствие private agent files
в index и точные bytes skill/recipe относительно HEAD. Строгая OpenSpec
валидация прошла; source.sha implementation tasks остаются открытыми.

Независимый fresh-context reviewer прочитал полный текущий diff, код/тесты,
документы и live #55: новых actionable findings по исправлениям R2–R7 нет.
Reviewer отдельно подтвердил, что R1 остаётся открытым и green checks не
означают его выполнение. Review — private input, not a public basis;
публичное основание — #55 и текущие документы. После этого index обновлён
только итоговым ledger; проверенный runtime-набор не менялся. Коммит, push,
публикация и подтверждение завершения change не выполнялись.

## Apply continuation — source pin and native verification, 2026-11-01

Владелец повторно вызвал apply и продолжение; это реализация утверждённого
source.sha плана. Предыдущие датированные запуски и ограничения выше сохранены
как история. Текущий R1 закрыт реализацией, а не прежним зелёным check.

### Source contract and regression evidence

Подготовлен настоящий локальный content commit P
`385a0bce81febdad67013f59bc6623a60021cddb`. Перед его созданием экспортирован
content-only tree `94bd3e9681389259ac74989e8b027be0323289b2`: полный check
прошёл на Node 26.11.1. Этот промежуточный commit сохраняет прежний check и
источник skill; он не объявляется завершённым outcome #55. Следующий catalog
commit C удаляет старую копию и закрепляет P. P является предком C; публичная
доступность P до push/release не заявляется.

Claude source — git-subdir с canonical GitHub URL, точным plugin path и полным
lowercase SHA. Read-only gate использует только локальные Git cat-file/ls-tree/
show; проверяет commit object, восемь путей, file modes и bytes. Нет fetch или
fallback к HEAD. Для disposable native source допускается HTTP loopback URL,
только совпадающий с Git origin этого fixture; production URL фиксирован.
Git root должен совпадать с переданным repository-root. CI уже получает полную
историю (`fetch-depth: 0`); экспорт без Git history не является valid fixture.

Новые тесты сначала дали RED: каталог оставался relative source, а старый checker
отклонял даже корректный git-subdir fixture. Четыре падения — native catalog,
patch fixture, URI fixture и positive pinned-tree case; отрицательные проверки
не считаются отдельным RED-доказательством. После реализации GREEN
сохраняет прежние JSON/URI/containment/privacy проверки. Нынешний suite — 72
теста, из них 24 distribution tests. Logs RED:
`/tmp/gost-plugin-pin-red.log`; GREEN: `/tmp/gost-plugin-final-check.log`.
Native `claude plugin validate` прошёл для manifest/plugin и marketplace.
Tracked .agents содержит только публичный catalog; private sentinels ignored.
SKILL/recipe bytes и пять npm-пакетов не менялись относительно исходной базы.

### Native commands and content evidence

Временный run:
`/var/folders/mb/0tk4p1xj2bnd8j95_hzrbqqr0000gn/T/gost-plugin-55-v2-ag8k6q7v`.
Git smart HTTP работает только на loopback через upstream git-http-backend;
передача в disposable bare repository не является push в публичный origin.
Начальный experiment tree содержит только два каталога и восемь plugin files.

| Version | Plugin content P | Catalog C |
| --- | --- | --- |
| 0.1.0 probe | db56fa1fa37e36b4a030e59f9003bb756314dd3d | 3d94867ccda1d2215def3a4f5c8ac07a0571ea3f |
| 0.1.1 synthetic patch | 973aaff400a2804e1754f3043cf160b9a222ce9c | 78b9b817046f7cfa09cd90e95416c580d50626bd |
| Final 0.1.0 | 385a0bce81febdad67013f59bc6623a60021cddb | 009aeb0d91ef2a443aaa11ee0bc6830212f12c84 |

Probe 0.1.1 меняет только metadata/changelog и synthetic description comment,
не обязательную основу fc/shell. Final README уточняет namespaced invocation;
поэтому окончательные восемь bytes-путей дополнительно установлены и проверены
в новых профилях, а не засчитаны по прежнему cache версии 0.1.0.

Codex 0.166.0: `plugin marketplace add <loopback-url> --ref <C> --json`,
`plugin add gost-svelte-spa-state@gost --json`. Claude 2.1.308:
`plugin marketplace add <loopback-url> --json`, затем
`plugin install gost-svelte-spa-state@gost --json`; registry содержит P,
а не C. Полный SHA передаётся через plugin source, без marketplace #SHA.

Изоляция — отдельные CODEX_HOME/CLAUDE_CONFIG_DIR, credentials не копировались,
HOME не менялся. Config создаётся один раз перед install; imports read-only.
Новый Codex app-server после initialize получает skills/list(forceReload):
ровно один enabled skill `gost-svelte-spa-state:gost-svelte-spa-state`, scope
user, pluginId gost-svelte-spa-state@gost, path внутри установленного plugin
cache версии. Hash config до/после inventory совпал. Native имена имеют namespace;
первый фильтр только по ненamespaced имени был исправлен, сырой inventory сохранён.
Claude `plugin details gost-svelte-spa-state` показывает Skills (1), Agents/
Hooks/MCP/LSP (0). `--json` у details не поддерживается; использован plain output.
Сравнены именно восемь installed files обоих cache с Git tree P, включая чтение
recipe; все bytes равны. Native inventory не требует model authentication.

Повторный install в обоих профилях сохранил один logical plugin/skill. Update
0.1.0 → 0.1.1: Codex remove/re-add marketplace с C1 и plugin add; Claude
marketplace update gost и plugin update gost-svelte-spa-state@gost. Rollback:
Codex C0, Claude catalog с прежним P0 и те же update-команды. После новых
процессов подтверждены version и все восемь files на каждом этапе, включая
настоящий downgrade Claude 0.1.1 → 0.1.0. Evidence: verification-initial,
verification-repeated, verification-updated, verification-rollback и
verification-final JSON, versions-experiment.json и versions.json в run.

В отдельных новых Claude profiles unavailable f…f SHA, malformed `main` и
wrong-path отвергнуты с exit 1 и конкретной причиной; replacement на HEAD нет.
Codex недоступный Git source также дал exit 1. Logs negative-*.json в run.
Перед/после совпали hashes всех 13 synthetic consumer files и шести личных
config/registry paths. Это сохранность проверенных путей, не обещание полной
OS-изоляции: Codex также видит глобальные standalone skills. В evidence засчитан
только skill установленного plugin cache. asc-admin source не читался/не менялся.

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| Owner R1 (private input, not a public basis); [#55](https://github.com/antonsmolko/gost-spec/issues/55) | Старый catalog/checker противоречили source.sha MUST | Catalog, checker, tests, tasks 1.3/2.1 | Fixed with RED/GREEN and native proof | Реальный P, exact tree check, invalid pin regressions; обе final cache совпадают с P |
| Author native probes; [#55](https://github.com/antonsmolko/gost-spec/issues/55) | Codex discovery ранее не подтверждён | Tasks 3.1/3.2 | Fresh verification complete; old negative remains withdrawn | Новый процесс, preserved config, ровно один namespaced skill из installed cache; recipe bytes прочитаны |
| Native CLI result; [#55](https://github.com/antonsmolko/gost-spec/issues/55) | Claude marketplace #SHA не работает как нужный pin | Task 3.3 | Superseded mechanism replaced and verified | Native git-subdir source.sha install/update/downgrade и три отказа без fallback |

### Affected representations and GitHub issue edits

Обновлены product design, roadmap (новый #55 после #54), handoff и plugin README;
основной контракт подключения сохранён. Root/fixture README и ссылки исторических
артефактов отражают перенос. Пять npm-версий, approval #20/#26 и criteria/closure
#54 сохранены. Для будущего implementation PR нужен отдельный diff outcome #55
от базы 3a52702; предыдущие archives/common review outcomes не включать.

Попытки прочитать live issues #55/#54 через gh GraphQL, gh REST и curl завершились
TLS handshake timeout. Issue edits этого apply пока НЕ выполнены; задача 4.1
остаётся открытой до восстановления доступа, read-before-write и проверки
итогового issue body. Предыдущие успешные issue edits выше — история, а не
подтверждение текущей синхронизации. Коммит P локальный, push/merge/release tags
и публикация не выполнялись.

### Final verification and independent review

Свежий полный check после уточнения pin regression assertions прошёл на Node
26.0.0 и 26.11.1: по 72/72, включая настоящие npm tarballs и external consumers.
Negative pin tests сначала подтверждают valid fixture, затем требуют конкретную
source.sha/url/path диагностику; blanket rejection не засчитывается. Полный
staged tree `86c78f0723d12fcdaf47ef4e35565ac8b9683166` экспортирован в отдельный
Git checkout с доступным P; его full check также прошёл 72/72 на Node 26.11.1.
Последующие правки касаются только tracking/evidence, runtime snapshot сохранён.

Отдельная сверка полного outcome diff от 3a52702: 65 относительных ссылок/якорей
в 13 изменённых Markdown files разрешаются; packages, package-lock, Changesets
и main fc/shell spec неизменны. Проверены dependencies, allowlist/private files,
исходные hashes и source/tree равенство независимо от runtime suite.

Fresh-context reviewer прочитал весь diff, требования, relevant unchanged docs
и retained native logs; самостоятельно запустил gate и 24 distribution tests.
Runtime findings нет; подтверждены original bytes, pin и installed cache trees.
Reviewer не повторял native installs/full suite/lower bound. Live GitHub недоступен.
Единственная low-severity находка: текущие proposal/tasks ещё описывали plan-only
update и будущий первый apply. Формулировки исправлены под возобновлённый apply.

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| Independent reviewer (private input, not a public basis); [#55](https://github.com/antonsmolko/gost-spec/issues/55) | Текущий proposal/tasks требовал уже выполненный apply | Proposal, tasks intro/workflow | Fixed and reviewer-confirmed closed | Указаны текущий apply и оставшаяся синхронизация issues, исторические секции ledger сохранены |

Task 4.3 остаётся pending до согласованности issue representations: независимая
проверка локального результата выполнена, но task требует также завершённого
tracking. Это не согласованное deferred исключение и не полное завершение change.

Reviewer повторно прочитал исправленные proposal/tasks и ledger, подтвердил
закрытие находки без новых actionable замечаний. После отрицательных native
проб final installed bytes и consumer/personal hashes проверены ещё раз;
временный loopback Git server остановлен. Итоговый прогресс — 11/13: открыты
4.1 и 4.3 только в части live issue synchronization/её итоговой сверки.
При восстановлении GitHub продолжить apply, прочитать все актуальные страницы
issue/PR discussion, согласовать #55/#54 и подтвердить representations перед
закрытием задач. Остальной результат подготовлен в index, catalog commit ещё
не создан; source commit P сохранён отдельно.

## Completion reconciliation — GitHub restored, 2026-11-01

Владелец подтвердил восстановление GitHub MCP и запросил продолжение apply.
Прочитаны актуальные тела #55/#54, все страницы comments (обе выдачи пустые) и
все PR для carrier branch (пусто). Новых review threads/summary нет; прежние
reviewer-confirmed closures сохраняются. Живое состояние совпадает с локальной
веткой `feature/gost-spec-54-state-foundation-skill`, source P — `385a0bc`;
публичная доступность этого локального commit не заявляется.

### GitHub issue edits — completion reconciliation

- [#55](https://github.com/antonsmolko/gost-spec/issues/55): добавлен текущий
  implementation/native evidence summary, настоящий P и отсутствие catalog C,
  R1–R7 dispositions, отдельные runtime/link checks и ограничения. Workflow
  обновлён под возобновлённый apply; прежние planning/partial progress sections
  помечены historical без удаления evidence. Итоговая tracking review pending.
- [#54](https://github.com/antonsmolko/gost-spec/issues/54): прежние #55 updates
  помечены historical; добавлено актуальное отдельное carrier addition с новым
  canonical path и результатами. Исходный критерий с skills/ сохранён как #54
  baseline, path mapping дан отдельно. Criteria/closure и release gates прежние.
- Обе записи выполнены через GitHub MCP после read-before-write. State обеих
  issues остаётся open; PR отсутствует, внешних review replies не требуется.
  Префикс [gost-spec-52] и отдельный outcome будущего PR сохранены.

Ни контракт поставки, ни runtime после предыдущего независимого review не
менялись. Полный diff относительно 3a52702 и все связанные representations
сверяются повторно; завершение 4.3 требует независимого чтения уже обновлённых
live issues. Исторические TLS blockers выше теперь устранены, а не отложены.

### Completion review and final state

Новый fresh-context reviewer независимо прочитал полный diff от 3a52702,
требования, relevant unchanged contracts, retained native evidence и live
#55/#54 со всеми comments/PR listings. Actionable findings нет; прежнее
reviewer-confirmed closure сохранено. Отдельно reviewer подтвердил gate и
24 distribution tests, exact восемь installed-file hashes, исходные bytes и
unchanged npm/main-spec boundaries. Full suite/native installs он не повторял;
проверены свежие full-check logs автора (72/72 на обоих Node).

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| Independent reviewer (private input, not a public basis); [#55](https://github.com/antonsmolko/gost-spec/issues/55), [#54](https://github.com/antonsmolko/gost-spec/issues/54) | Требовалась независимая сверка восстановленного live tracking с полным результатом | Task 4.3, issue representations, final diff | Complete; no actionable findings | Live issues, empty comments/PR lists, preserved closures, exact plugin caches и самостоятельные gate/24 tests подтверждены |

Задача 4.3 выполнена; CLI подтверждает 13/13 и all_done. В issues итоговая
формулировка заменяет pending tracking review на completion без изменения
критериев, state или release authorization. Runtime не менялся. Итоговые свежие
full-check logs: /tmp/gost-plugin-completion-check.log и
/tmp/gost-plugin-completion-check-node26.0.log — по 72/72; links/anchors — 65/65.
Все affected representations согласованы; historical incomplete записи выше
сохранены как датированные этапы, а не текущие blockers. Source commit P остаётся
локальным; catalog commit C, archive/main-spec synchronization, push/merge,
release tags, publication и consumer application не выполнялись этим apply.


## Integration preparation — 2026-11-01

После commit/push владелец запросил PR, затем явно подтвердил интеграцию
предыдущих outcomes и #56. Это разрешение merge, без publication/release tags,
нормативного принятия или применения к потребителю. Новых runtime contracts нет.

### Scope separation, review and GitHub issue edits

Отдельный disposable checkout восстановил последовательность изолированных PR:
[#57](https://github.com/antonsmolko/gost-spec/pull/57) plan51 →
[#58](https://github.com/antonsmolko/gost-spec/pull/58) privacy53 →
[#59](https://github.com/antonsmolko/gost-spec/pull/59) common52 →
[#60](https://github.com/antonsmolko/gost-spec/pull/60) skill54 →
[#61](https://github.com/antonsmolko/gost-spec/pull/61) plugin plan55 →
[#56](https://github.com/antonsmolko/gost-spec/pull/56) plugin implementation55.
Common review/archive объединены со своим исходным proposal; skill — со своим
archive/main-spec sync. Все пять промежуточных snapshots прошли full check
48/48 на Node 26.0.0 и 26.11.1 с настоящими packed/external-consumer tests.
Разрешены только конфликты handoff/roadmap; исходные skill/recipe bytes прежние.

Финальное дерево prerequisite base равно исходному 3a52702, tree
`1632e0b037e225e70de19d149dc544c44dfade6c`. Обычный no-ff merge записывает
исходную ancestry без изменения дерева; P385a0bc и Cd48b9bd не переписываются.
При retarget каждого PR на main merge актуального main в его head запускает
CI workflow: простое изменение base не запускает default pull_request events.
Merge разрешён только после зелёных проверок обоих Node и сверки отсутствия
новых review input; состояние merges/checks — по live PR, а не по этому снимку.

Независимый fresh-context reviewer прочитал все adjacent diffs, live issues
51–55 и старые ledgers, проверил scope/tree/ancestry и локальные ссылки. Один
finding исправлен, reviewer повторно подтвердил closure; иных замечаний нет.
Исторические записи common ledger о более позднем skill отражают прежнюю
carrier chronology, не наличие этих файлов в common-only integration snapshot.

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| Independent integration reviewer (private input, not a public basis); [#59](https://github.com/antonsmolko/gost-spec/pull/59), [#60](https://github.com/antonsmolko/gost-spec/pull/60) | Common-only handoff преждевременно объявлял завершение skill | Common/skill integration refs, handoff | Fixed and reviewer-confirmed closed | 7870430 убирает ранний header, 83cd89a добавляет его на skill-ступени; d116877 сохраняет полное исходное дерево базы |

В live issues #51/#52/#53/#54/#55 добавлены owner integration request, порядок
PR/dependencies, review disposition и сохранение criteria/closure, prefix и
approval gates. PR descriptions содержат integration-specific ledger; подробные
исходные domain evidence остаются в прежних committed design/review files.
Это дополнение заменяет прежние текущие утверждения о локальном P, отсутствии C
или PR: P/C запушены, #56 открыт; прошлые этапы сохранены как история.

## Archive and main-spec sync — 2026-11-01

Владелец явно вызвал archive и выбрал «Синхронизировать и архивировать».
CLI status подтвердил spec-driven, все четыре artifacts done; list — 13/13.
Archive instructions не добавили context/operationGuidance. Валидный specs-rule
snapshot получен один раз и использован inline sync; rules отсутствуют.

Новая основная спецификация —
[контракт поставки](../../../specs/state-foundation-plugin-distribution/spec.md).
Заголовок приведён к main-spec format; Purpose, все 8 requirement blocks и
14 scenarios перенесены из ADDED дословно. Delta operation headers в main нет,
установленный fc/shell main spec не менялся. До перемещения повторное сравнение
показало, что вся дельта уже синхронизирована; strict spec validation прошла.

Change перенесён в `archive/2026-11-01-package-state-foundation-plugin` вместе
с .openspec.yaml. При самом move hashes всех пяти файлов совпали. Затем
исправлены только две относительные ссылки archived design и входящие ссылки
в handoff/product design/roadmap; это дополнение сохраняет прежние evidence.
Proposal/tasks/delta/metadata не переписывались; tasks остаются 13/13.
Проверены 69 локальных ссылок/якорей в выбранном diff от 3a52702, отдельно от runtime suite;
это не было проверкой всех Markdown-файлов репозитория. Никакой
runtime, plugin metadata/content/source.sha или npm version не менялись.

### Archive issue tracking — snapshot before PR creation

На этапе archive live #55 и carrier #54 получили отдельный summary с новым путём
и основной спецификацией. Тогда перенос и sync были локальными; сам archive
запрос не выполнял commit/push/merge. Позже владелец отдельно запросил создание
PR: изменения сохранены в c9b1fed и отправлены в PR #65; статус доставки в main
проверять по PR. Прежние датированные snapshots сохраняются. Archive не
меняет owner decisions, proposed statuses или gates #20/#26 и не разрешает
публикацию/применение к asc-admin. Итоговый full check и независимое review
фиксируются ниже после завершения проверок.

### Final archive verification and review

Свежий полный npm run check прошёл на Node 26.0.0 и 26.11.1: по 72/72,
включая реальные tarballs/external consumers. Strict main-spec validation
прошла. Проверка структуры/bytes сравнила Purpose, все requirement/scenario
blocks, четыре неизменённых archived artifacts и отсутствие change в active
list; plugin/catalog/pin/packages/fc-shell contract остались прежними.
Отдельная сверка diff и его 69 локальных ссылок/якорей завершена успешно;
файлы вне выбранного diff этой проверкой не охватывались.

Независимый fresh-context reviewer прочитал весь девятифайловый archive/sync
diff, новые/исходные specs, relevant unchanged contracts и live #55/#54, а также
пустые comments/reviews/threads merged PR #56. Actionable findings нет;
предыдущие reviewer-confirmed closures сохранены. Reviewer самостоятельно
проверил точность переноса, структуру, ссылки, active-list состояние и границы,
а full suite/native installs не повторял: изучены свежие full-check logs автора.
Review — private input, not a public basis; публичные actionable источники —
[#55](https://github.com/antonsmolko/gost-spec/issues/55),
[#54](https://github.com/antonsmolko/gost-spec/issues/54) и согласованный контракт.

На этапе этой проверки обе issue archive summaries фиксировали итоговое evidence
и тогда ещё локальное незакоммиченное состояние. Основная спецификация
синхронизирована, change архивирован без incomplete-task/artifact warnings.
После отдельного PR-запроса staged diff сохранён и отправлен в PR #65; отсутствие
commit/push в первоначальном archive snapshot не описывает текущую доставку.

## Archive documentation review — 2026-11-01

Прочитан полный supplied summary четырёх findings (private input, not a public
basis), live #55 с пустым comments list, предыдущий archive ledger и затронутые
unchanged документы. Public actionable scope —
[#55](https://github.com/antonsmolko/gost-spec/issues/55), carrier
[#54](https://github.com/antonsmolko/gost-spec/issues/54). #30 подтверждена closed;
#62/#63/#64 — open. Предыдущие domain-review closures не переоткрываются:
новая ошибка относится к входящей ссылке, сломанной нынешним archive move.

Прежний helper выбирал Markdown-файлы из `git diff 3a52702 --diff-filter=ACMR`,
а не весь репозиторий. Его 69 проверенных ссылок не подтверждали отсутствие
сломанных ссылок в unchanged files. Уточнены обе прежние формулировки evidence
выше и issue archive summaries; старый scoped результат не выдаётся за global.
Последующий рабочий audit включал также четыре тогда untracked rename-plan
файла: 105 файлов и 165 targets были наблюдением того workspace, а не проверкой
committed tree PR #65. Проверка только tracked snapshot приведена в PR65-R3 ниже.

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| Owner review R1 (private input, not a public basis); [#55](https://github.com/antonsmolko/gost-spec/issues/55) | Common ledger сохранил ссылку на перемещённый active design; audit scope описан слишком широко | Common review.md, archive design, #55/#54 summaries | Confirmed and fixed | Repo-wide scan: 105 Markdown files, 165 local links/anchors, одна missing target до правки и ноль после; исправлен sibling archive path с прежним anchor |
| Owner review R2 (private input, not a public basis); [#55](https://github.com/antonsmolko/gost-spec/issues/55) | Фраза об архивировании выглядит противоречивой | Handoff archive status | Wording clarified | Прежнее «автоматически не выполняются» не означало «не выполнены»; теперь явно указаны merged implementation, локальный archive по запросу и отдельные publication/consumer instructions |
| Owner review R3 (private input, not a public basis); [#55](https://github.com/antonsmolko/gost-spec/issues/55) | tasks/design текущего change — устаревший указатель | Handoff evidence pointer | Fixed | Добавлены прямые ссылки на archived tasks/design; обе цели и anchors проверены |
| Owner review R4 (private input, not a public basis); [#55](https://github.com/antonsmolko/gost-spec/issues/55) | Откуда продолжать ведёт к закрытому планированию | Handoff entry point | Fixed against current queue | Указаны завершение archive review, proposed rename #64, затем отдельные #62/#63; #30 сохранена как историческая архитектурная база |

### Verification scope and issue edits

Новый разовый repository-wide audit использует `git ls-files --cached --others
--exclude-standard`, только существующие .md files: все tracked documents плюс
неignored новый rename plan, без private/ignored материалов. Markdown links и
images извлекаются marked; relative targets и локальные heading anchors
проверяются, code examples не считаются ссылками. Внешние URI не проверяются
по сети. Before/after evidence: /tmp/gost-archive-review-links-before.json и
/tmp/gost-archive-review-links-after.json. После добавления этого ledger audit
повторяется; фактические итоговые счётчики фиксируются ниже отдельно.

#55/#54 archive summaries уточняют scope прежних 69 links и новый repo-wide
результат; request/dispositions и локальное uncommitted состояние сохранены.
Рассмотрен полный archive diff и unchanged common ledger, normative/spec/runtime
contracts не менялись. Для R1–R3 отдельное independent review могло быть
пропущено как wording/link-only. Однако R4 менял operative continuation queue:
его первоначальная общая классификация как wording-only была неверной.
Новый PR #65 review исправляет эту запись и требует independent review полного
результата, включая очередь; прежние independent reviews сохраняются только
с их фактическими ограничениями. Commit/push не выполнялись на том раннем этапе.

Итог того рабочего документационного review: audit — 105 существующих Markdown
files, включая untracked rename plan, 165 local links/anchors, ноль ошибок;
эта цифра не является inventory archive commit. До R1 fix была ровно одна
битая цель. `openspec validate --specs --strict` — 2/2 основных specs.
Свежий full npm run check — 72/72 на Node 26.0.0 и 26.11.1; logs:
/tmp/gost-archive-review-check.log и /tmp/gost-archive-review-check-node26.0.log.
Main-spec Purpose/requirements/scenarios, plugin/source pin, packages и rename
planning artifacts не менялись в этом review. Все четыре dispositions закрыты;
R2 классифицирован как уточнение формулировки, а не подтверждённая ошибка runtime.

## PR 65 review follow-up

Прочитаны все четыре inline threads, четыре COMMENTED reviews без отдельного
summary body и полный issue-comments list (пусто); pagination review_threads
завершена (hasNextPage=false). Источники — public comments ниже. Старые closures
сохраняются; здесь исправляется доставка документации и точность review evidence.

### PR65-R1

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| [Review comment](https://github.com/antonsmolko/gost-spec/pull/65#discussion_r4437181182) | Live resume pointer и незаквалифицированные local-only утверждения устаревают после доставки PR | Handoff, archive tracking snapshots | Fixed | Entry point описывает сохранённый Git outcome, ведёт к статусу PR #65 и следующему #64/PR #66; прежние local/staged записи явно помечены как этап до PR |

### PR65-R2

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| [Review comment](https://github.com/antonsmolko/gost-spec/pull/65#discussion_r4437181241) | Дублирующая очередь #62/#63 в датированном archive summary | Handoff continuation queue | Fixed | Повтор удалён; текущая очередь хранится только в разделе «Откуда продолжать» |

### PR65-R3

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| [Review comment](https://github.com/antonsmolko/gost-spec/pull/65#discussion_r4437181308) | Workspace audit и ephemeral logs не воспроизводят inventory committed archive tree | Archive verification evidence, PR #65 description, #55/#54 summaries | Fixed | Корпус ограничен tracked Git tree выбранного ref; ниже полная команда, hash списка Markdown paths и committed summary. 157 path links и два same-file anchors объясняют отличие от прежних комбинированных counts |

Reproduction: checkout reviewed PR #65 head, use a supported Node version and
install the locked tooling. Both commands are existing repository verification;
repeat full check separately on Node 26.0.0 and 26.11.1. Raw /tmp logs above are
operator debugging records, not the durable basis of the result. CI and PR
records supply the corresponding public run links after push.

```sh
npm ci --ignore-scripts
npm run check
```

Tracked-only Markdown audit below reads Git blobs, not filesystem/untracked
files. By default it audits HEAD; AUDIT_REF can select an immutable commit or
tree. The Markdown path-list hash makes the corpus independently comparable.
Only Markdown links/images and local heading anchors are checked; fenced code
examples and external URI network availability are outside this audit.

```sh
node --input-type=module <<'JS'
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { posix } from 'node:path';
import { marked } from 'marked';
const ref = process.env.AUDIT_REF || 'HEAD';
const git = (...args) => execFileSync('git', args, { encoding: 'utf8' });
const paths = git('ls-tree', '-r', '--name-only', '-z', ref).split('\0').filter(Boolean);
const files = paths.filter(path => path.endsWith('.md')).sort();
const texts = new Map();
const read = path => {
  if (!texts.has(path)) texts.set(path, git('show', `${ref}:${path}`));
  return texts.get(path);
};
const headings = path => {
  const seen = new Map();
  return marked.lexer(read(path)).filter(token => token.type === 'heading').map(token => {
    const slug = token.text.toLowerCase().replace(/<[^>]*>/g, '')
      .replace(/[^\p{L}\p{N}\p{M}\-_\s]/gu, '').replace(/\s/g, '-');
    const count = seen.get(slug) || 0;
    seen.set(slug, count + 1);
    return slug + (count ? `-${count}` : '');
  });
};
let relativeLinksWithPath = 0, sameFileAnchors = 0, relativeImages = 0;
const errors = [];
for (const file of files) marked.walkTokens(marked.lexer(read(file)), token => {
  if (!['link', 'image'].includes(token.type) || /^(?:[a-z][\w+.-]*:|\/\/)/i.test(token.href)) return;
  const [destination, anchor] = token.href.split('#');
  const local = destination.split('?')[0];
  if (token.type === 'image') relativeImages++;
  else if (local) relativeLinksWithPath++; else sameFileAnchors++;
  const target = local ? posix.normalize(posix.join(posix.dirname(file), decodeURIComponent(local))) : file;
  if (!paths.includes(target) && !paths.some(path => path.startsWith(`${target}/`))) errors.push(`${file}: missing ${token.href}`);
  else if (anchor && target.endsWith('.md') && !headings(target).includes(decodeURIComponent(anchor))) errors.push(`${file}: missing anchor ${token.href}`);
});
console.log(JSON.stringify({ markdownFiles: files.length, relativeLinksWithPath, sameFileAnchors, relativeImages,
  markdownPathListSha256: createHash('sha256').update(files.join('\n') + '\n').digest('hex'), errors }, null, 2));
if (errors.length) process.exitCode = 1;
JS
```

Expected tracked corpus for this archive outcome (the two anchors are in
issues-review-response and content-approval, so they are counted separately
from the 157 path-bearing links):

```json
{
  "markdownFiles": 101,
  "relativeLinksWithPath": 157,
  "sameFileAnchors": 2,
  "relativeImages": 0,
  "markdownPathListSha256": "532117f99fe5a72266654a30a5b06765737c841061e47f703aea362f84845dc6",
  "errors": []
}
```

### PR65-R4

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| [Review comment](https://github.com/antonsmolko/gost-spec/pull/65#discussion_r4437181358) | R4 continuation-order change ошибочно попало под wording-only exemption | Archive review classification and live handoff | Fixed and independently reviewed | Прежнее exemption ограничено R1–R3; новый reviewer отдельно проверил substantive queue и полный результат, включая public tracking, без открытых findings |

### GitHub issue edits and review scope

#55/#54 archive summaries и описание PR #65 заменяют unqualified 105/165
утверждение на tracked corpus выше; старый workspace snapshot остаётся явно
историческим. Owner request, carrier/prefix, issue criteria/closure и gates
#20/#26 не меняются. Runtime/plugin/catalog/npm packages и Purpose/requirements/
scenarios не менялись. Task queue reference changes не выдаются за contract-free
wording-only exception; итог независимой проверки записывается после её завершения.

### Tracking cross-check and candidate checks

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| Independent reviewer (private input, not a public basis); [#62](https://github.com/antonsmolko/gost-spec/issues/62) | Existing context ссылки в future refactor issue указывали на удалённый active design | Issue #62 context | Fixed | Контекст переадресован к archive/2026-11-01-package-state-foundation-plugin/design.md без изменения scope/criteria #62 |

#55/#54 получили явное различение старого workspace audit и tracked snapshot,
исправленную review-exemption classification и статус подготовленного PR65 fix.
Описание PR65 содержит ту же scope/verification информацию; #62 context обновлён.
Эти публичные representations повторно прочитаны reviewer; scope и review basis
подтверждены, устаревший #62 context reviewer-confirmed closed.

Fresh full check кандидатного archive checkout прошёл 72/72 на Node 26.0.0 и
26.11.1, включая реальные tarballs/external consumers; обе main specs прошли
strict validation. Тексты Purpose/8 requirements/14 scenarios и archived
metadata/proposal/tasks/delta сохранены, tasks 13/13. Точный inline audit выполнен
против staged Git tree, результат совпал с expected summary выше. Whitespace
check чист; runtime/plugin/catalog/packages и исходные pin не менялись.

### Independent complete-result review

Новый fresh-context reviewer прочитал полный десятифайловый PR diff, все четыре
public threads/reviews, live #54/#55/#62–#64 и dependent PR #66. R4 получил
substantive review, operative queue признана корректной; новых actionable
findings нет. Reviewer самостоятельно выполнил точный inline audit против
Git tree, strict specs 2/2, whitespace/artifact/text preservation checks.
Два full-suite logs 72/72 прочитаны; full suite/native installs не повторялись.
Это private reviewer input, not a public basis; actionable public sources —
четыре comment links выше и согласованные issue criteria. Предыдущие closures
сохранены с их реальным scope. Commit/push-status updates и source-linked
replies выполняются как delivery steps этого результата; merge не разрешён.
