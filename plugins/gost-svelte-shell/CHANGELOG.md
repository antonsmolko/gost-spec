# Changelog

## 0.2.1 (unreleased)

- Verify published common 0.3.0 / Svelte binding 0.2.0 and document engine/peer checks.
- Use factory initState and document explicit reset exclusions, fresh defaults
  and shared error reporting; verify reset reactivity in the disposable probe.
- Add a separate store/context recipe with full root state and dispatch access.
- Add a disposable two-slice browser probe for shared access, effect completion,
  root isolation and missing-provider diagnostics; preserve empty integration.

- Select the same versioned marketplace tag in Codex and Claude Code; both
  catalogs now use the shared local plugin tree within that snapshot.
- Remove the separate same-repository content SHA and merge-history requirement.
- Existing installations must explicitly change their marketplace registration
  to a released tag and reinstall the plugin; see README for update and rollback.
- Keep the existing skill, Public API recipe and Svelte 5 SPA compatibility.

- Rename the previous `gost-svelte-spa-state` plugin and skill to
  `gost-svelte-shell`; existing installations require explicit uninstall/install.
- Keep the same Svelte 5 SPA foundation behavior and library compatibility.

- Package the existing state-foundation skill and Public API recipe for native
  Codex and Claude Code marketplaces, sharing one content tree and version.
- Preserve existing business features; application migration and automatic
  application updates remain separate from installing this plugin.
