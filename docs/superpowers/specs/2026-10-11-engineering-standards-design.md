# Спецификация публичного набора стандартов разработки

Актуальный scope согласован в [#30](https://github.com/antonsmolko/engineering-standards/issues/30) и [PR #31](https://github.com/antonsmolko/engineering-standards/pull/31). Контракт и сценарии находятся в specs [пакетов](../../../openspec/changes/simplify-project-scope/specs/standards-packages/spec.md) и [подключения](../../../openspec/changes/simplify-project-scope/specs/manual-consumer-adoption/spec.md); этот документ — обзор продукта.

## Цель и границы

Gold Standard Specifications (`gost-spec`) распространяет инженерные документы для людей и AI через пять независимо версионируемых npm-пакетов. Потребитель устанавливает выбранные пакеты, читает README и применяет применимые принятые стандарты каждого пакета целиком. В AGENTS.md вручную добавляются ссылки на установленные README и указание читать связанные документы. Конкретный AI-инструмент не обязателен.

Каталоги требований, manifests/JSON-схемы, resolver, выбор отдельных правил, генерация файлов, Engist CLI и ESLint/Prettier-конфиги не входят в начальный продукт. Двуязычные издания и новые области/модули — возможное развитие, требующее собственного use case и согласования. Продуктовые требования и приватные материалы потребителей не переносятся в публичные пакеты.

Исполняемые библиотеки разрабатываются отдельно в [gost-kit](https://github.com/antonsmolko/gost-kit); установка документальных пакетов не устанавливает runtime-библиотеки.
Новый proposed [TS-COMMON-001](../../../packages/technologies/typescript/docs/common-types-and-guards.md)
предлагает явно настроенный @gost-kit/common только для проектов, выбравших эту
shared-library policy. Организация типов по файлам остаётся конвенцией проекта.
Предложение не заменяет Local-only disposition в inventory и не означает принятия
содержания. Переименование проекта не меняет npm-имена или версии пакетов стандартов.

## Исходные skills

Отдельное согласованное развитие — исходный Agent Skill подключения fc/shell к
существующему Svelte 5 SPA, [change](../../../openspec/changes/archive/2026-10-31-integrate-svelte-spa-state-foundation/proposal.md),
implementation [#54](https://github.com/antonsmolko/gost-spec/issues/54).
После завершения change актуальный
[контракт возможности](../../../openspec/specs/svelte-spa-state-foundation/spec.md)
хранится в основных OpenSpec specs, а план и evidence — в архиве change.
Единственный исходник shell skill хранится в `plugins/gost-svelte-shell/skills/`, отдельно
от пяти документальных workspaces. [Упаковка #55](../../../openspec/changes/archive/2026-11-01-package-state-foundation-plugin/proposal.md)
добавила один native plugin и каталоги Codex/Claude; версия и changelog плагина
независимы от npm-пакетов. Поставка обновлена в
[#70](https://github.com/antonsmolko/gost-spec/issues/70), implementation
[PR #73](https://github.com/antonsmolko/gost-spec/pull/73): оба каталога выбирают
локальное общее дерево внутри snapshot маркетплейса. Пользователь выбирает один
release tag `gost-svelte-shell-v<version>` в обоих харнесах; отдельного content SHA
для новой поставки нет. Тег создаётся на проверенном итоговом main commit после
merge и отдельного release approval, а не на каждый рабочий commit.
Текущий [контракт поставки](../../../openspec/specs/state-foundation-plugin-distribution/spec.md)
дополнен при архивировании
[change #64](../../../openspec/changes/archive/2026-11-03-rename-svelte-shell-plugin/proposal.md):
identity `gost-svelte-shell`, явная переустановка и условный legacy-возврат Claude
после восстановления old entry/ID/pin мейнтейнером. Для новых выпусков возврат
выбирает прежний существующий release tag; первый выпуск не создаёт автоматически
предыдущий тег. Синхронизацию основного контракта с #70 и архивирование доставляет
отдельный documentation [PR #74](https://github.com/antonsmolko/gost-spec/pull/74):
11 требований / 27 сценариев; план и evidence сохранены в
[архиве](../../../openspec/changes/archive/2026-11-04-simplify-plugin-release-versioning/proposal.md).
Первоначальная основа подключения сохраняется.
Установка не запускает skill: подключение runtime-библиотек требует явного
вызова. Публикация, применение в реальном потребителе и миграция фич остаются
отдельными действиями; gates принятия и выпуска стандартов сохраняются.

## Functional-core skill — #75

Отдельный [plugin](../../../plugins/gost-functional-core/README.md) содержит
английский [skill](../../../plugins/gost-functional-core/skills/gost-functional-core/SKILL.md)
разработки бизнес-фич через публичный common API. Он расширяет существующую
композицию и не зависит от UI framework; bootstrap shell и presenter — отдельные
задачи. Фича содержит state/action/reducer и colocated reducer test, использует
готовые эффекты приложения с receivers. Все effectors находятся на уровне
приложения; API/реализация ApiEffect — отдельная задача gost-kit/app.
Версия нового plugin — 0.1.0 unreleased, shell остаётся 0.2.0 unreleased
с неизменным деревом. Оба каталога содержат две независимо устанавливаемые entries;
выбранный тег нового plugin имеет форму `gost-functional-core-v<version>` и выбирает
весь snapshot маркетплейса. Пять npm-workspaces и approval gates сохраняются.
Основной [FC contract](../../../openspec/specs/functional-core-feature-development/spec.md)
создан при sync/archive #75 (7 требований/19 сценариев); доставка архива —
[PR #82](https://github.com/antonsmolko/gost-spec/pull/82) вмержен, main `d4ea4ac`; #75 закрыта. План и implementation evidence — [change #75](../../../openspec/changes/archive/2026-11-04-add-functional-core-skill/design.md).

## Контракт компонентов и presenters — #78

[Proposed-редакция](../../../openspec/changes/archive/2026-11-05-clarify-component-presenter-contract/proposal.md)
уточняет FRONTEND-ARCH-001/002: logical UI-state принадлежит FC, pure presenters
готовят представление, component отображает готовые значения/boolean и передаёт
логическое намерение. Read-only selection/presenter calls и browser plumbing
сохраняются; focus-only handler может не отправлять action. Validation остаётся
на application boundary; presenter не становится validator или mutable store.
Svelte/FSD документы поясняют сочетание отдельно выбранных политик. Proposed,
Pending и gates #20/#26 сохраняются. Это документы и synthetic examples, не
runtime/линтер/skill. [#79](https://github.com/antonsmolko/gost-spec/issues/79)
описывает применение этих рекомендаций к чистым функциям подготовки представления;
выбран отдельный plugin gost-view-presenter 0.1.0 unreleased. Evidence/ограничения — [design #78](../../../openspec/changes/archive/2026-11-05-clarify-component-presenter-contract/design.md#implementation-evidence).

## Уровни требований

| Область | Ответственность | Пакет |
| --- | --- | --- |
| core | Общие инженерные принципы и архитектурные границы | @antonsmolko/standards-core |
| domains/frontend | Особенности UI и frontend-архитектуры | @antonsmolko/standards-frontend |
| technologies/typescript | Язык и типизация | @antonsmolko/standards-typescript |
| technologies/svelte | Реактивность и lifecycle Svelte | @antonsmolko/standards-svelte |
| stacks/frontend/svelte-spa | Конкретное сочетание технологий и архитектура SPA | @antonsmolko/standards-svelte-spa |

Сохраняются нынешние имена и каталоги пакетов. Общая архитектура принадлежит core, frontend-архитектура — frontend, конкретные FSD-соглашения — Svelte SPA. TypeScript не ограничивается frontend. Специфические договорённости одного потребителя не становятся общими стандартами.

## Контракт документов и подключения

README описывает применимость, перечисляет все стандарты пакета и поясняет сочетания/известные ограничения совместимости текстом. Локальные ссылки ведут к файлам внутри установленного артефакта. Метаданные npm остаются в package.json; документы читаются с диска. Нет обязательных JS imports, каталогов или автоматической проверки семантической совместимости.

Каждый пакет содержит README, документы, LICENSE и CHANGELOG. Установка выбранного subset не требует остальных пакетов стандартов и не создаёт/переписывает инструкции или конфиги потребителя. Обычные dependency/lockfile изменения npm допустимы; редактирование AGENTS.md выполняется вручную. Отсутствующие зависимости сначала устанавливают; обновление выполняют через npm с чтением changelog.

Проверки подтверждают чтение всех пяти tarballs и набора core/TypeScript во внешнем потребителе без workspace links. Отсутствующий документ, broken local link или запрещённый служебный файл дают отказ с указанием пакета/пути. Реализация проверок выбирается в [#33](https://github.com/antonsmolko/engineering-standards/issues/33).

## Содержание и первый выпуск

Инфраструктура сначала проверяется на synthetic документах, затем владелец рассматривает реальные стандарты. Существующие документы/ID и статус черновиков сохраняются. Принятие одного ID не принимает весь пакет; применение пакета целиком не превращает черновики в обязательные правила. Процедура — [content approval](../../architecture/content-approval.md), перечень — [inventory](../../architecture/requirements-inventory.md).

Первый нормативный выпуск — пять пакетов. Нужен минимум один применимый accepted ID из core, TypeScript и Svelte SPA, подтверждённый владельцем для проверенной ревизии. Frontend/Svelte могут сохранять явно помеченные черновики. Synthetic fixtures, merge дизайна и зелёные тесты не заменяют принятие содержания.

Стандарты наполняются и принимаются постепенно по конкретным проблемам. #20 отслеживает только первый accepted минимум, а не обязательное массовое ревью drafts. Закрытые общие #24/#25 не блокируют выпуск; будущие темы хранятся в inventory до появления конкретной задачи.

Перед публикацией обязательны проверки реальных артефактов, принятие содержания, ручной аудит материалов/прав и явное разрешение конкретного выпуска; полные критерии и проверка результата закреплены в [#26](https://github.com/antonsmolko/engineering-standards/issues/26). Подключение asc-admin — отдельный запрос.

## Версионирование и язык

Private root не имеет release-версии. Пакеты независимо версионируются штатным Changesets 3.0.3; внедрение в PR #38 и политика версий принадлежат [#34](https://github.com/antonsmolko/engineering-standards/issues/34). Реальные версии сейчас 0.1.0; Changesets проверен только на temporary fixtures, публикации нет. Совместимость читают в README.

Планы и обсуждения — на русском; публичные стандарты, README, примеры потребительских инструкций и диагностика — на английском. Двуязычность не является текущим требованием.

## Текущее состояние и история

Реализация #33 содержит пять workspaces документов, check версий lockfile и проверки реальных установленных tarballs. Manifests/схемы, loader и tooling-пакеты удалены. Девять proposed статусов и levels перенесены в документы; тексты и ID сохраняются, принятия содержания не было. PR #29 реализовал исходный check, PR #31 — план, PR #36 — согласование документов. PR #38 завершил Changesets и две TS fixture-проверки без реального bump. PR #39 завершил verification CI по плану #18; фактические GitHub jobs и независимое review фиксируются в [ledger](../../architecture/2026-10-16-verification-ci-response.md#реализация-утверждённого-плана). PR #40 реализует инструкцию ручного выпуска и synthetic подготовку по #35. Реальной публикации ещё не было; versioning и зелёный CI её не разрешают.

[Прежняя спецификация](https://github.com/antonsmolko/engineering-standards/blob/d483438/docs/superpowers/specs/2026-10-11-engineering-standards-design.md) и committed review-response документы сохраняют историю прежних решений. Их CLI/profile/release-engine механизмы не являются активными требованиями нового продукта.


## Учёт завершения component/presenter-контракта — #78

После реализации PR81 (main `82eda95`) выполнен запрошенный sync/archive #78:
[основная spec](../../../openspec/specs/frontend-component-presentation/spec.md)
содержит 7 требований/15 сценариев; [архив](../../../openspec/changes/archive/2026-11-05-clarify-component-presenter-contract/design.md)
сохраняет planning/review/evidence. Архив доставлен [PR #83](https://github.com/antonsmolko/gost-spec/pull/83), main `f0a936c`; #78 закрыта. Нормативные документы остаются proposed/Pending.

## Pure view presenter skill — #79

[План](../../../openspec/changes/archive/2026-11-06-add-presenter-skill/proposal.md) описывает перенос
логики подготовки данных для отображения в чистые presenter-функции,
unit-тесты и использование результатов компонентом. Reference содержит полный
пример, отдельная Svelte5 fixture проверяет обновление отображения.
[Skill](../../../plugins/gost-view-presenter/skills/gost-view-presenter/SKILL.md)
поставляется как `gost-view-presenter` в общем маркетплейсе; English content,
версия 0.1.0 unreleased. План доставлен PR84, реализация 6/6; проверки и границы
записаны в [evidence](../../../openspec/changes/archive/2026-11-06-add-presenter-skill/design.md#implementation-evidence).

Основной [контракт skill](../../../openspec/specs/component-presentation-development/spec.md)
создан при sync/archive #79: 7 требований / 15 сценариев. Реализация доставлена
PR85/main f3af7de; доставка архива — [PR #86](https://github.com/antonsmolko/gost-spec/pull/86).
