import type { Plugin, ResolvedConfig } from 'vite';
import { type FilterPattern } from '@rollup/pluginutils';
export declare function uniPrePlugin(config: ResolvedConfig, options: {
    include?: FilterPattern;
    exclude?: FilterPattern;
}): Plugin;
