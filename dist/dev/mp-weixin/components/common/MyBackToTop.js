"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_up_back_top2 = common_vendor.resolveComponent("up-back-top");
  _easycom_up_back_top2();
}
const _easycom_up_back_top = () => "../../node-modules/uview-plus/components/u-back-top/u-back-top.js";
if (!Math) {
  _easycom_up_back_top();
}
const _sfc_defineComponent = common_vendor.defineComponent({
  __name: "MyBackToTop",
  setup(__props) {
    const scrollTop = common_vendor.ref(0);
    common_vendor.onPageScroll((e) => {
      scrollTop.value = e.scrollTop;
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          ["scroll-top"]: scrollTop.value
        })
      };
    };
  }
});
_sfc_defineComponent.__runtimeHooks = 1;
wx.createComponent(_sfc_defineComponent);
