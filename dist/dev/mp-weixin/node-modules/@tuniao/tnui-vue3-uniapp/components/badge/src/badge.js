"use strict";
const common_vendor = require("../../../../../../common/vendor.js");
if (!Math) {
  TnIcon();
}
const TnIcon = () => "../../icon/src/icon.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "badge",
  props: common_vendor.badgeProps,
  emits: common_vendor.badgeEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const slots = common_vendor.useSlots();
    const { ns, contentNs, badgeContentClass, badgeContentStyle } = common_vendor.useBadgeCustomStyle(props);
    const { showBadge, contentType, content, badgeClick } = common_vendor.useBadge(props, emits);
    const badgeClass = common_vendor.computed(() => {
      const cls = [];
      cls.push(ns.b());
      if (!(slots == null ? void 0 : slots.default)) {
        if (props.absolute) {
          cls.push(ns.e("absolute"));
          if (props.absoluteCenter)
            cls.push(ns.em("absolute", "center"));
        }
      }
      return cls.join(" ");
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.unref(showBadge)
      }, common_vendor.unref(showBadge) ? common_vendor.e({
        b: common_vendor.unref(content)
      }, common_vendor.unref(content) ? common_vendor.e({
        c: common_vendor.unref(contentType) === "icon"
      }, common_vendor.unref(contentType) === "icon" ? {
        d: common_vendor.p({
          name: common_vendor.unref(content)
        })
      } : {
        e: common_vendor.t(common_vendor.unref(content)),
        f: common_vendor.n(`${common_vendor.unref(contentNs).e("data")}`)
      }) : {}, {
        g: common_vendor.n(common_vendor.unref(badgeContentClass)),
        h: common_vendor.s(common_vendor.unref(badgeContentStyle)),
        i: common_vendor.o(
          //@ts-ignore
          (...args) => common_vendor.unref(badgeClick) && common_vendor.unref(badgeClick)(...args)
        )
      }) : {}, {
        j: common_vendor.n(badgeClass.value)
      });
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1d3a16af"]]);
wx.createComponent(Component);
