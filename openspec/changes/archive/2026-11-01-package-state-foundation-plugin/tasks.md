# Tasks

Apply возобновлён по явному запросу владельца после пересмотра source.sha плана.
Упаковка, checker и native install/discovery/update/rollback реализованы;
все 13 задач и итоговая независимая сверка завершены. Реализация не разрешает выпуск. Контракт —
[spec](specs/state-foundation-plugin-distribution/spec.md), решения и evidence —
[design](design.md), outcome — [#55](https://github.com/antonsmolko/gost-spec/issues/55).

## 1. Общая поставка и нативные каталоги

- [x] 1.1 Сохранить исходные hashes skill/recipe и пяти пакетов; добавить и запустить RED-проверки отсутствующей поставки, двух catalog targets и неразрешённых локальных references. Evidence содержит фактическую причину падения до реализации, отличимую от ошибки окружения.
- [x] 1.2 Перенести единственный skill/recipe в самодостаточный plugin root, добавить два native manifests, LICENSE, README и общий CHANGELOG с предлагаемой начальной версией 0.1.0. Проверить GREEN для корректной поставки, сохранение исходных bytes skill/recipe и отсутствие symlinks/fixtures/private материалов в полном списке файлов плагина.
- [x] 1.3 Подготовить оба native catalogs: Codex local source выбранного catalog commit, Claude git-subdir source с полными url/path/sha подготовленного plugin commit. Записать разные catalog/content revisions и проверить совпадение plugin tree. Проверить actual tracked files, privacy sentinels и native claude plugin validate; узкое ignore-исключение сохранить.
- [x] 1.4 Обновить Source skills/Current implementation README, fixture README и все затронутые ссылки на перенесённые исходники. Проверить локальные ссылки/anchors; исторические тексты/evidence/критерии остаются прежними, link-only изменения перечислены в ledger.

## 2. Независимая версия и проверки границы

- [x] 2.1 Обновить read-only distribution check под git-subdir/source.sha, начиная с RED: missing/invalid/unresolved SHA, wrong URL/path, несовпадающие tree/name/version. GREEN сверяет закреплённое Git tree с поставкой Codex, отклоняет расхождения и сохраняет прежние JSON/SemVer/local-file/file-URI/privacy проверки; HTTP(S) документация допустима. Отдельно проверить неизменность файлов и отсутствие сетевого fallback на HEAD.
- [x] 2.2 Описать в plugin README/changelog независимую SemVer-подготовку без npm-публикации и новые обязательства совместимости. На disposable 0.1.0 → 0.1.1 проверить согласованные metadata и changelog, unchanged hashes/versions пяти npm-пакетов и отсутствие изменения обязательной основы fc/shell.

## 3. Установка через оба харнеса

- [x] 3.1 Создать disposable Git source с парами plugin/catalog commits P0/C0 и P1/C1, отдельные native profiles и внешний synthetic SPA. Инициализировать config один раз до install; helper imports/discovery не меняют установленный config. Зафиксировать source/profile paths, revisions и before/after hashes; личные credentials не копировать, недоступную изоляцию/discovery явно считать incomplete.
- [x] 3.2 Повторить Codex native registration/install catalog SHA и discovery в новом процессе без перезаписи config. Сверить config после install/до и после inventory, ровно один skill из installed plugin path, чтение recipe и hashes; записать version/catalog SHA/content identity и unchanged SPA hashes. Прежний отрицательный inventory с испорченным профилем не засчитывается.
- [x] 3.3 Проверить Claude native marketplace add без #SHA, затем install поставки из source.sha. Зафиксировать catalog revision, plugin SHA/version/path, namespace/discovery и чтение recipe; installed bytes должны совпасть с закреплённым Git tree и соответствующей поставкой Codex. Проверить отказы unavailable/malformed/wrong-path pin без floating-ref fallback и неизменность SPA/личных профилей.
- [x] 3.4 Для каждого харнеса проверить повтор без дубликата, native refresh/update новой поставки P1/C1 и откат P0/C0: Codex выбирает catalog revision, Claude получает каталог с прежним source.sha. После нужного restart проверить установленные version/bytes, конфигурацию discovery и unchanged SPA hashes; README описывает проверенные команды, catalog/content revisions и отсутствие произвольного SHA-selector у Claude.

## 4. Согласованность и итоговая интеграция

- [x] 4.1 Согласовать product design, roadmap, handoff и issue #55/#54 с окончательным outcome и путями; отдельно проверить полный diff, unchanged contracts, зависимости и ссылки. Ledger содержит перечень представлений и GitHub issue edits; criteria/closure #54 и gates #20/#26 сохранены, implementation PR не включает другие outcomes.
- [x] 4.2 Запустить полный `npm run check` на Node 26.0.0 и 26.11.1, проверить реальные документальные tarballs/external consumers и итоговую установленную plugin-поставку. Записать свежие результаты отдельно от планового review и прежних запусков; проверка пакетов не заменяет native harness evidence.
- [x] 4.3 Провести независимое review полного результата с исходными требованиями без авторского рабочего контекста. Все findings закрыты с evidence или согласованной диспозицией в ledger, issue representations согласованы; незавершённая установка хотя бы одного харнеса оставляет outcome incomplete.

## Workflow follow-up

- Apply завершён: 13/13. Content commit P и catalog commit C (`d48b9bd`) сохранены и запушены; интеграция отслеживается в PR #56 после #57–#61.
- Архивировать change только после выполнения tasks и review; синхронизация переносит новый distribution-контракт в main specs.
- Merge, реальная публикация и release tags остаются отдельными действиями по явному разрешению владельца.
