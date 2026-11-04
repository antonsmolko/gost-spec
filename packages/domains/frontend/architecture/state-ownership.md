# Explicit UI state ownership

ID: FRONTEND-ARCH-001.

Status: proposed (draft; not approved). Level: required.

## Requirement

In projects applying this FC/presenter contract, logical feature and UI state
MUST belong to root/feature state and change through intent actions and reducers.
This includes open dialogs, selected tabs, draft field values and workflow status.
A component or presenter MUST NOT become another mutable owner of that state.

A reducer is a pure `(state, action) → { state, effects }` function. It MUST use
the current input state to make domain decisions, preserve unrelated state and
return effect descriptions without I/O or calling dispatch. Existing application
effect handlers perform external work and dispatch result actions. This rule
does not define an API client, effect API or a new state manager.

Presenters MUST calculate ready view data from explicit state/context without
mutation, hidden store access, effects or a second mutable store. The
[presentation contract](presenter-composition.md) defines the corresponding
rendering and reactive-binding boundary. A stateless/shared component with ready
props does not need a presenter that has no calculations to perform.

For a logical feature/UI intent, the component boundary MUST send one action
with the necessary stable payload. Business selection between actions and
dispatch chains for one workflow MUST move to FC/application handlers. Shared
UI may forward an intent callback to its parent/adapter; every intermediate
handler does not have to import or dispatch FC actions.

Browser-only plumbing MAY send no action. DOM refs, focus, text selection,
preventDefault and widget setup/cleanup may remain in a component/adapter when
they do not own logical UI-state or hide business decisions. Imperative shell
state binding retains its own implementation; this rule does not prohibit the
reactive mechanism that exposes root state.

## Rationale

One state owner avoids drift between a store, presenter and component. Intent
actions let reducers decide from current state rather than a possibly stale UI
snapshot. Separating browser mechanics prevents that ownership rule from forcing
artificial actions for focus or lifecycle cleanup.

## Applicability

Frontend projects explicitly applying this FC/presenter architecture. Selecting
a UI framework or FSD folder layout alone does not adopt it. No framework,
presenter factory, file naming convention or particular state library is
mandated by this standard.

| Responsibility | Owner | Boundary |
| --- | --- | --- |
| Logical feature/UI state, including drafts and open/selected state | Root/feature state and reducers | Change through intent actions; no competing mutable component/presenter store |
| Presentation calculations | Pure presenters | Explicit validated state/context in, ready view data out |
| Network/storage/navigation workflows | Existing application effect handlers | Reducers describe effects; UI does not execute the workflow |
| DOM focus/text selection, refs and widget lifecycle | Component/adapter | Browser mechanics only; widget callbacks forward intent payloads |
| Reactive state binding | Existing imperative shell | Exposes state changes; does not move domain ownership to UI |

Unknown network/persisted data MUST be checked at the application's trust
boundary before it becomes trusted state. A DOM string can be a valid draft
payload without being a valid domain value. Preserve the application's validation
and handled-error paths; a presenter is not a validator. Documented loading,
empty, error and nullable-data variants are legitimate state. Missing required
inputs or malformed data MUST NOT be hidden by assertions or invented defaults.

## Example: one intent, current-state decision

This small TypeScript example has no external effects. Names and the GOST
`define.state` import illustrate existing application factories, not a required
runtime API. The plain reducer and its `effects: never[]` / `effects: []`
no-effects representation are also illustrative, not the `define.reducer` handler
API or a reusable effect contract. For real integration, use the target project's
compatible reducer, state/action and effect-description contracts; do not copy
this example's no-effects type when adding application effects.

```ts
import { define } from '@gost-kit/common';

export type EditorState = { mode: 'view' | 'edit'; draft: string; saved: string };
export type RootState = { editor: EditorState; preferences: { theme: string } };
export type Action =
  | { type: 'ToggleEditorAction' }
  | { type: 'StartEditingAction' }
  | { type: 'ConfirmAction' }
  | { type: 'SetDraftAction'; value: string };

export const editorState = define.state<EditorState>((options = {}) => ({
  mode: 'view', draft: '', saved: '', ...options,
}));
export const rootState = define.state<RootState>((options = {}) => ({
  editor: editorState(), preferences: { theme: 'dark' }, ...options,
}));

export const reducer = (state: RootState, action: Action): { state: RootState; effects: never[] } => {
  const editor = state.editor;
  switch (action.type) {
    case 'ToggleEditorAction':
      return {
        state: { ...state, editor: editor.mode === 'view'
          ? { ...editor, mode: 'edit', draft: editor.saved }
          : { ...editor, mode: 'view', saved: editor.draft } },
        effects: [],
      };
    case 'StartEditingAction':
      return { state: { ...state, editor: { ...editor, mode: 'edit', draft: editor.saved } }, effects: [] };
    case 'ConfirmAction':
      return { state: { ...state, editor: { ...editor, mode: 'view', saved: editor.draft } }, effects: [] };
    case 'SetDraftAction':
      return { state: { ...state, editor: { ...editor, draft: action.value } }, effects: [] };
  }
};
```

An editor-toggle event sends `ToggleEditorAction`. Its reducer chooses the
transition from current state. The direct start/confirm actions can represent
other explicit user intents; the toggle UI MUST NOT choose between them by
inspecting state. Input forwards `SetDraftAction` with the DOM value as a draft,
without claiming that the string is already a validated domain value.

| Interaction | Valid | Invalid |
| --- | --- | --- |
| Toggle/confirm workflow | One `ToggleEditorAction`; reducer decides from current state | UI tests mode and chooses start vs confirm, even if it dispatches only once |
| Draft input | Forward the input value in one `SetDraftAction` | Copy draft into component mutable state, mutate root state or two-way bind directly into it |
| Browser focus | Focus an existing input ref; zero actions if no logical state changes | Use focus handler to select business actions or mutate feature state |
| Widget lifecycle | Mount/cleanup through an existing adapter, forward callback payloads | Widget/component becomes authoritative for selected domain values |

The [component examples](presenter-composition.md#component-and-browser-examples)
show both forms, including a syntax-valid policy-negative event handler.

## Verification

Review ownership, intent payloads and where decisions/effects execute. Unit-test
reducers with ready-made root/feature state factories and scenario overrides:
pass an input state and action, assert the returned state and effect descriptions.
Give each result-action case its own prepared input. Do not create a store or
execute effects in those reducer unit tests.

Test presentation calculations independently. Check real dispatch, effect/result
flow and reactive component updates separately at the application boundary,
including loading/empty/error/success and logical UI-state changes. A compiler
or a pure test does not establish that the component uses the intended source.
This document provides no automatic source-code checker or application migration.
