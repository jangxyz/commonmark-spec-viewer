import { EXIT } from 'unist-util-visit';
import { visitParents } from 'unist-util-visit-parents';
import { heading } from 'hast-util-heading';
import { headingRank } from 'hast-util-heading-rank';
import type { Root as HastRoot, Content as HastContent } from 'hast';
import type { Parent } from 'unist';
import type { HastElement, HastParent } from '../types';

type HastNodes = HastRoot | HastContent;

type HastHeadingGroup = [HastElement, ...HastContent[]];

function isHeadingGroup(nodes: HastContent[]): nodes is HastHeadingGroup {
	return heading(nodes[0]);
}

export default function selectHeadingSectionElements(
	hast: HastNodes,
	groupFilter?: (group: HastHeadingGroup, index: number, entire: HastHeadingGroup[]) => boolean
): [HastHeadingGroup[], HastParent] {
	const contentParent = findFirstHeadingsParent(hast);
	if (!contentParent) return; // cannot find any headings

	const headingGroups = splitByHeadings(contentParent);
	// no filter, return every groups.
	if (!groupFilter) return [headingGroups, contentParent];

	// collect groups
	const collectResult = headingGroups
		.reduce((memo, group, index, entire) => {
			const lastMatch = memo.at(-1);

			const didMatch = groupFilter(group, index, entire);
			// add new match
			if (didMatch) {
				memo.push({
					group,
					rank: headingRank(group[0])
				});
			} else if (lastMatch) {
				// has last match. see if it should be contiguous
				const rank = headingRank(group[0]);
				const isLowerRank = rank > lastMatch.rank;
				//console.log('has last match', isLowerRank, group, { rank, lastMatch, memo: structuredClone(memo) });
				// concat to last match
				if (isLowerRank) {
					lastMatch.group = lastMatch.group.concat(group) as HastHeadingGroup;
				}
				// clear last match
				else {
					memo.push(undefined);
				}
			}
			return memo;
		}, [] as { group: HastHeadingGroup; rank: number }[])
		.filter(Boolean);
	const filteredGroups = collectResult.map(({ group }) => group);

	return [filteredGroups, contentParent];
}

function getHeadingGroups(hast: HastNodes): [HastHeadingGroup[], HastParent] | undefined {
	const contentParent = findFirstHeadingsParent(hast);
	if (!contentParent) return;

	return [splitByHeadings(contentParent), contentParent];
}

function findFirstHeadingsParent(hast: HastNodes): HastParent | undefined {
	// find first heading elements' parent.
	let contentParent: Parent<HastContent>;
	visitParents(hast, heading, (_node, ancestors) => {
		contentParent = ancestors.at(-1);
		return EXIT;
	});

	return contentParent;
}

function splitByHeadings(contentParent: HastParent): HastHeadingGroup[] {
	const headingGroups = contentParent.children
		.reduce(
			(memo, node) => {
				// add new group
				if (heading(node)) {
					memo.push([node]);
				}
				// add to existing group
				else {
					memo.at(-1).push(node);
				}
				return memo;
			},
			[[]] as HastContent[][]
		)
		.filter((group) => group.length > 0);

	// check type
	if (!headingGroups.some(isHeadingGroup)) {
		throw new Error('first element is not a heading eleement');
	}

	return headingGroups as HastHeadingGroup[];
}

//

type ResultTuple = [HastHeadingGroup, ResultTuple[]];
function getNestedGroupMap(hast: HastNodes): ResultTuple[] {
	// find first heading elements' parent.
	const contentParent = findFirstHeadingsParent(hast);
	if (!contentParent) return;

	// split by heading
	const headingGroups: HastHeadingGroup[] = splitByHeadings(contentParent);

	// nest by heading rank: { group => groups[] }
	const nestedGroupMap: Map<HastHeadingGroup, HastHeadingGroup[]> = new Map();
	// { rank => groups[] }
	const prevRankGroupsChain: Record<number, HastHeadingGroup[]> = {};
	headingGroups.reduce((prevRank, group) => {
		const rank = headingRank(group[0]);

		// reset prev rank if met higher rank
		if (rank < prevRank) {
			for (let i = rank; i <= 6; i += 1) {
				delete prevRankGroupsChain[i];
			}
		}

		if (rank > 1) {
			const higherRank = rank - 1;
			const lastHigherGroup = prevRankGroupsChain[higherRank].at(-1);
			if (!nestedGroupMap.has(lastHigherGroup)) {
				nestedGroupMap.set(lastHigherGroup, []);
			}
			nestedGroupMap.get(lastHigherGroup).push(group);
		}

		//
		prevRankGroupsChain[rank] = prevRankGroupsChain[rank] ?? [];
		prevRankGroupsChain[rank].push(group);

		return rank;
	}, Infinity);

	// render results
	const visited = new Map();
	const result = [...nestedGroupMap.keys()].reduce((memo, parentGroup) => {
		if (visited.get(parentGroup)) return memo;

		// mark visited
		visited.set(parentGroup, true);

		const resultTuple = buildGroupTuple(parentGroup, nestedGroupMap, (group) => {
			//visited.set(group, true);
		});

		memo.push(resultTuple);
		return memo;
	}, [] as ResultTuple[]);

	console.log('result;', result, { nestedGroupMap });

	return result;

	function buildGroupTuple(
		group: HastHeadingGroup,
		nestedGroupMap,
		callback?: (group: HastHeadingGroup) => void
	): ResultTuple {
		if (typeof callback === 'function') {
			callback(group);
		}

		const childrenGroups = nestedGroupMap.get(group);
		if (childrenGroups === undefined) {
			return [group, []];
		}

		return [
			group,
			childrenGroups.map((childGroup) => buildGroupTuple(childGroup, nestedGroupMap, callback))
		];
	}
}
