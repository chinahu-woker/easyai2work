"use strict";
const common_vendor = require("../../common/vendor.js");
const composables_useCommon = require("../../composables/useCommon.js");
const utils_common = require("../../utils/common.js");
const utils_emitter = require("../../utils/emitter.js");
const types_event_types = require("../../types/event.types.js");
if (!Math) {
  TnIcon();
}
const TnIcon = () => "../../node-modules/@tuniao/tnui-vue3-uniapp/components/icon/src/icon.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "UserMemberInfo",
  setup(__props) {
    const vipInfo = common_vendor.ref();
    const handleInit = async () => {
      if (!composables_useCommon.isLogin.value) {
        return;
      }
      const res = await composables_useCommon.getUserVipInfo();
      if (res) {
        vipInfo.value = res;
      }
    };
    handleInit();
    common_vendor.watch(composables_useCommon.isLogin, () => {
      if (composables_useCommon.isLogin.value) {
        handleInit();
      }
    });
    const userInfor = common_vendor.computed(() => {
      var _a, _b;
      if (!composables_useCommon.isLogin.value) {
        return null;
      }
      return {
        vipName: (_a = vipInfo.value) == null ? void 0 : _a.org_id.name,
        expire_date: utils_common.formatDateTime(new Date((_b = vipInfo.value) == null ? void 0 : _b.expire_date), "YYYY-MM-DD")
      };
    });
    common_vendor.onLoad(() => {
      utils_emitter.on(types_event_types.EventType.PAY_SUCCESS, () => {
        handleInit();
      });
    });
    common_vendor.onUnload(() => {
      utils_emitter.off(types_event_types.EventType.PAY_SUCCESS);
    });
    return (_ctx, _cache) => {
      var _a, _b;
      return common_vendor.e({
        a: vipInfo.value
      }, vipInfo.value ? {
        b: common_vendor.p({
          name: "vip-diamond"
        }),
        c: common_vendor.t((_a = userInfor.value) == null ? void 0 : _a.vipName)
      } : {}, {
        d: vipInfo.value
      }, vipInfo.value ? {
        e: common_vendor.t((_b = userInfor.value) == null ? void 0 : _b.expire_date)
      } : {});
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-df2edbd0"]]);
wx.createComponent(Component);
