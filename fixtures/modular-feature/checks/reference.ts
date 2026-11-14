import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';

test('every complete source block matches the checked consumer file', () => {
  const source = readFileSync(process.env.GOST_FEATURE_EXAMPLE ?? 'users-example.md', 'utf8');
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
  for (const [filename, text] of blocks) {
    const target = path.resolve(filename);
    assert.ok(!path.relative(process.cwd(), target).startsWith('..'), 'source path leaves consumer');
    assert.equal(text.trimEnd(), readFileSync(target, 'utf8').trimEnd(), `${filename} differs from recipe`);
  }
  const verify = (directory: string) => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const filename = path.posix.join(directory, entry.name);
      if (entry.isDirectory()) verify(filename);
      else if (/\.(ts|svelte)$/.test(filename)) assert.ok(blocks.has(filename), `source missing from recipe: ${filename}`);
    }
  };
  verify('src');
});
