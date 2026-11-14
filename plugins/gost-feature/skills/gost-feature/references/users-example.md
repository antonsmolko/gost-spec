# Complete users example

Read [the recipe](modular-feature.md) for boundaries and adaptation. These are
complete synthetic files from one checked consumer. Reuse your application's
existing foundation/handlers; bootstrap and demo transport here make the example
runnable, rather than instructing creation of another consumer store.

Save this listing as users-example.md in the disposable consumer (or set
GOST_FEATURE_EXAMPLE to the installed copy) for the parity test. Reconstruct the
files below, use npm install --ignore-scripts to resolve the pinned package.json
(or npm ci with the separately supplied fixture lockfile), inspect installed
versions/exports, then run check, test:unit, test:integration, build and
test:browser. Install Playwright Chromium separately if needed. Use an empty
4195 port; the browser configuration rejects an existing server.

The handwritten Paths type is a small generated-schema equivalent. Real projects
reuse their actual generated output. demo.ts is only an injected test backend.
application.ts is only the plain common dispatch integration harness; the browser
uses one shell store/provider from App.svelte. Type-only imports of root contracts
are intentional; FC/data entrypoints and UI entrypoints are separate.

## Files

### `package.json`

```json
{
  "name": "gost-modular-feature-fixture",
  "private": true,
  "type": "module",
  "engines": {
    "node": "^26.0.0"
  },
  "scripts": {
    "dev": "vite --host 127.0.0.1",
    "check": "svelte-check --tsconfig ./tsconfig.json && tsc --noEmit",
    "build": "vite build",
    "test:unit": "node --test 'src/**/*.test.ts'",
    "test:integration": "node --test checks/integration.ts checks/imports.ts checks/reference.ts",
    "test:browser": "playwright test"
  },
  "dependencies": {
    "@gost-kit/common": "0.3.0",
    "@gost-kit/svelte": "0.2.0",
    "svelte": "5.57.2"
  },
  "devDependencies": {
    "@playwright/test": "1.64.1",
    "@sveltejs/vite-plugin-svelte": "7.3.1",
    "@types/node": "26.6.5",
    "svelte-check": "4.7.7",
    "typescript": "5.9.3",
    "vite": "8.3.5"
  }
}
```

### `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "noEmit": true,
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "skipLibCheck": true,
    "types": ["vite/client", "node"]
  },
  "include": ["src/**/*.ts", "src/**/*.svelte", "vite.config.ts", "playwright.config.ts", "checks/**/*.ts"]
}
```

### `vite.config.ts`

```ts
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({ plugins: [svelte()] });
```

### `playwright.config.ts`

```ts
import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './checks', testMatch: '**/*.pw.ts',
  use: { baseURL: 'http://127.0.0.1:4195', browserName: 'chromium' },
  webServer: { command: 'npm run dev -- --port 4195 --strictPort',
    url: 'http://127.0.0.1:4195', reuseExistingServer: false },
});
```

### `index.html`

```html
<!doctype html>
<html lang="en">
  <head><meta charset="UTF-8" /><title>Existing SPA</title></head>
  <body><div id="app"></div><script type="module" src="/src/main.ts"></script></body>
</html>
```

### `src/app/page.presenter.test.ts`

```ts
import assert from 'node:assert/strict';
import test from 'node:test';
import { pagePresenter } from './page.presenter.ts';

test('page presenter selects independent ready flags', () => {
  assert.deepEqual(pagePresenter({ page: 'list' }), { list: true, create: false });
  assert.deepEqual(pagePresenter({ page: 'create' }), { list: false, create: true });
});
```

### `src/app/page.presenter.ts`

```ts
import type { Page } from '../shared/navigation/contracts.ts';
export type PageView = { list: boolean; create: boolean };
export const pagePresenter = ({ page }: { page: Page }): PageView => ({
  list: page === 'list', create: page === 'create',
});
```

### `src/demo.ts`

```ts
// Test/demo backend only. A real application supplies its existing transport.
import type { UserDto } from './features/users/common/index.ts';
export const createDemoTransport = (failure: boolean): typeof fetch => {
  let rows: UserDto[] = [{ user_id: '1', full_name: 'Ada' }, { user_id: '2', full_name: 'Grace' }];
  return async (input, init) => {
    const request = new Request(input, init);
    const reply = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
      status, headers: { 'content-type': 'application/json' },
    });
    if (failure) return reply({ errors: [{ code: 'DENIED', message: 'Demo denied', path: [] }] }, 403);
    if (request.method === 'POST') {
      const body: unknown = await request.json();
      if (typeof body !== 'object' || body === null || !('name' in body) || typeof body.name !== 'string') {
        return reply({ errors: [{ code: 'INVALID', message: 'Invalid name', path: ['name'] }] }, 400);
      }
      const created = { user_id: String(rows.length + 1), full_name: body.name };
      rows = [...rows, created];
      return reply(created);
    }
    return reply(rows);
  };
};
```

### `src/features/users/common/data/dto/user.ts`

```ts
import type { Components } from '../../../../../shared/api/schema.ts';
export type UserDto = Components['schemas']['User'];
```

### `src/features/users/common/data/mappers/user.ts`

```ts
import { guard } from '@gost-kit/common';
import type { UserDto } from '../dto/user.ts';
import type { User } from '../../domain/entities/user.ts';

