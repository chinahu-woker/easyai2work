import { type AttributeNode, type DirectiveNode, type ElementNode } from '@vue/compiler-core';
import type { TransformContext } from '../transform';
export declare function rewriteRef(node: ElementNode, context: TransformContext): void;
export declare function parseRefCode(prop: AttributeNode | DirectiveNode, context: TransformContext): {
    code: string;
    refKey: string;
};
export declare function rewriteRefProp(helper: symbol, prop: AttributeNode | DirectiveNode, idProp: AttributeNode | DirectiveNode, opts: Record<string, any>, context: TransformContext): void;
