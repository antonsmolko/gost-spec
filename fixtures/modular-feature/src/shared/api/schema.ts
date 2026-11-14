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
