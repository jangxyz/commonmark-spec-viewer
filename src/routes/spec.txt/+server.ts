import { readFile } from 'node:fs/promises';

import type { RequestHandler } from '@sveltejs/kit';

const SPEC = await readFile('spec/spec.txt');

export const GET = (() => {
	return new Response(SPEC);
}) satisfies RequestHandler;
