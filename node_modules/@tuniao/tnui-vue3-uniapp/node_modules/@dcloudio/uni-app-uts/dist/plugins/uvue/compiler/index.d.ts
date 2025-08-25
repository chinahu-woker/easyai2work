import './runtimeHelpers';
import { CodegenResult, CompilerOptions } from './options';
import { DirectiveTransform, NodeTransform } from './transform';
export type TransformPreset = [
    NodeTransform[],
    Record<string, DirectiveTransform>
];
export declare function getBaseTransformPreset(prefixIdentifiers?: boolean): TransformPreset;
export declare function compile(template: string, options: CompilerOptions): CodegenResult;
