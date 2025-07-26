"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {};
  },
  methods: {
    onClick() {
      common_vendor.index.chooseImage({
        count: 1,
        success: (res) => {
          this.$refs.chjImgEdit.open({
            // 底图路径
            path: res.tempFilePaths[0],
            // 取消是否有弹窗提示
            isCancelToast: true,
            // 取消弹窗提示内容
            cancelText: "确定真的退出吗?",
            // 确定是否有弹窗提示
            isConfirmToast: true,
            // 确定弹窗提示内容
            confirmText: "决定好了吗?",
            // 设置图标
            iconPath: {
              goForward_active: "/static/goForward.png",
              // 前进不可点击状态
              goForward_inactive: "/static/goForward_inactive.png",
              // 后退可点击状态
              retreat_active: "/static/retreat.png",
              // 后退不可点击状态
              retreat_inactive: "/static/retreat_inactive.png",
              // 重置
              reset: "/static/reset.png",
              // 取消
              close: "/static/close.png",
              // 确定
              confirm: "/static/determine.png",
              // 笔
              pen: "/static/graffiti.png",
              // 橡皮
              rubber: "/static/rubber.png"
            },
            // 设置涂鸦图标（根据下标匹配）
            iconPathGraffiti: {
              0: "/static/iconPathGraffiti-1.png",
              1: "/static/iconPathGraffiti-2.png",
              2: "/static/iconPathGraffiti-3.png",
              3: "/static/iconPathGraffiti-4.png",
              4: "/static/iconPathGraffiti-5.png",
              5: "/static/iconPathGraffiti-6.png"
            }
          });
        }
      });
    },
    confirm(path) {
      console.log("确定");
      common_vendor.index.previewImage({
        urls: [path]
      });
    },
    cancel() {
      console.log("取消");
    },
    getLineLength(length) {
      console.log("获取线条长度" + length + "px");
    },
    getRectPosition(obj) {
      console.log(obj);
    }
  }
};
if (!Array) {
  const _easycom_chj_imgEdit2 = common_vendor.resolveComponent("chj-imgEdit");
  _easycom_chj_imgEdit2();
}
const _easycom_chj_imgEdit = () => "../../components/chj-imgEdit/chj-imgEdit.js";
if (!Math) {
  _easycom_chj_imgEdit();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.onClick && $options.onClick(...args)),
    b: common_vendor.sr("chjImgEdit", "26459ed1-0"),
    c: common_vendor.o($options.confirm),
    d: common_vendor.o($options.cancel),
    e: common_vendor.o($options.getLineLength),
    f: common_vendor.o($options.getRectPosition),
    g: common_vendor.p({
      isAllCanvas: false
    }),
    h: common_vendor.gei(_ctx, "")
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
