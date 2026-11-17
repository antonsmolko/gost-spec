# Очередь подготовки skills для asc-admin

Обновлено 2026-11-17. Статусы отражают проверенные checkpoint, а не только
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
| S6 | [gost-spec #88](https://github.com/antonsmolko/gost-spec/issues/88) | Реализация доставлена [PR #104](https://github.com/antonsmolko/gost-spec/pull/104), main `f45ef7a`; 7/7, issue закрыта. Archive/sync доставлен [PR #105](https://github.com/antonsmolko/gost-spec/pull/105), main `2ebe704`; canonical links закреплены на SHA доставки | [Архив](../../openspec/changes/archive/2026-11-15-add-modular-feature-skill/proposal.md), [основная спецификация](../../openspec/specs/modular-feature-development/spec.md): 8 требований / 16 сценариев; gost-feature 0.1.0 опубликован в #106 |
| S7 | [gost-spec #106](https://github.com/antonsmolko/gost-spec/issues/106), prerequisite [#102](https://github.com/antonsmolko/gost-spec/issues/102) | PR #107/#108 вмержены; четыре тега опубликованы на `f1c6f93`, все проверены в обоих hosts; итоговый отчёт PR #110 доставлен в main `3b200af`, #106 закрыта | feature 0.1.0 / FC 0.2.1 / shell 0.3.1 / presenter 0.1.1; [evidence](../../openspec/changes/archive/2026-11-16-prepare-feature-plugin-release/design.md#published-feature-release) |
| S8 | [gost-spec #109](https://github.com/antonsmolko/gost-spec/issues/109) | Доставлена PR #111/main `3a4ec55`; issue закрыта, archive/sync доставлен PR #113/main `4cfe0ee` | Новый dispatch из gost-kit #44; npm common@0.4.0 / svelte@0.3.0; отдельная совместимость, без изменения тегов #106 |
| S9 | [gost-spec #112](https://github.com/antonsmolko/gost-spec/issues/112) | PR #114 retargeted на main после доставки #113; финальные CI ожидаются; публикация pending | FC 0.3.0 / shell 0.4.0 / feature 0.2.0 на common 0.4.0 / svelte 0.3.0; новые теги требуют отдельного approval |
| K1 | [gost-kit #35](https://github.com/antonsmolko/gost-kit/issues/35) | Реализована и закрыта 2026-11-08; [PR #36](https://github.com/antonsmolko/gost-kit/pull/36) вмержен | API-операция с mapper и доменным типом onSuccess; API включён в common@0.3.0; consumer compatibility проверяется в #96 |
| K2 | [gost-kit #32](https://github.com/antonsmolko/gost-kit/issues/32) | Реализована и закрыта; reset доступен в npm common@0.3.0/svelte@0.2.0, consumer checks — #96 | Общий reset({ excluded }), без правил навигации |
| A1 | [asc-admin #72](https://github.com/antonsmolko/asc-admin/issues/72) | В очереди; задача перенесена из gost-kit #33 | Сначала навигация в приложении, затем решение о библиотечном выносе; #89 отложена |
| Позже | [gost-kit #34](https://github.com/antonsmolko/gost-kit/issues/34) | Отложена | Persisted state, версии/миграции и storage adapters; текущую очередь не блокирует |

## Текущий checkpoint — archive/sync и подготовка #112

#102 завершена через PR #107/main `7ee001d`. Подготовка #106 доставлена PR #108
в main `f1c6f936b408f61f063089eded234ad23bf6e076`. Владелец отдельно разрешил
публикацию этого SHA и состава (private input, not a public basis; публичный scope —
[#106](https://github.com/antonsmolko/gost-spec/issues/106), [evidence](../../openspec/changes/archive/2026-11-16-prepare-feature-plugin-release/design.md#published-feature-release)): feature 0.1.0 / FC 0.2.1 / shell 0.3.1 /
presenter 0.1.1. Четыре тега опубликованы и проверены по remote objects/peeled SHA.
Каждый тег проверен в Codex и Claude с установкой/повтором всех четырёх plugins,
полными картами файлов, выбранным ref/commit и discovery/details. Семь профилей
прошли с первого раза; Codex/shell прошёл в новом профиле после двух сетевых
таймаутов. Старые теги и личные профили сохранены. [Команды и evidence](../../openspec/changes/archive/2026-11-16-prepare-feature-plugin-release/design.md#published-feature-release).
Итоговый отчёт PR #110 доставлен в main `3b200af`; дерево совпало с review, post-merge проверки прошли; canonical links обновлены, #106 закрыта.

[Установку и обновление](../plugin-releases.md) можно выполнять в сессии asc-admin.
Этот snapshot проверен на common@0.3.0 / svelte@0.2.0; обновление runtime приложения
не входит в установку plugins. Новый dispatch опубликован в common@0.4.0 /
svelte@0.3.0; обновление skills [#109](https://github.com/antonsmolko/gost-spec/issues/109) доставлено PR #111/main `3a4ec55`, issue закрыта. Его новые plugin versions ещё не опубликованы.
Прежние #88/#96/#97 завершены; #89 и persisted state отложены, навигация — asc-admin #72.

Проверки runtime/браузера #88/#96 остаются свидетельствами своих поставок;
финальные native проверки #106 подтверждают доставку документации и skills,
а не запуск модели или изменение asc-admin. Версии пяти нормативных npm-пакетов
не менялись. Состояние review/публикации #109 отражается отдельно от #106.

## Работа #109 — typed dispatch

FC/shell/feature skills и fixtures обновлены на npm common@0.4.0 / svelte@0.3.0; реализация доставлена PR #111/main `3a4ec55`.
Кандидаты независимых plugins: FC 0.3.0 / shell 0.4.0 / feature 0.2.0; presenter
0.1.1 не меняется. Эти новые версии ещё не опубликованы. Доступный snapshot #106
сохраняет прежние recipes; его теги не перемещаются. [План и evidence](../../openspec/changes/archive/2026-11-16-update-skills-for-typed-dispatch/design.md).

Archive/sync #106/#109 доставлен PR #113/main `4cfe0ee`: оба change перенесены в архив, три основные спецификации синхронизированы. FC: 9 требований / 25 сценариев; shell: 10 / 19; feature: 8 / 17. Дерево доставки, archive anchors и post-merge проверки подтверждены; current canonical URLs обновлены.

#112 сохраняет три уже назначенные minor versions; меняются только changelog headings и release guidance/checkpoints. Перед публикацией нужны отдельные merge и approval точного main SHA/трёх тегов. Архивный prerequisite PR #113 доставлен; подготовка #114 переключена на main.
