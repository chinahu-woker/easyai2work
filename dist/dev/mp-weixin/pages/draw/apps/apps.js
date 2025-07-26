"use strict";
const common_vendor = require("../../../common/vendor.js");
const composables_useWorkFlow = require("../../../composables/useWorkFlow.js");
const stores_appStore = require("../../../stores/appStore.js");
const utils_common = require("../../../utils/common.js");
if (!Array) {
  const _easycom_fui_icon2 = common_vendor.resolveComponent("fui-icon");
  const _easycom_fui_nav_bar2 = common_vendor.resolveComponent("fui-nav-bar");
  const _easycom_up_status_bar2 = common_vendor.resolveComponent("up-status-bar");
  const _easycom_up_button2 = common_vendor.resolveComponent("up-button");
  (_easycom_fui_icon2 + _easycom_fui_nav_bar2 + _easycom_up_status_bar2 + _easycom_up_button2)();
}
const _easycom_fui_icon = () => "../../../components/firstui/fui-icon/fui-icon.js";
const _easycom_fui_nav_bar = () => "../../../components/firstui/fui-nav-bar/fui-nav-bar.js";
const _easycom_up_status_bar = () => "../../../node-modules/uview-plus/components/u-status-bar/u-status-bar.js";
const _easycom_up_button = () => "../../../node-modules/uview-plus/components/u-button/u-button.js";
if (!Math) {
  (_easycom_fui_icon + _easycom_fui_nav_bar + TaskProgress + _easycom_up_status_bar + Seed + ImageUploadMore + AudioUpload + ImageUpload + Width + Height + Positive + ModeSelect + Picker + CustomNumberBox + ImageSelectPreview + MoreImageUpload + _easycom_up_button + TnIcon + DragButton2 + BaseLayout)();
}
const BaseLayout = () => "../../../layouts/BaseLayout.js";
const ImageUpload = () => "../../../components/dynamic/ImageUpload.js";
const ImageUploadMore = () => "../../../components/dynamic/ImageUploadMore.js";
const MoreImageUpload = () => "../../../components/dynamic/MoreImageUpload.js";
const AudioUpload = () => "../../../components/dynamic/AudioUpload.js";
const Height = () => "../../../components/dynamic/Height.js";
const Positive = () => "../../../components/dynamic/Positive.js";
const Picker = () => "../../../components/dynamic/Picker.js";
const CustomNumberBox = () => "../../../components/dynamic/CustomNumberBox.js";
const Width = () => "../../../components/dynamic/Width.js";
const Seed = () => "../../../components/dynamic/Seed.js";
const ImageSelectPreview = () => "../../../components/dynamic/ImageSelectPreview.js";
const ModeSelect = () => "../../../components/dynamic/ModeSelect.js";
const TaskProgress = () => "../../../components/TaskProgress.js";
const TnIcon = () => "../../../node-modules/@tuniao/tnui-vue3-uniapp/components/icon/src/icon.js";
const DragButton2 = () => "../../../components/common/DragButton2.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "apps",
  setup(__props) {
    const {
      workflow,
      handleGetWorkFlwById,
      workFlowParamLists,
      bindParam,
      handleFindComponentName,
      handleSubmitTaskTask
    } = composables_useWorkFlow.useWorkFlow();
    console.log("--------------------------", workFlowParamLists);
    const workflowId = common_vendor.ref("");
    common_vendor.onLoad(async () => {
      const currentPage = getCurrentPages().pop();
      if (currentPage) {
        const query = currentPage.options;
        if (query) {
          workflowId.value = query.id;
          handleGetWorkFlwById(query.id).then(() => {
            if (query.isRegenerate && query.regenerateParams) {
              const params = JSON.parse(decodeURIComponent(query.regenerateParams));
              bindParam.value = { ...params };
            }
          });
        }
      }
    });
    const showPopup = common_vendor.ref(false);
    const FlotButton = common_vendor.ref("空闲");
    const currentSwiperIndex = common_vendor.ref(0);
    common_vendor.watch(currentSwiperIndex, () => {
      console.log("currentSwiperIndex", currentSwiperIndex.value);
    });
    const { localTasks } = common_vendor.storeToRefs(stores_appStore.useAppStore());
    const currentProgress = common_vendor.computed(() => {
      const excuTask = localTasks.value[currentSwiperIndex.value];
      if (excuTask && excuTask.status === 4) {
        return `${excuTask.progress || 0} % `;
      } else if (excuTask && excuTask.status === 0 && excuTask.queue) {
        return `对列:${excuTask.queue}`;
      } else {
        return FlotButton.value;
      }
    });
    const endPos = common_vendor.ref({ x: 0, y: 0 });
    const anims = common_vendor.ref([]);
    const startAnimation = async () => {
      if (seedRef.value && seedRef.value.length > 0) {
        for (const item of seedRef.value) {
          item.getSeed();
        }
      }
      handleSubmitTaskTask();
      const key = utils_common.randomId(5);
      anims.value.push({
        key,
        id: "addBtn",
        left: 0,
        top: 0,
        y: 0,
        x: 0
      });
      await common_vendor.nextTick$1();
      const submitBtn = common_vendor.index.createSelectorQuery().select("#submit-btn");
      common_vendor.index.createSelectorQuery().select("#cartBtn");
      submitBtn.boundingClientRect().exec((rect) => {
        anims.value.some((citem) => {
          if (citem.key === key) {
            citem.top = rect[0].top;
            citem.left = rect[0].left + rect[0].width / 2;
            return true;
          }
          return false;
        });
        common_vendor.nextTick$1(() => {
          let end = { x: 0, y: 0 };
          if (endPos.value.x > 300) {
            end = { x: endPos.value.x - 50, y: endPos.value.y };
          } else {
            end = { x: endPos.value.x, y: endPos.value.y };
          }
          anims.value.some((citem) => {
            if (citem.key === key) {
              citem.y = end.y - rect[0].top;
              citem.x = end.x - rect[0].left - rect[0].width / 2;
              setTimeout(() => {
                anims.value.splice(anims.value.findIndex((v) => v.key === key), 1);
              }, 500);
              return true;
            }
            return false;
          });
        });
      });
    };
    const handToggelePregress = () => {
      showPopup.value = !showPopup.value;
      if (showPopup.value) {
        FlotButton.value = "返回";
      } else {
        FlotButton.value = "空闲";
      }
    };
    const seedRef = common_vendor.ref([]);
    function leftClick() {
      common_vendor.index.redirectTo({ url: "/pages/index/index" });
    }
    function checkFileType(input) {
      const imageRegex = /\.(jpg|jpeg|png|gif|bmp)$/i;
      const videoRegex = /\.(mp3|wav|ogg)$/i;
      if (!input) {
        console.log("==============", "是空值");
        return 0;
      } else if (imageRegex.test(input)) {
        console.log("==============", "是图片");
        return 1;
      } else if (videoRegex.test(input)) {
        console.log("==============", "是音频");
        return 2;
      }
    }
    common_vendor.ref();
    return (_ctx, _cache) => {
      var _a, _b;
      return common_vendor.e({
        a: common_vendor.p({
          name: "arrowleft"
        }),
        b: common_vendor.o(leftClick),
        c: common_vendor.p({
          title: (_a = common_vendor.unref(workflow)) == null ? void 0 : _a.title
        }),
        d: showPopup.value
      }, showPopup.value ? {
        e: common_vendor.o(($event) => showPopup.value = $event),
        f: common_vendor.p({
          modelValue: showPopup.value
        })
      } : {}, {
        g: common_vendor.f(common_vendor.unref(workFlowParamLists), (item, index, i0) => {
          return common_vendor.e({
            a: common_vendor.unref(handleFindComponentName)(item.name) === "Seed"
          }, common_vendor.unref(handleFindComponentName)(item.name) === "Seed" ? {
            b: common_vendor.sr(seedRef, "6cf62e12-5-" + i0 + ",6cf62e12-3", {
              "k": "seedRef",
              "f": 1
            }),
            c: "6cf62e12-5-" + i0 + ",6cf62e12-3",
            d: common_vendor.o(($event) => common_vendor.unref(bindParam)[item.name] = $event, index),
            e: common_vendor.p({
              title: item.title,
              options: item.attributes,
              modelValue: common_vendor.unref(bindParam)[item.name]
            })
          } : common_vendor.unref(handleFindComponentName)(item.name) === "ImageUploadMore" ? {
            g: "6cf62e12-6-" + i0 + ",6cf62e12-3",
            h: common_vendor.o(($event) => common_vendor.unref(bindParam)[item.name] = $event, index),
            i: common_vendor.p({
              title: item.title,
              options: item.attributes,
              modelValue: common_vendor.unref(bindParam)[item.name]
            })
          } : common_vendor.unref(handleFindComponentName)(item.name) === "ImageUpload" ? common_vendor.e({
            k: checkFileType(item.param) == 2
          }, checkFileType(item.param) == 2 ? {
            l: "6cf62e12-7-" + i0 + ",6cf62e12-3",
            m: common_vendor.o(($event) => common_vendor.unref(bindParam)[item.name] = $event, index),
            n: common_vendor.p({
              title: item.title,
              options: item.attributes,
              modelValue: common_vendor.unref(bindParam)[item.name]
            })
          } : {
            o: "6cf62e12-8-" + i0 + ",6cf62e12-3",
            p: common_vendor.o(($event) => common_vendor.unref(bindParam)[item.name] = $event, index),
            q: common_vendor.p({
              title: item.title,
              options: item.attributes,
              modelValue: common_vendor.unref(bindParam)[item.name]
            })
          }) : common_vendor.unref(handleFindComponentName)(item.name) === "Width" ? {
            s: "6cf62e12-9-" + i0 + ",6cf62e12-3",
            t: common_vendor.o(($event) => common_vendor.unref(bindParam)[item.name] = $event, index),
            v: common_vendor.p({
              title: item.title,
              options: item.attributes,
              modelValue: common_vendor.unref(bindParam)[item.name]
            })
          } : common_vendor.unref(handleFindComponentName)(item.name) === "Height" ? {
            x: "6cf62e12-10-" + i0 + ",6cf62e12-3",
            y: common_vendor.o(($event) => common_vendor.unref(bindParam)[item.name] = $event, index),
            z: common_vendor.p({
              title: item.title,
              options: item.attributes,
              modelValue: common_vendor.unref(bindParam)[item.name]
            })
          } : common_vendor.unref(handleFindComponentName)(item.name) === "Positive" ? {
            B: "6cf62e12-11-" + i0 + ",6cf62e12-3",
            C: common_vendor.o(($event) => common_vendor.unref(bindParam)[item.name] = $event, index),
            D: common_vendor.p({
              title: item.title,
              options: item.attributes,
              modelValue: common_vendor.unref(bindParam)[item.name]
            })
          } : common_vendor.unref(handleFindComponentName)(item.name) === "ModeSelect" ? {
            F: "6cf62e12-12-" + i0 + ",6cf62e12-3",
            G: common_vendor.o(($event) => common_vendor.unref(bindParam)[item.name] = $event, index),
            H: common_vendor.p({
              title: item.title,
              workflow_id: common_vendor.unref(workflow)._id,
              options: item.attributes,
              modelValue: common_vendor.unref(bindParam)[item.name]
            })
          } : common_vendor.unref(handleFindComponentName)(item.name) === "Picker" ? {
            J: "6cf62e12-13-" + i0 + ",6cf62e12-3",
            K: common_vendor.o(($event) => common_vendor.unref(bindParam)[item.name] = $event, index),
            L: common_vendor.p({
              title: item.title,
              options: item.attributes,
              modelValue: common_vendor.unref(bindParam)[item.name]
            })
          } : common_vendor.unref(handleFindComponentName)(item.name) === "CustomNumberBox" ? {
            N: "6cf62e12-14-" + i0 + ",6cf62e12-3",
            O: common_vendor.o(($event) => common_vendor.unref(bindParam)[item.name] = $event, index),
            P: common_vendor.p({
              title: item.title,
              options: item.attributes,
              modelValue: common_vendor.unref(bindParam)[item.name]
            })
          } : common_vendor.unref(handleFindComponentName)(item.name) === "ImageSelectPreview" ? {
            R: "6cf62e12-15-" + i0 + ",6cf62e12-3",
            S: common_vendor.o(($event) => common_vendor.unref(bindParam)[item.name] = $event, index),
            T: common_vendor.p({
              title: item.title,
              options: item.attributes,
              modelValue: common_vendor.unref(bindParam)[item.name]
            })
          } : common_vendor.unref(handleFindComponentName)(item.name) === "MoreImageUpload" ? {
            V: "6cf62e12-16-" + i0 + ",6cf62e12-3",
            W: common_vendor.o(($event) => common_vendor.unref(bindParam)[item.name] = $event, index),
            X: common_vendor.p({
              title: item.title,
              modelValue: common_vendor.unref(bindParam)[item.name]
            })
          } : {}, {
            f: common_vendor.unref(handleFindComponentName)(item.name) === "ImageUploadMore",
            j: common_vendor.unref(handleFindComponentName)(item.name) === "ImageUpload",
            r: common_vendor.unref(handleFindComponentName)(item.name) === "Width",
            w: common_vendor.unref(handleFindComponentName)(item.name) === "Height",
            A: common_vendor.unref(handleFindComponentName)(item.name) === "Positive",
            E: common_vendor.unref(handleFindComponentName)(item.name) === "ModeSelect",
            I: common_vendor.unref(handleFindComponentName)(item.name) === "Picker",
            M: common_vendor.unref(handleFindComponentName)(item.name) === "CustomNumberBox",
            Q: common_vendor.unref(handleFindComponentName)(item.name) === "ImageSelectPreview",
            U: common_vendor.unref(handleFindComponentName)(item.name) === "MoreImageUpload",
            Y: index
          });
        }),
        h: common_vendor.t(((_b = common_vendor.unref(workflow)) == null ? void 0 : _b.power) || 0),
        i: common_vendor.o(startAnimation),
        j: common_vendor.p({
          icon: "edit-pen",
          type: "primary",
          shape: "circle"
        }),
        k: common_vendor.f(anims.value, (item, k0, i0) => {
          return {
            a: "6cf62e12-18-" + i0 + ",6cf62e12-3",
            b: item.key,
            c: `${item.top}px`,
            d: `${item.left}px`,
            e: `translate(${item.x}px, ${item.y}px)`
          };
        }),
        l: common_vendor.p({
          name: "rocket",
          size: "40rpx"
        }),
        m: common_vendor.t(currentProgress.value),
        n: common_vendor.o(handToggelePregress),
        o: common_vendor.o(($event) => endPos.value = $event),
        p: common_vendor.p({
          modelValue: endPos.value
        })
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-6cf62e12"]]);
wx.createPage(MiniProgramPage);
