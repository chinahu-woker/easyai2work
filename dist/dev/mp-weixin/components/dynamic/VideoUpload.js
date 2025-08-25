"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_request = require("../../utils/request.js");
if (!Math) {
  (MyTitle + ParamCard)();
}
const MyTitle = () => "../common/MyTitle.js";
const ParamCard = () => "../common/ParamCard.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "VideoUpload",
  props: /* @__PURE__ */ common_vendor.mergeModels({
    title: { default: "视频上传" },
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
    const videoList = common_vendor.ref([]);
    const videoSrc = common_vendor.ref("");
    const videoName = common_vendor.ref("");
    common_vendor.watch(videoList, () => {
      modelValue.value = videoList.value[0] || "";
      if (videoList.value[0]) {
        videoSrc.value = videoList.value[0];
        videoName.value = videoList.value[0].split("/").pop() || "默认视频";
      }
    });
    const uploadFilePromise = async (filePath) => {
      return new Promise(async (resolve, reject) => {
        try {
          const uploadResult = await utils_request.uploadFile(filePath);
          common_vendor.index.__f__("log", "at components/dynamic/VideoUpload.vue:44", "uploadResult", uploadResult);
          if (uploadResult) {
            resolve(uploadResult);
          } else {
            reject(new Error("上传失败"));
          }
        } catch (error) {
          common_vendor.index.__f__("error", "at components/dynamic/VideoUpload.vue:51", "上传错误", error);
          reject(error);
        }
      });
    };
    const chooseVideoFile = () => {
      common_vendor.index.chooseVideo({
        sourceType: ["album", "camera"],
        // 可以指定来源是相册还是相机
        compressed: true,
        // 是否压缩所选的视频源文件
        maxDuration: 60,
        // 拍摄视频最长拍摄时间，单位秒
        success: async (res) => {
          common_vendor.index.__f__("log", "at components/dynamic/VideoUpload.vue:64", "选择视频成功", res);
          try {
            common_vendor.index.showLoading({ title: "上传中..." });
            const uploadResult = await uploadFilePromise(res.tempFilePath);
            videoList.value = [uploadResult];
            common_vendor.index.hideLoading();
            common_vendor.index.showToast({ title: "上传成功", icon: "success" });
          } catch (error) {
            common_vendor.index.hideLoading();
            common_vendor.index.showToast({ title: "上传失败", icon: "none" });
            common_vendor.index.__f__("error", "at components/dynamic/VideoUpload.vue:80", "上传失败", error);
          }
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at components/dynamic/VideoUpload.vue:84", "选择视频失败", err);
          common_vendor.index.showToast({ title: "选择视频失败", icon: "none" });
        }
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          title: _ctx.title
        }),
        b: videoSrc.value
      }, videoSrc.value ? {
        c: videoSrc.value,
        d: common_vendor.t(videoName.value)
      } : {
        e: common_vendor.o(chooseVideoFile)
      }, {
        f: common_vendor.t(videoSrc.value ? "重新选择" : "选择视频"),
        g: common_vendor.o(chooseVideoFile)
      });
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-6c0e634b"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/dynamic/VideoUpload.js.map
