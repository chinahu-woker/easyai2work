"use strict";
const common_vendor = require("../../../../../../common/vendor.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "tag",
  props: common_vendor.tagProps,
  emits: common_vendor.tagEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const { tagClickHandle } = common_vendor.useTag(props, emits);
    const { tagClass, tagStyle } = common_vendor.useTagCustomStyle(props);
    return (_ctx, _cache) => {
      return {
        a: common_vendor.n(common_vendor.unref(tagClass)),
        b: common_vendor.s(common_vendor.unref(tagStyle)),
        c: common_vendor.o(
          //@ts-ignore
          (...args) => common_vendor.unref(tagClickHandle) && common_vendor.unref(tagClickHandle)(...args)
        )
      };
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-3ceb486f"]]);
wx.createComponent(Component);
