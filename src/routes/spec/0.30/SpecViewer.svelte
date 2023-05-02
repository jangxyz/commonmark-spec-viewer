<script>
	import { onMount } from 'svelte';

	import { fromMarkdown } from 'mdast-util-from-markdown';
	import { toHast } from 'mdast-util-to-hast';
	import { toHtml } from 'hast-util-to-html';
	import { toMdast } from 'hast-util-to-mdast';
	import { frontmatterFromMarkdown } from 'mdast-util-frontmatter';
	import { frontmatter } from 'micromark-extension-frontmatter';
	import { readingTime } from 'hast-util-reading-time';
	import { raw } from 'hast-util-raw';
	import rehypeSlug from 'rehype-slug';
	import rehypeAutolinkHeadings from 'rehype-autolink-headings';

	import numberHeading from '$lib/hast/hast_util_number_heading';
	import selectHeadingSectionElements from '$lib/hast/hast_select_heading_section_elements';
	import Toc from './Toc.svelte';
	import Header from './Header.svelte';
	import injectHorizontalRule from '$lib/hast/hast_inject_horizontal_rule';
	import numberExampleCodes from '$lib/hast/hast_util_number_example_codes';

	import './article.css';

	/**
	 * @typedef {import('$lib/types').HastNodes} HastNodes
	 * @typedef {import('$lib/types').HastRoot} HastRoot
	 * @typedef {import('$lib/types').MdastRoot} MdastRoot
	 * @typedef {import('$lib/types').MdastNode} MdastNode
	 */

	export let urlHash;
	export let spec;

	/** @type {MdastRoot} */
	let mdast;
	/** @type {MdastNode} */
	let mdast2;
	let matter;

	/** @type {HastNodes} */
	let hast;
	/** @type {HastNodes} */
	let hast2; // refined

	/** @type {string} */
	let html = '';

	// ui

	let showToc = true;
	$: sidebarWidth = showToc ? 200 : 0;

	export let showOnlySelected = false;

	// render markdown
	$: (async (spec) => {
		// markdown -> mdast
		mdast = parseMarkdown(spec);
		// extract frontmatter
		matter = mdast.children.find((node) => node.type === 'yaml');

		// mdast -> hast
		hast = toHast(mdast);
		hast = raw(hast);
		if (hast) {
			hast = normalizeHast(hast);
		}
		// re-convert to markdown
		mdast2 = toMdast(hast);
	})(spec);

	// refine hast
	$: {
		hast2 = refineHast(hast, urlHash, showOnlySelected);
	}

	// render html
	$: {
		html = toHtml(hast2);
	}

	/**
	 * @param {string} markdown
	 * @returns {MdastRoot}
	 */
	function parseMarkdown(markdown) {
		const options = { type: 'yaml', marker: { open: '-', close: '.' } };
		const mdast = fromMarkdown(spec, {
			extensions: [frontmatter(options)],
			mdastExtensions: [frontmatterFromMarkdown(options)]
		});

		return mdast;
	}

	/**
	 * @param {HastNodes} hast
	 * @returns {HastNodes}
	 */
	function normalizeHast(hast) {
		injectHorizontalRule(hast, 'h1');

		hast = numberHeading(hast, {
			exclude: ['Appendix: A parsing strategy']
		});

		numberExampleCodes(hast);

		// inject slug & heading links
		const slugify = rehypeSlug();
		if (slugify) {
			slugify(hast);
		}
		const autolinkHeadings = rehypeAutolinkHeadings({ behavior: 'append' });
		if (autolinkHeadings) {
			autolinkHeadings(hast);
		}

		return hast;
	}

	/**
	 *
	 * @param {HastNodes} hast
	 * @param {string} urlHash
	 * @param {boolean} showOnlySelected
	 * @returns {HastNodes}
	 */
	function refineHast(hast, urlHash, showOnlySelected) {
		//console.log('refineHast', hast, { urlHash, showOnlySelected });
		if (!(urlHash && showOnlySelected)) return hast;

		const hast2 = structuredClone(hast);
		// select id matching url hash string
		const groupsAndParent = selectHeadingSectionElements(hast2, ([headingNode]) => {
			return headingNode?.properties?.id === urlHash.slice(1);
		});
		if (groupsAndParent) {
			const [groups, parent] = groupsAndParent;
			parent.children = groups[0];
		}

		//console.log('🚀 ~ file: +page.svelte:129 ~ refineHast ~ hast2:', hast2);
		return hast2;
	}

	onMount(() => {
		if (urlHash) {
			hast2 = refineHast(hast, urlHash, showOnlySelected);
		}
	});
</script>

<main style:--sidebar-width={sidebarWidth + 'px'}>
	<header>
		<Header bind:showToc bind:showOnlySelected />
	</header>

	{#if showToc}
		<aside>
			<Toc mdast={mdast2} />
		</aside>
	{/if}

	<article>
		<details>
			<summary>Meta</summary>

			<div class="meta">
				{#if matter}
					<pre><code>{matter.value}</code></pre>
				{/if}

				<p>
					Estimated reading time: {readingTime(hast2).toFixed(1)} minutes
				</p>
			</div>
		</details>

		{@html html}
	</article>

	<footer>
		<!--  -->
	</footer>
</main>

<style>
	:global(body) {
		overflow: hidden;
	}
	main {
		--sidebar-width: 200px;
	}

	/* layout */

	main {
		height: 100%;
		display: grid;
		grid-template-columns: var(--sidebar-width) minmax(0, 1fr);
		grid-template-areas:
			'header header'
			'aside article'
			'footer footer';
	}
	header {
		grid-area: header;
	}
	article {
		grid-area: article;
		height: 100%;
	}
	aside {
		grid-area: aside;
		height: 100%;
	}
	footer {
		grid-area: footer;
	}

	/*  */

	summary {
		user-select: none;
		cursor: pointer;
	}

	article {
		padding: 10px;
		min-height: 0;
		overflow: auto;
	}

	aside {
		min-height: 0;
		overflow: auto;
		border-right: 1px solid black;
		font-size: 85%;
	}
</style>
