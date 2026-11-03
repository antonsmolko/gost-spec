# GOST Svelte Shell

An Agent Skills plugin for Codex and Claude Code. It connects gost-kit fc/shell
foundations to an existing Svelte 5 SPA when explicitly invoked. Installing or
updating this plugin does not run the skill or change an application.

Read [the skill](skills/gost-svelte-shell/SKILL.md) and its
[Public API recipe](skills/gost-svelte-shell/references/foundation.md).
The recipe records the verified development artifacts. Plugin version 0.1.0
does not imply a corresponding gost-kit release or supported arbitrary versions.
Missing library artifacts must be supplied before applying the skill.

## Distribution and versions

One skill tree is shared by both harness manifests. The plugin has its own
version, independent of the five standards packages and gost-kit libraries.
This initial version is unreleased; Git marketplace installation requires a
revision that actually contains the plugin and both catalogs.

## Install

These commands require a published repository revision containing the catalogs
and plugin. Version 0.1.0 has not been published yet. The native workflow targets
Codex CLI 0.166.0 and Claude Code 2.1.308.

For Codex, select an audited catalog commit:

```sh
codex plugin marketplace add antonsmolko/gost-spec --ref <catalog-commit>
codex plugin add gost-svelte-shell@gost
```

For Claude Code, the marketplace maintainer pins the plugin content commit in
the catalog's `git-subdir` source. Add the marketplace, then install:

```sh
claude plugin marketplace add antonsmolko/gost-spec
claude plugin install gost-svelte-shell@gost
```

Start a new session and confirm the skill and its Public API recipe are available.
Invoke `$gost-svelte-shell:gost-svelte-shell` in Codex or
`/gost-svelte-shell:gost-svelte-shell` in Claude Code only when you want
to connect the application foundation. Library compatibility remains subject to
the recipe and the consumer's actual artifacts.

## Update and rollback

For Claude Code, refresh the catalog and request the maintainer-selected version:

```sh
claude plugin marketplace update gost
claude plugin update gost-svelte-shell@gost
```

For Codex, re-register the Git marketplace with the selected catalog commit and
install its plugin. If the existing registration prevents changing the ref,
remove the `gost` marketplace and add it with the desired ref before installing
again. Removing a marketplace can remove its installed plugins; inspect the
native command result and reinstall the selected plugin.

Record both the catalog revision and Claude's pinned plugin-content revision.
They can differ while delivering identical content. Claude has no arbitrary
commit selector at marketplace registration: rollback requires the maintainer
to restore the catalog's earlier plugin pin and matching Codex content, followed
by native refresh/update. Restart sessions and inspect installed versions and
content after updates or rollback. A version string alone is insufficient.

## Prepare a version

Change `version` together in `.codex-plugin/plugin.json` and
`.claude-plugin/plugin.json`, and add the corresponding entry to
[CHANGELOG](CHANGELOG.md). Use SemVer: patch for compatible fixes, minor for
compatible additions; breaking changes use minor before 1.0 and major from 1.0.
Describe compatibility changes and required user actions in the changelog.

First commit the complete prepared plugin directory. Then update the Claude
catalog's full `source.sha` to that commit and keep the Codex catalog's plugin
tree identical. The content commit must exist before the catalog refers to it;
do not invent a SHA or pin the catalog to its own not-yet-created commit.

Run the repository's `npm run check` and verify native marketplace installation
in both harnesses. Versions alone do not identify installed content: retain the
Git revision and inspect the installed skill and references. Plugin updates do
not update libraries or applications already connected by an older skill.
Changesets remains responsible for the separate npm documentation packages.
Version preparation does not authorize publishing, tags or a release.

## Migrate from the previous name

The plugin and skill were renamed from `gost-svelte-spa-state` to
`gost-svelte-shell`. This is a new identity, not an automatic update of the old
installation. The supported Svelte 5 SPA foundation and library requirements
are unchanged. The new identity starts at version 0.1.0 (unreleased).

For an existing Codex installation, explicitly remove the old plugin, then
re-register the marketplace at a catalog commit containing the new identity:

```sh
codex plugin remove gost-svelte-spa-state@gost
codex plugin marketplace remove gost
codex plugin marketplace add antonsmolko/gost-spec --ref <new-catalog-commit>
codex plugin add gost-svelte-shell@gost
```

Removing a marketplace may remove its other installed plugins; inspect the
native result and restore any deliberately retained installations.

For an existing Claude Code installation, remove the old plugin and refresh
the maintainer-selected catalog before installing the new identity:

```sh
claude plugin uninstall gost-svelte-spa-state@gost
claude plugin marketplace update gost
claude plugin install gost-svelte-shell@gost
```

Restart sessions and confirm only the new plugin skill is active, then read its
installed recipe. If installation fails after removal, report the migration as
incomplete and inspect the actual installed identities. To return to the old
delivery, remove any installed new identity and explicitly install the old ID
from its previous catalog/content pin:

- Codex users can re-register the marketplace with `--ref <old-catalog-commit>`
  and install `gost-svelte-spa-state@gost` from that delivery.
- Claude Code requires a maintainer to first restore the previous catalog entry
  for `gost-svelte-spa-state`, its old `git-subdir` content pin and matching Codex
  delivery. Restoring only `source.sha` under the new plugin ID is insufficient.
  Once that catalog is available, users run `claude plugin marketplace update gost`
  and `claude plugin install gost-svelte-spa-state@gost`. A user cannot select the
  earlier catalog commit at registration; until the maintainer restores it,
  report rollback as unavailable and retain the actual installed-state report.

Restart and verify the old skill and recipe, with no active new plugin skill.
Changing the catalog or ID does not connect, update or migrate an application.
