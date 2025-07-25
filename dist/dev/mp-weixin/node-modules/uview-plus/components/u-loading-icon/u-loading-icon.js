"use strict";
const common_vendor = require("../../../../common/vendor.js");
const _sfc_main = {
  name: "u-loading-icon",
  mixins: [common_vendor.mpMixin, common_vendor.mixin, common_vendor.props$12],
  data() {
    return {
      // Array.form可以通过一个伪数组对象创建指定长度的数组
      // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/from
      array12: Array.from({
        length: 12
      }),
      // 这里需要设置默认值为360，否则在安卓nvue上，会延迟一个duration周期后才执行
      // 在iOS nvue上，则会一开始默认执行两个周期的动画
      aniAngel: 360,
      // 动画旋转角度
      webviewHide: false,
      // 监听webview的状态，如果隐藏了页面，则停止动画，以免性能消耗
      loading: false
      // 是否运行中，针对nvue使用
    };
  },
  computed: {
    // 当为circle类型时，给其另外三边设置一个更轻一些的颜色
    // 之所以需要这么做的原因是，比如父组件传了color为红色，那么需要另外的三个边为浅红色
    // 而不能是固定的某一个其他颜色(因为这个固定的颜色可能浅蓝，导致效果没有那么细腻良好)
    otherBorderColor() {
      const lightColor = common_vendor.colorGradient(this.color, "#ffffff", 100)[80];
      if (this.mode === "circle") {
        return this.inactiveColor ? this.inactiveColor : lightColor;
      } else {
        return "transparent";
      }
    }
  },
  watch: {
    show(n) {
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    addUnit: common_vendor.addUnit,
    addStyle: common_vendor.addStyle,
    init() {
      setTimeout(() => {
      }, 20);
    },
    // 监听webview的显示与隐藏
    addEventListenerToWebview() {
      const pages = getCurrentPages();
      const page = pages[pages.length - 1];
      const currentWebview = page.$getAppWebview();
      currentWebview.addEventListener("hide", () => {
        this.webviewHide = true;
      });
      currentWebview.addEventListener("show", () => {
        this.webviewHide = false;
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: _ctx.show
  }, _ctx.show ? common_vendor.e({
    b: !$data.webviewHide
  }, !$data.webviewHide ? common_vendor.e({
    c: _ctx.mode === "spinner"
  }, _ctx.mode === "spinner" ? {
    d: common_vendor.f($data.array12, (item, index, i0) => {
      return {
        a: index
      };
    })
  } : {}, {
    e: common_vendor.n(`u-loading-icon__spinner--${_ctx.mode}`),
    f: _ctx.color,
    g: $options.addUnit(_ctx.size),
    h: $options.addUnit(_ctx.size),
    i: _ctx.color,
    j: $options.otherBorderColor,
    k: $options.otherBorderColor,
    l: $options.otherBorderColor,
    m: `${_ctx.duration}ms`,
    n: _ctx.mode === "semicircle" || _ctx.mode === "circle" ? _ctx.timingFunction : ""
  }) : {}, {
    o: _ctx.text
  }, _ctx.text ? {
    p: common_vendor.t(_ctx.text),
    q: $options.addUnit(_ctx.textSize),
    r: _ctx.textColor
  } : {}, {
    s: common_vendor.s($options.addStyle(_ctx.customStyle)),
    t: common_vendor.n(_ctx.vertical && "u-loading-icon--vertical"),
    v: common_vendor.gei(_ctx, "")
  }) : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-00752c6d"]]);
wx.createComponent(Component);
