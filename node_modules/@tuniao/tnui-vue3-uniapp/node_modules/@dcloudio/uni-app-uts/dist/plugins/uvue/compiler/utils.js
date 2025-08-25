"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.object2Map = exports.objectExp = exports.genRenderFunctionDecl = void 0;
const shared_1 = require("@vue/shared");
function genRenderFunctionDecl({ targetLanguage, filename, }) {
    return `${targetLanguage === 'kotlin' ? '@Suppress("UNUSED_PARAMETER") ' : ''}function ${filename}Render(_ctx: ${filename}): VNode | null`;
}
exports.genRenderFunctionDecl = genRenderFunctionDecl;
exports.objectExp = /\{.*\}/g;
function object2Map(exp, wrap = true) {
    const content = (0, shared_1.isString)(exp) ? exp : exp.content;
    const matched = content.match(exports.objectExp)[0];
    const keyValues = matched.replace(/\{|\}/g, '').split(',');
    let mapConstructor = wrap ? 'new Map<string, any | null>([' : '';
    keyValues.forEach((keyValue, index) => {
        const colonIndex = keyValue.indexOf(':');
        const key = needAddQuotes(exp, keyValue)
            ? `'${keyValue.substring(0, colonIndex)}'`
            : keyValue.substring(0, colonIndex);
        const value = keyValue.substring(colonIndex + 1);
        if (key && value) {
            mapConstructor += `[${key},${value}]`;
            if (index < keyValues.length - 1) {
                mapConstructor += ',';
            }
        }
    });
    mapConstructor += wrap ? '])' : '';
    return content.replace(matched, mapConstructor);
}
exports.object2Map = object2Map;
function needAddQuotes(exp, keyValue) {
    return (!(0, shared_1.isString)(exp) &&
        exp.constType === 3 /* ConstantTypes.CAN_STRINGIFY */ &&
        !keyValue.startsWith("'") &&
        !keyValue.startsWith('"'));
}