export const mapUser = (dto: UserDto): User => {
  if (!guard.record(dto) || !guard.string(dto.user_id) || !guard.string(dto.full_name)) {
    throw new Error('Invalid user DTO');
  }
  return { id: dto.user_id, name: dto.full_name };
};
```

### `src/features/users/common/domain/entities/user.ts`

```ts
export type User = { id: string; name: string };
export const user = (options: Partial<User> = {}): User => ({ id: '1', name: 'Ada', ...options });
```

### `src/features/users/common/index.ts`

```ts
export { mapUser } from './data/mappers/user.ts';
export { user } from './domain/entities/user.ts';
export type { User } from './domain/entities/user.ts';
export type { UserDto } from './data/dto/user.ts';
```

### `src/features/users/create/app/routing/enter.ts`

```ts
import type { RootAction } from '../../../../../store/contracts.ts';
export const enterCreate = (): RootAction => ({ scope: 'registration', type: 'EnterAction' });
```

### `src/features/users/create/data/api/create-user.ts`

```ts
import { defineApiOperation } from '@gost-kit/common';
import type { Paths } from '../../../../../shared/api/schema.ts';
import { mapUser } from '../../../common/index.ts';

export const createUser = defineApiOperation<Paths>()({
  method: 'post', url: '/users', mapResponse: mapUser,
});
```

### `src/features/users/create/domain/fc/action.ts`

```ts
import type { AppError } from '@gost-kit/common';
import type { User } from '../../../common/index.ts';
export type CreateAction =
  | { type: 'EnterAction' }
  | { type: 'NameChangedAction'; name: string }
  | { type: 'SubmitAction' }
  | { type: 'CreatedAction'; user: User }
  | { type: 'FailedAction'; errors: AppError[] };
```

### `src/features/users/create/domain/fc/reducer.test.ts`

```ts
import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { rootReducer } from '../../../../../store/reducer.ts';
import { rootState } from '../../../../../store/state.ts';
import { createState } from './state.ts';
import { user } from '../../../common/domain/entities/user.ts';

describe('createReducer', () => {
  describe('SubmitAction', () => {
    const before = rootState({ 'users-create': createState({ name: 'Ada' }) });
    const { state, effects } = rootReducer(before, { scope: 'registration', type: 'SubmitAction' });
    test('sets loading without changing another scenario', () => {
      assert.equal(state['users-create'].status, 'loading');
      assert.equal(before['users-create'].status, 'idle');
      assert.equal(state['users-list'], before['users-list']);
    });
    test('describes request body and receiver actions', () => {
      const [effect] = effects;
      assert.ok(effect.type === 'ApiEffect' && effect.method === 'post');
      assert.deepEqual(effect.body, { name: 'Ada' });
      assert.ok(effect.onSuccess && effect.onError);
      assert.deepEqual(effect.onSuccess(user()), { scope: 'registration', type: 'CreatedAction', user: user() });
      const errors = [{ code: 'INVALID', message: 'Invalid name', path: ['name'] }];
      assert.deepEqual(effect.onError(errors, { kind: 'http', errors, status: 400 }),
        { scope: 'registration', type: 'FailedAction', errors });
    });
  });
  describe('SubmitAction with blank name', () => {
    const { state, effects } = rootReducer(rootState(), { scope: 'registration', type: 'SubmitAction' });
    test('reports validation error without API', () => {
      assert.equal(state['users-create'].status, 'error');
      assert.equal(state['users-create'].errors[0].code, 'NAME_REQUIRED');
      assert.deepEqual(effects, []);
    });
  });
  describe('CreatedAction', () => {
    const { state, effects } = rootReducer(rootState({ 'users-create': createState({ status: 'loading' }) }),
      { scope: 'registration', type: 'CreatedAction', user: user() });
    test('stores domain result and describes app navigation', () => {
      assert.equal(state['users-create'].status, 'ready');
      assert.deepEqual(state['users-create'].created, user());
      assert.deepEqual(effects, [{ type: 'NavigateEffect', to: 'list' }]);
    });
  });
  describe('FailedAction', () => {
    const errors = [{ code: 'INVALID', message: 'Invalid name', path: ['name'] }];
    const { state, effects } = rootReducer(rootState({ 'users-create': createState({ status: 'loading' }) }),
      { scope: 'registration', type: 'FailedAction', errors });
    test('stores API errors without navigation', () => {
      assert.equal(state['users-create'].status, 'error');
      assert.equal(state['users-create'].errors, errors);
      assert.deepEqual(effects, []);
    });
  });
});
```

### `src/features/users/create/domain/fc/reducer.ts`

```ts
import { createApiEffect, define } from '@gost-kit/common';
import type { RootEffect, RootState } from '../../../../../store/contracts.ts';
import { createUser } from '../../data/api/create-user.ts';
import type { CreateAction } from './action.ts';
import { createState, type CreateState } from './state.ts';

