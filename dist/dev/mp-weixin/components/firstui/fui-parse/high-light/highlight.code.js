"use strict";
const _hljs = function(factory) {
  var globalObject = typeof window === "object" && window || typeof self === "object" && self;
  if (globalObject) {
    globalObject.hljs = factory({});
    return globalObject.hljs;
  } else {
    return factory({});
  }
}(function(hljs) {
  var ArrayProto = [], objectKeys = Object.keys;
  var languages = {}, aliases = {};
  var SAFE_MODE = true;
  var noHighlightRe = /^(no-?highlight|plain|text)$/i, languagePrefixRe = /\blang(?:uage)?-([\w-]+)\b/i, fixMarkupRe = /((^(<[^>]+>|\t|)+|(?:\n)))/gm;
  var spanEndTag = "</span>";
  var LANGUAGE_NOT_FOUND = "Could not find the language '{}', did you forget to load/include a language module?";
  var options = {
    classPrefix: "hljs-",
    tabReplace: null,
    useBR: false,
    languages: void 0
  };
  var COMMON_KEYWORDS = "of and for in not or if then".split(" ");
  function escape(value) {
    return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function tag(node) {
    return node.nodeName.toLowerCase();
  }
  function testRe(re, lexeme) {
    var match = re && re.exec(lexeme);
    return match && match.index === 0;
  }
  function isNotHighlighted(language) {
    return noHighlightRe.test(language);
  }
  function blockLanguage(block) {
    var i, match, length, _class;
    var classes = block.className + " ";
    classes += block.parentNode ? block.parentNode.className : "";
    match = languagePrefixRe.exec(classes);
    if (match) {
      var language = getLanguage(match[1]);
      if (!language) {
        console.warn(LANGUAGE_NOT_FOUND.replace("{}", match[1]));
        console.warn("Falling back to no-highlight mode for this block.", block);
      }
      return language ? match[1] : "no-highlight";
    }
    classes = classes.split(/\s+/);
    for (i = 0, length = classes.length; i < length; i++) {
      _class = classes[i];
      if (isNotHighlighted(_class) || getLanguage(_class)) {
        return _class;
      }
    }
  }
  function inherit(parent) {
    var key;
    var result = {};
    var objects = Array.prototype.slice.call(arguments, 1);
    for (key in parent)
      result[key] = parent[key];
    objects.forEach(function(obj) {
      for (key in obj)
        result[key] = obj[key];
    });
    return result;
  }
  function nodeStream(node) {
    var result = [];
    (function _nodeStream(node2, offset) {
      for (var child = node2.firstChild; child; child = child.nextSibling) {
        if (child.nodeType === 3)
          offset += child.nodeValue.length;
        else if (child.nodeType === 1) {
          result.push({
            event: "start",
            offset,
            node: child
          });
          offset = _nodeStream(child, offset);
          if (!tag(child).match(/br|hr|img|input/)) {
            result.push({
              event: "stop",
              offset,
              node: child
            });
          }
        }
      }
      return offset;
    })(node, 0);
    return result;
  }
  function mergeStreams(original, highlighted, value) {
    var processed = 0;
    var result = "";
    var nodeStack = [];
    function selectStream() {
      if (!original.length || !highlighted.length) {
        return original.length ? original : highlighted;
      }
      if (original[0].offset !== highlighted[0].offset) {
        return original[0].offset < highlighted[0].offset ? original : highlighted;
      }
      return highlighted[0].event === "start" ? original : highlighted;
    }
    function open(node) {
      function attr_str(a) {
        return " " + a.nodeName + '="' + escape(a.value).replace(/"/g, "&quot;") + '"';
      }
      result += "<" + tag(node) + ArrayProto.map.call(node.attributes, attr_str).join("") + ">";
    }
    function close(node) {
      result += "</" + tag(node) + ">";
    }
    function render(event) {
      (event.event === "start" ? open : close)(event.node);
    }
    while (original.length || highlighted.length) {
      var stream = selectStream();
      result += escape(value.substring(processed, stream[0].offset));
      processed = stream[0].offset;
      if (stream === original) {
        nodeStack.reverse().forEach(close);
        do {
          render(stream.splice(0, 1)[0]);
          stream = selectStream();
        } while (stream === original && stream.length && stream[0].offset === processed);
        nodeStack.reverse().forEach(open);
      } else {
        if (stream[0].event === "start") {
          nodeStack.push(stream[0].node);
        } else {
          nodeStack.pop();
        }
        render(stream.splice(0, 1)[0]);
      }
    }
    return result + escape(value.substr(processed));
  }
  function dependencyOnParent(mode) {
    if (!mode)
      return false;
    return mode.endsWithParent || dependencyOnParent(mode.starts);
  }
  function expand_or_clone_mode(mode) {
    if (mode.variants && !mode.cached_variants) {
      mode.cached_variants = mode.variants.map(function(variant) {
        return inherit(mode, {
          variants: null
        }, variant);
      });
    }
    if (mode.cached_variants)
      return mode.cached_variants;
    if (dependencyOnParent(mode))
      return [inherit(mode, {
        starts: mode.starts ? inherit(mode.starts) : null
      })];
    if (Object.isFrozen(mode))
      return [inherit(mode)];
    return [mode];
  }
  function compileKeywords(rawKeywords, case_insensitive) {
    var compiled_keywords = {};
    if (typeof rawKeywords === "string") {
      splitAndCompile("keyword", rawKeywords);
    } else {
      objectKeys(rawKeywords).forEach(function(className) {
        splitAndCompile(className, rawKeywords[className]);
      });
    }
    return compiled_keywords;
    function splitAndCompile(className, str) {
      if (case_insensitive) {
        str = str.toLowerCase();
      }
      str.split(" ").forEach(function(keyword) {
        var pair = keyword.split("|");
        compiled_keywords[pair[0]] = [className, scoreForKeyword(pair[0], pair[1])];
      });
    }
  }
  function scoreForKeyword(keyword, providedScore) {
    if (providedScore)
      return Number(providedScore);
    return commonKeyword(keyword) ? 0 : 1;
  }
  function commonKeyword(word) {
    return COMMON_KEYWORDS.indexOf(word.toLowerCase()) != -1;
  }
  function compileLanguage(language) {
    function reStr(re) {
      return re && re.source || re;
    }
    function langRe(value, global) {
      return new RegExp(
        reStr(value),
        "m" + (language.case_insensitive ? "i" : "") + (global ? "g" : "")
      );
    }
    function reCountMatchGroups(re) {
      return new RegExp(re.toString() + "|").exec("").length - 1;
    }
    function joinRe(regexps, separator) {
      var backreferenceRe = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;
      var numCaptures = 0;
      var ret = "";
      for (var i = 0; i < regexps.length; i++) {
        numCaptures += 1;
        var offset = numCaptures;
        var re = reStr(regexps[i]);
        if (i > 0) {
          ret += separator;
        }
        ret += "(";
        while (re.length > 0) {
          var match = backreferenceRe.exec(re);
          if (match == null) {
            ret += re;
            break;
          }
          ret += re.substring(0, match.index);
          re = re.substring(match.index + match[0].length);
          if (match[0][0] == "\\" && match[1]) {
            ret += "\\" + String(Number(match[1]) + offset);
          } else {
            ret += match[0];
            if (match[0] == "(") {
              numCaptures++;
            }
          }
        }
        ret += ")";
      }
      return ret;
    }
    function buildModeRegex(mode) {
      var matchIndexes = {};
      var matcherRe;
      var regexes = [];
      var matcher = {};
      var matchAt = 1;
      function addRule(rule, regex) {
        matchIndexes[matchAt] = rule;
        regexes.push([rule, regex]);
        matchAt += reCountMatchGroups(regex) + 1;
      }
      var term;
      for (var i = 0; i < mode.contains.length; i++) {
        var re;
        term = mode.contains[i];
        if (term.beginKeywords) {
          re = "\\.?(?:" + term.begin + ")\\.?";
        } else {
          re = term.begin;
        }
        addRule(term, re);
      }
      if (mode.terminator_end)
        addRule("end", mode.terminator_end);
      if (mode.illegal)
        addRule("illegal", mode.illegal);
      var terminators = regexes.map(function(el) {
        return el[1];
      });
      matcherRe = langRe(joinRe(terminators, "|"), true);
      matcher.lastIndex = 0;
      matcher.exec = function(s) {
        var rule;
        if (regexes.length === 0)
          return null;
        matcherRe.lastIndex = matcher.lastIndex;
        var match = matcherRe.exec(s);
        if (!match) {
          return null;
        }
        for (var i2 = 0; i2 < match.length; i2++) {
          if (match[i2] != void 0 && matchIndexes["" + i2] != void 0) {
            rule = matchIndexes["" + i2];
            break;
          }
        }
        if (typeof rule === "string") {
          match.type = rule;
          match.extra = [mode.illegal, mode.terminator_end];
        } else {
          match.type = "begin";
          match.rule = rule;
        }
        return match;
      };
      return matcher;
    }
    function compileMode(mode, parent) {
      if (mode.compiled)
        return;
      mode.compiled = true;
      mode.keywords = mode.keywords || mode.beginKeywords;
      if (mode.keywords)
        mode.keywords = compileKeywords(mode.keywords, language.case_insensitive);
      mode.lexemesRe = langRe(mode.lexemes || /\w+/, true);
      if (parent) {
        if (mode.beginKeywords) {
          mode.begin = "\\b(" + mode.beginKeywords.split(" ").join("|") + ")\\b";
        }
        if (!mode.begin)
          mode.begin = /\B|\b/;
        mode.beginRe = langRe(mode.begin);
        if (mode.endSameAsBegin)
          mode.end = mode.begin;
        if (!mode.end && !mode.endsWithParent)
          mode.end = /\B|\b/;
        if (mode.end)
          mode.endRe = langRe(mode.end);
        mode.terminator_end = reStr(mode.end) || "";
        if (mode.endsWithParent && parent.terminator_end)
          mode.terminator_end += (mode.end ? "|" : "") + parent.terminator_end;
      }
      if (mode.illegal)
        mode.illegalRe = langRe(mode.illegal);
      if (mode.relevance == null)
        mode.relevance = 1;
      if (!mode.contains) {
        mode.contains = [];
      }
      mode.contains = Array.prototype.concat.apply([], mode.contains.map(function(c) {
        return expand_or_clone_mode(c === "self" ? mode : c);
      }));
      mode.contains.forEach(function(c) {
        compileMode(c, mode);
      });
      if (mode.starts) {
        compileMode(mode.starts, parent);
      }
      mode.terminators = buildModeRegex(mode);
    }
    if (language.contains && language.contains.indexOf("self") != -1) {
      if (!SAFE_MODE) {
        throw new Error(
          "ERR: contains `self` is not supported at the top-level of a language.  See documentation."
        );
      } else {
        language.contains = language.contains.filter(function(mode) {
          return mode != "self";
        });
      }
    }
    compileMode(language);
  }
  function highlight(languageName, code, ignore_illegals, continuation) {
    var codeToHighlight = code;
    function escapeRe(value) {
      return new RegExp(value.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"), "m");
    }
    function endOfMode(mode, lexeme) {
      if (testRe(mode.endRe, lexeme)) {
        while (mode.endsParent && mode.parent) {
          mode = mode.parent;
        }
        return mode;
      }
      if (mode.endsWithParent) {
        return endOfMode(mode.parent, lexeme);
      }
    }
    function keywordMatch(mode, match2) {
      var match_str = language.case_insensitive ? match2[0].toLowerCase() : match2[0];
      return mode.keywords.hasOwnProperty(match_str) && mode.keywords[match_str];
    }
    function buildSpan(className, insideSpan, leaveOpen, noPrefix) {
      if (!leaveOpen && insideSpan === "")
        return "";
      if (!className)
        return insideSpan;
      var classPrefix = noPrefix ? "" : options.classPrefix, openSpan = '<span class="' + classPrefix, closeSpan = leaveOpen ? "" : spanEndTag;
      openSpan += className + '">';
      return openSpan + insideSpan + closeSpan;
    }
    function processKeywords() {
      var keyword_match, last_index, match2, result2;
      if (!top.keywords)
        return escape(mode_buffer);
      result2 = "";
      last_index = 0;
      top.lexemesRe.lastIndex = 0;
      match2 = top.lexemesRe.exec(mode_buffer);
      while (match2) {
        result2 += escape(mode_buffer.substring(last_index, match2.index));
        keyword_match = keywordMatch(top, match2);
        if (keyword_match) {
          relevance += keyword_match[1];
          result2 += buildSpan(keyword_match[0], escape(match2[0]));
        } else {
          result2 += escape(match2[0]);
        }
        last_index = top.lexemesRe.lastIndex;
        match2 = top.lexemesRe.exec(mode_buffer);
      }
      return result2 + escape(mode_buffer.substr(last_index));
    }
    function processSubLanguage() {
      var explicit = typeof top.subLanguage === "string";
      if (explicit && !languages[top.subLanguage]) {
        return escape(mode_buffer);
      }
      var result2 = explicit ? highlight(top.subLanguage, mode_buffer, true, continuations[top.subLanguage]) : highlightAuto(mode_buffer, top.subLanguage.length ? top.subLanguage : void 0);
      if (top.relevance > 0) {
        relevance += result2.relevance;
      }
      if (explicit) {
        continuations[top.subLanguage] = result2.top;
      }
      return buildSpan(result2.language, result2.value, false, true);
    }
    function processBuffer() {
      result += top.subLanguage != null ? processSubLanguage() : processKeywords();
      mode_buffer = "";
    }
    function startNewMode(mode) {
      result += mode.className ? buildSpan(mode.className, "", true) : "";
      top = Object.create(mode, {
        parent: {
          value: top
        }
      });
    }
    function doBeginMatch(match2) {
      var lexeme = match2[0];
      var new_mode = match2.rule;
      if (new_mode && new_mode.endSameAsBegin) {
        new_mode.endRe = escapeRe(lexeme);
      }
      if (new_mode.skip) {
        mode_buffer += lexeme;
      } else {
        if (new_mode.excludeBegin) {
          mode_buffer += lexeme;
        }
        processBuffer();
        if (!new_mode.returnBegin && !new_mode.excludeBegin) {
          mode_buffer = lexeme;
        }
      }
      startNewMode(new_mode);
      return new_mode.returnBegin ? 0 : lexeme.length;
    }
    function doEndMatch(match2) {
      var lexeme = match2[0];
      var matchPlusRemainder = codeToHighlight.substr(match2.index);
      var end_mode = endOfMode(top, matchPlusRemainder);
      if (!end_mode) {
        return;
      }
      var origin = top;
      if (origin.skip) {
        mode_buffer += lexeme;
      } else {
        if (!(origin.returnEnd || origin.excludeEnd)) {
          mode_buffer += lexeme;
        }
        processBuffer();
        if (origin.excludeEnd) {
          mode_buffer = lexeme;
        }
      }
      do {
        if (top.className) {
          result += spanEndTag;
        }
        if (!top.skip && !top.subLanguage) {
          relevance += top.relevance;
        }
        top = top.parent;
      } while (top !== end_mode.parent);
      if (end_mode.starts) {
        if (end_mode.endSameAsBegin) {
          end_mode.starts.endRe = end_mode.endRe;
        }
        startNewMode(end_mode.starts);
      }
      return origin.returnEnd ? 0 : lexeme.length;
    }
    var lastMatch = {};
    function processLexeme(text_before_match, match2) {
      var lexeme = match2 && match2[0];
      mode_buffer += text_before_match;
      if (lexeme == null) {
        processBuffer();
        return 0;
      }
      if (lastMatch.type == "begin" && match2.type == "end" && lastMatch.index == match2.index && lexeme === "") {
        mode_buffer += codeToHighlight.slice(match2.index, match2.index + 1);
        return 1;
      }
      lastMatch = match2;
      if (match2.type === "begin") {
        return doBeginMatch(match2);
      } else if (match2.type === "illegal" && !ignore_illegals) {
        throw new Error('Illegal lexeme "' + lexeme + '" for mode "' + (top.className || "<unnamed>") + '"');
      } else if (match2.type === "end") {
        var processed = doEndMatch(match2);
        if (processed != void 0)
          return processed;
      }
      mode_buffer += lexeme;
      return lexeme.length;
    }
    var language = getLanguage(languageName);
    if (!language) {
      console.error(LANGUAGE_NOT_FOUND.replace("{}", languageName));
      throw new Error('Unknown language: "' + languageName + '"');
    }
    compileLanguage(language);
    var top = continuation || language;
    var continuations = {};
    var result = "", current;
    for (current = top; current !== language; current = current.parent) {
      if (current.className) {
        result = buildSpan(current.className, "", true) + result;
      }
    }
    var mode_buffer = "";
    var relevance = 0;
    try {
      var match, count, index = 0;
      while (true) {
        top.terminators.lastIndex = index;
        match = top.terminators.exec(codeToHighlight);
        if (!match)
          break;
        count = processLexeme(codeToHighlight.substring(index, match.index), match);
        index = match.index + count;
      }
      processLexeme(codeToHighlight.substr(index));
      for (current = top; current.parent; current = current.parent) {
        if (current.className) {
          result += spanEndTag;
        }
      }
      return {
        relevance,
        value: result,
        illegal: false,
        language: languageName,
        top
      };
    } catch (err) {
      if (err.message && err.message.indexOf("Illegal") !== -1) {
        return {
          illegal: true,
          relevance: 0,
          value: escape(codeToHighlight)
        };
      } else if (SAFE_MODE) {
        return {
          relevance: 0,
          value: escape(codeToHighlight),
          language: languageName,
          top,
          errorRaised: err
        };
      } else {
        throw err;
      }
    }
  }
  function highlightAuto(code, languageSubset) {
    languageSubset = languageSubset || options.languages || objectKeys(languages);
    var result = {
      relevance: 0,
      value: escape(code)
    };
    var second_best = result;
    languageSubset.filter(getLanguage).filter(autoDetection).forEach(function(name) {
      var current = highlight(name, code, false);
      current.language = name;
      if (current.relevance > second_best.relevance) {
        second_best = current;
      }
      if (current.relevance > result.relevance) {
        second_best = result;
        result = current;
      }
    });
    if (second_best.language) {
      result.second_best = second_best;
    }
    return result;
  }
  function fixMarkup(value) {
    if (!(options.tabReplace || options.useBR)) {
      return value;
    }
    return value.replace(fixMarkupRe, function(match, p1) {
      if (options.useBR && match === "\n") {
        return "<br>";
      } else if (options.tabReplace) {
        return p1.replace(/\t/g, options.tabReplace);
      }
      return "";
    });
  }
  function buildClassName(prevClassName, currentLang, resultLang) {
    var language = currentLang ? aliases[currentLang] : resultLang, result = [prevClassName.trim()];
    if (!prevClassName.match(/\bhljs\b/)) {
      result.push("hljs");
    }
    if (prevClassName.indexOf(language) === -1) {
      result.push(language);
    }
    return result.join(" ").trim();
  }
  function highlightBlock(block) {
    var node, originalStream, result, resultNode, text;
    var language = blockLanguage(block);
    if (isNotHighlighted(language))
      return;
    if (options.useBR) {
      node = document.createElement("div");
      node.innerHTML = block.innerHTML.replace(/\n/g, "").replace(/<br[ \/]*>/g, "\n");
    } else {
      node = block;
    }
    text = node.textContent;
    result = language ? highlight(language, text, true) : highlightAuto(text);
    originalStream = nodeStream(node);
    if (originalStream.length) {
      resultNode = document.createElement("div");
      resultNode.innerHTML = result.value;
      result.value = mergeStreams(originalStream, nodeStream(resultNode), text);
    }
    result.value = fixMarkup(result.value);
    block.innerHTML = result.value;
    block.className = buildClassName(block.className, language, result.language);
    block.result = {
      language: result.language,
      re: result.relevance
    };
    if (result.second_best) {
      block.second_best = {
        language: result.second_best.language,
        re: result.second_best.relevance
      };
    }
  }
  function configure(user_options) {
    options = inherit(options, user_options);
  }
  function initHighlighting() {
    if (initHighlighting.called)
      return;
    initHighlighting.called = true;
    var blocks = document.querySelectorAll("pre code");
    ArrayProto.forEach.call(blocks, highlightBlock);
  }
  function initHighlightingOnLoad() {
    window.addEventListener("DOMContentLoaded", initHighlighting, false);
    window.addEventListener("load", initHighlighting, false);
  }
  var PLAINTEXT_LANGUAGE = {
    disableAutodetect: true
  };
  function registerLanguage(name, language) {
    var lang;
    try {
      lang = language(hljs);
    } catch (error) {
      console.error("Language definition for '{}' could not be registered.".replace("{}", name));
      if (!SAFE_MODE) {
        throw error;
      } else {
        console.error(error);
      }
      lang = PLAINTEXT_LANGUAGE;
    }
    languages[name] = lang;
    lang.rawDefinition = language.bind(null, hljs);
    if (lang.aliases) {
      lang.aliases.forEach(function(alias) {
        aliases[alias] = name;
      });
    }
  }
  function listLanguages() {
    return objectKeys(languages);
  }
  function requireLanguage(name) {
    var lang = getLanguage(name);
    if (lang) {
      return lang;
    }
    var err = new Error("The '{}' language is required, but not loaded.".replace("{}", name));
    throw err;
  }
  function getLanguage(name) {
    name = (name || "").toLowerCase();
    return languages[name] || languages[aliases[name]];
  }
  function autoDetection(name) {
    var lang = getLanguage(name);
    return lang && !lang.disableAutodetect;
  }
  hljs.highlight = highlight;
  hljs.highlightAuto = highlightAuto;
  hljs.fixMarkup = fixMarkup;
  hljs.highlightBlock = highlightBlock;
  hljs.configure = configure;
  hljs.initHighlighting = initHighlighting;
  hljs.initHighlightingOnLoad = initHighlightingOnLoad;
  hljs.registerLanguage = registerLanguage;
  hljs.listLanguages = listLanguages;
  hljs.getLanguage = getLanguage;
  hljs.requireLanguage = requireLanguage;
  hljs.autoDetection = autoDetection;
  hljs.inherit = inherit;
  hljs.debugMode = function() {
    SAFE_MODE = false;
  };
  hljs.IDENT_RE = "[a-zA-Z]\\w*";
  hljs.UNDERSCORE_IDENT_RE = "[a-zA-Z_]\\w*";
  hljs.NUMBER_RE = "\\b\\d+(\\.\\d+)?";
  hljs.C_NUMBER_RE = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)";
  hljs.BINARY_NUMBER_RE = "\\b(0b[01]+)";
  hljs.RE_STARTERS_RE = "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~";
  hljs.BACKSLASH_ESCAPE = {
    begin: "\\\\[\\s\\S]",
    relevance: 0
  };
  hljs.APOS_STRING_MODE = {
    className: "string",
    begin: "'",
    end: "'",
    illegal: "\\n",
    contains: [hljs.BACKSLASH_ESCAPE]
  };
  hljs.QUOTE_STRING_MODE = {
    className: "string",
    begin: '"',
    end: '"',
    illegal: "\\n",
    contains: [hljs.BACKSLASH_ESCAPE]
  };
  hljs.PHRASAL_WORDS_MODE = {
    begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
  };
  hljs.COMMENT = function(begin, end, inherits) {
    var mode = hljs.inherit(
      {
        className: "comment",
        begin,
        end,
        contains: []
      },
      inherits || {}
    );
    mode.contains.push(hljs.PHRASAL_WORDS_MODE);
    mode.contains.push({
      className: "doctag",
      begin: "(?:TODO|FIXME|NOTE|BUG|XXX):",
      relevance: 0
    });
    return mode;
  };
  hljs.C_LINE_COMMENT_MODE = hljs.COMMENT("//", "$");
  hljs.C_BLOCK_COMMENT_MODE = hljs.COMMENT("/\\*", "\\*/");
  hljs.HASH_COMMENT_MODE = hljs.COMMENT("#", "$");
  hljs.NUMBER_MODE = {
    className: "number",
    begin: hljs.NUMBER_RE,
    relevance: 0
  };
  hljs.C_NUMBER_MODE = {
    className: "number",
    begin: hljs.C_NUMBER_RE,
    relevance: 0
  };
  hljs.BINARY_NUMBER_MODE = {
    className: "number",
    begin: hljs.BINARY_NUMBER_RE,
    relevance: 0
  };
  hljs.CSS_NUMBER_MODE = {
    className: "number",
    begin: hljs.NUMBER_RE + "(%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?",
    relevance: 0
  };
  hljs.REGEXP_MODE = {
    className: "regexp",
    begin: /\//,
    end: /\/[gimuy]*/,
    illegal: /\n/,
    contains: [
      hljs.BACKSLASH_ESCAPE,
      {
        begin: /\[/,
        end: /\]/,
        relevance: 0,
        contains: [hljs.BACKSLASH_ESCAPE]
      }
    ]
  };
  hljs.TITLE_MODE = {
    className: "title",
    begin: hljs.IDENT_RE,
    relevance: 0
  };
  hljs.UNDERSCORE_TITLE_MODE = {
    className: "title",
    begin: hljs.UNDERSCORE_IDENT_RE,
    relevance: 0
  };
  hljs.METHOD_GUARD = {
    // excludes method names from keyword processing
    begin: "\\.\\s*" + hljs.UNDERSCORE_IDENT_RE,
    relevance: 0
  };
  var constants = [
    hljs.BACKSLASH_ESCAPE,
    hljs.APOS_STRING_MODE,
    hljs.QUOTE_STRING_MODE,
    hljs.PHRASAL_WORDS_MODE,
    hljs.COMMENT,
    hljs.C_LINE_COMMENT_MODE,
    hljs.C_BLOCK_COMMENT_MODE,
    hljs.HASH_COMMENT_MODE,
    hljs.NUMBER_MODE,
    hljs.C_NUMBER_MODE,
    hljs.BINARY_NUMBER_MODE,
    hljs.CSS_NUMBER_MODE,
    hljs.REGEXP_MODE,
    hljs.TITLE_MODE,
    hljs.UNDERSCORE_TITLE_MODE,
    hljs.METHOD_GUARD
  ];
  constants.forEach(function(obj) {
    deepFreeze(obj);
  });
  function deepFreeze(o) {
    Object.freeze(o);
    var objIsFunction = typeof o === "function";
    Object.getOwnPropertyNames(o).forEach(function(prop) {
      if (o.hasOwnProperty(prop) && o[prop] !== null && (typeof o[prop] === "object" || typeof o[prop] === "function") && (objIsFunction ? prop !== "caller" && prop !== "callee" && prop !== "arguments" : true) && !Object.isFrozen(o[prop])) {
        deepFreeze(o[prop]);
      }
    });
    return o;
  }
  return hljs;
});
exports._hljs = _hljs;
