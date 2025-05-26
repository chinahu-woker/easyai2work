"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Math) {
  TnPopup();
}
const TnPopup = () => "../../node-modules/@tuniao/tnui-vue3-uniapp/components/popup/src/popup.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "MyPopup",
  props: {
    "modelValue": { default: false },
    "modelModifiers": {}
  },
  emits: ["update:modelValue"],
  setup(__props) {
    const showPopup = common_vendor.useModel(__props, "modelValue");
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(($event) => showPopup.value = $event),
        b: common_vendor.p({
          top: "100rpx",
          ["close-btn"]: true,
          width: "100%",
          height: "100%",
          modelValue: showPopup.value
        })
      };
    };
  }
});
wx.createComponent(_sfc_main);
