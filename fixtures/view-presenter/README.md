# View presenter example

A synthetic Svelte 5 catalog demonstrates extracting display calculations.
`src/BeforeCatalog.svelte` is the original; `src/catalog.presenter.ts` and its
colocated `catalog.presenter.test.ts` show a pure presenter and its tests;
`src/Catalog.svelte` renders ready results. `src/ReadyLabel.svelte` already has
ready props. `src/App.svelte` only drives test inputs and counts callbacks.
No private application data is used; this fixture stays outside installed plugins.

Baseline: [Vite Svelte TypeScript template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-svelte-ts),
[Svelte testing guidance](https://svelte.dev/docs/svelte/testing). The
[skill reference](../../plugins/gost-view-presenter/skills/gost-view-presenter/references/view-presenter.md)
contains the same six complete source blocks.

Use Node 26. In an external copy of this directory run:

```sh
npm ci --ignore-scripts
npm run test:unit
npm run check
npm run build
npm run test:browser
```

Install Chromium with `npx playwright install chromium` if needed. Browser
checks start a fresh Vite server at 127.0.0.1:4191 with strictPort and
reuseExistingServer:false; an occupied address must fail, never reuse stale code.
Both `/` and `/?before` cover idle/loading/empty/ready/changed rows/error,
nullable title/error fallbacks and Refresh/Activate callbacks. Labels are
explicit fixture input policy. Input controls are a harness, not an instruction
to move application state or event workflows.

## Evaluate the skill

Use isolated copies, excluding node_modules/dist/test-results/playwright-report.
To prepare the initial task, overwrite Catalog.svelte with the contents of BeforeCatalog.svelte and
remove catalog.presenter.ts. Preserve the supplied pure/browser acceptance probes
and input contract. Give the same request with and without the installed skill:

> Extract Catalog.svelte presentation calculations into a pure
> TypeScript presenter with named parameters and an explicit ViewState, add ordinary input/output tests, and use ready fields,
> booleans and rows in the component. Preserve existing display behaviour,
> input contract, callbacks, dependencies and ReadyLabel. Run checks and report
> concrete limitations. The supplied tests are acceptance probes; preserve them.

Inspect actual generated files, not a claimed success or matching headings.
Then request a changed supplied label, repeat the task, inspect the already-ready
component, and check missing required context/source cases. Keep evaluation
outputs in disposable directories. Unit results, client behaviour, manual
negative classifications and native plugin discovery are separate evidence.
