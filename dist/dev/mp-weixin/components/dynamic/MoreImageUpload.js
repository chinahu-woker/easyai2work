"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_request = require("../../utils/request.js");
if (!Array) {
  const _easycom_fui_backdrop2 = common_vendor.resolveComponent("fui-backdrop");
  _easycom_fui_backdrop2();
}
const _easycom_fui_backdrop = () => "../firstui/fui-backdrop/fui-backdrop.js";
if (!Math) {
  (MyTitle + chjImgEdit + _easycom_fui_backdrop)();
}
const chjImgEdit = () => "../chj-imgEdit/chj-imgEdit.js";
const MyTitle = () => "../common/MyTitle.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "MoreImageUpload",
  props: {
    title: { default: " " },
    workflow_id: {},
    options: {}
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const show = common_vendor.ref(false);
    const imagePath = common_vendor.ref("");
    const chjImgEditRef = common_vendor.ref(null);
    const isComponentReady = common_vendor.ref(false);
    common_vendor.ref("/static/placeholder.png");
    common_vendor.watch(
      () => chjImgEditRef.value,
      (newVal) => {
        if (newVal) {
          isComponentReady.value = true;
          common_vendor.index.__f__("log", "at components/dynamic/MoreImageUpload.vue:79", "chj-imgEdit组件已挂载");
        }
      }
    );
    const onClick = async () => {
      try {
        const res = await common_vendor.index.chooseImage({
          count: 1,
          sizeType: ["original", "compressed"],
          sourceType: ["album", "camera"]
        });
        if (res.tempFilePaths && res.tempFilePaths.length > 0) {
          imagePath.value = res.tempFilePaths[0];
          show.value = true;
          await waitForComponentReady();
          if (chjImgEditRef.value && typeof chjImgEditRef.value.open === "function") {
            chjImgEditRef.value.open({
              path: res.tempFilePaths[0],
              isCancelToast: true,
              cancelText: "确定真的退出吗?",
              isConfirmToast: true,
              confirmText: "决定好了吗?",
              iconPath: {
                goForward_active: "/static/goForward.png",
                goForward_inactive: "/static/goForward_inactive.png",
                retreat_active: "/static/retreat.png",
                retreat_inactive: "/static/retreat_inactive.png",
                reset: "/static/reset.png",
                close: "/static/close.png",
                confirm: "/static/determine.png",
                pen: "/static/graffiti.png",
                rubber: "/static/rubber.png"
              },
              iconPathGraffiti: {
                0: "/static/iconPathGraffiti-1.png",
                1: "/static/iconPathGraffiti-2.png",
                2: "/static/iconPathGraffiti-3.png"
              }
            });
          } else {
            common_vendor.index.__f__("error", "at components/dynamic/MoreImageUpload.vue:123", "chj-imgEdit组件异常");
            show.value = false;
          }
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at components/dynamic/MoreImageUpload.vue:128", "选择图片失败:", error);
      }
    };
    const zehzhao = () => {
      common_vendor.index.__f__("log", "at components/dynamic/MoreImageUpload.vue:134", "用户点击了遮罩");
    };
    const waitForComponentReady = async () => {
      const maxRetries = 10;
      const delay = 100;
      let retries = 0;
      while (retries < maxRetries && (!isComponentReady.value || !chjImgEditRef.value)) {
        await common_vendor.nextTick$1();
        await new Promise((resolve) => setTimeout(resolve, delay));
        retries++;
      }
      if (retries >= maxRetries) {
        common_vendor.index.__f__("warn", "at components/dynamic/MoreImageUpload.vue:150", "等待组件超时");
      }
    };
    const imageList_mask = common_vendor.ref([]);
    const confirm = async (emtData) => {
      common_vendor.index.__f__("log", "at components/dynamic/MoreImageUpload.vue:167", "编辑确认，路径:", emtData.Sync);
      try {
        const params = {
          advance_onlineEdit_origin: " ",
          advance_onlineEdit_mask: ""
        };
        const imagePaths = Array.isArray(emtData.paths) ? emtData.paths : [emtData.paths];
        common_vendor.index.__f__("log", "at components/dynamic/MoreImageUpload.vue:179", "imagePaths:", imagePaths);
        const uploadPromises = imagePaths.map(
          (path) => utils_request.uploadFile(path, {
            formData: params
          }, "/file/upload")
        );
        const uploadResults = await Promise.all(uploadPromises);
        imageList_mask.value = [emtData.Sync];
        emit("update:modelValue", uploadResults);
        common_vendor.index.__f__("log", "at components/dynamic/MoreImageUpload.vue:195", "所有图片上传成功:", uploadResults);
      } catch (error) {
        common_vendor.index.__f__("error", "at components/dynamic/MoreImageUpload.vue:197", "图片上传失败:", error);
        common_vendor.index.showToast({ title: "上传失败", icon: "error" });
      }
      show.value = false;
    };
    const cancel = () => {
      common_vendor.index.__f__("log", "at components/dynamic/MoreImageUpload.vue:206", "编辑取消");
      show.value = false;
    };
    const getLineLength = (length) => {
      common_vendor.index.__f__("log", "at components/dynamic/MoreImageUpload.vue:212", "线条长度:", length + "px");
    };
    const getRectPosition = (obj) => {
      common_vendor.index.__f__("log", "at components/dynamic/MoreImageUpload.vue:217", "矩形位置:", obj);
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          title: _ctx.title
        }),
        b: !imageList_mask.value || imageList_mask.value.length === 0
      }, !imageList_mask.value || imageList_mask.value.length === 0 ? {} : {
        c: common_vendor.f(imageList_mask.value, (image, index, i0) => {
          return {
            a: image,
            b: index
          };
        })
      }, {
        d: common_vendor.sr(chjImgEditRef, "96383370-2,96383370-1", {
          "k": "chjImgEditRef"
        }),
        e: common_vendor.o(getLineLength),
        f: common_vendor.o(getRectPosition),
        g: common_vendor.o(confirm),
        h: common_vendor.o(cancel),
        i: common_vendor.p({
          isAllCanvas: false,
          ["image-path"]: imagePath.value
        }),
        j: common_vendor.o(zehzhao),
        k: common_vendor.p({
          show: show.value,
          closable: true
        }),
        l: show.value,
        m: common_vendor.o(onClick),
        n: common_vendor.gei(_ctx, "")
      });
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-96383370"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/dynamic/MoreImageUpload.js.map