export const createReducer = define.reducer<CreateState, CreateAction, RootEffect, RootState>()({
  EnterAction: () => ({ state: createState() }),
  NameChangedAction: ({ state, action }) => ({ state: { ...state, name: action.name } }),
  SubmitAction: ({ state }) => {
    const name = state.name.trim();
    if (!name) return { state: { ...state, status: 'error', errors: [
      { code: 'NAME_REQUIRED', message: 'Name is required', path: ['name'] },
    ] } };
    return {
      state: { ...state, status: 'loading', errors: [] },
      effects: createApiEffect(createUser, {
        body: { name },
        defaultError: { code: 'CREATE_FAILED', message: 'Could not create user', path: [] },
        onSuccess: (user) => ({ scope: 'registration', type: 'CreatedAction', user }),
        onError: (errors) => ({ scope: 'registration', type: 'FailedAction', errors }),
      }),
    };
  },
  CreatedAction: ({ state, action }) => ({
    state: { ...state, status: 'ready', created: action.user, errors: [] },
    effects: { type: 'NavigateEffect', to: 'list' },
  }),
  FailedAction: ({ state, action }) => ({ state: { ...state, status: 'error', errors: action.errors } }),
});
```

### `src/features/users/create/domain/fc/state.ts`

```ts
import { define, type AppError } from '@gost-kit/common';
import type { User } from '../../../common/index.ts';

export type CreateState = {
  status: 'idle' | 'loading' | 'ready' | 'error'; name: string; created?: User; errors: AppError[];
};
export const createState = define.state<CreateState>((options = {}) => ({
  status: 'idle', name: '', errors: [], ...options,
}));
```

### `src/features/users/create/index.ts`

```ts
export { createUser } from './data/api/create-user.ts';
export { createState } from './domain/fc/state.ts';
export type { CreateState } from './domain/fc/state.ts';
export type { CreateAction } from './domain/fc/action.ts';
export { createReducer } from './domain/fc/reducer.ts';
export { enterCreate } from './app/routing/enter.ts';
```

### `src/features/users/create/ui/components/create.presenter.test.ts`

```ts
import assert from 'node:assert/strict';
import test from 'node:test';
import { createState } from '../../domain/fc/state.ts';
import { createPresenter } from './create.presenter.ts';

test('create presenter produces full form data without changing state', () => {
  const input = createState({ name: ' Ada ', status: 'loading' });
  assert.deepEqual(createPresenter({ input }), { name: ' Ada ', disabled: true, failed: false, error: '', button: 'Saving' });
  assert.equal(input.name, ' Ada ');
});
test('create presenter exposes errors and editable input', () => {
  const input = createState({ status: 'error', errors: [{ code: 'E', message: 'Invalid name', path: ['name'] }] });
  assert.deepEqual(createPresenter({ input }), { name: '', disabled: false, failed: true, error: 'Invalid name', button: 'Save user' });
});
```

### `src/features/users/create/ui/components/create.presenter.ts`

```ts
import type { CreateState } from '../../domain/fc/state.ts';
export type CreateView = { name: string; disabled: boolean; failed: boolean; error: string; button: string };
export const createPresenter = ({ input }: { input: CreateState }): CreateView => ({
  name: input.name, disabled: input.status === 'loading', failed: input.status === 'error',
  error: input.errors.map((e) => e.message).join('; '), button: input.status === 'loading' ? 'Saving' : 'Save user',
});
```

### `src/features/users/create/ui/index.ts`

```ts
export { default as CreatePage } from './pages/CreatePage.svelte';
```

### `src/features/users/list/app/routing/enter.ts`

```ts
import type { RootAction } from '../../../../../store/contracts.ts';
export const enterList = (): RootAction => ({ scope: 'directory', type: 'EnterAction' });
```

### `src/features/users/list/data/api/list-users.ts`

```ts
import { defineApiOperation } from '@gost-kit/common';
import type { Paths } from '../../../../../shared/api/schema.ts';
import { mapUser } from '../../../common/index.ts';

