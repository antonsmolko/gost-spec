# Tasks

План #70, реализация не начата. База — merged PR #69; layout #71 следует после
этого outcome. Контракты — [spec](specs/state-foundation-plugin-distribution/spec.md),
решения и границы проверки — [design](design.md). Реальные теги/публикация и
применение к asc-admin не входят в задачи ниже.

## 1. Проверка файлов и источники каталогов

- [ ] 1.1 До runtime-правок добавить и запустить RED для валидного локального Claude source и file-only копии без `.git`; включить отказ от внешнего/legacy источника и перенаправления. Зафиксировать падение текущего checker по новому контракту, сохранив непиновые negative cases и CLI/root diagnostics.
- [ ] 1.2 Перевести Claude на локальный source и минимально убрать Git-object dependency checker/fixture; сохранить Codex source и все проверки состава/метаданных/ссылок/приватности. Обновить описание источников в текущей architecture/roadmap вместе с кодом; distribution tests и file-only check должны стать GREEN, старые non-pin negative cases и root `skills/` guard должны сохраниться.

## 2. Версия и руководство выпуска

- [ ] 2.1 Подготовить 0.2.0 unreleased в обоих manifests/changelog, сделать plugin README и independent-version wording независимыми от количества стандартов. Проверить identity/version/changelog checker, неизменность skill/recipe и всех пяти npm-workspaces; не создавать реальные теги.
- [ ] 2.2 Переписать plugin README: одинаковый release tag, native команды install/update/return, последствия удаления каталога, переход SHA 0.1.0 и old ID, условный legacy rollback, ручная проверка выпуска и отдельное approval. В disposable Git fixture проверить два тега после обычного squash, main-only checkout и file-only export; отсутствующий/mismatched/reused тег не должен подтверждаться как выпуск. Сохранить проверяемые команды и результаты в design evidence.

## 3. Нативная поставка в изолированных профилях

- [ ] 3.1 В отдельных профилях Codex и Claude проверить свежую установку тега A, repeat, новую сессию/discovery и чтение recipe; записать CLI versions, resolved commit и hashes всех восьми файлов. Не перезаписывать config перед discovery; один active skill и unchanged synthetic SPA/personal profile hashes обязательны.
- [ ] 3.2 В обоих харнесах проверить явный A→B и B→A с различимыми версиями/содержимым; обновить README точными проверенными командами смены ref/reinstall и последствиями removal. Подтвердить installed bytes, actual inventory и сохранность приложения; refresh тега не должен объявляться выбором нового выпуска.
- [ ] 3.3 Проверить переход legacy SHA 0.1.0 и old ID на новый способ, недоступный тег и отсутствие скрытого fallback. Зафиксировать actual installed state при отказе, отдельность host install и release verification при version mismatch, условную доступность legacy rollback. Если харнес/источник недоступен, оставить native readiness incomplete и не закрывать задачу успешной проверкой второго харнеса.

## 4. Интеграционная проверка и согласованность

- [ ] 4.1 Выполнить полный `npm run check` на Node 26.0.0 и 26.11.1 с реальными packed artifacts/external consumers; strict OpenSpec validation и `git diff --check`. Отдельно проверить полный diff, ссылки/якоря, unchanged contracts и issue dependencies; обновить handoff/#70 и canonical evidence, сохранив release/content gates и scope #71.
- [ ] 4.2 Провести независимое review полного результата по требованиям #70 и AGENTS.md, устранить findings и записать dispositions/evidence в design ledger. Готовность требует отсутствия открытых findings и native evidence обоих харнесов; затем представить результат владельцу без автоматического merge, тега или применения к приложению.

## Workflow follow-up

- Отдельный PR для реализации #70; merge только по явному разрешению.
- Синхронизация дельты и архивирование — по отдельному запросу после завершения.
- Настоящий release tag создаётся на итоговом проверенном main commit только
  после отдельного release approval; локальные fixture tags не являются выпуском.
- После #70 следующий независимый apply — layout #71.
