"use strict";
const common_vendor = require("../../../../../../../common/vendor.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "avatar-group",
  props: common_vendor.avatarGroupProps,
  emits: common_vendor.avatarGroupEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const ns = common_vendor.useNamespace("avatar");
    common_vendor.useAvatarGroup(props, emits);
    return (_ctx, _cache) => {
      return {
        a: common_vendor.n(`${common_vendor.unref(ns).b("group")}`),
        b: common_vendor.gei(_ctx, "")
      };
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-ebd46f5c"]]);
wx.createComponent(Component);
