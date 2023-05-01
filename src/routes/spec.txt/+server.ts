import type { RequestHandler } from '@sveltejs/kit';

import { readFile } from 'node:fs/promises';
const SPEC = await readFile('spec/spec.txt');

export const GET = (() => {
	return new Response(SPEC);
}) satisfies RequestHandler;
