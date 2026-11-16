# Proposal

## Why

Feature implementation #88 and archive PR #105 are delivered in main `2ebe704`,
but no released snapshot contains gost-feature. The owner requested preparation
of the next release, including the agreed README follow-up #102.

## What Changes

- Prepare gost-feature 0.1.0 and documentation patch candidates FC 0.2.1,
  shell 0.3.1 and presenter 0.1.1; versions are independent of gost-kit/npm.
- Reuse the release-neutral READMEs in prerequisite PR #107 (#102), which stays
  separate from this preparation outcome #106.
- Verify public candidate install/discovery/read/repeat/update/coexistence and
  full installed bytes in isolated Codex/Claude profiles; update the runbook
  and checkpoints with actual evidence.
- After separately approved merge, verify the final main and request explicit
  release approval before any immutable tags; verify final tags after publication.

## Capabilities

No new or changed capability: existing versioned marketplace/tag/approval
requirements apply. skip_specs is true; skill recipes and runtime APIs stay intact.

## Impact

Three plugin manifest pairs/changelogs, a neutral feature changelog preamble,
release instructions and root README, one existing version assertion,
queue/handoff and this change. Feature skill/example content stays byte
identical to delivered main; its first-release version remains 0.1.0. Five normative npm packages, source skills/recipes,
fixtures, catalogs and old tags remain unchanged. No asc-admin changes,
content acceptance or automatic publication.
