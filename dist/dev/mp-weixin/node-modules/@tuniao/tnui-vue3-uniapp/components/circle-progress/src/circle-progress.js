"use strict";
const common_vendor = require("../../../../../../common/vendor.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "circle-progress",
  props: common_vendor.circleProgressProps,
  setup(__props) {
    const props = __props;
    const { ns, canvasId, radius, activeCircleColor } = common_vendor.useCircleProgress(props);
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.unref(canvasId),
        b: common_vendor.n(common_vendor.unref(ns).e("canvas")),
        c: common_vendor.unref(canvasId),
        d: _ctx.showPercent || _ctx.$slots.default
      }, _ctx.showPercent || _ctx.$slots.default ? {
        e: common_vendor.t(_ctx.percent),
        f: common_vendor.n(common_vendor.unref(ns).e("precent-value"))
      } : {}, {
        g: common_vendor.n(common_vendor.unref(ns).b()),
        h: `${common_vendor.unref(radius) * 2}px`,
        i: `${common_vendor.unref(radius) * 2}px`,
        j: common_vendor.unref(activeCircleColor)
      });
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-8016c374"]]);
wx.createComponent(Component);
