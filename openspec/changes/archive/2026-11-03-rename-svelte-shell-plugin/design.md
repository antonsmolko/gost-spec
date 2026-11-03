# Design

## Context

Мотивация — [proposal](proposal.md), изменение контракта —
[delta](specs/state-foundation-plugin-distribution/spec.md). Текущие
[distribution requirements](../../../specs/state-foundation-plugin-distribution/spec.md)
синхронизированы в архиве #55, сохранённом отдельно в commit `c9b1fed` перед
реализацией rename. Main implementation #56 уже merged.

Наблюдаемое имя `gost-svelte-spa-state` одинаково в двух catalogs/manifests,
plugin root, skill path/frontmatter, gate constant и тестовых expectations.
Plugin version 0.1.0 unreleased; SKILL body и recipe фиксируют Svelte 5 SPA,
а не любой Svelte проект. Native inventory использует namespace plugin:skill.

Baseline — прежний проверенный native workflow и официальные ссылки в
[архивном design](../2026-11-01-package-state-foundation-plugin/design.md):
Codex catalog commit/local source и Claude git-subdir/source.sha. Новый installer,
схема metadata или механизм обновления не требуются.

## Goals / Non-Goals

Один новый plugin ID и один новый skill name, совместимый foundation behavior,
точное совпадение content обеих поставок и явная инструкция перехода старых
установок. Имена capability directories, marketplace `gost`, repository и runtime
libraries не переименовываются. Исторические критерии, запуски и SHA сохраняются;
поправляются только Markdown links, если перенос ломает их targets.

## Decisions

### One identity across both manifests and the skill

Предложенное имя применяется одновременно к plugin и skill:
`plugins/gost-svelte-shell/skills/gost-svelte-shell/SKILL.md`.
Native identity — `gost-svelte-shell@gost`, invocation/discovery namespace —
`gost-svelte-shell:gost-svelte-shell`. Состав остаётся восемь файлов с теми же
относительными manifest/icon/reference paths. SKILL меняет только frontmatter
name, recipe и инструкции подключения сохраняются. README/display name/changelog
описывают новое имя. Short name не объявляет поддержку SvelteKit.

Альтернатива — изменить только display name — сохраняет длинный ID в командах и
не решает запрос. Alias/второй активный plugin добавил бы поддержку двух поставок;
он не нужен для ещё unreleased версии и не входит в scope.

### Preserve coherent source and catalog commits

Подготовить новый P с новым plugin root; до catalog C прежний каталог, gate и
старый plugin root остаются рабочими. P временно добавляет новую непубликуемую
заготовку рядом со старой, чтобы каждый commit проходил прежний check. Затем C
переходит на новый ID/path, закрепляет P, обновляет gate/tests/docs и удаляет
старое дерево. Финальная поставка имеет один canonical skill; два активных
catalog entries не создаются. Прежние P385a0bc/Cd48b9bd не переписываются.

Read-only check продолжает проверять тот же contract: полный lowercase SHA,
canonical repository URL и новый точный path, Git commit/tree/file modes/bytes,
identity/version, required files и containment. Ошибка pin/path/content остаётся
incomplete без fallback к HEAD. Константы/expectations меняются только для имени;
рефакторинг #62 и relocation #63 выполняются отдельно.

### Version and migration compatibility

Новая идентичность начинает с 0.1.0 unreleased в обоих manifests; changelog явно
обозначает смену имени и ручную переустановку. Это breaking identity change,
не совместимый patch update прежнего ID. Версия библиотеки и пять npm-версий
не меняются. Если до apply появится реальный release старой/новой идентичности,
план version/migration пересматривается до реализации.

Для существующей установки пользователь явно удаляет старый ID штатной командой,
устанавливает новый и перезапускает session. Native syntax подтверждается текущим
CLI help и disposable round trip, не обещается неподдерживаемый rename command.
Новая установка использует только новый ID. При сбое фиксируются incomplete и
фактический registry/cache/inventory state; удалённый старый ID не считается
переименованным. Возврат — явная установка прежнего ID из прежнего catalog/pin,
а не незаметный fallback в gate.

Для Claude это условный возврат: до пользовательского refresh/install мейнтейнер
должен восстановить прежнюю catalog entry с old ID, прежний source.sha и
совпадающую Codex поставку. Одна замена SHA под новым ID не восстанавливает
старую идентичность. До этого возврат недоступен; не обещается произвольный
commit selector. Codex пользователь выбирает прежний catalog commit через ref.

## Risks / Trade-offs

