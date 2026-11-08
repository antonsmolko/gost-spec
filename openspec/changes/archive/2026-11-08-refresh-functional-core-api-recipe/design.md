# Design

## Scope and baseline

[#93](https://github.com/antonsmolko/gost-spec/issues/93), [proposal](proposal.md), [tasks](tasks.md). База — доставленный archive PR92/main ae92862248bd1e59fba55352725545875bc5897c. Требования FC spec сохраняются: pure reducers, готовые state factories, общеприкладные effects/handlers, фактическая совместимость.

Источник — registry tarball @gost-kit/common@0.2.1 и его README/public declarations. Upstream baseline: [openapi-fetch API](https://openapi-ts.dev/openapi-fetch/api), maintained [gost-kit API example](https://github.com/antonsmolko/gost-kit/tree/main/examples/functional-core). Потребность — устранить расхождение примера с реально доступным API, без нового transport adapter.

## Decisions and boundaries

- Проверяемая baseline — common@0.2.1, Node 26; сообщать source/integrity и несовместимость, не поднимать версии приложения автоматически. Новые mapper API из gost-kit #35 не используются.
- Приложение определяет OpenAPI Paths и RootAction; RootEffect использует public ApiEffect<Paths, RootAction>. Feature reducer возвращает method/url/body/defaultError и callbacks onSuccess(data), onError(errors, failure). AppError переиспользуется как ApiError приложения; его path readonly.
- onSuccess получает schema-derived response, onError — AppError[] и ApiFailure; callbacks возвращают actions. createApiHandler приложения исполняет запрос/dispatch. Непустые errors сохраняются; пустые заменяются [defaultError]. Необязательный onSuccess пропускает dispatch; отсутствующий onError сообщает failure через существующий store reporter. Исключения callbacks не выдаются за бизнес-ошибку API.
- Recipe Paths содержит несколько endpoints; unit tests сужают ApiEffect по method/url перед вызовом callback. App factory принимает public ApiClientOptions: app владеет baseUrl/fetch/mapErrors и передаёт fake fetch до создания клиента. Unknown backend errors проверяются guards для показанного envelope; собственный app mapper имеет приоритет. Пустой/невалидный envelope ведёт к defaultError, без заявлений о runtime-валидации успешного DTO.
- Fixture сохраняет отсутствующую staff feature, но базовые contracts/effector используют реальные ApiEffect/createApiClient/createApiHandler. HTTP подменяется только injected fetch в тестах; runtime самой библиотеки не подменяется. Typed schema не является runtime-валидацией response shape. Backend error mapping остаётся на app boundary.
- Recipe unit tests используют готовые root/feature factories и проверяют descriptions, request parameters и callbacks без I/O. Отдельный app probe проверяет pure reducer/no request, success, backend error и defaultError fallback, сохранение соседей. Без новых гарантий cancellation/routing/refresh.
- Исправление получает независимую FC plugin 0.1.1 unreleased в обоих manifests; накопленные unreleased entries объединяются в одну секцию. Shell 0.2.1 и presenter 0.1.0 неизменны. Native/public-host installation и release не подразумеваются types/runtime проверкой.

## Verification and delivery

Сначала воспроизвести ошибку текущего recipe на настоящем RootEffect во внешнем consumer. Проверить исправленные snippets/type errors, unit tests и общий handler через public API; отдельно оценить применение skill в fresh copy. Сверить полную поставку/gate, full suite, strict OpenSpec, links/anchors и независимое review по AGENTS.md. Пустая fixture не получает готовую бизнес-фичу; evaluation outputs остаются во временных каталогах.

Сопутствующий учёт: отметить доставленный #87/PR92 в handoff/очереди/исторических обзорах и проверить закрытие #87. Это не расширяет его criteria/closure. Публичные issue edits и review dispositions записываются здесь. Merge и archive #93 требуют отдельного решения владельца.

## Artifact and baseline evidence

Registry tarball: https://registry.npmjs.org/@gost-kit/common/-/common-0.2.1.tgz;
integrity `sha512-HzWGY9dgaD7lSsyFLlOuLE00pyTX5AOU8e4RukS7mJwNZIoEg5UVryFcLS2DPLN1hq1CblkFyPE6xTHLqNPm/w==`.
Packed README/public declarations и createApiHandler implementation прочитаны.
Во внешнем consumer installed common@0.2.1/TS5.9.3/@types/node26.6.5, Node26.11.1.
Прежние четыре recipe blocks извлечены без редактирования; RootEffect задан
через настоящий public ApiEffect<Paths, RootAction>. RED: tsc TS2353 на
receiverSuccess и TS7006 на оба аргумента callbacks. Синтетический app effect
старой fixture скрывал несовместимость, поэтому заменить только слова недостаточно.

Независимый no-skill control создал отдельную pure effect factory по public
declarations и прошёл strict NodeNext typecheck: method post, body/email,
onSuccess/onError корректны. Control не провалился; заявлений, что старый skill
лучше control, нет. Наблюдаемая неисправность — компиляция прежнего reference.
Evaluation files/logs остаются в disposable /tmp, не в опубликованном plugin.

## Recipe and forward evaluation evidence

Шесть полных source blocks (app contracts/effector и четыре FC-файла) извлечены
из reference во внешний consumer без ручной подмены. Strict NodeNext build
проходит, reducer unit tests 13/13. Отдельный probe на этих modules и настоящих
createApiClient/createApiHandler/createDispatch проверил POST/body, отсутствие
I/O при reducing, success, mapped backend error, network и contract fallback
на defaultError; preferences и store error reporter сохранены. HTTP — injected
fetch, без внешних запросов. При доработке fixture typecheck выявил полный
AppEffect в Alert-only handlers; generic сужен до Extract<..., AlertEffect>,
чтобы handler tables не дублировали ApiEffect. Пустая fixture check проходит,
probe до реализации staff ожидаемо падает requested staff feature is missing.

Независимый forward agent получил только обновлённый skill/reference, raw fixture
и установленный common, без предполагаемого решения. Созданы четыре FC-файла;
check/build/probe и четыре reducer tests проходят. Автор прочитал generated
modules: inputs — root/feature factories, result actions независимы, effects
проверяются без исполнения в unit tests; библиотечный handler остаётся в app.
При расширении AppAction root-only handler потребовал сужения до SetThemeAction;
typecheck поймал это до успешной проверки. Effector до/после:
`e6e3954d7c9cab12b27f5dbc69aa740302414f92c8e7cb691189c120c108f320`.
Repeat потребовал ноль изменений: восемь src hashes совпали, registrations
остались одиночными; check/probe/tests снова прошли. Отдельная missing-artifact
копия дала MODULE_NOT_FOUND/TS2307 и explicit incomplete без replacement/store;
в ней также отсутствовали Node types, что записано как дополнительная диагностика.

## Distribution evidence and GitHub issue edits

FC plugin 0.1.1 unreleased, одна секция changelog со всеми pending entries.
Два fresh профиля: Codex CLI0.167.0 и Claude2.1.308 установили local-directory
marketplace snapshot и повторно FC без дублей. Codex inventory: enabled 0.1.1;
Claude details: 0.1.1/Skills(1), без agents/hooks/MCP/LSP. Все восемь файлов
установленного FC plugin побайтово совпадают с source в обоих профилях.
Personal config fingerprints до/после совпали. Native scope — local directory,
CLI inventory и installed bytes; public GitHub/release-tag/model invocation не
заявляются. Browser/Svelte не нужны framework-free примеру. Историческая
loopback evidence 0.1.0 в README сохранена как historical, не proof новой версии.

#87 закрыта после проверки фактического merge PR92/main ae92862 и архива/main spec;
доставленные статусы отражены в handoff/таблице/product design/roadmap и добавлены
в датированный ledger архива #87. Старые pending записи остаются историей.
#88 получила факт закрытия #87 и ссылку на #93; её criteria/dependencies сохранены.
#93 фиксирует запрос владельца, отдельный outcome/branch и prefix [gost-spec-93];
план/evidence и текущая очередь будут связаны с implementation PR этой задачи.

## Final verification and independent review

Полный npm run check первоначально дал 113/114: negative FC version mismatch
задавал literal 0.1.1, совпавший с новой версией. Исправлено на суффикс mismatch
к версии временной fixture; mismatch и cross-plugin containment проверки
сохранены. Production checker не менялся. Свежий full suite — 114/114 на
Node26.11.1 (включая реальные packs/external consumers); strict change и
strict --all 13/13, main specs 5/5; skill-creator validator valid. Для validator
PyYAML установлен только в disposable venv, зависимости repo не менялись.
Markdown-аудит по parser tokens: 144 tracked файла / 266 локальных ссылок,
24 fragments / 0 ошибок путей/anchors; fenced-code примеры и URI исключены,
пути считаются относительно документа. Полный diff и неизменённые требования,
документы/issue representations проверены отдельно от runtime suite.

Независимый reviewer получил artifacts/requirements без авторской переписки.
Прочитал весь staged diff, actual published API, #93, #87/PR92 delivery и #88.
Самостоятельно выполнил recipe strict check/13 tests/API probe, generated fixture
check/probe/4 tests и root full suite 114/114. Effector source/evaluation bytes
совпали. No material findings; остальные plugins, five packages и main specs
не менялись. Native/model installation, strict OpenSpec и полный link audit
reviewer не повторял: эти результаты — evidence автора, с указанным scope.

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| Separate agent (private input, not a public basis), paired with public [#93](https://github.com/antonsmolko/gost-spec/issues/93) and registry common@0.2.1 | Complete recipe/fixture/distribution/tracking consistency | Full implementation result | No material findings | Independent public-API, consumer/unit/integration/full-suite checks and limits above |

Критерии #93 выполнены технически; представление в PR и отдельное разрешение
merge/archive/release фиксируются раздельно. #88 не закрывается работой #93.

Представление реализации — [PR #94](https://github.com/antonsmolko/gost-spec/pull/94),
все 3/3 задач завершены. Таблица очереди и GitHub #93/#88 ссылаются на этот PR
и pinned evidence. Public PR92 presentation актуализируется фактом доставки
main ae92862 и закрытия #87; его исторические review dispositions сохранены.
Эта финальная правка presentation/checklist не меняет проверенный код/контракты.

## PR94 published review — 2026-11-08

Прочитаны все страницы reviews, inline comments/threads/replies и PR comments:
один содержательный summary review, пять inline threads, PR comments отсутствовали.
Summary подтверждает прежние RED/GREEN, registry integrity, fixture integration,
114/114, strict 13/13, delivery #87 и отсутствие mapper API в common@0.2.1;
эти подтверждённые результаты не переоткрываются. Все пять замечаний проверены.

### PR94 R1 — narrow the endpoint before invoking callbacks

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| [Endpoint union](https://github.com/antonsmolko/gost-spec/pull/94#discussion_r4507369270) | Callback invocation intersects responses in a multi-endpoint RootEffect | Reference contracts/tests; this design | Fixed | Added GET /staff to the example schema; callback test asserts ApiEffect + post + /user before calling it. Original test reproduced TS2345; six corrected blocks compile and 13 tests pass. A separate variant with GET and POST at /user also compiles and passes 13/13 |

### PR94 R2 — configure the application client explicitly

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| [Client configuration](https://github.com/antonsmolko/gost-spec/pull/94#discussion_r4507369279) | Published client snippet has no backend mapper or injectable construction | Reference app effector/configuration prose; this design | Fixed | Original snippet reproduced INVALID_EMAIL → USER_LOAD_FAILED. Factory now accepts ApiClientOptions, preserves an existing mapper and validates the example errors envelope by default. Fake fetch is supplied before construction; base URL is app-owned and example.invalid is illustrative. Actual extracted factory passes 8 success/backend/network/contract/aborted/empty/invalid-envelope/custom-mapper probes |

### PR94 R3 — callback terminology

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| [Terminology](https://github.com/antonsmolko/gost-spec/pull/94#discussion_r4507369285) | Consumer text still calls callbacks receivers | FC SKILL/reference/README/changelog | Fixed wording | Live plugin prose uses callbacks/onSuccess/onError; dated RED evidence retains the original receiverSuccess/receiverError names |

### PR94 R4 — committed fallback coverage

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| [Probe coverage](https://github.com/antonsmolko/gost-spec/pull/94#discussion_r4507369288) | Contract fallback proof exists only in disposable probe | Private fixture checks/README; verification scope | Fixed | Committed probe adds non-JSON HTTP200 and AbortError cases alongside network/empty-HTTP errors; all assert defaultError result state/alert. Updated probe passes against real published common with the independently generated staff implementation |

### PR94 R5 — independent-review scope

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| [Queue precision](https://github.com/antonsmolko/gost-spec/pull/94#discussion_r4507369292) | Queue omits limits of independent-review evidence | Readiness checkpoint | Fixed wording | Queue identifies consumer/unit/integration/full-suite reruns and states native/model, strict OpenSpec and full links were not repeated by the original reviewer; full detail remains in this ledger |

### PR94 review GitHub issue edits

#93 и PR94 получают актуальные pinned evidence/queue и dispositions R1–R5.
#88 меняется только ссылкой на текущую очередь; критерии/dependencies сохранены.
#87 остаётся закрытой после доставки; его criteria/closure не расширяются.
Границы прежние: correction реального API recipe, без новой library API,
mapper-operation extension, миграции asc-admin, merge/archive/release.

### PR94 review verification and independent review

Свежий full suite 114/114, strict --all 13/13, skill validator valid; whitespace
чист. Полный итоговый diff просмотрен вместе с unchanged FC spec, архитектурными
документами и issue criteria/dependencies. Автор повторил parser-аудит всех
144 tracked Markdown / 266 локальных ссылок / 24 fragments / 0 ошибок.
Шесть executable blocks взяты из текущего recipe; при извлечении двух app
modules опущены только filename comments. Основной multi-endpoint consumer и
отдельный same-URL GET/POST вариант проходят strict compile и по 13 unit tests.
Сам текущий createRootEffector прошёл восемь injected-fetch scenarios; расширенный
committed fixture probe прошёл с прежней независимой staff реализацией.

Обновлённые plugin bytes повторно установлены в fresh local-directory profiles
Codex0.167.0 и Claude2.1.308: install/repeat/inventory, одно дерево в каждом,
все восемь файлов точны, personal config fingerprints сохранены. Это evidence
нового snapshot, не повторное использование хэшей до review. Native scope
остаётся local install/CLI inventory/bytes, без public-host/tag/model invocation.

Отдельный reviewer без авторской переписки прочитал все public PR94 threads и
summary, полный base-to-working-tree diff, реальные declarations/runtime common,
#93/#88 и доставку #87/PR92. Повторил оба recipe consumers/13+13 tests, восемь
factory scenarios, fixture compile/probe/4 tests и full suite 114/114. Проверены
102 локальные link targets изменённых Markdown и whitespace. No material
findings. Native installation, strict OpenSpec, полный anchor audit и fresh
model forward/repeat reviewer не повторял; их scope/evidence автора выше.
Публикация ответов в public threads и обновлённых pinned ссылок — финальный
presentation шаг, не новое изменение контракта.

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| Separate agent (private input, not a public basis), paired with [public PR94 review](https://github.com/antonsmolko/gost-spec/pull/94#pullrequestreview-5819165323) and [#93](https://github.com/antonsmolko/gost-spec/issues/93) | Complete R1–R5 correction consistency | Full result | No material findings | Independent reruns, unchanged contract/dependency checks and limitations above |

## Archive checkpoint — 2026-11-08

Реализация и R1–R5 доставлены [PR #94](https://github.com/antonsmolko/gost-spec/pull/94),
main `8b7a7b1133782320a5e74f7d1f0e5b86f11312a6`; post-merge full check 114/114.
По явному запросу владельца change перенесён в
`2026-11-08-refresh-functional-core-api-recipe`. Schema spec-driven, proposal/
design/tasks done, specs skipped, задачи 3/3. Status JSON не содержит delta
paths; синхронизация не выполнялась, main specs сохранены. Archive instructions
не вернули дополнительных context/operationGuidance.

Все четыре файла включая .openspec.yaml перенесены; proposal/tasks/metadata
сохраняются побайтово, design получает только этот dated checkpoint. Входящие
ссылки и handoff/таблица переведены на архив; таблица фиксирует доставку PR94,
архивный PR отдельно ожидает review/merge. По свежему GitHub snapshot gost-kit
#32 закрыта, #33 открыта; закрытие #32 не выдаётся за публикацию её API в ранее
проверенной baseline. Следующий предлагаемый шаг — подготовка выпуска skills.

Это перенос/ссылки и статусы без новых контрактов или gate changes; отдельное
независимое review контрактов не требуется по AGENTS.md п. 6. Прежние review
closures и ограничения сохранены. Runtime, plugins/версии, fixtures, scripts/
tests и пять npm-пакетов не менялись. Native/browser/model evidence не
перезапускались для этого documentary outcome. GitHub #93/#88 получат ссылки
на архив/текущую очередь и archive PR; criteria/dependencies сохраняются.
#93 остаётся открытой до доставки archive PR; release/tag и asc-admin отдельно.

Проверки archive outcome: fresh npm run check 114/114 на Node26.11.1;
strict --all 12/12 (завершённый change больше не активен); whitespace чист.
Проверены полный итоговый diff, четыре rename, неизменность трёх artifacts и
append-only design, отсутствие изменений specs/distribution/runtime, GitHub
merge/issue/dependency snapshot и связанные unchanged documents. Parser-аудит:
144 tracked Markdown / 266 local link tokens / 24 fragments / 0 ошибок;
code/URI исключены, пути относительно документа, как определено в PR92 ledger.
Ссылок на прежний активный путь не осталось. Review dispositions R1–R5 не
переоткрывались. Представление archive PR и pinned issue links завершает учёт;
merge этого PR остаётся отдельным решением владельца.
