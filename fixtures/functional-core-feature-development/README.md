# Functional core feature evaluation

Private synthetic evaluation input, outside distributed plugins. The baseline has
an existing framework-free common composition and application API/alert handlers;
the requested staff feature is deliberately absent. `checks/feature.mjs` is an
explicit probe, so root test discovery cannot execute an unprepared consumer.
`src/app/contracts.ts` and `src/app/effector.ts` supply a small synthetic existing
application boundary using the published `ApiEffect<Paths, AppAction>`,
`createApiClient` and `createApiHandler`; there is no replacement effect type/handler.
Feature application may extend root action/state composition but must preserve
the existing effect contracts and `src/app/effector.ts` bytes.
`src/app/state.ts` supplies the existing root-state factory. Reducer unit tests
use root/feature state factories with scenario overrides; they call the reducer
with an action and assert returned state/effect descriptions. Keep dispatch and
effect execution in the separate `checks/feature.mjs` integration probe.

Copy this directory to a disposable directory and install a real
`@gost-kit/common@0.2.1` registry package (or a separately verified tarball)
there, then install TypeScript 5.9.3. Record Node/engines compatibility; the
published baseline requires Node ^26.0.0. Do not install or
build in the source fixture. Record artifact revision/version/hash and inspect
its packed public exports. Run `npm run check` and `npm run probe`. Before the
feature exists the probe must fail with “requested staff feature is missing”.

Use the same request without a skill, then in a fresh copy with
`gost-functional-core` and its reference available:

> Add a staff directory feature to this existing TypeScript application using
> the installed public common API. The root state property must be `staff`, while
> actions route through scope `directory`. Initially staff has status `idle`,
> empty `rows` and empty `errors`. `LoadStaffAction` immediately sets `loading`,
> clears errors and describes the existing application ApiEffect for /staff.
> Use method get and defaultError STAFF_LOAD_FAILED / Could not load staff / [].
> Its onSuccess returns directory StaffLoadedAction with rows;
> onError returns directory StaffFailedAction with ApiError[] unchanged.
> Result actions produce `ready` with rows or `error` with the error array;
> on failure also describe the existing AlertEffect with the error message.
> Reuse the given app effector unchanged; do not introduce feature effects,
> effectors or another API adapter. Put feature FC in state.ts, action.ts,
> reducer.ts and reducer.test.ts within the existing layout.
> In reducer.test.ts use ready-made root/feature state factories with overrides,
> group cases by action/scenario and assert returned state/effect descriptions.
> Test result actions directly with independent inputs; keep application dispatch
> and effect execution out of feature reducer tests.
> Preserve preferences, audit, SetThemeAction and the store boundary.
> Keep reducers pure and immutable.
> Run the existing checks and report actual dependencies, changed files and
> incomplete work. Do not use a UI framework or access the library source tree.

Read the generated files and run probes yourself. Follow with a requested
feature change and a repeat invocation; compare unrelated file/content hashes
and registrations. In fresh copies remove the artifact or root composition and
check that the agent reports incomplete integration without inventing a store
or silently upgrading dependencies. An agent baseline may pass; report that
honestly, separately from the intentionally failing missing-feature probe.

The integration probe injects only fetch. Real common code handles requests,
backend errors and defaultError fallback; reducer unit tests execute none of it.
Callbacks are onSuccess(data) and onError(errors, failure). mapErrors validates
the synthetic backend error envelope at the application boundary. Network,
contract (non-JSON success), aborted and empty backend-error failures use
[defaultError]; this does not recover the raw
transport exception message. No external HTTP request is sent by the probes.
