# Tasks

Контракт — [delta](specs/state-foundation-plugin-distribution/spec.md), решения —
[design](design.md), outcome — [#64](https://github.com/antonsmolko/gost-spec/issues/64).
Apply завершён: 9/9. Ниже отмечена фактически выполненная работа и её проверки.

## 1. Предшествующая база и поведенческие проверки

- [x] 1.1 Проверить, что archive/main-spec sync #55 сохранён отдельным outcome и доступен в базе rename PR; зафиксировать staged/source hashes и неизменность прежних criteria/gates. При появлении release до apply пересогласовать version/migration перед реализацией.
- [x] 1.2 Добавить и запустить RED для нового plugin/skill ID, metadata/path/catalog согласованности и отсутствия active old ID после перехода. Указать фактические причины падения; сохранить baseline старого skill/recipe/пяти npm-пакетов.

## 2. Согласованная новая поставка

- [x] 2.1 Подготовить новый plugin content P с новым root/frontmatter и README/display/changelog при рабочей прежней поставке; экспорт snapshot проходит прежний полный check, version новой идентичности 0.1.0 unreleased. Подтвердить unchanged skill body/recipe и отсутствие private/fixture files в новом plugin root.
- [x] 2.2 Подготовить C: новая identity/path в обоих catalogs/manifests, новый source.sha, согласованные gate/tests и удаление прежнего tree. GREEN подтверждает один canonical skill, восемь файлов, полный Git tree match и прежние invalid-pin/containment/metadata отказы.
- [x] 2.3 Обновить current README/fixture/architecture/handoff/spec representations и описать native fresh install, old→new uninstall/install, incomplete и возврат; для Claude явно указать prerequisite мейнтейнера и unavailable до восстановления old entry/ID/pin. Проверить ссылки и команды по текущему CLI help. Исторические criteria/evidence сохранить, исправляя только сломанные Markdown targets.

## 3. Native переход

- [x] 3.1 В disposable Codex profile проверить fresh Git-catalog install нового ID и old→new переход после restart: ровно один активный новый skill, installed recipe/content/version совпадают с новым P, старый skill не активен; consumer hashes и личные settings сохранены.
- [x] 3.2 В disposable Claude profile проверить fresh source.sha install и тот же old→new переход, namespace/discovery/reference bytes и отсутствие active old ID. Неподдерживаемые update/rename selectors не использовать; совпадение с Codex доказать полным tree.
- [x] 3.3 В обоих profiles проверить incomplete после недоступной новой поставки и явный возврат к old catalog/pin, записать фактический registry/cache/inventory state и unchanged consumer hashes; старый ID не выдавать за успешный новый.

## 4. Итоговая проверка

- [x] 4.1 Выполнить full npm run check на Node 26.0.0 и 26.11.1 с реальными packed/external consumers; отдельно проверить full diff, immutable history, контракты и ссылки. Согласовать issue #64/carrier representations и провести независимое review без открытых findings; implementation PR содержит только rename outcome.

## Workflow follow-up

Ниже сохранены этапы до archive; их завершение зафиксировано в конце.

- Content P9007936 и catalog Ce781b2e сохранены и запушены. Archive #65 уже в main (c7c879c); PR #66 слит только в archive branch. Следующий delivery PR из исходной carrier-ветки должен получить CI на базе main и сохранить P в истории.
- Доставку в main отслеживает PR #67. Review уточняет README новым content P2f567ab5 и соответствующим catalog pin; P9007936/native evidence сохраняются как прежний снимок. Только merge commit сохраняет требуемую историю; CI feature head не гарантирует выбор этого метода пользователем.
- После squash merge #67 (main f919c54) файлы доставлены, но P2 не ancestor main. До archive/sync нужен отдельный history-repair PR с исходной историей и merge commit; success проверяется main ancestry и gate в main-only checkout, не наличием pin в object cache другой ветки.
- После реализации/проверок архивировать change с синхронизацией modified distribution contract.
- Merge, выпуск, release tags и применение к asc-admin — отдельные разрешаемые действия.

## Archive completion — 2026-11-03

После явного разрешения владельца repair PR68 merged штатным merge commit
f7e38b1; P2 доступен из main-only checkout, full check72/72. Дельта перенесена
в основную distribution spec:9 требований/19 сценариев, Purpose и семь иных
требований сохранены. Все artifacts done/tasks9/9; change перенесён в архив.
Runtime/plugin/source.sha/npm версии не менялись. Доставка archive/spec sync
имеет отдельный PR; публикация, его merge и применение к asc-admin не выполнялись.
