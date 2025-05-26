"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_request = require("../../utils/request.js");
if (!Array) {
  const _easycom_fui_icon2 = common_vendor.resolveComponent("fui-icon");
  const _easycom_fui_col2 = common_vendor.resolveComponent("fui-col");
  const _easycom_fui_progress2 = common_vendor.resolveComponent("fui-progress");
  const _easycom_fui_row2 = common_vendor.resolveComponent("fui-row");
  (_easycom_fui_icon2 + _easycom_fui_col2 + _easycom_fui_progress2 + _easycom_fui_row2)();
}
const _easycom_fui_icon = () => "../firstui/fui-icon/fui-icon.js";
const _easycom_fui_col = () => "../firstui/fui-col/fui-col.js";
const _easycom_fui_progress = () => "../firstui/fui-progress/fui-progress.js";
const _easycom_fui_row = () => "../firstui/fui-row/fui-row.js";
if (!Math) {
  (MyTitle + _easycom_fui_icon + _easycom_fui_col + _easycom_fui_progress + _easycom_fui_row + ParamCard)();
}
const MyTitle = () => "../common/MyTitle.js";
const ParamCard = () => "../common/ParamCard.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "AudioUpload",
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
    const audioList = common_vendor.ref([]);
    const audioSrc = common_vendor.ref("");
    const audioName = common_vendor.ref("默认音频");
    let innerAudioContext = null;
    const currentTime = common_vendor.ref(0);
    const duration = common_vendor.ref(0);
    const progress = common_vendor.ref(0);
    common_vendor.onReady(() => {
      audioList.value = modelValue.value ? [modelValue.value] : [];
    });
    common_vendor.watch(audioList, () => {
      console.log("audioList", audioList.value[0]);
      modelValue.value = audioList.value[0];
      if (audioList.value[0]) {
        audioSrc.value = audioList.value[0];
        audioName.value = audioList.value[0].split("/").pop() || "默认音频";
        initInnerAudioContext();
      }
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
    const initInnerAudioContext = () => {
      if (innerAudioContext) {
        innerAudioContext.destroy();
      }
      innerAudioContext = common_vendor.index.createInnerAudioContext();
      innerAudioContext.autoplay = false;
      innerAudioContext.src = audioSrc.value;
      innerAudioContext.onPlay(() => {
        console.log("开始播放");
      });
      innerAudioContext.onError((res) => {
        console.log(res.errMsg);
        console.log(res.errCode);
      });
      innerAudioContext.onTimeUpdate(() => {
        currentTime.value = (innerAudioContext == null ? void 0 : innerAudioContext.currentTime) || 0;
        duration.value = (innerAudioContext == null ? void 0 : innerAudioContext.duration) || 0;
        progress.value = duration.value > 0 ? currentTime.value / duration.value * 100 : 0;
      });
    };
    const chooseAudioFile = () => {
      common_vendor.wx$1.chooseMessageFile({
        count: 1,
        type: "file",
        extension: ["mp3", "wav"],
        // 指定音频文件类型
        success(res) {
          const audioFile = res.tempFiles[0];
          uploadAudioFile(audioFile);
        },
        fail(err) {
          console.error("选择文件失败", err);
        }
      });
    };
    const uploadAudioFile = async (file) => {
      try {
        const uploadResult = await uploadFilePromise(file);
        if (uploadResult) {
          audioSrc.value = uploadResult;
          audioName.value = file.name;
          audioList.value = [uploadResult];
          console.log("上传成功", uploadResult);
        }
      } catch (error) {
        console.error("上传失败", error);
      }
    };
    const buttonShow = common_vendor.ref(false);
    const playAudio = () => {
      if (innerAudioContext) {
        innerAudioContext.stop();
        innerAudioContext.play();
      }
      buttonShow.value = true;
    };
    const pauseAudio = () => {
      if (innerAudioContext) {
        innerAudioContext.pause();
        console.log("暂停播放");
        buttonShow.value = false;
      }
    };
    common_vendor.onUnmounted(() => {
      if (innerAudioContext) {
        innerAudioContext.destroy();
      }
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          title: _ctx.title
        }),
        b: common_vendor.o(playAudio),
        c: !buttonShow.value,
        d: common_vendor.p({
          name: "suspend"
        }),
        e: common_vendor.o(pauseAudio),
        f: buttonShow.value,
        g: common_vendor.p({
          name: "play"
        }),
        h: common_vendor.p({
          span: 3
        }),
        i: common_vendor.t(audioName.value || _ctx.无),
        j: common_vendor.p({
          percent: progress.value.toFixed(0) || 0
        }),
        k: common_vendor.p({
          span: 21
        }),
        l: common_vendor.p({
          ["margin-bottom"]: "24rpx"
        }),
        m: common_vendor.o(chooseAudioFile),
        n: common_vendor.p({
          name: "pullup"
        }),
        o: common_vendor.p({
          span: 24
        }),
        p: common_vendor.p({
          ["margin-bottom"]: "24rpx"
        })
      };
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-b4cf6b1f"]]);
wx.createComponent(Component);
