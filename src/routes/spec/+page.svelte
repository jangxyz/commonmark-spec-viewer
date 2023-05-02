<script>
	import { fromMarkdown } from 'mdast-util-from-markdown';
	import { toHast } from 'mdast-util-to-hast';
	import { toHtml } from 'hast-util-to-html';
	import { toMdast } from 'hast-util-to-mdast';
	import { frontmatterFromMarkdown } from 'mdast-util-frontmatter';
	import { frontmatter } from 'micromark-extension-frontmatter';
	import { readingTime } from 'hast-util-reading-time';
	import rehypeSlug from 'rehype-slug';
	import rehypeAutolinkHeadings from 'rehype-autolink-headings';

	import numberHeading from './hast_util_number_heading';
	import Toc from './Toc.svelte';
	import Header from './Header.svelte';

	/** @type {import('./$types').PageData} */
	export let data;
	$: ({ spec } = data);

	/** @type {import('./types').MdastRoot} */
	let mdast;
	/** @type {import('./types').MdastNode} */
	let mdast2;
	let matter;

	/** @type {import('./types').HastNodes} */
	let hast;

	/** @type {string} */
	let html = '';

	// ui

	let showToc = true;
	$: sidebarWidth = showToc ? 200 : 0;
	let showOnlySelected = false;

	$: (async (spec) => {
		// mdast
		const options = { type: 'yaml', marker: { open: '-', close: '.' } };
		mdast = fromMarkdown(spec, {
			extensions: [frontmatter(options)],
			mdastExtensions: [frontmatterFromMarkdown(options)]
		});
		// frontmatter
		matter = mdast.children.find((node) => node.type === 'yaml');
		if (!matter) return;

		// hast
		hast = toHast(mdast);
		hast = numberHeading(hast, {
			exclude: ['Appendix: A parsing strategy']
		});

		const slugify = rehypeSlug();
		if (slugify) {
			slugify(hast);
		}

		const autolinkHeadings = rehypeAutolinkHeadings({ behavior: 'append' });
		if (autolinkHeadings) {
			autolinkHeadings(hast);
		}

		if (hast) {
			mdast2 = toMdast(hast);
			html = toHtml(hast);
			//console.log('🚀 ~ file: +page.svelte:58:', { mdast, hast, html });
		}
	})(spec);
</script>

<main style:--sidebar-width={sidebarWidth + 'px'}>
	<header>
		<Header bind:showToc bind:showOnlySelected />
	</header>

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

			<hr />
		</details>

		{@html html}
	</article>

	{#if showToc}
		<aside>
			<Toc mdast={mdast2} />
		</aside>
	{/if}

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
		grid-template-columns: minmax(0, 1fr) var(--sidebar-width);
		grid-template-areas:
			'header header'
			'article aside'
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
	aside {
		min-height: 0;
		overflow: auto;
		border-left: 1px solid black;
		font-size: 85%;
	}
</style>
