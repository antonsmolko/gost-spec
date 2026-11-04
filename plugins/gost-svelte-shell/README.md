# GOST Svelte Shell

An Agent Skills plugin for Codex and Claude Code. It connects gost-kit fc/shell
foundations to an existing Svelte 5 SPA when explicitly invoked. Installing or
updating this plugin does not run the skill or change an application.

Read [the skill](skills/gost-svelte-shell/SKILL.md) and its
[Public API recipe](skills/gost-svelte-shell/references/foundation.md).
The recipe records the verified development artifacts. Plugin version 0.2.0
does not imply a corresponding gost-kit release or support for arbitrary versions.
Missing library artifacts must be supplied before applying the skill.

## Distribution and versions

One skill tree is shared by both harness manifests. The plugin has its own
SemVer version and changelog, independent of the standards packages and gost-kit
libraries. Both catalogs read the local plugin directory within the selected
marketplace snapshot. A tag selects the whole marketplace snapshot, rather than
resolving independent versions of individual catalog entries.

Version 0.2.0 is unreleased. The release-tag examples below become usable only
after that tag is explicitly approved and published. There is no published
previous release tag to assume when preparing the first release.

## Install

Select the same existing release tag in both harnesses. The full Git URL command
forms below were exercised against a disposable loopback Git origin with Codex
CLI 0.166.0 and Claude Code 2.1.308. Installation from the public GitHub host has
not been verified; the release tag must exist there before these examples work.

```sh
codex plugin marketplace add https://github.com/antonsmolko/gost-spec.git --ref gost-svelte-shell-v0.2.0
codex plugin add gost-svelte-shell@gost
```

```sh
claude plugin marketplace add 'https://github.com/antonsmolko/gost-spec.git#gost-svelte-shell-v0.2.0'
claude plugin install gost-svelte-shell@gost
```

Start a new session and confirm the installed version, one active plugin skill
and readable Public API recipe. Record the resolved tag commit and compare all
installed plugin files with that snapshot; a displayed version alone is not
proof of the selected content. Report failed commands, unavailable sources or
stale cached content as incomplete, with the actual installed identity/version.
Do not substitute main or another release when a selected tag is unavailable.

Invoke `$gost-svelte-shell:gost-svelte-shell` in Codex or
`/gost-svelte-shell:gost-svelte-shell` in Claude Code only when you want to
connect the application foundation. Compatibility remains subject to the recipe
and the consumer's actual artifacts.

## Update and rollback

Refreshing a marketplace pinned to a tag refreshes that tag; it does not select
a newer release. To change versions, explicitly change the registered tag and
reinstall. Use the same procedure to return to an earlier **existing** tag.

Before removing a marketplace, record any other plugins and data you need to
retain. Removal can uninstall its plugins and delete their cached data/options;
inspect the native result and restore deliberately retained installations.
These commands intentionally remove the current plugin before re-registration:

```sh
codex plugin remove gost-svelte-shell@gost
codex plugin marketplace remove gost
codex plugin marketplace add https://github.com/antonsmolko/gost-spec.git --ref <selected-release-tag>
codex plugin add gost-svelte-shell@gost
```

```sh
claude plugin uninstall gost-svelte-shell@gost
claude plugin marketplace remove gost
claude plugin marketplace add 'https://github.com/antonsmolko/gost-spec.git#<selected-release-tag>'
claude plugin install gost-svelte-shell@gost
```

Restart and verify the selected tag, manifest version, installed file bytes and
one active skill with readable references. Repeating an installation of the same
tag must not add a duplicate skill. If selection or installation fails, report
the actual active installation, including an empty installation after removal;
do not describe a retained old cache as the selected release.

## Prepare and verify a release

Change `version` together in `.codex-plugin/plugin.json` and
`.claude-plugin/plugin.json`, and add the corresponding entry to
[CHANGELOG](CHANGELOG.md). Use SemVer: patch for compatible fixes, minor for
compatible additions; breaking changes use minor before 1.0 and major from 1.0.
Describe compatibility changes and required user actions in the changelog.

Prepare one ordinary PR containing the plugin and both catalogs. Run the
repository's `npm run check`, inspect the distribution, and verify native
installation/discovery in isolated profiles of both harnesses. Draft file checks
work without Git metadata, network access or a future release tag. They do not
prove native installation or authorize a release.

After merge, verify the actual resulting main commit and its plugin/catalog
content, including after squash or rebase. After separate approval for that
specific release, create `gost-svelte-shell-v<version>` on that verified commit.
Create tags only for releases, not every commit. Never move, replace or reuse a
published tag, and never force-push it; corrections get a new version and tag.
No separate same-repository plugin-content commit is required.

When verifying an existing release:

1. Fetch its exact tag and resolve `git rev-parse 'refs/tags/<tag>^{commit}'`.
   Record the resolved commit, including for annotated tags.
2. Confirm it is the verified release result in main history, the catalog sources
   select the shared local tree, both manifest versions equal the tag's version,
   and the changelog contains that version. A missing tag, unsuitable revision,
   changed recorded target or mismatched version fails release verification.
3. Install that same tag in both harnesses and compare the complete installed
   plugin trees and references to it. Record commands, CLI versions, inventory,
   resolved revision and file hashes. Missing native evidence means incomplete.

Git tags rely on maintainer trust; retain resolved commits and hashes to detect
later changes. Native installation may accept a wrongly named tag, so its success
does not replace the version/revision check. Version preparation, merge and file
checks do not authorize publishing or tag creation. Changesets handles the
separate npm documentation packages. Plugin updates do not update libraries or
applications previously connected by an older skill.

## Existing installations

For `gost-svelte-shell` 0.1.0 installed through the previous content-SHA workflow,
use the explicit remove/re-register/install procedure above with a real released
tag. The selected tag now controls the whole snapshot in both harnesses.

For the old plugin identity `gost-svelte-spa-state`, explicitly uninstall it first:

```sh
codex plugin remove gost-svelte-spa-state@gost
```

```sh
claude plugin uninstall gost-svelte-spa-state@gost
```

Then remove the old marketplace registration, add it at the selected release tag
and install `gost-svelte-shell@gost` as above. This is a change of identity, not an
automatic rename through update. Restart and confirm the old skill is inactive.
A failed migration remains incomplete and does not change application code.

Legacy rollback without an existing release tag remains a separate procedure:
remove any installed new identity and explicitly reinstall the old ID from its
previous delivery. Codex can select the previous catalog commit with `--ref`.
For Claude Code, the maintainer must first provide the previous catalog entry,
old ID and old content SHA with matching Codex content in a legacy delivery;
restoring only a SHA under the new ID is insufficient. Until that catalog is
available, report legacy rollback as unavailable. Do not invent a previous tag
or promise an arbitrary Claude SHA selector. Refresh/re-register that available
legacy catalog, reinstall the old ID and verify its old skill/recipe with no
active new skill. The current release catalog keeps its local source.
