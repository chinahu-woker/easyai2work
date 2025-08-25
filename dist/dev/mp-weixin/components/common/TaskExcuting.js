"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_appStore = require("../../stores/appStore.js");
if (!Math) {
  (TnCircleProgress + TnPopup)();
}
const TnPopup = () => "../node-modules/@tuniao/tnui-vue3-uniapp/components/popup/src/popup.js";
const TnCircleProgress = () => "../node-modules/@tuniao/tnui-vue3-uniapp/components/circle-progress/src/circle-progress.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "TaskExcuting",
  setup(__props) {
    const store = stores_appStore.useAppStore();
    const { showExecuting } = common_vendor.storeToRefs(store);
    common_vendor.watch(showExecuting, (newVal) => {
      common_vendor.index.__f__("log", "at components/common/TaskExcuting.vue:13", "showExecuting changed to:", newVal);
    });
    common_vendor.onMounted(() => {
      common_vendor.index.__f__("log", "at components/common/TaskExcuting.vue:18", "store state:", store.$state);
    });
    const progressPercent = common_vendor.ref(30);
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.unref(showExecuting)
      }, common_vendor.unref(showExecuting) ? {
        b: common_vendor.t(progressPercent.value),
        c: common_vendor.p({
          percent: progressPercent.value
        }),
        d: common_vendor.o(($event) => common_vendor.isRef(showExecuting) ? showExecuting.value = $event : null),
        e: common_vendor.p({
          width: "80%",
          height: "450",
          ["close-btn"]: true,
          ["overlay-closeable"]: false,
          modelValue: common_vendor.unref(showExecuting)
        })
      } : {});
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-6bc70b73"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/common/TaskExcuting.js.map
