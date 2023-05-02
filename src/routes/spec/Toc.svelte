<script lang="ts">
	import { toHast } from 'mdast-util-to-hast';
	import { toHtml } from 'hast-util-to-html';
	import { toc } from 'mdast-util-toc';
	import type { Result } from 'mdast-util-toc';
	import type { MdastNode } from './types';

	export let mdast: MdastNode;

	let html: string;

	$: {
		const table = toc(mdast);
		let hast = toHast(table.map);
		html = toHtml(hast);
	}
</script>

<div>
	{@html html}
</div>

<style>
	div {
		margin: 10px 0;
		overflow-x: hidden;
	}
	div :global(ul) {
		margin: 0 0 0 1em;
		padding: 0;

		list-style: none;
	}
	div :global(li) {
		white-space: nowrap;
	}
	div :global(li > p) {
		margin: 1em 0 0.5em;
	}
	div :global(li li > p) {
		margin: 0;
	}
</style>
