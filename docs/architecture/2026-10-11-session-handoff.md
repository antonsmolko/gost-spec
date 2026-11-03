# Передача контекста разработки gost-spec

Change `rename-svelte-shell-plugin`, #64, завершён и архивирован: 9/9.
Имя plugin и skill — `gost-svelte-shell`; fc/shell поведение сохраняется.

Упаковка skill в общий native plugin для Codex и Claude, #55, завершена и архивирована;
см. дополнение в конце. Исходный skill #54 завершён и архивирован; его основной
контракт подключения сохранён.
Датированные снимки и review common-стандарта сохранены как история.

Обновлено 2026-10-22 при добавлении proposed TS-COMMON-001 поверх origin/main после merge PR #50 с TS-FUNCTIONS-001. Техническая платформа завершена, presenter #42 добавлен как proposed. GitHub repository и origin используют gost-spec, отдельный gost-kit содержит начальную структуру. При возобновлении сверить снимок с GitHub и текущей веткой.

## Откуда продолжать

Archive/spec sync #55 доставлен в main через
[PR #65](https://github.com/antonsmolko/gost-spec/pull/65), commit `c7c879c`.
Повторно архивировать или искать незакоммиченный локальный перенос не требуется.
Переименование [#64](https://github.com/antonsmolko/gost-spec/issues/64)
доставлено в main через [PR #67](https://github.com/antonsmolko/gost-spec/pull/67),
а pin history восстановлена штатным merge
[PR #68](https://github.com/antonsmolko/gost-spec/pull/68), commit `f7e38b1`.
P2f567ab5 — ancestor main; отдельный main-only checkout проходит full check 72/72.
Повторно восстанавливать историю или считать pin утраченным не требуется.
Change архивирован с sync основной distribution spec: 9 требований / 19 сценариев;
план и evidence — [архив rename](../../openspec/changes/archive/2026-11-03-rename-svelte-shell-plugin/design.md).
Доставка archive/spec sync в main — отдельный documentation PR; runtime/plugin
и source.sha на этом шаге не меняются. Датированные статусы ниже — история.
Следующие независимые задачи —
[#62](https://github.com/antonsmolko/gost-spec/issues/62), читаемость всех
`scripts/` и `tests/helpers/`, и
[#63](https://github.com/antonsmolko/gost-spec/issues/63), размещение тестов рядом
с исходниками. Подключение маркетплейса и применение skill к asc-admin — отдельный
следующий шаг после отдельного решения владельца; миграция фич не входит в эти задачи.

Архитектурная база сохранена в историческом решении
[#30](https://github.com/antonsmolko/gost-spec/issues/30) и
[simplify-project-scope](../../openspec/changes/simplify-project-scope/proposal.md).
Общий контекст — [дизайн](../superpowers/specs/2026-10-11-engineering-standards-design.md)
и [roadmap](../superpowers/plans/2026-10-11-engineering-standards-independent-packages.md);
задачи закрытого этапа не задают текущую очередь реализации.

## Продукт

Пять independently versioned npm-пакетов документов: core/frontend/TypeScript/Svelte/Svelte SPA. Применение пакетов целиком, совместимость текстом README, ручные ссылки в AGENTS.md потребителя. CLI/config, resolver, manifests/schema и генерация не нужны для начального продукта. Планы на русском; публичные документы и диагностика на английском. Двуязычность — возможное дальнейшее развитие.

## Текущее состояние

- PR #29 добавил typed check; #9 закрыта, невыполненная часть Changesets теперь отслеживается #34.
- PR #31 и #30 завершили только согласование плана.
- #33 завершена PR #37: репозиторий переведён на пять документальных workspaces; каталоги/схемы/loader и tooling-заглушки удалены; README индексируют документы, statuses/levels перенесены в их заголовки без принятия содержания.
- Есть реальные tarball и offline-consumer tests; install-offline.ts используется только тестами.
- Версии всех пяти пакетов — 0.1.0. Тринадцать требований proposed, ноль accepted; публикации нет.
- #34 завершена PR #38: Changesets 3.0.3, штатные команды, независимые версии/changelog и две TS integration-проверки на временных fixtures. [Руководство](../../.changeset/README.md). #18 завершена PR #39: verification CI работает, оба Node jobs успешны; инструкция подготовки/ручного выпуска завершена #35/PR #40; реальной публикации нет. Зелёные тесты/merge плана не принимают стандарты и не разрешают публикацию.

## Ближайшие действия

Текущая очередь согласуется в #45: roadmap #1, постепенное накопление первого принятого набора #20 и отдельно одобренный выпуск #26. PR #41/#42 завершены: FRONTEND-ARCH-002 остаётся proposed; merge не является content acceptance. Читать [документ](../../packages/domains/frontend/architecture/presenter-composition.md) и [content approval](content-approval.md). Новые стандарты и их ревью начинаются с конкретной проблемы; массово принимать все drafts не требуется. Не начинать реализацию по номеру старой закрытой задачи. #20 остаётся открытой до минимум одного применимого accepted ID из каждой core/TypeScript/Svelte SPA; кандидаты не предрешают решения. npm-имена/версии пяти пакетов и historical evidence URLs сохраняются, старый GitHub URL перенаправляется. Исполняемые библиотеки разрабатываются отдельно в gost-kit по собственным конкретным задачам.

Неактуальные задачи закрыты как not planned; причины и история замен — в [roadmap](../superpowers/plans/2026-10-11-engineering-standards-independent-packages.md#отложенные-работы).

PR #48/#47 добавил [TS-TYPES-002](../../packages/technologies/typescript/docs/type-aliases.md): type по умолчанию, interface для требуемого declaration merging. Точный текст остаётся proposed; реализация #47 не закрывает #20 и не разрешает выпуск. OpenSpec change — [prefer-type-aliases](../../openspec/changes/prefer-type-aliases/proposal.md).

PR #50/#49 добавил [TS-FUNCTIONS-001](../../packages/technologies/typescript/docs/arrow-functions.md): предпочтение const-bound arrow functions ради единообразия, уровень recommended; обычные функции допустимы без обоснования. OpenSpec — [prefer-arrow-functions](../../openspec/changes/prefer-arrow-functions/proposal.md). Оба новых стандарта остаются proposed; принятия содержания и закрытия #20 нет.

## Принятие и выпуск

Принятие содержания и сохранение чернового статуса — по [content approval](content-approval.md) и [inventory](requirements-inventory.md). Gates первого выпуска и проверка реальных артефактов закреплены в [#26](https://github.com/antonsmolko/engineering-standards/issues/26); infrastructure/fixture success их не заменяет.

## Проверки и рабочий процесс

Только Node ^26.0.0. Проверяются нижняя граница 26.0.0 и закреплённая .node-version 26.11.1. Старые Node не поддерживаются. npm ci --ignore-scripts подготавливает зависимости/cache; npm run check проверяет типы, текущую согласованность и весь suite, включая настоящие packed artifacts/external consumers. Пустой offline cache даёт guidance. Исторические результаты нельзя выдавать за свежие.

Изменения в issue-scoped ветках от main, commits [gost-spec-<issue>]: <English description>. Читать AGENTS.md, при behavior changes запускать RED до реализации, после — GREEN/full suite. Перед завершением независимо проверять полный результат и согласованность документов/задач отдельно от runtime-тестов. Без merge/publish, tags или credentials/protection без явного разрешения. Потребитель и staff-ветка asc-admin не меняются.

## История

[Прежний handoff](https://github.com/antonsmolko/engineering-standards/blob/d483438/docs/architecture/2026-10-11-session-handoff.md) — исторический снимок CLI-плана. Review ledgers PR #3/#27/#29 остаются на месте, reviewer-confirmed closures не переоткрываются. Их старые runtime API не являются текущими требованиями. Приватный docs-review не публикуется и не является публичной основой; основание нового scope — #30/PR #31.

## Дополнение 2026-10-22: common types и guard

Снимок проверен: PR #50 merged, #49 closed; новая локальная ветка
feature/gost-spec-common-utilities создана от origin/main. Добавлен proposed
TS-COMMON-001, required: @gost-kit/common helpers/guards при точной эквивалентности
для проектов, явно выбравших эту policy; объединённые value/type imports. См.
[change](../../openspec/changes/archive/2026-10-31-reuse-common-types-and-guards/proposal.md).
Прежнее Local-only положение guard и его rationale сохранены; pending предложение
их не заменяет. Правило «один публичный тип — один файл» остаётся конвенцией
gost-kit, не обязанностью потребителя. Принято 0 требований.
Текст pending, имя библиотеки сверено по локальной release-preparation ревизии;
публикация не предполагается.

## Review-исправления 2026-10-31

Замечания к TS-COMMON-001 отслеживаются в [#52](https://github.com/antonsmolko/gost-spec/issues/52),
исключение локальных IDE/agent/review материалов — отдельный outcome
[#53](https://github.com/antonsmolko/gost-spec/issues/53). Carrier-ветка
`feature/gost-spec-51-state-foundation-plan`, retained prefix `[gost-spec-52]`;
критерии и закрытие #51 не меняются. Результаты не объединяются в один будущий
implementation PR. Критерии #20/#26, версии пакетов и approval gates сохранены.
Канонический [review ledger](../../openspec/changes/archive/2026-10-31-reuse-common-types-and-guards/review.md)
содержит новые findings и сохраняет историю предыдущего раунда.
Change #52 архивирован 2026-10-31 после 6/6 задач. `skip_specs: true`: дельт
OpenSpec нет, синхронизация не выполнялась. TS-COMMON-001 остаётся proposed,
решение владельца — Pending; прежние Local-only и rationale сохранены.

## Skill подключения fc/shell — #54

После согласования плана владелец явно вызвал apply для
[integrate-svelte-spa-state-foundation](../../openspec/changes/archive/2026-10-31-integrate-svelte-spa-state-foundation/proposal.md).
Implementation [#54](https://github.com/antonsmolko/gost-spec/issues/54), ветка
`feature/gost-spec-54-state-foundation-skill`, база `15d5630`; это отдельный outcome
поверх ранее сохранённых #51/#52/#53, их criteria/closure не расширяются.

Change перенесён в архив 2026-10-31 после выполнения всех 12 задач. Актуальный
контракт — [svelte-spa-state-foundation](../../openspec/specs/svelte-spa-state-foundation/spec.md):
8 требований и 8 сценариев; их текст и Purpose сохранены из согласованной дельты.

Исходный [skill](../../plugins/gost-svelte-shell/skills/gost-svelte-shell/SKILL.md) подключает пустую
основу к существующему Svelte 5 SPA; [API recipe](../../plugins/gost-svelte-shell/skills/gost-svelte-shell/references/foundation.md)
фиксирует проверенный development snapshot gost-kit. Незакоммиченная параллельная
работа в sibling gost-kit не менялась: tarballs собраны из отдельного git archive
ревизии `7eca0ea`. Baseline SPA и поведенческие проверки synthetic, без доступа к
asc-admin или копирования его материалов.

Агент без skill выполнил подключение, но оставил dispatch/effects непроверенными.
Со skill другой агент проверил их через disposable browser probe; повторное
применение сохранило все 15 source/config hashes. Missing-artifact сценарий
завершился явным incomplete без изменения файлов. Full check — 48/48 на Node
26.0.0 и 26.11.1; внешний target/probe прошли check/build/Chromium. Независимое
review полного результата завершено без actionable findings; evidence и
ограничения — в [design ledger](../../openspec/changes/archive/2026-10-31-integrate-svelte-spa-state-foundation/design.md).

Skill пока не отдельный публикуемый пакет и не часть пяти npm workspaces.
Его упаковка/независимая версия, применение в реальном потребителе и миграция
фич — последующие согласуемые работы. Нормативные статусы и gates #20/#26 сохранены.

Follow-up review #54 явно закрепляет `reuseExistingServer: false` в fixture:
занятый 4187 должен останавливать проверку до выполнения cases. Проверенный
Playwright 1.64.1 уже отклонял занятый URL при отсутствии опции; ранние результаты
не считаются недействительными из-за предполагаемого default reuse. Отказ до/после
изменения, положительные target/probe cases и full suite повторно проверены;
независимое review без замечаний. Все пять dispositions — в том же design ledger.


## Упаковка plugin — #55, 2026-11-01

Завершённый [change](../../openspec/changes/archive/2026-11-01-package-state-foundation-plugin/proposal.md)
реализован на carrier `feature/gost-spec-54-state-foundation-skill`, prefix
`[gost-spec-52]`. Единственный skill/recipe перенесён без изменения bytes в
`plugins/gost-svelte-spa-state/skills/`; plugin 0.1.0 имеет два manifests,
LICENSE/README/icon и собственный changelog. Каталоги находятся в
`.agents/plugins/marketplace.json` и `.claude-plugin/marketplace.json`.
Только публичный marketplace.json разрешён внутри ignored .agents.

Подготовленный content commit — `385a0bce81febdad67013f59bc6623a60021cddb`;
Claude source.sha закрепляет его. Следующий catalog commit должен содержать
идентичное plugin tree для Codex. Content commit и catalog commit `d48b9bd` запушены в feature-ветку.
Отдельный выпуск и native установка из публичного GitHub source не подтверждены. Native install/discovery,
повтор, patch update и rollback проверены на loopback Git source в disposable
профилях Codex 0.166.0 и Claude 2.1.308; оба поставляют один skill с namespace
`gost-svelte-spa-state:gost-svelte-spa-state`. Ошибочный старый отрицательный
Codex inventory отозван: причиной была перезапись config тестовым helper.

Read-only gate проверяет полное Git tree pin, metadata и файловые границы;
полный suite включает реальные document tarballs/external consumers. Актуальные
результаты, ограничения, issue edits и review — в [design ledger](../../openspec/changes/archive/2026-11-01-package-state-foundation-plugin/design.md).
Пять npm-пакетов и контракт fc/shell не менялись. asc-admin не подключён,
миграция фич не выполнялась. Apply завершён: 13/13. Реализация слита в main;
локальное архивирование выполнено 2026-11-01 по явному запросу владельца.
Публикация и применение к asc-admin требуют отдельных указаний.


Дополнение после восстановления GitHub MCP: live #55/#54 синхронизированы с
реализованным source.sha контрактом, native evidence и новым canonical path;
ранние 4/13 и 6/13 записи помечены historical. Обе issues открыты;
implementation [PR #56](https://github.com/antonsmolko/gost-spec/pull/56) выделен отдельно.
Локальный outcome завершён: 13/13, финальное независимое review без actionable
findings. Свежий full check — 72/72 на Node 26.0.0 и 26.11.1; подробности —
[tasks](../../openspec/changes/archive/2026-11-01-package-state-foundation-plugin/tasks.md)
и [design](../../openspec/changes/archive/2026-11-01-package-state-foundation-plugin/design.md)
архивированного change. Commit C каталогов/проверок — `d48b9bd`;
после интеграции выполнен archive с синхронизацией distribution spec.


## Интеграция outcomes — 2026-11-01

Владелец явно запросил интеграцию после создания PR #56. Исходные outcomes
разделены в [#57](https://github.com/antonsmolko/gost-spec/pull/57) (план #51),
[#58](https://github.com/antonsmolko/gost-spec/pull/58) (гигиена #53),
[#59](https://github.com/antonsmolko/gost-spec/pull/59) (common #52),
[#60](https://github.com/antonsmolko/gost-spec/pull/60) (skill #54) и
[#61](https://github.com/antonsmolko/gost-spec/pull/61) (план plugin #55).
Текущее состояние merges/CI проверять по этим PR и #56. Дерево собранной базы
побайтово совпадает с 3a52702; обычный merge сохраняет исходную carrier history
и неизменяемый source.sha P. После каждой ступени следующий PR переводится на
main и проверяется относительно актуальной базы. Разделение независимо
проверено; одна ошибка раннего handoff исправлена и reviewer-confirmed closed.
Разрешение merge этих outcomes не принимает proposed стандарты и не разрешает
публикацию, release tags или применение skill к asc-admin.

## Архив plugin distribution — 2026-11-01

По явному запросу владельца и выбору «Синхронизировать и архивировать» change #55
перенесён в `openspec/changes/archive/2026-11-01-package-state-foundation-plugin/`.
Основной [контракт поставки](../../openspec/specs/state-foundation-plugin-distribution/spec.md)
создан из согласованной дельты: Purpose, все 8 требований и 14 сценариев
сохранены без изменения текста. Все artifacts complete, задачи 13/13.
Исходный fc/shell capability contract, plugin bytes, source.sha и пять npm-версий
не менялись. Архив не означает публикацию или применение к asc-admin.

## Переименование Svelte shell — #64

Исторический снимок реализации 2026-11-01 до README-коррекции P2 и repair68;
текущее состояние приведено в «Откуда продолжать» и архивном ledger.

Новый canonical source — `plugins/gost-svelte-shell/skills/gost-svelte-shell/`.
Content commit P — `9007936e0d4e4732d9271de8e0222c5b96c418ea`; Claude catalog
закрепляет этот SHA, Codex использует идентичное дерево новой поставки.
Плагин и skill имеют имя `gost-svelte-shell`, marketplace остаётся `gost`, версия
новой идентичности — 0.1.0 unreleased. Для старых установок нужен явный переход
uninstall/install; инструкции — в [plugin README](../../plugins/gost-svelte-shell/README.md).
Это смена identity без изменения fc/shell, library compatibility или SPA scope.
Основная distribution spec пока хранит прежнюю поставку; её MODIFIED/ADDED
контракт обновится при последующей синхронизации дельты #64. Код приложения
не менялся, native fresh install/migration/incomplete/rollback проверены в обоих
харнесах в disposable profiles. Полный check — 72/72 на обоих Node; независимое
review без открытых findings. P9007936 и catalog Ce781b2e сохранены и запушены
для PR #66; актуальная archive base — PR #65. После доставки rename выполняется
отдельный archive/sync его дельты.
