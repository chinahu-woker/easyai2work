"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_up_navbar_mini2 = common_vendor.resolveComponent("up-navbar-mini");
  _easycom_up_navbar_mini2();
}
const _easycom_up_navbar_mini = () => "../../node-modules/uview-plus/components/u-navbar-mini/u-navbar-mini.js";
if (!Math) {
  _easycom_up_navbar_mini();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "MyNavbar",
  setup(__props) {
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          autoBack: true,
          homeUrl: "/pages/index/index"
        })
      };
    };
  }
});
wx.createComponent(_sfc_main);
