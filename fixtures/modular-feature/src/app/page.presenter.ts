import type { Page } from '../shared/navigation/contracts.ts';
export type PageView = { list: boolean; create: boolean };
export const pagePresenter = ({ page }: { page: Page }): PageView => ({
  list: page === 'list', create: page === 'create',
});
