"use strict";
const common_vendor = require("../common/vendor.js");
const composables_useCommon = require("./useCommon.js");
const types_index = require("../types/index.js");
const usePayHandlePayment = async (product) => {
  const user = composables_useCommon.getLoginInfo();
  if (!user) {
    throw new Error("未登录不允许支付");
  }
  const order = await composables_useCommon.creatOrder({
    user_id: user._id,
    product_id: product._id,
    amount: {
      total: product.amount,
      currency: "CNY"
    },
    payer: {
      openid: composables_useCommon.getLoginInfo().wx_openid_mp
    },
    order_channel: types_index.IPayChannel.MP_WEIXIN
  });
  const { nonceStr, package: _, signType, paySign, timeStamp } = await composables_useCommon.getPrePay(order._id);
  common_vendor.index.__f__("log", "at composables/usePayment.ts:24", "paySign", paySign);
  common_vendor.index.__f__("log", "at composables/usePayment.ts:27", "created order", order);
  common_vendor.index.requestPayment({
    provider: "wxpay",
    orderInfo: order.product_id.name,
    timeStamp,
    nonceStr,
    package: _,
    signType,
    paySign,
    success: function(res) {
      common_vendor.index.__f__("log", "at composables/usePayment.ts:37", "success", res);
    },
    fail: function(err) {
      common_vendor.index.__f__("log", "at composables/usePayment.ts:40", "fail", err);
    }
  });
};
exports.usePayHandlePayment = usePayHandlePayment;
//# sourceMappingURL=../../.sourcemap/mp-weixin/composables/usePayment.js.map
