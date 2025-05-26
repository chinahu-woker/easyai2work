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
  __name: "water-fall",
  props: common_vendor.waterFallProps,
  setup(__props, { expose: __expose }) {
    const props = __props;
    const ns = common_vendor.useNamespace("water-fall");
    const { componentId, leftData, rightData, resetWaterFall } = common_vendor.useWaterFall(props);
    __expose({
      /**
       * @description 重置瀑布流
       */
      reset: resetWaterFall
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(common_vendor.unref(leftData), (item, index, i0) => {
          return {
            a: "left-" + i0,
            b: common_vendor.r("left", {
              item,
              index
            }, i0),
            c: index
          };
        }),
        b: common_vendor.n(common_vendor.unref(ns).e("item")),
        c: `${common_vendor.unref(componentId)}-left`,
        d: common_vendor.n(common_vendor.unref(ns).e("container")),
        e: common_vendor.f(common_vendor.unref(rightData), (item, index, i0) => {
          return {
            a: "right-" + i0,
            b: common_vendor.r("right", {
              item,
              index
            }, i0),
            c: index
          };
        }),
        f: common_vendor.n(common_vendor.unref(ns).e("item")),
        g: `${common_vendor.unref(componentId)}-right`,
        h: common_vendor.n(common_vendor.unref(ns).e("container")),
        i: common_vendor.n(common_vendor.unref(ns).b())
      };
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-6ee09526"]]);
wx.createComponent(Component);
