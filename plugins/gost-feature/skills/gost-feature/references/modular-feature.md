# Modular feature recipe

Checked on Node 26.11.1, TypeScript 5.9.3, Svelte 5.57.2,
[@gost-kit/common 0.3.0](https://www.npmjs.com/package/@gost-kit/common/v/0.3.0)
and [@gost-kit/svelte 0.2.0](https://www.npmjs.com/package/@gost-kit/svelte/v/0.2.0).
Both gost-kit packages require Node ^26.0.0; shell's peer is Svelte ^5.57.2.
Read the consumer's actual public exports/types before adapting this example.
No library workspace import or automatic upgrade is needed.

## Architecture and applicability

The selected source is proposed FRONTEND-ARCH-003,
[Modular features and scenarios](https://github.com/antonsmolko/gost-spec/blob/f1d6e5685f89df94709b2198a1a529e5b5855efa/packages/domains/frontend/architecture/modular-features.md),
revision `f1d6e5685f89df94709b2198a1a529e5b5855efa`. Its sections Requirement, API and state, Scenario
interaction and Verification define the relevant boundaries. This draft is not
accepted merely because a skill or framework is installed. Read the linked text
or a verified copy of that revision; report unavailable source verification
explicitly. The complete example below is included in this plugin and readable
without a repository checkout or another installed skill.

Foundation/store context is the delivered contract from
[gost-spec #87](https://github.com/antonsmolko/gost-spec/issues/87).
The separate navigation boundary and recipe are tracked in
[gost-spec #89](https://github.com/antonsmolko/gost-spec/issues/89): do not treat
that follow-up or the example's app adapter as a published router API.

## Start from the existing foundation

The [complete source listing](users-example.md) includes bootstrap/store and
synthetic app infrastructure so the example can be checked in isolation. In a
consumer, those modules are existing prerequisites to reuse, not a second store
to generate. If its artifacts, provider or needed handlers are absent, report
the missing foundation/integration before dependent changes. Do not manufacture
a gost-kit effect or reconnect shell as a hidden part of creating a feature.

The example adds users/list and users/create. The same scenario layout applies
to users/update when requested:

```text
src/features/users/
  common/
    data/{dto,mappers}
    domain/{entities,lib}
    ui/components
  list/
  create/
  update/
    app/routing
    data/{api,dto,mappers}
    domain/{entities,fc,lib}
    ui/{components,pages}
```

Only needed modules exist in the listing. A scenario mapper starts in its own
data/mappers; mapUser is common here because GET and POST both use it. Generated
schema types remain in the existing shared API schema. Test factories and tests
are colocated with their owner. Common never imports a scenario. Application
utilities and generic API infrastructure remain outside this business feature.

## Follow one connected example

Every path below has a complete, checked block in [the source listing](users-example.md).

| Rule | Example paths and observable result |
| --- | --- |
| Shared domain/DTO/mapping | `common/domain/entities/user.ts`, `common/data/dto/user.ts`, `common/data/mappers/user.ts`, `common/index.ts`: one domain type, factory and mapper used by both operations |
| API operations | `list/data/api/list-users.ts`, `create/data/api/create-user.ts`: generated Paths/DTO types and operation-specific mapping, no feature action/reducer imports |
| Independent FC | Each scenario's `domain/fc/{state,action,reducer}.ts`; `store/contracts.ts` and `store/reducer.ts` connect users-list/users-create state to directory/registration namespaces |
| Reducer unit tests | Each `domain/fc/reducer.test.ts` calls rootReducer with rootState and feature factory overrides; checks state/effect descriptions and direct result actions without requests |
| Pages/components | Each `ui/pages` composes the scenario view; `ui/components` holds component, presenter and presenter tests; `ui/index.ts` is separate from FC/data entrypoint |
| Presentation | `users.presenter.ts` and `create.presenter.ts` return complete ready data from named inputs, including loading/empty/error; Svelte components bind with $derived and dispatch intent actions |
| Public access | `store/context.ts` imports root contracts as types, `store/index.ts` exports the accessor; feature UI does not import App/bootstrap or construct a store |
| Cross-scenario flow | `create/domain/fc/reducer.ts` returns app NavigateEffect; `store/effector.ts` opens the page and invokes list's public `app/routing/enter.ts`; create never imports list |

FC/data public entrypoints (`list/index.ts`, `create/index.ts`) contain no UI
exports. Domain entities depend on neither data nor FC. The concrete dependency
chain `domain/fc → data/api → data/mappers → domain/entities` is valid; returning
to the word domain does not create a cycle. Type-only root contract imports are
distinct from runtime bootstrap dependencies. The source graph is verified with
negative common→scenario/peer/cycle cases, not just a successful compile.

### API success and failure

`createApiEffect` describes one existing operation with parameters and callbacks;
it performs no request or mapping. `createApiEffector` at application level uses
the generic client and generated schema, applies the operation mapper and then
dispatches the result of `onSuccess(domainData)`. `onError(errors, failure)` returns
an error action. ApiError is the published AppError shape: code/message strings
and readonly string[] path. Raw client requests still return DTOs; operation
mapping belongs to effect execution.

`mapUser` validates the illustrated wire shape. GET checks its collection shape;
its array mapping and POST's single-user mapping produce the same User model.
The error mapper validates the synthetic backend envelope. Network/contract and
empty backend-error failures use the configured defaultError. Mapper exceptions
become contract failures, not false success. Callback/dispatch execution failures
remain store errors and are not converted into API business errors.

Result-action unit cases use independent factory-built states; they do not chain
requests. The app integration harness uses real common client/effector with
injected fetch. `store/application.ts` is the non-Svelte test harness, not another
store for the UI. Browser code uses one real shell store from create-store.ts.
`await dispatch` completing is not business success; check result actions/state.

### Opening and navigation

List EnterAction starts a fresh state/query and loading; LoadAction refreshes
while retaining the current query. Create EnterAction resets the draft. On
successful creation, its reducer describes the existing NavigateEffect; the app
owns page selection and list initialization. Neither scenario accesses the
other's state or internal actions.

This is a controlled synthetic navigation contract. It does not guarantee reset
or rendering order for a real router. Shell reset takes caller exclusions via
`store.reset({ excluded: ['preferences'] })`; `reset()` resets everything to fresh
factory values. The caller chooses when to reset. The feature structure does not
cancel old requests, prevent stale responses, implement auth guards or persist
filters/forms. Do not promise those behaviors without their separate evidence.

## Check, change and repeat

The listing includes complete modules and ordinary tests. Reconstruct them in a
disposable consumer with the listed package.json/lock-compatible versions, inspect
the installed exports and run check, test:unit, test:integration, build and
Chromium checks. The demo transport is synthetic test infrastructure, not a
replacement API client to copy into a consumer.

Compile `checks/contracts.ts` to check invalid request parameters, wire fields
on mapped output and invalid action routing. Run `checks/imports.ts` for actual
source edges and its negative cases; it is fixture-specific verification, not a
consumer lint product. The reference parity check compares complete listing blocks
with actual consumer files. Unit, app integration and browser evidence are separate.

For a change, extend the relevant scenario and its tests, then review callers of
its public entrypoints. A new update scenario gets its own state/action/reducer
and root entry when requested. Move a helper to common only when another scenario
really uses it. For repeat application, inspect existing registrations and edit
in place: preserve neighbouring state, application handlers and the store/provider.
Missing artifacts/provider/handlers yield an explicit incomplete report; a local
reducer test does not certify an integrated application.
