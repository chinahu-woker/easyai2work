"use strict";
const common_vendor = require("../../common/vendor.js");
const types_index = require("../../types/index.js");
const composables_useCommon = require("../../composables/useCommon.js");
const composables_usePayment = require("../../composables/usePayment.js");
const composables_useWorkFlow = require("../../composables/useWorkFlow.js");
const stores_appStore = require("../../stores/appStore.js");
const utils_emitter = require("../../utils/emitter.js");
const types_event_types = require("../../types/event.types.js");
const utils_common = require("../../utils/common.js");
if (!Array) {
  const _easycom_up_button2 = common_vendor.resolveComponent("up-button");
  _easycom_up_button2();
}
const _easycom_up_button = () => "../../node-modules/uview-plus/components/u-button/u-button.js";
if (!Math) {
  (TnIcon + TnScrollList + _easycom_up_button + TnPopup)();
}
const TnPopup = () => "../../node-modules/@tuniao/tnui-vue3-uniapp/components/popup/src/popup.js";
const TnScrollList = () => "../../node-modules/@tuniao/tnui-vue3-uniapp/components/scroll-list/src/scroll-list.js";
const TnIcon = () => "../../node-modules/@tuniao/tnui-vue3-uniapp/components/icon/src/icon.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "PaymentPopup",
  props: {
    title: { default: "请选择充值套餐" }
  },
  emits: ["showPay"],
  setup(__props) {
    const { showPay } = common_vendor.storeToRefs(stores_appStore.useAppStore());
    const showPopup = common_vendor.computed({
      set: (newValue) => {
        showPay.value = newValue;
        if (!newValue) {
          selectedIndex.value = 0;
        }
      },
      get: () => {
        const { osName } = common_vendor.index.getSystemInfoSync();
        if (showPay.value && (osName === "ios" || osName === "macos")) {
          common_vendor.index.showToast({
            title: "IOS暂不支持在线支付",
            icon: "none"
          });
          showPay.value = false;
        }
        return showPay.value;
      }
    });
    common_vendor.watch(showPopup, () => {
      if (showPopup.value) {
        socketInit();
      }
    });
    const products = common_vendor.ref([]);
    const handleInitData = async () => {
      const res = await composables_useCommon.getProductList();
      if (res) {
        products.value = res;
      }
    };
    const selectedIndex = common_vendor.ref(0);
    common_vendor.watch(selectedIndex, () => {
      console.log(selectedIndex.value);
    });
    const { socketInit } = composables_useWorkFlow.useWorkFlow();
    common_vendor.onReady(() => {
      handleInitData();
      socketInit({
        params: {
          type: types_index.IWebsocketSceneType.payStatusPush
        },
        onMessage: (msg) => {
          console.log("handle pay success message");
          const msgObj = utils_common.parseJSONToObject(msg);
          const { type } = msgObj;
          if (type === "pay_success") {
            showPay.value = false;
            utils_emitter.emit(types_event_types.EventType.PAY_SUCCESS, { order_id: msgObj.order_id });
          }
        }
      });
    });
    const handlePayment = async () => {
      if (!composables_useCommon.isLogin.value) {
        common_vendor.index.switchTab({
          url: "/pages/setting/setting"
        });
        common_vendor.index.showToast({
          title: "请先登录",
          icon: "none"
        });
        return;
      }
      await socketInit({
        params: {
          type: types_index.IWebsocketSceneType.payStatusPush
        }
      });
      composables_usePayment.usePayHandlePayment(products.value[selectedIndex.value]);
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.t(_ctx.title),
        b: common_vendor.f(products.value, (item, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(item.name),
            b: common_vendor.t(item.amount / 100),
            c: common_vendor.t(item.desc),
            d: index === selectedIndex.value
          }, index === selectedIndex.value ? {
            e: "b88e62c2-2-" + i0 + ",b88e62c2-1",
            f: common_vendor.p({
              name: "check"
            })
          } : {}, {
            g: common_vendor.o(($event) => selectedIndex.value = index, item._id),
            h: selectedIndex.value === index ? 1 : "",
            i: item._id,
            j: selectedIndex.value === index ? 1 : "",
            k: common_vendor.o(($event) => selectedIndex.value = index, item._id)
          });
        }),
        c: common_vendor.o(handlePayment),
        d: common_vendor.p({
          type: "primary",
          shape: "circle"
        }),
        e: common_vendor.o(($event) => showPopup.value = $event),
        f: common_vendor.p({
          ["close-btn"]: true,
          height: "66%",
          ["open-direction"]: "bottom",
          modelValue: showPopup.value
        })
      };
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-b88e62c2"]]);
wx.createComponent(Component);
