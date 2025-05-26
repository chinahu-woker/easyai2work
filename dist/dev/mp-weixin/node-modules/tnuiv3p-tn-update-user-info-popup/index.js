"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Math) {
  (TnIcon + TnPopup)();
}
const TnPopup = () => "../@tuniao/tnui-vue3-uniapp/components/popup/src/popup.js";
const TnIcon = () => "../@tuniao/tnui-vue3-uniapp/components/icon/src/icon.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  props: common_vendor.updateUserInfoPopupProps,
  emits: common_vendor.updateUserInfoPopupEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const {
      showUpdatePopup,
      inputNickname,
      popupCloseHandle,
      nickNameInputHandle,
      submitBtnClickHandle,
      avatarChooseHandle
    } = common_vendor.useUpdateUserInfoPopup(props, emit);
    const { ns, submitBtnClass, submitBtnStyle } = common_vendor.useUpdateUserInfoPopupCustomStyle(props);
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(_ctx.title),
        b: common_vendor.n(common_vendor.unref(ns).e("title")),
        c: common_vendor.t(_ctx.tips),
        d: common_vendor.n(common_vendor.unref(ns).e("tips")),
        e: _ctx.avatar
      }, _ctx.avatar ? {
        f: common_vendor.n(common_vendor.unref(ns).em("avatar", "image")),
        g: _ctx.avatar
      } : {
        h: common_vendor.p({
          name: "clover-fill"
        }),
        i: common_vendor.n(common_vendor.unref(ns).em("avatar", "empty"))
      }, {
        j: common_vendor.p({
          name: "camera-fill"
        }),
        k: common_vendor.n(common_vendor.unref(ns).em("avatar", "assist")),
        l: common_vendor.n(common_vendor.unref(ns).em("avatar", "container")),
        m: common_vendor.o(
          //@ts-ignore
          (...args) => common_vendor.unref(avatarChooseHandle) && common_vendor.unref(avatarChooseHandle)(...args)
        ),
        n: common_vendor.n(common_vendor.unref(ns).e("avatar")),
        o: common_vendor.n(common_vendor.unref(ns).e("nickname-input")),
        p: common_vendor.unref(inputNickname),
        q: common_vendor.o(
          //@ts-ignore
          (...args) => common_vendor.unref(nickNameInputHandle) && common_vendor.unref(nickNameInputHandle)(...args)
        ),
        r: common_vendor.t(_ctx.confirmText),
        s: common_vendor.n(common_vendor.unref(submitBtnClass)),
        t: common_vendor.s(common_vendor.unref(submitBtnStyle)),
        v: common_vendor.o(
          //@ts-ignore
          (...args) => common_vendor.unref(submitBtnClickHandle) && common_vendor.unref(submitBtnClickHandle)(...args)
        ),
        w: common_vendor.n(common_vendor.unref(ns).b()),
        x: common_vendor.o(common_vendor.unref(popupCloseHandle)),
        y: common_vendor.o(($event) => common_vendor.isRef(showUpdatePopup) ? showUpdatePopup.value = $event : null),
        z: common_vendor.p({
          ["open-direction"]: "bottom",
          ["close-btn"]: true,
          ["safe-area-inset-bottom"]: false,
          modelValue: common_vendor.unref(showUpdatePopup)
        })
      });
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-fd9bc11c"]]);
wx.createComponent(Component);
