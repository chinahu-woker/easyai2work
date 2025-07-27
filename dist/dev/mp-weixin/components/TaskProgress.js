"use strict";
const common_vendor = require("../common/vendor.js");
const stores_appStore = require("../stores/appStore.js");
if (!Array) {
  const _easycom_fui_background_image2 = common_vendor.resolveComponent("fui-background-image");
  const _easycom_up_swiper2 = common_vendor.resolveComponent("up-swiper");
  const _easycom_fui_parse2 = common_vendor.resolveComponent("fui-parse");
  const _easycom_fui_parse_group2 = common_vendor.resolveComponent("fui-parse-group");
  const _easycom_fui_fab2 = common_vendor.resolveComponent("fui-fab");
  (_easycom_fui_background_image2 + _easycom_up_swiper2 + _easycom_fui_parse2 + _easycom_fui_parse_group2 + _easycom_fui_fab2)();
}
const _easycom_fui_background_image = () => "./firstui/fui-background-image/fui-background-image.js";
const _easycom_up_swiper = () => "../node-modules/uview-plus/components/u-swiper/u-swiper.js";
const _easycom_fui_parse = () => "./firstui/fui-parse/fui-parse.js";
const _easycom_fui_parse_group = () => "./firstui/fui-parse-group/fui-parse-group.js";
const _easycom_fui_fab = () => "./firstui/fui-fab/fui-fab.js";
if (!Math) {
  (_easycom_fui_background_image + _easycom_up_swiper + TnIcon + _easycom_fui_parse + _easycom_fui_parse_group + _easycom_fui_fab + TnIcon + MyPopup)();
}
const MyPopup = () => "./common/MyPopup.js";
const TnIcon = () => "./node-modules/@tuniao/tnui-vue3-uniapp/components/icon/src/icon.js";
const loadingBackground = "https://chinahu-ai-server.oss-cn-chengdu.aliyuncs.com/aidraw/image/temps/onloading_bg.jpg";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "TaskProgress",
  props: {
    "modelValue": {
      default: false
    },
    "modelModifiers": {}
  },
  emits: ["update:modelValue"],
  setup(__props) {
    const currentSwiperIndex = common_vendor.ref(0);
    common_vendor.watch(currentSwiperIndex, () => {
      common_vendor.index.__f__("log", "at components/TaskProgress.vue:15", "currentSwiperIndex", currentSwiperIndex.value);
    });
    const { localTasks } = common_vendor.storeToRefs(stores_appStore.useAppStore());
    const AllList = common_vendor.computed(() => {
      common_vendor.index.setStorageSync("name", localTasks.value);
      const returnvalue = common_vendor.index.getStorageSync("name");
      return returnvalue;
    });
    const swiperData = common_vendor.computed(() => {
      if (localTasks.value.length === 0) {
        return [loadingBackground];
      }
      return localTasks.value.map((item) => {
        return item.status === 1 ? item.output[0] : loadingBackground;
      });
    });
    const currentProgress = common_vendor.computed(() => {
      if (localTasks.value.length === 0) {
        return "暂无任务";
      }
      const currentTask = localTasks.value[currentSwiperIndex.value];
      if (currentTask && currentTask.status === 4) {
        return currentTask.progress + "%";
      } else if (currentTask && currentTask.status === 0 && currentTask.queue) {
        return `对列:${currentTask.queue},预计:${currentTask.time_remained}s`;
      }
      return "";
    });
    const currentImageCount = common_vendor.computed(() => {
      const currentTask = localTasks.value[currentSwiperIndex.value];
      if (currentTask && currentTask.status === 1) {
        return currentTask.output.length;
      } else {
        return 0;
      }
    });
    const showProgress = common_vendor.computed(() => {
      var _a;
      return ((_a = localTasks.value[currentSwiperIndex.value]) == null ? void 0 : _a.status) !== 1;
    });
    const progressAnimation = common_vendor.ref({});
    const createAnimation = () => {
      const animation = common_vendor.index.createAnimation({
        duration: 500,
        // 动画时长
        timingFunction: "ease"
        // 动画缓动函数
      });
      animation.opacity(0).step();
      progressAnimation.value = animation.export();
      return animation;
    };
    function handleChange(index) {
      currentSwiperIndex.value = index.current;
    }
    const showPopup = common_vendor.useModel(__props, "modelValue");
    const handleTouchStart = () => {
      const animation = createAnimation();
      animation.opacity(0).step();
      progressAnimation.value = animation.export();
    };
    const handleTouchEnd = () => {
      const animation = createAnimation();
      animation.opacity(1).step();
      setTimeout(() => progressAnimation.value = animation.export(), 200);
    };
    const handleFindExecutingTaskIndex = () => {
      return localTasks.value.findIndex((item) => item.status === 4);
    };
    common_vendor.onShow(() => {
      const excIndex = handleFindExecutingTaskIndex();
      common_vendor.index.__f__("log", "at components/TaskProgress.vue:113", "task onshow", excIndex);
      if (excIndex !== -1) {
        currentSwiperIndex.value = handleFindExecutingTaskIndex();
      }
    });
    function checkContent(str) {
      const linkRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
      if (linkRegex.test(str)) {
        return 1;
      } else {
        return 2;
      }
    }
    function judgeContent(input) {
      const imageRegex = /\.(jpg|jpeg|png|gif|bmp)$/i;
      const videoRegex = /\.(mp4|avi|mov|mkv|flv|wmv)$/i;
      if (!input) {
        common_vendor.index.__f__("log", "at components/TaskProgress.vue:136", "==============", "是空值");
        return 0;
      }
      if (checkContent(input) == 1) {
        if (imageRegex.test(input)) {
          common_vendor.index.__f__("log", "at components/TaskProgress.vue:142", "==============", "是图片");
          return 1;
        } else if (videoRegex.test(input)) {
          common_vendor.index.__f__("log", "at components/TaskProgress.vue:147", "==============", "是视频");
          return 2;
        }
      }
      if (checkContent(input) == 2) {
        return 3;
      }
    }
    const StringImag = common_vendor.ref();
    const StringCont = common_vendor.ref("");
    const showOrSleep = common_vendor.ref(0);
    const allValueList = common_vendor.ref([{
      class: "pic",
      params: "",
      // 替换为实际参数
      output: "",
      // 替换为实际输出
      textImg: " "
      // 替换为实际图片路径
    }]);
    common_vendor.computed(() => {
      var _a, _b, _c, _d, _e, _f, _g, _h;
      common_vendor.index.__f__("log", "at components/TaskProgress.vue:171", "----------------------------{{generateParams}}----------------", localTasks.value[currentSwiperIndex.value]);
      const output = (_a = localTasks.value[currentSwiperIndex.value]) == null ? void 0 : _a.output[currentSwiperIndex.value];
      const contentType = judgeContent(output);
      allValueList.value = [];
      if (contentType === 0) {
        showOrSleep.value = 0;
      } else if (contentType === 1) {
        showOrSleep.value = 0;
        allValueList.value.push({
          class: "pic",
          params: ((_b = localTasks.value[currentSwiperIndex.value]) == null ? void 0 : _b.params) || "",
          // 替换为实际参数
          output,
          // 替换为实际输出
          textImg: " "
          // 替换为实际图片路径
        });
        common_vendor.index.__f__("log", "at components/TaskProgress.vue:187", "----------------------------{{generateParams}}------allValueList----------", allValueList.value);
        StringImag.value = output;
        StringCont.value = "";
        common_vendor.index.__f__("log", "at components/TaskProgress.vue:190", "----------output---showOrSleep.value = 0;---------", output);
      } else if (contentType === 2) {
        allValueList.value.push({
          class: "video",
          params: ((_c = localTasks.value[currentSwiperIndex.value]) == null ? void 0 : _c.params) || "",
          // 替换为实际参数
          output,
          // 替换为实际输出
          textImg: " "
          // 替换为实际图片路径
        });
        showOrSleep.value = 1;
        StringCont.value = "";
        StringImag.value = "output";
        common_vendor.index.__f__("log", "at components/TaskProgress.vue:202", "----------output---showOrSleep.value = 1;---------", output);
      } else if (contentType === 3) {
        allValueList.value.push({
          class: "text",
          params: ((_d = localTasks.value[currentSwiperIndex.value]) == null ? void 0 : _d.params) || "",
          // 替换为实际参数
          output,
          // 替换为实际输出
          textImg: (_f = (_e = localTasks.value[currentSwiperIndex.value]) == null ? void 0 : _e.params) == null ? void 0 : _f.image_path_mask
          // 替换为实际图片路径
        });
        showOrSleep.value = 2;
        StringCont.value = output;
        common_vendor.index.__f__("log", "at components/TaskProgress.vue:214", "----------output---showOrSleep.value = 2;---------", output, allValueList);
        StringImag.value = (_h = (_g = localTasks.value[currentSwiperIndex.value]) == null ? void 0 : _g.params) == null ? void 0 : _h.image_path_mask;
      }
    });
    const handleGotoHistory = () => {
      common_vendor.index.navigateTo({ url: "/pages/history/history_fui/history_fui" });
    };
    const handlePreview = () => {
      const currentTask = localTasks.value[currentSwiperIndex.value];
      if (currentTask && currentTask.status === 1) {
        common_vendor.index.__f__("log", "at components/TaskProgress.vue:283", "preview");
        common_vendor.index.previewImage({ urls: currentTask.output });
      }
    };
    const fabs = [
      {
        name: "edit",
        text: "复制文本"
      }
      // {
      // 	name: 'share',
      // 	text: '分享海报'
      // },
    ];
    common_vendor.ref(false);
    function handleClick(e, StringTxt) {
      if (e.index == 0) {
        common_vendor.index.__f__("log", "at components/TaskProgress.vue:300", "---------------(e)------------", e);
        common_vendor.index.setClipboardData({
          data: StringTxt,
          // 需要设置到剪切板的内容
          showToast: true,
          // 是否显示提示，默认为true
          success: function() {
            common_vendor.index.__f__("log", "at components/TaskProgress.vue:305", "复制成功");
          },
          fail: function(err) {
            common_vendor.index.__f__("error", "at components/TaskProgress.vue:308", "复制失败", err);
          }
        });
      } else if (e.index == 1) {
        common_vendor.index.value.toast("还在开发中.....");
      }
    }
    const current = common_vendor.ref(0);
    function change(e) {
      current.value = e.detail.current;
    }
    common_vendor.index.__f__("log", "at components/TaskProgress.vue:333", "--------****************------------", AllList, localTasks);
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          src: "https://chinahu-ai-server.oss-cn-chengdu.aliyuncs.com/aidraw/image/temps/67873d6c232a3c5d52240dd6/%C3%A7%C2%A4%C2%BE%C3%A4%C2%BA%C2%A4APP.jpg"
        }),
        b: common_vendor.f(AllList.value, (item, index, i0) => {
          var _a;
          return common_vendor.e({
            a: judgeContent(item.output[0]) == 1
          }, judgeContent(item.output[0]) == 1 ? {
            b: common_vendor.o(handlePreview, index),
            c: common_vendor.o(handleChange, index),
            d: "defa837f-2-" + i0 + ",defa837f-0",
            e: common_vendor.p({
              current: currentSwiperIndex.value,
              list: swiperData.value,
              previousMargin: "20",
              nextMargin: "20",
              imgMode: "aspectFill",
              height: "500",
              indicator: true,
              indicatorMode: "line",
              circular: true,
              autoplay: false,
              radius: "20",
              keyName: "url",
              indicatorStyle: "bottom"
            }),
            f: "defa837f-3-" + i0 + ",defa837f-0",
            g: common_vendor.p({
              name: "starry",
              size: "50"
            }),
            h: common_vendor.t(item.params.positive)
          } : {}, {
            i: judgeContent(item.output[0]) == 2
          }, judgeContent(item.output[0]) == 2 ? {
            j: item.output[0]
          } : {}, {
            k: judgeContent(item.output[0]) == 3
          }, judgeContent(item.output[0]) == 3 ? {
            l: ((_a = item == null ? void 0 : item.params) == null ? void 0 : _a.image_path_origin) || loadingBackground,
            m: "defa837f-5-" + i0 + "," + ("defa837f-4-" + i0),
            n: common_vendor.p({
              nodes: item.output[0],
              language: "html"
            }),
            o: "defa837f-4-" + i0 + ",defa837f-0",
            p: common_vendor.p({
              thBgcolor: false
            }),
            q: common_vendor.o(($event) => handleClick($event, item.output[0]), index),
            r: "defa837f-6-" + i0 + ",defa837f-0",
            s: common_vendor.p({
              position: "left",
              fabs
            })
          } : {}, {
            t: index
          });
        }),
        c: common_vendor.o(change),
        d: showProgress.value
      }, showProgress.value ? {
        e: common_vendor.p({
          name: "starry",
          size: "100",
          color: "tn-white"
        }),
        f: common_vendor.t(currentProgress.value),
        g: progressAnimation.value
      } : {}, {
        h: common_vendor.p({
          name: "image"
        }),
        i: common_vendor.t(currentImageCount.value),
        j: common_vendor.o(handleTouchEnd),
        k: common_vendor.o(handleTouchStart),
        l: common_vendor.p({
          name: "download-simple",
          size: "50rpx"
        }),
        m: common_vendor.o(handleGotoHistory),
        n: common_vendor.p({
          name: "right-arrow",
          size: "50rpx"
        }),
        o: common_vendor.o(($event) => showPopup.value = $event),
        p: common_vendor.p({
          modelValue: showPopup.value
        })
      });
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-defa837f"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../.sourcemap/mp-weixin/components/TaskProgress.js.map
