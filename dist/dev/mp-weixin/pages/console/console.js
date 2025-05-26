"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_request = require("../../utils/request.js");
const composables_aiChat = require("../../composables/aiChat.js");
const composables_console = require("../../composables/console.js");
if (!Array) {
  const _easycom_fui_icon2 = common_vendor.resolveComponent("fui-icon");
  const _easycom_fui_nav_bar2 = common_vendor.resolveComponent("fui-nav-bar");
  const _easycom_fui_button2 = common_vendor.resolveComponent("fui-button");
  const _easycom_fui_vtabs_content2 = common_vendor.resolveComponent("fui-vtabs-content");
  const _easycom_fui_vtabs2 = common_vendor.resolveComponent("fui-vtabs");
  (_easycom_fui_icon2 + _easycom_fui_nav_bar2 + _easycom_fui_button2 + _easycom_fui_vtabs_content2 + _easycom_fui_vtabs2)();
}
const _easycom_fui_icon = () => "../../components/firstui/fui-icon/fui-icon.js";
const _easycom_fui_nav_bar = () => "../../components/firstui/fui-nav-bar/fui-nav-bar.js";
const _easycom_fui_button = () => "../../components/firstui/fui-button/fui-button.js";
const _easycom_fui_vtabs_content = () => "../../components/firstui/fui-vtabs-content/fui-vtabs-content.js";
const _easycom_fui_vtabs = () => "../../components/firstui/fui-vtabs/fui-vtabs.js";
if (!Math) {
  (_easycom_fui_icon + _easycom_fui_nav_bar + TnImageUpload + _easycom_fui_button + _easycom_fui_vtabs_content + _easycom_fui_vtabs)();
}
const TnImageUpload = () => "../../node-modules/@tuniao/tnui-vue3-uniapp/components/image-upload/src/image-upload.js";
const activeTab = 0;
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "console",
  setup(__props) {
    common_vendor.onLoad(() => {
      managerInfo();
    });
    function onTabClick(e) {
      e.index;
      console.log("tabClick", e.index);
      if (e.index == 1) {
        managerInfo();
      }
    }
    const uploadFilePromise = async (file) => {
      const url = file.path;
      return new Promise(async (resolve, reject) => {
        const uploadResult = await utils_request.uploadFile(url);
        console.log("uploadResult", uploadResult);
        subPicUrl.value = uploadResult;
        if (uploadResult) {
          resolve(uploadResult);
        }
      });
    };
    common_vendor.ref();
    const subPicUrl = common_vendor.ref();
    const managerData = common_vendor.ref([]);
    const allData = common_vendor.ref();
    async function subMth() {
      const Newdata = [];
      managerData.value.forEach((item) => {
        Newdata.push({
          "src": item,
          "href": "",
          "label": ""
        });
      });
      console.log("Newdata的值是", Newdata);
      const token = common_vendor.ref();
      await composables_aiChat.getUserToken().then((res) => {
        console.log("getUserToken获取到的getUserToken信息:", res.data);
        token.value = res.data.token;
      }).catch((err) => {
        console.error("getUserToken获取getUserToken失败:", err);
        common_vendor.index.showToast({
          title: "Token失效",
          duration: 2e3
        });
        return 0;
      });
      await composables_console.SubmitSwiper(token.value, { "home_banner": Newdata }).then((res) => {
        console.log("Newdata的回调值是", { "home_banner": Newdata });
        allData.value = res.data;
        managerData.value = res.data.home_banner.map((a) => a.src);
        common_vendor.index.showToast({
          title: "提交成功",
          duration: 2e3
        });
      }).catch((err) => {
        console.error("获取getUserToken失败:", err);
      });
    }
    async function managerInfo() {
      const token = common_vendor.ref();
      await composables_aiChat.getUserToken().then((res) => {
        console.log("managerInfo获取到的getUserToken信息:", res.data);
        token.value = res.data.token;
      }).catch((err) => {
        console.error("获取getUserToken失败:", err);
      });
      await composables_console.GetAllManagerInfor(token.value).then((res) => {
        console.log("managerInfo获取到的managerInfo信息:", res.data);
        allData.value = res.data;
        managerData.value = res.data.home_banner.map((a) => a.src);
      }).catch((err) => {
        console.error("获取getUserToken失败:", err);
      });
    }
    const vtabs = [
      {
        name: "小程序轮播图管理",
        id: 0
      },
      {
        name: "开发中",
        id: 1
      }
    ];
    function leftClick() {
      common_vendor.index.redirectTo({
        url: "/pages/index/index"
      });
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          name: "arrowleft"
        }),
        b: common_vendor.o(leftClick),
        c: common_vendor.p({
          background: "transparent",
          title: _ctx.控制中心
        }),
        d: common_vendor.f(vtabs, (item, index, i0) => {
          return common_vendor.e({
            a: item.id == 0
          }, item.id == 0 ? {
            b: "94e27f4e-4-" + i0 + "," + ("94e27f4e-3-" + i0),
            c: common_vendor.o(($event) => managerData.value = $event, index),
            d: common_vendor.p({
              ["custom-upload-handler"]: uploadFilePromise,
              modelValue: managerData.value
            }),
            e: common_vendor.o(subMth, index),
            f: "94e27f4e-5-" + i0 + "," + ("94e27f4e-3-" + i0),
            g: common_vendor.p({
              width: "300",
              radius: "96rpx"
            })
          } : {}, {
            h: vtabs.length - 1 === index ? "800px" : "0",
            i: index,
            j: "94e27f4e-3-" + i0 + ",94e27f4e-2",
            k: common_vendor.p({
              tabIndex: index
            })
          });
        }),
        e: common_vendor.sr(vtabs, "94e27f4e-2", {
          "k": "vtabs"
        }),
        f: common_vendor.o(onTabClick),
        g: common_vendor.o(_ctx.onChange),
        h: common_vendor.p({
          vtabs,
          activeTab
        })
      };
    };
  }
});
wx.createPage(_sfc_main);
