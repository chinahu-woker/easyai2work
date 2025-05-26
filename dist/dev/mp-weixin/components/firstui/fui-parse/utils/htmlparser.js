"use strict";
var startTag = /^<([-A-Za-z0-9_]+)((?:\s+[a-zA-Z_:][-a-zA-Z0-9_:.]*(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/, endTag = /^<\/([-A-Za-z0-9_]+)[^>]*>/, attr = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g;
var codeTag = /^<code.*?>([\s\S]*?)<\/code>/;
var empty = makeMap("area,base,basefont,br,col,frame,hr,img,input,link,meta,param,embed,command,keygen,source,track,wbr");
var block = makeMap("a,address,code,article,applet,aside,audio,blockquote,button,canvas,center,dd,del,dir,div,dl,dt,fieldset,figcaption,figure,footer,form,frameset,h1,h2,h3,h4,h5,h6,header,hgroup,hr,iframe,ins,isindex,li,map,menu,noframes,noscript,object,ol,output,p,pre,section,script,table,tbody,td,tfoot,th,thead,tr,ul,video");
var inline = makeMap("abbr,acronym,applet,b,basefont,bdo,big,br,button,cite,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,script,select,small,span,strike,strong,sub,sup,textarea,tt,u,var");
var closeSelf = makeMap("colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr");
var fillAttrs = makeMap("checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected");
var special = makeMap("wxxxcode-style,script,style,view,scroll-view,block");
var codeContent = "";
function HTMLParser(html, handler) {
  var index, chars, match, stack = [], last = html;
  stack.last = function() {
    return this[this.length - 1];
  };
  while (html) {
    chars = true;
    if (!stack.last() || !special[stack.last()]) {
      if (html.indexOf("<!--") == 0) {
        index = html.indexOf("-->");
        if (index >= 0) {
          if (handler.comment)
            handler.comment(html.substring(4, index));
          html = html.substring(index + 3);
          chars = false;
        }
      } else if (html.indexOf("</") == 0) {
        match = html.match(endTag);
        if (match) {
          html = html.substring(match[0].length);
          match[0].replace(endTag, parseEndTag);
          chars = false;
        }
      } else if (html.indexOf("<") == 0) {
        match = html.match(startTag);
        if (match) {
          var tagName = match[1];
          if (tagName === "code") {
            var codeTagMatch = html.match(codeTag);
            codeContent = codeTagMatch[1] || "";
          }
          html = html.substring(match[0].length);
          match[0].replace(startTag, parseStartTag);
          chars = false;
        }
      }
      if (chars) {
        index = html.indexOf("<");
        var text = "";
        while (index === 0) {
          text += "<";
          html = html.substring(1);
          index = html.indexOf("<");
        }
        text += index < 0 ? html : html.substring(0, index);
        html = index < 0 ? "" : html.substring(index);
        if (handler.chars && text.trim() !== "") {
          handler.chars(text);
        }
      }
    } else {
      html = html.replace(new RegExp("([\\s\\S]*?)</" + stack.last() + "[^>]*>"), function(all, text2) {
        text2 = text2.replace(/<!--([\s\S]*?)-->|<!\[CDATA\[([\s\S]*?)]]>/g, "$1$2");
        if (handler.chars && text2.trim() !== "")
          handler.chars(text2);
        return "";
      });
      parseEndTag("", stack.last());
    }
    if (html == last)
      throw "Parse Error: " + html;
    last = html;
  }
  parseEndTag();
  function parseStartTag(tag, tagName2, rest, unary) {
    tagName2 = tagName2.toLowerCase();
    if (block[tagName2]) {
      while (stack.last() && inline[stack.last()]) {
        parseEndTag("", stack.last());
      }
    }
    if (closeSelf[tagName2] && stack.last() == tagName2) {
      parseEndTag("", tagName2);
    }
    unary = empty[tagName2] || !!unary;
    if (!unary)
      stack.push(tagName2);
    if (handler.start) {
      var attrs = [];
      rest.replace(attr, function(match2, name) {
        var value = arguments[2] ? arguments[2] : arguments[3] ? arguments[3] : arguments[4] ? arguments[4] : fillAttrs[name] ? name : "";
        attrs.push({
          name,
          value,
          escaped: value.replace(/(^|[^\\])"/g, '$1\\"')
          //"
        });
      });
      if (handler.start) {
        var tagContent = codeContent || "";
        handler.start(tagName2, attrs, unary, tagContent);
        codeContent = "";
      }
    }
  }
  function parseEndTag(tag, tagName2) {
    if (!tagName2)
      var pos = 0;
    else {
      tagName2 = tagName2.toLowerCase();
      for (var pos = stack.length - 1; pos >= 0; pos--)
        if (stack[pos] == tagName2)
          break;
    }
    if (pos >= 0) {
      for (var i = stack.length - 1; i >= pos; i--)
        if (handler.end)
          handler.end(stack[i]);
      stack.length = pos;
    }
  }
}
function makeMap(str) {
  var obj = {}, items = str.split(",");
  for (var i = 0; i < items.length; i++)
    obj[items[i]] = true;
  return obj;
}
exports.HTMLParser = HTMLParser;
