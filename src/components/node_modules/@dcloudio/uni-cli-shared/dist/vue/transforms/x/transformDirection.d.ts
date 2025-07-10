import { type RootNode, type TemplateChildNode, type TransformContext } from '@vue/compiler-core';
/**
 * 将direction属性转化为scroll-x和scroll-y
 * 注意transformMPBuiltInTag内会讲list-view转化为scroll-view，所以此transform应该在transformMPBuiltInTag之后执行
 */
export declare const transformDirection: (node: RootNode | TemplateChildNode, context: TransformContext) => void;
