# Очередь подготовки skills для asc-admin

Обновлено 2026-11-10. Статусы отражают проверенные checkpoint, а не только
open/closed в GitHub. Учёт общий для двух сессий: изменения gost-kit выполняются
в его сессии. Источник требований фичи — [#88](https://github.com/antonsmolko/gost-spec/issues/88).
Таблица обновляется при начале работы, создании PR, review, merge и проверке поставки.

| Очередь | Репозиторий / задача | Статус | Результат / зависимость |
| --- | --- | --- | --- |
| S1 | [gost-spec #87](https://github.com/antonsmolko/gost-spec/issues/87) | Завершена: реализация PR #91, archive/sync [PR #92](https://github.com/antonsmolko/gost-spec/pull/92), main `ae92862`; 6/6 | [Архив](../../openspec/changes/archive/2026-11-08-connect-store-context-and-published-packages/proposal.md); опубликованная связка, src/store и context |
| S2 | [gost-spec #93](https://github.com/antonsmolko/gost-spec/issues/93) | Завершена: реализация [PR #94](https://github.com/antonsmolko/gost-spec/pull/94), архив [PR #95](https://github.com/antonsmolko/gost-spec/pull/95), main `839c7c8`; 3/3; issue закрыта | [Архив](../../openspec/changes/archive/2026-11-08-refresh-functional-core-api-recipe/proposal.md); onSuccess/onError, реальный published ApiEffect/createApiHandler и проверка примеров; не зависит от mapper extension |
| S3 | [gost-spec #96](https://github.com/antonsmolko/gost-spec/issues/96) | Реализация доставлена [PR #98](https://github.com/antonsmolko/gost-spec/pull/98), main `6ca71a6`; sync/archive доставлен [PR #99](https://github.com/antonsmolko/gost-spec/pull/99), main `02591a2`; issue закрыта после проверки доставки | FC operations/factory/createApiEffector и shell factory/reset/onError на npm common@0.3.0/svelte@0.2.0; [план](../../openspec/changes/archive/2026-11-09-update-skills-for-published-kit-v3/proposal.md) |
| S4 | [gost-spec #97](https://github.com/antonsmolko/gost-spec/issues/97) | Подготовка — [PR #100](https://github.com/antonsmolko/gost-spec/pull/100); выпуск после отдельного approval и tag checks | Независимые plugin версии/changelog, native/public-host установка и релизные теги после approval конкретного выпуска |
| S5 | [gost-spec #89](https://github.com/antonsmolko/gost-spec/issues/89) | Отложена | После проверки навигации в asc-admin #72 и решения о выносе общего контракта; middleware не предписана |
| S6 | [gost-spec #88](https://github.com/antonsmolko/gost-spec/issues/88) | Требования согласованы в обсуждении; реализация не начата | Skill модульной фичи и код к каждому правилу; библиотечная зависимость API-примера gost-kit #35 выполнена, пример ещё требует проверки на выбранном артефакте; context от #87, routing recipe отдельно в #89 |
| K1 | [gost-kit #35](https://github.com/antonsmolko/gost-kit/issues/35) | Реализована и закрыта 2026-11-08; [PR #36](https://github.com/antonsmolko/gost-kit/pull/36) вмержен | API-операция с mapper и доменным типом onSuccess; API включён в common@0.3.0; consumer compatibility проверяется в #96 |
| K2 | [gost-kit #32](https://github.com/antonsmolko/gost-kit/issues/32) | Реализована и закрыта; reset доступен в npm common@0.3.0/svelte@0.2.0, consumer checks — #96 | Общий reset({ excluded }), без правил навигации |
| A1 | [asc-admin #72](https://github.com/antonsmolko/asc-admin/issues/72) | В очереди; задача перенесена из gost-kit #33 | Сначала навигация в приложении, затем решение о библиотечном выносе; #89 отложена |
| Позже | [gost-kit #34](https://github.com/antonsmolko/gost-kit/issues/34) | Отложена | Persisted state, версии/миграции и storage adapters; текущую очередь не блокирует |

## Текущий checkpoint — #97

#96 завершена и закрыта: реализация PR #98 и archive/spec-sync PR #99 доставлены в
main `02591a2`. После merge проверены main 114/114, strict 12/12 и parser audit
149 Markdown/268 links/25 fragments/0 errors. Это delivery evidence того snapshot.
FC spec 8/22, shell 10/18; [архив](../../openspec/changes/archive/2026-11-09-update-skills-for-published-kit-v3/design.md).
Обязательство обновить S3/current checkpoint/handoff первым PR по задаче #97 выполнено здесь.

Готовятся независимые candidates FC 0.2.0 и shell 0.3.0; presenter 0.1.0 сохраняется.
[План и evidence](../../openspec/changes/prepare-gost-skills-release/design.md),
[порядок выпуска/обновления](../plugin-releases.md). Проверки public GitHub ref и
окончательных тегов учитываются отдельно. Release tags/публикация требуют
approval конкретного проверенного main commit; candidate version не означает
доступный релиз. Применение к asc-admin выполняется в его сессии после выпуска.

Preparation PR #100: candidate public-host install/update/repeat/coexistence и native
discovery обоих харнесов проверены, полный check 114/114, strict 13/13; независимое
ревью пройдено. Final main/release approval и actual tag installation остаются
задачами 4/5. #97 не закрывается по preparation PR; версии в metadata не означают
опубликованные теги. После merge PR #100 выполняющий merge агент сверяет main и
представляет конкретный release candidate владельцу. Теги создаются только после
отдельного разрешения; live checkpoint обновляется при каждом шаге, эта таблица —
через очередной PR, без прямых коммитов в main.
