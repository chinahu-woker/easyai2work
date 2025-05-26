"use strict";
const common_vendor = require("../../../../common/vendor.js");
const useGraphicCardCustomStyle = (props) => {
  const ns = common_vendor.useNamespace("graphic-card");
  const [tagBgColorClass, tagBgColorStyle] = common_vendor.useComponentColor(
    common_vendor.toRef(props, "tagBgColor"),
    "bg"
  );
  const [tagTextColorClass, tagTextColorStyle] = common_vendor.useComponentColor(
    common_vendor.toRef(props, "tagTextColor"),
    "text"
  );
  const [hotColorClass, hotColorStyle] = common_vendor.useComponentColor(
    common_vendor.toRef(props, "hotColor"),
    "text"
  );
  const [activeHotColorClass, activeHotColorStyle] = common_vendor.useComponentColor(
    common_vendor.toRef(props, "activeHotColor"),
    "text"
  );
  const [commentColorClass, commentColorStyle] = common_vendor.useComponentColor(
    common_vendor.toRef(props, "commentColor"),
    "text"
  );
  const [activeCommentColorClass, activeCommentColorStyle] = common_vendor.useComponentColor(
    common_vendor.toRef(props, "activeCommentColor"),
    "text"
  );
  const [likeColorClass, likeColorStyle] = common_vendor.useComponentColor(
    common_vendor.toRef(props, "likeColor"),
    "text"
  );
  const [activeLikeColorClass, activeLikeColorStyle] = common_vendor.useComponentColor(
    common_vendor.toRef(props, "activeLikeColor"),
    "text"
  );
  const tagClass = common_vendor.computed(() => {
    const cls = [];
    if (tagBgColorClass.value)
      cls.push(tagBgColorClass.value);
    if (tagTextColorClass.value)
      cls.push(tagTextColorClass.value);
    return cls.join(" ");
  });
  const tagStyle = common_vendor.computed(() => {
    const style = {};
    if (!tagBgColorClass.value) {
      style.backgroundColor = tagBgColorStyle.value || "var(--tn-color-gray-disabled)";
    }
    if (tagTextColorStyle.value) {
      style.color = tagTextColorStyle.value;
    } else if (!tagTextColorClass.value && !tagBgColorClass.value) {
      style.color = "var(--tn-text-color-primary)";
    }
    return style;
  });
  const hotClass = common_vendor.computed(() => {
    const cls = [ns.e("hot")];
    if (props.activeHot) {
      if (activeHotColorClass.value)
        cls.push(activeHotColorClass.value);
    } else {
      if (hotColorClass.value)
        cls.push(hotColorClass.value);
    }
    return cls.join(" ");
  });
  const hotStyle = common_vendor.computed(() => {
    const style = {};
    if (props.activeHot) {
      if (!activeHotColorClass.value) {
        style.color = activeHotColorStyle.value || "var(--tn-color-primary)";
      }
    } else {
      if (!hotColorClass.value) {
        style.color = hotColorStyle.value || "var(--tn-color-gray)";
      }
    }
    return style;
  });
  const commentClass = common_vendor.computed(() => {
    const cls = [ns.e("comment")];
    if (props.activeComment) {
      if (activeCommentColorClass.value)
        cls.push(activeCommentColorClass.value);
    } else {
      if (commentColorClass.value)
        cls.push(commentColorClass.value);
    }
    return cls.join(" ");
  });
  const commentStyle = common_vendor.computed(() => {
    const style = {};
    if (props.activeComment) {
      if (!activeCommentColorClass.value) {
        style.color = activeCommentColorStyle.value || "var(--tn-color-primary)";
      }
    } else {
      if (!commentColorClass.value) {
        style.color = commentColorStyle.value || "var(--tn-color-gray)";
      }
    }
    return style;
  });
  const likeClass = common_vendor.computed(() => {
    const cls = [ns.e("like")];
    if (props.activeLike) {
      if (activeLikeColorClass.value)
        cls.push(activeLikeColorClass.value);
    } else {
      if (likeColorClass.value)
        cls.push(likeColorClass.value);
    }
    return cls.join(" ");
  });
  const likeStyle = common_vendor.computed(() => {
    const style = {};
    if (props.activeLike) {
      if (!activeLikeColorClass.value) {
        style.color = activeLikeColorStyle.value || "var(--tn-color-red)";
      }
    } else {
      if (!likeColorClass.value) {
        style.color = likeColorStyle.value || "var(--tn-color-gray)";
      }
    }
    return style;
  });
  return {
    ns,
    tagClass,
    tagStyle,
    hotClass,
    hotStyle,
    commentClass,
    commentStyle,
    likeClass,
    likeStyle
  };
};
exports.useGraphicCardCustomStyle = useGraphicCardCustomStyle;
