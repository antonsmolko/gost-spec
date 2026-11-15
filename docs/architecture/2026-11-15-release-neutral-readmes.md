# Release-neutral plugin README preparation

Public requirements: [#102](https://github.com/antonsmolko/gost-spec/issues/102).
Release carrier: [#106](https://github.com/antonsmolko/gost-spec/issues/106),
requested after delivery of feature archive PR #105/main `2ebe704`.
This prerequisite PR uses `[gost-spec-102]`; release preparation has its own
`[gost-spec-106]` branch/PR. Criteria and closure of #88/#97 stay independent.

## Design and plan

Replace mutable prepared/unreleased statements in FC, shell and presenter
READMEs with the existing tag-availability contract. Require the reader to
select an existing approved marketplace tag containing the intended plugin and
verify its manifest version. A plugin may be available in another plugin's
release snapshot without having its own tag. Guard executable examples with
GOST_RELEASE_TAG; never instruct an unconditional unavailable presenter tag.
Make the presenter changelog use the same neutral version-entry convention.

Keep native local-source catalogs and existing commands. Baselines:
[OpenAI packaging](https://developers.openai.com/plugins/build/plugins),
[Claude marketplaces](https://code.claude.com/docs/en/plugin-marketplaces) and
[maintained Anthropic catalog](https://github.com/anthropics/claude-plugins-official/blob/main/.claude-plugin/marketplace.json).
No new installer, resolver or verification gate is needed.

This PR changes documentation only. #106 assigns patch candidates for the
three changed distributions; it verifies their final installed README bytes
in both harnesses. Five npm packages, manifests, skills/recipes, fixtures,
catalogs and existing tags stay unchanged here. No tag or merge is authorized.
Historical released README bytes remain immutable in their original snapshots.

Missing/unapproved tags or a mismatched selected plugin/version mean unavailable
installation; an old cached plugin is not proof of the requested update. Update
and rollback still explicitly change the one marketplace registration, preserve
the desired plugin inventory and inspect the resulting source/files.

- [x] Update the three READMEs and neutral presenter changelog.
- [x] Verify full check, links, unchanged content, and independent review; open
  this prerequisite PR. Final native README checks belong to #106's candidate.

## Verification and review ledger

Record actual checks and any findings here. Public basis is #102/#106; private
review reports are supplementary, not a public basis. Publication and content
approval remain separate from documentation verification.


Repository checks: npm check 121/121, strict OpenSpec 14/14, marked tracked-file
link audit 167 Markdown / 294 local links / 28 fragments / 0 errors; diff clean.
All ten changed README shell blocks parse with sh -n; no consumer commands run.
Independent prerequisite review PASS, no findings: public basis #102/#106;
private report is supplementary input, not a public basis. Reviewer checked
complete diff, unchanged representations/tags, shell syntax and check logs;
global link counts were inspected, not independently reproduced.

#102 remains open until #106 verifies final installed README bytes/links/commands
in both hosts. This scoped PASS does not discharge that acceptance criterion.
Existing remote tag objects remain d68e6718b821eb521cf3af1219d05c75ea25d09d (FC)
and 381952862d1527b73b22181118d9c88c5da0ca84 (shell), both resolving to
64714fcc9929ce3eb0ea7676dfabaa883f5069f7. Native/release checks are pending #106.

Issue edits: #102 records the owner's release-preparation request and its
independent #106 dependency/prefix; original criteria/closure stay unchanged.
