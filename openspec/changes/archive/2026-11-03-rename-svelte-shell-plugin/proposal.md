# Proposal

## Why

Владелец предложил более короткое имя `gost-svelte-shell` вместо
`gost-svelte-spa-state` до подключения плагина в asc-admin. Нужно согласованно
изменить идентичность поставки и skill, сохранив проверенный контракт fc/shell.

## What Changes

- **BREAKING**: заменить plugin ID и имя skill на `gost-svelte-shell` в обоих
  харнесах, каталогах, путях и командах установки/вызова.
- Подготовить новый content commit и Claude source.sha; сохранить точное
  совпадение поставок и доступность прежних immutable commits.
- Описать переход со старого ID через явные uninstall/install и подтвердить
  native discovery нового ID без оставшегося старого skill после перехода.
- Сохранить Svelte 5 SPA scope, совместимость библиотек, обязательную основу,
  отсутствие автоматического изменения приложения и независимость npm-пакетов.

## Capabilities

### New Capabilities

Нет: переименование относится к существующей возможности поставки.

### Modified Capabilities

- `state-foundation-plugin-distribution`: новое имя поставляемого plugin/skill
  и явный переход с прежней идентичности.

## Impact

Связанные каталоги/манифесты, plugin root и skill metadata, distribution gate и
его тесты, current docs/ссылки. Новые shell-функции, SvelteKit, рефакторинг #62,
перенос тестов #63, применение к asc-admin и выпуск не входят в scope.

Outcome — [#64](https://github.com/antonsmolko/gost-spec/issues/64), отдельное
дополнение к #55 на carrier #54 с retained prefix `[gost-spec-52]`. Criteria/
closure #54/#55 и gates #20/#26 не расширяются. Сначала отдельно сохранить
подготовленный archive #55 с main spec; этот план не меняет staged archive.
Предположение плана: предложенное имя применяется одновременно к plugin и skill.
Владелец явно запустил apply. Реализация и новые native проверки завершены,
9/9 и evidence записаны в design/tasks; planning review сохранён отдельно.
