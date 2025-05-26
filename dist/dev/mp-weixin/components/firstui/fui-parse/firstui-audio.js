"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  name: "firstui-audio",
  props: {
    title: {
      type: String,
      default: ""
    },
    desc: {
      type: String,
      default: ""
    },
    src: {
      type: String,
      default: ""
    }
  },
  watch: {
    src(newValue, oldValue) {
      if (newVal) {
        this.handleInitAudio(newVal);
      }
    }
  },
  data() {
    return {
      isPlay: false,
      currentTimeStr: "00:00",
      durationStr: "00:00",
      progress: 0
    };
  },
  created() {
    this.innerAudioContext = null;
    this.src && this.handleInitAudio(this.src);
  },
  beforeUnmount() {
    this.innerAudioContext && this.innerAudioContext.destroy();
  },
  methods: {
    handleInitAudio(src) {
      this.innerAudioContext = common_vendor.index.createInnerAudioContext();
      this.innerAudioContext.src = src;
      this.innerAudioContext.onPlay(() => {
        console.log("开始播放");
      });
      this.innerAudioContext.onCanplay(() => {
        this.innerAudioContext.duration;
        setTimeout(() => {
          const durationStr = this.parseTime(this.innerAudioContext.duration);
          this.durationStr = durationStr;
        }, 1e3);
      });
      this.innerAudioContext.onError((res) => {
        console.log(res.errMsg);
        console.log(res.errCode);
      });
      this.innerAudioContext.onEnded(() => {
        this.isPlay = false;
      });
      this.innerAudioContext.onTimeUpdate(() => {
        const currentTime = this.innerAudioContext.currentTime;
        const duration = this.innerAudioContext.duration;
        const currentTimeStr = this.parseTime(currentTime);
        const progress = currentTime / duration * 100;
        this.currentTimeStr = currentTimeStr;
        this.progress = progress;
      });
    },
    handleControl() {
      if (!this.isPlay) {
        this.isPlay = true;
        this.innerAudioContext && this.innerAudioContext.play();
      } else {
        this.isPlay = false;
        this.innerAudioContext && this.innerAudioContext.pause();
      }
    },
    parseTime(time) {
      const minute = Math.floor(time / 60);
      const second = Math.floor(time % 60);
      return `${minute < 10 ? "0" + minute : minute}:${second < 10 ? "0" + second : second}`;
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.isPlay ? 1 : "",
    b: !$data.isPlay ? 1 : "",
    c: $props.title
  }, $props.title ? {
    d: common_vendor.t($props.title)
  } : {}, {
    e: $props.desc
  }, $props.desc ? {
    f: common_vendor.t($props.desc)
  } : {}, {
    g: `${$data.progress}%`,
    h: common_vendor.t($data.currentTimeStr),
    i: common_vendor.t($data.durationStr),
    j: common_vendor.o((...args) => $options.handleControl && $options.handleControl(...args))
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-330431b2"]]);
wx.createComponent(Component);
