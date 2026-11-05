import type { CatalogInput, CatalogLabels } from './catalog.ts';

export const presentRows = (items: CatalogInput['items'], labels: Pick<CatalogLabels, 'untitled'>) =>
  items.map(({ id, title }) => ({ id, title: title?.trim() || labels.untitled }));

export const presentStatus = (input: CatalogInput, labels: Pick<CatalogLabels, 'errorFallback'>) => ({
  isLoading: input.status === 'loading',
  isError: input.status === 'error',
  isEmpty: input.status === 'ready' && input.items.length === 0,
  isLoaded: input.status === 'ready' && input.items.length > 0,
  errorMessage: input.error?.trim() || labels.errorFallback,
});

export const presentCatalog = (input: CatalogInput, labels: CatalogLabels) => ({
  ...presentStatus(input, labels), rows: presentRows(input.items, labels),
});
