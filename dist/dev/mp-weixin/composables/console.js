"use strict";
const common_vendor = require("../common/vendor.js");
const getBaseURL = () => "https://edai.vip/api";
const GetAllManagerInfor = (data) => {
  common_vendor.index.__f__("log", "at composables/console.ts:7", "data获取成功", data);
  return new Promise((resolve, reject) => {
    const requestTask = common_vendor.index.request({
      url: `${getBaseURL()}/content/mp/content`,
      // 请求地址
      method: "GET",
      header: {
        "Authorization": "Bearer " + data
      },
      enableChunked: false,
      // 开启流传输
      success: (res) => {
        resolve(res);
        common_vendor.index.__f__("log", "at composables/console.ts:18", "配置文件请求成功", res.data);
      },
      // 请求成功回调
      fail: (err) => {
        reject(err);
        common_vendor.index.__f__("log", "at composables/console.ts:24", "请求失败", err);
      }
      // 请求失败回调
    });
    common_vendor.index.__f__("log", "at composables/console.ts:28", "requestTask", requestTask);
  });
};
const SubmitSwiper = (token, data) => {
  common_vendor.index.__f__("log", "at composables/console.ts:33", "data获取成功", data);
  return new Promise((resolve, reject) => {
    const requestTask = common_vendor.index.request({
      url: `${getBaseURL()}/content/mp/content`,
      // 请求地址
      method: "POST",
      header: {
        "Authorization": "Bearer " + token
      },
      data,
      enableChunked: false,
      // 开启流传输
      success: (res) => {
        resolve(res);
        common_vendor.index.__f__("log", "at composables/console.ts:45", "提交成功", res);
      },
      // 请求成功回调
      fail: (err) => {
        reject(err);
        common_vendor.index.__f__("log", "at composables/console.ts:51", "请求失败", err);
      }
      // 请求失败回调
    });
    common_vendor.index.__f__("log", "at composables/console.ts:55", "requestTask", requestTask);
  });
};
exports.GetAllManagerInfor = GetAllManagerInfor;
exports.SubmitSwiper = SubmitSwiper;
//# sourceMappingURL=../../.sourcemap/mp-weixin/composables/console.js.map
