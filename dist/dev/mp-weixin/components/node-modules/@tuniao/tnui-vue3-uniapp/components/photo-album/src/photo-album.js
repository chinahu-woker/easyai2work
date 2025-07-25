"use strict";
const common_vendor = require("../../../../../../../common/vendor.js");
if (!Math) {
  TnLazyLoad();
}
const TnLazyLoad = () => "../../lazy-load/src/lazy-load.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "photo-album",
  props: common_vendor.photoAlbumProps$1,
  emits: common_vendor.photoAlbumEmits$1,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const ns = common_vendor.useNamespace("photo-album");
    const { imageData, imageClickEvent } = common_vendor.usePhotoAlbum$1(props, emits);
    const containerStyle = common_vendor.computed(() => {
      const style = {};
      let width = `calc(100% / ${props.column} - 20rpx)`;
      style.width = style.paddingBottom = width;
      return style;
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(common_vendor.unref(imageData), (item, index, i0) => {
          return common_vendor.e(_ctx.lazyLoad ? {
            a: "1eed39db-0-" + i0,
            b: common_vendor.p({
              src: item,
              mode: props.imgMode
            })
          } : {
            c: common_vendor.n(common_vendor.unref(ns).e("item__image")),
            d: item,
            e: props.imgMode
          }, {
            f: index,
            g: common_vendor.o(($event) => common_vendor.unref(imageClickEvent)(index), index)
          });
        }),
        b: _ctx.lazyLoad,
        c: common_vendor.n(common_vendor.unref(ns).e("item")),
        d: common_vendor.n(common_vendor.unref(ns).e("container")),
        e: common_vendor.s(containerStyle.value),
        f: common_vendor.n(common_vendor.unref(ns).b()),
        g: common_vendor.gei(_ctx, "")
      };
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1eed39db"]]);
wx.createComponent(Component);
