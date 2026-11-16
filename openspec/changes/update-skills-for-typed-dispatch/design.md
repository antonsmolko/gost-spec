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
FormattedStoreError. Related #46 is closed as not planned; its closure is not
evidence that those exports exist in this release. These examples use neither; retain the existing
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
  and builds passed; original greeting 1/1 and six probe cases passed: the probe run totals
  7/7 Chromium checks because it also includes checks/legacy.pw.ts. Legacy source bytes are unchanged. Factory/reset/exclusions/errors,
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

### Native candidate delivery

Public source `698e40d` on branch `feature/gost-spec-109-dispatch-compatibility`
was pushed before installation. In separate fresh Codex 0.169.0 / Claude Code
2.1.308 profiles, each host registered that public branch, installed all four
plugins, repeated each installation, listed inventory and checked every installed
file against git-show at the source commit. All eight complete maps matched;
Codex fresh app-server discovery returned four unique enabled @gost skills and
zero errors; Claude details showed Skills (1) for each. Both real selected config
refs identify the branch and both clone HEADs identify the exact source commit.
Personal before/after fingerprints match. Every native command exited zero;
there were no retries in this candidate run.

Exact Codex sequence, with a new CODEX_HOME and CLAUDE_CONFIG_DIR already created:

```sh
codex plugin marketplace add https://github.com/antonsmolko/gost-spec.git --ref feature/gost-spec-109-dispatch-compatibility --json
for plugin_name in gost-feature gost-functional-core gost-svelte-shell gost-view-presenter; do
  codex plugin add "$plugin_name@gost" --json
  codex plugin add "$plugin_name@gost" --json
done
codex plugin list --json
```

A fresh codex app-server used initialize with experimentalApi=true, initialized,
and skills/list with the empty cwd/forceReload=true. Actual marketplaces.gost.ref,
clone HEAD and complete installed file maps were verified independently of the
version strings. Generic personal skill metadata was not counted as @gost.

Exact Claude sequence, in a different fresh profile pair:

```sh
claude plugin marketplace add 'https://github.com/antonsmolko/gost-spec.git#feature/gost-spec-109-dispatch-compatibility' --json
for plugin_name in gost-feature gost-functional-core gost-svelte-shell gost-view-presenter; do
  claude plugin install "$plugin_name@gost" --json
  claude plugin install "$plugin_name@gost" --json
done
claude plugin list --json
for plugin_name in gost-feature gost-functional-core gost-svelte-shell gost-view-presenter; do
  claude plugin details "$plugin_name@gost"
done
```

The children used unchanged HOME, empty cwd and temporary HTTP/1.1/low-speed Git
settings, with HERDR and parent Codex session variables removed. Real personal
profiles were not installation targets. This is branch-candidate evidence, not a
released tag or application/model invocation. No new update/rollback/standalone
claim is made; unchanged packaging mechanisms retain their historical evidence.
Digest is SHA256 of UTF-8 json.dumps(relative-path to file SHA256,
sort_keys=True, separators=(',', ':')); all files, not only SKILL.md, are counted.

| Plugin | Version | Files per host | Complete map SHA256 in both hosts |
| --- | --- | --- | --- |
| gost-feature | 0.2.0 | 9 | 1c86ffbdde751bf93dd78217ae98245628bf336313ec4e973ed8d34a97318b5e |
| gost-functional-core | 0.3.0 | 8 | 5a6be27687c539969c47464ab6bcaec47613496a16150ca86f17a231ea5292e2 |
| gost-svelte-shell | 0.4.0 | 8 | 748088a5161602857f2d7890ab7dca09fcd7dd61db7ab2b36fd7ef9c8f0325f5 |
| gost-view-presenter | 0.1.1 | 8 | 88e9becde94292712994188b30e1b445fc7e418edbcfaa50a6dc46928fcee2ac |

### Independent review dispositions