export const listUsers = defineApiOperation<Paths>()({
  method: 'get', url: '/users',
  mapResponse: (rows) => {
    if (!Array.isArray(rows)) throw new Error('Invalid user collection');
    return rows.map(mapUser);
  },
});
```

### `src/features/users/list/domain/fc/action.ts`

```ts
import type { AppError } from '@gost-kit/common';
import type { User } from '../../../common/index.ts';
export type ListAction =
  | { type: 'EnterAction' }
  | { type: 'LoadAction' }
  | { type: 'QueryChangedAction'; query: string }
  | { type: 'LoadedAction'; rows: User[] }
  | { type: 'FailedAction'; errors: AppError[] };
```

### `src/features/users/list/domain/fc/reducer.test.ts`

```ts
import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { rootReducer } from '../../../../../store/reducer.ts';
import { rootState } from '../../../../../store/state.ts';
import { listState } from './state.ts';
import { user } from '../../../common/domain/entities/user.ts';

describe('listReducer', () => {
  describe('EnterAction', () => {
    const { state, effects } = rootReducer(rootState({ 'users-list': listState({ query: 'old', rows: [user()] }) }),
      { scope: 'directory', type: 'EnterAction' });
    test('starts a fresh opening with loading and initial query', () => {
      assert.equal(state['users-list'].status, 'loading');
      assert.equal(state['users-list'].query, '');
      assert.deepEqual(state['users-list'].rows, []);
      assert.equal(effects.length, 1);
    });
  });
  describe('LoadAction', () => {
    const before = rootState({ 'users-list': listState({ query: 'Ada', rows: [user()] }) });
    const { state, effects } = rootReducer(before, { scope: 'directory', type: 'LoadAction' });
    test('sets loading and preserves query', () => {
      assert.equal(state['users-list'].status, 'loading');
      assert.equal(state['users-list'].query, 'Ada');
      assert.deepEqual(state['users-list'].rows, []);
    });
    test('describes API operation and result actions without execution', () => {
      assert.equal(effects.length, 1);
      const [effect] = effects;
      assert.ok(effect.type === 'ApiEffect' && effect.method === 'get');
      assert.equal(effect.url, '/users');
      assert.ok(effect.onSuccess && effect.onError);
      assert.deepEqual(effect.onSuccess([user()]), { scope: 'directory', type: 'LoadedAction', rows: [user()] });
      const errors = [{ code: 'OFFLINE', message: 'offline', path: [] }];
      assert.deepEqual(effect.onError(errors, { kind: 'network', errors: [] }), { scope: 'directory', type: 'FailedAction', errors });
    });
    test('preserves input and neighbouring slices', () => {
      assert.equal(before['users-list'].status, 'idle');
      assert.equal(before['users-list'].rows.length, 1);
      assert.equal(state['users-create'], before['users-create']);
      assert.equal(state.preferences, before.preferences);
    });
  });
  describe('LoadedAction', () => {
    const { state, effects } = rootReducer(rootState({ 'users-list': listState({ status: 'loading' }) }),
      { scope: 'directory', type: 'LoadedAction', rows: [user()] });
    test('stores domain rows and returns no effects', () => {
      assert.equal(state['users-list'].status, 'ready');
      assert.deepEqual(state['users-list'].rows, [user()]);
      assert.deepEqual(effects, []);
    });
  });
  describe('FailedAction', () => {
    const errors = [{ code: 'FAILED', message: 'Could not load', path: [] }];
    const { state } = rootReducer(rootState({ 'users-list': listState({ status: 'loading' }) }),
      { scope: 'directory', type: 'FailedAction', errors });
    test('stores errors unchanged', () => {
      assert.equal(state['users-list'].status, 'error');
      assert.equal(state['users-list'].errors, errors);
    });
  });
});
```

### `src/features/users/list/domain/fc/reducer.ts`

```ts
import { createApiEffect, define } from '@gost-kit/common';
import type { RootEffect, RootState } from '../../../../../store/contracts.ts';
import { listUsers } from '../../data/api/list-users.ts';
import type { ListAction } from './action.ts';
import { listState, type ListState } from './state.ts';

const loadEffect = () => createApiEffect(listUsers, {
      defaultError: { code: 'LIST_FAILED', message: 'Could not load users', path: [] },
      onSuccess: (rows) => ({ scope: 'directory', type: 'LoadedAction', rows }),
      onError: (errors) => ({ scope: 'directory', type: 'FailedAction', errors }),
    });

export const listReducer = define.reducer<ListState, ListAction, RootEffect, RootState>()({
  EnterAction: () => ({ state: { ...listState(), status: 'loading' }, effects: loadEffect() }),
  LoadAction: ({ state }) => ({
    state: { ...state, status: 'loading', rows: [], errors: [] },
    effects: loadEffect(),
  }),
  QueryChangedAction: ({ state, action }) => ({ state: { ...state, query: action.query } }),
  LoadedAction: ({ state, action }) => ({ state: { ...state, status: 'ready', rows: action.rows, errors: [] } }),
  FailedAction: ({ state, action }) => ({ state: { ...state, status: 'error', rows: [], errors: action.errors } }),
});
```

### `src/features/users/list/domain/fc/state.ts`

```ts
import { define, type AppError } from '@gost-kit/common';
import type { User } from '../../../common/index.ts';

