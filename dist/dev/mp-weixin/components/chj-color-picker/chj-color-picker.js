"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  name: "chj-color-picker",
  props: {
    // 标题
    title: {
      type: String,
      default: "选择颜色"
    },
    // 初始化颜色,格式为 HEX
    defaultColor: {
      type: String,
      default: "#ff0000"
    },
    // 如果是微信小程序或者APP出现被 canvas、map 等组件覆盖的情况请设置此参数
    isCover: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 是否显示
      show: false,
      // canvas背景上下文
      ctx_bg: null,
      // 标注点canvas上下文
      ctx: null,
      // 渐变上下文
      grd: null,
      // canvas的宽度
      canvasWidth: 0,
      // canvas的高度
      canvasHeight: 0,
      // 当前选中的颜色rbga
      color: { R: 255, G: 0, B: 0 },
      // 当前选择的位置
      color_positinon: { x: 0, y: 0 },
      // 滑块颜色
      slider_color: { R: 255, G: 0, B: 0 },
      // 当前滑块选择的位置
      slider_color_positinon: { x: 0, y: 0 },
      // 透明度
      opacity: 1,
      // 切换模式 true 为hex false 为rgba
      codeType: true,
      // 颜色代码
      hex: ""
    };
  },
  methods: {
    // 初始化颜色显示canvas
    async initColorShow() {
      const ctx_bg = common_vendor.index.createCanvasContext("chj-canvas-show-color", this);
      const { width, height } = await this.getNodeInfo(".chj-canvas-show-color");
      const size = height / 6;
      for (let i = 0; i < width / size; i++) {
        for (let j = 0; j < 6; j++) {
          if (i % 2) {
            if (j % 2) {
              ctx_bg.setFillStyle("#fff");
              ctx_bg.fillRect(i * size, j * size, size, size);
            } else {
              ctx_bg.setFillStyle("#c0c2c3");
              ctx_bg.fillRect(i * size, j * size, size, size);
            }
          } else {
            if (j % 2) {
              ctx_bg.setFillStyle("#c0c2c3");
              ctx_bg.fillRect(i * size, j * size, size, size);
            } else {
              ctx_bg.setFillStyle("#fff");
              ctx_bg.fillRect(i * size, j * size, size, size);
            }
          }
        }
      }
      const { R, G, B } = this.color;
      ctx_bg.setFillStyle(`rgba(${R},${G},${B},${this.opacity})`);
      ctx_bg.fillRect(0, 0, width, height);
      ctx_bg.draw();
    },
    // 初始化滑动条canvas
    async initCanvasSlider() {
      const ctx_bg = common_vendor.index.createCanvasContext("chj-canvas-color-slider-bg", this);
      const { width, height } = await this.getNodeInfo(".chj-canvas-color-slider");
      const grd = ctx_bg.createLinearGradient(0, 0, width, 0);
      grd.addColorStop(0, "rgb(255,0,0)");
      grd.addColorStop(0.16, "rgb(255,255,0)");
      grd.addColorStop(0.33, "rgb(0,255,0)");
      grd.addColorStop(0.5, "rgb(0,255,255)");
      grd.addColorStop(0.66, "rgb(0,0,255)");
      grd.addColorStop(0.83, "rgb(255,0,255)");
      grd.addColorStop(1, "rgb(255,0,0)");
      ctx_bg.setFillStyle(grd);
      ctx_bg.fillRect(0, 0, width, height);
      ctx_bg.draw();
    },
    // 绘制滑块
    async drawHK({ x, y }) {
      this.slider_color_positinon = { x, y };
      const { height } = await this.getNodeInfo(".chj-canvas-color-slider");
      const ctx = common_vendor.index.createCanvasContext("chj-canvas-color-slider", this);
      ctx.arc(x, height / 2, 10, 0, 2 * Math.PI);
      ctx.setStrokeStyle("#fff");
      ctx.setLineWidth(3);
      ctx.stroke();
      ctx.draw();
    },
    // 滑块监听
    async touchSlider(e) {
      const { width } = await this.getNodeInfo(".chj-canvas-color-slider");
      let { x, y } = e.touches[0];
      if (e.touches[0].x > width) {
        x = width;
      }
      if (e.touches[0].x < 0) {
        x = 0;
      }
      const h = x / width * 360;
      this.slider_color = this.hsvToRgb(h, 1, 1);
      const { R, G, B } = this.slider_color;
      this.drawHK({ x, y });
      this.setCanvasBgColor(`rgba(${R},${G},${B},${1})`);
      this.touchSelectColor({ touches: [this.color_positinon] });
    },
    // 初始化透明度滑动条canvas
    async initCanvasSliderTM() {
      const ctx_bg = common_vendor.index.createCanvasContext("chj-canvas-color-slider-tm-bg", this);
      const { width, height } = await this.getNodeInfo(".chj-canvas-color-slider");
      const size = height / 2;
      for (let i = 0; i < width / size; i++) {
        if (i % 2) {
          ctx_bg.setFillStyle("#fff");
          ctx_bg.fillRect(i * size, 0, size, size);
          ctx_bg.setFillStyle("#c0c2c3");
          ctx_bg.fillRect(i * size, size, size, size);
        } else {
          ctx_bg.setFillStyle("#c0c2c3");
          ctx_bg.fillRect(i * size, 0, size, size);
          ctx_bg.setFillStyle("#fff");
          ctx_bg.fillRect(i * size, size, size, size);
        }
      }
      const grd = ctx_bg.createLinearGradient(0, 0, width, 0);
      grd.addColorStop(0, "transparent");
      const { R, G, B } = this.color;
      grd.addColorStop(1, `rgba(${R},${G},${B},${1})`);
      ctx_bg.setFillStyle(grd);
      ctx_bg.fillRect(0, 0, width, height);
      ctx_bg.draw();
    },
    // 绘制滑块(透明度)
    async drawTM({ x, y }) {
      const { height, width } = await this.getNodeInfo(".chj-canvas-color-slider");
      const ctx = common_vendor.index.createCanvasContext("chj-canvas-color-slider-tm", this);
      ctx.arc(x, height / 2, 10, 0, 2 * Math.PI);
      ctx.setStrokeStyle("#fff");
      ctx.setLineWidth(3);
      ctx.stroke();
      ctx.draw();
      this.opacity = (x / width).toFixed(2);
      this.initColorShow();
    },
    // 滑块监听(透明度)
    async touchSliderTM(e) {
      const { width } = await this.getNodeInfo(".chj-canvas-color-slider");
      let { x, y } = e.touches[0];
      if (e.touches[0].x > width) {
        x = width;
      }
      if (e.touches[0].x < 0) {
        x = 0;
      }
      this.drawTM({ x, y });
    },
    // 确定
    change() {
      const { R, G, B } = this.color;
      this.$emit("change", { hex: this.hex, rgba: { ...this.color, A: Number(this.opacity) } });
      this.show = false;
    },
    // 取消
    cancel() {
      this.$emit("cancel");
      this.show = false;
    },
    // 初始化
    async init() {
      const { width, height } = await this.getNodeInfo(".chj-color-picker-canvas");
      this.canvasWidth = width;
      this.canvasHeight = height;
      this.ctx = common_vendor.index.createCanvasContext("chj-color-picker-canvas", this);
      this.ctx_bg = common_vendor.index.createCanvasContext("chj-color-picker-canvas-bg", this);
      await this.initCanvasSlider();
      await this.initCanvasSliderTM();
      await this.initColorShow();
      await this.initColor(this.defaultColor);
    },
    // 绘制标注点
    drawBZ({ x, y }) {
      this.color_positinon = { x, y };
      this.ctx.arc(x, y, 10, 0, 2 * Math.PI);
      this.ctx.setStrokeStyle("#EEEEEE");
      this.ctx.setLineWidth(3);
      this.ctx.stroke();
      this.ctx.draw();
    },
    // 设置canvas-bg的颜色
    setCanvasBgColor(color) {
      this.grd = this.ctx_bg.createLinearGradient(0, 0, this.canvasWidth, 0);
      this.grd.addColorStop(0, "#fff");
      this.grd.addColorStop(1, color);
      this.ctx_bg.setFillStyle(this.grd);
      this.ctx_bg.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
      const grd_black = this.ctx_bg.createLinearGradient(0, this.canvasHeight, 0, 0);
      grd_black.addColorStop(0, "#000");
      grd_black.addColorStop(1, "transparent");
      this.ctx_bg.setFillStyle(grd_black);
      this.ctx_bg.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
      this.ctx_bg.draw();
    },
    // 颜色选中canvas监听
    touchSelectColor(e) {
      let { x, y } = e.touches[0];
      if (e.touches[0].x > this.canvasWidth) {
        x = this.canvasWidth;
      }
      if (e.touches[0].x < 0) {
        x = 0;
      }
      if (e.touches[0].y > this.canvasHeight) {
        y = this.canvasHeight;
      }
      if (e.touches[0].y < 0) {
        y = 0;
      }
      const { R, G, B } = this.slider_color;
      const { h } = this.rgbToHsv(R, G, B);
      const s = x / this.canvasWidth;
      const v = 1 - y / this.canvasHeight;
      this.color = this.hsvToRgb(h, s, v);
      this.drawBZ({ x, y });
      this.initCanvasSliderTM();
      this.initColorShow();
    },
    // 获取节点的信息（宽高）
    getNodeInfo(selector) {
      return new Promise((res, rej) => {
        common_vendor.index.createSelectorQuery().in(this).select(selector).fields({
          size: true
        }, (data) => {
          res(data);
        }).exec();
      });
    },
    // 打开颜色选择器
    open() {
      this.show = true;
      const time = setTimeout(() => {
        this.init();
        clearTimeout(time);
      }, 100);
    },
    // 将 RGB 值转换为两位十六进制
    rgbaToHex({ R, G, B, A }) {
      let rHex = Math.round(R).toString(16).padStart(2, "0");
      let gHex = Math.round(G).toString(16).padStart(2, "0");
      let bHex = Math.round(B).toString(16).padStart(2, "0");
      if (A == 1)
        return `#${rHex}${gHex}${bHex}`;
      A *= 255;
      let aHex = Math.round(A).toString(16).padStart(2, "0");
      return `#${rHex}${gHex}${bHex}${aHex}`;
    },
    // hex 转 rgba
    hexToRgba(hex) {
      if (typeof hex != "string" || hex[0] != "#")
        return false;
      let alpha = 1;
      hex = hex.replace(/^#/, "");
      if (hex.length === 3) {
        hex = hex.split("").map((char) => char + char).join("");
      }
      if (hex.length === 8) {
        alpha = parseInt(hex.substring(6, 8), 16) / 255;
        hex = hex.substring(0, 6);
      }
      if (hex.length < 3 || hex.length == 4 || hex.length == 7 || hex.length > 8) {
        return false;
      }
      const R = parseInt(hex.substring(0, 2), 16);
      const G = parseInt(hex.substring(2, 4), 16);
      const B = parseInt(hex.substring(4, 6), 16);
      return { R, G, B, A: alpha };
    },
    // hsv 转 rgb
    hsvToRgb(h, s, v) {
      h = h % 360;
      let r, g, b;
      let C = v * s;
      let X = C * (1 - Math.abs(h / 60 % 2 - 1));
      let m = v - C;
      if (0 <= h && h < 60) {
        r = C;
        g = X;
        b = 0;
      } else if (60 <= h && h < 120) {
        r = X;
        g = C;
        b = 0;
      } else if (120 <= h && h < 180) {
        r = 0;
        g = C;
        b = X;
      } else if (180 <= h && h < 240) {
        r = 0;
        g = X;
        b = C;
      } else if (240 <= h && h < 300) {
        r = X;
        g = 0;
        b = C;
      } else if (300 <= h && h < 360) {
        r = C;
        g = 0;
        b = X;
      }
      return {
        R: Math.round((r + m) * 255),
        G: Math.round((g + m) * 255),
        B: Math.round((b + m) * 255)
      };
    },
    // rgb 转 hsv
    rgbToHsv(r, g, b) {
      r /= 255;
      g /= 255;
      b /= 255;
      let max = Math.max(r, g, b);
      let min = Math.min(r, g, b);
      let h, s, v = max;
      let d = max - min;
      s = max === 0 ? 0 : d / max;
      if (d === 0) {
        h = 0;
      } else {
        switch (max) {
          case r:
            h = (g - b) / d + (g < b ? 6 : 0);
            break;
          case g:
            h = (b - r) / d + 2;
            break;
          case b:
            h = (r - g) / d + 4;
            break;
        }
        h /= 6;
      }
      return {
        h: h * 360,
        // 0 - 360
        s,
        v
      };
    },
    // 复制颜色编码
    copy(data) {
      common_vendor.index.setClipboardData({
        data
      });
    },
    // 给一个颜色，颜色选择器初始化到这个颜色的选择位置
    async initColor(color) {
      let r, g, b, a;
      if (typeof color == "string") {
        const rgba = this.hexToRgba(color);
        if (!rgba)
          return;
        const { R, G, B, A } = rgba;
        r = R;
        g = G;
        b = B;
        a = A;
      } else {
        const { R, G, B, A } = color;
        r = R;
        g = G;
        b = B;
        a = A;
      }
      this.color = { R: r, G: g, B: b };
      this.opacity = a;
      const { h, s, v } = this.rgbToHsv(r, g, b);
      const { width } = await this.getNodeInfo(".chj-canvas-color-slider");
      const slider_x = h / 360 * width;
      this.touchSlider({ touches: [{ x: slider_x, y: 0 }] });
      const x = s * this.canvasWidth;
      const y = (1 - v) * this.canvasHeight;
      this.touchSelectColor({ touches: [{ x, y }] });
      const slider_tm_x = a * width;
      this.touchSliderTM({ touches: [{ x: slider_tm_x, y: 0 }] });
    },
    // rgba改变进行判断
    rgbaChange(val, key) {
      val = Number(val);
      this.minRgba(val, key);
      this.maxRgba(val, key);
      this.initColor({ ...this.color, A: this.opacity });
    },
    // rgba最小值
    minRgba(val, key) {
      if (val < 0 && key != "A")
        this.color[key] = 0;
      if (val < 0 && key == "A")
        this.opacity = 0;
    },
    // rgba最大值
    maxRgba(val, key) {
      if (val > 255 && key != "A")
        this.color[key] = 255;
      if (val > 1 && key == "A")
        this.opacity = 1;
    }
  },
  watch: {
    color: {
      handler(newVal) {
        const { R, G, B } = newVal;
        this.hex = this.rgbaToHex({ R, G, B, A: this.opacity });
      },
      immediate: true,
      deep: true
    },
    opacity: {
      handler(newVal) {
        this.hex = this.rgbaToHex({ R: this.color.R, G: this.color.G, B: this.color.B, A: newVal });
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {
  },
  computed: {
    // rgba
    rgba() {
      const { R, G, B } = this.color;
      return `rgba(${R},${G},${B},${this.opacity})`;
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: !$props.isCover
  }, !$props.isCover ? common_vendor.e({
    b: common_vendor.o((...args) => $options.cancel && $options.cancel(...args)),
    c: common_vendor.t($props.title),
    d: common_vendor.o((...args) => $options.change && $options.change(...args)),
    e: common_vendor.o((...args) => $options.touchSelectColor && $options.touchSelectColor(...args)),
    f: common_vendor.o((...args) => $options.touchSelectColor && $options.touchSelectColor(...args)),
    g: common_vendor.o((...args) => $options.touchSlider && $options.touchSlider(...args)),
    h: common_vendor.o((...args) => $options.touchSlider && $options.touchSlider(...args)),
    i: common_vendor.o((...args) => $options.touchSliderTM && $options.touchSliderTM(...args)),
    j: common_vendor.o((...args) => $options.touchSliderTM && $options.touchSliderTM(...args)),
    k: common_vendor.o(($event) => $data.codeType = !$data.codeType),
    l: $data.codeType
  }, $data.codeType ? {
    m: common_vendor.o(($event) => $options.initColor($data.hex)),
    n: $data.hex,
    o: common_vendor.o(($event) => $data.hex = $event.detail.value)
  } : {
    p: common_vendor.o(($event) => $options.rgbaChange($data.color.R, "R")),
    q: $data.color.R,
    r: common_vendor.o(($event) => $data.color.R = $event.detail.value),
    s: common_vendor.o(($event) => $options.rgbaChange($data.color.G, "G")),
    t: $data.color.G,
    v: common_vendor.o(($event) => $data.color.G = $event.detail.value),
    w: common_vendor.o(($event) => $options.rgbaChange($data.color.B, "B")),
    x: $data.color.B,
    y: common_vendor.o(($event) => $data.color.B = $event.detail.value),
    z: common_vendor.o(($event) => $options.rgbaChange($data.opacity, "A")),
    A: $data.opacity,
    B: common_vendor.o(($event) => $data.opacity = $event.detail.value)
  }, {
    C: common_vendor.o(($event) => $options.copy($data.codeType ? $data.hex : $options.rgba)),
    D: $data.show
  }) : {
    E: common_vendor.o((...args) => $options.cancel && $options.cancel(...args)),
    F: common_vendor.t($props.title),
    G: common_vendor.o((...args) => $options.change && $options.change(...args)),
    H: common_vendor.o((...args) => $options.touchSelectColor && $options.touchSelectColor(...args)),
    I: common_vendor.o((...args) => $options.touchSelectColor && $options.touchSelectColor(...args)),
    J: common_vendor.o((...args) => $options.touchSlider && $options.touchSlider(...args)),
    K: common_vendor.o((...args) => $options.touchSlider && $options.touchSlider(...args)),
    L: common_vendor.o((...args) => $options.touchSliderTM && $options.touchSliderTM(...args)),
    M: common_vendor.o((...args) => $options.touchSliderTM && $options.touchSliderTM(...args)),
    N: common_vendor.o(($event) => $data.codeType = !$data.codeType),
    O: common_vendor.t($data.codeType ? $data.hex : `rgba(${$data.color.R},${$data.color.G},${$data.color.B},${$data.opacity})`),
    P: common_vendor.o(($event) => $options.copy($data.codeType ? $data.hex : $options.rgba)),
    Q: $data.show
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-e957fa04"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/chj-color-picker/chj-color-picker.js.map
