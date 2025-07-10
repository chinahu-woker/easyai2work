import type { Plugin } from 'vite';
import type { SyncUniModulesFilePreprocessor } from '@dcloudio/uni-uts-v1';
export declare function rewriteUniModulesConsoleExpr(fileName: string, content: string): string;
export declare function createAppAndroidUniModulesSyncFilePreprocessorOnce(isX: boolean): SyncUniModulesFilePreprocessor;
export declare function createAppIosUniModulesSyncFilePreprocessorOnce(isX: boolean): SyncUniModulesFilePreprocessor;
export declare function createAppHarmonyUniModulesSyncFilePreprocessorOnce(isX: boolean): SyncUniModulesFilePreprocessor;
interface UniUTSPluginOptions {
    x?: boolean;
    extApis?: Record<string, [string, string]>;
    isSingleThread?: boolean;
}
export declare function getCurrentCompiledUTSPlugins(): Set<string>;
export declare function getCurrentCompiledUTSProviders(): Set<string>;
export declare function uniUTSAppUniModulesPlugin(options?: UniUTSPluginOptions): Plugin;
export declare function buildUniExtApis(): Promise<void>;
export declare function resolveExtApiProvider(pkg: Record<string, any>): {
    name?: string | undefined;
    plugin?: string | undefined;
    service: string;
    servicePlugin: string;
} | undefined;
export declare function uniDecryptUniModulesPlugin(): Plugin;
export {};
