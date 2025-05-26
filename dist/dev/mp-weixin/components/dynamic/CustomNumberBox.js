"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _component_View = common_vendor.resolveComponent("View");
  _component_View();
}
if (!Math) {
  (MyTitle + TnNumberBox + ParamCard)();
}
const TnNumberBox = () => "../../node-modules/@tuniao/tnui-vue3-uniapp/components/number-box/src/number-box.js";
const ParamCard = () => "../common/ParamCard.js";
const MyTitle = () => "../common/MyTitle.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "CustomNumberBox",
  props: {
    "modelValue": {
      default: 1
    },
    "modelModifiers": {}
  },
  emits: ["update:modelValue"],
  setup(__props) {
    const numberValue = common_vendor.useModel(__props, "modelValue");
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          title: "图像批次"
        }),
        b: common_vendor.o(($event) => numberValue.value = $event),
        c: common_vendor.p({
          modelValue: numberValue.value
        })
      };
    };
  }
});
wx.createComponent(_sfc_main);
