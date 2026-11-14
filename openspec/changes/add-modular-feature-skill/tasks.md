# Tasks

## 1. Архитектура и пример

- [x] 1.1 Добавить proposed FRONTEND-ARCH-003 и frontend README/changelog/minor changeset, requirements inventory и Pending content-approval row при начале content review; проверить применимость, примеры границ, npm pack содержимое и сохранность четырёх остальных пакетов.
- [x] 1.2 Собрать synthetic fixture list/create с common, root/context и существующими app effects на npm common@0.3.0/svelte@0.2.0; проверить public artifacts/exports, типы, mapper/error flow, factory-based reducer unit tests, соседние slices, import graph и отрицательные cases.
- [x] 1.3 Подключить страницы и presenters; проверить presenter unit tests, реактивность/события в браузере и create → app NavigateEffect → открытие list → свежую загрузку, отдельно обозначив неподтверждённые router/reset timing гарантии.

## 2. Skill и поставка

- [x] 2.1 Написать English SKILL.md и самодостаточный reference с путями/кодом к каждому правилу из gost-spec #88, включая явные ссылки на store/context gost-spec #87 и границы маршрутизации gost-spec #89 в reference; сверить все source blocks с проверенной fixture, проверить incomplete при missing artifact/provider/handler и чтение без соседних plugins/source checkout.
- [x] 2.2 Подготовить gost-feature@0.1.0 unreleased, оба manifests/catalogs, README/changelog/license/icon; сначала показать failing distribution case, затем расширить существующий checker/tests и проверить все прежние guards, identity/containment и неизменность трёх выпущенных plugins.
- [x] 2.3 Проверить isolated native install/discovery/read/repeat/coexistence в Codex/Claude с полным сравнением bytes; независимо применить skill к synthetic foundation, изменить сценарий и повторить, сравнив с baseline без skill и зафиксировав actual checks/ограничения.

## 3. Итоговая проверка

- [ ] 3.1 Обновить root README, queue/handoff и live #88; выполнить full npm check, fixture checks, strict OpenSpec, link/contract audit и независимое review всего outcome; представить implementation PR без merge, content acceptance или release tags.

## Workflow follow-up

- После одобренной реализации отдельно синхронизировать/архивировать change.
- Выпуск plugin/нормативного пакета и применение в asc-admin требуют своих согласованных шагов; #102 учитывать при следующем содержательном выпуске.
