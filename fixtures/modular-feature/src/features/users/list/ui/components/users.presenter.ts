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
