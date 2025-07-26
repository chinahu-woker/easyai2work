"use strict";
const components_firstui_fuiParse_highLight_languages_cLike = require("./c-like.js");
function c(hljs) {
  const lang = components_firstui_fuiParse_highLight_languages_cLike.cLike(hljs);
  lang.name = "C";
  lang.aliases = ["c", "h"];
  return lang;
}
exports.c = c;
