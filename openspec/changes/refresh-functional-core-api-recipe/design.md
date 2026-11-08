# Design

## Scope and baseline

[#93](https://github.com/antonsmolko/gost-spec/issues/93), [proposal](proposal.md), [tasks](tasks.md). База — доставленный archive PR92/main ae92862248bd1e59fba55352725545875bc5897c. Требования FC spec сохраняются: pure reducers, готовые state factories, общеприкладные effects/handlers, фактическая совместимость.

Источник — registry tarball @gost-kit/common@0.2.1 и его README/public declarations. Upstream baseline: [openapi-fetch API](https://openapi-ts.dev/openapi-fetch/api), maintained [gost-kit API example](https://github.com/antonsmolko/gost-kit/tree/main/examples/functional-core). Потребность — устранить расхождение примера с реально доступным API, без нового transport adapter.

## Decisions and boundaries

- Проверяемая baseline — common@0.2.1, Node 26; сообщать source/integrity и несовместимость, не поднимать версии приложения автоматически. Новые mapper API из gost-kit #35 не используются.
- Приложение определяет OpenAPI Paths и RootAction; RootEffect использует public ApiEffect<Paths, RootAction>. Feature reducer возвращает method/url/body/defaultError и callbacks onSuccess(data), onError(errors, failure). AppError переиспользуется как ApiError приложения; его path readonly.
- onSuccess получает schema-derived response, onError — AppError[] и ApiFailure; callbacks возвращают actions. createApiHandler приложения исполняет запрос/dispatch. Непустые errors сохраняются; пустые заменяются [defaultError]. Необязательный onSuccess пропускает dispatch; отсутствующий onError сообщает failure через существующий store reporter. Исключения callbacks не выдаются за бизнес-ошибку API.
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
