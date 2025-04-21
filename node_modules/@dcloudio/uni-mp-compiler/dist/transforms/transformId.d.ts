import { type AttributeNode, type DirectiveNode } from '@vue/compiler-core';
import type { TransformContext } from '../transform';
export declare function isIdBinding({ arg, exp }: DirectiveNode): boolean | undefined;
export declare function findStaticIdIndex(props: (AttributeNode | DirectiveNode)[]): number;
export declare function rewriteId(index: number, idBindingProp: DirectiveNode, props: (AttributeNode | DirectiveNode)[], virtualHost: boolean, context: TransformContext, isX?: boolean): void;
export declare function createVirtualHostId(props: (AttributeNode | DirectiveNode)[], context: TransformContext, isX?: boolean): DirectiveNode;
