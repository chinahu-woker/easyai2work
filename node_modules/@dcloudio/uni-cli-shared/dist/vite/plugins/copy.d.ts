import type { WatchOptions } from 'chokidar';
import type { Plugin } from 'vite';
import { type FileWatcherOptions } from '../../watcher';
export type UniViteCopyPluginTarget = Omit<FileWatcherOptions, 'verbose'> & {
    watchOptions?: WatchOptions & {
        readyTimeout?: number;
    };
};
export interface UniViteCopyPluginOptions {
    targets: UniViteCopyPluginTarget[];
}
export declare function uniViteCopyPlugin({ targets, }: UniViteCopyPluginOptions): Plugin;
