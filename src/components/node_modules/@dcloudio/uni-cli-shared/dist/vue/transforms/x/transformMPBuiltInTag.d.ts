import { type RootNode, type TemplateChildNode, type TransformContext } from '@vue/compiler-core';
export interface TransformMPBuiltInTagOptions {
    propRename?: Record<string, Record<string, string>>;
    propAdd?: Record<string, {
        name: string;
        value: string;
    }[]>;
    tagRename?: Record<string, string>;
}
export declare const defaultTransformMPBuiltInTagOptions: TransformMPBuiltInTagOptions;
export declare function createMPBuiltInTagTransform(options: TransformMPBuiltInTagOptions): (node: RootNode | TemplateChildNode, context: TransformContext) => void;
export declare const transformMPBuiltInTag: (node: RootNode | TemplateChildNode, context: TransformContext) => void;
