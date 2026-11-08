# Design

## Context

[#96](https://github.com/antonsmolko/gost-spec/issues/96); мотивация — [proposal](proposal.md). Baseline — README и публичные declarations реально скачанных npm common@0.3.0 / svelte@0.2.0, а не sibling workspace. FC сейчас использует старый createApiHandler/двухпараметрический ApiEffect; shell передаёт initState как значение. Оба контракта несовместимы с новыми пакетами.

## Goals / Non-Goals

Цель — пригодные для копирования английские примеры и проверяемое применение к synthetic consumer. Существующий один store/context и границы миграции сохраняются. Library semantics проверяются в объёме используемых примеров, без повторного написания всей suite gost-kit. Маршрутизация, мерцания, persistence, миграция asc-admin и выпуск не входят.

## Decisions

- Использовать публичные defineApiOperation/createApiEffect/createApiEffector из common@0.3.0: data-layer operation с mapper возвращает domain model; reducer создаёт только description, общий app effector выполняет I/O и dispatch. Не сохранять старый ручной object effect с потерей operation identity.
- Примеры проверять с несколькими операциями/разными ответами. Контракты операции доверяют generated schema статически; runtime validation отвечает приложение. Некорректный response/mapper должен показывать реальную contract failure, callback/dispatch exceptions — execution boundary, не backend error. Отсутствующий callback трактуется по библиотеке; отсутствие зависимости — incomplete.
- initState передавать фабрикой. Defaults вложенных scopes создаются заново. reset вызывается явно, принимает excluded по корневым ключам; сохраняет существующие исключённые scopes по ссылке. Factory один раз на reset; shared onError синхронный, различает kind reset и dispatch. Начальная ошибка фабрики выходит из создания; reset error сообщает reporter и сохраняет state при factory failure. Нет обещания отмены запросов/безмерцающей навигации.
- Проверки с настоящими registry artifacts во внешних directories: сначала RED старых snippets на новых declarations, затем type/build, чистые factory-based unit tests и app/API/browser probes. Внешние fake transports выбираются при создании клиента. Markdown examples проверяются как source, не текстовыми regex-тестами.
- Сохранить draft plugin versions в compatibility outcome: они уже unreleased; pending changelog отражает новые compatibility contracts, а финальная новая версия и объединение pending changelog принадлежат зависимой [#97](https://github.com/antonsmolko/gost-spec/issues/97). Не заявлять прежние версии как выпущенный новый compatibility artifact.

## Risks / Trade-offs

- Новые API могут быть недоступны у потребителя → проверять exports/engines/peers перед изменениями, не обновлять среду молча.
- Code snippets могут разойтись с fixture → компилировать скопированные blocks и выполнять внешние consumers; отсутствие доказательства отражать явно.
- Public-host release требует отдельной проверки → местная проверка plugin bytes не заменяет установку по финальным тегам в #97.

## Migration Plan

Поставить только через implementation PR #96, независимое ревью полного результата; merge требует решения владельца. #97 подготавливает конкретные release candidates после доставки. Применение к asc-admin — в его сессии. Откат content PR не откатывает потребительские приложения автоматически.

## Verification and review ledger

Evidence заполняется по фактическим результатам. Review sources и dispositions: `Source | Finding | Affected files/issues | Disposition | Evidence`. Private input помечается `private input, not a public basis` и сопоставляется публичным требованиям #96.

## GitHub issue edits

- Созданы #96 (совместимость) и #97 (выпуск), #97 зависит от #96; критерии не смешивают публикацию и compatibility evidence.
- #88: текущие указатели #93/архива заменены на #96/#97 без расширения критериев #88; предыдущая baseline сохранена как история. #96: добавлен implementation checkpoint и уточнён текущий routing prerequisite. Проверка GitHub выявила перенос gost-kit #33 → asc-admin #72 и отложенный статус #89; очередь отражает этот уже согласованный порядок, без новых механизмов.

### Artifact and compatibility evidence

2026-11-08, Node26.11.1 / TypeScript5.9.3. Registry tarballs installed outside workspace; no source imports. common0.3.0 engines ^26.0.0; svelte0.2.0 engines ^26.0.0, common ^0.3.0, peer Svelte ^5.57.2.

| Artifact | Registry source | Integrity |
| --- | --- | --- |
| common0.3.0 | [tarball](https://registry.npmjs.org/@gost-kit/common/-/common-0.3.0.tgz) | `sha512-XRKHjbW3/31u38SxF09tJBzIMLk23FyAOI6JoKtSqMOJGc9X9B5/0YIITb5aVEsvpsoWxJnJPE8obKuu+4oBWw==` |
| svelte0.2.0 | [tarball](https://registry.npmjs.org/@gost-kit/svelte/-/svelte-0.2.0.tgz) | `sha512-7nSr5Tz2UF2BxSX/Y8o05nxzRmsBud2RLxa6e2DFWqiOi1Yd02lryDEJELubQnKtBti/jyv0elM9ljE42lakQA==` |

All264 common and8 shell installed files match inspected tarball bytes. Fresh external install uses lockfile registry source/integrity; source fixture remains intentionally unconnected, without kit dependencies. FC external consumer installs exact common itself.

- RED: old FC blocks fail against common0.3.0: ApiEffect needs3 generics; createApiHandler is absent. Old shell empty recipe fails: initState value is not factory. Captured before edits to the respective recipes.
- FC GREEN: seven complete copied TS blocks compile; reducer unit13/13; exact recipe app effector integration6 cases (mapped success, backend errors, network, empty HTTP errors, nonJSON, mapper failure); preferences preserved and pure reducer performs no request. Separate committed fixture `probe:api`12/12 checks multiple response types, async mapper, failure categories, callback/dispatch exceptions and omitted callbacks. Negative compile cases preserve body/result/action-role/operation correlation.
- Shell GREEN: extracted empty recipe check/build and Chromium1/1; disposable probe check/build and Chromium7/7. Svelte5.57.2, Vite8.3.5, plugin7.3.1, Playwright1.64.1. Two consumers, isolated roots, effect result dispatch, full/excluded reset references and factory count, reset/factory/reducer failures, missing provider. Autofixer clean on all three Svelte components. Occupied4187 rejected before cases. Re-extracted empty connection passes again; repeat produces identical four store modules and one provider. Missing artifacts produce unresolved public imports with no fallback. These last two are deterministic checks, not separate natural-language shell agent executions.
- Tooling boundary: Svelte official context/state documentation retrieved with maintained `@sveltejs/mcp` CLI. Existing Vite fixture remains upstream baseline; no custom state/reset implementation added.
- Limits: public-host plugin installation, final tag install and release are #97. These consumer checks certify the documented artifacts/contracts, not asc-admin's environment or migration.


### Forward application and repository checks

Independent agent application (private input, not a public basis; actionable public basis — [#96 acceptance criteria](https://github.com/antonsmolko/gost-spec/issues/96)): fresh framework-free consumer with exact common0.3.0 passes check/build,8 factory-built pure reducer cases, feature integration and12 API cases. Existing API operations/effector bytes preserved; initial missing-feature probe fails before implementation. Follow-up and repeat preserve unrelated modules and one registration. Fresh missing-artifact and missing-composition inputs explicitly remain incomplete without a fallback. The latter typechecks remaining files but fails integration, illustrating the distinction. No separate no-skill model control or new-session repeat measurement is claimed.

Repository checks: npm run check114/114 on Node26.0.0 and26.11.1, both skill validators, strict change and all5 main specs pass. Parser-based repository audit at pre-review snapshot:149 tracked Markdown,268 local links,24 fragments,0 failures. Full changed diff and relevant unchanged published contracts/issue bodies inspected separately from runtime tests; historical archived baselines remain dated. Existing npm standards package versions/manifests, marketplace catalogs and presenter plugin unchanged. Fixture baselines intentionally omit the target feature/connection, and dependencies are installed only in external copies; no source lockfile update is required.
