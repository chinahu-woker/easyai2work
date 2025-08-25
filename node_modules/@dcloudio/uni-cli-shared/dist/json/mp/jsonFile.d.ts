import type { ComponentJson, MiniProgramComponentsType, PageWindowOptions, UsingComponents } from './types';
export declare function isMiniProgramPageFile(file: string, inputDir?: string): boolean;
export declare function isMiniProgramPageSfcFile(file: string, inputDir?: string): boolean;
export declare function hasJsonFile(filename: string): boolean;
export declare function getComponentJsonFilenames(): string[];
export declare function findJsonFile(filename: string): Record<string, any> | ComponentJson | PageWindowOptions | undefined;
export declare function findUsingComponents(filename: string): UsingComponents | undefined;
export declare function normalizeJsonFilename(filename: string): string;
export declare function findChangedJsonFiles(supportGlobalUsingComponents?: boolean): Map<string, string>;
export declare function addMiniProgramAppJson(appJson: Record<string, any>): void;
export declare function addMiniProgramPageJson(filename: string, json: PageWindowOptions): void;
export declare function addMiniProgramComponentJson(filename: string, json: ComponentJson): void;
export declare function addMiniProgramUsingComponents(filename: string, json: UsingComponents): void;
export declare function isMiniProgramUsingComponent(name: string, options: {
    filename: string;
    inputDir: string;
    componentsDir?: string;
}): boolean;
interface MiniProgramComponents {
    [name: string]: MiniProgramComponentsType;
}
export declare function findMiniProgramUsingComponents({ filename, inputDir, componentsDir, }: {
    filename: string;
    inputDir: string;
    componentsDir?: string;
}): MiniProgramComponents;
/**
 * 开发者在配置usingComponents时，可以指向具体路径（不含文件后缀），也可以指向目录（指向目录时查找目录下的index.wxml/.json等）
 * 当usingComponents配置为`"demo": "/components/demo"`时，查找优先级为：
 * 1. /components/demo.wxml
 * 2. /components/demo/index.wxml
 *
 * 注意如下配置是非法的：
 * - "demo": "/components/demo.wxml"
 * - "demo": "/components/demo/"
 *
 * 注意用户的pages.json内可以配置如下三种路径：
 * - "demo": "/wxcomponents/demo"
 * - "demo": "wxcomponents/demo"
 * - [TODO 待确认] "demo": "../wxcomponents/demo"
 */
export declare function findUsingComponentsJson(pathInpages: string, componentsDir: string): Record<any, any>;
export {};
