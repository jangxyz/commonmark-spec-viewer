<script>
	import { page } from '$app/stores';

	import { fromMarkdown } from 'mdast-util-from-markdown';
	import { toHast } from 'mdast-util-to-hast';
	import { toHtml } from 'hast-util-to-html';
	import { toMdast } from 'hast-util-to-mdast';
	import { frontmatterFromMarkdown } from 'mdast-util-frontmatter';
	import { frontmatter } from 'micromark-extension-frontmatter';
	import { readingTime } from 'hast-util-reading-time';
	import rehypeSlug from 'rehype-slug';
	import rehypeAutolinkHeadings from 'rehype-autolink-headings';

	import numberHeading from '../../lib/hast/hast_util_number_heading';
	import selectHeadingSectionElements from '../../lib/hast/hast_select_heading_section_elements';
	import Toc from './Toc.svelte';
	import Header from './Header.svelte';
	import injectHorizontalRule from '../../lib/hast/hast_inject_horizontal_rule';

	$: urlHash = $page.url.hash;

	/**
	 * @typedef {import('../../lib/types').HastNodes} HastNodes
	 */

	/** @type {import('./$types').PageData} */
	export let data;
	$: ({ spec } = data);

	/** @type {import('../../lib/types').MdastRoot} */
	let mdast;
	/** @type {import('../../lib/types').MdastNode} */
	let mdast2;
	let matter;

	/** @type {HastNodes} */
	let hast;

	/** @type {string} */
	let html = '';

	// ui

	let showToc = true;
	$: sidebarWidth = showToc ? 200 : 0;
	let showOnlySelected = false;

	// render markdown
	$: (async (spec) => {
		// mdast
		const options = { type: 'yaml', marker: { open: '-', close: '.' } };
		mdast = fromMarkdown(spec, {
			extensions: [frontmatter(options)],
			mdastExtensions: [frontmatterFromMarkdown(options)]
		});

		// extract frontmatter
		matter = mdast.children.find((node) => node.type === 'yaml');

		// hast
		hast = toHast(mdast);
		console.log('🚀 ~ file: +page.svelte:63 ~ $: ~ hast:', hast);
		if (hast) {
			hast = normalizeHast(hast);
		}
	})(spec);

	// re-convert to markdown
	$: if (hast) {
		mdast2 = toMdast(hast);
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

	$: {
		let hast2 = hast;
		// refine on selected
		if (urlHash && showOnlySelected) {
			const groupsAndParent = selectHeadingSectionElements(hast2, ([headingNode]) => {
				return headingNode?.properties?.id === urlHash.slice(1);
			});
			if (groupsAndParent) {
				const [groups, parent] = groupsAndParent;
				parent.children = groups[0];
			}
		}

		// export to html
		html = toHtml(hast2);
	}
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
					Estimated reading time: {readingTime(hast).toFixed(1)} minutes.
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
	summary > * {
		display: inline-block;
		margin: 0;
		padding-left: 4px;
		vertical-align: middle;
	}

	article {
		padding: 10px;
		min-height: 0;
		overflow: auto;
	}
	article :is(h1, h2, h3, h4, h5, h6) {
		margin: 0;
	}
	article :global(:is(code)) {
		font-family: monospace;
		background-color: #d3e1e4;
	}
	article :global(:is(pre > code)) {
		background-color: transparent;
	}

	aside {
		min-height: 0;
		overflow: auto;
		border-right: 1px solid black;
		font-size: 85%;
	}
</style>
