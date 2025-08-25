import { type AttributeNode, type DirectiveNode } from '@vue/compiler-core';
import type { TransformContext } from '../transform';
export declare function isHiddenBinding({ arg, exp }: DirectiveNode): boolean | undefined;
export declare function findStaticHiddenIndex(props: (AttributeNode | DirectiveNode)[]): number;
export declare function findVShowIndex(props: (AttributeNode | DirectiveNode)[]): number;
export declare function rewriteHidden(index: number, hiddenBindingProp: DirectiveNode, props: (AttributeNode | DirectiveNode)[], virtualHost: boolean, context: TransformContext): void;
export declare function createVirtualHostHidden(props: (AttributeNode | DirectiveNode)[], context: TransformContext): DirectiveNode;
