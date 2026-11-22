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
| `scripts/check-plugin-distribution.ts` (156 строк) | Выделить проверки каталогов/source, корневого skills, manifests, обязательных/лишних файлов, changelog и Markdown links. Оставить последовательную оркестрацию и существующие границы catch |
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
