import { lstat, readFile, readdir, realpath } from "node:fs/promises";
import { dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { marked } from "marked";

const name = "gost-svelte-shell";
const directory = `plugins/${name}`;
const files = [
  ".codex-plugin/plugin.json", ".claude-plugin/plugin.json",
  "README.md", "LICENSE", "CHANGELOG.md", "assets/icon.png",
  `skills/${name}/SKILL.md`, `skills/${name}/references/foundation.md`,
];
// SemVer 2.0.0: numeric prerelease identifiers may not have leading zeroes.
const number = "(?:0|[1-9]\\d*)";
const identifier = `(?:${number}|[\\da-zA-Z-]*[a-zA-Z-][\\da-zA-Z-]*)`;
const versionPattern = new RegExp(`^${number}\\.${number}\\.${number}(?:-${identifier}(?:\\.${identifier})*)?(?:\\+[\\da-zA-Z-]+(?:\\.[\\da-zA-Z-]+)*)?$`);

export async function checkPluginDistribution(root: string): Promise<string[]> {
  const diagnostics: string[] = [];
  const report = (path: string, message: string) => diagnostics.push(`${path}: ${message}`);
  try {
    const repository = await realpath(root);
    const plugin = join(repository, directory);
    const inside = (target: string) => {
      const path = relative(plugin, target);
      return !isAbsolute(path) && path !== ".." && !path.startsWith(`..${sep}`);
    };
    if ((await lstat(plugin)).isSymbolicLink()) throw new Error(`${directory}: symlink plugin root`);
    if (await realpath(plugin) !== plugin) throw new Error(`${directory}: symlink ancestor`);
    const json = async (path: string) => {
      try {
        const value = JSON.parse(await readFile(join(repository, path), "utf8"));
        if (value === null || typeof value !== "object" || Array.isArray(value)) {
          throw new Error("metadata must be a JSON object");
        }
        return value;
      } catch (error) {
        report(path, (error as Error).message);
        return {};
      }
    };
    const codex = await json(`${directory}/.codex-plugin/plugin.json`);
    const claude = await json(`${directory}/.claude-plugin/plugin.json`);
    for (const [path, manifest] of [[".codex-plugin/plugin.json", codex], [".claude-plugin/plugin.json", claude]] as const) {
      if (manifest.name !== name) report(path, "plugin name differs from distribution identity");
      if (typeof manifest.version !== "string" || !versionPattern.test(manifest.version)) report(path, "invalid SemVer version");
    }
    if (codex.version !== claude.version) report(directory, "harness versions differ");
    if (codex.skills !== "./skills/") report(".codex-plugin/plugin.json", "skills source must select the shared skills directory");
    if (claude.icon !== "./assets/icon.png") report(".claude-plugin/plugin.json", "icon source must select the packaged icon");
    for (const [path, harness] of [[".agents/plugins/marketplace.json", "codex"], [".claude-plugin/marketplace.json", "claude"]] as const) {
      const catalog = await json(path);
      const entries = catalog.plugins;
      const entry = Array.isArray(entries) && entries.length === 1 ? entries[0] : undefined;
      if (catalog.name !== "gost" || entry?.name !== name) report(path, "catalog identity or plugin entries differ");
      const source = entry?.source;
      if (harness === "codex") {
        if (!source || typeof source !== "object" || Array.isArray(source) ||
            source.path !== `./${directory}` || source.source !== "local" ||
            Object.keys(source).some((key) => !["source", "path"].includes(key))) {
          report(path, "catalog source must select only the shared local plugin directory");
        }
      } else if (source !== `./${directory}`) {
        report(path, "catalog source must select the shared local plugin directory");
      }
    }
    for (const file of files) {
      try {
        const path = join(plugin, file);
        if (!inside(await realpath(path)) || !(await lstat(path)).isFile()) throw new Error("missing, symlinked or outside plugin root");
        if (!(await readFile(path)).length) throw new Error("empty file");
      } catch (error) { report(file, (error as Error).message); }
    }
    const entries = await readdir(plugin, { recursive: true, withFileTypes: true });
    for (const entry of entries) {
      const path = join(entry.parentPath, entry.name);
      const file = relative(plugin, path).split(sep).join("/");
      if (entry.isSymbolicLink()) report(file, "symlink is forbidden in plugin distribution");
      else if (entry.isFile() && !files.includes(file)) report(file, "unexpected file in plugin distribution");
    }
    const changelog = await readFile(join(plugin, "CHANGELOG.md"), "utf8");
    if (!changelog.split("\n").some((line) => line === `## ${codex.version}` || line.startsWith(`## ${codex.version} (`))) report("CHANGELOG.md", "current version entry missing");
    for (const file of files.filter((file) => file.endsWith(".md"))) {
      const path = join(plugin, file);
      try {
        const links: string[] = [];
        marked.walkTokens(marked.lexer(await readFile(path, "utf8")), (token) => {
          if (token.type === "link" || token.type === "image") links.push(token.href);
        });
        for (const href of links) {
          if ((/^[a-z][a-z0-9+.-]*:/i.test(href) && !/^file:/i.test(href)) || href.startsWith("//")) continue;
          try {
            const local = href.split(/[?#]/)[0];
            const target = /^file:/i.test(local) ? fileURLToPath(local) : local ? resolve(dirname(path), decodeURIComponent(local)) : path;
            if (!inside(target) || !inside(await realpath(target)) || !(await lstat(target)).isFile()) throw new Error("outside root or not a file");
          } catch { report(file, `invalid local link ${href}`); }
        }
      } catch (error) { report(file, (error as Error).message); }
    }
  } catch (error) {
    diagnostics.push(`Plugin distribution check failed: ${(error as Error).message}`);
  }
  return diagnostics;
}

if (import.meta.main) {
  if (process.argv.length > 3) {
    console.error("Usage: node scripts/check-plugin-distribution.ts [repository-root]");
    process.exit(2);
  }
  const diagnostics = await checkPluginDistribution(process.argv[2] ?? process.cwd());
  if (diagnostics.length) {
    console.error(diagnostics.join("\n"));
    process.exitCode = 1;
  }
}
