import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import ts from 'typescript';

// Synthetic fixture audit, not a general consumer lint framework.
const root = path.resolve('src');
const files = new Map<string, string>();
const read = (directory: string) => {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const name = path.join(directory, entry.name);
    if (entry.isDirectory()) read(name);
    else if (/\.(ts|svelte)$/.test(name) && !name.endsWith('.test.ts')) files.set(name, readFileSync(name, 'utf8'));
  }
};
read(root);

const audit = (sources: Map<string, string>) => {
  const errors: string[] = [];
  const graph = new Map<string, string[]>();
  const scenario = (name: string) => name.match(/\/features\/users\/(list|create|update)\//)?.[1];
  for (const [name, source] of sources) {
    const text = name.endsWith('.svelte')
      ? [...source.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]).join('\n') : source;
    const ast = ts.createSourceFile(name, text, ts.ScriptTarget.Latest, true);
    const runtime: string[] = [];
    for (const statement of ast.statements) {
      if (!(ts.isImportDeclaration(statement) || ts.isExportDeclaration(statement))
        || !statement.moduleSpecifier || !ts.isStringLiteral(statement.moduleSpecifier)) continue;
      const specifier = statement.moduleSpecifier.text;
      if (specifier.startsWith('@gost-kit/') && specifier.split('/').length > 2) errors.push(`${name}: private package import`);
      if (!specifier.startsWith('.')) continue;
      const target = path.resolve(path.dirname(name), specifier);
      if (!sources.has(target)) errors.push(`${name}: missing ${specifier}`);
      const from = scenario(name), to = scenario(target);
      if (from && to && from !== to) errors.push(`${name}: peer scenario import`);
      if (name.includes('/users/common/') && to) errors.push(`${name}: common depends on scenario`);
      if (name.includes('/domain/entities/') && /\/(data|fc)\//.test(target)) errors.push(`${name}: entity dependency`);
      if (name.includes('/data/api/') && target.includes('/domain/fc/')) errors.push(`${name}: API depends on FC`);
      if (name.includes('/ui/') && target.includes('/data/api/')) errors.push(`${name}: UI depends on API operation`);
      const clause = ts.isImportDeclaration(statement) ? statement.importClause : undefined;
      const bindings = clause?.namedBindings;
      const onlyTypes = ts.isExportDeclaration(statement) ? statement.isTypeOnly
        : clause?.isTypeOnly || (!clause?.name && bindings && ts.isNamedImports(bindings)
          && bindings.elements.length > 0 && bindings.elements.every((x) => x.isTypeOnly));
      if (!onlyTypes) runtime.push(target);
    }
    graph.set(name, runtime);
  }
  const done = new Set<string>(), active = new Set<string>();
  const visit = (name: string) => {
    if (active.has(name)) { errors.push(`${name}: runtime cycle`); return; }
    if (done.has(name)) return;
    active.add(name);
    for (const next of graph.get(name) ?? []) visit(next);
    active.delete(name); done.add(name);
  };
  for (const name of graph.keys()) visit(name);
  return errors;
};

test('concrete source imports respect scenario/API/domain boundaries without runtime cycles', () => {
  assert.deepEqual(audit(files), []);
});
test('audit detects a type-only common-to-scenario leak', () => {
  const broken = new Map(files);
  broken.set(path.join(root, 'features/users/common/leak.ts'), "import type { ListState } from '../list/index.ts';");
  assert.match(audit(broken).join('\n'), /common depends on scenario/);
});
test('audit detects peer imports and runtime cycles', () => {
  const broken = new Map(files);
  broken.set(path.join(root, 'features/users/list/leak.ts'), "import { createState } from '../create/index.ts';");
  broken.set(path.join(root, 'shared/a.ts'), "import './b.ts';");
  broken.set(path.join(root, 'shared/b.ts'), "import './a.ts';");
  const errors = audit(broken).join('\n');
  assert.match(errors, /peer scenario import/);
  assert.match(errors, /runtime cycle/);
});
