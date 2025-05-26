"use strict";
const common_vendor = require("../../../common/vendor.js");
var sys = common_vendor.index.getSystemInfoSync();
const _sfc_main = {
  name: "fui-nav-bar",
  emits: ["init", "leftClick", "rightClick", "titleClick"],
  props: {
    //navbar左右padding值，单位px
    padding: {
      type: [Number, String],
      default: 8
    },
    //标题
    title: {
      type: String,
      default: ""
    },
    //标题字体大小，单位px
    size: {
      type: [Number, String],
      default: 17
    },
    //标题颜色
    color: {
      type: String,
      default: ""
    },
    fontWeight: {
      type: [Number, String],
      default: 500
    },
    background: {
      type: String,
      default: ""
    },
    //是否需要底部分割线
    splitLine: {
      type: Boolean,
      default: false
    },
    //分割线颜色，仅Nvue生效
    lineColor: {
      type: String,
      default: "#eee"
    },
    //是否包含状态栏
    statusBar: {
      type: Boolean,
      default: true
    },
    //是否固定在顶部
    isFixed: {
      type: Boolean,
      default: false
    },
    //z-index
    zIndex: {
      type: [Number, String],
      default: 996
    },
    //自定义navbar内容，title、右插槽失效
    custom: {
      type: Boolean,
      default: false
    },
    //v1.9.9+
    isOccupy: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    getStyle() {
      let style = "";
      if (this.isOccupy) {
        let height = this.statusBar ? this.statusBarHeight + 44 : 44;
        style += `height:${height}px;`;
      }
      return style;
    }
  },
  data() {
    return {
      statusBarHeight: sys.statusBarHeight
    };
  },
  created() {
    let obj = {};
    obj = common_vendor.index.getMenuButtonBoundingClientRect();
    this.$emit("init", {
      windowWidth: sys.windowWidth,
      //不包含状态栏高度固定为：44px
      height: 44,
      statusBarHeight: this.statusBarHeight,
      //小程序右上角悬浮按钮左边界坐标，单位：px
      left: obj.left || -1,
      //小程序右上角悬浮按钮宽度，单位：px
      btnWidth: obj.width || 0,
      //小程序右上角悬浮按钮高度，单位：px
      btnHeight: obj.height || 0
    });
  },
  methods: {
    leftClick() {
      this.$emit("leftClick");
    },
    rightClick() {
      this.$emit("rightClick");
    },
    titleClick() {
      this.$emit("titleClick");
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.statusBar
  }, $props.statusBar ? {
    b: $data.statusBarHeight + "px"
  } : {}, {
    c: !$props.custom
  }, !$props.custom ? common_vendor.e({
    d: common_vendor.o((...args) => $options.leftClick && $options.leftClick(...args)),
    e: $props.title
  }, $props.title ? {
    f: common_vendor.t($props.title),
    g: $props.size + "px",
    h: $props.color,
    i: $props.fontWeight,
    j: common_vendor.o((...args) => $options.titleClick && $options.titleClick(...args))
  } : {}, {
    k: common_vendor.o((...args) => $options.rightClick && $options.rightClick(...args))
  }) : {}, {
    l: $props.custom
  }, $props.custom ? {} : {}, {
    m: $props.splitLine ? 1 : "",
    n: !$props.background ? 1 : "",
    o: $props.isFixed ? 1 : "",
    p: $props.background,
    q: $props.lineColor,
    r: $props.padding + "px",
    s: $props.padding + "px",
    t: $props.zIndex,
    v: common_vendor.s($options.getStyle)
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-d46cf250"]]);
wx.createComponent(Component);
