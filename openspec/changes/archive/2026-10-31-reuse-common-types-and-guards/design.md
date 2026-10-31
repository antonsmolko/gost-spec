# Design

Текущий раунд: [#52](https://github.com/antonsmolko/gost-spec/issues/52), carrier
[#51](https://github.com/antonsmolko/gost-spec/issues/51), prefix `[gost-spec-52]`.
Сверены README/package metadata и AGENTS.md gost-kit на локальной ревизии
`53d78e3` ветки `chore/package-release-setup`: имя `@gost-kit/common`, версия
`0.0.0`. Это development/release-preparation snapshot, не факт публикации.
Публичный main на момент сверки сохраняет старое имя; перед применением
проверяется metadata реально выбранного артефакта. Источники и review —
[канонический ledger](review.md).

## Contract

Вход review — новый/изменённый авторский TypeScript проекта, явно выбравшего эту
shared-library policy, установленная версия
@gost-kit/common и реальный типовой/runtime контракт приложения. Для common types
выбирается точный эквивалент, для guard сохраняются acceptance set, evaluation
count, side effects и narrowing. Данные unknown остаются unknown до полной
проверки TS-TYPES-001; generic array guard не валидирует элементы.

Успех — переиспользованный helper с прежним поведением и точной типизацией.
Отсутствие эквивалента, неподходящие domain semantics, generated/third-party,
primitive implementation/tests и undeclared globals — явные исключения.
Нельзя превращать missing в null, делать optional property обязательным,
менять Result union или typeof number/object без проверки семантики. Runtime
исключения приложения не меняются; circular import ради reuse запрещён.

## Decisions

- TS-COMMON-001 proposed/required, точный текст требует отдельного content review.
- Документы остаются читаемыми без runtime imports; применение нового правила
  в коде требует явно настроенной зависимости на отдельный @gost-kit/common.
- Прежняя Local-only disposition именованного guard и её rationale сохраняются;
  proposed policy не заменяет их до отдельного owner content decision.
  TS-TYPES-001 остаётся library-neutral как контракт валидации данных.
- Смешанные импорты объединяются: import { guard, type Ulx } from '@gost-kit/common'.
- Отдельные файлы публичных helper types — внутренняя конвенция разработки
  gost-kit, а не требование к организации типов во всех проектах-потребителях.
- Inventory, pending decision, README, handoff, общий design/roadmap согласуются.
- Только документы и empty changeset: текущие версии, #20/#26 и release gates
  не меняются. Scope issue #52 ограничен исправлением документации; гигиена #53
  и skill #51 не включаются в один implementation PR.

## Verification

Полный npm run check: typecheck, package layout, реальные tarballs и external
consumers. Отдельно просмотреть links, diff и прежние противоречащие положения.
Примеры проверить compiler fixture с реальным пакетом; независимое review по
AGENTS.md §6 получает артефакты без авторского диалога. Runtime текста не
меняется, новые тесты на совпадение формулировок не добавляются.
