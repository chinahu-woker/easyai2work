"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  name: "fui-parse-group",
  emits: ["atap", "preview"],
  provide() {
    return {
      parsegroup: this
    };
  },
  props: {
    imgPreview: {
      type: Boolean,
      default: true
    },
    thBgcolor: {
      type: Boolean,
      default: true
    }
  },
  data() {
    const pageNodeKey = `fui_parse_${Math.ceil(Math.random() * 1e6).toString(36)}`;
    return {
      pageNodeKey
    };
  },
  methods: {
    onATap(href) {
      this.$emit("atap", href);
    },
    previewImage(src, imageUrls) {
      this.$emit("preview", {
        src,
        imageUrls
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {};
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-a3d2dfb4"]]);
wx.createComponent(Component);
