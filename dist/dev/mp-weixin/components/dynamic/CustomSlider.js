"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_up_slider2 = common_vendor.resolveComponent("up-slider");
  _easycom_up_slider2();
}
const _easycom_up_slider = () => "../../node-modules/uview-plus/components/u-slider/u-slider.js";
if (!Math) {
  (MyTitle + _easycom_up_slider + ParamCard)();
}
const MyTitle = () => "../common/MyTitle.js";
const ParamCard = () => "../common/ParamCard.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "CustomSlider",
  props: /* @__PURE__ */ common_vendor.mergeModels({
    title: { default: "选择大小" },
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
    const sliderValue = common_vendor.useModel(__props, "modelValue");
    const props = __props;
    console.log(props.options, typeof props.options);
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          title: _ctx.title
        }),
        b: common_vendor.o(($event) => sliderValue.value = $event),
        c: common_vendor.p({
          showValue: true,
          step: _ctx.options.step,
          min: _ctx.options.min,
          max: _ctx.options.max,
          modelValue: sliderValue.value
        })
      };
    };
  }
});
wx.createComponent(_sfc_main);
