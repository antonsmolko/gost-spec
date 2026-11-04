# Derived state

ID: SVELTE-STATE-001.

Status: proposed (draft; not approved). Level: required.

## Requirement

Use derived state for computations from reactive inputs; effects synchronize with external systems rather than duplicate derived values.

This technology rule does not choose application state ownership. When the
project also adopts FRONTEND-ARCH-001/002, follow that contract for where
presentation calculations live: component bindings select state or call pure
presenters, and logical state changes go through FC. The recommendation to use
derived values does not authorize inline component presentation logic or a
competing mutable UI-store under that contract.

## Rationale

Duplicated state can drift and cause feedback loops.

## Applicability

Svelte 5 reactive components and modules.

Without the separately adopted FC/presenter contract, this rule alone does not
require a presenter or FC library. With it, read-only `$derived` selection and
presenter invocation remain valid; a blanket ban on `$derived` would contradict
the intended binding. Svelte can support reassignment of non-const derived
values; that capability does not override the adopting project's ownership rule.
Existing shell state binding and DOM-ref plumbing retain their own implementation.

## Verification

Review reactive dependencies and test input changes.

| Combination | Example | Verdict |
| --- | --- | --- |
| This Svelte rule alone | Derived computations from local reactive inputs | Allowed by this rule; no frontend architecture is selected implicitly |
| Svelte plus FC/presenter contract | `$derived(root.state.user)` followed by `$derived(presentUser(user))` | Valid read-only binding using the existing state source |
| Svelte plus FC/presenter contract | Inline status comparison in component `$derived`, then a ready-looking variable name | Presentation calculation belongs in a presenter; syntax/compiler success does not approve it |
| Svelte plus FC/presenter contract | Direct write to root/feature state or a derived override used as logical UI-state | Does not satisfy the separately adopted ownership contract |

Pure-function tests do not verify reactive component updates. Check those
separately, and distinguish framework syntax checks from architecture review.

## References

[Svelte $derived](https://svelte.dev/docs/svelte/$derived) describes the rune's
dependencies, side-effect constraints and override capability. Project
architecture may deliberately restrict how that capability is used.
