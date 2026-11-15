# Published typed dispatch migration

Issue: [#109](https://github.com/antonsmolko/gost-spec/issues/109). Existing F1
release/report #106/PR #110 is a separate completed-publication outcome; this
branch starts from its report to retain truthful readiness status. PRs remain
independently reviewable; no report merge or new release approval is inferred.

## Contract and implementation

Use the real npm artifacts common@0.4.0 / svelte@0.3.0, not workspace imports.
Common integrity is sha512-ZMvHOXq5Hp/qUb/ldmjVQNwUxKnBY3dz7h3ub+4VCDYp1PLOJNqYYxm3Nb1+7xBa/loDIFK8BxsyQ3gWx7Ti1w==;
shell integrity is sha512-0FUmNbZ7mQwd8n/XorMRztgByCi82Z+UeXUmN39iiipPyc2NYfIR17WS2q7sFdgvlFzNprqbwVfOnTufEdpYnw==.
Both require Node ^26.0.0; shell depends on common ^0.4.0 and peers Svelte ^5.57.2.
Baseline: published declaration/runtime files and maintained implementation
[gost-kit PR #45](https://github.com/antonsmolko/gost-kit/pull/45),
[#46](https://github.com/antonsmolko/gost-kit/issues/46).

Local actions declare type plus optional/required payload; ScopedActions derives
the namespace union. Prefer dispatch('namespace/Action', payload) in UI/handlers.
Root actions use root/Action. API callbacks return { action: path, payload } and
the existing application ApiEffector dispatches them. Reducers receive internal
scope/type/payload and read action.payload. Effects retain their existing fields.
No hand-maintained action-path registry or feature effector is introduced.

Required payload cannot be omitted; no-payload and all-optional object payloads
may omit the argument. Test primitive/array/object payloads, both call forms and
negative namespace/action/payload pairs through public types. Invalid runtime
paths report through existing onError; awaited effects/nested dispatch still
complete before the caller resumes. Keep reset/factory/context contracts intact.
The inspected common 0.4.0 artifact does not export formatStoreError or
FormattedStoreError. Although #46 is closed, it is not evidence that those
exports exist in this release. These examples use neither; retain the existing
application reporter and do not invent an import or claim the formatter is
published. The new kind dispatch branch is handled by its actual path contract.
Missing/incompatible artifacts fail compatibility readiness rather than silently
substituting sources or changing the environment. New API availability does not
establish plugin release availability.

## Verification and versions

Capture RED with old examples against the new registry packages before edits.
Use external copies: FC API probe and recipe compile, connected shell recipe and
Chromium, full feature unit/integration/browser and complete listing parity.
Reducer tests use state factories and directly check state/effect descriptions;
API callbacks are descriptions, runtime request/dispatch belongs in integration.
Run full root check, strict specs, Markdown/anchor audit and complete diff/conflict
scan, then independent review under AGENTS.md rule 6.

Affected pre-1.0 feature content bumps FC 0.3.0, shell 0.4.0, feature 0.2.0 as
unreleased candidates. Presenter 0.1.1 and five normative npm versions stay intact.
Existing tags are not moved; a future release requires its own owner approval.
No model-turn evaluation or native installation is claimed without actual runs.

## Implementation evidence

### RED and published artifacts

Before changing fixture runtime code, external copies installed registry common
0.4.0 (274 packed entries, 95,392 unpacked bytes) and shell 0.3.0 (8 entries).
The old FC API checks failed with six TypeScript diagnostics: callbacks lack the
required action field; the old explicit factory success generic also has the
wrong shape. The full old feature check likewise failed on callback/dispatch
inputs. These are API incompatibility failures, not missing-package failures.
Both npm tarball integrities match those recorded above. Common tarball SHA256
is 09363b78eb1ed25c4632d78a76a23d68bd3e0c94c2695e580e20ae2393198c1b;
its published gitHead is fb85fd855fc6994e2eba5e8b726b780a227d1858.
The declaration/runtime files, not a broad README sentence still describing
old callback routing, establish the actual callback shape used in the tests.

### External consumers and skill evaluation

All consumers use Node 26.11.1 / TypeScript 5.9.3 / @types/node 26.6.5 and public
package roots. Svelte consumers retain Svelte 5.57.2 / Vite 8.3.5 / plugin-svelte
7.3.1 / Playwright 1.64.1 / svelte-check 4.7.7. No library source import or
replacement transport/dispatcher is used.

- FC recipe: reconstructed all source modules, including its now explicit
  factory prerequisite and intent calls. Typecheck/build and 13 direct reducer
  unit cases passed. Inputs use root/feature factories; callbacks are asserted as
  dispatch descriptions, not executed by reducer unit tests.
- FC application evaluation: a separate agent first reproduced old callback
  guidance TS2322 against installed 0.4 types. It then used the new guidance to
  add staff state/action/reducer/reducer.test and three composition changes in a
  disposable copy. Typecheck, actual feature dispatch/API probe, API 12/12 and
  reducer 4/4 passed; repeat checks left all source hashes identical and exactly
  one directory registration. Existing API/effector/probes were byte-identical.
  One implementation retry exposed a generic ownership issue; the recipe now
  explains local handler unions and namespace-only test composition narrowing.
  The old skill already required checking installed types; no claim that an agent
  must blindly follow an incompatible baseline is made.
- Shell recipe: reconstructed the empty connection in an external existing SPA,
  then replaced it with the disposable two-root probe. Both type/Svelte checks
  and builds passed; original greeting 1/1 and full probe 7/7 Chromium checks
  passed. Legacy source bytes are unchanged. Factory/reset/exclusions/errors,
  nested path dispatch, shared context, root isolation and missing-provider case
  are exercised; the expected context failure belongs only to its negative case.
- Feature fixture: actual registry lockfile updated to common 0.4/shell 0.3.
  Type/Svelte checks, 19 unit /13 integration /4 browser cases and build passed.
  The complete published listing matches every checked source/config block,
  including new compile-only dispatch cases. Payload omission, primitive/array
  types, root path, both call forms and mismatched paths/data are checked against
  real declarations. Integration separately checks normalized payload delivery,
  invalid runtime path reporting without state change, API results and awaited
  create → app navigation → list request flow. This remains synthetic navigation.

Source fixture directories were not installed/built in place. One recipe
extraction attempt initially lacked the existing app/state prerequisite;
explicitly documenting that factory made the full listing checkable, and the
complete recipe was re-extracted and verified. Svelte autofixer returned no
issues/suggestions for changed components and extracted probe components; one
CLI call printed a clean result but then timed out externally, so its fresh
successful retry is the completion evidence. No model turn in asc-admin, real
router/flicker guarantee, persistence, or formatter availability is inferred.

### Scope, audit and review ledger

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| [#109](https://github.com/antonsmolko/gost-spec/issues/109), [gost-kit PR #45](https://github.com/antonsmolko/gost-kit/pull/45) | Existing consumers use old callback/dispatch/data shapes | FC/shell/feature recipes, fixtures and delta specs | Fixed | RED on actual npm artifacts; migrated code and external type/unit/integration/browser checks above |
| [#109](https://github.com/antonsmolko/gost-spec/issues/109) (private evaluation input, not a public basis) | Full root action union over-requires handlers in a namespace-only composition | FC recipe | Fixed | Owned handler union guidance plus Extract in unit composition; final recipe typecheck/build/13 unit cases pass |
| [gost-kit #46](https://github.com/antonsmolko/gost-kit/issues/46) | Closed task is insufficient proof of published formatter exports | Compatibility notes, #109 | Verified artifact limitation | Public-root declarations of common 0.4.0 contain neither formatter export; examples retain their application reporter |

The entire result changes one compatibility outcome. Candidate minors are FC
0.3.0 / shell 0.4.0 / feature 0.2.0; presenter, catalogs, five normative packages,
old tags and application routing/persistence scope are retained. The #106 report
is independently reviewable in PR #110; #109 does not authorize its merge.
Live #109 checkpoint is updated without reopening #88/#96/#97 or changing their
acceptance criteria. Complete-result independent review is required before the
implementation is presented as ready; native candidate verification, if performed,
is recorded separately from registry consumer behavior and release availability.
