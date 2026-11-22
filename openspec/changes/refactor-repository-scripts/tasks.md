# Tasks

## 1. Скрипты

- [x] 1.1 Зафиксировать baseline, CLI и порядок диагностик; до refactor добавить недостающие characterization cases и проверить их чувствительность disposable-мутацией. Проверка: существующие тесты и новые cases проходят на исходном поведении, контрольная мутация даёт ожидаемый failure.
- [x] 1.2 Выделить предметные шаги plugin checker и workspace checker, сохранив exports/CLI/catch; объединить JSON object-guard без изменения caller handling, обе identity-диагностики оставить. Проверка: полные соответствующие suites, точные multi-error diagnostics и отсутствие записей совпадают с baseline; результат и границы helpers записаны в design.

## 2. Test helpers

- [x] 2.1 Выделить шаги document checker и header parser; аудит installOffline подтвердить без искусственного дробления. Проверка: тесты headers/documents/offline и реальные packed consumers, включая ошибки/неизменность файлов; нужные regression cases добавлены до правок, аудит всех трёх helpers записан.
- [x] 2.2 Оценить identity-повторы в связанных distribution tests и применить только полезные локальные упрощения; сохранить оценённые presenter/package version literals и независимые assertions согласно design. Проверка: весь существующий набор assertions сохранён, неправильная production identity по-прежнему ловится; решение об изменениях или их отсутствии записано.

## 3. Интеграция

- [ ] 3.1 Пройти npm run check на Node 26.0.0 и 26.11.1, strict OpenSpec, links/diff и независимое ревью полного результата; представить implementation PR с evidence, сохранив package/plugin bytes и расположение tests.

## Workflow follow-up

- Merge и архивирование выполняются после отдельных указаний владельца.