export type ListState = {
  status: 'idle' | 'loading' | 'ready' | 'error'; query: string; rows: User[]; errors: AppError[];
};
export const listState = define.state<ListState>((options = {}) => ({
  status: 'idle', query: '', rows: [], errors: [], ...options,
}));
```

### `src/features/users/list/index.ts`

```ts
export { listUsers } from './data/api/list-users.ts';
export { listState } from './domain/fc/state.ts';
export type { ListState } from './domain/fc/state.ts';
export type { ListAction } from './domain/fc/action.ts';
export { listReducer } from './domain/fc/reducer.ts';
export { enterList } from './app/routing/enter.ts';
```

### `src/features/users/list/ui/components/users.presenter.test.ts`

```ts
import assert from 'node:assert/strict';
import test from 'node:test';
import { listState } from '../../domain/fc/state.ts';
import { user } from '../../../common/index.ts';
import { usersPresenter } from './users.presenter.ts';
const labels = { loading: 'Loading users', empty: 'No users' };

test('list presenter produces complete ready data and preserves its inputs', () => {
  const input = listState({ status: 'ready', query: 'GR', rows: [user(), user({ id: '2', name: 'Grace' })] });
  const before = structuredClone(input);
  assert.deepEqual(usersPresenter({ input, labels }), {
    query: 'GR', loading: false, empty: false, failed: false, message: '',
    rows: [{ key: '2', label: 'Grace' }],
  });
  assert.deepEqual(input, before);
});
for (const status of ['idle', 'loading', 'ready', 'error'] as const) {
  test('list presenter handles ' + status, () => {
    const result = usersPresenter({ input: listState({ status, errors: [{ code: 'E', message: 'Failed', path: [] }] }), labels });
    assert.equal(result.loading, status === 'idle' || status === 'loading');
    assert.equal(result.empty, status === 'ready');
    assert.equal(result.failed, status === 'error');
  });
}
```

### `src/features/users/list/ui/components/users.presenter.ts`

```ts
import type { ListState } from '../../domain/fc/state.ts';
export type UsersView = {
  query: string; loading: boolean; empty: boolean; failed: boolean;
  message: string; rows: { key: string; label: string }[];
};
export const usersPresenter = ({ input, labels }: {
  input: ListState; labels: { loading: string; empty: string };
}): UsersView => {
  const rows = input.status === 'ready'
    ? input.rows.filter((row) => row.name.toLowerCase().includes(input.query.trim().toLowerCase()))
      .map((row) => ({ key: row.id, label: row.name })) : [];
  const loading = input.status === 'idle' || input.status === 'loading';
  const empty = input.status === 'ready' && rows.length === 0;
  const failed = input.status === 'error';
  const message = loading ? labels.loading : failed ? input.errors.map((e) => e.message).join('; ') : empty ? labels.empty : '';
  return { query: input.query, loading, empty, failed, message, rows };
};
```

### `src/features/users/list/ui/index.ts`

```ts
export { default as ListPage } from './pages/ListPage.svelte';
```

### `src/main.ts`

```ts
import { mount } from 'svelte';
import App from './App.svelte';
import { ListPage } from './features/users/list/ui/index.ts';
import { createDemoTransport } from './demo.ts';
const target = document.getElementById('app');
if (!target) throw new Error('Missing app target');
const query = new URLSearchParams(location.search);
if (query.has('missing-provider')) mount(ListPage, { target });
else mount(App, { target, props: { transport: createDemoTransport(query.has('failure')) } });
```

### `src/shared/api/schema.ts`

```ts
// Small synthetic generated-schema equivalent; use the real generator output in applications.
export type Components = { schemas: { User: { user_id: string; full_name: string } } };
export type Paths = {
  '/users': {
    get: { responses: { 200: { content: { 'application/json': Components['schemas']['User'][] } } } };
    post: {
      requestBody: { content: { 'application/json': { name: string } } };
      responses: { 200: { content: { 'application/json': Components['schemas']['User'] } } };
    };
  };
};
```

### `src/shared/navigation/contracts.ts`

```ts
// Existing application contract, not an export promised by gost-kit.
export type Page = 'list' | 'create';
export type NavigateEffect = { type: 'NavigateEffect'; to: Page };
```

### `src/store/application.ts`

```ts
// Non-Svelte integration harness: real common dispatch + existing app handlers.
import { createDispatch } from '@gost-kit/common';
import { rootState } from './state.ts';
import { rootReducer } from './reducer.ts';
import { createRootEffector } from './effector.ts';
import type { RootState } from './contracts.ts';

