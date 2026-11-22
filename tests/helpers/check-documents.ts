import { readFile, readdir, realpath, stat } from "node:fs/promises";
import { dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { marked } from "marked";

type Inside = (path: string) => boolean;

function checkForbiddenFiles(files: string[], name: string): string[] {
  const diagnostics: string[] = [];
  for (const file of files) {
    if (file.split(sep).some((part) => ["tests", "fixtures", "docs-review", ".git", ".idea", ".agents", ".claude", ".superpowers", ".worktrees", "node_modules", "schemas", "manifest.json"].includes(part))) {
      diagnostics.push(`${name}: ${file}: forbidden packaged file.`);
    }
  }
  return diagnostics;
}

async function checkRequiredDocuments(canonical: string, name: string, inside: Inside): Promise<string[]> {
  const diagnostics: string[] = [];
  for (const file of ["README.md", "LICENSE", "CHANGELOG.md"]) {
    try {
      const actual = await realpath(join(canonical, file));
      if (!inside(actual) || !(await readFile(actual, "utf8")).trim()) throw new Error("invalid required document");
    } catch { diagnostics.push(`${name}: ${file}: required document missing or unreadable.`); }
  }
  return diagnostics;
}

async function checkDocumentLinks(canonical: string, files: string[], name: string, inside: Inside) {
  const diagnostics: string[] = [];
  const indexed = new Set<string>();
  for (const file of files.filter((file) => file.endsWith(".md"))) {
    try {
      const path = await realpath(join(canonical, file));
      if (!inside(path)) throw new Error("document escapes package root");
      const links: string[] = [];
      marked.walkTokens(marked.lexer(await readFile(path, "utf8")), (token) => {
        if (token.type === "link" || token.type === "image") links.push(token.href);
      });
      for (const href of links) {
        if (/^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith("//")) continue;
        try {
          const local = href.split(/[?#]/)[0];
          const target = local ? resolve(dirname(path), decodeURIComponent(local)) : path;
          if (!inside(target)) throw new Error("link escapes package root");
          const actual = await realpath(target);
          if (!inside(actual) || !(await stat(actual)).isFile()) throw new Error("invalid local document");
          if (file === "README.md") indexed.add(relative(canonical, actual));
        } catch { diagnostics.push(`${name}: ${file}: invalid local link ${href}.`); }
      }
    } catch { diagnostics.push(`${name}: ${file}: document missing, unreadable or outside package.`); }
  }
  return { diagnostics, indexed };
}

function checkReadmeIndex(files: string[], indexed: Set<string>, name: string): string[] {
  const diagnostics: string[] = [];
  for (const file of files.filter((file) => file.endsWith(".md") && !["README.md", "CHANGELOG.md"].includes(file))) {
    if (!indexed.has(file)) diagnostics.push(`${name}: ${file}: document not indexed by README.md.`);
  }
  return diagnostics;
}

// Test-only inspection of actual workspace/installed documents, not a product catalog.
export async function checkDocuments(root: string, name: string): Promise<string[]> {
  const canonical = await realpath(root);
  const files = (await readdir(canonical, { recursive: true, withFileTypes: true }))
    .filter((entry) => entry.isFile() || entry.isSymbolicLink())
    .map((entry) => relative(canonical, join(entry.parentPath, entry.name)));
  const inside = (path: string) => {
    const rel = relative(canonical, path);
    return !isAbsolute(rel) && rel !== ".." && !rel.startsWith(`..${sep}`);
  };
  const diagnostics = checkForbiddenFiles(files, name);
  diagnostics.push(...await checkRequiredDocuments(canonical, name, inside));
  const links = await checkDocumentLinks(canonical, files, name, inside);
  return diagnostics.concat(links.diagnostics, checkReadmeIndex(files, links.indexed, name));
}
