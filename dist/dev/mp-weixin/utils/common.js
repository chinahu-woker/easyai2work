"use strict";
const common_vendor = require("../common/vendor.js");
const formatDateTime = (date, template = "YYYY-MM-DD HH:mm:ss") => {
  return date ? common_vendor.dayjs(date).format(template) : "";
};
const isVideo = (url) => {
  if (!url)
    return false;
  const videoTypes = ["mp4", "webm", "mov", "avi", "mkv", "flv"];
  return videoTypes.some((type) => url.endsWith(type));
};
const generateRandomNumber = (length = 9) => {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return Math.floor(Math.random() * (max - min + 1) + min);
};
const randomId = (length = 8) => {
  const lowerCaseLetters = "abcdefghijklmnopqrstuvwxyz";
  const upperCaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const digits = "0123456789";
  const allChars = lowerCaseLetters + upperCaseLetters + digits;
  let randomString = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * allChars.length);
    randomString += allChars[randomIndex];
  }
  return randomString;
};
const parseJSONToObject = (json) => {
  let msgObj;
  try {
    const parsedString = JSON.parse(json);
    if (typeof parsedString === "string") {
      msgObj = JSON.parse(parsedString);
    } else {
      msgObj = parsedString;
    }
  } catch (err) {
    throw new Error("not json");
  }
  if (!msgObj) {
    throw new Error("not json");
  }
  return msgObj;
};
exports.formatDateTime = formatDateTime;
exports.generateRandomNumber = generateRandomNumber;
exports.isVideo = isVideo;
exports.parseJSONToObject = parseJSONToObject;
exports.randomId = randomId;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/common.js.map
