# Tasks

## 1. Опубликованная совместимость

- [ ] 1.1 Установить точные опубликованные common@0.2.1 и svelte@0.1.1 во внешнюю копию baseline SPA; сверить public API/engines/peers, записать источник, integrity и фактическое дерево, пройти consumer check/build. При несовместимости зафиксировать incomplete вместо подмены артефактов.

## 2. Context и проверяемый рецепт

- [ ] 2.1 Обновить English shell SKILL.md/reference и fixture instructions: отдельный src/store, useStore/provideStore, bootstrap в app, full state/dispatch, разрешённые imports и применимость. Проверить snippets на реальных пакетах и граф imports без циклов/upward bootstrap imports; сохранить пустой результат подключения и legacy baseline.
- [ ] 2.2 В disposable probe добавить два state slices и проверки до изменения примера; проверить два потребителя одного store, UI/action/reducer/UI, effect/result action, два независимых root instances и missing provider в Chromium. Пройти types/build/browser и сохранить reuseExistingServer:false.
- [ ] 2.3 Проверить применение обновлённого skill на внешнем baseline, повтор без второго store/provider и missing-artifact outcome; сверить legacy bytes/поведение, точные версии и evidence, оставить демонстрационные slices вне конечного подключения.

## 3. Поставка и итоговая согласованность

- [ ] 3.1 Обновить shell plugin metadata/changelog до 0.2.1 unreleased и проверить distribution gate/tests, новое installed content/discovery в изолированных Codex/Claude profiles. Сохранить версии/деревья остальных plugins и пяти npm-пакетов; отметить native/public-host ограничения.
- [ ] 3.2 Выполнить full npm run check, strict change/main specs, полный diff/import/link audit и независимое review; обновить evidence, #87 и таблицу очереди фактическими результатами. Публикация/применение в asc-admin отдельно.

## Workflow follow-up

- После review и отдельного разрешения доставить реализацию; sync/archive и выпуск выполняются отдельными решениями.
