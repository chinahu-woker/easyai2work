"use strict";
const common_vendor = require("../../../../../../common/vendor.js");
if (!Math) {
  (TnOverlay + TnIcon)();
}
const TnOverlay = () => "../../overlay/src/overlay.js";
const TnIcon = () => "../../icon/src/icon.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "popup",
  props: common_vendor.popupProps,
  emits: common_vendor.popupEmits,
  setup(__props) {
    const props = __props;
    const {
      iosDevice,
      showOverlay,
      showPopup,
      visiblePopup,
      onClickCloseBtn,
      onClickOverlay
    } = common_vendor.usePopup(props);
    const { ns, overlayZIndex, zIndex, popupContentClass, popupContentStyle } = common_vendor.usePopupCustomStyle(props);
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: !common_vendor.unref(iosDevice) || common_vendor.unref(iosDevice) && common_vendor.unref(visiblePopup)
      }, !common_vendor.unref(iosDevice) || common_vendor.unref(iosDevice) && common_vendor.unref(visiblePopup) ? common_vendor.e({
        b: common_vendor.o(common_vendor.unref(onClickOverlay)),
        c: common_vendor.p({
          show: common_vendor.unref(showOverlay),
          ["z-index"]: common_vendor.unref(overlayZIndex),
          opacity: _ctx.overlayOpacity
        }),
        d: _ctx.closeBtn
      }, _ctx.closeBtn ? {
        e: common_vendor.p({
          name: "close"
        }),
        f: common_vendor.n(common_vendor.unref(ns).e("close-btn")),
        g: common_vendor.n(common_vendor.unref(ns).em("close-btn", _ctx.closeBtnPosition)),
        h: common_vendor.o(
          //@ts-ignore
          (...args) => common_vendor.unref(onClickCloseBtn) && common_vendor.unref(onClickCloseBtn)(...args)
        )
      } : {}, {
        i: common_vendor.n(common_vendor.unref(popupContentClass)),
        j: common_vendor.s(common_vendor.unref(popupContentStyle)),
        k: common_vendor.n(common_vendor.unref(ns).b()),
        l: common_vendor.n(common_vendor.unref(ns).is("show", common_vendor.unref(showPopup))),
        m: common_vendor.n(common_vendor.unref(ns).is("visible", common_vendor.unref(visiblePopup))),
        n: common_vendor.unref(zIndex)
      }) : {});
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-557a403b"]]);
wx.createComponent(Component);
