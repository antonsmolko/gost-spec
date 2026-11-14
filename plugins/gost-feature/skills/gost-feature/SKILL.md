---
name: gost-feature
description: Use when creating or extending a modular frontend feature with shared common code and independent scenarios such as list, create and update, using gost-kit functional core and presenters.
---

# Develop a modular feature

Organize a feature around independent scenarios and genuinely shared code. Give
each scenario a clear public boundary, its own state/actions/reducer, API
operations and UI. Read [the modular feature recipe](references/modular-feature.md)
before changing composition; it links each rule to a complete tested users example.

## Establish the project boundary

Read project instructions, the requested behavior, existing feature modules and
public entrypoints. Inspect the installed gost-kit artifacts/exports, root
composition, application effects/handlers, store/context and test commands.
The recipe checks common 0.3.0 / shell 0.2.0; verify actual consumer compatibility.
Preserve compatible structure and unrelated features. Apply only the requested
scenario work; a framework or FSD selection does not itself adopt this layout.

If a required artifact, provider, operation contract or shared effect/handler is
missing, identify it before dependent edits and report incomplete integration.
Reuse the connected store and application handlers. Foundation setup, dependency
upgrades and extending the application's effect infrastructure are separate work.

## Build the scenario and its boundaries

- Place scenario-specific code in `app/routing`, `data/api`, `data/dto`,
  `data/mappers`, `domain/entities`, `domain/fc`, `domain/lib` and
  `ui/components` / `ui/pages` as needed. Create no empty placeholder directories.
  Colocate constants, factories and tests with their owner; reuse generated types.
- Move a model/mapper/component into the feature's `common` when a second
  scenario actually uses it. Scenarios use common; common does not import them.
  Keep generic application utilities in the existing shared module.
- Expose scenario entrypoints for the actual consumers. Separate FC/data exports
  from UI exports to keep bootstrap/UI out of FC runtime imports. Scenarios do
  not import each other's internals, state or result actions.
- Define the request operation in `data/api` with its mapper from
  `data/mappers` or common. Operations know DTO/domain types, not actions or
  reducers. The existing generic client executes the operation; mapping precedes
  the result action. Keep validation at the actual external-data boundary.
- Use the public FC API for local state/actions/reducer. Explicitly connect the
  root state key and action namespace; they may differ. Reducers are pure
  state/action → state/effect descriptions and reuse existing application effects.
  The application effector executes them and dispatches callback result actions.
- Reuse public store/context access from UI without importing app bootstrap.
  Components render ready presenter values and send intent actions. Presenters
  use `<name>Presenter`, receive named inputs/context and declare their view-result type. A component
  may call several independent presenters; presenters do not call each other.

For the current fresh-state workflow, creation success describes application
navigation. The list initializes itself and reloads when opened, rather than
being changed by create. Filters/forms start fresh at a new opening. Routing
owns reset policy/timing and exclusions; reset alone neither fetches nor cancels
requests. A folder layout or synthetic navigation adapter cannot certify real
router ordering, flicker prevention, stale-response protection or persistence.

## Verify and report

Use existing root/feature state factories with scenario overrides in colocated
`reducer.test.ts`. Group cases by action/scenario; call the pure reducer, inspect
returned state and effect parameters, and supply result actions directly.
Keep dispatch/request/handler integration checks separate. Test pure presenters
and browser reactivity/events separately too.

Check actual imports, public boundaries and runtime cycles, not only directory
names. Exercise API mapping/errors, preserved neighbours and creation → navigation
→ list initialization. Reapply a change without duplicating slices, exports,
handlers or providers. Compilation alone is not architectural or business proof.
Report dependency versions/source, changed modules, checks and incomplete work.
