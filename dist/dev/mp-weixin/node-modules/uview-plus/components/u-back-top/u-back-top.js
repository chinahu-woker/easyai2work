"use strict";
const common_vendor = require("../../../../common/vendor.js");
const _sfc_main = {
  name: "u-back-top",
  mixins: [common_vendor.mpMixin, common_vendor.mixin, common_vendor.props$16],
  computed: {
    backTopStyle() {
      const style = {
        bottom: common_vendor.addUnit(this.bottom),
        right: common_vendor.addUnit(this.right),
        width: "40px",
        height: "40px",
        position: "fixed",
        zIndex: 10
      };
      return style;
    },
    show() {
      return common_vendor.getPx(this.scrollTop) > common_vendor.getPx(this.top);
    },
    contentStyle() {
      const style = {};
      let radius = 0;
      if (this.mode === "circle") {
        radius = "100px";
      } else {
        radius = "4px";
      }
      style.borderTopLeftRadius = radius;
      style.borderTopRightRadius = radius;
      style.borderBottomLeftRadius = radius;
      style.borderBottomRightRadius = radius;
      return common_vendor.deepMerge(style, common_vendor.addStyle(this.customStyle));
    }
  },
  emits: ["click"],
  methods: {
    backToTop() {
      common_vendor.index.pageScrollTo({
        scrollTop: 0,
        duration: this.duration
      });
      this.$emit("click");
    }
  }
};
if (!Array) {
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  const _easycom_u_transition2 = common_vendor.resolveComponent("u-transition");
  (_easycom_u_icon2 + _easycom_u_transition2)();
}
const _easycom_u_icon = () => "../u-icon/u-icon.js";
const _easycom_u_transition = () => "../u-transition/u-transition.js";
if (!Math) {
  (_easycom_u_icon + _easycom_u_transition)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: !_ctx.$slots.default && !_ctx.$slots.$default
  }, !_ctx.$slots.default && !_ctx.$slots.$default ? common_vendor.e({
    b: common_vendor.p({
      name: _ctx.icon,
      ["custom-style"]: _ctx.iconStyle
    }),
    c: _ctx.text
  }, _ctx.text ? {
    d: common_vendor.t(_ctx.text)
  } : {}, {
    e: common_vendor.s($options.contentStyle),
    f: common_vendor.o((...args) => $options.backToTop && $options.backToTop(...args))
  }) : {}, {
    g: common_vendor.p({
      mode: "fade",
      customStyle: $options.backTopStyle,
      show: $options.show
    })
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-bf56b0c2"]]);
wx.createComponent(Component);
