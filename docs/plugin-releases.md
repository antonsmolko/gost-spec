# GOST plugin releases

The current typed dispatch release selects verified main commit
`2dee4ab890de24aaea71c85aca966c3f77dbf0c1`. Three immutable tags identify the
same repository snapshot with four independently versioned plugins:

| Plugin | Version | Current snapshot selection |
| --- | --- | --- |
| gost-functional-core | 0.3.0 | gost-functional-core-v0.3.0 |
| gost-svelte-shell | 0.4.0 | gost-svelte-shell-v0.4.0 |
| gost-feature | 0.2.0 | gost-feature-v0.2.0 |
| gost-view-presenter | 0.1.1 | Included in any of the three tags above |

These recipes are checked on @gost-kit/common@0.4.0 / @gost-kit/svelte@0.3.0.
Presenter content is unchanged; its older v0.1.1 tag still selects the earlier
snapshot, so use one of the three current tags for this composition. Five
normative npm packages remain independently versioned and unpublished. Plugin
versions above are independent of gost-kit package versions.

Both catalogs use local plugin folders from the selected repository snapshot.
Choose one current tag and use it consistently in both harnesses; register one
marketplace named gost. Each of the three final tags was checked in a separate
fresh profile of Codex and Claude: installs/repeats of all four plugins
(twice each), inventory/discovery/details, actual selected ref/clone HEAD and
complete installed file maps.
See the [release evidence](../openspec/changes/prepare-typed-dispatch-release/design.md#published-typed-dispatch-release).
Installation does not invoke a model, upgrade runtime packages or change asc-admin.

## Install the current release

For a fresh registration, the feature tag selects all four plugin versions:

```sh
codex plugin marketplace add https://github.com/antonsmolko/gost-spec.git --ref gost-feature-v0.2.0
for plugin_name in gost-feature gost-functional-core gost-svelte-shell gost-view-presenter; do
  codex plugin add "$plugin_name@gost"
done
codex plugin list --json
```

```sh
claude plugin marketplace add 'https://github.com/antonsmolko/gost-spec.git#gost-feature-v0.2.0'
for plugin_name in gost-feature gost-functional-core gost-svelte-shell gost-view-presenter; do
  claude plugin install "$plugin_name@gost"
done
claude plugin list --json
```

For an existing registration, first follow [Change an existing registration](#change-an-existing-registration).
Start a new session and verify actual versions and one enabled skill per plugin.
Installation does not upgrade application runtime dependencies. Check an
application's actual Node/Svelte/gost-kit versions before applying a skill.

## Previous feature snapshot

The four earlier tags gost-feature-v0.1.0, gost-functional-core-v0.2.1,
gost-svelte-shell-v0.3.1 and gost-view-presenter-v0.1.1 remain immutable on
`f1c6f936b408f61f063089eded234ad23bf6e076`. They contain the earlier checked
common 0.3.0 / svelte 0.2.0 recipes, including feature, and were verified in both
hosts. [Historical release evidence](../openspec/changes/archive/2026-11-16-prepare-feature-plugin-release/design.md#published-feature-release).

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
codex plugin marketplace add https://github.com/antonsmolko/gost-spec.git --ref gost-feature-v0.2.0
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
claude plugin marketplace add 'https://github.com/antonsmolko/gost-spec.git#gost-feature-v0.2.0'
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

Rollback uses the same explicit remove/re-register/reinstall procedure with an
earlier existing tag. The previous feature snapshot includes all four plugins,
but its recipes require a compatible older application runtime baseline.
Marketplace rollback changes skill content, not application dependencies.
The still earlier pair snapshot has no feature plugin; selecting it removes
feature availability. Do not invent an earlier release for the first pair.
Preserve needed local data before removal. Native inventory/file checks do not
certify model invocation or application behavior.

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
The feature and typed dispatch snapshots passed their own final-tag checks in
both hosts. Neither local/loopback evidence nor a version string substitutes
for those checks.
