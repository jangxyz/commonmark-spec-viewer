import { readFile } from 'node:fs/promises';
import type { PageServerLoad } from './$types';
const spec = await readFile('spec/spec.txt', 'utf-8');

export const load = (async () => {
	return { spec };
}) satisfies PageServerLoad;
