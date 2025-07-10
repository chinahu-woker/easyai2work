"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uniAppManifestPlugin = void 0;
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const uni_cli_shared_1 = require("@dcloudio/uni-cli-shared");
const utils_1 = require("./utils");
function isManifest(id) {
    return id.endsWith(uni_cli_shared_1.MANIFEST_JSON_UTS);
}
function uniAppManifestPlugin() {
    const manifestJsonPath = path_1.default.resolve(process.env.UNI_INPUT_DIR, 'manifest.json');
    const manifestJsonUTSPath = path_1.default.resolve(process.env.UNI_INPUT_DIR, uni_cli_shared_1.MANIFEST_JSON_UTS);
    let manifestJson = {};
    return {
        name: 'uni:app-manifest',
        apply: 'build',
        resolveId(id) {
            if (isManifest(id)) {
                return manifestJsonUTSPath;
            }
        },
        load(id) {
            if (isManifest(id)) {
                return fs_extra_1.default.readFileSync(manifestJsonPath, 'utf8');
            }
        },
        transform(code, id) {
            if (isManifest(id)) {
                this.addWatchFile(path_1.default.resolve(process.env.UNI_INPUT_DIR, 'manifest.json'));
                manifestJson = (0, uni_cli_shared_1.parseJson)(code);
                return `export default 'manifest.json'`;
            }
        },
        generateBundle(_, bundle) {
            if (bundle[utils_1.ENTRY_FILENAME]) {
                const asset = bundle[utils_1.ENTRY_FILENAME];
                asset.source =
                    asset.source +
                        `
import "io.dcloud.uniapp.appframe.AppConfig"
export class UniAppConfig extends AppConfig {
    override name: string = "${manifestJson.name || ''}"
    override appid: string = "${manifestJson.appid || ''}"
    override versionName: string = "${manifestJson.versionName || ''}"
    override versionCode: string = "${manifestJson.versionCode || ''}"
    constructor() {}
}
`;
            }
            fs_extra_1.default.outputFileSync(path_1.default.resolve(process.env.UNI_OUTPUT_DIR, 'manifest.json'), JSON.stringify({
                id: manifestJson.appid || '',
                name: manifestJson.name || '',
                description: manifestJson.description || '',
                version: {
                    name: manifestJson.versionName || '',
                    code: manifestJson.versionCode || '',
                },
                'uni-app-x': manifestJson['uni-app-x'] || {},
                app: manifestJson.app || {},
            }, null, 2));
        },
    };
}
exports.uniAppManifestPlugin = uniAppManifestPlugin;
