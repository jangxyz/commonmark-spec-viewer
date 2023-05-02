import { visit } from 'unist-util-visit';
import { heading } from 'hast-util-heading';
import { headingRank } from 'hast-util-heading-rank';
import { select } from 'unist-util-select';
import { toString } from 'hast-util-to-string';
import type { Root as HastRoot, Content as HastContent, Text as HastText } from 'hast';

type HastNodes = HastRoot | HastContent;

type ExcludeOption1 = {
	text: string;
	rank: number;
};
type ExcludeOption2 = {
	text: string;
	recursive: boolean;
};
type ExcludeOption = ExcludeOption1 | ExcludeOption2;

export default function numberHeading(
	hast: HastNodes,
	options: { exclude?: (string | ExcludeOption)[] } = {}
): HastNodes {
	const excludeOptions = (options.exclude ?? []).map((exclude) => {
		if (typeof exclude === 'string') {
			return {
				text: exclude,
				rank: null,
				recursive: true
			};
		}
		return exclude;
	});

	const numbersSoFar: Record<number, number> = seq1(1, 6).reduce(
		(memo, r) => ({ ...memo, [r]: 0 }),
		{}
	);
	const prevRankMap: Record<number, HastNodes> = {};
	let prevRank = Infinity;

	visit(hast, heading, (node: HastNodes) => {
		const rank = headingRank(node);
		if (!rank) return;

		// check if this node is excluded
		const noNumbering = excludeOptions.some((excludeOption) => {
			const checkNode = (node: HastNodes) => toString(node) === excludeOption.text;

			// check current node
			if (checkNode(node)) {
				if ('rank' in excludeOption) {
					if (excludeOption.rank === rank) return true;
				} else return true;
			}

			// check any higher rank
			if ('recursive' in excludeOption && excludeOption.recursive && hasPrevRank(node, checkNode)) {
				console.log('has prev rank', node);
				return true;
			}

			return false;
		});

		if (!noNumbering) {
			numbersSoFar[rank] = numbersSoFar[rank] ?? 0;
			numbersSoFar[rank] += 1;
			// reset all lower ranks
			if (rank < prevRank) {
				seq(rank + 1, 6).forEach((r) => {
					numbersSoFar[r] = 0;
				});
				seq(rank + 1, 6).forEach((r) => {
					delete prevRankMap[r];
				});
			}

			//const number = numbersSoFar[rank];
			const numbers = seq1(rank).map((r) => numbersSoFar[r]);

			const textNode = select('text', node) as HastText;
			//console.log(rank, textNode, { node, number, numbers, numbersSoFar: structuredClone(numbersSoFar) });
			textNode.value = `${numbers.join('.')}. ${textNode.value}`;
		}

		//
		prevRank = rank;
		prevRankMap[rank] = node;
	});
	return hast;

	function hasPrevRank(node: HastNodes, test: (node: HastNodes, rank: number) => boolean): boolean {
		let result = false;
		//console.log('testing has prev rank..', node);
		followPrevRanks(node, (prevRankNode, rank) => {
			const testResult = test(prevRankNode, rank);
			//console.log('testing...', prevRankNode, rank, '=>', testResult);
			if (testResult) {
				result = testResult;
				return false; // stop iteration.
			}
		});
		return result;
	}

	function followPrevRanks(
		node: HastNodes,
		callback: (prevRankNode: HastNodes, rank: number) => false | undefined
	): void {
		const rank = headingRank(node);
		//console.log('follow prev ranks', node, rank, prevRankMap);
		if (!rank) return;

		const higherRank = rank - 1;
		const prevRankNode = prevRankMap[higherRank];
		if (!prevRankNode) return;

		const result = callback(prevRankNode, higherRank);
		// exit immediately on false.
		if (result === false) return;

		followPrevRanks(prevRankNode, callback);
	}
}

// utils

/**
 * Sequence from start to end (inclusive), starting from 0
 */
function seq(start: number, end: number | undefined = undefined): number[] {
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
 */
function seq1(start: number, end: number | undefined = undefined): number[] {
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
