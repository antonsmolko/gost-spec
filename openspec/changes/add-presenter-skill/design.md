# Design

## Context

Scope — [#79](https://github.com/antonsmolko/gost-spec/issues/79), мотивация —
[proposal](proposal.md). База main `f0a936c36458225dd58a896e7f5f6257dcf99821`:
#75 skill и #78 контракт реализованы/архивированы; PR83 вмержен, #78 закрыта.
Текущий план не создаёт skill и не меняет нормативные документы. Tasks0/6.

Owner выбрал отдельный plugin и уточнил имя `gost-view-presenter`. Последнее
уточнение важнее раннего FC scope: presenter выносит calculations в pure function,
которую легко покрыть тестами; у presenter нет зависимости от FC. Публичный
scope #79 пересматривается соответственно, в рамках того же outcome, без новой
миграции/библиотеки. Прежние обязательные FC criteria заменяются, не дополняются
противоречащими требованиями. Выбор имени/scope был private input, not a public
basis; actionable source — обновлённая public issue #79.

### Observed baseline and upstream

- Два независимых plugin: shell0.2.0 и FC0.1.0 unreleased; shared local sources
  в двух каталогах. Checker перечисляет два конкретных distribution descriptors;
  существующие tests копируют все plugins и проверяют regression boundaries.
- [Agent Skills specification](https://agentskills.io/specification),
  [OpenAI plugin packaging](https://developers.openai.com/plugins/build/plugins),
  [Claude marketplaces](https://code.claude.com/docs/en/plugin-marketplaces)
  проверены при планировании. Upstream example — официальный
  [Anthropic marketplace snapshot](https://github.com/anthropics/claude-plugins-official/blob/a2e251d9b97b909bf728b3e84fc8d17e6aba0063/.claude-plugin/marketplace.json),
  уже использованный предыдущей поставкой. Нужен только третий local plugin,
  supported механизм подходит; installer/registry/resolver не нужны.
- Framework-free FC fixture не подходит для proving independence: он требует
  common. Svelte shell fixture специально начинает без основы и предназначен
  для bootstrap evaluation, не для presenter. Из него можно переиспользовать
  проверенную toolchain и upstream baseline, но не переписывать старые fixtures.
- Maintained [Vite Svelte TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-svelte-ts)
  и [Svelte testing guidance](https://svelte.dev/docs/svelte/testing) — baseline
  минимального consumer. Текущая pinned toolchain: Svelte5.57.2, TS5.9.3,
  svelte-check4.7.7, Vite8.3.5, plugin-svelte7.3.1, Playwright1.64.1.
  Apply подтверждает реальную доступность; публикация runtime gost-kit не нужна.

## Goals / Non-Goals

**Goal:** агент выделяет/изменяет чистые presentation calculations и сохраняет
обновляемое отображение их outputs в компоненте. Первое проверяемое UI применение —
Svelte5; pure TypeScript functions не зависят от него. Другие framework adapters
не объявляются проверенными только из-за нейтрального имени.

**Non-Goals:** FC/state/actions/reducers/effects/dispatch workflow, подключение
shell, новый store/presenter runtime, FSD reorganisation, validation infrastructure,
linters/config packages, изменение #78 норм, миграция asc-admin, #71/#62/#63,
реальный выпуск/tag. Существующие callbacks/events и browser mechanics сохраняются;
сохранность поведения проверяется, но их архитектура не перепроектируется skill.

## Decisions

### Approaches and chosen distribution

Owner выбрал отдельный plugin вместо расширения shell. `gost-view-presenter`
точнее обозначает подготовку представления, чем промежуточные варианты
`gost-presenter`/`gost-component-presenter`/`gost-template-presenter`.
Расширение FC plugin отвергнуто: создало бы ложную обязательную связь с FC.
Новый plugin0.1.0 unreleased, один English SKILL.md и
`references/view-presenter.md`, два native manifests, README/changelog/license/icon.
Версия и release prefix `gost-view-presenter-v<version>` независимы. Реальный tag
только после отдельного release approval на verified main; оба каталога выбирают
весь snapshot. Installation не применяет skill. Прежние plugin trees/version
сохраняются побайтово; обновление каталога не обновляет приложения автоматически.

### No FC dependency and no second source of rules

Presenter получает обычные typed data/context: props, result DTO после внешней
validation, selected state или уже подготовленный input. Он не знает происхождения
данных. Вызов и reactive binding остаются в компоненте/существующем adapter.
Callbacks, store access и business workflows не передаются в presenter как
зависимости для вызова; presenter только возвращает данные. Использование рядом
с FC возможно, но skill не устанавливает/требует common, root state, action или
store. Если задача требует изменений business behaviour, сообщить отдельный scope.

Canonical sources — pure/composition/rendering части FRONTEND-ARCH-002 и
[capability #78](../../specs/frontend-component-presentation/spec.md).
Полный #78 contract охватывает также separately adopted FC ownership/event policy;
это не standalone prerequisite pure presenters. Для FC-проекта уже выбранные правила
не отменяются. Skill не заявляет принятие proposed стандарта и не копирует весь
его текст в новую нормативную редакцию. В recipe — procedural guidance, один
synthetic пример и attribution/revision/status, а не новая таблица MUST правил.

Изолированная установка не имеет author checkout. Internal reference локален;
для нормативных деталей recipe содержит полный pinned GitHub blob URL на
FRONTEND-ARCH-002 из main f0a936c, с явно выбранными pure/rendering разделами и
предупреждением об отдельной applicability FC-разделов. Доступная verified copy
этой revision тоже допустима. При unavailable source и отсутствии verified copy
не выдумывать требования: dependent policy work incomplete, сохранённые inputs и
непроверенные части указать. Не делать cross-plugin filesystem links или
обязательный auto-install npm-пакета стандартов. Таким образом нет второго
самостоятельно поддерживаемого normative source или зависимости от другого skill.

### Workflow, input trust and failure behaviour

1. Прочитать project instructions, component/props/context types, existing pure
   functions/conventions, checks и requested visible behaviour. Убедиться в
   наличии конкретного output contract; missing context уточнить до зависимых edits.
2. Выделить calculations в ordinary pure functions. Shared intermediate work
   группировать, independent inputs не раздувать, композицию делать вызовами функций.
   Inputs не мутировать; hidden store/I/O/time/locale заменить явным data/context.
3. Компонент связывает inputs с presenter и использует ready values/booleans/rows.
   Не делать one-time snapshot или mutable view-store. Если calculations нет,
   wrapper не нужен. Существующие data/event mechanics не перестраиваются.
4. Обычные pure tests проверяют input/output, documented variants, immutability
   и композицию без DOM/store. Отдельные component/browser checks подтверждают
   reactive changes и сохранность events. Existing approved lint commands можно
   запустить, новые правила/configs не создаются; простой helper name/compiler
   success не доказывает provenance/purity. Отчёт содержит actual checks/limits.

Входы типизированы по contract проекта; это не доказательство validation unknown
external data. Domain validation остаётся на существующей границе. Nullable,
loading/empty/error/success — explicit documented inputs/outputs, не повод скрывать
required fields через casts/guessed defaults. Unsupported framework/artifact,
missing types/context/source или check failure — конкретный incomplete, без
home-made store, upgrades или ложного claim complete. Работать только в scope
запрошенного presenter/component; результаты частичных edits перечислять.

### Evaluation and packaging

Один новый `fixtures/view-presenter/` — synthetic Svelte5 component consumer на
обычных props/local fixture input controls, без common/shell/FC. Fixture не входит
в plugin. До skill baseline задача без него и behaviour probes: missing function/
incorrect output дают RED, успешный baseline не называется RED. Затем independent
agent получает те же inputs/request и установленный skill, проверяются actual
files, pure tests и browser. Generated results остаются disposable.

Cases: extraction, new calculation, change/repeat, shared component без лишней
обёртки, independent/composed functions, documented loading/empty/error/success и
nullable outputs, changing inputs/rows/branches, preserved callbacks, unknown/missing
required context/source. Negative cases: hidden store read, mutation/I/O,
component-local calculations under a ready-looking name и stale reactive snapshot.
Manual classifications отделяются от compiler/autofixer; no string-regex quality
checks. Pure tests используют обычные data builders/values, не FC factories/store.
Поиск imports/metadata и standalone build подтверждают отсутствие FC dependency.

Distribution checker получает третий конкретный descriptor и существующие
privacy/JSON/identity/version/source/link/symlink/root-skills gates. Сначала RED
для absent third/mismatch/cross-plugin links, затем GREEN с прежними regressions.
Без общего рефакторинга #62 или нового config API. Both local catalogs и root
README отражают три plugins, прежние artifacts не переписываются.

Native evidence: fresh isolated Codex/Claude profiles, full Git URL controlled
snapshot, install third отдельно и рядом с shell/FC, repeat, fresh discovery/read
reference, byte comparison full plugin, unchanged personal/app fingerprints.
Использовать существующий release snapshot workflow; допустим disposable loopback
tag с ясной маркировкой, не выдавать его за public-host release. Недоступный harness
оставляет evidence incomplete. Metadata validation не заменяет skill behaviour.

## Risks / Trade-offs

- FC clauses исходного #78 шире pure scope → explicit selected sections and
  applicability, не делать mandatory store dependency; older issue wording replace.
- External source недоступен offline → verified supplied copy либо incomplete;
  не поддерживать вторую нормативную копию внутри plugin.
- Имя нейтральное, tested UI один → отдельно описать verified Svelte5 support;
  чистые TS tests не доказывают другие framework integrations.
- Unit tests проходят, UI stale → separate Chromium transitions и callback checks.
- Третий plugin нарушает gates → preserve all regressions и byte-check двух старых.

## Migration Plan

Сначала review/approval этого плана, затем отдельный apply. Новый plugin не
переименовывает/удаляет прежние и не требует migration приложения. Fresh install
через выбранный snapshot; uninstall новой entry не меняет consumer. Выбор другого
marketplace snapshot описывает последствия для всех entries; existing release
workflow не заменяется. Merge/release/нормативное acceptance остаются самостоятельны.

## Review and issue tracking

Public source — #79 и уточнённые criteria pure scope. #78 delivered PR83/main
f0a936c, #75 delivered PR82/main d4ea4ac, обе issues закрыты. #79 stays open.
Issue body заменяет прежние FC-specific criteria на presenter-only, фиксирует
English content, selected identity0.1.0, Svelte5 verification и отдельную поставку.
При изменении criteria сохранить запрос/обоснование, dependencies/link gates;
это narrowing того же skill outcome, не новая runtime/нормативная задача.

### GitHub issue edits

#79 current scope/criteria/title согласуются с owner correction: no FC prerequisite,
pure functions/input-output tests, preserve source/events, separate native plugin.
Исторические milestones помечаются как history; конкретные superseded live criteria
заменяются, а не остаются параллельными. #78 остаётся closed/proposed-content Pending.
Этот planning PR не меняет опубликованные нормативные документы или implementation.

### Planning verification

All four planning artifacts complete; implementation0/6, seven proposed
requirements/fifteen scenarios. Strict change and all four main specs pass;
whitespace clean. Fresh unchanged-runtime baseline npm run check102/102 on
Node26.11.1, including real packs/external consumers; no new skill/native/browser
readiness is claimed. Separate complete staged diff and unchanged source/issue
criteria inspection:130 tracked Markdown,226 path links,3 same-file anchors,
zero errors. Path-list SHA256
`1eeb6c0e7a8f5785bf93fff210f6fd80f6ad213b6ef986d1e25b55570672c2ac`:
Git ls-tree -r --name-only -z on reviewed tree; select .md, JavaScript default
sort, join with LF and final LF, UTF-8 SHA256. Link counts use marked18.1.1
lexer/walkTokens, exclude code examples/URI/absolute targets, validate tracked
local targets and heading anchors. The known unfinished #71 change is outside
scope; strict main specs do not imply strict-all success.

### Independent planning review

Fresh-context separate reviewer examined all eight changed files, seven
requirements/fifteen scenarios and six tasks, unchanged #78 contracts, catalogs
and fixture baseline. Public #79 freshly read (no comments); #75/#78 closed,
PR83/main f0a936c verified. No actionable findings: pure/no-FC scope, existing
source/events, pinned external rules, independent delivery/evaluation gates and
0/6 consistent. Reviewer did not independently rerun runtime/link scripts.

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| Separate agent (private input, not a public basis); actionable public [#79](https://github.com/antonsmolko/gost-spec/issues/79) | Complete planning result against corrected pure scope | All eight planning/tracking files | No actionable findings | Fresh-context contract/criteria/dependency review above; author verification separate, implementation not performed |

Planning outcome presented in [PR84](https://github.com/antonsmolko/gost-spec/pull/84).
#79 current title/criteria record pure FC-independent scope and chosen identity;
its planning checkpoint links this complete committed design/review record.
All artifacts complete, implementation0/6. No apply/skill/runtime/merge/release.
