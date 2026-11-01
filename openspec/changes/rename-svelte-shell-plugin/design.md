# Design

## Context

Мотивация — [proposal](proposal.md), изменение контракта —
[delta](specs/state-foundation-plugin-distribution/spec.md). Текущие
[distribution requirements](../../specs/state-foundation-plugin-distribution/spec.md)
синхронизированы в архиве #55, сохранённом отдельно в commit `c9b1fed` перед
реализацией rename. Main implementation #56 уже merged.

Наблюдаемое имя `gost-svelte-spa-state` одинаково в двух catalogs/manifests,
plugin root, skill path/frontmatter, gate constant и тестовых expectations.
Plugin version 0.1.0 unreleased; SKILL body и recipe фиксируют Svelte 5 SPA,
а не любой Svelte проект. Native inventory использует namespace plugin:skill.

Baseline — прежний проверенный native workflow и официальные ссылки в
[архивном design](../archive/2026-11-01-package-state-foundation-plugin/design.md):
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
new frontmatter name и отсутствие старого дерева. C ещё не закоммичен.

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
публиковался; actual P локальный. Временные catalog revisions отдельно от P:

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

После закрытия review task4.1 отмечается complete и issue tracking обновляется
на 9/9. Новый C ещё не закоммичен, source P и archive commit локальные. Push,
merge, release tags, публикация и application в asc-admin не выполнялись. Текущая
двухверсионная Node policy сохранена; её возможное упрощение не входит в rename.
