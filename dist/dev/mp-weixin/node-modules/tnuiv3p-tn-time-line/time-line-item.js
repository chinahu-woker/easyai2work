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
  __name: "time-line-item",
  props: common_vendor.timeLineItemProps,
  emits: common_vendor.timeLineItemEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const timeLineContext = common_vendor.inject(common_vendor.timeLineKey, void 0);
    const showLine = common_vendor.computed(
      () => (timeLineContext == null ? void 0 : timeLineContext.showLine.value) === void 0 ? true : timeLineContext == null ? void 0 : timeLineContext.showLine.value
    );
    const { ns, dotClass, dotStyle } = common_vendor.useTimeLineCustomStyle(props);
    const clickHandle = () => {
      emits("click");
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: _ctx.titleIcon
      }, _ctx.titleIcon ? {
        b: common_vendor.p({
          name: _ctx.titleIcon
        })
      } : {}, {
        c: common_vendor.n(common_vendor.unref(ns).em("title", "dot")),
        d: common_vendor.n(common_vendor.unref(dotClass)),
        e: common_vendor.n(common_vendor.unref(ns).is("line", showLine.value)),
        f: common_vendor.s(common_vendor.unref(dotStyle)),
        g: common_vendor.t(_ctx.title),
        h: common_vendor.n(common_vendor.unref(ns).em("title", "data")),
        i: common_vendor.n(common_vendor.unref(ns).e("title")),
        j: common_vendor.o(clickHandle),
        k: common_vendor.n(common_vendor.unref(ns).e("data")),
        l: common_vendor.n(common_vendor.unref(ns).b())
      });
    };
  }
});
wx.createComponent(_sfc_main);
