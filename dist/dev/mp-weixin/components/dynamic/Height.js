"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Math) {
  CustomSlider();
}
const CustomSlider = () => "./CustomSlider.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "Height",
  props: {
    "modelValue": {
      default: 512
    },
    "modelModifiers": {}
  },
  emits: ["update:modelValue"],
  setup(__props) {
    const modelValue = common_vendor.useModel(__props, "modelValue");
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(($event) => modelValue.value = $event),
        b: common_vendor.p({
          title: "高度",
          modelValue: modelValue.value
        })
      };
    };
  }
});
wx.createComponent(_sfc_main);
