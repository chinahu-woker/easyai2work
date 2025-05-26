"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_appStore = require("../../stores/appStore.js");
if (!Array) {
  const _easycom_up_tabs2 = common_vendor.resolveComponent("up-tabs");
  _easycom_up_tabs2();
}
const _easycom_up_tabs = () => "../../node-modules/uview-plus/components/u-tabs/u-tabs.js";
if (!Math) {
  _easycom_up_tabs();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "AppTags",
  setup(__props) {
    const { workflows_all, home_tagActiveIndex, home_tagsList } = common_vendor.storeToRefs(stores_appStore.useAppStore());
    const tabsData = common_vendor.computed(() => {
      var _a;
      const tagsTemp = [];
      tagsTemp.push({ name: "全部", count: 0 });
      (_a = workflows_all.value) == null ? void 0 : _a.forEach((item) => {
        item == null ? void 0 : item.tags.forEach((tas) => {
          if (!tagsTemp.find((tag) => {
            return tag.name === tas;
          })) {
            tagsTemp.push({ name: tas, count: 1 });
          } else {
            const index = tagsTemp.findIndex((tag) => {
              return tag.name === tas;
            });
            tagsTemp[index].count++;
          }
        });
        tagsTemp[0].count++;
      });
      tagsTemp.sort((a, b) => {
        return b.count - a.count;
      });
      home_tagsList.value = [...tagsTemp];
      return tagsTemp;
    });
    const handleTabClick = (item) => {
      console.log(item);
      home_tagActiveIndex.value = item.index;
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(handleTabClick),
        b: common_vendor.p({
          list: tabsData.value
        })
      };
    };
  }
});
wx.createComponent(_sfc_main);
