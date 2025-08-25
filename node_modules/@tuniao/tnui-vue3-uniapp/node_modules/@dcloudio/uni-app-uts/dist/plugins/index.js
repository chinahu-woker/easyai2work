"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uniAppUTSPlugin = void 0;
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const uni_cli_shared_1 = require("@dcloudio/uni-cli-shared");
const uni_i18n_1 = require("@dcloudio/uni-i18n");
const utils_1 = require("./utils");
const REMOVED_PLUGINS = [
    'vite:build-metadata',
    'vite:modulepreload-polyfill',
    'vite:css',
    'vite:esbuild',
    'vite:json',
    'vite:wasm-helper',
    'vite:worker',
    'vite:asset',
    'vite:wasm-fallback',
    'vite:define',
    'vite:css-post',
    'vite:build-html',
    'vite:html-inline-proxy',
    'vite:worker-import-meta-url',
    'vite:asset-import-meta-url',
    'vite:force-systemjs-wrap-complete',
    'vite:watch-package-data',
    'commonjs',
    'vite:data-uri',
    'vite:dynamic-import-vars',
    'vite:import-glob',
    'vite:build-import-analysis',
    'vite:esbuild-transpile',
    'vite:terser',
    'vite:reporter',
];
function uniAppUTSPlugin() {
    const inputDir = process.env.UNI_INPUT_DIR;
    const outputDir = process.env.UNI_OUTPUT_DIR;
    const mainUTS = (0, uni_cli_shared_1.resolveMainPathOnce)(inputDir);
    const tempOutputDir = (0, utils_1.uvueOutDir)();
    const manifestJson = (0, uni_cli_shared_1.parseManifestJsonOnce)(inputDir);
    // 开始编译时，清空输出目录
    function emptyOutDir() {
        if (fs_extra_1.default.existsSync(outputDir)) {
            (0, uni_cli_shared_1.emptyDir)(outputDir);
        }
    }
    emptyOutDir();
    return {
        name: 'uni:app-uts',
        apply: 'build',
        uni: createUniOptions(),
        config() {
            return {
                base: '/',
                build: {
                    outDir: tempOutputDir,
                    lib: {
                        // 必须使用 lib 模式
                        fileName: 'output',
                        entry: (0, uni_cli_shared_1.resolveMainPathOnce)(inputDir),
                        formats: ['cjs'],
                    },
                    rollupOptions: {
                        external(source) {
                            if (['vue', 'vuex', 'pinia'].includes(source)) {
                                return true;
                            }
                            // 相对目录
                            if (source.startsWith('@/') || source.startsWith('.')) {
                                return false;
                            }
                            if (path_1.default.isAbsolute(source)) {
                                return false;
                            }
                            // android 系统库，三方库
                            if (source.includes('.')) {
                                return true;
                            }
                            return false;
                        },
                    },
                },
            };
        },
        configResolved(config) {
            const plugins = config.plugins;
            const len = plugins.length;
            for (let i = len - 1; i >= 0; i--) {
                const plugin = plugins[i];
                if (REMOVED_PLUGINS.includes(plugin.name)) {
                    plugins.splice(i, 1);
                }
            }
        },
        async transform(code, id) {
            const { filename } = (0, uni_cli_shared_1.parseVueRequest)(id);
            if (!filename.endsWith('.uts')) {
                return;
            }
            // 仅处理 uts 文件
            // 忽略 uni-app-uts/lib/automator/index.uts
            if (!filename.includes('uni-app-uts')) {
                const isMainUTS = (0, uni_cli_shared_1.normalizePath)(id) === mainUTS;
                const fileName = path_1.default.relative(inputDir, id);
                this.emitFile({
                    type: 'asset',
                    fileName: normalizeFilename(fileName, isMainUTS),
                    source: normalizeCode(code, isMainUTS),
                });
            }
            code = await (0, utils_1.parseImports)(code);
            return code;
        },
        async writeBundle() {
            const res = await (0, uni_cli_shared_1.resolveUTSCompiler)().compileApp(path_1.default.join(tempOutputDir, 'index.uts'), {
                inputDir: tempOutputDir,
                outputDir: outputDir,
                package: 'uni.' + (manifestJson.appid || '').replace(/_/g, ''),
                sourceMap: true,
                uni_modules: [...uni_cli_shared_1.utsPlugins],
                extApis: (0, uni_cli_shared_1.parseUniExtApiNamespacesOnce)(process.env.UNI_UTS_PLATFORM, process.env.UNI_UTS_TARGET_LANGUAGE),
            });
            if (res) {
                const files = [];
                if (process.env.UNI_APP_UTS_CHANGED_FILES) {
                    try {
                        files.push(...JSON.parse(process.env.UNI_APP_UTS_CHANGED_FILES));
                    }
                    catch (e) { }
                }
                if (res.changed && res.changed.length) {
                    files.push(...res.changed);
                }
                process.env.UNI_APP_UTS_CHANGED_FILES = JSON.stringify([
                    ...new Set(files),
                ]);
            }
        },
    };
}
exports.uniAppUTSPlugin = uniAppUTSPlugin;
function normalizeFilename(filename, isMain = false) {
    if (isMain) {
        return 'index.uts';
    }
    return (0, utils_1.parseUTSRelativeFilename)(filename);
}
function normalizeCode(code, isMain = false) {
    if (!isMain) {
        return code;
    }
    const automatorCode = process.env.UNI_AUTOMATOR_WS_ENDPOINT
        ? 'initAutomator();'
        : '';
    return `
${code}  
export function main(app: IApp) {
    defineAppConfig();
    definePageRoutes();
    ${automatorCode}
    (createApp()['app'] as VueApp).mount(app);
}
`;
}
function createUniOptions() {
    return {
        copyOptions() {
            const platform = process.env.UNI_PLATFORM;
            const inputDir = process.env.UNI_INPUT_DIR;
            const outputDir = process.env.UNI_OUTPUT_DIR;
            const targets = [];
            // 自动化测试时，不启用隐私政策
            if (!process.env.UNI_AUTOMATOR_WS_ENDPOINT) {
                targets.push({
                    src: 'androidPrivacy.json',
                    dest: outputDir,
                    transform(source) {
                        const options = (0, uni_cli_shared_1.initI18nOptions)(platform, inputDir, false, true);
                        if (!options) {
                            return;
                        }
                        return (0, uni_i18n_1.compileI18nJsonStr)(source.toString(), options);
                    },
                });
                const debugFilename = '__nvue_debug__';
                if (fs_extra_1.default.existsSync(path_1.default.resolve(inputDir, debugFilename))) {
                    targets.push({
                        src: debugFilename,
                        dest: outputDir,
                    });
                }
            }
            return {
                assets: ['hybrid/html/**/*', 'uni_modules/*/hybrid/html/**/*'],
                targets,
            };
        },
    };
}
