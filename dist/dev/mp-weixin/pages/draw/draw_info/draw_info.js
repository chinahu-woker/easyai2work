"use strict";
const common_vendor = require("../../../common/vendor.js");
const composables_useCommon = require("../../../composables/useCommon.js");
const composables_useWorkFlow = require("../../../composables/useWorkFlow.js");
const stores_appStore = require("../../../stores/appStore.js");
if (!Array) {
  const _easycom_fui_icon2 = common_vendor.resolveComponent("fui-icon");
  const _easycom_fui_nav_bar2 = common_vendor.resolveComponent("fui-nav-bar");
  const _easycom_fui_background_image2 = common_vendor.resolveComponent("fui-background-image");
  const _easycom_fui_section2 = common_vendor.resolveComponent("fui-section");
  const _easycom_fui_button2 = common_vendor.resolveComponent("fui-button");
  (_easycom_fui_icon2 + _easycom_fui_nav_bar2 + _easycom_fui_background_image2 + _easycom_fui_section2 + _easycom_fui_button2)();
}
const _easycom_fui_icon = () => "../../../components/firstui/fui-icon/fui-icon.js";
const _easycom_fui_nav_bar = () => "../../../components/firstui/fui-nav-bar/fui-nav-bar.js";
const _easycom_fui_background_image = () => "../../../components/firstui/fui-background-image/fui-background-image.js";
const _easycom_fui_section = () => "../../../components/firstui/fui-section/fui-section.js";
const _easycom_fui_button = () => "../../../components/firstui/fui-button/fui-button.js";
if (!Math) {
  (_easycom_fui_icon + _easycom_fui_nav_bar + _easycom_fui_background_image + _easycom_fui_section + _easycom_fui_button)();
}
const backGroundImage = "https://chinahu-ai-server.oss-cn-chengdu.aliyuncs.com/aidraw/image/temps/67873d6c232a3c5d52240dd6/Home2.jpg";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "draw_info",
  setup(__props) {
    const {
      workflow,
      handleGetWorkFlwById,
      workFlowParamLists,
      bindParam,
      params_component_list,
      socketInit,
      handleFindComponentName,
      handleSubmitTaskTask
    } = composables_useWorkFlow.useWorkFlow();
    common_vendor.index.__f__("log", "at pages/draw/draw_info/draw_info.vue:68", "-------------useWorkFlow()----------------", composables_useWorkFlow.useWorkFlow());
    const workflowId = common_vendor.ref("");
    common_vendor.onLoad(async () => {
      const currentPage = getCurrentPages().pop();
      const query = currentPage == null ? void 0 : currentPage.options;
      workflowId.value = query.id;
      handleGetWorkFlwById(query.id).then(() => common_vendor.index.__f__("log", "at pages/draw/draw_info/draw_info.vue:78", "///////////////////", workflow.value));
      socketInit();
    });
    function to_apps(item_id) {
      if (!composables_useCommon.isLogin.value) {
        common_vendor.index.__f__("log", "at pages/draw/draw_info/draw_info.vue:83", "-------------isLogin-----------", composables_useCommon.isLogin);
        common_vendor.index.showToast(
          {
            icon: "error",
            title: "您还没有登录",
            duration: 2e3,
            complete() {
              setTimeout(() => {
                common_vendor.index.navigateBack();
              }, 2e3);
            }
          }
        );
      } else {
        common_vendor.index.__f__("log", "at pages/draw/draw_info/draw_info.vue:99", "我点击啦~~~~~~~~", item_id);
        common_vendor.index.navigateTo({ url: "/pages/draw/apps/apps?id=" + item_id });
      }
    }
    common_vendor.ref(false);
    const { localTasks } = common_vendor.storeToRefs(stores_appStore.useAppStore());
    common_vendor.computed(() => {
      const excuTask = localTasks.value.find((item) => item.status === 4);
      if (!excuTask) {
        return "空闲";
      }
      return excuTask.progress + "%";
    });
    common_vendor.ref({ x: 0, y: 0 });
    common_vendor.ref([]);
    common_vendor.ref([]);
    function leftClick() {
      common_vendor.index.redirectTo({ url: "/pages/index/index" });
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
    return (_ctx, _cache) => {
      var _a, _b, _c;
      return common_vendor.e({
        a: common_vendor.p({
          name: "arrowleft"
        }),
        b: common_vendor.o(leftClick),
        c: common_vendor.p({
          background: "transparent",
          title: (_a = common_vendor.unref(workflow)) == null ? void 0 : _a.title
        }),
        d: common_vendor.p({
          src: backGroundImage
        }),
        e: linkType((_b = common_vendor.unref(workflow)) == null ? void 0 : _b.cover) == 0
      }, linkType((_c = common_vendor.unref(workflow)) == null ? void 0 : _c.cover) == 0 ? {
        f: common_vendor.o(
          //@ts-ignore
          (...args) => _ctx.showGallery && _ctx.showGallery(...args)
        ),
        g: _ctx.scaleToFill,
        h: common_vendor.unref(workflow).cover
      } : {}, {
        i: linkType(common_vendor.unref(workflow).cover) == 1
      }, linkType(common_vendor.unref(workflow).cover) == 1 ? {
        j: common_vendor.unref(workflow).cover
      } : {}, {
        k: common_vendor.p({
          title: common_vendor.unref(workflow).title,
          descr: common_vendor.unref(workflow).description,
          descrColor: "#000000"
        }),
        l: common_vendor.t(common_vendor.unref(workflow).power || 0),
        m: common_vendor.o(($event) => to_apps(common_vendor.unref(workflow)._id)),
        n: common_vendor.p({
          width: "300",
          radius: "96rpx"
        }),
        o: common_vendor.gei(_ctx, "")
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1bef2961"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/draw/draw_info/draw_info.js.map
