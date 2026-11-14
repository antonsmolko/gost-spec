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

Предложение автора: отдельный plugin/skill `gost-feature@0.1.0` unreleased,
одна общая исходная папка для двух manifests и локальные entries обоих catalogs.
Добавление в FC plugin смешало бы чистые reducers с layout/UI; shell plugin
отвечает за однократное подключение основы. Отдельная поставка следует уже
используемому разделению; имя/версия являются предложением плана, не ранее
полученным согласованием владельца.

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
