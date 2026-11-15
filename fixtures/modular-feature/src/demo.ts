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
