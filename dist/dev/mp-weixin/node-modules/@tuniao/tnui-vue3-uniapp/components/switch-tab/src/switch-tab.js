"use strict";
const common_vendor = require("../../../../../../common/vendor.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "switch-tab",
  props: common_vendor.switchTabProps,
  emits: common_vendor.switchTabEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const { tabClickEvent } = common_vendor.useSwitchTab(props, emits);
    const { ns, tabClass, tabStyle, switchTabClass, switchTabStyle } = common_vendor.useSwitchTabCustomStyle(props);
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(_ctx.tabs, (tabItem, tabIndex, i0) => {
          return {
            a: common_vendor.t(tabItem),
            b: tabIndex,
            c: common_vendor.n(common_vendor.unref(tabClass)(tabIndex)),
            d: common_vendor.s(common_vendor.unref(tabStyle)(tabIndex)),
            e: common_vendor.o(($event) => common_vendor.unref(tabClickEvent)(tabIndex), tabIndex)
          };
        }),
        b: common_vendor.n(common_vendor.unref(ns).e("tabs")),
        c: common_vendor.n(common_vendor.unref(ns).e("content")),
        d: common_vendor.n(common_vendor.unref(switchTabClass)),
        e: common_vendor.s(common_vendor.unref(switchTabStyle))
      };
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-8e9a9506"]]);
wx.createComponent(Component);
