# @antonsmolko/standards-svelte-spa

Svelte 5 / TypeScript single-page applications explicitly adopting the FSD architecture.

## Status and application

Version 0.1.0 is unreleased. All standards listed below are proposed drafts,
not approved requirements. Installation or passing tests does not approve them.
Select this package as a whole and read this README and all linked standards;
apply only the applicable approved requirements once the owner accepts them.
No particular AI tool, catalog loader or rule-selection configuration is needed.

## Standards (proposed)

- [SVELTE-SPA-ARCH-001 — FSD module boundaries](docs/module-boundaries.md)

## Applicability and compatibility

Intended to be read with standards-core, standards-frontend, standards-typescript and standards-svelte. These companion packages must be selected and installed explicitly; this stack is not a universal frontend rule.

Its FSD profile governs module dependencies. When also applying the frontend
FC/presenter contract, read FRONTEND-ARCH-001/002 for state and UI responsibilities
and SVELTE-STATE-001 for reactive compatibility. Folder layout alone does not
choose a state library, create a presenter requirement or bypass another
explicitly adopted architecture rule.

The five packages at 0.1.0 are the currently tested combination. Compatibility
is documented here rather than checked by a semantic resolver. Review the
[CHANGELOG](CHANGELOG.md) before upgrading; packages are versioned independently.
To use this package with an AI agent, manually reference this installed README
from your project's AGENTS.md and instruct the agent to read its linked standards.
Installation does not generate instructions or change lint/format configuration.
