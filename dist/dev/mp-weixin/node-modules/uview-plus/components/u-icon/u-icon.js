"use strict";
const common_vendor = require("../../../../common/vendor.js");
const _sfc_main = {
  name: "u-icon",
  data() {
    return {};
  },
  emits: ["click"],
  mixins: [common_vendor.mpMixin, common_vendor.mixin, common_vendor.props$3],
  computed: {
    uClasses() {
      let classes = [];
      classes.push(this.customPrefix + "-" + this.name);
      if (this.customPrefix == "uicon") {
        classes.push("u-iconfont");
      } else {
        classes.push(this.customPrefix);
      }
      if (this.color && common_vendor.config.type.includes(this.color))
        classes.push("u-icon__icon--" + this.color);
      return classes;
    },
    iconStyle() {
      let style = {};
      style = {
        fontSize: common_vendor.addUnit(this.size),
        lineHeight: common_vendor.addUnit(this.size),
        fontWeight: this.bold ? "bold" : "normal",
        // 某些特殊情况需要设置一个到顶部的距离，才能更好的垂直居中
        top: common_vendor.addUnit(this.top)
      };
      if (this.color && !common_vendor.config.type.includes(this.color))
        style.color = this.color;
      return style;
    },
    // 判断传入的name属性，是否图片路径，只要带有"/"均认为是图片形式
    isImg() {
      return this.name.indexOf("/") !== -1;
    },
    imgStyle() {
      let style = {};
      style.width = this.width ? common_vendor.addUnit(this.width) : common_vendor.addUnit(this.size);
      style.height = this.height ? common_vendor.addUnit(this.height) : common_vendor.addUnit(this.size);
      return style;
    },
    // 通过图标名，查找对应的图标
    icon() {
      if (this.customPrefix !== "uicon")
        return "";
      return common_vendor.icons["uicon-" + this.name] || this.name;
    }
  },
  methods: {
    addStyle: common_vendor.addStyle,
    addUnit: common_vendor.addUnit,
    clickHandler(e) {
      this.$emit("click", this.index, e);
      this.stop && this.preventEvent(e);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $options.isImg
  }, $options.isImg ? {
    b: _ctx.name,
    c: _ctx.imgMode,
    d: common_vendor.s($options.imgStyle),
    e: common_vendor.s($options.addStyle(_ctx.customStyle))
  } : {
    f: common_vendor.t($options.icon),
    g: common_vendor.n($options.uClasses),
    h: common_vendor.s($options.iconStyle),
    i: common_vendor.s($options.addStyle(_ctx.customStyle)),
    j: _ctx.hoverClass
  }, {
    k: _ctx.label !== ""
  }, _ctx.label !== "" ? {
    l: common_vendor.t(_ctx.label),
    m: _ctx.labelColor,
    n: $options.addUnit(_ctx.labelSize),
    o: _ctx.labelPos == "right" ? $options.addUnit(_ctx.space) : 0,
    p: _ctx.labelPos == "bottom" ? $options.addUnit(_ctx.space) : 0,
    q: _ctx.labelPos == "left" ? $options.addUnit(_ctx.space) : 0,
    r: _ctx.labelPos == "top" ? $options.addUnit(_ctx.space) : 0
  } : {}, {
    s: common_vendor.o((...args) => $options.clickHandler && $options.clickHandler(...args)),
    t: common_vendor.n("u-icon--" + _ctx.labelPos),
    v: common_vendor.gei(_ctx, "")
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-1c933a9a"]]);
wx.createComponent(Component);
