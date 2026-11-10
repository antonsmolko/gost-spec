# GOST Functional Core

An English skill for creating and changing business feature state, actions,
reducers and effect/result flow through the public `@gost-kit/common` API.
It reuses an existing application composition and does not require Svelte.
The [skill](skills/gost-functional-core/SKILL.md) and
[Public API recipe](skills/gost-functional-core/references/functional-core.md)
are self-contained. Installation does not run the skill or change an application.

## Install a released snapshot

Version 0.2.0 is prepared; these commands require a separately approved,
existing release tag. Do not treat them as evidence of a public release.

These commands are for a fresh `gost` registration. If `gost` is already
registered, follow [Update and rollback](#update-and-rollback) to select the
intended snapshot explicitly before installing.

```sh
codex plugin marketplace add https://github.com/antonsmolko/gost-spec.git --ref gost-functional-core-v0.2.0
codex plugin add gost-functional-core@gost
claude plugin marketplace add 'https://github.com/antonsmolko/gost-spec.git#gost-functional-core-v0.2.0'
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
separate prerequisite. The current recipe is checked with registry-installed
common@0.3.0 on Node 26; other artifacts/environment combinations need their own verification.
Feature reducers use existing application effects and callbacks; effect contracts
and `AppEffector`/`RootEffector` remain application-level prerequisites.
Reducer unit tests use existing state factories with scenario overrides to check
the pure state/action → state/effects transition; app integration is checked separately.
The icon deliberately shares the GOST brand with the shell plugin; plugin names
and descriptions distinguish their purposes.

Historical native evidence for plugin 0.1.0: Codex 0.166.0 and Claude Code
2.1.308 were checked in disposable profiles with a
full loopback HTTP Git URL in place of the GitHub URL above, selecting a temporary
`gost-functional-core-v0.1.0` fixture tag. Independent install, repeat and
coexistence with shell, fresh discovery and all packaged file bytes were checked.
Personal profiles and the synthetic application remained unchanged. This is
historical native loopback evidence, not proof of a current public release.
Verify the selected public tag and installation separately. Feature behaviour
was evaluated separately with real common artifacts in a framework-free consumer.

## Update and rollback

Changing a pinned marketplace to another release requires explicit
re-registration and reinstall. First record other installed GOST plugins and
any data/options to preserve: marketplace removal can remove their caches too.
If this plugin is installed, remove it before changing the source:

```sh
codex plugin remove gost-functional-core@gost
codex plugin marketplace remove gost
codex plugin marketplace add https://github.com/antonsmolko/gost-spec.git --ref <selected-release-tag>
codex plugin add gost-functional-core@gost
```

```sh
claude plugin uninstall gost-functional-core@gost
claude plugin marketplace remove gost
claude plugin marketplace add 'https://github.com/antonsmolko/gost-spec.git#<selected-release-tag>'
claude plugin install gost-functional-core@gost
```

Restore other deliberately retained plugins, start a fresh session and check
actual versions/file bytes. Use an earlier existing tag for rollback; no previous
public release is assumed. A missing tag or failed install is incomplete even
when an old cached plugin is still visible. Selecting a new snapshot does not
silently upgrade another plugin.
