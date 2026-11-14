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
| S4 | [gost-spec #97](https://github.com/antonsmolko/gost-spec/issues/97) | Выпуск опубликован и проверен: FC 0.2.0 / shell 0.3.0; [финальный отчёт PR #101](https://github.com/antonsmolko/gost-spec/pull/101) ожидает доставки | Независимые версии/changelog, native/public-host установка и теги проверены после отдельного approval; далее обновление skills в asc-admin |
| S5 | [gost-spec #89](https://github.com/antonsmolko/gost-spec/issues/89) | Отложена | После проверки навигации в asc-admin #72 и решения о выносе общего контракта; middleware не предписана |
| S6 | [gost-spec #88](https://github.com/antonsmolko/gost-spec/issues/88) | Требования согласованы в обсуждении; реализация не начата | Skill модульной фичи и код к каждому правилу; библиотечная зависимость API-примера gost-kit #35 выполнена, пример ещё требует проверки на выбранном артефакте; context от #87, routing recipe отдельно в #89 |
| K1 | [gost-kit #35](https://github.com/antonsmolko/gost-kit/issues/35) | Реализована и закрыта 2026-11-08; [PR #36](https://github.com/antonsmolko/gost-kit/pull/36) вмержен | API-операция с mapper и доменным типом onSuccess; API включён в common@0.3.0; consumer compatibility проверяется в #96 |
| K2 | [gost-kit #32](https://github.com/antonsmolko/gost-kit/issues/32) | Реализована и закрыта; reset доступен в npm common@0.3.0/svelte@0.2.0, consumer checks — #96 | Общий reset({ excluded }), без правил навигации |
| A1 | [asc-admin #72](https://github.com/antonsmolko/asc-admin/issues/72) | В очереди; задача перенесена из gost-kit #33 | Сначала навигация в приложении, затем решение о библиотечном выносе; #89 отложена |
| Позже | [gost-kit #34](https://github.com/antonsmolko/gost-kit/issues/34) | Отложена | Persisted state, версии/миграции и storage adapters; текущую очередь не блокирует |

## Текущий checkpoint — выпуск #97

Совместимость #96 закрыта после PR #98/99; её постоянный S3/handoff checkpoint
доставлен PR #100. Подготовка #97 вмержена в main `64714fc`, проверена 114/114,
strict 13/13. Владелец отдельно разрешил конкретный выпуск на этом commit.

Опубликованы неизменяемые теги `gost-functional-core-v0.2.0` и
`gost-svelte-shell-v0.3.0`, оба на `64714fcc9929ce3eb0ea7676dfabaa883f5069f7`.
Presenter 0.1.0 и пять npm packages сохранены. Установка из каждого тега проверена
в обоих харнесах (четыре чистых профиля), включая repeat/coexistence, native
discovery и все 8 файлов каждого плагина. Явная смена регистрации между тегами
с восстановлением пары/presenter также проверена; личные fingerprints сохранены.

[Финальные receipts и ограничения](../../openspec/changes/prepare-gost-skills-release/design.md#published-release-verification),
[проверенная инструкция для asc-admin](../plugin-releases.md). Задачи 5/5;
#97 остаётся открытой до доставки финального verification PR. После его merge
выполняющий merge агент проверяет доставку отчёта и закрывает #97; live checkpoints
обновляются сразу, изменения файлов — через PR. Теги остаются на согласованном
release commit, последующие documentation commits их не перемещают.

Теперь можно обновить skills в сессии asc-admin по указанной инструкции.
Проверка runtime-зависимостей и применение skills выполняются там отдельно.
