"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  name: "fui-footer",
  props: {
    //url，openType，delta ，text，color，size
    //链接设置  object数据格式对应上面注释的属性值
    navigate: {
      type: Array,
      default: function() {
        return [];
      }
    },
    //底部文本
    text: {
      type: String,
      default: ""
    },
    //文本字体颜色
    color: {
      type: String,
      default: "#B2B2B2"
    },
    //文本字体大小
    size: {
      type: [Number, String],
      default: 24
    },
    //footer背景颜色
    background: {
      type: String,
      default: "transparent"
    },
    //分隔线颜色，仅nvue生效
    borderColor: {
      type: String,
      default: "#B2B2B2"
    },
    //是否固定在底部
    isFixed: {
      type: Boolean,
      default: false
    },
    bottom: {
      type: [Number, String],
      default: 0
    },
    //是否适配底部安全区
    safeArea: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    linkColor() {
      const app = common_vendor.index && common_vendor.index.$fui && common_vendor.index.$fui.color;
      return app && app.link || "#465CFF";
    }
  },
  data() {
    return {
      iphoneX: false
    };
  },
  created() {
  },
  methods: {}
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.navigate.length > 0
  }, $props.navigate.length > 0 ? {
    b: common_vendor.f($props.navigate, (item, index, i0) => {
      return {
        a: common_vendor.t(item.text),
        b: !item.color ? 1 : "",
        c: index === $props.navigate.length - 1 ? 1 : "",
        d: item.color || $options.linkColor,
        e: (item.size || 28) + "rpx",
        f: (item.size || 28) + "rpx",
        g: index,
        h: item.openType || "navigate",
        i: item.url,
        j: item.delta
      };
    }),
    c: $props.borderColor
  } : {}, {
    d: common_vendor.t($props.text),
    e: $props.color,
    f: $props.size + "rpx",
    g: $data.iphoneX && $props.safeArea ? 1 : "",
    h: $props.safeArea ? 1 : "",
    i: common_vendor.n($props.isFixed ? "fui-footer__fixed-bottom" : ""),
    j: $props.background,
    k: $props.bottom + "rpx"
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-946bd64a"]]);
wx.createComponent(Component);
