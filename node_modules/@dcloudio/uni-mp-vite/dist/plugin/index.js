"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.genUVueCssCode = exports.uniMiniProgramPlugin = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const uni_cli_shared_1 = require("@dcloudio/uni-cli-shared");
const uni_1 = require("./uni");
const build_1 = require("./build");
const configResolved_1 = require("./configResolved");
const template_1 = require("./template");
const pagesJson_1 = require("../plugins/pagesJson");
const polyfill_1 = require("./polyfill");
function uniMiniProgramPlugin(options) {
    const { vite: { alias, copyOptions }, template, style, } = options;
    let resetCssEmitted = false;
    let autoImportFilterEmitted = false;
    let resolvedConfig;
    (0, polyfill_1.rewriteCompileScriptOnce)();
    (0, polyfill_1.rewriteCompilerSfcParseOnce)();
    return {
        name: 'uni:mp',
        uni: (0, uni_1.uniOptions)({
            copyOptions,
            customElements: template.customElements,
            miniProgram: {
                event: template.event,
                class: template.class,
                filter: template.filter
                    ? {
                        lang: template.filter.lang,
                        setStyle: template.filter.setStyle,
                        generate: template.filter.generate,
                    }
                    : undefined,
                directive: template.directive,
                lazyElement: template.lazyElement,
                component: template.component,
                emitFile: template_1.emitFile,
                slot: template.slot,
                checkPropName: template.checkPropName,
            },
            compilerOptions: template.compilerOptions,
        }),
        config() {
            return {
                base: process.env.UNI_SUBPACKAGE
                    ? '/' + process.env.UNI_SUBPACKAGE + '/'
                    : '/', // 编译为分包时以分包名为基础路径
                resolve: {
                    alias: {
                        vue: (0, uni_cli_shared_1.resolveBuiltIn)(`@dcloudio/uni-mp-vue/${process.env.UNI_APP_X === 'true' ? 'dist-x' : 'dist'}/vue.runtime.esm.js`),
                        '@vue/devtools-api': (0, uni_cli_shared_1.resolveBuiltIn)('@dcloudio/uni-mp-vue'),
                        'vue-i18n': (0, uni_cli_shared_1.resolveVueI18nRuntime)(),
                        ...alias,
                    },
                    preserveSymlinks: true,
                },
                css: {
                    postcss: {
                        plugins: (0, uni_cli_shared_1.initPostcssPlugin)({
                            uniApp: (0, uni_cli_shared_1.parseRpx2UnitOnce)(process.env.UNI_INPUT_DIR, process.env.UNI_PLATFORM),
                        }),
                    },
                },
                optimizeDeps: {
                    noDiscovery: true,
                    include: [],
                },
                build: (0, build_1.buildOptions)(),
            };
        },
        configResolved(config) {
            resolvedConfig = config;
            const plugin = config.plugins.find((p) => p.name === 'vite:vue');
            if (plugin?.api?.options) {
                plugin.api.options.devToolsEnabled = false;
            }
            return (0, configResolved_1.createConfigResolved)(options)(config);
        },
        generateBundle() {
            if (template.filter) {
                const extname = template.filter.extname;
                if (process.env.UNI_APP_X === 'true') {
                    // 目前 mp-weixin（mp-qq）、mp-alipay（mp-dingtalk）、mp-toutiao（mp-lark）均支持视图层setStyle
                    if (template.filter.setStyle && !autoImportFilterEmitted) {
                        autoImportFilterEmitted = true;
                        this.emitFile({
                            type: 'asset',
                            // uniView.wxs文件在分包内的引用路径不对
                            fileName: `common/uniView${extname}`,
                            source: fs_extra_1.default.readFileSync(path_1.default.resolve(__dirname, '../../lib/filters/uniView.js'), 'utf8'),
                        });
                    }
                }
                const filterFiles = (0, template_1.getFilterFiles)(resolvedConfig, this.getModuleInfo);
                Object.keys(filterFiles).forEach((filename) => {
                    const { code } = filterFiles[filename];
                    this.emitFile({
                        type: 'asset',
                        fileName: filename + extname,
                        source: code,
                    });
                });
            }
            const templateFiles = (0, template_1.getTemplateFiles)(template);
            Object.keys(templateFiles).forEach((filename) => {
                this.emitFile({
                    type: 'asset',
                    fileName: filename + template.extname,
                    source: templateFiles[filename],
                });
            });
            if (!resetCssEmitted) {
                if (process.env.UNI_APP_X === 'true') {
                    resetCssEmitted = true;
                    this.emitFile({
                        type: 'asset',
                        fileName: 'uvue' + style.extname,
                        source: genUVueCssCode((0, uni_cli_shared_1.parseManifestJsonOnce)(process.env.UNI_INPUT_DIR)),
                    });
                }
                else {
                    const nvueCssPaths = (0, pagesJson_1.getNVueCssPaths)(resolvedConfig);
                    if (nvueCssPaths && nvueCssPaths.length) {
                        resetCssEmitted = true;
                        this.emitFile({
                            type: 'asset',
                            fileName: 'nvue' + style.extname,
                            source: (0, uni_cli_shared_1.genNVueCssCode)((0, uni_cli_shared_1.parseManifestJsonOnce)(process.env.UNI_INPUT_DIR)),
                        });
                    }
                }
            }
        },
    };
}
exports.uniMiniProgramPlugin = uniMiniProgramPlugin;
function genUVueCssCode(manifestJson) {
    let cssCode = fs_extra_1.default.readFileSync(path_1.default.resolve(__dirname, '../../lib/uvue.css'), 'utf8');
    const flexDirection = (0, uni_cli_shared_1.parseUniXFlexDirection)(manifestJson);
    if (flexDirection !== 'column') {
        cssCode = cssCode.replace('column', flexDirection);
    }
    return cssCode;
}
exports.genUVueCssCode = genUVueCssCode;
