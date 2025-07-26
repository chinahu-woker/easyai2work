"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  name: "fui-checkbox-group",
  emits: ["change", "input", "update:modelValue"],
  behaviors: ["wx://form-field-group"],
  props: {
    name: {
      type: String,
      default: ""
    },
    modelValue: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      vals: ""
    };
  },
  watch: {
    modelValue(vals) {
      this.modelChange(vals);
    }
  },
  created() {
    this.childrens = [];
  },
  methods: {
    checkboxChange(e) {
      this.$emit("change", e);
      this.$emit("input", e.detail.value);
      this.$emit("update:modelValue", e.detail.value);
    },
    changeValue(checked, target) {
      const vals = [];
      this.childrens.forEach((item) => {
        if (item.val) {
          vals.push(item.value);
        }
      });
      this.vals = vals;
      let e = {
        detail: {
          value: vals
        }
      };
      this.checkboxChange(e);
    },
    modelChange(vals) {
      this.childrens.forEach((item) => {
        if (vals.includes(item.value)) {
          item.val = true;
        } else {
          item.val = false;
        }
      });
    }
  }
};
if (!Array) {
  const _easycom_fui_form_field2 = common_vendor.resolveComponent("fui-form-field");
  _easycom_fui_form_field2();
}
const _easycom_fui_form_field = () => "../fui-form-field/fui-form-field.js";
if (!Math) {
  _easycom_fui_form_field();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o(($event) => $data.vals = $event),
    b: common_vendor.p({
      name: $props.name,
      modelValue: $data.vals
    }),
    c: common_vendor.gei(_ctx, "")
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
