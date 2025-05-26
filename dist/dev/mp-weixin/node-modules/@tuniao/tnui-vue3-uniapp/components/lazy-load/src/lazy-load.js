"use strict";
const common_vendor = require("../../../../../../common/vendor.js");
if (!Math) {
  TnIcon();
}
const TnIcon = () => "../../icon/src/icon.js";
const __default__ = {
  options: {
    // 在微信小程序中将组件节点渲染为虚拟节点，更加接近Vue组件的表现(不会出现shadow节点下再去创建元素)
    virtualHost: true
  }
};
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  ...__default__,
  __name: "lazy-load",
  props: common_vendor.lazyLoadProps,
  emits: common_vendor.lazyLoadEmits,
  setup(__props) {
    const props = __props;
    const {
      componentId,
      imageStatus,
      showImage,
      handleImageLoadedSuccess,
      handleImageLoadedFailed
    } = common_vendor.useLazyLoad(props);
    const { ns, lazyLoadStyle } = common_vendor.useLazyLoadCustomStyle(props);
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.unref(imageStatus) === "loading"
      }, common_vendor.unref(imageStatus) === "loading" ? {
        b: common_vendor.p({
          name: "loading"
        }),
        c: common_vendor.n(common_vendor.unref(ns).e("loading__icon")),
        d: common_vendor.n(common_vendor.unref(ns).e("loading")),
        e: common_vendor.n(common_vendor.unref(ns).e("container"))
      } : {}, {
        f: common_vendor.unref(showImage) && common_vendor.unref(imageStatus) !== "error"
      }, common_vendor.unref(showImage) && common_vendor.unref(imageStatus) !== "error" ? {
        g: common_vendor.n(common_vendor.unref(ns).e("image")),
        h: common_vendor.n(common_vendor.unref(ns).is("animation", common_vendor.unref(imageStatus) === "loaded" && _ctx.transition)),
        i: common_vendor.n(common_vendor.unref(ns).is("no-animation", common_vendor.unref(imageStatus) === "loaded" && !_ctx.transition)),
        j: _ctx.src,
        k: _ctx.mode,
        l: common_vendor.o(
          //@ts-ignore
          (...args) => common_vendor.unref(handleImageLoadedSuccess) && common_vendor.unref(handleImageLoadedSuccess)(...args)
        ),
        m: common_vendor.o(
          //@ts-ignore
          (...args) => common_vendor.unref(handleImageLoadedFailed) && common_vendor.unref(handleImageLoadedFailed)(...args)
        ),
        n: common_vendor.n(common_vendor.unref(ns).e("container"))
      } : {}, {
        o: common_vendor.unref(imageStatus) === "error"
      }, common_vendor.unref(imageStatus) === "error" ? {
        p: common_vendor.p({
          name: "image-fill"
        }),
        q: common_vendor.n(common_vendor.unref(ns).e("error")),
        r: common_vendor.n(common_vendor.unref(ns).e("container"))
      } : {}, {
        s: common_vendor.unref(componentId),
        t: common_vendor.n(common_vendor.unref(ns).b()),
        v: common_vendor.n(common_vendor.unref(ns).is("show-image", common_vendor.unref(showImage) && common_vendor.unref(imageStatus) === "loaded")),
        w: common_vendor.s(common_vendor.unref(lazyLoadStyle))
      });
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-b259162f"]]);
wx.createComponent(Component);
