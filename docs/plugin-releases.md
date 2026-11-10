# GOST plugin releases

The published pair is `gost-functional-core@0.2.0` and
`gost-svelte-shell@0.3.0`. Both tags select checked main commit
`64714fcc9929ce3eb0ea7676dfabaa883f5069f7`; installation from each tag was verified
in isolated Codex 0.167.0 and Claude Code 2.1.308 profiles. `gost-view-presenter@0.1.0` is unchanged.
A manifest/changelog describes versioned content; publication is established by
an approved immutable tag on the checked final main commit. Confirm the tag exists
before running installation examples. Missing tags mean the release is unavailable.

Both native catalogs use plugin folders from one selected repository snapshot.
For this pair, `gost-functional-core-v0.2.0` and `gost-svelte-shell-v0.3.0` must
select the same final commit. Register one snapshot, then install either or both
plugins; do not add two marketplaces with the same name `gost`.

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

For the pair, remove installed copies, change the registration, and reinstall:

```sh
codex plugin remove gost-functional-core@gost
codex plugin remove gost-svelte-shell@gost
codex plugin marketplace remove gost
codex plugin marketplace add https://github.com/antonsmolko/gost-spec.git --ref gost-svelte-shell-v0.3.0
codex plugin add gost-functional-core@gost
codex plugin add gost-svelte-shell@gost
```

```sh
claude plugin uninstall gost-functional-core@gost
claude plugin uninstall gost-svelte-shell@gost
claude plugin marketplace remove gost
claude plugin marketplace add 'https://github.com/antonsmolko/gost-spec.git#gost-svelte-shell-v0.3.0'
claude plugin install gost-functional-core@gost
claude plugin install gost-svelte-shell@gost
```

Restore presenter or other deliberately retained installations if they were
previously installed, and verify their identities/content too. If a plugin in
the pair was absent, skip its removal; installing it is a separate choice.
After any failure, report the actual active versions/cache state. An old cache
is not evidence that the new tag installed successfully.

Rollback follows the same explicit re-registration/reinstallation steps using
an earlier existing tag. There is currently no previous public GOST release tag
to assume for this first release; never invent one. Preserve needed local data
before removal. Native inventory and installed-file checks do not certify model
invocation or application behavior.

## Maintainer release checklist

1. Verify preparation PR checks, both native profiles, actual selected ref/commit
   and all plugin bytes. Preserve presenter/catalog and npm versions.
2. Merge normally after approval; verify the resulting main commit and payload.
3. Present the exact main commit, versions, file identities and install evidence
   to the owner. Obtain explicit release approval for that candidate.
4. Confirm both tag names are absent, then create and push immutable tags on that
   main commit. Never move an existing release tag.
5. Verify remote tags and install each final tag in a separate fresh profile of
   each harness: one `gost` registration per profile. When reusing a profile for
   the second tag, follow [Change an existing registration](#change-an-existing-registration)
   first, substituting the other tag for the procedure's example tag, and restore
   deliberately retained plugins. Record actual versions, files,
   repeat/update/coexistence and source.
6. Update release checkpoints and the asc-admin instructions with actual evidence.
   If final-tag checks fail, the issue remains incomplete; do not silently change
   the tag or substitute a different snapshot.

Use supported native commands, based on [OpenAI packaging documentation](https://developers.openai.com/plugins/build/plugins)
and [Claude marketplace documentation](https://code.claude.com/docs/en/plugin-marketplaces).
Public GitHub candidate-ref checks preceded this release; the final-tag checks
for both tags and both harnesses passed after approved publication. Neither
local/loopback evidence nor a version string substitutes for those checks.
