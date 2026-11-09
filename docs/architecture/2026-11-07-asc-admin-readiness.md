# Очередь подготовки skills для asc-admin

Обновлено 2026-11-09. Статусы отражают проверенные checkpoint, а не только
open/closed в GitHub. Учёт общий для двух сессий: изменения gost-kit выполняются
в его сессии. Источник требований фичи — [#88](https://github.com/antonsmolko/gost-spec/issues/88).
Таблица обновляется при начале работы, создании PR, review, merge и проверке поставки.

| Очередь | Репозиторий / задача | Статус | Результат / зависимость |
| --- | --- | --- | --- |
| S1 | [gost-spec #87](https://github.com/antonsmolko/gost-spec/issues/87) | Завершена: реализация PR #91, archive/sync [PR #92](https://github.com/antonsmolko/gost-spec/pull/92), main ae92862; 6/6 | [Архив](../../openspec/changes/archive/2026-11-08-connect-store-context-and-published-packages/proposal.md); опубликованная связка, src/store и context |
| S2 | [gost-spec #93](https://github.com/antonsmolko/gost-spec/issues/93) | Завершена: реализация [PR #94](https://github.com/antonsmolko/gost-spec/pull/94), архив [PR #95](https://github.com/antonsmolko/gost-spec/pull/95), main 839c7c8; 3/3; issue закрыта | [Архив](../../openspec/changes/archive/2026-11-08-refresh-functional-core-api-recipe/proposal.md); onSuccess/onError, реальный published ApiEffect/createApiHandler и проверка примеров; не зависит от mapper extension |
| S3 | [gost-spec #96](https://github.com/antonsmolko/gost-spec/issues/96) | Реализация доставлена [PR #98](https://github.com/antonsmolko/gost-spec/pull/98), main 6ca71a6; sync/archive — [PR #99](https://github.com/antonsmolko/gost-spec/pull/99); закрытие #96 после проверки доставки | FC operations/factory/createApiEffector и shell factory/reset/onError на npm common@0.3.0/svelte@0.2.0; [план](../../openspec/changes/archive/2026-11-09-update-skills-for-published-kit-v3/proposal.md) |
| S4 | [gost-spec #97](https://github.com/antonsmolko/gost-spec/issues/97) | После доставки архива #96 | Независимые plugin версии/changelog, native/public-host установка и релизные теги после approval конкретного выпуска |
| S5 | [gost-spec #89](https://github.com/antonsmolko/gost-spec/issues/89) | Отложена | После проверки навигации в asc-admin #72 и решения о выносе общего контракта; middleware не предписана |
| S6 | [gost-spec #88](https://github.com/antonsmolko/gost-spec/issues/88) | Требования согласованы в обсуждении; реализация не начата | Skill модульной фичи и код к каждому правилу; библиотечная зависимость API-примера gost-kit #35 выполнена, пример ещё требует проверки на выбранном артефакте; context от #87, routing recipe отдельно в #89 |
| K1 | [gost-kit #35](https://github.com/antonsmolko/gost-kit/issues/35) | Реализована и закрыта 2026-11-08; [PR #36](https://github.com/antonsmolko/gost-kit/pull/36) вмержен | API-операция с mapper и доменным типом onSuccess; API включён в common@0.3.0; consumer compatibility проверяется в #96 |
| K2 | [gost-kit #32](https://github.com/antonsmolko/gost-kit/issues/32) | Реализована и закрыта; reset доступен в npm common@0.3.0/svelte@0.2.0, consumer checks — #96 | Общий reset({ excluded }), без правил навигации |
| A1 | [asc-admin #72](https://github.com/antonsmolko/asc-admin/issues/72) | В очереди; задача перенесена из gost-kit #33 | Сначала навигация в приложении, затем решение о библиотечном выносе; #89 отложена |
| Позже | [gost-kit #34](https://github.com/antonsmolko/gost-kit/issues/34) | Отложена | Persisted state, версии/миграции и storage adapters; текущую очередь не блокирует |

## Текущий checkpoint — #96

Архив #93 доставлен через [PR #95](https://github.com/antonsmolko/gost-spec/pull/95),
main `839c7c8`; issue закрыта. Check main — 114/114. Это история baseline
common@0.2.1; [evidence](../../openspec/changes/archive/2026-11-08-refresh-functional-core-api-recipe/design.md) сохранены.

Реализация #96 доставлена [PR #98](https://github.com/antonsmolko/gost-spec/pull/98),
main `6ca71a6`; проверка main — 114/114. По запросу владельца выполнены
синхронизация и перенос в архив, задачи 5/5. FC spec — 8 требований / 22 сценария,
shell spec — 10 требований / 18 сценариев. Sync/archive оформлен
[PR #99](https://github.com/antonsmolko/gost-spec/pull/99). После его merge агент,
выполняющий merge в этой сессии gost-spec, проверяет доставку, обновляет
GitHub-checkpoints и закрывает #96. Постоянный статус S3 обновляется в первом
PR #97; [порядок завершения и evidence](../../openspec/changes/archive/2026-11-09-update-skills-for-published-kit-v3/design.md#post-merge-delivery-follow-up).
Пакеты действительно доступны в npm; common требует Node ^26.0.0, shell —
common ^0.3.0 и Svelte ^5.57.2. Среду asc-admin нужно проверить отдельно;
обновлять её молча нельзя. Native/public-host проверка выпуска — #97.

Текущие plugin versions остаются unreleased: FC 0.1.1, shell 0.2.1.
В #97 для обоих содержательных обновлений ожидается minor bump; нынешние
patch-номера предварительные. Окончательные независимые версии и changelog
согласуются в #97, без привязки к номерам библиотек. Установка новой версии
skill сама не обновляет приложение.
Релизные теги и миграция auth/staff требуют отдельных решений владельца.
