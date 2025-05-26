"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  name: "fui-avatar",
  emits: ["click", "error"],
  props: {
    src: {
      type: String,
      default: ""
    },
    errorSrc: {
      type: String,
      default: ""
    },
    mode: {
      type: String,
      default: "widthFix"
    },
    //微信小程序、百度小程序、字节跳动小程序
    //图片懒加载。只针对page与scroll-view下的image有效
    lazyLoad: {
      type: Boolean,
      default: true
    },
    //默认不解析 webP 格式，只支持网络资源 微信小程序2.9.0
    webp: {
      type: Boolean,
      default: false
    },
    background: {
      type: String,
      default: "#D1D1D1"
    },
    //small（64）、middle（96）、large（128）
    size: {
      type: String,
      default: "middle"
    },
    //图片宽度，设置大于0的数值生效，默认使用size
    width: {
      type: [Number, String],
      default: 0
    },
    //默认等宽，设置图大于0的数值且设置了图片宽度生效
    height: {
      type: [Number, String],
      default: 0
    },
    //指定头像的形状，可选值为 circle、square
    shape: {
      type: String,
      default: "circle"
    },
    //图片圆角值，默认使用shape，当设置大于等于0的数值，shape失效
    radius: {
      type: [Number, String],
      default: -1
    },
    //没有src时可以使用文本代替
    text: {
      type: String,
      default: ""
    },
    color: {
      type: String,
      default: "#fff"
    },
    //默认使用size下字体大小
    fontSize: {
      type: [Number, String],
      default: 0
    },
    fontWeight: {
      type: [Number, String],
      default: 600
    },
    marginRight: {
      type: [Number, String],
      default: 0
    },
    marginBottom: {
      type: [Number, String],
      default: 0
    },
    //在列表中的索引值
    index: {
      type: Number,
      default: 0
    },
    //其他参数
    params: {
      type: [Number, String],
      default: 0
    }
  },
  computed: {
    wrapStyles() {
      return `background:${this.background};margin-right:${this.marginRight}rpx;margin-bottom:${this.marginBottom}rpx;${this.styles}`;
    },
    styles() {
      let styles = "";
      if (this.width) {
        styles = `width:${this.width}rpx;height:${this.height || this.width}rpx;`;
      }
      if (this.radius !== -1) {
        styles += `border-radius:${this.radius}rpx;`;
      }
      return styles;
    },
    textStyles() {
      let styles = `color:${this.color};font-weight:${this.fontWeight};`;
      if (this.fontSize) {
        styles += `font-size:${this.fontSize}rpx;`;
      }
      return styles;
    }
  },
  watch: {
    src(val) {
      this.src && (this.showImg = this.src);
    }
  },
  data() {
    return {
      showImg: ""
    };
  },
  created() {
    this.src && (this.showImg = this.src);
  },
  methods: {
    handleError(e) {
      if (this.src) {
        this.errorSrc && (this.showImg = this.errorSrc);
        this.$emit("error", {
          index: this.index,
          params: this.params
        });
      }
    },
    handleClick() {
      this.$emit("click", {
        index: this.index,
        params: this.params
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.src
  }, $props.src ? {
    b: common_vendor.s($options.styles),
    c: common_vendor.n($props.radius === -1 ? "fui-avatar__" + $props.shape : ""),
    d: common_vendor.n($props.width ? "" : "fui-avatar__size-" + $props.size),
    e: $data.showImg,
    f: $props.mode,
    g: $props.webp,
    h: $props.lazyLoad,
    i: common_vendor.o((...args) => $options.handleError && $options.handleError(...args))
  } : {}, {
    j: !$props.src && $props.text
  }, !$props.src && $props.text ? {
    k: common_vendor.t($props.text),
    l: common_vendor.n($props.width ? "" : "fui-avatar__text-" + $props.size),
    m: common_vendor.s($options.textStyles)
  } : {}, {
    n: common_vendor.n($props.width ? "" : "fui-avatar__size-" + $props.size),
    o: common_vendor.n($props.radius === -1 ? "fui-avatar__" + $props.shape : ""),
    p: common_vendor.s($options.wrapStyles),
    q: common_vendor.o((...args) => $options.handleClick && $options.handleClick(...args))
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-cde923ba"]]);
wx.createComponent(Component);
