import type { Root as MdastRoot, Content as MdastContent, Text as MdastText } from 'mdast';
import type {
	Root as HastRoot,
	Content as HastContent,
	Element as HastElement,
	Text as HastText,
	Parent as HastParent
} from 'hast';

export type MdastNode = MdastRoot | MdastContent;
export type HastNodes = HastRoot | HastContent;

export type { MdastRoot, MdastContent, MdastText };
export type { HastRoot, HastContent, HastParent, HastElement, HastText };