export const createApplication = (transport: typeof fetch) => {
  let state = rootState();
  const errors: unknown[] = [];
  const dispatch = createDispatch({
    readState: () => state, writeState: (next: RootState) => { state = next; },
    reducer: rootReducer, effector: createRootEffector(transport), onError: (error) => { errors.push(error); },
  });
  return { get state() { return state; }, dispatch, errors };
};
```

### `src/store/context.ts`

```ts
import { createContext } from 'svelte';
import type { Store } from '@gost-kit/common';
import type { RootAction, RootState } from './contracts.ts';
export const [useStore, provideStore] = createContext<Store<RootState, RootAction>>();
```

### `src/store/contracts.ts`

```ts
import type { ApiEffect, ScopedActions } from '@gost-kit/common';
import type { ListState, ListAction, listUsers } from '../features/users/list/index.ts';
import type { CreateState, CreateAction, createUser } from '../features/users/create/index.ts';
import type { NavigateEffect, Page } from '../shared/navigation/contracts.ts';

export type RootState = {
  'users-list': ListState; 'users-create': CreateState;
  navigation: { page: Page }; preferences: { theme: 'dark' | 'light' };
};
export type AppAction =
  | { type: 'NavigateAction'; to: Page }
  | { type: 'PageOpenedAction'; page: Page }
  | { type: 'SetThemeAction'; theme: 'dark' | 'light' };
export type RootAction = ScopedActions<{ directory: ListAction; registration: CreateAction; app: AppAction }>;
export type RootApiOperation = typeof listUsers | typeof createUser;
export type RootEffect = ApiEffect<RootApiOperation, RootAction, RootAction> | NavigateEffect;
```

### `src/store/create-store.ts`

```ts
import { createStore } from '@gost-kit/svelte';
import type { StoreError } from '@gost-kit/common';
import type { RootAction, RootEffect } from './contracts.ts';
import { rootState } from './state.ts';
import { rootReducer } from './reducer.ts';
import { createRootEffector } from './effector.ts';

export const reportStoreError = (failure: StoreError<RootAction, RootEffect>): void => {
  console.error('Store execution failed', failure.kind, failure.error);
};
export const createApplicationStore = (transport: typeof fetch,
  onError: (failure: StoreError<RootAction, RootEffect>) => void = reportStoreError) => createStore({
  initState: rootState, reducer: rootReducer, effector: createRootEffector(transport), onError,
});
```

### `src/store/effector.ts`

```ts
import { createApiClient, createApiEffector, define, effecting, guard, type AppError } from '@gost-kit/common';
import { enterList } from '../features/users/list/index.ts';
import { enterCreate } from '../features/users/create/index.ts';
import type { Paths } from '../shared/api/schema.ts';
import type { NavigateEffect } from '../shared/navigation/contracts.ts';
import type { RootAction, RootEffect, RootApiOperation } from './contracts.ts';

const mapErrors = (body: unknown): AppError[] => {
  if (!guard.record(body) || !guard.array(body.errors)) return [];
  return body.errors.filter((item): item is AppError => guard.record(item)
    && guard.string(item.code) && guard.string(item.message)
    && guard.array(item.path) && item.path.every(guard.string));
};
export const createRootEffector = (transport: typeof fetch) => {
  const api = createApiClient<Paths>({ baseUrl: 'https://api.example.invalid', fetch: transport, mapErrors });
  const apiHandlers = createApiEffector<Paths, RootAction, RootApiOperation>(api);
  // Synthetic application adapter. This is not a router/reset timing recipe.
  const navigation = define.effector<RootAction, NavigateEffect>({
    NavigateEffect: async ({ effect, dispatch }) => {
      await dispatch({ scope: 'app', type: 'PageOpenedAction', page: effect.to });
      await dispatch(effect.to === 'list' ? enterList() : enterCreate());
    },
  });
  return effecting<RootAction, RootEffect, readonly [typeof apiHandlers, typeof navigation]>(apiHandlers, navigation);
};
```

### `src/store/index.ts`

```ts
export { useStore } from './context.ts';
```

### `src/store/reducer.ts`

```ts
import { define, reducing, scope } from '@gost-kit/common';
import { listReducer } from '../features/users/list/index.ts';
import { createReducer } from '../features/users/create/index.ts';
import type { AppAction, RootAction, RootEffect, RootState } from './contracts.ts';

