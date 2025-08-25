import { Plugin } from 'vite';
import { FilterPattern } from '@rollup/pluginutils';
export interface UniPrePluginOptions {
    include?: FilterPattern;
    exclude?: FilterPattern;
}
export declare function uniPrePlugin(options?: UniPrePluginOptions): Plugin;
