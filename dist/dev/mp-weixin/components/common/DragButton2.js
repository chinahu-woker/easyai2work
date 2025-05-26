"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "DragButton2",
  props: /* @__PURE__ */ common_vendor.mergeModels({
    disabled: { type: Boolean, default: false },
    canDocking: { type: Boolean, default: true },
    bottomPx: { default: 30 },
    rightPx: { default: 0 }
  }, {
    "modelValue": {
      default: {
        x: 1e4,
        y: 1e4
      }
    },
    "modelModifiers": {}
  }),
  emits: /* @__PURE__ */ common_vendor.mergeModels(["clickBtn"], ["update:modelValue"]),
  setup(__props, { emit: __emit }) {
    const props = __props;
    const windowWidth = common_vendor.ref(0);
    const windowHeight = common_vendor.ref(0);
    const btnWidth = common_vendor.ref(0);
    common_vendor.ref(0);
    const btnPositon = common_vendor.useModel(__props, "modelValue");
    const old = common_vendor.reactive({
      x: 0,
      y: 0
    });
    const getSysInfo = () => {
      let sysInfo = common_vendor.index.getSystemInfoSync();
      windowWidth.value = sysInfo.windowWidth;
      windowHeight.value = sysInfo.windowHeight;
      btnPositon.value.x = sysInfo.windowWidth - props.rightPx;
      btnPositon.value.y = sysInfo.windowHeight - props.bottomPx - 300;
    };
    common_vendor.onLoad(() => {
      common_vendor.nextTick$1(() => {
        getSysInfo();
      });
    });
    const onChange = (e) => {
      old.x = e.detail.x;
      old.y = e.detail.y;
    };
    const isRemove = common_vendor.ref(true);
    const touchstart = (e) => {
      isRemove.value = true;
    };
    const touchend = (e) => {
      if (props.canDocking && old.x !== void 0) {
        btnPositon.value.x = old.x;
        btnPositon.value.y = old.y;
        let bWidth = (windowWidth.value - btnWidth.value) / 2;
        console.log("bwidth", bWidth);
        if (btnPositon.value.x <= 0 || btnPositon.value.x >= 0 && btnPositon.value.x <= bWidth) {
          common_vendor.nextTick$1((res) => {
            btnPositon.value.x = 0;
          });
        } else {
          common_vendor.nextTick$1((res) => {
            btnPositon.value.x = windowWidth.value - btnWidth.value;
          });
        }
        isRemove.value = false;
      }
    };
    const emit = __emit;
    const clickBtn = () => {
      emit("clickBtn", null);
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.n(!isRemove.value ? "animation-info" : ""),
        b: common_vendor.o(clickBtn),
        c: common_vendor.o(touchstart),
        d: common_vendor.o(touchend),
        e: common_vendor.o(onChange),
        f: btnPositon.value.x,
        g: btnPositon.value.y,
        h: _ctx.disabled
      };
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-04def0fd"]]);
wx.createComponent(Component);
