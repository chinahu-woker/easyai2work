import type { UTSTargetLanguage } from './uts';
export type DefineOptions = {
    name?: string;
    app?: boolean | {
        js?: boolean;
        kotlin?: boolean;
        swift?: boolean;
        arkts?: boolean;
        ['x-arkts']?: boolean;
    };
    [key: string]: any;
};
export type Define = string | string[] | Record<string, string | DefineOptions> | false;
export type Defines = {
    [name: string]: Define;
};
export interface Exports {
    [name: string]: Define | Defines | false;
}
export declare function getUniExtApiProviders(): {
    plugin: string;
    service: string;
    name?: string | undefined;
    servicePlugin?: string | undefined;
}[];
export declare function getUniExtApiPlugins(): {
    plugin: string;
}[];
export declare function formatExtApiProviderName(service: string, name: string): string;
export declare function getUniExtApiProviderRegisters(): {
    name: string;
    plugin: string;
    service: string;
    class: string;
}[];
export declare function parseUniExtApis(vite: boolean | undefined, platform: typeof process.env.UNI_UTS_PLATFORM, language?: UTSTargetLanguage): Injects;
export declare function parseUniExtApi(pluginDir: string, pluginId: string, vite: boolean | undefined, platform: typeof process.env.UNI_UTS_PLATFORM, language?: UTSTargetLanguage): Injects | undefined;
export type Injects = {
    [name: string]: string | [string, string] | [string, string, DefineOptions['app']] | false;
};
/**
 *  uni:'getBatteryInfo'
 * import getBatteryInfo from '..'
 *
 * uni:['getBatteryInfo']
 * import { getBatteryInfo } from '..'
 *
 * uni:['openLocation','chooseLocation']
 * import { openLocation, chooseLocation } from '..'
 *
 * uni:{
 *  onUserCaptureScreen: "onCaptureScreen"
 *  offUserCaptureScreen: "offCaptureScreen"
 * }
 *
 * uni.getBatteryInfo = getBatteryInfo
 * @param source
 * @param globalObject
 * @param define
 * @returns
 */
export declare function parseInjects(vite: boolean | undefined, platform: typeof process.env.UNI_UTS_PLATFORM, language: UTSTargetLanguage, source: string, uniModuleRootDir: string, exports?: Exports): Injects;
/**
 * @private
 */
export declare const camelize: (str: string) => string;
/**
 * @private
 */
export declare const capitalize: (str: string) => string;
/**
 * 解析 UTS 类型的模块依赖列表
 * @param deps
 * @param inputDir
 * @returns
 */
export declare function parseUTSModuleDeps(deps: string[], inputDir: string): string[];
