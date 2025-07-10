"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compile = exports.getBaseTransformPreset = void 0;
const shared_1 = require("@vue/shared");
const compiler_core_1 = require("@vue/compiler-core");
const uni_shared_1 = require("@dcloudio/uni-shared");
const uni_cli_shared_1 = require("@dcloudio/uni-cli-shared");
require("./runtimeHelpers");
const codegen_1 = require("./codegen");
const transform_1 = require("./transform");
const vIf_1 = require("./transforms/vIf");
const vFor_1 = require("./transforms/vFor");
const vModel_1 = require("./transforms/vModel");
const vShow_1 = require("./transforms/vShow");
const vText_1 = require("./transforms/vText");
const transformInterpolation_1 = require("./transforms/transformInterpolation");
const transformText_1 = require("./transforms/transformText");
const vOn_1 = require("./transforms/vOn");
const vBind_1 = require("./transforms/vBind");
const transformSlotOutlet_1 = require("./transforms/transformSlotOutlet");
function getBaseTransformPreset(prefixIdentifiers) {
    return [
        [
            vIf_1.transformIf,
            vFor_1.transformFor,
            // order is important
            compiler_core_1.trackVForSlotScopes,
            compiler_core_1.transformExpression,
            transformSlotOutlet_1.transformSlotOutlet,
            compiler_core_1.transformElement,
            compiler_core_1.trackSlotScopes,
            transformText_1.transformText,
            uni_cli_shared_1.transformTapToClick,
            transformInterpolation_1.transformInterpolation,
        ],
        {
            on: vOn_1.transformOn,
            bind: vBind_1.transformBind,
            model: vModel_1.transformModel,
            show: vShow_1.transformShow,
            text: vText_1.transformVText,
        },
    ];
}
exports.getBaseTransformPreset = getBaseTransformPreset;
function compile(template, options) {
    const ast = (0, compiler_core_1.baseParse)(template, {
        isNativeTag(tag) {
            return ((0, uni_shared_1.isAppUVueNativeTag)(tag) ||
                !!options.parseUTSComponent?.(tag, options.targetLanguage));
        },
    });
    const [nodeTransforms, directiveTransforms] = getBaseTransformPreset(options.prefixIdentifiers);
    (0, transform_1.transform)(ast, (0, shared_1.extend)({}, options, {
        prefixIdentifiers: options.prefixIdentifiers,
        nodeTransforms: [
            ...nodeTransforms,
            ...(options.nodeTransforms || []), // user transforms
        ],
        directiveTransforms: (0, shared_1.extend)({}, directiveTransforms, options.directiveTransforms || {} // user transforms
        ),
    }));
    return (0, codegen_1.generate)(ast, options);
}
exports.compile = compile;
