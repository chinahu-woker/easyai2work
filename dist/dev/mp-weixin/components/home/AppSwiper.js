"use strict";
const common_vendor = require("../../common/vendor.js");
const composables_useCommon = require("../../composables/useCommon.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "AppSwiper",
  setup(__props) {
    common_vendor.ref(0);
    const pageContent = common_vendor.ref();
    common_vendor.onLoad(async () => {
      pageContent.value = await composables_useCommon.getPageContent();
    });
    const swiperData = common_vendor.computed(() => {
      var _a;
      return (_a = pageContent.value) == null ? void 0 : _a.home_banner.map((item) => {
        return {
          url: item.src,
          title: item.label
        };
      });
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(swiperData.value, (item, index, i0) => {
          return {
            a: "url(" + item.url + ")",
            b: common_vendor.t(item.title),
            c: index
          };
        })
      };
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-115bd473"]]);
wx.createComponent(Component);
