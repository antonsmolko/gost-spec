# GOST Functional Core

An English skill for creating and changing business feature state, actions,
reducers and effect/result flow through the public `@gost-kit/common` API.
It reuses an existing application composition and does not require Svelte.
The [skill](skills/gost-functional-core/SKILL.md) and
[Public API recipe](skills/gost-functional-core/references/functional-core.md)
are self-contained. Installation does not run the skill or change an application.

## Install a released snapshot

Version 0.1.0 is unreleased; these commands require a separately approved,
existing release tag. Do not treat them as evidence of a public release.

```sh
codex plugin marketplace add https://github.com/antonsmolko/gost-spec.git --ref gost-functional-core-v0.1.0
codex plugin add gost-functional-core@gost
claude plugin marketplace add 'https://github.com/antonsmolko/gost-spec.git#gost-functional-core-v0.1.0'
claude plugin install gost-functional-core@gost
```

Start a fresh session and ask to use `gost-functional-core` for the requested
feature. It is distinct from `gost-svelte-shell`, which connects an application's
foundation. Either plugin can be installed independently from the same selected
marketplace snapshot; installation does not install or upgrade the other.

## Versions and scope

This plugin has its own SemVer and changelog, independent of the shell plugin,
the common library and npm standards. A tag `gost-functional-core-v<version>`
selects the entire repository snapshot containing both local marketplace
entries; it must match this plugin's two manifests and changelog. Published tags
are immutable. Prepare changes in a PR, merge normally, then obtain separate
release approval before tagging the verified final main commit. No split content
commit/catalog pin or special merge method is needed.

The skill checks actual installed artifacts and reports unavailable integration.
It does not bootstrap a new store, migrate unrelated features, prescribe FSD or
implement presenter/UI architecture. Compatible application bindings are a
separate prerequisite. Registry publication of common is not assumed.
Feature reducers use existing application effects and receivers; effect contracts
and `AppEffector`/`RootEffector` remain application-level prerequisites.
The icon deliberately shares the GOST brand with the shell plugin; plugin names
and descriptions distinguish their purposes.

Codex 0.166.0 and Claude Code 2.1.308 were checked in disposable profiles with a
full loopback HTTP Git URL in place of the GitHub URL above, selecting a temporary
`gost-functional-core-v0.1.0` fixture tag. Independent install, repeat and
coexistence with shell, fresh discovery and all packaged file bytes were checked.
Personal profiles and the synthetic application remained unchanged. This is
native loopback evidence; public GitHub installation and a real release tag
remain unverified. Feature behaviour was evaluated separately with real common
artifacts in a framework-free consumer.
