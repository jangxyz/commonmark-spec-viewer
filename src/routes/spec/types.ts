import type { Root as MdastRoot, Content as MdastContent, Text as MdastText } from 'mdast';
import type { Root as HastRoot, Content as HastContent, Text as HastText } from 'hast';

export type HastNodes = HastRoot | HastContent;
export type MdastNode = MdastRoot | MdastContent;

export type { MdastRoot, MdastContent, MdastText };
export type { HastRoot, HastContent, HastText };
