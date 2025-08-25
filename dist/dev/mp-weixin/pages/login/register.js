"use strict";
const common_vendor = require("../../common/vendor.js");
const composables_aiChat = require("../../composables/aiChat.js");
require("../../composables/useCommon.js");
if (!Array) {
  const _easycom_fui_input2 = common_vendor.resolveComponent("fui-input");
  const _easycom_fui_checkbox2 = common_vendor.resolveComponent("fui-checkbox");
  const _easycom_fui_checkbox_group2 = common_vendor.resolveComponent("fui-checkbox-group");
  const _easycom_fui_button2 = common_vendor.resolveComponent("fui-button");
  (_easycom_fui_input2 + _easycom_fui_checkbox2 + _easycom_fui_checkbox_group2 + _easycom_fui_button2)();
}
const _easycom_fui_input = () => "../../components/firstui/fui-input/fui-input.js";
const _easycom_fui_checkbox = () => "../../components/firstui/fui-checkbox/fui-checkbox.js";
const _easycom_fui_checkbox_group = () => "../../components/firstui/fui-checkbox-group/fui-checkbox-group.js";
const _easycom_fui_button = () => "../../components/firstui/fui-button/fui-button.js";
if (!Math) {
  (_easycom_fui_input + _easycom_fui_checkbox + _easycom_fui_checkbox_group + _easycom_fui_button)();
}
const _sfc_main = {
  __name: "register",
  setup(__props) {
    common_vendor.onLoad(() => {
    });
    common_vendor.ref("");
    common_vendor.ref("");
    const validateEmail = (email) => {
      const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return regex.test(email);
    };
    const form = common_vendor.reactive({
      username: "",
      email: "",
      password: "",
      agreement: []
    });
    const formErrors = common_vendor.reactive({
      email: "",
      agreement: ""
    });
    const isAgreed = common_vendor.computed(() => {
      return form.agreement.includes("agreed");
    });
    const hasInvalidEmail = common_vendor.computed(() => {
      return !form.email || !validateEmail(form.email);
    });
    common_vendor.watch(() => form.email, (newVal) => {
      if (newVal && !validateEmail(newVal)) {
        formErrors.email = "请输入有效的邮箱地址";
      } else {
        formErrors.email = "";
      }
    });
    const showAgreement = () => {
    };
    const showPrivacy = () => {
    };
    async function toregist(data) {
      try {
        const response = await composables_aiChat.registerByUsername(data);
        if (response.status == "success") {
          common_vendor.index.showToast({ title: "注册成功" });
          return response;
        } else {
          common_vendor.index.showToast({ title: response.message || "注册失败！" });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/login/register.vue:125", "注册失败:", error);
        throw error;
      }
    }
    const handleRegister = async () => {
      if (!validateEmail(form.email)) {
        formErrors.email = "请输入有效的邮箱地址";
        return;
      }
      if (!isAgreed.value) {
        formErrors.agreement = "请同意用户协议和隐私条款";
        return;
      }
      try {
        const userData = {
          "username": form.username,
          "email": form.email,
          "password": form.password,
          "inviteCode": ""
        };
        const response = await toregist(userData);
        common_vendor.index.__f__("log", "at pages/login/register.vue:150", "regiest", response);
        setTimeout(() => {
          common_vendor.index.redirectTo({ url: `/pages/login/login?userData=${JSON.stringify(response.data)}` });
        }, 1500);
      } catch (error) {
        common_vendor.index.showToast({ title: "注册失败", icon: "none" });
        common_vendor.index.__f__("error", "at pages/login/register.vue:158", "注册错误:", error);
      }
    };
    const backToLogin = () => {
      common_vendor.index.navigateBack({ delta: 1 });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(($event) => form.username = $event),
        b: common_vendor.p({
          placeholder: "请输入用户名",
          ["border-color"]: "#6C5CE7",
          modelValue: form.username
        }),
        c: common_vendor.o(($event) => form.email = $event),
        d: common_vendor.p({
          placeholder: "请输入邮箱",
          type: "email",
          ["border-color"]: "#6C5CE7",
          modelValue: form.email
        }),
        e: formErrors.email
      }, formErrors.email ? {
        f: common_vendor.t(formErrors.email)
      } : {}, {
        g: common_vendor.o(($event) => form.password = $event),
        h: common_vendor.p({
          placeholder: "请输入密码",
          type: "password",
          ["border-color"]: "#6C5CE7",
          modelValue: form.password
        }),
        i: common_vendor.p({
          value: "agreed",
          color: "#6C5CE7"
        }),
        j: common_vendor.o(showAgreement),
        k: common_vendor.o(showPrivacy),
        l: common_vendor.o(($event) => form.agreement = $event),
        m: common_vendor.p({
          size: 28,
          modelValue: form.agreement
        }),
        n: formErrors.agreement
      }, formErrors.agreement ? {
        o: common_vendor.t(formErrors.agreement)
      } : {}, {
        p: common_vendor.o(handleRegister),
        q: common_vendor.p({
          disabled: !isAgreed.value || hasInvalidEmail.value
        }),
        r: common_vendor.o(backToLogin)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-12565c11"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/register.js.map
