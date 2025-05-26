"use strict";
function source(re) {
  if (!re)
    return null;
  if (typeof re === "string")
    return re;
  return re.source;
}
function optional(re) {
  return concat("(", re, ")?");
}
function concat(...args) {
  const joined = args.map((x) => source(x)).join("");
  return joined;
}
exports.optional = optional;
