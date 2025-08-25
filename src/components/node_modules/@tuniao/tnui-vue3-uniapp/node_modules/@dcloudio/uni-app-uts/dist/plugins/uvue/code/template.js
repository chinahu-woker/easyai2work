"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genTemplate = void 0;
const compiler_1 = require("../compiler");
const utils_1 = require("../compiler/utils");
function genTemplate({ template }, options) {
    if (!template) {
        return {
            code: (0, utils_1.genRenderFunctionDecl)(options) + ` { return null }`,
            importEasyComponents: [],
            importUTSComponents: [],
        };
    }
    return (0, compiler_1.compile)(template.content, options);
}
exports.genTemplate = genTemplate;
