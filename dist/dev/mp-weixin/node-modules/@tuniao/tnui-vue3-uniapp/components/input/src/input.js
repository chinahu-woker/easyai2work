"use strict";
const common_vendor = require("../../../../../../common/vendor.js");
if (!Math) {
  TnIcon();
}
const TnIcon = () => "../../icon/src/icon.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "input",
  props: common_vendor.inputProps,
  emits: common_vendor.inputEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const {
      inputText,
      needStatusIcon,
      validateState,
      validateIcon,
      passwordVisible,
      passwordIcon,
      showIcon,
      disabled,
      showWordLimit,
      currentWordCount,
      togglePasswordVisible,
      inputInputEvent,
      inputFocusEvent,
      inputBlurEvent,
      clearClickEvent,
      confirmEvent,
      inputClickEvent
    } = common_vendor.useInput(props, emits);
    const {
      ns,
      inputClass,
      inputStyle,
      placeholderStyle,
      wordLimitClass,
      wordLimitStyle
    } = common_vendor.useInputCustomStyle(props, validateState, disabled);
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: _ctx.$slots.prefix
      }, _ctx.$slots.prefix ? {
        b: common_vendor.n(common_vendor.unref(ns).em("slot", "left"))
      } : {}, {
        c: _ctx.type === "textarea"
      }, _ctx.type === "textarea" ? {
        d: common_vendor.n(common_vendor.unref(ns).e("base")),
        e: common_vendor.n(common_vendor.unref(ns).e("textarea")),
        f: common_vendor.n(common_vendor.unref(ns).is("custom-height", !!_ctx.height)),
        g: common_vendor.unref(inputText),
        h: _ctx.placeholder,
        i: common_vendor.unref(placeholderStyle),
        j: common_vendor.unref(disabled),
        k: _ctx.maxlength,
        l: _ctx.focus,
        m: _ctx.confirmType,
        n: !_ctx.height && _ctx.autoHeight,
        o: _ctx.selectionStart,
        p: _ctx.selectionEnd,
        q: _ctx.cursorSpacing,
        r: _ctx.showConfirmBar,
        s: common_vendor.o(
          //@ts-ignore
          (...args) => common_vendor.unref(inputInputEvent) && common_vendor.unref(inputInputEvent)(...args)
        ),
        t: common_vendor.o(
          //@ts-ignore
          (...args) => common_vendor.unref(inputFocusEvent) && common_vendor.unref(inputFocusEvent)(...args)
        ),
        v: common_vendor.o(
          //@ts-ignore
          (...args) => common_vendor.unref(inputBlurEvent) && common_vendor.unref(inputBlurEvent)(...args)
        ),
        w: common_vendor.o(
          //@ts-ignore
          (...args) => common_vendor.unref(confirmEvent) && common_vendor.unref(confirmEvent)(...args)
        )
      } : {
        x: common_vendor.n(common_vendor.unref(ns).e("base")),
        y: common_vendor.n(common_vendor.unref(ns).e("input")),
        z: common_vendor.n(common_vendor.unref(ns).em("input", _ctx.type)),
        A: _ctx.type === "password" || _ctx.type === "select" ? "text" : _ctx.type,
        B: common_vendor.unref(inputText),
        C: _ctx.placeholder,
        D: _ctx.type === "password" && !common_vendor.unref(passwordVisible),
        E: common_vendor.unref(placeholderStyle),
        F: common_vendor.unref(disabled) || _ctx.type === "select",
        G: _ctx.maxlength,
        H: _ctx.focus,
        I: _ctx.confirmType,
        J: _ctx.selectionStart,
        K: _ctx.selectionEnd,
        L: _ctx.cursorSpacing,
        M: _ctx.showConfirmBar,
        N: common_vendor.o(
          //@ts-ignore
          (...args) => common_vendor.unref(inputInputEvent) && common_vendor.unref(inputInputEvent)(...args)
        ),
        O: common_vendor.o(
          //@ts-ignore
          (...args) => common_vendor.unref(inputFocusEvent) && common_vendor.unref(inputFocusEvent)(...args)
        ),
        P: common_vendor.o(
          //@ts-ignore
          (...args) => common_vendor.unref(inputBlurEvent) && common_vendor.unref(inputBlurEvent)(...args)
        ),
        Q: common_vendor.o(
          //@ts-ignore
          (...args) => common_vendor.unref(confirmEvent) && common_vendor.unref(confirmEvent)(...args)
        )
      }, {
        R: common_vendor.unref(showIcon)
      }, common_vendor.unref(showIcon) ? common_vendor.e({
        S: _ctx.rightIcon
      }, _ctx.rightIcon ? {
        T: common_vendor.p({
          name: _ctx.rightIcon
        }),
        U: common_vendor.n(common_vendor.unref(ns).em("icon", "custom"))
      } : {}, {
        V: _ctx.type === "password" && _ctx.showPassword
      }, _ctx.type === "password" && _ctx.showPassword ? {
        W: common_vendor.p({
          name: common_vendor.unref(passwordIcon)
        }),
        X: common_vendor.n(common_vendor.unref(ns).em("icon", "password")),
        Y: common_vendor.o(
          //@ts-ignore
          (...args) => common_vendor.unref(togglePasswordVisible) && common_vendor.unref(togglePasswordVisible)(...args)
        )
      } : _ctx.clearable && common_vendor.unref(inputText) ? {
        aa: common_vendor.p({
          name: "close"
        }),
        ab: common_vendor.n(common_vendor.unref(ns).em("icon", "clear")),
        ac: common_vendor.o(
          //@ts-ignore
          (...args) => common_vendor.unref(clearClickEvent) && common_vendor.unref(clearClickEvent)(...args)
        )
      } : {}, {
        Z: _ctx.clearable && common_vendor.unref(inputText),
        ad: common_vendor.unref(validateState) && common_vendor.unref(validateIcon) && common_vendor.unref(needStatusIcon)
      }, common_vendor.unref(validateState) && common_vendor.unref(validateIcon) && common_vendor.unref(needStatusIcon) ? {
        ae: common_vendor.p({
          name: common_vendor.unref(validateIcon)
        }),
        af: common_vendor.n(common_vendor.unref(ns).em("icon", `validate-${common_vendor.unref(validateState)}`))
      } : {}, {
        ag: common_vendor.n(common_vendor.unref(ns).e("icon"))
      }) : {}, {
        ah: _ctx.$slots.suffix
      }, _ctx.$slots.suffix ? {
        ai: common_vendor.n(common_vendor.unref(ns).em("slot", "right"))
      } : {}, {
        aj: common_vendor.unref(showWordLimit)
      }, common_vendor.unref(showWordLimit) ? {
        ak: common_vendor.t(common_vendor.unref(currentWordCount)),
        al: common_vendor.t(_ctx.maxlength),
        am: common_vendor.n(common_vendor.unref(wordLimitClass)),
        an: common_vendor.s(common_vendor.unref(wordLimitStyle))
      } : {}, {
        ao: common_vendor.n(common_vendor.unref(inputClass)),
        ap: common_vendor.n(`${_ctx.type === "textarea" ? common_vendor.unref(ns).m("textarea") : common_vendor.unref(ns).m("input")}`),
        aq: common_vendor.n(common_vendor.unref(ns).is("show-word-limit", common_vendor.unref(showWordLimit))),
        ar: common_vendor.s(common_vendor.unref(inputStyle)),
        as: common_vendor.o(
          //@ts-ignore
          (...args) => common_vendor.unref(inputClickEvent) && common_vendor.unref(inputClickEvent)(...args)
        )
      });
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-79787cc6"]]);
wx.createComponent(Component);
