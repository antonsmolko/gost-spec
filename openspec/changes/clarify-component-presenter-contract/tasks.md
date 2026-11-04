# Tasks

План #78; реализация 0/6. [Design](design.md) фиксирует границы и sources;
[spec](specs/frontend-component-presentation/spec.md) — требования.
Нормативные документы/примеры остаются на английском, план — на русском.

## 1. Нормативный контракт и примеры

- [ ] 1.1 Пересмотреть FRONTEND-ARCH-001/002: root/feature ownership logical UI-state, pure composable presenters, один action для logical intent, ready values/boolean и browser plumbing с допустимым zero-action handler. Сохранить validation на app boundaries и explicit missing/invalid state variants, не превращая presenter в validator. Заменить «simple expressions», local UI-state и прежние противоречащие формулировки; вручную проверить каждый design/spec scenario и proposed IDs/levels. Не создавать второй normative source в README или будущем skill.
- [ ] 1.2 Добавить complete synthetic valid/invalid examples для нескольких presenters, loading/empty/error/success, stateless/shared UI, списков/fields/events, read-only selection/presenter call, invalid derived calculations и UI-state intent. Включить browser-plumbing пары: focus-only zero-action handler, refs/lifecycle/widget wiring и противопоставленные им скрытый business action selection/владение logical UI-state. Проверить TS/Svelte syntax/types доступными upstream средствами и вручную обосновать policy verdict каждого случая. Pure presenter/FC tests отделить от UI reactivity; FC inputs брать из готовых state factories. Не выдавать compiler/autofixer за архитектурный lint.

## 2. Согласованность документов и зависимостей

- [ ] 2.1 Согласовать SVELTE-STATE-001/Svelte README и FSD profile/README с новым контрактом: сохранить законное derived/reactive wiring, отдельно выбранный frontend policy и самостоятельную FSD applicability. Проверить positive/negative cases сочетания документов без изменения shell/FC/runtime/API или пяти package identities/версий.
- [ ] 2.2 Обновить frontend README, inventory, Pending approval rows пересматриваемых IDs, product design/roadmap/handoff и #78/#79 tracking. Сохранить Local-only/API/form rationale, исторический #42, зависимости на gost-kit #6/#15–#19, отдельные content/release gates и независимые версии пакетов. Проверить все ссылки/якоря и неизменность статуса норм; не обещать готовые специальные lint guarantees.

## 3. Итоговая проверка

- [ ] 3.1 Выполнить полный npm run check на обоих поддерживаемых Node с реальными packs/external consumers, strict OpenSpec и whitespace. Отдельно просмотреть полный diff/unchanged contracts, ссылки и manual classification всех examples, различая syntax/type, pure behaviour и UI integration. Убедиться, что runtime/plugins, #71/#62/#63/#79 и потребители не изменены.
- [ ] 3.2 Провести независимое fresh-context review полного нормативного результата по #78/spec/design/AGENTS.md, устранить findings либо записать обоснованные dispositions, ответить на threads/summary. Сохранить evidence/limits и представить один implementation PR; это не content acceptance, merge или release.

## Workflow follow-up

- Apply начинается отдельным запросом после review/согласования плана.
- Content approval и публикация требуют самостоятельных решений владельца.
- #79 получает свой дизайн/поставку после согласования этого контракта.
- Sync/archive #75 остаётся отдельной pending работой; не блокирует план #78.
- Sync/archive #78, merge и реальная интеграция приложений требуют своих указаний.
