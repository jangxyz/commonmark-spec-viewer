import { visit } from 'unist-util-visit';
import { h } from 'hastscript';
import type { Root as HastRoot, Content as HastContent } from 'hast';

type HastNodes = HastRoot | HastContent;

export default function injectHorizontalRule(hast: HastNodes) {
	visit(
		hast,
		(node: HastNodes) => {
			if (node.type !== 'element') return false;
			return node.tagName === 'h1';
		},
		(_node, index, parent) => {
			//console.log('H1', index, node);
			parent.children.splice(index, 0, h('hr'));
		},
		// run in reverse order, since we are injecting in *before* the node
		true
	);
}
