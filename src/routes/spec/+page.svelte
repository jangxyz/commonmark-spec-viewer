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
		hast = numberHeading(hast);
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

	/**
	 * @param { HastNodes } hast
	 * @returns { HastNodes }
	 */
	function numberHeading(hast) {
		/** @type {Object.<number, number>} */
		const numbersSoFar = seq1(1, 6).reduce((memo, r) => ({ ...memo, [r]: 0 }), {});
		let prevRank = Infinity;

		visit(hast, heading, (node) => {
			const rank = headingRank(node);
			if (!rank) return;
			numbersSoFar[rank] = numbersSoFar[rank] ?? 0;
			numbersSoFar[rank] += 1;
			// reset all lower ranks
			if (rank < prevRank) {
				seq(rank + 1, 6).forEach((r) => {
					numbersSoFar[r] = 0;
				});
			}

			const number = numbersSoFar[rank];
			const numbers = seq1(rank).map((r) => numbersSoFar[r]);

			const textNode = /** @type HastText */ (select('text', node));
			console.log(rank, textNode, {
				node,
				number,
				numbers,
				numbersSoFar: structuredClone(numbersSoFar)
			});
			textNode.value = `${numbers.join('.')}. ${textNode.value}`;

			//
			prevRank = rank;
		});
		return hast;
	}

	/**
	 * Sequence from start to end (inclusive), starting from 0
	 *
	 * @param {number} start
	 * @param {number | undefined} end
	 * @return {number[]}
	 */
	function seq(start, end = undefined) {
		const resultSequence = [];
		if (end === undefined) {
			end = start;
			start = 0;
		}

		for (let i = start; i <= end; i += 1) {
			resultSequence.push(i);
		}

		return resultSequence;
	}

	/**
	 * Sequence from start to end (inclusive), starting from 1
	 *
	 * @param {number} start
	 * @param {number | undefined} end
	 * @return {number[]}
	 */
	function seq1(start, end = undefined) {
		const resultSequence = [];
		if (end === undefined) {
			end = start;
			start = 1;
		}

		for (let i = start; i <= end; i += 1) {
			resultSequence.push(i);
		}

		return resultSequence;
	}
</script>

{@html html}
