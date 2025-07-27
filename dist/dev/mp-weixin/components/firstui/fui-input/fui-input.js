"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  name: "fui-input",
  emits: ["input", "update:modelValue", "focus", "blur", "confirm", "click", "keyboardheightchange"],
  //加group是为了避免在表单中使用时给组件加value属性
  behaviors: ["wx://form-field-group"],
  options: {
    addGlobalClass: true,
    virtualHost: true
  },
  props: {
    //是否为必填项
    required: {
      type: Boolean,
      default: false
    },
    requiredColor: {
      type: String,
      default: ""
    },
    //左侧标题
    label: {
      type: String,
      default: ""
    },
    //标题字体大小
    labelSize: {
      type: [Number, String],
      default: 0
    },
    labelColor: {
      type: String,
      default: "#333"
    },
    //label 最小宽度 rpx
    labelWidth: {
      type: [Number, String],
      default: 140
    },
    clearable: {
      type: Boolean,
      default: false
    },
    clearColor: {
      type: String,
      default: "#CCCCCC"
    },
    //获取焦点
    focus: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: ""
    },
    placeholderStyle: {
      type: String,
      default: ""
    },
    //输入框名称
    name: {
      type: String,
      default: ""
    },
    //输入框值 vue2
    value: {
      type: [Number, String],
      default: ""
    },
    //输入框值
    modelValue: {
      type: [Number, String],
      default: ""
    },
    //vue3
    modelModifiers: {
      default: () => ({})
    },
    //兼容写法，type为text时也做Number处理，NaN时返回原值
    number: {
      type: Boolean,
      default: false
    },
    //与官方input type属性一致
    type: {
      type: String,
      default: "text"
    },
    password: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    //V2.1.0+
    disabledStyle: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    maxlength: {
      type: [Number, String],
      default: 140
    },
    min: {
      type: [Number, String],
      default: "NaN"
    },
    max: {
      type: [Number, String],
      default: "NaN"
    },
    cursorSpacing: {
      type: Number,
      default: 0
    },
    confirmType: {
      type: String,
      default: "done"
    },
    confirmHold: {
      type: Boolean,
      default: false
    },
    cursor: {
      type: Number,
      default: -1
    },
    selectionStart: {
      type: Number,
      default: -1
    },
    selectionEnd: {
      type: Number,
      default: -1
    },
    adjustPosition: {
      type: Boolean,
      default: true
    },
    holdKeyboard: {
      type: Boolean,
      default: false
    },
    autoBlur: {
      type: Boolean,
      default: false
    },
    alwaysEmbed: {
      type: Boolean,
      default: false
    },
    size: {
      type: [Number, String],
      default: 0
    },
    color: {
      type: String,
      default: "#333"
    },
    inputBorder: {
      type: Boolean,
      default: false
    },
    isFillet: {
      type: Boolean,
      default: false
    },
    radius: {
      type: [Number, String],
      default: 8
    },
    borderTop: {
      type: Boolean,
      default: false
    },
    topLeft: {
      type: [Number, String],
      default: 0
    },
    topRight: {
      type: [Number, String],
      default: 0
    },
    borderBottom: {
      type: Boolean,
      default: true
    },
    bottomLeft: {
      type: [Number, String],
      default: 32
    },
    bottomRight: {
      type: [Number, String],
      default: 0
    },
    borderColor: {
      type: String,
      default: ""
    },
    trim: {
      type: Boolean,
      default: true
    },
    //即将废弃，请使用textAlign属性
    textRight: {
      type: Boolean,
      default: false
    },
    //V2.2.0+ 可选值：left/center/right
    textAlign: {
      type: String,
      default: "left"
    },
    padding: {
      type: Array,
      default() {
        return ["28rpx", "32rpx"];
      }
    },
    backgroundColor: {
      type: String,
      default: "#FFFFFF"
    },
    marginTop: {
      type: [Number, String],
      default: 0
    }
  },
  data() {
    return {
      placeholderStyl: "",
      focused: false,
      val: ""
    };
  },
  computed: {
    getRadius() {
      let radius = this.radius + "rpx";
      if (this.isFillet) {
        radius = "120px";
      }
      return radius;
    },
    getBorderRadius() {
      let radius = Number(this.radius) * 2 + "rpx";
      if (this.isFillet) {
        radius = "240px";
      }
      return radius;
    },
    getSize() {
      const size = common_vendor.index.$fui && common_vendor.index.$fui.fuiInput && common_vendor.index.$fui.fuiInput.size || 32;
      return `${this.size || size}rpx`;
    },
    getLabelSize() {
      const labelSize = common_vendor.index.$fui && common_vendor.index.$fui.fuiInput && common_vendor.index.$fui.fuiInput.labelSize || 32;
      return `${this.labelSize || labelSize}rpx`;
    },
    dangerColor() {
      const app = common_vendor.index && common_vendor.index.$fui && common_vendor.index.$fui.color;
      return app && app.danger || "#FF2B2B";
    }
  },
  watch: {
    focus(val) {
      this.$nextTick(() => {
        setTimeout(() => {
          this.focused = val;
        }, 20);
      });
    },
    placeholderStyle() {
      this.fieldPlaceholderStyle();
    },
    modelValue(newVal) {
      this.val = newVal;
    },
    value(newVal) {
      this.val = newVal;
    }
  },
  created() {
    this.fieldPlaceholderStyle();
    setTimeout(() => {
      if (this.value && !this.modelValue) {
        this.val = this.value;
      } else {
        this.val = this.modelValue;
      }
    }, 50);
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.focused = this.focus;
      }, 300);
    });
  },
  methods: {
    fieldPlaceholderStyle() {
      if (this.placeholderStyle) {
        this.placeholderStyl = this.placeholderStyle;
      } else {
        const _size = common_vendor.index.$fui && common_vendor.index.$fui.fuiInput && common_vendor.index.$fui.fuiInput.size || 32;
        const size = common_vendor.index.upx2px(this.size || _size);
        this.placeholderStyl = `fontSize:${size}px;`;
      }
    },
    onInput(event) {
      let value = event.detail.value;
      if (this.trim)
        value = this.trimStr(value);
      this.val = value;
      const currentVal = Number(value);
      if ((this.modelModifiers.number || this.number || this.type === "digit" || this.type === "number") && !isNaN(currentVal) && Number.isSafeInteger(currentVal)) {
        let eVal = this.type === "digit" ? value : currentVal;
        if (typeof eVal === "number") {
          const min = Number(this.min);
          const max = Number(this.max);
          if (typeof min === "number" && currentVal < min) {
            eVal = min;
          } else if (typeof max === "number" && max < currentVal) {
            eVal = max;
          }
        }
        value = isNaN(eVal) ? value : eVal;
      }
      this.$nextTick(() => {
        event.detail.value !== "" && (this.val = String(value));
      });
      const inputValue = event.detail.value !== "" ? value : "";
      this.$emit("input", inputValue);
      this.$emit("update:modelValue", inputValue);
    },
    onFocus(event) {
      this.$emit("focus", event);
    },
    onBlur(event) {
      this.$emit("blur", event);
    },
    onConfirm(e) {
      this.$emit("confirm", e);
    },
    onClear(event) {
      if (this.disabled && !this.readonly)
        return;
      common_vendor.index.hideKeyboard();
      this.val = "";
      this.$emit("input", "");
      this.$emit("update:modelValue", "");
    },
    fieldClick() {
      this.$emit("click", {
        name: this.name,
        target: "wrap"
      });
    },
    /**
     * 在安卓nvue上，事件无法冒泡
     * 外层容器点击事件无法触发，需要单独处理
     */
    fieldClickAndroid(e) {
    },
    getParent(name = "fui-form-item") {
      let parent = this.$parent;
      let parentName = parent.$options.name;
      while (parentName !== name) {
        parent = parent.$parent;
        if (!parent)
          return false;
        parentName = parent.$options.name;
      }
      return parent;
    },
    onKeyboardheightchange(e) {
      this.$emit("keyboardheightchange", e.detail);
    },
    trimStr(str) {
      return str.replace(/^\s+|\s+$/g, "");
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.borderTop && !$props.inputBorder
  }, $props.borderTop && !$props.inputBorder ? {
    b: $props.borderColor,
    c: $props.topLeft + "rpx",
    d: $props.topRight + "rpx",
    e: !$props.borderColor ? 1 : ""
  } : {}, {
    f: $props.inputBorder
  }, $props.inputBorder ? {
    g: !$props.borderColor ? 1 : "",
    h: $options.getBorderRadius,
    i: $props.borderColor
  } : {}, {
    j: $props.required
  }, $props.required ? {
    k: $props.requiredColor || $options.dangerColor
  } : {}, {
    l: $props.label
  }, $props.label ? {
    m: common_vendor.t($props.label),
    n: $options.getLabelSize,
    o: $props.labelColor,
    p: $props.labelWidth + "rpx"
  } : {}, {
    q: $props.textRight ? 1 : "",
    r: $props.disabled && $props.disabledStyle ? 1 : "",
    s: $props.disabled ? 1 : "",
    t: $options.getSize,
    v: $props.color,
    w: $props.textRight ? "right" : $props.textAlign,
    x: $props.type,
    y: $props.name,
    z: $data.val,
    A: $data.val ? "" : $props.placeholder,
    B: $props.password || $props.type === "password" || null,
    C: $data.placeholderStyl,
    D: $props.disabled || $props.readonly,
    E: $props.cursorSpacing,
    F: $props.maxlength,
    G: $data.focused,
    H: $props.confirmType,
    I: $props.confirmHold,
    J: $props.cursor,
    K: $props.selectionStart,
    L: $props.selectionEnd,
    M: $props.adjustPosition,
    N: $props.holdKeyboard,
    O: $props.autoBlur,
    P: $props.alwaysEmbed,
    Q: common_vendor.o((...args) => $options.onFocus && $options.onFocus(...args)),
    R: common_vendor.o((...args) => $options.onBlur && $options.onBlur(...args)),
    S: common_vendor.o((...args) => $options.onInput && $options.onInput(...args)),
    T: common_vendor.o((...args) => $options.onConfirm && $options.onConfirm(...args)),
    U: common_vendor.o((...args) => $options.onKeyboardheightchange && $options.onKeyboardheightchange(...args)),
    V: $props.clearable && $data.val != ""
  }, $props.clearable && $data.val != "" ? {
    W: $props.clearColor,
    X: common_vendor.o((...args) => $options.onClear && $options.onClear(...args))
  } : {}, {
    Y: $props.borderBottom && !$props.inputBorder
  }, $props.borderBottom && !$props.inputBorder ? {
    Z: $props.borderColor,
    aa: $props.bottomLeft + "rpx",
    ab: $props.bottomRight + "rpx",
    ac: !$props.borderColor ? 1 : ""
  } : {}, {
    ad: $props.inputBorder ? 1 : "",
    ae: $props.padding[0] || 0,
    af: $props.padding[1] || 0,
    ag: $props.padding[2] || $props.padding[0] || 0,
    ah: $props.padding[3] || $props.padding[1] || 0,
    ai: $props.backgroundColor,
    aj: $props.marginTop + "rpx",
    ak: $options.getRadius,
    al: $props.borderColor,
    am: common_vendor.o((...args) => $options.fieldClick && $options.fieldClick(...args)),
    an: common_vendor.gei(_ctx, "")
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-7ba0827d"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/components/firstui/fui-input/fui-input.js.map
