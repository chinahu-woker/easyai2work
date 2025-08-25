import type { UTSTargetLanguage } from './uts';
type DefineOptions = {
    name?: string;
    app?: boolean | {
        js?: boolean;
        kotlin?: boolean;
        swift?: boolean;
    };
    [key: string]: any;
};
type Define = string | string[] | Record<string, string | DefineOptions> | false;
type Defines = {
    [name: string]: Define;
};
export interface Exports {
    [name: string]: Define | Defines | false;
}
export declare function parseUniExtApis(vite: boolean | undefined, platform: typeof process.env.UNI_UTS_PLATFORM, language?: UTSTargetLanguage): Injects;
type Injects = {
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
export {};
