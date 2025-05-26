"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Math) {
  TnIcon();
}
const TnIcon = () => "../@tuniao/tnui-vue3-uniapp/components/icon/src/icon.js";
const __default__ = {
  options: {
    // 在微信小程序中将组件节点渲染为虚拟节点，更加接近Vue组件的表现(不会出现shadow节点下再去创建元素)
    virtualHost: true
  }
};
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  ...__default__,
  __name: "time-line-data",
  props: common_vendor.timeLineDataProps,
  emits: common_vendor.timeLineDataEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const timeLineContext = common_vendor.inject(common_vendor.timeLineKey, void 0);
    const showLine = common_vendor.computed(
      () => (timeLineContext == null ? void 0 : timeLineContext.showLine.value) === void 0 ? true : timeLineContext == null ? void 0 : timeLineContext.showLine.value
    );
    const { ns, dotClass, dotStyle } = common_vendor.useTimeLineDataCustomStyle(props);
    const clickHandle = () => {
      emits("click");
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          name: _ctx.dotIcon
        }),
        b: common_vendor.n(common_vendor.unref(ns).e("dot")),
        c: common_vendor.n(common_vendor.unref(dotClass)),
        d: common_vendor.s(common_vendor.unref(dotStyle)),
        e: common_vendor.n(common_vendor.unref(ns).e("content")),
        f: common_vendor.n(common_vendor.unref(ns).b()),
        g: common_vendor.n(common_vendor.unref(ns).is("line", showLine.value)),
        h: common_vendor.o(clickHandle)
      };
    };
  }
});
wx.createComponent(_sfc_main);
