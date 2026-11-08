# Очередь подготовки skills для asc-admin

Обновлено 2026-11-08. Статусы отражают проверенные checkpoint, а не только
open/closed в GitHub. Учёт общий для двух сессий: изменения gost-kit выполняются
в его сессии. Источник требований фичи — [#88](https://github.com/antonsmolko/gost-spec/issues/88).
Таблица обновляется при начале работы, создании PR, review, merge и проверке поставки.

| Очередь | Репозиторий / задача | Статус | Результат / зависимость |
| --- | --- | --- | --- |
| S1 | [gost-spec #87](https://github.com/antonsmolko/gost-spec/issues/87) | Реализация готова, 6/6; [доставка PR #91](https://github.com/antonsmolko/gost-spec/pull/91) | [План](../../openspec/changes/connect-store-context-and-published-packages/proposal.md); опубликованная связка, src/store и context. Не зависит от новых API gost-kit |
| S2 | gost-spec — актуализировать FC recipe, issue ещё не создана | В очереди | Исправить receiverSuccess/receiverError на текущие onSuccess/onError и проверить примеры; не ждать mapper extension |
| S3 | [gost-spec #89](https://github.com/antonsmolko/gost-spec/issues/89) | В очереди | Рецепт middleware после реализации gost-kit #33 |
| S4 | [gost-spec #88](https://github.com/antonsmolko/gost-spec/issues/88) | Требования согласованы в обсуждении; реализация не начата | Skill модульной фичи и код к каждому правилу; библиотечная зависимость API-примера gost-kit #35 выполнена, пример ещё требует проверки на выбранном артефакте; context от #87, routing recipe отдельно в #89 |
| K1 | [gost-kit #35](https://github.com/antonsmolko/gost-kit/issues/35) | Реализована и закрыта 2026-11-08; [PR #36](https://github.com/antonsmolko/gost-kit/pull/36) вмержен | API-операция с mapper и доменным типом onSuccess; доступность в выбранном опубликованном пакете проверяется отдельно |
| K2 | [gost-kit #32](https://github.com/antonsmolko/gost-kit/issues/32) | В очереди; задача открыта | Общий reset({ excluded }), без правил навигации |
| K3 | [gost-kit #33](https://github.com/antonsmolko/gost-kit/issues/33) | В очереди; задача открыта | Маршрутизация без мерцаний; зависит от #32 |
| Позже | [gost-kit #34](https://github.com/antonsmolko/gost-kit/issues/34) | Отложена | Persisted state, версии/миграции и storage adapters; текущую очередь не блокирует |

## Текущий checkpoint — #87

Ветка feature/gost-spec-87-shell-context-implementation; change
connect-store-context-and-published-packages, spec-driven. План доставлен [PR #90](https://github.com/antonsmolko/gost-spec/pull/90), main `aaf21f4`.
Реализация подготовлена; публикация и обновление потребителей выполняются отдельно. Published metadata для common@0.2.1
и svelte@0.1.1 доступны, engines обоих ^26.0.0; совместная runtime-проверка прошла во внешнем SPA;
независимое итоговое review завершилось без существенных замечаний. [Решения и evidence](../../openspec/changes/connect-store-context-and-published-packages/design.md).

После #87 и обновления FC recipe можно отдельно доставить skills и возобновить
подключение пустой основы в asc-admin. Проверить среду реального потребителя
против engines/peers; не поднимать её версию молча. Переход к расширенной
архитектуре зависит от соответствующих библиотечных работ и примеров.
Миграция auth/staff, принятие нормативного содержания и релизные теги требуют
отдельных решений. Установка новой skill revision сама не меняет приложение.
