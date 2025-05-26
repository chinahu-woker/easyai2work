"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_request = require("../../utils/request.js");
const utils_common = require("../../utils/common.js");
if (!Array) {
  const _easycom_up_status_bar2 = common_vendor.resolveComponent("up-status-bar");
  _easycom_up_status_bar2();
}
const _easycom_up_status_bar = () => "../../node-modules/uview-plus/components/u-status-bar/u-status-bar.js";
if (!Math) {
  (_easycom_up_status_bar + TnTag + TnPhotoAlbum + TnTimeLineData + TnTimeLineItem + TnTimeLine + TnLazyLoad + TnSwitchTab + BaseLayout)();
}
const TnTimeLine = () => "../../node-modules/tnuiv3p-tn-time-line/time-line.js";
const TnTimeLineItem = () => "../../node-modules/tnuiv3p-tn-time-line/time-line-item.js";
const TnTimeLineData = () => "../../node-modules/tnuiv3p-tn-time-line/time-line-data.js";
const TnPhotoAlbum = () => "../../node-modules/@tuniao/tnui-vue3-uniapp/components/photo-album/src/photo-album.js";
const TnSwitchTab = () => "../../node-modules/@tuniao/tnui-vue3-uniapp/components/switch-tab/src/switch-tab.js";
const TnLazyLoad = () => "../../node-modules/@tuniao/tnui-vue3-uniapp/components/lazy-load/src/lazy-load.js";
const BaseLayout = () => "../../layouts/BaseLayout.js";
const TnTag = () => "../../node-modules/@tuniao/tnui-vue3-uniapp/components/tag/src/tag.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "history",
  setup(__props) {
    common_vendor.onLoad(() => {
      getHistoryData();
    });
    const historyData = common_vendor.ref([]);
    const getHistoryData = async (pageNumber) => {
      const { items } = await utils_request.request(`/draw/history/${pageNumber}`);
      historyData.value = items;
      console.log("historyData", historyData.value);
    };
    const timeLineDataComptRef = common_vendor.computed(() => {
      const tempTimeLineData = [];
      historyData.value.forEach((item) => {
        const date = utils_common.formatDateTime(new Date(item.created_at), "YYYY-MM-DD");
        const data = tempTimeLineData.find((i) => i.day === date);
        if (data) {
          data.data = [...data.data, item];
        } else {
          tempTimeLineData.push({
            day: date,
            icon: "creative",
            data: [item]
          });
        }
      });
      console.log("tempTimeLineData:", tempTimeLineData);
      return tempTimeLineData.sort((a, b) => {
        return new Date(b.day).getTime() - new Date(a.day).getTime();
      });
    });
    const PhotoAlbumImages = common_vendor.computed(() => {
      let _imageList = [];
      historyData.value.forEach((item) => {
        if (item.output) {
          _imageList = [..._imageList, ...item.output];
        }
      });
      return _imageList;
    });
    const currentTabIndex = common_vendor.ref(0);
    const tabs = common_vendor.ref(["时间轴模式", "相册模式"]);
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: currentTabIndex.value === 0
      }, currentTabIndex.value === 0 ? {
        b: common_vendor.f(timeLineDataComptRef.value, (item, index, i0) => {
          return {
            a: common_vendor.f(item.data, (dataItem, dataIndex, i1) => {
              var _a;
              return common_vendor.e({
                a: dataItem.status === 1
              }, dataItem.status === 1 ? {
                b: "73685b36-7-" + i0 + "-" + i1 + "," + ("73685b36-6-" + i0 + "-" + i1),
                c: common_vendor.p({
                  type: "success",
                  shape: "circle"
                })
              } : dataItem.status === 2 || +dataItem.created_at < Date.now() - 3600 * 24 * 1e3 ? {
                e: "73685b36-8-" + i0 + "-" + i1 + "," + ("73685b36-6-" + i0 + "-" + i1),
                f: common_vendor.p({
                  type: "danger",
                  shape: "circle"
                })
              } : dataItem.status === 0 ? {
                h: "73685b36-9-" + i0 + "-" + i1 + "," + ("73685b36-6-" + i0 + "-" + i1),
                i: common_vendor.p({
                  type: "success",
                  shape: "circle"
                })
              } : dataItem.status === 3 ? {
                k: "73685b36-10-" + i0 + "-" + i1 + "," + ("73685b36-6-" + i0 + "-" + i1),
                l: common_vendor.p({
                  type: "warning",
                  shape: "circle"
                })
              } : {}, {
                d: dataItem.status === 2 || +dataItem.created_at < Date.now() - 3600 * 24 * 1e3,
                g: dataItem.status === 0,
                j: dataItem.status === 3,
                m: (dataItem == null ? void 0 : dataItem.output) && dataItem.output.length > 0
              }, (dataItem == null ? void 0 : dataItem.output) && dataItem.output.length > 0 ? {
                n: "73685b36-11-" + i0 + "-" + i1 + "," + ("73685b36-6-" + i0 + "-" + i1),
                o: common_vendor.p({
                  data: dataItem.output,
                  column: dataItem.output.length > 4 ? 4 : dataItem.output.length
                })
              } : {}, {
                p: common_vendor.t((_a = dataItem.params) == null ? void 0 : _a.positive),
                q: dataIndex,
                r: "73685b36-6-" + i0 + "-" + i1 + "," + ("73685b36-5-" + i0)
              });
            }),
            b: index,
            c: "73685b36-5-" + i0 + ",73685b36-4",
            d: common_vendor.p({
              title: item.day,
              ["title-icon"]: item.icon !== void 0 ? item.icon : ""
            })
          };
        })
      } : {}, {
        c: currentTabIndex.value === 1
      }, currentTabIndex.value === 1 ? {
        d: common_vendor.f(PhotoAlbumImages.value, (item, k0, i0) => {
          return {
            a: "73685b36-12-" + i0 + ",73685b36-3",
            b: common_vendor.p({
              width: "100%",
              height: "300",
              src: item
            })
          };
        })
      } : {}, {
        e: common_vendor.o(($event) => currentTabIndex.value = $event),
        f: common_vendor.p({
          tabs: tabs.value,
          modelValue: currentTabIndex.value
        })
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-73685b36"]]);
wx.createPage(MiniProgramPage);
