# Functional core feature evaluation

Private synthetic evaluation input, outside distributed plugins. The baseline has
an existing framework-free common composition and application API/alert handlers;
the requested staff feature is deliberately absent. `checks/feature.mjs` is an
explicit probe, so root test discovery cannot execute an unprepared consumer.
`src/app/contracts.ts` and `src/app/effector.ts` supply a small synthetic existing
application boundary. They are evaluation inputs, not a proposed gost-kit API.
Feature application may extend root action/state composition but must preserve
the existing effect contracts and `src/app/effector.ts` bytes.

Copy this directory to a disposable directory and install a real
`@gost-kit/common` tarball there, then install TypeScript 5.9.3. Do not install or
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
> Its receiverSuccess returns directory StaffLoadedAction with rows;
> receiverError returns directory StaffFailedAction with ApiError[] unchanged.
> Result actions produce `ready` with rows or `error` with the error array;
> on failure also describe the existing AlertEffect with the error message.
> Reuse the given app effector unchanged; do not introduce feature effects,
> effectors or another API adapter. Put feature FC in state.ts, action.ts,
> reducer.ts and reducer.test.ts within the existing layout. Preserve preferences, audit,
> SetThemeAction and the store boundary. Keep reducers pure and immutable.
> Run the existing checks and report actual dependencies, changed files and
> incomplete work. Do not use a UI framework or access the library source tree.

Read the generated files and run probes yourself. Follow with a requested
feature change and a repeat invocation; compare unrelated file/content hashes
and registrations. In fresh copies remove the artifact or root composition and
check that the agent reports incomplete integration without inventing a store
or silently upgrading dependencies. An agent baseline may pass; report that
honestly, separately from the intentionally failing missing-feature probe.
