"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  name: "fui-tabs",
  emits: ["change"],
  options: {
    virtualHost: true
  },
  props: {
    // 标签页数据源
    tabs: {
      type: Array,
      default() {
        return [];
      }
    },
    nameKey: {
      type: String,
      default: "name"
    },
    badgeKey: {
      type: String,
      default: "badge"
    },
    disabledKey: {
      type: String,
      default: "disabled"
    },
    // 当前选项卡
    current: {
      type: Number,
      default: 0
    },
    // 是否可以滚动
    scroll: {
      type: Boolean,
      default: false
    },
    // tab高度 rpx
    height: {
      type: [Number, String],
      default: 96
    },
    background: {
      type: String,
      default: "#fff"
    },
    //字体大小
    size: {
      type: [Number, String],
      default: 28
    },
    //字体颜色
    color: {
      type: String,
      default: ""
    },
    //选中前字重
    fontWeight: {
      type: [Number, String],
      default: "normal"
    },
    //仅Nvue端生效，代替scale属性
    selectedSize: {
      type: [Number, String],
      default: 32
    },
    //选中后字体颜色
    selectedColor: {
      type: String,
      default: ""
    },
    //选中后字重
    selectedFontWeight: {
      type: [Number, String],
      default: 500
    },
    //选中后字体缩放倍数
    //Nvue端 Android 暂不支持设置overflow:visible，放大后文字超出部分被隐藏
    scale: {
      type: [Number, String],
      default: 1.2
    },
    badgeColor: {
      type: String,
      default: "#fff"
    },
    badgeBackground: {
      type: String,
      default: ""
    },
    isDot: {
      type: Boolean,
      default: false
    },
    isSlider: {
      type: Boolean,
      default: true
    },
    //滑块高度
    sliderHeight: {
      type: [Number, String],
      default: 5
    },
    //滑块背景颜
    sliderBackground: {
      type: String,
      default: ""
    },
    //滑块 radius
    sliderRadius: {
      type: [Number, String],
      default: -1
    },
    //滑块左右padding值
    padding: {
      type: [Number, String],
      default: 0
    },
    //滑块bottom
    bottom: {
      type: [Number, String],
      default: 0
    },
    //滑块是否固定为较短的长度45rpx
    short: {
      type: Boolean,
      default: true
    },
    //滑块是否居中显示
    center: {
      type: Boolean,
      default: false
    },
    //是否固定
    isFixed: {
      type: Boolean,
      default: false
    },
    //吸顶效果，为true时isFixed失效
    isSticky: {
      type: Boolean,
      default: false
    },
    //isFixed或isSticky为true时，tabs top值 px
    top: {
      type: [Number, String],
      default: 0
    },
    //当数据不满一屏时，item项是否靠左对齐，默认均分铺满
    alignLeft: {
      type: Boolean,
      default: false
    },
    //tabs item项排列方式：row、column
    direction: {
      type: String,
      default: "row"
    },
    itemPadding: {
      type: [Number, String],
      default: 32
    },
    zIndex: {
      type: [Number, String],
      default: 996
    }
  },
  watch: {
    tabs(vals) {
      this.initData(vals);
    },
    current(newVal, oldVal) {
      this.switchTab(newVal);
    }
  },
  created() {
    this.initData(this.tabs);
  },
  computed: {
    getSelectedColor() {
      let color = this.selectedColor;
      return color;
    },
    getSliderBgColor() {
      let color = this.sliderBackground;
      return color;
    },
    getBadgeBgColor() {
      let color = this.badgeBackground;
      return color;
    }
  },
  data() {
    let isNvue = false;
    return {
      vals: [],
      scrollInto: "",
      tabIndex: 0,
      isNvue
    };
  },
  methods: {
    getId() {
      return `fui_${Math.ceil(Math.random() * 1e6).toString(36)}`;
    },
    initData(vals) {
      if (vals && vals.length > 0) {
        if (typeof vals[0] === "object") {
          vals.map((item) => {
            const scrollId = this.getId();
            item.fui_s_id = scrollId;
          });
        } else {
          vals = vals.map((item) => {
            const scrollId = this.getId();
            return {
              [this.nameKey]: item,
              fui_s_id: scrollId
            };
          });
        }
        this.vals = vals;
        this.$nextTick(() => {
          setTimeout(() => {
            this.switchTab(this.current);
          }, 50);
        });
      }
    },
    switchTab(index) {
      const item = {
        ...this.vals[index]
      };
      if (this.tabIndex === index || item[this.disabledKey])
        return;
      this.tabIndex = index;
      let scrollIndex = index - 1 < 0 ? 0 : index - 1;
      this.scrollInto = this.vals[scrollIndex].fui_s_id;
      delete item.fui_s_id;
      this.$emit("change", {
        index,
        ...item
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.vals, (tab, index, i0) => {
      return common_vendor.e($props.isSlider ? {
        a: $props.short ? 1 : "",
        b: !$props.short ? 1 : "",
        c: !$options.getSliderBgColor ? 1 : "",
        d: $props.sliderHeight + "rpx",
        e: $options.getSliderBgColor,
        f: $props.sliderRadius == -1 ? $props.sliderHeight + "rpx" : $props.sliderRadius + "rpx",
        g: `scale(${$data.tabIndex === index ? $data.isNvue ? 1 : $props.scale : $data.isNvue ? 1e-5 : 0})`,
        h: $props.center ? 1 : "",
        i: $props.bottom + "rpx",
        j: `-${$props.padding}rpx`,
        k: `-${$props.padding}rpx`
      } : {}, {
        l: tab.icon
      }, tab.icon ? {
        m: $props.direction === "column" ? 1 : "",
        n: $data.tabIndex === index && tab.selectedIcon ? tab.selectedIcon : tab.icon
      } : {}, {
        o: common_vendor.t(tab[$props.nameKey]),
        p: tab[$props.badgeKey]
      }, tab[$props.badgeKey] ? {
        q: common_vendor.t($props.isDot ? "" : tab[$props.badgeKey]),
        r: !$options.getBadgeBgColor ? 1 : "",
        s: $props.isDot ? 1 : "",
        t: !$props.isDot ? 1 : "",
        v: $props.badgeColor,
        w: $options.getBadgeBgColor
      } : {}, {
        x: !$options.getSelectedColor && $data.tabIndex === index ? 1 : "",
        y: !$props.color && $data.tabIndex !== index ? 1 : "",
        z: ($data.tabIndex === index && $data.isNvue ? $props.selectedSize : $props.size) + "rpx",
        A: $data.tabIndex === index ? $options.getSelectedColor : $props.color,
        B: $data.tabIndex === index ? $props.selectedFontWeight : $props.fontWeight,
        C: `scale(${$data.tabIndex === index && !$data.isNvue ? $props.scale : 1})`,
        D: tab[$props.disabledKey] ? 1 : "",
        E: $props.direction === "column" && tab.icon ? 1 : "",
        F: index,
        G: tab.fui_s_id,
        H: common_vendor.o(($event) => $options.switchTab(index), index)
      });
    }),
    b: $props.isSlider,
    c: $props.height + "rpx",
    d: !$props.alignLeft ? 1 : "",
    e: $props.itemPadding + "rpx",
    f: $props.itemPadding + "rpx",
    g: !$props.alignLeft ? 1 : "",
    h: $props.isFixed && !$props.isSticky ? 1 : "",
    i: $props.isSticky ? 1 : "",
    j: $props.scroll,
    k: $data.scrollInto,
    l: $props.background,
    m: $props.isFixed || $props.isSticky ? $props.zIndex : 1,
    n: $props.isFixed || $props.isSticky ? $props.top + "px" : "auto"
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-e6d1c91f"]]);
wx.createComponent(Component);
