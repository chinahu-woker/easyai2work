"use strict";
const common_vendor = require("../../../../common/vendor.js");
const _sfc_main = {
  name: "u-slider",
  mixins: [common_vendor.mpMixin, common_vendor.mixin, common_vendor.props$13],
  emits: ["start", "changing", "change", "update:modelValue"],
  data() {
    return {
      startX: 0,
      status: "end",
      newValue: 0,
      distanceX: 0,
      startValue0: 0,
      startValue: 0,
      barStyle0: {},
      barStyle: {},
      sliderRect: {
        left: 0,
        width: 0
      }
    };
  },
  watch: {
    modelValue(n) {
      if (this.status == "end")
        this.updateValue(this.modelValue, false);
    }
  },
  created() {
  },
  async mounted() {
    if (!this.useNative) {
      this.$uGetRect(".u-slider__base").then((rect) => {
        this.sliderRect = rect;
        if (this.sliderRect.width == 0) {
          console.info("如在弹窗等元素中使用，请使用v-if来显示滑块，否则无法计算长度。");
        }
        this.init();
      });
    }
  },
  methods: {
    addStyle: common_vendor.addStyle,
    getPx: common_vendor.getPx,
    init() {
      if (this.isRange) {
        this.updateValue(this.rangeValue[0], false, 0);
        this.updateValue(this.rangeValue[1], false, 1);
      } else {
        this.updateValue(this.modelValue, false);
      }
    },
    // native拖动过程中触发
    changingHandler(e) {
      const {
        value
      } = e.detail;
      this.$emit("update:modelValue", value);
      this.$emit("changing", value);
    },
    // native滑动结束时触发
    changeHandler(e) {
      const {
        value
      } = e.detail;
      this.$emit("update:modelValue", value);
      this.$emit("change", value);
    },
    onTouchStart(event, index = 1) {
      if (this.disabled)
        return;
      this.startX = 0;
      let touches = event.touches[0];
      this.startX = touches.clientX;
      if (this.isRange) {
        this.startValue0 = this.format(this.rangeValue[0], 0);
        this.startValue = this.format(this.rangeValue[1], 1);
      } else {
        this.startValue = this.format(this.modelValue);
      }
      this.status = "start";
      let clientX = 0;
      clientX = touches.clientX;
      this.distanceX = clientX - this.sliderRect.left;
      this.newValue = this.distanceX / this.sliderRect.width * (this.max - this.min) + parseFloat(this.min);
      this.status = "moving";
      this.$emit("changing");
      this.updateValue(this.newValue, true, index);
    },
    onTouchMove(event, index = 1) {
      if (this.disabled)
        return;
      if (this.status == "start")
        this.$emit("start");
      let touches = event.touches[0];
      let clientX = 0;
      clientX = touches.clientX;
      this.distanceX = clientX - this.sliderRect.left;
      this.newValue = this.distanceX / this.sliderRect.width * (this.max - this.min) + parseFloat(this.min);
      this.status = "moving";
      this.$emit("changing");
      this.updateValue(this.newValue, true, index);
    },
    onTouchEnd(event, index = 1) {
      if (this.disabled)
        return;
      if (this.status === "moving") {
        this.updateValue(this.newValue, false, index);
        this.$emit("change");
      }
      this.status = "end";
    },
    onTouchStart2(event, index = 1) {
      if (!this.isRange)
        ;
    },
    onTouchMove2(event, index = 1) {
      if (!this.isRange)
        ;
    },
    onTouchEnd2(event, index = 1) {
      if (!this.isRange)
        ;
    },
    onClick(event) {
      if (this.disabled)
        return;
      let clientX = event.detail.x - this.sliderRect.left;
      this.newValue = clientX / this.sliderRect.width * (this.max - this.min) + parseFloat(this.min);
      this.updateValue(this.newValue, false, 1);
    },
    updateValue(value, drag, index = 1) {
      let valueFormat = this.format(value, index);
      if (valueFormat > this.max) {
        valueFormat = this.max;
      }
      let width = Math.min((valueFormat - this.min) / (this.max - this.min) * this.sliderRect.width, this.sliderRect.width);
      let barStyle = {
        width: width + "px"
      };
      if (drag == true) {
        barStyle.transition = "none";
      } else {
        delete barStyle.transition;
      }
      if (this.isRange) {
        this.rangeValue[index] = valueFormat;
        this.$emit("update:modelValue", this.rangeValue);
      } else {
        this.$emit("update:modelValue", valueFormat);
      }
      switch (index) {
        case 0:
          this.barStyle0 = { ...barStyle };
          break;
        case 1:
          this.barStyle = { ...barStyle };
          break;
      }
    },
    format(value, index = 1) {
      if (this.isRange) {
        switch (index) {
          case 0:
            return Math.round(
              Math.max(this.min, Math.min(value, this.rangeValue[1] - parseInt(this.step), this.max)) / parseInt(this.step)
            ) * parseInt(this.step);
          case 1:
            return Math.round(
              Math.max(this.min, this.rangeValue[0] + parseInt(this.step), Math.min(value, this.max)) / parseInt(this.step)
            ) * parseInt(this.step);
        }
      } else {
        return Math.round(
          Math.max(this.min, Math.min(value, this.max)) / parseInt(this.step)
        ) * parseInt(this.step);
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: !_ctx.useNative || _ctx.isRange
  }, !_ctx.useNative || _ctx.isRange ? common_vendor.e({
    b: common_vendor.s({
      height: _ctx.height,
      backgroundColor: _ctx.inactiveColor
    }),
    c: common_vendor.o((...args) => $options.onClick && $options.onClick(...args)),
    d: common_vendor.s($data.barStyle),
    e: common_vendor.s({
      height: _ctx.height,
      marginTop: "-" + _ctx.height,
      backgroundColor: _ctx.activeColor
    }),
    f: _ctx.isRange
  }, _ctx.isRange ? {
    g: common_vendor.s($data.barStyle0),
    h: common_vendor.s({
      height: _ctx.height,
      marginTop: "-" + _ctx.height,
      backgroundColor: _ctx.inactiveColor
    })
  } : {}, {
    i: _ctx.isRange && _ctx.showValue
  }, _ctx.isRange && _ctx.showValue ? {
    j: common_vendor.t(this.rangeValue[0]),
    k: $options.getPx($data.barStyle0.width) + $options.getPx(_ctx.blockSize) / 2 + "px"
  } : {}, {
    l: _ctx.isRange && _ctx.showValue
  }, _ctx.isRange && _ctx.showValue ? {
    m: common_vendor.t(this.rangeValue[1]),
    n: $options.getPx($data.barStyle.width) + $options.getPx(_ctx.blockSize) / 2 + "px"
  } : {}, {
    o: _ctx.isRange
  }, _ctx.isRange ? common_vendor.e({
    p: _ctx.$slots.default || _ctx.$slots.$default
  }, _ctx.$slots.default || _ctx.$slots.$default ? {} : {
    q: common_vendor.s(_ctx.blockStyle),
    r: common_vendor.s({
      height: $options.getPx(_ctx.blockSize, true),
      width: $options.getPx(_ctx.blockSize, true),
      backgroundColor: _ctx.blockColor
    })
  }, {
    s: common_vendor.o(($event) => $options.onTouchStart($event, 0)),
    t: common_vendor.o(($event) => $options.onTouchMove($event, 0)),
    v: common_vendor.o(($event) => $options.onTouchEnd($event, 0)),
    w: common_vendor.o(($event) => $options.onTouchEnd($event, 0)),
    x: $options.getPx($data.barStyle0.width) + $options.getPx(_ctx.blockSize) / 2 + "px"
  }) : {}, {
    y: _ctx.$slots.default || _ctx.$slots.$default
  }, _ctx.$slots.default || _ctx.$slots.$default ? {} : {
    z: common_vendor.s(_ctx.blockStyle),
    A: common_vendor.s({
      height: $options.getPx(_ctx.blockSize, true),
      width: $options.getPx(_ctx.blockSize, true),
      backgroundColor: _ctx.blockColor
    })
  }, {
    B: common_vendor.o((...args) => $options.onTouchStart && $options.onTouchStart(...args)),
    C: common_vendor.o((...args) => $options.onTouchMove && $options.onTouchMove(...args)),
    D: common_vendor.o((...args) => $options.onTouchEnd && $options.onTouchEnd(...args)),
    E: common_vendor.o((...args) => $options.onTouchEnd && $options.onTouchEnd(...args)),
    F: $options.getPx($data.barStyle.width) + $options.getPx(_ctx.blockSize) / 2 + "px",
    G: common_vendor.o((...args) => $options.onClick && $options.onClick(...args)),
    H: common_vendor.o(($event) => $options.onTouchStart2($event, 1)),
    I: common_vendor.o(($event) => $options.onTouchMove2($event, 1)),
    J: common_vendor.o(($event) => $options.onTouchEnd2($event, 1)),
    K: common_vendor.o(($event) => $options.onTouchEnd2($event, 1)),
    L: common_vendor.n(_ctx.disabled ? "u-slider--disabled" : ""),
    M: _ctx.isRange && _ctx.showValue ? $options.getPx(_ctx.blockSize) + 24 + "px" : $options.getPx(_ctx.blockSize) + "px",
    N: _ctx.showValue && !_ctx.isRange
  }, _ctx.showValue && !_ctx.isRange ? {
    O: common_vendor.t(_ctx.modelValue)
  } : {}) : {
    P: _ctx.min,
    Q: _ctx.max,
    R: _ctx.step,
    S: _ctx.modelValue,
    T: _ctx.activeColor,
    U: _ctx.inactiveColor,
    V: $options.getPx(_ctx.blockSize),
    W: _ctx.blockColor,
    X: _ctx.showValue,
    Y: _ctx.disabled,
    Z: common_vendor.o((...args) => $options.changingHandler && $options.changingHandler(...args)),
    aa: common_vendor.o((...args) => $options.changeHandler && $options.changeHandler(...args))
  }, {
    ab: common_vendor.s($options.addStyle(_ctx.customStyle))
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-3ffc2d59"]]);
wx.createComponent(Component);
