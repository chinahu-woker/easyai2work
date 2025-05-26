"use strict";
const common_vendor = require("../common/vendor.js");
const utils_request = require("../utils/request.js");
const composables_useCommon = require("../composables/useCommon.js");
if (!Math) {
  (TnIcon + TnButton + TnUpdateUserInfoPopup)();
}
const TnUpdateUserInfoPopup = () => "../node-modules/tnuiv3p-tn-update-user-info-popup/index.js";
const TnButton = () => "../node-modules/@tuniao/tnui-vue3-uniapp/components/button/src/button.js";
const TnIcon = () => "../node-modules/@tuniao/tnui-vue3-uniapp/components/icon/src/icon.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "GetUserInfoPopup",
  setup(__props) {
    const showPopup = common_vendor.ref(false);
    const nickname = common_vendor.ref("");
    const avatar = common_vendor.ref("");
    const avatarChooseHandle = async (url) => {
      const result = await utils_request.uploadFile(url);
      if (result) {
        avatar.value = result;
      }
    };
    const handleUpdateUser = async () => {
      const user = await composables_useCommon.updateUserInfo({ nickname: nickname.value, avatar_url: avatar.value });
      composables_useCommon.saveLoginInfo(user);
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          name: "edit"
        }),
        b: common_vendor.o(() => showPopup.value = true),
        c: common_vendor.p({
          size: "sm",
          plain: true
        }),
        d: common_vendor.o(avatarChooseHandle),
        e: common_vendor.o(handleUpdateUser),
        f: common_vendor.o(($event) => showPopup.value = $event),
        g: common_vendor.o(($event) => nickname.value = $event),
        h: common_vendor.o(($event) => avatar.value = $event),
        i: common_vendor.p({
          show: showPopup.value,
          nickname: nickname.value,
          avatar: avatar.value
        })
      };
    };
  }
});
wx.createComponent(_sfc_main);
