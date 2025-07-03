"use strict";
const common_vendor = require("../common/vendor.js");
const stores_appStore = require("../stores/appStore.js");
if (!Math) {
  (TaskExcuting + PaymentPopup + MyBackToTop)();
}
const TaskExcuting = () => "../components/common/TaskExcuting.js";
const PaymentPopup = () => "../components/home/PaymentPopup.js";
const MyBackToTop = () => "../components/common/MyBackToTop.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "BaseLayout",
  setup(__props) {
    const { showPay } = common_vendor.storeToRefs(stores_appStore.useAppStore());
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.unref(showPay)
      }, common_vendor.unref(showPay) ? {} : {});
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-a6b05516"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../.sourcemap/mp-weixin/layouts/BaseLayout.js.map