Private review input, not a public basis; public actionable basis is [#109](https://github.com/antonsmolko/gost-spec/issues/109) and [gost-kit #46](https://github.com/antonsmolko/gost-kit/issues/46).

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| #109 (private review input, not a public basis) | Link labels name the old package pair although URLs target the new pair | modular-feature recipe | Fixed | Both labels now say common 0.4.0 / svelte 0.3.0; included in native-verified 698e40d |
| gost-kit #46 / #109 (private review input, not a public basis) | Proposal implied closed formatter task was implemented | proposal/design | Fixed | Proposal references implemented #44/PR #45; design records #46 as closed not planned and confirms no formatter exports in inspected artifact |

### Final verification

Author full root check passed 121/121; strict all passed 16/16. Tracked Markdown
links/anchors passed 176 files /303 local links /33 fragments /0 errors, with
clean git diff --check. Complete source/doc/metadata/delta diff against report
base 4d659b3 was inspected. Repeated listing parity verifies the generated full
example equals the reviewed fixture; unchanged specs, #109/#44/#46 bodies and
release/checkpoint wording were searched separately for contract conflicts.
Packages/catalogs/presenter and old release payloads remain unchanged.

Independent complete-result review PASS, with both dispositions above verified
closed. Private review input is supplementary, not a public basis. The reviewer
independently ran the external feature type/Svelte check (zero diagnostics),
13 integration/import-boundary/listing tests and a stronger invalid-path probe
checking original path, missing action, TypeError and unchanged state. All eight
native installed maps were recomputed against source and personal fingerprints
checked. Actual artifact runtime/declarations, generic distinctions, RED logs,
FC evaluation, shell/browser and root/strict results were inspected. The final
ledger/native additions were re-read; no open actionable findings remained at
that pre-public-review checkpoint. Native source 698e40d is historical evidence
for that payload. Implementation is now in open stacked PR #111, based on report
PR #110; merge and any new release remain unperformed. Published review fixes
and renewed evidence follow below.

### GitHub issue edits

#109's body gains the implementation/native/review checkpoint and immutable
current ledger link, plus explicit gost-kit-qualified #44/#45/#46 links.
Its formatter criterion records a checked absence, not a required implementation
or release claim. The original compatibility outcome and release approval gate
are unchanged. #106 remains open for its report-delivery follow-up; no completed
issue is reopened and no criteria are transferred between the two PRs.

## PR 111 published review response

Read all seven inline threads (one complete page, no next cursor), seven submitted
reviews and the [summary](https://github.com/antonsmolko/gost-spec/pull/111#issuecomment-6927289560)
on f27164a, plus all PR #110 sources and current #106/#109 bodies/comment lists.
Prior verified closures remain closed; the previous PASS is a named pre-public-review
checkpoint, not a disposition of these later published findings.

The standalone factory infers a broad dispatch object; a positive callback that
is not already constrained by a typed RootEffect must also satisfy
DispatchAction<RootAction>. This checks the path/payload against declared actions
without a separate registry. The check now returns directory/LoadedAction.
The old root/ReceivedAction is well-formed syntax but absent from the composed
union. A direct runtime replay on common 0.4.0 returned no error and unchanged
state for that unknown namespace; it did not produce kind dispatch. That error
kind belongs to malformed paths. The invalid positive example is fixed regardless
of this narrower correction to the review's runtime explanation.

| Source | Finding | Affected files/issues | Disposition | Evidence |
| --- | --- | --- | --- | --- |
| <a id="pr111-r1"></a>[R1](https://github.com/antonsmolko/gost-spec/pull/111#discussion_r4590657183) | Base PR #110 update instructions remain unresolved in the stack | release guide, both ledgers | Fixed in base, incorporated here | PR #110 commit 63d3271 fixes its R1/R2; merge d8f1246 includes those changes; [base dispositions](../prepare-feature-plugin-release/design.md#pr-110-published-review-response) |
| <a id="pr111-r2"></a>[R2](https://github.com/antonsmolko/gost-spec/pull/111#discussion_r4590657605) | Base private-approval attribution missing in handoff/readiness | handoff/readiness, ledgers | Fixed in base, incorporated here | Base R3 labels private input and links public scope/evidence; merge preserves the current-work wording |
| <a id="pr111-r3"></a>[R3](https://github.com/antonsmolko/gost-spec/pull/111#discussion_r4590658020) | Positive callback uses an undeclared action path | contracts.types.ts, complete listing | Fixed; runtime explanation corrected | Adding satisfies first reproduced RED TS2322; directory/LoadedAction passes; broad factory inference no longer hides this mismatch |
| <a id="pr111-r4"></a>[R4](https://github.com/antonsmolko/gost-spec/pull/111#discussion_r4590661789) | Probe-only and full shell-run counts are conflated | evidence, PR/issue checkpoint | Clarified | Six foundation.pw.ts cases plus legacy.pw.ts = seven tests in the probe run; the earlier empty-connection legacy run is a separate run, not an eighth distinct case |
| <a id="pr111-r5"></a>[R5](https://github.com/antonsmolko/gost-spec/pull/111#discussion_r4590662234) | Handoff/ledger retain pre-PR wording | handoff, design | Fixed | Both identify open PR #111 stacked on #110 and retarget/CI sequence; no merge/publication implied |
| <a id="pr111-r6"></a>[R6](https://github.com/antonsmolko/gost-spec/pull/111#discussion_r4590662610) | Migrated call-site quote style differs from guidance | fixtures, complete listing, shell recipe | Fixed | Dispatch paths consistently use single quotes; source/listing parity and Svelte checks rerun |
| <a id="pr111-r7"></a>[R7](https://github.com/antonsmolko/gost-spec/pull/111#discussion_r4590663005) | Impact omits consumer release documentation | proposal | Fixed | Root README and consumer release guide explicitly included |

The bodyless submitted reviews are covered by their corresponding inline entries;
the summary is covered by all seven entries. #109's live checkpoint/PR description
will use the clarified counts and latest immutable ledger/source, preserving
criteria and independent release approval. #106 links its own base response;
its closure still waits for approved report delivery. No issue is closed here.

### Review-round verification and renewed native source

External source/listing checks passed on npm common 0.4.0 / shell 0.3.0:
Svelte/tsc zero diagnostics, feature 19 unit /13 integration /4 browser and build;
shell type/build and exactly six foundation + one legacy browser cases (7 total).
The satisfies regression was first RED on the old root/ReceivedAction, then GREEN
on directory/LoadedAction. Autofixer reported no issues/suggestions for all three
changed feature components and the extracted shell consumer. Root 121/121, strict
16/16 and Markdown 176/306/36/0 passed; base PR #110 separately has root121/121,
strict15/15 and Markdown170/303/35/0. Whitespace checks are clean.

Because quotes and the complete listing changed installed content, earlier
698e40d native evidence was not reused as evidence for the new bytes. Fresh
isolated Codex 0.169.0 / Claude 2.1.308 profiles selected the public branch at
**b09bfab4bce1685d762c1f18f199a289a922e2a9**, using the exact per-host commands
and environment procedure above. All install/repeat/list/details commands
exited zero without retries. Actual selectors/clone HEADs and all eight complete
installed maps matched that source; fresh Codex discovery found four enabled
unique GOST skills, zero errors; Claude showed Skills (1) per plugin. Personal
protected fingerprints matched before/after. No model/app invocation or tags.
The same sorted relative-path/file-hash JSON digest formula applies:

| Plugin | Version | Files per host | Complete map SHA256 in both hosts |
| --- | --- | --- | --- |
| gost-feature | 0.2.0 | 9 | 4c7df3f93d6ec561b24c4537042099583eef18f86e28e4934f556f4a11697b6b |
| gost-functional-core | 0.3.0 | 8 | 5a6be27687c539969c47464ab6bcaec47613496a16150ca86f17a231ea5292e2 |
| gost-svelte-shell | 0.4.0 | 8 | 741c5fc51cbea9a619a05151a71ff5bdc5fb347ffe3f8175a44b428a4f2f9db4 |
| gost-view-presenter | 0.1.1 | 8 | 88e9becde94292712994188b30e1b445fc7e418edbcfaa50a6dc46928fcee2ac |

Independent whole-result review PASS: all published sources/complete diffs of
PR #110/#111, relevant unchanged specs/gates/dependencies and live issue bodies
were inspected separately from runtime tests. Private review input, not a public
basis; public actionable basis is the ten inline sources and two summaries linked
above. Reviewer independently reran root121, strict16 and external type/Svelte
checks/integration13, checked the other logs and RED, then recomputed all eight
installed maps (66 files), source selectors/HEADs, discovery/details and personal
fingerprints. All ten dispositions are verified; old closures remain closed.
Only ledger/checkpoint text changes after b09bfab; refreshed payloads remain
identical. Thread/summary replies link these immutable ledger entries; current
PR/issue links are updated after this receipt commit, with no criteria expansion
or issue closure. Both PRs remain unmerged and no new release is authorized.
