# Modular feature example

Synthetic Svelte 5 application with users/list and users/create, outside published
packages and plugins. Copy this directory to a disposable directory before
installing dependencies or running checks; do not use a gost-kit workspace source.
All user data and the injected demo transport are synthetic.

Use Node 26.11.1 (packages require ^26.0.0), common 0.3.0, shell 0.2.0 and
Svelte 5.57.2, pinned by this fixture's lockfile. Inspect actual installed metadata,
public exports and registry integrity when evaluating another artifact.

Copy the installed gost-feature references/users-example.md into the disposable
consumer as users-example.md (or set GOST_FEATURE_EXAMPLE to that verified file).
The reference parity test deliberately fails when this input is absent.

```sh
npm ci --ignore-scripts
npm run check
npm run test:unit
npm run test:integration
npm run build
npm run test:browser
```

Install Chromium with `npx playwright install chromium` if absent. Playwright
starts its own Vite server on 127.0.0.1:4195 with reuseExistingServer:false and
strictPort. An occupied server is a failure, not acceptable browser evidence.
Do not reuse another evaluation's server. npm run dev starts the synthetic demo.

The complete feature source is in src/features/users. Data operations use one
shared generated-schema equivalent and a genuinely shared mapper. Each scenario
has its own state/actions/reducer and colocated tests built with state factories.
Store/context and common API/navigation handlers live outside the scenarios.
Navigation is a controlled synthetic app adapter, not a library router recipe.
Creation success returns NavigateEffect; the app opens the list and invokes its
public initialization action. List entry resets its query; a refresh LoadAction
preserves it. Entering create resets its draft. No persistence is implemented.

Pure reducer and presenter unit tests run separately from app API/dispatch tests.
Integration uses the real published API client/effector and injected fetch;
checks/imports.ts audits concrete source edges plus negative boundary/cycle cases.
checks/contracts.ts is compiled with negative operation/mapped-result/action types.
Browser tests check reactive display, intents, validation, creation/new loading,
HTTP error and missing provider. Expected missing-provider diagnostics belong only
to that negative case. These tests do not certify real router/reset timing,
flicker prevention, stale-response protection or cancellation.

Infrastructure follows the maintained
[Vite Svelte TypeScript template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-svelte-ts)
and [Svelte Playwright guidance](https://svelte.dev/docs/svelte/testing#End-to-end-tests-with-Playwright).
No new installer, test runner or router is introduced.

The [complete installed source listing](../../plugins/gost-feature/skills/gost-feature/references/users-example.md)
is verified against every source module; fixtures are not part of the plugin.
