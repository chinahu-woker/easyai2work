"use strict";
const common_vendor = require("../../../../../../common/vendor.js");
if (!Math) {
  (TnIcon + TnBadge)();
}
const TnIcon = () => "../../icon/src/icon.js";
const TnBadge = () => "../../badge/src/badge.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "avatar",
  props: common_vendor.avatarProps,
  emits: common_vendor.avatarEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const { componentId, avatarGroupIndex, avatarWidth, avatarClick } = common_vendor.useAvatar(
      props,
      emits
    );
    const { ns, avatarClass, avatarStyle } = common_vendor.useAvatarCustomStyle(
      props,
      avatarGroupIndex,
      avatarWidth
    );
    const { imgMode } = common_vendor.useAvatarProps(props);
    const { iconSize, iconColor, iconBold } = common_vendor.useAvatarIconConfig(props.iconConfig);
    const { badgeConfig } = common_vendor.useAvatarBadgeProps(props);
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: _ctx.url
      }, _ctx.url ? {
        b: _ctx.url,
        c: common_vendor.unref(imgMode),
        d: common_vendor.n(common_vendor.unref(ns).e("image"))
      } : _ctx.icon ? {
        f: common_vendor.p({
          name: _ctx.icon,
          color: common_vendor.unref(iconColor),
          size: common_vendor.unref(iconSize),
          bold: common_vendor.unref(iconBold)
        }),
        g: common_vendor.n(common_vendor.unref(ns).e("icon"))
      } : {
        h: common_vendor.n(common_vendor.unref(ns).e("custom"))
      }, {
        e: _ctx.icon,
        i: common_vendor.p({
          ...common_vendor.unref(badgeConfig)
        }),
        j: common_vendor.unref(componentId),
        k: common_vendor.n(common_vendor.unref(avatarClass)),
        l: common_vendor.s(common_vendor.unref(avatarStyle)),
        m: common_vendor.o(
          //@ts-ignore
          (...args) => common_vendor.unref(avatarClick) && common_vendor.unref(avatarClick)(...args)
        )
      });
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-d772262b"]]);
wx.createComponent(Component);
