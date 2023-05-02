<script>
	import { fromMarkdown } from 'mdast-util-from-markdown';
	import { toHast } from 'mdast-util-to-hast';
	import { toHtml } from 'hast-util-to-html';
	import { frontmatterFromMarkdown } from 'mdast-util-frontmatter';
	import { frontmatter } from 'micromark-extension-frontmatter';

	/** @type {import('./$types').PageData} */
	export let data;
	$: ({ spec } = data);

	/** @type {string} */
	let html = '';

	$: ((spec) => {
		const options = { type: 'yaml', marker: { open: '-', close: '.' } };
		const mdast = fromMarkdown(spec, {
			extensions: [frontmatter(options)],
			mdastExtensions: [frontmatterFromMarkdown(options)]
		});
		const matter = mdast.children.find((node) => node.type === 'yaml');
		const hast = toHast(mdast);
		if (hast) {
			html = toHtml(hast);
			console.log('🚀 ~ file: +page.svelte:11:', matter?.value, {
				frontmatter: matter?.value,
				mdast,
				hast,
				html
			});
		}
	})(spec);
</script>

{@html html}
