"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  name: "fui-progress",
  emits: ["activeend"],
  props: {
    percent: {
      type: [Number, String],
      default: 0
    },
    height: {
      type: [Number, String],
      default: 8
    },
    radius: {
      type: [Number, String],
      default: 8
    },
    showInfo: {
      type: Boolean,
      default: false
    },
    //右侧百分比字体大小 rpx
    size: {
      type: [Number, String],
      default: 28
    },
    //右侧百分比颜色
    color: {
      type: String,
      default: "#333"
    },
    //右侧百分比宽度
    percentWidth: {
      type: [Number, String],
      default: 96
    },
    //未选择的进度条的颜色
    background: {
      type: String,
      default: "#CCCCCC"
    },
    //已选进度条颜色,可渐变
    activeColor: {
      type: String,
      default: ""
    },
    //进度增加1%所需毫秒数
    duration: {
      type: [Number, String],
      default: 15
    }
  },
  watch: {
    percent(val) {
      this.darwProgress();
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.darwProgress();
    });
  },
  computed: {
    getActiveColor() {
      let color = this.activeColor;
      return color;
    }
  },
  data() {
    return {
      percentage: 0,
      translateX: "-100%",
      time: 0
    };
  },
  methods: {
    darwProgress() {
      let percent = Number(this.percent);
      percent = percent > 100 ? 100 : percent;
      this.time = Number(this.duration) * Math.abs(percent - this.percentage) / 1e3;
      if (percent < this.percentage && this.percentage - percent > 30) {
        this.time = this.time / 2;
      }
      this.percentage = percent;
      this.translateX = 100 - percent + "%";
      setTimeout(() => {
        this.$emit("activeend", {});
      }, this.time);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: !$props.activeColor ? 1 : "",
    b: $options.getActiveColor,
    c: `translate3d(-${$data.translateX},0,0)`,
    d: `${$data.time}s`,
    e: $props.height + "rpx",
    f: $props.radius + "rpx",
    g: $props.background,
    h: $props.showInfo
  }, $props.showInfo ? {
    i: common_vendor.t($data.percentage),
    j: $props.percentWidth + "rpx",
    k: $props.size + "rpx",
    l: $props.color
  } : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-c4450786"]]);
wx.createComponent(Component);
