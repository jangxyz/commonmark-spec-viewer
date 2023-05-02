import { SKIP, visit } from 'unist-util-visit';
import { matches, select } from 'unist-util-select';
import { h } from 'hastscript';
import { fromSelector } from 'hast-util-from-selector';
import { toString } from 'hast-util-to-string';
import { isElement } from 'hast-util-is-element';
import type {
	Root as HastRoot,
	Content as HastContent,
	Element as HastElement,
	Parent as HastParent,
	Text as HastText
} from 'hast';
import { fromHtml } from 'hast-util-from-html';

type HastNodes = HastRoot | HastContent;

type HastExampleCode = HastElement & { tagName: 'code' };
type HastExamplePre = HastElement & { tagName: 'pre' };

function isExampleCode(
	node: HastNodes,
	index: number,
	parent: HastElement
): node is HastExampleCode {
	return Boolean(select('pre > code.language-example', node));
	//return (
	//	node.type === 'element' &&
	//	node.tagName === 'code' &&
	//	node.properties?.className?.includes('language-example') &&
	//	parent.type === 'element' &&
	//	parent.tagName === 'pre'
	//);
}

function isExampleCodePre(
	node: HastNodes,
	_index: number,
	_parent: HastElement
): node is HastExamplePre {
	//return matches('pre:has(> code.language-example)', node);
	if (!(node.type === 'element' && node.tagName === 'pre')) return false;
	const child = node.children[0];
	return (
		child.type === 'element' &&
		child.tagName === 'code' &&
		(child.properties?.className as string[])?.includes('language-example')
	);
}

function assert(condition: unknown) {
	if (!Boolean(condition)) {
		throw new Error('condition did not match:', condition);
	}
}

export default function numberExampleCodes(hast: HastNodes): HastNodes {
	let numberSoFar = 0;

	visit(hast, isExampleCodePre, (preEl: HastExamplePre, index: number, parent: HastParent) => {
		//
		//const codeEl = select(':scope > code.language-example', preEl);
		const codeEl = preEl.children[0] as HastExampleCode;
		//assert(matches('code.language-example', codeEl));
		const codeText = codeEl.children[0] as HastText;

		const [text1, text2] = codeText.value.split('\n.\n');

		//const codeHast = fromHtml(codeText.value, { fragment: true });
		//console.log('pre:', preEl, preEl.children, { codeEl, codeText });

		// number
		const exNumber = numberSoFar + 1;
		//preEl.properties['number'] = exNumber;

		codeEl.children = [{ type: 'text', value: text1 }];

		// wrap with fig
		const idAttr = `example-${exNumber}`;
		const dingusLink = h(
			'a.dingus',
			{
				href: `https://spec.commonmark.org/dingus/?text=${encodeURIComponent(text1)}`,
				title: 'open in interactive dingus',
				target: '_blank',
				rel: 'noopener noreferer'
			},
			'Try It'
		);
		const wrapper = h(`figure#${idAttr}.example-code`, [
			h('figcaption', [
				h('span.title', [h('a', { href: `#${idAttr}` }, `Example ${exNumber}`)]),
				dingusLink
			]),
			h('div.columns', [
				h('div.column.left', [preEl]),
				h('div.column.right', [h('pre', h('code', [{ type: 'text', value: text2 }]))])
			])
		]);

		parent.children.splice(index, 1, wrapper);

		numberSoFar += 1;
		// move on to next node
		return SKIP;
	});

	return hast;
}
