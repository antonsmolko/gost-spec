import { mount } from 'svelte';
import App from './App.svelte';
import { ListPage } from './features/users/list/ui/index.ts';
import { createDemoTransport } from './demo.ts';
const target = document.getElementById('app');
if (!target) throw new Error('Missing app target');
const query = new URLSearchParams(location.search);
if (query.has('missing-provider')) mount(ListPage, { target });
else mount(App, { target, props: { transport: createDemoTransport(query.has('failure')) } });
