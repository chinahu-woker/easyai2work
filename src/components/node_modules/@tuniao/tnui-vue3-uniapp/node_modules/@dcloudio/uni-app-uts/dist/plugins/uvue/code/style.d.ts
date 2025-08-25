import type { SFCDescriptor } from '@vue/compiler-sfc';
import type { PluginContext, TransformPluginContext } from 'rollup';
import { ResolvedOptions } from '../descriptorCache';
export declare function genStyle(_: SFCDescriptor, { className }: {
    className: string;
    filename: string;
}): string;
export declare function genJsStylesCode(descriptor: SFCDescriptor, pluginContext: PluginContext): Promise<string>;
export declare function transformStyle(code: string, descriptor: SFCDescriptor, index: number, options: ResolvedOptions, pluginContext: TransformPluginContext, filename: string): Promise<{
    code: string;
    map: null;
} | null>;
