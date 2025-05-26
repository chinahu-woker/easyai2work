"use strict";
const common_vendor = require("../../../../../../common/vendor.js");
if (!Math) {
  (TnLoading + TnIcon)();
}
const TnIcon = () => "../../icon/src/icon.js";
const TnLoading = () => "../../loading/src/loading.js";
const __default__ = {
  options: {
    // 在微信小程序中将组件节点渲染为虚拟节点，更加接近Vue组件的表现(不会出现shadow节点下再去创建元素)
    virtualHost: true
  }
};
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  ...__default__,
  __name: "button",
  props: common_vendor.buttonProps,
  emits: common_vendor.buttonEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const {
      buttonClick,
      getPhoneNumber,
      getRealTimePhoneNumber,
      openSetting,
      launchApp,
      getUserInfo,
      chooseAvatar,
      agreePrivacyAuthorization,
      contact,
      openTypeError
    } = common_vendor.useButton(props, emits);
    const { ns, buttonClass, buttonStyle } = common_vendor.useButtonCustomStyle(props);
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: props.clickModifiers === "stop"
      }, props.clickModifiers === "stop" ? common_vendor.e({
        b: _ctx.loading
      }, _ctx.loading ? {
        c: common_vendor.p({
          show: true,
          animation: true,
          mode: "flower",
          color: "tn-gray"
        }),
        d: common_vendor.n(common_vendor.unref(ns).m("loading"))
      } : {}, {
        e: _ctx.icon
      }, _ctx.icon ? {
        f: common_vendor.p({
          name: _ctx.icon
        }),
        g: common_vendor.n(common_vendor.unref(ns).e("icon"))
      } : {}, {
        h: common_vendor.n(common_vendor.unref(buttonClass)),
        i: common_vendor.s(common_vendor.unref(buttonStyle)),
        j: props.disabled || props.loading || props.onlyButton ? "" : _ctx.hoverClass,
        k: _ctx.disabled,
        l: _ctx.formType,
        m: _ctx.openType,
        n: _ctx.appParameter,
        o: _ctx.sessionFrom,
        p: _ctx.sendMessageTitle,
        q: _ctx.sendMessagePath,
        r: _ctx.sendMessageImg,
        s: _ctx.showMessageCard,
        t: _ctx.phoneNumberNoQuotaToast,
        v: common_vendor.o(
          //@ts-ignore
          (...args) => common_vendor.unref(buttonClick) && common_vendor.unref(buttonClick)(...args)
        ),
        w: common_vendor.o(
          //@ts-ignore
          (...args) => common_vendor.unref(getPhoneNumber) && common_vendor.unref(getPhoneNumber)(...args)
        ),
        x: common_vendor.o(
          //@ts-ignore
          (...args) => common_vendor.unref(getRealTimePhoneNumber) && common_vendor.unref(getRealTimePhoneNumber)(...args)
        ),
        y: common_vendor.o(
          //@ts-ignore
          (...args) => common_vendor.unref(openSetting) && common_vendor.unref(openSetting)(...args)
        ),
        z: common_vendor.o(
          //@ts-ignore
          (...args) => common_vendor.unref(launchApp) && common_vendor.unref(launchApp)(...args)
        ),
        A: common_vendor.o(
          //@ts-ignore
          (...args) => common_vendor.unref(getUserInfo) && common_vendor.unref(getUserInfo)(...args)
        ),
        B: common_vendor.o(
          //@ts-ignore
          (...args) => common_vendor.unref(chooseAvatar) && common_vendor.unref(chooseAvatar)(...args)
        ),
        C: common_vendor.o(
          //@ts-ignore
          (...args) => common_vendor.unref(agreePrivacyAuthorization) && common_vendor.unref(agreePrivacyAuthorization)(...args)
        ),
        D: common_vendor.o(
          //@ts-ignore
          (...args) => common_vendor.unref(contact) && common_vendor.unref(contact)(...args)
        ),
        E: common_vendor.o(
          //@ts-ignore
          (...args) => common_vendor.unref(openTypeError) && common_vendor.unref(openTypeError)(...args)
        )
      }) : common_vendor.e({
        F: _ctx.loading
      }, _ctx.loading ? {
        G: common_vendor.p({
          show: true,
          animation: true,
          mode: "flower",
          color: "tn-gray"
        }),
        H: common_vendor.n(common_vendor.unref(ns).m("loading"))
      } : {}, {
        I: _ctx.icon
      }, _ctx.icon ? {
        J: common_vendor.p({
          name: _ctx.icon
        }),
        K: common_vendor.n(common_vendor.unref(ns).e("icon"))
      } : {}, {
        L: common_vendor.n(common_vendor.unref(buttonClass)),
        M: common_vendor.s(common_vendor.unref(buttonStyle)),
        N: props.disabled || props.loading || props.onlyButton ? "" : _ctx.hoverClass,
        O: _ctx.disabled,
        P: _ctx.formType,
        Q: _ctx.openType,
        R: _ctx.appParameter,
        S: _ctx.sessionFrom,
        T: _ctx.sendMessageTitle,
        U: _ctx.sendMessagePath,
        V: _ctx.sendMessageImg,
        W: _ctx.showMessageCard,
        X: _ctx.phoneNumberNoQuotaToast,
        Y: common_vendor.o(
          //@ts-ignore
          (...args) => common_vendor.unref(buttonClick) && common_vendor.unref(buttonClick)(...args)
        ),
        Z: common_vendor.o(
          //@ts-ignore
          (...args) => common_vendor.unref(getPhoneNumber) && common_vendor.unref(getPhoneNumber)(...args)
        ),
        aa: common_vendor.o(
          //@ts-ignore
          (...args) => common_vendor.unref(getRealTimePhoneNumber) && common_vendor.unref(getRealTimePhoneNumber)(...args)
        ),
        ab: common_vendor.o(
          //@ts-ignore
          (...args) => common_vendor.unref(openSetting) && common_vendor.unref(openSetting)(...args)
        ),
        ac: common_vendor.o(
          //@ts-ignore
          (...args) => common_vendor.unref(launchApp) && common_vendor.unref(launchApp)(...args)
        ),
        ad: common_vendor.o(
          //@ts-ignore
          (...args) => common_vendor.unref(getUserInfo) && common_vendor.unref(getUserInfo)(...args)
        ),
        ae: common_vendor.o(
          //@ts-ignore
          (...args) => common_vendor.unref(chooseAvatar) && common_vendor.unref(chooseAvatar)(...args)
        ),
        af: common_vendor.o(
          //@ts-ignore
          (...args) => common_vendor.unref(agreePrivacyAuthorization) && common_vendor.unref(agreePrivacyAuthorization)(...args)
        ),
        ag: common_vendor.o(
          //@ts-ignore
          (...args) => common_vendor.unref(contact) && common_vendor.unref(contact)(...args)
        ),
        ah: common_vendor.o(
          //@ts-ignore
          (...args) => common_vendor.unref(openTypeError) && common_vendor.unref(openTypeError)(...args)
        )
      }));
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-2c34b8c1"]]);
wx.createComponent(Component);
