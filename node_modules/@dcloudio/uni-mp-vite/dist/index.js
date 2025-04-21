"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveMiniProgramRuntime = void 0;
const path_1 = __importDefault(require("path"));
const shared_1 = require("@vue/shared");
const uni_cli_shared_1 = require("@dcloudio/uni-cli-shared");
const plugin_1 = require("./plugin");
const usingComponents_1 = require("./plugins/usingComponents");
const mainJs_1 = require("./plugins/mainJs");
const manifestJson_1 = require("./plugins/manifestJson");
const pagesJson_1 = require("./plugins/pagesJson");
const entry_1 = require("./plugins/entry");
const renderjs_1 = require("./plugins/renderjs");
const runtimeHooks_1 = require("./plugins/runtimeHooks");
const subpackage_1 = require("./plugins/subpackage");
const plugin_2 = require("./plugins/plugin");
const vueCompilerDom = __importStar(require("@vue/compiler-dom"));
const uniCliShared = __importStar(require("@dcloudio/uni-cli-shared"));
exports.default = (options) => {
    if (!options.app.subpackages) {
        delete process.env.UNI_SUBPACKAGE;
    }
    if (!options.app.plugins) {
        delete process.env.UNI_MP_PLUGIN;
    }
    const normalizeComponentName = options.template.component?.normalizeName;
    const sourceMapDir = (0, uni_cli_shared_1.resolveSourceMapPath)(process.env.UNI_OUTPUT_DIR, process.env.UNI_PLATFORM);
    return [
        ...((0, uni_cli_shared_1.isEnableConsole)() ? [(0, uni_cli_shared_1.uniHBuilderXConsolePlugin)('uni.__f__')] : []),
        ...(process.env.UNI_APP_X === 'true'
            ? [
                (0, uni_cli_shared_1.uniDecryptUniModulesPlugin)(),
                (0, uni_cli_shared_1.uniUTSUVueJavaScriptPlugin)(),
                (0, uni_cli_shared_1.resolveUTSCompiler)().uts2js({
                    inputDir: process.env.UNI_INPUT_DIR,
                    version: process.env.UNI_COMPILER_VERSION,
                    cacheRoot: path_1.default.resolve(process.env.UNI_APP_X_CACHE_DIR, '.uts2js/cache'),
                    modules: {
                        vueCompilerDom,
                        uniCliShared,
                    },
                }),
            ]
            : []),
        () => {
            return (0, mainJs_1.uniMainJsPlugin)({
                normalizeComponentName,
                babelParserPlugins: ['typescript'],
            });
        },
        (0, manifestJson_1.uniManifestJsonPlugin)(options),
        (0, pagesJson_1.uniPagesJsonPlugin)(options),
        (0, entry_1.uniEntryPlugin)(options),
        (0, uni_cli_shared_1.uniViteInjectPlugin)('uni:mp-inject', (0, shared_1.extend)({ exclude: [/uni.api.esm/, /uni.mp.esm/] }, options.vite.inject)),
        (0, renderjs_1.uniRenderjsPlugin)({ lang: options.template.filter?.lang }),
        (0, runtimeHooks_1.uniRuntimeHooksPlugin)(),
        (0, plugin_1.uniMiniProgramPlugin)(options),
        (options) => {
            return (0, usingComponents_1.uniUsingComponentsPlugin)({
                normalizeComponentName,
                babelParserPlugins: options.vueOptions?.script?.babelParserPlugins,
            });
        },
        ...(process.env.UNI_SUBPACKAGE ? [(0, subpackage_1.uniSubpackagePlugin)(options)] : []),
        ...(process.env.UNI_MP_PLUGIN ? [(0, plugin_2.uniMiniProgramPluginPlugin)(options)] : []),
        (0, uni_cli_shared_1.uniSourceMapPlugin)({
            sourceMapDir,
            relativeSourceMapDir: (0, uni_cli_shared_1.normalizePath)(path_1.default.relative(path_1.default.dirname(process.env.UNI_OUTPUT_DIR), sourceMapDir)),
        }),
    ];
};
function resolveMiniProgramRuntime(dirname, fileName) {
    if (process.env.UNI_APP_X === 'true') {
        return path_1.default.resolve(dirname, `../dist-x/${fileName}`);
    }
    return path_1.default.resolve(dirname, `${fileName}`);
}
exports.resolveMiniProgramRuntime = resolveMiniProgramRuntime;
