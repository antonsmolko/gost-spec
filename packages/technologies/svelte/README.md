# @antonsmolko/standards-svelte

Svelte reactivity and lifecycle concerns, separate from application architecture.

## Status and application

Version 0.1.0 is unreleased. All standards listed below are proposed drafts,
not approved requirements. Installation or passing tests does not approve them.
Select this package as a whole and read this README and all linked standards;
apply only the applicable approved requirements once the owner accepts them.
No particular AI tool, catalog loader or rule-selection configuration is needed.

## Standards (proposed)

- [SVELTE-STATE-001 — Derived state](docs/derived-state.md)

## Applicability and compatibility

Use with standards-core and standards-typescript for Svelte with TypeScript. Frontend architecture belongs to standards-frontend; FSD SPA composition belongs to standards-svelte-spa.

Read FRONTEND-ARCH-001/002 from standards-frontend when also applying its
FC/presenter contract. SVELTE-STATE-001 documents how derived binding coexists
with that ownership policy; installing this Svelte package alone does not adopt
it. Framework capability and project architecture are separate review concerns.

The five packages at 0.1.0 are the currently tested combination. Compatibility
is documented here rather than checked by a semantic resolver. Review the
[CHANGELOG](CHANGELOG.md) before upgrading; packages are versioned independently.
To use this package with an AI agent, manually reference this installed README
from your project's AGENTS.md and instruct the agent to read its linked standards.
Installation does not generate instructions or change lint/format configuration.
