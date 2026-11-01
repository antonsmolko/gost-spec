import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { cp, mkdir, mkdtemp, readFile, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { execFileSync, spawnSync } from "node:child_process";
import { join, resolve } from "node:path";
import test, { type TestContext } from "node:test";
import { checkPluginDistribution } from "../../scripts/check-plugin-distribution.ts";

const repository = resolve(import.meta.dirname, "../..");
const pluginPath = "plugins/gost-svelte-spa-state";
const json = async (path: string) => JSON.parse(await readFile(path, "utf8"));

const git = (root: string, args: string[]) => execFileSync("git", ["-C", root, ...args], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
const pin = async (root: string) => {
  git(root, ["add", "plugins"]);
  git(root, ["-c", "user.name=Fixture", "-c", "user.email=fixture@example.invalid", "commit", "--allow-empty", "-m", "Prepare plugin content"]);
  const catalog = await json(join(root, ".claude-plugin/marketplace.json"));
  catalog.plugins[0].source = { source: "git-subdir", url: "https://github.com/antonsmolko/gost-spec.git", path: pluginPath, sha: git(root, ["rev-parse", "HEAD"]) };
  await writeFile(join(root, ".claude-plugin/marketplace.json"), JSON.stringify(catalog));
};


const fixture = async (t: TestContext) => {
  const root = await mkdtemp(join(tmpdir(), "gost-plugin-check-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  await cp(join(repository, "plugins"), join(root, "plugins"), { recursive: true });
  for (const catalog of [".agents/plugins/marketplace.json", ".claude-plugin/marketplace.json"]) {
    await mkdir(join(root, catalog, ".."), { recursive: true });
    await cp(join(repository, catalog), join(root, catalog));
  }
  git(root, ["init", "-b", "main"]);
  git(root, ["remote", "add", "origin", "https://github.com/antonsmolko/gost-spec.git"]);
  await pin(root);
  return root;
};

test("both harness manifests expose the same independently versioned skill", async () => {
  const root = join(repository, pluginPath);
  assert.ok(existsSync(root), "self-contained plugin distribution is missing");
  const codex = await json(join(root, ".codex-plugin/plugin.json"));
  const claude = await json(join(root, ".claude-plugin/plugin.json"));
  assert.equal(codex.name, "gost-svelte-spa-state");
  assert.equal(claude.name, codex.name);
  assert.equal(claude.version, codex.version);
  const skill = await readFile(join(root, "skills/gost-svelte-spa-state/SKILL.md"), "utf8");
  const recipe = await readFile(join(root, "skills/gost-svelte-spa-state/references/foundation.md"), "utf8");
  assert.match(skill, /references\/foundation\.md/);
  assert.match(recipe, /# Public API recipe/);
  assert.equal(existsSync(join(repository, "skills/gost-svelte-spa-state/SKILL.md")), false);
});

test("native marketplace catalogs select the same plugin directory", async () => {
  const codexPath = join(repository, ".agents/plugins/marketplace.json");
  const claudePath = join(repository, ".claude-plugin/marketplace.json");
  assert.ok(existsSync(codexPath) && existsSync(claudePath), "native marketplace catalogs are missing");
  const codex = await json(codexPath);
  const claude = await json(claudePath);
  assert.equal(codex.name, "gost");
  assert.equal(claude.name, codex.name);
  assert.equal(codex.plugins.length, 1);
  assert.equal(claude.plugins.length, 1);
  assert.equal(codex.plugins[0].source.path, `./${pluginPath}`);
  assert.equal(claude.plugins[0].source.source, "git-subdir");
  assert.equal(claude.plugins[0].source.path, pluginPath);
  assert.match(claude.plugins[0].source.sha, /^[a-f0-9]{40}$/);
});

test("the distribution contains its local API recipe", () => {
  assert.ok(existsSync(join(repository, pluginPath, "skills/gost-svelte-spa-state/references/foundation.md")),
    "required local reference foundation.md is missing from the distribution");
});


const broken = [
  ["different versions", ".claude-plugin/plugin.json", '{"name":"gost-svelte-spa-state","version":"0.9.0"}', /version/],
  ["different identities", ".claude-plugin/plugin.json", '{"name":"another","version":"0.1.0"}', /name/],
  ["invalid SemVer", ".codex-plugin/plugin.json", '{"name":"gost-svelte-spa-state","version":"01.2.3"}', /version/],
  ["malformed metadata", ".codex-plugin/plugin.json", "{", /plugin.json/],
  ["missing skill", "skills/gost-svelte-spa-state/SKILL.md", null, /SKILL.md/],
  ["missing recipe", "skills/gost-svelte-spa-state/references/foundation.md", null, /foundation.md/],
  ["escaping path", "skills/gost-svelte-spa-state/SKILL.md", "[outside](../../../outside.md)", /local link/],
  ["encoded escaping path", "skills/gost-svelte-spa-state/SKILL.md", "[outside](%2e%2e/%2e%2e/%2e%2e/outside.md)", /local link/],
  ["escaping file URI", "skills/gost-svelte-spa-state/SKILL.md", "[outside](file:///tmp/outside.md)", /local link/],
  ["forbidden fixture", "fixtures/private.md", "private", /unexpected file/],
] as const;

for (const [label, path, contents, expected] of broken) {
  test(`distribution validation rejects ${label} without changing files`, async (t) => {
    const root = await fixture(t);
    const target = join(root, pluginPath, path);
    if (contents === null) await rm(target);
    else {
      await mkdir(join(target, ".."), { recursive: true });
      await writeFile(target, contents);
    }
    const diagnostics = await checkPluginDistribution(root);
    assert.match(diagnostics.join("\n"), expected);
    if (contents !== null) assert.equal(await readFile(target, "utf8"), contents);
  });
}

test("distribution validation rejects catalog redirection and symlinked references", async (t) => {
  const root = await fixture(t);
  const catalog = await json(join(root, ".claude-plugin/marketplace.json"));
  const original = catalog.plugins[0].source;
  catalog.plugins[0].source = "./other-plugin";
  await writeFile(join(root, ".claude-plugin/marketplace.json"), JSON.stringify(catalog));
  assert.match((await checkPluginDistribution(root)).join("\n"), /source/);
  catalog.plugins[0].source = original;
  await writeFile(join(root, ".claude-plugin/marketplace.json"), JSON.stringify(catalog));
  const recipe = join(root, pluginPath, "skills/gost-svelte-spa-state/references/foundation.md");
  await rm(recipe);
  await symlink(join(repository, pluginPath, "skills/gost-svelte-spa-state/references/foundation.md"), recipe);
  assert.match((await checkPluginDistribution(root)).join("\n"), /symlink/);
});

test("a plugin-only patch version is validated independently of npm workspaces", async (t) => {
  const root = await fixture(t);
  for (const harness of ["codex", "claude"]) {
    const path = join(root, pluginPath, `.${harness}-plugin/plugin.json`);
    const manifest = await json(path);
    manifest.version = "0.1.1";
    await writeFile(path, JSON.stringify(manifest));
  }
  assert.match((await checkPluginDistribution(root)).join("\n"), /CHANGELOG.md/);
  const changelog = join(root, pluginPath, "CHANGELOG.md");
  await writeFile(changelog, "# Changelog\n\n## 0.1.1\n\nCompatible documentation correction.\n");
  await pin(root);
  assert.deepEqual(await checkPluginDistribution(root), []);
  assert.equal(existsSync(join(root, "package.json")), false);
});

test("external URI schemes are not mistaken for local files", async (t) => {
  const root = await fixture(t);
  const skill = join(root, pluginPath, "skills/gost-svelte-spa-state/SKILL.md");
  await writeFile(skill, "[Contact](mailto:maintainer@example.invalid)\n[Archive](ftp://example.invalid/docs)\n");
  await pin(root);
  assert.deepEqual(await checkPluginDistribution(root), []);
});

test("null metadata reports its file and still diagnoses an independent missing reference", async (t) => {
  const root = await fixture(t);
  await writeFile(join(root, pluginPath, ".codex-plugin/plugin.json"), "null");
  await rm(join(root, pluginPath, "skills/gost-svelte-spa-state/references/foundation.md"));
  const diagnostics = (await checkPluginDistribution(root)).join("\n");
  assert.match(diagnostics, /\.codex-plugin\/plugin.json:.*object/);
  assert.match(diagnostics, /foundation.md/);
  assert.doesNotMatch(diagnostics, /Cannot read properties/);
});

test("CLI checks the requested tree rather than a healthy current directory", async (t) => {
  const root = await fixture(t);
  await rm(join(root, pluginPath, "skills/gost-svelte-spa-state/references/foundation.md"));
  const result = spawnSync(process.execPath, [join(repository, "scripts/check-plugin-distribution.ts"), root], {
    cwd: repository, encoding: "utf8", timeout: 10000,
  });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /foundation.md/);
});


for (const [label, changes, expected] of [
  ["missing SHA", { sha: undefined }, /source\.sha must be a full/],
  ["invalid SHA", { sha: "main" }, /source\.sha must be a full/],
  ["unavailable SHA", { sha: "f".repeat(40) }, /source\.sha unavailable/],
  ["wrong URL", { url: "https://example.invalid/another.git" }, /source\.url must select/],
  ["wrong path", { path: "../outside" }, /source\.path differs/],
] as const) {
  test(`pinned source rejects ${label} without fallback`, async (t) => {
    const root = await fixture(t);
    assert.deepEqual(await checkPluginDistribution(root), []);
    const catalog = await json(join(root, ".claude-plugin/marketplace.json"));
    Object.assign(catalog.plugins[0].source, changes);
    await writeFile(join(root, ".claude-plugin/marketplace.json"), JSON.stringify(catalog));
    assert.match((await checkPluginDistribution(root)).join("\n"), expected);
  });
}

test("pinned source accepts a real commit but rejects a changed working tree", async (t) => {
  const root = await fixture(t);
  assert.deepEqual(await checkPluginDistribution(root), []);
  const recipe = join(root, pluginPath, "skills/gost-svelte-spa-state/references/foundation.md");
  const old = await readFile(recipe, "utf8");
  await writeFile(recipe, old + "\nChanged since the pin.\n");
  assert.match((await checkPluginDistribution(root)).join("\n"), /source.*content/);
  assert.equal(await readFile(recipe, "utf8"), old + "\nChanged since the pin.\n");
});
