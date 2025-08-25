import { NodeTransform } from '../transform';
import { TextNode, InterpolationNode, TemplateChildNode } from '@vue/compiler-core';
export declare function isText(node: TemplateChildNode): node is TextNode | InterpolationNode;
export declare const transformInterpolation: NodeTransform;
