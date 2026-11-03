# Design

## Context

Мотивация и owner-approved target — [proposal](proposal.md). Контракты:
[layout](specs/standard-package-layout/spec.md) и
[plugin independence](specs/state-foundation-plugin-distribution/spec.md).

Сейчас существуют пять document-only npm workspaces версии 0.1.0 unreleased.
Svelte package содержит derived-state правило; stack package — единственное
FSD module-boundaries правило. В его нормативном body нет Svelte API: привязка
находится в applicability/README. Root workspaces, lockfile, layout/artifact tests,
Changesets fixtures и accepted-header helper явно перечисляют прежние пять путей.

Baseline — штатные [npm workspaces](https://docs.npmjs.com/cli/v11/using-npm/workspaces/)
и поддерживаемый [npm/cli example](https://github.com/npm/cli/blob/latest/package.json).
Проект уже использует этот механизм; нужны новые пути, а не loader/resolver.
Текущие approval contracts прочитаны в [#20](https://github.com/antonsmolko/gost-spec/issues/20),
[#26](https://github.com/antonsmolko/gost-spec/issues/26), content-approval и
check-accepted-headers. Они требуют core/TypeScript/FSD minimum, но не заранее
принятые конкретные candidate IDs.

## Goals / Non-Goals

Один outcome — четыре понятных package roots и корректное владение FSD при
сохранении поставки документов и содержательных approval gates.
Новые runtime modules, релизный механизм #70, рефакторинг #62, colocation #63 и
принятие/публикация стандартов выполняются отдельно.

## Decisions

### Package mapping

| Current path | Target | npm identity |
| --- | --- | --- |
| packages/core | packages/core | @antonsmolko/standards-core |
| packages/technologies/typescript | packages/typescript | @antonsmolko/standards-typescript |
| packages/domains/frontend | packages/frontend/core | @antonsmolko/standards-frontend |
| packages/technologies/svelte | packages/frontend/svelte | @antonsmolko/standards-svelte |
| packages/stacks/frontend/svelte-spa | FSD content moves to frontend/core; workspace removed | unreleased standards-svelte-spa retired |

Root core применим к любому программному проекту; frontend/core — к интерфейсу
независимо от UI framework; Svelte и TypeScript сохраняют свои области.
Версии четырёх surviving packages остаются независимыми, а package exports
остаются документальными. До реализации перепроверить unreleased baseline:
обнаруженная registry publication требует отдельного migration решения, не
автоматического unpublish/deprecation. Если всё ещё unreleased, сохраняем 0.1.0;
публичный release/version bump этим изменением не разрешён.

Альтернативы: убрать только суффикс SPA — оставляет FSD в технологически названном
пакете; сохранить domains/technologies/stacks — оставляет лишнюю таксономию;
объединить всё в один пакет — теряет выбор правил по области. Владелец выбрал
core/typescript/frontend(core,svelte), четыре пакета вместо прежних пяти.

### FSD is an explicit optional architecture profile

Перенести document в `packages/frontend/core/architecture/fsd/module-boundaries.md`
и добавить README entry. Сохранить stable ID `SVELTE-SPA-ARCH-001` как исторический
идентификатор: rename ID не требуется для переноса и не переиспользуется для иной
нормы. Proposed статус/level и layer/import semantics прежние. Applicability
указывает frontend-проекты, явно выбравшие FSD; ни сам пакет frontend, ни наличие
папки fsd не принимают решение за потребителя. Перенос не вводит FSD в asc-admin.

Отдельный новый fsd workspace не выбран: сейчас нужен один условный раздел
общей frontend архитектуры. Удалённый stack package не заменяется alias-пакетом,
дублированием документа или генератором правил.

### Preserve approval meaning across package ownership

Сейчас helper считает accepted headers по именам core/TypeScript/svelte-spa.
Простая подмена последнего имени на frontend ошибочно разрешит UI-state или
presenter acceptance вместо FSD. Требуется выделять FSD profile documents внутри
установленного frontend package; каталог architecture/fsd даёт конкретную границу
для существующего header check. Он не является публичным selector API.

Сохраняется >=1 применимое owner-accepted правило core, TypeScript и FSD, минимум
три роли. Ни candidate ID, ни его Pending строка не превращаются в acceptance.
Не hardcode кандидат как единственно допустимую будущую норму: другой принятый
FSD-документ этого профиля также может удовлетворить прежний минимум. Реальные
owner decisions/applicability по-прежнему подтверждаются review, не parser alone.

Helper продолжает читать installed package roots и plain document headers,
сохраняет экспорт/результат ready+diagnostics, не пишет файлы и не сканирует
авторский checkout как substitute. Existing malformed/example-header refusals
сохраняются. Диагностика отсутствующего FSD minimum должна отличать его от
отсутствующего frontend package; конкретные сообщения фиксируются в RED cases.

### Migration and validation boundaries

Root workspace list — maintainer-controlled input; manifests/lock должны
согласовываться с target mapping. Path moves не меняют licenses, public interfaces
или автоматически dependency versions. Обновить repository.directory и весь
current-reference graph, включая README, inventory, content approval, release
instructions/fixtures и AGENTS count. Датированные archives сохраняют исторические
решения; перенаправлять только сломанные Markdown targets, не старые факты.

Actual tarballs проверяют все четыре пакета и выбранный subset во внешнем offline
consumer: docs/reference resolution, FSD ownership, отсутствие workspace links,
private материалов/runtime interfaces и legacy package. Broken link/metadata
остаётся явной ошибкой. Проверяются installed artifacts, не только source imports.

Plugin files/catalogs/source pin и родительские npm identities не меняются.
Единственная distribution delta убирает числительное «пять» из independent-version
requirement, сохраняя весь scenario и его запрет связывать версии.

## Risks / Trade-offs

- [Old npm package реально опубликован] → stop до согласованной migration.
- [Acceptance frontend ошибочно заменяет FSD] → negative fixture с accepted
  core/TS/general frontend без FSD и positive с отдельным accepted FSD profile.
- [Legacy ID выглядит Svelte-specific] → сохранить ID ради continuity и явно
  описать новый ownership/applicability; нормализация ID требует отдельного решения.
- [Stale links/old workspace names] → полный source/issue search и отдельный
  Markdown/anchor audit, включая incoming archive links.
- [PR69 ещё открыт] → перед apply интегрировать его main baseline; не создавать
  stacked delivery PR и не добавлять package changes в documentation PR69.

## Migration Plan

1. Проверить base69, unreleased status и сохранить package/content/ID baselines.
2. RED: four-workspace layout, FSD tarball ownership и эквивалентные gate cases.
3. Перенести пакеты/FSD, обновить workspaces/lock и текущие references/fixtures.
4. Проверить real tarballs/offline consumers, synthetic gate cases, оба Node,
   Changesets dry-run, complete diff/links/contracts и независимое review.
5. Отдельный implementation PR71; merge/publication только по явному разрешению.

До merge rollback — возврат согласованного набора workspace/files/lock из базы,
не ручная частичная замена package.json. Публичной migration пока нет: baseline
unreleased. Scope release70 не смешивается с этим outcome.

## Tracking and review ledger

[#71](https://github.com/antonsmolko/gost-spec/issues/71) — новый issue-scoped outcome,
ветка feature/gost-spec-71-standard-package-layout и prefix `[gost-spec-71]`.
Прежний carrier54/его criteria и closure не расширяются; issue70 сохраняется
отдельным draft на собственной ветке. User-approved четыре пакета заменяют
старое число в будущем apply, но сейчас package/runtime files ещё не менялись.

### GitHub issue reconciliation

В #71 записаны owner target, четыре identities, gate-equivalence и зависимости #69/#70.
#70 получил отдельность layout71 и draft status; его первоначальный proposal
сохранён commit 9e3d35a на feature/gost-spec-70-plugin-release-tags. Current #20/#26
пока не редактировались: при apply изменяется только ownership/package wording
core/TypeScript/FSD minimum и четырёх release artifacts, без acceptance/closure.
Прежние #54/#55/#64/#62/#63 решения не переоткрываются. Planning approval не
принимает содержание стандартов и не разрешает merge/release.

### Planning verification and independent review

Strict OpenSpec validation прошла, все четыре planning artifacts готовы, tasks
0/8. Source packages, workspaces/lock, plugin/catalog/source pin и main specs
не менялись. Свежий baseline `npm run check` на Node 26.11.1 прошёл 72/72,
включая packed artifacts/external consumers; /tmp/gost-layout-plan-check.log.
Это baseline evidence, а не проверка ещё не реализованного четырёхпакетного layout.
Отдельно проверены весь planning diff и 110 Markdown / 176 local targets: 0 errors.

Independent fresh-context reviewer прочитал весь plan/handoff, текущие package
документы и fixtures/helper, live #71/#70/#20/#26 и review/comment sources PR69.
Содержательных findings нет: подтверждены optional FSD, стабильный ID, четыре
identities, gate-equivalence без preselection candidate и границы зависимостей.
Reviewer проверил cached diff и прочитал baseline log; runtime suite/link audit
самостоятельно не повторял. Review — private input, not a public basis;
публичная actionable основа — #71 и сохранённые критерии #20/#26.

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| Independent reviewer, private input, not a public basis; [#71](https://github.com/antonsmolko/gost-spec/issues/71), [public wording precedent](https://github.com/antonsmolko/gost-spec/pull/69#discussion_r4459711566) | Пропущены пробелы перед bare versions/commit и в Node matrix | design/tasks/handoff | Fixed and reviewer-confirmed closed | Bare values отделены пробелами, prefix оформлен как code; reviewer повторно проверил final wording/evidence, открытых findings нет; contracts/tasks scope не менялись |

Planning documents сохраняются отдельным commit/branch #71. До apply требуется
новый запрос после review артефактов; текущая planning workflow не запускает
реализацию автоматически. Нет new content acceptance, merge или release approval.
