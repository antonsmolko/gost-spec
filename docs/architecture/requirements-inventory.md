# Proposed requirements inventory

This inventory records the first consumer's engineering topics, not its private
implementation. All listed requirements remain **proposed** until the owner
reviews their complete text. Package documentation is the normative text; this
matrix is a review aid, not a second source of obligations.

## Core review set

| Topic                           | Proposed ID and document                                                 | Applicability                           | Rationale and verification                                                                                         |
| ------------------------------- | ------------------------------------------------------------------------ | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Public boundaries               | [CORE-ARCH-001](../../packages/core/architecture/public-contract.md)     | Modules with external consumers         | Limit private coupling; review contracts, imports and behavior tests                                               |
| Completion evidence             | [CORE-WORKFLOW-001](../../packages/core/workflow/acceptance-evidence.md) | Software and artifact changes           | Avoid unsupported completion claims; compare acceptance and current checks                                         |
| Review dispositions             | [CORE-WORKFLOW-002](../../packages/core/workflow/review-decisions.md)    | Public contracts and required standards | Record independent review or explicit solo review with limitations, revision, dispositions and maintainer decision |
| Secrets and distribution rights | [CORE-SECURITY-001](../../packages/core/security/published-materials.md) | Distributed artifacts and fixtures      | Prevent private-data publication; inspect packed files and licenses                                                |

## TypeScript review set

| Topic                        | Proposed ID and document                                                                | Applicability                                                               | Rationale and verification                                                                                              |
| ---------------------------- | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| External-data boundaries     | [TS-TYPES-001](../../packages/technologies/typescript/docs/runtime-boundaries.md)       | TypeScript consuming untrusted data                                         | Static declarations cannot validate runtime data; review adapters and malformed-input failure tests                     |
| Consistent type declarations | [TS-TYPES-002](../../packages/technologies/typescript/docs/type-aliases.md)             | Authored TypeScript declarations                                            | Use type aliases; review declaration-merging exceptions separately from type checking                                   |
| Shared helpers and guards    | [TS-COMMON-001](../../packages/technologies/typescript/docs/common-types-and-guards.md) | New or modified TypeScript in projects explicitly adopting @gost-kit/common | Reuse equivalent contracts; review imports, primitive exceptions and behavior; file layout remains a project convention |
| Function syntax              | [TS-FUNCTIONS-001](../../packages/technologies/typescript/docs/arrow-functions.md)      | Authored named standalone TypeScript functions                              | Recommend const-bound arrows for consistency; ordinary functions remain valid                                           |
| Effective strict checking    | [TS-CONFIG-001](../../packages/technologies/typescript/docs/strict-checking.md)         | Authored TypeScript production code                                         | Avoid permissive or unused configuration; inspect effective settings and real compiler errors                           |

All five remain proposed. TS-TYPES-001 defines complete boundary validation;
TS-COMMON-001 separately proposes shared helper usage without weakening it.
Strict checking is independent of formatting preferences.

## Svelte SPA review set

| Topic                            | Proposed ID and document                                                                   | Applicability                                                         | Rationale and verification                                                                                                               |
| -------------------------------- | ------------------------------------------------------------------------------------------ | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Composition and slice boundaries | [SVELTE-SPA-ARCH-001](../../packages/stacks/frontend/svelte-spa/docs/module-boundaries.md) | Svelte 5 / TypeScript SPAs explicitly selecting the FSD stack package | Make dependencies and ownership explicit; check upward, private and peer imports, plus allowed same-slice and public lower-slice imports |

FSD is a selected stack policy, not universal core architecture. App and Shared
segments are not business slices. No presenter, state library, guard API or
application alias is implied. The proposed import checker is not implemented.

## Frontend presentation

| Topic                                          | Proposed ID and document                                                                   | Applicability                                          | Rationale and verification                                                                                                                                  |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Logical state and intent ownership             | [FRONTEND-ARCH-001](../../packages/domains/frontend/architecture/state-ownership.md)       | Projects explicitly applying the FC/presenter contract | Root/feature state owns logical UI data; reducers decide from current state, application handlers execute effects; browser plumbing has a bounded exception |
| Pure presentation calculations and composition | [FRONTEND-ARCH-002](../../packages/domains/frontend/architecture/presenter-composition.md) | Projects explicitly applying the FC/presenter contract | Ready values/boolean conditions, pure composable presenters and read-only binding; pure tests and reactive/component checks are separate                    |

Both proposed revisions retain the application validation boundary and explain
stateless/shared UI and zero-action browser plumbing. SVELTE-STATE-001 clarifies
compatibility when this contract is also adopted; neither Svelte nor FSD selects
it implicitly. Compiler success is not proof of this architecture or helper provenance.

## Local-only topics

| Topic                                                   | Disposition             | Reason                                                                                       |
| ------------------------------------------------------- | ----------------------- | -------------------------------------------------------------------------------------------- |
| Mandatory named guard methods                           | Local-only              | Depends on an application's helper API; runtime validation does not require that API         |
| arrow-body-style and blank-line preferences             | Local-only              | Readability preferences need a separately approved style profile                             |
| Alias names and project paths                           | Local-only              | Consumer-specific imports are not universal architecture                                     |
| Authentication and API business contracts               | Product-local           | Product identities, session policies and endpoint payloads are not engineering standards     |
| Mandatory Superpowers or another agent tool             | Local-only              | Standards must be usable without a particular agent or plugin                                |
| Stateful store/presenter conventions, forms and API error models | Separate design pending | State ownership and failure policies need explicit applicability and their own module review |

The broad pending row and its rationale remain: runtime store/presenter APIs,
form policies and API error models are not delivered by the proposed frontend
contract. FRONTEND-ARCH-001/002 now define the narrower logical-state/pure-view
responsibilities for adopting projects; they neither define those runtime APIs
nor accept their content. A presenter is not an alternative mutable state owner.

TS-COMMON-001 proposes a separately adopted shared-library policy; it remains
pending and does not supersede the Local-only disposition above. A future owner
decision must explicitly reconcile any changed disposition and its rationale.

## Deferred content

Standards are developed incrementally from concrete problems. FRONTEND-ARCH-001/002
and SVELTE-STATE-001 have proposed revisions under #78, still pending owner content
review. Accessibility, form-state policy and further reactivity/lifecycle topics
remain separate work. These drafts are not complete packages of accepted
conventions. Authentication, authorization, API-client and
frontend-state modules require separate designs; no module package is created
by this inventory.
