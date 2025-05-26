"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_common = require("../../utils/common.js");
if (!Math) {
  (MyTitle + TnIcon + TnInput + ParamCard)();
}
const TnInput = () => "../../node-modules/@tuniao/tnui-vue3-uniapp/components/input/src/input.js";
const ParamCard = () => "../common/ParamCard.js";
const MyTitle = () => "../common/MyTitle.js";
const TnIcon = () => "../../node-modules/@tuniao/tnui-vue3-uniapp/components/icon/src/icon.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "Seed",
  props: /* @__PURE__ */ common_vendor.mergeModels({
    title: { default: "随机种子" },
    options: { default: {} }
  }, {
    "modelValue": {
      default: 0
    },
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props, { expose: __expose }) {
    const inputValue = common_vendor.useModel(__props, "modelValue");
    const getSeed = () => {
      inputValue.value = utils_common.generateRandomNumber(15);
    };
    common_vendor.onLoad(() => {
      console.log("Seed page onLoad");
      if (!inputValue.value || inputValue.value === 0) {
        getSeed();
      }
    });
    common_vendor.onReady(() => {
      console.log("Seed page onReady");
      if (!inputValue.value || inputValue.value === 0) {
        getSeed();
      }
    });
    __expose({
      getSeed
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          title: _ctx.title
        }),
        b: common_vendor.o(getSeed),
        c: common_vendor.p({
          name: "cube"
        }),
        d: common_vendor.o(($event) => inputValue.value = $event),
        e: common_vendor.p({
          type: "number",
          placeholder: "请输入用户名",
          modelValue: inputValue.value
        })
      };
    };
  }
});
wx.createComponent(_sfc_main);
