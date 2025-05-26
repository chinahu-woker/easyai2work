"use strict";
const common_vendor = require("../../../../common/vendor.js");
const _sfc_main = {
  name: "u-status-bar",
  mixins: [common_vendor.mpMixin, common_vendor.mixin, common_vendor.props$1],
  data() {
    return {};
  },
  computed: {
    style() {
      const style = {};
      style.height = common_vendor.addUnit(common_vendor.sys().statusBarHeight, "px");
      style.backgroundColor = this.bgColor;
      return common_vendor.deepMerge(style, common_vendor.addStyle(this.customStyle));
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.s($options.style)
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-c0b45a48"]]);
wx.createComponent(Component);
