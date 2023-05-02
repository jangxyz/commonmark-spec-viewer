<script>
	import { visit } from 'unist-util-visit';
	import { fromMarkdown } from 'mdast-util-from-markdown';
	import { toHast } from 'mdast-util-to-hast';
	import { toHtml } from 'hast-util-to-html';
	import { frontmatterFromMarkdown } from 'mdast-util-frontmatter';
	import { frontmatter } from 'micromark-extension-frontmatter';
	import { heading } from 'hast-util-heading';
	import { headingRank } from 'hast-util-heading-rank';
	import { select } from 'unist-util-select';
	//import { is } from 'unist-util-is';
	import { toString } from 'hast-util-to-string';
	import numberHeading from './number_heading';

	/**
	 * @typedef { import('mdast-util-to-hast').HastNodes } HastNodes
	 * @typedef { import('hast').Text } HastText
	 */

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
		if (!matter) return;

		let hast = toHast(mdast);
		hast = numberHeading(hast, {
			//exclude: [(node) => heading(node) && toString(node) === 'Appendix: A parsing strategy']
			exclude: ['Appendix: A parsing strategy']
		});
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
