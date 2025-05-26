"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  name: "fui-vtabs-content",
  inject: ["vtabs"],
  props: {
    tabIndex: {
      type: [Number, String],
      default: 0
    }
  },
  mounted() {
    if (this.vtabs && this.vtabs.linkage) {
      this.vtabs.children.push(this);
      this.$nextTick(() => {
        setTimeout(() => {
          this.calcHeight((height) => {
            this.vtabs.getCalcHeight(height, Number(this.tabIndex));
          });
        }, 300);
      });
    }
  },
  // TODO vue3
  beforeUnmount() {
    this.uninstall();
  },
  methods: {
    calcHeight(callback, index = 0) {
      common_vendor.index.createSelectorQuery().in(this).select(`#fui-vtabs-content__${this.tabIndex}`).fields({
        size: true
      }, (data) => {
        if (index >= 12)
          return;
        if (data && data.height) {
          callback && callback(data.height);
        } else {
          index++;
          setTimeout(() => {
            this.calcHeight(callback, index);
          }, 50);
          return;
        }
      }).exec();
    },
    uninstall() {
      if (this.vtabs && this.vtabs.linkage) {
        this.vtabs.uninstall(Number(this.tabIndex), this);
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: "fui-vtabs-content__" + $props.tabIndex
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-6fc6d1f1"]]);
wx.createComponent(Component);
