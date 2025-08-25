import { Options } from './types.js';
import '@antfu/utils';
import 'unimport';
import 'unplugin-utils';

declare function export_default(options: Options): {
    name: string;
    hooks: {
        'astro:config:setup': (astro: any) => Promise<void>;
    };
};

export { export_default as default };
