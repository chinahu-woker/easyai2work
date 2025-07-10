"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformExtApiVueFile = void 0;
const path_1 = require("path");
const fs_extra_1 = require("fs-extra");
const uni_cli_shared_1 = require("@dcloudio/uni-cli-shared");
const uni_nvue_styler_1 = require("@dcloudio/uni-nvue-styler");
const main_1 = require("./plugins/android/uvue/sfc/main");
/**
 * 需要需要确保 vue 文件是处理过条件编译的
 * @param platform
 * @param vueFileName
 * @returns
 */
async function transformExtApiVueFile(platform, // | 'app-harmony',
vueFileName) {
    vueFileName = (0, uni_cli_shared_1.normalizePath)(vueFileName);
    (0, uni_cli_shared_1.initPreContext)(platform === 'app-android' || platform === 'app-ios' ? 'app' : platform, process.env.UNI_CUSTOM_CONTEXT, platform, true);
    const code = (0, fs_extra_1.readFileSync)(vueFileName, 'utf8');
    if (platform === 'app-android') {
        return transformAppAndroidExtApiComponent(vueFileName, code);
    }
    else if (platform === 'app-ios') {
        return transformAppIosExtApiComponent(vueFileName, code);
    }
}
exports.transformExtApiVueFile = transformExtApiVueFile;
async function transformAppAndroidExtApiComponent(vueFileName, code) {
    const result = await (0, main_1.transformMain)(code, vueFileName, {
        root: (0, path_1.dirname)(vueFileName),
        targetLanguage: 'kotlin',
        classNamePrefix: 'Uni',
        genDefaultAs: '__sfc__',
        sourceMap: false,
        componentType: 'component',
    });
    if (!result) {
        return null;
    }
    const { errors, uts, descriptor } = result;
    if (errors.length > 0) {
        throw new Error(errors.join('\n'));
    }
    const componentName = (0, path_1.basename)(vueFileName).split('.')[0];
    const styleCode = await parseAppAndroidVueStyle(componentName, vueFileName, descriptor.styles.length > 0 ? descriptor.styles[0].content : '');
    return uts.replace(`/*${(0, uni_cli_shared_1.genUTSClassName)(componentName, 'Uni')}Styles*/`, styleCode);
}
async function transformAppIosExtApiComponent(vueFileName, code) {
    // TODO 编译vue为一个独立的js文件
}
async function parseAppAndroidVueStyle(name, vueFileName, cssCode) {
    if (!cssCode) {
        return `const ${(0, uni_cli_shared_1.genUTSClassName)(name, 'Uni')}Styles = []`;
    }
    const { code, messages } = await (0, uni_nvue_styler_1.parse)(cssCode, {
        filename: vueFileName,
        logLevel: 'ERROR',
        map: true,
        ts: true,
        type: 'uvue',
        platform: 'app-android',
    });
    if (messages.length) {
        messages.forEach((m) => {
            console.error(m);
        });
    }
    return `const ${(0, uni_cli_shared_1.genUTSClassName)(name, 'Uni')}Styles = [${code}]`;
}
