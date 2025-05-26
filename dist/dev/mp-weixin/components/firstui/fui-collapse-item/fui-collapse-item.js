"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  name: "fui-collapse-item",
  emits: ["change"],
  props: {
    //item项索引或者唯一标识
    index: {
      type: [Number, String],
      default: 0
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    background: {
      type: String,
      default: "#fff"
    },
    //是否显示动画,如果动画卡顿严重建议不开启
    animation: {
      type: Boolean,
      default: true
    },
    // 是否展开
    open: {
      type: Boolean,
      default: false
    },
    isBorder: {
      type: Boolean,
      default: true
    },
    borderColor: {
      type: String,
      default: ""
    },
    borderLeft: {
      type: [Number, String],
      default: 0
    },
    arrow: {
      type: Boolean,
      default: true
    },
    arrowColor: {
      type: String,
      default: "#B2B2B2"
    },
    arrowRight: {
      type: [Number, String],
      default: 24
    },
    contentBg: {
      type: String,
      default: "#fff"
    },
    marginTop: {
      type: [Number, String],
      default: 0
    },
    marginBottom: {
      type: [Number, String],
      default: 0
    }
  },
  data() {
    const elId = `fui_${Math.ceil(Math.random() * 1e6).toString(36)}`;
    return {
      isOpen: false,
      isHeight: null,
      height: 0,
      elId
    };
  },
  watch: {
    open(val) {
      this.isOpen = val;
    }
  },
  updated(e) {
    this.$nextTick(() => {
      setTimeout(() => {
        this.init();
      }, 50);
    });
  },
  created() {
    this.collapse = this.getCollapse();
    if (this.collapse && this.collapse.children.indexOf(this) === -1) {
      this.collapse.children.push(this);
    }
    this.oldHeight = 0;
  },
  // TODO vue3
  beforeUnmount() {
    this.uninstall();
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.init();
        this.isOpen = this.open;
      }, 50);
    });
  },
  methods: {
    init() {
      this.getCollapseHeight();
    },
    uninstall() {
      if (this.collapse) {
        this.collapse.children.forEach((item, index) => {
          if (item === this) {
            this.collapse.children.splice(index, 1);
          }
        });
      }
    },
    onClick(isOpen) {
      if (this.disabled)
        return;
      this.isOpen = isOpen;
      if (this.collapse) {
        this.collapse.collapseChange(this, isOpen, this.index);
      } else {
        this.$emit("change", {
          index: this.index,
          isOpen
        });
      }
    },
    getCollapseHeight(index = 0) {
      common_vendor.index.createSelectorQuery().in(this).select(`#${this.elId}`).fields({
        size: true
      }, (data) => {
        if (index >= 10)
          return;
        if (!data) {
          index++;
          this.getCollapseHeight(index);
          return;
        }
        this.height = data.height;
        this.isHeight = true;
      }).exec();
    },
    getNvueHeight() {
      dom.getComponentRect(this.$refs["fui_collapse__el"], (option) => {
        if (option && option.result && option.size) {
          this.height = option.size.height;
          this.isHeight = true;
        }
      });
    },
    getCollapse(name = "fui-collapse") {
      let parent = this.$parent;
      let parentName = parent.$options.name;
      while (parentName !== name) {
        parent = parent.$parent;
        if (!parent)
          return false;
        parentName = parent.$options.name;
      }
      return parent;
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.arrow
  }, $props.arrow ? {
    b: $props.arrowColor,
    c: !$data.isOpen ? 1 : "",
    d: $data.isOpen ? 1 : "",
    e: $props.animation ? 1 : "",
    f: $props.arrowRight + "rpx"
  } : {}, {
    g: $props.isBorder
  }, $props.isBorder ? {
    h: $props.borderColor,
    i: $props.borderLeft + "rpx",
    j: !$props.borderColor ? 1 : ""
  } : {}, {
    k: common_vendor.o(($event) => $options.onClick(!$data.isOpen)),
    l: $props.disabled ? 1 : "",
    m: $props.background,
    n: $data.elId,
    o: $data.isHeight ? 1 : "",
    p: $props.animation ? 1 : "",
    q: ($data.isOpen ? $data.height : 0) + "px",
    r: $props.contentBg,
    s: $props.marginTop + "rpx",
    t: $props.marginBottom + "rpx"
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-215c8d17"]]);
wx.createComponent(Component);
