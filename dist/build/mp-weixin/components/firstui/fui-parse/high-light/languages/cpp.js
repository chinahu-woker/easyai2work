"use strict";const c=require("./c-like.js");exports.cpp=function(e){const t=c.cLike(e);return t.disableAutodetect=!1,t.name="C++",t.aliases=["cc","c++","h++","hpp","hh","hxx","cxx"],t};
