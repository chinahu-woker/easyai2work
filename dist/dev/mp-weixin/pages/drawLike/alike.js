"use strict";
const common_vendor = require("../../common/vendor.js");
const composables_aiChat = require("../../composables/aiChat.js");
const stores_appStore = require("../../stores/appStore.js");
const composables_useCommon = require("../../composables/useCommon.js");
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
      common_vendor.index.navigateBack({ url: "/pages/index/index?pageindex=2" });
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
      common_vendor.index.__f__("log", "at pages/drawLike/alike.vue:216", "全屏变化:", e.detail.fullScreen);
    }
    function handleVideoError(e) {
      common_vendor.index.showToast({ title: "视频加载失败", icon: "none" });
      common_vendor.index.__f__("error", "at pages/drawLike/alike.vue:222", "视频错误:", e.detail.errMsg);
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
        common_vendor.index.__f__("warn", "at pages/drawLike/alike.vue:250", "setCurrent 方法不可用或 swiper 未正确初始化");
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
    const draw_data = common_vendor.ref({
      data: {}
    });
    const detailId = common_vendor.ref("");
    common_vendor.onLoad(async (params) => {
      try {
        if (!params.id) {
          throw new Error("缺少必要参数：id");
        }
        common_vendor.index.__f__("log", "at pages/drawLike/alike.vue:316", "id:", params.id, user.value, draw_data);
        detailId.value = params.id;
        await composables_aiChat.getdetail(user.value, params.id).then((res) => {
          common_vendor.index.__f__("log", "at pages/drawLike/alike.vue:320", "获取到的getUserKey信息:", res.data);
          draw_data.value = res.data;
        }).catch((err) => {
          common_vendor.index.__f__("error", "at pages/drawLike/alike.vue:323", "获取getUserKey失败:", err);
        });
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/drawLike/alike.vue:327", "数据加载失败:", err);
        error.value = "加载失败，请重试";
        loading.value = false;
      }
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
    async function deleteComment(commentId) {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要删除这条评论吗？",
        success: async (res) => {
          if (res.confirm) {
            try {
              await composables_aiChat.delComment(user.value, commentId);
              common_vendor.index.showToast({ title: "删除成功" });
              const res2 = await composables_aiChat.getdetail(user.value, detailId.value);
              draw_data.value = res2.data;
            } catch (err) {
              common_vendor.index.__f__("error", "at pages/drawLike/alike.vue:391", "删除失败:", err);
              common_vendor.index.showToast({ title: "删除失败", icon: "none" });
            }
          }
        }
      });
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
      if (typeof userId === "string")
        ;
      else if (userId && typeof userId._id === "string") {
        userId._id;
      } else {
        return "未知用户";
      }
    }
    const activeReply = common_vendor.ref(null);
    function RefComments(targetId, rootId, replyTo) {
      activeReply.value = {
        _id: targetId,
        author: {
          _id: replyTo,
          username: getUsernameById(replyTo)
        },
        rootId
      };
      common_vendor.index.createSelectorQuery().select(".comment-section").boundingClientRect((res) => {
        if (res) {
          common_vendor.index.pageScrollTo({
            scrollTop: res.top - 100,
            duration: 300
          });
        }
      }).exec();
    }
    function clearReply() {
      activeReply.value = null;
    }
    async function submitComment() {
      var _a, _b;
      if (!composables_useCommon.isLogin.value) {
        common_vendor.index.showToast({ title: "请先登录", icon: "error" });
        return;
      }
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
        if (activeReply.value) {
          putdata.rootId = activeReply.value._id;
          putdata.replyTo = activeReply.value.author._id;
        }
        await composables_aiChat.Comment(user.value, putdata);
        common_vendor.index.showToast({ title: "提交成功" });
        const res = await composables_aiChat.getdetail(user.value, detailId.value);
        draw_data.value = res.data;
        newComment.value = "";
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/drawLike/alike.vue:498", "评论提交失败:", err);
        common_vendor.index.showToast({ title: "评论失败，请重试", icon: "none" });
      }
    }
    return (_ctx, _cache) => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
      return common_vendor.e({
        a: common_vendor.p({
          name: "arrowleft"
        }),
        b: common_vendor.o(leftClick),
        c: common_vendor.p({
          background: "transparent",
          title: (_a = draw_data.value.data.options) == null ? void 0 : _a.workflow_title
        }),
        d: common_vendor.f((_b = draw_data.value.data) == null ? void 0 : _b.output, (item, index, i0) => {
          return common_vendor.e({
            a: getItemType(item) === "image"
          }, getItemType(item) === "image" ? {
            b: item,
            c: common_vendor.o(($event) => previewImage(item), index)
          } : common_vendor.e({
            d: `video-${index}`,
            e: item,
            f: common_vendor.o(($event) => handleVideoPlay(index), index),
            g: common_vendor.o(handleVideoFullscreenChange, index),
            h: common_vendor.o(handleVideoError, index),
            i: currentVideoIndex.value !== index
          }, currentVideoIndex.value !== index ? {
            j: "c4d558ba-2-" + i0,
            k: common_vendor.p({
              name: "play",
              color: "#fff",
              size: "60"
            }),
            l: common_vendor.o(($event) => playVideo(index), index)
          } : {}), {
            m: index
          });
        }),
        e: swiperHeight.value + "px",
        f: common_vendor.o(onSwiperChange),
        g: ((_d = (_c = draw_data.value.data) == null ? void 0 : _c.output) == null ? void 0 : _d.length) > 1
      }, ((_f = (_e = draw_data.value.data) == null ? void 0 : _e.output) == null ? void 0 : _f.length) > 1 ? {
        h: common_vendor.f((_g = draw_data.value.data) == null ? void 0 : _g.output, (item, index_cer, i0) => {
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
          var _a2, _b2, _c2, _d2, _e2, _f2, _g2;
          return common_vendor.e({
            a: "c4d558ba-4-" + i0,
            b: common_vendor.p({
              size: "small",
              src: (_a2 = comment.author) == null ? void 0 : _a2.avatar_url
            }),
            c: common_vendor.t(((_b2 = comment.author) == null ? void 0 : _b2.nickname) || ((_c2 = comment.author) == null ? void 0 : _c2.username)),
            d: common_vendor.t(comment == null ? void 0 : comment.content),
            e: common_vendor.t(formatTime(comment.created_at)),
            f: comment.replies && ((_d2 = comment.replies) == null ? void 0 : _d2.length)
          }, comment.replies && ((_e2 = comment.replies) == null ? void 0 : _e2.length) ? {
            g: common_vendor.f(comment.replies, (reply, k1, i1) => {
              var _a3, _b3, _c3;
              return {
                a: "c4d558ba-5-" + i0 + "-" + i1,
                b: common_vendor.p({
                  size: "small",
                  src: (_a3 = reply.author) == null ? void 0 : _a3.avatar_url
                }),
                c: common_vendor.t(((_b3 = reply.author) == null ? void 0 : _b3.nickname) || ((_c3 = reply.author) == null ? void 0 : _c3.username)),
                d: common_vendor.t(reply.content),
                e: common_vendor.t(formatTime(reply.created_at)),
                f: reply._id
              };
            }),
            h: common_vendor.t(((_f2 = comment.author) == null ? void 0 : _f2.nickname) || ((_g2 = comment.author) == null ? void 0 : _g2.username))
          } : {}, {
            i: comment.author._id === common_vendor.unref(user)._id
          }, comment.author._id === common_vendor.unref(user)._id ? {
            j: common_vendor.o(($event) => deleteComment(comment._id), comment._id)
          } : {}, {
            k: common_vendor.o(($event) => RefComments(comment._id, comment._id, comment.author._id), comment._id),
            l: comment._id
          });
        }),
        m: !((_i = (_h = draw_data.value) == null ? void 0 : _h.data.comment) == null ? void 0 : _i.length)
      }, !((_k = (_j = draw_data.value) == null ? void 0 : _j.data.comment) == null ? void 0 : _k.length) ? {} : {}, {
        n: activeReply.value
      }, activeReply.value ? {
        o: common_vendor.t(activeReply.value.author.nickname || activeReply.value.author.username)
      } : {}, {
        p: common_vendor.o(submitComment),
        q: newComment.value,
        r: common_vendor.o(($event) => newComment.value = $event.detail.value),
        s: common_vendor.o(submitComment),
        t: activeReply.value
      }, activeReply.value ? {
        v: common_vendor.o(clearReply)
      } : {});
    };
  }
});
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/drawLike/alike.js.map
