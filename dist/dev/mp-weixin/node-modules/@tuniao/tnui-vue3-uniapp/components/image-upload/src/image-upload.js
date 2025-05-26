"use strict";
const common_vendor = require("../../../../../../common/vendor.js");
if (!Math) {
  TnIcon();
}
const TnIcon = () => "../../icon/src/icon.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "image-upload",
  props: common_vendor.imageUploadProps,
  emits: common_vendor.imageUploadEmits,
  setup(__props, { expose: __expose }) {
    const props = __props;
    const ns = common_vendor.useNamespace("image-upload");
    const nsItem = common_vendor.useNamespace("image-upload-item");
    const {
      fileList,
      isExceedMaxCount,
      chooseFile,
      retryUploadFile,
      retryAllUpload,
      customUploadHandle,
      removeFileEvent,
      clearAllFile,
      previewImage
    } = common_vendor.useImageUpload(props);
    __expose({
      /**
       * @description 手动选择文件
       */
      chooseFile,
      /**
       * @description 手动上传图片
       */
      upload: customUploadHandle,
      /**
       * @description 重新上传失败的文件
       */
      retry: retryAllUpload,
      /**
       * @description 清空所有文件
       */
      clear: clearAllFile
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.f(common_vendor.unref(fileList), (item, index, i0) => {
          return common_vendor.e({
            a: item.url,
            b: common_vendor.n(common_vendor.unref(nsItem).is("finish", item.status === "done")),
            c: common_vendor.o(($event) => common_vendor.unref(previewImage)(index), index)
          }, _ctx.showRemove && !_ctx.disabled ? {
            d: "0f651093-0-" + i0,
            e: common_vendor.p({
              name: "close-fill"
            }),
            f: common_vendor.n(common_vendor.unref(nsItem).em("remove", "icon")),
            g: common_vendor.n(common_vendor.unref(nsItem).e("remove")),
            h: common_vendor.o(($event) => common_vendor.unref(removeFileEvent)(index), index)
          } : {}, {
            i: item.status === "failed" && !_ctx.disabled
          }, item.status === "failed" && !_ctx.disabled ? {
            j: "0f651093-1-" + i0,
            k: common_vendor.p({
              name: "refresh-simple"
            }),
            l: common_vendor.n(common_vendor.unref(nsItem).e("retry")),
            m: common_vendor.o(($event) => common_vendor.unref(retryUploadFile)(index), index)
          } : {}, {
            n: _ctx.showUploadProgress && item.progress > 0 && item.progress < 100 && !_ctx.disabled
          }, _ctx.showUploadProgress && item.progress > 0 && item.progress < 100 && !_ctx.disabled ? {
            o: common_vendor.n(common_vendor.unref(nsItem).em("progress", "wave")),
            p: `${-300 - item.progress}%`,
            q: common_vendor.n(common_vendor.unref(nsItem).em("progress", "wave")),
            r: `${-300 - item.progress}%`,
            s: common_vendor.n(common_vendor.unref(nsItem).e("progress")),
            t: common_vendor.n(common_vendor.unref(nsItem).is("finish", item.progress === 100))
          } : {}, {
            v: "uploadImage-" + i0,
            w: common_vendor.r("uploadImage", {
              data: item
            }, i0),
            x: index
          });
        }),
        b: common_vendor.n(common_vendor.unref(nsItem).e("image")),
        c: _ctx.showRemove && !_ctx.disabled,
        d: common_vendor.n(common_vendor.unref(nsItem).b()),
        e: common_vendor.n(common_vendor.unref(nsItem).is("custom", !!_ctx.$slots.uploadImage)),
        f: !common_vendor.unref(isExceedMaxCount) && !_ctx.disabled
      }, !common_vendor.unref(isExceedMaxCount) && !_ctx.disabled ? {
        g: common_vendor.p({
          name: "add-fill"
        }),
        h: common_vendor.n(common_vendor.unref(nsItem).em("add-btn", "icon")),
        i: common_vendor.n(common_vendor.unref(nsItem).e("add-btn")),
        j: common_vendor.n(common_vendor.unref(nsItem).b()),
        k: common_vendor.o(
          //@ts-ignore
          (...args) => common_vendor.unref(chooseFile) && common_vendor.unref(chooseFile)(...args)
        )
      } : {}, {
        l: common_vendor.n(common_vendor.unref(ns).b())
      });
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-0f651093"]]);
wx.createComponent(Component);
