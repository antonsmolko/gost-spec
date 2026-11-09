# Design

## Context and baseline

[#97](https://github.com/antonsmolko/gost-spec/issues/97) после #96: реализация PR98 и архив PR99 доставлены, main02591a2,96 закрыта. Применяется существующий distribution contract; новые packaging механизмы не нужны.

Официальная baseline: [OpenAI packaging](https://developers.openai.com/plugins/build/plugins), [Claude marketplaces](https://code.claude.com/docs/en/plugin-marketplaces) и поддерживаемый [Anthropic catalog example](https://github.com/anthropics/claude-plugins-official/blob/main/.claude-plugin/marketplace.json). Нужда проекта — проверить общий каталог с локальными plugin sources из выбранного Git snapshot в двух CLI. Legacy Codex manifest остаётся поддерживаемым; переход к другому формату не входит.

## Decisions

FC0.2.0 и shell0.3.0 — независимые minor bumps с содержательными обновлениями API operations и factory/reset. Старые0.1.1/0.2.1 были unreleased placeholders, не релизами. Presenter0.1.0 и npm versions сохраняются. Оба native manifests и changelog получают одну candidate version каждого plugin; version headings описывают подготовленное содержимое, а нейтральная status note отличает его от публикации, которая подтверждается matching immutable tag. Это позволяет проверить окончательные plugin bytes до approval и тегировать тот же main без промежуточной правки changelog; catalogs продолжают выбирать local tree snapshot, без SHA pins.

Проверка: native CLI в disposable CODEX_HOME/CLAUDE_CONFIG_DIR, без смены HOME и без вызова моделей. Сначала public GitHub baseline snapshot, затем candidate feature ref; install/repeat/update/coexistence/discovery подтверждаются CLI inventory и сравнением всех installed bytes. CLI listing не выдаётся за model invocation. Личные профили/потребители не меняются. Неуспешный публичный доступ не заменяется loopback evidence. Unavailable source/ref/version/hash mismatch означает failed/incomplete, без выдуманной установки или обхода проверки.

Final release tags создаются только после merge preparation PR и явного approval конкретных версий/состава/main commit/evidence. Оба тега выбирают один окончательный main snapshot; различаются именем/версией plugin. Существующие теги не перемещаются. До approval выпуск остаётся неподтверждённым и final-tag checks невыполненными. После разрешения конкретного final main: создать теги на нём, проверить remote commit и native installation тегов; changelog/manifest bytes уже подготовлены и проверены в preparation PR. Любое изменение candidate bytes после проверки требует повторной проверки затронутой поставки.

## Risks and delivery

Один marketplace registration выбирает snapshot для обоих plugins. Смена ref требует штатного refresh/reinstall/update; не обещать обновление других plugins само по себе. Для rollback выбирается существующий предыдущий tag/ref и выполняется явная переустановка; если старого публичного release нет, не выдумывать его. Первое подключение/upgrade asc-admin выполняются отдельно его агентом.

## Verification/review ledger

Sources/findings: Source | Finding | Affected files/issues | Disposition | Evidence. Private input labels and public actionable sources сохраняются. Проверки/ограничения заполняются по фактическим данным.

## GitHub issue edits

#97 будет фиксировать candidate versions, preparation PR, native evidence и отдельный release approval checkpoint. #96 delivery closure/queue обновляются этим первым PR97 по плану PR99; критерии88 не расширяются.


### Native baseline — 2026-11-10

Codex0.167.0 / Claude2.1.308, Node26.11.1. Fresh isolated profiles and empty working directory; HOME unchanged, inherited HERDR/CODEX_THREAD_ID stripped; no model/API invocation. Public GitHub checkout of02591a2 confirmed in each native marketplace clone. Both installed FC0.1.1, shell0.2.1 and presenter0.1.0, then repeated all three installs. All8 files per plugin in each installed cache match that actual Git snapshot. These are previous unpublished draft versions, not old release tags.

Codex accepted --ref commit SHA. Claude URL#SHA failed because its clone expects a branch/tag; retried URL#main and verified resolved02591a2. The failed SHA attempt is not install evidence and does not support SHA URLs for Claude. Consumer commands use version tags. No GOST tags returned by git ls-remote --tags at preparation start; no previous public rollback tag assumed.


### Public GitHub candidate verification

Public source `https://github.com/antonsmolko/gost-spec.git`, branch `feature/gost-spec-97-skills-release`; both native clones resolved45aa5c1eb1284d560a72c3cdcc23a7373f0a0a8f. This is candidate-ref evidence, not final-tag/main-release evidence. Logs record actual source/checkout; no loopback/local directory substitute.

In each isolated profile, removed the installed FC/shell pair and marketplace using the documented native commands; subsequent inventory was empty (marketplace removal also removed presenter). Registered public candidate branch and installed/restored all3; repeated each install. Fresh process inventories show exactly one enabled entry per plugin: FC0.2.0, shell0.3.0, presenter0.1.0. Every8-file installed tree matches candidate source in both hosts; presenter bytes match baseline too. This verifies actual replacement0.1.1→0.2.0 and0.2.1→0.3.0, repeat and coexistence without changing the unchanged plugin's contents.

Codex fresh app-server handshake then `skills/list` with empty cwd and forceReload=true reports exactly3 enabled namespaced GOST skills from the isolated cache paths; no model turn started. This uses the [supported discovery protocol](https://learn.chatgpt.com/docs/app-server). Claude fresh `plugin details <id>` reports Skills(1) with correct name for each installed plugin. `details --json` is unsupported in2.1.308; that failed attempt is not evidence, the plain command succeeds. Native discovery differs from invoking a model/applying a skill; no model completion or asc-admin behavior is claimed.

Both temporary profiles use distinct CODEX_HOME/CLAUDE_CONFIG_DIR, empty cwd and unchanged HOME. Fingerprints of personal Codex config, Claude settings/installed-plugin/marketplace records are unchanged after all CLI/app-server checks. No personal source/cache was modified. Only temporary verification helpers/logs exist outside repository; no new distribution tooling introduced.

### Preparation gates and remaining release work

Root npm check114/114 on Node26.11.1, strict13/13; parser audit153 tracked Markdown/271 local links/24 fragments/0 errors (marked18.1.1 + git ls-files, fresh preparation snapshot). Existing distribution gate accepts both candidates and catalogs. No scripts/tests/runtime sources changed; native and npm standards checks use existing tooling. Final tag names are still absent; no released version, final-tag installation, release approval or real consumer update is claimed. Tasks4/5 remain pending by design, not marked complete by candidate evidence.


Candidate payload identities (Git tree content only, not required history/pins): FC0.2.0 `685df0d310a7069a80e7cc7df3b363dd9181a975`, shell0.3.0 `4517cfafa96a7feef1cd63009c30acb1bf0a9e50`, unchanged presenter0.1.0 `c4ef014c81ad3f5bf8ea350ab1224639f77a97e1`. Any merge method is allowed: compare actual final main payload, not ancestry of45aa5c1. The source commit is verification evidence only. Both catalog files, all SKILL/references/fixtures and five npm packages are byte-identical to02591a2.
