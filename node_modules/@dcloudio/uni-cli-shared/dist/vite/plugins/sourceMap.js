"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uniSourceMapPlugin = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const debug_1 = __importDefault(require("debug"));
const crypto_1 = __importDefault(require("crypto"));
const utils_1 = require("../../utils");
const debugSourceMap = (0, debug_1.default)('uni:sourcemap');
function uniSourceMapPlugin(options) {
    // 使用 WeakMap 存储文件内容的哈希值，避免内存泄漏
    const contentHashMap = new Map();
    return {
        name: 'uni:sourcemap',
        enforce: 'post',
        async generateBundle(_, bundle) {
            if (!(0, utils_1.enableSourceMap)()) {
                return;
            }
            // 批量处理所有 sourcemap 文件
            const tasks = Object.entries(bundle)
                .filter(([file]) => file.endsWith('.js.map'))
                .map(async ([file, asset]) => {
                const source = asset.source;
                const targetPath = path_1.default.resolve(options.sourceMapDir, file);
                // 快速计算内容哈希
                const hash = crypto_1.default
                    .createHash('md5') // xxhash 比 md5 快很多
                    .update(source)
                    .digest('hex');
                let needsUpdate = true;
                try {
                    // 使用 stat 检查文件是否存在，比 pathExists 更快
                    const stat = await fs_extra_1.default.stat(targetPath);
                    if (stat.isFile()) {
                        const oldHash = contentHashMap.get(file);
                        needsUpdate = !oldHash || oldHash !== hash;
                    }
                }
                catch {
                    // 文件不存在，需要写入
                    needsUpdate = true;
                }
                if (needsUpdate) {
                    await fs_extra_1.default.outputFile(targetPath, source);
                    contentHashMap.set(file, hash);
                    debugSourceMap.enabled &&
                        debugSourceMap('write sourcemap file %s', file);
                }
                else {
                    debugSourceMap.enabled &&
                        debugSourceMap('skip unchanged sourcemap file %s', file);
                }
                // 更新引用
                const jsFile = file.replace('.js.map', '.js');
                const outputChunk = bundle[jsFile];
                if (outputChunk) {
                    outputChunk.code = outputChunk.code.replace(/\/\/# sourceMappingURL=.*/, `//# sourceMappingURL=${(0, utils_1.normalizePath)(path_1.default.relative(file, options.relativeSourceMapDir))}/${file}`);
                }
                delete bundle[file];
            });
            // 使用 Promise.all 并行处理所有文件
            await Promise.all(tasks);
        },
    };
}
exports.uniSourceMapPlugin = uniSourceMapPlugin;
