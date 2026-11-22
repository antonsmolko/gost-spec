# Рефакторинг скриптов #62

## Context

Основание — [#62](https://github.com/antonsmolko/gost-spec/issues/62), включая
расширение на все `scripts/` и `tests/helpers/`. Мотивация — [proposal](proposal.md).
Аудит выполнен на main `15c783a` после PR #118: два скрипта и три helpers,
326 строк. Используются существующие Node fs/path/child_process и marked;
новая инфраструктура и зависимости не нужны.

## Goals / Non-Goals

Точки входа показывают последовательность предметных проверок. Существующие
экспорты и наблюдаемое поведение сохраняются. #63 отвечает за размещение тестов;
JS→TS, plugin content/versions, package content и release gates не входят в работу.

## Decisions

| Файл | Наблюдение и решение |
| --- | --- |
| `scripts/check-plugin-distribution.ts` (156 строк) | Выделить проверки каталогов/source, корневого skills, manifests, обязательных/лишних файлов, changelog и Markdown links. Оставить последовательную оркестрацию и существующие границы catch; объединить одинаковый object-guard, сохранив обе identity-диагностики |
| `scripts/check-workspaces.ts` (36) | Отделить проверку workspace lock entry от загрузки metadata; сохранить текущий последовательный цикл и CLI |
| `tests/helpers/check-documents.ts` (53) | Именовать шаги поиска forbidden files, required documents, local links/README index и unindexed documents; containment остаётся локальным контекстом пакета |
| `tests/helpers/check-accepted-headers.ts` (32) | Выделить чистое распознавание header metadata; обход и required-package порядок оставить явными |
| `tests/helpers/install-offline.ts` (49) | Существующий один вызов npm и один перевод ошибки уже читаемы; сохранить без искусственного дробления, подтвердить аудит и тесты |

Helpers остаются приватными в соответствующем модуле; отдельные файлы/общая
библиотека для единообразия не нужны. Императивные детали изолируются настолько,
чтобы вызовы шагов читались последовательно, без нового validation framework.

### Сохраняемые границы

- Metadata берутся из переданного root. Workspace metadata считаются
  maintainer-controlled; не добавлять новую валидацию типов. Первый read/parse
  failure останавливает workspace обход, сохраняя ранее собранные diagnostics.
- Plugin JSON должен быть объектом: ошибка manifest даёт diagnostic и `{}`;
  дальнейшие проверки продолжаются. Каталоги проверяются независимо; затем
  root skills и все четыре plugin в прежнем порядке. Локальные и `file:` ссылки
  ограничены plugin root, остальные поддерживаемые URI пропускаются как прежде.
  Symlinks, лишние/пустые файлы и malformed metadata сохраняют прежние ошибки.
- Document helper сначала проверяет forbidden, затем required, links/index и
  unindexed. Начальный realpath/readdir reject остаётся reject. Для required и
  Markdown файлов сохраняются текущие локальные catch и порядок диагностики.
  Не объединять политики URI/links с plugin checker: их поведение различается.
- Header helper читает package.json каждого переданного root; Markdown обходит
  только для обязательных package names и проверяет начальные plain paragraphs
  после H1. Даже нецелевой root с malformed metadata сохраняет reject.
  README/CHANGELOG, inline/fenced examples не дают accepted ID.
  I/O/JSON ошибки остаются rejected Promise; missing accepted даёт прежний
  `{ ready, diagnostics }` в фиксированном required-package порядке.
- Все validator helpers read-only. `installOffline` сохраняет npm flags, cache,
  cwd, timeout 120000, stdout и точное ENOTCACHED→OFFLINE_CACHE_MISSING сообщение;
  остальные ошибки пробрасываются без замены.
- CLI workspace использует cwd; plugin принимает необязательный root, при лишних
  аргументах usage/exit 2; diagnostic failure exit 1, success exit 0. Тексты,
  порядок, продолжение/остановка и filesystem/process эффекты неизменны.

Повторы identity в `plugin-distribution.test.ts` оценить по конкретным сценариям:
локальные тестовые constants допустимы для fixtures, но ожидания не импортируют
production distributions и продолжают ловить неверную production identity.
Не менять остальные тесты ради унификации и не переносить их.

### Накопленные замечания: решения для #62

- Cleanup из [PR #77](https://github.com/antonsmolko/gost-spec/pull/77#discussion_r4466507363)
  рассмотрен в рамках 1.2: одинаковую проверку JSON object выделить в один приватный
  parser/guard внутри plugin checker. Call sites сохраняют разные catch: manifest
  сообщает ошибку и возвращает `{}`, catalog прекращает свой разбор и переходит
  к следующему каталогу. Убирать одну из identity-диагностик отказано: общий
  catalog diagnostic и `exactly one` частично перекрываются, но их удаление меняет
  обещанный output/order. Characterization проверяет обе строки в прежнем порядке.
- Parity gate модульной фикстуры действительно не запускается корневым check/CI;
  это подтверждено [публичным review #118](https://github.com/antonsmolko/gost-spec/pull/118#issuecomment-7022099465).
  Его подключение к root test discovery/CI отклонено для #62: задача сохраняет
  команды package.json и роли fixtures, а добавление gate — самостоятельное
  изменение охвата проверки. Здесь wiring не меняется, этот пробел не объявляется
  исправленным. Прежние отдельные запуски fixture integration не становятся
  доказательством root/CI покрытия. Дополнительная задача без решения владельца
  не создаётся; это rationale исключения из текущего scope, не обещанный follow-up.
- В 2.2 отдельно оценены version literals: presenter `0.1.1` в
  `tests/integration/plugin-distribution.test.ts` и package `0.1.0` в
  `tests/integration/layout.test.js`. Удаление/динамическая подстановка отклонены
  для #62: существующие assertions фиксируют конкретный snapshot, а чтение
  expected из тех же manifests ослабляет независимую проверку. Литералы и
  assertions сохраняются; ручной bump при будущем выпуске остаётся прежней
  обязанностью подготовки выпуска. Identity-повторы оцениваются отдельно.

## Risks / Trade-offs

Перенос catch меняет количество/очерёдность ошибок → до runtime edits проверить
characterization cases для нескольких одновременных повреждений, отсутствующих
файлов, symlinks, URI и ошибок чтения; сравнить точные diagnostics и отсутствие
записей до/после. Нужные regression checks написать до рефакторинга; их способность
падать подтвердить контролируемой мутацией disposable-копии, не меняя контракт
ради нового RED-теста. Уже существующие проверки не удалять и не ослаблять.

Увеличение числа функций → оставлять короткие читаемые участки без изменений.
Полный scope аудируется, но это не требует менять каждый файл.

## Migration Plan

Baseline — текущий полный suite, а не исторические 24 plugin-сценария из #62.
Зафиксировать актуальные counts и результаты до edits; после них выполнить все
существующие tests на Node 26.0.0 и 26.11.1, typecheck, реальные packed/offline
consumers и негативные CLI/metadata/links случаи. CI запускает оба Node.
Проверить полный diff, ссылки, неизменённые контракты и независимое review.
Один implementation PR содержит только рефакторинг с сохранением поведения.
Откат — revert implementation commit, без миграции данных, тегов или пакетов.

## GitHub issue edits

#62 сохраняет критерии и остаётся open. Planning PR связывается с issue;
#63 остаётся отдельным outcome. Статусы #116/#118 сверены с GitHub: оба merged,
#112/#117 completed. Обновление очереди отражает эти факты и начало #62.
Merge плана не разрешает автоматически merge реализации или публикацию.

## Planning verification

План проверен на исходном main `15c783a`: npm run check — 122/122 на Node
26.11.1, включая существующие packed/offline consumers. Runtime не менялся.
Strict OpenSpec — 15/15; Markdown audit — 183 tracked files /319 local links /
43 fragments /0 errors. Подсчёт: marked tokens, heading slug без punctuation,
Unicode lowercase, whitespace→hyphen, duplicate suffixes и explicit HTML ids;
URI и dependency targets в node_modules исключены. Полный planning diff и
сохраняемые API/CLI/catch boundaries сверены отдельно от тестов. Проверки на
обоих Node для будущей реализации остаются обязательными, не объявляются пройденными.

## Review ledger

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| [#62](https://github.com/antonsmolko/gost-spec/issues/62); private input, not a public basis | Описание header helper могло подразумевать пропуск metadata нецелевого root | design.md, checkAcceptedHeaders contract | Fixed | Явно сохранено чтение package.json каждого root и reject при его ошибке; фильтр package names применяется только к Markdown traversal, как в исходном коде |

Независимое ревью полного плана — PASS; замечание выше исправлено и повторно
проверено, открытых findings нет. Отдельный агент без рабочего диалога автора
прочитал все пять модулей, тесты, полное изменение плана, #62/#63 и неизменённые
CI/distribution contracts. Это private input, not a public basis; публичное
основание работы — #62. Runtime-тесты независимым reviewer не перезапускались.

## PR 119 published review response

Прочитаны все пять inline threads (одна страница, hasNextPage=false), пять
submitted COMMENTED reviews, [полная сводка](https://github.com/antonsmolko/gost-spec/pull/119#issuecomment-7078014773)
и комментарий #62. Прежнее reviewer-confirmed закрытие header metadata сохранено.
Проверены исходный ledger PR #77, текущий checker/tests, root test glob,
fixture integration entrypoint и verify.yml. Это уточнение существующего scope
и учёта findings; новые runtime outcomes или release gates не добавляются.

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| <a id="pr119-r1"></a>[R1](https://github.com/antonsmolko/gost-spec/pull/119#discussion_r4657762136), [PR #77](https://github.com/antonsmolko/gost-spec/pull/77#discussion_r4466507363) | Cleanup JSON guard и identity diagnostics не получил решения | design Decisions, task 1.2 | Fixed planning omission; guard included, diagnostic removal declined | Приватный object-guard допускается при сохранении caller catch/fallback; обе существующие diagnostics и их порядок сохраняются |
| <a id="pr119-r2"></a>[R2](https://github.com/antonsmolko/gost-spec/pull/119#discussion_r4657762208), [review #118](https://github.com/antonsmolko/gost-spec/pull/118#issuecomment-7022099465) | Отсутствует disposition для parity вне check/CI | design, proposal Impact | Fixed planning omission; wiring declined in #62 | package.json root glob не включает fixture/checks; CI вызывает root check; scope #62 сохраняет команды и роли fixtures. Пробел не объявляется устранённым |
| <a id="pr119-r3"></a>[R3](https://github.com/antonsmolko/gost-spec/pull/119#discussion_r4657762273) | Version literals не оценены рядом с identity-повторами | design, task 2.2 | Fixed planning omission; literal removal declined | Presenter 0.1.1 и packages 0.1.0 — независимые ожидания текущего snapshot; assertions не ослабляются и не подменяются production values |
| <a id="pr119-r4"></a>[R4](https://github.com/antonsmolko/gost-spec/pull/119#discussion_r4657762315) | Нет ссылки на planning PR в S11 | Readiness, handoff | Fixed | Оба текущих указателя связывают #62 с PR #119; реализация остаётся 0/5 |
| <a id="pr119-r5"></a>[R5](https://github.com/antonsmolko/gost-spec/pull/119#discussion_r4657762377) | «Все два» | proposal | Fixed | «Оба скрипта» |

### GitHub issue edits

#62 остаётся open, критерии и 0/5 не меняются. В issue добавляется ссылка на
этот immutable response; PR description отражает решения и текущий ledger.
Новых задач, scope additions, merge или публикации этот круг не создаёт.

Проверки этого круга: npm run check 122/122 на Node 26.11.1; strict OpenSpec
15/15; аудит по описанному выше marked/slug/id методу — 183 tracked Markdown
files /319 local links /43 fragments /0 errors; whitespace clean. Полный final
PR diff и связанные неизменённые scripts/tests/package.json/verify.yml,
основные specs и issue criteria проверены отдельно от runtime suite.
Runtime, test assertions, fixtures, plugin/package bytes и main specs не менялись.

Независимое ревью полного исправленного результата — PASS, открытых findings нет.
Отдельному агенту переданы артефакты и требования без рабочего диалога автора;
он сверил публичные review sources, #62/#63, весь diff и неизменённые контракты.
Прежнее закрытие header metadata подтверждено; runtime suite независимо не
перезапускался. Это private input, not a public basis; публичная основа —
источники R1–R5 выше. Ответы GitHub ссылаются на эти индивидуальные записи.


## Implementation evidence

PR #119 delivered the plan as main 771c739, tree-identical to reviewed 1d69390;
both Verify jobs passed. Existing planning/review snapshots above are historical.
Task 1.1: baseline npm run check 122/122. Six new characterization tests passed
on original code (focused suites 107/107) before any runtime edit. Disposable
mutations of catalog diagnostics, manifest fallback, CLI arity, workspace
continuation, document phase order and header metadata reads each produced the
expected assertion failure. An initial name-only fallback mutation was equivalent
for these diagnostics and stayed green; corrected version-bearing fallback
mutation failed as intended. No mutation touched production files.


Task 1.2: plugin entry points now name catalog/root-skills/plugin phases; each
plugin names manifests/required files/unexpected files/changelog/links. One
private readJsonObject serves catalog and manifest callers with their original
catch/fallback. Workspace lock-entry comparison is private; package.version is
still read only after an entry exists. Focused suites pass 89/89, typecheck passes.
The first typecheck caught a moved directory variable; fixed before verification.
Disposable mutation scaffolding initially omitted lock/workspaces; that harness
error was corrected and all six RED assertion receipts were obtained before edits.


Task 2.1: document helper names forbidden/required/link/index phases; initial
root read still rejects, per-document checks still collect diagnostics.
Header parsing is private and pure; every root metadata read and full traversal
are unchanged. installOffline is byte-identical: npm flags, timeout/cache,
ENOTCACHED translation and other-error rethrow remain in the existing one-call
implementation. Focused helpers/artifact suites pass 20/20, including actual
packed/offline consumer installs and empty-cache failure; typecheck passes.


Task 2.2: fixture selection and synthetic catalog edits share a local shellName;
production identity assertions remain independent literal expectations. No
production constants are imported into tests. Presenter/package version literals
and all original assertions stay intact; no files move. Focused plugin suite
passes 66/66 (baseline 63 plus three new boundary tests). Other identity literals
remain where they express independent expected identities or malformed input.

### Implementation review response

Independent whole-result review inspected the complete diff, requirements,
unchanged contracts and both 128/128 logs without the author's working dialog.
One preservation defect was found: spreading unbounded document-phase diagnostics
into push exceeded the function argument limit. Reviewer differential execution
confirmed baseline returns 160000 malformed-link diagnostics while the first
refactor threw RangeError. A regression test reproduced that RED; concat now
joins the phase arrays without argument expansion and retains their order.
This is private input, not a public basis; public actionable scope is
[#62](https://github.com/antonsmolko/gost-spec/issues/62)'s behavior-preservation
criterion. No other findings or declined-to-judge items were reported.

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| [#62](https://github.com/antonsmolko/gost-spec/issues/62); private input, not a public basis | Array spread adds a RangeError for large diagnostic collections | checkDocuments, document-artifacts test | Fixed | 160000 malformed links reproduced baseline success/refactor failure; regression RED→GREEN uses concat without unbounded function arguments |

### Final implementation verification

Full npm run check passes 129/129 on actual Node 26.0.0 and 26.11.1 after the
large-document regression fix, including packed/offline consumers. Baseline was
122/122; all existing tests remain and seven boundary tests are added. Node 26.0.0
was obtained from official nodejs.org/dist and verified against SHASUMS256.txt:
node-v26.0.0-darwin-arm64.tar.xz SHA256
880cf6f35eb9dea84b2373adba13b6023b50cc0decbad47b57824d146373265a.
An older local Python tar API rejected its filter argument; the verified official
archive was then extracted with tar. No repository/toolchain configuration changed.
Strict OpenSpec 15/15, local Markdown audit 183/319/43/0 under the recorded method
and diff --check pass. Complete diff, relevant unchanged contracts and issue
criteria were inspected separately from tests. Plugin/package/catalog/fixture
bytes, main specs, root test wiring and installOffline remain unchanged.
Test file locations stay intact. The already recorded parity/diagnostic/version
literal dispositions are retained; no release or normative approval is implied.

### Implementation GitHub updates

#62 receives plan-delivery and implementation evidence; criteria stay unchanged
and the issue stays open until separately approved implementation delivery.
The table/handoff distinguish delivered plan #119 from implementation review.
#63 remains separate. Future merge and archive require separate owner requests.

Final independent review: PASS, no open findings. Reviewer confirmed the fix
and independently reran the large-document regression (all 160000 diagnostics),
then inspected both final 129/129 logs and complete result. Its only independent
execution was the differential/targeted regression; full suites were run by the
author. No findings were silently deferred or scope/gate exceptions accepted.

Task 3.1 complete: [implementation PR #120](https://github.com/antonsmolko/gost-spec/pull/120)
presents the verified result, all five tracked tasks complete. Runtime source
96c906b passed the checks above; this follow-up only records PR/task status.
#62 remains open pending separately approved delivery; no merge/publication.

## PR 120 published review response

Read the complete inline thread (one page, no next cursor), submitted COMMENTED
[review](https://github.com/antonsmolko/gost-spec/pull/120#pullrequestreview-6011954947)
and full [summary](https://github.com/antonsmolko/gost-spec/pull/120#issuecomment-7078375845).
The public reviewer independently reports baseline 122/122, final 129/129,
92 old/new differential probes with no output/exit differences, and RED/GREEN
large-document verification. These are reviewer-reported evidence, distinct
from the author's executions above. All prior confirmed closures are retained.

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| <a id="pr120-r1"></a>[R1](https://github.com/antonsmolko/gost-spec/pull/120#discussion_r4657869228) | S11 replaced explicit planning PR URL with plain text | Readiness | Fixed | Restored Markdown link to PR #119, retaining implementation PR #120, delivered SHA and 5/5 status |

This round changes only the link and this response. Under AGENTS.md rule 6's
wording/link-only exception no new independent review is required. No code,
assertions, requirements, approval gates or task statuses change. #62 remains
open until separately approved implementation delivery; #63 stays separate.

### GitHub issue edits

The issue receives the response URL without changing criteria or state; the
PR's current ledger pointer updates to the immutable correction receipt.
Individual thread and full summary replies point to this committed disposition.

Review-round checks: npm run check 129/129 on Node 26.11.1, strict OpenSpec
15/15, local Markdown audit 183/319/43/0 under the recorded marked/slug/id method,
and clean whitespace. The final PR diff and relevant unchanged status/contracts
were inspected separately from tests; runtime/assertion/payload trees are exactly
those reviewed at f14c0db. No new native or second-Node local run is claimed.
