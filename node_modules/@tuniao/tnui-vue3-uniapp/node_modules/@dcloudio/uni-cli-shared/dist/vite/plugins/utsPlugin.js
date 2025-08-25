"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uniUTSPlugin = exports.utsPlugins = void 0;
const path_1 = __importDefault(require("path"));
const uni_shared_1 = require("@dcloudio/uni-shared");
const uts_1 = require("../../uts");
const utils_1 = require("../utils");
const UTSProxyRE = /\?uts-proxy$/;
function isUTSProxy(id) {
    return UTSProxyRE.test(id);
}
const utsModuleCaches = new Map();
exports.utsPlugins = new Set();
function uniUTSPlugin(options = {}) {
    process.env.UNI_UTS_USING_ROLLUP = 'true';
    return {
        name: 'uni:uts',
        apply: 'build',
        enforce: 'pre',
        resolveId(id, importer) {
            if (isUTSProxy(id)) {
                return id;
            }
            const module = (0, uts_1.resolveUTSAppModule)(id, importer ? path_1.default.dirname(importer) : process.env.UNI_INPUT_DIR, options.x !== true);
            if (module) {
                // prefix the polyfill id with \0 to tell other plugins not to try to load or transform it
                return module + '?uts-proxy';
            }
        },
        load(id) {
            if (isUTSProxy(id)) {
                return '';
            }
        },
        buildEnd() {
            utsModuleCaches.clear();
        },
        async transform(_, id, opts) {
            if (opts && opts.ssr) {
                return;
            }
            if (!isUTSProxy(id)) {
                return;
            }
            const { filename: pluginDir } = (0, utils_1.parseVueRequest)(id.replace('\0', ''));
            // 当 vue 和 nvue 均引用了相同 uts 插件，解决两套编译器会编译两次 uts 插件的问题
            // 通过缓存，保证同一个 uts 插件只编译一次
            if (utsModuleCaches.get(pluginDir)) {
                return utsModuleCaches.get(pluginDir)().then((result) => {
                    if (result) {
                        result.deps.forEach((dep) => {
                            this.addWatchFile(dep);
                        });
                        return {
                            code: result.code,
                            syntheticNamedExports: result.encrypt,
                            meta: result.meta,
                        };
                    }
                });
            }
            const compile = (0, uni_shared_1.once)(() => {
                exports.utsPlugins.add(path_1.default.basename(pluginDir));
                return (0, uts_1.resolveUTSCompiler)().compile(pluginDir, {
                    isX: !!options.x,
                    isPlugin: true,
                    extApis: options.extApis,
                });
            });
            utsModuleCaches.set(pluginDir, compile);
            const result = await compile();
            if (result) {
                result.deps.forEach((dep) => {
                    this.addWatchFile(dep);
                });
                return {
                    code: result.code,
                    syntheticNamedExports: result.encrypt,
                    meta: result.meta,
                };
            }
        },
    };
}
exports.uniUTSPlugin = uniUTSPlugin;
