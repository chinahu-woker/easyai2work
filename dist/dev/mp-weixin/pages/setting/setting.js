"use strict";
const common_vendor = require("../../common/vendor.js");
const composables_useCommon = require("../../composables/useCommon.js");
const stores_appStore = require("../../stores/appStore.js");
const composables_useWorkFlow = require("../../composables/useWorkFlow.js");
const utils_emitter = require("../../utils/emitter.js");
const types_event_types = require("../../types/event.types.js");
if (!Array) {
  const _easycom_up_status_bar2 = common_vendor.resolveComponent("up-status-bar");
  const _easycom_up_avatar2 = common_vendor.resolveComponent("up-avatar");
  const _easycom_up_icon2 = common_vendor.resolveComponent("up-icon");
  const _easycom_up_cell2 = common_vendor.resolveComponent("up-cell");
  const _easycom_up_cell_group2 = common_vendor.resolveComponent("up-cell-group");
  (_easycom_up_status_bar2 + _easycom_up_avatar2 + _easycom_up_icon2 + _easycom_up_cell2 + _easycom_up_cell_group2)();
}
const _easycom_up_status_bar = () => "../../node-modules/uview-plus/components/u-status-bar/u-status-bar.js";
const _easycom_up_avatar = () => "../../node-modules/uview-plus/components/u-avatar/u-avatar.js";
const _easycom_up_icon = () => "../../node-modules/uview-plus/components/u-icon/u-icon.js";
const _easycom_up_cell = () => "../../node-modules/uview-plus/components/u-cell/u-cell.js";
const _easycom_up_cell_group = () => "../../node-modules/uview-plus/components/u-cell-group/u-cell-group.js";
if (!Math) {
  (MyNavbar + _easycom_up_status_bar + _easycom_up_avatar + UserMemberInfo + GetUserInfoPopup + _easycom_up_icon + _easycom_up_cell + _easycom_up_cell_group + TnIcon + BaseLayout)();
}
const MyNavbar = () => "../../components/common/MyNavbar.js";
const BaseLayout = () => "../../layouts/BaseLayout.js";
const GetUserInfoPopup = () => "../../components/GetUserInfoPopup.js";
const TnIcon = () => "../../node-modules/@tuniao/tnui-vue3-uniapp/components/icon/src/icon.js";
const UserMemberInfo = () => "../../components/home/UserMemberInfo.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "setting",
  setup(__props) {
    const { user } = common_vendor.storeToRefs(stores_appStore.useAppStore());
    common_vendor.ref(true);
    common_vendor.ref("");
    function handleGotoHistory() {
      common_vendor.index.navigateTo({
        url: "/pages/history/history"
      });
    }
    const handleLogin = async () => {
      if (composables_useCommon.isLogin.value) {
        return;
      }
      common_vendor.index.showLoading({
        title: "正在登录...",
        mask: true
      });
      const { uniPlatform } = common_vendor.index.getSystemInfoSync();
      if (uniPlatform !== "web") {
        handleLoginByWechat();
      } else {
        common_vendor.index.__f__("log", "at pages/setting/setting.vue:132", "dev");
        const user2 = await composables_useCommon.loginByUsername({
          username: "test456",
          password: "123456"
        });
        composables_useCommon.saveLoginInfo(user2);
        common_vendor.index.hideLoading();
      }
    };
    const handleLoginByWechat = () => {
      common_vendor.index.login({
        success: async function({ code }) {
          const result = await composables_useCommon.loginByWechatCode(code);
          composables_useCommon.saveLoginInfo(result);
          common_vendor.index.hideLoading();
        },
        fail: function(err) {
          common_vendor.index.showToast({
            title: "登录错误",
            icon: "none"
          });
        }
      });
    };
    const { socketInit } = composables_useWorkFlow.useWorkFlow();
    common_vendor.onReady(() => {
      socketInit();
      utils_emitter.on(types_event_types.EventType.PAY_SUCCESS, ({ order_id }) => handlePayMessage(order_id));
    });
    const handlePayMessage = async (order_id) => {
      common_vendor.index.__f__("log", "at pages/setting/setting.vue:171", "收到支付成功消息", order_id);
      const order = await composables_useCommon.getOrderInfoById(order_id);
      if (order[0] && order[0].order_status === 1) {
        common_vendor.index.showToast({
          title: "支付成功",
          icon: "none"
        });
        composables_useCommon.refreshUserInfo();
      }
    };
    const handleLoginOut = () => {
      common_vendor.index.showLoading({
        title: "正在退出登录...",
        mask: true
      });
      composables_useCommon.loginOut();
      common_vendor.index.hideLoading();
      common_vendor.index.showToast({
        title: "退出成功",
        icon: "none"
      });
    };
    const { showPay } = common_vendor.storeToRefs(stores_appStore.useAppStore());
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(handleLogin),
        b: common_vendor.p({
          src: common_vendor.unref(user).avatar_url,
          size: "80"
        }),
        c: !common_vendor.unref(composables_useCommon.isLogin)
      }, !common_vendor.unref(composables_useCommon.isLogin) ? {} : {}, {
        d: common_vendor.unref(composables_useCommon.isLogin)
      }, common_vendor.unref(composables_useCommon.isLogin) ? {
        e: common_vendor.t(common_vendor.unref(user).nickname)
      } : {}, {
        f: common_vendor.unref(composables_useCommon.isLogin)
      }, common_vendor.unref(composables_useCommon.isLogin) ? {
        g: common_vendor.t(common_vendor.unref(user).balance)
      } : {}, {
        h: common_vendor.p({
          name: "scan",
          color: "#969799",
          size: "28"
        }),
        i: common_vendor.p({
          name: "arrow-right",
          color: "#969799",
          size: "28"
        }),
        j: common_vendor.p({
          name: "arrow-right",
          color: "#969799",
          size: "28"
        }),
        k: common_vendor.o(($event) => showPay.value = true),
        l: common_vendor.p({
          icon: "rmb-circle",
          title: "成为会员"
        }),
        m: common_vendor.o(handleGotoHistory),
        n: common_vendor.p({
          icon: "photo",
          title: "绘图历史"
        }),
        o: common_vendor.p({
          name: "logout"
        }),
        p: common_vendor.o(handleLoginOut),
        q: common_vendor.p({
          icon: "setting",
          title: "退出登录"
        }),
        r: common_vendor.gei(_ctx, "")
      });
    };
  }
});
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/setting/setting.js.map