const appReducer = define.reducer<RootState, AppAction, RootEffect>()({
  NavigateAction: ({ action }) => ({ effects: { type: 'NavigateEffect', to: action.to } }),
  PageOpenedAction: ({ state, action }) => ({ state: { ...state, navigation: { page: action.page } } }),
  SetThemeAction: ({ state, action }) => ({ state: { ...state, preferences: { theme: action.theme } } }),
});
export const rootReducer = reducing<RootState, RootAction, RootEffect>({
  directory: scope('users-list', listReducer),
  registration: scope('users-create', createReducer),
  app: appReducer,
});
```

### `src/store/state.ts`

```ts
import { define } from '@gost-kit/common';
import { listState } from '../features/users/list/index.ts';
import { createState } from '../features/users/create/index.ts';
import type { RootState } from './contracts.ts';

export const rootState = define.state<RootState>((options = {}) => ({
  'users-list': listState(), 'users-create': createState(),
  navigation: { page: 'list' }, preferences: { theme: 'dark' }, ...options,
}));
```

### `src/App.svelte`

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import { createApplicationStore } from './store/create-store.ts';
  import { provideStore } from './store/context.ts';
  import { ListPage } from './features/users/list/ui/index.ts';
  import { CreatePage } from './features/users/create/ui/index.ts';
  import { pagePresenter } from './app/page.presenter.ts';
  const { transport }: { transport: typeof fetch } = $props();
  const store = createApplicationStore((input, init) => transport(input, init));
  provideStore(store);
  const view = $derived(pagePresenter({ page: store.state.navigation.page }));
  onMount(() => { void store.dispatch({ scope: 'app', type: 'NavigateAction', to: 'list' }); });
</script>

<nav aria-label="Users navigation">
  <button onclick={() => void store.dispatch({ scope: 'app', type: 'NavigateAction', to: 'list' })}>User list</button>
  <button onclick={() => void store.dispatch({ scope: 'app', type: 'NavigateAction', to: 'create' })}>Create user</button>
</nav>
{#if view.list}<ListPage />{:else if view.create}<CreatePage />{/if}
```

### `src/features/users/create/ui/components/CreateUser.svelte`

```svelte
<script lang="ts">
  import { useStore } from '../../../../../store/index.ts';
  import { createPresenter } from './create.presenter.ts';
  const store = useStore();
  const view = $derived(createPresenter({ input: store.state['users-create'] }));
  const submit = (event: SubmitEvent) => {
    event.preventDefault();
    void store.dispatch({ scope: 'registration', type: 'SubmitAction' });
  };
</script>

<form onsubmit={submit}>
  <label>Name <input value={view.name} disabled={view.disabled} oninput={(event) => void store.dispatch({
    scope: 'registration', type: 'NameChangedAction', name: event.currentTarget.value,
  })} /></label>
  <button type="submit" disabled={view.disabled}>{view.button}</button>
</form>
{#if view.failed}<p role="alert">{view.error}</p>{/if}
```

### `src/features/users/create/ui/pages/CreatePage.svelte`

```svelte
<script lang="ts">
  import CreateUser from '../components/CreateUser.svelte';
</script>
<h1>New user</h1>
<CreateUser />
```

### `src/features/users/list/ui/components/Users.svelte`

```svelte
<script lang="ts">
  import { useStore } from '../../../../../store/index.ts';
  import { usersPresenter } from './users.presenter.ts';
  const store = useStore();
  const labels = { loading: 'Loading users', empty: 'No users' };
  const view = $derived(usersPresenter({ input: store.state['users-list'], labels }));
</script>

<label>Search <input value={view.query} oninput={(event) => void store.dispatch({
  scope: 'directory', type: 'QueryChangedAction', query: event.currentTarget.value,
})} /></label>
{#if view.loading}<p>{view.message}</p>
{:else if view.failed}<p role="alert">{view.message}</p>
{:else if view.empty}<p>{view.message}</p>
{:else}
  <ul>{#each view.rows as row (row.key)}<li data-testid="user-row">{row.label}</li>{/each}</ul>
{/if}
```

### `src/features/users/list/ui/pages/ListPage.svelte`

```svelte
<script lang="ts">
  import Users from '../components/Users.svelte';
</script>
<h1>Users</h1>
<Users />
```

### `checks/contracts.ts`

```ts
import { createApiEffect } from '@gost-kit/common';
import { listUsers } from '../src/features/users/list/index.ts';
import { createUser } from '../src/features/users/create/index.ts';
import type { RootAction } from '../src/store/contracts.ts';

createApiEffect(createUser, {
  // @ts-expect-error operation parameters must match the selected operation
  body: { full_name: 'Ada' },
  defaultError: { code: 'FAILED', message: 'failed', path: [] },
});
createApiEffect(listUsers, {
  defaultError: { code: 'FAILED', message: 'failed', path: [] },
  onSuccess: (rows) => {
    // @ts-expect-error mapped domain data does not expose wire fields
    rows[0].user_id;
    return { type: 'ReceivedAction', rows };
  },
});
// @ts-expect-error namespace and action membership are checked
const invalid: RootAction = { scope: 'directory', type: 'CreatedAction', user: { id: '1', name: 'Ada' } };
void invalid;
```

