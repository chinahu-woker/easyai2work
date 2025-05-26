"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {};
  },
  methods: {
    goToPage() {
      common_vendor.index.navigateBack("/pages/index/index");
    }
  }
};
if (!Array) {
  const _easycom_fui_button2 = common_vendor.resolveComponent("fui-button");
  const _easycom_fui_empty2 = common_vendor.resolveComponent("fui-empty");
  (_easycom_fui_button2 + _easycom_fui_empty2)();
}
const _easycom_fui_button = () => "../../components/firstui/fui-button/fui-button.js";
const _easycom_fui_empty = () => "../../components/firstui/fui-empty/fui-empty.js";
if (!Math) {
  (_easycom_fui_button + _easycom_fui_empty)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o($options.goToPage),
    b: common_vendor.p({
      text: "返回首页",
      size: 28,
      width: "336rpx",
      height: "42rpx",
      radius: "100rpx",
      background: "#fff",
      margin: ["64rpx", "0"],
      borderColor: "#465CFF",
      color: "#465CFF"
    }),
    c: common_vendor.p({
      src: "/static/images/component/empty/img_data_3x.png",
      title: "暂无数据",
      descr: "功能开发中，敬请期待！"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
