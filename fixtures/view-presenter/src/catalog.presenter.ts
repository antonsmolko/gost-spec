import type { CatalogInput, CatalogLabels } from './catalog.ts';

type Params = {
  input: CatalogInput;
  labels: CatalogLabels;
};

type ViewState = {
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
  isLoaded: boolean;
  errorMessage: string;
  rows: { id: string; title: string }[];
};

export const catalogPresenter = ({ input, labels }: Params): ViewState => ({
  isLoading: input.status === 'loading',
  isError: input.status === 'error',
  isEmpty: input.status === 'ready' && input.items.length === 0,
  isLoaded: input.status === 'ready' && input.items.length > 0,
  errorMessage: input.error?.trim() || labels.errorFallback,
  rows: input.items.map(({ id, title }) => ({ id, title: title?.trim() || labels.untitled })),
});
