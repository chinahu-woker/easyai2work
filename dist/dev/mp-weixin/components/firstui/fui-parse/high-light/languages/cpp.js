"use strict";
const components_firstui_fuiParse_highLight_languages_cLike = require("./c-like.js");
function cpp(hljs) {
  const lang = components_firstui_fuiParse_highLight_languages_cLike.cLike(hljs);
  lang.disableAutodetect = false;
  lang.name = "C++";
  lang.aliases = ["cc", "c++", "h++", "hpp", "hh", "hxx", "cxx"];
  return lang;
}
exports.cpp = cpp;
