# FSD module boundaries

ID: SVELTE-SPA-ARCH-001.

Status: proposed (draft; not approved). Level: required.

## Requirement

Projects selecting this FSD profile MUST assign modules to the ordered layers
`app`, `pages`, `widgets`, `features`, `entities`, `shared`, using only the layers
they need. A slice MUST import another slice only from a lower layer and through
that slice's declared public entrypoint. Importing a peer slice's public API is
not an implicit exception. Imports inside one slice may use its private files.

`app` and `shared` are organized into segments, not business slices; their
segments may depend on one another within their layer. `shared` MUST NOT depend
on a higher layer. `app` composes lower-layer modules and application setup;
cross-slice workflows MUST live in an appropriate higher layer rather than
creating circular peer dependencies. Any deliberate cross-import, including an
entity cross-reference API, requires a recorded exception to this profile.

## Rationale

Naming folders alone does not prevent coupling. Explicit import direction and
entrypoints keep a slice's implementation replaceable and make application
composition visible.

## Applicability

Svelte 5 and TypeScript SPAs explicitly choosing this FSD architecture. This is
not a requirement for every frontend or Svelte application. Layer folders may
be omitted when unnecessary; the profile does not mandate a presenter, store,
API client, routing library, alias spelling or `index.ts` for every helper.

If the project separately applies FRONTEND-ARCH-001/002, follow that contract
for state/presentation/event responsibilities while keeping this profile's
import direction. A shared component may receive ready props and intent
callbacks from its higher-level caller; it does not gain permission to import
feature state or own a competing logical store. FSD selection alone does not
make that FC/presenter contract mandatory or require a presenter per component.

## Verification

Currently verify by manual review of module placement, the project layer map,
relative/aliased import targets and declared public entrypoints. Reject upward
dependencies, private lower-slice imports and peer-slice imports without recorded
exceptions; allow public lower-slice imports and internal same-slice imports.
Review recorded exceptions separately. Engist check does not verify source imports.

A future import-boundary checker may add automatic coverage after it is shipped
and tested with these positive/negative cases. Changing verification to combined
requires a separately reviewed tooling implementation; no such checker is
provided or required by this version.

## References

[FSD layers](https://feature-sliced.design/docs/reference/layers) and
[public API](https://feature-sliced.design/docs/reference/public-api) describe
the architecture. This profile deliberately requires explicit project decisions
for cross-import exceptions instead of enabling them by default.
