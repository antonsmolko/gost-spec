export type User = { id: string; name: string };
export const user = (options: Partial<User> = {}): User => ({ id: '1', name: 'Ada', ...options });