### `checks/imports.ts`

```ts
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
```

### `checks/integration.ts`

```ts
import assert from 'node:assert/strict';
import test from 'node:test';
import { createApplication } from '../src/store/application.ts';

const response = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status, headers: { 'content-type': 'application/json' },
});

test('create maps DTO, navigates through app and list fetches fresh rows', async () => {
  const calls: string[] = [];
  const app = createApplication(async (request) => {
    const req = new Request(request);
    calls.push(req.method);
    if (req.method === 'POST') {
      assert.deepEqual(await req.json(), { name: 'Ada' });
      return response({ user_id: '1', full_name: 'Ada' });
    }
    return response([{ user_id: '1', full_name: 'Ada' }]);
  });
  await app.dispatch({ scope: 'app', type: 'NavigateAction', to: 'create' });
  await app.dispatch({ scope: 'registration', type: 'NameChangedAction', name: 'Ada' });
  await app.dispatch({ scope: 'registration', type: 'SubmitAction' });
  assert.deepEqual(calls, ['POST', 'GET']);
  assert.equal(app.state.navigation.page, 'list');
  assert.equal(app.state['users-list'].status, 'ready');
  assert.deepEqual(app.state['users-list'].rows, [{ id: '1', name: 'Ada' }]);
  assert.equal(app.state.preferences.theme, 'dark');
  assert.deepEqual(app.errors, []);
});

for (const sample of [
  { name: 'HTTP', body: { errors: [{ code: 'DENIED', message: 'Denied', path: [] }] }, status: 403, code: 'DENIED' },
  { name: 'malformed DTO', body: [{ invalid: true }], status: 200, code: 'LIST_FAILED' },
  { name: 'invalid collection', body: { users: [] }, status: 200, code: 'LIST_FAILED' },
]) {
  test(sample.name + ' becomes error state without success', async () => {
    const app = createApplication(async () => response(sample.body, sample.status));
    await app.dispatch({ scope: 'directory', type: 'LoadAction' });
    assert.equal(app.state['users-list'].status, 'error');
    assert.equal(app.state['users-list'].errors[0].code, sample.code);
    assert.deepEqual(app.state['users-list'].rows, []);
    assert.deepEqual(app.errors, []);
  });
}

test('network failure uses the configured fallback', async () => {
  const app = createApplication(async () => { throw new Error('offline'); });
  await app.dispatch({ scope: 'registration', type: 'NameChangedAction', name: 'Ada' });
  await app.dispatch({ scope: 'registration', type: 'SubmitAction' });
  assert.equal(app.state['users-create'].status, 'error');
  assert.equal(app.state['users-create'].errors[0].code, 'CREATE_FAILED');
  assert.equal(app.state.navigation.page, 'list');
});
```

### `checks/reference.ts`

```ts
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
```

### `checks/users.pw.ts`

```ts
import { expect, test } from '@playwright/test';

test('list reacts to intent changes and shows mapped rows', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Users' })).toBeVisible();
  await expect(page.getByTestId('user-row')).toHaveText(['Ada', 'Grace']);
  await page.getByLabel('Search').fill('Grace');
  await expect(page.getByTestId('user-row')).toHaveText(['Grace']);
  await page.getByLabel('Search').fill('missing');
  await expect(page.getByText('No users')).toBeVisible();
});

test('creation follows app navigation and opens a fresh list', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('user-row')).toHaveCount(2);
  await page.getByLabel('Search').fill('Grace');
  await page.getByRole('button', { name: 'Create user', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'New user' })).toBeVisible();
  await page.getByRole('button', { name: 'Save user' }).click();
  await expect(page.getByRole('alert')).toHaveText('Name is required');
  await page.getByLabel('Name', { exact: true }).fill('Linus');
  await page.getByRole('button', { name: 'Save user' }).click();
  await expect(page.getByRole('heading', { name: 'Users' })).toBeVisible();
  await expect(page.getByLabel('Search')).toHaveValue('');
  await expect(page.getByTestId('user-row')).toHaveText(['Ada', 'Grace', 'Linus']);
  await page.getByRole('button', { name: 'Create user', exact: true }).click();
  await expect(page.getByLabel('Name', { exact: true })).toHaveValue('');
});

test('API failure renders the error state', async ({ page }) => {
  await page.goto('/?failure=http');
  await expect(page.getByRole('alert')).toHaveText('Demo denied');
});

test('missing provider reports context failure without constructing a fallback', async ({ page }) => {
  const error = page.waitForEvent('pageerror');
  await page.goto('/?missing-provider');
  expect((await error).message).toMatch(/missing_context|Context was not set/);
});
```

