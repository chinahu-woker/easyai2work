"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TO_HANDLERS = exports.RENDER_SLOT = exports.RESOLVE_EASY_COMPONENT = exports.RESOLVE_DIRECTIVE = exports.RESOLVE_COMPONENT = exports.OPEN_BLOCK = exports.FRAGMENT = exports.RENDER_LIST = exports.V_SHOW = exports.IS_TRUE = void 0;
const compiler_core_1 = require("@vue/compiler-core");
exports.IS_TRUE = Symbol(`isTrue`);
exports.V_SHOW = Symbol(`vShow`);
exports.RENDER_LIST = Symbol(`renderList`);
exports.FRAGMENT = Symbol(`Fragment`);
exports.OPEN_BLOCK = Symbol(`openBlock`);
exports.RESOLVE_COMPONENT = Symbol(`resolveComponent`);
exports.RESOLVE_DIRECTIVE = Symbol(`resolveDirective`);
exports.RESOLVE_EASY_COMPONENT = Symbol(`resolveEasyComponent`);
exports.RENDER_SLOT = Symbol(`renderSlot`);
exports.TO_HANDLERS = Symbol(`toHandlers`);
(0, compiler_core_1.registerRuntimeHelpers)({
    [exports.IS_TRUE]: 'isTrue',
    [exports.V_SHOW]: 'vShow',
    [exports.RENDER_LIST]: 'RenderHelpers.renderList',
    [exports.FRAGMENT]: 'Fragment',
    [exports.RESOLVE_COMPONENT]: 'resolveComponent',
    [exports.RESOLVE_EASY_COMPONENT]: 'resolveEasyComponent',
    [exports.RESOLVE_DIRECTIVE]: 'resolveDirective',
    [exports.RENDER_SLOT]: `renderSlot`,
    [exports.TO_HANDLERS]: `toHandlers`,
});
