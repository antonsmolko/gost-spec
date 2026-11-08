---
name: gost-svelte-shell
description: Use when connecting gost-kit functional core and Svelte shell state foundations to an existing Svelte 5 SPA, or checking an existing connection; not for creating applications or migrating business features.
---

# Connect the state foundation

Connect one application composition of state, reducers, effect handlers and a
reactive store. Keep existing business code working independently of that new
foundation.

## Inspect the connection

Read the project's instructions, dependency metadata/lockfile, bootstrap and
existing state integration. Confirm a Svelte 5 SPA and its actual package manager.
If a compatible fc/shell composition already exists, reuse it and verify it.
For an incompatible or ambiguous connection, explain the specific mismatch before
changing its configuration.

Read [the API recipe and compatibility notes](references/foundation.md) before
writing integration code. Confirm the selected artifacts' names, versions, public
exports and Svelte peer range. Use a verified available release or supplied real
tarballs for both `@gost-kit/common` and `@gost-kit/svelte`; do not assume the
development version exists in a registry. Missing artifacts or unconfirmed
compatibility mean an incomplete result, with the missing input reported. Do not
substitute a home-made store.

## Connect the application

Adapt module names and paths to the existing project. Provide:

- Framework-independent initial state and root action/effect contracts.
- Root reducer and application effector composition using the public common API.
- Store construction through the public Svelte shell API, with root contracts and
  composition in a separate store module for the agreed modular layout.
- Initialization once per application instance and shared access through the
  project's existing compatible convention or typed Svelte context.

For the modular recipe, bootstrap provides once, business components import
`useStore` from the store public entrypoint and receive full state/dispatch. Keep
root contracts out of shared; shared UI uses props/callbacks. Follow the recipe's
import boundaries and record the adaptation when FSD rules apply.

For an empty foundation use empty state and `never` actions/effects, as in the
recipe. Preserve reducers as pure immutable transitions; they describe effects,
while application effect handlers execute side effects. Svelte reactivity stays
at the shell/UI boundary. Keep the store object when reading its reactive state.

Existing authentication, API clients and features retain their business logic.
Modals, alerts and new feature slices join the composition only when separately
required. This connection does not include business migration or its plan.

## Verify and report

Run the consumer's applicable type/Svelte checks, build and existing behavior
checks. Validate the bootstrap and shared access in its client runtime.

An empty store test cannot exercise dispatch. In an isolated disposable copy,
extend the connected composition with a synthetic state/action and an effect
that dispatches a result action. In a browser, verify UI → action → reducer → UI
and completion of that effect's result action through the same store. Use the
recipe's probe guidance. Keep those demonstration features out of the consumer
result. On repeated invocation, verify the existing connection without adding
another store/provider. Report failed checks and partial changes explicitly.

The completion report contains: changed integration files; artifact versions and
source and environment compatibility; preserved existing behavior; client/shared-access checks; synthetic
transition/effect evidence; limitations. Missing evidence stays visible rather
than being inferred from a successful build or skill-format check.

The mandatory foundation is fc/shell plus its composition point. Future shared
gost-kit features require a separately agreed compatibility and upgrade change.
A new skill revision does not itself update previously connected applications.
