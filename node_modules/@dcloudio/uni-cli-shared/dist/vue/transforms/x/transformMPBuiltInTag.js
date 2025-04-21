"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformMPBuiltInTag = exports.createMPBuiltInTagTransform = exports.defaultTransformMPBuiltInTagOptions = void 0;
const shared_1 = require("@vue/shared");
const vite_1 = require("../../../vite");
const utils_1 = require("../../utils");
const compiler_core_1 = require("@vue/compiler-core");
exports.defaultTransformMPBuiltInTagOptions = {
    propRename: {
        checkbox: {
            // "backgroundColor": "",
            // "borderColor": "",
            // "activeBackgroundColor": "",
            // "activeBorderColor": "",
            foreColor: 'color',
        },
        radio: {
            // "backgroundColor": "",
            // "borderColor": "",
            activeBackgroundColor: 'color',
            // "activeBorderColor": "",
            // "foreColor": ""
        },
        slider: {
            backgroundColor: 'backgroundColor',
            activeBackgroundColor: 'activeColor',
            foreColor: 'block-color',
        },
        switch: {
            // "backgroundColor": "",
            activeBackgroundColor: 'color',
            // "foreColor": "",
            // "activeForeColor": ""
        },
        'rich-text': {
            selectable: 'user-select',
        },
    },
    propAdd: {
        canvas: [
            {
                name: 'type',
                value: '2d',
            },
        ],
        'scroll-view': [
            {
                name: 'enable-flex',
                value: 'true',
            },
            {
                name: 'enhanced',
                value: 'true',
            },
        ],
    },
    tagRename: {
        'list-view': 'scroll-view',
    },
};
function createMPBuiltInTagTransform(options) {
    return function (node, context) {
        if (!(0, vite_1.isElementNode)(node)) {
            return;
        }
        if (options.tagRename && node.tag in options.tagRename) {
            node.tag = options.tagRename[node.tag];
        }
        if (options.propRename && node.tag in options.propRename) {
            const propMap = options.propRename[node.tag];
            node.props.forEach((prop) => {
                if (prop.type === compiler_core_1.NodeTypes.ATTRIBUTE) {
                    const propName = (0, shared_1.camelize)(prop.name);
                    if (propName in propMap && propMap[propName]) {
                        (0, utils_1.renameProp)(propMap[propName], prop);
                    }
                }
                else if (prop.type === compiler_core_1.NodeTypes.DIRECTIVE) {
                    if (!prop.rawName || !prop.arg || !(0, compiler_core_1.isStaticExp)(prop.arg)) {
                        return;
                    }
                    const propName = (0, shared_1.camelize)(prop.rawName.slice(1));
                    if (propName in propMap && propMap[propName]) {
                        (0, utils_1.renameProp)(propMap[propName], prop);
                    }
                }
            });
        }
        if (options.propAdd && node.tag in options.propAdd) {
            const add = options.propAdd[node.tag];
            add.forEach(({ name, value }) => {
                if (node.props.some((item) => (0, utils_1.isPropNameEquals)(item, name))) {
                    return;
                }
                node.props.push((0, utils_1.createAttributeNode)(name, value));
            });
        }
    };
}
exports.createMPBuiltInTagTransform = createMPBuiltInTagTransform;
exports.transformMPBuiltInTag = createMPBuiltInTagTransform(exports.defaultTransformMPBuiltInTagOptions);
