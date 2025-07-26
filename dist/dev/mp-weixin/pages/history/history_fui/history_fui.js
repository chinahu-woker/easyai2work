"use strict";
const common_vendor = require("../../../common/vendor.js");
const utils_request = require("../../../utils/request.js");
const utils_common = require("../../../utils/common.js");
const composables_useCommon = require("../../../composables/useCommon.js");
if (!Array) {
  const _easycom_fui_icon2 = common_vendor.resolveComponent("fui-icon");
  const _easycom_fui_nav_bar2 = common_vendor.resolveComponent("fui-nav-bar");
  const _easycom_fui_background_image2 = common_vendor.resolveComponent("fui-background-image");
  const _easycom_fui_tabs2 = common_vendor.resolveComponent("fui-tabs");
  const _easycom_fui_sticky2 = common_vendor.resolveComponent("fui-sticky");
  const _easycom_fui_gallery2 = common_vendor.resolveComponent("fui-gallery");
  const _easycom_fui_load_ani2 = common_vendor.resolveComponent("fui-load-ani");
  const _easycom_fui_section2 = common_vendor.resolveComponent("fui-section");
  const _easycom_tn_icon2 = common_vendor.resolveComponent("tn-icon");
  const _easycom_fui_collapse_item2 = common_vendor.resolveComponent("fui-collapse-item");
  const _easycom_fui_timeaxis_node2 = common_vendor.resolveComponent("fui-timeaxis-node");
  const _easycom_fui_timeaxis2 = common_vendor.resolveComponent("fui-timeaxis");
  const _easycom_fui_waterfall_item2 = common_vendor.resolveComponent("fui-waterfall-item");
  const _easycom_fui_waterfall2 = common_vendor.resolveComponent("fui-waterfall");
  (_easycom_fui_icon2 + _easycom_fui_nav_bar2 + _easycom_fui_background_image2 + _easycom_fui_tabs2 + _easycom_fui_sticky2 + _easycom_fui_gallery2 + _easycom_fui_load_ani2 + _easycom_fui_section2 + _easycom_tn_icon2 + _easycom_fui_collapse_item2 + _easycom_fui_timeaxis_node2 + _easycom_fui_timeaxis2 + _easycom_fui_waterfall_item2 + _easycom_fui_waterfall2)();
}
const _easycom_fui_icon = () => "../../../components/firstui/fui-icon/fui-icon.js";
const _easycom_fui_nav_bar = () => "../../../components/firstui/fui-nav-bar/fui-nav-bar.js";
const _easycom_fui_background_image = () => "../../../components/firstui/fui-background-image/fui-background-image.js";
const _easycom_fui_tabs = () => "../../../components/firstui/fui-tabs/fui-tabs.js";
const _easycom_fui_sticky = () => "../../../components/firstui/fui-sticky/fui-sticky.js";
const _easycom_fui_gallery = () => "../../../components/firstui/fui-gallery/fui-gallery.js";
const _easycom_fui_load_ani = () => "../../../components/firstui/fui-load-ani/fui-load-ani.js";
const _easycom_fui_section = () => "../../../components/firstui/fui-section/fui-section.js";
const _easycom_tn_icon = () => "../../../node-modules/@tuniao/tnui-vue3-uniapp/components/icon/src/icon.js";
const _easycom_fui_collapse_item = () => "../../../components/firstui/fui-collapse-item/fui-collapse-item.js";
const _easycom_fui_timeaxis_node = () => "../../../components/firstui/fui-timeaxis-node/fui-timeaxis-node.js";
const _easycom_fui_timeaxis = () => "../../../components/firstui/fui-timeaxis/fui-timeaxis.js";
const _easycom_fui_waterfall_item = () => "../../../components/firstui/fui-waterfall-item/fui-waterfall-item.js";
const _easycom_fui_waterfall = () => "../../../components/firstui/fui-waterfall/fui-waterfall.js";
if (!Math) {
  (_easycom_fui_icon + _easycom_fui_nav_bar + _easycom_fui_background_image + _easycom_fui_tabs + _easycom_fui_sticky + _easycom_fui_gallery + _easycom_fui_load_ani + _easycom_fui_section + _easycom_tn_icon + _easycom_fui_collapse_item + _easycom_fui_timeaxis_node + _easycom_fui_timeaxis + _easycom_fui_waterfall_item + _easycom_fui_waterfall)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "history_fui",
  setup(__props) {
    common_vendor.onLoad(() => {
      if (!composables_useCommon.isLogin.value) {
        common_vendor.index.showToast({
          icon: "error",
          title: "您还没有登录",
          duration: 2e3,
          complete() {
            setTimeout(() => {
              common_vendor.index.navigateBack();
            }, 2e3);
          }
        });
      }
      getHistoryData();
    });
    const historyData = common_vendor.ref([]);
    const getHistoryData = async (pageNumber) => {
      const { items } = await utils_request.request(`/draw/history/${pageNumber}`);
      historyData.value = items;
      console.log("pageNumber", pageNumber);
      console.log("historyData", historyData.value);
    };
    const removeHistoryRecord = async (id) => {
      try {
        console.log("Attempting to remove history record with id:", id);
        const response = await utils_request.request(`/draw/history/${id}`, {
          method: "DELETE"
        });
        console.log("Response status:", response.status);
        console.log("History record removed:", id);
        historyData.value = historyData.value.filter((item) => item._id !== id);
        console.log("Updated historyData:", historyData.value);
        common_vendor.index.showToast({
          title: "删除成功",
          icon: "success",
          duration: 2e3
        });
      } catch (err) {
        console.error("Failed to remove history record:", err);
      }
    };
    common_vendor.computed(() => {
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
    common_vendor.computed(() => {
      let _imageList = [];
      historyData.value.forEach((item) => {
        if (item.output) {
          _imageList = [..._imageList, ...item.output];
        }
      });
      return _imageList;
    });
    const testData = ["https://chinahu-ai-server.oss-cn-chengdu.aliyuncs.com/aidraw/image/temps/6787db82dd3d12610cbb21bd/ComfyUI_0001.png"];
    const currentTabIndex = common_vendor.ref(0);
    const tabs = common_vendor.ref(["时间轴模式", "相册模式"]);
    function QieHuan(e) {
      console.log("-----------------------------------", e);
      currentTabIndex.value = e.index;
    }
    const show = common_vendor.ref(false);
    common_vendor.ref();
    const GalleryPic = common_vendor.ref();
    function showGallery(data) {
      show.value = true;
      GalleryPic.value = data;
      console.log(GalleryPic.value);
    }
    function hideGallery() {
      show.value = false;
    }
    function linkType(url) {
      if (typeof url !== "string")
        return 2;
      const imageExtensions = /\.(jpg|jpeg|png|gif|bmp|webp)$/i;
      const videoExtensions = /\.(mp4|avi|mov|mkv|flv|wmv)$/i;
      if (imageExtensions.test(url))
        return 0;
      if (videoExtensions.test(url))
        return 1;
      return 2;
    }
    function handleClick(StringTxt) {
      common_vendor.index.setClipboardData({
        data: StringTxt,
        // 需要设置到剪切板的内容
        showToast: true,
        // 是否显示提示，默认为true
        success: function() {
          console.log("复制成功");
        },
        fail: function(err) {
          console.error("复制失败", err);
        }
      });
    }
    async function downloadVideo(url) {
      if (!url || !url.startsWith("https://")) {
        common_vendor.index.showToast({ title: "视频地址无效", icon: "none" });
        return;
      }
      try {
        const downloadResult = await common_vendor.index.downloadFile({ url });
        if (downloadResult.statusCode !== 200) {
          console.error("下载失败，状态码:", downloadResult.statusCode);
          common_vendor.index.showToast({ title: "下载失败", icon: "none" });
          return;
        }
        try {
          await common_vendor.index.saveVideoToPhotosAlbum({
            filePath: downloadResult.tempFilePath
          });
          common_vendor.index.showToast({ title: "保存到相册成功", icon: "success" });
        } catch (saveErr) {
          console.error("保存到相册失败:", saveErr);
          if (saveErr.errMsg.includes("auth deny")) {
            common_vendor.index.showModal({
              title: "权限不足",
              content: "请允许保存视频到相册",
              success: (res) => {
                if (res.confirm) {
                  common_vendor.index.openSetting({
                    success: (settingRes) => {
                      console.log("相册权限设置:", settingRes.authSetting);
                    }
                  });
                }
              }
            });
          } else {
            common_vendor.index.showToast({ title: "保存失败", icon: "none" });
          }
        }
      } catch (downloadErr) {
        console.error("下载过程出错:", downloadErr);
        common_vendor.index.showToast({ title: "下载失败", icon: "none" });
      }
    }
    const isDeleting = common_vendor.ref(false);
    const handleDeleteTouchStart = () => {
      isDeleting.value = true;
    };
    const handleDeleteTouchEnd = () => {
      setTimeout(() => {
        isDeleting.value = false;
      }, 500);
    };
    const toHome = () => {
      common_vendor.index.navigateBack({
        delta: 1
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          name: "arrowleft",
          size: "40",
          color: "#333"
        }),
        b: common_vendor.o(toHome),
        c: common_vendor.p({
          title: " ",
          background: "transparent"
        }),
        d: common_vendor.p({
          src: "@/src/static/Home2 (1).jpgHome2(1).jpg"
        }),
        e: common_vendor.o(QieHuan),
        f: common_vendor.p({
          tabs: tabs.value
        }),
        g: currentTabIndex.value == 0
      }, currentTabIndex.value == 0 ? {
        h: common_vendor.o(hideGallery),
        i: common_vendor.p({
          urls: GalleryPic.value,
          show: show.value
        }),
        j: common_vendor.f(historyData.value, (item, index, i0) => {
          var _a, _b, _c, _d, _e;
          return common_vendor.e({
            a: item.status == 2
          }, item.status == 2 ? {
            b: "56f14cc7-8-" + i0 + "," + ("56f14cc7-7-" + i0),
            c: common_vendor.p({
              name: "clear-fill",
              size: 28,
              color: "#fff"
            })
          } : {}, {
            d: item.status == 1
          }, item.status == 1 ? {
            e: "56f14cc7-9-" + i0 + "," + ("56f14cc7-7-" + i0),
            f: common_vendor.p({
              name: "face",
              size: 28,
              color: "#fff"
            })
          } : {}, {
            g: item.status == 0
          }, item.status == 0 ? {
            h: "56f14cc7-10-" + i0 + "," + ("56f14cc7-7-" + i0),
            i: common_vendor.p({
              type: "3"
            })
          } : {}, {
            j: linkType(item.output[0]) == 0
          }, linkType(item.output[0]) == 0 ? {
            k: "56f14cc7-11-" + i0 + "," + ("56f14cc7-7-" + i0),
            l: common_vendor.p({
              title: "提示词",
              descr: (_a = item.params) == null ? void 0 : _a.positive,
              descrSize: "32",
              descrColor: "#000000"
            }),
            m: common_vendor.f(item.output, (pic, picIndex, i1) => {
              return {
                a: pic
              };
            }),
            n: common_vendor.o(($event) => showGallery(historyData.value[index].output)),
            o: common_vendor.n(isDeleting.value ? "icon-shake" : ""),
            p: "56f14cc7-12-" + i0 + "," + ("56f14cc7-7-" + i0),
            q: common_vendor.p({
              name: "delete",
              size: "36"
            }),
            r: common_vendor.o(($event) => removeHistoryRecord(item._id), index),
            s: common_vendor.o(handleDeleteTouchStart, index),
            t: common_vendor.o(handleDeleteTouchEnd, index)
          } : linkType(item.output[0]) == 1 ? {
            w: "56f14cc7-13-" + i0 + "," + ("56f14cc7-7-" + i0),
            x: common_vendor.p({
              title: "提示词",
              descr: (_b = item.params) == null ? void 0 : _b.positive,
              descrSize: "32",
              descrColor: "#000000"
            }),
            y: item.output[0],
            z: "56f14cc7-14-" + i0 + "," + ("56f14cc7-7-" + i0),
            A: common_vendor.p({
              name: "download-simple",
              size: "36"
            }),
            B: common_vendor.o(($event) => downloadVideo(item.output[0]), index),
            C: "56f14cc7-15-" + i0 + "," + ("56f14cc7-7-" + i0),
            D: common_vendor.p({
              name: "delete",
              size: "36"
            }),
            E: common_vendor.o(($event) => item.output && item.output.length > 0 && downloadVideo(item.output[0]), index)
          } : {
            F: "56f14cc7-16-" + i0 + "," + ("56f14cc7-7-" + i0),
            G: common_vendor.p({
              title: "提示词",
              descrSize: "32",
              descrColor: "#000000",
              descr: (_c = item.params) == null ? void 0 : _c.positive
            }),
            H: ((_d = item.params) == null ? void 0 : _d.image_path_mask) || ((_e = item.params) == null ? void 0 : _e.image_path_origin) || testData,
            I: "56f14cc7-18-" + i0 + "," + ("56f14cc7-17-" + i0),
            J: common_vendor.p({
              name: "delete",
              size: "36"
            }),
            K: common_vendor.o(($event) => removeHistoryRecord(item._id), index),
            L: common_vendor.o(($event) => handleClick(item.output[0]), index),
            M: common_vendor.t(item.output[0]),
            N: "56f14cc7-17-" + i0 + "," + ("56f14cc7-7-" + i0),
            O: common_vendor.p({
              background: "transparent "
            })
          }, {
            v: linkType(item.output[0]) == 1,
            P: index,
            Q: "56f14cc7-7-" + i0 + ",56f14cc7-6"
          });
        }),
        k: common_vendor.p({
          padding: ["32rpx", "16rpx"]
        })
      } : {}, {
        l: currentTabIndex.value == 1
      }, currentTabIndex.value == 1 ? {
        m: common_vendor.f(historyData.value, (item, index, i0) => {
          var _a, _b;
          return common_vendor.e({
            a: linkType(item.output[0]) == 0
          }, linkType(item.output[0]) == 0 ? {
            b: item.output[0]
          } : linkType(item.output[0]) == 1 ? {
            d: item.output[0]
          } : {
            e: ((_a = item.params) == null ? void 0 : _a.image_path_mask) || ((_b = item.params) == null ? void 0 : _b.image_path_origin) || testData
          }, {
            c: linkType(item.output[0]) == 1,
            f: index,
            g: "56f14cc7-20-" + i0 + ",56f14cc7-19"
          });
        })
      } : {});
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-56f14cc7"]]);
wx.createPage(MiniProgramPage);