- [Смешение archive #55 с rename] → archive сохранён в отдельном `c9b1fed`;
  будущий rename PR использует эту базу, main spec не скрыто добавляется в outcome.
- [Новые пути без нового pin] → P раньше C, полный tree match и реальные native
  installs из disposable Git source; временная копия не остаётся в финальном tree.
- [Старые установки сохраняют иной ID] → явные uninstall/install, inventory после
  restart и failure/rollback evidence; автоматический update не обещается.
- [История выглядит как прежнее имя] → сохранить датированные факты/criteria,
  current docs обновить, links rebase отдельно; не выполнять глобальный replace.

## Migration Plan

1. Зафиксировать текущие plugin/skill/recipe hashes и имеющиеся installation
   profiles/evidence. Добавить поведенческие RED expectations нового ID до runtime.
2. Подготовить P/C и согласованные metadata/path/gate/docs; проверить оба commit
   snapshots, завершённый single-tree layout и preserved skill behavior.
3. В отдельных штатных profiles обоих харнесов проверить fresh install и old→new
   переход без автоматического запуска skill. Прочитать installed recipe,
   проверить version/content, единственный new skill и отсутствие active old ID.
4. Проверить incomplete installation и явный возврат к old delivery в synthetic
   profiles. Сохранить consumer hashes и личные settings; credentials не копировать.
5. Full suite на обоих Node, diff/contracts/links audit и независимое review.
   Merge/publish и применение в asc-admin требуют отдельных указаний.

## Review and tracking

Outcome — [#64](https://github.com/antonsmolko/gost-spec/issues/64), addition к
[#55](https://github.com/antonsmolko/gost-spec/issues/55) на carrier
[#54](https://github.com/antonsmolko/gost-spec/issues/54), retained prefix
[gost-spec-52]. Criteria/closure старых outcomes и gates #20/#26 неизменны.
На этапе планирования менялись только planning artifacts. Его independent review
сохранён ниже отдельно от текущих implementation/native verification evidence.

### Planning verification and independent review

Строгая OpenSpec validation прошла; CLI подтверждает четыре planning artifacts
ready и 0/9 implementation tasks. Шесть относительных ссылок разрешаются.
Git index tree совпадает с сохранённым перед созданием плана: staged archive
не менялся. Runtime/catalogs/plugin/consumer не редактировались, native checks
и full suite повторно не запускались; прежние результаты не засчитываются за
реализацию rename.

Независимый fresh-context reviewer прочитал весь новый plan, оба main specs,
current catalogs/manifests/skill/changelog/gate и live issues #64/#55/#54 со
всеми comments (пусто). Содержательных findings нет. Подтверждены полнота
MODIFIED scenarios, coherent P/C, migration/incomplete/rollback coverage,
сохранение scope/version/history/gates. Reviewer не выполнял implementation,
native experiments или runtime tests. Review — private input, not a public
basis; public actionable scope — [#64](https://github.com/antonsmolko/gost-spec/issues/64).
Проверка before/after index выполнена автором отдельно, не выводится из review.

В #64 записан готовый план; в #55/#54 — owner-proposed separate addition #64,
retained prefix, отсутствие runtime изменений и отдельность archive. Критерии/
closure предыдущих outcomes не менялись. Новые файлы не staged с архивом;
план готов к review владельцем и отдельному apply-запросу.

## Apply evidence — 2026-11-01

Ниже сохранены результаты этапов apply; статусы подготовки относятся к моменту
проверок до создания PR. Актуальная доставка: content P `9007936e0d4e4732d9271de8e0222c5b96c418ea`
и catalog C `e781b2ecfe1c9a881c152524061838ce41de2f8f` закоммичены и запушены
в [PR #66](https://github.com/antonsmolko/gost-spec/pull/66). Archive predecessor
`c9b1fed` также запушен; обновлённая база `d22e77c` из PR #65 включена merge
`9cfe80f`. Это не merge в main и не публикация. Native evidence ниже получен
через disposable loopback source до push; установка из публичного GitHub не перепроверялась.

Владелец явно вызвал apply. Выполнен отдельный predecessor commit `c9b1fed`
(archive/spec sync #55 с исправлениями review), локальный ref
`feature/gost-spec-55-plugin-archive` сохраняет базу rename outcome. Перед commit
полный check прошёл 72/72. Коммиты используют retained prefix [gost-spec-52];
push/merge/publication новым apply не выполнялись.

### RED, prepared content and working catalog

До runtime changes новый ID/path/frontmatter и отсутствие старого plugin tree
проверены поведенческими expectations: 24/24 упали на прежней поставке. Основные
наблюдаемые причины — отсутствует новый root/recipe и catalog metadata ещё
предъявляет старый ID. Это не 24 независимых дефекта: часть negative-fixture
тестов тоже падала на прежней identity. Отдельный fresh native Codex inventory
подтвердил active old skill и отсутствие нового, нарушив явное ожидание нового
ID. RED logs: /tmp/gost-rename-red.log, /tmp/gost-rename-native-before.log;
структурированное native-red.json сохранено в run ниже.

Новый content P — `9007936e0d4e4732d9271de8e0222c5b96c418ea`. Prepared P tree
`3691742e213b3ea18e0d355219f4e6b3c9a0181f` проверен в отдельном Git checkout:
прежний full check 72/72, старые catalogs/gate/tree ещё работали. Native Claude
validate нового root прошёл. P временно добавляет новый root; подготовленная C
удаляет прежний, меняет только gate name/identity expectations и catalogs.
Рабочий Claude source.sha закрепляет P, полный tree match gate проходит.
Все 24 distribution tests теперь GREEN; дополнительные проверки подтверждают
new frontmatter name и отсутствие старого дерева. На момент этой проверки C
ещё не был закоммичен; последующая доставка указана в начале Apply evidence.

Новый README version/migration/display/changelog включены в P. SKILL description
и Markdown body прежние, меняется только frontmatter name. Recipe bytes совпадают
с baseline (`30e97531684243b931c18a714c89dfbf5ceb8f621c1785f2c228dd68cfd22f8a`),
пять npm-пакетов и основной fc/shell контракт не менялись. Current docs/ссылки
переадресованы к новому source; исторические names/criteria/evidence сохранены.
Main distribution spec остаётся prior-delivery snapshot до последующего
archive/sync: accepted delta этого active change описывает новую identity.
Это штатный OpenSpec lifecycle, не отказ от обновления контракта.

### Native fresh install, old-to-new, incomplete and rollback

Run: `/var/folders/mb/0tk4p1xj2bnd8j95_hzrbqqr0000gn/T/gost-rename-64-tst32rut`.
Использован собственный loopback Git smart HTTP (upstream git-http-backend),
после проверок server остановлен. Публичный GitHub source не заменялся и не
публиковался; на момент native проверок actual P был локальным. Временные catalog revisions отдельно от P:

| Delivery | Content P | Disposable catalog |
| --- | --- | --- |
| Old ID | 385a0bce81febdad67013f59bc6623a60021cddb | 04954b3dced4888d1ae61808cdc1763c9680a15c |
| New ID | 9007936e0d4e4732d9271de8e0222c5b96c418ea | 6059329f88c52beeb9728a0e39ee8ca7acf7a9dd |
| Unavailable new delivery | Claude f…f SHA; Codex missing local source | 61ee1c169bdd1eecbe407e0c4002495d45a82ee7 |

Codex CLI 0.166.0, Claude Code 2.1.308. Для каждого созданы fresh, migration и
failure profiles через CODEX_HOME/CLAUDE_CONFIG_DIR; первоначальный config
пишется ровно один раз, helper imports его не меняют. Credentials не копировались,
чувствительные environment variables удалены у subprocesses, HOME не менялся.
Это scoped isolation: глобальные standalone skills могут читаться Codex; в
результат засчитывается только pluginId/cache текущего disposable profile.

Fresh: register Git marketplace и native install нового ID. Migration: native
install старого ID → inventory old=1/new=0 → explicit uninstall → inventory
пустой → refresh/re-register нового catalog → native install нового ID → после
restart old=0/new=1. README commands проверены через текущий CLI help и эти
native round trips. Codex marketplace ref меняется remove/add; Claude catalog
refresh выбирает source.sha, SHA-selector при регистрации не обещается.

Codex discovery — новый app-server с --no-daemon и skills/list(forceReload),
ровно `gost-svelte-shell:gost-svelte-shell` из нового cache; installed config
hash до/после inventory одинаков. Claude native plugin list/details показывает
один skill, enabled registry entry и actual gitCommitSha=P. В обоих случаях
прочитаны все восемь installed files, включая recipe; file set и bytes равны P.

Failure: из отдельного old profile явный uninstall, затем новая недоступная
поставка. Оба CLI install дают exit1; actual registry/inventory остаётся пустым,
успешная новая identity не заявляется и старый ID не подставляется. Explicit
rollback refresh старого catalog/install старого ID восстанавливает old=1/new=0
с восемью исходными файлами. Шестнадцать verification JSON records фиксируют
этапы fresh/migration/failure/rollback; каждый подтверждает неизменность всех
13 synthetic SPA файлов и шести личных config/registry paths. В asc-admin
source не обращались. Profiles/logs остаются в run, daemon/user sessions не
менялись; остановлен только свой Git HTTP server.

### Full verification and tracking

Свежий full check 72/72 на Node 26.11.1 и 26.0.0: реальные document tarballs и
external consumers включены. Logs: /tmp/gost-rename-full-check.log,
/tmp/gost-rename-full-check-node26.0.log. Repo-wide Markdown audit и итоговая
независимая проверка diff/contracts/issue representations выполняются отдельно.
#64/#55/#54 синхронизируются с explicit apply, predecessor/P revisions и native
результатами; новые review findings и итог task4.1 записываются ниже.

### Final whole-result review and staged snapshot

Независимый fresh-context reviewer прочитал весь rename outcome от базы c9b1fed,
требования/план, relevant unchanged contracts и live #64/#55/#54 с пустыми comments.
Он самостоятельно запустил gate, 24 distribution tests, whitespace check и audit
105 Markdown files/169 links без ошибок. Все шестнадцать native verification
records сопоставлены с настоящими Git blobs: installed hashes совпали для old/new.
Raw Codex inventory/Claude details и реальные exit1 подтверждают migration,
incomplete и rollback. Native experiments/full suite reviewer не повторял;
изучены свежие logs автора. Публичная установка нового P через GitHub не проверена.

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| Independent reviewer (private input, not a public basis); [#64](https://github.com/antonsmolko/gost-spec/issues/64) | Architecture overview называл старый canonical source в настоящем времени | docs/superpowers/specs/2026-10-11-engineering-standards-design.md | Fixed and reviewer-confirmed closed | Указан plugins/gost-svelte-shell/skills/; reviewer повторно прочитал staged fix и подтвердил отсутствие остальных actionable findings |

Подготовленный C index tree `e6f3c2cabd3f5bf742c7ed506037f5706987ea4f` экспортирован
в отдельный Git checkout с доступной историей/P. Полный npm run check прошёл
72/72; /catalog-index-snapshot и catalog-index-check.log находятся в run. Это
проверка полного staged runtime набора, а не только файлов рабочего checkout.
После неё меняются только tracking/evidence, runtime snapshot прежний.

Финальная отдельная сверка: пакетные hashes baseline сохранены, SKILL body и
description после замены только frontmatter name совпадают, recipe bytes прежние,
восемь source files равны P9007936, прежние P385a0bc/Cd48b9bd доступны в истории.
Новые CLI/private helpers и profiles не входят в tracked/published artifacts.
Archive commit c9b1fed остаётся отдельной базой; последующий PR #64 должен
использовать её и не включать archive outcome. Основной distribution spec будет
синхронизирован штатным archive/sync rename change, не скрыто в реализации.

По завершении implementation review task4.1 отмечен complete и issue tracking
обновлён на 9/9. На том этапе C ещё не был закоммичен, P и archive commit были
локальными; последующий commit/push по запросу владельца зафиксирован в начале
Apply evidence. Merge в main, release tags, публикация и application в asc-admin
не выполнялись. Текущая двухверсионная Node policy сохранена; её возможное
упрощение не входит в rename.

## PR 66 review follow-up — 2026-11-02

Прочитаны все четыре inline threads (pagination завершена), четыре summary
reviews без дополнительного текста и PR comments (пусто). Предыдущее
reviewer-confirmed закрытие architecture path сохраняется: новых оснований
открывать его нет. Canonical ledger этого раунда — следующие записи.

### PR66-R1

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| [PR66 inline R1](https://github.com/antonsmolko/gost-spec/pull/66#discussion_r4437271989) | Подготовительный статус C/P/archive читается как текущий | design.md, tasks.md; handoff; #64 | Fixed | Apply evidence явно отделяет исторические статусы от pushed P9007936/Ce781b2e и archive base d22e77c; workflow follow-up больше не предлагает уже выполненный commit. Handoff уже исправлен в 9cfe80f и повторно сверен с PR #65/#66. #64 синхронизируется с тем же статусом; merge/release не заявлены |

### PR66-R2

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| [PR66 inline R2](https://github.com/antonsmolko/gost-spec/pull/66#discussion_r4437272040) | Дельта не закрепляет уже описанный и проверенный rollback | delta spec; design/tasks; #64 | Fixed | Migration requirement теперь требует инструкцию явного возврата; отдельный scenario задаёт прежний catalog/content pin, удаление новой установки при её наличии, native reinstall/restart, единственный old skill/recipe и unchanged consumer. Это существующий design Migration step4 и task3.3, без новой реализации. Native records прежнего раунда подтверждают old=1/new=0 и все восемь old files в обоих харнесах; hidden fallback не разрешён. Main spec меняется только при отдельном archive/sync |

### PR66-R3

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| [PR66 inline R3](https://github.com/antonsmolko/gost-spec/pull/66#discussion_r4437272069) | Отсутствие нового top-level skill не доказывает удаление прежнего | tests/integration/plugin-distribution.test.ts | Fixed | Удалён избыточный assertion для skills/gost-svelte-shell/SKILL.md. Проверка отсутствия plugins/gost-svelte-spa-state в working tree сохранена; frontmatter и оба manifests проверяют новый ID. Новый запрет на произвольное содержимое top-level skills не вводится |

### PR66-R4

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| [PR66 inline R4](https://github.com/antonsmolko/gost-spec/pull/66#discussion_r4437272117) | Диагностика смешивает working tree с pinned delivery P | tests/integration/plugin-distribution.test.ts; design | Fixed | Assertion теперь прямо называет current repository working tree. P9007936 намеренно сохраняет старый root рядом с новым до catalog C; проверка относится к текущему checkout, а не к целому репозиторию на P или installed profile |

### GitHub issue reconciliation

#64: критерии явной миграции дополняются уже проверенным возвратом, текущий
статус P/archive меняется с «committed locally» на pushed PR delivery; добавляется
ссылка на этот ledger. #55/#54 сверены как исторические исходные outcomes и
носители addition #64: критерии/closure/dependencies и prefix [gost-spec-52]
сохраняются; новый outcome не вводится. PR #66 получает итог и ссылку на ledger.
В каждой публичной inline thread ответ даётся со ссылкой на свою запись.

### Verification of this round

Runtime и восемь plugin files не менялись, P/C остаются прежними. Изменение
спеки закрепляет существующее проверенное поведение; новые native install
experiments не требуются для этих документационных/test-assertion исправлений.
Независимое review полного результата обязательно, поскольку R2 меняет
нормативный контракт; wording-only исключение не применяется.

Свежий `npm run check`: 72/72 на Node 26.11.1 и 26.0.0, включая реальные
packed artifacts/external consumers. Logs: /tmp/gost-pr66-review-check.log и
/tmp/gost-pr66-review-check-node26.0.log. Runtime changes нет, новый RED для
неизменённого runtime не заявляется; исправлены только spec/tracking и assertions.
`openspec validate rename-svelte-shell-plugin --strict` и `git diff --check`
успешны. Отдельно от runtime tests проверены весь 22-file итоговый diff на базе
d22e77c, relevant unchanged contracts/issue bodies и 105 tracked Markdown files:
169 relative links/anchors, 0 errors. Восемь plugin files/source.sha не менялись;
записанные rollback snapshots обоих харнесов повторно прочитаны: active old ID,
P385a0bc, все восемь hashes, consumer/settings unchanged. Native experiments
не повторялись. CI PR #66 до перевода на main не запускается по текущему workflow;
локальный GREEN не называется CI результатом. PR #65 остаётся prerequisite.

Независимый fresh-context reviewer проверил весь итоговый 22-file diff, все
публичные review sources, #64/#55/#54 и unchanged contracts; actionable findings
нет, dispositions R1–R4 подтверждены. Самостоятельно выполнил 24/24 distribution
tests, gate, strict validation, diff check и 105-file/169-target audit. Сверены
16 native records и 80 Git blob SHA256, включая оба rollback. Полный suite и
native experiments reviewer не повторял, прочитал свежие full-check logs автора.
Review — private input, not a public basis; actionable public sources — четыре
inline links выше и #64. Предыдущие reviewer-confirmed closures сохранены.

## Delivery to main after stacked PR merge — 2026-11-02

Владелец сообщил о merge и явно поручил следующий шаг — отдельный PR в main.
GitHub и Git refs сверены: archive PR #65 вошёл в main как `c7c879c`, rename
PR #66 вошёл в archive branch как `59feccb` и не доставил rename в main.
Main catalog пока содержит прежний ID/P385a0bc. Это заменяет прежние указания
«merge #65, затем retarget #66»: закрытый PR больше не ретаргетируется.

Новый delivery PR использует исходную carrier-ветку с a06256c, content P9007936
и catalog Ce781b2e, а не squash commit 59feccb. В неё включена текущая main;
три конфликта architecture/handoff/roadmap разрешены сохранением уже проверенного
rename результата поверх идентичного archive outcome. Runtime/plugin/pin/spec
тексты от a06256c не меняются; обновляется только текущее tracking/очередь доставки.
Новый PR имеет тот же единственный outcome #64; criteria/closure #54/#55,
retained [gost-spec-52] prefix и gates #20/#26 сохраняются. Независимое review
полного результата требуется для сверки интеграции и оперативной очереди.

Проверка success: main является предком нового head, P9007936 доступен в его
истории и все восемь plugin files совпадают с pin; diff относительно main
содержит только rename outcome. Полный check на обеих Node, packed/external
consumers, links/contracts и main-target CI должны пройти до готовности PR.
Merge нового PR, release и archive/sync rename этим поручением не разрешены.

Свежий full check прошёл 72/72 на Node 26.0.0 и 26.11.1 с реальными packed
artifacts/external consumers: /tmp/gost-rename-main-check-node26.0.log и
/tmp/gost-rename-main-check.log. Strict OpenSpec validation, whitespace check
и отдельный repository audit 105 Markdown / 169 local targets прошли без ошибок.
Проверены полный diff относительно main и unchanged contracts/issue bodies;
исходный runtime не менялся, поэтому новый RED/runtime fix не заявляется.

Независимое fresh-context review полного 22-file результата без actionable
findings: reviewer сам выполнил gate, 24 distribution tests, strict validation,
diff/link checks и byte comparison всех восьми файлов с P9007936. Прочитаны
все страницы reviews/comments #65/#66 и live #64/#55/#54, прежние closures
сохранены; полный suite reviewer не повторял, изучил свежие logs автора.
Native installs не повторялись, публичная установка после push не проверена.
Review — private input, not a public basis; публичная основа —
[#64](https://github.com/antonsmolko/gost-spec/issues/64),
[PR #65](https://github.com/antonsmolko/gost-spec/pull/65) и
[PR #66](https://github.com/antonsmolko/gost-spec/pull/66).

### GitHub delivery reconciliation

#64 получает актуальный статус нового main-target PR вместо retarget закрытого
#66; #54/#55 получают ссылку на новую delivery-ступень того же addition #64.
Ни одна issue не закрывается, acceptance/closure/gates не расширяются. Результаты
CI нового PR фиксируются в его описании отдельно от локальных проверок.

## PR 67 review follow-up — 2026-11-03

Прочитаны все страницы четырёх inline comments, четырёх reviews без тела и
одного PR comment. Присланное резюме — private input, not a public basis;
публичные actionable sources приведены ниже. Закрытия прежних rounds сохраняются,
кроме явно уточняемой ниже границы проверки authoring tree.

### PR67-R1 — merge method

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| [Inline R1](https://github.com/antonsmolko/gost-spec/pull/67#discussion_r4448075162) | Squash/rebase не сохраняет immutable pin в main ancestry; описание не является защитой кнопки merge | catalog, design/tasks/handoff, PR #67 | Risk confirmed; proposed pre-merge ancestry guard declined; repository policy change excluded from this outcome | До merge pin уже ancestor feature head, поэтому такой guard не различает будущий merge и squash. Gate проверяет доступность object/tree, а не разрешение будущего метода merge. Сторонняя branch/object cache может временно скрывать потерю ancestry; полагаться на неё нельзя. Для этого PR сохраняется явный owner-operated merge commit, без auto-merge. Изменение правил всех PR — отдельный outcome по AGENTS task scope, не скрытая правка rename |

Baseline: [официальные merge methods GitHub](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/about-merge-methods-on-github).
Репозиторные настройки не менялись; утверждение об автоматическом enforcement
не делается. Требование успешной доставки — pin ancestor итогового main,
проверяемый после отдельно разрешённого merge. Зелёный PR CI сам по себе этого
будущего состояния не доказывает.

### PR67-R2 — Claude rollback prerequisite

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| [Inline R2](https://github.com/antonsmolko/gost-spec/pull/67#discussion_r4448078309) | Пользовательский возврат Claude не оговаривает восстановление каталога мейнтейнером | plugin README; delta; design/tasks; #64 | Fixed | README явно разделяет Codex ref и Claude maintainer restore old entry/ID/pin plus matching Codex tree, затем user refresh/install. Delta задаёт prerequisite и unavailable outcome до восстановления; произвольный SHA-selector не обещается. Это уточнение существующего workflow, без новых native commands |

Официальный [Claude CLI reference](https://code.claude.com/docs/en/plugins/cli-reference#plugin-marketplace-add)
и [hosting reference](https://code.claude.com/docs/en/plugins/host-marketplace)
различают catalog ref и plugin source pin. Поддержка branch/tag ref не означает
выбор произвольного предыдущего catalog SHA; новый legacy channel не создаётся.

README — часть pinned tree, поэтому новый content P2
`f567ab5ad04b139b25a75c9d65c735abe51c3065` подготовлен от P9007936: изменён
только README новой поставки, а прежние catalogs/gate/old plugin root сохраняют
coherent development snapshot. Отдельный checkout P2 прошёл прежний полный
suite 72/72. P2 включается merge-parent текущего carrier; новый catalog commit
закрепляет P2 и поставляет ровно его восемь файлов. P9007936 и прежние catalog
commits не переписываются. Версия 0.1.0 unreleased, changelog, skill body/recipe
и пять npm-пакетов прежние. Это документационная коррекция, не новый release.
Прежнее native evidence относится к P9007936; новую native установку P2 не заявляем.

### PR67-R3 — deferred main-spec synchronization

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| [PR comment R3](https://github.com/antonsmolko/gost-spec/pull/67#issuecomment-6589149127) | Main spec хранит прежний ID до archive/sync | main distribution spec; delta; tasks/handoff; #64 | Retained agreed lifecycle step; no requested fix in this PR | Owner-approved workflow отделяет delivery от последующего archive/sync; reviewer прямо отмечает tracked deferral. Main spec не переписывается в review fixes; актуальный modified contract находится в active delta. Следующий отдельный шаг после delivery — синхронизация и архивирование по запросу владельца |

### PR67-R4 — top-level authoring copies

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| [Inline R4](https://github.com/antonsmolko/gost-spec/pull/67#discussion_r4448082140) | После удаления прежнего узкого assertion новые top-level authoring copies не обнаруживаются | distribution test; design; #64 | Fixed with new regression evidence | В disposable checkout прежний тест проходил при skills/gost-svelte-spa-state/SKILL.md и skills/gost-svelte-shell/SKILL.md. Общий guard теперь отказывает обоим деревьям и любому содержимому корневой skills/; absent/empty directory допустима. Старый plugin-root assertion сохранён. Gate продолжает проверять self-contained plugin, repository layout контролирует тест |

Это новое доказательство gap после PR66-R3, а не отмена причины удаления
проверки несуществующего нового пути. Contract: author-maintained skill files
хранятся только под plugins/; корневая skills/ может отсутствовать или быть пустой.
Guard сначала наблюдался RED на обеих stale copies, затем GREEN на чистом layout.
Проба не меняла пользовательский checkout. Run и before/guard logs:
`/var/folders/mb/0tk4p1xj2bnd8j95_hzrbqqr0000gn/T/gost-pr67-review-j8lr5p7x`.

### PR67-R5 — identity literal readability

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| [Inline R5](https://github.com/antonsmolko/gost-spec/pull/67#discussion_r4448085113) | Повторение identity literals повышает стоимость сопровождения | tests/integration/plugin-distribution.test.ts; #62 | Immediate cleanup declined; retained in owner-scoped #62 audit | Reviewer отмечает visibility-only/deferred характер. Поведенческий rename остаётся отдельным outcome; #62 получает ссылку и требование проверить consistency/readability expectations при существующем аудите. Конкретная схема helpers/constants выбирается в его design; production и tests не связываются автоматически одним значением, скрывающим ошибочный ID |

### GitHub reconciliation and review gate

#64 получает conditional Claude rollback, layout boundary и новый P2; #54/#55
сохраняют historical evidence и carrier criteria/closure, их current delivery
pointer синхронизируется. #62 получает public R5 как контекст существующего
readability audit, без test relocation #63 или выбора будущей реализации.
PR #67 и все четыре inline replies плюс summary comment ссылаются на эти записи.
Полный результат с changed contracts требует independent review; прежние native
records не выдаются за новую проверку P2. Merge/release/archive не выполняются.

### Verification of PR67 corrections

Свежий full check текущего результата: 72/72 на Node 26.0.0 и 26.11.1,
включая реальные tarballs/external consumers; /tmp/gost-pr67-review-check.log
и /tmp/gost-pr67-review-check-node26.0.log. Prepared P2 snapshot независимо
экспортирован в Git checkout и прошёл прежний full check 72/72; content-check.log
лежит в run выше. Strict OpenSpec validation и diff checks проходят.
Отдельный repository-wide audit — 105 Markdown /169 relative targets /0 errors.
Проверки относятся к текущим байтам до commit/push; CI нового head ещё требуется.
Защита merge method не заявляется как проверенная CI гарантия.

Независимый fresh-context reviewer проверил весь 22-file результат и семь файлов
исправлений, все public PR67 sources, live #64/#55/#54/#62 и unchanged contracts;
actionable findings нет. Подтверждены R2/R4 fixes, обоснованность R1 decline и
границы R3/R5. Самостоятельно выполнены gate, 24 tests, strict/diff checks и
audit 105/169/0; восемь файлов совпадают с P2, единственная разница P2 от P900 —
README. Full-suite/P2 logs и обе regression probes прочитаны, full/native runs
reviewer не повторял. Review — private input, not a public basis; основания —
публичные source links этого round. Commit/push/replies/CI нового head следуют
после review; это не разрешение merge/release.

## Post-merge history repair — 2026-11-03

Владелец сообщил о merge #67 и поручил следующий шаг. До archive/sync проверены
GitHub и main: `f919c540e909c2676f73a96328ec5b1327d39e45` имеет только родителя
c7c879c. Файлы совпадают с reviewed head90a8080, но P2f567ab5 не ancestor main.
Archive workflow остановлен до устранения delivery prerequisite; artifacts done
и 9/9 tasks сами по себе не доказывают наличие content commit в main.

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| [Merged PR #67](https://github.com/antonsmolko/gost-spec/pull/67), [R1 risk](https://github.com/antonsmolko/gost-spec/pull/67#discussion_r4448075162) | Squash main содержит catalog pin, отсутствующий в main ancestry | main history, catalog; handoff/tasks; #64/#54/#55 | History repair prepared; main repair requires authorized merge commit | merge-base --is-ancestor P2 origin/main даёт1. Новый checkout получает только refs/remotes/origin/main без других refs/cache: pin lookup exit128, distribution gate exit1 source.sha unavailable. RED log сохранён в run ниже. Это новый post-merge факт, а не отмена корректности runtime/tree или прежних review closures |

Run: `/var/folders/mb/0tk4p1xj2bnd8j95_hzrbqqr0000gn/T/gost-pin-history-j8kii7nm`.
Main-only fixture создан git init/fetch exact main ref из локального source,
без shallow history и без shared object database. Это проверка самостоятельной
доступности pin через main ancestry, не native installation и не сетевой сбой.

Ремонт: исходный carrier head90a8080 с P2/P900/C включается в историю main
обычным merge; текущий f919c54 предварительно включён в carrier. Дерево runtime,
plugin, catalogs/source.sha и пяти npm-пакетов не меняется; только tracking
отражает текущее prerequisite. Новый PR — та же доставка #64 с восстановлением
исходного обязательного pin invariant, не новая функциональность/политика merge.
До и после проверяются blob equality и полный diff на базе f919c54.

Success: main и P2 ancestors candidate head; свежий checkout только candidate
head получает P2 и проходит gate/full suite. После отдельно разрешённого merge
те же ancestry/main-only checks выполняются для настоящей main. CI candidate
не гарантирует будущий метод merge; автоматическое enforcement не добавлено.
Синхронизация specs и archive change пока не выполняются, версии/criteria/closure
и gates #20/#26 не меняются. Решение выполнить merge требует явного разрешения
по AGENTS.md; создание PR не считается таким разрешением.

Candidate `53072d5` имеет родителей 90a8080 и f919c54. В отдельный Git checkout
получен только этот head (без shared objects/других веток): main и P2 — его
предки, gate/full suite 72/72 проходят; candidate-check.log лежит в run выше.
В основном checkout full checks 72/72 на обеих Node: /tmp/gost-history-repair-check.log
и /tmp/gost-history-repair-check-node26.0.log. Strict validation, diff check и
105-file/169-target audit успешны. Полный runtime/plugin/catalog/package diff
от main пустой; итоговый PR diff содержит три tracking документа.

### GitHub history-repair issue edits

Current sections [#64](https://github.com/antonsmolko/gost-spec/issues/64),
[#55](https://github.com/antonsmolko/gost-spec/issues/55) и
[#54](https://github.com/antonsmolko/gost-spec/issues/54) дополнены post-merge
фактом: PR67 доставил файлы squash commit f919c54, но pin не входит в main.
Прежний GREEN head90a8080 не выдаётся за доказательство main ancestry.
Записаны main-only RED, подготовленный candidate53072d5, необходимость отдельного
repair PR/CI/merge commit и остановка archive/sync до восстановления prerequisite.
После создания repair PR его ссылка и фактический CI статус заменят preparation
wording. Acceptance/closure предыдущих outcomes и gates #20/#26 не меняются,
issues не закрываются; retained prefix [gost-spec-52] сохраняется. Canonical
disposition/evidence — Post-merge history repair выше.

### Independent history-repair verification

Fresh-context reviewer самостоятельно воспроизвёл RED main-only и GREEN
exact-candidate-only fetch без alternates/shared objects, проверил P2/main
ancestry и blob equality. В candidate-only checkout выполнил полный check
72/72 на Node26.11.1 с packed/external consumers, 24 distribution tests,
strict/diff checks и tracked Markdown audit 105/169/0. Node26.0.0 подтверждён
свежим логом автора; native install не повторялся. Весь трёхфайловый diff,
публичные review sources #67 и live #64/#55/#54 проверены; открытых findings нет.

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| Independent reviewer, private input, not a public basis; [#64](https://github.com/antonsmolko/gost-spec/issues/64) | Для current issue edits не было dedicated ledger subsection | design.md; #64/#55/#54 | Fixed and reviewer-confirmed closed | GitHub history-repair issue edits выше содержит публичные ссылки, exact superseded/additional status и сохранённые criteria/closure/gates; reviewer повторно сверил с live bodies |

Публичная actionable основа — merged PR67/R1 и issue #64, не private review.
Новый repair PR и его CI ещё следуют; подтверждение reviewer не разрешает merge.

## Archive and spec synchronization — 2026-11-03

Владелец явно разрешил merge #68, проверку main, синхронизацию и архивирование.
PR68 слит штатным merge commit `f7e38b107de9992dcb8d5c75146880ba3fa9c065`:
его родители f919c54 и a9c1448; P2f567ab5 теперь ancestor настоящей main.
История и файлы плагина не переписывались. Fresh main-only checkout без других
refs/shared objects получил pin и прошёл full check 72/72; evidence:
`/var/folders/mb/0tk4p1xj2bnd8j95_hzrbqqr0000gn/T/gost-archive-rename-ujjvy54i/merged-main-check.log`.
Это закрывает post-merge delivery prerequisite выше. Native P2/public GitHub
installation не повторялись и не заявляются проверенными.

Repo-local status подтвердил все четыре artifacts done и tasks 9/9; archive
context не содержит дополнительных constraints, specs-rule snapshot получен
один раз и переиспользован inline sync. Отдельных rules нет. Из единственной
зарегистрированной delta перенесены MODIFIED Native marketplace installation
и ADDED Explicit migration between plugin identities: main spec теперь содержит
9 требований /19 сценариев. H1/Purpose и семь остальных requirement blocks
сохранены без изменения, оба delta blocks совпадают с main побайтово.
Новых формулировок, delta headers или TBD Purpose в main не добавляли.

Change перенесён в этот архив с исходной .openspec.yaml. Исправлены две
внутренние относительные ссылки и входящие ссылки architecture/roadmap/handoff;
прежние review evidence и одобренные deferred #62/#63 сохраняются. Plugin tree,
source.sha, runtime/tests и пять npm-пакетов не менялись. Archive/spec sync —
отдельный documentation outcome от уже доставленной реализации и repair.
Доставка этого archive outcome в main отслеживается отдельным PR; его создание
не означает разрешение merge, публикации или применения skill к asc-admin.

### GitHub archive reconciliation

#64/#55/#54 получают текущий статус: repair68 merged/pin restored; change64
архивирован с sync9/19, canonical ledger переехал в archive path. Ранние
prepared/paused sections сохраняются как исторические и superseded текущим
снимком. Criteria/closure, retained [gost-spec-52] prefix и gates #20/#26
сохраняются, issues автоматически не закрываются. На #67/R1 оставляется ссылка
на фактическое закрытие history prerequisite; #68 description фиксирует merge
и проверку actual main. CI archive PR записывается отдельно от runtime tests.

### Archive verification

Полный `npm run check` текущего archive результата прошёл 72/72 на Node26.0.0
и26.11.1, включая real packed artifacts/external consumers: logs
/tmp/gost-archive-rename-check-node26.0.log и /tmp/gost-archive-rename-check.log.
`openspec validate --specs --strict` проверяет обе основные specs успешно;
completed rename отсутствует в active list. Отдельно подтверждены exact delta
blocks в main, Purpose/seven-block preservation, исходные bytes .openspec.yaml,
proposal и delta, нулевой runtime/plugin/catalog/npm diff и whitespace check.
Repository-wide audit:105 Markdown files/169 local links+anchors/0 errors.
Независимое review полного archive outcome выполняется до его PR; source pin
уже в main history и этим documentation outcome не вводится/не меняется.

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| Independent reviewer, private input, not a public basis; [#64](https://github.com/antonsmolko/gost-spec/issues/64) | Roadmap #55 в настоящем времени называл основной contract8/14 после sync9/19 | docs/superpowers/plans/2026-10-11-engineering-standards-independent-packages.md | Fixed and reviewer-confirmed closed | Формулировка описывает историческое создание8/14 при archive55 и прямо указывает на текущее дополнение64; нижний актуальный блок9/19 согласован. Это новое последствие sync, не reopening прежних reviewer-confirmed closures |

Независимое fresh-context whole-result review всего девятифайлового archive
outcome завершено без открытых findings. Reviewer сам выполнил full check72/72
на Node26.11.1 с packed/external consumers, strict validation обеих main specs,
Git-blob audit105/169/0, exact block/metadata comparison и runtime/pin equality.
Прочитаны live #64/#55/#54, related #62/#63 и все страницы PR67/68 review sources;
фактическое закрытие repair prerequisite проверено по main/parents/публичным replies.
Node26.0.0/main-only результаты прочитаны в логах автора; native installs не
повторялись. Review — private input, not a public basis; public scope — #64
и source-linked merged PR68/PR67-R3. Остались commit/push/отдельный archive PR/CI,
которые не разрешают его merge автоматически.
