/**
 * 需要需要确保 vue 文件是处理过条件编译的
 * @param platform
 * @param vueFileName
 * @returns
 */
export declare function transformExtApiVueFile(platform: 'app-android' | 'app-ios', // | 'app-harmony',
vueFileName: string): Promise<string | void | null>;
