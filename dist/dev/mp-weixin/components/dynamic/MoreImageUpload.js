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
  props: /* @__PURE__ */ common_vendor.mergeModels({
    title: { default: "遮罩绘制" },
    workflow_id: {},
    options: {}
  }, {
    "modelValue": {
      default: () => ({
        "advance_onlineEdit_origin": "",
        "advance_onlineEdit_mask": ""
      })
    },
    "modelModifiers": {}
  }),
  emits: /* @__PURE__ */ common_vendor.mergeModels(["update:modelValue"], ["update:modelValue"]),
  setup(__props, { emit: __emit }) {
    const show = common_vendor.ref(false);
    const imagePath = common_vendor.ref("");
    const chjImgEditRef = common_vendor.ref(null);
    const isComponentReady = common_vendor.ref(false);
    common_vendor.ref("/static/placeholder.png");
    const modelValue = common_vendor.useModel(__props, "modelValue");
    common_vendor.onMounted(() => {
      if (modelValue.value["advance_onlineEdit_mask"]) {
        imageList_mask.value = [modelValue.value["advance_onlineEdit_mask"], modelValue.value["advance_onlineEdit_origin"]];
      }
    });
    common_vendor.watch(modelValue, (newVal) => {
      if (newVal["advance_onlineEdit_mask"]) {
        imageList_mask.value = [newVal["advance_onlineEdit_mask"], newVal["advance_onlineEdit_origin"]];
      }
    }, { deep: true });
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
            common_vendor.index.__f__("error", "at components/dynamic/MoreImageUpload.vue:132", "chj-imgEdit组件异常");
            show.value = false;
          }
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at components/dynamic/MoreImageUpload.vue:137", "选择图片失败:", error);
      }
    };
    const zehzhao = () => {
      common_vendor.index.__f__("log", "at components/dynamic/MoreImageUpload.vue:143", "用户点击了遮罩");
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
        common_vendor.index.__f__("warn", "at components/dynamic/MoreImageUpload.vue:159", "等待组件超时");
      }
    };
    const imageList_mask = common_vendor.ref([]);
    const confirm = async (emtData) => {
      common_vendor.index.__f__("log", "at components/dynamic/MoreImageUpload.vue:194", "编辑确认，返回数据:", emtData);
      try {
        const { originPath, maskPath } = emtData;
        if (!originPath || !maskPath) {
          throw new Error("缺少原图或遮罩图路径");
        }
        const [originResult, maskResult] = await Promise.all([
          utils_request.uploadFile(originPath),
          utils_request.uploadFile(maskPath)
        ]);
        const uploadResults = await Promise.all([originResult, maskResult]);
        common_vendor.index.__f__("log", "at components/dynamic/MoreImageUpload.vue:209", "uploadResults", uploadResults);
        const result = {
          // 替换为工作流中定义的参数name（示例：originUrl和maskUrl）
          "advance_onlineEdit_origin": originResult,
          "advance_onlineEdit_mask": maskResult
        };
        modelValue.value = result;
        common_vendor.index.__f__("log", "at components/dynamic/MoreImageUpload.vue:221", "上传成功，结果:", result);
        common_vendor.index.showToast({ title: "上传成功", icon: "success" });
      } catch (error) {
        common_vendor.index.__f__("error", "at components/dynamic/MoreImageUpload.vue:224", "图片上传失败:", error);
        common_vendor.index.showToast({ title: "上传失败: " + error.message, icon: "error" });
      }
      show.value = false;
    };
    const cancel = () => {
      common_vendor.index.__f__("log", "at components/dynamic/MoreImageUpload.vue:231", "编辑取消");
      show.value = false;
    };
    const getLineLength = (length) => {
      common_vendor.index.__f__("log", "at components/dynamic/MoreImageUpload.vue:237", "线条长度:", length + "px");
    };
    const getRectPosition = (obj) => {
      common_vendor.index.__f__("log", "at components/dynamic/MoreImageUpload.vue:242", "矩形位置:", obj);
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
        d: show.value
      }, show.value ? {
        e: common_vendor.sr(chjImgEditRef, "96383370-2,96383370-1", {
          "k": "chjImgEditRef"
        }),
        f: imagePath.value,
        g: common_vendor.o(getLineLength),
        h: common_vendor.o(getRectPosition),
        i: common_vendor.o(confirm),
        j: common_vendor.o(cancel),
        k: common_vendor.p({
          isAllCanvas: false,
          ["image-path"]: imagePath.value
        }),
        l: common_vendor.o(zehzhao),
        m: common_vendor.p({
          show: show.value,
          closable: true
        })
      } : {}, {
        n: common_vendor.o(onClick),
        o: common_vendor.gei(_ctx, "")
      });
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-96383370"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/dynamic/MoreImageUpload.js.map
