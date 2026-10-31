# Tasks

Все пункты ниже относятся к будущему apply. Подготовка этих файлов не означает
реализацию или разрешение выпуска. Контракт —
[spec](specs/state-foundation-plugin-distribution/spec.md), решения и evidence —
[design](design.md), outcome — [#55](https://github.com/antonsmolko/gost-spec/issues/55).

## 1. Общая поставка и нативные каталоги

- [ ] 1.1 Сохранить исходные hashes skill/recipe и пяти пакетов; добавить и запустить RED-проверки отсутствующей поставки, двух catalog targets и неразрешённых локальных references. Evidence содержит фактическую причину падения до реализации, отличимую от ошибки окружения.
- [ ] 1.2 Перенести единственный skill/recipe в самодостаточный plugin root, добавить два native manifests, LICENSE, README и общий CHANGELOG с предлагаемой начальной версией 0.1.0. Проверить GREEN для корректной поставки, сохранение исходных bytes skill/recipe и отсутствие symlinks/fixtures/private материалов в полном списке файлов плагина.
- [ ] 1.3 Добавить два native catalogs и узкое `.gitignore`-исключение только публичного Codex catalog. Проверить actual tracked files и `git check-ignore` для каталога, `.agents/skills/` и private sentinel; нативный `claude plugin validate` должен принимать плагин и каталог без исправляемых warnings.
- [ ] 1.4 Обновить Source skills/Current implementation README, fixture README и все затронутые ссылки на перенесённые исходники. Проверить локальные ссылки/anchors; исторические тексты/evidence/критерии остаются прежними, link-only изменения перечислены в ledger.

## 2. Независимая версия и проверки границы

- [ ] 2.1 Включить read-only consistency check поставки в существующий `npm run check`, начиная с RED для несовпадающих name/version, invalid SemVer/JSON, missing skill/recipe, escaping файлового пути/`file:` URI и лишнего запрещённого файла. GREEN должен принимать корректную поставку с внешней HTTPS-ссылкой документации и локальным reference внутри root, отклоняя каждую испорченную disposable копию с конкретной диагностикой; сетевая доступность внешней ссылки не является containment-проверкой.
- [ ] 2.2 Описать в plugin README/changelog независимую SemVer-подготовку без npm-публикации и новые обязательства совместимости. На disposable 0.1.0 → 0.1.1 проверить согласованные metadata и changelog, unchanged hashes/versions пяти npm-пакетов и отсутствие изменения обязательной основы fc/shell.

## 3. Установка через оба харнеса

- [ ] 3.1 Зафиксировать поддерживаемые команды и фактически изолированные config/cache/profile paths для обоих CLI. Создать отдельный temporary Git source с двумя SHA и внешним synthetic SPA; проверить отсутствие авторского checkout, личных credentials и изменений личных настроек. Если изоляция или доступная native discovery невозможны, записать incomplete и причину, не продолжая через личный профиль.
- [ ] 3.2 Выполнить Codex marketplace registration/install выбранной SHA в изолированном профиле и проверить в native inventory либо новой сессии обнаружение skill и чтение установленного recipe. Evidence содержит CLI version, команды, SHA, plugin version, installed paths/hashes и unchanged SPA hashes; ручное копирование не считается установкой.
- [ ] 3.3 Выполнить аналогичную native marketplace установку в Claude Code, проверить namespace/discovery/recipe и равенство hashes с Codex. Зафиксировать команды выбора SHA, поддерживаемые именно Claude, и unchanged SPA/profile hashes; `--plugin-dir` отдельно не выполняет критерий marketplace установки.
- [ ] 3.4 Для каждого харнеса проверить повторную установку без дубликата, обновление на вторую SHA с изменением version/bytes и возврат к первой SHA после нужного restart. Проверить недоступный source и отказы project check; записать частичные ошибки явно. Сохранить SPA hashes; в README оставить только фактически проверенные команды и ограничения pin/update/rollback.

## 4. Согласованность и итоговая интеграция

- [ ] 4.1 Согласовать product design, roadmap, handoff и issue #55/#54 с окончательным outcome и путями; отдельно проверить полный diff, unchanged contracts, зависимости и ссылки. Ledger содержит перечень представлений и GitHub issue edits; criteria/closure #54 и gates #20/#26 сохранены, implementation PR не включает другие outcomes.
- [ ] 4.2 Запустить полный `npm run check` на Node 26.0.0 и 26.11.1, проверить реальные документальные tarballs/external consumers и итоговую установленную plugin-поставку. Записать свежие результаты отдельно от планового review и прежних запусков; проверка пакетов не заменяет native harness evidence.
- [ ] 4.3 Провести независимое review полного результата с исходными требованиями без авторского рабочего контекста. Все findings закрыты с evidence или согласованной диспозицией в ledger, issue representations согласованы; незавершённая установка хотя бы одного харнеса оставляет outcome incomplete.

## Workflow follow-up

- После согласования этих артефактов владелец отдельно запускает `$openspec-apply-change package-state-foundation-plugin`.
- Архивировать change только после выполнения tasks и review; синхронизация переносит новый distribution-контракт в main specs.
- Merge, реальная публикация и release tags остаются отдельными действиями по явному разрешению владельца.
