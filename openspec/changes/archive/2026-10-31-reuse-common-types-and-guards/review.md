# Review and evidence

## Historical review — 2026-10-22

The findings and checks below describe the earlier local draft. Reviewer-confirmed
closures about gost-kit file moves are retained. The broader consumer rule and
Local-only replacement are reassessed in the new round below; the earlier final
verdict does not approve subsequently revised wording.

Source | Finding | Affected files/issues | Disposition | Evidence
--- | --- | --- | --- | ---
Owner request in working conversation (private input, not a public basis); current actionable scope is [#52](https://github.com/antonsmolko/gost-spec/issues/52) | Reuse common types/guard, combine mixed imports and separate public types | TS-COMMON-001 and gost-kit authored code; no issue edited at that time | Implemented locally | Self-contained proposed standard and examples; runtime library remains in separate [gost-kit](https://github.com/antonsmolko/gost-kit), not private consumer material
Independent reviewer, first pass (private input, not a public basis); current scope clarification [#52](https://github.com/antonsmolko/gost-spec/issues/52) | Domain exports still shared one source file while local instructions require separate files | gost-kit example src/types.ts and RootStore | Fixed in the historical gost-kit review; closure retained | Domain exports moved to individual types/*.ts files; RootStore moved to types/root-store.ts; all imports updated. Historical extension of this convention to every public consumer type is narrowed in R2 below; this does not reopen the file moves
Independent reviewer, final pass (private input, not a public basis); public gate [content approval](../../../../docs/architecture/content-approval.md) | No substantive findings remained in that pass | Historical changes in both repositories | Historical review retained | Type equivalence and imports checked; relative TypeScript imports resolve; 46 relative documentation links checked; content/release gates preserved; reviewer did not rerun full runtime suites
Local workflow audit | Branch lacks issue number | feature/gost-spec-common-utilities | Integration limitation recorded | No public messages, issue creation, issue edits, PR, commit, merge or publication performed; associate an issue-scoped branch before integration

## Verification

- gost-kit: common build/typecheck and 10 guard tests; example check with 30 tests
  and production build. Svelte autofixer for module.svelte.ts returned no issues.
- A real common tarball installed offline into an isolated external fixture;
  the standard's example compiled, an invalid type was rejected, and runtime
  package imports/guard behavior passed without workspace links.
- gost-spec: full npm run check includes typecheck, workspace metadata checks,
  real packed documents and external consumer installation; all 48 tests passed
  on Node 26.0.0 and 26.11.1.
- Relative links and active contradictory wording reviewed separately from tests.
- Exact normative text remains proposed/pending; no version/content/release gate changed.

## GitHub issue edits

None. PR #50 and issue #49 were read to verify the starting snapshot; neither
was changed. This independent request is not added to the closed #49 carrier.

## Review round — 2026-10-31

The owner supplied six findings in chat and authorized verification and fixes.
That summary is **private input, not a public basis**. No separate detailed review
file or public review thread for this round was supplied. Public actionable scope:
[#52](https://github.com/antonsmolko/gost-spec/issues/52) (standard) and
[#53](https://github.com/antonsmolko/gost-spec/issues/53) (repository hygiene).
Carrier [#51](https://github.com/antonsmolko/gost-spec/issues/51) and prefix
`[gost-spec-52]` are retained, without changing its criteria or closure.

The owner explicitly set `[gost-spec-52]` for subsequent commits on this branch,
overriding the earlier carrier-prefix convention. Carrier #51 and the separate
outcomes #52/#53 are unchanged. The existing planning commit keeps its original
`[gost-spec-51]` message; history is not rewritten.

Source | Finding | Affected files/issues | Disposition | Evidence
--- | --- | --- | --- | ---
Owner review R1 (private input, not a public basis); [#52](https://github.com/antonsmolko/gost-spec/issues/52), [gost-kit source](https://github.com/antonsmolko/gost-kit) | Active common standard and supporting documents name the earlier package | TS-COMMON-001, README, inventory, design/plan/handoff, OpenSpec proposal/design; #52 | Fixed locally; verification recorded below | Active policy now targets `@gost-kit/common`. Local release-preparation metadata is distinguished from public main and any registry release; consumers verify actual artifacts. Historical fc/shell snapshot mentioning the former names is retained as dated evidence
Owner review R2 (private input, not a public basis); [#52](https://github.com/antonsmolko/gost-spec/issues/52) | Library file-layout convention became a universal consumer MUST | TS-COMMON-001, OpenSpec proposal/design, handoff, general design/plan; #52 | Fixed locally; historical gost-kit closure retained | Removed consumer MUST; type organization follows consumer conventions. Applicability explicitly requires adoption of the shared-library policy
Owner review R3 (private input, not a public basis); [#52](https://github.com/antonsmolko/gost-spec/issues/52), [content gate](../../../../docs/architecture/content-approval.md) | Pending standard replaced Local-only disposition and deleted its reason | requirements-inventory.md and active descriptions; #52 | Fixed locally | Exact Local-only row and original rationale restored from HEAD; pending proposal is recorded separately without supersession. Status remains proposed/pending
Owner review R4 (private input, not a public basis); [#53](https://github.com/antonsmolko/gost-spec/issues/53), [distribution rule](../../../../packages/core/security/published-materials.md) | Local review/IDE/agent files could be added with git add . | .gitignore; #53 | Preventive fix; no publication incident demonstrated | Root-only ignore entries added for the five named paths; files are not deleted. Ignore/index checks and existing packed-artifact checks are required; ignore rules do not replace a content audit
Owner review R5 (private input, not a public basis); [AGENTS.md](../../../../AGENTS.md), [#52](https://github.com/antonsmolko/gost-spec/issues/52), [#53](https://github.com/antonsmolko/gost-spec/issues/53) | Original common-utilities work had no issue linkage | carrier #51, additions #52/#53, proposal/design/handoff | Corrected current linkage; historical limitation retained | Current branch already had carrier #51. Added separate issues and request/prefix records; independent outcomes remain separate future PRs. No retroactive claim that the original branch had an issue
Owner review R6 (private input, not a public basis); [#52](https://github.com/antonsmolko/gost-spec/issues/52) | Long unwrapped sentence after the new cross-link | runtime-boundaries.md; #52 | Fixed locally | Paragraph reflowed without changing TS-TYPES-001 boundary-validation semantics

### Sources and consistency audit

Read the complete supplied six-point summary, the historical ledger above,
current AGENTS.md, design/plan/handoff, content approval, inventory, the standard
and README, all common-change artifacts and the fc/shell planning artifacts.
The historical private docs-review input and public response are reference
history, not a public basis for new findings. Public issue bodies #1/#20/#26/#51
and paginated available comments were checked for scope/gate conflicts; no open
PR exists, so there are no current inline/summary PR threads to reply to.

The gost-kit checkout is a development branch with package rename work; the
reviewed metadata names `@gost-kit/common`. Public source URLs are discovery
links, not evidence that this development snapshot or package is published.
The selected actual tarball must provide the imports used in the standard.

### Current verification

- `npm run check` on Node `26.11.1`: 48/48 pass, including actual five-package
  tarballs and external document-consumer fixtures.
- `npm exec --offline --package=node@26.0.0 -- npm run check`: 48/48 pass at
  the supported lower Node boundary; this is a separate fresh run.
- `npm run build --workspace @gost-kit/common` in the sibling checkout, then
  `npm pack --ignore-scripts --json` and an offline install into a new external
  consumer: real `@gost-kit/common@0.0.0` tarball, 193 files, no test/private
  paths in the inclusion list, no workspace link or package symlink.
- The standard's actual TypeScript example compiles with strict NodeNext
  checking against that installed tarball. A separate assignment of `null` to
  `Ulx<string>` fails with TS2322. Runtime public imports verify string checks,
  finite-number exclusion, record exclusion of arrays/null and the fact that an
  array container guard alone does not validate elements.
- Strict OpenSpec validation passes for both common-helpers and fc/shell changes.
  The existing `skip_specs: true` remains for the document-only common change.
- Separate documentation checks: 12 affected Markdown files, 54 relative links
  and anchors resolve; whitespace checks pass. The exact original Local-only
  row/rationale is retained verbatim. Active common policy has no old imports;
  dated historical fc/shell snapshot references remain intentionally unchanged.
- `git check-ignore -v` confirms all five root private paths; `git ls-files`
  finds none already tracked. Negative ignore checks confirm `skills/`, its
  possible nested fixtures, `openspec/` and public package docs remain trackable.
  Standard Git behavior follows the [official gitignore documentation](https://git-scm.com/docs/gitignore).
- A separate agent, given the requirements and artifacts without the author's
  working conversation, read the complete tracked diff and specified untracked
  artifacts, relevant unchanged planning documents, library exports/types/guards,
  issue bodies #20/#26/#51/#52/#53 and available comments for #51–#53. It confirmed
  all six corrections with no actionable findings. That review is private input,
  not a public basis; public actionable sources remain #52/#53 and the contract
  documents in the ledger. The reviewer did not rerun suites, tarball/compiler
  checks or comprehensive links; the author performed those checks separately.

All six supplied findings have dispositions and evidence. No finding remains
open in this round. This closes review corrections only: the normative wording
remains proposed/pending, with no content acceptance or release approval.

### GitHub issue edits — current round

- Created #52 for the standard correction and #53 for root ignore hygiene, with
  the owner request, carrier #51 and retained prefix in each issue.
- Carrier #51 receives an additions section linking #52/#53, retaining all its
  existing criteria and closure conditions. Each future PR must carry the same
  request/issue/prefix links and contain one outcome.
- Issue bodies #51/#52/#53 record the owner's explicit subsequent-commit prefix
  `[gost-spec-52]`; this changes no acceptance or closure criterion.
- Existing #1/#20/#26 criteria, dependencies and release gates are unchanged.
  The owner authorized local commits of the corrections. No PR, push, merge,
  content acceptance or publication is authorized by these corrections.

## Archive execution — 2026-10-31

The owner explicitly invoked `$openspec-archive-change reuse-common-types-and-guards`.
The resolved root is this repository, schema spec-driven. Proposal/design/tasks
are complete; specs is deliberately skipped under the original `skip_specs: true`.
CLI task lookup returned exactly one selected entry with 6/6 completed tasks.
`artifactPaths.specs.existingOutputPaths` was empty, so the archive performed no
sync and created no additional main capability. Existing fc/shell main spec is
unchanged.

Archive: `openspec/changes/archive/2026-10-31-reuse-common-types-and-guards`.
Metadata and task bytes are preserved; the target did not previously exist.
Incoming links in handoff/roadmap and root-relative links in this ledger were
updated. Earlier review-confirmed closures remain intact. Archiving documents
completion of this proposal/review work; it does not approve normative content.

Before the move the author recorded SHA-256 values for the actual standard,
content-approval table, inventory and existing main spec. They remain identical:
TS-COMMON-001 is proposed, its owner decision Pending, and the original Local-only
row/rationale is unchanged. No package metadata, runtime, dependency or release
gate is modified.

Archive checks confirmed exact committed bytes for proposal, design, metadata
and six completed tasks. This ledger changed only for relative-link rebasing and
archive evidence. All 35 local links/anchors across the six affected Markdown
files resolve (the final count includes this archive note's existing links).
CLI lists neither this change nor the previously archived fc/shell change as
active; the main spec inventory still contains only svelte-spa-state-foundation
with eight requirements. No new main spec was synthesized for this document-only
change. Full checks on Node 26.11.1 and 26.0.0 each passed 48/48, including actual
packed documents/external consumers. This archive-only move and link/wording
maintenance changes no contract; previous independent-review closures remain
the review basis.

### GitHub issue edits — archive

Issue #52 records the archive path and completed 6/6 work while explicitly
preserving proposed/Pending and separate owner acceptance. No criteria,
dependencies or issue closure change; #20/#26 and carrier #51 remain unaffected.
Commit/push, PR, merge and publication are separate from this archive operation.

## Review round — 2026-11-01

The owner's complete supplied review summary is private input, not a public
basis. Public actionable sources are [#52](https://github.com/antonsmolko/gost-spec/issues/52),
the existing [content-review criteria in #20](https://github.com/antonsmolko/gost-spec/issues/20)
and the linked current documents. Prior confirmed closures remain closed;
historical archive hashes/check results above describe the archive-time snapshot.

Source | Finding | Affected files/issues | Disposition | Evidence
--- | --- | --- | --- | ---
Owner review R2 (private input, not a public basis); [#20](https://github.com/antonsmolko/gost-spec/issues/20) | Approval table has seven rows for thirteen proposed IDs | content-approval.md; #52 | Complete inventory requirement declined with rationale; wording clarified | #20 requires a row for every reviewed ID, not every existing draft. Existing table includes initial candidates and individual review work. Clarified that absence and Pending grant no approval; six unreviewed IDs are not fabricated as reviewed. No owner/content decision changed
Owner review R3 (private input, not a public basis); [#52](https://github.com/antonsmolko/gost-spec/issues/52) | TS-COMMON-001 appears in different TypeScript orders | TypeScript README, inventory, approval table | Fixed | Relative TypeScript order is TS-TYPES-001, TS-TYPES-002, TS-COMMON-001, TS-FUNCTIONS-001, with TS-CONFIG-001 only where already indexed. Approval remains a partial decision log
Owner review R4 (private input, not a public basis); [#52](https://github.com/antonsmolko/gost-spec/issues/52) | New table cells are not aligned | TypeScript inventory table, approval table | Fixed | Aligned all columns in the two affected tables; inventory cell contents and Pending values unchanged

### GitHub issue edits — review 2026-11-01

Issue #52 records R2 rationale/clarification and R3/R4 fixes; its criteria,
dependencies, carrier and closure remain unchanged. The separate URI-containment
clarification belongs to #55 and its [design ledger](../../package-state-foundation-plugin/design.md#review-round--2026-11-01).
No normative text, ID/status, package version, Local-only disposition or
release/content gate changed. Existing empty common changeset records the
no-release decision for the README-only package edit.

### Verification — review 2026-11-01

Full `npm run check` passed 48/48 on both Node 26.11.1 and 26.0.0, including
real packed artifacts and external consumers. Separate document audit checked
29 relative links/anchors in the seven affected documents. Parsed inventory
cells and all seven decision-row values match the before snapshot; only row
order/format and the decision-log explanation changed. All thirteen standards
remain proposed. Full current-review diff and relevant unchanged contracts
were inspected separately from runtime tests. No new behavior or text-mirroring
tests were added. Main was fast-forwarded to origin/main without switching
the carrier branch; HEAD and the pre-existing index were retained.

Independent fresh-context review of the complete correction round found no
actionable findings, including the partial decision-log rationale, ordering,
table alignment, unchanged contracts and cross-ledger links. This agent review
is private input, not a public basis; #52/#20 and the documents above remain the
public actionable sources. The reviewer did not edit files or rerun tests.
