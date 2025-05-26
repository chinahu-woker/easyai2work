"use strict";
const components_firstui_fuiParse_utils_wxDiscode = require("./wxDiscode.js");
const components_firstui_fuiParse_utils_htmlparser = require("./htmlparser.js");
var __placeImgeUrlHttps = "https";
var __emojisReg = "";
var __emojisBaseSrc = "";
var __emojis = {};
makeMap(
  "area,base,basefont,br,col,frame,hr,img,input,link,meta,param,embed,command,keygen,source,track,wbr"
);
var block = makeMap(
  "br,a,code,address,article,applet,aside,audio,blockquote,button,canvas,center,dd,del,dir,div,dl,dt,fieldset,figcaption,figure,footer,form,frameset,h1,h2,h3,h4,h5,h6,header,hgroup,hr,iframe,ins,isindex,li,map,menu,noframes,noscript,object,ol,output,p,pre,section,script,table,tbody,td,tfoot,th,thead,tr,ul,video"
);
var inline = makeMap(
  "abbr,acronym,applet,b,basefont,bdo,big,button,cite,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,script,select,small,span,strike,strong,sub,sup,textarea,tt,u,var"
);
var closeSelf = makeMap("colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr");
makeMap(
  "checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected"
);
makeMap("wxxxcode-style,script,style,view,scroll-view,block");
function makeMap(str) {
  var obj = {}, items = str.split(",");
  for (var i = 0; i < items.length; i++)
    obj[items[i]] = true;
  return obj;
}
function removeDOCTYPE(html) {
  return html.replace(/<\?xml.*\?>\n/, "").replace(/<.*!doctype.*\>\n/, "").replace(/<.*!DOCTYPE.*\>\n/, "");
}
function trimHtml(html) {
  return html.replace(/<!--.*?-->/ig, "").replace(/[ ]+</ig, "<");
}
function removeInvalidTags(html) {
  return html.replace(/\<head(.|\n)*<\/head\>/ig, "").replace(/\<title(.|\n)*<\/title\>/ig, "").replace(/\<script(.|\n)*<\/script\>/ig, "").replace(/\<meta(.|\n)*<\/meta\>/ig, "").replace(/\<style(.|\n)*<\/style\>/gm, "");
}
function html2json(html, bindName) {
  html = removeDOCTYPE(html);
  html = removeInvalidTags(html);
  html = trimHtml(html);
  html = components_firstui_fuiParse_utils_wxDiscode.wxDiscode.strDiscode(html);
  var bufArray = [];
  var results = {
    node: bindName,
    nodes: [],
    images: [],
    imageUrls: []
  };
  var index = 0;
  components_firstui_fuiParse_utils_htmlparser.HTMLParser(html, {
    start: function(tag, attrs, unary, content) {
      var node = {
        node: "element",
        tag
      };
      content && (node["content"] = content);
      if (bufArray.length === 0) {
        node.index = index.toString();
        index += 1;
      } else {
        var parent = bufArray[0];
        if (parent.nodes === void 0) {
          parent.nodes = [];
        }
        node.index = parent.index + "." + parent.nodes.length;
      }
      if (block[tag]) {
        node.tagType = "block";
      } else if (inline[tag]) {
        node.tagType = "inline";
      } else if (closeSelf[tag]) {
        node.tagType = "closeSelf";
      }
      if (attrs.length !== 0) {
        node.attr = attrs.reduce(function(pre, attr) {
          var name = attr.name;
          var value2 = attr.value;
          if (name == "class") {
            node.classStr = value2;
          }
          if (name == "style") {
            node.styleStr = value2;
          }
          if (value2.match(/ /)) {
            value2 = value2.split(" ");
          }
          if (pre[name]) {
            if (Array.isArray(pre[name])) {
              pre[name].push(value2);
            } else {
              pre[name] = [pre[name], value2];
            }
          } else {
            pre[name] = value2;
          }
          return pre;
        }, {});
      }
      if (node.tag === "img") {
        node.imgIndex = results.images.length;
        var imgUrl = node.attr.src;
        if (imgUrl[0] == "") {
          imgUrl.splice(0, 1);
        }
        imgUrl = components_firstui_fuiParse_utils_wxDiscode.wxDiscode.urlToHttpUrl(imgUrl, __placeImgeUrlHttps);
        node.attr.src = imgUrl;
        node.from = bindName;
        results.images.push(node);
        results.imageUrls.push(imgUrl);
      }
      if (node.tag === "font") {
        var fontSize = [
          "x-small",
          "small",
          "medium",
          "large",
          "x-large",
          "xx-large",
          "-webkit-xxx-large"
        ];
        var styleAttrs = {
          "color": "color",
          "face": "font-family",
          "size": "font-size"
        };
        if (!node.attr.style)
          node.attr.style = [];
        if (!node.styleStr)
          node.styleStr = "";
        for (var key in styleAttrs) {
          if (node.attr[key]) {
            var value = key === "size" ? fontSize[node.attr[key] - 1] : node.attr[key];
            node.attr.style.push(styleAttrs[key]);
            node.attr.style.push(value);
            node.styleStr += styleAttrs[key] + ": " + value + ";";
          }
        }
      }
      if (node.tag === "source") {
        results.source = node.attr.src;
      }
      if (unary) {
        var parent = bufArray[0] || results;
        if (parent.nodes === void 0) {
          parent.nodes = [];
        }
        parent.nodes.push(node);
      } else {
        bufArray.unshift(node);
      }
    },
    end: function(tag) {
      var node = bufArray.shift();
      if (node.tag !== tag)
        console.error("invalid state: mismatch end tag");
      if (node.tag === "video" && results.source) {
        node.attr.src = results.source;
        delete results.source;
      }
      if (bufArray.length === 0) {
        results.nodes.push(node);
      } else {
        var parent = bufArray[0];
        if (parent.nodes === void 0) {
          parent.nodes = [];
        }
        parent.nodes.push(node);
      }
    },
    chars: function(text) {
      var node = {
        node: "text",
        text,
        textArray: transEmojiStr(text)
      };
      if (bufArray.length === 0) {
        node.index = index.toString();
        index += 1;
        results.nodes.push(node);
      } else {
        var parent = bufArray[0];
        if (parent.nodes === void 0) {
          parent.nodes = [];
        }
        node.index = parent.index + "." + parent.nodes.length;
        parent.nodes.push(node);
      }
    },
    comment: function(text) {
    }
  });
  return results;
}
function transEmojiStr(str) {
  var emojiObjs = [];
  if (__emojisReg.length == 0 || !__emojis) {
    var emojiObj = {};
    emojiObj.node = "text";
    emojiObj.text = str;
    array = [emojiObj];
    return array;
  }
  str = str.replace(/\[([^\[\]]+)\]/g, ":$1:");
  var eReg = new RegExp("[:]");
  var array = str.split(eReg);
  for (var i = 0; i < array.length; i++) {
    var ele = array[i];
    var emojiObj = {};
    if (__emojis[ele]) {
      emojiObj.node = "element";
      emojiObj.tag = "emoji";
      emojiObj.text = __emojis[ele];
      emojiObj.baseSrc = __emojisBaseSrc;
    } else {
      emojiObj.node = "text";
      emojiObj.text = ele;
    }
    emojiObjs.push(emojiObj);
  }
  return emojiObjs;
}
function emojisInit(reg = "", baseSrc = "/fuiParse/emojis/", emojis) {
  __emojisReg = reg;
  __emojisBaseSrc = baseSrc;
  __emojis = emojis;
}
const HtmlToJson = {
  html2json,
  emojisInit
};
exports.HtmlToJson = HtmlToJson;
