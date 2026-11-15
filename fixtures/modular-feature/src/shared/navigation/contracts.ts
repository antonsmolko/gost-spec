// Existing application contract, not an export promised by gost-kit.
export type Page = 'list' | 'create';
export type NavigateEffect = { type: 'NavigateEffect'; to: Page };
