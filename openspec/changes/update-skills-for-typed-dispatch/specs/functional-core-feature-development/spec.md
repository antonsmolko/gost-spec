## ADDED Requirements

### Requirement: Typed dispatch and reducer payload guidance
The skill SHALL distinguish external dispatch inputs from internal reducer inputs for the selected published API. Ordinary application calls SHALL prefer namespace/action paths with a separate payload. API callbacks SHALL return DispatchAction-compatible objects; reducers SHALL read action.payload. Namespace/action/payload relationships SHALL derive from public action contracts rather than a manual registry.

#### Scenario: Dispatch a typed intent and API result
- **WHEN** a business operation uses the published common 0.4 dispatch contract
- **THEN** ordinary calls use dispatch(path, payload), API callbacks return { action: path, payload }, and the existing application effector dispatches their results
- **AND** reducers read action.payload and remain pure state/action to state/effects transitions

#### Scenario: Preserve payload and namespace constraints
- **WHEN** examples are checked against the public declarations
- **THEN** required payload omission, wrong payload types and invalid namespace/action pairs fail type checks in both call forms
- **AND** root paths are explicit, no-data and all-optional object payloads may be omitted, and primitive/array payload types remain intact

#### Scenario: Report an invalid runtime path
- **WHEN** untyped external input contains an invalid path
- **THEN** the existing onError receives the original path under kind dispatch without a normalized action
- **AND** state/effect execution is not claimed successful merely because the returned dispatch promise resolves
