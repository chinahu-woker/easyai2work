"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_up_search2 = common_vendor.resolveComponent("up-search");
  _easycom_up_search2();
}
const _easycom_up_search = () => "../../node-modules/uview-plus/components/u-search/u-search.js";
if (!Math) {
  _easycom_up_search();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "Search",
  setup(__props) {
    const searchValue = common_vendor.ref("");
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(($event) => searchValue.value = $event),
        b: common_vendor.p({
          placeholder: "搜应用搜创意，一键直达",
          modelValue: searchValue.value
        })
      };
    };
  }
});
wx.createComponent(_sfc_main);
