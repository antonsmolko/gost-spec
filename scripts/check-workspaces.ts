import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Repository metadata is maintainer-controlled; tests inspect the actual document packages.
async function readJson<T>(root: string, path: string): Promise<T> {
  try {
    return JSON.parse(await readFile(join(root, path), "utf8")) as T;
  } catch (error) {
    throw new Error(`${path}: ${(error as Error).message}`);
  }
}

function checkLockEntry(path: string, pkg: { version: string }, entry: { version?: string } | undefined): string[] {
  if (!entry) return [`${path}: workspace lock entry missing.`];
  if (entry.version !== pkg.version) return [`${path}: workspace lock version differs from package.json.`];
  return [];
}

export async function checkWorkspaces(root: string): Promise<string[]> {
  const diagnostics: string[] = [];
  try {
    const { workspaces } = await readJson<{ workspaces: string[] }>(root, "package.json");
    const lock = await readJson<{ packages: Record<string, { version?: string } | undefined> }>(root, "package-lock.json");
    for (const path of workspaces) {
      const pkg = await readJson<{ version: string }>(root, `${path}/package.json`);
      const entry = lock.packages[path];
      diagnostics.push(...checkLockEntry(path, pkg, entry));
    }
  } catch (error) {
    diagnostics.push(`Workspace check failed: ${(error as Error).message}`);
  }
  return diagnostics;
}

if (import.meta.main) {
  const diagnostics = await checkWorkspaces(process.cwd());
  if (diagnostics.length) {
    console.error(diagnostics.join("\n"));
    process.exitCode = 1;
  }
}
