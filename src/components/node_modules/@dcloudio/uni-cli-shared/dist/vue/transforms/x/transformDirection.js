"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformDirection = void 0;
const vite_1 = require("../../../vite");
const utils_1 = require("../../utils");
const compiler_core_1 = require("@vue/compiler-core");
/**
 * 将direction属性转化为scroll-x和scroll-y
 * 注意transformMPBuiltInTag内会讲list-view转化为scroll-view，所以此transform应该在transformMPBuiltInTag之后执行
 */
const transformDirection = function (node, context) {
    if (!(0, vite_1.isElementNode)(node)) {
        return;
    }
    if (node.tag !== 'scroll-view') {
        return;
    }
    const directionPropIndex = node.props.findIndex((prop) => (0, utils_1.isPropNameEquals)(prop, 'direction'));
    const scrollXPropIndex = node.props.findIndex((prop) => (0, utils_1.isPropNameEquals)(prop, 'scrollX'));
    const scrollYPropIndex = node.props.findIndex((prop) => (0, utils_1.isPropNameEquals)(prop, 'scrollY'));
    if (scrollXPropIndex > -1 || scrollYPropIndex > -1) {
        return;
    }
    if (directionPropIndex === -1 ||
        (scrollXPropIndex !== -1 && scrollYPropIndex !== -1)) {
        node.props.push((0, utils_1.createAttributeNode)('scroll-y', 'true'));
        return;
    }
    const directionProp = node.props[directionPropIndex];
    if (directionProp.type === compiler_core_1.NodeTypes.ATTRIBUTE) {
        const directionValue = directionProp.value?.content;
        const scrollX = directionValue === 'horizontal' || directionValue === 'all';
        const scrollY = !directionValue ||
            directionValue === 'vertical' ||
            directionValue === 'all';
        node.props.splice(directionPropIndex, 1);
        scrollX && node.props.push((0, utils_1.createAttributeNode)('scroll-x', '' + scrollX));
        scrollY && node.props.push((0, utils_1.createAttributeNode)('scroll-y', '' + scrollY));
    }
    else if (directionProp.type === compiler_core_1.NodeTypes.DIRECTIVE) {
        if (!directionProp.arg ||
            directionProp.arg.type !== compiler_core_1.NodeTypes.SIMPLE_EXPRESSION ||
            !directionProp.exp ||
            directionProp.exp.type !== compiler_core_1.NodeTypes.SIMPLE_EXPRESSION) {
            return;
        }
        const exp = directionProp.exp.content;
        const scrollX = `(${exp}) === 'horizontal' || (${exp}) === 'all'`;
        const scrollY = `!(${exp}) || (${exp}) === 'vertical' || (${exp}) === 'all'`;
        node.props.splice(directionPropIndex, 1);
        node.props.push((0, utils_1.createBindDirectiveNode)('scroll-x', scrollX));
        node.props.push((0, utils_1.createBindDirectiveNode)('scroll-y', scrollY));
    }
};
exports.transformDirection = transformDirection;
