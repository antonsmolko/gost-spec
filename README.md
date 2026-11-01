# Gold Standard Specifications (GOST Spec)

Five independently versioned npm packages of engineering documents for people
and AI: core, frontend, TypeScript, Svelte and Svelte SPA. Consumers select whole
packages, read their READMEs and linked standards, and manually reference them in
consumer-owned `AGENTS.md` files. No particular AI tool is required.

Reusable runtime libraries are developed separately in
[Gold Standard Kit (GOST Kit)](https://github.com/antonsmolko/gost-kit).

No npm release has been published. Installation examples for registry packages
will become usable after the first explicitly approved release; current
validation uses local tarballs.

## Source skills

[Connect a Svelte SPA state foundation](plugins/gost-svelte-spa-state/skills/gost-svelte-spa-state/SKILL.md)
guides an agent through adding gost-kit fc/shell to an existing Svelte 5 SPA.
It preserves existing business logic and verifies the connection with synthetic
probes. Its Public API recipe records the tested development artifacts and limits.
The [capability specification](openspec/specs/svelte-spa-state-foundation/spec.md)
records its current requirements and scenarios.

Skill sources are separate from the five document workspaces. The
[state plugin](plugins/gost-svelte-spa-state/README.md) has its own unreleased
version and native Codex and Claude Code marketplace catalogs. Reading or installing document
packages does not apply the skill or install runtime libraries.

## Documentation

- [Manual publication](docs/publication.md)
- [Contributing](CONTRIBUTING.md)
- [Security reporting](SECURITY.md)
- [Install and use the documents](docs/usage.md)
- [Product design](docs/superpowers/specs/2026-10-11-engineering-standards-design.md)
- [Implementation roadmap](docs/superpowers/plans/2026-10-11-engineering-standards-independent-packages.md)
- [Package contract](openspec/changes/simplify-project-scope/specs/standards-packages/spec.md)
- [Manual adoption contract](openspec/changes/simplify-project-scope/specs/manual-consumer-adoption/spec.md)

Each package's README will describe applicability, index its standards and explain
known compatibility restrictions in prose. Package installation will not generate
instructions or rewrite existing consumer configuration. CLI, catalog resolution
and lint/format configuration products are outside the initial product scope.

## Current implementation

The repository contains five document workspaces, source skills in `plugins/`,
synthetic evaluation inputs in `fixtures/`, read-only consistency checks and
isolated packed-artifact tests. Skill and fixture sources are separate from the
five npm document workspaces. Native plugin marketplace catalogs are separate
from the former standards catalog/loader, which has been removed. Existing standards remain drafts;
passing infrastructure tests does not approve content or authorize a release.

Use Node 26. The development version in `.node-version` is `26.11.1`; verification
also covers the supported minimum `26.0.0`. Run `npm ci --ignore-scripts` with registry
access to prepare dependencies/cache, then `npm run check`. The current check runs
typecheck, exact workspace lock/version checks, then the full suite, including
installed document indexes, local links and manual adoption examples. Consumer
tests install tarballs offline; an empty cache gives preparation guidance.
TypeScript scripts/helpers are checked without generating JS.

With nvm: `nvm install "$(cat .node-version)"` and `nvm use "$(cat .node-version)"`.
nvm does not read `.node-version` automatically.

[Changesets](.changeset/README.md) manages independent package versions and
changelogs. Version preparation is verified on disposable projects; real package
versions remain 0.1.0. Verification CI runs on PRs into `main` and pushes to `main` on both Node versions.
The [manual publication runbook](docs/publication.md) covers artifact preparation
and separate approval of a real release.
The technical platform is verified with synthetic documents before actual
standards are filled and approved. Plans/discussions use Russian; published
standards and READMEs use English. Bilingual editions are possible future work.
