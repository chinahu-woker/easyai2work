"use strict";
const common_vendor = require("../../../../common/vendor.js");
const _sfc_main = {
  name: "u-tabs",
  mixins: [common_vendor.mpMixin, common_vendor.mixin, common_vendor.props$11],
  data() {
    return {
      firstTime: true,
      scrollLeft: 0,
      scrollViewWidth: 0,
      lineOffsetLeft: 0,
      tabsRect: {
        left: 0
      },
      innerCurrent: 0,
      moving: false
    };
  },
  watch: {
    current: {
      immediate: true,
      handler(newValue, oldValue) {
        if (newValue !== this.innerCurrent) {
          if (typeof newValue == "string") {
            this.innerCurrent = parseInt(newValue);
          } else {
            this.innerCurrent = newValue;
          }
          this.$nextTick(() => {
            this.resize();
          });
        }
      }
    },
    // list变化时，重新渲染list各项信息
    list() {
      this.$nextTick(() => {
        this.resize();
      });
    }
  },
  computed: {
    textStyle() {
      return (index) => {
        const style = {};
        const customeStyle = index == this.innerCurrent ? common_vendor.addStyle(this.activeStyle) : common_vendor.addStyle(this.inactiveStyle);
        if (this.list[index].disabled) {
          style.color = "#c8c9cc";
        }
        return common_vendor.deepMerge(customeStyle, style);
      };
    },
    propsBadge() {
      return common_vendor.defProps.badge;
    }
  },
  async mounted() {
    this.init();
  },
  emits: ["click", "longPress", "change", "update:current"],
  methods: {
    addStyle: common_vendor.addStyle,
    addUnit: common_vendor.addUnit,
    setLineLeft() {
      const tabItem = this.list[this.innerCurrent];
      if (!tabItem) {
        return;
      }
      let lineOffsetLeft = this.list.slice(0, this.innerCurrent).reduce((total, curr) => total + curr.rect.width, 0);
      const lineWidth = common_vendor.getPx(this.lineWidth);
      this.lineOffsetLeft = lineOffsetLeft + (tabItem.rect.width - lineWidth) / 2;
      if (this.firstTime) {
        setTimeout(() => {
          this.firstTime = false;
        }, 10);
      }
    },
    // nvue下设置滑块的位置
    animation(x, duration = 0) {
    },
    // 点击某一个标签
    clickHandler(item, index) {
      this.$emit("click", {
        ...item,
        index
      }, index);
      if (item.disabled)
        return;
      this.innerCurrent = index;
      this.resize();
      this.$emit("update:current", index);
      this.$emit("change", {
        ...item,
        index
      }, index);
    },
    // 长按事件
    longPressHandler(item, index) {
      this.$emit("longPress", {
        ...item,
        index
      });
    },
    init() {
      common_vendor.sleep().then(() => {
        this.resize();
      });
    },
    setScrollLeft() {
      if (this.innerCurrent < 0) {
        this.innerCurrent = 0;
      }
      const tabRect = this.list[this.innerCurrent];
      const offsetLeft = this.list.slice(0, this.innerCurrent).reduce((total, curr) => {
        return total + curr.rect.width;
      }, 0);
      const windowWidth = common_vendor.sys().windowWidth;
      let scrollLeft = offsetLeft - (this.tabsRect.width - tabRect.rect.width) / 2 - (windowWidth - this.tabsRect.right) / 2 + this.tabsRect.left / 2;
      scrollLeft = Math.min(scrollLeft, this.scrollViewWidth - this.tabsRect.width);
      this.scrollLeft = Math.max(0, scrollLeft);
    },
    // 获取所有标签的尺寸
    resize() {
      if (this.list.length === 0) {
        return;
      }
      Promise.all([this.getTabsRect(), this.getAllItemRect()]).then(([tabsRect, itemRect = []]) => {
        if (tabsRect.left > tabsRect.width) {
          tabsRect.right = tabsRect.right - Math.floor(tabsRect.left / tabsRect.width) * tabsRect.width;
          tabsRect.left = tabsRect.left % tabsRect.width;
        }
        this.tabsRect = tabsRect;
        this.scrollViewWidth = 0;
        itemRect.map((item, index) => {
          this.scrollViewWidth += item.width;
          this.list[index].rect = item;
        });
        this.setLineLeft();
        this.setScrollLeft();
      });
    },
    // 获取导航菜单的尺寸
    getTabsRect() {
      return new Promise((resolve) => {
        this.queryRect("u-tabs__wrapper__scroll-view").then((size) => resolve(size));
      });
    },
    // 获取所有标签的尺寸
    getAllItemRect() {
      return new Promise((resolve) => {
        const promiseAllArr = this.list.map((item, index) => this.queryRect(
          `u-tabs__wrapper__nav__item-${index}`,
          true
        ));
        Promise.all(promiseAllArr).then((sizes) => resolve(sizes));
      });
    },
    // 获取各个标签的尺寸
    queryRect(el, item) {
      return new Promise((resolve) => {
        this.$uGetRect(`.${el}`).then((size) => {
          resolve(size);
        });
      });
    }
  }
};
if (!Array) {
  const _easycom_u_badge2 = common_vendor.resolveComponent("u-badge");
  _easycom_u_badge2();
}
const _easycom_u_badge = () => "../u-badge/u-badge.js";
if (!Math) {
  _easycom_u_badge();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f(_ctx.list, (item, index, i0) => {
      return common_vendor.e(_ctx.$slots.content ? {
        a: "content-" + i0,
        b: common_vendor.r("content", {
          item,
          keyName: _ctx.keyName,
          index
        }, i0)
      } : !_ctx.$slots.content && (_ctx.$slots.default || _ctx.$slots.$default) ? {
        c: "d-" + i0,
        d: common_vendor.r("d", {
          item,
          keyName: _ctx.keyName,
          index
        }, i0)
      } : {
        e: common_vendor.t(item[_ctx.keyName]),
        f: common_vendor.n(item.disabled && "u-tabs__wrapper__nav__item__text--disabled"),
        g: common_vendor.s($options.textStyle(index))
      }, {
        h: "0546c3e4-0-" + i0,
        i: common_vendor.p({
          show: !!(item.badge && (item.badge.show || item.badge.isDot || item.badge.value)),
          isDot: item.badge && item.badge.isDot || $options.propsBadge.isDot,
          value: item.badge && item.badge.value || $options.propsBadge.value,
          max: item.badge && item.badge.max || $options.propsBadge.max,
          type: item.badge && item.badge.type || $options.propsBadge.type,
          showZero: item.badge && item.badge.showZero || $options.propsBadge.showZero,
          bgColor: item.badge && item.badge.bgColor || $options.propsBadge.bgColor,
          color: item.badge && item.badge.color || $options.propsBadge.color,
          shape: item.badge && item.badge.shape || $options.propsBadge.shape,
          numberType: item.badge && item.badge.numberType || $options.propsBadge.numberType,
          inverted: item.badge && item.badge.inverted || $options.propsBadge.inverted,
          customStyle: "margin-left: 4px;"
        }),
        j: index,
        k: common_vendor.o(($event) => $options.clickHandler(item, index), index),
        l: common_vendor.o(($event) => $options.longPressHandler(item, index), index),
        m: `u-tabs__wrapper__nav__item-${index}`,
        n: common_vendor.n(`u-tabs__wrapper__nav__item-${index}`),
        o: common_vendor.n(item.disabled && "u-tabs__wrapper__nav__item--disabled")
      });
    }),
    b: _ctx.$slots.content,
    c: !_ctx.$slots.content && (_ctx.$slots.default || _ctx.$slots.$default),
    d: common_vendor.s($options.addStyle(_ctx.itemStyle)),
    e: common_vendor.s({
      flex: _ctx.scrollable ? "" : 1
    }),
    f: common_vendor.s({
      width: $options.addUnit(_ctx.lineWidth),
      transform: `translate(${$data.lineOffsetLeft}px)`,
      transitionDuration: `${$data.firstTime ? 0 : _ctx.duration}ms`,
      height: $options.addUnit(_ctx.lineHeight),
      background: _ctx.lineColor,
      backgroundSize: _ctx.lineBgSize
    }),
    g: _ctx.scrollable,
    h: $data.scrollLeft,
    i: common_vendor.n(_ctx.customClass)
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-0546c3e4"]]);
wx.createComponent(Component);
