"use strict";
const common_vendor = require("../../../common/vendor.js");
const components_firstui_fuiFab_mpjs = require("./mpjs.js");
const components_firstui_fuiFab_bindingx = require("./bindingx.js");
const block0 = {};
const _sfc_main = {
  name: "fui-fab",
  mixins: [components_firstui_fuiFab_mpjs.mpjs, components_firstui_fuiFab_bindingx.bindingx],
  emits: ["click", "change", "opensetting", "launchapp", "contact"],
  // components:{
  // 	fuiIcon
  // },
  props: {
    fabs: {
      type: Array,
      default() {
        return [];
      }
    },
    nameKey: {
      type: String,
      default: "name"
    },
    srcKey: {
      type: String,
      default: "src"
    },
    textKey: {
      type: String,
      default: "text"
    },
    position: {
      type: String,
      default: "right"
    },
    distance: {
      type: [Number, String],
      default: 80
    },
    bottom: {
      type: [Number, String],
      default: 120
    },
    width: {
      type: [Number, String],
      default: 108
    },
    background: {
      type: String,
      default: ""
    },
    color: {
      type: String,
      default: "#fff"
    },
    mask: {
      type: Boolean,
      default: true
    },
    maskBackground: {
      type: String,
      default: "rgba(0,0,0,.6)"
    },
    maskClosable: {
      type: Boolean,
      default: false
    },
    zIndex: {
      type: [Number, String],
      default: 99
    },
    //V1.9.8+
    isDrag: {
      type: Boolean,
      default: false
    },
    //v2.3.0+
    openType: {
      type: String,
      default: ""
    },
    appParameter: {
      type: String,
      default: ""
    },
    lang: {
      type: String,
      default: "en"
    },
    sessionFrom: {
      type: String,
      default: ""
    },
    sendMessageTitle: {
      type: String,
      default: ""
    },
    sendMessagePath: {
      type: String,
      default: ""
    },
    sendMessageImg: {
      type: String,
      default: ""
    },
    showMessageCard: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    getStyles() {
      let styles = `bottom:${this.bottom}rpx;z-index:${this.zIndex};`;
      if (this.position === "left") {
        styles += `left:${this.distance}rpx;`;
      } else {
        styles += `right:${this.distance}rpx;`;
      }
      return styles;
    },
    getStyle() {
      return `background:${this.maskBackground};z-index:${Number(this.zIndex) - 10};`;
    },
    getBgColor() {
      let color = this.background;
      return color;
    }
  },
  watch: {
    isShow(val) {
      this.$emit("change", {
        isShow: val
      });
    },
    position(val) {
      this.resetNum++;
      this.$nextTick(() => {
        setTimeout(() => {
          this._getSize();
        }, 80);
      });
    }
  },
  data() {
    let isApp = 0;
    return {
      isApp,
      isShow: false,
      isHidden: true,
      timer: null,
      maxWidth: 0,
      maxHeight: 0,
      eLeft: 0,
      eTop: 0,
      resetNum: 0
    };
  },
  beforeUnmount() {
    clearTimeout(this.timer);
    this.timer = null;
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        this._getSize();
      }, 50);
    });
  },
  methods: {
    stop() {
    },
    _getSize() {
      if (!this.isDrag)
        return;
      const sys = common_vendor.index.getSystemInfoSync();
      common_vendor.index.createSelectorQuery().in(this).select(".fui-fab__btn-wrap").boundingClientRect().exec((ret) => {
        if (ret) {
          this.maxWidth = sys.windowWidth - ret[0].width - ret[0].left;
          this.maxHeight = sys.windowHeight - ret[0].height - ret[0].top;
          this.eLeft = ret[0].left || 0;
          this.eTop = ret[0].top || 0;
        }
      });
    },
    handleClick: function(e, index) {
      this.isHidden = false;
      clearTimeout(this.timer);
      this.$nextTick(() => {
        if (index === -1 && this.fabs.length > 0) {
          this.isShow = !this.isShow;
        } else {
          this.$emit("click", {
            index
          });
          this.isShow = false;
        }
        if (!this.isShow) {
          this.timer = setTimeout(() => {
            this.isHidden = true;
          }, 250);
        }
      });
    },
    maskClick(e) {
      if (!this.maskClosable)
        return;
      this.isShow = false;
      this.timer = setTimeout(() => {
        this.isHidden = true;
      }, 250);
    },
    bindopensetting({
      detail = {}
    } = {}) {
      this.$emit("opensetting", detail);
    },
    bindlaunchapp({
      detail = {}
    } = {}) {
      this.$emit("launchapp", detail);
    },
    bindcontact({
      detail = {}
    } = {}) {
      this.$emit("contact", detail);
    }
  }
};
if (!Array) {
  const _easycom_fui_icon2 = common_vendor.resolveComponent("fui-icon");
  _easycom_fui_icon2();
}
const _easycom_fui_icon = () => "../fui-icon/fui-icon.js";
if (!Math) {
  _easycom_fui_icon();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.mask
  }, $props.mask ? {
    b: $data.isShow ? 1 : "",
    c: common_vendor.s($options.getStyle),
    d: common_vendor.o((...args) => $options.maskClick && $options.maskClick(...args))
  } : {}, {
    e: common_vendor.f($props.fabs, (btn, idx, i0) => {
      return common_vendor.e({
        a: btn[$props.textKey]
      }, btn[$props.textKey] ? {
        b: common_vendor.t(btn[$props.textKey]),
        c: (btn.size || 32) + "rpx",
        d: btn.color || "#fff",
        e: $props.position === "left" ? "left" : "right"
      } : {}, {
        f: btn[$props.nameKey]
      }, btn[$props.nameKey] ? {
        g: "2c25f223-0-" + i0,
        h: common_vendor.p({
          name: btn[$props.nameKey],
          color: btn.abbrColor || "#fff",
          size: btn.abbrSize || 64
        })
      } : {}, {
        i: !btn[$props.nameKey] && btn[$props.srcKey]
      }, !btn[$props.nameKey] && btn[$props.srcKey] ? {
        j: btn[$props.srcKey],
        k: (btn.width || 56) + "rpx",
        l: (btn.height || 56) + "rpx",
        m: (btn.radius || 0) + "rpx"
      } : {}, {
        n: !btn[$props.nameKey] && !btn[$props.srcKey] && btn.abbr
      }, !btn[$props.nameKey] && !btn[$props.srcKey] && btn.abbr ? {
        o: common_vendor.t(btn.abbr),
        p: (btn.abbrSize || 36) + "rpx",
        q: (btn.abbrSize || 36) + "rpx",
        r: btn.abbrColor || "#fff"
      } : {}, {
        s: !$options.getBgColor && !btn.background ? 1 : "",
        t: btn.background || $options.getBgColor,
        v: btn.openType
      }, btn.openType ? {
        w: btn.openType,
        x: btn.appParameter,
        y: btn.lang,
        z: btn.sessionFrom,
        A: btn.sendMessageTitle,
        B: btn.sendMessagePath,
        C: btn.sendMessageImg,
        D: btn.showMessageCard,
        E: common_vendor.o((...args) => $options.bindcontact && $options.bindcontact(...args), idx),
        F: common_vendor.o((...args) => $options.bindopensetting && $options.bindopensetting(...args), idx),
        G: common_vendor.o((...args) => $options.bindlaunchapp && $options.bindlaunchapp(...args), idx)
      } : {}, {
        H: idx,
        I: common_vendor.o(($event) => $options.handleClick($event, idx), idx)
      });
    }),
    f: $props.width + "rpx",
    g: $props.width + "rpx",
    h: common_vendor.n($props.position === "left" ? "fui-fab__button-left" : "fui-fab__button-right"),
    i: $data.isHidden ? 1 : "",
    j: $data.isShow ? 1 : "",
    k: $props.position === "left" ? 1 : "",
    l: $props.position === "right" ? 1 : "",
    m: common_vendor.p({
      name: "plus",
      color: $props.color,
      size: 80
    }),
    n: $data.isShow ? 1 : "",
    o: $props.openType
  }, $props.openType ? {
    p: $props.openType,
    q: $props.appParameter,
    r: $props.lang,
    s: $props.sessionFrom,
    t: $props.sendMessageTitle,
    v: $props.sendMessagePath,
    w: $props.sendMessageImg,
    x: $props.showMessageCard,
    y: common_vendor.o((...args) => $options.bindcontact && $options.bindcontact(...args)),
    z: common_vendor.o((...args) => $options.bindopensetting && $options.bindopensetting(...args)),
    A: common_vendor.o((...args) => $options.bindlaunchapp && $options.bindlaunchapp(...args))
  } : {}, {
    B: !$options.getBgColor ? 1 : "",
    C: $props.width + "rpx",
    D: $props.width + "rpx",
    E: $options.getBgColor,
    F: common_vendor.o(($event) => $options.handleClick($event, -1)),
    G: $props.isDrag ? 0 : 1,
    H: $data.maxWidth,
    I: $data.maxHeight,
    J: $data.eLeft,
    K: $data.eTop,
    L: $data.isApp,
    M: $data.resetNum,
    N: common_vendor.n($props.position === "left" ? "fui-fab__wrap-left" : "fui-fab__wrap-right"),
    O: common_vendor.s($options.getStyles),
    P: common_vendor.o((...args) => $options.stop && $options.stop(...args))
  });
}
if (typeof block0 === "function")
  block0(_sfc_main);
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-2c25f223"]]);
wx.createComponent(Component);
