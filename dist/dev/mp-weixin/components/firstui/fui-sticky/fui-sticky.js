"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  name: "fui-sticky",
  emits: ["sticky"],
  options: {
    virtualHost: true
  },
  props: {
    top: {
      type: [Number, String],
      default: 0
    },
    range: {
      type: Boolean,
      default: false
    },
    scrollTop: {
      type: Number,
      default: 0
    },
    zIndex: {
      type: [Number, String],
      default: 999
    },
    width: {
      type: [Number, String],
      default: 750
    },
    param: {
      type: [Number, String],
      default: 0
    }
  },
  computed: {
    getStyles() {
      let styles = "";
      if (!this.range) {
        styles += `top:${this.top}px;z-index:${this.zIndex};`;
      }
      return styles;
    },
    getStyle() {
      let styles = "";
      if (this.range) {
        styles = `top:${this.top}px;z-index:${this.zIndex};`;
      }
      return styles;
    }
  },
  watch: {
    scrollTop(val) {
      this.updateStickyChange();
    }
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.init(() => {
          this.updateStickyChange();
        });
      }, 50);
    });
  },
  updated(e) {
    this.$nextTick(() => {
      this.init(() => {
        this.updateStickyChange();
      });
    });
  },
  data() {
    const elId = `fui_${Math.ceil(Math.random() * 1e6).toString(36)}`;
    return {
      elId,
      timer: null,
      elTop: 0,
      height: 0,
      isFixed: false
    };
  },
  methods: {
    updateStickyChange() {
      const et = this.elTop;
      const h = this.height;
      const st = this.scrollTop;
      const t = this.top;
      if (this.range) {
        this.isFixed = st + t >= et && st + t < et + h ? true : false;
      } else {
        this.isFixed = st + t >= et ? true : false;
      }
      this.$emit("sticky", {
        isFixed: this.isFixed,
        param: this.param
      });
    },
    init(callback) {
      const elId = `#${this.elId}`;
      common_vendor.index.createSelectorQuery().in(this).select(elId).fields({
        size: true,
        rect: true
      }, (res) => {
        if (res) {
          this.elTop = res.top + (this.scrollTop || 0);
          this.height = res.height;
          callback && callback();
        }
      }).exec();
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $props.range ? 1 : "",
    b: !$props.range && $data.isFixed ? 1 : "",
    c: common_vendor.s($options.getStyle),
    d: !$props.range ? 1 : "",
    e: common_vendor.s($options.getStyles),
    f: $data.elId
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-1f0bba76"]]);
wx.createComponent(Component);
