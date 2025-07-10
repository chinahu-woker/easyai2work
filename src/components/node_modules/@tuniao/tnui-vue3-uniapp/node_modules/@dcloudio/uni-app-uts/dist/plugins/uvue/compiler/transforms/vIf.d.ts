import { DirectiveNode, ElementNode, IfBranchNode, IfNode } from '@vue/compiler-core';
import { TransformContext } from '../transform';
export declare const transformIf: import("../transform").NodeTransform;
export declare function processIf(node: ElementNode, dir: DirectiveNode, context: TransformContext, processCodegen?: (node: IfNode, branch: IfBranchNode, isRoot: boolean) => (() => void) | undefined): (() => void) | undefined;
