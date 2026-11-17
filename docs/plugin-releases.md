# GOST plugin releases

The current release contains four independently versioned plugins. All four
immutable tags select verified main commit
`f1c6f936b408f61f063089eded234ad23bf6e076`.

| Plugin | Version | Published tag |
| --- | --- | --- |
| gost-feature | 0.1.0 | gost-feature-v0.1.0 |
| gost-functional-core | 0.2.1 | gost-functional-core-v0.2.1 |
| gost-svelte-shell | 0.3.1 | gost-svelte-shell-v0.3.1 |
| gost-view-presenter | 0.1.1 | gost-view-presenter-v0.1.1 |

Feature is new; the other three receive documentation patches. Their existing
skills/recipes and npm dependencies are unchanged: this snapshot uses the checked
common@0.3.0 / svelte@0.2.0 baseline, and does not yet document the newer dispatch
API. Plugin versions are independent of gost-kit versions and the five normative
npm packages, which have no published release.

Both native catalogs use plugin folders from one selected repository snapshot.
Choose any one of the four tags above and use it consistently in both harnesses;
do not add two marketplaces with the same name `gost`. Each final tag was checked
in isolated Codex 0.169.0 and Claude Code 2.1.308 profiles: install/repeat,
list/discovery/details, selected ref/clone HEAD and every installed file of all
four plugins. See the [release evidence](../openspec/changes/archive/2026-11-16-prepare-feature-plugin-release/design.md#published-feature-release).
These checks do not invoke a model or apply a skill to asc-admin.

## Prepared typed dispatch snapshot

These candidates target common 0.4.0 / svelte 0.3.0 and are not published:

| Plugin | Candidate | Future tag, currently unavailable |
| --- | --- | --- |
| gost-functional-core | 0.3.0 | gost-functional-core-v0.3.0 |
| gost-svelte-shell | 0.4.0 | gost-svelte-shell-v0.4.0 |
| gost-feature | 0.2.0 | gost-feature-v0.2.0 |

Presenter 0.1.1 is unchanged and included in that prepared snapshot. After
separately approved integration, all three future tags require explicit release
approval on one verified final main commit. The current commands below still
select the existing released snapshot; its recipes target
@gost-kit/common@0.3.0 / @gost-kit/svelte@0.2.0.

A future tag is not a usable installation source. After the next release,
select one of its actual tags consistently in both hosts and follow the same
remove/re-register/reinstall procedure; do not refresh an old pin and expect
new content. Rollback can select the earlier existing feature snapshot, provided
the application still uses runtime packages compatible with those older recipes.
Marketplace rollback changes skill content, not application dependencies.

## Install the current release

For a fresh registration, the feature tag selects all four plugin versions:

```sh
codex plugin marketplace add https://github.com/antonsmolko/gost-spec.git --ref gost-feature-v0.1.0
for plugin_name in gost-feature gost-functional-core gost-svelte-shell gost-view-presenter; do
  codex plugin add "$plugin_name@gost"
done
codex plugin list --json
```

```sh
claude plugin marketplace add 'https://github.com/antonsmolko/gost-spec.git#gost-feature-v0.1.0'
for plugin_name in gost-feature gost-functional-core gost-svelte-shell gost-view-presenter; do
  claude plugin install "$plugin_name@gost"
done
claude plugin list --json
```

For an existing registration, first follow [Change an existing registration](#change-an-existing-registration).
Start a new session and verify actual versions and one enabled skill per plugin.
Installation does not upgrade application runtime dependencies. Check an
application's actual Node/Svelte/gost-kit versions before applying a skill.

## Previous released pair

The earlier tags `gost-functional-core-v0.2.0` and `gost-svelte-shell-v0.3.0`
remain immutable on `64714fcc9929ce3eb0ea7676dfabaa883f5069f7`. Their installation
was verified in isolated Codex 0.167.0 and Claude Code 2.1.308 profiles. That snapshot
also contains presenter 0.1.0, but no feature plugin. The pair-install commands
below intentionally select that earlier snapshot. The change-registration
procedure switches to the current release.

## README status in the existing pair snapshot

The frozen plugin READMEs still describe FC 0.2.0 and shell 0.3.0 as prepared.
Those statements describe preparation; the two existing tags above establish
publication and the commands below are verified against them. Changelog version
entries describe content; their neutral tag condition determines publication.

Presenter 0.1.0 is included and installable from either pair tag, but has no
separate `gost-view-presenter-v0.1.0` tag. Its frozen README shows that unavailable
tag; use the selected pair snapshot and `codex plugin add gost-view-presenter@gost`
or `claude plugin install gost-view-presenter@gost` instead. For an existing
registration, follow the change procedure below first. The published snapshots
remain immutable; their embedded wording cannot be corrected in place.

## Install the released pair

The pair has been approved and both tags exist. Use one of them consistently.
For a fresh marketplace registration:

```sh
codex plugin marketplace add https://github.com/antonsmolko/gost-spec.git --ref gost-svelte-shell-v0.3.0
codex plugin add gost-functional-core@gost
codex plugin add gost-svelte-shell@gost
codex plugin list --json
```

```sh
claude plugin marketplace add 'https://github.com/antonsmolko/gost-spec.git#gost-svelte-shell-v0.3.0'
claude plugin install gost-functional-core@gost
claude plugin install gost-svelte-shell@gost
claude plugin list --json
```

Start a new session and confirm the installed versions, readable references and
one skill per installed plugin. Installation does not invoke the skills or
upgrade an application's runtime dependencies. For asc-admin, check actual
Node/Svelte/gost-kit compatibility before asking its agent to apply a skill.

## Change an existing registration

Inspect the current marketplace and installed plugins first. A refresh of a
pinned tag does not choose a newer tag. Record every plugin you need to restore;
marketplace removal can remove other installations and cached data.

Record all installed plugins to retain. For the current snapshot, uninstall each
installed copy, change the registration, then restore the selected plugins:

```sh
codex plugin remove gost-feature@gost
codex plugin remove gost-functional-core@gost
codex plugin remove gost-svelte-shell@gost
codex plugin remove gost-view-presenter@gost
codex plugin marketplace remove gost
codex plugin marketplace add https://github.com/antonsmolko/gost-spec.git --ref gost-feature-v0.1.0
for plugin_name in gost-feature gost-functional-core gost-svelte-shell gost-view-presenter; do
  codex plugin add "$plugin_name@gost"
done
codex plugin list --json
```

```sh
claude plugin uninstall gost-feature@gost
claude plugin uninstall gost-functional-core@gost
claude plugin uninstall gost-svelte-shell@gost
claude plugin uninstall gost-view-presenter@gost
claude plugin marketplace remove gost
claude plugin marketplace add 'https://github.com/antonsmolko/gost-spec.git#gost-feature-v0.1.0'
for plugin_name in gost-feature gost-functional-core gost-svelte-shell gost-view-presenter; do
  claude plugin install "$plugin_name@gost"
done
claude plugin list --json
```

Skip removal of absent plugins. Restore any other deliberately retained plugins.
Installing a previously absent plugin is a separate choice. Inspect actual
selected ref, versions, files and skill discovery after restarting.
After any failure, report the actual active versions/cache state. An old cache
is not evidence that the new tag installed successfully.

Rollback follows the same explicit re-registration/reinstallation steps using
an earlier existing tag. For the current feature snapshot, the previous pair is
an available earlier marketplace snapshot, but contains no feature plugin: a
rollback there removes feature availability. There is no earlier feature tag
to assume. For the first published pair, do not invent a still earlier release.
Preserve needed local data before removal. Native inventory and installed-file
checks do not certify model invocation or application behavior.

## Maintainer release checklist

1. Verify preparation PR checks, both native profiles, actual selected ref/commit
   and all plugin bytes. Check independent candidate versions; preserve catalogs,
   npm versions and unchanged skill/recipe contents.
2. Merge normally after approval; verify the resulting main commit and payload.
3. Present the exact main commit, versions, file identities and install evidence
   to the owner. Obtain explicit release approval for that candidate.
4. Confirm every approved tag name is absent, then create and push immutable tags on that
   main commit. Never move an existing release tag.
5. Verify remote tags and install each approved final tag in a separate fresh profile of
   each harness: one `gost` registration per profile. When reusing a profile for
   another approved tag, follow [Change an existing registration](#change-an-existing-registration)
   first, substituting the other tag for the procedure's example tag, and restore
   deliberately retained plugins. Record actual versions, files,
   repeat/update/coexistence and source.
6. Update release checkpoints and the asc-admin instructions with actual evidence.
   If final-tag checks fail, the issue remains incomplete; do not silently change
   the tag or substitute a different snapshot.

Use supported native commands, based on [OpenAI packaging documentation](https://developers.openai.com/plugins/build/plugins)
and [Claude marketplace documentation](https://code.claude.com/docs/en/plugin-marketplaces).
Public GitHub candidate-ref checks preceded the published pair release; its
final-tag checks for both tags and both harnesses passed after approval.
The feature snapshot final-tag checks passed in both hosts. Neither
local/loopback evidence nor a version string substitutes for those checks.
