"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uniCopyPlugin = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const debug_1 = __importDefault(require("debug"));
const uni_cli_shared_1 = require("@dcloudio/uni-cli-shared");
const debugCopy = (0, debug_1.default)('uni:copy');
function uniCopyPlugin({ outputDir, copyOptions, }) {
    const staticDir = uni_cli_shared_1.PUBLIC_DIR + '/**/*';
    const uniModulesStaticDir = 'uni_modules/*/' + uni_cli_shared_1.PUBLIC_DIR + '/**/*';
    const assets = [staticDir, uniModulesStaticDir];
    const subpackages = (0, uni_cli_shared_1.parseSubpackagesRootOnce)(process.env.UNI_INPUT_DIR, process.env.UNI_PLATFORM);
    subpackages.forEach((root) => {
        assets.push((0, uni_cli_shared_1.normalizePath)(path_1.default.join(root, staticDir)));
        assets.push((0, uni_cli_shared_1.normalizePath)(path_1.default.join(root, uniModulesStaticDir)));
    });
    copyOptions.assets.forEach((asset) => {
        assets.push(asset);
    });
    const inputDir = (0, uni_cli_shared_1.normalizePath)(process.env.UNI_INPUT_DIR);
    const platform = process.env.UNI_PLATFORM;
    const utsPlatform = process.env.UNI_UTS_PLATFORM;
    // 非当前平台 static 目录
    const ignorePlatformStaticDirs = (0, uni_cli_shared_1.getPlatforms)()
        .filter((p) => {
        if (platform === 'app') {
            if (process.env.UNI_APP_X === 'true') {
                if (p === 'app-android' || p === 'app-ios' || p === 'app-harmony') {
                    return p !== utsPlatform;
                }
                return p !== 'app';
            }
            return p !== 'app' && p !== 'app-plus';
        }
        else if (platform === 'h5' || platform === 'web') {
            return p !== 'h5' && p !== 'web';
        }
        else if (platform.startsWith('app-')) {
            return p !== 'app' && p !== platform;
        }
        return p !== platform;
    })
        // 在最后增加 / 是为了避免误判以 platform 开头的目录，比如 app-test
        .map((p) => '/' + uni_cli_shared_1.PUBLIC_DIR + '/' + p + '/');
    const targets = [
        {
            src: assets,
            dest: outputDir,
            watchOptions: {
                readyTimeout: getReadyTimeout(),
                ignored(path) {
                    const normalizedPath = (0, uni_cli_shared_1.normalizePath)(path);
                    if (ignorePlatformStaticDirs.find((dir) => 
                    // dir都是以 / 结尾，所以这里也要以 / 结尾
                    (normalizedPath + '/').includes(dir))) {
                        return fs_1.default.statSync(normalizedPath).isDirectory();
                    }
                    // 应该是软链
                    if (!normalizedPath.startsWith(inputDir)) {
                        // 目前仅简单处理static
                        if (normalizedPath.includes('/static/')) {
                            return false;
                        }
                        return true;
                    }
                    return false;
                },
            },
        },
    ];
    targets.push(...copyOptions.targets);
    debugCopy(targets);
    checkIgnoreStatic(ignorePlatformStaticDirs.map((dir) => dir.substring(1).split('/')));
    return (0, uni_cli_shared_1.uniViteCopyPlugin)({
        targets,
    });
}
exports.uniCopyPlugin = uniCopyPlugin;
let isIgnoreChecked = false;
function checkIgnoreStatic(ignoreStatic) {
    if (isIgnoreChecked) {
        return;
    }
    isIgnoreChecked = true;
    const existIgnore = new Set();
    ignoreStatic.forEach((ignore) => {
        const dir = path_1.default.resolve(process.env.UNI_INPUT_DIR, ...ignore);
        if (fs_1.default.existsSync(dir)) {
            existIgnore.add(ignore.join('/'));
        }
    });
    if (existIgnore.size) {
        console.log('已忽略静态资源目录：' +
            [...existIgnore].join('、') +
            '。详见：https://uniapp.dcloud.net.cn/tutorial/platform.html#static');
    }
}
function getReadyTimeout() {
    // chokidar 在部分 windows 上 ready 会触发较早，导致文件还没被全部 copy 过去
    if (!uni_cli_shared_1.isWindows) {
        return 1000;
    }
    if (process.env.NODE_ENV === 'development') {
        return 1000;
    }
    // 仅在生产环境使用
    return 4000;
}
