"use strict";
const common_vendor = require("../../common/vendor.js");
const composables_useWorkFlow = require("../../composables/useWorkFlow.js");
if (!Math) {
  Picker();
}
const Picker = () => "./Picker.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "ModeSelect",
  props: /* @__PURE__ */ common_vendor.mergeModels({
    title: { default: "选择大模型" },
    workflow_id: { default: "" },
    options: { default: {} }
  }, {
    "modelValue": {},
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props) {
    const props = __props;
    const selectValue = common_vendor.useModel(__props, "modelValue");
    const modelList = common_vendor.ref([]);
    const handleInitData = async () => {
      if (!props.workflow_id) {
        return;
      }
      const result = await composables_useWorkFlow.getModelListByWorkflowId(props.workflow_id);
      if (result) {
        modelList.value = result;
      }
    };
    handleInitData();
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(($event) => selectValue.value = $event),
        b: common_vendor.p({
          title: _ctx.title,
          options: modelList.value,
          modelValue: selectValue.value
        })
      };
    };
  }
});
wx.createComponent(_sfc_main);
