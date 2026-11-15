# Очередь подготовки skills для asc-admin

Обновлено 2026-11-15. Статусы отражают проверенные checkpoint, а не только
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
| S6 | [gost-spec #88](https://github.com/antonsmolko/gost-spec/issues/88) | Реализация доставлена [PR #104](https://github.com/antonsmolko/gost-spec/pull/104), main `f45ef7a`; 7/7, issue закрыта. Archive/sync доставлен [PR #105](https://github.com/antonsmolko/gost-spec/pull/105), main `2ebe704`; canonical links закреплены на SHA доставки | [Архив](../../openspec/changes/archive/2026-11-15-add-modular-feature-skill/proposal.md), [основная спецификация](../../openspec/specs/modular-feature-development/spec.md): 8 требований / 16 сценариев; новый gost-feature ещё не выпущен |
| S7 | [gost-spec #106](https://github.com/antonsmolko/gost-spec/issues/106), prerequisite [#102](https://github.com/antonsmolko/gost-spec/issues/102) / [PR #107](https://github.com/antonsmolko/gost-spec/pull/107) | Подготовлен [PR #108](https://github.com/antonsmolko/gost-spec/pull/108), stacked на PR #107; review-правки и native snapshot ae26a2e проверены, независимое review пройдено; подготовка 3/3, release tasks 4/5 pending; merge/tags не разрешены | feature 0.1.0; documentation patches FC 0.2.1 / shell 0.3.1 / presenter 0.1.1; [план](../../openspec/changes/prepare-feature-plugin-release/proposal.md) |
| K1 | [gost-kit #35](https://github.com/antonsmolko/gost-kit/issues/35) | Реализована и закрыта 2026-11-08; [PR #36](https://github.com/antonsmolko/gost-kit/pull/36) вмержен | API-операция с mapper и доменным типом onSuccess; API включён в common@0.3.0; consumer compatibility проверяется в #96 |
| K2 | [gost-kit #32](https://github.com/antonsmolko/gost-kit/issues/32) | Реализована и закрыта; reset доступен в npm common@0.3.0/svelte@0.2.0, consumer checks — #96 | Общий reset({ excluded }), без правил навигации |
| A1 | [asc-admin #72](https://github.com/antonsmolko/asc-admin/issues/72) | В очереди; задача перенесена из gost-kit #33 | Сначала навигация в приложении, затем решение о библиотечном выносе; #89 отложена |
| Позже | [gost-kit #34](https://github.com/antonsmolko/gost-kit/issues/34) | Отложена | Persisted state, версии/миграции и storage adapters; текущую очередь не блокирует |

## Текущий checkpoint — #106

Выпуск #97 завершён: финальный отчёт PR #101 доставлен в main `2923ff0`,
issue закрыта после проверки дерева. FC 0.2.0 / shell 0.3.0 доступны через
неизменяемые теги на `64714fcc9929ce3eb0ea7676dfabaa883f5069f7`;
[инструкция установки/обновления](../plugin-releases.md).
Presenter 0.1.0 доступен из snapshot пары; отдельного presenter-тега нет.
Follow-up frozen README [#102](https://github.com/antonsmolko/gost-spec/issues/102) подготовлен отдельным [PR #107](https://github.com/antonsmolko/gost-spec/pull/107); финальная проверка installed README входит в #106. Прежние опубликованные snapshot не меняются.

План #88 доставлен PR #103/main `985bd04`: [proposal/design/tasks](../../openspec/changes/archive/2026-11-15-add-modular-feature-skill/proposal.md).
Реализован отдельный candidate `gost-feature@0.1.0`, ещё не выпущен, с цельным users-примером
list/create и кодом к каждому правилу. Реализация доставлена [PR #104](https://github.com/antonsmolko/gost-spec/pull/104) в main `f45ef7a`, issue закрыта; существующие
FC/shell/presenter plugins и опубликованные теги сохраняются. #89 и persisted
state остаются отложенными; навигация проверяется в asc-admin #72 отдельно.

Skills можно обновить и применять в сессии asc-admin. Проверка runtime-зависимостей
и изменения приложения выполняются там. Новый gost-feature требует отдельного выпуска; прежние теги его не содержат.

Проверки #88: root 121/121, strict 14/14, внешний consumer 19 unit / 12 integration
/ 4 browser; native Codex/Claude install/discovery/repeat/standalone/coexistence
повторно проверены для review-правок на public candidate 21a89d3; все 8 payload maps совпали.
Независимое review полного результата повторно пройдено, прежние closures сохранены. После merge main повторно прошёл root 121/121 и strict 14/14; дерево совпало с reviewed HEAD.

Archive/sync представлен [PR #105](https://github.com/antonsmolko/gost-spec/pull/105): Purpose и все 8 требований / 16 сценариев перенесены в основную спецификацию, change перемещён в архив. Он доставлен в main `2ebe704`; follow-up canonical URLs #88/PR #105 выполнен и проверен на этом SHA. Сейчас готовится #106: новый feature и три documentation patches. Native/полные проверки и review текущего candidate фиксируются отдельно, старое evidence #88 их не заменяет; normative acceptance и публикация требуют своих разрешённых шагов.

Историческая проверка #106 до review-правок: public candidate `338e1dc` проверен в чистых Codex/Claude profiles:
переход с существующего тега, повтор, discovery, standalone feature и восстановление
четырёх plugins; все восемь installed maps совпали с source. Проверка README #102
выполнена на этих фактических файлах. Feature SKILL/recipe/example, fixtures/npm packages
и старые теги неизменны; changelog preambles нормализованы, current native evidence — ae26a2e ниже; новые теги отсутствуют. Подробные команды, hashes и
ограничения — в [release design](../../openspec/changes/prepare-feature-plugin-release/design.md).
После review/merge PR #107 и #108 отдельно проверить main и получить approval
конкретного SHA/четырёх tags; текущая подготовка публикацию не разрешает.

Review-правки PR #107/#108 проверены на новом public candidate `ae26a2e`:
одинаковые changelog preambles четырёх plugins, новый full-map digest feature и
FC/shell, прежний presenter digest; все восемь установленных деревьев совпали с
source. Свежие discovery/standalone/restoration и fingerprints обоих hosts
проверены, independent whole-outcome review PASS. #107 ledger точно различает
10 проверенных и 8 изменённых shell blocks. Подготовка 3/3 завершена; #107/#108
не вмержены, final main/release approval и tags остаются отдельными шагами.
