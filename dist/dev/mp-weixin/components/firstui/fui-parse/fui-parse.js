"use strict";
const common_vendor = require("../../../common/vendor.js");
const components_firstui_fuiParse_utils_html2json = require("./utils/html2json.js");
const components_firstui_fuiParse_marked_index = require("./marked/index.js");
const components_firstui_fuiParse_utils_util = require("./utils/util.js");
const firstuiCode = () => "./firstui-code.js";
const firstuiAudio = () => "./firstui-audio.js";
const BIND_NAME = "fuiParse";
const _sfc_main = {
  name: "fui-parse",
  inject: {
    parsegroup: {
      value: "parsegroup",
      default: null
    }
  },
  components: {
    firstuiCode,
    firstuiAudio
  },
  props: {
    // 可选：html | markdown (md)
    language: {
      type: String,
      default: "html"
    },
    nodes: {
      type: [String, Object, Array],
      default: ""
    }
  },
  watch: {
    nodes: {
      handler(val) {
        if (!val)
          return;
        if (this.language === "markdown" || this.language === "md") {
          const parseNodes = components_firstui_fuiParse_marked_index.marked(val);
          setTimeout(() => {
            this._parseNodes(parseNodes);
          }, 0);
        } else {
          setTimeout(() => {
            this._parseNodes(val);
          }, 0);
        }
      },
      immediate: true
    }
  },
  beforeUnmount() {
    components_firstui_fuiParse_utils_util.util.cacheInstance.remove(this.pageNodeKey);
  },
  data() {
    return {
      pageNodeKey: "",
      nodesData: [],
      bindData: {},
      width: 0,
      height: 0,
      thBgcolor: true,
      mode: ""
    };
  },
  created() {
    this.$nextTick(() => {
      setTimeout(() => {
        if (this.parsegroup) {
          this.thBgcolor = this.parsegroup.thBgcolor;
        }
        this.mode = "widthFix";
      }, 50);
    });
  },
  methods: {
    _parseNodes(nodes) {
      this.pageNodeKey = this.parsegroup ? this.parsegroup.pageNodeKey : BIND_NAME;
      if (typeof nodes === "string") {
        this._parseHtml(nodes);
      } else if (Array.isArray(nodes)) {
        this.nodesData = nodes;
      } else {
        this.nodesData = [nodes];
      }
    },
    _parseHtml(html) {
      const transData = components_firstui_fuiParse_utils_html2json.HtmlToJson.html2json(html, this.pageNodeKey);
      transData.view = {};
      transData.view.imagePadding = 0;
      this.nodesData = transData.nodes;
      this.bindData = {
        [this.pageNodeKey]: transData
      };
      components_firstui_fuiParse_utils_util.util.cacheInstance.set(this.pageNodeKey, transData);
    },
    /**
     * 图片视觉宽高计算函数区
     * @param {*} e
     */
    fuiParseImgLoad(e) {
      const {
        from: tagFrom,
        index
      } = e.target.dataset || e.currentTarget.dataset || {};
      if (typeof tagFrom !== "undefined" && tagFrom.length > 0) {
        const {
          width,
          height
        } = e.detail;
        const recal = this._fuiAutoImageCal(width, height);
        this.width = recal.imageWidth;
        this.height = recal.imageHeight;
        const nodesData = this.nodesData;
        nodesData[index].loaded = true;
        this.nodesData = nodesData;
      }
    },
    /**
     * 预览图片
     * @param {*} e
     */
    fuiParseImgTap(e) {
      const {
        src
      } = e.target.dataset || e.currentTarget.dataset;
      let {
        imageUrls = []
      } = components_firstui_fuiParse_utils_util.util.cacheInstance.get(this.pageNodeKey);
      if (imageUrls.length == 0) {
        imageUrls = [src];
      }
      if (this.parsegroup) {
        if (this.parsegroup.imgPreview) {
          common_vendor.index.previewImage({
            current: src,
            urls: imageUrls
          });
        }
        this.parsegroup.previewImage(src, imageUrls);
      } else {
        common_vendor.index.previewImage({
          current: src,
          urls: imageUrls
        });
      }
    },
    /**
     * 计算视觉优先的图片宽高
     * @param {*} originalWidth
     * @param {*} originalHeight
     */
    _fuiAutoImageCal(originalWidth, originalHeight) {
      let autoWidth = 0, autoHeight = 0;
      const results = {};
      const [windowWidth, windowHeight] = components_firstui_fuiParse_utils_util.util.getSystemInfo();
      if (originalWidth > windowWidth) {
        autoWidth = windowWidth;
        autoHeight = autoWidth * originalHeight / originalWidth;
        results.imageWidth = autoWidth;
        results.imageHeight = autoHeight;
      } else {
        results.imageWidth = originalWidth;
        results.imageHeight = originalHeight;
      }
      return results;
    },
    /**
     * 增加a标签跳转
     * @param {*} e
     */
    fuiParseTagATap(e) {
      const {
        src = ""
      } = e.currentTarget.dataset;
      if (this.parsegroup) {
        this.parsegroup.onATap(src);
        return;
      }
      const isInnerPage = src.indexOf("http") === -1;
      if (isInnerPage) {
        common_vendor.index.navigateTo({
          url: src
        });
      }
    }
  }
};
if (!Array) {
  const _easycom_fui_parse2 = common_vendor.resolveComponent("fui-parse");
  const _component_firstui_code = common_vendor.resolveComponent("firstui-code");
  const _component_firstui_audio = common_vendor.resolveComponent("firstui-audio");
  (_easycom_fui_parse2 + _component_firstui_code + _component_firstui_audio)();
}
const _easycom_fui_parse = () => Promise.resolve().then(() => Rjov5oiR55qE5byA5rqQ6aG555uuL215c2VsZi1hY2dpL3NyYy9jb21wb25lbnRzL2ZpcnN0dWkvZnVpLXBhcnNlL2Z1aS1wYXJzZS52dWU);
if (!Math) {
  _easycom_fui_parse();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.nodesData, (item, index, i0) => {
      return common_vendor.e({
        a: item.node == "element"
      }, item.node == "element" ? common_vendor.e({
        b: item.tag == "button"
      }, item.tag == "button" ? {
        c: common_vendor.f(item.nodes, (child, idx, i1) => {
          return {
            a: "231dc595-0-" + i0 + "-" + i1,
            b: common_vendor.p({
              nodes: child
            }),
            c: idx
          };
        })
      } : item && item.tag == "code" ? {
        e: "231dc595-1-" + i0,
        f: common_vendor.p({
          codeText: item.content,
          language: item.attr && item.attr.lang
        }),
        g: common_vendor.n(item.classStr),
        h: common_vendor.s(item.styleStr)
      } : item.tag == "ol" ? {
        j: common_vendor.f(item.nodes, (child, idx, i1) => {
          return {
            a: common_vendor.t(idx + 1),
            b: "231dc595-2-" + i0 + "-" + i1,
            c: common_vendor.p({
              nodes: child
            }),
            d: idx
          };
        }),
        k: common_vendor.n(item.classStr),
        l: common_vendor.s(item.styleStr)
      } : item.tag == "ul" ? {
        n: common_vendor.f(item.nodes, (child, idx, i1) => {
          return {
            a: "231dc595-3-" + i0 + "-" + i1,
            b: common_vendor.p({
              nodes: child
            }),
            c: idx
          };
        }),
        o: common_vendor.n(item.classStr),
        p: common_vendor.s(item.style && item.style.Str)
      } : item.tag == "li" ? {
        r: common_vendor.f(item.nodes, (child, idx, i1) => {
          return {
            a: "231dc595-4-" + i0 + "-" + i1,
            b: common_vendor.p({
              nodes: child
            }),
            c: idx
          };
        }),
        s: common_vendor.n(item.classStr),
        t: common_vendor.s(item.styleStr)
      } : item.tag == "video" ? {
        w: common_vendor.n(item.classStr),
        x: common_vendor.n(`fuiParse-${item.tag}-video`),
        y: item.attr && item.attr.src,
        z: common_vendor.n(item.classStr),
        A: common_vendor.n(`fuiParse-${item.tag}`),
        B: common_vendor.s(item.styleStr)
      } : item.tag == "img" ? common_vendor.e({
        D: item.attr && item.attr.src
      }, item.attr && item.attr.src ? {
        E: common_vendor.n(item.classStr),
        F: common_vendor.n(`fuiParse-${item.tag}`),
        G: common_vendor.n(item.loaded ? "fuiParse-img-fadein" : ""),
        H: item.from,
        I: item.attr.src,
        J: item.imgIndex,
        K: item.loaded ? item.attr.src : "",
        L: common_vendor.o((...args) => $options.fuiParseImgTap && $options.fuiParseImgTap(...args), index),
        M: $data.mode,
        N: common_vendor.s("width:" + (item.attr.width || $data.width) + "px;height:" + (item.attr.height || $data.height) + "px;" + item.styleStr),
        O: item.loaded ? 1 : "",
        P: $data.mode,
        Q: item.from,
        R: index,
        S: item.attr.src,
        T: common_vendor.o((...args) => $options.fuiParseImgLoad && $options.fuiParseImgLoad(...args), index)
      } : {}) : item.tag == "a" ? {
        V: common_vendor.f(item.nodes, (child, idx, i1) => {
          return {
            a: "231dc595-5-" + i0 + "-" + i1,
            b: common_vendor.p({
              nodes: child
            }),
            c: idx
          };
        }),
        W: common_vendor.o((...args) => $options.fuiParseTagATap && $options.fuiParseTagATap(...args), index),
        X: common_vendor.n(item.classStr),
        Y: common_vendor.n(`fuiParse-${item.tag}`),
        Z: item.attr && item.attr.title,
        aa: item.attr && item.attr.href,
        ab: common_vendor.s(item.styleStr)
      } : item.tag == "table" ? {
        ad: common_vendor.f(item.nodes, (child, idx, i1) => {
          return {
            a: "231dc595-6-" + i0 + "-" + i1,
            b: common_vendor.p({
              nodes: child
            }),
            c: idx
          };
        }),
        ae: common_vendor.n(item.classStr),
        af: common_vendor.n(`fuiParse-${item.tag}`)
      } : item.tag == "tr" ? {
        ah: common_vendor.f(item.nodes, (child, idx, i1) => {
          return {
            a: common_vendor.n(child.classStr),
            b: common_vendor.n(`fuiParse-${child.tag}`),
            c: common_vendor.n(`fuiParse-${child.tag}-container`),
            d: common_vendor.n(child.tag == "th" && $data.thBgcolor ? "fuiParse-th__bg" : ""),
            e: common_vendor.s(child.styleStr),
            f: "231dc595-7-" + i0 + "-" + i1,
            g: common_vendor.p({
              nodes: child
            }),
            h: idx
          };
        }),
        ai: common_vendor.n(item.classStr),
        aj: common_vendor.n(`fuiParse-${item.tag}`)
      } : item.tag == "td" ? {
        al: common_vendor.f(item.nodes, (child, idx, i1) => {
          return {
            a: common_vendor.n(child.classStr),
            b: common_vendor.n(`fuiParse-${child.tag}`),
            c: common_vendor.n(`fuiParse-${child.tag}-container`),
            d: common_vendor.s(child.styleStr),
            e: "231dc595-8-" + i0 + "-" + i1,
            f: common_vendor.p({
              nodes: child
            }),
            g: idx
          };
        }),
        am: common_vendor.n(item.classStr),
        an: common_vendor.n(`fuiParse-${item.tag}`)
      } : item.tag == "audio" ? {
        ap: common_vendor.n(item.classStr),
        aq: common_vendor.s(item.styleStr),
        ar: "231dc595-9-" + i0,
        as: common_vendor.p({
          src: item.attr && item.attr.src,
          title: item.attr && item.attr.title,
          desc: item.attr && item.attr.desc
        })
      } : item.tag == "br" ? {} : item.tagType == "block" ? {
        aw: common_vendor.f(item.nodes, (child, idx, i1) => {
          return {
            a: "231dc595-10-" + i0 + "-" + i1,
            b: common_vendor.p({
              nodes: child
            }),
            c: idx
          };
        }),
        ax: common_vendor.n(item.classStr),
        ay: common_vendor.n(`fuiParse-${item.tag}`),
        az: common_vendor.s(item.styleStr)
      } : {
        aA: common_vendor.f(item.nodes, (child, idx, i1) => {
          return {
            a: "231dc595-11-" + i0 + "-" + i1,
            b: common_vendor.p({
              nodes: child
            }),
            c: idx
          };
        }),
        aB: common_vendor.n(item.classStr),
        aC: common_vendor.n(`fuiParse-${item.tag}`),
        aD: common_vendor.n(`fuiParse-${item.tagType}`),
        aE: common_vendor.s(item.styleStr)
      }, {
        d: item && item.tag == "code",
        i: item.tag == "ol",
        m: item.tag == "ul",
        q: item.tag == "li",
        v: item.tag == "video",
        C: item.tag == "img",
        U: item.tag == "a",
        ac: item.tag == "table",
        ag: item.tag == "tr",
        ak: item.tag == "td",
        ao: item.tag == "audio",
        at: item.tag == "br",
        av: item.tagType == "block"
      }) : item.node == "text" ? {
        aG: common_vendor.f(item.textArray, (textItem, idx, i1) => {
          return common_vendor.e({
            a: textItem.node == "text"
          }, textItem.node == "text" ? {
            b: common_vendor.t(textItem.text),
            c: common_vendor.n(textItem.text == "\\n" ? "fuiParse-hide" : "")
          } : textItem.node == "element" ? {
            e: textItem.baseSrc + textItem.text
          } : {}, {
            d: textItem.node == "element",
            f: idx
          });
        }),
        aH: common_vendor.s(item.styleStr)
      } : {}, {
        aF: item.node == "text",
        aI: index
      });
    })
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-231dc595"]]);
wx.createComponent(Component);
const Rjov5oiR55qE5byA5rqQ6aG555uuL215c2VsZi1hY2dpL3NyYy9jb21wb25lbnRzL2ZpcnN0dWkvZnVpLXBhcnNlL2Z1aS1wYXJzZS52dWU = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null
}, Symbol.toStringTag, { value: "Module" }));
