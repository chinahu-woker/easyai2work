"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformVue = exports.uniAppUVuePlugin = void 0;
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const shared_1 = require("@vue/shared");
const uni_cli_shared_1 = require("@dcloudio/uni-cli-shared");
const descriptorCache_1 = require("./descriptorCache");
const error_1 = require("./error");
const utils_1 = require("../utils");
const script_1 = require("./code/script");
const template_1 = require("./code/template");
const style_1 = require("./code/style");
function resolveAppVue(inputDir) {
    const appUVue = path_1.default.resolve(inputDir, 'app.uvue');
    if (fs_extra_1.default.existsSync(appUVue)) {
        return (0, uni_cli_shared_1.normalizePath)(appUVue);
    }
    return (0, uni_cli_shared_1.normalizePath)(path_1.default.resolve(inputDir, 'App.vue'));
}
function uniAppUVuePlugin() {
    const options = {
        root: process.env.UNI_INPUT_DIR,
        sourceMap: false,
        // eslint-disable-next-line no-restricted-globals
        compiler: require('@vue/compiler-sfc'),
        targetLanguage: process.env.UNI_UTS_TARGET_LANGUAGE,
    };
    const appVue = resolveAppVue(process.env.UNI_INPUT_DIR);
    function isAppVue(id) {
        return (0, uni_cli_shared_1.normalizePath)(id) === appVue;
    }
    function normalizeEasyComSource(source) {
        // 把源码source调整为.uvue目录
        return (0, utils_1.parseUTSImportFilename)(source);
    }
    return {
        name: 'uni:app-uvue',
        apply: 'build',
        async resolveId(id) {
            // serve sub-part requests (*?vue) as virtual modules
            if ((0, uni_cli_shared_1.parseVueRequest)(id).query.vue) {
                return id;
            }
        },
        load(id) {
            const { filename, query } = (0, uni_cli_shared_1.parseVueRequest)(id);
            // select corresponding block for sub-part virtual modules
            if (query.vue) {
                if (query.src) {
                    return fs_extra_1.default.readFileSync(filename, 'utf-8');
                }
                const descriptor = (0, descriptorCache_1.getDescriptor)(filename, options);
                let block;
                if (query.type === 'style') {
                    block = descriptor.styles[query.index];
                }
                else if (query.index != null) {
                    block = descriptor.customBlocks[query.index];
                }
                if (block) {
                    return {
                        code: block.content,
                        map: block.map,
                    };
                }
            }
        },
        async transform(code, id) {
            const { filename, query } = (0, uni_cli_shared_1.parseVueRequest)(id);
            if (!(0, utils_1.isVue)(filename)) {
                return;
            }
            if (!query.vue) {
                // main request
                const { errors, uts, js } = await transformVue(code, filename, options, this, isAppVue, normalizeEasyComSource);
                if (errors.length) {
                    errors.forEach((error) => this.error((0, error_1.createRollupError)(filename, error)));
                    return null;
                }
                this.emitFile({
                    type: 'asset',
                    fileName: (0, utils_1.parseUTSRelativeFilename)(filename),
                    source: uts,
                });
                return {
                    code: js,
                };
            }
            else {
                // sub block request
                const descriptor = query.src
                    ? (0, descriptorCache_1.getSrcDescriptor)(filename)
                    : (0, descriptorCache_1.getDescriptor)(filename, options);
                if (query.type === 'style') {
                    return (0, style_1.transformStyle)(code, descriptor, Number(query.index), options, this, filename);
                }
            }
        },
        generateBundle(_, bundle) {
            // 遍历vue文件，填充style，尽量减少全局变量
            Object.keys(bundle).forEach((name) => {
                const file = bundle[name];
                if (file &&
                    file.type === 'asset' &&
                    (0, utils_1.isVue)(file.fileName) &&
                    (0, shared_1.isString)(file.source)) {
                    const fileName = (0, uni_cli_shared_1.normalizePath)(file.fileName);
                    const classNameComment = `/*${(0, utils_1.genClassName)(fileName, options.classNamePrefix)}Styles*/`;
                    if (file.source.includes(classNameComment)) {
                        const styleAssetName = fileName + '.style.uts';
                        const styleAsset = bundle[styleAssetName];
                        if (styleAsset &&
                            styleAsset.type === 'asset' &&
                            (0, shared_1.isString)(styleAsset.source)) {
                            file.source = file.source.replace(classNameComment, styleAsset.source.replace('export ', ''));
                            delete bundle[styleAssetName];
                        }
                    }
                }
            });
        },
    };
}
exports.uniAppUVuePlugin = uniAppUVuePlugin;
async function transformVue(code, filename, options, pluginContext, isAppVue = () => false, normalizeEasyComSource) {
    if (!options.compiler) {
        options.compiler = require('@vue/compiler-sfc');
    }
    // prev descriptor is only set and used for hmr
    const { descriptor, errors } = (0, descriptorCache_1.createDescriptor)(filename, code, options);
    if (errors.length) {
        return { errors, descriptor };
    }
    const isApp = isAppVue(filename);
    const fileName = path_1.default.relative(options.root, filename);
    const className = (0, utils_1.genClassName)(fileName, options.classNamePrefix);
    let templateCode = '';
    let templateImportEasyComponentsCode = '';
    let templateImportUTSComponentsCode = '';
    if (!isApp) {
        const templateResult = (0, template_1.genTemplate)(descriptor, {
            targetLanguage: options.targetLanguage,
            mode: 'function',
            filename: className,
            prefixIdentifiers: true,
            sourceMap: true,
            matchEasyCom: (tag, uts) => {
                const source = (0, uni_cli_shared_1.matchEasycom)(tag);
                if (uts && source) {
                    return normalizeEasyComSource(source);
                }
                return source;
            },
            parseUTSComponent: uni_cli_shared_1.parseUTSComponent,
        });
        templateCode = templateResult.code;
        templateImportEasyComponentsCode =
            templateResult.importEasyComponents.join('\n');
        templateImportUTSComponentsCode =
            templateResult.importUTSComponents.join('\n');
    }
    // 生成 script 文件
    let utsCode = (0, script_1.genScript)(descriptor, { filename: className }) +
        '\n' +
        (0, style_1.genStyle)(descriptor, { filename: fileName, className }) +
        '\n';
    utsCode += templateCode;
    let jsCode = templateImportEasyComponentsCode + '\n' + templateImportUTSComponentsCode;
    const content = descriptor.script?.content;
    if (content) {
        jsCode += await (0, utils_1.parseImports)(content);
    }
    if (descriptor.styles.length) {
        jsCode += '\n' + (await (0, style_1.genJsStylesCode)(descriptor, pluginContext));
    }
    jsCode += `\nexport default "${className}"`;
    return {
        errors: [],
        uts: utsCode,
        js: jsCode,
        descriptor,
    };
}
exports.transformVue = transformVue;
