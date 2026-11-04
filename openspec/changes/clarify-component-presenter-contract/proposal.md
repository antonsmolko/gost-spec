# Proposal

## Why

В proposed frontend-правилах граница между готовым UI-значением, presentation
calculation и локальным состоянием описана неоднозначно. До разработки presenter
skill нужно согласовать проверяемый контракт component → presenter → FC по
[запросу #78](https://github.com/antonsmolko/gost-spec/issues/78).

## What Changes

- Уточнить FRONTEND-ARCH-001/002: logical UI/feature state принадлежит root/feature
  state и меняется через dispatch/reducer; чистые presenters вычисляют view state.
- Заменить «simple expressions» точными valid/invalid cases: готовые значения,
  boolean if/else-if, списки/поля элементов, DOM event payload и reactive bindings.
- Сохранить read-only выбор feature state и вызов presenter через `$derived`;
  presentation calculations внутри компонента, включая его `$derived`, вынести
  в presenters. Определить DOM plumbing без второго mutable UI-store.
- Зафиксировать один action для логического UI-намерения; browser-only plumbing
  может не отправлять action. Бизнес-выбор и workflow находятся в reducer/effects.
- Согласовать frontend/Svelte/FSD документы и review tracking, сохраняя proposed,
  отдельное принятие текста и release gates. **Изменение поведения при принятии
  policy:** прежнее разрешение local interaction state в UI уточняется;
  существующие потребители автоматически не мигрируются.

## Capabilities

### New Capabilities

- `frontend-component-presentation`: границы state ownership, presenters,
  компонентных выражений/событий и проверки выбранного FC/presenter контракта.

### Modified Capabilities

Нет: среди двух текущих main specs нет этого capability. Старый завершённый
change `presenter-composition` хранит исторический дизайн без delta specs;
его #42 не переоткрывается.

## Impact

Apply изменит proposed frontend-документы, совместимость Svelte/FSD профилей,
README/inventory/approval tracking и внутренние указатели. Это один нормативный
outcome #78; skill [#79](https://github.com/antonsmolko/gost-spec/issues/79), ESLint,
presenter runtime и миграция asc-admin исключены. Ни один из пяти npm-пакетов
не переименовывается и не получает версию другого пакета.

Planning PR #80 создавал только план; на том этапе нормативные документы оставались
прежними. Реализация начата отдельным owner request после merge плана.
Историческая база плана — merged PR #77, main `31930c4`; planning-ветка —
`feature/gost-spec-78-component-presenter-contract`. Реализация основана на merge
PR #80, main `4b5361a`, и ведётся в
`feature/gost-spec-78-component-presenter-implementation`, prefix `[gost-spec-78]`.
#75 реализована, отдельный sync/archive остаётся pending.
Согласование плана не принимает proposed-текст.

Archive checkpoint 2026-11-04: прежние pending-упоминания #75 описывают этап
планирования/реализации #78. #75 теперь синхронизирован и перенесён в
[архив](../archive/2026-11-04-add-functional-core-skill/design.md); доставка архива
в main ожидает отдельного PR. Sync/archive #78 пока не выполнялся.
