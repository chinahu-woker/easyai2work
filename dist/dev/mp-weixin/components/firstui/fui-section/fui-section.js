"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  name: "fui-section",
  emits: ["click"],
  props: {
    title: {
      type: String,
      default: ""
    },
    //默认使用全局配置值
    size: {
      type: [Number, String],
      default: 0
    },
    lineHeight: {
      type: [Number, String],
      default: 0
    },
    color: {
      type: String,
      default: ""
    },
    fontWeight: {
      type: [Number, String],
      default: 0
    },
    descr: {
      type: String,
      default: ""
    },
    descrSize: {
      type: [Number, String],
      default: 0
    },
    descrColor: {
      type: String,
      default: ""
    },
    descrTop: {
      type: [Number, String],
      default: 0
    },
    isLine: {
      type: Boolean,
      default: false
    },
    lineWidth: {
      type: String,
      default: "2px"
    },
    lineColor: {
      type: String,
      default: ""
    },
    //square、circle
    lineCap: {
      type: String,
      default: "circle"
    },
    //nvue android端不支持负数
    lineRight: {
      type: [Number, String],
      default: 16
    },
    lineGap: {
      type: [Number, String],
      default: 0
    },
    background: {
      type: String,
      default: "transparent"
    },
    padding: {
      type: Array,
      default() {
        return ["0", "32rpx"];
      }
    },
    marginTop: {
      type: [Number, String],
      default: 0
    },
    marginBottom: {
      type: [Number, String],
      default: 0
    }
  },
  computed: {
    getLineColor() {
      let color = this.lineColor;
      return color;
    },
    getLeft() {
      const left = Number(this.lineRight || 0);
      return `${left > 0 ? 0 : left}rpx`;
    },
    getTitleStyle() {
      const app = common_vendor.index && common_vendor.index.$fui && common_vendor.index.$fui.fuiSection;
      const size = this.size || app && app.size || 32;
      const color = this.color || app && app.color || "#181818";
      const weight = this.fontWeight || app && app.fontWeight || 600;
      const left = Number(this.lineRight || 0);
      let style = `font-size:${size}rpx;color:${color};font-weight:${weight};padding-left:${left <= 0 || !this.isLine ? 0 : left}rpx;`;
      style += `line-height:${this.lineHeight == 0 ? size : this.lineHeight}rpx`;
      return style;
    },
    getDescrStyle() {
      const app = common_vendor.index && common_vendor.index.$fui && common_vendor.index.$fui.fuiSection;
      const size = this.descrSize || app && app.descrSize || 28;
      const color = this.descrColor || app && app.descrColor || "#B2B2B2";
      return `font-size:${size}rpx;color:${color};`;
    },
    getDescrTop() {
      const app = common_vendor.index && common_vendor.index.$fui && common_vendor.index.$fui.fuiSection;
      return "padding-top:" + (this.descrTop || app && app.descrTop || 8) + "rpx;";
    }
  },
  methods: {
    handleClick() {
      this.$emit("click", {
        title: this.title
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.isLine
  }, $props.isLine ? {
    b: !$options.getLineColor ? 1 : "",
    c: $options.getLineColor,
    d: $props.lineWidth,
    e: $props.lineGap + "rpx",
    f: $props.lineGap + "rpx",
    g: $props.lineCap === "circle" ? $props.lineWidth : 0,
    h: $options.getLeft
  } : {}, {
    i: $props.title
  }, $props.title ? {
    j: common_vendor.t($props.title),
    k: common_vendor.s($options.getTitleStyle)
  } : {}, {
    l: common_vendor.o((...args) => $options.handleClick && $options.handleClick(...args)),
    m: $props.descr
  }, $props.descr ? {
    n: common_vendor.t($props.descr),
    o: common_vendor.s($options.getDescrStyle),
    p: common_vendor.s($options.getDescrTop)
  } : {}, {
    q: $props.marginTop + "rpx",
    r: $props.marginBottom + "rpx",
    s: $props.background,
    t: $props.padding[0] || 0,
    v: $props.padding[1] || 0,
    w: $props.padding[2] || $props.padding[0] || 0,
    x: $props.padding[3] || $props.padding[1] || 0
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-20f3438b"]]);
wx.createComponent(Component);
