# GOST Feature

Create and extend modular frontend features with shared common code and
independent scenarios. Read [the English skill](skills/gost-feature/SKILL.md),
[recipe](skills/gost-feature/references/modular-feature.md) and
[complete tested example](skills/gost-feature/references/users-example.md).
The example connects data operations/mappers, domain FC, presenters and pages.

## Install a released snapshot

Manifests/changelog describe content, while an existing approved immutable tag
establishes publication. The tag convention is gost-feature-v<version>; a future
name does not establish availability. Choose an existing tag containing this
plugin and verify its manifests/version before installation. Earlier marketplace
snapshots may not contain this plugin. Installation does not run the skill,
upgrade runtime packages or modify an application.

For a fresh gost registration, select the same verified tag in both harnesses:

```sh
: "${GOST_RELEASE_TAG:?Set an existing approved tag containing gost-feature}"
codex plugin marketplace add https://github.com/antonsmolko/gost-spec.git --ref "$GOST_RELEASE_TAG"
codex plugin add gost-feature@gost
codex plugin list --json
```

```sh
: "${GOST_RELEASE_TAG:?Set an existing approved tag containing gost-feature}"
claude plugin marketplace add "https://github.com/antonsmolko/gost-spec.git#$GOST_RELEASE_TAG"
claude plugin install gost-feature@gost
claude plugin list --json
```

Start a new session and check the skill identity, readable local references,
installed version and actual source. Other GOST skills are independently
installable; reading this skill requires no other plugin or repository checkout.

## Existing registration, update and rollback

Inspect the current registration and record every plugin to retain before
removal; native marketplace removal can remove installed plugins/cache entries.
Refreshing a pinned tag does not choose another tag. Select a different existing
approved snapshot explicitly: remove the installed gost-feature copy if present,
remove the gost marketplace, add the verified tag above, install gost-feature
and restore all deliberately retained plugins. Use codex plugin remove / plugin
marketplace remove, or claude plugin uninstall / plugin marketplace remove.
Then restart and inspect identities and all installed files.

Rollback follows the same explicit steps to an earlier available snapshot that
contains the intended plugin/version. Do not invent a previous release tag.
After any failure report the actual active source/files; an old cache is not
evidence of a successful update. Personal profiles and consumer projects are
outside maintainer verification profiles.

The plugin has its own SemVer/changelog, independently of other plugins and npm
packages. A tag selects the complete marketplace snapshot. Tags are immutable
and require explicit release approval on checked final main. Candidate checks
in isolated profiles do not establish publication or application behavior.
