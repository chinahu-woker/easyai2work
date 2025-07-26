"use strict";
const common_vendor = require("../../../../common/vendor.js");
const useGraphicCard = (props, emits) => {
  const viewUserAvatars = common_vendor.ref([]);
  const viewUserCount = common_vendor.ref(0);
  if (props.showViewUser) {
    viewUserAvatars.value = props.viewUserAvatars.slice(
      0,
      props.maxViewUserAvatarCount
    );
    viewUserCount.value = props.viewUserAvatars.length;
  }
  const imageCount = common_vendor.computed(
    () => {
      var _a;
      return common_vendor.isEmptyVariableInDefault((_a = props == null ? void 0 : props.images) == null ? void 0 : _a.length, 0);
    }
  );
  const previewImageHandle = (index) => {
    common_vendor.index.previewImage({
      urls: props.images,
      current: index
    });
  };
  const cardClickEvent = () => {
    emits("click");
  };
  const handleAvatarClick = () => {
    emits("avatar-view-click");
  };
  const handleMoreClick = () => {
    emits("more-click");
  };
  const handleHotClick = () => {
    emits("hot-click");
  };
  const handleCommentClick = () => {
    emits("comment-click");
  };
  const handleLikeClick = () => {
    emits("like-click");
  };
  return {
    viewUserAvatars,
    viewUserCount,
    imageCount,
    previewImageHandle,
    cardClickEvent,
    handleAvatarClick,
    handleMoreClick,
    handleHotClick,
    handleCommentClick,
    handleLikeClick
  };
};
exports.useGraphicCard = useGraphicCard;
