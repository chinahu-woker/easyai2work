"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uniAppPagesPlugin = void 0;
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const uni_cli_shared_1 = require("@dcloudio/uni-cli-shared");
const utils_1 = require("./utils");
function isPages(id) {
    return id.endsWith(uni_cli_shared_1.PAGES_JSON_UTS);
}
function uniAppPagesPlugin() {
    const pagesJsonPath = path_1.default.resolve(process.env.UNI_INPUT_DIR, 'pages.json');
    const pagesJsonUTSPath = path_1.default.resolve(process.env.UNI_INPUT_DIR, uni_cli_shared_1.PAGES_JSON_UTS);
    let imports = [];
    let routes = [];
    let globalStyle = 'new Map()';
    let tabBar = 'null';
    return {
        name: 'uni:app-pages',
        apply: 'build',
        resolveId(id) {
            if (isPages(id)) {
                return pagesJsonUTSPath;
            }
        },
        load(id) {
            if (isPages(id)) {
                return fs_extra_1.default.readFileSync(pagesJsonPath, 'utf8');
            }
        },
        transform(code, id) {
            if (isPages(id)) {
                this.addWatchFile(path_1.default.resolve(process.env.UNI_INPUT_DIR, 'pages.json'));
                const pagesJson = (0, uni_cli_shared_1.normalizeUniAppXAppPagesJson)(code);
                imports = [];
                routes = [];
                pagesJson.pages.forEach((page, index) => {
                    const className = (0, utils_1.genClassName)(page.path);
                    let isQuit = index === 0;
                    imports.push(page.path);
                    routes.push(`{ path: "${page.path}", component: ${className}Class, meta: { isQuit: ${isQuit} } as PageMeta, style: ${stringifyPageStyle(page.style)}  } as PageRoute`);
                });
                if (pagesJson.globalStyle) {
                    globalStyle = stringifyPageStyle(pagesJson.globalStyle);
                }
                if (pagesJson.tabBar) {
                    tabBar = (0, utils_1.stringifyMap)(pagesJson.tabBar);
                }
                return `${imports.map((p) => `import './${p}.uvue'`).join('\n')}
export default 'pages.json'`;
            }
        },
        generateBundle(_, bundle) {
            if (bundle[utils_1.ENTRY_FILENAME]) {
                const asset = bundle[utils_1.ENTRY_FILENAME];
                asset.source =
                    asset.source +
                        `
${imports
                            .map((p) => {
                            const className = (0, utils_1.genClassName)(p);
                            return `import ${className}Class from './${p}.uvue?type=page'`;
                        })
                            .join('\n')}
function definePageRoutes() {
${routes.map((route) => `__uniRoutes.push(${route})`).join('\n')}
}
function defineAppConfig(){
  __uniConfig.entryPagePath = '/${imports[0]}'
  __uniConfig.globalStyle = ${globalStyle}
  __uniConfig.tabBar = ${tabBar}
}
`;
            }
        },
    };
}
exports.uniAppPagesPlugin = uniAppPagesPlugin;
function stringifyPageStyle(pageStyle) {
    return (0, utils_1.stringifyMap)(pageStyle);
}
