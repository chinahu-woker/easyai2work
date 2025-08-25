"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseUTSImportFilename = exports.parseUTSRelativeFilename = exports.stringifyMap = exports.isVue = exports.genClassName = exports.uvueOutDir = exports.parseImports = exports.ENTRY_FILENAME = void 0;
const path_1 = __importDefault(require("path"));
const es_module_lexer_1 = require("es-module-lexer");
const uni_cli_shared_1 = require("@dcloudio/uni-cli-shared");
const shared_1 = require("@vue/shared");
exports.ENTRY_FILENAME = 'index.uts';
async function parseImports(code) {
    await es_module_lexer_1.init;
    const [imports] = (0, es_module_lexer_1.parse)(code);
    return imports
        .map(({ s, e }) => {
        return `import "${code.slice(s, e)}"`;
    })
        .concat(parseUniExtApiImports(code))
        .join('\n');
}
exports.parseImports = parseImports;
function parseUniExtApiImports(code) {
    const extApis = (0, uni_cli_shared_1.parseUniExtApiNamespacesJsOnce)(process.env.UNI_UTS_PLATFORM, process.env.UNI_UTS_TARGET_LANGUAGE);
    const pattern = /uni\.(\w+)/g;
    const apis = new Set();
    let match;
    while ((match = pattern.exec(code)) !== null) {
        apis.add(match[1]);
    }
    const imports = [];
    apis.forEach((api) => {
        const extApi = extApis[api];
        if (extApi) {
            imports.push(`import "${extApi[0]}"`);
        }
    });
    return imports;
}
function uvueOutDir() {
    return path_1.default.join(process.env.UNI_OUTPUT_DIR, '../.uvue');
}
exports.uvueOutDir = uvueOutDir;
function genClassName(fileName, prefix = 'Gen') {
    return (prefix +
        (0, shared_1.capitalize)((0, shared_1.camelize)((0, uni_cli_shared_1.removeExt)((0, uni_cli_shared_1.normalizePath)(fileName).replace(/\//g, '-')))));
}
exports.genClassName = genClassName;
function isVue(filename) {
    return filename.endsWith('.vue') || filename.endsWith('.uvue');
}
exports.isVue = isVue;
function stringifyMap(obj) {
    return serialize(obj, true);
}
exports.stringifyMap = stringifyMap;
function serialize(obj, ts = false) {
    if ((0, shared_1.isString)(obj)) {
        return `"${obj}"`;
    }
    else if ((0, shared_1.isPlainObject)(obj)) {
        const entries = Object.entries(obj).map(([key, value]) => `[${serialize(key, ts)},${serialize(value, ts)}]`);
        return `new Map${ts ? '<string, any>' : ''}([${entries.join(',')}])`;
    }
    else if ((0, shared_1.isArray)(obj)) {
        return `[${obj.map((item) => serialize(item, ts)).join(',')}]`;
    }
    else {
        return String(obj);
    }
}
function parseUTSRelativeFilename(filename) {
    if (!path_1.default.isAbsolute(filename)) {
        return filename;
    }
    return (0, uni_cli_shared_1.normalizeNodeModules)(path_1.default.relative(process.env.UNI_INPUT_DIR, filename));
}
exports.parseUTSRelativeFilename = parseUTSRelativeFilename;
function parseUTSImportFilename(filename) {
    if (!path_1.default.isAbsolute(filename)) {
        return filename;
    }
    return (0, uni_cli_shared_1.normalizePath)(path_1.default.join(uvueOutDir(), (0, uni_cli_shared_1.normalizeNodeModules)(path_1.default.relative(process.env.UNI_INPUT_DIR, filename))));
}
exports.parseUTSImportFilename = parseUTSImportFilename;
