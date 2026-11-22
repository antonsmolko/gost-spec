import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { marked } from "marked";

const required = ["@antonsmolko/standards-core", "@antonsmolko/standards-typescript", "@antonsmolko/standards-svelte-spa"];

function hasAcceptedHeader(source: string): boolean {
  const tokens = marked.lexer(source);
  if (tokens[0]?.type !== "heading" || tokens[0].depth !== 1) return false;
  const header: string[] = [];
  for (const token of tokens.slice(1)) {
    if (token.type === "space") continue;
    if (token.type !== "paragraph") break;
    // Plain paragraphs only: fenced/inline code and formatted examples cannot qualify.
    if (token.tokens?.every((inline) => inline.type === "text")) header.push(token.text);
  }
  const lines = header.join("\n").split(/\r?\n/);
  const id = lines.find((line) => line.startsWith("ID:"))?.slice(3).trim().replace(/\.$/, "").trim();
  const status = lines.find((line) => line.startsWith("Status:"))?.slice(7).trim();
  return Boolean(id && status && /^accepted(?:\.(?:\s+Level:.*)?|)$/.test(status));
}

// Test-only prerequisite: accepted headers do not establish owner approval or applicability.
export async function checkAcceptedHeaders(roots: string[]): Promise<{ ready: boolean; diagnostics: string[] }> {
  const accepted = new Set<string>();
  for (const root of roots) {
    const { name } = JSON.parse(await readFile(join(root, "package.json"), "utf8"));
    if (!required.includes(name)) continue;
    const files = await readdir(root, { recursive: true, withFileTypes: true });
    for (const file of files.filter((entry) => entry.isFile() && entry.name.endsWith(".md") && !["README.md", "CHANGELOG.md"].includes(entry.name))) {
      const source = await readFile(join(file.parentPath, file.name), "utf8");
      if (hasAcceptedHeader(source)) accepted.add(name);
    }
  }
  const diagnostics = required.filter((name) => !accepted.has(name)).map((name) => `${name}: missing accepted ID in installed document headers.`);
  return { ready: diagnostics.length === 0, diagnostics };
}
