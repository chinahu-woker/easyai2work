"use strict";
const common_vendor = require("../common/vendor.js");
const composables_useCommon = require("../composables/useCommon.js");
const request = (apiUrl, options = {}, retry = true) => {
  const fullUrl = apiUrl.startsWith("/") ? apiUrl : `/${apiUrl}`;
  return new Promise((resolve, reject) => {
    common_vendor.index.request({
      url: `${getBaseURL()}${fullUrl}`,
      header: {
        Authorization: `Bearer ${getToken()}`
      },
      ...options,
      success: async (res) => {
        if (res.statusCode === 401 && retry) {
          const { token } = await refreshToken(getRefreshToken());
          composables_useCommon.saveLoginInfo({ token });
          common_vendor.index.__f__("log", "at utils/request.ts:20", "刷新后获取的token", token);
          if (token) {
            options.header = {
              Authorization: `Bearer ${token}`
            };
            request(apiUrl, options, false).then((res2) => {
              resolve(res2);
            }).catch((err) => {
              reject(err);
            });
          } else {
            reject(res);
          }
        } else {
          if (res.data.data) {
            resolve(res.data.data);
          } else {
            resolve(res.data);
          }
        }
      },
      fail: async (err) => {
        common_vendor.index.__f__("log", "at utils/request.ts:45", 233333333);
      },
      complete: async (err) => {
        common_vendor.index.__f__("log", "at utils/request.ts:48", "请求完成", err);
      }
    });
  });
};
const refreshToken = async (refreshToken2, apiUrl = "/auth/refreshTokens", maxRetries = 3, retryInterval = 200, timeout = 5e3) => {
  const apiPath = apiUrl.startsWith("/") ? apiUrl : `/${apiUrl}`;
  let attempt = 0;
  while (attempt < maxRetries) {
    attempt++;
    common_vendor.index.__f__("log", "at utils/request.ts:68", `尝试第 ${attempt} 次刷新Token, refreshToken:`, refreshToken2);
    try {
      return await new Promise((resolve, reject) => {
        common_vendor.index.request({
          url: `${getBaseURL()}${apiPath}`,
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          data: { refreshToken: refreshToken2 },
          timeout,
          success: (res) => {
            if (res.statusCode >= 400) {
              common_vendor.index.__f__("log", "at utils/request.ts:85", "refreshToken", res);
              reject(res);
            } else {
              common_vendor.index.__f__("log", "at utils/request.ts:89", "refreshToken", res);
              resolve(res.data);
            }
          },
          fail: (err) => {
            common_vendor.index.__f__("error", "at utils/request.ts:94", "刷新Token失败", err);
            reject(err);
          }
        });
      });
    } catch (err) {
      if (err.name === "AbortError") {
        common_vendor.index.__f__("error", "at utils/request.ts:102", `第 ${attempt} 次刷新Token超时`);
      } else {
        common_vendor.index.__f__("error", "at utils/request.ts:104", `第 ${attempt} 次刷新Token失败`, err);
      }
    }
    if (attempt < maxRetries) {
      common_vendor.index.__f__("log", "at utils/request.ts:109", `等待 ${retryInterval} 毫秒后重试...`);
      await new Promise((resolve) => setTimeout(resolve, retryInterval));
    }
  }
  common_vendor.index.__f__("log", "at utils/request.ts:115", "刷新Token失败，已达到最大重试次数");
  return null;
};
const uploadFile = (filePath, options = {}, apiUrl = "/file/upload") => {
  const fullUrl = apiUrl.startsWith("/") ? apiUrl : `/${apiUrl}`;
  return new Promise((resolve, reject) => {
    common_vendor.index.uploadFile({
      url: `${getBaseURL()}${fullUrl}`,
      filePath,
      name: "file",
      header: {
        Authorization: `Bearer ${getToken()}`
      },
      ...options,
      success: async (res) => {
        if (res.statusCode === 401) {
          const _refreshToken = getRefreshToken();
          if (!_refreshToken) {
            reject(res);
          }
          const { token } = await refreshToken(_refreshToken);
          composables_useCommon.saveLoginInfo({ token });
          common_vendor.index.__f__("log", "at utils/request.ts:142", "刷新后获取的token", token);
          if (token) {
            options.header = {
              Authorization: `Bearer ${token}`
            };
            uploadFile(filePath, options).then((res2) => {
              resolve(res2);
            }).catch((err) => {
              reject(err);
            });
          } else {
            reject(res);
          }
        } else {
          common_vendor.index.__f__("log", "at utils/request.ts:156", "success", res);
          const data = JSON.parse(res.data);
          if (data.data) {
            resolve(data.data);
          } else {
            resolve(data);
          }
        }
      },
      fail: async (err) => {
        common_vendor.index.__f__("log", "at utils/request.ts:167", "fail", err);
        if (err) {
          const _refreshToken = getRefreshToken();
          if (!_refreshToken) {
            reject(err);
          }
          const { token } = await refreshToken(_refreshToken);
          composables_useCommon.saveLoginInfo({ token });
          common_vendor.index.__f__("log", "at utils/request.ts:177", "刷新后获取的token", token);
          if (token) {
            options.header = {
              Authorization: `Bearer ${token}`
            };
            uploadFile(filePath, options).then((res) => {
              resolve(res);
            }).catch((err2) => {
              reject(err2);
            });
          } else {
            reject(err);
          }
        } else {
          reject(err);
        }
      }
    });
  });
};
const getBaseURL = () => "https://nailoffice.cn/api";
const getBaseWsURL = () => "wss://nailoffice.cn/websocket";
const getToken = () => composables_useCommon.getLoginInfo().token;
const getRefreshToken = () => composables_useCommon.getLoginInfo().refresh_token;
exports.getBaseWsURL = getBaseWsURL;
exports.request = request;
exports.uploadFile = uploadFile;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/request.js.map
