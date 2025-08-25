"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVirtualHostId = exports.rewriteId = exports.findStaticIdIndex = exports.isIdBinding = void 0;
const types_1 = require("@babel/types");
const compiler_core_1 = require("@vue/compiler-core");
const uni_cli_shared_1 = require("@dcloudio/uni-cli-shared");
const ast_1 = require("../ast");
const codegen_1 = require("../codegen");
const runtimeHelpers_1 = require("../runtimeHelpers");
const utils_1 = require("./utils");
function isIdBinding({ arg, exp }) {
    return arg && arg.type === compiler_core_1.NodeTypes.SIMPLE_EXPRESSION && arg.content === 'id';
}
exports.isIdBinding = isIdBinding;
function findStaticIdIndex(props) {
    return props.findIndex((prop) => prop.name === 'id');
}
exports.findStaticIdIndex = findStaticIdIndex;
function rewriteId(index, idBindingProp, props, virtualHost, context, isX = false) {
    let expr = idBindingProp.exp
        ? (0, ast_1.parseExpr)(idBindingProp.exp, context)
        : undefined;
    let idBindingExpr;
    const staticIdPropIndex = findStaticIdIndex(props);
    if (staticIdPropIndex > -1) {
        idBindingExpr = (0, types_1.stringLiteral)(props[staticIdPropIndex].value.content);
    }
    else if (expr) {
        idBindingExpr =
            isX || virtualHost
                ? expr
                : (0, types_1.identifier)((0, utils_1.rewriteExpression)(idBindingProp.exp, context).content);
    }
    else {
        idBindingExpr = (0, types_1.stringLiteral)('');
    }
    if (virtualHost) {
        idBindingExpr = (0, types_1.callExpression)((0, types_1.identifier)(context.helperString(runtimeHelpers_1.GEN_UNI_ELEMENT_ID)), [(0, types_1.identifier)('_ctx'), idBindingExpr]);
        if (!isX) {
            // 非uni-app-x id绑定表达式直接生成在了模板内
            idBindingExpr = (0, types_1.identifier)((0, utils_1.rewriteExpression)((0, compiler_core_1.createSimpleExpression)((0, codegen_1.genBabelExpr)(idBindingExpr)), context).content);
        }
    }
    idBindingProp.exp = (0, compiler_core_1.createSimpleExpression)((0, codegen_1.genBabelExpr)(idBindingExpr));
}
exports.rewriteId = rewriteId;
function createVirtualHostId(props, context, isX = false) {
    const idBindingProp = (0, uni_cli_shared_1.createBindDirectiveNode)('id', '');
    delete idBindingProp.exp;
    rewriteId(0, idBindingProp, props, true, context, isX);
    return idBindingProp;
}
exports.createVirtualHostId = createVirtualHostId;
