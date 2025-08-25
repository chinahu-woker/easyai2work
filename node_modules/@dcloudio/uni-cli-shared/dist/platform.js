"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMiniProgramPlatform = exports.getPlatformDir = exports.getPlatforms = exports.registerPlatform = void 0;
const BUILT_IN_PLATFORMS = [
    'app',
    'app-plus',
    'app-harmony',
    'app-ios',
    'app-android',
    'h5',
    'web',
    'mp-360',
    'mp-alipay',
    'mp-baidu',
    'mp-jd',
    'mp-kuaishou',
    'mp-lark',
    'mp-qq',
    'mp-toutiao',
    'mp-weixin',
    'mp-xhs',
    'quickapp-webview',
    'quickapp-webview-huawei',
    'quickapp-webview-union',
];
const platforms = [...BUILT_IN_PLATFORMS];
function registerPlatform(platform) {
    if (platform === 'mp') {
        return;
    }
    if (!platforms.includes(platform)) {
        platforms.push(platform);
    }
}
exports.registerPlatform = registerPlatform;
function getPlatforms() {
    return platforms;
}
exports.getPlatforms = getPlatforms;
function getPlatformDir() {
    if (process.env.UNI_APP_X && process.env.UNI_PLATFORM === 'app') {
        return process.env.UNI_UTS_PLATFORM;
    }
    return process.env.UNI_SUB_PLATFORM || process.env.UNI_PLATFORM;
}
exports.getPlatformDir = getPlatformDir;
function isMiniProgramPlatform() {
    return !['app', 'app-plus', 'h5', 'web'].includes(process.env.UNI_PLATFORM);
}
exports.isMiniProgramPlatform = isMiniProgramPlatform;
