import assert from 'node:assert/strict';
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';

const parseBlocks = (source: string) => {
  const blocks = new Map<string, string>();
  let filename = '', body: string[] | undefined;
  for (const line of source.split('\n')) {
    const heading = line.match(/^### `([^`]+)`$/);
    if (!body && heading) filename = heading[1];
    if (/^```/.test(line)) {
      if (body) {
        assert.ok(filename && !blocks.has(filename), `missing/duplicate source path ${filename}`);
        blocks.set(filename, body.join('\n'));
        body = undefined;
      } else body = [];
    } else if (body) body.push(line);
  }
  assert.ok(blocks.size > 0, 'no complete source blocks');
  return blocks;
};

const verifyListing = (directory: string, source: string) => {
  const blocks = parseBlocks(source);
  for (const [filename, text] of blocks) {
    const target = path.resolve(directory, filename);
    assert.ok(!path.relative(directory, target).startsWith('..'), 'source path leaves consumer');
    assert.equal(text.trimEnd(), readFileSync(target, 'utf8').trimEnd(), `${filename} differs from recipe`);
  }
  const requireBlock = (filename: string) => {
    if (filename.startsWith('checks/') && filename.endsWith('.ts')) {
      assert.match(filename, /\.(test|types|pw)\.ts$/, `unclassified check file: ${filename}`);
    }
    assert.ok(blocks.has(filename), `source missing from recipe: ${filename}`);
  };
  const verify = (relativeDirectory: string) => {
    for (const entry of readdirSync(path.join(directory, relativeDirectory), { withFileTypes: true })) {
      const filename = path.posix.join(relativeDirectory, entry.name);
      if (entry.isDirectory()) verify(filename);
      else if (/\.(ts|svelte|json|html)$/.test(filename)) requireBlock(filename);
    }
  };
  verify('src');
  verify('checks');
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.isFile() && /\.(ts|json|html)$/.test(entry.name) && entry.name !== 'package-lock.json') {
      requireBlock(entry.name);
    }
  }
};

const source = () => readFileSync(process.env.GOST_FEATURE_EXAMPLE ?? 'users-example.md', 'utf8');
test('every complete source block matches and covers the checked consumer files', () => {
  verifyListing(process.cwd(), source());
});

for (const scenario of [
  { filename: 'checks/unlisted.test.ts', listed: false, diagnostic: /source missing from recipe/ },
  { filename: 'future.config.ts', listed: false, diagnostic: /source missing from recipe/ },
  { filename: 'checks/unclassified.ts', listed: true, diagnostic: /unclassified check file/ },
]) {
  test(`parity rejects ${scenario.filename}`, (t) => {
    const directory = mkdtempSync(path.join(tmpdir(), 'gost-listing-gate-'));
    t.after(() => rmSync(directory, { recursive: true, force: true }));
    let listing = source();
    for (const filename of parseBlocks(listing).keys()) {
      const target = path.join(directory, filename);
      mkdirSync(path.dirname(target), { recursive: true });
      copyFileSync(path.resolve(filename), target);
    }
    const content = 'export const unused = true;';
    writeFileSync(path.join(directory, scenario.filename), content);
    if (scenario.listed) listing += '\n### `' + scenario.filename + '`\n\n```ts\n' + content + '\n```\n';
    assert.throws(() => verifyListing(directory, listing), scenario.diagnostic);
  });
}
