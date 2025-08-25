import type { Plugin } from 'vite';
import type { SFCDescriptor, SFCParseResult } from '@vue/compiler-sfc';
import type { TransformPluginContext } from 'rollup';
import { ResolvedOptions } from './descriptorCache';
export declare function uniAppUVuePlugin(): Plugin;
interface TransformVueResult {
    errors: SFCParseResult['errors'];
    uts?: string;
    js?: string;
    descriptor: SFCDescriptor;
}
export declare function transformVue(code: string, filename: string, options: ResolvedOptions, pluginContext: TransformPluginContext | undefined, isAppVue: ((id: string) => boolean) | undefined, normalizeEasyComSource: (source: string) => string): Promise<TransformVueResult>;
export {};
