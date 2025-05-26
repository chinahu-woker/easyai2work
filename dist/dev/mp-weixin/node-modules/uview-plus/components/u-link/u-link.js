"use strict";
const common_vendor = require("../../../../common/vendor.js");
const _sfc_main = {
  name: "u-link",
  mixins: [common_vendor.mpMixin, common_vendor.mixin, common_vendor.props$15],
  computed: {
    linkStyle() {
      const style = {
        color: this.color,
        fontSize: common_vendor.addUnit(this.fontSize),
        // line-height设置为比字体大小多2px
        lineHeight: common_vendor.addUnit(common_vendor.getPx(this.fontSize) + 2),
        textDecoration: this.underLine ? "underline" : "none"
      };
      return style;
    }
  },
  emits: ["click"],
  methods: {
    addStyle: common_vendor.addStyle,
    openLink() {
      common_vendor.index.setClipboardData({
        data: this.href,
        success: () => {
          common_vendor.index.hideToast();
          this.$nextTick(() => {
            common_vendor.toast(this.mpTips);
          });
        }
      });
      this.$emit("click");
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t(_ctx.text),
    b: common_vendor.o((...args) => $options.openLink && $options.openLink(...args)),
    c: common_vendor.s($options.linkStyle),
    d: common_vendor.s($options.addStyle(_ctx.customStyle))
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-dedad317"]]);
wx.createComponent(Component);
