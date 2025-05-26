"use strict";
const common_vendor = require("../../../../../../common/vendor.js");
const __default__ = {
  options: {
    // 在微信小程序中将组件节点渲染为虚拟节点，更加接近Vue组件的表现(不会出现shadow节点下再去创建元素)
    virtualHost: true
  }
};
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  ...__default__,
  __name: "loading",
  props: common_vendor.loadingProps,
  setup(__props) {
    const props = __props;
    const {
      ns,
      loadingClass,
      loadingStyle,
      loadingContentClass,
      loadingContentStyle
    } = common_vendor.useLoadingCustomStyle(props);
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: _ctx.show
      }, _ctx.show ? common_vendor.e({
        b: _ctx.mode === "semicircle"
      }, _ctx.mode === "semicircle" ? {
        c: common_vendor.n(common_vendor.unref(ns).e("semicircle"))
      } : {}, {
        d: _ctx.mode === "circle" || _ctx.mode === "semicircle"
      }, _ctx.mode === "circle" || _ctx.mode === "semicircle" ? {
        e: common_vendor.n(common_vendor.unref(ns).e("circle")),
        f: common_vendor.n(common_vendor.unref(loadingContentClass)),
        g: common_vendor.s(common_vendor.unref(loadingContentStyle))
      } : {}, {
        h: _ctx.mode === "flower"
      }, _ctx.mode === "flower" ? {
        i: common_vendor.f(12, (i, k0, i0) => {
          return {
            a: i
          };
        }),
        j: common_vendor.n(common_vendor.unref(ns).em("flower", "item")),
        k: common_vendor.n(common_vendor.unref(ns).e("flower")),
        l: common_vendor.n(common_vendor.unref(loadingContentClass)),
        m: common_vendor.s(common_vendor.unref(loadingContentStyle))
      } : {}, {
        n: common_vendor.n(common_vendor.unref(loadingClass)),
        o: common_vendor.s(common_vendor.unref(loadingStyle))
      }) : {});
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-8c5f91f0"]]);
wx.createComponent(Component);
