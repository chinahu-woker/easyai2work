"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Math) {
  (MyTitle + TnIcon + ParamCard)();
}
const ParamCard = () => "../common/ParamCard.js";
const MyTitle = () => "../common/MyTitle.js";
const TnIcon = () => "../../node-modules/@tuniao/tnui-vue3-uniapp/components/icon/src/icon.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "ImageSelectPreview",
  props: /* @__PURE__ */ common_vendor.mergeModels({
    title: { default: "选择风格" },
    options: {}
  }, {
    "modelValue": { default: null },
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props) {
    const props = __props;
    common_vendor.onLoad(() => {
    });
    const selectedValue = common_vendor.useModel(__props, "modelValue");
    const selectedIndex = common_vendor.ref(0);
    common_vendor.watch(selectedIndex, () => {
      selectedValue.value = images.value[selectedIndex.value].value;
    });
    const images = common_vendor.computed(() => {
      if (!props.options)
        return [];
      if (typeof props.options === "string" && Array.isArray(JSON.parse(props.options))) {
        return JSON.parse(props.options);
      }
      if (Array.isArray(props.options)) {
        return props.options;
      }
      const options = props.options;
      if (options.imageSelectItems) {
        return options.imageSelectItems;
      } else {
        return [];
      }
    });
    common_vendor.computed(() => {
      return images.value[selectedIndex.value];
    });
    const selectImage = (index) => {
      selectedIndex.value = index;
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          title: _ctx.title
        }),
        b: common_vendor.f(images.value, (image, index, i0) => {
          return common_vendor.e({
            a: selectedIndex.value === index ? 1 : "",
            b: image.src,
            c: common_vendor.t(image.title),
            d: index === selectedIndex.value
          }, index === selectedIndex.value ? {
            e: "a0679471-2-" + i0 + ",a0679471-0",
            f: common_vendor.p({
              name: "check"
            })
          } : {}, {
            g: index,
            h: selectedIndex.value === index ? 1 : "",
            i: common_vendor.o(($event) => selectImage(index), index)
          });
        })
      };
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-a0679471"]]);
wx.createComponent(Component);
