"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_request = require("../../utils/request.js");
const utils_common = require("../../utils/common.js");
if (!Array) {
  const _easycom_fui_background_image2 = common_vendor.resolveComponent("fui-background-image");
  const _easycom_up_status_bar2 = common_vendor.resolveComponent("up-status-bar");
  const _easycom_fui_footer2 = common_vendor.resolveComponent("fui-footer");
  (_easycom_fui_background_image2 + _easycom_up_status_bar2 + _easycom_fui_footer2)();
}
const _easycom_fui_background_image = () => "../../components/firstui/fui-background-image/fui-background-image.js";
const _easycom_up_status_bar = () => "../../node-modules/uview-plus/components/u-status-bar/u-status-bar.js";
const _easycom_fui_footer = () => "../../components/firstui/fui-footer/fui-footer.js";
if (!Math) {
  (_easycom_fui_background_image + _easycom_up_status_bar + MyGraphicCard + BaseLayout + _easycom_fui_footer)();
}
const BaseLayout = () => "../../layouts/BaseLayout.js";
const MyGraphicCard = () => "../../components/custom/MyGraphicCard/MyGraphicCard.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "creative",
  setup(__props) {
    common_vendor.onMounted(() => {
      getTestImageData();
    });
    common_vendor.onUnmounted(() => {
      imageData.value = [];
    });
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
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          src: "@/src/static/Home2 (1).jpgHome2(1).jpg"
        }),
        b: common_vendor.f(graphicDatas.value, (graphicData, k0, i0) => {
          return {
            a: "7c5b6807-3-" + i0 + ",7c5b6807-1",
            b: common_vendor.p({
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
            })
          };
        }),
        c: common_vendor.p({
          text: "Copyright © 2021 Fuzi-AI"
        })
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-7c5b6807"]]);
wx.createPage(MiniProgramPage);
