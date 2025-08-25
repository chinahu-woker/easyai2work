"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  name: "fui-backdrop",
  emits: ["click"],
  props: {
    show: {
      type: Boolean,
      default: false
    },
    background: {
      type: String,
      default: ""
    },
    //是否绝对定位，默认固定定位fixed
    absolute: {
      type: Boolean,
      default: false
    },
    //absolute定位且组件在根目录下时是否铺满屏幕,仅nvue有效
    full: {
      type: Boolean,
      default: false
    },
    zIndex: {
      type: Number,
      default: 980
    },
    closable: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleClick() {
      if (this.closable && this.show) {
        this.$emit("click");
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: !$props.background ? 1 : "",
    b: $props.show ? 1 : "",
    c: $props.background,
    d: $props.absolute ? "absolute" : "fixed",
    e: $props.zIndex,
    f: common_vendor.o((...args) => $options.handleClick && $options.handleClick(...args))
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-e53e8ed3"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/components/firstui/fui-backdrop/fui-backdrop.js.map
