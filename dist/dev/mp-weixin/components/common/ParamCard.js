"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {};
if (!Array) {
  const _easycom_up_gap2 = common_vendor.resolveComponent("up-gap");
  _easycom_up_gap2();
}
const _easycom_up_gap = () => "../../node-modules/uview-plus/components/u-gap/u-gap.js";
if (!Math) {
  _easycom_up_gap();
}
function _sfc_render(_ctx, _cache) {
  return {
    a: common_vendor.p({
      height: "10"
    }),
    b: common_vendor.p({
      height: "10"
    })
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-ebc1f76e"]]);
wx.createComponent(Component);
