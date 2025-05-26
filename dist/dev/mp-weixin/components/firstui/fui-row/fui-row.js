"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  name: "fui-row",
  componentName: "fuiRow",
  props: {
    //是否为flex布局
    isFlex: {
      type: Boolean,
      default: false
    },
    //flex 布局下的水平排列方式 start/end/center/space-around/space-between
    justify: {
      type: String,
      default: "start"
    },
    //flex 布局下的垂直排列方式	top/middle/bottom
    align: {
      type: String,
      default: "top"
    },
    marginTop: {
      type: String,
      default: "0"
    },
    marginBottom: {
      type: String,
      default: "0"
    },
    //栅格间隔
    gutter: {
      type: Number,
      default: 0
    },
    // nvue如果使用span等属性，需要配置宽度
    width: {
      type: [String, Number],
      default: 750
    }
  },
  data() {
    return {
      flex: false
    };
  },
  watch: {
    isFlex(val) {
      this.flex = val;
    }
  },
  created() {
    this.flex = this.isFlex;
  },
  computed: {
    marginValue() {
      if (this.gutter) {
        return Number(this.gutter) / 2;
      }
      return 0;
    },
    justifyClass() {
      return this.justify !== "start" ? `fui-row__${this.justify}` : "";
    },
    alignClass() {
      return this.align !== "top" ? `fui-row__${this.align}` : "";
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.n($data.flex ? "fui-row__flex" : ""),
    b: common_vendor.n($options.justifyClass),
    c: common_vendor.n($options.alignClass),
    d: $props.marginTop,
    e: $props.marginBottom,
    f: `-${$options.marginValue}rpx`,
    g: `-${$options.marginValue}rpx`
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-ca770746"]]);
wx.createComponent(Component);
