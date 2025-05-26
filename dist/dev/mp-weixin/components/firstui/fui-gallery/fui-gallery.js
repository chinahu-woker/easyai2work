"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  name: "fui-gallery",
  emits: ["change", "hide"],
  props: {
    urls: {
      type: Array,
      default() {
        return [];
      }
    },
    srcKey: {
      type: String,
      default: "src"
    },
    descrKey: {
      type: String,
      default: "descr"
    },
    show: {
      type: Boolean,
      default: false
    },
    current: {
      type: [Number, String],
      default: 0
    },
    //文字超出是否省略成一行
    ellipsis: {
      type: Boolean,
      default: false
    },
    zIndex: {
      type: [Number, String],
      default: 1001
    },
    //是否适配底部安全区
    safeArea: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    urls(newVal, oldVal) {
      this.initData(newVal);
    },
    current(newVal) {
      this.defActive = this.active;
      let val = Number(newVal);
      setTimeout(() => {
        this.defActive = val;
        this.active = val;
      }, 20);
    }
  },
  mounted() {
    let sys = common_vendor.index.getSystemInfoSync();
    this.height = sys.windowHeight;
    this.top = sys.statusBarHeight + 20;
    this.defActive = Number(this.current);
    this.active = this.defActive;
    this.initData(this.urls);
  },
  data() {
    let isNvue = false;
    return {
      isNvue,
      imgUrls: [],
      active: 0,
      defActive: 0,
      top: 20,
      descr: "",
      iphoneX: false,
      height: 800
    };
  },
  methods: {
    initData(vals) {
      if (vals && vals.length > 0) {
        if (typeof vals[0] === "string") {
          vals = vals.map((item) => {
            return {
              [this.srcKey]: item
            };
          });
        }
        this.imgUrls = vals;
        this.$nextTick(() => {
          setTimeout(() => {
            this.getDescr(this.active);
          }, 10);
        });
      }
    },
    change(e) {
      this.active = e.detail.current;
      this.getDescr(this.active);
      this.$emit("change", {
        index: this.active
      });
    },
    getDescr(index) {
      let item = this.imgUrls[index];
      if (item) {
        this.descr = item[this.descrKey] || "";
      }
    },
    hideGallery() {
      this.$emit("hide", {});
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.show || !$data.isNvue
  }, $props.show || !$data.isNvue ? common_vendor.e({
    b: common_vendor.f($data.imgUrls, (item, index, i0) => {
      return {
        a: item[$props.srcKey],
        b: common_vendor.o((...args) => $options.hideGallery && $options.hideGallery(...args), index),
        c: index
      };
    }),
    c: $data.height + "px",
    d: $data.height + "px",
    e: $data.height + "px",
    f: $data.height + "px",
    g: common_vendor.o((...args) => $options.change && $options.change(...args)),
    h: $data.defActive,
    i: common_vendor.t($data.active + 1),
    j: common_vendor.t($data.imgUrls.length),
    k: $data.top + "px",
    l: $data.descr
  }, $data.descr ? {
    m: common_vendor.t($data.descr),
    n: $props.ellipsis ? 1 : "",
    o: $data.iphoneX && $props.safeArea ? 1 : ""
  } : {}, {
    p: $props.zIndex,
    q: common_vendor.n($props.show ? "fui-gallery__show" : "fui-gallery__hidden")
  }) : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-c9e13cde"]]);
wx.createComponent(Component);
