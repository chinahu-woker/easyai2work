"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  name: "fui-background-image",
  props: {
    src: {
      type: String,
      default: ""
    },
    background: {
      type: String,
      default: "transparent"
    },
    zIndex: {
      type: [Number, String],
      default: -1
    },
    aspectFill: {
      type: Boolean,
      default: true
    },
    absolute: {
      type: Boolean,
      default: false
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.src != ""
  }, $props.src != "" ? {
    b: $props.src,
    c: $props.aspectFill ? "aspectFill" : "scaleToFill"
  } : {}, {
    d: $props.absolute ? "absolute" : "fixed",
    e: $props.background,
    f: $props.zIndex
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
