<script>
	import { fromMarkdown } from 'mdast-util-from-markdown';
	import { toHast } from 'mdast-util-to-hast';
	import { toHtml } from 'hast-util-to-html';

	/** @type {import('./$types').PageData} */
	export let data;
	$: ({ spec } = data);

	/** @type {string} */
	let html = '';

	$: ((spec) => {
		const mdast = fromMarkdown(spec);
		const hast = toHast(mdast);
		html = toHtml(hast);
		console.log('🚀 ~ file: +page.svelte:11:', html, { mdast, hast });
	})(spec);
</script>

{@html html}
