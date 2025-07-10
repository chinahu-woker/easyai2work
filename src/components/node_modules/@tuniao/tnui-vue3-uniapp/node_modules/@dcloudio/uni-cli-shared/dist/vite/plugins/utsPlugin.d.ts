import type { Plugin } from 'vite';
interface UniUTSPluginOptions {
    x?: boolean;
    extApis?: Record<string, [string, string]>;
}
export declare const utsPlugins: Set<string>;
export declare function uniUTSPlugin(options?: UniUTSPluginOptions): Plugin;
export {};
