import { DirectiveTransform } from '../transform';
import { DirectiveNode, ExpressionNode, SimpleExpressionNode } from '@vue/compiler-core';
export declare const inlineStatementCannotUseEventMsg = "Inline statement cannot use $event, please use a function expression instead.";
export interface VOnDirectiveNode extends DirectiveNode {
    arg: ExpressionNode;
    exp: SimpleExpressionNode | undefined;
}
export declare const transformOn: DirectiveTransform;
