"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  name: "fui-timeaxis",
  props: {
    padding: {
      type: Array,
      default() {
        return [];
      }
    },
    background: {
      type: String,
      default: "transparent"
    },
    leftWidth: {
      type: [Number, String],
      default: 0
    },
    width: {
      type: [Number, String],
      default: 48
    },
    lineWidth: {
      type: [Number, String],
      default: 1
    }
  },
  provide() {
    return {
      timeaxis: this
    };
  },
  created() {
    this.children = [];
  },
  watch: {
    width(val) {
      this.children.forEach((item) => {
        item.width = val;
      });
    },
    lineWidth(val) {
      this.children.forEach((item) => {
        item.lineWidth = val;
      });
    },
    leftWidth(val) {
      this.children.forEach((item) => {
        item.leftWidth = val;
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $props.padding[0] || 0,
    b: $props.padding[1] || 0,
    c: $props.padding[2] || $props.padding[0] || 0,
    d: $props.padding[3] || $props.padding[1] || 0,
    e: $props.background
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-bca5bcd5"]]);
wx.createComponent(Component);
