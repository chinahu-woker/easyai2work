"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  name: "fui-safe-area",
  props: {
    //背景颜色
    background: {
      type: String,
      default: "#FFFFFF"
    }
  },
  created() {
  },
  data() {
    return {
      iphonex: false
    };
  },
  methods: {}
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.iphonex ? 1 : "",
    b: $props.background
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-37358499"]]);
wx.createComponent(Component);
