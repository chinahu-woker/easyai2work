"use strict";
const common_vendor = require("../../../common/vendor.js");
const components_custom_MyGraphicCard_types = require("./types.js");
const components_custom_MyGraphicCard_composables_graphicCardCustom = require("./composables/graphic-card-custom.js");
const components_custom_MyGraphicCard_composables_useGraphicCard = require("./composables/use-graphic-card.js");
if (!Math) {
  (TnAvatar + TnIcon + TnLazyLoad + TnPhotoAlbum + TnAvatarGroup)();
}
const TnIcon = () => "../../node-modules/@tuniao/tnui-vue3-uniapp/components/icon/src/icon.js";
const TnPhotoAlbum = () => "../../node-modules/@tuniao/tnui-vue3-uniapp/components/photo-album/src/photo-album.js";
const TnAvatar = () => "../../node-modules/@tuniao/tnui-vue3-uniapp/components/avatar/src/avatar.js";
const TnAvatarGroup = () => "../../node-modules/@tuniao/tnui-vue3-uniapp/components/avatar/src/avatar-group.js";
const TnLazyLoad = () => "../../node-modules/@tuniao/tnui-vue3-uniapp/components/lazy-load/src/lazy-load.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "MyGraphicCard",
  props: components_custom_MyGraphicCard_types.graphicCardProps,
  emits: components_custom_MyGraphicCard_types.graphicCardEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const {
      viewUserAvatars,
      viewUserCount,
      imageCount,
      previewImageHandle,
      cardClickEvent,
      handleAvatarClick,
      handleMoreClick,
      handleCommentClick,
      handleHotClick,
      handleLikeClick
    } = components_custom_MyGraphicCard_composables_useGraphicCard.useGraphicCard(props, emits);
    const {
      ns,
      tagClass,
      tagStyle,
      hotClass,
      hotStyle,
      commentClass,
      commentStyle,
      likeClass,
      likeStyle
    } = components_custom_MyGraphicCard_composables_graphicCardCustom.useGraphicCardCustomStyle(props);
    function linkType(url) {
      if (typeof url !== "string")
        return 2;
      const imageExtensions = /\.(jpg|jpeg|png|gif|bmp|webp)$/i;
      const videoExtensions = /\.(mp4|avi|mov|mkv|flv|wmv)$/i;
      if (imageExtensions.test(url))
        return 0;
      if (videoExtensions.test(url))
        return 1;
      return 2;
    }
    return (_ctx, _cache) => {
      var _a;
      return common_vendor.e({
        a: _ctx.avatar
      }, _ctx.avatar ? {
        b: common_vendor.p({
          url: _ctx.avatar
        })
      } : {
        c: common_vendor.t((_a = _ctx.username) == null ? void 0 : _a.slice(0, 1)),
        d: common_vendor.p({
          size: 80
        })
      }, {
        e: common_vendor.n(common_vendor.unref(ns).e("brief-info__avatar")),
        f: common_vendor.o(
          //@ts-ignore
          (...args) => common_vendor.unref(handleAvatarClick) && common_vendor.unref(handleAvatarClick)(...args)
        ),
        g: common_vendor.t(_ctx.title),
        h: _ctx.description
      }, _ctx.description ? {
        i: common_vendor.t(_ctx.description)
      } : {}, {
        j: common_vendor.n(common_vendor.unref(ns).e("brief-info__data")),
        k: common_vendor.n(common_vendor.unref(ns).e("brief-info__content")),
        l: _ctx.showMore
      }, _ctx.showMore ? {
        m: common_vendor.p({
          name: "more-vertical"
        }),
        n: common_vendor.n(common_vendor.unref(ns).em("brief-info__operation", "more")),
        o: common_vendor.o(
          //@ts-ignore
          (...args) => common_vendor.unref(handleMoreClick) && common_vendor.unref(handleMoreClick)(...args)
        ),
        p: common_vendor.n(common_vendor.unref(ns).e("brief-info__operation"))
      } : {}, {
        q: common_vendor.n(common_vendor.unref(ns).e("brief-info")),
        r: common_vendor.f(_ctx.tags, (tagItem, tagIndex, i0) => {
          return {
            a: "1bacfa93-3-" + i0,
            b: common_vendor.t(tagItem),
            c: tagIndex
          };
        }),
        s: common_vendor.p({
          name: "topics-fill"
        }),
        t: common_vendor.n(common_vendor.unref(tagClass)),
        v: common_vendor.s(common_vendor.unref(tagStyle)),
        w: common_vendor.n(common_vendor.unref(ns).e("content__tags")),
        x: common_vendor.t(_ctx.content),
        y: common_vendor.n(common_vendor.unref(ns).e("content__data")),
        z: common_vendor.n(common_vendor.unref(ns).e("content")),
        A: linkType(_ctx.images.slice(-1)[0]) == 0
      }, linkType(_ctx.images.slice(-1)[0]) == 0 ? common_vendor.e({
        B: !!common_vendor.unref(imageCount)
      }, !!common_vendor.unref(imageCount) ? common_vendor.e({
        C: common_vendor.unref(imageCount) === 1
      }, common_vendor.unref(imageCount) === 1 ? {
        D: common_vendor.p({
          mode: "aspectFit",
          src: _ctx.images[0]
        }),
        E: common_vendor.n(common_vendor.unref(ns).em("images", "item")),
        F: common_vendor.n(common_vendor.unref(ns).is("one")),
        G: common_vendor.o(($event) => common_vendor.unref(previewImageHandle)(0))
      } : {}, {
        H: common_vendor.unref(imageCount) === 2
      }, common_vendor.unref(imageCount) === 2 ? {
        I: common_vendor.p({
          data: _ctx.images,
          column: 2
        }),
        J: common_vendor.n(common_vendor.unref(ns).em("images", "item")),
        K: common_vendor.n(common_vendor.unref(ns).is("two"))
      } : {}, {
        L: common_vendor.unref(imageCount) === 3
      }, common_vendor.unref(imageCount) === 3 ? {
        M: common_vendor.p({
          mode: "aspectFit",
          src: _ctx.images[0]
        }),
        N: common_vendor.o(($event) => common_vendor.unref(previewImageHandle)(0)),
        O: common_vendor.p({
          src: _ctx.images[1]
        }),
        P: common_vendor.o(($event) => common_vendor.unref(previewImageHandle)(1)),
        Q: common_vendor.p({
          src: _ctx.images[2]
        }),
        R: common_vendor.o(($event) => common_vendor.unref(previewImageHandle)(2)),
        S: common_vendor.n(common_vendor.unref(ns).em("images", "item")),
        T: common_vendor.n(common_vendor.unref(ns).is("three"))
      } : {}, {
        U: common_vendor.unref(imageCount) === 4
      }, common_vendor.unref(imageCount) === 4 ? {
        V: common_vendor.p({
          data: _ctx.images,
          column: 2
        }),
        W: common_vendor.n(common_vendor.unref(ns).em("images", "item")),
        X: common_vendor.n(common_vendor.unref(ns).is("four"))
      } : {}, {
        Y: common_vendor.unref(imageCount) >= 5
      }, common_vendor.unref(imageCount) >= 5 ? {
        Z: common_vendor.p({
          data: _ctx.images
        })
      } : {}, {
        aa: common_vendor.n(common_vendor.unref(ns).e("images"))
      }) : {}) : {}, {
        ab: common_vendor.n(common_vendor.unref(ns).e("container")),
        ac: linkType(_ctx.images.slice(-1)[0]) == 1
      }, linkType(_ctx.images.slice(-1)[0]) == 1 ? common_vendor.e({
        ad: !!common_vendor.unref(imageCount)
      }, !!common_vendor.unref(imageCount) ? common_vendor.e({
        ae: common_vendor.unref(imageCount) === 1
      }, common_vendor.unref(imageCount) === 1 ? {
        af: common_vendor.f(_ctx.images, (item, index, i0) => {
          return {
            a: _ctx.images[index],
            b: index
          };
        }),
        ag: common_vendor.n(common_vendor.unref(ns).em("images", "item")),
        ah: common_vendor.n(common_vendor.unref(ns).is("one"))
      } : {
        ai: _ctx.images.slice(-1)[0]
      }, {
        aj: common_vendor.n(common_vendor.unref(ns).e("images"))
      }) : {}) : {}, {
        ak: _ctx.showHot
      }, _ctx.showHot ? {
        al: common_vendor.p({
          name: _ctx.activeHot ? _ctx.activeHotIcon : _ctx.hotIcon,
          size: "20px"
        }),
        am: common_vendor.t(_ctx.hotCount),
        an: common_vendor.n(common_vendor.unref(hotClass)),
        ao: common_vendor.s(common_vendor.unref(hotStyle)),
        ap: common_vendor.o(
          //@ts-ignore
          (...args) => common_vendor.unref(handleHotClick) && common_vendor.unref(handleHotClick)(...args)
        )
      } : {}, {
        aq: _ctx.showComment
      }, _ctx.showComment ? {
        ar: common_vendor.p({
          name: _ctx.activeComment ? _ctx.activeCommentIcon : _ctx.commentIcon,
          size: "20px"
        }),
        as: common_vendor.t(_ctx.commentCount),
        at: common_vendor.n(common_vendor.unref(commentClass)),
        av: common_vendor.s(common_vendor.unref(commentStyle)),
        aw: common_vendor.o(
          //@ts-ignore
          (...args) => common_vendor.unref(handleCommentClick) && common_vendor.unref(handleCommentClick)(...args)
        )
      } : {}, {
        ax: _ctx.showLike
      }, _ctx.showLike ? {
        ay: common_vendor.p({
          name: _ctx.activeLike ? _ctx.activeLikeIcon : _ctx.likeIcon,
          size: "20px"
        }),
        az: common_vendor.t(_ctx.likeCount),
        aA: common_vendor.n(common_vendor.unref(likeClass)),
        aB: common_vendor.s(common_vendor.unref(likeStyle)),
        aC: common_vendor.o(
          //@ts-ignore
          (...args) => common_vendor.unref(handleLikeClick) && common_vendor.unref(handleLikeClick)(...args)
        )
      } : {}, {
        aD: common_vendor.n(common_vendor.unref(ns).e("bottom-info__left")),
        aE: _ctx.showViewUser && common_vendor.unref(viewUserAvatars).length || _ctx.$slots.bottomRight
      }, _ctx.showViewUser && common_vendor.unref(viewUserAvatars).length || _ctx.$slots.bottomRight ? {
        aF: common_vendor.f(common_vendor.unref(viewUserAvatars), (viewUserAvatar, viewUserIndex, i0) => {
          return {
            a: viewUserIndex,
            b: "1bacfa93-15-" + i0 + ",1bacfa93-14",
            c: common_vendor.p({
              url: viewUserAvatar
            })
          };
        }),
        aG: common_vendor.p({
          border: true,
          size: "sm"
        }),
        aH: common_vendor.n(common_vendor.unref(ns).e("view-user-list")),
        aI: common_vendor.t(_ctx.viewCount !== void 0 ? _ctx.viewCount : common_vendor.unref(viewUserCount)),
        aJ: common_vendor.n(common_vendor.unref(ns).e("view-user-count")),
        aK: common_vendor.n(common_vendor.unref(ns).e("bottom-info__right"))
      } : {}, {
        aL: common_vendor.n(common_vendor.unref(ns).e("bottom-info")),
        aM: common_vendor.n(common_vendor.unref(ns).is("no-content", !!_ctx.$slots.bottomRight)),
        aN: common_vendor.n(common_vendor.unref(ns).b()),
        aO: common_vendor.o(
          //@ts-ignore
          (...args) => common_vendor.unref(cardClickEvent) && common_vendor.unref(cardClickEvent)(...args)
        ),
        aP: common_vendor.gei(_ctx, "")
      });
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1bacfa93"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/components/custom/MyGraphicCard/MyGraphicCard.js.map
