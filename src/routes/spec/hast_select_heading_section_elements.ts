import { EXIT } from 'unist-util-visit';
import { visitParents } from 'unist-util-visit-parents';
import { heading } from 'hast-util-heading';
import { headingRank } from 'hast-util-heading-rank';
import type { Root as HastRoot, Content as HastContent } from 'hast';
import type { Parent } from 'unist';
import type { HastElement, HastParent } from './types';

type HastNodes = HastRoot | HastContent;

type HastHeadingGroup = [HastElement, ...HastContent[]];

type ResultTuple = [HastHeadingGroup, ResultTuple[]];

export default function selectHeadingSectionElements(
	hast: HastNodes,
	groupFilter?: (group: HastHeadingGroup, index: number, entire: HastHeadingGroup[]) => boolean
): [HastHeadingGroup[], HastParent] {
	const headingGroupsResult = getHeadingGroups(hast);
	if (!headingGroupsResult) return;
	if (!groupFilter) return headingGroupsResult;

	const [headingGroups, parent] = headingGroupsResult;
	const filteredGroups = headingGroups.filter(groupFilter);

	return [filteredGroups, parent];
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
	return contentParent.children
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
}

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
