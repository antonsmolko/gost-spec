# Tasks

План #79, реализация 5/6. [Design](design.md) описывает решение и примеры,
[spec](specs/component-presentation-development/spec.md) — поведение.
Skill, reference и публичный README пишутся на английском.

## 1. Skill и рабочие примеры

- [x] 1.1 Подготовить `fixtures/view-presenter/` на Svelte 5 с synthetic catalog data и обычными props. Разместить presenter и unit-тест рядом, отдельно добавить браузерные проверки текста, веток, списка и callbacks. До написания skill выполнить baseline задачи и подтвердить RED на отсутствующих/неверных вычислениях. README содержит одинаковый запрос для сравнений и команды запуска; браузерный сервер отказывается работать при занятом адресе.
- [x] 1.2 Написать краткий `gost-view-presenter` SKILL.md и `references/view-presenter.md` с полным примером: исходный компонент → функции → unit-тесты → компонент с готовыми результатами. Показать независимые/скомпонованные вычисления, состояния данных и простой компонент с готовыми props. Проверить код reference через unit tests, TypeScript/Svelte, build и browser; ошибочные примеры классифицировать вручную. Указать revision/status источников и проверить чтение reference и правил из изолированной установки.
- [x] 1.3 Независимо применить skill к выделению, созданию, изменению, повторной задаче, простому компоненту и missing-input/source cases в disposable consumers. Проверить generated files, ожидаемые результаты, неизменность входов, композицию, reactive updates и callbacks в Chromium. Сравнить соседние файлы, зависимости и привязки до/после; записать наблюдения и ограничения, исправить подтверждённые проблемы инструкции.

## 2. Поставка

- [x] 2.1 Собрать plugin 0.1.0 unreleased, добавить два manifests и local entries в каталоги. Сначала получить RED на отсутствующей/повреждённой третьей поставке, duplicate/redirect/cross-plugin cases, затем расширить checker и подтвердить GREEN со всеми прежними regressions. Проверить metadata, дерево, diagnostics, ссылки и сохранность прежних plugins/пяти npm-пакетов. README/changelog/root listing описывают фактическую поставку и версии.
- [x] 2.2 В изолированных профилях Codex/Claude проверить отдельную установку, соседство с прежними plugins, повтор, fresh discovery/read reference и installed bytes. Сравнить личные настройки и synthetic app до/после. Записать команды, версии, URL/revision и результаты; различить loopback и public-host evidence. README согласовать с проверенными формами установки; отсутствие проверки харнеса оставить открытым ограничением.

## 3. Итоговая проверка

- [ ] 3.1 Выполнить full npm run check на обоих Node с real packs/external consumers, strict change/main specs и whitespace. Отдельно проверить полный diff, согласованность с #79 и существующими контрактами, ссылки/якоря. Обновить handoff, обзор продукта, roadmap, #79 и evidence. Провести независимое review полного результата, закрыть findings с ledger/replies и представить один implementation PR. Сохранить proposed/Pending и отдельные решения о merge/выпуске.

## Workflow follow-up

- После review/approval плана — отдельный apply request.
- Merge реализации, sync/archive и выпуск выполняются по отдельным указаниям.
- Другие UI adapters и изменения архитектуры приложения рассматриваются в своих задачах.
