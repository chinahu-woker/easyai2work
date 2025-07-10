"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rewriteId = void 0;
const compiler_core_1 = require("@vue/compiler-core");
const uni_cli_shared_1 = require("@dcloudio/uni-cli-shared");
const runtimeHelpers_1 = require("../runtimeHelpers");
const utils_1 = require("./utils");
const transformSlot_1 = require("./transformSlot");
const transformRef_1 = require("./transformRef");
const shared_1 = require("@vue/shared");
const types_1 = require("@babel/types");
const ast_1 = require("../ast");
const codegen_1 = require("../codegen");
const builtInCustomElements = ['uni-cloud-db-element'];
const builtInComponents = ['unicloud-db'];
function rewriteId(node, context) {
    const isUniElement = !(0, uni_cli_shared_1.isUserComponent)(node, context);
    const origTagName = node.tag;
    const isBuiltInComponent = !isUniElement && builtInComponents.includes(origTagName);
    const userComponent = !(isUniElement || isBuiltInComponent);
    if (userComponent) {
        // TODO 目前不对用户的自定义组件支持 id 查询 UniElement
        // 后续要做的话，需要考虑自定义组件内部的单节点或多节点
        return;
    }
    const isBuiltInCustomElement = builtInCustomElements.includes(origTagName);
    if (isUniElement) {
        // 将内置的自定义元素转换为 view
        if (isBuiltInCustomElement) {
            node.props.unshift((0, uni_cli_shared_1.createAttributeNode)(utils_1.ATTR_ELEMENT_TAG, origTagName));
            node.tag = 'view';
        }
    }
    // 内置组件使用了 ref，没有 id 时，自动补充一个
    const refProp = (0, compiler_core_1.findProp)(node, utils_1.ATTR_VUE_REF) || (0, compiler_core_1.findProp)(node, 'ref');
    let idProp = (0, compiler_core_1.findProp)(node, 'id');
    if (refProp && !idProp) {
        if (context.inVFor) {
            // v-for 中的 ref 需要使用 v-for 的 key 作为 id
            const keyAlias = (0, transformSlot_1.parseVForKeyAlias)(context);
            // 微信小程序元素id必须以字母开头，所以hashId不能放到前边，它可能是数字开头
            const id = 'r' + context.elementRefIndex++ + '-' + context.hashId + '-';
            node.props.push((0, uni_cli_shared_1.createBindDirectiveNode)('id', (0, compiler_core_1.createCompoundExpression)([`'${id}'+`, keyAlias.join(`+'-'+`)])));
        }
        else {
            const id = 'r' + context.elementRefIndex++ + '-' + context.hashId;
            node.props.push((0, uni_cli_shared_1.createAttributeNode)('id', id));
        }
    }
    else if (refProp && idProp && (0, uni_cli_shared_1.isDirectiveNode)(idProp)) {
        // ref 和 id 都存在，且 id 是动态绑定的, 但是可能为空字符串。比如virtualHost绑定的id
        const idPropIndex = node.props.indexOf(idProp);
        node.props.splice(idPropIndex, 1);
        if (idProp.exp) {
            let idBindingExpr = (0, ast_1.parseExpr)(idProp.exp, context);
            let genId = '';
            if (context.inVFor) {
                // v-for 中的 ref 需要使用 v-for 的 key 作为 id
                const keyAlias = (0, transformSlot_1.parseVForKeyAlias)(context);
                // 微信小程序元素id必须以字母开头，所以hashId不能放到前边，它可能是数字开头
                genId =
                    'r' +
                        context.elementRefIndex++ +
                        '-' +
                        context.hashId +
                        '-' +
                        keyAlias.join('-');
            }
            else {
                genId = 'r' + context.elementRefIndex++ + '-' + context.hashId;
            }
            // TODO context.helperString能否避免调用?
            if ((0, types_1.isCallExpression)(idBindingExpr) &&
                (0, types_1.isIdentifier)(idBindingExpr.callee) &&
                idBindingExpr.callee.name === context.helperString(runtimeHelpers_1.GEN_UNI_ELEMENT_ID)) {
                // 如果调用的是genUniElementId，则直接传入自动生成的id作为第三个参数。此特性用于减小生成代码体积
                idBindingExpr.arguments.push((0, types_1.stringLiteral)(genId));
            }
            else {
                idBindingExpr = (0, types_1.conditionalExpression)((0, types_1.binaryExpression)('!==', idBindingExpr, (0, types_1.stringLiteral)('')), idBindingExpr, (0, types_1.stringLiteral)(genId));
            }
            node.props.push((0, uni_cli_shared_1.createBindDirectiveNode)('id', (0, compiler_core_1.createSimpleExpression)((0, codegen_1.genBabelExpr)(idBindingExpr))));
        }
    }
    idProp = (0, compiler_core_1.findProp)(node, 'id');
    if (!idProp) {
        return;
    }
    let idOptions = origTagName;
    if (isBuiltInComponent || isBuiltInCustomElement) {
        idOptions = {
            name: origTagName,
            type: isBuiltInComponent
                ? 1 /* SetUniElementIdTagType.BuiltInComponent */
                : 2 /* SetUniElementIdTagType.BuiltInRootElement */,
        };
    }
    let idExprNode;
    // id="test" => :id="setUniElementId('test')"
    // 目前标签名有隐患，可能传入的是自定义组件名称
    if ((0, uni_cli_shared_1.isAttributeNode)(idProp)) {
        if (!idProp.value) {
            return;
        }
        idExprNode = `'${idProp.value.content}'`;
        node.props.push((0, uni_cli_shared_1.createBindDirectiveNode)(utils_1.ATTR_ELEMENT_ID, (0, compiler_core_1.createCompoundExpression)([
            context.helperString(runtimeHelpers_1.SET_UNI_ELEMENT_ID) + '(',
            idExprNode,
            ',',
            (0, shared_1.isString)(idOptions) ? `'${idOptions}'` : JSON.stringify(idOptions),
            parseUniElementRefCode(node, context),
            ')',
        ])));
    }
    else if (idProp.exp) {
        idExprNode = idProp.exp;
        const idPropIndex = node.props.indexOf(idProp);
        // :id="a" => :id="setUniElementId(a)"
        node.props.splice(idPropIndex, 1, (0, uni_cli_shared_1.createBindDirectiveNode)('id', (0, compiler_core_1.createCompoundExpression)([
            context.helperString(runtimeHelpers_1.SET_UNI_ELEMENT_ID) + '(',
            idExprNode,
            ',',
            (0, shared_1.isString)(idOptions) ? `'${idOptions}'` : JSON.stringify(idOptions),
            parseUniElementRefCode(node, context),
            ')',
        ])));
    }
    if (context.miniProgram.filter?.setStyle) {
        // 支持通过filter来设置style
        node.props.push((0, uni_cli_shared_1.createBindDirectiveNode)((0, utils_1.filterObserverName)(utils_1.ATTR_SET_ELEMENT_STYLE), (0, utils_1.filterName)(utils_1.FILTER_SET_ELEMENT_STYLE)));
        node.props.push((0, uni_cli_shared_1.createBindDirectiveNode)(utils_1.ATTR_SET_ELEMENT_STYLE, ''));
        // setAnimation
        node.props.push((0, uni_cli_shared_1.createBindDirectiveNode)((0, utils_1.filterObserverName)(utils_1.ATTR_SET_ELEMENT_ANIMATION), (0, utils_1.filterName)(utils_1.FILTER_SET_ELEMENT_ANIMATION)));
        node.props.push((0, uni_cli_shared_1.createBindDirectiveNode)(utils_1.ATTR_SET_ELEMENT_ANIMATION, ''));
        if (!context.autoImportFilters.find((filter) => filter.name === utils_1.FILTER_MODULE_NAME)) {
            context.autoImportFilters.push({
                name: utils_1.FILTER_MODULE_NAME,
                id: utils_1.FILTER_MODULE_FILE_NAME,
                type: 'filter',
            });
        }
    }
    else {
        // 如果没有动态绑定 style，则创建一个新的
        const styleProp = (0, compiler_core_1.findProp)(node, 'style', true, true);
        if (!styleProp) {
            node.props.push((0, uni_cli_shared_1.createBindDirectiveNode)('style', (0, compiler_core_1.createCompoundExpression)([
                context.helperString(runtimeHelpers_1.SET_UNI_ELEMENT_STYLE) + '(',
                idExprNode,
                ')',
            ])));
        }
        else {
            // 传递已绑定的 style
            styleProp.exp = (0, compiler_core_1.createCompoundExpression)([
                context.helperString(runtimeHelpers_1.SET_UNI_ELEMENT_STYLE) + '(',
                idExprNode,
                ',',
                styleProp.exp,
                ')',
            ]);
        }
    }
}
exports.rewriteId = rewriteId;
function parseUniElementRefCode(node, context) {
    const refProp = (0, compiler_core_1.findProp)(node, utils_1.ATTR_VUE_REF) || (0, compiler_core_1.findProp)(node, 'ref');
    if (!refProp) {
        return '';
    }
    const { code, refKey } = (0, transformRef_1.parseRefCode)(refProp, context);
    const opts = {};
    if (refKey) {
        opts.k = refKey;
    }
    if (context.inVFor) {
        opts.f = 1;
    }
    const children = [',', code];
    if (Object.keys(opts).length) {
        children.push(',', JSON.stringify(opts));
    }
    return (0, compiler_core_1.createCompoundExpression)(children);
}
