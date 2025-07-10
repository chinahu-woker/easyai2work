import type { Plugin } from 'vite';
export declare function addScoped(code: string): string;
interface UniCssScopedPluginOptions {
    filter: (id: string) => boolean;
}
export declare function uniRemoveCssScopedPlugin(_?: UniCssScopedPluginOptions): Plugin;
export declare function uniCssScopedPlugin({ filter }?: UniCssScopedPluginOptions): Plugin;
export {};
