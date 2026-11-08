# Existing Svelte SPA evaluation fixture

Private test input for the state-foundation skill; never a published standard or
application starter. It intentionally contains no fc/shell integration. The
greeting is an existing function whose source and behavior must survive skill
application. All data is synthetic.

The [plugin skill](../../plugins/gost-svelte-shell/skills/gost-svelte-shell/SKILL.md)
is shared by Codex and Claude Code; keep this fixture outside the installed plugin.

Baseline: the maintained [Vite Svelte TypeScript template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-svelte-ts)
for `mount`, the Svelte Vite plugin and SPA build; browser checks follow
[Svelte testing guidance](https://svelte.dev/docs/svelte/testing#End-to-end-tests-with-Playwright).
The greeting replaces template artwork/counter code so no application or private
gost-kit example is copied.

Use Node 26. Install the pinned tooling with `npm ci --ignore-scripts` (add
`--offline` when its packages are cached), then run:

```sh
npm run check
npm run build
npm run test:browser
```

Chromium must be installed with `npx playwright install chromium` when absent.
The browser check starts Vite on `127.0.0.1:4187`; run evaluations sequentially.
`reuseExistingServer: false` explicitly rejects an already responding server.
If that address is occupied, the run must fail before executing browser cases;
identify the owner of the existing process instead of reusing it as evidence.
Each external evaluation copy must retain this web-server policy.

For an evaluation, copy this directory to an external temporary directory,
excluding `node_modules`, `dist`, `test-results` and `playwright-report`. Install
dependencies there. Use registry packages `@gost-kit/common@0.3.0` and `@gost-kit/svelte@0.2.0`
for the published baseline (Node 26, Svelte 5.57.2). Record actual installed
metadata and integrity. Supplied tarballs from a recorded revision remain an
alternative with separately verified compatibility. Let the agent perform
the integration in the copy, using this identical request with and without the
skill:

> Connect the gost-kit fc/shell state foundation to this existing Svelte 5 SPA.
> Use the selected real published common and Svelte packages or supplied verified tarballs. Preserve the existing greeting;
> add the application composition point and shared store access, without
> migrating business code or adding business modules. Run applicable checks and
> report changed files, dependency versions and any limitations.

Read the resulting source and diff rather than grading headings or a claimed
success. Confirm ordinary tarball dependencies, preserved `src/legacy` bytes,
one accessible store and composable reducer/effector boundaries. In a separate
copy of the integrated result, extend its composition with a synthetic probe
and verify UI/action/reducer/UI and effect execution in Chromium. Test a second
invocation for duplicate connections and a clean copy with missing artifacts
for an explicit incomplete outcome. Keep generated evaluation results outside
the baseline fixture and outside distributed skills. Record observations in the
OpenSpec design's implementation evidence.

The updated [store/context recipe](../../plugins/gost-svelte-shell/skills/gost-svelte-shell/references/foundation.md)
keeps full root contracts in store and bootstrap/provider in the application.
Its [disposable probe](../../plugins/gost-svelte-shell/skills/gost-svelte-shell/references/foundation.md#disposable-context-probe)
contains code and browser tests for two slices, two consumers, independent roots
and missing provider, plus factory/reset/error/type checks. Copy it only to the
temporary connected evaluation, not to this baseline or the final consumer connection. Preserve all legacy source bytes.
