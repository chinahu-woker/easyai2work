"use strict";
const common_vendor = require("../../../../../../common/vendor.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "scroll-list",
  props: common_vendor.scrollListProps,
  emits: common_vendor.scrollListEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const {
      componentId,
      componentContentId,
      indicatorBlockScrollDistance,
      scrollViewScrollEvent,
      scrollToLeftEvent,
      scrollToRightEvent
    } = common_vendor.useScrollList(props, emits);
    const {
      ns,
      indicatorClass,
      indicatorStyle,
      indicatorBlockClass,
      indicatorBlockStyle
    } = common_vendor.useScrollListCustomStyle(props);
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.unref(componentContentId),
        b: common_vendor.n(common_vendor.unref(ns).e("scroll-view")),
        c: common_vendor.o(
          //@ts-ignore
          (...args) => common_vendor.unref(scrollViewScrollEvent) && common_vendor.unref(scrollViewScrollEvent)(...args)
        ),
        d: common_vendor.o(
          //@ts-ignore
          (...args) => common_vendor.unref(scrollToLeftEvent) && common_vendor.unref(scrollToLeftEvent)(...args)
        ),
        e: common_vendor.o(
          //@ts-ignore
          (...args) => common_vendor.unref(scrollToRightEvent) && common_vendor.unref(scrollToRightEvent)(...args)
        ),
        f: common_vendor.n(common_vendor.unref(ns).e("content")),
        g: _ctx.indicator
      }, _ctx.indicator ? {
        h: common_vendor.n(common_vendor.unref(indicatorBlockClass)),
        i: common_vendor.s(common_vendor.unref(indicatorBlockStyle)(common_vendor.unref(indicatorBlockScrollDistance))),
        j: common_vendor.n(common_vendor.unref(indicatorClass)),
        k: common_vendor.s(common_vendor.unref(indicatorStyle))
      } : {}, {
        l: common_vendor.unref(componentId),
        m: common_vendor.n(common_vendor.unref(ns).b()),
        n: common_vendor.n(common_vendor.unref(ns).is("indicator", _ctx.indicator))
      });
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-0f089b03"]]);
wx.createComponent(Component);
