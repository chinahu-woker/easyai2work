"use strict";
const common_vendor = require("../common/vendor.js");
const composables_useCommon = require("../composables/useCommon.js");
const useAppStore = common_vendor.defineStore("app", () => {
  const showExecuting = common_vendor.ref(false);
  const workflows_all = common_vendor.ref([]);
  const home_tagActiveIndex = common_vendor.ref(0);
  const home_tagsList = common_vendor.ref([]);
  const tabbarIndex = common_vendor.ref(0);
  const user = common_vendor.ref({});
  const localTasks = common_vendor.ref([]);
  const showPay = common_vendor.ref(false);
  const inviteCode = common_vendor.ref("");
  const init = () => {
    getUser();
  };
  const getUser = () => {
    const userString = common_vendor.index.getStorageSync("user");
    if (userString) {
      user.value = JSON.parse(userString);
    }
    return user.value;
  };
  const toggleShowExecuting = () => {
    showExecuting.value = !showExecuting.value;
  };
  const initWorkFlows_All = async () => {
    workflows_all.value = await composables_useCommon.getApps();
  };
  const setUser = (newUser) => {
    user.value = { ...user.value, ...newUser };
    common_vendor.index.setStorageSync("user", JSON.stringify(user.value));
  };
  const clearUser = () => {
    user.value = {};
    common_vendor.index.removeStorageSync("user");
  };
  const setInviteCode = (newInviteCode) => {
    inviteCode.value = newInviteCode;
    common_vendor.index.setStorageSync("inviteCode", inviteCode.value);
  };
  const getInviteCode = () => {
    const inviteCodeString = common_vendor.index.getStorageSync("inviteCode");
    if (inviteCodeString) {
      inviteCode.value = inviteCodeString;
    }
    return inviteCode.value;
  };
  return {
    workflows_all,
    user,
    localTasks,
    showPay,
    tabbarIndex,
    home_tagActiveIndex,
    home_tagsList,
    init,
    initWorkFlows_All,
    getUser,
    setUser,
    clearUser,
    toggleShowExecuting,
    /** 邀请码*/
    setInviteCode,
    getInviteCode
  };
});
exports.useAppStore = useAppStore;
