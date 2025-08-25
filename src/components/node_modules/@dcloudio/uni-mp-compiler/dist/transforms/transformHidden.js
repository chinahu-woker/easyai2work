"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVirtualHostHidden = exports.rewriteHidden = exports.findVShowIndex = exports.findStaticHiddenIndex = exports.isHiddenBinding = void 0;
const types_1 = require("@babel/types");
const compiler_core_1 = require("@vue/compiler-core");
const uni_shared_1 = require("@dcloudio/uni-shared");
const uni_cli_shared_1 = require("@dcloudio/uni-cli-shared");
const ast_1 = require("../ast");
const codegen_1 = require("../codegen");
const utils_1 = require("./utils");
function isHiddenBinding({ arg, exp }) {
    return (arg && arg.type === compiler_core_1.NodeTypes.SIMPLE_EXPRESSION && arg.content === 'hidden');
}
exports.isHiddenBinding = isHiddenBinding;
function findStaticHiddenIndex(props) {
    return props.findIndex((prop) => prop.name === 'hidden');
}
exports.findStaticHiddenIndex = findStaticHiddenIndex;
function findVShowIndex(props) {
    return props.findIndex((prop) => prop.name === 'show' && prop.type === compiler_core_1.NodeTypes.DIRECTIVE);
}
exports.findVShowIndex = findVShowIndex;
function rewriteHidden(index, hiddenBindingProp, props, virtualHost, context) {
    let bindingProp = hiddenBindingProp;
    const vShowIndex = findVShowIndex(props);
    if (vShowIndex > -1) {
        bindingProp = props[vShowIndex];
    }
    let expr = bindingProp.exp ? (0, ast_1.parseExpr)(bindingProp.exp, context) : undefined;
    let hiddenBindingExpr;
    if (virtualHost) {
        const staticClassPropIndex = findStaticHiddenIndex(props);
        // skyline模式hidden传undefined会导致元素被隐藏
        const virtualHostHiddenPolyfill = (0, types_1.logicalExpression)('||', (0, types_1.identifier)(uni_shared_1.VIRTUAL_HOST_HIDDEN), (0, types_1.booleanLiteral)(false));
        if (expr || staticClassPropIndex > -1) {
            let res = (0, types_1.booleanLiteral)(true);
            if (expr) {
                // TODO ignore all simple expression
                res = (0, types_1.isIdentifier)(expr)
                    ? expr
                    : (0, types_1.identifier)((0, utils_1.rewriteExpression)(bindingProp.exp, context).content);
                if (vShowIndex > -1) {
                    props.splice(vShowIndex, 1);
                    res = (0, types_1.unaryExpression)('!', res);
                }
            }
            hiddenBindingExpr = (0, types_1.conditionalExpression)((0, types_1.binaryExpression)('!==', (0, types_1.identifier)(uni_shared_1.VIRTUAL_HOST_HIDDEN), (0, types_1.stringLiteral)('')), virtualHostHiddenPolyfill, res);
        }
        else {
            hiddenBindingExpr = virtualHostHiddenPolyfill;
        }
    }
    else {
        // ignore rewrite without virtualHost
        return;
    }
    hiddenBindingProp.exp = (0, compiler_core_1.createSimpleExpression)((0, codegen_1.genBabelExpr)(hiddenBindingExpr));
}
exports.rewriteHidden = rewriteHidden;
function createVirtualHostHidden(props, context) {
    const hiddenBindingProp = (0, uni_cli_shared_1.createBindDirectiveNode)('hidden', '');
    delete hiddenBindingProp.exp;
    rewriteHidden(0, hiddenBindingProp, props, true, context);
    return hiddenBindingProp;
}
exports.createVirtualHostHidden = createVirtualHostHidden;
