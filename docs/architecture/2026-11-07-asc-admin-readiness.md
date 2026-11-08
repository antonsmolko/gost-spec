# Очередь подготовки skills для asc-admin

Обновлено 2026-11-08. Статусы отражают проверенные checkpoint, а не только
open/closed в GitHub. Учёт общий для двух сессий: изменения gost-kit выполняются
в его сессии. Источник требований фичи — [#88](https://github.com/antonsmolko/gost-spec/issues/88).
Таблица обновляется при начале работы, создании PR, review, merge и проверке поставки.

| Очередь | Репозиторий / задача | Статус | Результат / зависимость |
| --- | --- | --- | --- |
| S1 | [gost-spec #87](https://github.com/antonsmolko/gost-spec/issues/87) | Завершена: реализация PR #91, archive/sync [PR #92](https://github.com/antonsmolko/gost-spec/pull/92), main ae92862; 6/6 | [Архив](../../openspec/changes/archive/2026-11-08-connect-store-context-and-published-packages/proposal.md); опубликованная связка, src/store и context |
| S2 | [gost-spec #93](https://github.com/antonsmolko/gost-spec/issues/93) | Реализация готова, 3/3; [PR #94](https://github.com/antonsmolko/gost-spec/pull/94) ожидает review | [План](../../openspec/changes/refresh-functional-core-api-recipe/proposal.md); onSuccess/onError, реальный published ApiEffect/createApiHandler и проверка примеров; не зависит от mapper extension |
| S3 | [gost-spec #89](https://github.com/antonsmolko/gost-spec/issues/89) | В очереди | Рецепт middleware после реализации gost-kit #33 |
| S4 | [gost-spec #88](https://github.com/antonsmolko/gost-spec/issues/88) | Требования согласованы в обсуждении; реализация не начата | Skill модульной фичи и код к каждому правилу; библиотечная зависимость API-примера gost-kit #35 выполнена, пример ещё требует проверки на выбранном артефакте; context от #87, routing recipe отдельно в #89 |
| K1 | [gost-kit #35](https://github.com/antonsmolko/gost-kit/issues/35) | Реализована и закрыта 2026-11-08; [PR #36](https://github.com/antonsmolko/gost-kit/pull/36) вмержен | API-операция с mapper и доменным типом onSuccess; доступность в выбранном опубликованном пакете проверяется отдельно |
| K2 | [gost-kit #32](https://github.com/antonsmolko/gost-kit/issues/32) | В очереди; задача открыта | Общий reset({ excluded }), без правил навигации |
| K3 | [gost-kit #33](https://github.com/antonsmolko/gost-kit/issues/33) | В очереди; задача открыта | Маршрутизация без мерцаний; зависит от #32 |
| Позже | [gost-kit #34](https://github.com/antonsmolko/gost-kit/issues/34) | Отложена | Persisted state, версии/миграции и storage adapters; текущую очередь не блокирует |

## Текущий checkpoint — #93

#87 доставлена реализацией PR91/main `97bbc04` и архивом PR92/main `ae92862`.
Main spec: 9 требований / 15 сценариев; shell 0.2.1 unreleased сохраняется.
Текущая ветка — feature/gost-spec-93-functional-core-api-recipe, change
refresh-functional-core-api-recipe. Узкий implementation PR исправляет reference
и private fixture под common@0.2.1, не меняя нормативные требования.
Старый пример даёт ожидаемый compiler RED; исправленный проходит typecheck,
reducer unit tests и API success/error/defaultError probes во внешнем consumer.
[План и evidence](../../openspec/changes/refresh-functional-core-api-recipe/design.md).
Результат — [PR #94](https://github.com/antonsmolko/gost-spec/pull/94), 3/3 задач;
Independent review без существенных замечаний; reviewer повторил consumer/unit/
integration/full suite. Native/model install, strict OpenSpec и полный link audit
он не повторял — это evidence автора; подробности и ограничения в ledger выше.
FC plugin 0.1.1 unreleased; merge/archive и
выпуск требуют отдельных решений. Остальные версии сохранены.

После #87 и обновления FC recipe можно отдельно доставить skills и возобновить
подключение пустой основы в asc-admin. Проверить среду реального потребителя
против engines/peers; не поднимать её версию молча. Переход к расширенной
архитектуре зависит от соответствующих библиотечных работ и примеров.
Миграция auth/staff, принятие нормативного содержания и релизные теги требуют
отдельных решений. Установка новой skill revision сама не меняет приложение.
