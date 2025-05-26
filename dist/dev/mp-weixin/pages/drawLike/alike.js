"use strict";
const common_vendor = require("../../common/vendor.js");
const composables_aiChat = require("../../composables/aiChat.js");
const stores_appStore = require("../../stores/appStore.js");
if (!Array) {
  const _easycom_fui_icon2 = common_vendor.resolveComponent("fui-icon");
  const _easycom_fui_nav_bar2 = common_vendor.resolveComponent("fui-nav-bar");
  const _easycom_up_button2 = common_vendor.resolveComponent("up-button");
  const _easycom_fui_avatar2 = common_vendor.resolveComponent("fui-avatar");
  (_easycom_fui_icon2 + _easycom_fui_nav_bar2 + _easycom_up_button2 + _easycom_fui_avatar2)();
}
const _easycom_fui_icon = () => "../../components/firstui/fui-icon/fui-icon.js";
const _easycom_fui_nav_bar = () => "../../components/firstui/fui-nav-bar/fui-nav-bar.js";
const _easycom_up_button = () => "../../node-modules/uview-plus/components/u-button/u-button.js";
const _easycom_fui_avatar = () => "../../components/firstui/fui-avatar/fui-avatar.js";
if (!Math) {
  (_easycom_fui_icon + _easycom_fui_nav_bar + _easycom_up_button + _easycom_fui_avatar)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "alike",
  setup(__props) {
    const { user } = common_vendor.storeToRefs(stores_appStore.useAppStore());
    function leftClick() {
      common_vendor.index.reLaunch({ url: "/pages/index/index?pageindex=1" });
    }
    const currentIndex = common_vendor.ref(0);
    const swiperHeight = common_vendor.ref(400);
    const swiperRef = common_vendor.ref();
    const currentVideoIndex = common_vendor.ref(null);
    const videoContexts = common_vendor.ref([]);
    function getItemType(url) {
      return /\.(mp4|webm|ogg|mov)$/i.test(url) ? "video" : "image";
    }
    function getVideoContext(index) {
      if (!videoContexts.value[index]) {
        videoContexts.value[index] = common_vendor.index.createVideoContext(`video-${index}`, {
          componentInstance: this
        });
      }
      return videoContexts.value[index];
    }
    function playVideo(index) {
      const videoCtx = getVideoContext(index);
      if (videoCtx) {
        videoCtx.play();
        currentVideoIndex.value = index;
      }
    }
    function handleVideoPlay(index) {
      currentVideoIndex.value = index;
    }
    function handleVideoFullscreenChange(e) {
      console.log("全屏变化:", e.detail.fullScreen);
    }
    function handleVideoError(e) {
      common_vendor.index.showToast({ title: "视频加载失败", icon: "none" });
      console.error("视频错误:", e.detail.errMsg);
    }
    function onSwiperChange(e) {
      var _a;
      currentIndex.value = e.detail.current;
      const item = draw_data.value[currentIndex.value];
      if (currentVideoIndex.value !== null && currentVideoIndex.value !== currentIndex.value) {
        const videoCtx = getVideoContext(currentVideoIndex.value);
        if (videoCtx) {
          videoCtx.pause();
        }
        currentVideoIndex.value = null;
      }
      if ((_a = item == null ? void 0 : item.output) == null ? void 0 : _a.height) {
        swiperHeight.value = Math.min(
          Math.max(item.output.height, 300),
          600
        );
      }
    }
    function goToSlide(index) {
      if (swiperRef.value && typeof swiperRef.value.setCurrent === "function") {
        swiperRef.value.setCurrent(index);
      } else {
        console.warn("setCurrent 方法不可用或 swiper 未正确初始化");
      }
    }
    function previewImage(url) {
      common_vendor.index.previewImage({
        // urls: draw_data.value.map(item => item.output),
        urls: url,
        current: url
      });
    }
    common_vendor.ref(true);
    common_vendor.ref(0);
    async function fetchAndSaveUserNames() {
      try {
        await composables_aiChat.allUserName(user.value);
      } catch (err) {
      }
    }
    const draw_data = common_vendor.ref();
    common_vendor.onLoad(async (params) => {
      try {
        if (!params.id) {
          throw new Error("缺少必要参数：id");
        }
        console.log("id:", params.id, user.value, draw_data);
        await composables_aiChat.getdetail(user.value, params.id).then((res) => {
          console.log("获取到的getUserKey信息:", res.data);
          draw_data.value = res.data;
        }).catch((err) => {
          console.error("获取getUserKey失败:", err);
        });
      } catch (err) {
        console.error("数据加载失败:", err);
        error.value = "加载失败，请重试";
        loading.value = false;
      }
      fetchAndSaveUserNames();
    });
    const visibleParams = ["positive", "width", "height", "seed"];
    function formatLabel(key) {
      const labelMap = {
        positive: "提示词",
        width: "宽度",
        height: "高度",
        seed: "随机种子"
      };
      return labelMap[key] || key;
    }
    function generateSame() {
      if (draw_data.value.data.is_public) {
        common_vendor.index.navigateTo({
          url: "/pages/draw/apps/apps?id=" + draw_data.value.data.workflow_id + "&isRegenerate=true&regenerateParams=" + encodeURIComponent(JSON.stringify(draw_data.value.data.params))
        });
      } else {
        common_vendor.index.showToast({
          title: "该应用目前不可用",
          icon: "none",
          duration: 2e3
        });
      }
    }
    function formatTime(timestamp) {
      if (!timestamp || isNaN(timestamp)) {
        return "刚刚";
      }
      const date = new Date(timestamp);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
    }
    const newComment = common_vendor.ref("");
    function getUsernameById(userId) {
      const users = common_vendor.index.getStorageSync("allUserNames") || [];
      if (!Array.isArray(users))
        return "未知用户";
      let id;
      if (typeof userId === "string") {
        id = userId;
      } else if (userId && typeof userId._id === "string") {
        id = userId._id;
      } else {
        return "未知用户";
      }
      const foundUser = users.find((u) => u._id === id);
      return (foundUser == null ? void 0 : foundUser.username) || "未知用户";
    }
    async function submitComment() {
      var _a, _b;
      if (!newComment.value.trim()) {
        common_vendor.index.showToast({ title: "请输入内容", icon: "none" });
        return;
      }
      try {
        const putdata = {
          targetType: "work",
          content: newComment.value,
          targetId: (_b = (_a = draw_data.value) == null ? void 0 : _a.data) == null ? void 0 : _b._id
        };
        if (!putdata.targetId) {
          common_vendor.index.showToast({ title: "目标ID缺失", icon: "none", duration: 2e3 });
          return;
        }
        const res = await composables_aiChat.Comment(user.value, putdata);
        console.log("评论提交成功:", res.data);
        const newCommentItem = {
          ...res.data
          // author: {
          //   _id: res.data.author,
          //   username: getUsernameById(res.data.author)
          // }
        };
        draw_data.value.data.comment = [newCommentItem, ...draw_data.value.data.comment];
        newComment.value = "";
        common_vendor.index.showToast({ title: "评论成功" });
      } catch (err) {
        console.error("评论提交失败:", err);
        common_vendor.index.showToast({ title: "评论失败，请重试", icon: "none" });
      }
    }
    return (_ctx, _cache) => {
      var _a, _b, _c;
      return common_vendor.e({
        a: common_vendor.p({
          name: "arrowleft"
        }),
        b: common_vendor.o(leftClick),
        c: common_vendor.p({
          background: "transparent",
          title: (_a = draw_data.value.data.options) == null ? void 0 : _a.workflow_title
        }),
        d: common_vendor.f(draw_data.value.data.output, (item, index, i0) => {
          return common_vendor.e({
            a: getItemType(item) === "image"
          }, getItemType(item) === "image" ? {
            b: item,
            c: common_vendor.o(($event) => previewImage(item), index)
          } : common_vendor.e({
            d: item,
            e: common_vendor.o(($event) => handleVideoPlay(index), index),
            f: common_vendor.o(handleVideoFullscreenChange, index),
            g: common_vendor.o(handleVideoError, index),
            h: currentVideoIndex.value !== index
          }, currentVideoIndex.value !== index ? {
            i: "06c8931a-2-" + i0,
            j: common_vendor.p({
              name: "play",
              color: "#fff",
              size: "60"
            }),
            k: common_vendor.o(($event) => playVideo(index), index)
          } : {}), {
            l: index
          });
        }),
        e: swiperHeight.value + "px",
        f: common_vendor.o(onSwiperChange),
        g: draw_data.value.data.output.length > 1
      }, draw_data.value.data.output.length > 1 ? {
        h: common_vendor.f(draw_data.value.data.output, (item, index_cer, i0) => {
          return {
            a: index_cer,
            b: item,
            c: common_vendor.n({
              active: currentIndex.value === index_cer
            }),
            d: common_vendor.o(($event) => goToSlide(index_cer), index_cer)
          };
        })
      } : {}, {
        i: common_vendor.f(visibleParams, (key, k0, i0) => {
          return {
            a: common_vendor.t(formatLabel(key)),
            b: common_vendor.t(draw_data.value.data.params[key]),
            c: key
          };
        }),
        j: common_vendor.o(generateSame),
        k: common_vendor.p({
          icon: "edit-pen",
          type: "primary",
          shape: "circle"
        }),
        l: common_vendor.f(draw_data.value.data.comment, (comment, k0, i0) => {
          return common_vendor.e({
            a: "06c8931a-4-" + i0,
            b: common_vendor.p({
              size: "small",
              src: comment.author.avatar_url
            }),
            c: common_vendor.t(comment.author.nickname || comment.author.username),
            d: common_vendor.t(comment.content),
            e: common_vendor.t(formatTime(comment.created_at)),
            f: comment.replies && comment.replies.length
          }, comment.replies && comment.replies.length ? {
            g: common_vendor.f(comment.replies, (reply, k1, i1) => {
              return {
                a: "06c8931a-5-" + i0 + "-" + i1,
                b: common_vendor.p({
                  size: "small",
                  src: reply.author.avatar_url
                }),
                c: common_vendor.t(reply.author.nickname || reply.author.username),
                d: common_vendor.t(getUsernameById(reply.replyTo)),
                e: common_vendor.t(reply.content),
                f: common_vendor.t(formatTime(reply.created_at)),
                g: reply._id
              };
            })
          } : {}, {
            h: comment._id
          });
        }),
        m: !((_b = draw_data.value.data.comment) == null ? void 0 : _b.length)
      }, !((_c = draw_data.value.data.comment) == null ? void 0 : _c.length) ? {} : {}, {
        n: common_vendor.o(submitComment),
        o: newComment.value,
        p: common_vendor.o(($event) => newComment.value = $event.detail.value),
        q: common_vendor.o(submitComment)
      });
    };
  }
});
wx.createPage(_sfc_main);
