"use strict";
var IPayChannel = /* @__PURE__ */ ((IPayChannel2) => {
  IPayChannel2["WEB"] = "WEB";
  IPayChannel2["MP_WEIXIN"] = "MP_WEIXIN";
  IPayChannel2["APP_ANDROID"] = "APP_ANDROID";
  IPayChannel2["APP_IOS"] = "APP_IOS";
  return IPayChannel2;
})(IPayChannel || {});
var IWebsocketSceneType = /* @__PURE__ */ ((IWebsocketSceneType2) => {
  IWebsocketSceneType2["wechatOfficialLogin"] = "wechatOfficialLogin";
  IWebsocketSceneType2["drawProcessPush"] = "drawProcessPush";
  IWebsocketSceneType2["serverStatusPush"] = "serverStatusPush";
  IWebsocketSceneType2["payStatusPush"] = "payStatusPush";
  return IWebsocketSceneType2;
})(IWebsocketSceneType || {});
exports.IPayChannel = IPayChannel;
exports.IWebsocketSceneType = IWebsocketSceneType;
