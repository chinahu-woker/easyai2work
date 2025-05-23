"use strict";
const common_vendor = require("../common/vendor.js");
const utils_request = require("../utils/request.js");
const stores_appStore = require("../stores/appStore.js");
const types_event_types = require("../types/event.types.js");
const utils_emitter = require("../utils/emitter.js");
const loginByWechatCode = (code) => utils_request.request(`auth/loginByWechatMiniProgram?code=${code}`);
const loginByUsername = (data) => utils_request.request("/users/loginByUsername", { method: "POST", data });
const loginOut = () => {
  stores_appStore.useAppStore().clearUser();
  utils_emitter.emit(types_event_types.EventType.AUTH_LOGOUT, null);
};
const saveLoginInfo = (user) => stores_appStore.useAppStore().setUser(user);
const getLoginInfo = () => stores_appStore.useAppStore().getUser();
const updateUserInfo = (data) => utils_request.request("/users/update", { method: "POST", data });
const refreshUserInfo = (user = getLoginInfo()) => utils_request.request(`/users/${user._id}`).then((res) => {
  stores_appStore.useAppStore().setUser(res);
});
const isLogin = common_vendor.computed(() => {
  const { user } = common_vendor.storeToRefs(stores_appStore.useAppStore());
  common_vendor.index.__f__("log", "at composables/useCommon.ts:38", "storeToRefs(useAppStore())", user.value);
  common_vendor.index.setStorageSync("userInfo", user.value);
  common_vendor.index.setStorageSync("refreshToken", user.value.refresh_token);
  common_vendor.index.setStorageSync("my_invite_code", user.value.my_invite_code);
  return !!user.value.refresh_token;
});
const getUserVipInfo = () => utils_request.request("/member/topLevel", { method: "POST" });
const getProductList = () => utils_request.request("/product");
const getOrderInfoById = (order_id) => utils_request.request(`/pay/query`, { method: "POST", data: { _id: order_id } });
const creatOrder = (data) => utils_request.request(`/pay/order`, { method: "POST", data });
const getPrePay = (order_id) => utils_request.request(`pay/prePay/${order_id}`);
const getApps = () => utils_request.request("workflow/getAllWorkflowApps/mp");
const getPageContent = () => utils_request.request(`content/mp/content`);
exports.creatOrder = creatOrder;
exports.getApps = getApps;
exports.getLoginInfo = getLoginInfo;
exports.getOrderInfoById = getOrderInfoById;
exports.getPageContent = getPageContent;
exports.getPrePay = getPrePay;
exports.getProductList = getProductList;
exports.getUserVipInfo = getUserVipInfo;
exports.isLogin = isLogin;
exports.loginByUsername = loginByUsername;
exports.loginByWechatCode = loginByWechatCode;
exports.loginOut = loginOut;
exports.refreshUserInfo = refreshUserInfo;
exports.saveLoginInfo = saveLoginInfo;
exports.updateUserInfo = updateUserInfo;
//# sourceMappingURL=../../.sourcemap/mp-weixin/composables/useCommon.js.map
