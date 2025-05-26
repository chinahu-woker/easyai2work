"use strict";
const common_vendor = require("../../../../../../common/vendor.js");
if (!Math) {
  TnIcon();
}
const TnIcon = () => "../../icon/src/icon.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "number-box",
  props: common_vendor.numberBoxProps,
  emits: common_vendor.numberBoxEmits,
  setup(__props) {
    const props = __props;
    const {
      inputValue,
      handleOperationEvent,
      clearLongPressTimer,
      numberBoxInputEvent
    } = common_vendor.useNumberBox(props);
    const {
      ns,
      numberBoxClass,
      numberBoxStyle,
      numberBoxOperationWrapperClass,
      numberBoxOperationWrapperStyle
    } = common_vendor.useNumberBoxCustomStyle(props, inputValue);
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          name: "reduce"
        }),
        b: common_vendor.n(common_vendor.unref(ns).e("operation-btn")),
        c: common_vendor.n(common_vendor.unref(ns).em("operation-btn", "minus")),
        d: common_vendor.n(common_vendor.unref(numberBoxOperationWrapperClass)("minus")),
        e: common_vendor.s(common_vendor.unref(numberBoxOperationWrapperStyle)("minus")),
        f: common_vendor.o(($event) => common_vendor.unref(handleOperationEvent)("minus")),
        g: common_vendor.o(
          //@ts-ignore
          (...args) => common_vendor.unref(clearLongPressTimer) && common_vendor.unref(clearLongPressTimer)(...args)
        ),
        h: _ctx.disabled || _ctx.inputDisabled,
        i: common_vendor.o([
          common_vendor.m(($event) => common_vendor.isRef(inputValue) ? inputValue.value = $event.detail.value : null, {
            number: true
          }),
          //@ts-ignore
          (...args) => common_vendor.unref(numberBoxInputEvent) && common_vendor.unref(numberBoxInputEvent)(...args)
        ]),
        j: common_vendor.unref(inputValue),
        k: common_vendor.n(common_vendor.unref(ns).e("input")),
        l: common_vendor.n(common_vendor.unref(numberBoxOperationWrapperClass)("input")),
        m: common_vendor.s(common_vendor.unref(numberBoxOperationWrapperStyle)("input")),
        n: common_vendor.p({
          name: "add"
        }),
        o: common_vendor.n(common_vendor.unref(ns).e("operation-btn")),
        p: common_vendor.n(common_vendor.unref(ns).em("operation-btn", "plus")),
        q: common_vendor.n(common_vendor.unref(numberBoxOperationWrapperClass)("plus")),
        r: common_vendor.s(common_vendor.unref(numberBoxOperationWrapperStyle)("plus")),
        s: common_vendor.o(($event) => common_vendor.unref(handleOperationEvent)("plus")),
        t: common_vendor.o(
          //@ts-ignore
          (...args) => common_vendor.unref(clearLongPressTimer) && common_vendor.unref(clearLongPressTimer)(...args)
        ),
        v: common_vendor.n(common_vendor.unref(numberBoxClass)),
        w: common_vendor.s(common_vendor.unref(numberBoxStyle))
      };
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-05a049a7"]]);
wx.createComponent(Component);
