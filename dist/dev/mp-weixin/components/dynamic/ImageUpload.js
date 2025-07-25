"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_request = require("../../utils/request.js");
if (!Math) {
  (MyTitle + TnImageUpload + ParamCard)();
}
const TnImageUpload = () => "../node-modules/@tuniao/tnui-vue3-uniapp/components/image-upload/src/image-upload.js";
const MyTitle = () => "../common/MyTitle.js";
const ParamCard = () => "../common/ParamCard.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "ImageUpload",
  props: /* @__PURE__ */ common_vendor.mergeModels({
    title: { default: "上传" },
    options: {}
  }, {
    "modelValue": {
      default: ""
    },
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props) {
    const modelValue = common_vendor.useModel(__props, "modelValue");
    const imageList = common_vendor.ref([]);
    common_vendor.onReady(() => {
      imageList.value = modelValue.value ? [modelValue.value] : [];
    });
    common_vendor.watch(imageList, () => {
      console.log("imageList", imageList);
      for (const item of imageList.value) {
        modelValue.value = item;
      }
      modelValue.value = imageList.value[0];
    });
    const uploadFilePromise = async (file) => {
      const url = file.path;
      return new Promise(async (resolve, reject) => {
        const uploadResult = await utils_request.uploadFile(url);
        console.log("uploadResult", uploadResult);
        if (uploadResult) {
          resolve(uploadResult);
        }
      });
    };
    const imageUploadRef = common_vendor.ref();
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          title: _ctx.title
        }),
        b: common_vendor.sr(imageUploadRef, "6b5cdc15-2,6b5cdc15-0", {
          "k": "imageUploadRef"
        }),
        c: common_vendor.o(($event) => imageList.value = $event),
        d: common_vendor.p({
          limit: 1,
          ["custom-upload-handler"]: uploadFilePromise,
          modelValue: imageList.value
        }),
        e: common_vendor.gei(_ctx, "")
      };
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-6b5cdc15"]]);
wx.createComponent(Component);
