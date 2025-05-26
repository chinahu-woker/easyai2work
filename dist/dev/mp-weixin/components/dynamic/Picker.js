"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Math) {
  (MyTitle + TnInput + TnPicker + ParamCard)();
}
const ParamCard = () => "../common/ParamCard.js";
const MyTitle = () => "../common/MyTitle.js";
const TnInput = () => "../../node-modules/@tuniao/tnui-vue3-uniapp/components/input/src/input.js";
const TnPicker = () => "../../node-modules/@tuniao/tnui-vue3-uniapp/components/picker/src/picker.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "Picker",
  props: /* @__PURE__ */ common_vendor.mergeModels({
    title: { default: "请选择" },
    options: { default: {
      selectItems: []
    } }
  }, {
    "modelValue": {},
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props) {
    const show = common_vendor.ref(false);
    const props = __props;
    const pickerData = common_vendor.computed(() => {
      if (!props.options) {
        return [];
      }
      if (Array.isArray(props.options)) {
        if (props.options[0] && props.options[0].title) {
          return props.options.map((item) => ({ label: item.title, value: item.value }));
        }
        if (props.options[0] && typeof props.options[0] !== "object") {
          return props.options.map((item) => ({ label: item, value: item }));
        }
        return props.options;
      }
      if (props.options.selectItems) {
        return props.options.selectItems;
      }
      return [];
    });
    const selected = common_vendor.useModel(__props, "modelValue");
    const handleConfirm = (item) => {
      console.log("confirm", item);
      if (!item)
        return;
      selected.value = item;
      show.value = false;
    };
    const handleCancel = (value) => {
      show.value = false;
    };
    const inputValue = common_vendor.computed(() => {
      var _a;
      return ((_a = pickerData.value.find((item) => item.value === selected.value)) == null ? void 0 : _a.label) || "";
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          title: _ctx.title
        }),
        b: common_vendor.o(($event) => show.value = true),
        c: common_vendor.o(($event) => inputValue.value = $event),
        d: common_vendor.p({
          type: "select",
          placeholder: "请选择",
          modelValue: inputValue.value
        }),
        e: common_vendor.o(handleCancel),
        f: common_vendor.o(handleConfirm),
        g: common_vendor.o(($event) => selected.value = $event),
        h: common_vendor.o(($event) => show.value = $event),
        i: common_vendor.p({
          data: pickerData.value,
          modelValue: selected.value,
          open: show.value
        })
      };
    };
  }
});
wx.createComponent(_sfc_main);
