---
name: gost-functional-core
description: Use when creating or changing business feature state, actions, reducers or effect flow in a TypeScript project using the gost-kit functional core (@gost-kit/common).
---

# GOST functional core

Implement the requested business feature inside the application's existing FC
composition. A feature owns state, actions and pure reducers. Reducers return
descriptions of existing application effects; application-level handlers execute
them and dispatch the actions returned by callbacks. No UI framework is required.

Read [the public API recipe](references/functional-core.md) before writing
handlers or changing composition. It records the verified published common 0.2.1
baseline; compatibility with the consumer's installed version is checked separately.

## Establish the available contracts

Inspect project instructions, the installed `@gost-kit/common` metadata, public
exports/types, root state/actions/reducer/effector, store access and existing
tests. Import through the public package root. Match the actual installed API;
do not upgrade dependencies or copy library source to make the example work.
If the required artifact/export or compatibility is unavailable, identify the
missing input and leave dependent integration explicitly incomplete.

Use `state.ts`, `action.ts`, `reducer.ts` and colocated `reducer.test.ts` for a new
feature's functional core, within the project's existing layout. Preserve compatible
existing modules. FSD, one-type-per-file and presenter architecture are not
prerequisites. Limit changes to the requested feature and its root composition.

## Implement and compose the feature

- Define feature state, local actions and pure reducer handlers. Use the actual
  `define.reducer`, `reducing` and `scope` contracts. Return the complete state
  at the replaced level; omitted state preserves it. Never mutate inputs or
  execute network/storage/timer operations in reducers.
- Route feature actions with `ScopedActions`. Local action declarations have
  no `scope`; composition adds it. Action namespace and state property may
  differ. Read root state through handler arguments, without hidden store imports.
- Reuse existing application effect contracts, such as `ApiEffect`, `ModalEffect`,
  `AlertEffect` and `NavigateEffect`. Features do not define effect types or
  effectors. For an existing API effect, its success/error callbacks convert the
  response or API errors into feature result actions; the application handler
  invokes `dispatch` with those actions. In the verified published API,
  `onSuccess(data)` and `onError(errors, failure)` return actions;
  `createApiHandler` owns dispatch and the `defaultError` fallback. Inspect the actual contract and field
  names rather than designing a replacement API or transport adapter.
- Keep `AppEffector`/`RootEffector` and all handler tables at application level.
  Preserve compatible handlers. If a necessary shared effect/handler is missing,
  report that dependency and incomplete integration; extending gost-kit or the
  application's effect infrastructure is separate work.
- Extend existing root state/action unions and reducer tables. Preserve
  unrelated state and the store instance. If no compatible composition exists,
  report the separate foundation work needed; do not reconnect shell or create
  another store/provider as part of this skill.

## Verify the requested behaviour

In `reducer.test.ts`, prepare inputs with the project's existing root/feature
state factories and scenario overrides. Test the pure `(state, action) →
{ state, effects }` contract. Group cases by action and scenario; assert returned
state fields and effect descriptions/parameters. Test result actions directly
with their own factory-built inputs. Reuse the project's test runner and action
representation; do not copy classes or wrappers from another implementation.

Keep dispatch, effect execution and application integration checks separate from
feature reducer tests. Run applicable checks with real artifacts, verify neighbour
preservation and repeat application without duplicate registrations. Compilation
alone does not establish business success.

`await dispatch(...)` waits for its effects and awaited nested dispatches;
execution errors are reported rather than propagated. Determine success from
business state/result actions. Do not assume automatic cancellation, rollback,
stale-response protection or completion of unrelated dispatches.

Report changed modules, actual dependency version/source, checks run and concrete
incomplete work. A local reducer test cannot certify an unconnected application.
