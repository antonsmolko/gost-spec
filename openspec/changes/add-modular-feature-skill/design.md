# Design

## Context

[#88](https://github.com/antonsmolko/gost-spec/issues/88) согласовала архитектуру
и покрытие примерами; [proposal](proposal.md) задаёт объём, [spec](specs/modular-feature-development/spec.md)
— проверяемый результат. База main `2923ff0`: три независимо устанавливаемых
plugin, checker с конкретными descriptors, synthetic FC/Svelte/presenter fixtures.
FC 0.2.0 / shell 0.3.0 выпущены; common@0.3.0 / svelte@0.2.0 проверены в #96.

## Goals / Non-Goals

Один outcome — skill разработки модульной фичи с примерами к каждому правилу.
Первая UI-проверка — Svelte 5; общие правила относятся к frontend-архитектуре.
Реальная навигация/reset без мерцаний — asc-admin #72 и gost-spec #89;
persistence — gost-kit #34. Не проектируем эти механизмы внутри #88 и не меняем
приложение asc-admin. Merge, принятие proposed content и выпуск разделены.

## Decisions

Packaging baseline проверена 2026-11-14: [OpenAI packaging](https://developers.openai.com/plugins/build/plugins),
[Claude marketplace](https://code.claude.com/docs/en/plugin-marketplaces) и
[поддерживаемый Anthropic catalog](https://github.com/anthropics/claude-plugins-official/blob/main/.claude-plugin/marketplace.json).
Конкретная нужда — четвёртая локальная entry с тем же installed tree в обоих
харнесах. Достаточно существующего native workflow; custom installer/resolver
или изменение manifest-формата не нужны.

### Поставка и архитектурный документ

Выбран отдельный plugin/skill `gost-feature@0.1.0` unreleased,
одна общая исходная папка для двух manifests и локальные entries обоих catalogs.
Добавление в FC plugin смешало бы чистые reducers с layout/UI; shell plugin
отвечает за однократное подключение основы. Отдельная поставка следует уже
используемому разделению. Имя/версия были предложением плана PR #103,
подтверждённого merge и явным apply; это не разрешение на публикацию.

В `packages/domains/frontend/architecture/modular-features.md` — английский
FRONTEND-ARCH-003, proposed, применимый только к выбранной модульной архитектуре.
Дополняются существующие frontend README/changelog; добавляется minor changeset
без запуска version или публикации; остальные четыре пакета не меняются. Inventory получает новый
ID/применимость/обоснование; при начале review текста FRONTEND-ARCH-003 добавляется
Pending row в content-approval по правилам этого файла. Утверждение плана не
принимает нормативный текст и не заменяет его отдельное content review.
Skill/reference используют
pinned public URL этого документа с revision/status после его доставки либо
явно описанную проверенную копию; недоступный источник отмечается incomplete.

### Skill и цельный пример

`plugins/gost-feature/skills/gost-feature/SKILL.md` — короткий workflow.
`references/modular-feature.md` — пути/код к правилам и цельный users-пример,
включая необходимую app/store glue. Reference явно ссылается на контракт
store/context [gost-spec #87](https://github.com/antonsmolko/gost-spec/issues/87)
и границы маршрутизации [gost-spec #89](https://github.com/antonsmolko/gost-spec/issues/89),
сохраняя различие реализованного API и отдельного навигационного рецепта.
Никаких файловых ссылок в соседние plugins или fixture: installed reference самодостаточен. Имена FC/presenter skills
могут помогать агенту, но их установка не обязательна для чтения примера.

Проверяемые файлы находятся в `fixtures/modular-feature/`, вне поставки.
Два полных сценария list/create, update показан как расширение структуры:

```text
src/features/users/
  common/{data/{dto,mappers},domain/{entities,lib},ui/components}
  list/{app/routing,data/{api,dto,mappers},domain/{entities,fc,lib},ui/{components,pages}}
  create/{app/routing,data/{api,dto,mappers},domain/{entities,fc,lib},ui/{components,pages}}
  update/{app/routing,data/{api,dto,mappers},domain/{entities,fc,lib},ui/{components,pages}}
```

Это полная схема допустимых мест сценариев, не список обязательных пустых
папок. В данном примере полностью реализуются list/create; update показывает
допустимое расширение. Mapper по умолчанию находится в data/mappers своего
сценария и переносится в common только при реальном совместном использовании.
В цельном примере общие DTO и mapper действительно используются двумя
операциями. Generated API types переиспользуются; тестовые фабрики, constants и helpers colocated по владельцу.
У каждого сценария публичный `index.ts`, собственные FC state/action/reducer и
reducer.test.ts. UI не импортирует соседние сценарии; shared-инструменты — в
src/shared. Корневая композиция — в существующем src/store, доступ из feature UI
через публичный accessor. Context не импортирует bootstrap или feature UI
на исполнение; type-only связи root-контрактов описываются отдельно от runtime
циклов. Нет общего barrel, который через export UI затягивает bootstrap в FC.

### Потоки и границы

| Правило | Код и проверка в цельном примере |
| --- | --- |
| Сценарии/common | Публичные entrypoints, два потребителя общего mapper/model; запрещённые соседние/обратные импорты как отрицательные cases |
| API → domain | `data/api` описывает операции; `data/mappers` получает DTO и возвращает entities; factory связывает параметры/callbacks, общий app createApiEffector выполняет запрос/mapping |
| Чистый FC | Собственные factories и scopes `users-list` / `users-create`; пример namespace отличается от root key, чтобы проверить независимость имён |
| Unit tests | Готовые root/feature factories с overrides; action/scenario cases проверяют state/effect descriptions, result actions отдельно, без dispatch/I/O |
| UI | Страницы в ui/pages, presenter и тест рядом с компонентом, explicit inputs/result, несколько presenters допустимы, вложенные presenter calls запрещены |
| Сценарный переход | Create success описывает существующий NavigateEffect; app navigation adapter открывает list, list сам отправляет intent загрузки |
| Основа | Один store/provider, общий API/навигационный handler на уровне приложения, соседний slice для проверки сохранности |

Навигационный adapter fixture — явно тестовый app-контракт с контролируемым
открытием страницы, не gost-kit API или готовая router middleware. Он проверяет
переход и новую загрузку, не доказывает reset timing/отсутствие мерцаний реального
роутера. Общий reset показан только с фактическим `reset({ excluded })`; его
момент, отмена и stale-response protection не приписываются структуре фичи.

Агент сначала читает instructions проекта, artifacts/exports и существующие
composition/context/effects. Входы API недоверенные: synthetic schema, mapper и
mapErrors задают явные success/error формы, malformed response проверяется как
ошибка по фактическому common API. Фабрики получают валидные типизированные
начальные состояния, UI — documented idle/loading/ready/empty/error варианты.
Missing artifact/provider/shared handler оставляет integration incomplete без
нового store, auto-upgrade или самодельного библиотечного API.

### Проверки и документация

Внешний disposable consumer: npm common@0.3.0, svelte@0.2.0, совместимый Svelte 5
и Node 26; проверить реальные tarballs/exports и зафиксировать версии/hashes.
Реальный client/effector с injected fetch, а не mock reducers/mapper; unit и app
integration tests разделены. Reference source blocks сверяются с проверенными
файлами, проверяются типы, mapper/error flow, state/effect contracts, import graph
и negative cases; браузер — reactivity, страницы и intents. Архитектурный review
отдельно от compiler success.

До checker mutation — failing distribution case для отсутствующей четвёртой
entry; затем descriptor и регрессии missing/duplicate/version/containment с
сохранением всех прежних guards. Не рефакторить checker сверх добавления plugin.
В чистых native profiles проверить install/read/discovery, repeat, coexistence и
полные bytes всех четырёх plugins. Candidate ref не выдаётся за release tag.
Личные настройки не меняются; missing harness evidence оставляет incomplete.

Применение skill проверяет независимый агент: создание по synthetic request,
изменение и повтор без дублирования. Одинаковый baseline без skill записывается
отдельно, без требования искусственно получить провал. Отрицательный вход без
основы должен дать incomplete. Root full suite, strict OpenSpec и links/anchors
проверяются вместе с независимым review всего outcome. Root README, handoff,
queue и live #88 синхронизируются; данные review не входят в plugin docs.

## Risks / Trade-offs

- Дрейф reference/fixture → сверять source blocks и фактическое выполнение.
- Полный root type создаёт ошибочные runtime зависимости → type-only imports,
  отдельные entrypoints и проверка конкретного import graph.
- Skill принят за навигационную библиотеку → явный app adapter и scope gost-spec #89 / asc-admin #72.
- Неизвестный API/harness → конкретный incomplete, без подмены доказательства.
- Следующий выпуск snapshot затрагивает README-ограничение #102 → учитывать
  только в отдельном release outcome; #88 не меняет старые теги/плагины.

## Review ledger

Источники: полный body #88 и четыре комментария, включая [исходное ревью](https://github.com/antonsmolko/gost-spec/issues/88#issuecomment-6711390288)
и [доставку #97](https://github.com/antonsmolko/gost-spec/issues/88#issuecomment-6882464361).
Ранее закрытые R1/R2 и no-action R3 сохранены. Findings нового review записываются
здесь: Source | Finding | Affected files/issues | Disposition | Evidence.

### GitHub issue edits

План обновляет current checkpoint #88: #96/#97 доставлены; критерии сохраняются,
предлагаются имя/версия/поставка, implementation ещё не начата. Ссылки на план/PR
доставлены в [плановом PR #103](https://github.com/antonsmolko/gost-spec/pull/103);
live #88 содержит его ссылку. Критерии и закрытие #88 не менялись. S4 queue исправляется на доставленный PR #101,
S6 — подготовленный план gost-spec #88; gost-spec #102 и отложенные
gost-spec #89 и gost-kit #34 остаются отдельными.


### Independent plan review — 2026-11-14

Независимый агент получил artifacts, #88 и repository baseline без авторского
разговора; review PASS после исправления F1, других открытых findings нет.
Agent report — private input, not a public basis. Публичное основание —
[полное покрытие #88](https://github.com/antonsmolko/gost-spec/issues/88) и
сохраняемый proposed/content review contract; прежние R1/R2/R3 не переоткрыты.

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| [#88 coverage](https://github.com/antonsmolko/gost-spec/issues/88); independent agent private input, not a public basis | F1: plan нового frontend ID пропускал inventory и content-review учёт | proposal, design, tasks 1.1 | Fixed; independently rechecked | Inventory обновляется с новым ID; Pending content-approval row добавляется при начале review текста, не просто из-за утверждения плана; правила content-approval сохранены |

Plan verification: npm check 114/114 на Node 26.11.1, strict OpenSpec 14/14,
новый change valid, 8 требований / 16 сценариев / 0 из 7 implementation tasks.
Полный плановый diff и неизменённые FC/shell/presenter/distribution contracts
проверены отдельно от runtime tests; proposed/frontend inventory rules сверены.
Packages, plugins, catalogs, fixtures, scripts/tests и release tags не менялись.
Fresh marked lexer/walkTokens audit: 157 tracked Markdown / 277 local links /
28 fragments / 0 errors; git diff --check clean. Это проверки плана, не evidence
ещё не реализованного skill или его native установки.


### PR #103 review response — 2026-11-14

Прочитаны все четыре inline threads (hasNextPage=false), четыре summary reviews
с пустыми body, полный [PR-level review](https://github.com/antonsmolko/gost-spec/pull/103#issuecomment-6882956382)
и описание PR. Замечания сверены с полным body gost-spec #88 и его согласованным
списком примеров; прошлые R1/R2/no-action R3 и independently closed F1 сохранены.

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| [R4 cross-repo reference](https://github.com/antonsmolko/gost-spec/pull/103#discussion_r4575311082) | Неоднозначный bare #34 в issue-edits section | design | Fixed | Явно указаны gost-spec #89 / gost-kit #34; gost-spec #102 также квалифицирована |
| [R5 scenario layout](https://github.com/antonsmolko/gost-spec/pull/103#discussion_r4575311166) | Дерево допустимых мест пропускало scenario-local каталоги и update | design | Fixed | Дерево включает app/routing, data/api/dto/mappers, domain/entities/fc/lib, ui/components/pages для всех трёх сценариев; пример остаётся list/create, default mapper local с переносом в common по реальному reuse |
| [R6 existing documents](https://github.com/antonsmolko/gost-spec/pull/103#discussion_r4575311220) | README/changelog описаны как добавляемые | design | Fixed | Существующие frontend README/changelog дополняются, новым является changeset |
| [R7 explicit reference coverage](https://github.com/antonsmolko/gost-spec/pull/103#discussion_r4575311317) | Ссылки на gost-spec #87/#89 были только косвенным требованием | design, tasks 2.1, spec scenario | Fixed | Оба public URL явно входят в reference coverage, задачу 2.1 и Bound routing and persistence claims; доступный API и навигационный follow-up разделены |

Это уточнения формулировок уже согласованного покрытия, не новый контракт или
outcome. AGENTS §6 допускает wording-only exception; нового independent review
этого раунда не заявляется. Предыдущий PASS относится к своему snapshot.

#### GitHub issue edits for PR #103 review

Критерии, scope и закрытие gost-spec #88 не меняются; исправления согласуют план
с его существующим body. Checkpoint-комментарий после push связывает PR/commit
с этой таблицей. Связанные задачи других репозиториев не редактируются.


Review-fix verification: npm check 114/114 на Node 26.11.1, strict OpenSpec 14/14,
157 tracked Markdown / 277 local links / 28 fragments / 0 errors (marked
lexer/walkTokens), whitespace clean. Полный PR diff и релевантные неизменённые
FC/shell/presenter/distribution контракты просмотрены отдельно от runtime tests;
покрытие каталога/mapper/ссылок сверено с live gost-spec #88. Счётчики прежние:
8 требований, 16 сценариев, 0 из 7 implementation tasks. Packages, plugins,
catalogs, fixtures, scripts/tests и опубликованные теги не менялись.


## Initial implementation — 2026-11-14

Owner invoked apply after plan merge PR #103/main `985bd04`; work branch
`feature/gost-spec-88-modular-feature-implementation`, prefix [gost-spec-88].
Plan's plugin name/independent 0.1.0 preparation is selected; proposed content
and publication still require separate approval. Initial full check 114/114.

Task 1.1: FRONTEND-ARCH-003, frontend README/changelog/minor changeset, inventory
and Pending row added for review of the actual text. npm pack dry-run includes
all three architecture documents; other four packages and package versions
unchanged. Runtime implementation and native evidence are tracked below.

Ruling: root test discovery explicitly includes tests/**/*.test.* and the existing
view-presenter/src/catalog.presenter.test.ts because Node 26's
default discovery executes colocated fixture reducer tests before the external
consumer dependencies exist. Observed RED: requested list reducer missing via
root discovery. The fixture retains colocated reducer.test.ts; explicit fixture
commands exercise them in prepared consumers. Initial narrowed glob exposed 104 rather than baseline 114 tests; retaining the
existing presenter cases restores all 114 original tests. No modular-feature fixture behavior is counted as root-suite evidence.

Task 1.2: external npm ci succeeded; real registry tarballs inspected. Common
0.3.0 integrity sha512-XRKHjbW3/31u38SxF09tJBzIMLk23FyAOI6JoKtSqMOJGc9X9B5/0YIITb5aVEsvpsoWxJnJPE8obKuu+4oBWw==;
svelte 0.2.0 integrity sha512-7nSr5Tz2UF2BxSX/Y8o05nxzRmsBud2RLxa6e2DFWqiOi1Yd02lryDEJELubQnKtBti/jyv0elM9ljE42lakQA==.
Both public root exports and engines checked; no workspace library imports.
RED requested reducer missing; factory-built reducer tests GREEN (11 cases).
App API/navigation integration plus concrete import-graph checks GREEN (8 cases);
tsc includes operation/mapper/action negative cases. EnterAction separately
RED→GREEN verifies opening resets query while refresh LoadAction preserves it.
Type-only store contracts/context reuse the existing foundation pattern.

Task 1.3: presenter tests RED before implementation; browser RED on the absent
Users heading in the existing foundation. GREEN: 19 unit cases (11 reducer,
8 presenter), 8 app/import checks, Svelte/tsc 0 errors/0 warnings, build succeeds,
4 Chromium checks (reactive filter/empty rows, validation + creation + new fetch
and fresh query/form, HTTP error, missing provider). Expected missing-provider
console/page error is asserted only in its negative test. No real router/reset
timing guarantee claimed. Initial transport-prop capture warning was removed
with a transport closure without recreating store/provider.

Task 2.2: missing fourth delivery RED was observed before checker changes.
Existing descriptors now declare an explicit references array so the new plugin
requires both recipe and complete source listing; file whitelist/containment
gates remain intact. No broad checker refactor. Both catalogs append one local
entry; old plugin payloads untouched. GREEN: 63 distribution cases, full root
check 121/121 (114 originals + 7 new). New cases cover absent/duplicate/redirected
entry, mismatched versions, missing full example, external URI and sibling escape.
Quick skill validator succeeded in an isolated PyYAML venv; no validation
dependency was added to the product. Shared brand icon/license reused.

Skill evaluation control: independent no-skill application succeeded (8 unit,
6 integration, 1 Chromium, check/build). Its initial missing-module test was
reported as such, not an assertion failure. The request itself gave the layout;
no comparative advantage is claimed. Owner-requested reference guidance remains
the product; the with-skill/change/repeat and prerequisite passes are separate.

Task 2.1: concise English skill plus primary recipe and 53 complete tested source
blocks (including configurations/tests). External parity check covers every src
module; both references are contained in the plugin. The architecture URL pins
public draft commit f1d6e56; references explicitly link gost-spec #87/#89.
Independent prerequisite tests inspected three separate consumers: missing
artifacts, missing provider invocation and missing application handler. All
reported incomplete before dependent edits, with all supplied source hashes
unchanged. Provider/handler copies compiled, illustrating why compilation alone
does not establish runtime readiness; zero discovered unit tests were explicitly
not counted as evidence. The missing handler throw was asserted before any
transport call. These reports are private input, not a public basis; public
actionable basis is #88 plus this change's prerequisite scenarios.
Architecture-source fetch was outside the isolated agent evaluation boundary
and is recorded unverified there, not silently claimed as read.

With-skill forward application: independent agent used the same synthetic request
and foundation, plus only the copied skill/recipes. Initial checks/build, 19 unit,
9 integration/import and 2 applicable Chromium cases passed. A separate filtered
count change was assertion RED→GREEN, with 20 unit/9 integration/2 browser cases;
delta was limited to list presenter/test/component/browser test. Reapplication
retained count and changed no source bytes; provider/store, slices/namespaces,
exports and app API/navigation tables remained unique. Fourteen baseline
infrastructure/health/schema/demo/lock/config files were preserved by hash.
The two demo-only URL diagnostic cases were not applicable to the existing
consumer main and initially failed; the agent removed those cases rather than
modifying existing bootstrap just for diagnostics. Requested errors remain
covered by API/unit tests; browser API-error behavior in this adapted consumer
was not separately demonstrated. The author's complete fixture separately
checks API-error/missing-provider browser diagnostics. A failed 4195-port run
was discarded; an owned 4297 strictPort/reuseExistingServer:false config passed.
These limits do not certify real routing/reset timing, persistence or health
request execution. Agent reports are private input, not a public basis; #88
and its application/repeat scenarios are the public actionable requirement.
No superiority over the passing no-skill control is claimed.


### Historical Task 2.3 native candidate evidence — before PR #104 review

Public source https://github.com/antonsmolko/gost-spec.git, branch
feature/gost-spec-88-modular-feature-implementation; both native clone HEADs
resolved to `3562e575dea3cfd790930b60c0419046a8188674`. Codex 0.169.0 and Claude
Code 2.1.308 used distinct fresh CODEX_HOME/CLAUDE_CONFIG_DIR, an empty cwd and
unchanged HOME. Only temporary profiles were mutated; personal config/settings/
installed-plugin/marketplace hashes remained unchanged. No model turn was run.

Successful command pattern (each host in its own isolated profile):

```sh
codex plugin marketplace add https://github.com/antonsmolko/gost-spec.git --ref feature/gost-spec-88-modular-feature-implementation --json
claude plugin marketplace add 'https://github.com/antonsmolko/gost-spec.git#feature/gost-spec-88-modular-feature-implementation' --json
for plugin_name in gost-svelte-shell gost-functional-core gost-view-presenter gost-feature; do
  codex plugin add "$plugin_name@gost" --json
  codex plugin add "$plugin_name@gost" --json
  claude plugin install "$plugin_name@gost" --json
  claude plugin install "$plugin_name@gost" --json
done
codex plugin list --json
claude plugin list --json
```

Each inventory contained four unique enabled entries with versions shell 0.3.0,
FC 0.2.0, presenter 0.1.0 and feature 0.1.0. All files in all eight installed
plugin trees matched git-show bytes at that exact candidate, not local workspace
imports. Native selected refs were checked in Codex's [marketplaces.gost].ref
and Claude known_marketplaces source.ref, plus actual clone HEAD.

| Plugin | Files per host | Installed map SHA256 (both hosts) |
| --- | --- | --- |
| gost-svelte-shell | 8 | 399b22999f56bc37ee42d239284f7e943f737ea7c0361996d60b43cc71fcd281 |
| gost-functional-core | 8 | d344caaaa7b97e714e46d2af00858626a9de247b1f49ddf4e26cbad99427c0cf |
| gost-view-presenter | 8 | 7df3a69d9f03f9fed4e027b36b6b167702d1944214dbc3612ea914c639f045ea |
| gost-feature | 9 | 1d975651592284e461891ccd1375d0122bbde12f11f058ef4fc6698d84c48db4 |

Map digest = SHA256 of UTF-8 json.dumps(relative-path → file SHA256,
sort_keys=True,separators=(',',':')). Codex fresh app-server initialize/initialized
then skills/list(cwds=[empty cwd],forceReload=true) returned four enabled namespaced
GOST skills from isolated plugin caches, zero discovery errors. Generic personal
skill metadata may also be listed by the native discovery protocol; it was not
changed or counted as a GOST result. Claude plugin details for each entry reported
Skills (1) with expected identity/version and readable local references.

Standalone follow-up removed only the three old plugins through native commands,
leaving gost-feature installed in each profile. Fresh discovery/details then
confirmed only that GOST skill; all its references stayed inside its own cache.
Restored the three deliberately retained plugins, confirmed four enabled entries
again and rechecked complete installed maps. No source selector was changed.

An initial harness call failed because its newly selected CODEX_HOME directory
had not been created. That failed command is not installation evidence; profiles
were recreated with existing directories and the complete successful sequence
above rerun. The only candidate payload change before native checks was removal
of an extra EOF blank line in the full listing; its complete code blocks were
unchanged from the independent application input. Draft checks do not imply
publication: no gost-feature release tag was created, old tags/payloads remain
unchanged. Source candidate receipts do not certify asc-admin or a final release.

### Implementation GitHub issue edits

Live gost-spec #88 checkpoint records explicit apply authorization, branch/prefix
and task progress; source criteria and related issue closures remain unchanged.
The current queue and handoff point to implementation. After independent review
and final checks, the implementation PR link and final counts are recorded here
and in #88. Proposed acceptance and future release remain separate.


### Independent implementation review

Sources: [gost-spec #88](https://github.com/antonsmolko/gost-spec/issues/88),
all approved change artifacts, complete implementation diff and relevant unchanged
contracts; independent report is private input, not a public basis. Prior closed
requirements/plan findings remain closed. The reviewer independently reran root
121/121 and external consumer checks and inspected native payload evidence.

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| [#88 accurate checkpoints](https://github.com/antonsmolko/gost-spec/issues/88); independent review private input, not a public basis | I1: queue S6 still described the already verified example as requiring artifact verification | readiness S6/current checkpoint | Fixed; independently rechecked | S6 records actual npm common 0.3.0 / svelte 0.2.0 verification; at focused rereview status stayed 6/7 pending final PR presentation |


Independent final review PASS: no open findings after I1 focused rereview. The
reviewer independently ran root 121/121, external Svelte/tsc (0 errors/warnings),
19 unit and 9 integration/import/parity cases, strict 14/14 and marked link audit
165 Markdown/293 local links/28 fragments/0 errors. All 53 complete blocks matched
fixture/consumer; all 8 native installed maps matched source and recorded digests.
Browser/build and agent evaluation evidence were inspected, not independently
rerun by that reviewer; their existing limits remain stated above. The private
report is not a public basis; #88 and this change's requirements are the public
acceptance basis. All earlier closures are retained. This PASS concerns
implementation readiness, not normative acceptance, merge or publication.

Final author checks: root 121/121; strict 14/14; full concrete consumer check,
19 unit/9 integration/4 Chromium/build; marked 165 Markdown / 293 local links / 28 fragments / 0 errors and diff --check clean.
Old three plugin payloads and four other normative packages are unchanged from
main 985bd04; all five package versions remain 0.1.0. Frontend's minor changeset is
pending. Candidate source 3562e57 is the native-verified payload; subsequent
receipt/status edits do not change it. No real release tag or asc-admin change.


### Implementation PR checkpoint

[PR #104](https://github.com/antonsmolko/gost-spec/pull/104) presents this one
verified outcome. Task 3.1 is complete: 7/7 implementation tasks; no merge,
publication or proposed-content acceptance performed. Queue/handoff and live
#88 record the PR and current counts. Issue #88 stays open pending approved
delivery; archive/sync and future releases are separate workflow steps.
Only receipt/status/link prose changed after the native-verified payload.


## PR #104 review round

Read all five inline threads (hasNextPage=false), all five summary reviews
(empty bodies), complete [PR-level review](https://github.com/antonsmolko/gost-spec/pull/104#issuecomment-6883841307)
and PR description. Prior I1 and all requirements/plan closures are retained.
The earlier implementation PASS/native receipts describe their named snapshot;
R3 changes the verification code/listing payload and needs renewed checks.
Tasks 2.1, 2.3 and 3.1 are reopened until that evidence and replies are complete.


| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| [PR104-R1](https://github.com/antonsmolko/gost-spec/pull/104#discussion_r4575542875) | Both proposed revisions became ambiguous after the third frontend row | requirements-inventory | Fixed | Names FRONTEND-ARCH-001/002 explicitly; no normative wording/status changed |
| [PR104-R2](https://github.com/antonsmolko/gost-spec/pull/104#discussion_r4575542935) | Four-plugin list had two coordinating ands | root README | Fixed | Comma series followed by one final and |
| [PR104-R3](https://github.com/antonsmolko/gost-spec/pull/104#discussion_r4575542976) | Source-to-listing completeness ignored checks/configs and runtime check discovery was hardcoded | fixture checks/package.json, packaged recipe/listing | Fixed; renewed payload/native/review checks in progress | Three real assertion RED cases now GREEN; src/checks/root configs require blocks, checks have explicit runtime/type/browser roles, recursive runtime discovery replaces enumerated filenames |
| [PR104-R4](https://github.com/antonsmolko/gost-spec/pull/104#discussion_r4575543016) | Repo-relative listing link breaks in the instructed consumer copy | fixture README | Fixed | Uses local users-example.md or GOST_FEATURE_EXAMPLE, matching the actual parity input; no outside-consumer link |
| [PR104-R5](https://github.com/antonsmolko/gost-spec/pull/104#discussion_r4575543085) | Lowercase sentence start and glued counts in canonical ledger | design | Fixed | Sentence capitalization and All 53 / marked 165 Markdown, 293 local links, 28 fragments, 0 errors made explicit |

### R3 verification contract and evidence

The fixture gate takes a maintainer-prepared consumer directory and listing text
from users-example.md or the explicit GOST_FEATURE_EXAMPLE file. It parses code
blocks as text, never evaluates Markdown. Block-to-file equality and in-consumer
path checks remain. Reverse completeness now walks src/ and checks/ recursively,
plus root TS/JSON/HTML configuration files; package-lock.json remains a separately
supplied artifact, not a source block. Missing/duplicate blocks, mismatched file
text, missing required source blocks or unsupported check roles fail with the
file/reason, not a readiness claim. Missing reference input still fails explicitly.

Runtime checks are checks/**/*.test.ts, Playwright checks are *.pw.ts, and
compile-only negative type cases are *.types.ts. Unknown TypeScript check roles
fail completeness even when listed; this prevents new checks silently running
nowhere. Existing integration/import/parity files were renamed accordingly,
without feature/app behavior changes or a new runner. There is no generic lint
product or change to consumer architecture requirements.

RED: three actual assert.throws cases reported Missing expected exception under
the previous src-only gate: an unlisted checks/unlisted.test.ts, an unlisted
future.config.ts and a listed but unclassified checks/unclassified.ts. GREEN:
12 integration/import/parity cases; 19 pure unit cases, Svelte/tsc 0 errors and
warnings, build and 4 Chromium checks. The complete listing still has 53 blocks,
regenerated from the checked renamed files/config. Root 121/121 remains unchanged.
The skill entrypoint and business/app source are byte-identical; previous
independent application/change/repeat/prerequisite evidence remains limited to
its recorded input, while current listing/gate/native evidence is renewed.

### GitHub issue edits for PR #104 review

Only checkpoint progress/current evidence is updated in gost-spec #88; criteria,
related issue scope/closures and proposed/release gates remain unchanged. Earlier
7/7 and native receipts refer to the pre-review snapshot, not proof of the changed
listing. Tasks 2.1/2.3/3.1 were reopened; 2.1 is complete after current parity/type/
consumer checks, leaving 5/7 until renewed native delivery and independent review.
