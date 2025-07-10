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
  __name: "MoreImageUpload",
  props: /* @__PURE__ */ common_vendor.mergeModels({
    title: { default: "上传" },
    options: {}
  }, {
    "modelValue": {
      default: () => []
    },
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props) {
    const modelValue = common_vendor.useModel(__props, "modelValue");
    const imageList = common_vendor.ref([]);
    const isMaskModalVisible = common_vendor.ref(false);
    const currentImage = common_vendor.ref(null);
    const canvasWidth = common_vendor.ref(0);
    const canvasHeight = common_vendor.ref(0);
    const ctx = common_vendor.ref(null);
    const drawMode = common_vendor.ref("brush");
    const brushWidth = common_vendor.ref(10);
    const drawList = common_vendor.ref([]);
    const tempDraw = common_vendor.ref(null);
    const maskComplete = common_vendor.ref(null);
    common_vendor.onReady(() => {
      setTimeout(() => {
        initScrollList();
      }, 100);
    });
    common_vendor.watch(imageList, (newVal) => {
      common_vendor.index.__f__("log", "at components/dynamic/MoreImageUpload.vue:63", "imageList 更新:", newVal);
      modelValue.value = [...newVal];
    }, { deep: true });
    const uploadFilePromise = async (file) => {
      const url = file.path;
      return new Promise(async (resolve, reject2) => {
        try {
          currentImage.value = file;
          isMaskModalVisible.value = true;
          await new Promise((innerResolve) => {
            maskComplete.value = (completedFile) => {
              innerResolve(completedFile);
            };
          });
          const uploadResult = await utils_request.uploadFile(file.maskedUrl || url);
          common_vendor.index.__f__("log", "at components/dynamic/MoreImageUpload.vue:85", "uploadResult", uploadResult);
          if (uploadResult) {
            resolve(uploadResult);
          } else {
            reject2(new Error("上传失败"));
          }
        } catch (error) {
          common_vendor.index.__f__("error", "at components/dynamic/MoreImageUpload.vue:94", "上传错误", error);
          reject2(error);
        }
      });
    };
    const imageUploadRef = common_vendor.ref();
    const initCanvas = () => {
      if (!currentImage.value)
        return;
      const query = common_vendor.index.createSelectorQuery();
      query.select("#maskCanvas").fields({ node: true, size: true }).exec((res) => {
        if (!res[0])
          return;
        const canvas = res[0].node;
        ctx.value = canvas.getContext("2d");
        canvasWidth.value = res[0].width;
        canvasHeight.value = res[0].height;
        const img = new Image();
        img.src = currentImage.value.path;
        img.onload = () => {
          var _a;
          clearCanvas();
          (_a = ctx.value) == null ? void 0 : _a.drawImage(img, 0, 0, canvasWidth.value, canvasHeight.value);
          redrawCanvas();
        };
      });
    };
    const clearCanvas = () => {
      if (ctx.value) {
        ctx.value.clearRect(0, 0, canvasWidth.value, canvasHeight.value);
      }
    };
    const redrawCanvas = () => {
      var _a;
      if (!ctx.value)
        return;
      const img = new Image();
      img.src = ((_a = currentImage.value) == null ? void 0 : _a.path) || "";
      img.onload = () => {
        var _a2;
        (_a2 = ctx.value) == null ? void 0 : _a2.drawImage(img, 0, 0, canvasWidth.value, canvasHeight.value);
        drawList.value.forEach((item) => {
          if (item.type === "brush") {
            drawBrushPath(item.points);
          } else if (item.type === "box") {
            drawBox(item);
          }
        });
        if (tempDraw.value) {
          if (tempDraw.value.type === "brush") {
            drawBrushPath(tempDraw.value.points);
          } else if (tempDraw.value.type === "box") {
            drawBox(tempDraw.value);
          }
        }
      };
    };
    const drawBrushPath = (points) => {
      if (!ctx.value || points.length < 2)
        return;
      ctx.value.beginPath();
      ctx.value.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.value.lineTo(points[i].x, points[i].y);
      }
      ctx.value.lineWidth = brushWidth.value;
      ctx.value.strokeStyle = "rgba(0, 0, 0, 0.7)";
      ctx.value.stroke();
    };
    const drawBox = (box) => {
      if (!ctx.value)
        return;
      const width = box.x2 - box.x1;
      const height = box.y2 - box.y1;
      ctx.value.fillStyle = "rgba(0, 0, 0, 0.7)";
      ctx.value.fillRect(box.x1, box.y1, width, height);
    };
    let isDrawing = false;
    let startX = 0;
    let startY = 0;
    const handleTouchStart = (e) => {
      if (!ctx.value || !currentImage.value)
        return;
      isDrawing = true;
      const touch = e.touches[0];
      startX = touch.x;
      startY = touch.y;
      if (drawMode.value === "brush") {
        tempDraw.value = {
          type: "brush",
          points: [{ x: startX, y: startY }]
        };
      } else if (drawMode.value === "box") {
        tempDraw.value = {
          type: "box",
          x1: startX,
          y1: startY,
          x2: startX,
          y2: startY
        };
      }
    };
    const handleTouchMove = (e) => {
      if (!isDrawing || !ctx.value)
        return;
      const touch = e.touches[0];
      const currentX = touch.x;
      const currentY = touch.y;
      if (drawMode.value === "brush") {
        tempDraw.value.points.push({ x: currentX, y: currentY });
      } else if (drawMode.value === "box") {
        tempDraw.value.x2 = currentX;
        tempDraw.value.y2 = currentY;
      }
      redrawCanvas();
    };
    const handleTouchEnd = () => {
      if (!isDrawing || !ctx.value || !tempDraw.value)
        return;
      isDrawing = false;
      drawList.value.push(tempDraw.value);
      tempDraw.value = null;
      redrawCanvas();
    };
    const switchDrawMode = (mode) => {
      drawMode.value = mode;
    };
    const undoLastDraw = () => {
      if (drawList.value.length > 0) {
        drawList.value.pop();
        redrawCanvas();
      }
    };
    const saveMaskImage = () => {
      if (!ctx.value || !currentImage.value)
        return;
      common_vendor.index.canvasToTempFilePath({
        canvasId: "maskCanvas",
        success: (res) => {
          common_vendor.index.__f__("log", "at components/dynamic/MoreImageUpload.vue:282", "遮罩图片保存成功:", res.tempFilePath);
          if (currentImage.value) {
            currentImage.value.maskedUrl = res.tempFilePath;
          }
          isMaskModalVisible.value = false;
          resetMaskState();
          if (maskComplete.value) {
            maskComplete.value(currentImage.value);
            maskComplete.value = null;
          }
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at components/dynamic/MoreImageUpload.vue:302", "遮罩图片保存失败:", err);
          common_vendor.index.showToast({
            title: "保存失败，请重试",
            icon: "none"
          });
          if (maskComplete.value) {
            reject(err);
            maskComplete.value = null;
          }
        }
      });
    };
    const resetMaskState = () => {
      currentImage.value = null;
      drawList.value = [];
      tempDraw.value = null;
      drawMode.value = "brush";
    };
    const cancelMaskEdit = () => {
      isMaskModalVisible.value = false;
      resetMaskState();
    };
    common_vendor.watch(isMaskModalVisible, (val) => {
      if (val && currentImage.value) {
        common_vendor.nextTick$1(() => {
          initCanvas();
        });
      }
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          title: _ctx.title
        }),
        b: common_vendor.sr(imageUploadRef, "96383370-2,96383370-0", {
          "k": "imageUploadRef"
        }),
        c: common_vendor.o(($event) => imageList.value = $event),
        d: common_vendor.p({
          limit: 6,
          ["custom-upload-handler"]: uploadFilePromise,
          multiple: true,
          modelValue: imageList.value
        }),
        e: isMaskModalVisible.value
      }, isMaskModalVisible.value ? {
        f: common_vendor.o(cancelMaskEdit),
        g: common_vendor.o(saveMaskImage),
        h: common_vendor.o(handleTouchStart),
        i: common_vendor.o(handleTouchMove),
        j: common_vendor.o(handleTouchEnd),
        k: drawMode.value === "brush" ? 1 : "",
        l: common_vendor.o(($event) => switchDrawMode("brush")),
        m: drawMode.value === "box" ? 1 : "",
        n: common_vendor.o(($event) => switchDrawMode("box")),
        o: brushWidth.value,
        p: common_vendor.o(($event) => brushWidth.value = $event.detail.value),
        q: common_vendor.o(undoLastDraw)
      } : {});
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-96383370"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/dynamic/MoreImageUpload.js.map
