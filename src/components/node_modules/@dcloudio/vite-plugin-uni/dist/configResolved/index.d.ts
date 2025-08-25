import type { Logger, Plugin } from 'vite';
import type { VitePluginUniResolvedOptions } from '..';
export declare function createConfigResolved(options: VitePluginUniResolvedOptions): Plugin['configResolved'];
export declare function initLogger({ logger, nvue, }: {
    logger: Logger;
    nvue?: boolean;
}): Logger;
