import type { SFCScriptCompileOptions } from '@vue/compiler-sfc';
import { type UniMiniProgramPluginOptions } from './plugin';
export { UniMiniProgramPluginOptions } from './plugin';
declare const _default: (options: UniMiniProgramPluginOptions) => (import("vite").Plugin<any> | import("rollup").Plugin<any>[] | ((options: {
    vueOptions?: {
        script?: Partial<SFCScriptCompileOptions>;
    };
}) => import("vite").Plugin<any>))[];
export default _default;
export declare function resolveMiniProgramRuntime(dirname: string, fileName: string): string;
