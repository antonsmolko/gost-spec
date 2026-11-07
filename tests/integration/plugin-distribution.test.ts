import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { cp, mkdir, mkdtemp, readFile, readdir, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { join, resolve } from "node:path";
import test, { type TestContext } from "node:test";
import { checkPluginDistribution } from "../../scripts/check-plugin-distribution.ts";

const repository = resolve(import.meta.dirname, "../..");
const pluginPath = "plugins/gost-svelte-shell";
const json = async (path: string) => JSON.parse(await readFile(path, "utf8"));

const catalogEntry = (catalog: Awaited<ReturnType<typeof json>>, name: string) => {
  const entry = catalog.plugins.find((entry: { name: string }) => entry.name === name);
  assert.ok(entry, `missing plugin entry ${name}`);
  return entry;
};

const fixture = async (t: TestContext) => {
  const root = await mkdtemp(join(tmpdir(), "gost-plugin-check-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  await cp(join(repository, "plugins"), join(root, "plugins"), { recursive: true });
  for (const catalog of [".agents/plugins/marketplace.json", ".claude-plugin/marketplace.json"]) {
    await mkdir(join(root, catalog, ".."), { recursive: true });
    await cp(join(repository, catalog), join(root, catalog));
  }
  return root;
};

test("draft distribution accepts a local snapshot without Git metadata or a release tag", async (t) => {
  const root = await fixture(t);
  assert.equal(existsSync(join(root, ".git")), false, "file-only fixture must not contain Git metadata");
  const path = join(root, ".claude-plugin/marketplace.json");
  const catalog = await json(path);
  catalogEntry(catalog, "gost-svelte-shell").source = "./plugins/gost-svelte-shell";
  await writeFile(path, JSON.stringify(catalog));
  assert.deepEqual(await checkPluginDistribution(root), []);
  const result = spawnSync(process.execPath, [join(repository, "scripts/check-plugin-distribution.ts"), root], {
    encoding: "utf8", env: { ...process.env, PATH: "" }, timeout: 10000,
  });
  assert.equal(result.status, 0, result.stderr);
});

test("draft distribution refuses legacy Git sources and local sources with a second revision selector", async (t) => {
  const root = await fixture(t);
  const claudePath = join(root, ".claude-plugin/marketplace.json");
  const legacy = await json(claudePath);
  catalogEntry(legacy, "gost-svelte-shell").source = { source: "git-subdir", url: "https://github.com/antonsmolko/gost-spec.git", path: pluginPath, sha: "f".repeat(40) };
  await writeFile(claudePath, JSON.stringify(legacy));
  assert.match((await checkPluginDistribution(root)).join("\n"), /marketplace.json:.*source/);
  const claude = await json(claudePath);
  catalogEntry(claude, "gost-svelte-shell").source = "./plugins/gost-svelte-shell";
  await writeFile(claudePath, JSON.stringify(claude));
  const codexPath = join(root, ".agents/plugins/marketplace.json");
  const codex = await json(codexPath);
  catalogEntry(codex, "gost-svelte-shell").source.ref = "main";
  await writeFile(codexPath, JSON.stringify(codex));
  assert.match((await checkPluginDistribution(root)).join("\n"), /\.agents\/plugins\/marketplace.json:.*source/);
});

test("both harness manifests expose the same independently versioned skill", async () => {
  const root = join(repository, pluginPath);
  assert.ok(existsSync(root), "self-contained plugin distribution is missing");
  const codex = await json(join(root, ".codex-plugin/plugin.json"));
  const claude = await json(join(root, ".claude-plugin/plugin.json"));
  assert.equal(codex.name, "gost-svelte-shell");
  assert.equal(claude.name, codex.name);
  assert.equal(claude.version, codex.version);
  const skill = await readFile(join(root, "skills/gost-svelte-shell/SKILL.md"), "utf8");
  const recipe = await readFile(join(root, "skills/gost-svelte-shell/references/foundation.md"), "utf8");
  assert.match(skill, /references\/foundation\.md/);
  assert.match(skill, /^name: gost-svelte-shell$/m);
  assert.equal(existsSync(join(repository, "plugins/gost-svelte-spa-state")), false, "old plugin tree must be absent from the current repository working tree");
  const authoring = join(repository, "skills");
  assert.deepEqual(existsSync(authoring) ? await readdir(authoring, { recursive: true }) : [], [],
    "top-level skills/ must be absent or empty; author-maintained skills belong under plugins/");
  assert.match(recipe, /# Public API recipe/);
});

test("native marketplace catalogs select the same plugin directory", async () => {
  const codexPath = join(repository, ".agents/plugins/marketplace.json");
  const claudePath = join(repository, ".claude-plugin/marketplace.json");
  assert.ok(existsSync(codexPath) && existsSync(claudePath), "native marketplace catalogs are missing");
  const codex = await json(codexPath);
  const claude = await json(claudePath);
  assert.equal(codex.name, "gost");
  assert.equal(claude.name, codex.name);
  assert.equal(codex.plugins.length, 3);
  assert.equal(claude.plugins.length, 3);
  assert.equal(catalogEntry(codex, "gost-svelte-shell").source.path, `./${pluginPath}`);
  assert.equal(catalogEntry(claude, "gost-svelte-shell").source, `./${pluginPath}`);
  assert.equal(catalogEntry(codex, "gost-functional-core").name, "gost-functional-core");
  assert.equal(catalogEntry(claude, "gost-functional-core").name, "gost-functional-core");
  assert.equal(catalogEntry(codex, "gost-functional-core").source.path, "./plugins/gost-functional-core");
  assert.equal(catalogEntry(claude, "gost-functional-core").source, "./plugins/gost-functional-core");
});

test("catalog validation accepts both independent entries in either order", async (t) => {
  const root = await fixture(t);
  for (const path of [".agents/plugins/marketplace.json", ".claude-plugin/marketplace.json"]) {
    const catalog = await json(join(root, path));
    catalog.plugins.reverse();
    await writeFile(join(root, path), JSON.stringify(catalog));
    assert.equal(catalogEntry(catalog, "gost-svelte-shell").name, "gost-svelte-shell");
    assert.equal(catalogEntry(catalog, "gost-functional-core").name, "gost-functional-core");
  }
  assert.deepEqual(await checkPluginDistribution(root), []);
});

const functionalCorePath = "plugins/gost-functional-core";
test("two independent plugin trees pass with local sources and distinct versions", async (t) => {
  const root = await fixture(t);
  const shell = await json(join(root, pluginPath, ".codex-plugin/plugin.json"));
  const core = await json(join(root, functionalCorePath, ".codex-plugin/plugin.json"));
  assert.equal(core.name, "gost-functional-core");
  assert.equal(core.version, "0.1.0");
  assert.equal(shell.version, "0.2.1");
  assert.deepEqual(await checkPluginDistribution(root), []);
});

for (const catalogPath of [".agents/plugins/marketplace.json", ".claude-plugin/marketplace.json"]) {
  for (const problem of ["missing", "duplicate", "unknown", "redirect"] as const) {
    test(`two-plugin catalog rejects ${problem} FC entry in ${catalogPath}`, async (t) => {
      const root = await fixture(t);
      const path = join(root, catalogPath);
      const catalog = await json(path);
      const core = catalog.plugins.find((entry: { name: string }) => entry.name === "gost-functional-core");
      assert.ok(core, "FC catalog entry is required for the negative case");
      if (problem === "missing") catalog.plugins = catalog.plugins.filter((entry: { name: string }) => entry !== core);
      if (problem === "duplicate") catalog.plugins.push(core);
      if (problem === "unknown") core.name = "unknown-plugin";
      if (problem === "redirect") core.source = catalogEntry(catalog, "gost-svelte-shell").source;
      await writeFile(path, JSON.stringify(catalog));
      assert.match((await checkPluginDistribution(root)).join("\n"), /marketplace.json:.*(identity|entries|source)/);
    });
  }
}

test("FC version mismatch and cross-plugin references report the affected plugin", async (t) => {
  const root = await fixture(t);
  const path = join(root, functionalCorePath, ".claude-plugin/plugin.json");
  const manifest = await json(path);
  manifest.version = "0.1.1";
  await writeFile(path, JSON.stringify(manifest));
  await writeFile(join(root, functionalCorePath, "skills/gost-functional-core/SKILL.md"),
    "[shell](../../../gost-svelte-shell/README.md)\n");
  const diagnostics = (await checkPluginDistribution(root)).join("\n");
  assert.match(diagnostics, /gost-functional-core.*versions differ/);
  assert.match(diagnostics, /gost-functional-core.*invalid local link/);
});

test("a second root skills tree is rejected while checking both plugin trees", async (t) => {
  const root = await fixture(t);
  await mkdir(join(root, "skills/rogue"), { recursive: true });
  await writeFile(join(root, "skills/rogue/SKILL.md"), "private input");
  assert.match((await checkPluginDistribution(root)).join("\n"), /skills.*(root|plugins)/);
});

test("the distribution contains its local API recipe", () => {
  assert.ok(existsSync(join(repository, pluginPath, "skills/gost-svelte-shell/references/foundation.md")),
    "required local reference foundation.md is missing from the distribution");
});


const broken = [
  ["different versions", ".claude-plugin/plugin.json", '{"name":"gost-svelte-shell","version":"0.9.0"}', /version/],
  ["different identities", ".claude-plugin/plugin.json", '{"name":"another","version":"0.1.0"}', /name/],
  ["invalid SemVer", ".codex-plugin/plugin.json", '{"name":"gost-svelte-shell","version":"01.2.3"}', /version/],
  ["malformed metadata", ".codex-plugin/plugin.json", "{", /plugin.json/],
  ["missing skill", "skills/gost-svelte-shell/SKILL.md", null, /SKILL.md/],
  ["missing recipe", "skills/gost-svelte-shell/references/foundation.md", null, /foundation.md/],
  ["escaping path", "skills/gost-svelte-shell/SKILL.md", "[outside](../../../outside.md)", /local link/],
  ["encoded escaping path", "skills/gost-svelte-shell/SKILL.md", "[outside](%2e%2e/%2e%2e/%2e%2e/outside.md)", /local link/],
  ["escaping file URI", "skills/gost-svelte-shell/SKILL.md", "[outside](file:///tmp/outside.md)", /local link/],
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
  const original = catalogEntry(catalog, "gost-svelte-shell").source;
  catalogEntry(catalog, "gost-svelte-shell").source = "./other-plugin";
  await writeFile(join(root, ".claude-plugin/marketplace.json"), JSON.stringify(catalog));
  assert.match((await checkPluginDistribution(root)).join("\n"), /source/);
  catalogEntry(catalog, "gost-svelte-shell").source = original;
  await writeFile(join(root, ".claude-plugin/marketplace.json"), JSON.stringify(catalog));
  const recipe = join(root, pluginPath, "skills/gost-svelte-shell/references/foundation.md");
  await rm(recipe);
  await symlink(join(repository, pluginPath, "skills/gost-svelte-shell/references/foundation.md"), recipe);
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
  assert.deepEqual(await checkPluginDistribution(root), []);
  assert.equal(existsSync(join(root, "package.json")), false);
});

test("external URI schemes are not mistaken for local files", async (t) => {
  const root = await fixture(t);
  const skill = join(root, pluginPath, "skills/gost-svelte-shell/SKILL.md");
  await writeFile(skill, "[Contact](mailto:maintainer@example.invalid)\n[Archive](ftp://example.invalid/docs)\n");
  assert.deepEqual(await checkPluginDistribution(root), []);
});

test("null metadata reports its file and still diagnoses an independent missing reference", async (t) => {
  const root = await fixture(t);
  await writeFile(join(root, pluginPath, ".codex-plugin/plugin.json"), "null");
  await rm(join(root, pluginPath, "skills/gost-svelte-shell/references/foundation.md"));
  const diagnostics = (await checkPluginDistribution(root)).join("\n");
  assert.match(diagnostics, /\.codex-plugin\/plugin.json:.*object/);
  assert.match(diagnostics, /foundation.md/);
  assert.doesNotMatch(diagnostics, /Cannot read properties/);
});

test("CLI checks the requested tree rather than a healthy current directory", async (t) => {
  const root = await fixture(t);
  await rm(join(root, pluginPath, "skills/gost-svelte-shell/references/foundation.md"));
  const result = spawnSync(process.execPath, [join(repository, "scripts/check-plugin-distribution.ts"), root], {
    cwd: repository, encoding: "utf8", timeout: 10000,
  });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /foundation.md/);
});


for (const [label, source, reason] of [
  ["missing source", undefined, /source is missing/],
  ["null source", null, /source must be a relative path string/],
  ["numeric source", 42, /source must be a relative path string/],
  ["array source", [], /source must be a relative path string/],
  ["external Git source", { source: "url", url: "https://example.invalid/another.git" }, /source must be a relative path string/],
  ["legacy source", { source: "git-subdir", path: pluginPath, sha: "f".repeat(40) }, /legacy git-subdir source/],
  ["absolute path", "/plugins/gost-svelte-shell", /source path differs/],
  ["escaping path", "../outside", /source path differs/],
  ["different directory", "./plugins/other", /source path differs/],
] as const) {
  test(`Claude snapshot rejects ${label} with a specific reason`, async (t) => {
    const root = await fixture(t);
    assert.deepEqual(await checkPluginDistribution(root), []);
    const path = join(root, ".claude-plugin/marketplace.json");
    const catalog = await json(path);
    catalogEntry(catalog, "gost-svelte-shell").source = source;
    await writeFile(path, JSON.stringify(catalog));
    const diagnostics = (await checkPluginDistribution(root)).join("\n");
    assert.match(diagnostics, /\.claude-plugin\/marketplace.json:/);
    assert.match(diagnostics, reason);
    assert.match(diagnostics, /expected .*\.\/plugins\/gost-svelte-shell/);
  });
}

for (const [label, source] of [
  ["missing source", undefined],
  ["null source", null],
  ["string source", "./plugins/gost-svelte-shell"],
  ["array source", []],
  ["remote source kind", { source: "url", path: "./plugins/gost-svelte-shell" }],
  ["missing source kind", { path: "./plugins/gost-svelte-shell" }],
  ["missing path", { source: "local" }],
  ["different directory", { source: "local", path: "./plugins/other" }],
  ["absolute path", { source: "local", path: "/plugins/gost-svelte-shell" }],
  ["escaping path", { source: "local", path: "../outside" }],
  ["extra ref", { source: "local", path: "./plugins/gost-svelte-shell", ref: "main" }],
  ["extra SHA", { source: "local", path: "./plugins/gost-svelte-shell", sha: "f".repeat(40) }],
  ["extra URL", { source: "local", path: "./plugins/gost-svelte-shell", url: "https://example.invalid/another.git" }],
] as const) {
  test(`Codex snapshot rejects ${label} without fallback`, async (t) => {
    const root = await fixture(t);
    assert.deepEqual(await checkPluginDistribution(root), []);
    const path = join(root, ".agents/plugins/marketplace.json");
    const catalog = await json(path);
    catalogEntry(catalog, "gost-svelte-shell").source = source;
    await writeFile(path, JSON.stringify(catalog));
    const diagnostics = (await checkPluginDistribution(root)).join("\n");
    assert.match(diagnostics, /\.agents\/plugins\/marketplace.json:.*source/);
    assert.equal(await readFile(path, "utf8"), JSON.stringify(catalog), "validation must not repair the rejected source");
  });
}

test("presenter is an independent third plugin with contained references", async (t) => {
  const root = await fixture(t);
  const presenter = "plugins/gost-view-presenter";
  const codex = await json(join(root, presenter, ".codex-plugin/plugin.json"));
  const claude = await json(join(root, presenter, ".claude-plugin/plugin.json"));
  assert.equal(codex.name, "gost-view-presenter");
  assert.equal(codex.version, "0.1.0");
  assert.equal(claude.name, codex.name);
  assert.equal(claude.version, codex.version);
  assert.deepEqual(await checkPluginDistribution(root), []);
  const skill = join(root, presenter, "skills/gost-view-presenter/SKILL.md");
  await writeFile(skill, (await readFile(skill, "utf8")) + "\n[Sibling](../../../gost-functional-core/README.md)\n");
  assert.match((await checkPluginDistribution(root)).join("\n"), /gost-view-presenter.*invalid local link/);
});

test("presenter catalog and content failures are diagnosed independently", async (t) => {
  const root = await fixture(t);
  const directory = join(root, "plugins/gost-view-presenter");
  await rm(directory, { recursive: true, force: true });
  assert.match((await checkPluginDistribution(root)).join("\n"), /gost-view-presenter/);
  await cp(join(repository, "plugins/gost-view-presenter"), directory, { recursive: true });
  const manifest = join(directory, ".claude-plugin/plugin.json");
  const value = await json(manifest);
  value.version = "0.9.0";
  await writeFile(manifest, JSON.stringify(value));
  assert.match((await checkPluginDistribution(root)).join("\n"), /gost-view-presenter.*versions differ/);
  value.version = "0.1.0";
  await writeFile(manifest, JSON.stringify(value));
  const catalogPath = join(root, ".agents/plugins/marketplace.json");
  const catalog = await json(catalogPath);
  catalog.plugins.push(catalogEntry(catalog, "gost-view-presenter"));
  await writeFile(catalogPath, JSON.stringify(catalog));
  assert.match((await checkPluginDistribution(root)).join("\n"), /plugin entries must contain exactly one gost-view-presenter/);
});
