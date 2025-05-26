"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Math) {
  CustomSlider();
}
const CustomSlider = () => "./CustomSlider.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "Width",
  props: /* @__PURE__ */ common_vendor.mergeModels({
    title: { default: "宽度" },
    options: { default: {
      min: 512,
      max: 1024,
      step: 8
    } }
  }, {
    "modelValue": {
      default: 512
    },
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props) {
    const props = __props;
    const modelValue = common_vendor.useModel(__props, "modelValue");
    console.log(111111, props.options);
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(($event) => modelValue.value = $event),
        b: common_vendor.p({
          title: _ctx.title,
          options: _ctx.options,
          modelValue: modelValue.value
        })
      };
    };
  }
});
wx.createComponent(_sfc_main);
