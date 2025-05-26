"use strict";
const common_vendor = require("../../../../common/vendor.js");
const _sfc_main = {
  name: "u-gap",
  mixins: [common_vendor.mpMixin, common_vendor.mixin, common_vendor.props],
  computed: {
    gapStyle() {
      const style = {
        backgroundColor: this.bgColor,
        height: common_vendor.addUnit(this.height),
        marginTop: common_vendor.addUnit(this.marginTop),
        marginBottom: common_vendor.addUnit(this.marginBottom)
      };
      return common_vendor.deepMerge(style, common_vendor.addStyle(this.customStyle));
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.s($options.gapStyle)
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-a491fc03"]]);
wx.createComponent(Component);
