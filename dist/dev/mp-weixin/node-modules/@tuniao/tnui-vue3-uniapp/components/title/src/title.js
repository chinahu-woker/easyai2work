"use strict";
const common_vendor = require("../../../../../../common/vendor.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "title",
  props: common_vendor.titleProps,
  emits: common_vendor.titleEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const { ns, titleClass, titleStyle, assistColorClass, assistColorStyle } = common_vendor.useTitleCustomStyle(props);
    const titleClickEvent = () => {
      emits("click");
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(_ctx.title),
        b: _ctx.mode !== "normal" && _ctx.mode !== "transparent"
      }, _ctx.mode !== "normal" && _ctx.mode !== "transparent" ? common_vendor.e({
        c: _ctx.mode === "subTitle" && _ctx.subTitle
      }, _ctx.mode === "subTitle" && _ctx.subTitle ? {
        d: common_vendor.t(_ctx.subTitle)
      } : {}, {
        e: common_vendor.n(common_vendor.unref(ns).e(_ctx.mode)),
        f: common_vendor.n(common_vendor.unref(assistColorClass)),
        g: common_vendor.s(common_vendor.unref(assistColorStyle))
      }) : {}, {
        h: common_vendor.n(common_vendor.unref(titleClass)),
        i: common_vendor.s(common_vendor.unref(titleStyle)),
        j: common_vendor.n(common_vendor.unref(ns).b()),
        k: common_vendor.o(titleClickEvent)
      });
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-183479dc"]]);
wx.createComponent(Component);
