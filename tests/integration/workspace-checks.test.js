import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { cp, mkdir, mkdtemp, readFile, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import test from "node:test";

const repository = resolve(import.meta.dirname, "../..");
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const save = (path, data) => writeFile(path, JSON.stringify(data, null, 2));

async function fixture(t) {
  const root = await mkdtemp(join(tmpdir(), "engist-metadata-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  for (const file of ["package.json", "package-lock.json"]) {
    await cp(join(repository, file), join(root, file));
  }
  const metadata = await readJson(join(root, "package.json"));
  for (const workspace of metadata.workspaces) {
    await mkdir(join(root, workspace), { recursive: true });
    await cp(join(repository, workspace, "package.json"), join(root, workspace, "package.json"));
  }
  return root;
}

const run = (root) => spawnSync(process.execPath, [join(repository, "scripts/check-workspaces.ts")], {
  cwd: root, encoding: "utf8", timeout: 30000,
});

async function snapshot(root) {
  const { workspaces } = await readJson(join(root, "package.json"));
  const paths = ["package.json", "package-lock.json", ...workspaces.map((workspace) => `${workspace}/package.json`)];
  return Promise.all(paths.map(async (path) => [path, await readFile(join(root, path), "utf8").catch((error) => error.code)]));
}

test("workspace check accepts five matching lock entries without any manifests or writes", async (t) => {
  const root = await fixture(t);
  const before = await snapshot(root);
  const result = run(root);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stderr, "");
  assert.deepEqual(await snapshot(root), before);
});

for (const workspace of ["packages/core", "packages/domains/frontend", "packages/technologies/typescript", "packages/technologies/svelte", "packages/stacks/frontend/svelte-spa"]) {
  for (const missing of [false, true]) {
    test(`workspace check rejects ${missing ? "missing" : "stale"} ${workspace} lock metadata without writes`, async (t) => {
      const root = await fixture(t);
      const lock = await readJson(join(root, "package-lock.json"));
      if (missing) delete lock.packages[workspace];
      else lock.packages[workspace].version = "0.0.9";
      await save(join(root, "package-lock.json"), lock);
      const before = await snapshot(root);
      const result = run(root);
      assert.notEqual(result.status, 0);
      assert.match(result.stderr, /lock.*(missing|version)/i);
      assert.ok(result.stderr.includes(workspace));
      assert.deepEqual(await snapshot(root), before);
    });
  }
}

for (const path of ["package.json", "package-lock.json", "packages/core/package.json"]) {
  for (const mode of ["missing", "malformed", "unreadable"]) {
    test(`workspace check diagnoses ${mode} ${path} without writes`, async (t) => {
      const root = await fixture(t);
      const target = join(root, path);
      await rm(target);
      if (mode === "malformed") await writeFile(target, "{broken");
      if (mode === "unreadable") await mkdir(target);
      const result = run(root);
      assert.notEqual(result.status, 0);
      assert.ok(result.stderr.includes(path));
      assert.match(result.stderr, /workspace check failed/i);
      if (mode === "malformed") assert.equal(await readFile(target, "utf8"), "{broken");
    });
  }
}

for (const stage of ["typecheck", "metadata"]) {
  test(`npm check stops before tests when ${stage} fails`, async (t) => {
    const root = await fixture(t);
    const metadata = await readJson(join(root, "package.json"));
    const actual = await readJson(join(repository, "package.json"));
    metadata.scripts = {
      ...actual.scripts,
      typecheck: stage === "typecheck" ? 'node -e "process.exit(7)"' : 'node -e "process.exit(0)"',
      test: 'node -e "require(\'fs\').writeFileSync(\'tests-reached\', \'yes\')"',
    };
    // Use the real repository script in a controlled root; no production test seam.
    await mkdir(join(root, "scripts"));
    await cp(join(repository, "scripts/check-workspaces.ts"), join(root, "scripts/check-workspaces.ts"));
    await symlink(join(repository, "node_modules"), join(root, "node_modules"), "dir");
    await save(join(root, "package.json"), metadata);
    if (stage === "metadata") {
      const lock = await readJson(join(root, "package-lock.json"));
      delete lock.packages["packages/core"];
      await save(join(root, "package-lock.json"), lock);
    }
    const result = spawnSync("npm", ["run", "check"], { cwd: root, encoding: "utf8", timeout: 30000 });
    assert.notEqual(result.status, 0);
    assert.doesNotMatch(result.stderr, /Missing script/);
    await assert.rejects(readFile(join(root, "tests-reached")), { code: "ENOENT" });
    if (stage === "metadata") assert.match(result.stderr, /lock.*missing/i);
  });
}

test("workspace read failure retains earlier diagnostics and stops later workspaces", async (t) => {
  const root = await fixture(t);
  const { checkWorkspaces } = await import("../../scripts/check-workspaces.ts");
  const metadata = await readJson(join(root, "package.json"));
  const [first, second, third] = metadata.workspaces;
  const lock = await readJson(join(root, "package-lock.json"));
  delete lock.packages[first];
  delete lock.packages[third];
  await save(join(root, "package-lock.json"), lock);
  await writeFile(join(root, second, "package.json"), "{");
  const before = await snapshot(root);
  const diagnostics = await checkWorkspaces(root);
  assert.equal(diagnostics.length, 2);
  assert.equal(diagnostics[0], `${first}: workspace lock entry missing.`);
  assert.ok(diagnostics[1].startsWith(`Workspace check failed: ${second}/package.json: `));
  assert.deepEqual(await snapshot(root), before);
});
