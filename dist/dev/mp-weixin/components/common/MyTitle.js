"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Math) {
  TnTitle();
}
const TnTitle = () => "../../node-modules/@tuniao/tnui-vue3-uniapp/components/title/src/title.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "MyTitle",
  props: {
    title: { default: "默认标题" }
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          title: _ctx.title,
          mode: "vLine"
        })
      };
    };
  }
});
wx.createComponent(_sfc_main);
