"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "time-line",
  props: common_vendor.timeLineProps,
  setup(__props) {
    const props = __props;
    const ns = common_vendor.useNamespace$1("time-line");
    common_vendor.provide(common_vendor.timeLineKey, {
      showLine: common_vendor.toRef(props, "showLine")
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.n(common_vendor.unref(ns).b()),
        b: common_vendor.gei(_ctx, "")
      };
    };
  }
});
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/node-modules/tnuiv3p-tn-time-line/time-line.js.map
