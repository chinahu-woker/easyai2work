"use strict";
require("./high-light/index.js");
const common_vendor = require("../../../common/vendor.js");
const components_firstui_fuiParse_highLight_highlight_code = require("./high-light/highlight.code.js");
const LANGUAGE_LIST = [
  "javascript",
  "css",
  "xml",
  "sql",
  "typescript",
  "markdown",
  "c++",
  "c"
];
const _sfc_main = {
  name: "firstui-audio",
  props: {
    codeText: {
      type: String,
      default: ""
    },
    language: {
      type: String,
      default: "javascript"
    }
  },
  data() {
    return {
      code: ""
    };
  },
  created() {
    this.parseCode(this.codeText, this.language);
  },
  methods: {
    parseCode(input, language) {
      const lang = LANGUAGE_LIST.includes(language) ? language : "javascript";
      const {
        value
      } = components_firstui_fuiParse_highLight_highlight_code._hljs.highlight(lang, input);
      const highlighted = value.replace("&amp;", "&").trim();
      let codeResult = `<code class="${lang}">${highlighted}</code>`;
      codeResult = codeResult.replace(/\n/g, "<br/>").replace("<code>", "");
      this.code = codeResult;
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.code
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
