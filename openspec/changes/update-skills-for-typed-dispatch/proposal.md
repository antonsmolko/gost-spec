# Typed dispatch compatibility

## Why

[gost-spec #109](https://github.com/antonsmolko/gost-spec/issues/109) updates consumer
instructions after implemented gost-kit #44/PR #45 and published common 0.4.0 /
svelte 0.3.0. Current FC/shell/feature examples use the previous flattened action
shape and cannot safely guide an application on the new packages.

## What Changes

Update the three affected skills/recipes/fixtures to typed namespace/action paths,
separate payloads and API callback dispatch inputs. Verify actual npm artifacts,
compile-time constraints, pure reducer tests and separate integration/browser
probes. Independently bump affected plugin minor candidates; presenter and the
five normative package versions stay unchanged. Publish no new tag in this task.

## Capabilities

- functional-core-feature-development: typed dispatch inputs and reducer payloads.
- svelte-spa-state-foundation: published common 0.4 / shell 0.3 baseline.
- modular-feature-development: migrated complete example and parity checks.

## Impact

Three plugin trees and external evaluation fixtures, affected specs, readiness,
handoff, root README, consumer release guide and compatibility checks. No new library API, installer, router, persistence
or asc-admin migration. Published #106 tags remain immutable.
