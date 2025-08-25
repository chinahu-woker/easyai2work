import type { Plugin } from 'vite';
export declare function uniUTSUVueJavaScriptPlugin(options?: {}): Plugin;
/**
 * 将 <script> 标签中的 lang="uts" 替换为 lang="ts"
 * 主要是当前功能内部使用 x.vite.config.ts 配置
 * @param options
 * @returns
 */
export declare function uniUVueTypeScriptPlugin(options?: {}): Plugin;
