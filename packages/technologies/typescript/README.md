# @antonsmolko/standards-typescript

TypeScript function conventions, checking and runtime data boundaries for any application domain.

## Status and application

Version 0.1.0 is unreleased. All standards listed below are proposed drafts,
not approved requirements. Installation or passing tests does not approve them.
Select this package as a whole and read this README and all linked standards;
apply only the applicable approved requirements once the owner accepts them.
No particular AI tool, catalog loader or rule-selection configuration is needed.

## Standards (proposed)

- [TS-TYPES-001 — Validate external values](docs/runtime-boundaries.md)
- [TS-COMMON-001 — Reuse common types and runtime guards](docs/common-types-and-guards.md)
- [TS-TYPES-002 — Use type aliases for authored types](docs/type-aliases.md)
- [TS-FUNCTIONS-001 — Prefer const-bound arrow functions](docs/arrow-functions.md)
- [TS-CONFIG-001 — Strict compiler checking](docs/strict-checking.md)

## Applicability and compatibility

Use with standards-core. Proposed TS-COMMON-001 applies to projects explicitly
adopting `@gost-kit/common` as their shared types and guards library. It requires
an explicitly configured dependency; installing this documentation package does
not install the library or approve the draft. Verify the selected artifact's
name, version and public exports; a registry release is not assumed.

TypeScript is not limited to frontend; select frontend or stack documents only when applicable.

The five packages at 0.1.0 are the currently tested combination. Compatibility
is documented here rather than checked by a semantic resolver. Review the
[CHANGELOG](CHANGELOG.md) before upgrading; packages are versioned independently.
To use this package with an AI agent, manually reference this installed README
from your project's AGENTS.md and instruct the agent to read its linked standards.
Installation does not generate instructions or change lint/format configuration.
