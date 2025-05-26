"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  name: "fui-waterfall-item",
  emits: ["click"],
  inject: ["waterfall"],
  options: {
    virtualHost: true
  },
  props: {
    background: {
      type: String,
      default: "#FFFFFF"
    },
    radius: {
      type: [Number, String],
      default: 16
    },
    src: {
      type: String,
      default: ""
    },
    imgWidth: {
      type: [Number, String],
      default: 0
    },
    //V1.9.8+ 设置图片高度，则不再等图片加载完成后再去渲染
    imgHeight: {
      type: [Number, String],
      default: 0
    },
    webp: {
      type: Boolean,
      default: false
    },
    draggable: {
      type: Boolean,
      default: true
    },
    param: {
      type: [Number, String],
      default: 0
    }
  },
  created() {
    this.src && (this.isSrc = true);
    if (this.waterfall) {
      this.waterfall.childrenArr.push(this);
      if (this.waterfall.itemWidth) {
        this.width = this.waterfall.itemWidth;
      } else {
        this.waterfall.initParam((width) => {
          this.width = width;
        });
      }
    }
  },
  computed: {
    getStyles() {
      const width = this.imgWidth != 0 ? `${this.imgWidth}rpx` : `${this.width}px`;
      let style = `width:${width};border-radius:${this.radius}rpx ${this.radius}rpx 0 0;`;
      if (this.imgHeight != 0) {
        style += `height:${this.imgHeight}rpx;`;
      }
      return style;
    },
    getStyl() {
      let style = this.getStyles;
      if (this.imgHeight == 0 && !this.isLoaded) {
        style += `height:${this.width}px;`;
      }
      return style;
    }
  },
  mounted() {
    if (!this.src || this.imgHeight != 0) {
      this.$nextTick(() => {
        setTimeout(() => {
          this.getWaterfallItemInfo();
        }, 50);
      });
    }
  },
  data() {
    const elId = `fui_${Math.ceil(Math.random() * 1e6).toString(36)}`;
    return {
      elId,
      width: 0,
      height: 0,
      transform: "",
      isShow: false,
      isLoaded: true,
      isSrc: false
    };
  },
  methods: {
    getWaterfallItemInfo() {
      this.getItemHeight((res) => {
        if (this.waterfall) {
          this.waterfall.loadedArr.push("ok");
          if (this.waterfall.childrenArr.length === this.waterfall.loadedArr.length) {
            this.waterfall.startSorting();
          }
        }
      });
    },
    getItemHeight(callback, index = 0) {
      common_vendor.index.createSelectorQuery().in(this).select(`#${this.elId}`).fields({
        size: true
      }, (data) => {
        if (index >= 20)
          return;
        if (data && data.height) {
          this.height = data.height;
          callback && callback(data.height);
        } else {
          index++;
          setTimeout(() => {
            this.getItemHeight(callback, index);
          }, 50);
          return;
        }
      }).exec();
    },
    handleLoad(e) {
      if (this.imgHeight != 0)
        return;
      setTimeout(() => {
        this.getWaterfallItemInfo();
      }, 50);
    },
    handleError(e) {
      this.isLoaded = false;
      if (this.imgHeight != 0)
        return;
      setTimeout(() => {
        this.getWaterfallItemInfo();
      }, 50);
    },
    handleTap() {
      this.$emit("click", {
        param: this.param
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.isSrc
  }, $data.isSrc ? common_vendor.e({
    b: $data.isLoaded
  }, $data.isLoaded ? {
    c: $props.src,
    d: $props.imgHeight != 0 ? "scaleToFill" : "widthFix",
    e: $props.webp,
    f: $props.draggable,
    g: common_vendor.o((...args) => $options.handleLoad && $options.handleLoad(...args)),
    h: common_vendor.o((...args) => $options.handleError && $options.handleError(...args)),
    i: common_vendor.s($options.getStyles)
  } : {}, {
    j: !$data.isLoaded ? 1 : "",
    k: $props.imgHeight != 0 ? 1 : "",
    l: common_vendor.s($options.getStyl)
  }) : {}, {
    m: $data.elId,
    n: $data.isShow ? 1 : "",
    o: $data.width + "px",
    p: $props.background,
    q: $props.radius + "rpx",
    r: $data.transform,
    s: common_vendor.o((...args) => $options.handleTap && $options.handleTap(...args))
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-b64e611d"]]);
wx.createComponent(Component);
