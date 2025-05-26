"use strict";
const common_vendor = require("../../../../common/vendor.js");
const _sfc_main = {
  name: "u-navbar-mini",
  mixins: [common_vendor.mpMixin, common_vendor.mixin, common_vendor.props$9],
  data() {
    return {};
  },
  emits: ["leftClick", "homeClick"],
  created() {
  },
  methods: {
    addStyle: common_vendor.addStyle,
    addUnit: common_vendor.addUnit,
    sys: common_vendor.sys,
    getPx: common_vendor.getPx,
    // 点击左侧区域
    leftClick() {
      this.$emit("leftClick");
      if (this.autoBack) {
        common_vendor.index.navigateBack();
      }
    },
    homeClick() {
      if (this.homeUrl) {
        common_vendor.index.reLaunch({ url: this.homeUrl });
      }
    }
  }
};
if (!Array) {
  const _easycom_u_status_bar2 = common_vendor.resolveComponent("u-status-bar");
  const _easycom_up_icon2 = common_vendor.resolveComponent("up-icon");
  const _easycom_up_line2 = common_vendor.resolveComponent("up-line");
  (_easycom_u_status_bar2 + _easycom_up_icon2 + _easycom_up_line2)();
}
const _easycom_u_status_bar = () => "../u-status-bar/u-status-bar.js";
const _easycom_up_icon = () => "../u-icon/u-icon.js";
const _easycom_up_line = () => "../u-line/u-line.js";
if (!Math) {
  (_easycom_u_status_bar + _easycom_up_icon + _easycom_up_line)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: _ctx.safeAreaInsetTop
  }, _ctx.safeAreaInsetTop ? {} : {}, {
    b: common_vendor.p({
      name: _ctx.leftIcon,
      size: _ctx.iconSize,
      color: _ctx.iconColor
    }),
    c: common_vendor.o((...args) => $options.leftClick && $options.leftClick(...args)),
    d: common_vendor.p({
      direction: "col",
      color: "#fff",
      length: "16px"
    }),
    e: common_vendor.p({
      name: "home",
      size: _ctx.iconSize,
      color: _ctx.iconColor
    }),
    f: common_vendor.o((...args) => $options.homeClick && $options.homeClick(...args)),
    g: common_vendor.n(_ctx.border && "u-border-bottom"),
    h: $options.addUnit(_ctx.height),
    i: _ctx.bgColor,
    j: common_vendor.n(_ctx.fixed && "u-navbar-mini--fixed"),
    k: common_vendor.n(_ctx.customClass)
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-128ec6da"]]);
wx.createComponent(Component);
