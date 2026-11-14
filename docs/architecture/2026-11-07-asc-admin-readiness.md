# Очередь подготовки skills для asc-admin

Обновлено 2026-11-14. Статусы отражают проверенные checkpoint, а не только
open/closed в GitHub. Учёт общий для двух сессий: изменения gost-kit выполняются
в его сессии. Источник требований фичи — [#88](https://github.com/antonsmolko/gost-spec/issues/88).
Таблица обновляется при начале работы, создании PR, review, merge и проверке поставки.

| Очередь | Репозиторий / задача | Статус | Результат / зависимость |
| --- | --- | --- | --- |
| S1 | [gost-spec #87](https://github.com/antonsmolko/gost-spec/issues/87) | Завершена: реализация PR #91, archive/sync [PR #92](https://github.com/antonsmolko/gost-spec/pull/92), main `ae92862`; 6/6 | [Архив](../../openspec/changes/archive/2026-11-08-connect-store-context-and-published-packages/proposal.md); опубликованная связка, src/store и context |
| S2 | [gost-spec #93](https://github.com/antonsmolko/gost-spec/issues/93) | Завершена: реализация [PR #94](https://github.com/antonsmolko/gost-spec/pull/94), архив [PR #95](https://github.com/antonsmolko/gost-spec/pull/95), main `839c7c8`; 3/3; issue закрыта | [Архив](../../openspec/changes/archive/2026-11-08-refresh-functional-core-api-recipe/proposal.md); onSuccess/onError, реальный published ApiEffect/createApiHandler и проверка примеров; не зависит от mapper extension |
| S3 | [gost-spec #96](https://github.com/antonsmolko/gost-spec/issues/96) | Реализация доставлена [PR #98](https://github.com/antonsmolko/gost-spec/pull/98), main `6ca71a6`; sync/archive доставлен [PR #99](https://github.com/antonsmolko/gost-spec/pull/99), main `02591a2`; issue закрыта после проверки доставки | FC operations/factory/createApiEffector и shell factory/reset/onError на npm common@0.3.0/svelte@0.2.0; [план](../../openspec/changes/archive/2026-11-09-update-skills-for-published-kit-v3/proposal.md) |
| S4 | [gost-spec #97](https://github.com/antonsmolko/gost-spec/issues/97) | Выпуск опубликован и проверен: FC 0.2.0 / shell 0.3.0; [финальный отчёт PR #101](https://github.com/antonsmolko/gost-spec/pull/101) доставлен в main `2923ff0`; issue закрыта | Независимые версии/changelog, native/public-host установка и теги проверены после отдельного approval; далее обновление skills в asc-admin |
| S5 | [gost-spec #89](https://github.com/antonsmolko/gost-spec/issues/89) | Отложена | После проверки навигации в asc-admin #72 и решения о выносе общего контракта; middleware не предписана |
| S6 | [gost-spec #88](https://github.com/antonsmolko/gost-spec/issues/88) | [План #88](../../openspec/changes/add-modular-feature-skill/proposal.md) доставлен PR #103; [реализация PR #104](https://github.com/antonsmolko/gost-spec/pull/104), review-правки: 7/7, все пять замечаний исправлены; native evidence и независимое review обновлены | Skill модульной фичи и цельный users-пример проверены во внешнем consumer на npm common@0.3.0/svelte@0.2.0; context от #87, routing recipe отдельно в #89; независимое review правок пройдено |
| K1 | [gost-kit #35](https://github.com/antonsmolko/gost-kit/issues/35) | Реализована и закрыта 2026-11-08; [PR #36](https://github.com/antonsmolko/gost-kit/pull/36) вмержен | API-операция с mapper и доменным типом onSuccess; API включён в common@0.3.0; consumer compatibility проверяется в #96 |
| K2 | [gost-kit #32](https://github.com/antonsmolko/gost-kit/issues/32) | Реализована и закрыта; reset доступен в npm common@0.3.0/svelte@0.2.0, consumer checks — #96 | Общий reset({ excluded }), без правил навигации |
| A1 | [asc-admin #72](https://github.com/antonsmolko/asc-admin/issues/72) | В очереди; задача перенесена из gost-kit #33 | Сначала навигация в приложении, затем решение о библиотечном выносе; #89 отложена |
| Позже | [gost-kit #34](https://github.com/antonsmolko/gost-kit/issues/34) | Отложена | Persisted state, версии/миграции и storage adapters; текущую очередь не блокирует |

## Текущий checkpoint — #88

Выпуск #97 завершён: финальный отчёт PR #101 доставлен в main `2923ff0`,
issue закрыта после проверки дерева. FC 0.2.0 / shell 0.3.0 доступны через
неизменяемые теги на `64714fcc9929ce3eb0ea7676dfabaa883f5069f7`;
[инструкция установки/обновления](../plugin-releases.md).
Presenter 0.1.0 доступен из snapshot пары; отдельного presenter-тега нет.
Согласованный follow-up frozen README — [#102](https://github.com/antonsmolko/gost-spec/issues/102),
для следующего содержательного выпуска, текущую работу не блокирует.

План #88 доставлен PR #103/main `985bd04`: [proposal/design/tasks](../../openspec/changes/add-modular-feature-skill/proposal.md).
Реализован отдельный candidate `gost-feature@0.1.0`, ещё не выпущен, с цельным users-примером
list/create и кодом к каждому правилу. Реализация представлена [PR #104](https://github.com/antonsmolko/gost-spec/pull/104); существующие
FC/shell/presenter plugins и опубликованные теги сохраняются. #89 и persisted
state остаются отложенными; навигация проверяется в asc-admin #72 отдельно.

Skills можно обновить и применять в сессии asc-admin. Проверка runtime-зависимостей
и изменения приложения выполняются там, без ожидания реализации #88.

Проверки #88: root 121/121, strict 14/14, внешний consumer 19 unit / 12 integration
/ 4 browser; native Codex/Claude install/discovery/repeat/standalone/coexistence
повторно проверены для review-правок на public candidate 21a89d3; все 8 payload maps совпали.
Независимое review полного результата повторно пройдено, прежние closures сохранены; merge, normative acceptance и
выпуск нового плагина требуют своих разрешённых шагов.
