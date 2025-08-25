"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformModel = void 0;
const compiler_core_1 = require("@vue/compiler-core");
const shared_1 = require("@vue/shared");
const tags = ['input', 'textarea'];
const transformModel = (dir, node, context) => {
    const result = (0, compiler_core_1.transformModel)(dir, node, context);
    // 将 input,textarea 的 onUpdate:modelValue 事件转换为 onInput
    if (tags.includes(node.tag) && result.props.length >= 2) {
        const key = result.props[1].key;
        let value = result.props[1].value;
        if (value.type === 20 /* NodeTypes.JS_CACHE_EXPRESSION */) {
            value = value.value;
        }
        if ((0, compiler_core_1.isStaticExp)(key) &&
            key.content === 'onUpdate:modelValue' &&
            value.type === 8 /* NodeTypes.COMPOUND_EXPRESSION */) {
            key.content = getEventName(dir);
            // 调整函数类型及返回表达式，适配 uts
            value.children = value.children.map((child) => {
                if ((0, shared_1.isString)(child)) {
                    if (child === '$event => ((') {
                        return `($event: ${getEventParamsType(dir)}): any => {`;
                    }
                    else if (child === ') = $event)') {
                        return ` = ${withNumber(dir) ? '_looseToNumber(' : ''}$event.detail.value${withTrim(dir) ? '.trim()' : ''}${withNumber(dir) ? ')' : ''};\nreturn ${withNumber(dir) ? '_looseToNumber(' : ''}$event.detail.value${withTrim(dir) ? '.trim()' : ''}${withNumber(dir) ? ')' : ''};}`;
                    }
                }
                return child;
            });
        }
    }
    return result;
};
exports.transformModel = transformModel;
function getEventName(dir) {
    return withLazy(dir) ? 'onBlur' : 'onInput';
}
function getEventParamsType(dir) {
    return withLazy(dir) ? 'InputBlurEvent' : 'InputEvent';
}
function withLazy(dir) {
    return dir.modifiers.includes('lazy');
}
function withNumber(dir) {
    return dir.modifiers.includes('number');
}
function withTrim(dir) {
    return dir.modifiers.includes('trim');
}
