import { visit, type Visitor, type VisitorResult } from 'unist-util-visit';
import { h } from 'hastscript';
import type { Root as HastRoot, Content as HastContent, Parent as HastParent } from 'hast';

type HastNodes = HastRoot | HastContent;

export default function injectHorizontalRule(
	hast: HastNodes,
	test: string | ((node: HastNodes) => boolean),
	action: 'before' | 'after' | Visitor = 'before',
	reverse = undefined
) {
	// resolve
	if (typeof test === 'string') {
		test = (
			(test) => (node) =>
				node.type == 'element' && node.tagName === test
		)(test);
	}

	// resolve visit handle
	const visitHandler =
		typeof action === 'string'
			? {
					before: insertBefore,
					after: insertAfter
			  }[action]
			: action;

	// run in reverse order, since we are injecting in *before* the node
	if (reverse === undefined) {
		reverse = action === 'before';
	}

	visit(hast, test, visitHandler, reverse);

	return hast;
}

function insertBefore(node: HastNodes, index: number, parent: HastParent): VisitorResult {
	parent.children.splice(index, 0, h('hr'));
}

function insertAfter(node: HastNodes, index: number, parent: HastParent): VisitorResult {
	parent.children.splice(index + 1, 0, h('hr'));
}
