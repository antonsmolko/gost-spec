# Normative content approval

Current scope: [#30 / PR #31](https://github.com/antonsmolko/engineering-standards/pull/31),
with five document packages and manual whole-package adoption. Owner acceptance
and publication permission remain separate from infrastructure readiness.

Implementation-plan approval is not acceptance of new normative wording. All
existing requirements are currently drafts (proposed). The author must not change
their status on the strength of schema tests, a generic continuation request or their
own review.

On 2026-10-12 the owner chose to finish the technical platform using synthetic
test data before filling the standards documents. Packaging, consumer and
release-process tests may use synthetic accepted requirements. They do not change actual draft statuses or satisfy the content release gate.

## Content decisions

This table records the initial release candidates and individual content-review
work, not a complete inventory of proposed IDs. A Pending row records no owner
acceptance; absence of a row also grants no approval. Other draft IDs enter the
table when their content review starts, not merely because they exist in a package.

| Package              | Requirement ID      | Owner decision | Reviewed revision / decision link                                                                     |
| -------------------- | ------------------- | -------------- | ----------------------------------------------------------------------------------------------------- |
| standards-core       | CORE-ARCH-001       | Pending        | No content approval recorded                                                                          |
| standards-typescript | TS-TYPES-001        | Pending        | No content approval recorded                                                                          |
| standards-svelte-spa | SVELTE-SPA-ARCH-001 | Pending        | No content approval recorded                                                                          |
| standards-frontend   | FRONTEND-ARCH-001   | Pending        | Proposed revision [#78](https://github.com/antonsmolko/gost-spec/issues/78); no content approval      |
| standards-frontend   | FRONTEND-ARCH-002   | Pending        | Proposed revision [#78](https://github.com/antonsmolko/gost-spec/issues/78); no content approval      |
| standards-svelte     | SVELTE-STATE-001    | Pending        | Compatibility revision [#78](https://github.com/antonsmolko/gost-spec/issues/78); no content approval |
| standards-typescript | TS-TYPES-002        | Pending        | Proposed text; no content approval recorded                                                           |
| standards-typescript | TS-COMMON-001       | Pending        | Proposed text; no content approval recorded                                                           |
| standards-typescript | TS-FUNCTIONS-001    | Pending        | Proposed text; no content approval recorded                                                           |

The initial core, TypeScript and Svelte SPA rows are candidates for the first accepted-content set, not
predetermined decisions. Its content gate is defined under
[Recording acceptance](#recording-acceptance).
Add a row for every other reviewed ID, including deferred or rejected IDs,
with its package, owner decision and reviewed revision / decision link.

Other proposed core and TypeScript requirements may be accepted, revised or
deferred independently. Acceptance of one candidate does not approve its entire
package. Additional standards are proposed incrementally from concrete problems;
the frontend presenter proposal is reviewed separately and does not satisfy the
core/TypeScript/Svelte SPA release minimum. Remaining frontend/Svelte topics stay
backlog; future modules have separate design and acceptance gates.

## Review checklist

- Is the requirement understandable without first-consumer code or an agent tool?
- Does it belong to core, a domain, a technology, a stack or a future module?
- Are its applicability and exceptions explicit and no broader than necessary?
- Does the rationale justify the required or recommended level?
- Can verification distinguish compliance from a real violation?
- Are manual checks distinguished from implemented automatic checks?
- Does it conflict with, refine or depend on another registered requirement?
- Is the stable ID preserved, and are source references and licenses appropriate?

## Recording acceptance

The owner reviews the complete proposed text and identifies accepted IDs in a
PR review or another explicit decision. Record that decision's link and the
reviewed revision here. A separate acceptance commit applies only the owner's
confirmed decisions.
The installed package is applied as a whole, but this does not accept all of its
contents. Preserve stable IDs, reviewed revisions and draft labels in documents
and this decision record. Each standard document now carries its proposed/draft
status and level; READMEs index the package's documents. The former manifests
have been removed. Consumers do not load a catalog, resolve profiles or use
generated instructions.
Changes after review must be assessed again rather than inheriting approval.

At least one accepted, applicable requirement from each of core, TypeScript and
Svelte SPA is needed for the first normative release: at least three in total.
Fixtures with accepted data cannot satisfy this gate. Until then, content
acceptance, the accepted-content set and release remain incomplete. Nothing
in this document authorizes publication.
