# Functional core feature evaluation

Private synthetic evaluation input, outside distributed plugins. The baseline has
an existing framework-free common composition and global alert effect handler;
the requested staff feature is deliberately absent. `checks/feature.mjs` is an
explicit probe, so root test discovery cannot execute an unprepared consumer.

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
> empty `rows` and no error. `LoadStaffAction` immediately sets `loading`, clears
> the error and describes an effect. Execute the supplied `loadStaff` dependency
> outside reducers, then dispatch result actions through the same composition:
> `ready` with returned rows on success; `error` and the message on failure,
> also using the existing global alert handler. Preserve preferences, audit,
> SetThemeAction and the store boundary. Keep reducers pure and immutable.
> Run the existing checks and report actual dependencies, changed files and
> incomplete work. Do not use a UI framework or access the library source tree.

Read the generated files and run probes yourself. Follow with a requested
feature change and a repeat invocation; compare unrelated file/content hashes
and registrations. In fresh copies remove the artifact or root composition and
check that the agent reports incomplete integration without inventing a store
or silently upgrading dependencies. An agent baseline may pass; report that
honestly, separately from the intentionally failing missing-feature probe.
