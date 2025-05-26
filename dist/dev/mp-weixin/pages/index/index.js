"use strict";
const common_vendor = require("../../common/vendor.js");
const composables_useCommon = require("../../composables/useCommon.js");
const cofigs_data_globalAppData = require("../../cofigs/data/globalAppData.js");
const composables_useWorkFlow = require("../../composables/useWorkFlow.js");
const utils_request = require("../../utils/request.js");
const utils_common = require("../../utils/common.js");
const stores_appStore = require("../../stores/appStore.js");
const types_event_types = require("../../types/event.types.js");
const utils_emitter = require("../../utils/emitter.js");
const composables_aiChat = require("../../composables/aiChat.js");
if (!Array) {
  const _easycom_fui_tabs2 = common_vendor.resolveComponent("fui-tabs");
  const _easycom_fui_nav_bar2 = common_vendor.resolveComponent("fui-nav-bar");
  const _easycom_up_gap2 = common_vendor.resolveComponent("up-gap");
  const _easycom_up_status_bar2 = common_vendor.resolveComponent("up-status-bar");
  const _easycom_fui_footer2 = common_vendor.resolveComponent("fui-footer");
  const _easycom_fui_avatar2 = common_vendor.resolveComponent("fui-avatar");
  const _easycom_fui_load_ani2 = common_vendor.resolveComponent("fui-load-ani");
  const _easycom_fui_icon2 = common_vendor.resolveComponent("fui-icon");
  const _easycom_fui_picker2 = common_vendor.resolveComponent("fui-picker");
  const _easycom_fui_safe_area2 = common_vendor.resolveComponent("fui-safe-area");
  const _easycom_up_avatar2 = common_vendor.resolveComponent("up-avatar");
  const _easycom_up_icon2 = common_vendor.resolveComponent("up-icon");
  const _easycom_up_cell2 = common_vendor.resolveComponent("up-cell");
  const _easycom_up_cell_group2 = common_vendor.resolveComponent("up-cell-group");
  const _component_template = common_vendor.resolveComponent("template");
  (_easycom_fui_tabs2 + _easycom_fui_nav_bar2 + _easycom_up_gap2 + _easycom_up_status_bar2 + _easycom_fui_footer2 + _easycom_fui_avatar2 + _easycom_fui_load_ani2 + _easycom_fui_icon2 + _easycom_fui_picker2 + _easycom_fui_safe_area2 + _easycom_up_avatar2 + _easycom_up_icon2 + _easycom_up_cell2 + _easycom_up_cell_group2 + _component_template)();
}
const _easycom_fui_tabs = () => "../../components/firstui/fui-tabs/fui-tabs.js";
const _easycom_fui_nav_bar = () => "../../components/firstui/fui-nav-bar/fui-nav-bar.js";
const _easycom_up_gap = () => "../../node-modules/uview-plus/components/u-gap/u-gap.js";
const _easycom_up_status_bar = () => "../../node-modules/uview-plus/components/u-status-bar/u-status-bar.js";
const _easycom_fui_footer = () => "../../components/firstui/fui-footer/fui-footer.js";
const _easycom_fui_avatar = () => "../../components/firstui/fui-avatar/fui-avatar.js";
const _easycom_fui_load_ani = () => "../../components/firstui/fui-load-ani/fui-load-ani.js";
const _easycom_fui_icon = () => "../../components/firstui/fui-icon/fui-icon.js";
const _easycom_fui_picker = () => "../../components/firstui/fui-picker/fui-picker.js";
const _easycom_fui_safe_area = () => "../../components/firstui/fui-safe-area/fui-safe-area.js";
const _easycom_up_avatar = () => "../../node-modules/uview-plus/components/u-avatar/u-avatar.js";
const _easycom_up_icon = () => "../../node-modules/uview-plus/components/u-icon/u-icon.js";
const _easycom_up_cell = () => "../../node-modules/uview-plus/components/u-cell/u-cell.js";
const _easycom_up_cell_group = () => "../../node-modules/uview-plus/components/u-cell-group/u-cell-group.js";
if (!Math) {
  (_easycom_fui_tabs + _easycom_fui_nav_bar + fuiBackgroundImage + AppSwiper + _easycom_up_gap + AppTags + AppWaterFall + _easycom_up_status_bar + MyGraphicCard + BaseLayout + _easycom_fui_footer + _easycom_fui_avatar + _easycom_fui_load_ani + _easycom_fui_icon + _easycom_fui_picker + _easycom_fui_safe_area + _easycom_up_avatar + UserMemberInfo + GetUserInfoPopup + _easycom_up_icon + _easycom_up_cell + _easycom_up_cell_group + PaymentPopup)();
}
const GetUserInfoPopup = () => "../../components/GetUserInfoPopup.js";
const BaseLayout = () => "../../layouts/BaseLayout.js";
const UserMemberInfo = () => "../../components/home/UserMemberInfo.js";
const MyGraphicCard = () => "../../components/custom/MyGraphicCard/MyGraphicCard.js";
const AppSwiper = () => "../../components/home/AppSwiper.js";
const AppTags = () => "../../components/home/AppTags.js";
const AppWaterFall = () => "../../components/home/AppWaterFall.js";
const PaymentPopup = () => "../../components/home/PaymentPopup.js";
const fuiBackgroundImage = () => "../../components/firstui/fui-background-image/fui-background-image.js";
const backGroundImage = "https://chinahu-ai-server.oss-cn-chengdu.aliyuncs.com/aidraw/image/temps/67873d6c232a3c5d52240dd6/Home2.jpg";
const _sfc_defineComponent = common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    global.TextEncoder = common_vendor.TextEncoder;
    global.TextDecoder = common_vendor.TextDecoder;
    common_vendor.onLoad((options) => {
      if (options.pageindex) {
        pageindex.value = parseInt(options.pageindex);
      }
    });
    common_vendor.onShareAppMessage(() => {
      const inviteCode = stores_appStore.useAppStore().user.my_invite_code;
      return {
        title: cofigs_data_globalAppData.globalAppData.share.appInfo,
        path: `/pages/index/index?inviteCode=${inviteCode}`
      };
    });
    common_vendor.onShareTimeline(() => {
      const inviteCode = stores_appStore.useAppStore().user.my_invite_code;
      return {
        title: cofigs_data_globalAppData.globalAppData.share.appInfo,
        path: `/pages/index/index?inviteCode=${inviteCode}`
      };
    });
    function ToConsole() {
      common_vendor.index.navigateTo({
        url: "/pages/console/console"
      });
    }
    const role = common_vendor.ref(false);
    const roltList = ["manager", "admin"];
    function Kongzhitai() {
      if (!composables_useCommon.isLogin.value) {
        role.value = false;
        return 0;
      } else {
        const UserInfor = common_vendor.index.getStorageSync("userInfo");
        console.log("361---userInfo---------------", roltList.includes(UserInfor.role[0]));
        role.value = roltList.includes(UserInfor.role[0]);
      }
    }
    let items = common_vendor.ref("");
    function copyText(text) {
      common_vendor.index.setClipboardData({
        data: text,
        success: () => {
          console.log("复制成功");
          common_vendor.index.showToast({
            title: "复制成功",
            icon: "none"
          });
        },
        fail: (err) => {
          console.error("复制失败", err);
          common_vendor.index.showToast({
            title: "复制失败，请稍后再试",
            icon: "none"
          });
        }
      });
    }
    let isNavigating = false;
    function goToEntire(id) {
      if (isNavigating)
        return;
      isNavigating = true;
      common_vendor.index.navigateTo({
        url: `/pages/drawLike/alike?id=${id}`,
        complete: () => {
          isNavigating = false;
        }
      });
    }
    async function chatAiGetToken() {
      const requestTask = common_vendor.ref();
      const userInfo = common_vendor.ref();
      await composables_aiChat.getUserToken().then((res) => {
        requestTask.value = res.data;
      }).catch((err) => {
        console.error("获取getUserToken失败:", err);
      });
      console.log("getUserToken执行完毕");
      await composables_aiChat.getUserInfo(requestTask.value).then((res) => {
        userInfo.value = res.data;
      }).catch((err) => {
        console.error("获取getUserInfo失败:", err);
      });
      console.log("getUserInfo执行完毕");
      await composables_aiChat.getModelList(requestTask.value.token).then((res) => {
        modelList.value = res.data;
        chooseModel.value = res.data[0];
      }).catch((err) => {
        console.error("获取getModelList失败:", err);
      });
      console.log("getModelList执行完毕");
      await composables_aiChat.getUserKey(userInfo.value, requestTask.value.refresh_token).then((res) => {
        console.log("获取到的getUserKey信息:", res.data);
        userkey.value = res.data.key;
      }).catch((err) => {
        console.error("获取getUserKey失败:", err);
      });
      console.log("getUserKey执行完毕");
    }
    const popup = common_vendor.ref(false);
    const modelList = common_vendor.ref([]);
    const chooseModel = common_vendor.ref("");
    function change(e) {
      popup.value = false;
      chooseModel.value = e.value;
    }
    function cancel() {
      popup.value = false;
    }
    function popupMth() {
      if (!composables_useCommon.isLogin.value) {
        common_vendor.index.showToast({
          icon: "error",
          title: "您还没有登录",
          duration: 2e3
        });
        return 0;
      }
      popup.value = true;
    }
    const content = common_vendor.ref("");
    const msgList = common_vendor.ref([
      {
        "content": "你好我是Ai聊天助手，有什么问题问我吧！(温馨提示：点击消息可以复制哦)",
        "role": "system"
      }
    ]);
    const userkey = common_vendor.ref("");
    const StreamRequest = (content2) => {
      return new Promise((resolve, reject) => {
        const requestTask = common_vendor.index.request({
          url: composables_aiChat.ChatAPiUrl(),
          // 请求地址
          method: "POST",
          data: {
            "messages": content2,
            "model": chooseModel.value,
            "stream": true,
            "features": {
              "thinking_enabled": false
            }
          },
          dataType: "json",
          header: {
            "Authorization": "Bearer sk-" + userkey.value
          },
          responseType: "text",
          enableChunked: true,
          // 开启流传输
          success: (res) => {
            resolve(res);
          },
          // 请求成功回调
          fail: (err) => {
            reject(err);
            common_vendor.index.showToast({
              icon: "error",
              title: "请求失败",
              duration: 2e3
            });
            console.log("请求失败", err);
          }
          // 请求失败回调
        });
        requestTask.onChunkReceived((chunk) => {
          try {
            const base64 = common_vendor.wx$1.arrayBufferToBase64(chunk.data);
            const arrayBuffer = common_vendor.wx$1.base64ToArrayBuffer(base64);
            const text = new common_vendor.TextDecoder().decode(arrayBuffer, { stream: true });
            handleStreamData(text);
          } catch (error) {
            console.error("处理数据块失败", error);
          }
        });
        requestTask.onHeadersReceived(() => {
          console.log("请求完成");
        });
      });
    };
    const msg = common_vendor.ref("");
    function handleStreamData(responseText) {
      const messages = responseText.split("\n").filter((line) => line.startsWith("data:"));
      for (const message of messages) {
        if (message.trim() === "data: [DONE]") {
          msgStatu.value = true;
          return;
        }
        try {
          const data = JSON.parse(message.substring(5).trim());
          if (data.choices && data.choices[0] && data.choices[0].delta && data.choices[0].delta.content) {
            msg.value += data.choices[0].delta.content;
          }
        } catch (error) {
          console.log("解析错误:", error);
        }
      }
      const index = msgList.value.length - 1;
      msgList.value[index].content = msg.value;
      items.value = "items-" + (msgList.value.length - 1);
      msgStatu.value = false;
    }
    const msgStatu = common_vendor.ref(true);
    function msgSend() {
      if (!composables_useCommon.isLogin.value) {
        common_vendor.index.showToast({
          icon: "error",
          title: "您还没有登录",
          duration: 2e3
        });
        return 0;
      }
      if (chooseModel.value == void 0) {
        common_vendor.index.showToast({
          icon: "error",
          title: "您没有选择模型",
          duration: 2e3
        });
        return 0;
      }
      if (msgStatu.value != true) {
        common_vendor.index.showToast({
          icon: "error",
          title: "请等待消息结束",
          duration: 2e3
        });
        return 0;
      }
      msgList.value.push(
        {
          "content": content.value,
          "role": "user"
        }
      );
      content.value = "";
      StreamRequest(msgList.value);
      msgList.value.push({
        "content": "",
        "role": "system"
      });
      msg.value = "";
      console.log(msgList.value);
    }
    common_vendor.onReady(() => {
      socketInit();
      utils_emitter.on(types_event_types.EventType.PAY_SUCCESS, ({ order_id }) => handlePayMessage(order_id));
      wode_loging();
      chatAiGetToken();
      Kongzhitai();
    });
    common_vendor.onMounted(() => {
      getTestImageData();
    });
    common_vendor.onUnmounted(() => {
      imageData.value = [];
    });
    function img2pay() {
      console.log("点击支付");
      showPay.value = true;
    }
    common_vendor.ref("fuiNavBar");
    const { tabbarIndex } = common_vendor.storeToRefs(stores_appStore.useAppStore());
    const pageindex = common_vendor.ref(0);
    const changeHomePage = (index) => {
      pageindex.value = index.index;
      if (index.index == 2) {
        chatAiGetToken();
      }
    };
    const name_value = common_vendor.ref("我的");
    function wode_loging() {
      if (!composables_useCommon.isLogin.value) {
        name_value.value = "登录";
      } else {
        name_value.value = "我的";
      }
    }
    const tabbarData = [
      {
        name: "首页",
        // to: '/pages/index/index',
        onClick: tabbarIndex
      },
      {
        name: "创意",
        // to: '/pages/creative/creative',
        onClick: tabbarIndex
      },
      {
        name: "AI助手",
        // to: '/pages/creative/creative',
        onClick: tabbarIndex
      },
      {
        name: name_value,
        onClick: tabbarIndex
      }
    ];
    const getTestImageData = async () => {
      imageData.value = await utils_request.request("draw/history/findMany", {
        method: "POST",
        data: {
          history: {
            is_deleted: false,
            is_public: true
          }
        }
      });
    };
    const imageData = common_vendor.ref([]);
    const graphicDatas = common_vendor.computed(() => {
      return imageData.value.map((item) => {
        var _a, _b, _c, _d, _e, _f, _g;
        return {
          id: item._id,
          avatar: ((_a = item.user_id) == null ? void 0 : _a.avatar_url) || "",
          username: ((_b = item.user_id) == null ? void 0 : _b.nickname) || ((_c = item.user_id) == null ? void 0 : _c.username),
          title: (_d = item.options) == null ? void 0 : _d.workflow_title,
          description: utils_common.formatDateTime(new Date(item.created_at)),
          tags: item.tags,
          content: ((_f = (_e = item.params) == null ? void 0 : _e.positive) == null ? void 0 : _f.slice(0, 120)) + "...",
          images: (() => {
            const inputImages = [];
            for (const key in item.params) {
              if (key.startsWith("image_path_") && item.params[key]) {
                inputImages.push(item.params[key]);
              }
            }
            if (!item.output) {
              return inputImages;
            }
            return [...inputImages, ...item.output];
          })(),
          commentCount: (_g = item.comment) == null ? void 0 : _g.length
        };
      });
    });
    function toEmpty() {
      common_vendor.index.navigateTo({
        url: "/pages/Empty/Empty"
      });
    }
    const { user } = common_vendor.storeToRefs(stores_appStore.useAppStore());
    common_vendor.ref(true);
    common_vendor.ref("");
    function handleGotoHistory() {
      common_vendor.index.navigateTo({
        url: "/pages/history/history_fui/history_fui"
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
        const user2 = await composables_useCommon.loginByUsername({
          username: "test456",
          password: "123456"
        });
        composables_useCommon.saveLoginInfo(user2);
        common_vendor.index.hideLoading();
      }
      chatAiGetToken();
      name_value.value = "我的";
      Kongzhitai();
      common_vendor.index.reLaunch({ url: "/pages/index/index" });
      common_vendor.index.showLoading({
        title: "加载中"
      });
    };
    const handleLoginByWechat = () => {
      common_vendor.index.login({
        success: async function({ code }) {
          const result = await composables_useCommon.loginByWechatCode(code);
          composables_useCommon.saveLoginInfo(result);
          common_vendor.index.hideLoading();
          console.log("------------result--------", result);
          common_vendor.index.setStorageSync("refreshToken", result.refresh_token);
        },
        fail: function(err) {
          common_vendor.index.showToast({
            title: "登录错误",
            icon: "none"
          });
        }
      });
      chatAiGetToken();
    };
    const { socketInit } = composables_useWorkFlow.useWorkFlow();
    const handlePayMessage = async (order_id) => {
      console.log("收到支付成功消息", order_id);
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
      role.value = false;
      common_vendor.index.showToast({
        title: "退出成功",
        icon: "none"
      });
      name_value.value = "登录";
    };
    const { showPay } = common_vendor.storeToRefs(stores_appStore.useAppStore());
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(changeHomePage),
        b: common_vendor.p({
          direction: "column",
          color: "#ACB0D0",
          isSlider: false,
          selectedColor: "#17135F",
          tabs: tabbarData,
          scale: "1.5",
          center: false,
          short: true,
          scroll: false,
          itemPadding: "25",
          current: pageindex.value,
          size: "28",
          fontWeight: "900",
          background: "transparent"
        }),
        c: common_vendor.p({
          custom: true,
          background: "transparent"
        }),
        d: common_vendor.p({
          src: backGroundImage
        }),
        e: common_vendor.p({
          height: "10"
        }),
        f: common_vendor.p({
          height: "10"
        }),
        g: pageindex.value == 0,
        h: common_vendor.f(graphicDatas.value, (graphicData, KeyIndex, i0) => {
          return {
            a: common_vendor.o(($event) => goToEntire(graphicData.id), KeyIndex),
            b: "83a5a03c-10-" + i0 + ",83a5a03c-8",
            c: common_vendor.p({
              avatar: graphicData.avatar,
              title: graphicData.title,
              username: graphicData.username,
              description: graphicData.description,
              tags: graphicData.tags,
              content: graphicData.content,
              images: graphicData.images,
              ["view-count"]: graphicData.viewCount,
              ["comment-count"]: graphicData.commentCount,
              ["like-count"]: graphicData.likeCount,
              ["view-user-avatars"]: graphicData.viewUserAvatars
            }),
            d: KeyIndex
          };
        }),
        i: common_vendor.p({
          text: "Copyright © 2021 Fuzi-AI"
        }),
        j: pageindex.value == 1,
        k: common_vendor.f(msgList.value, (item, index, i0) => {
          return common_vendor.e({
            a: "83a5a03c-12-" + i0,
            b: common_vendor.p({
              background: "#f9f9f9",
              src: item.role == "system" ? "https://wangbo0808.oss-cn-shanghai.aliyuncs.com/assets/gpt4.png" : common_vendor.unref(user).avatar_url
            }),
            c: item.content.length > 1
          }, item.content.length > 1 ? {
            d: common_vendor.t(item.content),
            e: common_vendor.o(($event) => copyText(item.content), index)
          } : {}, {
            f: item.content.length < 1
          }, item.content.length < 1 ? {
            g: "83a5a03c-13-" + i0,
            h: common_vendor.p({
              type: "3",
              color: " #7f7d79"
            })
          } : {}, {
            i: `items-${index}`,
            j: common_vendor.n(item.role == "user" ? "fui-chat__right" : "fui-chat__left"),
            k: index
          });
        }),
        l: common_vendor.unref(items),
        m: common_vendor.t(chooseModel.value || modelList.value[0]),
        n: common_vendor.o(popupMth),
        o: common_vendor.p({
          name: "message",
          color: "#3b3ee9"
        }),
        p: -1,
        q: common_vendor.o(msgSend),
        r: content.value,
        s: common_vendor.o(($event) => content.value = $event.detail.value),
        t: content.value.length == 0
      }, content.value.length == 0 ? {
        v: common_vendor.p({
          name: "clear",
          color: "#3b3ee9"
        })
      } : {
        w: common_vendor.o(msgSend)
      }, {
        x: common_vendor.o(change),
        y: common_vendor.o(cancel),
        z: common_vendor.p({
          options: modelList.value,
          show: popup.value
        }),
        A: common_vendor.p({
          background: "#f8f8f8"
        }),
        B: pageindex.value == 2,
        C: common_vendor.p({
          src: backGroundImage
        }),
        D: common_vendor.p({
          src: common_vendor.unref(user).avatar_url,
          size: "80"
        }),
        E: !common_vendor.unref(composables_useCommon.isLogin)
      }, !common_vendor.unref(composables_useCommon.isLogin) ? {} : {}, {
        F: common_vendor.unref(composables_useCommon.isLogin)
      }, common_vendor.unref(composables_useCommon.isLogin) ? {
        G: common_vendor.t(common_vendor.unref(user).nickname)
      } : {}, {
        H: common_vendor.unref(composables_useCommon.isLogin)
      }, common_vendor.unref(composables_useCommon.isLogin) ? {
        I: common_vendor.t(common_vendor.unref(user).balance)
      } : {}, {
        J: common_vendor.p({
          name: "scan",
          color: "#969799",
          size: "28"
        }),
        K: common_vendor.o(toEmpty),
        L: common_vendor.p({
          name: "arrow-right",
          color: "#969799",
          size: "28"
        }),
        M: common_vendor.o(toEmpty),
        N: common_vendor.o(handleLogin),
        O: common_vendor.o(img2pay),
        P: common_vendor.unref(composables_useCommon.isLogin)
      }, common_vendor.unref(composables_useCommon.isLogin) ? {
        Q: common_vendor.p({
          size: "30",
          name: "https://chinahu-ai-server.oss-cn-chengdu.aliyuncs.com/Iconly_Glass_Gallery.png"
        }),
        R: common_vendor.o(handleGotoHistory),
        S: common_vendor.p({
          border: false
        })
      } : {}, {
        T: common_vendor.p({
          size: "30",
          name: "https://chinahu-ai-server.oss-cn-chengdu.aliyuncs.com/Iconly_Glass_Chat.png"
        }),
        U: common_vendor.p({
          border: false
        }),
        V: common_vendor.unref(composables_useCommon.isLogin)
      }, common_vendor.unref(composables_useCommon.isLogin) ? {
        W: common_vendor.p({
          size: "30",
          name: "https://chinahu-ai-server.oss-cn-chengdu.aliyuncs.com/Iconly_Glass_Home.png"
        }),
        X: common_vendor.o(handleLoginOut),
        Y: common_vendor.p({
          border: false
        })
      } : {}, {
        Z: role.value
      }, role.value ? {
        aa: common_vendor.p({
          size: "30",
          name: "https://chinahu-ai-server.oss-cn-chengdu.aliyuncs.com/Iconly_Glass_Setting.png"
        }),
        ab: common_vendor.o(ToConsole),
        ac: common_vendor.p({
          border: false
        })
      } : {}, {
        ad: common_vendor.p({
          color: "#fff",
          border: false
        }),
        ae: pageindex.value == 3
      });
    };
  }
});
_sfc_defineComponent.__runtimeHooks = 6;
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_defineComponent, [["__scopeId", "data-v-83a5a03c"]]);
wx.createPage(MiniProgramPage);
