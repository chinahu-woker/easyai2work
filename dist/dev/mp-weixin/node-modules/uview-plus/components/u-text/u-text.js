"use strict";
const common_vendor = require("../../../../common/vendor.js");
const _sfc_main = {
  name: "up-text",
  mixins: [common_vendor.mpMixin, common_vendor.mixin, common_vendor.value, common_vendor.buttonMixin, common_vendor.openType, common_vendor.props$7],
  emits: ["click"],
  computed: {
    wrapStyle() {
      let style = {
        margin: this.margin,
        justifyContent: this.align === "left" ? "flex-start" : this.align === "center" ? "center" : "flex-end"
      };
      if (this.flex1) {
        style.flex = 1;
        style.width = "100%";
      }
      return style;
    },
    valueStyle() {
      const style = {
        textDecoration: this.decoration,
        fontWeight: this.bold ? "bold" : "normal",
        wordWrap: this.wordWrap,
        fontSize: common_vendor.addUnit(this.size)
      };
      !this.type && (style.color = this.color);
      this.isNvue && this.lines && (style.lines = this.lines);
      this.lineHeight && (style.lineHeight = common_vendor.addUnit(this.lineHeight));
      !this.isNvue && this.block && (style.display = "block");
      return common_vendor.deepMerge(style, common_vendor.addStyle(this.customStyle));
    },
    isNvue() {
      let nvue = false;
      return nvue;
    },
    isMp() {
      let mp = false;
      mp = true;
      return mp;
    }
  },
  data() {
    return {};
  },
  methods: {
    addStyle: common_vendor.addStyle,
    clickHandler(e) {
      if (this.call && this.mode === "phone") {
        common_vendor.index.makePhoneCall({
          phoneNumber: this.text
        });
      }
      this.$emit("click", e);
    }
  }
};
if (!Array) {
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  const _easycom_u_link2 = common_vendor.resolveComponent("u-link");
  (_easycom_u_icon2 + _easycom_u_link2)();
}
const _easycom_u_icon = () => "../u-icon/u-icon.js";
const _easycom_u_link = () => "../u-link/u-link.js";
if (!Math) {
  (_easycom_u_icon + _easycom_u_link)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: _ctx.show
  }, _ctx.show ? common_vendor.e({
    b: _ctx.mode === "price"
  }, _ctx.mode === "price" ? {
    c: common_vendor.n(_ctx.type && `u-text__value--${_ctx.type}`),
    d: common_vendor.s($options.valueStyle)
  } : {}, {
    e: _ctx.prefixIcon
  }, _ctx.prefixIcon ? {
    f: common_vendor.p({
      name: _ctx.prefixIcon,
      customStyle: $options.addStyle(_ctx.iconStyle)
    })
  } : {}, {
    g: _ctx.mode === "link"
  }, _ctx.mode === "link" ? {
    h: $options.valueStyle.fontWeight,
    i: $options.valueStyle.wordWrap,
    j: $options.valueStyle.fontSize,
    k: common_vendor.n(_ctx.type && `u-text__value--${_ctx.type}`),
    l: common_vendor.n(_ctx.lines && `u-line-${_ctx.lines}`),
    m: common_vendor.p({
      text: _ctx.value,
      href: _ctx.href,
      underLine: true
    })
  } : _ctx.openType && $options.isMp ? {
    o: common_vendor.t(_ctx.value),
    p: common_vendor.s($options.valueStyle),
    q: _ctx.index,
    r: _ctx.openType,
    s: common_vendor.o((...args) => _ctx.onGetUserInfo && _ctx.onGetUserInfo(...args)),
    t: common_vendor.o((...args) => _ctx.onContact && _ctx.onContact(...args)),
    v: common_vendor.o((...args) => _ctx.onGetPhoneNumber && _ctx.onGetPhoneNumber(...args)),
    w: common_vendor.o((...args) => _ctx.onError && _ctx.onError(...args)),
    x: common_vendor.o((...args) => _ctx.onLaunchApp && _ctx.onLaunchApp(...args)),
    y: common_vendor.o((...args) => _ctx.onOpenSetting && _ctx.onOpenSetting(...args)),
    z: _ctx.lang,
    A: _ctx.sessionFrom,
    B: _ctx.sendMessageTitle,
    C: _ctx.sendMessagePath,
    D: _ctx.sendMessageImg,
    E: _ctx.showMessageCard,
    F: _ctx.appParameter
  } : {
    G: common_vendor.t(_ctx.value),
    H: common_vendor.s($options.valueStyle),
    I: common_vendor.n(_ctx.type && `u-text__value--${_ctx.type}`),
    J: common_vendor.n(_ctx.lines && `u-line-${_ctx.lines}`)
  }, {
    n: _ctx.openType && $options.isMp,
    K: _ctx.suffixIcon
  }, _ctx.suffixIcon ? {
    L: common_vendor.p({
      name: _ctx.suffixIcon,
      customStyle: $options.addStyle(_ctx.iconStyle)
    })
  } : {}, {
    M: common_vendor.n(_ctx.customClass),
    N: common_vendor.s($options.wrapStyle),
    O: common_vendor.o((...args) => $options.clickHandler && $options.clickHandler(...args))
  }) : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-5fec1d8b"]]);
wx.createComponent(Component);
