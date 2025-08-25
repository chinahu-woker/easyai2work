import { NodeTransform, TransformContext } from '../transform';
import { ExpressionNode, SimpleExpressionNode } from '@vue/compiler-core';
export declare const transformExpression: NodeTransform;
export declare function processExpression(node: SimpleExpressionNode, context: TransformContext, asParams?: boolean, asRawStatements?: boolean, localVars?: Record<string, number>): ExpressionNode;
export declare function stringifyExpression(exp: ExpressionNode | string): string;
