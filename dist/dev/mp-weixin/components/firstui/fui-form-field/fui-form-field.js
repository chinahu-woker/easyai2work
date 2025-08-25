"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  emits: ["input", "update:modelValue"],
  name: "fui-form-field",
  behaviors: ["wx://form-field"],
  props: {
    //是否为隐藏域
    hidden: {
      type: Boolean,
      default: false
    },
    value: {
      type: [Number, String, Array],
      default: ""
    },
    modelValue: {
      type: [Number, String, Array],
      default: ""
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $props.hidden ? 1 : ""
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-3aa2974b"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/components/firstui/fui-form-field/fui-form-field.js.map
