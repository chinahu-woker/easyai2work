"use strict";exports.optional=function(n){return function(...n){return n.map((n=>function(n){return n?"string"==typeof n?n:n.source:null}(n))).join("")}("(",n,")?")};
