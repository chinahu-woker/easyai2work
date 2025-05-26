"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Math) {
  (MyTitle + TnInput + ParamCard)();
}
const ParamCard = () => "../common/ParamCard.js";
const MyTitle = () => "../common/MyTitle.js";
const TnInput = () => "../../node-modules/@tuniao/tnui-vue3-uniapp/components/input/src/input.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "Positive",
  props: {
    "modelValue": {
      default: ""
    },
    "modelModifiers": {}
  },
  emits: ["update:modelValue"],
  setup(__props) {
    const inputValue = common_vendor.useModel(__props, "modelValue");
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          title: "提示词"
        }),
        b: common_vendor.o(($event) => inputValue.value = $event),
        c: common_vendor.p({
          height: "150",
          type: "textarea",
          clearable: true,
          placeholder: "请输入内容",
          modelValue: inputValue.value
        })
      };
    };
  }
});
wx.createComponent(_sfc_main);
