import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { checkAcceptedHeaders } from "../helpers/check-accepted-headers.ts";
import { installOffline } from "../helpers/install-offline.ts";

const names = ["@antonsmolko/standards-core", "@antonsmolko/standards-typescript", "@antonsmolko/standards-svelte-spa"];
const accepted = "# Synthetic requirement\n\nID: FIXTURE-001.\n\nStatus: accepted. Level: required.\n\n## Requirement\n\nSynthetic test content.\n";

test("installed headers require accepted IDs from each required package without writing files", async (t) => {
  const root = await mkdtemp(join(tmpdir(), "standards-accepted-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const tarballs: string[] = [];
  for (const [index, name] of names.entries()) {
    const source = join(root, `source-${index}`);
    await mkdir(join(source, "requirements"), { recursive: true });
    await writeFile(join(source, "package.json"), JSON.stringify({ name, version: "0.0.0", files: ["requirements"] }));
    await writeFile(join(source, "requirements/standard.md"), accepted);
    const [artifact] = JSON.parse(execFileSync("npm", ["pack", source, "--json", "--ignore-scripts", "--pack-destination", root], { encoding: "utf8", timeout: 30000 }));
    tarballs.push(join(root, artifact.filename));
  }
  const consumer = join(root, "consumer");
  await mkdir(consumer);
  await writeFile(join(consumer, "package.json"), JSON.stringify({ private: true }));
  installOffline(consumer, tarballs);
  const roots = names.map((name) => join(consumer, "node_modules", name));
  const standard = join(roots[0], "requirements/standard.md");

  await t.test("complete synthetic accepted set is ready", async () => {
    assert.deepEqual(await checkAcceptedHeaders(roots), { ready: true, diagnostics: [] });
    assert.equal(await readFile(standard, "utf8"), accepted);
  });
  for (const [label, input] of [
    ["missing package", roots.slice(0, 2)],
    ["duplicate package cannot replace another", [roots[0], roots[1], roots[0]]],
  ] as const) {
    await t.test(label, async () => {
      const result = await checkAcceptedHeaders([...input]);
      assert.equal(result.ready, false);
      assert.ok(result.diagnostics.some((line) => line.includes(names[2])));
    });
  }
  const cases = [
    ["missing ID", accepted.replace("ID: FIXTURE-001.", "")],
    ["empty ID", accepted.replace("ID: FIXTURE-001.", "ID:   ")],
    ["missing status", accepted.replace("Status: accepted. Level: required.", "")],
    ["proposed status", accepted.replace("accepted.", "proposed (draft; not approved).")],
    ["unknown status", accepted.replace("accepted.", "unknown.")],
    ["accepted draft suffix", accepted.replace("accepted.", "accepted (draft; not approved).")],
    ["code example", `# Example\n\n\`\`\`markdown\n${accepted}\n\`\`\`\n`],
    ["metadata in body", "# Requirement\n\n## Example\n\nID: FIXTURE-001.\n\nStatus: accepted.\n"],
    ["inline code ID value", accepted.replace("ID: FIXTURE-001.", "ID: `FIXTURE-001`.")],
  ];
  for (const [label, content] of cases) {
    await t.test(label, async () => {
      await writeFile(standard, content);
      const result = await checkAcceptedHeaders(roots);
      assert.equal(result.ready, false);
      assert.ok(result.diagnostics.some((line) => line.includes(names[0]) && line.includes("accepted ID")));
      assert.equal(await readFile(standard, "utf8"), content);
    });
  }
  await t.test("README metadata does not replace a standard", async () => {
    await writeFile(standard, "# No accepted metadata\n");
    await writeFile(join(roots[0], "README.md"), accepted);
    assert.equal((await checkAcceptedHeaders(roots)).ready, false);
  });
});

test("header check reads metadata of non-required roots before skipping their documents", async (t) => {
  const root = await mkdtemp(join(tmpdir(), "standards-header-metadata-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const metadata = join(root, "package.json");
  await writeFile(metadata, JSON.stringify({ name: "@test/not-required" }));
  assert.deepEqual(await checkAcceptedHeaders([root]), {
    ready: false,
    diagnostics: names.map((name) => `${name}: missing accepted ID in installed document headers.`),
  });
  await writeFile(metadata, "{");
  await assert.rejects(checkAcceptedHeaders([root]), SyntaxError);
  assert.equal(await readFile(metadata, "utf8"), "{");
});
