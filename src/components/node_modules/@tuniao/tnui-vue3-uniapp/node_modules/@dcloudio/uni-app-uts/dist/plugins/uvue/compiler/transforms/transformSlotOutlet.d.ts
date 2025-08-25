import { NodeTransform, TransformContext } from '../transform';
import { ExpressionNode, SlotOutletNode } from '@vue/compiler-core';
import { PropsExpression } from '@vue/compiler-core';
export declare const transformSlotOutlet: NodeTransform;
interface SlotOutletProcessResult {
    slotName: string | ExpressionNode;
    slotProps: PropsExpression | undefined;
}
export declare function processSlotOutlet(node: SlotOutletNode, context: TransformContext): SlotOutletProcessResult;
export {};
