"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  name: "fui-timeaxis-node",
  inject: ["timeaxis"],
  props: {
    lined: {
      type: Boolean,
      default: true
    },
    lineColor: {
      type: String,
      default: "#ccc"
    }
  },
  data() {
    return {
      lineWidth: 1,
      width: 48,
      leftWidth: 0
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      if (this.timeaxis) {
        this.width = this.timeaxis.width;
        this.lineWidth = this.timeaxis.lineWidth;
        this.leftWidth = this.timeaxis.leftWidth;
        this.timeaxis.children.push(this);
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.leftWidth + "rpx",
    b: $props.lined
  }, $props.lined ? {
    c: $props.lineColor,
    d: $data.lineWidth + "px"
  } : {}, {
    e: $data.width + "rpx"
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-3c819733"]]);
wx.createComponent(Component);
