import type { ResolvedConfig } from 'vite';
import { type UniVitePlugin } from '@dcloudio/uni-cli-shared';
export declare function initUniAppJsEngineCssPlugin(config: ResolvedConfig): void;
export declare function createUniAppJsEnginePlugin(platform: 'app-ios' | 'app-harmony'): () => UniVitePlugin;
