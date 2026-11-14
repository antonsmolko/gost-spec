# Modular features and scenarios

ID: FRONTEND-ARCH-003.

Status: proposed (draft; not approved). Level: required.

## Applicability

Frontend projects explicitly selecting this modular feature architecture. A
framework, language or FSD selection alone does not adopt it. The concrete FC,
Svelte context and API examples illustrate an already selected implementation;
the module boundaries apply to other compatible frontend implementations too.

## Requirement

A feature MUST group independently changing scenarios and genuinely shared code.
For example, `users/list`, `users/create` and `users/update` own their workflows;
`users/common` contains code used by more than one of them. Create only the
modules needed for the requested behavior. Move code into common when a real
second consumer exists, rather than predicting future reuse.

Each scenario MAY use the following locations according to its needs:

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

The expanded update subtree applies equally to list/create; it does not require
empty directories or make update depend on them. Constants, test factories and
tests belong beside their owner. Reuse generated API types instead of copying
them. Application-wide generic utilities remain in the project's shared module.

Scenarios MUST expose public entrypoints and MUST NOT import another scenario's
private modules, state or result actions. Common MUST NOT depend on a scenario.
Use entrypoints appropriate to the consumer: an FC entrypoint must not re-export
UI and thereby import application bootstrap at runtime.

| Module | Responsibility and allowed direction |
| --- | --- |
| domain/entities | Domain types; no API/FC dependency |
| data/mappers | DTO and domain/entities; pure transformation |
| data/api | Operation description and mapper; no feature actions/reducers |
| domain/fc | State/actions/pure transitions and descriptions of existing app effects; may use data/api |
| ui/components | Ready display values, presenters and intent events via existing store access |
| ui/pages | Scenario page composition |
| app/routing | Integration of this scenario with application navigation and initialization |

Check the graph of concrete imports, not just directory names. The chain
`domain/fc → data/api → data/mappers → domain/entities` is valid without a
reverse entity dependency. Document type-only root-contract relationships
separately from runtime imports; bootstrap must not enter feature runtime code.

## API and state

A request's operation description owns its DTO-to-domain mapper, implemented in
scenario data/mappers or common/data/mappers when actually shared. The API client
is generic; it does not know feature domain models. The operation definition is
data and pure functions, not a request execution. With the selected FC approach,
a reducer returns an existing application API effect; the application handler
executes the request and mapper before dispatching a domain result action.
Keep external-data validation and error normalization at their defined boundary.

Each FC scenario owns state/actions/reducer and colocated reducer tests. Its root
state key and action namespace are explicit and need not have the same name.
Use ready-made root/feature state factories with overrides in reducer unit tests.
Check pure state/action → state/effect descriptions independently of dispatch,
network execution and application integration. Preserve unrelated slices.

UI uses the existing public store/context accessor; it does not import app
bootstrap or create another store. Logical state and presentation follow the
separately applicable [state ownership](state-ownership.md) and
[presenter](presenter-composition.md) contracts. Several presenters can be called
independently by a component; a presenter does not call another presenter.

## Scenario interaction

In the current non-persisted example, creation success describes navigation to
the list through an existing application effect. The list initializes and loads
fresh data when opened. Creation does not dispatch the list's internal actions or
change its state directly. A navigation intent is not evidence of completed
navigation, reset timing, cancellation or protection against stale responses.

The shell's general reset accepts exclusions from its caller. Routing owns the
policy and timing; the shell does not know routes, loading or skeletons. Filters,
pagination and forms are not persisted by default. Storage/versioned persistence
and flicker-free navigation need their own implementation and verification.

## Verification

Review imports and the complete scenario behavior. Verify mapper success/error
boundaries, factory-built reducer cases, presenter outputs and browser reactivity
separately. A compiler cannot certify boundaries or visible navigation ordering.
A whole feature example must link each rule to actual tested code; a folder tree
alone is insufficient. Preserve existing modules during changes and repeat work
without duplicate slices, effect handlers or providers.
