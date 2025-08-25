"use strict";
const common_vendor = require("../../common/vendor.js");
const composables_useCommon = require("../../composables/useCommon.js");
if (!Array) {
  const _easycom_fui_background_image2 = common_vendor.resolveComponent("fui-background-image");
  const _easycom_fui_icon2 = common_vendor.resolveComponent("fui-icon");
  const _easycom_fui_nav_bar2 = common_vendor.resolveComponent("fui-nav-bar");
  const _easycom_fui_input2 = common_vendor.resolveComponent("fui-input");
  const _easycom_fui_button2 = common_vendor.resolveComponent("fui-button");
  (_easycom_fui_background_image2 + _easycom_fui_icon2 + _easycom_fui_nav_bar2 + _easycom_fui_input2 + _easycom_fui_button2)();
}
const _easycom_fui_background_image = () => "../../components/firstui/fui-background-image/fui-background-image.js";
const _easycom_fui_icon = () => "../../components/firstui/fui-icon/fui-icon.js";
const _easycom_fui_nav_bar = () => "../../components/firstui/fui-nav-bar/fui-nav-bar.js";
const _easycom_fui_input = () => "../../components/firstui/fui-input/fui-input.js";
const _easycom_fui_button = () => "../../components/firstui/fui-button/fui-button.js";
if (!Math) {
  (_easycom_fui_background_image + _easycom_fui_icon + _easycom_fui_nav_bar + _easycom_fui_input + _easycom_fui_button)();
}
const _sfc_main = {
  __name: "login",
  setup(__props) {
    const username = common_vendor.ref("");
    const password = common_vendor.ref("");
    const emailError = common_vendor.ref("");
    const passwordError = common_vendor.ref("");
    const wechatLoading = common_vendor.ref(false);
    const validateEmail = (email) => {
    };
    const clearPasswordError = () => {
      passwordError.value = "";
    };
    const commonLogin = async () => {
      if (composables_useCommon.isLogin.value)
        return;
      const { uniPlatform } = common_vendor.index.getSystemInfoSync();
      if (uniPlatform !== "web") {
        handleLoginByWechat();
      } else {
        try {
          const user = await composables_useCommon.loginByUsername({
            username: "test456",
            password: "123456"
          });
          composables_useCommon.saveLoginInfo(user);
          common_vendor.index.hideLoading();
          common_vendor.index.reLaunch({ url: "/pages/index/index" });
        } catch (error) {
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({ title: "模拟登录失败", icon: "none" });
        }
      }
    };
    common_vendor.onLoad((options) => {
      if (options.userData) {
        try {
          const userData = JSON.parse(options.userData);
          username.value = userData.username;
          password.value = userData.password;
          common_vendor.index.__f__("log", "at pages/login/login.vue:150", "loginOnload", options, userData);
          common_vendor.index.__f__("log", "at pages/login/login.vue:151", "loginOnload---2", username.value, password.value);
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/login/login.vue:153", "解析 userData 出错:", error);
        }
      }
    });
    const handleLogin = async () => {
      if (!username.value) {
        emailError.value = "请输入账号";
        return;
      }
      if (!password.value) {
        passwordError.value = "请输入密码";
        return;
      }
      try {
        common_vendor.index.showLoading({
          title: "登录中...",
          mask: true
        });
        const result = await composables_useCommon.loginByUsername({
          username: username.value,
          password: password.value
        });
        common_vendor.index.__f__("log", "at pages/login/login.vue:179", "---------result------------", result);
        if (result.status == 0) {
          common_vendor.index.showToast({
            title: "登录成功",
            icon: "success"
          });
          composables_useCommon.saveLoginInfo(result);
          common_vendor.index.setStorageSync("refreshToken", result.refresh_token);
          common_vendor.index.hideLoading();
          common_vendor.index.reLaunch({
            url: "/pages/index/index"
          });
        } else {
          common_vendor.index.showToast({
            title: result.message,
            icon: "error"
          });
        }
      } catch (error) {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "请求出错检查网络",
          icon: "none"
        });
        common_vendor.index.__f__("error", "at pages/login/login.vue:206", "Login error:", error);
      }
    };
    const handleLoginByWechat = async () => {
      wechatLoading.value = true;
      try {
        const {
          code
        } = await common_vendor.index.login();
        const result = await composables_useCommon.loginByWechatCode(code);
        composables_useCommon.saveLoginInfo(result);
        common_vendor.index.setStorageSync("refreshToken", result.refresh_token);
        common_vendor.index.hideLoading();
        wechatLoading.value = false;
        common_vendor.index.showToast({
          title: "登录成功",
          icon: "success"
        });
        common_vendor.index.reLaunch({
          url: "/pages/index/index"
        });
      } catch (error) {
        common_vendor.index.hideLoading();
        wechatLoading.value = false;
        common_vendor.index.showToast({
          title: "微信登录失败",
          icon: "none"
        });
        common_vendor.index.__f__("error", "at pages/login/login.vue:236", "Wechat login error:", error);
      }
    };
    const toRegiest = () => {
      common_vendor.index.navigateTo({
        url: "/pages/login/register"
      });
    };
    const toHome = () => {
      common_vendor.index.redirectTo({
        url: "/pages/index/index"
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          src: "https://chinahu-ai-server.oss-cn-chengdu.aliyuncs.com/aidraw/image/temps/67873d6c232a3c5d52240dd6/Home2.jpg"
        }),
        b: common_vendor.p({
          name: "arrowleft",
          size: "40",
          color: "#333"
        }),
        c: common_vendor.o(toHome),
        d: common_vendor.p({
          title: " ",
          background: "transparent"
        }),
        e: common_vendor.o(validateEmail),
        f: common_vendor.o(($event) => username.value = $event),
        g: common_vendor.p({
          placeholder: "请输入账号",
          modelValue: username.value
        }),
        h: emailError.value
      }, emailError.value ? {
        i: common_vendor.t(emailError.value)
      } : {}, {
        j: common_vendor.o(clearPasswordError),
        k: common_vendor.o(($event) => password.value = $event),
        l: common_vendor.p({
          placeholder: "请输入密码",
          type: "password",
          modelValue: password.value
        }),
        m: passwordError.value
      }, passwordError.value ? {
        n: common_vendor.t(passwordError.value)
      } : {}, {
        o: common_vendor.o(handleLogin),
        p: common_vendor.p({
          background: "#6C5CE7",
          color: "#FFFFFF",
          height: "96rpx",
          borderRadius: "20rpx",
          fontSize: "32rpx",
          fontWeight: "500"
        }),
        q: common_vendor.o(toRegiest),
        r: common_vendor.o(commonLogin),
        s: common_vendor.p({
          plain: true,
          width: "200rpx",
          height: "80rpx",
          background: "transparent",
          borderColor: "#E5E7EB",
          borderRadius: "16rpx",
          loading: wechatLoading.value
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-cdfe2409"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/login.js.map
