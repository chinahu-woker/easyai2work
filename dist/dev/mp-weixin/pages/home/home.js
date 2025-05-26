"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_fui_background_image2 = common_vendor.resolveComponent("fui-background-image");
  const _easycom_up_gap2 = common_vendor.resolveComponent("up-gap");
  (_easycom_fui_background_image2 + _easycom_up_gap2)();
}
const _easycom_fui_background_image = () => "../../components/firstui/fui-background-image/fui-background-image.js";
const _easycom_up_gap = () => "../../node-modules/uview-plus/components/u-gap/u-gap.js";
if (!Math) {
  (_easycom_fui_background_image + AppSwiper + _easycom_up_gap + Search + AppTags + AppWaterFall)();
}
const AppSwiper = () => "../../components/home/AppSwiper.js";
const Search = () => "../../components/home/Search.js";
const AppTags = () => "../../components/home/AppTags.js";
const AppWaterFall = () => "../../components/home/AppWaterFall.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "home",
  setup(__props) {
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          src: "@/src/static/Home2 (1).jpgHome2(1).jpg"
        }),
        b: common_vendor.p({
          height: "10"
        }),
        c: common_vendor.p({
          height: "10"
        })
      };
    };
  }
});
wx.createPage(_sfc_main);
