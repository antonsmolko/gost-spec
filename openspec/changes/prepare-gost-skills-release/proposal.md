# Proposal

## Why

Совместимость #96 доставлена, но обновлённые plugins ещё не имеют согласованных выпусков и проверки установки через публичный GitHub. Asc-admin нужен конкретный проверенный snapshot.

## What Changes

- Подготовить независимые minor-версии: functional-core 0.2.0 и svelte-shell 0.3.0.
- Согласовать manifests/changelog/инструкции и проверить native install/repeat/update/coexistence обоих харнесов в изолированных профилях.
- После доставки и отдельного разрешения владельца создать неизменяемые теги и проверить окончательную поставку.

## Capabilities

Новых или изменённых capability requirements нет: применяется существующий контракт версионного snapshot/approval. `skip_specs: true`; runtime/skill recipes не меняются.

## Impact

Metadata/README/changelog двух plugins, общая инструкция выпуска, корневой
README.md, очередь #97 и session handoff
(`docs/architecture/2026-10-11-session-handoff.md`), а также artifacts этого change. Presenter и пять npm packages сохраняют версии. Подготовка не означает публикацию или применение к asc-admin.
