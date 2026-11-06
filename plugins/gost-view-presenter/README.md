# GOST View Presenter

Extract view-data calculations into pure functions, test their results and use
ready values in components. The English [skill](skills/gost-view-presenter/SKILL.md)
and [complete example](skills/gost-view-presenter/references/view-presenter.md)
cover the original component, a typed presenter with named parameters, colocated unit tests
and reactive rendering. TypeScript calculations and Svelte 5 binding are verified
separately. Existing data sources, callbacks and dependencies stay in place.

## Install a released snapshot

Version 0.1.0 is unreleased. These commands require a separately approved,
existing release tag:

```sh
codex plugin marketplace add https://github.com/antonsmolko/gost-spec.git --ref gost-view-presenter-v0.1.0
codex plugin add gost-view-presenter@gost
claude plugin marketplace add 'https://github.com/antonsmolko/gost-spec.git#gost-view-presenter-v0.1.0'
claude plugin install gost-view-presenter@gost
```

Start a new session and ask to use `gost-view-presenter` for the component task.
Installation does not apply the skill to an application. The plugin can be
installed independently or alongside the other GOST plugins.

## Versions and updates

The plugin has its own SemVer/changelog. Its two manifests and changelog match;
a tag `gost-view-presenter-v<version>` selects the whole marketplace snapshot.
Other plugin/npm/runtime versions are independent. Release tags are immutable
and created on verified main only after explicit release approval.

Use the same existing tag in both harnesses. To change tags or return to an
available previous release, use the harness's marketplace remove/add and plugin
install workflow, then restart and inspect installed files. Re-registering the
shared marketplace may affect other installed plugins; record their selected
snapshot before removing it and restore the desired entries afterward. The
first release does not imply an earlier available tag. If a requested source
cannot be installed, report the actual active files rather than treating main
or a cached release as the requested version.

## Verification

The complete example has ordinary function tests and separate Chromium checks
for reactive text/branches/rows and existing callbacks. Source links record the
proposed guidance and revision; missing inputs or source verification are
reported explicitly. Compiler success does not establish arbitrary purity.
Codex 0.167.0 and Claude Code 2.1.308 were checked in disposable profiles against
a full loopback HTTP Git URL selecting a temporary fixture tag. Separate install,
repeat, coexistence, fresh discovery and installed bytes were checked. This is
native loopback evidence; public GitHub installation and a real release remain
separate verification. Installation was tested independently of generated code.
