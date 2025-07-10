"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uniAppCssPlugin = void 0;
const path_1 = __importDefault(require("path"));
const picocolors_1 = __importDefault(require("picocolors"));
const uni_cli_shared_1 = require("@dcloudio/uni-cli-shared");
const uni_nvue_styler_1 = require("@dcloudio/uni-nvue-styler");
const utils_1 = require("./utils");
function uniAppCssPlugin() {
    const mainUTS = (0, uni_cli_shared_1.resolveMainPathOnce)(process.env.UNI_INPUT_DIR);
    let resolvedConfig;
    const name = 'uni:app-uvue-css';
    return {
        name,
        apply: 'build',
        configResolved(config) {
            resolvedConfig = config;
            const uvueCssPostPlugin = (0, uni_cli_shared_1.cssPostPlugin)(config, {
                isJsCode: true,
                platform: process.env.UNI_PLATFORM,
                chunkCssFilename(id) {
                    if (id === mainUTS) {
                        return 'App.vue.style.uts';
                    }
                    const { filename } = (0, uni_cli_shared_1.parseVueRequest)(id);
                    if ((0, utils_1.isVue)(filename)) {
                        return (0, uni_cli_shared_1.normalizePath)(path_1.default.relative(process.env.UNI_INPUT_DIR, filename) + '.style.uts');
                    }
                },
                async chunkCssCode(filename, cssCode) {
                    const { code, messages } = await (0, uni_nvue_styler_1.parse)(cssCode, {
                        filename,
                        logLevel: 'ERROR',
                        map: true,
                        ts: true,
                        chunk: 100,
                        type: 'uvue',
                    });
                    messages.forEach((message) => {
                        if (message.type === 'error') {
                            let msg = `[plugin:uni:app-uvue-css] ${message.text}`;
                            if (message.line && message.column) {
                                msg += `\n${(0, uni_cli_shared_1.generateCodeFrame)(cssCode, {
                                    line: message.line,
                                    column: message.column,
                                }).replace(/\t/g, ' ')}`;
                            }
                            msg += `\n${(0, uni_cli_shared_1.formatAtFilename)(filename)}`;
                            resolvedConfig.logger.error(picocolors_1.default.red(msg));
                        }
                    });
                    return `export const ${(0, utils_1.genClassName)(filename.replace('.style.uts', ''))}Styles = ${code}`;
                },
            });
            // 增加 css plugins
            (0, uni_cli_shared_1.insertBeforePlugin)((0, uni_cli_shared_1.cssPlugin)(config), name, config);
            const plugins = config.plugins;
            const index = plugins.findIndex((p) => p.name === 'uni:app-uvue');
            plugins.splice(index, 0, uvueCssPostPlugin);
        },
        async transform(source, filename) {
            if (!uni_cli_shared_1.cssLangRE.test(filename) || uni_cli_shared_1.commonjsProxyRE.test(filename)) {
                return;
            }
            // 仅做校验使用
            const { messages } = await (0, uni_nvue_styler_1.parse)(source, {
                filename,
                logLevel: 'WARNING',
                map: true,
                ts: true,
                noCode: true,
                type: 'uvue',
            });
            messages.forEach((message) => {
                if (message.type === 'warning') {
                    let msg = `[plugin:uni:app-uvue-css] ${message.text}`;
                    if (message.line && message.column) {
                        msg += `\n${(0, uni_cli_shared_1.generateCodeFrame)(source, {
                            line: message.line,
                            column: message.column,
                        }).replace(/\t/g, ' ')}`;
                    }
                    msg += `\n${(0, uni_cli_shared_1.formatAtFilename)(filename)}`;
                    resolvedConfig.logger.warn(picocolors_1.default.yellow(msg));
                }
            });
            return { code: source };
        },
    };
}
exports.uniAppCssPlugin = uniAppCssPlugin;
