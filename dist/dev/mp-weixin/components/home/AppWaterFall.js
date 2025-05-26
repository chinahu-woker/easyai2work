"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_appStore = require("../../stores/appStore.js");
const utils_common = require("../../utils/common.js");
if (!Math) {
  TnWaterFall();
}
const TnWaterFall = () => "../../node-modules/@tuniao/tnui-vue3-uniapp/components/water-fall/src/water-fall.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "AppWaterFall",
  setup(__props) {
    common_vendor.onMounted(() => {
      stores_appStore.useAppStore().initWorkFlows_All().then(() => getshowApps());
    });
    const { workflows_all, home_tagActiveIndex, home_tagsList } = common_vendor.storeToRefs(stores_appStore.useAppStore());
    const waterfallElement = common_vendor.ref();
    const showApps = common_vendor.ref();
    const getshowApps = () => {
      console.log("home_tagActiveIndex", home_tagActiveIndex.value);
      if (home_tagActiveIndex.value === 0) {
        showApps.value = [...workflows_all.value];
        return;
      }
      const result = workflows_all.value.filter((item) => {
        var _a;
        return (_a = item.tags) == null ? void 0 : _a.includes(home_tagsList.value[home_tagActiveIndex.value].name);
      });
      console.log("result", result);
      showApps.value = [...result];
    };
    common_vendor.watch(home_tagActiveIndex, () => {
      if (waterfallElement.value) {
        waterfallElement.value.reset();
      }
      getshowApps();
    });
    const appStore = stores_appStore.useAppStore();
    const handleNavigate = (item) => {
      appStore.tabbarIndex = null;
      common_vendor.index.navigateTo({ url: "/pages/draw/draw_info/draw_info?id=" + item._id });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.w(({
          item
        }, s0, i0) => {
          return common_vendor.e({
            a: common_vendor.unref(utils_common.isVideo)(item.cover)
          }, common_vendor.unref(utils_common.isVideo)(item.cover) ? {
            b: item.cover
          } : {
            c: item.cover
          }, {
            d: common_vendor.o(($event) => handleNavigate(item)),
            e: i0,
            f: s0
          });
        }, {
          name: "left",
          path: "a",
          vueId: "f26ed2f2-0"
        }),
        b: common_vendor.w(({
          item
        }, s0, i0) => {
          return common_vendor.e({
            a: common_vendor.unref(utils_common.isVideo)(item.cover)
          }, common_vendor.unref(utils_common.isVideo)(item.cover) ? {
            b: item.cover
          } : {
            c: item.cover
          }, {
            d: common_vendor.o(($event) => handleNavigate(item)),
            e: i0,
            f: s0
          });
        }, {
          name: "right",
          path: "b",
          vueId: "f26ed2f2-0"
        }),
        c: common_vendor.sr(waterfallElement, "f26ed2f2-0", {
          "k": "waterfallElement"
        }),
        d: common_vendor.p({
          data: showApps.value
        })
      };
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-f26ed2f2"]]);
wx.createComponent(Component);
