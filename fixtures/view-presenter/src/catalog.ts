export type CatalogInput = {
  readonly status: 'idle' | 'loading' | 'ready' | 'error';
  readonly items: readonly { readonly id: string; readonly title: string | null }[];
  readonly error: string | null;
};

export type CatalogLabels = { readonly untitled: string; readonly errorFallback: string };
