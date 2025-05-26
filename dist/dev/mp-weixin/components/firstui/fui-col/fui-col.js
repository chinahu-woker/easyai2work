"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  name: "fui-col",
  options: {
    virtualHost: true
  },
  props: {
    //栅格占据的列数
    span: {
      type: Number,
      default: 24
    },
    //栅格左侧的间隔格数
    offset: {
      type: Number,
      default: 0
    },
    //栅格向右移动格数
    pushLeft: {
      type: Number,
      default: -1
    },
    //栅格向左移动格数
    pullRight: {
      type: Number,
      default: -1
    },
    //max-width:767px 响应式栅格数或者栅格属性对象
    //Number时表示在此屏幕宽度下，栅格占据的列数。Object时可配置多个描述{span: 4, offset: 4}
    xs: {
      type: [Number, Object],
      default: -1
    },
    //max-width:768px 响应式栅格数或者栅格属性对象
    sm: {
      type: [Number, Object],
      default: -1
    },
    //max-width:992px 响应式栅格数或者栅格属性对象
    md: {
      type: [Number, Object],
      default: -1
    },
    //max-width:1200px 响应式栅格数或者栅格属性对象
    lg: {
      type: [Number, Object],
      default: -1
    },
    //max-width:1920px 响应式栅格数或者栅格属性对象
    xl: {
      type: [Number, Object],
      default: -1
    }
  },
  data() {
    return {
      classList: "fui-col",
      gutter: 0,
      sizeClass: "",
      parentWidth: 0,
      nvueWidth: 0,
      marginLeft: 0,
      right: 0,
      left: 0
    };
  },
  created() {
    let parent = this.$parent;
    while (parent && parent.$options.componentName !== "fuiRow") {
      parent = parent.$parent;
    }
    this.updateGutter(parent.gutter);
    parent.$watch("gutter", (gutter) => {
      this.updateGutter(gutter);
    });
    this.updateCol();
  },
  computed: {
    sizeChange() {
      let {
        span,
        offset,
        pullRight,
        pushLeft
      } = this;
      return `${span}-${offset}-${pullRight}-${pushLeft}`;
    }
  },
  watch: {
    sizeChange: {
      immediate: true,
      handler(newVal) {
        this.updateCol();
      }
    }
  },
  methods: {
    updateGutter(parentGutter) {
      parentGutter = Number(parentGutter);
      if (!isNaN(parentGutter)) {
        this.gutter = parentGutter / 2;
      }
    },
    updateCol() {
      let classList = ["fui-col"];
      classList.push("fui-col-" + this.span);
      classList.push("fui-col-offset-" + this.offset);
      if (this.pushLeft !== -1) {
        this.pushLeft && classList.push("fui-col-push-" + this.pushLeft);
      }
      if (this.pullRight !== -1) {
        this.pullRight && classList.push("fui-col-pull-" + this.pullRight);
      }
      this.screenSizeSet("xs", classList);
      this.screenSizeSet("sm", classList);
      this.screenSizeSet("md", classList);
      this.screenSizeSet("lg", classList);
      this.screenSizeSet("xl", classList);
      this.classList = classList;
    },
    screenSizeSet(screen, classList) {
      if (typeof this[screen] === "number" && this[screen] !== -1) {
        classList.push("fui-col-" + screen + "-" + this[screen]);
      } else if (typeof this[screen] === "object") {
        typeof this[screen].offset === "number" && classList.push("fui-col-" + screen + "-offset-" + this[screen].offset);
        typeof this[screen].pushLeft === "number" && classList.push("fui-col-" + screen + "-push-" + this[screen].pushLeft);
        typeof this[screen].pullRight === "number" && classList.push("fui-col-" + screen + "-pull-" + this[screen].pullRight);
        typeof this[screen].span === "number" && classList.push("fui-col-" + screen + "-" + this[screen].span);
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.n($data.classList),
    b: `${Number($data.gutter)}rpx`,
    c: `${Number($data.gutter)}rpx`
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-d8b502e3"]]);
wx.createComponent(Component);
