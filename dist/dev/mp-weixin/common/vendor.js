"use strict";
var _a;
const _export_sfc = (sfc, props2) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props2) {
    target[key] = val;
  }
  return target;
};
/**
* @vue/shared v3.4.21
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
function makeMap(str, expectsLowerCase) {
  const set2 = new Set(str.split(","));
  return (val) => set2.has(val);
}
const EMPTY_OBJ = Object.freeze({});
const EMPTY_ARR = Object.freeze([]);
const NOOP = () => {
};
const NO = () => false;
const isOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && // uppercase letter
(key.charCodeAt(2) > 122 || key.charCodeAt(2) < 97);
const isModelListener = (key) => key.startsWith("onUpdate:");
const extend = Object.assign;
const remove = (arr, el) => {
  const i = arr.indexOf(el);
  if (i > -1) {
    arr.splice(i, 1);
  }
};
const hasOwnProperty$3 = Object.prototype.hasOwnProperty;
const hasOwn = (val, key) => hasOwnProperty$3.call(val, key);
const isArray$1 = Array.isArray;
const isMap = (val) => toTypeString(val) === "[object Map]";
const isSet = (val) => toTypeString(val) === "[object Set]";
const isFunction = (val) => typeof val === "function";
const isString = (val) => typeof val === "string";
const isSymbol = (val) => typeof val === "symbol";
const isObject$1 = (val) => val !== null && typeof val === "object";
const isPromise = (val) => {
  return (isObject$1(val) || isFunction(val)) && isFunction(val.then) && isFunction(val.catch);
};
const objectToString$2 = Object.prototype.toString;
const toTypeString = (value2) => objectToString$2.call(value2);
const toRawType = (value2) => {
  return toTypeString(value2).slice(8, -1);
};
const isPlainObject$2 = (val) => toTypeString(val) === "[object Object]";
const isIntegerKey = (key) => isString(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
const isReservedProp = /* @__PURE__ */ makeMap(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
);
const isBuiltInDirective = /* @__PURE__ */ makeMap(
  "bind,cloak,else-if,else,for,html,if,model,on,once,pre,show,slot,text,memo"
);
const cacheStringFunction = (fn) => {
  const cache = /* @__PURE__ */ Object.create(null);
  return (str) => {
    const hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
};
const camelizeRE = /-(\w)/g;
const camelize = cacheStringFunction((str) => {
  return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : "");
});
const hyphenateRE = /\B([A-Z])/g;
const hyphenate = cacheStringFunction(
  (str) => str.replace(hyphenateRE, "-$1").toLowerCase()
);
const capitalize = cacheStringFunction((str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
});
const toHandlerKey = cacheStringFunction((str) => {
  const s2 = str ? `on${capitalize(str)}` : ``;
  return s2;
});
const hasChanged = (value2, oldValue) => !Object.is(value2, oldValue);
const invokeArrayFns$1 = (fns, arg) => {
  for (let i = 0; i < fns.length; i++) {
    fns[i](arg);
  }
};
const def = (obj, key, value2) => {
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: false,
    value: value2
  });
};
const looseToNumber = (val) => {
  const n2 = parseFloat(val);
  return isNaN(n2) ? val : n2;
};
const toNumber$2 = (val) => {
  const n2 = isString(val) ? Number(val) : NaN;
  return isNaN(n2) ? val : n2;
};
function normalizeStyle(value2) {
  if (isArray$1(value2)) {
    const res = {};
    for (let i = 0; i < value2.length; i++) {
      const item = value2[i];
      const normalized = isString(item) ? parseStringStyle(item) : normalizeStyle(item);
      if (normalized) {
        for (const key in normalized) {
          res[key] = normalized[key];
        }
      }
    }
    return res;
  } else if (isString(value2) || isObject$1(value2)) {
    return value2;
  }
}
const listDelimiterRE = /;(?![^(]*\))/g;
const propertyDelimiterRE = /:([^]+)/;
const styleCommentRE = /\/\*[^]*?\*\//g;
function parseStringStyle(cssText) {
  const ret = {};
  cssText.replace(styleCommentRE, "").split(listDelimiterRE).forEach((item) => {
    if (item) {
      const tmp = item.split(propertyDelimiterRE);
      tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return ret;
}
function normalizeClass(value2) {
  let res = "";
  if (isString(value2)) {
    res = value2;
  } else if (isArray$1(value2)) {
    for (let i = 0; i < value2.length; i++) {
      const normalized = normalizeClass(value2[i]);
      if (normalized) {
        res += normalized + " ";
      }
    }
  } else if (isObject$1(value2)) {
    for (const name in value2) {
      if (value2[name]) {
        res += name + " ";
      }
    }
  }
  return res.trim();
}
const toDisplayString = (val) => {
  return isString(val) ? val : val == null ? "" : isArray$1(val) || isObject$1(val) && (val.toString === objectToString$2 || !isFunction(val.toString)) ? JSON.stringify(val, replacer, 2) : String(val);
};
const replacer = (_key, val) => {
  if (val && val.__v_isRef) {
    return replacer(_key, val.value);
  } else if (isMap(val)) {
    return {
      [`Map(${val.size})`]: [...val.entries()].reduce(
        (entries, [key, val2], i) => {
          entries[stringifySymbol(key, i) + " =>"] = val2;
          return entries;
        },
        {}
      )
    };
  } else if (isSet(val)) {
    return {
      [`Set(${val.size})`]: [...val.values()].map((v) => stringifySymbol(v))
    };
  } else if (isSymbol(val)) {
    return stringifySymbol(val);
  } else if (isObject$1(val) && !isArray$1(val) && !isPlainObject$2(val)) {
    return String(val);
  }
  return val;
};
const stringifySymbol = (v, i = "") => {
  var _a2;
  return isSymbol(v) ? `Symbol(${(_a2 = v.description) != null ? _a2 : i})` : v;
};
const SLOT_DEFAULT_NAME = "d";
const ON_SHOW = "onShow";
const ON_HIDE = "onHide";
const ON_LAUNCH = "onLaunch";
const ON_ERROR = "onError";
const ON_THEME_CHANGE = "onThemeChange";
const ON_PAGE_NOT_FOUND = "onPageNotFound";
const ON_UNHANDLE_REJECTION = "onUnhandledRejection";
const ON_EXIT = "onExit";
const ON_LOAD = "onLoad";
const ON_READY = "onReady";
const ON_UNLOAD = "onUnload";
const ON_INIT = "onInit";
const ON_SAVE_EXIT_STATE = "onSaveExitState";
const ON_RESIZE = "onResize";
const ON_BACK_PRESS = "onBackPress";
const ON_PAGE_SCROLL = "onPageScroll";
const ON_TAB_ITEM_TAP = "onTabItemTap";
const ON_REACH_BOTTOM = "onReachBottom";
const ON_PULL_DOWN_REFRESH = "onPullDownRefresh";
const ON_SHARE_TIMELINE = "onShareTimeline";
const ON_SHARE_CHAT = "onShareChat";
const ON_ADD_TO_FAVORITES = "onAddToFavorites";
const ON_SHARE_APP_MESSAGE = "onShareAppMessage";
const ON_NAVIGATION_BAR_BUTTON_TAP = "onNavigationBarButtonTap";
const ON_NAVIGATION_BAR_SEARCH_INPUT_CLICKED = "onNavigationBarSearchInputClicked";
const ON_NAVIGATION_BAR_SEARCH_INPUT_CHANGED = "onNavigationBarSearchInputChanged";
const ON_NAVIGATION_BAR_SEARCH_INPUT_CONFIRMED = "onNavigationBarSearchInputConfirmed";
const ON_NAVIGATION_BAR_SEARCH_INPUT_FOCUS_CHANGED = "onNavigationBarSearchInputFocusChanged";
const VIRTUAL_HOST_STYLE = "virtualHostStyle";
const VIRTUAL_HOST_CLASS = "virtualHostClass";
const VIRTUAL_HOST_HIDDEN = "virtualHostHidden";
const VIRTUAL_HOST_ID = "virtualHostId";
function hasLeadingSlash(str) {
  return str.indexOf("/") === 0;
}
function addLeadingSlash(str) {
  return hasLeadingSlash(str) ? str : "/" + str;
}
const invokeArrayFns = (fns, arg) => {
  let ret;
  for (let i = 0; i < fns.length; i++) {
    ret = fns[i](arg);
  }
  return ret;
};
function once(fn, ctx = null) {
  let res;
  return (...args) => {
    if (fn) {
      res = fn.apply(ctx, args);
      fn = null;
    }
    return res;
  };
}
function getValueByDataPath(obj, path) {
  if (!isString(path)) {
    return;
  }
  path = path.replace(/\[(\d+)\]/g, ".$1");
  const parts = path.split(".");
  let key = parts[0];
  if (!obj) {
    obj = {};
  }
  if (parts.length === 1) {
    return obj[key];
  }
  return getValueByDataPath(obj[key], parts.slice(1).join("."));
}
function sortObject(obj) {
  let sortObj = {};
  if (isPlainObject$2(obj)) {
    Object.keys(obj).sort().forEach((key) => {
      const _key = key;
      sortObj[_key] = obj[_key];
    });
  }
  return !Object.keys(sortObj) ? obj : sortObj;
}
const customizeRE = /:/g;
function customizeEvent(str) {
  return camelize(str.replace(customizeRE, "-"));
}
const encode$1 = encodeURIComponent;
function stringifyQuery(obj, encodeStr = encode$1) {
  const res = obj ? Object.keys(obj).map((key) => {
    let val = obj[key];
    if (typeof val === void 0 || val === null) {
      val = "";
    } else if (isPlainObject$2(val)) {
      val = JSON.stringify(val);
    }
    return encodeStr(key) + "=" + encodeStr(val);
  }).filter((x) => x.length > 0).join("&") : null;
  return res ? `?${res}` : "";
}
const PAGE_HOOKS = [
  ON_INIT,
  ON_LOAD,
  ON_SHOW,
  ON_HIDE,
  ON_UNLOAD,
  ON_BACK_PRESS,
  ON_PAGE_SCROLL,
  ON_TAB_ITEM_TAP,
  ON_REACH_BOTTOM,
  ON_PULL_DOWN_REFRESH,
  ON_SHARE_TIMELINE,
  ON_SHARE_APP_MESSAGE,
  ON_SHARE_CHAT,
  ON_ADD_TO_FAVORITES,
  ON_SAVE_EXIT_STATE,
  ON_NAVIGATION_BAR_BUTTON_TAP,
  ON_NAVIGATION_BAR_SEARCH_INPUT_CLICKED,
  ON_NAVIGATION_BAR_SEARCH_INPUT_CHANGED,
  ON_NAVIGATION_BAR_SEARCH_INPUT_CONFIRMED,
  ON_NAVIGATION_BAR_SEARCH_INPUT_FOCUS_CHANGED
];
function isRootHook(name) {
  return PAGE_HOOKS.indexOf(name) > -1;
}
const UniLifecycleHooks = [
  ON_SHOW,
  ON_HIDE,
  ON_LAUNCH,
  ON_ERROR,
  ON_THEME_CHANGE,
  ON_PAGE_NOT_FOUND,
  ON_UNHANDLE_REJECTION,
  ON_EXIT,
  ON_INIT,
  ON_LOAD,
  ON_READY,
  ON_UNLOAD,
  ON_RESIZE,
  ON_BACK_PRESS,
  ON_PAGE_SCROLL,
  ON_TAB_ITEM_TAP,
  ON_REACH_BOTTOM,
  ON_PULL_DOWN_REFRESH,
  ON_SHARE_TIMELINE,
  ON_ADD_TO_FAVORITES,
  ON_SHARE_APP_MESSAGE,
  ON_SHARE_CHAT,
  ON_SAVE_EXIT_STATE,
  ON_NAVIGATION_BAR_BUTTON_TAP,
  ON_NAVIGATION_BAR_SEARCH_INPUT_CLICKED,
  ON_NAVIGATION_BAR_SEARCH_INPUT_CHANGED,
  ON_NAVIGATION_BAR_SEARCH_INPUT_CONFIRMED,
  ON_NAVIGATION_BAR_SEARCH_INPUT_FOCUS_CHANGED
];
const MINI_PROGRAM_PAGE_RUNTIME_HOOKS = /* @__PURE__ */ (() => {
  return {
    onPageScroll: 1,
    onShareAppMessage: 1 << 1,
    onShareTimeline: 1 << 2
  };
})();
function isUniLifecycleHook(name, value2, checkType = true) {
  if (checkType && !isFunction(value2)) {
    return false;
  }
  if (UniLifecycleHooks.indexOf(name) > -1) {
    return true;
  } else if (name.indexOf("on") === 0) {
    return true;
  }
  return false;
}
let vueApp;
const createVueAppHooks = [];
function onCreateVueApp(hook) {
  if (vueApp) {
    return hook(vueApp);
  }
  createVueAppHooks.push(hook);
}
function invokeCreateVueAppHook(app) {
  vueApp = app;
  createVueAppHooks.forEach((hook) => hook(app));
}
const invokeCreateErrorHandler = once((app, createErrorHandler2) => {
  return createErrorHandler2(app);
});
const E = function() {
};
E.prototype = {
  _id: 1,
  on: function(name, callback, ctx) {
    var e2 = this.e || (this.e = {});
    (e2[name] || (e2[name] = [])).push({
      fn: callback,
      ctx,
      _id: this._id
    });
    return this._id++;
  },
  once: function(name, callback, ctx) {
    var self2 = this;
    function listener() {
      self2.off(name, listener);
      callback.apply(ctx, arguments);
    }
    listener._ = callback;
    return this.on(name, listener, ctx);
  },
  emit: function(name) {
    var data = [].slice.call(arguments, 1);
    var evtArr = ((this.e || (this.e = {}))[name] || []).slice();
    var i = 0;
    var len = evtArr.length;
    for (i; i < len; i++) {
      evtArr[i].fn.apply(evtArr[i].ctx, data);
    }
    return this;
  },
  off: function(name, event) {
    var e2 = this.e || (this.e = {});
    var evts = e2[name];
    var liveEvents = [];
    if (evts && event) {
      for (var i = evts.length - 1; i >= 0; i--) {
        if (evts[i].fn === event || evts[i].fn._ === event || evts[i]._id === event) {
          evts.splice(i, 1);
          break;
        }
      }
      liveEvents = evts;
    }
    liveEvents.length ? e2[name] = liveEvents : delete e2[name];
    return this;
  }
};
var E$1 = E;
const LOCALE_ZH_HANS = "zh-Hans";
const LOCALE_ZH_HANT = "zh-Hant";
const LOCALE_EN = "en";
const LOCALE_FR = "fr";
const LOCALE_ES = "es";
function include(str, parts) {
  return !!parts.find((part) => str.indexOf(part) !== -1);
}
function startsWith(str, parts) {
  return parts.find((part) => str.indexOf(part) === 0);
}
function normalizeLocale(locale, messages2) {
  if (!locale) {
    return;
  }
  locale = locale.trim().replace(/_/g, "-");
  locale = locale.toLowerCase();
  if (locale === "chinese") {
    return LOCALE_ZH_HANS;
  }
  if (locale.indexOf("zh") === 0) {
    if (locale.indexOf("-hans") > -1) {
      return LOCALE_ZH_HANS;
    }
    if (locale.indexOf("-hant") > -1) {
      return LOCALE_ZH_HANT;
    }
    if (include(locale, ["-tw", "-hk", "-mo", "-cht"])) {
      return LOCALE_ZH_HANT;
    }
    return LOCALE_ZH_HANS;
  }
  let locales = [LOCALE_EN, LOCALE_FR, LOCALE_ES];
  const lang = startsWith(locale, locales);
  if (lang) {
    return lang;
  }
}
function getLocaleLanguage$1() {
  var _a2;
  let localeLanguage = "";
  {
    const appBaseInfo = ((_a2 = wx.getAppBaseInfo) === null || _a2 === void 0 ? void 0 : _a2.call(wx)) || wx.getSystemInfoSync();
    const language = appBaseInfo && appBaseInfo.language ? appBaseInfo.language : LOCALE_EN;
    localeLanguage = normalizeLocale(language) || LOCALE_EN;
  }
  return localeLanguage;
}
function validateProtocolFail(name, msg) {
  console.warn(`${name}: ${msg}`);
}
function validateProtocol(name, data, protocol, onFail) {
  if (!onFail) {
    onFail = validateProtocolFail;
  }
  for (const key in protocol) {
    const errMsg = validateProp$1(key, data[key], protocol[key], !hasOwn(data, key));
    if (isString(errMsg)) {
      onFail(name, errMsg);
    }
  }
}
function validateProtocols(name, args, protocol, onFail) {
  if (!protocol) {
    return;
  }
  if (!isArray$1(protocol)) {
    return validateProtocol(name, args[0] || /* @__PURE__ */ Object.create(null), protocol, onFail);
  }
  const len = protocol.length;
  const argsLen = args.length;
  for (let i = 0; i < len; i++) {
    const opts = protocol[i];
    const data = /* @__PURE__ */ Object.create(null);
    if (argsLen > i) {
      data[opts.name] = args[i];
    }
    validateProtocol(name, data, { [opts.name]: opts }, onFail);
  }
}
function validateProp$1(name, value2, prop, isAbsent) {
  if (!isPlainObject$2(prop)) {
    prop = { type: prop };
  }
  const { type: type2, required: required2, validator } = prop;
  if (required2 && isAbsent) {
    return 'Missing required args: "' + name + '"';
  }
  if (value2 == null && !required2) {
    return;
  }
  if (type2 != null) {
    let isValid = false;
    const types2 = isArray$1(type2) ? type2 : [type2];
    const expectedTypes = [];
    for (let i = 0; i < types2.length && !isValid; i++) {
      const { valid, expectedType } = assertType$1(value2, types2[i]);
      expectedTypes.push(expectedType || "");
      isValid = valid;
    }
    if (!isValid) {
      return getInvalidTypeMessage$1(name, value2, expectedTypes);
    }
  }
  if (validator) {
    return validator(value2);
  }
}
const isSimpleType$1 = /* @__PURE__ */ makeMap("String,Number,Boolean,Function,Symbol");
function assertType$1(value2, type2) {
  let valid;
  const expectedType = getType$1(type2);
  if (isSimpleType$1(expectedType)) {
    const t2 = typeof value2;
    valid = t2 === expectedType.toLowerCase();
    if (!valid && t2 === "object") {
      valid = value2 instanceof type2;
    }
  } else if (expectedType === "Object") {
    valid = isObject$1(value2);
  } else if (expectedType === "Array") {
    valid = isArray$1(value2);
  } else {
    {
      valid = value2 instanceof type2;
    }
  }
  return {
    valid,
    expectedType
  };
}
function getInvalidTypeMessage$1(name, value2, expectedTypes) {
  let message = `Invalid args: type check failed for args "${name}". Expected ${expectedTypes.map(capitalize).join(", ")}`;
  const expectedType = expectedTypes[0];
  const receivedType = toRawType(value2);
  const expectedValue = styleValue$1(value2, expectedType);
  const receivedValue = styleValue$1(value2, receivedType);
  if (expectedTypes.length === 1 && isExplicable$1(expectedType) && !isBoolean$3(expectedType, receivedType)) {
    message += ` with value ${expectedValue}`;
  }
  message += `, got ${receivedType} `;
  if (isExplicable$1(receivedType)) {
    message += `with value ${receivedValue}.`;
  }
  return message;
}
function getType$1(ctor) {
  const match = ctor && ctor.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : "";
}
function styleValue$1(value2, type2) {
  if (type2 === "String") {
    return `"${value2}"`;
  } else if (type2 === "Number") {
    return `${Number(value2)}`;
  } else {
    return `${value2}`;
  }
}
function isExplicable$1(type2) {
  const explicitTypes = ["string", "number", "boolean"];
  return explicitTypes.some((elem) => type2.toLowerCase() === elem);
}
function isBoolean$3(...args) {
  return args.some((elem) => elem.toLowerCase() === "boolean");
}
function tryCatch(fn) {
  return function() {
    try {
      return fn.apply(fn, arguments);
    } catch (e2) {
      console.error(e2);
    }
  };
}
let invokeCallbackId = 1;
const invokeCallbacks = {};
function addInvokeCallback(id, name, callback, keepAlive = false) {
  invokeCallbacks[id] = {
    name,
    keepAlive,
    callback
  };
  return id;
}
function invokeCallback(id, res, extras) {
  if (typeof id === "number") {
    const opts = invokeCallbacks[id];
    if (opts) {
      if (!opts.keepAlive) {
        delete invokeCallbacks[id];
      }
      return opts.callback(res, extras);
    }
  }
  return res;
}
const API_SUCCESS = "success";
const API_FAIL = "fail";
const API_COMPLETE = "complete";
function getApiCallbacks(args) {
  const apiCallbacks = {};
  for (const name in args) {
    const fn = args[name];
    if (isFunction(fn)) {
      apiCallbacks[name] = tryCatch(fn);
      delete args[name];
    }
  }
  return apiCallbacks;
}
function normalizeErrMsg(errMsg, name) {
  if (!errMsg || errMsg.indexOf(":fail") === -1) {
    return name + ":ok";
  }
  return name + errMsg.substring(errMsg.indexOf(":fail"));
}
function createAsyncApiCallback(name, args = {}, { beforeAll, beforeSuccess } = {}) {
  if (!isPlainObject$2(args)) {
    args = {};
  }
  const { success, fail, complete } = getApiCallbacks(args);
  const hasSuccess = isFunction(success);
  const hasFail = isFunction(fail);
  const hasComplete = isFunction(complete);
  const callbackId = invokeCallbackId++;
  addInvokeCallback(callbackId, name, (res) => {
    res = res || {};
    res.errMsg = normalizeErrMsg(res.errMsg, name);
    isFunction(beforeAll) && beforeAll(res);
    if (res.errMsg === name + ":ok") {
      isFunction(beforeSuccess) && beforeSuccess(res, args);
      hasSuccess && success(res);
    } else {
      hasFail && fail(res);
    }
    hasComplete && complete(res);
  });
  return callbackId;
}
const HOOK_SUCCESS = "success";
const HOOK_FAIL = "fail";
const HOOK_COMPLETE = "complete";
const globalInterceptors = {};
const scopedInterceptors = {};
function wrapperHook(hook, params) {
  return function(data) {
    return hook(data, params) || data;
  };
}
function queue$1(hooks, data, params) {
  let promise2 = false;
  for (let i = 0; i < hooks.length; i++) {
    const hook = hooks[i];
    if (promise2) {
      promise2 = Promise.resolve(wrapperHook(hook, params));
    } else {
      const res = hook(data, params);
      if (isPromise(res)) {
        promise2 = Promise.resolve(res);
      }
      if (res === false) {
        return {
          then() {
          },
          catch() {
          }
        };
      }
    }
  }
  return promise2 || {
    then(callback) {
      return callback(data);
    },
    catch() {
    }
  };
}
function wrapperOptions(interceptors2, options = {}) {
  [HOOK_SUCCESS, HOOK_FAIL, HOOK_COMPLETE].forEach((name) => {
    const hooks = interceptors2[name];
    if (!isArray$1(hooks)) {
      return;
    }
    const oldCallback = options[name];
    options[name] = function callbackInterceptor(res) {
      queue$1(hooks, res, options).then((res2) => {
        return isFunction(oldCallback) && oldCallback(res2) || res2;
      });
    };
  });
  return options;
}
function wrapperReturnValue(method2, returnValue) {
  const returnValueHooks = [];
  if (isArray$1(globalInterceptors.returnValue)) {
    returnValueHooks.push(...globalInterceptors.returnValue);
  }
  const interceptor = scopedInterceptors[method2];
  if (interceptor && isArray$1(interceptor.returnValue)) {
    returnValueHooks.push(...interceptor.returnValue);
  }
  returnValueHooks.forEach((hook) => {
    returnValue = hook(returnValue) || returnValue;
  });
  return returnValue;
}
function getApiInterceptorHooks(method2) {
  const interceptor = /* @__PURE__ */ Object.create(null);
  Object.keys(globalInterceptors).forEach((hook) => {
    if (hook !== "returnValue") {
      interceptor[hook] = globalInterceptors[hook].slice();
    }
  });
  const scopedInterceptor = scopedInterceptors[method2];
  if (scopedInterceptor) {
    Object.keys(scopedInterceptor).forEach((hook) => {
      if (hook !== "returnValue") {
        interceptor[hook] = (interceptor[hook] || []).concat(scopedInterceptor[hook]);
      }
    });
  }
  return interceptor;
}
function invokeApi(method2, api, options, params) {
  const interceptor = getApiInterceptorHooks(method2);
  if (interceptor && Object.keys(interceptor).length) {
    if (isArray$1(interceptor.invoke)) {
      const res = queue$1(interceptor.invoke, options);
      return res.then((options2) => {
        return api(wrapperOptions(getApiInterceptorHooks(method2), options2), ...params);
      });
    } else {
      return api(wrapperOptions(interceptor, options), ...params);
    }
  }
  return api(options, ...params);
}
function hasCallback(args) {
  if (isPlainObject$2(args) && [API_SUCCESS, API_FAIL, API_COMPLETE].find((cb) => isFunction(args[cb]))) {
    return true;
  }
  return false;
}
function handlePromise(promise2) {
  return promise2;
}
function promisify$1(name, fn) {
  return (args = {}, ...rest) => {
    if (hasCallback(args)) {
      return wrapperReturnValue(name, invokeApi(name, fn, args, rest));
    }
    return wrapperReturnValue(name, handlePromise(new Promise((resolve2, reject) => {
      invokeApi(name, fn, extend(args, { success: resolve2, fail: reject }), rest);
    })));
  };
}
function formatApiArgs(args, options) {
  args[0];
  {
    return;
  }
}
function invokeSuccess(id, name, res) {
  const result = {
    errMsg: name + ":ok"
  };
  return invokeCallback(id, extend(res || {}, result));
}
function invokeFail(id, name, errMsg, errRes = {}) {
  const errMsgPrefix = name + ":fail";
  let apiErrMsg = "";
  if (!errMsg) {
    apiErrMsg = errMsgPrefix;
  } else if (errMsg.indexOf(errMsgPrefix) === 0) {
    apiErrMsg = errMsg;
  } else {
    apiErrMsg = errMsgPrefix + " " + errMsg;
  }
  {
    delete errRes.errCode;
  }
  let res = extend({ errMsg: apiErrMsg }, errRes);
  return invokeCallback(id, res);
}
function beforeInvokeApi(name, args, protocol, options) {
  {
    validateProtocols(name, args, protocol);
  }
  const errMsg = formatApiArgs(args);
  if (errMsg) {
    return errMsg;
  }
}
function parseErrMsg(errMsg) {
  if (!errMsg || isString(errMsg)) {
    return errMsg;
  }
  if (errMsg.stack) {
    if (typeof globalThis === "undefined" || !globalThis.harmonyChannel) {
      console.error(errMsg.message + "\n" + errMsg.stack);
    }
    return errMsg.message;
  }
  return errMsg;
}
function wrapperTaskApi(name, fn, protocol, options) {
  return (args) => {
    const id = createAsyncApiCallback(name, args, options);
    const errMsg = beforeInvokeApi(name, [args], protocol);
    if (errMsg) {
      return invokeFail(id, name, errMsg);
    }
    return fn(args, {
      resolve: (res) => invokeSuccess(id, name, res),
      reject: (errMsg2, errRes) => invokeFail(id, name, parseErrMsg(errMsg2), errRes)
    });
  };
}
function wrapperSyncApi(name, fn, protocol, options) {
  return (...args) => {
    const errMsg = beforeInvokeApi(name, args, protocol);
    if (errMsg) {
      throw new Error(errMsg);
    }
    return fn.apply(null, args);
  };
}
function wrapperAsyncApi(name, fn, protocol, options) {
  return wrapperTaskApi(name, fn, protocol, options);
}
function defineSyncApi(name, fn, protocol, options) {
  return wrapperSyncApi(name, fn, protocol);
}
function defineAsyncApi(name, fn, protocol, options) {
  return promisify$1(name, wrapperAsyncApi(name, fn, protocol, options));
}
const API_UPX2PX = "upx2px";
const Upx2pxProtocol = [
  {
    name: "upx",
    type: [Number, String],
    required: true
  }
];
const EPS = 1e-4;
const BASE_DEVICE_WIDTH = 750;
let isIOS = false;
let deviceWidth = 0;
let deviceDPR = 0;
function checkDeviceWidth() {
  var _a2, _b;
  let windowWidth, pixelRatio, platform2;
  {
    const windowInfo = ((_a2 = wx.getWindowInfo) === null || _a2 === void 0 ? void 0 : _a2.call(wx)) || wx.getSystemInfoSync();
    const deviceInfo = ((_b = wx.getDeviceInfo) === null || _b === void 0 ? void 0 : _b.call(wx)) || wx.getSystemInfoSync();
    windowWidth = windowInfo.windowWidth;
    pixelRatio = windowInfo.pixelRatio;
    platform2 = deviceInfo.platform;
  }
  deviceWidth = windowWidth;
  deviceDPR = pixelRatio;
  isIOS = platform2 === "ios";
}
const upx2px = defineSyncApi(API_UPX2PX, (number2, newDeviceWidth) => {
  if (deviceWidth === 0) {
    checkDeviceWidth();
  }
  number2 = Number(number2);
  if (number2 === 0) {
    return 0;
  }
  let width = newDeviceWidth || deviceWidth;
  let result = number2 / BASE_DEVICE_WIDTH * width;
  if (result < 0) {
    result = -result;
  }
  result = Math.floor(result + EPS);
  if (result === 0) {
    if (deviceDPR === 1 || !isIOS) {
      result = 1;
    } else {
      result = 0.5;
    }
  }
  return number2 < 0 ? -result : result;
}, Upx2pxProtocol);
function __f__(type2, filename, ...args) {
  if (filename) {
    args.push(filename);
  }
  console[type2].apply(console, args);
}
const API_ADD_INTERCEPTOR = "addInterceptor";
const API_REMOVE_INTERCEPTOR = "removeInterceptor";
const AddInterceptorProtocol = [
  {
    name: "method",
    type: [String, Object],
    required: true
  }
];
const RemoveInterceptorProtocol = AddInterceptorProtocol;
function mergeInterceptorHook(interceptors2, interceptor) {
  Object.keys(interceptor).forEach((hook) => {
    if (isFunction(interceptor[hook])) {
      interceptors2[hook] = mergeHook(interceptors2[hook], interceptor[hook]);
    }
  });
}
function removeInterceptorHook(interceptors2, interceptor) {
  if (!interceptors2 || !interceptor) {
    return;
  }
  Object.keys(interceptor).forEach((name) => {
    const hooks = interceptors2[name];
    const hook = interceptor[name];
    if (isArray$1(hooks) && isFunction(hook)) {
      remove(hooks, hook);
    }
  });
}
function mergeHook(parentVal, childVal) {
  const res = childVal ? parentVal ? parentVal.concat(childVal) : isArray$1(childVal) ? childVal : [childVal] : parentVal;
  return res ? dedupeHooks(res) : res;
}
function dedupeHooks(hooks) {
  const res = [];
  for (let i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i]);
    }
  }
  return res;
}
const addInterceptor = defineSyncApi(API_ADD_INTERCEPTOR, (method2, interceptor) => {
  if (isString(method2) && isPlainObject$2(interceptor)) {
    mergeInterceptorHook(scopedInterceptors[method2] || (scopedInterceptors[method2] = {}), interceptor);
  } else if (isPlainObject$2(method2)) {
    mergeInterceptorHook(globalInterceptors, method2);
  }
}, AddInterceptorProtocol);
const removeInterceptor = defineSyncApi(API_REMOVE_INTERCEPTOR, (method2, interceptor) => {
  if (isString(method2)) {
    if (isPlainObject$2(interceptor)) {
      removeInterceptorHook(scopedInterceptors[method2], interceptor);
    } else {
      delete scopedInterceptors[method2];
    }
  } else if (isPlainObject$2(method2)) {
    removeInterceptorHook(globalInterceptors, method2);
  }
}, RemoveInterceptorProtocol);
const interceptors = {};
const API_ON = "$on";
const OnProtocol = [
  {
    name: "event",
    type: String,
    required: true
  },
  {
    name: "callback",
    type: Function,
    required: true
  }
];
const API_ONCE = "$once";
const OnceProtocol = OnProtocol;
const API_OFF = "$off";
const OffProtocol = [
  {
    name: "event",
    type: [String, Array]
  },
  {
    name: "callback",
    type: [Function, Number]
  }
];
const API_EMIT = "$emit";
const EmitProtocol = [
  {
    name: "event",
    type: String,
    required: true
  }
];
class EventBus {
  constructor() {
    this.$emitter = new E$1();
  }
  on(name, callback) {
    return this.$emitter.on(name, callback);
  }
  once(name, callback) {
    return this.$emitter.once(name, callback);
  }
  off(name, callback) {
    if (!name) {
      this.$emitter.e = {};
      return;
    }
    this.$emitter.off(name, callback);
  }
  emit(name, ...args) {
    this.$emitter.emit(name, ...args);
  }
}
const eventBus = new EventBus();
const $on = defineSyncApi(API_ON, (name, callback) => {
  eventBus.on(name, callback);
  return () => eventBus.off(name, callback);
}, OnProtocol);
const $once = defineSyncApi(API_ONCE, (name, callback) => {
  eventBus.once(name, callback);
  return () => eventBus.off(name, callback);
}, OnceProtocol);
const $off = defineSyncApi(API_OFF, (name, callback) => {
  if (!isArray$1(name))
    name = name ? [name] : [];
  name.forEach((n2) => {
    eventBus.off(n2, callback);
  });
}, OffProtocol);
const $emit = defineSyncApi(API_EMIT, (name, ...args) => {
  eventBus.emit(name, ...args);
}, EmitProtocol);
let cid;
let cidErrMsg;
let enabled;
function normalizePushMessage(message) {
  try {
    return JSON.parse(message);
  } catch (e2) {
  }
  return message;
}
function invokePushCallback(args) {
  if (args.type === "enabled") {
    enabled = true;
  } else if (args.type === "clientId") {
    cid = args.cid;
    cidErrMsg = args.errMsg;
    invokeGetPushCidCallbacks(cid, args.errMsg);
  } else if (args.type === "pushMsg") {
    const message = {
      type: "receive",
      data: normalizePushMessage(args.message)
    };
    for (let i = 0; i < onPushMessageCallbacks.length; i++) {
      const callback = onPushMessageCallbacks[i];
      callback(message);
      if (message.stopped) {
        break;
      }
    }
  } else if (args.type === "click") {
    onPushMessageCallbacks.forEach((callback) => {
      callback({
        type: "click",
        data: normalizePushMessage(args.message)
      });
    });
  }
}
const getPushCidCallbacks = [];
function invokeGetPushCidCallbacks(cid2, errMsg) {
  getPushCidCallbacks.forEach((callback) => {
    callback(cid2, errMsg);
  });
  getPushCidCallbacks.length = 0;
}
const API_GET_PUSH_CLIENT_ID = "getPushClientId";
const getPushClientId = defineAsyncApi(API_GET_PUSH_CLIENT_ID, (_, { resolve: resolve2, reject }) => {
  Promise.resolve().then(() => {
    if (typeof enabled === "undefined") {
      enabled = false;
      cid = "";
      cidErrMsg = "uniPush is not enabled";
    }
    getPushCidCallbacks.push((cid2, errMsg) => {
      if (cid2) {
        resolve2({ cid: cid2 });
      } else {
        reject(errMsg);
      }
    });
    if (typeof cid !== "undefined") {
      invokeGetPushCidCallbacks(cid, cidErrMsg);
    }
  });
});
const onPushMessageCallbacks = [];
const onPushMessage = (fn) => {
  if (onPushMessageCallbacks.indexOf(fn) === -1) {
    onPushMessageCallbacks.push(fn);
  }
};
const offPushMessage = (fn) => {
  if (!fn) {
    onPushMessageCallbacks.length = 0;
  } else {
    const index2 = onPushMessageCallbacks.indexOf(fn);
    if (index2 > -1) {
      onPushMessageCallbacks.splice(index2, 1);
    }
  }
};
const SYNC_API_RE = /^\$|__f__|getLocale|setLocale|sendNativeEvent|restoreGlobal|requireGlobal|getCurrentSubNVue|getMenuButtonBoundingClientRect|^report|interceptors|Interceptor$|getSubNVueById|requireNativePlugin|upx2px|rpx2px|hideKeyboard|canIUse|^create|Sync$|Manager$|base64ToArrayBuffer|arrayBufferToBase64|getDeviceInfo|getAppBaseInfo|getWindowInfo|getSystemSetting|getAppAuthorizeSetting/;
const CONTEXT_API_RE = /^create|Manager$/;
const CONTEXT_API_RE_EXC = ["createBLEConnection"];
const TASK_APIS = ["request", "downloadFile", "uploadFile", "connectSocket"];
const ASYNC_API = ["createBLEConnection"];
const CALLBACK_API_RE = /^on|^off/;
function isContextApi(name) {
  return CONTEXT_API_RE.test(name) && CONTEXT_API_RE_EXC.indexOf(name) === -1;
}
function isSyncApi(name) {
  return SYNC_API_RE.test(name) && ASYNC_API.indexOf(name) === -1;
}
function isCallbackApi(name) {
  return CALLBACK_API_RE.test(name) && name !== "onPush";
}
function isTaskApi(name) {
  return TASK_APIS.indexOf(name) !== -1;
}
function shouldPromise(name) {
  if (isContextApi(name) || isSyncApi(name) || isCallbackApi(name)) {
    return false;
  }
  return true;
}
if (!Promise.prototype.finally) {
  Promise.prototype.finally = function(onfinally) {
    const promise2 = this.constructor;
    return this.then((value2) => promise2.resolve(onfinally && onfinally()).then(() => value2), (reason) => promise2.resolve(onfinally && onfinally()).then(() => {
      throw reason;
    }));
  };
}
function promisify(name, api) {
  if (!shouldPromise(name)) {
    return api;
  }
  if (!isFunction(api)) {
    return api;
  }
  return function promiseApi(options = {}, ...rest) {
    if (isFunction(options.success) || isFunction(options.fail) || isFunction(options.complete)) {
      return wrapperReturnValue(name, invokeApi(name, api, options, rest));
    }
    return wrapperReturnValue(name, handlePromise(new Promise((resolve2, reject) => {
      invokeApi(name, api, extend({}, options, {
        success: resolve2,
        fail: reject
      }), rest);
    })));
  };
}
const CALLBACKS = ["success", "fail", "cancel", "complete"];
function initWrapper(protocols2) {
  function processCallback(methodName, method2, returnValue) {
    return function(res) {
      return method2(processReturnValue(methodName, res, returnValue));
    };
  }
  function processArgs(methodName, fromArgs, argsOption = {}, returnValue = {}, keepFromArgs = false) {
    if (isPlainObject$2(fromArgs)) {
      const toArgs = keepFromArgs === true ? fromArgs : {};
      if (isFunction(argsOption)) {
        argsOption = argsOption(fromArgs, toArgs) || {};
      }
      for (const key in fromArgs) {
        if (hasOwn(argsOption, key)) {
          let keyOption = argsOption[key];
          if (isFunction(keyOption)) {
            keyOption = keyOption(fromArgs[key], fromArgs, toArgs);
          }
          if (!keyOption) {
            console.warn(`微信小程序 ${methodName} 暂不支持 ${key}`);
          } else if (isString(keyOption)) {
            toArgs[keyOption] = fromArgs[key];
          } else if (isPlainObject$2(keyOption)) {
            toArgs[keyOption.name ? keyOption.name : key] = keyOption.value;
          }
        } else if (CALLBACKS.indexOf(key) !== -1) {
          const callback = fromArgs[key];
          if (isFunction(callback)) {
            toArgs[key] = processCallback(methodName, callback, returnValue);
          }
        } else {
          if (!keepFromArgs && !hasOwn(toArgs, key)) {
            toArgs[key] = fromArgs[key];
          }
        }
      }
      return toArgs;
    } else if (isFunction(fromArgs)) {
      if (isFunction(argsOption)) {
        argsOption(fromArgs, {});
      }
      fromArgs = processCallback(methodName, fromArgs, returnValue);
    }
    return fromArgs;
  }
  function processReturnValue(methodName, res, returnValue, keepReturnValue = false) {
    if (isFunction(protocols2.returnValue)) {
      res = protocols2.returnValue(methodName, res);
    }
    const realKeepReturnValue = keepReturnValue || false;
    return processArgs(methodName, res, returnValue, {}, realKeepReturnValue);
  }
  return function wrapper(methodName, method2) {
    const hasProtocol = hasOwn(protocols2, methodName);
    if (!hasProtocol && typeof wx[methodName] !== "function") {
      return method2;
    }
    const needWrapper = hasProtocol || isFunction(protocols2.returnValue) || isContextApi(methodName) || isTaskApi(methodName);
    const hasMethod = hasProtocol || isFunction(method2);
    if (!hasProtocol && !method2) {
      return function() {
        console.error(`微信小程序 暂不支持${methodName}`);
      };
    }
    if (!needWrapper || !hasMethod) {
      return method2;
    }
    const protocol = protocols2[methodName];
    return function(arg1, arg2) {
      let options = protocol || {};
      if (isFunction(protocol)) {
        options = protocol(arg1);
      }
      arg1 = processArgs(methodName, arg1, options.args, options.returnValue);
      const args = [arg1];
      if (typeof arg2 !== "undefined") {
        args.push(arg2);
      }
      const returnValue = wx[options.name || methodName].apply(wx, args);
      if (isContextApi(methodName) || isTaskApi(methodName)) {
        if (returnValue && !returnValue.__v_skip) {
          returnValue.__v_skip = true;
        }
      }
      if (isSyncApi(methodName)) {
        return processReturnValue(methodName, returnValue, options.returnValue, isContextApi(methodName));
      }
      return returnValue;
    };
  };
}
const getLocale = () => {
  const app = isFunction(getApp) && getApp({ allowDefault: true });
  if (app && app.$vm) {
    return app.$vm.$locale;
  }
  return getLocaleLanguage$1();
};
const setLocale = (locale) => {
  const app = isFunction(getApp) && getApp();
  if (!app) {
    return false;
  }
  const oldLocale = app.$vm.$locale;
  if (oldLocale !== locale) {
    app.$vm.$locale = locale;
    onLocaleChangeCallbacks.forEach((fn) => fn({ locale }));
    return true;
  }
  return false;
};
const onLocaleChangeCallbacks = [];
const onLocaleChange = (fn) => {
  if (onLocaleChangeCallbacks.indexOf(fn) === -1) {
    onLocaleChangeCallbacks.push(fn);
  }
};
if (typeof global !== "undefined") {
  global.getLocale = getLocale;
}
const UUID_KEY = "__DC_STAT_UUID";
let deviceId;
function useDeviceId(global2 = wx) {
  return function addDeviceId(_, toRes) {
    deviceId = deviceId || global2.getStorageSync(UUID_KEY);
    if (!deviceId) {
      deviceId = Date.now() + "" + Math.floor(Math.random() * 1e7);
      wx.setStorage({
        key: UUID_KEY,
        data: deviceId
      });
    }
    toRes.deviceId = deviceId;
  };
}
function addSafeAreaInsets(fromRes, toRes) {
  if (fromRes.safeArea) {
    const safeArea = fromRes.safeArea;
    toRes.safeAreaInsets = {
      top: safeArea.top,
      left: safeArea.left,
      right: fromRes.windowWidth - safeArea.right,
      bottom: fromRes.screenHeight - safeArea.bottom
    };
  }
}
function getOSInfo(system, platform2) {
  let osName = "";
  let osVersion = "";
  if (platform2 && false) {
    osName = platform2;
    osVersion = system;
  } else {
    osName = system.split(" ")[0] || platform2;
    osVersion = system.split(" ")[1] || "";
  }
  osName = osName.toLocaleLowerCase();
  switch (osName) {
    case "harmony":
    case "ohos":
    case "openharmony":
      osName = "harmonyos";
      break;
    case "iphone os":
      osName = "ios";
      break;
    case "mac":
    case "darwin":
      osName = "macos";
      break;
    case "windows_nt":
      osName = "windows";
      break;
  }
  return {
    osName,
    osVersion
  };
}
function populateParameters(fromRes, toRes) {
  const { brand = "", model = "", system = "", language = "", theme, version: version2, platform: platform2, fontSizeSetting, SDKVersion, pixelRatio, deviceOrientation } = fromRes;
  const { osName, osVersion } = getOSInfo(system, platform2);
  let hostVersion = version2;
  let deviceType = getGetDeviceType(fromRes, model);
  let deviceBrand = getDeviceBrand(brand);
  let _hostName = getHostName(fromRes);
  let _deviceOrientation = deviceOrientation;
  let _devicePixelRatio = pixelRatio;
  let _SDKVersion = SDKVersion;
  const hostLanguage = (language || "").replace(/_/g, "-");
  const parameters = {
    appId: "__UNI__F9C76ED",
    appName: "FuziAI",
    appVersion: "1.0.0",
    appVersionCode: "100",
    appLanguage: getAppLanguage(hostLanguage),
    uniCompileVersion: "4.66",
    uniCompilerVersion: "4.66",
    uniRuntimeVersion: "4.66",
    uniPlatform: "mp-weixin",
    deviceBrand,
    deviceModel: model,
    deviceType,
    devicePixelRatio: _devicePixelRatio,
    deviceOrientation: _deviceOrientation,
    osName,
    osVersion,
    hostTheme: theme,
    hostVersion,
    hostLanguage,
    hostName: _hostName,
    hostSDKVersion: _SDKVersion,
    hostFontSizeSetting: fontSizeSetting,
    windowTop: 0,
    windowBottom: 0,
    // TODO
    osLanguage: void 0,
    osTheme: void 0,
    ua: void 0,
    hostPackageName: void 0,
    browserName: void 0,
    browserVersion: void 0,
    isUniAppX: false
  };
  extend(toRes, parameters);
}
function getGetDeviceType(fromRes, model) {
  let deviceType = fromRes.deviceType || "phone";
  {
    const deviceTypeMaps = {
      ipad: "pad",
      windows: "pc",
      mac: "pc"
    };
    const deviceTypeMapsKeys = Object.keys(deviceTypeMaps);
    const _model = model.toLocaleLowerCase();
    for (let index2 = 0; index2 < deviceTypeMapsKeys.length; index2++) {
      const _m = deviceTypeMapsKeys[index2];
      if (_model.indexOf(_m) !== -1) {
        deviceType = deviceTypeMaps[_m];
        break;
      }
    }
  }
  return deviceType;
}
function getDeviceBrand(brand) {
  let deviceBrand = brand;
  if (deviceBrand) {
    deviceBrand = deviceBrand.toLocaleLowerCase();
  }
  return deviceBrand;
}
function getAppLanguage(defaultLanguage) {
  return getLocale ? getLocale() : defaultLanguage;
}
function getHostName(fromRes) {
  const _platform = "WeChat";
  let _hostName = fromRes.hostName || _platform;
  {
    if (fromRes.environment) {
      _hostName = fromRes.environment;
    } else if (fromRes.host && fromRes.host.env) {
      _hostName = fromRes.host.env;
    }
  }
  return _hostName;
}
const getSystemInfo = {
  returnValue: (fromRes, toRes) => {
    addSafeAreaInsets(fromRes, toRes);
    useDeviceId()(fromRes, toRes);
    populateParameters(fromRes, toRes);
  }
};
const getSystemInfoSync = getSystemInfo;
const redirectTo = {};
const previewImage = {
  args(fromArgs, toArgs) {
    let currentIndex = parseInt(fromArgs.current);
    if (isNaN(currentIndex)) {
      return;
    }
    const urls = fromArgs.urls;
    if (!isArray$1(urls)) {
      return;
    }
    const len = urls.length;
    if (!len) {
      return;
    }
    if (currentIndex < 0) {
      currentIndex = 0;
    } else if (currentIndex >= len) {
      currentIndex = len - 1;
    }
    if (currentIndex > 0) {
      toArgs.current = urls[currentIndex];
      toArgs.urls = urls.filter((item, index2) => index2 < currentIndex ? item !== urls[currentIndex] : true);
    } else {
      toArgs.current = urls[0];
    }
    return {
      indicator: false,
      loop: false
    };
  }
};
const showActionSheet = {
  args(fromArgs, toArgs) {
    toArgs.alertText = fromArgs.title;
  }
};
const getDeviceInfo = {
  returnValue: (fromRes, toRes) => {
    const { brand, model, system = "", platform: platform2 = "" } = fromRes;
    let deviceType = getGetDeviceType(fromRes, model);
    let deviceBrand = getDeviceBrand(brand);
    useDeviceId()(fromRes, toRes);
    const { osName, osVersion } = getOSInfo(system, platform2);
    toRes = sortObject(extend(toRes, {
      deviceType,
      deviceBrand,
      deviceModel: model,
      osName,
      osVersion
    }));
  }
};
const getAppBaseInfo = {
  returnValue: (fromRes, toRes) => {
    const { version: version2, language, SDKVersion, theme } = fromRes;
    let _hostName = getHostName(fromRes);
    let hostLanguage = (language || "").replace(/_/g, "-");
    const parameters = {
      hostVersion: version2,
      hostLanguage,
      hostName: _hostName,
      hostSDKVersion: SDKVersion,
      hostTheme: theme,
      appId: "__UNI__F9C76ED",
      appName: "FuziAI",
      appVersion: "1.0.0",
      appVersionCode: "100",
      appLanguage: getAppLanguage(hostLanguage),
      isUniAppX: false,
      uniPlatform: "mp-weixin",
      uniCompileVersion: "4.66",
      uniCompilerVersion: "4.66",
      uniRuntimeVersion: "4.66"
    };
    extend(toRes, parameters);
  }
};
const getWindowInfo = {
  returnValue: (fromRes, toRes) => {
    addSafeAreaInsets(fromRes, toRes);
    toRes = sortObject(extend(toRes, {
      windowTop: 0,
      windowBottom: 0
    }));
  }
};
const getAppAuthorizeSetting = {
  returnValue: function(fromRes, toRes) {
    const { locationReducedAccuracy } = fromRes;
    toRes.locationAccuracy = "unsupported";
    if (locationReducedAccuracy === true) {
      toRes.locationAccuracy = "reduced";
    } else if (locationReducedAccuracy === false) {
      toRes.locationAccuracy = "full";
    }
  }
};
const onError = {
  args(fromArgs) {
    const app = getApp({ allowDefault: true }) || {};
    if (!app.$vm) {
      if (!wx.$onErrorHandlers) {
        wx.$onErrorHandlers = [];
      }
      wx.$onErrorHandlers.push(fromArgs);
    } else {
      injectHook(ON_ERROR, fromArgs, app.$vm.$);
    }
  }
};
const offError = {
  args(fromArgs) {
    const app = getApp({ allowDefault: true }) || {};
    if (!app.$vm) {
      if (!wx.$onErrorHandlers) {
        return;
      }
      const index2 = wx.$onErrorHandlers.findIndex((fn) => fn === fromArgs);
      if (index2 !== -1) {
        wx.$onErrorHandlers.splice(index2, 1);
      }
    } else if (fromArgs.__weh) {
      const onErrors = app.$vm.$[ON_ERROR];
      if (onErrors) {
        const index2 = onErrors.indexOf(fromArgs.__weh);
        if (index2 > -1) {
          onErrors.splice(index2, 1);
        }
      }
    }
  }
};
const onSocketOpen = {
  args() {
    if (wx.__uni_console__) {
      if (wx.__uni_console_warned__) {
        return;
      }
      wx.__uni_console_warned__ = true;
      console.warn(`开发模式下小程序日志回显会使用 socket 连接，为了避免冲突，建议使用 SocketTask 的方式去管理 WebSocket 或手动关闭日志回显功能。[详情](https://uniapp.dcloud.net.cn/tutorial/run/mp-log.html)`);
    }
  }
};
const onSocketMessage = onSocketOpen;
const baseApis = {
  $on,
  $off,
  $once,
  $emit,
  upx2px,
  rpx2px: upx2px,
  interceptors,
  addInterceptor,
  removeInterceptor,
  onCreateVueApp,
  invokeCreateVueAppHook,
  getLocale,
  setLocale,
  onLocaleChange,
  getPushClientId,
  onPushMessage,
  offPushMessage,
  invokePushCallback,
  __f__
};
function initUni(api, protocols2, platform2 = wx) {
  const wrapper = initWrapper(protocols2);
  const UniProxyHandlers = {
    get(target, key) {
      if (hasOwn(target, key)) {
        return target[key];
      }
      if (hasOwn(api, key)) {
        return promisify(key, api[key]);
      }
      if (hasOwn(baseApis, key)) {
        return promisify(key, baseApis[key]);
      }
      return promisify(key, wrapper(key, platform2[key]));
    }
  };
  return new Proxy({}, UniProxyHandlers);
}
function initGetProvider(providers) {
  return function getProvider2({ service, success, fail, complete }) {
    let res;
    if (providers[service]) {
      res = {
        errMsg: "getProvider:ok",
        service,
        provider: providers[service]
      };
      isFunction(success) && success(res);
    } else {
      res = {
        errMsg: "getProvider:fail:服务[" + service + "]不存在"
      };
      isFunction(fail) && fail(res);
    }
    isFunction(complete) && complete(res);
  };
}
const objectKeys = [
  "qy",
  "env",
  "error",
  "version",
  "lanDebug",
  "cloud",
  "serviceMarket",
  "router",
  "worklet",
  "__webpack_require_UNI_MP_PLUGIN__"
];
const singlePageDisableKey = ["lanDebug", "router", "worklet"];
const launchOption = wx.getLaunchOptionsSync ? wx.getLaunchOptionsSync() : null;
function isWxKey(key) {
  if (launchOption && launchOption.scene === 1154 && singlePageDisableKey.includes(key)) {
    return false;
  }
  return objectKeys.indexOf(key) > -1 || typeof wx[key] === "function";
}
function initWx() {
  const newWx = {};
  for (const key in wx) {
    if (isWxKey(key)) {
      newWx[key] = wx[key];
    }
  }
  if (typeof globalThis !== "undefined" && typeof requireMiniProgram === "undefined") {
    globalThis.wx = newWx;
  }
  return newWx;
}
const mocks$1 = ["__route__", "__wxExparserNodeId__", "__wxWebviewId__"];
const getProvider = initGetProvider({
  oauth: ["weixin"],
  share: ["weixin"],
  payment: ["wxpay"],
  push: ["weixin"]
});
function initComponentMocks(component) {
  const res = /* @__PURE__ */ Object.create(null);
  mocks$1.forEach((name) => {
    res[name] = component[name];
  });
  return res;
}
function createSelectorQuery() {
  const query = wx$2.createSelectorQuery();
  const oldIn = query.in;
  query.in = function newIn(component) {
    if (component.$scope) {
      return oldIn.call(this, component.$scope);
    }
    return oldIn.call(this, initComponentMocks(component));
  };
  return query;
}
const wx$2 = initWx();
if (!wx$2.canIUse("getAppBaseInfo")) {
  wx$2.getAppBaseInfo = wx$2.getSystemInfoSync;
}
if (!wx$2.canIUse("getWindowInfo")) {
  wx$2.getWindowInfo = wx$2.getSystemInfoSync;
}
if (!wx$2.canIUse("getDeviceInfo")) {
  wx$2.getDeviceInfo = wx$2.getSystemInfoSync;
}
let baseInfo = wx$2.getAppBaseInfo && wx$2.getAppBaseInfo();
if (!baseInfo) {
  baseInfo = wx$2.getSystemInfoSync();
}
const host = baseInfo ? baseInfo.host : null;
const shareVideoMessage = host && host.env === "SAAASDK" ? wx$2.miniapp.shareVideoMessage : wx$2.shareVideoMessage;
var shims = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  createSelectorQuery,
  getProvider,
  shareVideoMessage
});
const compressImage = {
  args(fromArgs, toArgs) {
    if (fromArgs.compressedHeight && !toArgs.compressHeight) {
      toArgs.compressHeight = fromArgs.compressedHeight;
    }
    if (fromArgs.compressedWidth && !toArgs.compressWidth) {
      toArgs.compressWidth = fromArgs.compressedWidth;
    }
  }
};
var protocols = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  compressImage,
  getAppAuthorizeSetting,
  getAppBaseInfo,
  getDeviceInfo,
  getSystemInfo,
  getSystemInfoSync,
  getWindowInfo,
  offError,
  onError,
  onSocketMessage,
  onSocketOpen,
  previewImage,
  redirectTo,
  showActionSheet
});
const wx$1 = initWx();
var index$1 = initUni(shims, protocols, wx$1);
/**
* @dcloudio/uni-mp-vue v3.4.21
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
function warn$2(msg, ...args) {
  console.warn(`[Vue warn] ${msg}`, ...args);
}
let activeEffectScope;
class EffectScope {
  constructor(detached = false) {
    this.detached = detached;
    this._active = true;
    this.effects = [];
    this.cleanups = [];
    this.parent = activeEffectScope;
    if (!detached && activeEffectScope) {
      this.index = (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(
        this
      ) - 1;
    }
  }
  get active() {
    return this._active;
  }
  run(fn) {
    if (this._active) {
      const currentEffectScope = activeEffectScope;
      try {
        activeEffectScope = this;
        return fn();
      } finally {
        activeEffectScope = currentEffectScope;
      }
    } else {
      warn$2(`cannot run an inactive effect scope.`);
    }
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    activeEffectScope = this;
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    activeEffectScope = this.parent;
  }
  stop(fromParent) {
    if (this._active) {
      let i, l;
      for (i = 0, l = this.effects.length; i < l; i++) {
        this.effects[i].stop();
      }
      for (i = 0, l = this.cleanups.length; i < l; i++) {
        this.cleanups[i]();
      }
      if (this.scopes) {
        for (i = 0, l = this.scopes.length; i < l; i++) {
          this.scopes[i].stop(true);
        }
      }
      if (!this.detached && this.parent && !fromParent) {
        const last = this.parent.scopes.pop();
        if (last && last !== this) {
          this.parent.scopes[this.index] = last;
          last.index = this.index;
        }
      }
      this.parent = void 0;
      this._active = false;
    }
  }
}
function effectScope(detached) {
  return new EffectScope(detached);
}
function recordEffectScope(effect2, scope = activeEffectScope) {
  if (scope && scope.active) {
    scope.effects.push(effect2);
  }
}
function getCurrentScope() {
  return activeEffectScope;
}
function onScopeDispose(fn) {
  if (activeEffectScope) {
    activeEffectScope.cleanups.push(fn);
  } else {
    warn$2(
      `onScopeDispose() is called when there is no active effect scope to be associated with.`
    );
  }
}
let activeEffect;
class ReactiveEffect {
  constructor(fn, trigger2, scheduler, scope) {
    this.fn = fn;
    this.trigger = trigger2;
    this.scheduler = scheduler;
    this.active = true;
    this.deps = [];
    this._dirtyLevel = 4;
    this._trackId = 0;
    this._runnings = 0;
    this._shouldSchedule = false;
    this._depsLength = 0;
    recordEffectScope(this, scope);
  }
  get dirty() {
    if (this._dirtyLevel === 2 || this._dirtyLevel === 3) {
      this._dirtyLevel = 1;
      pauseTracking();
      for (let i = 0; i < this._depsLength; i++) {
        const dep = this.deps[i];
        if (dep.computed) {
          triggerComputed(dep.computed);
          if (this._dirtyLevel >= 4) {
            break;
          }
        }
      }
      if (this._dirtyLevel === 1) {
        this._dirtyLevel = 0;
      }
      resetTracking();
    }
    return this._dirtyLevel >= 4;
  }
  set dirty(v) {
    this._dirtyLevel = v ? 4 : 0;
  }
  run() {
    this._dirtyLevel = 0;
    if (!this.active) {
      return this.fn();
    }
    let lastShouldTrack = shouldTrack;
    let lastEffect = activeEffect;
    try {
      shouldTrack = true;
      activeEffect = this;
      this._runnings++;
      preCleanupEffect(this);
      return this.fn();
    } finally {
      postCleanupEffect(this);
      this._runnings--;
      activeEffect = lastEffect;
      shouldTrack = lastShouldTrack;
    }
  }
  stop() {
    var _a2;
    if (this.active) {
      preCleanupEffect(this);
      postCleanupEffect(this);
      (_a2 = this.onStop) == null ? void 0 : _a2.call(this);
      this.active = false;
    }
  }
}
function triggerComputed(computed2) {
  return computed2.value;
}
function preCleanupEffect(effect2) {
  effect2._trackId++;
  effect2._depsLength = 0;
}
function postCleanupEffect(effect2) {
  if (effect2.deps.length > effect2._depsLength) {
    for (let i = effect2._depsLength; i < effect2.deps.length; i++) {
      cleanupDepEffect(effect2.deps[i], effect2);
    }
    effect2.deps.length = effect2._depsLength;
  }
}
function cleanupDepEffect(dep, effect2) {
  const trackId = dep.get(effect2);
  if (trackId !== void 0 && effect2._trackId !== trackId) {
    dep.delete(effect2);
    if (dep.size === 0) {
      dep.cleanup();
    }
  }
}
let shouldTrack = true;
let pauseScheduleStack = 0;
const trackStack = [];
function pauseTracking() {
  trackStack.push(shouldTrack);
  shouldTrack = false;
}
function resetTracking() {
  const last = trackStack.pop();
  shouldTrack = last === void 0 ? true : last;
}
function pauseScheduling() {
  pauseScheduleStack++;
}
function resetScheduling() {
  pauseScheduleStack--;
  while (!pauseScheduleStack && queueEffectSchedulers.length) {
    queueEffectSchedulers.shift()();
  }
}
function trackEffect(effect2, dep, debuggerEventExtraInfo) {
  var _a2;
  if (dep.get(effect2) !== effect2._trackId) {
    dep.set(effect2, effect2._trackId);
    const oldDep = effect2.deps[effect2._depsLength];
    if (oldDep !== dep) {
      if (oldDep) {
        cleanupDepEffect(oldDep, effect2);
      }
      effect2.deps[effect2._depsLength++] = dep;
    } else {
      effect2._depsLength++;
    }
    {
      (_a2 = effect2.onTrack) == null ? void 0 : _a2.call(effect2, extend({ effect: effect2 }, debuggerEventExtraInfo));
    }
  }
}
const queueEffectSchedulers = [];
function triggerEffects(dep, dirtyLevel, debuggerEventExtraInfo) {
  var _a2;
  pauseScheduling();
  for (const effect2 of dep.keys()) {
    let tracking;
    if (effect2._dirtyLevel < dirtyLevel && (tracking != null ? tracking : tracking = dep.get(effect2) === effect2._trackId)) {
      effect2._shouldSchedule || (effect2._shouldSchedule = effect2._dirtyLevel === 0);
      effect2._dirtyLevel = dirtyLevel;
    }
    if (effect2._shouldSchedule && (tracking != null ? tracking : tracking = dep.get(effect2) === effect2._trackId)) {
      {
        (_a2 = effect2.onTrigger) == null ? void 0 : _a2.call(effect2, extend({ effect: effect2 }, debuggerEventExtraInfo));
      }
      effect2.trigger();
      if ((!effect2._runnings || effect2.allowRecurse) && effect2._dirtyLevel !== 2) {
        effect2._shouldSchedule = false;
        if (effect2.scheduler) {
          queueEffectSchedulers.push(effect2.scheduler);
        }
      }
    }
  }
  resetScheduling();
}
const createDep = (cleanup, computed2) => {
  const dep = /* @__PURE__ */ new Map();
  dep.cleanup = cleanup;
  dep.computed = computed2;
  return dep;
};
const targetMap = /* @__PURE__ */ new WeakMap();
const ITERATE_KEY = Symbol("iterate");
const MAP_KEY_ITERATE_KEY = Symbol("Map key iterate");
function track(target, type2, key) {
  if (shouldTrack && activeEffect) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
    }
    let dep = depsMap.get(key);
    if (!dep) {
      depsMap.set(key, dep = createDep(() => depsMap.delete(key)));
    }
    trackEffect(
      activeEffect,
      dep,
      {
        target,
        type: type2,
        key
      }
    );
  }
}
function trigger(target, type2, key, newValue, oldValue, oldTarget) {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }
  let deps = [];
  if (type2 === "clear") {
    deps = [...depsMap.values()];
  } else if (key === "length" && isArray$1(target)) {
    const newLength = Number(newValue);
    depsMap.forEach((dep, key2) => {
      if (key2 === "length" || !isSymbol(key2) && key2 >= newLength) {
        deps.push(dep);
      }
    });
  } else {
    if (key !== void 0) {
      deps.push(depsMap.get(key));
    }
    switch (type2) {
      case "add":
        if (!isArray$1(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
          if (isMap(target)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        } else if (isIntegerKey(key)) {
          deps.push(depsMap.get("length"));
        }
        break;
      case "delete":
        if (!isArray$1(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
          if (isMap(target)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        }
        break;
      case "set":
        if (isMap(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
        }
        break;
    }
  }
  pauseScheduling();
  for (const dep of deps) {
    if (dep) {
      triggerEffects(
        dep,
        4,
        {
          target,
          type: type2,
          key,
          newValue,
          oldValue,
          oldTarget
        }
      );
    }
  }
  resetScheduling();
}
function getDepFromReactive(object2, key) {
  var _a2;
  return (_a2 = targetMap.get(object2)) == null ? void 0 : _a2.get(key);
}
const isNonTrackableKeys = /* @__PURE__ */ makeMap(`__proto__,__v_isRef,__isVue`);
const builtInSymbols = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((key) => key !== "arguments" && key !== "caller").map((key) => Symbol[key]).filter(isSymbol)
);
const arrayInstrumentations = /* @__PURE__ */ createArrayInstrumentations();
function createArrayInstrumentations() {
  const instrumentations = {};
  ["includes", "indexOf", "lastIndexOf"].forEach((key) => {
    instrumentations[key] = function(...args) {
      const arr = toRaw(this);
      for (let i = 0, l = this.length; i < l; i++) {
        track(arr, "get", i + "");
      }
      const res = arr[key](...args);
      if (res === -1 || res === false) {
        return arr[key](...args.map(toRaw));
      } else {
        return res;
      }
    };
  });
  ["push", "pop", "shift", "unshift", "splice"].forEach((key) => {
    instrumentations[key] = function(...args) {
      pauseTracking();
      pauseScheduling();
      const res = toRaw(this)[key].apply(this, args);
      resetScheduling();
      resetTracking();
      return res;
    };
  });
  return instrumentations;
}
function hasOwnProperty$2(key) {
  const obj = toRaw(this);
  track(obj, "has", key);
  return obj.hasOwnProperty(key);
}
class BaseReactiveHandler {
  constructor(_isReadonly = false, _isShallow = false) {
    this._isReadonly = _isReadonly;
    this._isShallow = _isShallow;
  }
  get(target, key, receiver) {
    const isReadonly2 = this._isReadonly, isShallow2 = this._isShallow;
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_isShallow") {
      return isShallow2;
    } else if (key === "__v_raw") {
      if (receiver === (isReadonly2 ? isShallow2 ? shallowReadonlyMap : readonlyMap : isShallow2 ? shallowReactiveMap : reactiveMap).get(target) || // receiver is not the reactive proxy, but has the same prototype
      // this means the reciever is a user proxy of the reactive proxy
      Object.getPrototypeOf(target) === Object.getPrototypeOf(receiver)) {
        return target;
      }
      return;
    }
    const targetIsArray = isArray$1(target);
    if (!isReadonly2) {
      if (targetIsArray && hasOwn(arrayInstrumentations, key)) {
        return Reflect.get(arrayInstrumentations, key, receiver);
      }
      if (key === "hasOwnProperty") {
        return hasOwnProperty$2;
      }
    }
    const res = Reflect.get(target, key, receiver);
    if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
      return res;
    }
    if (!isReadonly2) {
      track(target, "get", key);
    }
    if (isShallow2) {
      return res;
    }
    if (isRef(res)) {
      return targetIsArray && isIntegerKey(key) ? res : res.value;
    }
    if (isObject$1(res)) {
      return isReadonly2 ? readonly(res) : reactive(res);
    }
    return res;
  }
}
class MutableReactiveHandler extends BaseReactiveHandler {
  constructor(isShallow2 = false) {
    super(false, isShallow2);
  }
  set(target, key, value2, receiver) {
    let oldValue = target[key];
    if (!this._isShallow) {
      const isOldValueReadonly = isReadonly(oldValue);
      if (!isShallow(value2) && !isReadonly(value2)) {
        oldValue = toRaw(oldValue);
        value2 = toRaw(value2);
      }
      if (!isArray$1(target) && isRef(oldValue) && !isRef(value2)) {
        if (isOldValueReadonly) {
          return false;
        } else {
          oldValue.value = value2;
          return true;
        }
      }
    }
    const hadKey = isArray$1(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn(target, key);
    const result = Reflect.set(target, key, value2, receiver);
    if (target === toRaw(receiver)) {
      if (!hadKey) {
        trigger(target, "add", key, value2);
      } else if (hasChanged(value2, oldValue)) {
        trigger(target, "set", key, value2, oldValue);
      }
    }
    return result;
  }
  deleteProperty(target, key) {
    const hadKey = hasOwn(target, key);
    const oldValue = target[key];
    const result = Reflect.deleteProperty(target, key);
    if (result && hadKey) {
      trigger(target, "delete", key, void 0, oldValue);
    }
    return result;
  }
  has(target, key) {
    const result = Reflect.has(target, key);
    if (!isSymbol(key) || !builtInSymbols.has(key)) {
      track(target, "has", key);
    }
    return result;
  }
  ownKeys(target) {
    track(
      target,
      "iterate",
      isArray$1(target) ? "length" : ITERATE_KEY
    );
    return Reflect.ownKeys(target);
  }
}
class ReadonlyReactiveHandler extends BaseReactiveHandler {
  constructor(isShallow2 = false) {
    super(true, isShallow2);
  }
  set(target, key) {
    {
      warn$2(
        `Set operation on key "${String(key)}" failed: target is readonly.`,
        target
      );
    }
    return true;
  }
  deleteProperty(target, key) {
    {
      warn$2(
        `Delete operation on key "${String(key)}" failed: target is readonly.`,
        target
      );
    }
    return true;
  }
}
const mutableHandlers = /* @__PURE__ */ new MutableReactiveHandler();
const readonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler();
const shallowReactiveHandlers = /* @__PURE__ */ new MutableReactiveHandler(
  true
);
const shallowReadonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler(true);
const toShallow = (value2) => value2;
const getProto = (v) => Reflect.getPrototypeOf(v);
function get$2(target, key, isReadonly2 = false, isShallow2 = false) {
  target = target["__v_raw"];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key);
  if (!isReadonly2) {
    if (hasChanged(key, rawKey)) {
      track(rawTarget, "get", key);
    }
    track(rawTarget, "get", rawKey);
  }
  const { has: has2 } = getProto(rawTarget);
  const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
  if (has2.call(rawTarget, key)) {
    return wrap(target.get(key));
  } else if (has2.call(rawTarget, rawKey)) {
    return wrap(target.get(rawKey));
  } else if (target !== rawTarget) {
    target.get(key);
  }
}
function has(key, isReadonly2 = false) {
  const target = this["__v_raw"];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key);
  if (!isReadonly2) {
    if (hasChanged(key, rawKey)) {
      track(rawTarget, "has", key);
    }
    track(rawTarget, "has", rawKey);
  }
  return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
}
function size(target, isReadonly2 = false) {
  target = target["__v_raw"];
  !isReadonly2 && track(toRaw(target), "iterate", ITERATE_KEY);
  return Reflect.get(target, "size", target);
}
function add(value2) {
  value2 = toRaw(value2);
  const target = toRaw(this);
  const proto = getProto(target);
  const hadKey = proto.has.call(target, value2);
  if (!hadKey) {
    target.add(value2);
    trigger(target, "add", value2, value2);
  }
  return this;
}
function set$1$1(key, value2) {
  value2 = toRaw(value2);
  const target = toRaw(this);
  const { has: has2, get: get2 } = getProto(target);
  let hadKey = has2.call(target, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has2.call(target, key);
  } else {
    checkIdentityKeys(target, has2, key);
  }
  const oldValue = get2.call(target, key);
  target.set(key, value2);
  if (!hadKey) {
    trigger(target, "add", key, value2);
  } else if (hasChanged(value2, oldValue)) {
    trigger(target, "set", key, value2, oldValue);
  }
  return this;
}
function deleteEntry(key) {
  const target = toRaw(this);
  const { has: has2, get: get2 } = getProto(target);
  let hadKey = has2.call(target, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has2.call(target, key);
  } else {
    checkIdentityKeys(target, has2, key);
  }
  const oldValue = get2 ? get2.call(target, key) : void 0;
  const result = target.delete(key);
  if (hadKey) {
    trigger(target, "delete", key, void 0, oldValue);
  }
  return result;
}
function clear() {
  const target = toRaw(this);
  const hadItems = target.size !== 0;
  const oldTarget = isMap(target) ? new Map(target) : new Set(target);
  const result = target.clear();
  if (hadItems) {
    trigger(target, "clear", void 0, void 0, oldTarget);
  }
  return result;
}
function createForEach(isReadonly2, isShallow2) {
  return function forEach3(callback, thisArg) {
    const observed = this;
    const target = observed["__v_raw"];
    const rawTarget = toRaw(target);
    const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
    !isReadonly2 && track(rawTarget, "iterate", ITERATE_KEY);
    return target.forEach((value2, key) => {
      return callback.call(thisArg, wrap(value2), wrap(key), observed);
    });
  };
}
function createIterableMethod(method2, isReadonly2, isShallow2) {
  return function(...args) {
    const target = this["__v_raw"];
    const rawTarget = toRaw(target);
    const targetIsMap = isMap(rawTarget);
    const isPair = method2 === "entries" || method2 === Symbol.iterator && targetIsMap;
    const isKeyOnly = method2 === "keys" && targetIsMap;
    const innerIterator = target[method2](...args);
    const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
    !isReadonly2 && track(
      rawTarget,
      "iterate",
      isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY
    );
    return {
      // iterator protocol
      next() {
        const { value: value2, done } = innerIterator.next();
        return done ? { value: value2, done } : {
          value: isPair ? [wrap(value2[0]), wrap(value2[1])] : wrap(value2),
          done
        };
      },
      // iterable protocol
      [Symbol.iterator]() {
        return this;
      }
    };
  };
}
function createReadonlyMethod(type2) {
  return function(...args) {
    {
      const key = args[0] ? `on key "${args[0]}" ` : ``;
      warn$2(
        `${capitalize(type2)} operation ${key}failed: target is readonly.`,
        toRaw(this)
      );
    }
    return type2 === "delete" ? false : type2 === "clear" ? void 0 : this;
  };
}
function createInstrumentations() {
  const mutableInstrumentations2 = {
    get(key) {
      return get$2(this, key);
    },
    get size() {
      return size(this);
    },
    has,
    add,
    set: set$1$1,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, false)
  };
  const shallowInstrumentations2 = {
    get(key) {
      return get$2(this, key, false, true);
    },
    get size() {
      return size(this);
    },
    has,
    add,
    set: set$1$1,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, true)
  };
  const readonlyInstrumentations2 = {
    get(key) {
      return get$2(this, key, true);
    },
    get size() {
      return size(this, true);
    },
    has(key) {
      return has.call(this, key, true);
    },
    add: createReadonlyMethod("add"),
    set: createReadonlyMethod("set"),
    delete: createReadonlyMethod("delete"),
    clear: createReadonlyMethod("clear"),
    forEach: createForEach(true, false)
  };
  const shallowReadonlyInstrumentations2 = {
    get(key) {
      return get$2(this, key, true, true);
    },
    get size() {
      return size(this, true);
    },
    has(key) {
      return has.call(this, key, true);
    },
    add: createReadonlyMethod("add"),
    set: createReadonlyMethod("set"),
    delete: createReadonlyMethod("delete"),
    clear: createReadonlyMethod("clear"),
    forEach: createForEach(true, true)
  };
  const iteratorMethods = [
    "keys",
    "values",
    "entries",
    Symbol.iterator
  ];
  iteratorMethods.forEach((method2) => {
    mutableInstrumentations2[method2] = createIterableMethod(method2, false, false);
    readonlyInstrumentations2[method2] = createIterableMethod(method2, true, false);
    shallowInstrumentations2[method2] = createIterableMethod(method2, false, true);
    shallowReadonlyInstrumentations2[method2] = createIterableMethod(
      method2,
      true,
      true
    );
  });
  return [
    mutableInstrumentations2,
    readonlyInstrumentations2,
    shallowInstrumentations2,
    shallowReadonlyInstrumentations2
  ];
}
const [
  mutableInstrumentations,
  readonlyInstrumentations,
  shallowInstrumentations,
  shallowReadonlyInstrumentations
] = /* @__PURE__ */ createInstrumentations();
function createInstrumentationGetter(isReadonly2, shallow) {
  const instrumentations = shallow ? isReadonly2 ? shallowReadonlyInstrumentations : shallowInstrumentations : isReadonly2 ? readonlyInstrumentations : mutableInstrumentations;
  return (target, key, receiver) => {
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_raw") {
      return target;
    }
    return Reflect.get(
      hasOwn(instrumentations, key) && key in target ? instrumentations : target,
      key,
      receiver
    );
  };
}
const mutableCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, false)
};
const shallowCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, true)
};
const readonlyCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(true, false)
};
const shallowReadonlyCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(true, true)
};
function checkIdentityKeys(target, has2, key) {
  const rawKey = toRaw(key);
  if (rawKey !== key && has2.call(target, rawKey)) {
    const type2 = toRawType(target);
    warn$2(
      `Reactive ${type2} contains both the raw and reactive versions of the same object${type2 === `Map` ? ` as keys` : ``}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`
    );
  }
}
const reactiveMap = /* @__PURE__ */ new WeakMap();
const shallowReactiveMap = /* @__PURE__ */ new WeakMap();
const readonlyMap = /* @__PURE__ */ new WeakMap();
const shallowReadonlyMap = /* @__PURE__ */ new WeakMap();
function targetTypeMap(rawType) {
  switch (rawType) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
function getTargetType(value2) {
  return value2["__v_skip"] || !Object.isExtensible(value2) ? 0 : targetTypeMap(toRawType(value2));
}
function reactive(target) {
  if (isReadonly(target)) {
    return target;
  }
  return createReactiveObject(
    target,
    false,
    mutableHandlers,
    mutableCollectionHandlers,
    reactiveMap
  );
}
function shallowReactive(target) {
  return createReactiveObject(
    target,
    false,
    shallowReactiveHandlers,
    shallowCollectionHandlers,
    shallowReactiveMap
  );
}
function readonly(target) {
  return createReactiveObject(
    target,
    true,
    readonlyHandlers,
    readonlyCollectionHandlers,
    readonlyMap
  );
}
function shallowReadonly(target) {
  return createReactiveObject(
    target,
    true,
    shallowReadonlyHandlers,
    shallowReadonlyCollectionHandlers,
    shallowReadonlyMap
  );
}
function createReactiveObject(target, isReadonly2, baseHandlers, collectionHandlers, proxyMap) {
  if (!isObject$1(target)) {
    {
      warn$2(`value cannot be made reactive: ${String(target)}`);
    }
    return target;
  }
  if (target["__v_raw"] && !(isReadonly2 && target["__v_isReactive"])) {
    return target;
  }
  const existingProxy = proxyMap.get(target);
  if (existingProxy) {
    return existingProxy;
  }
  const targetType = getTargetType(target);
  if (targetType === 0) {
    return target;
  }
  const proxy = new Proxy(
    target,
    targetType === 2 ? collectionHandlers : baseHandlers
  );
  proxyMap.set(target, proxy);
  return proxy;
}
function isReactive(value2) {
  if (isReadonly(value2)) {
    return isReactive(value2["__v_raw"]);
  }
  return !!(value2 && value2["__v_isReactive"]);
}
function isReadonly(value2) {
  return !!(value2 && value2["__v_isReadonly"]);
}
function isShallow(value2) {
  return !!(value2 && value2["__v_isShallow"]);
}
function isProxy(value2) {
  return isReactive(value2) || isReadonly(value2);
}
function toRaw(observed) {
  const raw = observed && observed["__v_raw"];
  return raw ? toRaw(raw) : observed;
}
function markRaw(value2) {
  if (Object.isExtensible(value2)) {
    def(value2, "__v_skip", true);
  }
  return value2;
}
const toReactive = (value2) => isObject$1(value2) ? reactive(value2) : value2;
const toReadonly = (value2) => isObject$1(value2) ? readonly(value2) : value2;
const COMPUTED_SIDE_EFFECT_WARN = `Computed is still dirty after getter evaluation, likely because a computed is mutating its own dependency in its getter. State mutations in computed getters should be avoided.  Check the docs for more details: https://vuejs.org/guide/essentials/computed.html#getters-should-be-side-effect-free`;
class ComputedRefImpl {
  constructor(getter, _setter, isReadonly2, isSSR) {
    this.getter = getter;
    this._setter = _setter;
    this.dep = void 0;
    this.__v_isRef = true;
    this["__v_isReadonly"] = false;
    this.effect = new ReactiveEffect(
      () => getter(this._value),
      () => triggerRefValue(
        this,
        this.effect._dirtyLevel === 2 ? 2 : 3
      )
    );
    this.effect.computed = this;
    this.effect.active = this._cacheable = !isSSR;
    this["__v_isReadonly"] = isReadonly2;
  }
  get value() {
    const self2 = toRaw(this);
    if ((!self2._cacheable || self2.effect.dirty) && hasChanged(self2._value, self2._value = self2.effect.run())) {
      triggerRefValue(self2, 4);
    }
    trackRefValue(self2);
    if (self2.effect._dirtyLevel >= 2) {
      if (this._warnRecursive) {
        warn$2(COMPUTED_SIDE_EFFECT_WARN, `

getter: `, this.getter);
      }
      triggerRefValue(self2, 2);
    }
    return self2._value;
  }
  set value(newValue) {
    this._setter(newValue);
  }
  // #region polyfill _dirty for backward compatibility third party code for Vue <= 3.3.x
  get _dirty() {
    return this.effect.dirty;
  }
  set _dirty(v) {
    this.effect.dirty = v;
  }
  // #endregion
}
function computed$1(getterOrOptions, debugOptions, isSSR = false) {
  let getter;
  let setter;
  const onlyGetter = isFunction(getterOrOptions);
  if (onlyGetter) {
    getter = getterOrOptions;
    setter = () => {
      warn$2("Write operation failed: computed value is readonly");
    };
  } else {
    getter = getterOrOptions.get;
    setter = getterOrOptions.set;
  }
  const cRef = new ComputedRefImpl(getter, setter, onlyGetter || !setter, isSSR);
  return cRef;
}
function trackRefValue(ref2) {
  var _a2;
  if (shouldTrack && activeEffect) {
    ref2 = toRaw(ref2);
    trackEffect(
      activeEffect,
      (_a2 = ref2.dep) != null ? _a2 : ref2.dep = createDep(
        () => ref2.dep = void 0,
        ref2 instanceof ComputedRefImpl ? ref2 : void 0
      ),
      {
        target: ref2,
        type: "get",
        key: "value"
      }
    );
  }
}
function triggerRefValue(ref2, dirtyLevel = 4, newVal) {
  ref2 = toRaw(ref2);
  const dep = ref2.dep;
  if (dep) {
    triggerEffects(
      dep,
      dirtyLevel,
      {
        target: ref2,
        type: "set",
        key: "value",
        newValue: newVal
      }
    );
  }
}
function isRef(r2) {
  return !!(r2 && r2.__v_isRef === true);
}
function ref(value2) {
  return createRef(value2, false);
}
function shallowRef(value2) {
  return createRef(value2, true);
}
function createRef(rawValue, shallow) {
  if (isRef(rawValue)) {
    return rawValue;
  }
  return new RefImpl(rawValue, shallow);
}
class RefImpl {
  constructor(value2, __v_isShallow) {
    this.__v_isShallow = __v_isShallow;
    this.dep = void 0;
    this.__v_isRef = true;
    this._rawValue = __v_isShallow ? value2 : toRaw(value2);
    this._value = __v_isShallow ? value2 : toReactive(value2);
  }
  get value() {
    trackRefValue(this);
    return this._value;
  }
  set value(newVal) {
    const useDirectValue = this.__v_isShallow || isShallow(newVal) || isReadonly(newVal);
    newVal = useDirectValue ? newVal : toRaw(newVal);
    if (hasChanged(newVal, this._rawValue)) {
      this._rawValue = newVal;
      this._value = useDirectValue ? newVal : toReactive(newVal);
      triggerRefValue(this, 4, newVal);
    }
  }
}
function unref(ref2) {
  return isRef(ref2) ? ref2.value : ref2;
}
const shallowUnwrapHandlers = {
  get: (target, key, receiver) => unref(Reflect.get(target, key, receiver)),
  set: (target, key, value2, receiver) => {
    const oldValue = target[key];
    if (isRef(oldValue) && !isRef(value2)) {
      oldValue.value = value2;
      return true;
    } else {
      return Reflect.set(target, key, value2, receiver);
    }
  }
};
function proxyRefs(objectWithRefs) {
  return isReactive(objectWithRefs) ? objectWithRefs : new Proxy(objectWithRefs, shallowUnwrapHandlers);
}
class CustomRefImpl {
  constructor(factory) {
    this.dep = void 0;
    this.__v_isRef = true;
    const { get: get2, set: set2 } = factory(
      () => trackRefValue(this),
      () => triggerRefValue(this)
    );
    this._get = get2;
    this._set = set2;
  }
  get value() {
    return this._get();
  }
  set value(newVal) {
    this._set(newVal);
  }
}
function customRef(factory) {
  return new CustomRefImpl(factory);
}
function toRefs(object2) {
  if (!isProxy(object2)) {
    warn$2(`toRefs() expects a reactive object but received a plain one.`);
  }
  const ret = isArray$1(object2) ? new Array(object2.length) : {};
  for (const key in object2) {
    ret[key] = propertyToRef(object2, key);
  }
  return ret;
}
class ObjectRefImpl {
  constructor(_object, _key, _defaultValue) {
    this._object = _object;
    this._key = _key;
    this._defaultValue = _defaultValue;
    this.__v_isRef = true;
  }
  get value() {
    const val = this._object[this._key];
    return val === void 0 ? this._defaultValue : val;
  }
  set value(newVal) {
    this._object[this._key] = newVal;
  }
  get dep() {
    return getDepFromReactive(toRaw(this._object), this._key);
  }
}
class GetterRefImpl {
  constructor(_getter) {
    this._getter = _getter;
    this.__v_isRef = true;
    this.__v_isReadonly = true;
  }
  get value() {
    return this._getter();
  }
}
function toRef(source, key, defaultValue) {
  if (isRef(source)) {
    return source;
  } else if (isFunction(source)) {
    return new GetterRefImpl(source);
  } else if (isObject$1(source) && arguments.length > 1) {
    return propertyToRef(source, key, defaultValue);
  } else {
    return ref(source);
  }
}
function propertyToRef(source, key, defaultValue) {
  const val = source[key];
  return isRef(val) ? val : new ObjectRefImpl(source, key, defaultValue);
}
const stack = [];
function pushWarningContext(vnode) {
  stack.push(vnode);
}
function popWarningContext() {
  stack.pop();
}
function warn$1(msg, ...args) {
  pauseTracking();
  const instance = stack.length ? stack[stack.length - 1].component : null;
  const appWarnHandler = instance && instance.appContext.config.warnHandler;
  const trace = getComponentTrace();
  if (appWarnHandler) {
    callWithErrorHandling(
      appWarnHandler,
      instance,
      11,
      [
        msg + args.map((a) => {
          var _a2, _b;
          return (_b = (_a2 = a.toString) == null ? void 0 : _a2.call(a)) != null ? _b : JSON.stringify(a);
        }).join(""),
        instance && instance.proxy,
        trace.map(
          ({ vnode }) => `at <${formatComponentName(instance, vnode.type)}>`
        ).join("\n"),
        trace
      ]
    );
  } else {
    const warnArgs = [`[Vue warn]: ${msg}`, ...args];
    if (trace.length && // avoid spamming console during tests
    true) {
      warnArgs.push(`
`, ...formatTrace(trace));
    }
    console.warn(...warnArgs);
  }
  resetTracking();
}
function getComponentTrace() {
  let currentVNode = stack[stack.length - 1];
  if (!currentVNode) {
    return [];
  }
  const normalizedStack = [];
  while (currentVNode) {
    const last = normalizedStack[0];
    if (last && last.vnode === currentVNode) {
      last.recurseCount++;
    } else {
      normalizedStack.push({
        vnode: currentVNode,
        recurseCount: 0
      });
    }
    const parentInstance = currentVNode.component && currentVNode.component.parent;
    currentVNode = parentInstance && parentInstance.vnode;
  }
  return normalizedStack;
}
function formatTrace(trace) {
  const logs = [];
  trace.forEach((entry, i) => {
    logs.push(...i === 0 ? [] : [`
`], ...formatTraceEntry(entry));
  });
  return logs;
}
function formatTraceEntry({ vnode, recurseCount }) {
  const postfix = recurseCount > 0 ? `... (${recurseCount} recursive calls)` : ``;
  const isRoot = vnode.component ? vnode.component.parent == null : false;
  const open = ` at <${formatComponentName(
    vnode.component,
    vnode.type,
    isRoot
  )}`;
  const close = `>` + postfix;
  return vnode.props ? [open, ...formatProps(vnode.props), close] : [open + close];
}
function formatProps(props2) {
  const res = [];
  const keys = Object.keys(props2);
  keys.slice(0, 3).forEach((key) => {
    res.push(...formatProp(key, props2[key]));
  });
  if (keys.length > 3) {
    res.push(` ...`);
  }
  return res;
}
function formatProp(key, value2, raw) {
  if (isString(value2)) {
    value2 = JSON.stringify(value2);
    return raw ? value2 : [`${key}=${value2}`];
  } else if (typeof value2 === "number" || typeof value2 === "boolean" || value2 == null) {
    return raw ? value2 : [`${key}=${value2}`];
  } else if (isRef(value2)) {
    value2 = formatProp(key, toRaw(value2.value), true);
    return raw ? value2 : [`${key}=Ref<`, value2, `>`];
  } else if (isFunction(value2)) {
    return [`${key}=fn${value2.name ? `<${value2.name}>` : ``}`];
  } else {
    value2 = toRaw(value2);
    return raw ? value2 : [`${key}=`, value2];
  }
}
const ErrorTypeStrings = {
  ["sp"]: "serverPrefetch hook",
  ["bc"]: "beforeCreate hook",
  ["c"]: "created hook",
  ["bm"]: "beforeMount hook",
  ["m"]: "mounted hook",
  ["bu"]: "beforeUpdate hook",
  ["u"]: "updated",
  ["bum"]: "beforeUnmount hook",
  ["um"]: "unmounted hook",
  ["a"]: "activated hook",
  ["da"]: "deactivated hook",
  ["ec"]: "errorCaptured hook",
  ["rtc"]: "renderTracked hook",
  ["rtg"]: "renderTriggered hook",
  [0]: "setup function",
  [1]: "render function",
  [2]: "watcher getter",
  [3]: "watcher callback",
  [4]: "watcher cleanup function",
  [5]: "native event handler",
  [6]: "component event handler",
  [7]: "vnode hook",
  [8]: "directive hook",
  [9]: "transition hook",
  [10]: "app errorHandler",
  [11]: "app warnHandler",
  [12]: "ref function",
  [13]: "async component loader",
  [14]: "scheduler flush. This is likely a Vue internals bug. Please open an issue at https://github.com/vuejs/core ."
};
function callWithErrorHandling(fn, instance, type2, args) {
  try {
    return args ? fn(...args) : fn();
  } catch (err) {
    handleError(err, instance, type2);
  }
}
function callWithAsyncErrorHandling(fn, instance, type2, args) {
  if (isFunction(fn)) {
    const res = callWithErrorHandling(fn, instance, type2, args);
    if (res && isPromise(res)) {
      res.catch((err) => {
        handleError(err, instance, type2);
      });
    }
    return res;
  }
  const values = [];
  for (let i = 0; i < fn.length; i++) {
    values.push(callWithAsyncErrorHandling(fn[i], instance, type2, args));
  }
  return values;
}
function handleError(err, instance, type2, throwInDev = true) {
  const contextVNode = instance ? instance.vnode : null;
  if (instance) {
    let cur = instance.parent;
    const exposedInstance = instance.proxy;
    const errorInfo = ErrorTypeStrings[type2] || type2;
    while (cur) {
      const errorCapturedHooks = cur.ec;
      if (errorCapturedHooks) {
        for (let i = 0; i < errorCapturedHooks.length; i++) {
          if (errorCapturedHooks[i](err, exposedInstance, errorInfo) === false) {
            return;
          }
        }
      }
      cur = cur.parent;
    }
    const appErrorHandler = instance.appContext.config.errorHandler;
    if (appErrorHandler) {
      callWithErrorHandling(
        appErrorHandler,
        null,
        10,
        [err, exposedInstance, errorInfo]
      );
      return;
    }
  }
  logError(err, type2, contextVNode, throwInDev);
}
function logError(err, type2, contextVNode, throwInDev = true) {
  {
    const info = ErrorTypeStrings[type2] || type2;
    if (contextVNode) {
      pushWarningContext(contextVNode);
    }
    warn$1(`Unhandled error${info ? ` during execution of ${info}` : ``}`);
    if (contextVNode) {
      popWarningContext();
    }
    if (throwInDev) {
      console.error(err);
    } else {
      console.error(err);
    }
  }
}
let isFlushing = false;
let isFlushPending = false;
const queue = [];
let flushIndex = 0;
const pendingPostFlushCbs = [];
let activePostFlushCbs = null;
let postFlushIndex = 0;
const resolvedPromise = /* @__PURE__ */ Promise.resolve();
let currentFlushPromise = null;
const RECURSION_LIMIT = 100;
function nextTick$1(fn) {
  const p2 = currentFlushPromise || resolvedPromise;
  return fn ? p2.then(this ? fn.bind(this) : fn) : p2;
}
function findInsertionIndex(id) {
  let start = flushIndex + 1;
  let end = queue.length;
  while (start < end) {
    const middle = start + end >>> 1;
    const middleJob = queue[middle];
    const middleJobId = getId(middleJob);
    if (middleJobId < id || middleJobId === id && middleJob.pre) {
      start = middle + 1;
    } else {
      end = middle;
    }
  }
  return start;
}
function queueJob(job) {
  if (!queue.length || !queue.includes(
    job,
    isFlushing && job.allowRecurse ? flushIndex + 1 : flushIndex
  )) {
    if (job.id == null) {
      queue.push(job);
    } else {
      queue.splice(findInsertionIndex(job.id), 0, job);
    }
    queueFlush();
  }
}
function queueFlush() {
  if (!isFlushing && !isFlushPending) {
    isFlushPending = true;
    currentFlushPromise = resolvedPromise.then(flushJobs);
  }
}
function hasQueueJob(job) {
  return queue.indexOf(job) > -1;
}
function invalidateJob(job) {
  const i = queue.indexOf(job);
  if (i > flushIndex) {
    queue.splice(i, 1);
  }
}
function queuePostFlushCb(cb) {
  if (!isArray$1(cb)) {
    if (!activePostFlushCbs || !activePostFlushCbs.includes(
      cb,
      cb.allowRecurse ? postFlushIndex + 1 : postFlushIndex
    )) {
      pendingPostFlushCbs.push(cb);
    }
  } else {
    pendingPostFlushCbs.push(...cb);
  }
  queueFlush();
}
function flushPreFlushCbs(instance, seen, i = isFlushing ? flushIndex + 1 : 0) {
  {
    seen = seen || /* @__PURE__ */ new Map();
  }
  for (; i < queue.length; i++) {
    const cb = queue[i];
    if (cb && cb.pre) {
      if (checkRecursiveUpdates(seen, cb)) {
        continue;
      }
      queue.splice(i, 1);
      i--;
      cb();
    }
  }
}
function flushPostFlushCbs(seen) {
  if (pendingPostFlushCbs.length) {
    const deduped = [...new Set(pendingPostFlushCbs)].sort(
      (a, b) => getId(a) - getId(b)
    );
    pendingPostFlushCbs.length = 0;
    if (activePostFlushCbs) {
      activePostFlushCbs.push(...deduped);
      return;
    }
    activePostFlushCbs = deduped;
    {
      seen = seen || /* @__PURE__ */ new Map();
    }
    for (postFlushIndex = 0; postFlushIndex < activePostFlushCbs.length; postFlushIndex++) {
      if (checkRecursiveUpdates(seen, activePostFlushCbs[postFlushIndex])) {
        continue;
      }
      activePostFlushCbs[postFlushIndex]();
    }
    activePostFlushCbs = null;
    postFlushIndex = 0;
  }
}
const getId = (job) => job.id == null ? Infinity : job.id;
const comparator = (a, b) => {
  const diff2 = getId(a) - getId(b);
  if (diff2 === 0) {
    if (a.pre && !b.pre)
      return -1;
    if (b.pre && !a.pre)
      return 1;
  }
  return diff2;
};
function flushJobs(seen) {
  isFlushPending = false;
  isFlushing = true;
  {
    seen = seen || /* @__PURE__ */ new Map();
  }
  queue.sort(comparator);
  const check = (job) => checkRecursiveUpdates(seen, job);
  try {
    for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
      const job = queue[flushIndex];
      if (job && job.active !== false) {
        if (check(job)) {
          continue;
        }
        callWithErrorHandling(job, null, 14);
      }
    }
  } finally {
    flushIndex = 0;
    queue.length = 0;
    flushPostFlushCbs(seen);
    isFlushing = false;
    currentFlushPromise = null;
    if (queue.length || pendingPostFlushCbs.length) {
      flushJobs(seen);
    }
  }
}
function checkRecursiveUpdates(seen, fn) {
  if (!seen.has(fn)) {
    seen.set(fn, 1);
  } else {
    const count = seen.get(fn);
    if (count > RECURSION_LIMIT) {
      const instance = fn.ownerInstance;
      const componentName = instance && getComponentName(instance.type);
      handleError(
        `Maximum recursive updates exceeded${componentName ? ` in component <${componentName}>` : ``}. This means you have a reactive effect that is mutating its own dependencies and thus recursively triggering itself. Possible sources include component template, render function, updated hook or watcher source function.`,
        null,
        10
      );
      return true;
    } else {
      seen.set(fn, count + 1);
    }
  }
}
let devtools;
let buffer = [];
let devtoolsNotInstalled = false;
function emit$1(event, ...args) {
  if (devtools) {
    devtools.emit(event, ...args);
  } else if (!devtoolsNotInstalled) {
    buffer.push({ event, args });
  }
}
function setDevtoolsHook(hook, target) {
  var _a2, _b;
  devtools = hook;
  if (devtools) {
    devtools.enabled = true;
    buffer.forEach(({ event, args }) => devtools.emit(event, ...args));
    buffer = [];
  } else if (
    // handle late devtools injection - only do this if we are in an actual
    // browser environment to avoid the timer handle stalling test runner exit
    // (#4815)
    typeof window !== "undefined" && // some envs mock window but not fully
    window.HTMLElement && // also exclude jsdom
    !((_b = (_a2 = window.navigator) == null ? void 0 : _a2.userAgent) == null ? void 0 : _b.includes("jsdom"))
  ) {
    const replay = target.__VUE_DEVTOOLS_HOOK_REPLAY__ = target.__VUE_DEVTOOLS_HOOK_REPLAY__ || [];
    replay.push((newHook) => {
      setDevtoolsHook(newHook, target);
    });
    setTimeout(() => {
      if (!devtools) {
        target.__VUE_DEVTOOLS_HOOK_REPLAY__ = null;
        devtoolsNotInstalled = true;
        buffer = [];
      }
    }, 3e3);
  } else {
    devtoolsNotInstalled = true;
    buffer = [];
  }
}
function devtoolsInitApp(app, version2) {
  emit$1("app:init", app, version2, {
    Fragment,
    Text: Text$1,
    Comment,
    Static
  });
}
const devtoolsComponentAdded = /* @__PURE__ */ createDevtoolsComponentHook(
  "component:added"
  /* COMPONENT_ADDED */
);
const devtoolsComponentUpdated = /* @__PURE__ */ createDevtoolsComponentHook(
  "component:updated"
  /* COMPONENT_UPDATED */
);
const _devtoolsComponentRemoved = /* @__PURE__ */ createDevtoolsComponentHook(
  "component:removed"
  /* COMPONENT_REMOVED */
);
const devtoolsComponentRemoved = (component) => {
  if (devtools && typeof devtools.cleanupBuffer === "function" && // remove the component if it wasn't buffered
  !devtools.cleanupBuffer(component)) {
    _devtoolsComponentRemoved(component);
  }
};
/*! #__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function createDevtoolsComponentHook(hook) {
  return (component) => {
    emit$1(
      hook,
      component.appContext.app,
      component.uid,
      // fixed by xxxxxx
      // 为 0 是 App，无 parent 是 Page 指向 App
      component.uid === 0 ? void 0 : component.parent ? component.parent.uid : 0,
      component
    );
  };
}
const devtoolsPerfStart = /* @__PURE__ */ createDevtoolsPerformanceHook(
  "perf:start"
  /* PERFORMANCE_START */
);
const devtoolsPerfEnd = /* @__PURE__ */ createDevtoolsPerformanceHook(
  "perf:end"
  /* PERFORMANCE_END */
);
function createDevtoolsPerformanceHook(hook) {
  return (component, type2, time) => {
    emit$1(hook, component.appContext.app, component.uid, component, type2, time);
  };
}
function devtoolsComponentEmit(component, event, params) {
  emit$1(
    "component:emit",
    component.appContext.app,
    component,
    event,
    params
  );
}
function emit(instance, event, ...rawArgs) {
  if (instance.isUnmounted)
    return;
  const props2 = instance.vnode.props || EMPTY_OBJ;
  {
    const {
      emitsOptions,
      propsOptions: [propsOptions]
    } = instance;
    if (emitsOptions) {
      if (!(event in emitsOptions) && true) {
        if (!propsOptions || !(toHandlerKey(event) in propsOptions)) {
          warn$1(
            `Component emitted event "${event}" but it is neither declared in the emits option nor as an "${toHandlerKey(event)}" prop.`
          );
        }
      } else {
        const validator = emitsOptions[event];
        if (isFunction(validator)) {
          const isValid = validator(...rawArgs);
          if (!isValid) {
            warn$1(
              `Invalid event arguments: event validation failed for event "${event}".`
            );
          }
        }
      }
    }
  }
  let args = rawArgs;
  const isModelListener2 = event.startsWith("update:");
  const modelArg = isModelListener2 && event.slice(7);
  if (modelArg && modelArg in props2) {
    const modifiersKey = `${modelArg === "modelValue" ? "model" : modelArg}Modifiers`;
    const { number: number2, trim: trim2 } = props2[modifiersKey] || EMPTY_OBJ;
    if (trim2) {
      args = rawArgs.map((a) => isString(a) ? a.trim() : a);
    }
    if (number2) {
      args = rawArgs.map(looseToNumber);
    }
  }
  {
    devtoolsComponentEmit(instance, event, args);
  }
  {
    const lowerCaseEvent = event.toLowerCase();
    if (lowerCaseEvent !== event && props2[toHandlerKey(lowerCaseEvent)]) {
      warn$1(
        `Event "${lowerCaseEvent}" is emitted in component ${formatComponentName(
          instance,
          instance.type
        )} but the handler is registered for "${event}". Note that HTML attributes are case-insensitive and you cannot use v-on to listen to camelCase events when using in-DOM templates. You should probably use "${hyphenate(
          event
        )}" instead of "${event}".`
      );
    }
  }
  let handlerName;
  let handler = props2[handlerName = toHandlerKey(event)] || // also try camelCase event handler (#2249)
  props2[handlerName = toHandlerKey(camelize(event))];
  if (!handler && isModelListener2) {
    handler = props2[handlerName = toHandlerKey(hyphenate(event))];
  }
  if (handler) {
    callWithAsyncErrorHandling(
      handler,
      instance,
      6,
      args
    );
  }
  const onceHandler = props2[handlerName + `Once`];
  if (onceHandler) {
    if (!instance.emitted) {
      instance.emitted = {};
    } else if (instance.emitted[handlerName]) {
      return;
    }
    instance.emitted[handlerName] = true;
    callWithAsyncErrorHandling(
      onceHandler,
      instance,
      6,
      args
    );
  }
}
function normalizeEmitsOptions(comp, appContext, asMixin = false) {
  const cache = appContext.emitsCache;
  const cached = cache.get(comp);
  if (cached !== void 0) {
    return cached;
  }
  const raw = comp.emits;
  let normalized = {};
  let hasExtends = false;
  if (!isFunction(comp)) {
    const extendEmits = (raw2) => {
      const normalizedFromExtend = normalizeEmitsOptions(raw2, appContext, true);
      if (normalizedFromExtend) {
        hasExtends = true;
        extend(normalized, normalizedFromExtend);
      }
    };
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendEmits);
    }
    if (comp.extends) {
      extendEmits(comp.extends);
    }
    if (comp.mixins) {
      comp.mixins.forEach(extendEmits);
    }
  }
  if (!raw && !hasExtends) {
    if (isObject$1(comp)) {
      cache.set(comp, null);
    }
    return null;
  }
  if (isArray$1(raw)) {
    raw.forEach((key) => normalized[key] = null);
  } else {
    extend(normalized, raw);
  }
  if (isObject$1(comp)) {
    cache.set(comp, normalized);
  }
  return normalized;
}
function isEmitListener(options, key) {
  if (!options || !isOn(key)) {
    return false;
  }
  key = key.slice(2).replace(/Once$/, "");
  return hasOwn(options, key[0].toLowerCase() + key.slice(1)) || hasOwn(options, hyphenate(key)) || hasOwn(options, key);
}
let currentRenderingInstance = null;
function setCurrentRenderingInstance(instance) {
  const prev = currentRenderingInstance;
  currentRenderingInstance = instance;
  instance && instance.type.__scopeId || null;
  return prev;
}
const COMPONENTS = "components";
function resolveComponent(name, maybeSelfReference) {
  return resolveAsset(COMPONENTS, name, true, maybeSelfReference) || name;
}
function resolveAsset(type2, name, warnMissing = true, maybeSelfReference = false) {
  const instance = currentRenderingInstance || currentInstance;
  if (instance) {
    const Component2 = instance.type;
    {
      const selfName = getComponentName(
        Component2,
        false
      );
      if (selfName && (selfName === name || selfName === camelize(name) || selfName === capitalize(camelize(name)))) {
        return Component2;
      }
    }
    const res = (
      // local registration
      // check instance[type] first which is resolved for options API
      resolve(instance[type2] || Component2[type2], name) || // global registration
      resolve(instance.appContext[type2], name)
    );
    if (!res && maybeSelfReference) {
      return Component2;
    }
    if (warnMissing && !res) {
      const extra = `
If this is a native custom element, make sure to exclude it from component resolution via compilerOptions.isCustomElement.`;
      warn$1(`Failed to resolve ${type2.slice(0, -1)}: ${name}${extra}`);
    }
    return res;
  } else {
    warn$1(
      `resolve${capitalize(type2.slice(0, -1))} can only be used in render() or setup().`
    );
  }
}
function resolve(registry, name) {
  return registry && (registry[name] || registry[camelize(name)] || registry[capitalize(camelize(name))]);
}
function watchSyncEffect(effect2, options) {
  return doWatch(
    effect2,
    null,
    extend({}, options, { flush: "sync" })
  );
}
const INITIAL_WATCHER_VALUE = {};
function watch(source, cb, options) {
  if (!isFunction(cb)) {
    warn$1(
      `\`watch(fn, options?)\` signature has been moved to a separate API. Use \`watchEffect(fn, options?)\` instead. \`watch\` now only supports \`watch(source, cb, options?) signature.`
    );
  }
  return doWatch(source, cb, options);
}
function doWatch(source, cb, {
  immediate,
  deep,
  flush,
  once: once2,
  onTrack,
  onTrigger
} = EMPTY_OBJ) {
  if (cb && once2) {
    const _cb = cb;
    cb = (...args) => {
      _cb(...args);
      unwatch();
    };
  }
  if (deep !== void 0 && typeof deep === "number") {
    warn$1(
      `watch() "deep" option with number value will be used as watch depth in future versions. Please use a boolean instead to avoid potential breakage.`
    );
  }
  if (!cb) {
    if (immediate !== void 0) {
      warn$1(
        `watch() "immediate" option is only respected when using the watch(source, callback, options?) signature.`
      );
    }
    if (deep !== void 0) {
      warn$1(
        `watch() "deep" option is only respected when using the watch(source, callback, options?) signature.`
      );
    }
    if (once2 !== void 0) {
      warn$1(
        `watch() "once" option is only respected when using the watch(source, callback, options?) signature.`
      );
    }
  }
  const warnInvalidSource = (s2) => {
    warn$1(
      `Invalid watch source: `,
      s2,
      `A watch source can only be a getter/effect function, a ref, a reactive object, or an array of these types.`
    );
  };
  const instance = currentInstance;
  const reactiveGetter = (source2) => deep === true ? source2 : (
    // for deep: false, only traverse root-level properties
    traverse(source2, deep === false ? 1 : void 0)
  );
  let getter;
  let forceTrigger = false;
  let isMultiSource = false;
  if (isRef(source)) {
    getter = () => source.value;
    forceTrigger = isShallow(source);
  } else if (isReactive(source)) {
    getter = () => reactiveGetter(source);
    forceTrigger = true;
  } else if (isArray$1(source)) {
    isMultiSource = true;
    forceTrigger = source.some((s2) => isReactive(s2) || isShallow(s2));
    getter = () => source.map((s2) => {
      if (isRef(s2)) {
        return s2.value;
      } else if (isReactive(s2)) {
        return reactiveGetter(s2);
      } else if (isFunction(s2)) {
        return callWithErrorHandling(s2, instance, 2);
      } else {
        warnInvalidSource(s2);
      }
    });
  } else if (isFunction(source)) {
    if (cb) {
      getter = () => callWithErrorHandling(source, instance, 2);
    } else {
      getter = () => {
        if (cleanup) {
          cleanup();
        }
        return callWithAsyncErrorHandling(
          source,
          instance,
          3,
          [onCleanup]
        );
      };
    }
  } else {
    getter = NOOP;
    warnInvalidSource(source);
  }
  if (cb && deep) {
    const baseGetter = getter;
    getter = () => traverse(baseGetter());
  }
  let cleanup;
  let onCleanup = (fn) => {
    cleanup = effect2.onStop = () => {
      callWithErrorHandling(fn, instance, 4);
      cleanup = effect2.onStop = void 0;
    };
  };
  let oldValue = isMultiSource ? new Array(source.length).fill(INITIAL_WATCHER_VALUE) : INITIAL_WATCHER_VALUE;
  const job = () => {
    if (!effect2.active || !effect2.dirty) {
      return;
    }
    if (cb) {
      const newValue = effect2.run();
      if (deep || forceTrigger || (isMultiSource ? newValue.some((v, i) => hasChanged(v, oldValue[i])) : hasChanged(newValue, oldValue)) || false) {
        if (cleanup) {
          cleanup();
        }
        callWithAsyncErrorHandling(cb, instance, 3, [
          newValue,
          // pass undefined as the old value when it's changed for the first time
          oldValue === INITIAL_WATCHER_VALUE ? void 0 : isMultiSource && oldValue[0] === INITIAL_WATCHER_VALUE ? [] : oldValue,
          onCleanup
        ]);
        oldValue = newValue;
      }
    } else {
      effect2.run();
    }
  };
  job.allowRecurse = !!cb;
  let scheduler;
  if (flush === "sync") {
    scheduler = job;
  } else if (flush === "post") {
    scheduler = () => queuePostRenderEffect$1(job, instance && instance.suspense);
  } else {
    job.pre = true;
    if (instance)
      job.id = instance.uid;
    scheduler = () => queueJob(job);
  }
  const effect2 = new ReactiveEffect(getter, NOOP, scheduler);
  const scope = getCurrentScope();
  const unwatch = () => {
    effect2.stop();
    if (scope) {
      remove(scope.effects, effect2);
    }
  };
  {
    effect2.onTrack = onTrack;
    effect2.onTrigger = onTrigger;
  }
  if (cb) {
    if (immediate) {
      job();
    } else {
      oldValue = effect2.run();
    }
  } else if (flush === "post") {
    queuePostRenderEffect$1(
      effect2.run.bind(effect2),
      instance && instance.suspense
    );
  } else {
    effect2.run();
  }
  return unwatch;
}
function instanceWatch(source, value2, options) {
  const publicThis = this.proxy;
  const getter = isString(source) ? source.includes(".") ? createPathGetter(publicThis, source) : () => publicThis[source] : source.bind(publicThis, publicThis);
  let cb;
  if (isFunction(value2)) {
    cb = value2;
  } else {
    cb = value2.handler;
    options = value2;
  }
  const reset = setCurrentInstance(this);
  const res = doWatch(getter, cb.bind(publicThis), options);
  reset();
  return res;
}
function createPathGetter(ctx, path) {
  const segments = path.split(".");
  return () => {
    let cur = ctx;
    for (let i = 0; i < segments.length && cur; i++) {
      cur = cur[segments[i]];
    }
    return cur;
  };
}
function traverse(value2, depth, currentDepth = 0, seen) {
  if (!isObject$1(value2) || value2["__v_skip"]) {
    return value2;
  }
  if (depth && depth > 0) {
    if (currentDepth >= depth) {
      return value2;
    }
    currentDepth++;
  }
  seen = seen || /* @__PURE__ */ new Set();
  if (seen.has(value2)) {
    return value2;
  }
  seen.add(value2);
  if (isRef(value2)) {
    traverse(value2.value, depth, currentDepth, seen);
  } else if (isArray$1(value2)) {
    for (let i = 0; i < value2.length; i++) {
      traverse(value2[i], depth, currentDepth, seen);
    }
  } else if (isSet(value2) || isMap(value2)) {
    value2.forEach((v) => {
      traverse(v, depth, currentDepth, seen);
    });
  } else if (isPlainObject$2(value2)) {
    for (const key in value2) {
      traverse(value2[key], depth, currentDepth, seen);
    }
  }
  return value2;
}
function validateDirectiveName(name) {
  if (isBuiltInDirective(name)) {
    warn$1("Do not use built-in directive ids as custom directive id: " + name);
  }
}
function createAppContext() {
  return {
    app: null,
    config: {
      isNativeTag: NO,
      performance: false,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: void 0,
      warnHandler: void 0,
      compilerOptions: {}
    },
    mixins: [],
    components: {},
    directives: {},
    provides: /* @__PURE__ */ Object.create(null),
    optionsCache: /* @__PURE__ */ new WeakMap(),
    propsCache: /* @__PURE__ */ new WeakMap(),
    emitsCache: /* @__PURE__ */ new WeakMap()
  };
}
let uid$1 = 0;
function createAppAPI(render, hydrate) {
  return function createApp2(rootComponent, rootProps = null) {
    if (!isFunction(rootComponent)) {
      rootComponent = extend({}, rootComponent);
    }
    if (rootProps != null && !isObject$1(rootProps)) {
      warn$1(`root props passed to app.mount() must be an object.`);
      rootProps = null;
    }
    const context = createAppContext();
    const installedPlugins = /* @__PURE__ */ new WeakSet();
    const app = context.app = {
      _uid: uid$1++,
      _component: rootComponent,
      _props: rootProps,
      _container: null,
      _context: context,
      _instance: null,
      version: version$1,
      get config() {
        return context.config;
      },
      set config(v) {
        {
          warn$1(
            `app.config cannot be replaced. Modify individual options instead.`
          );
        }
      },
      use(plugin2, ...options) {
        if (installedPlugins.has(plugin2)) {
          warn$1(`Plugin has already been applied to target app.`);
        } else if (plugin2 && isFunction(plugin2.install)) {
          installedPlugins.add(plugin2);
          plugin2.install(app, ...options);
        } else if (isFunction(plugin2)) {
          installedPlugins.add(plugin2);
          plugin2(app, ...options);
        } else {
          warn$1(
            `A plugin must either be a function or an object with an "install" function.`
          );
        }
        return app;
      },
      mixin(mixin2) {
        {
          if (!context.mixins.includes(mixin2)) {
            context.mixins.push(mixin2);
          } else {
            warn$1(
              "Mixin has already been applied to target app" + (mixin2.name ? `: ${mixin2.name}` : "")
            );
          }
        }
        return app;
      },
      component(name, component) {
        {
          validateComponentName(name, context.config);
        }
        if (!component) {
          return context.components[name];
        }
        if (context.components[name]) {
          warn$1(`Component "${name}" has already been registered in target app.`);
        }
        context.components[name] = component;
        return app;
      },
      directive(name, directive) {
        {
          validateDirectiveName(name);
        }
        if (!directive) {
          return context.directives[name];
        }
        if (context.directives[name]) {
          warn$1(`Directive "${name}" has already been registered in target app.`);
        }
        context.directives[name] = directive;
        return app;
      },
      // fixed by xxxxxx
      mount() {
      },
      // fixed by xxxxxx
      unmount() {
      },
      provide(key, value2) {
        if (key in context.provides) {
          warn$1(
            `App already provides property with key "${String(key)}". It will be overwritten with the new value.`
          );
        }
        context.provides[key] = value2;
        return app;
      },
      runWithContext(fn) {
        const lastApp = currentApp;
        currentApp = app;
        try {
          return fn();
        } finally {
          currentApp = lastApp;
        }
      }
    };
    return app;
  };
}
let currentApp = null;
function provide(key, value2) {
  if (!currentInstance) {
    {
      warn$1(`provide() can only be used inside setup().`);
    }
  } else {
    let provides = currentInstance.provides;
    const parentProvides = currentInstance.parent && currentInstance.parent.provides;
    if (parentProvides === provides) {
      provides = currentInstance.provides = Object.create(parentProvides);
    }
    provides[key] = value2;
    if (currentInstance.type.mpType === "app") {
      currentInstance.appContext.app.provide(key, value2);
    }
  }
}
function inject(key, defaultValue, treatDefaultAsFactory = false) {
  const instance = currentInstance || currentRenderingInstance;
  if (instance || currentApp) {
    const provides = instance ? instance.parent == null ? instance.vnode.appContext && instance.vnode.appContext.provides : instance.parent.provides : currentApp._context.provides;
    if (provides && key in provides) {
      return provides[key];
    } else if (arguments.length > 1) {
      return treatDefaultAsFactory && isFunction(defaultValue) ? defaultValue.call(instance && instance.proxy) : defaultValue;
    } else {
      warn$1(`injection "${String(key)}" not found.`);
    }
  } else {
    warn$1(`inject() can only be used inside setup() or functional components.`);
  }
}
function hasInjectionContext() {
  return !!(currentInstance || currentRenderingInstance || currentApp);
}
/*! #__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function defineComponent(options, extraOptions) {
  return isFunction(options) ? (
    // #8326: extend call and options.name access are considered side-effects
    // by Rollup, so we have to wrap it in a pure-annotated IIFE.
    /* @__PURE__ */ (() => extend({ name: options.name }, extraOptions, { setup: options }))()
  ) : options;
}
const isKeepAlive = (vnode) => vnode.type.__isKeepAlive;
function onActivated(hook, target) {
  registerKeepAliveHook(hook, "a", target);
}
function onDeactivated(hook, target) {
  registerKeepAliveHook(hook, "da", target);
}
function registerKeepAliveHook(hook, type2, target = currentInstance) {
  const wrappedHook = hook.__wdc || (hook.__wdc = () => {
    let current = target;
    while (current) {
      if (current.isDeactivated) {
        return;
      }
      current = current.parent;
    }
    return hook();
  });
  injectHook(type2, wrappedHook, target);
  if (target) {
    let current = target.parent;
    while (current && current.parent) {
      if (isKeepAlive(current.parent.vnode)) {
        injectToKeepAliveRoot(wrappedHook, type2, target, current);
      }
      current = current.parent;
    }
  }
}
function injectToKeepAliveRoot(hook, type2, target, keepAliveRoot) {
  const injected = injectHook(
    type2,
    hook,
    keepAliveRoot,
    true
    /* prepend */
  );
  onUnmounted(() => {
    remove(keepAliveRoot[type2], injected);
  }, target);
}
function injectHook(type2, hook, target = currentInstance, prepend = false) {
  if (target) {
    if (isRootHook(type2)) {
      target = target.root;
    }
    const hooks = target[type2] || (target[type2] = []);
    const wrappedHook = hook.__weh || (hook.__weh = (...args) => {
      if (target.isUnmounted) {
        return;
      }
      pauseTracking();
      const reset = setCurrentInstance(target);
      const res = callWithAsyncErrorHandling(hook, target, type2, args);
      reset();
      resetTracking();
      return res;
    });
    if (prepend) {
      hooks.unshift(wrappedHook);
    } else {
      hooks.push(wrappedHook);
    }
    return wrappedHook;
  } else {
    const apiName = toHandlerKey(
      (ErrorTypeStrings[type2] || type2.replace(/^on/, "")).replace(/ hook$/, "")
    );
    warn$1(
      `${apiName} is called when there is no active component instance to be associated with. Lifecycle injection APIs can only be used during execution of setup().`
    );
  }
}
const createHook$1 = (lifecycle) => (hook, target = currentInstance) => (
  // post-create lifecycle registrations are noops during SSR (except for serverPrefetch)
  (!isInSSRComponentSetup || lifecycle === "sp") && injectHook(lifecycle, (...args) => hook(...args), target)
);
const onBeforeMount = createHook$1("bm");
const onMounted = createHook$1("m");
const onBeforeUpdate = createHook$1("bu");
const onUpdated = createHook$1("u");
const onBeforeUnmount = createHook$1("bum");
const onUnmounted = createHook$1("um");
const onServerPrefetch = createHook$1("sp");
const onRenderTriggered = createHook$1(
  "rtg"
);
const onRenderTracked = createHook$1(
  "rtc"
);
function onErrorCaptured(hook, target = currentInstance) {
  injectHook("ec", hook, target);
}
const getPublicInstance = (i) => {
  if (!i)
    return null;
  if (isStatefulComponent(i))
    return getExposeProxy(i) || i.proxy;
  return getPublicInstance(i.parent);
};
const publicPropertiesMap = (
  // Move PURE marker to new line to workaround compiler discarding it
  // due to type annotation
  /* @__PURE__ */ extend(/* @__PURE__ */ Object.create(null), {
    $: (i) => i,
    // fixed by xxxxxx vue-i18n 在 dev 模式，访问了 $el，故模拟一个假的
    // $el: i => i.vnode.el,
    $el: (i) => i.__$el || (i.__$el = {}),
    $data: (i) => i.data,
    $props: (i) => shallowReadonly(i.props),
    $attrs: (i) => shallowReadonly(i.attrs),
    $slots: (i) => shallowReadonly(i.slots),
    $refs: (i) => shallowReadonly(i.refs),
    $parent: (i) => getPublicInstance(i.parent),
    $root: (i) => getPublicInstance(i.root),
    $emit: (i) => i.emit,
    $options: (i) => resolveMergedOptions(i),
    $forceUpdate: (i) => i.f || (i.f = () => {
      i.effect.dirty = true;
      queueJob(i.update);
    }),
    // $nextTick: i => i.n || (i.n = nextTick.bind(i.proxy!)),// fixed by xxxxxx
    $watch: (i) => instanceWatch.bind(i)
  })
);
const isReservedPrefix = (key) => key === "_" || key === "$";
const hasSetupBinding = (state, key) => state !== EMPTY_OBJ && !state.__isScriptSetup && hasOwn(state, key);
const PublicInstanceProxyHandlers = {
  get({ _: instance }, key) {
    const { ctx, setupState, data, props: props2, accessCache, type: type2, appContext } = instance;
    if (key === "__isVue") {
      return true;
    }
    let normalizedProps;
    if (key[0] !== "$") {
      const n2 = accessCache[key];
      if (n2 !== void 0) {
        switch (n2) {
          case 1:
            return setupState[key];
          case 2:
            return data[key];
          case 4:
            return ctx[key];
          case 3:
            return props2[key];
        }
      } else if (hasSetupBinding(setupState, key)) {
        accessCache[key] = 1;
        return setupState[key];
      } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
        accessCache[key] = 2;
        return data[key];
      } else if (
        // only cache other properties when instance has declared (thus stable)
        // props
        (normalizedProps = instance.propsOptions[0]) && hasOwn(normalizedProps, key)
      ) {
        accessCache[key] = 3;
        return props2[key];
      } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
        accessCache[key] = 4;
        return ctx[key];
      } else if (shouldCacheAccess) {
        accessCache[key] = 0;
      }
    }
    const publicGetter = publicPropertiesMap[key];
    let cssModule, globalProperties;
    if (publicGetter) {
      if (key === "$attrs") {
        track(instance, "get", key);
      } else if (key === "$slots") {
        track(instance, "get", key);
      }
      return publicGetter(instance);
    } else if (
      // css module (injected by vue-loader)
      (cssModule = type2.__cssModules) && (cssModule = cssModule[key])
    ) {
      return cssModule;
    } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
      accessCache[key] = 4;
      return ctx[key];
    } else if (
      // global properties
      globalProperties = appContext.config.globalProperties, hasOwn(globalProperties, key)
    ) {
      {
        return globalProperties[key];
      }
    } else if (currentRenderingInstance && (!isString(key) || // #1091 avoid internal isRef/isVNode checks on component instance leading
    // to infinite warning loop
    key.indexOf("__v") !== 0)) {
      if (data !== EMPTY_OBJ && isReservedPrefix(key[0]) && hasOwn(data, key)) {
        warn$1(
          `Property ${JSON.stringify(
            key
          )} must be accessed via $data because it starts with a reserved character ("$" or "_") and is not proxied on the render context.`
        );
      } else if (instance === currentRenderingInstance) {
        warn$1(
          `Property ${JSON.stringify(key)} was accessed during render but is not defined on instance.`
        );
      }
    }
  },
  set({ _: instance }, key, value2) {
    const { data, setupState, ctx } = instance;
    if (hasSetupBinding(setupState, key)) {
      setupState[key] = value2;
      return true;
    } else if (setupState.__isScriptSetup && hasOwn(setupState, key)) {
      warn$1(`Cannot mutate <script setup> binding "${key}" from Options API.`);
      return false;
    } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
      data[key] = value2;
      return true;
    } else if (hasOwn(instance.props, key)) {
      warn$1(`Attempting to mutate prop "${key}". Props are readonly.`);
      return false;
    }
    if (key[0] === "$" && key.slice(1) in instance) {
      warn$1(
        `Attempting to mutate public property "${key}". Properties starting with $ are reserved and readonly.`
      );
      return false;
    } else {
      if (key in instance.appContext.config.globalProperties) {
        Object.defineProperty(ctx, key, {
          enumerable: true,
          configurable: true,
          value: value2
        });
      } else {
        ctx[key] = value2;
      }
    }
    return true;
  },
  has({
    _: { data, setupState, accessCache, ctx, appContext, propsOptions }
  }, key) {
    let normalizedProps;
    return !!accessCache[key] || data !== EMPTY_OBJ && hasOwn(data, key) || hasSetupBinding(setupState, key) || (normalizedProps = propsOptions[0]) && hasOwn(normalizedProps, key) || hasOwn(ctx, key) || hasOwn(publicPropertiesMap, key) || hasOwn(appContext.config.globalProperties, key);
  },
  defineProperty(target, key, descriptor) {
    if (descriptor.get != null) {
      target._.accessCache[key] = 0;
    } else if (hasOwn(descriptor, "value")) {
      this.set(target, key, descriptor.value, null);
    }
    return Reflect.defineProperty(target, key, descriptor);
  }
};
{
  PublicInstanceProxyHandlers.ownKeys = (target) => {
    warn$1(
      `Avoid app logic that relies on enumerating keys on a component instance. The keys will be empty in production mode to avoid performance overhead.`
    );
    return Reflect.ownKeys(target);
  };
}
function createDevRenderContext(instance) {
  const target = {};
  Object.defineProperty(target, `_`, {
    configurable: true,
    enumerable: false,
    get: () => instance
  });
  Object.keys(publicPropertiesMap).forEach((key) => {
    Object.defineProperty(target, key, {
      configurable: true,
      enumerable: false,
      get: () => publicPropertiesMap[key](instance),
      // intercepted by the proxy so no need for implementation,
      // but needed to prevent set errors
      set: NOOP
    });
  });
  return target;
}
function exposePropsOnRenderContext(instance) {
  const {
    ctx,
    propsOptions: [propsOptions]
  } = instance;
  if (propsOptions) {
    Object.keys(propsOptions).forEach((key) => {
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => instance.props[key],
        set: NOOP
      });
    });
  }
}
function exposeSetupStateOnRenderContext(instance) {
  const { ctx, setupState } = instance;
  Object.keys(toRaw(setupState)).forEach((key) => {
    if (!setupState.__isScriptSetup) {
      if (isReservedPrefix(key[0])) {
        warn$1(
          `setup() return property ${JSON.stringify(
            key
          )} should not start with "$" or "_" which are reserved prefixes for Vue internals.`
        );
        return;
      }
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => setupState[key],
        set: NOOP
      });
    }
  });
}
function useSlots() {
  return getContext().slots;
}
function getContext() {
  const i = getCurrentInstance();
  if (!i) {
    warn$1(`useContext() called without active instance.`);
  }
  return i.setupContext || (i.setupContext = createSetupContext(i));
}
function normalizePropsOrEmits(props2) {
  return isArray$1(props2) ? props2.reduce(
    (normalized, p2) => (normalized[p2] = null, normalized),
    {}
  ) : props2;
}
function mergeModels(a, b) {
  if (!a || !b)
    return a || b;
  if (isArray$1(a) && isArray$1(b))
    return a.concat(b);
  return extend({}, normalizePropsOrEmits(a), normalizePropsOrEmits(b));
}
function createDuplicateChecker() {
  const cache = /* @__PURE__ */ Object.create(null);
  return (type2, key) => {
    if (cache[key]) {
      warn$1(`${type2} property "${key}" is already defined in ${cache[key]}.`);
    } else {
      cache[key] = type2;
    }
  };
}
let shouldCacheAccess = true;
function applyOptions$1(instance) {
  const options = resolveMergedOptions(instance);
  const publicThis = instance.proxy;
  const ctx = instance.ctx;
  shouldCacheAccess = false;
  if (options.beforeCreate) {
    callHook$1(options.beforeCreate, instance, "bc");
  }
  const {
    // state
    data: dataOptions,
    computed: computedOptions,
    methods,
    watch: watchOptions,
    provide: provideOptions,
    inject: injectOptions,
    // lifecycle
    created,
    beforeMount,
    mounted,
    beforeUpdate,
    updated,
    activated,
    deactivated,
    beforeDestroy,
    beforeUnmount,
    destroyed,
    unmounted,
    render,
    renderTracked,
    renderTriggered,
    errorCaptured,
    serverPrefetch,
    // public API
    expose,
    inheritAttrs,
    // assets
    components,
    directives,
    filters
  } = options;
  const checkDuplicateProperties = createDuplicateChecker();
  {
    const [propsOptions] = instance.propsOptions;
    if (propsOptions) {
      for (const key in propsOptions) {
        checkDuplicateProperties("Props", key);
      }
    }
  }
  function initInjections() {
    if (injectOptions) {
      resolveInjections(injectOptions, ctx, checkDuplicateProperties);
    }
  }
  {
    initInjections();
  }
  if (methods) {
    for (const key in methods) {
      const methodHandler = methods[key];
      if (isFunction(methodHandler)) {
        {
          Object.defineProperty(ctx, key, {
            value: methodHandler.bind(publicThis),
            configurable: true,
            enumerable: true,
            writable: true
          });
        }
        {
          checkDuplicateProperties("Methods", key);
        }
      } else {
        warn$1(
          `Method "${key}" has type "${typeof methodHandler}" in the component definition. Did you reference the function correctly?`
        );
      }
    }
  }
  if (dataOptions) {
    if (!isFunction(dataOptions)) {
      warn$1(
        `The data option must be a function. Plain object usage is no longer supported.`
      );
    }
    const data = dataOptions.call(publicThis, publicThis);
    if (isPromise(data)) {
      warn$1(
        `data() returned a Promise - note data() cannot be async; If you intend to perform data fetching before component renders, use async setup() + <Suspense>.`
      );
    }
    if (!isObject$1(data)) {
      warn$1(`data() should return an object.`);
    } else {
      instance.data = reactive(data);
      {
        for (const key in data) {
          checkDuplicateProperties("Data", key);
          if (!isReservedPrefix(key[0])) {
            Object.defineProperty(ctx, key, {
              configurable: true,
              enumerable: true,
              get: () => data[key],
              set: NOOP
            });
          }
        }
      }
    }
  }
  shouldCacheAccess = true;
  if (computedOptions) {
    for (const key in computedOptions) {
      const opt = computedOptions[key];
      const get2 = isFunction(opt) ? opt.bind(publicThis, publicThis) : isFunction(opt.get) ? opt.get.bind(publicThis, publicThis) : NOOP;
      if (get2 === NOOP) {
        warn$1(`Computed property "${key}" has no getter.`);
      }
      const set2 = !isFunction(opt) && isFunction(opt.set) ? opt.set.bind(publicThis) : () => {
        warn$1(
          `Write operation failed: computed property "${key}" is readonly.`
        );
      };
      const c2 = computed({
        get: get2,
        set: set2
      });
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => c2.value,
        set: (v) => c2.value = v
      });
      {
        checkDuplicateProperties("Computed", key);
      }
    }
  }
  if (watchOptions) {
    for (const key in watchOptions) {
      createWatcher(watchOptions[key], ctx, publicThis, key);
    }
  }
  function initProvides() {
    if (provideOptions) {
      const provides = isFunction(provideOptions) ? provideOptions.call(publicThis) : provideOptions;
      Reflect.ownKeys(provides).forEach((key) => {
        provide(key, provides[key]);
      });
    }
  }
  {
    initProvides();
  }
  {
    if (created) {
      callHook$1(created, instance, "c");
    }
  }
  function registerLifecycleHook(register, hook) {
    if (isArray$1(hook)) {
      hook.forEach((_hook) => register(_hook.bind(publicThis)));
    } else if (hook) {
      register(hook.bind(publicThis));
    }
  }
  registerLifecycleHook(onBeforeMount, beforeMount);
  registerLifecycleHook(onMounted, mounted);
  registerLifecycleHook(onBeforeUpdate, beforeUpdate);
  registerLifecycleHook(onUpdated, updated);
  registerLifecycleHook(onActivated, activated);
  registerLifecycleHook(onDeactivated, deactivated);
  registerLifecycleHook(onErrorCaptured, errorCaptured);
  registerLifecycleHook(onRenderTracked, renderTracked);
  registerLifecycleHook(onRenderTriggered, renderTriggered);
  registerLifecycleHook(onBeforeUnmount, beforeUnmount);
  registerLifecycleHook(onUnmounted, unmounted);
  registerLifecycleHook(onServerPrefetch, serverPrefetch);
  if (isArray$1(expose)) {
    if (expose.length) {
      const exposed = instance.exposed || (instance.exposed = {});
      expose.forEach((key) => {
        Object.defineProperty(exposed, key, {
          get: () => publicThis[key],
          set: (val) => publicThis[key] = val
        });
      });
    } else if (!instance.exposed) {
      instance.exposed = {};
    }
  }
  if (render && instance.render === NOOP) {
    instance.render = render;
  }
  if (inheritAttrs != null) {
    instance.inheritAttrs = inheritAttrs;
  }
  if (components)
    instance.components = components;
  if (directives)
    instance.directives = directives;
  if (instance.ctx.$onApplyOptions) {
    instance.ctx.$onApplyOptions(options, instance, publicThis);
  }
}
function resolveInjections(injectOptions, ctx, checkDuplicateProperties = NOOP) {
  if (isArray$1(injectOptions)) {
    injectOptions = normalizeInject(injectOptions);
  }
  for (const key in injectOptions) {
    const opt = injectOptions[key];
    let injected;
    if (isObject$1(opt)) {
      if ("default" in opt) {
        injected = inject(
          opt.from || key,
          opt.default,
          true
        );
      } else {
        injected = inject(opt.from || key);
      }
    } else {
      injected = inject(opt);
    }
    if (isRef(injected)) {
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => injected.value,
        set: (v) => injected.value = v
      });
    } else {
      ctx[key] = injected;
    }
    {
      checkDuplicateProperties("Inject", key);
    }
  }
}
function callHook$1(hook, instance, type2) {
  callWithAsyncErrorHandling(
    isArray$1(hook) ? hook.map((h2) => h2.bind(instance.proxy)) : hook.bind(instance.proxy),
    instance,
    type2
  );
}
function createWatcher(raw, ctx, publicThis, key) {
  const getter = key.includes(".") ? createPathGetter(publicThis, key) : () => publicThis[key];
  if (isString(raw)) {
    const handler = ctx[raw];
    if (isFunction(handler)) {
      watch(getter, handler);
    } else {
      warn$1(`Invalid watch handler specified by key "${raw}"`, handler);
    }
  } else if (isFunction(raw)) {
    watch(getter, raw.bind(publicThis));
  } else if (isObject$1(raw)) {
    if (isArray$1(raw)) {
      raw.forEach((r2) => createWatcher(r2, ctx, publicThis, key));
    } else {
      const handler = isFunction(raw.handler) ? raw.handler.bind(publicThis) : ctx[raw.handler];
      if (isFunction(handler)) {
        watch(getter, handler, raw);
      } else {
        warn$1(`Invalid watch handler specified by key "${raw.handler}"`, handler);
      }
    }
  } else {
    warn$1(`Invalid watch option: "${key}"`, raw);
  }
}
function resolveMergedOptions(instance) {
  const base = instance.type;
  const { mixins, extends: extendsOptions } = base;
  const {
    mixins: globalMixins,
    optionsCache: cache,
    config: { optionMergeStrategies }
  } = instance.appContext;
  const cached = cache.get(base);
  let resolved;
  if (cached) {
    resolved = cached;
  } else if (!globalMixins.length && !mixins && !extendsOptions) {
    {
      resolved = base;
    }
  } else {
    resolved = {};
    if (globalMixins.length) {
      globalMixins.forEach(
        (m2) => mergeOptions(resolved, m2, optionMergeStrategies, true)
      );
    }
    mergeOptions(resolved, base, optionMergeStrategies);
  }
  if (isObject$1(base)) {
    cache.set(base, resolved);
  }
  return resolved;
}
function mergeOptions(to, from, strats, asMixin = false) {
  const { mixins, extends: extendsOptions } = from;
  if (extendsOptions) {
    mergeOptions(to, extendsOptions, strats, true);
  }
  if (mixins) {
    mixins.forEach(
      (m2) => mergeOptions(to, m2, strats, true)
    );
  }
  for (const key in from) {
    if (asMixin && key === "expose") {
      warn$1(
        `"expose" option is ignored when declared in mixins or extends. It should only be declared in the base component itself.`
      );
    } else {
      const strat = internalOptionMergeStrats[key] || strats && strats[key];
      to[key] = strat ? strat(to[key], from[key]) : from[key];
    }
  }
  return to;
}
const internalOptionMergeStrats = {
  data: mergeDataFn,
  props: mergeEmitsOrPropsOptions,
  emits: mergeEmitsOrPropsOptions,
  // objects
  methods: mergeObjectOptions,
  computed: mergeObjectOptions,
  // lifecycle
  beforeCreate: mergeAsArray$1,
  created: mergeAsArray$1,
  beforeMount: mergeAsArray$1,
  mounted: mergeAsArray$1,
  beforeUpdate: mergeAsArray$1,
  updated: mergeAsArray$1,
  beforeDestroy: mergeAsArray$1,
  beforeUnmount: mergeAsArray$1,
  destroyed: mergeAsArray$1,
  unmounted: mergeAsArray$1,
  activated: mergeAsArray$1,
  deactivated: mergeAsArray$1,
  errorCaptured: mergeAsArray$1,
  serverPrefetch: mergeAsArray$1,
  // assets
  components: mergeObjectOptions,
  directives: mergeObjectOptions,
  // watch
  watch: mergeWatchOptions,
  // provide / inject
  provide: mergeDataFn,
  inject: mergeInject
};
function mergeDataFn(to, from) {
  if (!from) {
    return to;
  }
  if (!to) {
    return from;
  }
  return function mergedDataFn() {
    return extend(
      isFunction(to) ? to.call(this, this) : to,
      isFunction(from) ? from.call(this, this) : from
    );
  };
}
function mergeInject(to, from) {
  return mergeObjectOptions(normalizeInject(to), normalizeInject(from));
}
function normalizeInject(raw) {
  if (isArray$1(raw)) {
    const res = {};
    for (let i = 0; i < raw.length; i++) {
      res[raw[i]] = raw[i];
    }
    return res;
  }
  return raw;
}
function mergeAsArray$1(to, from) {
  return to ? [...new Set([].concat(to, from))] : from;
}
function mergeObjectOptions(to, from) {
  return to ? extend(/* @__PURE__ */ Object.create(null), to, from) : from;
}
function mergeEmitsOrPropsOptions(to, from) {
  if (to) {
    if (isArray$1(to) && isArray$1(from)) {
      return [.../* @__PURE__ */ new Set([...to, ...from])];
    }
    return extend(
      /* @__PURE__ */ Object.create(null),
      normalizePropsOrEmits(to),
      normalizePropsOrEmits(from != null ? from : {})
    );
  } else {
    return from;
  }
}
function mergeWatchOptions(to, from) {
  if (!to)
    return from;
  if (!from)
    return to;
  const merged = extend(/* @__PURE__ */ Object.create(null), to);
  for (const key in from) {
    merged[key] = mergeAsArray$1(to[key], from[key]);
  }
  return merged;
}
function initProps$1(instance, rawProps, isStateful, isSSR = false) {
  const props2 = {};
  const attrs = {};
  instance.propsDefaults = /* @__PURE__ */ Object.create(null);
  setFullProps(instance, rawProps, props2, attrs);
  for (const key in instance.propsOptions[0]) {
    if (!(key in props2)) {
      props2[key] = void 0;
    }
  }
  {
    validateProps(rawProps || {}, props2, instance);
  }
  if (isStateful) {
    instance.props = isSSR ? props2 : shallowReactive(props2);
  } else {
    if (!instance.type.props) {
      instance.props = attrs;
    } else {
      instance.props = props2;
    }
  }
  instance.attrs = attrs;
}
function isInHmrContext(instance) {
}
function updateProps(instance, rawProps, rawPrevProps, optimized) {
  const {
    props: props2,
    attrs,
    vnode: { patchFlag }
  } = instance;
  const rawCurrentProps = toRaw(props2);
  const [options] = instance.propsOptions;
  let hasAttrsChanged = false;
  if (
    // always force full diff in dev
    // - #1942 if hmr is enabled with sfc component
    // - vite#872 non-sfc component used by sfc component
    !isInHmrContext() && patchFlag > 0 && !(patchFlag & 16)
  ) {
    if (patchFlag & 8) {
      const propsToUpdate = instance.vnode.dynamicProps;
      for (let i = 0; i < propsToUpdate.length; i++) {
        let key = propsToUpdate[i];
        if (isEmitListener(instance.emitsOptions, key)) {
          continue;
        }
        const value2 = rawProps[key];
        if (options) {
          if (hasOwn(attrs, key)) {
            if (value2 !== attrs[key]) {
              attrs[key] = value2;
              hasAttrsChanged = true;
            }
          } else {
            const camelizedKey = camelize(key);
            props2[camelizedKey] = resolvePropValue$1(
              options,
              rawCurrentProps,
              camelizedKey,
              value2,
              instance,
              false
            );
          }
        } else {
          if (value2 !== attrs[key]) {
            attrs[key] = value2;
            hasAttrsChanged = true;
          }
        }
      }
    }
  } else {
    if (setFullProps(instance, rawProps, props2, attrs)) {
      hasAttrsChanged = true;
    }
    let kebabKey;
    for (const key in rawCurrentProps) {
      if (!rawProps || // for camelCase
      !hasOwn(rawProps, key) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((kebabKey = hyphenate(key)) === key || !hasOwn(rawProps, kebabKey))) {
        if (options) {
          if (rawPrevProps && // for camelCase
          (rawPrevProps[key] !== void 0 || // for kebab-case
          rawPrevProps[kebabKey] !== void 0)) {
            props2[key] = resolvePropValue$1(
              options,
              rawCurrentProps,
              key,
              void 0,
              instance,
              true
            );
          }
        } else {
          delete props2[key];
        }
      }
    }
    if (attrs !== rawCurrentProps) {
      for (const key in attrs) {
        if (!rawProps || !hasOwn(rawProps, key) && true) {
          delete attrs[key];
          hasAttrsChanged = true;
        }
      }
    }
  }
  if (hasAttrsChanged) {
    trigger(instance, "set", "$attrs");
  }
  {
    validateProps(rawProps || {}, props2, instance);
  }
}
function setFullProps(instance, rawProps, props2, attrs) {
  const [options, needCastKeys] = instance.propsOptions;
  let hasAttrsChanged = false;
  let rawCastValues;
  if (rawProps) {
    for (let key in rawProps) {
      if (isReservedProp(key)) {
        continue;
      }
      const value2 = rawProps[key];
      let camelKey;
      if (options && hasOwn(options, camelKey = camelize(key))) {
        if (!needCastKeys || !needCastKeys.includes(camelKey)) {
          props2[camelKey] = value2;
        } else {
          (rawCastValues || (rawCastValues = {}))[camelKey] = value2;
        }
      } else if (!isEmitListener(instance.emitsOptions, key)) {
        if (!(key in attrs) || value2 !== attrs[key]) {
          attrs[key] = value2;
          hasAttrsChanged = true;
        }
      }
    }
  }
  if (needCastKeys) {
    const rawCurrentProps = toRaw(props2);
    const castValues = rawCastValues || EMPTY_OBJ;
    for (let i = 0; i < needCastKeys.length; i++) {
      const key = needCastKeys[i];
      props2[key] = resolvePropValue$1(
        options,
        rawCurrentProps,
        key,
        castValues[key],
        instance,
        !hasOwn(castValues, key)
      );
    }
  }
  return hasAttrsChanged;
}
function resolvePropValue$1(options, props2, key, value2, instance, isAbsent) {
  const opt = options[key];
  if (opt != null) {
    const hasDefault = hasOwn(opt, "default");
    if (hasDefault && value2 === void 0) {
      const defaultValue = opt.default;
      if (opt.type !== Function && !opt.skipFactory && isFunction(defaultValue)) {
        const { propsDefaults } = instance;
        if (key in propsDefaults) {
          value2 = propsDefaults[key];
        } else {
          const reset = setCurrentInstance(instance);
          value2 = propsDefaults[key] = defaultValue.call(
            null,
            props2
          );
          reset();
        }
      } else {
        value2 = defaultValue;
      }
    }
    if (opt[
      0
      /* shouldCast */
    ]) {
      if (isAbsent && !hasDefault) {
        value2 = false;
      } else if (opt[
        1
        /* shouldCastTrue */
      ] && (value2 === "" || value2 === hyphenate(key))) {
        value2 = true;
      }
    }
  }
  return value2;
}
function normalizePropsOptions(comp, appContext, asMixin = false) {
  const cache = appContext.propsCache;
  const cached = cache.get(comp);
  if (cached) {
    return cached;
  }
  const raw = comp.props;
  const normalized = {};
  const needCastKeys = [];
  let hasExtends = false;
  if (!isFunction(comp)) {
    const extendProps = (raw2) => {
      hasExtends = true;
      const [props2, keys] = normalizePropsOptions(raw2, appContext, true);
      extend(normalized, props2);
      if (keys)
        needCastKeys.push(...keys);
    };
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendProps);
    }
    if (comp.extends) {
      extendProps(comp.extends);
    }
    if (comp.mixins) {
      comp.mixins.forEach(extendProps);
    }
  }
  if (!raw && !hasExtends) {
    if (isObject$1(comp)) {
      cache.set(comp, EMPTY_ARR);
    }
    return EMPTY_ARR;
  }
  if (isArray$1(raw)) {
    for (let i = 0; i < raw.length; i++) {
      if (!isString(raw[i])) {
        warn$1(`props must be strings when using array syntax.`, raw[i]);
      }
      const normalizedKey = camelize(raw[i]);
      if (validatePropName(normalizedKey)) {
        normalized[normalizedKey] = EMPTY_OBJ;
      }
    }
  } else if (raw) {
    if (!isObject$1(raw)) {
      warn$1(`invalid props options`, raw);
    }
    for (const key in raw) {
      const normalizedKey = camelize(key);
      if (validatePropName(normalizedKey)) {
        const opt = raw[key];
        const prop = normalized[normalizedKey] = isArray$1(opt) || isFunction(opt) ? { type: opt } : extend({}, opt);
        if (prop) {
          const booleanIndex = getTypeIndex(Boolean, prop.type);
          const stringIndex = getTypeIndex(String, prop.type);
          prop[
            0
            /* shouldCast */
          ] = booleanIndex > -1;
          prop[
            1
            /* shouldCastTrue */
          ] = stringIndex < 0 || booleanIndex < stringIndex;
          if (booleanIndex > -1 || hasOwn(prop, "default")) {
            needCastKeys.push(normalizedKey);
          }
        }
      }
    }
  }
  const res = [normalized, needCastKeys];
  if (isObject$1(comp)) {
    cache.set(comp, res);
  }
  return res;
}
function validatePropName(key) {
  if (key[0] !== "$" && !isReservedProp(key)) {
    return true;
  } else {
    warn$1(`Invalid prop name: "${key}" is a reserved property.`);
  }
  return false;
}
function getType(ctor) {
  if (ctor === null) {
    return "null";
  }
  if (typeof ctor === "function") {
    return ctor.name || "";
  } else if (typeof ctor === "object") {
    const name = ctor.constructor && ctor.constructor.name;
    return name || "";
  }
  return "";
}
function isSameType(a, b) {
  return getType(a) === getType(b);
}
function getTypeIndex(type2, expectedTypes) {
  if (isArray$1(expectedTypes)) {
    return expectedTypes.findIndex((t2) => isSameType(t2, type2));
  } else if (isFunction(expectedTypes)) {
    return isSameType(expectedTypes, type2) ? 0 : -1;
  }
  return -1;
}
function validateProps(rawProps, props2, instance) {
  const resolvedValues = toRaw(props2);
  const options = instance.propsOptions[0];
  for (const key in options) {
    let opt = options[key];
    if (opt == null)
      continue;
    validateProp(
      key,
      resolvedValues[key],
      opt,
      shallowReadonly(resolvedValues),
      !hasOwn(rawProps, key) && !hasOwn(rawProps, hyphenate(key))
    );
  }
}
function validateProp(name, value2, prop, props2, isAbsent) {
  const { type: type2, required: required2, validator, skipCheck } = prop;
  if (required2 && isAbsent) {
    warn$1('Missing required prop: "' + name + '"');
    return;
  }
  if (value2 == null && !required2) {
    return;
  }
  if (type2 != null && type2 !== true && !skipCheck) {
    let isValid = false;
    const types2 = isArray$1(type2) ? type2 : [type2];
    const expectedTypes = [];
    for (let i = 0; i < types2.length && !isValid; i++) {
      const { valid, expectedType } = assertType(value2, types2[i]);
      expectedTypes.push(expectedType || "");
      isValid = valid;
    }
    if (!isValid) {
      warn$1(getInvalidTypeMessage(name, value2, expectedTypes));
      return;
    }
  }
  if (validator && !validator(value2, props2)) {
    warn$1('Invalid prop: custom validator check failed for prop "' + name + '".');
  }
}
const isSimpleType = /* @__PURE__ */ makeMap(
  "String,Number,Boolean,Function,Symbol,BigInt"
);
function assertType(value2, type2) {
  let valid;
  const expectedType = getType(type2);
  if (isSimpleType(expectedType)) {
    const t2 = typeof value2;
    valid = t2 === expectedType.toLowerCase();
    if (!valid && t2 === "object") {
      valid = value2 instanceof type2;
    }
  } else if (expectedType === "Object") {
    valid = isObject$1(value2);
  } else if (expectedType === "Array") {
    valid = isArray$1(value2);
  } else if (expectedType === "null") {
    valid = value2 === null;
  } else {
    valid = value2 instanceof type2;
  }
  return {
    valid,
    expectedType
  };
}
function getInvalidTypeMessage(name, value2, expectedTypes) {
  if (expectedTypes.length === 0) {
    return `Prop type [] for prop "${name}" won't match anything. Did you mean to use type Array instead?`;
  }
  let message = `Invalid prop: type check failed for prop "${name}". Expected ${expectedTypes.map(capitalize).join(" | ")}`;
  const expectedType = expectedTypes[0];
  const receivedType = toRawType(value2);
  const expectedValue = styleValue(value2, expectedType);
  const receivedValue = styleValue(value2, receivedType);
  if (expectedTypes.length === 1 && isExplicable(expectedType) && !isBoolean$2(expectedType, receivedType)) {
    message += ` with value ${expectedValue}`;
  }
  message += `, got ${receivedType} `;
  if (isExplicable(receivedType)) {
    message += `with value ${receivedValue}.`;
  }
  return message;
}
function styleValue(value2, type2) {
  if (type2 === "String") {
    return `"${value2}"`;
  } else if (type2 === "Number") {
    return `${Number(value2)}`;
  } else {
    return `${value2}`;
  }
}
function isExplicable(type2) {
  const explicitTypes = ["string", "number", "boolean"];
  return explicitTypes.some((elem) => type2.toLowerCase() === elem);
}
function isBoolean$2(...args) {
  return args.some((elem) => elem.toLowerCase() === "boolean");
}
let supported;
let perf;
function startMeasure(instance, type2) {
  if (instance.appContext.config.performance && isSupported()) {
    perf.mark(`vue-${type2}-${instance.uid}`);
  }
  {
    devtoolsPerfStart(instance, type2, isSupported() ? perf.now() : Date.now());
  }
}
function endMeasure(instance, type2) {
  if (instance.appContext.config.performance && isSupported()) {
    const startTag = `vue-${type2}-${instance.uid}`;
    const endTag = startTag + `:end`;
    perf.mark(endTag);
    perf.measure(
      `<${formatComponentName(instance, instance.type)}> ${type2}`,
      startTag,
      endTag
    );
    perf.clearMarks(startTag);
    perf.clearMarks(endTag);
  }
  {
    devtoolsPerfEnd(instance, type2, isSupported() ? perf.now() : Date.now());
  }
}
function isSupported() {
  if (supported !== void 0) {
    return supported;
  }
  if (typeof window !== "undefined" && window.performance) {
    supported = true;
    perf = window.performance;
  } else {
    supported = false;
  }
  return supported;
}
const queuePostRenderEffect$1 = queuePostFlushCb;
const Fragment = Symbol.for("v-fgt");
const Text$1 = Symbol.for("v-txt");
const Comment = Symbol.for("v-cmt");
const Static = Symbol.for("v-stc");
function isVNode(value2) {
  return value2 ? value2.__v_isVNode === true : false;
}
const InternalObjectKey = `__vInternal`;
function guardReactiveProps(props2) {
  if (!props2)
    return null;
  return isProxy(props2) || InternalObjectKey in props2 ? extend({}, props2) : props2;
}
const emptyAppContext = createAppContext();
let uid = 0;
function createComponentInstance(vnode, parent, suspense) {
  const type2 = vnode.type;
  const appContext = (parent ? parent.appContext : vnode.appContext) || emptyAppContext;
  const instance = {
    uid: uid++,
    vnode,
    type: type2,
    parent,
    appContext,
    root: null,
    // to be immediately set
    next: null,
    subTree: null,
    // will be set synchronously right after creation
    effect: null,
    update: null,
    // will be set synchronously right after creation
    scope: new EffectScope(
      true
      /* detached */
    ),
    render: null,
    proxy: null,
    exposed: null,
    exposeProxy: null,
    withProxy: null,
    provides: parent ? parent.provides : Object.create(appContext.provides),
    accessCache: null,
    renderCache: [],
    // local resolved assets
    components: null,
    directives: null,
    // resolved props and emits options
    propsOptions: normalizePropsOptions(type2, appContext),
    emitsOptions: normalizeEmitsOptions(type2, appContext),
    // emit
    emit: null,
    // to be set immediately
    emitted: null,
    // props default value
    propsDefaults: EMPTY_OBJ,
    // inheritAttrs
    inheritAttrs: type2.inheritAttrs,
    // state
    ctx: EMPTY_OBJ,
    data: EMPTY_OBJ,
    props: EMPTY_OBJ,
    attrs: EMPTY_OBJ,
    slots: EMPTY_OBJ,
    refs: EMPTY_OBJ,
    setupState: EMPTY_OBJ,
    setupContext: null,
    attrsProxy: null,
    slotsProxy: null,
    // suspense related
    suspense,
    suspenseId: suspense ? suspense.pendingId : 0,
    asyncDep: null,
    asyncResolved: false,
    // lifecycle hooks
    // not using enums here because it results in computed properties
    isMounted: false,
    isUnmounted: false,
    isDeactivated: false,
    bc: null,
    c: null,
    bm: null,
    m: null,
    bu: null,
    u: null,
    um: null,
    bum: null,
    da: null,
    a: null,
    rtg: null,
    rtc: null,
    ec: null,
    sp: null,
    // fixed by xxxxxx 用于存储uni-app的元素缓存
    $uniElements: /* @__PURE__ */ new Map(),
    $templateUniElementRefs: [],
    $templateUniElementStyles: {},
    $eS: {},
    $eA: {}
  };
  {
    instance.ctx = createDevRenderContext(instance);
  }
  instance.root = parent ? parent.root : instance;
  instance.emit = emit.bind(null, instance);
  if (vnode.ce) {
    vnode.ce(instance);
  }
  return instance;
}
let currentInstance = null;
const getCurrentInstance = () => currentInstance || currentRenderingInstance;
let internalSetCurrentInstance;
let setInSSRSetupState;
{
  internalSetCurrentInstance = (i) => {
    currentInstance = i;
  };
  setInSSRSetupState = (v) => {
    isInSSRComponentSetup = v;
  };
}
const setCurrentInstance = (instance) => {
  const prev = currentInstance;
  internalSetCurrentInstance(instance);
  instance.scope.on();
  return () => {
    instance.scope.off();
    internalSetCurrentInstance(prev);
  };
};
const unsetCurrentInstance = () => {
  currentInstance && currentInstance.scope.off();
  internalSetCurrentInstance(null);
};
const isBuiltInTag = /* @__PURE__ */ makeMap("slot,component");
function validateComponentName(name, { isNativeTag }) {
  if (isBuiltInTag(name) || isNativeTag(name)) {
    warn$1(
      "Do not use built-in or reserved HTML elements as component id: " + name
    );
  }
}
function isStatefulComponent(instance) {
  return instance.vnode.shapeFlag & 4;
}
let isInSSRComponentSetup = false;
function setupComponent(instance, isSSR = false) {
  isSSR && setInSSRSetupState(isSSR);
  const {
    props: props2
    /*, children*/
  } = instance.vnode;
  const isStateful = isStatefulComponent(instance);
  initProps$1(instance, props2, isStateful, isSSR);
  const setupResult = isStateful ? setupStatefulComponent(instance, isSSR) : void 0;
  isSSR && setInSSRSetupState(false);
  return setupResult;
}
function setupStatefulComponent(instance, isSSR) {
  const Component2 = instance.type;
  {
    if (Component2.name) {
      validateComponentName(Component2.name, instance.appContext.config);
    }
    if (Component2.components) {
      const names = Object.keys(Component2.components);
      for (let i = 0; i < names.length; i++) {
        validateComponentName(names[i], instance.appContext.config);
      }
    }
    if (Component2.directives) {
      const names = Object.keys(Component2.directives);
      for (let i = 0; i < names.length; i++) {
        validateDirectiveName(names[i]);
      }
    }
    if (Component2.compilerOptions && isRuntimeOnly()) {
      warn$1(
        `"compilerOptions" is only supported when using a build of Vue that includes the runtime compiler. Since you are using a runtime-only build, the options should be passed via your build tool config instead.`
      );
    }
  }
  instance.accessCache = /* @__PURE__ */ Object.create(null);
  instance.proxy = markRaw(new Proxy(instance.ctx, PublicInstanceProxyHandlers));
  {
    exposePropsOnRenderContext(instance);
  }
  const { setup } = Component2;
  if (setup) {
    const setupContext = instance.setupContext = setup.length > 1 ? createSetupContext(instance) : null;
    const reset = setCurrentInstance(instance);
    pauseTracking();
    const setupResult = callWithErrorHandling(
      setup,
      instance,
      0,
      [
        shallowReadonly(instance.props),
        setupContext
      ]
    );
    resetTracking();
    reset();
    if (isPromise(setupResult)) {
      setupResult.then(unsetCurrentInstance, unsetCurrentInstance);
      {
        warn$1(
          `setup() returned a Promise, but the version of Vue you are using does not support it yet.`
        );
      }
    } else {
      handleSetupResult(instance, setupResult, isSSR);
    }
  } else {
    finishComponentSetup(instance, isSSR);
  }
}
function handleSetupResult(instance, setupResult, isSSR) {
  if (isFunction(setupResult)) {
    {
      instance.render = setupResult;
    }
  } else if (isObject$1(setupResult)) {
    if (isVNode(setupResult)) {
      warn$1(
        `setup() should not return VNodes directly - return a render function instead.`
      );
    }
    {
      instance.devtoolsRawSetupState = setupResult;
    }
    instance.setupState = proxyRefs(setupResult);
    {
      exposeSetupStateOnRenderContext(instance);
    }
  } else if (setupResult !== void 0) {
    warn$1(
      `setup() should return an object. Received: ${setupResult === null ? "null" : typeof setupResult}`
    );
  }
  finishComponentSetup(instance, isSSR);
}
const isRuntimeOnly = () => true;
function finishComponentSetup(instance, isSSR, skipOptions) {
  const Component2 = instance.type;
  if (!instance.render) {
    instance.render = Component2.render || NOOP;
  }
  {
    const reset = setCurrentInstance(instance);
    pauseTracking();
    try {
      applyOptions$1(instance);
    } finally {
      resetTracking();
      reset();
    }
  }
  if (!Component2.render && instance.render === NOOP && !isSSR) {
    if (Component2.template) {
      warn$1(
        `Component provided template option but runtime compilation is not supported in this build of Vue. Configure your bundler to alias "vue" to "vue/dist/vue.esm-bundler.js".`
      );
    } else {
      warn$1(`Component is missing template or render function.`);
    }
  }
}
function getAttrsProxy(instance) {
  return instance.attrsProxy || (instance.attrsProxy = new Proxy(
    instance.attrs,
    {
      get(target, key) {
        track(instance, "get", "$attrs");
        return target[key];
      },
      set() {
        warn$1(`setupContext.attrs is readonly.`);
        return false;
      },
      deleteProperty() {
        warn$1(`setupContext.attrs is readonly.`);
        return false;
      }
    }
  ));
}
function getSlotsProxy(instance) {
  return instance.slotsProxy || (instance.slotsProxy = new Proxy(instance.slots, {
    get(target, key) {
      track(instance, "get", "$slots");
      return target[key];
    }
  }));
}
function createSetupContext(instance) {
  const expose = (exposed) => {
    {
      if (instance.exposed) {
        warn$1(`expose() should be called only once per setup().`);
      }
      if (exposed != null) {
        let exposedType = typeof exposed;
        if (exposedType === "object") {
          if (isArray$1(exposed)) {
            exposedType = "array";
          } else if (isRef(exposed)) {
            exposedType = "ref";
          }
        }
        if (exposedType !== "object") {
          warn$1(
            `expose() should be passed a plain object, received ${exposedType}.`
          );
        }
      }
    }
    instance.exposed = exposed || {};
  };
  {
    return Object.freeze({
      get attrs() {
        return getAttrsProxy(instance);
      },
      get slots() {
        return getSlotsProxy(instance);
      },
      get emit() {
        return (event, ...args) => instance.emit(event, ...args);
      },
      expose
    });
  }
}
function getExposeProxy(instance) {
  if (instance.exposed) {
    return instance.exposeProxy || (instance.exposeProxy = new Proxy(proxyRefs(markRaw(instance.exposed)), {
      get(target, key) {
        if (key in target) {
          return target[key];
        }
        return instance.proxy[key];
      },
      has(target, key) {
        return key in target || key in publicPropertiesMap;
      }
    }));
  }
}
const classifyRE = /(?:^|[-_])(\w)/g;
const classify = (str) => str.replace(classifyRE, (c2) => c2.toUpperCase()).replace(/[-_]/g, "");
function getComponentName(Component2, includeInferred = true) {
  return isFunction(Component2) ? Component2.displayName || Component2.name : Component2.name || includeInferred && Component2.__name;
}
function formatComponentName(instance, Component2, isRoot = false) {
  let name = getComponentName(Component2);
  if (!name && Component2.__file) {
    const match = Component2.__file.match(/([^/\\]+)\.\w+$/);
    if (match) {
      name = match[1];
    }
  }
  if (!name && instance && instance.parent) {
    const inferFromRegistry = (registry) => {
      for (const key in registry) {
        if (registry[key] === Component2) {
          return key;
        }
      }
    };
    name = inferFromRegistry(
      instance.components || instance.parent.type.components
    ) || inferFromRegistry(instance.appContext.components);
  }
  return name ? classify(name) : isRoot ? `App` : `Anonymous`;
}
const computed = (getterOrOptions, debugOptions) => {
  const c2 = computed$1(getterOrOptions, debugOptions, isInSSRComponentSetup);
  {
    const i = getCurrentInstance();
    if (i && i.appContext.config.warnRecursiveComputed) {
      c2._warnRecursive = true;
    }
  }
  return c2;
};
function useModel(props2, name, options = EMPTY_OBJ) {
  const i = getCurrentInstance();
  if (!i) {
    warn$1(`useModel() called without active instance.`);
    return ref();
  }
  if (!i.propsOptions[0][name]) {
    warn$1(`useModel() called with prop "${name}" which is not declared.`);
    return ref();
  }
  const camelizedName = camelize(name);
  const hyphenatedName = hyphenate(name);
  const res = customRef((track2, trigger2) => {
    let localValue;
    watchSyncEffect(() => {
      const propValue = props2[name];
      if (hasChanged(localValue, propValue)) {
        localValue = propValue;
        trigger2();
      }
    });
    return {
      get() {
        track2();
        return options.get ? options.get(localValue) : localValue;
      },
      set(value2) {
        const rawProps = i.vnode.props;
        if (!(rawProps && // check if parent has passed v-model
        (name in rawProps || camelizedName in rawProps || hyphenatedName in rawProps) && (`onUpdate:${name}` in rawProps || `onUpdate:${camelizedName}` in rawProps || `onUpdate:${hyphenatedName}` in rawProps)) && hasChanged(value2, localValue)) {
          localValue = value2;
          trigger2();
        }
        i.emit(`update:${name}`, options.set ? options.set(value2) : value2);
      }
    };
  });
  const modifierKey = "modelModifiers";
  res[Symbol.iterator] = () => {
    let i2 = 0;
    return {
      next() {
        if (i2 < 2) {
          return { value: i2++ ? props2[modifierKey] || {} : res, done: false };
        } else {
          return { done: true };
        }
      }
    };
  };
  return res;
}
const version$1 = "3.4.21";
const warn = warn$1;
function unwrapper(target) {
  return unref(target);
}
const ARRAYTYPE = "[object Array]";
const OBJECTTYPE = "[object Object]";
function diff(current, pre) {
  const result = {};
  syncKeys(current, pre);
  _diff(current, pre, "", result);
  return result;
}
function syncKeys(current, pre) {
  current = unwrapper(current);
  if (current === pre)
    return;
  const rootCurrentType = toTypeString(current);
  const rootPreType = toTypeString(pre);
  if (rootCurrentType == OBJECTTYPE && rootPreType == OBJECTTYPE) {
    for (let key in pre) {
      const currentValue = current[key];
      if (currentValue === void 0) {
        current[key] = null;
      } else {
        syncKeys(currentValue, pre[key]);
      }
    }
  } else if (rootCurrentType == ARRAYTYPE && rootPreType == ARRAYTYPE) {
    if (current.length >= pre.length) {
      pre.forEach((item, index2) => {
        syncKeys(current[index2], item);
      });
    }
  }
}
function _diff(current, pre, path, result) {
  current = unwrapper(current);
  if (current === pre)
    return;
  const rootCurrentType = toTypeString(current);
  const rootPreType = toTypeString(pre);
  if (rootCurrentType == OBJECTTYPE) {
    if (rootPreType != OBJECTTYPE || Object.keys(current).length < Object.keys(pre).length) {
      setResult(result, path, current);
    } else {
      for (let key in current) {
        const currentValue = unwrapper(current[key]);
        const preValue = pre[key];
        const currentType = toTypeString(currentValue);
        const preType = toTypeString(preValue);
        if (currentType != ARRAYTYPE && currentType != OBJECTTYPE) {
          if (currentValue != preValue) {
            setResult(
              result,
              (path == "" ? "" : path + ".") + key,
              currentValue
            );
          }
        } else if (currentType == ARRAYTYPE) {
          if (preType != ARRAYTYPE) {
            setResult(
              result,
              (path == "" ? "" : path + ".") + key,
              currentValue
            );
          } else {
            if (currentValue.length < preValue.length) {
              setResult(
                result,
                (path == "" ? "" : path + ".") + key,
                currentValue
              );
            } else {
              currentValue.forEach((item, index2) => {
                _diff(
                  item,
                  preValue[index2],
                  (path == "" ? "" : path + ".") + key + "[" + index2 + "]",
                  result
                );
              });
            }
          }
        } else if (currentType == OBJECTTYPE) {
          if (preType != OBJECTTYPE || Object.keys(currentValue).length < Object.keys(preValue).length) {
            setResult(
              result,
              (path == "" ? "" : path + ".") + key,
              currentValue
            );
          } else {
            for (let subKey in currentValue) {
              _diff(
                currentValue[subKey],
                preValue[subKey],
                (path == "" ? "" : path + ".") + key + "." + subKey,
                result
              );
            }
          }
        }
      }
    }
  } else if (rootCurrentType == ARRAYTYPE) {
    if (rootPreType != ARRAYTYPE) {
      setResult(result, path, current);
    } else {
      if (current.length < pre.length) {
        setResult(result, path, current);
      } else {
        current.forEach((item, index2) => {
          _diff(item, pre[index2], path + "[" + index2 + "]", result);
        });
      }
    }
  } else {
    setResult(result, path, current);
  }
}
function setResult(result, k, v) {
  result[k] = v;
}
function hasComponentEffect(instance) {
  return queue.includes(instance.update);
}
function flushCallbacks(instance) {
  const ctx = instance.ctx;
  const callbacks = ctx.__next_tick_callbacks;
  if (callbacks && callbacks.length) {
    const copies = callbacks.slice(0);
    callbacks.length = 0;
    for (let i = 0; i < copies.length; i++) {
      copies[i]();
    }
  }
}
function nextTick(instance, fn) {
  const ctx = instance.ctx;
  if (!ctx.__next_tick_pending && !hasComponentEffect(instance)) {
    return nextTick$1(fn && fn.bind(instance.proxy));
  }
  let _resolve;
  if (!ctx.__next_tick_callbacks) {
    ctx.__next_tick_callbacks = [];
  }
  ctx.__next_tick_callbacks.push(() => {
    if (fn) {
      callWithErrorHandling(
        fn.bind(instance.proxy),
        instance,
        14
      );
    } else if (_resolve) {
      _resolve(instance.proxy);
    }
  });
  return new Promise((resolve2) => {
    _resolve = resolve2;
  });
}
function clone$1(src, seen) {
  src = unwrapper(src);
  const type2 = typeof src;
  if (type2 === "object" && src !== null) {
    let copy = seen.get(src);
    if (typeof copy !== "undefined") {
      return copy;
    }
    if (isArray$1(src)) {
      const len = src.length;
      copy = new Array(len);
      seen.set(src, copy);
      for (let i = 0; i < len; i++) {
        copy[i] = clone$1(src[i], seen);
      }
    } else {
      copy = {};
      seen.set(src, copy);
      for (const name in src) {
        if (hasOwn(src, name)) {
          copy[name] = clone$1(src[name], seen);
        }
      }
    }
    return copy;
  }
  if (type2 !== "symbol") {
    return src;
  }
}
function deepCopy(src) {
  return clone$1(src, typeof WeakMap !== "undefined" ? /* @__PURE__ */ new WeakMap() : /* @__PURE__ */ new Map());
}
function getMPInstanceData(instance, keys) {
  const data = instance.data;
  const ret = /* @__PURE__ */ Object.create(null);
  keys.forEach((key) => {
    ret[key] = data[key];
  });
  return ret;
}
function patch(instance, data, oldData) {
  if (!data) {
    return;
  }
  data = deepCopy(data);
  data.$eS = instance.$eS || {};
  data.$eA = instance.$eA || {};
  const ctx = instance.ctx;
  const mpType = ctx.mpType;
  if (mpType === "page" || mpType === "component") {
    data.r0 = 1;
    const mpInstance = ctx.$scope;
    const keys = Object.keys(data);
    const diffData = diff(data, getMPInstanceData(mpInstance, keys));
    if (Object.keys(diffData).length) {
      ctx.__next_tick_pending = true;
      mpInstance.setData(diffData, () => {
        ctx.__next_tick_pending = false;
        flushCallbacks(instance);
      });
      flushPreFlushCbs();
    } else {
      flushCallbacks(instance);
    }
  }
}
function initAppConfig(appConfig) {
  appConfig.globalProperties.$nextTick = function $nextTick(fn) {
    return nextTick(this.$, fn);
  };
}
function onApplyOptions(options, instance, publicThis) {
  instance.appContext.config.globalProperties.$applyOptions(
    options,
    instance,
    publicThis
  );
  const computedOptions = options.computed;
  if (computedOptions) {
    const keys = Object.keys(computedOptions);
    if (keys.length) {
      const ctx = instance.ctx;
      if (!ctx.$computedKeys) {
        ctx.$computedKeys = [];
      }
      ctx.$computedKeys.push(...keys);
    }
  }
  delete instance.ctx.$onApplyOptions;
}
function setRef$1(instance, isUnmount = false) {
  const {
    setupState,
    $templateRefs,
    $templateUniElementRefs,
    ctx: { $scope, $mpPlatform }
  } = instance;
  if ($mpPlatform === "mp-alipay") {
    return;
  }
  if (!$scope || !$templateRefs && !$templateUniElementRefs) {
    return;
  }
  if (isUnmount) {
    $templateRefs && $templateRefs.forEach(
      (templateRef) => setTemplateRef(templateRef, null, setupState)
    );
    $templateUniElementRefs && $templateUniElementRefs.forEach(
      (templateRef) => setTemplateRef(templateRef, null, setupState)
    );
    return;
  }
  const check = $mpPlatform === "mp-baidu" || $mpPlatform === "mp-toutiao";
  const doSetByRefs = (refs) => {
    if (refs.length === 0) {
      return [];
    }
    const mpComponents = (
      // 字节小程序 selectAllComponents 可能返回 null
      // https://github.com/dcloudio/uni-app/issues/3954
      ($scope.selectAllComponents(".r") || []).concat(
        $scope.selectAllComponents(".r-i-f") || []
      )
    );
    return refs.filter((templateRef) => {
      const refValue = findComponentPublicInstance(mpComponents, templateRef.i);
      if (check && refValue === null) {
        return true;
      }
      setTemplateRef(templateRef, refValue, setupState);
      return false;
    });
  };
  const doSet = () => {
    if ($templateRefs) {
      const refs = doSetByRefs($templateRefs);
      if (refs.length && instance.proxy && instance.proxy.$scope) {
        instance.proxy.$scope.setData({ r1: 1 }, () => {
          doSetByRefs(refs);
        });
      }
    }
  };
  if ($templateUniElementRefs && $templateUniElementRefs.length) {
    nextTick(instance, () => {
      $templateUniElementRefs.forEach((templateRef) => {
        if (isArray$1(templateRef.v)) {
          templateRef.v.forEach((v) => {
            setTemplateRef(templateRef, v, setupState);
          });
        } else {
          setTemplateRef(templateRef, templateRef.v, setupState);
        }
      });
    });
  }
  if ($scope._$setRef) {
    $scope._$setRef(doSet);
  } else {
    nextTick(instance, doSet);
  }
}
function toSkip(value2) {
  if (isObject$1(value2)) {
    markRaw(value2);
  }
  return value2;
}
function findComponentPublicInstance(mpComponents, id) {
  const mpInstance = mpComponents.find(
    (com) => com && (com.properties || com.props).uI === id
  );
  if (mpInstance) {
    const vm = mpInstance.$vm;
    if (vm) {
      return getExposeProxy(vm.$) || vm;
    }
    return toSkip(mpInstance);
  }
  return null;
}
function setTemplateRef({ r: r2, f: f2 }, refValue, setupState) {
  if (isFunction(r2)) {
    r2(refValue, {});
  } else {
    const _isString = isString(r2);
    const _isRef = isRef(r2);
    if (_isString || _isRef) {
      if (f2) {
        if (!_isRef) {
          return;
        }
        if (!isArray$1(r2.value)) {
          r2.value = [];
        }
        const existing = r2.value;
        if (existing.indexOf(refValue) === -1) {
          existing.push(refValue);
          if (!refValue) {
            return;
          }
          if (refValue.$) {
            onBeforeUnmount(() => remove(existing, refValue), refValue.$);
          }
        }
      } else if (_isString) {
        if (hasOwn(setupState, r2)) {
          setupState[r2] = refValue;
        }
      } else if (isRef(r2)) {
        r2.value = refValue;
      } else {
        warnRef(r2);
      }
    } else {
      warnRef(r2);
    }
  }
}
function warnRef(ref2) {
  warn("Invalid template ref type:", ref2, `(${typeof ref2})`);
}
const queuePostRenderEffect = queuePostFlushCb;
function mountComponent(initialVNode, options) {
  const instance = initialVNode.component = createComponentInstance(initialVNode, options.parentComponent, null);
  {
    instance.ctx.$onApplyOptions = onApplyOptions;
    instance.ctx.$children = [];
  }
  if (options.mpType === "app") {
    instance.render = NOOP;
  }
  if (options.onBeforeSetup) {
    options.onBeforeSetup(instance, options);
  }
  {
    pushWarningContext(initialVNode);
    startMeasure(instance, `mount`);
  }
  {
    startMeasure(instance, `init`);
  }
  setupComponent(instance);
  {
    endMeasure(instance, `init`);
  }
  {
    if (options.parentComponent && instance.proxy) {
      options.parentComponent.ctx.$children.push(getExposeProxy(instance) || instance.proxy);
    }
  }
  setupRenderEffect(instance);
  {
    popWarningContext();
    endMeasure(instance, `mount`);
  }
  return instance.proxy;
}
const getFunctionalFallthrough = (attrs) => {
  let res;
  for (const key in attrs) {
    if (key === "class" || key === "style" || isOn(key)) {
      (res || (res = {}))[key] = attrs[key];
    }
  }
  return res;
};
function renderComponentRoot(instance) {
  const {
    type: Component2,
    vnode,
    proxy,
    withProxy,
    props: props2,
    propsOptions: [propsOptions],
    slots,
    attrs,
    emit: emit2,
    render,
    renderCache,
    data,
    setupState,
    ctx,
    uid: uid2,
    appContext: {
      app: {
        config: {
          globalProperties: { pruneComponentPropsCache: pruneComponentPropsCache2 }
        }
      }
    },
    inheritAttrs
  } = instance;
  instance.$uniElementIds = /* @__PURE__ */ new Map();
  instance.$templateRefs = [];
  instance.$templateUniElementRefs = [];
  instance.$templateUniElementStyles = {};
  instance.$ei = 0;
  pruneComponentPropsCache2(uid2);
  instance.__counter = instance.__counter === 0 ? 1 : 0;
  let result;
  const prev = setCurrentRenderingInstance(instance);
  try {
    if (vnode.shapeFlag & 4) {
      fallthroughAttrs(inheritAttrs, props2, propsOptions, attrs);
      const proxyToUse = withProxy || proxy;
      result = render.call(
        proxyToUse,
        proxyToUse,
        renderCache,
        props2,
        setupState,
        data,
        ctx
      );
    } else {
      fallthroughAttrs(
        inheritAttrs,
        props2,
        propsOptions,
        Component2.props ? attrs : getFunctionalFallthrough(attrs)
      );
      const render2 = Component2;
      result = render2.length > 1 ? render2(props2, { attrs, slots, emit: emit2 }) : render2(
        props2,
        null
        /* we know it doesn't need it */
      );
    }
  } catch (err) {
    handleError(err, instance, 1);
    result = false;
  }
  setRef$1(instance);
  setCurrentRenderingInstance(prev);
  return result;
}
function fallthroughAttrs(inheritAttrs, props2, propsOptions, fallthroughAttrs2) {
  if (props2 && fallthroughAttrs2 && inheritAttrs !== false) {
    const keys = Object.keys(fallthroughAttrs2).filter(
      (key) => key !== "class" && key !== "style"
    );
    if (!keys.length) {
      return;
    }
    if (propsOptions && keys.some(isModelListener)) {
      keys.forEach((key) => {
        if (!isModelListener(key) || !(key.slice(9) in propsOptions)) {
          props2[key] = fallthroughAttrs2[key];
        }
      });
    } else {
      keys.forEach((key) => props2[key] = fallthroughAttrs2[key]);
    }
  }
}
const updateComponentPreRender = (instance) => {
  pauseTracking();
  flushPreFlushCbs();
  resetTracking();
};
function componentUpdateScopedSlotsFn() {
  const scopedSlotsData = this.$scopedSlotsData;
  if (!scopedSlotsData || scopedSlotsData.length === 0) {
    return;
  }
  const mpInstance = this.ctx.$scope;
  const oldData = mpInstance.data;
  const diffData = /* @__PURE__ */ Object.create(null);
  scopedSlotsData.forEach(({ path, index: index2, data }) => {
    const oldScopedSlotData = getValueByDataPath(oldData, path);
    const diffPath = isString(index2) ? `${path}.${index2}` : `${path}[${index2}]`;
    if (typeof oldScopedSlotData === "undefined" || typeof oldScopedSlotData[index2] === "undefined") {
      diffData[diffPath] = data;
    } else {
      const diffScopedSlotData = diff(
        data,
        oldScopedSlotData[index2]
      );
      Object.keys(diffScopedSlotData).forEach((name) => {
        diffData[diffPath + "." + name] = diffScopedSlotData[name];
      });
    }
  });
  scopedSlotsData.length = 0;
  if (Object.keys(diffData).length) {
    mpInstance.setData(diffData);
  }
}
function toggleRecurse({ effect: effect2, update }, allowed) {
  effect2.allowRecurse = update.allowRecurse = allowed;
}
function setupRenderEffect(instance) {
  const updateScopedSlots = componentUpdateScopedSlotsFn.bind(
    instance
  );
  instance.$updateScopedSlots = () => nextTick$1(() => queueJob(updateScopedSlots));
  const componentUpdateFn = () => {
    if (!instance.isMounted) {
      onBeforeUnmount(() => {
        setRef$1(instance, true);
      }, instance);
      {
        startMeasure(instance, `patch`);
      }
      patch(instance, renderComponentRoot(instance));
      {
        endMeasure(instance, `patch`);
      }
      {
        devtoolsComponentAdded(instance);
      }
    } else {
      const { next, bu, u } = instance;
      {
        pushWarningContext(next || instance.vnode);
      }
      toggleRecurse(instance, false);
      updateComponentPreRender();
      if (bu) {
        invokeArrayFns$1(bu);
      }
      toggleRecurse(instance, true);
      {
        startMeasure(instance, `patch`);
      }
      patch(instance, renderComponentRoot(instance));
      {
        endMeasure(instance, `patch`);
      }
      if (u) {
        queuePostRenderEffect(u);
      }
      {
        devtoolsComponentUpdated(instance);
      }
      {
        popWarningContext();
      }
    }
  };
  const effect2 = instance.effect = new ReactiveEffect(
    componentUpdateFn,
    NOOP,
    () => queueJob(update),
    instance.scope
    // track it in component's effect scope
  );
  const update = instance.update = () => {
    if (effect2.dirty) {
      effect2.run();
    }
  };
  update.id = instance.uid;
  toggleRecurse(instance, true);
  {
    effect2.onTrack = instance.rtc ? (e2) => invokeArrayFns$1(instance.rtc, e2) : void 0;
    effect2.onTrigger = instance.rtg ? (e2) => invokeArrayFns$1(instance.rtg, e2) : void 0;
    update.ownerInstance = instance;
  }
  {
    update();
  }
}
function unmountComponent(instance) {
  const { bum, scope, update, um } = instance;
  if (bum) {
    invokeArrayFns$1(bum);
  }
  {
    const parentInstance = instance.parent;
    if (parentInstance) {
      const $children = parentInstance.ctx.$children;
      const target = getExposeProxy(instance) || instance.proxy;
      const index2 = $children.indexOf(target);
      if (index2 > -1) {
        $children.splice(index2, 1);
      }
    }
  }
  scope.stop();
  if (update) {
    update.active = false;
  }
  if (um) {
    queuePostRenderEffect(um);
  }
  queuePostRenderEffect(() => {
    instance.isUnmounted = true;
  });
  {
    devtoolsComponentRemoved(instance);
  }
}
const oldCreateApp = createAppAPI();
function getTarget() {
  if (typeof window !== "undefined") {
    return window;
  }
  if (typeof globalThis !== "undefined") {
    return globalThis;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  if (typeof my !== "undefined") {
    return my;
  }
}
function createVueApp(rootComponent, rootProps = null) {
  const target = getTarget();
  target.__VUE__ = true;
  {
    setDevtoolsHook(target.__VUE_DEVTOOLS_GLOBAL_HOOK__, target);
  }
  const app = oldCreateApp(rootComponent, rootProps);
  const appContext = app._context;
  initAppConfig(appContext.config);
  const createVNode2 = (initialVNode) => {
    initialVNode.appContext = appContext;
    initialVNode.shapeFlag = 6;
    return initialVNode;
  };
  const createComponent2 = function createComponent22(initialVNode, options) {
    return mountComponent(createVNode2(initialVNode), options);
  };
  const destroyComponent = function destroyComponent2(component) {
    return component && unmountComponent(component.$);
  };
  app.mount = function mount() {
    rootComponent.render = NOOP;
    const instance = mountComponent(
      createVNode2({ type: rootComponent }),
      {
        mpType: "app",
        mpInstance: null,
        parentComponent: null,
        slots: [],
        props: null
      }
    );
    app._instance = instance.$;
    {
      devtoolsInitApp(app, version$1);
    }
    instance.$app = app;
    instance.$createComponent = createComponent2;
    instance.$destroyComponent = destroyComponent;
    appContext.$appInstance = instance;
    return instance;
  };
  app.unmount = function unmount() {
    warn(`Cannot unmount an app.`);
  };
  return app;
}
function injectLifecycleHook(name, hook, publicThis, instance) {
  if (isFunction(hook)) {
    injectHook(name, hook.bind(publicThis), instance);
  }
}
function initHooks$1(options, instance, publicThis) {
  const mpType = options.mpType || publicThis.$mpType;
  if (!mpType || mpType === "component") {
    return;
  }
  Object.keys(options).forEach((name) => {
    if (isUniLifecycleHook(name, options[name], false)) {
      const hooks = options[name];
      if (isArray$1(hooks)) {
        hooks.forEach((hook) => injectLifecycleHook(name, hook, publicThis, instance));
      } else {
        injectLifecycleHook(name, hooks, publicThis, instance);
      }
    }
  });
}
function applyOptions$2(options, instance, publicThis) {
  initHooks$1(options, instance, publicThis);
}
function set$3(target, key, val) {
  return target[key] = val;
}
function $callMethod(method2, ...args) {
  const fn = this[method2];
  if (fn) {
    return fn(...args);
  }
  console.error(`method ${method2} not found`);
  return null;
}
function createErrorHandler(app) {
  const userErrorHandler = app.config.errorHandler;
  return function errorHandler(err, instance, info) {
    if (userErrorHandler) {
      userErrorHandler(err, instance, info);
    }
    const appInstance = app._instance;
    if (!appInstance || !appInstance.proxy) {
      throw err;
    }
    if (appInstance[ON_ERROR]) {
      {
        appInstance.proxy.$callHook(ON_ERROR, err);
      }
    } else {
      logError(err, info, instance ? instance.$.vnode : null, false);
    }
  };
}
function mergeAsArray(to, from) {
  return to ? [...new Set([].concat(to, from))] : from;
}
function initOptionMergeStrategies(optionMergeStrategies) {
  UniLifecycleHooks.forEach((name) => {
    optionMergeStrategies[name] = mergeAsArray;
  });
}
let realAtob;
const b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
const b64re = /^(?:[A-Za-z\d+/]{4})*?(?:[A-Za-z\d+/]{2}(?:==)?|[A-Za-z\d+/]{3}=?)?$/;
if (typeof atob !== "function") {
  realAtob = function(str) {
    str = String(str).replace(/[\t\n\f\r ]+/g, "");
    if (!b64re.test(str)) {
      throw new Error("Failed to execute 'atob' on 'Window': The string to be decoded is not correctly encoded.");
    }
    str += "==".slice(2 - (str.length & 3));
    var bitmap;
    var result = "";
    var r1;
    var r2;
    var i = 0;
    for (; i < str.length; ) {
      bitmap = b64.indexOf(str.charAt(i++)) << 18 | b64.indexOf(str.charAt(i++)) << 12 | (r1 = b64.indexOf(str.charAt(i++))) << 6 | (r2 = b64.indexOf(str.charAt(i++)));
      result += r1 === 64 ? String.fromCharCode(bitmap >> 16 & 255) : r2 === 64 ? String.fromCharCode(bitmap >> 16 & 255, bitmap >> 8 & 255) : String.fromCharCode(bitmap >> 16 & 255, bitmap >> 8 & 255, bitmap & 255);
    }
    return result;
  };
} else {
  realAtob = atob;
}
function b64DecodeUnicode(str) {
  return decodeURIComponent(realAtob(str).split("").map(function(c2) {
    return "%" + ("00" + c2.charCodeAt(0).toString(16)).slice(-2);
  }).join(""));
}
function getCurrentUserInfo() {
  const token = index$1.getStorageSync("uni_id_token") || "";
  const tokenArr = token.split(".");
  if (!token || tokenArr.length !== 3) {
    return {
      uid: null,
      role: [],
      permission: [],
      tokenExpired: 0
    };
  }
  let userInfo;
  try {
    userInfo = JSON.parse(b64DecodeUnicode(tokenArr[1]));
  } catch (error2) {
    throw new Error("获取当前用户信息出错，详细错误信息为：" + error2.message);
  }
  userInfo.tokenExpired = userInfo.exp * 1e3;
  delete userInfo.exp;
  delete userInfo.iat;
  return userInfo;
}
function uniIdMixin(globalProperties) {
  globalProperties.uniIDHasRole = function(roleId) {
    const { role } = getCurrentUserInfo();
    return role.indexOf(roleId) > -1;
  };
  globalProperties.uniIDHasPermission = function(permissionId) {
    const { permission } = getCurrentUserInfo();
    return this.uniIDHasRole("admin") || permission.indexOf(permissionId) > -1;
  };
  globalProperties.uniIDTokenValid = function() {
    const { tokenExpired } = getCurrentUserInfo();
    return tokenExpired > Date.now();
  };
}
function initApp(app) {
  const appConfig = app.config;
  appConfig.errorHandler = invokeCreateErrorHandler(app, createErrorHandler);
  initOptionMergeStrategies(appConfig.optionMergeStrategies);
  const globalProperties = appConfig.globalProperties;
  {
    uniIdMixin(globalProperties);
  }
  {
    globalProperties.$set = set$3;
    globalProperties.$applyOptions = applyOptions$2;
    globalProperties.$callMethod = $callMethod;
  }
  {
    index$1.invokeCreateVueAppHook(app);
  }
}
const propsCaches = /* @__PURE__ */ Object.create(null);
function renderProps(props2) {
  const { uid: uid2, __counter } = getCurrentInstance();
  const propsId = (propsCaches[uid2] || (propsCaches[uid2] = [])).push(guardReactiveProps(props2)) - 1;
  return uid2 + "," + propsId + "," + __counter;
}
function pruneComponentPropsCache(uid2) {
  delete propsCaches[uid2];
}
function findComponentPropsData(up) {
  if (!up) {
    return;
  }
  const [uid2, propsId] = up.split(",");
  if (!propsCaches[uid2]) {
    return;
  }
  return propsCaches[uid2][parseInt(propsId)];
}
var plugin = {
  install(app) {
    initApp(app);
    app.config.globalProperties.pruneComponentPropsCache = pruneComponentPropsCache;
    const oldMount = app.mount;
    app.mount = function mount(rootContainer) {
      const instance = oldMount.call(app, rootContainer);
      const createApp2 = getCreateApp();
      if (createApp2) {
        createApp2(instance);
      } else {
        if (typeof createMiniProgramApp !== "undefined") {
          createMiniProgramApp(instance);
        }
      }
      return instance;
    };
  }
};
function getCreateApp() {
  const method2 = "createApp";
  if (typeof global !== "undefined" && typeof global[method2] !== "undefined") {
    return global[method2];
  } else if (typeof my !== "undefined") {
    return my[method2];
  }
}
function stringifyStyle(value2) {
  if (isString(value2)) {
    return value2;
  }
  return stringify(normalizeStyle(value2));
}
function stringify(styles) {
  let ret = "";
  if (!styles || isString(styles)) {
    return ret;
  }
  for (const key in styles) {
    ret += `${key.startsWith(`--`) ? key : hyphenate(key)}:${styles[key]};`;
  }
  return ret;
}
function vOn(value2, key) {
  const instance = getCurrentInstance();
  const ctx = instance.ctx;
  const extraKey = typeof key !== "undefined" && (ctx.$mpPlatform === "mp-weixin" || ctx.$mpPlatform === "mp-qq" || ctx.$mpPlatform === "mp-xhs") && (isString(key) || typeof key === "number") ? "_" + key : "";
  const name = "e" + instance.$ei++ + extraKey;
  const mpInstance = ctx.$scope;
  if (!value2) {
    delete mpInstance[name];
    return name;
  }
  const existingInvoker = mpInstance[name];
  if (existingInvoker) {
    existingInvoker.value = value2;
  } else {
    mpInstance[name] = createInvoker(value2, instance);
  }
  return name;
}
function createInvoker(initialValue, instance) {
  const invoker = (e2) => {
    patchMPEvent(e2);
    let args = [e2];
    if (instance && instance.ctx.$getTriggerEventDetail) {
      if (typeof e2.detail === "number") {
        e2.detail = instance.ctx.$getTriggerEventDetail(e2.detail);
      }
    }
    if (e2.detail && e2.detail.__args__) {
      args = e2.detail.__args__;
    }
    const eventValue = invoker.value;
    const invoke = () => callWithAsyncErrorHandling(patchStopImmediatePropagation(e2, eventValue), instance, 5, args);
    const eventTarget = e2.target;
    const eventSync = eventTarget ? eventTarget.dataset ? String(eventTarget.dataset.eventsync) === "true" : false : false;
    if (bubbles.includes(e2.type) && !eventSync) {
      setTimeout(invoke);
    } else {
      const res = invoke();
      if (e2.type === "input" && (isArray$1(res) || isPromise(res))) {
        return;
      }
      return res;
    }
  };
  invoker.value = initialValue;
  return invoker;
}
const bubbles = [
  // touch事件暂不做延迟，否则在 Android 上会影响性能，比如一些拖拽跟手手势等
  // 'touchstart',
  // 'touchmove',
  // 'touchcancel',
  // 'touchend',
  "tap",
  "longpress",
  "longtap",
  "transitionend",
  "animationstart",
  "animationiteration",
  "animationend",
  "touchforcechange"
];
function patchMPEvent(event, instance) {
  if (event.type && event.target) {
    event.preventDefault = NOOP;
    event.stopPropagation = NOOP;
    event.stopImmediatePropagation = NOOP;
    if (!hasOwn(event, "detail")) {
      event.detail = {};
    }
    if (hasOwn(event, "markerId")) {
      event.detail = typeof event.detail === "object" ? event.detail : {};
      event.detail.markerId = event.markerId;
    }
    if (isPlainObject$2(event.detail) && hasOwn(event.detail, "checked") && !hasOwn(event.detail, "value")) {
      event.detail.value = event.detail.checked;
    }
    if (isPlainObject$2(event.detail)) {
      event.target = extend({}, event.target, event.detail);
    }
  }
}
function patchStopImmediatePropagation(e2, value2) {
  if (isArray$1(value2)) {
    const originalStop = e2.stopImmediatePropagation;
    e2.stopImmediatePropagation = () => {
      originalStop && originalStop.call(e2);
      e2._stopped = true;
    };
    return value2.map((fn) => (e3) => !e3._stopped && fn(e3));
  } else {
    return value2;
  }
}
function vFor(source, renderItem) {
  let ret;
  if (isArray$1(source) || isString(source)) {
    ret = new Array(source.length);
    for (let i = 0, l = source.length; i < l; i++) {
      ret[i] = renderItem(source[i], i, i);
    }
  } else if (typeof source === "number") {
    if (!Number.isInteger(source)) {
      warn(`The v-for range expect an integer value but got ${source}.`);
      return [];
    }
    ret = new Array(source);
    for (let i = 0; i < source; i++) {
      ret[i] = renderItem(i + 1, i, i);
    }
  } else if (isObject$1(source)) {
    if (source[Symbol.iterator]) {
      ret = Array.from(source, (item, i) => renderItem(item, i, i));
    } else {
      const keys = Object.keys(source);
      ret = new Array(keys.length);
      for (let i = 0, l = keys.length; i < l; i++) {
        const key = keys[i];
        ret[i] = renderItem(source[key], key, i);
      }
    }
  } else {
    ret = [];
  }
  return ret;
}
function renderSlot(name, props2 = {}, key) {
  const instance = getCurrentInstance();
  const { parent, isMounted, ctx: { $scope } } = instance;
  const vueIds = ($scope.properties || $scope.props).uI;
  if (!vueIds) {
    return;
  }
  if (!parent && !isMounted) {
    onMounted(() => {
      renderSlot(name, props2, key);
    }, instance);
    return;
  }
  const invoker = findScopedSlotInvoker(vueIds, instance);
  if (invoker) {
    invoker(name, props2, key);
  }
}
function findScopedSlotInvoker(vueId, instance) {
  let parent = instance.parent;
  while (parent) {
    const invokers = parent.$ssi;
    if (invokers && invokers[vueId]) {
      return invokers[vueId];
    }
    parent = parent.parent;
  }
}
function withScopedSlot(fn, { name, path, vueId }) {
  const instance = getCurrentInstance();
  fn.path = path;
  const scopedSlots = instance.$ssi || (instance.$ssi = {});
  const invoker = scopedSlots[vueId] || (scopedSlots[vueId] = createScopedSlotInvoker(instance));
  if (!invoker.slots[name]) {
    invoker.slots[name] = {
      fn
    };
  } else {
    invoker.slots[name].fn = fn;
  }
  return getValueByDataPath(instance.ctx.$scope.data, path);
}
function createScopedSlotInvoker(instance) {
  const invoker = (slotName, args, index2) => {
    const slot = invoker.slots[slotName];
    if (!slot) {
      return;
    }
    const hasIndex = typeof index2 !== "undefined";
    index2 = index2 || 0;
    const prevInstance = setCurrentRenderingInstance(instance);
    const data = slot.fn(args, slotName + (hasIndex ? "-" + index2 : ""), index2);
    const path = slot.fn.path;
    setCurrentRenderingInstance(prevInstance);
    (instance.$scopedSlotsData || (instance.$scopedSlotsData = [])).push({
      path,
      index: index2,
      data
    });
    instance.$updateScopedSlots();
  };
  invoker.slots = {};
  return invoker;
}
function setRef(ref2, id, opts = {}) {
  const { $templateRefs } = getCurrentInstance();
  $templateRefs.push({ i: id, r: ref2, k: opts.k, f: opts.f });
}
function withModelModifiers(fn, { number: number2, trim: trim2 }, isComponent = false) {
  if (isComponent) {
    return (...args) => {
      if (trim2) {
        args = args.map((a) => a.trim());
      } else {
        args = args.map(toNumber$2);
      }
      return fn(...args);
    };
  }
  return (event) => {
    const value2 = event.detail.value;
    if (trim2) {
      event.detail.value = value2.trim();
    } else {
      event.detail.value = toNumber$2(value2);
    }
    return fn(event);
  };
}
function hasIdProp(_ctx) {
  return _ctx.$.propsOptions && _ctx.$.propsOptions[0] && "id" in _ctx.$.propsOptions[0];
}
function getVirtualHostId(_ctx) {
  return _ctx.$scope.virtualHostId;
}
function hasVirtualHostId(_ctx) {
  return !!getVirtualHostId(_ctx);
}
function genIdWithVirtualHost(_ctx, idBinding) {
  if (!hasVirtualHostId(_ctx) || hasIdProp(_ctx)) {
    return idBinding;
  }
  return getVirtualHostId(_ctx);
}
function genUniElementId(_ctx, idBinding, genId) {
  return genIdWithVirtualHost(_ctx, idBinding) || genId || "";
}
const o = (value2, key) => vOn(value2, key);
const f = (source, renderItem) => vFor(source, renderItem);
const r = (name, props2, key) => renderSlot(name, props2, key);
const w = (fn, options) => withScopedSlot(fn, options);
const s = (value2) => stringifyStyle(value2);
const e = (target, ...sources) => extend(target, ...sources);
const n = (value2) => normalizeClass(value2);
const t = (val) => toDisplayString(val);
const p = (props2) => renderProps(props2);
const sr = (ref2, id, opts) => setRef(ref2, id, opts);
const m = (fn, modifiers, isComponent = false) => withModelModifiers(fn, modifiers, isComponent);
const gei = genUniElementId;
function createApp$1(rootComponent, rootProps = null) {
  rootComponent && (rootComponent.mpType = "app");
  return createVueApp(rootComponent, rootProps).use(plugin);
}
const createSSRApp = createApp$1;
function initVueIds(vueIds, mpInstance) {
  if (!vueIds) {
    return;
  }
  const ids = vueIds.split(",");
  const len = ids.length;
  if (len === 1) {
    mpInstance._$vueId = ids[0];
  } else if (len === 2) {
    mpInstance._$vueId = ids[0];
    mpInstance._$vuePid = ids[1];
  }
}
const EXTRAS = ["externalClasses"];
function initExtraOptions(miniProgramComponentOptions, vueOptions) {
  EXTRAS.forEach((name) => {
    if (hasOwn(vueOptions, name)) {
      miniProgramComponentOptions[name] = vueOptions[name];
    }
  });
}
const WORKLET_RE = /_(.*)_worklet_factory_/;
function initWorkletMethods(mpMethods, vueMethods) {
  if (vueMethods) {
    Object.keys(vueMethods).forEach((name) => {
      const matches = name.match(WORKLET_RE);
      if (matches) {
        const workletName = matches[1];
        mpMethods[name] = vueMethods[name];
        mpMethods[workletName] = vueMethods[workletName];
      }
    });
  }
}
function initWxsCallMethods(methods, wxsCallMethods) {
  if (!isArray$1(wxsCallMethods)) {
    return;
  }
  wxsCallMethods.forEach((callMethod) => {
    methods[callMethod] = function(args) {
      return this.$vm[callMethod](args);
    };
  });
}
function selectAllComponents(mpInstance, selector, $refs) {
  const components = mpInstance.selectAllComponents(selector);
  components.forEach((component) => {
    const ref2 = component.properties.uR;
    $refs[ref2] = component.$vm || component;
  });
}
function initRefs(instance, mpInstance) {
  Object.defineProperty(instance, "refs", {
    get() {
      const $refs = {};
      selectAllComponents(mpInstance, ".r", $refs);
      const forComponents = mpInstance.selectAllComponents(".r-i-f");
      forComponents.forEach((component) => {
        const ref2 = component.properties.uR;
        if (!ref2) {
          return;
        }
        if (!$refs[ref2]) {
          $refs[ref2] = [];
        }
        $refs[ref2].push(component.$vm || component);
      });
      return $refs;
    }
  });
}
function findVmByVueId(instance, vuePid) {
  const $children = instance.$children;
  for (let i = $children.length - 1; i >= 0; i--) {
    const childVm = $children[i];
    if (childVm.$scope._$vueId === vuePid) {
      return childVm;
    }
  }
  let parentVm;
  for (let i = $children.length - 1; i >= 0; i--) {
    parentVm = findVmByVueId($children[i], vuePid);
    if (parentVm) {
      return parentVm;
    }
  }
}
function getLocaleLanguage() {
  var _a2;
  let localeLanguage = "";
  {
    const appBaseInfo = ((_a2 = wx.getAppBaseInfo) === null || _a2 === void 0 ? void 0 : _a2.call(wx)) || wx.getSystemInfoSync();
    const language = appBaseInfo && appBaseInfo.language ? appBaseInfo.language : LOCALE_EN;
    localeLanguage = normalizeLocale(language) || LOCALE_EN;
  }
  return localeLanguage;
}
const MP_METHODS = [
  "createSelectorQuery",
  "createIntersectionObserver",
  "selectAllComponents",
  "selectComponent"
];
function createEmitFn(oldEmit, ctx) {
  return function emit2(event, ...args) {
    const scope = ctx.$scope;
    if (scope && event) {
      const detail = { __args__: args };
      {
        scope.triggerEvent(event, detail);
      }
    }
    return oldEmit.apply(this, [event, ...args]);
  };
}
function initBaseInstance(instance, options) {
  const ctx = instance.ctx;
  ctx.mpType = options.mpType;
  ctx.$mpType = options.mpType;
  ctx.$mpPlatform = "mp-weixin";
  ctx.$scope = options.mpInstance;
  {
    Object.defineProperties(ctx, {
      // only id
      [VIRTUAL_HOST_ID]: {
        get() {
          const id = this.$scope.data[VIRTUAL_HOST_ID];
          return id === void 0 ? "" : id;
        }
      }
    });
  }
  ctx.$mp = {};
  {
    ctx._self = {};
  }
  instance.slots = {};
  if (isArray$1(options.slots) && options.slots.length) {
    options.slots.forEach((name) => {
      instance.slots[name] = true;
    });
    if (instance.slots[SLOT_DEFAULT_NAME]) {
      instance.slots.default = true;
    }
  }
  ctx.getOpenerEventChannel = function() {
    {
      return options.mpInstance.getOpenerEventChannel();
    }
  };
  ctx.$hasHook = hasHook;
  ctx.$callHook = callHook;
  instance.emit = createEmitFn(instance.emit, ctx);
}
function initComponentInstance(instance, options) {
  initBaseInstance(instance, options);
  const ctx = instance.ctx;
  MP_METHODS.forEach((method2) => {
    ctx[method2] = function(...args) {
      const mpInstance = ctx.$scope;
      if (mpInstance && mpInstance[method2]) {
        return mpInstance[method2].apply(mpInstance, args);
      }
    };
  });
}
function initMocks(instance, mpInstance, mocks2) {
  const ctx = instance.ctx;
  mocks2.forEach((mock) => {
    if (hasOwn(mpInstance, mock)) {
      instance[mock] = ctx[mock] = mpInstance[mock];
    }
  });
}
function hasHook(name) {
  const hooks = this.$[name];
  if (hooks && hooks.length) {
    return true;
  }
  return false;
}
function callHook(name, args) {
  if (name === "mounted") {
    callHook.call(this, "bm");
    this.$.isMounted = true;
    name = "m";
  }
  const hooks = this.$[name];
  return hooks && invokeArrayFns(hooks, args);
}
const PAGE_INIT_HOOKS = [
  ON_LOAD,
  ON_SHOW,
  ON_HIDE,
  ON_UNLOAD,
  ON_RESIZE,
  ON_TAB_ITEM_TAP,
  ON_REACH_BOTTOM,
  ON_PULL_DOWN_REFRESH,
  ON_ADD_TO_FAVORITES
  // 'onReady', // lifetimes.ready
  // 'onPageScroll', // 影响性能，开发者手动注册
  // 'onShareTimeline', // 右上角菜单，开发者手动注册
  // 'onShareAppMessage' // 右上角菜单，开发者手动注册
];
function findHooks(vueOptions, hooks = /* @__PURE__ */ new Set()) {
  if (vueOptions) {
    Object.keys(vueOptions).forEach((name) => {
      if (isUniLifecycleHook(name, vueOptions[name])) {
        hooks.add(name);
      }
    });
    {
      const { extends: extendsOptions, mixins } = vueOptions;
      if (mixins) {
        mixins.forEach((mixin2) => findHooks(mixin2, hooks));
      }
      if (extendsOptions) {
        findHooks(extendsOptions, hooks);
      }
    }
  }
  return hooks;
}
function initHook(mpOptions, hook, excludes) {
  if (excludes.indexOf(hook) === -1 && !hasOwn(mpOptions, hook)) {
    mpOptions[hook] = function(args) {
      return this.$vm && this.$vm.$callHook(hook, args);
    };
  }
}
const EXCLUDE_HOOKS = [ON_READY];
function initHooks(mpOptions, hooks, excludes = EXCLUDE_HOOKS) {
  hooks.forEach((hook) => initHook(mpOptions, hook, excludes));
}
function initUnknownHooks(mpOptions, vueOptions, excludes = EXCLUDE_HOOKS) {
  findHooks(vueOptions).forEach((hook) => initHook(mpOptions, hook, excludes));
}
function initRuntimeHooks(mpOptions, runtimeHooks) {
  if (!runtimeHooks) {
    return;
  }
  const hooks = Object.keys(MINI_PROGRAM_PAGE_RUNTIME_HOOKS);
  hooks.forEach((hook) => {
    if (runtimeHooks & MINI_PROGRAM_PAGE_RUNTIME_HOOKS[hook]) {
      initHook(mpOptions, hook, []);
    }
  });
}
const findMixinRuntimeHooks = /* @__PURE__ */ once(() => {
  const runtimeHooks = [];
  const app = isFunction(getApp) && getApp({ allowDefault: true });
  if (app && app.$vm && app.$vm.$) {
    const mixins = app.$vm.$.appContext.mixins;
    if (isArray$1(mixins)) {
      const hooks = Object.keys(MINI_PROGRAM_PAGE_RUNTIME_HOOKS);
      mixins.forEach((mixin2) => {
        hooks.forEach((hook) => {
          if (hasOwn(mixin2, hook) && !runtimeHooks.includes(hook)) {
            runtimeHooks.push(hook);
          }
        });
      });
    }
  }
  return runtimeHooks;
});
function initMixinRuntimeHooks(mpOptions) {
  initHooks(mpOptions, findMixinRuntimeHooks());
}
const HOOKS = [
  ON_SHOW,
  ON_HIDE,
  ON_ERROR,
  ON_THEME_CHANGE,
  ON_PAGE_NOT_FOUND,
  ON_UNHANDLE_REJECTION
];
function parseApp(instance, parseAppOptions) {
  const internalInstance = instance.$;
  const appOptions = {
    globalData: instance.$options && instance.$options.globalData || {},
    $vm: instance,
    // mp-alipay 组件 data 初始化比 onLaunch 早，提前挂载
    onLaunch(options) {
      this.$vm = instance;
      const ctx = internalInstance.ctx;
      if (this.$vm && ctx.$scope && ctx.$callHook) {
        return;
      }
      initBaseInstance(internalInstance, {
        mpType: "app",
        mpInstance: this,
        slots: []
      });
      ctx.globalData = this.globalData;
      instance.$callHook(ON_LAUNCH, options);
    }
  };
  const onErrorHandlers = wx.$onErrorHandlers;
  if (onErrorHandlers) {
    onErrorHandlers.forEach((fn) => {
      injectHook(ON_ERROR, fn, internalInstance);
    });
    onErrorHandlers.length = 0;
  }
  initLocale(instance);
  const vueOptions = instance.$.type;
  initHooks(appOptions, HOOKS);
  initUnknownHooks(appOptions, vueOptions);
  {
    const methods = vueOptions.methods;
    methods && extend(appOptions, methods);
  }
  return appOptions;
}
function initCreateApp(parseAppOptions) {
  return function createApp2(vm) {
    return App(parseApp(vm));
  };
}
function initCreateSubpackageApp(parseAppOptions) {
  return function createApp2(vm) {
    const appOptions = parseApp(vm);
    const app = isFunction(getApp) && getApp({
      allowDefault: true
    });
    if (!app)
      return;
    vm.$.ctx.$scope = app;
    const globalData = app.globalData;
    if (globalData) {
      Object.keys(appOptions.globalData).forEach((name) => {
        if (!hasOwn(globalData, name)) {
          globalData[name] = appOptions.globalData[name];
        }
      });
    }
    Object.keys(appOptions).forEach((name) => {
      if (!hasOwn(app, name)) {
        app[name] = appOptions[name];
      }
    });
    initAppLifecycle(appOptions, vm);
  };
}
function initAppLifecycle(appOptions, vm) {
  if (isFunction(appOptions.onLaunch)) {
    const args = wx.getLaunchOptionsSync && wx.getLaunchOptionsSync();
    appOptions.onLaunch(args);
  }
  if (isFunction(appOptions.onShow) && wx.onAppShow) {
    wx.onAppShow((args) => {
      vm.$callHook("onShow", args);
    });
  }
  if (isFunction(appOptions.onHide) && wx.onAppHide) {
    wx.onAppHide((args) => {
      vm.$callHook("onHide", args);
    });
  }
}
function initLocale(appVm) {
  const locale = ref(getLocaleLanguage());
  Object.defineProperty(appVm, "$locale", {
    get() {
      return locale.value;
    },
    set(v) {
      locale.value = v;
    }
  });
}
const builtInProps = [
  // 百度小程序,快手小程序自定义组件不支持绑定动态事件，动态dataset，故通过props传递事件信息
  // event-opts
  "eO",
  // 组件 ref
  "uR",
  // 组件 ref-in-for
  "uRIF",
  // 组件 id
  "uI",
  // 组件类型 m: 小程序组件
  "uT",
  // 组件 props
  "uP",
  // 小程序不能直接定义 $slots 的 props，所以通过 vueSlots 转换到 $slots
  "uS"
];
function initDefaultProps(options, isBehavior = false) {
  const properties = {};
  if (!isBehavior) {
    let observerSlots = function(newVal) {
      const $slots = /* @__PURE__ */ Object.create(null);
      newVal && newVal.forEach((slotName) => {
        $slots[slotName] = true;
      });
      this.setData({
        $slots
      });
    };
    builtInProps.forEach((name) => {
      properties[name] = {
        type: null,
        value: ""
      };
    });
    properties.uS = {
      type: null,
      value: []
    };
    {
      properties.uS.observer = observerSlots;
    }
  }
  if (options.behaviors) {
    if (options.behaviors.includes("wx://form-field")) {
      if (!options.properties || !options.properties.name) {
        properties.name = {
          type: null,
          value: ""
        };
      }
      if (!options.properties || !options.properties.value) {
        properties.value = {
          type: null,
          value: ""
        };
      }
    }
  }
  return properties;
}
function initVirtualHostProps(options) {
  const properties = {};
  {
    if (options && options.virtualHost) {
      properties[VIRTUAL_HOST_STYLE] = {
        type: null,
        value: ""
      };
      properties[VIRTUAL_HOST_CLASS] = {
        type: null,
        value: ""
      };
      properties[VIRTUAL_HOST_HIDDEN] = {
        type: null,
        value: ""
      };
      properties[VIRTUAL_HOST_ID] = {
        type: null,
        value: ""
      };
    }
  }
  return properties;
}
function initProps(mpComponentOptions) {
  if (!mpComponentOptions.properties) {
    mpComponentOptions.properties = {};
  }
  extend(mpComponentOptions.properties, initDefaultProps(mpComponentOptions), initVirtualHostProps(mpComponentOptions.options));
}
const PROP_TYPES = [String, Number, Boolean, Object, Array, null];
function parsePropType(type2, defaultValue) {
  if (isArray$1(type2) && type2.length === 1) {
    return type2[0];
  }
  return type2;
}
function normalizePropType(type2, defaultValue) {
  const res = parsePropType(type2);
  return PROP_TYPES.indexOf(res) !== -1 ? res : null;
}
function initPageProps({ properties }, rawProps) {
  if (isArray$1(rawProps)) {
    rawProps.forEach((key) => {
      properties[key] = {
        type: String,
        value: ""
      };
    });
  } else if (isPlainObject$2(rawProps)) {
    Object.keys(rawProps).forEach((key) => {
      const opts = rawProps[key];
      if (isPlainObject$2(opts)) {
        let value2 = opts.default;
        if (isFunction(value2)) {
          value2 = value2();
        }
        const type2 = opts.type;
        opts.type = normalizePropType(type2);
        properties[key] = {
          type: opts.type,
          value: value2
        };
      } else {
        properties[key] = {
          type: normalizePropType(opts)
        };
      }
    });
  }
}
function findPropsData(properties, isPage2) {
  return (isPage2 ? findPagePropsData(properties) : findComponentPropsData(resolvePropValue(properties.uP))) || {};
}
function findPagePropsData(properties) {
  const propsData = {};
  if (isPlainObject$2(properties)) {
    Object.keys(properties).forEach((name) => {
      if (builtInProps.indexOf(name) === -1) {
        propsData[name] = resolvePropValue(properties[name]);
      }
    });
  }
  return propsData;
}
function initFormField(vm) {
  const vueOptions = vm.$options;
  if (isArray$1(vueOptions.behaviors) && vueOptions.behaviors.includes("uni://form-field")) {
    vm.$watch("modelValue", () => {
      vm.$scope && vm.$scope.setData({
        name: vm.name,
        value: vm.modelValue
      });
    }, {
      immediate: true
    });
  }
}
function resolvePropValue(prop) {
  return prop;
}
function initData(_) {
  return {};
}
function initPropsObserver(componentOptions) {
  const observe = function observe2() {
    const up = this.properties.uP;
    if (!up) {
      return;
    }
    if (this.$vm) {
      updateComponentProps(resolvePropValue(up), this.$vm.$);
    } else if (resolvePropValue(this.properties.uT) === "m") {
      updateMiniProgramComponentProperties(resolvePropValue(up), this);
    }
  };
  {
    if (!componentOptions.observers) {
      componentOptions.observers = {};
    }
    componentOptions.observers.uP = observe;
  }
}
function updateMiniProgramComponentProperties(up, mpInstance) {
  const prevProps = mpInstance.properties;
  const nextProps = findComponentPropsData(up) || {};
  if (hasPropsChanged(prevProps, nextProps, false)) {
    mpInstance.setData(nextProps);
  }
}
function updateComponentProps(up, instance) {
  const prevProps = toRaw(instance.props);
  const nextProps = findComponentPropsData(up) || {};
  if (hasPropsChanged(prevProps, nextProps)) {
    updateProps(instance, nextProps, prevProps);
    if (hasQueueJob(instance.update)) {
      invalidateJob(instance.update);
    }
    {
      instance.update();
    }
  }
}
function hasPropsChanged(prevProps, nextProps, checkLen = true) {
  const nextKeys = Object.keys(nextProps);
  if (checkLen && nextKeys.length !== Object.keys(prevProps).length) {
    return true;
  }
  for (let i = 0; i < nextKeys.length; i++) {
    const key = nextKeys[i];
    if (nextProps[key] !== prevProps[key]) {
      return true;
    }
  }
  return false;
}
function initBehaviors(vueOptions) {
  const vueBehaviors = vueOptions.behaviors;
  let vueProps = vueOptions.props;
  if (!vueProps) {
    vueOptions.props = vueProps = [];
  }
  const behaviors = [];
  if (isArray$1(vueBehaviors)) {
    vueBehaviors.forEach((behavior) => {
      behaviors.push(behavior.replace("uni://", "wx://"));
      if (behavior === "uni://form-field") {
        if (isArray$1(vueProps)) {
          vueProps.push("name");
          vueProps.push("modelValue");
        } else {
          vueProps.name = {
            type: String,
            default: ""
          };
          vueProps.modelValue = {
            type: [String, Number, Boolean, Array, Object, Date],
            default: ""
          };
        }
      }
    });
  }
  return behaviors;
}
function applyOptions(componentOptions, vueOptions) {
  componentOptions.data = initData();
  componentOptions.behaviors = initBehaviors(vueOptions);
}
function parseComponent(vueOptions, { parse, mocks: mocks2, isPage: isPage2, isPageInProject, initRelation: initRelation2, handleLink: handleLink2, initLifetimes: initLifetimes2 }) {
  vueOptions = vueOptions.default || vueOptions;
  const options = {
    multipleSlots: true,
    // styleIsolation: 'apply-shared',
    addGlobalClass: true,
    pureDataPattern: /^uP$/
  };
  if (isArray$1(vueOptions.mixins)) {
    vueOptions.mixins.forEach((item) => {
      if (isObject$1(item.options)) {
        extend(options, item.options);
      }
    });
  }
  if (vueOptions.options) {
    extend(options, vueOptions.options);
  }
  const mpComponentOptions = {
    options,
    lifetimes: initLifetimes2({ mocks: mocks2, isPage: isPage2, initRelation: initRelation2, vueOptions }),
    pageLifetimes: {
      show() {
        this.$vm && this.$vm.$callHook("onPageShow");
      },
      hide() {
        this.$vm && this.$vm.$callHook("onPageHide");
      },
      resize(size2) {
        this.$vm && this.$vm.$callHook("onPageResize", size2);
      }
    },
    methods: {
      __l: handleLink2
    }
  };
  {
    applyOptions(mpComponentOptions, vueOptions);
  }
  initProps(mpComponentOptions);
  initPropsObserver(mpComponentOptions);
  initExtraOptions(mpComponentOptions, vueOptions);
  initWxsCallMethods(mpComponentOptions.methods, vueOptions.wxsCallMethods);
  {
    initWorkletMethods(mpComponentOptions.methods, vueOptions.methods);
  }
  if (parse) {
    parse(mpComponentOptions, { handleLink: handleLink2 });
  }
  return mpComponentOptions;
}
function initCreateComponent(parseOptions2) {
  return function createComponent2(vueComponentOptions) {
    return Component(parseComponent(vueComponentOptions, parseOptions2));
  };
}
let $createComponentFn;
let $destroyComponentFn;
function getAppVm() {
  return getApp().$vm;
}
function $createComponent(initialVNode, options) {
  if (!$createComponentFn) {
    $createComponentFn = getAppVm().$createComponent;
  }
  const proxy = $createComponentFn(initialVNode, options);
  return getExposeProxy(proxy.$) || proxy;
}
function $destroyComponent(instance) {
  if (!$destroyComponentFn) {
    $destroyComponentFn = getAppVm().$destroyComponent;
  }
  return $destroyComponentFn(instance);
}
function parsePage(vueOptions, parseOptions2) {
  const { parse, mocks: mocks2, isPage: isPage2, initRelation: initRelation2, handleLink: handleLink2, initLifetimes: initLifetimes2 } = parseOptions2;
  const miniProgramPageOptions = parseComponent(vueOptions, {
    mocks: mocks2,
    isPage: isPage2,
    isPageInProject: true,
    initRelation: initRelation2,
    handleLink: handleLink2,
    initLifetimes: initLifetimes2
  });
  initPageProps(miniProgramPageOptions, (vueOptions.default || vueOptions).props);
  const methods = miniProgramPageOptions.methods;
  methods.onLoad = function(query) {
    {
      this.options = query;
    }
    this.$page = {
      fullPath: addLeadingSlash(this.route + stringifyQuery(query))
    };
    return this.$vm && this.$vm.$callHook(ON_LOAD, query);
  };
  initHooks(methods, PAGE_INIT_HOOKS);
  {
    initUnknownHooks(methods, vueOptions);
  }
  initRuntimeHooks(methods, vueOptions.__runtimeHooks);
  initMixinRuntimeHooks(methods);
  parse && parse(miniProgramPageOptions, { handleLink: handleLink2 });
  return miniProgramPageOptions;
}
function initCreatePage(parseOptions2) {
  return function createPage2(vuePageOptions) {
    return Component(parsePage(vuePageOptions, parseOptions2));
  };
}
function initCreatePluginApp(parseAppOptions) {
  return function createApp2(vm) {
    initAppLifecycle(parseApp(vm), vm);
  };
}
const MPPage = Page;
const MPComponent = Component;
function initTriggerEvent(mpInstance) {
  const oldTriggerEvent = mpInstance.triggerEvent;
  const newTriggerEvent = function(event, ...args) {
    return oldTriggerEvent.apply(mpInstance, [
      customizeEvent(event),
      ...args
    ]);
  };
  try {
    mpInstance.triggerEvent = newTriggerEvent;
  } catch (error2) {
    mpInstance._triggerEvent = newTriggerEvent;
  }
}
function initMiniProgramHook(name, options, isComponent) {
  const oldHook = options[name];
  if (!oldHook) {
    options[name] = function() {
      initTriggerEvent(this);
    };
  } else {
    options[name] = function(...args) {
      initTriggerEvent(this);
      return oldHook.apply(this, args);
    };
  }
}
Page = function(options) {
  initMiniProgramHook(ON_LOAD, options);
  return MPPage(options);
};
Component = function(options) {
  initMiniProgramHook("created", options);
  const isVueComponent = options.properties && options.properties.uP;
  if (!isVueComponent) {
    initProps(options);
    initPropsObserver(options);
  }
  return MPComponent(options);
};
function initLifetimes({ mocks: mocks2, isPage: isPage2, initRelation: initRelation2, vueOptions }) {
  return {
    attached() {
      let properties = this.properties;
      initVueIds(properties.uI, this);
      const relationOptions = {
        vuePid: this._$vuePid
      };
      initRelation2(this, relationOptions);
      const mpInstance = this;
      const isMiniProgramPage = isPage2(mpInstance);
      let propsData = properties;
      this.$vm = $createComponent({
        type: vueOptions,
        props: findPropsData(propsData, isMiniProgramPage)
      }, {
        mpType: isMiniProgramPage ? "page" : "component",
        mpInstance,
        slots: properties.uS || {},
        // vueSlots
        parentComponent: relationOptions.parent && relationOptions.parent.$,
        onBeforeSetup(instance, options) {
          initRefs(instance, mpInstance);
          initMocks(instance, mpInstance, mocks2);
          initComponentInstance(instance, options);
        }
      });
      if (!isMiniProgramPage) {
        initFormField(this.$vm);
      }
    },
    ready() {
      if (this.$vm) {
        {
          this.$vm.$callHook("mounted");
          this.$vm.$callHook(ON_READY);
        }
      }
    },
    detached() {
      if (this.$vm) {
        pruneComponentPropsCache(this.$vm.$.uid);
        $destroyComponent(this.$vm);
      }
    }
  };
}
const mocks = ["__route__", "__wxExparserNodeId__", "__wxWebviewId__"];
function isPage(mpInstance) {
  return !!mpInstance.route;
}
function initRelation(mpInstance, detail) {
  mpInstance.triggerEvent("__l", detail);
}
function handleLink(event) {
  const detail = event.detail || event.value;
  const vuePid = detail.vuePid;
  let parentVm;
  if (vuePid) {
    parentVm = findVmByVueId(this.$vm, vuePid);
  }
  if (!parentVm) {
    parentVm = this.$vm;
  }
  detail.parent = parentVm;
}
var parseOptions = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  handleLink,
  initLifetimes,
  initRelation,
  isPage,
  mocks
});
const createApp = initCreateApp();
const createPage = initCreatePage(parseOptions);
const createComponent = initCreateComponent(parseOptions);
const createPluginApp = initCreatePluginApp();
const createSubpackageApp = initCreateSubpackageApp();
{
  wx.createApp = global.createApp = createApp;
  wx.createPage = createPage;
  wx.createComponent = createComponent;
  wx.createPluginApp = global.createPluginApp = createPluginApp;
  wx.createSubpackageApp = global.createSubpackageApp = createSubpackageApp;
}
const createHook = (lifecycle) => (hook, target = getCurrentInstance()) => {
  !isInSSRComponentSetup && injectHook(lifecycle, hook, target);
};
const onShow = /* @__PURE__ */ createHook(ON_SHOW);
const onHide = /* @__PURE__ */ createHook(ON_HIDE);
const onLoad = /* @__PURE__ */ createHook(ON_LOAD);
const onReady = /* @__PURE__ */ createHook(ON_READY);
const onUnload = /* @__PURE__ */ createHook(ON_UNLOAD);
const onPageScroll = /* @__PURE__ */ createHook(ON_PAGE_SCROLL);
const onShareTimeline = /* @__PURE__ */ createHook(ON_SHARE_TIMELINE);
const onShareAppMessage = /* @__PURE__ */ createHook(ON_SHARE_APP_MESSAGE);
function set$2(target, key, val) {
  if (Array.isArray(target)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val;
  }
  target[key] = val;
  return val;
}
function del(target, key) {
  if (Array.isArray(target)) {
    target.splice(key, 1);
    return;
  }
  delete target[key];
}
/*!
 * pinia v2.3.0
 * (c) 2024 Eduardo San Martin Morote
 * @license MIT
 */
let activePinia;
const setActivePinia = (pinia) => activePinia = pinia;
const piniaSymbol = Symbol("pinia");
function isPlainObject$1(o2) {
  return o2 && typeof o2 === "object" && Object.prototype.toString.call(o2) === "[object Object]" && typeof o2.toJSON !== "function";
}
var MutationType;
(function(MutationType2) {
  MutationType2["direct"] = "direct";
  MutationType2["patchObject"] = "patch object";
  MutationType2["patchFunction"] = "patch function";
})(MutationType || (MutationType = {}));
const IS_CLIENT = typeof window !== "undefined";
const componentStateTypes = [];
const getStoreType = (id) => "🍍 " + id;
function addStoreToDevtools(app, store) {
  if (!componentStateTypes.includes(getStoreType(store.$id))) {
    componentStateTypes.push(getStoreType(store.$id));
  }
}
function patchActionForGrouping(store, actionNames, wrapWithProxy) {
  const actions = actionNames.reduce((storeActions, actionName) => {
    storeActions[actionName] = toRaw(store)[actionName];
    return storeActions;
  }, {});
  for (const actionName in actions) {
    store[actionName] = function() {
      const trackedStore = wrapWithProxy ? new Proxy(store, {
        get(...args) {
          return Reflect.get(...args);
        },
        set(...args) {
          return Reflect.set(...args);
        }
      }) : store;
      const retValue = actions[actionName].apply(trackedStore, arguments);
      return retValue;
    };
  }
}
function devtoolsPlugin({ app, store, options }) {
  if (store.$id.startsWith("__hot:")) {
    return;
  }
  store._isOptionsAPI = !!options.state;
  if (!store._p._testing) {
    patchActionForGrouping(store, Object.keys(options.actions), store._isOptionsAPI);
    const originalHotUpdate = store._hotUpdate;
    toRaw(store)._hotUpdate = function(newStore) {
      originalHotUpdate.apply(this, arguments);
      patchActionForGrouping(store, Object.keys(newStore._hmrPayload.actions), !!store._isOptionsAPI);
    };
  }
  addStoreToDevtools(
    app,
    // FIXME: is there a way to allow the assignment from Store<Id, S, G, A> to StoreGeneric?
    store
  );
}
function createPinia() {
  const scope = effectScope(true);
  const state = scope.run(() => ref({}));
  let _p = [];
  let toBeInstalled = [];
  const pinia = markRaw({
    install(app) {
      setActivePinia(pinia);
      {
        pinia._a = app;
        app.provide(piniaSymbol, pinia);
        app.config.globalProperties.$pinia = pinia;
        toBeInstalled.forEach((plugin2) => _p.push(plugin2));
        toBeInstalled = [];
      }
    },
    use(plugin2) {
      if (!this._a && true) {
        toBeInstalled.push(plugin2);
      } else {
        _p.push(plugin2);
      }
      return this;
    },
    _p,
    // it's actually undefined here
    // @ts-expect-error
    _a: null,
    _e: scope,
    _s: /* @__PURE__ */ new Map(),
    state
  });
  if (IS_CLIENT && typeof Proxy !== "undefined") {
    pinia.use(devtoolsPlugin);
  }
  return pinia;
}
function patchObject(newState, oldState) {
  for (const key in oldState) {
    const subPatch = oldState[key];
    if (!(key in newState)) {
      continue;
    }
    const targetValue = newState[key];
    if (isPlainObject$1(targetValue) && isPlainObject$1(subPatch) && !isRef(subPatch) && !isReactive(subPatch)) {
      newState[key] = patchObject(targetValue, subPatch);
    } else {
      {
        newState[key] = subPatch;
      }
    }
  }
  return newState;
}
const noop = () => {
};
function addSubscription(subscriptions, callback, detached, onCleanup = noop) {
  subscriptions.push(callback);
  const removeSubscription = () => {
    const idx = subscriptions.indexOf(callback);
    if (idx > -1) {
      subscriptions.splice(idx, 1);
      onCleanup();
    }
  };
  if (!detached && getCurrentScope()) {
    onScopeDispose(removeSubscription);
  }
  return removeSubscription;
}
function triggerSubscriptions(subscriptions, ...args) {
  subscriptions.slice().forEach((callback) => {
    callback(...args);
  });
}
const fallbackRunWithContext = (fn) => fn();
const ACTION_MARKER = Symbol();
const ACTION_NAME = Symbol();
function mergeReactiveObjects(target, patchToApply) {
  if (target instanceof Map && patchToApply instanceof Map) {
    patchToApply.forEach((value2, key) => target.set(key, value2));
  } else if (target instanceof Set && patchToApply instanceof Set) {
    patchToApply.forEach(target.add, target);
  }
  for (const key in patchToApply) {
    if (!patchToApply.hasOwnProperty(key))
      continue;
    const subPatch = patchToApply[key];
    const targetValue = target[key];
    if (isPlainObject$1(targetValue) && isPlainObject$1(subPatch) && target.hasOwnProperty(key) && !isRef(subPatch) && !isReactive(subPatch)) {
      target[key] = mergeReactiveObjects(targetValue, subPatch);
    } else {
      target[key] = subPatch;
    }
  }
  return target;
}
const skipHydrateSymbol = Symbol("pinia:skipHydration");
function shouldHydrate(obj) {
  return !isPlainObject$1(obj) || !obj.hasOwnProperty(skipHydrateSymbol);
}
const { assign } = Object;
function isComputed(o2) {
  return !!(isRef(o2) && o2.effect);
}
function createOptionsStore(id, options, pinia, hot) {
  const { state, actions, getters } = options;
  const initialState = pinia.state.value[id];
  let store;
  function setup() {
    if (!initialState && !hot) {
      {
        pinia.state.value[id] = state ? state() : {};
      }
    }
    const localState = hot ? (
      // use ref() to unwrap refs inside state TODO: check if this is still necessary
      toRefs(ref(state ? state() : {}).value)
    ) : toRefs(pinia.state.value[id]);
    return assign(localState, actions, Object.keys(getters || {}).reduce((computedGetters, name) => {
      if (name in localState) {
        console.warn(`[🍍]: A getter cannot have the same name as another state property. Rename one of them. Found with "${name}" in store "${id}".`);
      }
      computedGetters[name] = markRaw(computed(() => {
        setActivePinia(pinia);
        const store2 = pinia._s.get(id);
        return getters[name].call(store2, store2);
      }));
      return computedGetters;
    }, {}));
  }
  store = createSetupStore(id, setup, options, pinia, hot, true);
  return store;
}
function createSetupStore($id, setup, options = {}, pinia, hot, isOptionsStore) {
  let scope;
  const optionsForPlugin = assign({ actions: {} }, options);
  if (!pinia._e.active) {
    throw new Error("Pinia destroyed");
  }
  const $subscribeOptions = { deep: true };
  {
    $subscribeOptions.onTrigger = (event) => {
      if (isListening) {
        debuggerEvents = event;
      } else if (isListening == false && !store._hotUpdating) {
        if (Array.isArray(debuggerEvents)) {
          debuggerEvents.push(event);
        } else {
          console.error("🍍 debuggerEvents should be an array. This is most likely an internal Pinia bug.");
        }
      }
    };
  }
  let isListening;
  let isSyncListening;
  let subscriptions = [];
  let actionSubscriptions = [];
  let debuggerEvents;
  const initialState = pinia.state.value[$id];
  if (!isOptionsStore && !initialState && !hot) {
    {
      pinia.state.value[$id] = {};
    }
  }
  const hotState = ref({});
  let activeListener;
  function $patch(partialStateOrMutator) {
    let subscriptionMutation;
    isListening = isSyncListening = false;
    {
      debuggerEvents = [];
    }
    if (typeof partialStateOrMutator === "function") {
      partialStateOrMutator(pinia.state.value[$id]);
      subscriptionMutation = {
        type: MutationType.patchFunction,
        storeId: $id,
        events: debuggerEvents
      };
    } else {
      mergeReactiveObjects(pinia.state.value[$id], partialStateOrMutator);
      subscriptionMutation = {
        type: MutationType.patchObject,
        payload: partialStateOrMutator,
        storeId: $id,
        events: debuggerEvents
      };
    }
    const myListenerId = activeListener = Symbol();
    nextTick$1().then(() => {
      if (activeListener === myListenerId) {
        isListening = true;
      }
    });
    isSyncListening = true;
    triggerSubscriptions(subscriptions, subscriptionMutation, pinia.state.value[$id]);
  }
  const $reset = isOptionsStore ? function $reset2() {
    const { state } = options;
    const newState = state ? state() : {};
    this.$patch(($state) => {
      assign($state, newState);
    });
  } : (
    /* istanbul ignore next */
    () => {
      throw new Error(`🍍: Store "${$id}" is built using the setup syntax and does not implement $reset().`);
    }
  );
  function $dispose() {
    scope.stop();
    subscriptions = [];
    actionSubscriptions = [];
    pinia._s.delete($id);
  }
  const action = (fn, name = "") => {
    if (ACTION_MARKER in fn) {
      fn[ACTION_NAME] = name;
      return fn;
    }
    const wrappedAction = function() {
      setActivePinia(pinia);
      const args = Array.from(arguments);
      const afterCallbackList = [];
      const onErrorCallbackList = [];
      function after(callback) {
        afterCallbackList.push(callback);
      }
      function onError2(callback) {
        onErrorCallbackList.push(callback);
      }
      triggerSubscriptions(actionSubscriptions, {
        args,
        name: wrappedAction[ACTION_NAME],
        store,
        after,
        onError: onError2
      });
      let ret;
      try {
        ret = fn.apply(this && this.$id === $id ? this : store, args);
      } catch (error2) {
        triggerSubscriptions(onErrorCallbackList, error2);
        throw error2;
      }
      if (ret instanceof Promise) {
        return ret.then((value2) => {
          triggerSubscriptions(afterCallbackList, value2);
          return value2;
        }).catch((error2) => {
          triggerSubscriptions(onErrorCallbackList, error2);
          return Promise.reject(error2);
        });
      }
      triggerSubscriptions(afterCallbackList, ret);
      return ret;
    };
    wrappedAction[ACTION_MARKER] = true;
    wrappedAction[ACTION_NAME] = name;
    return wrappedAction;
  };
  const _hmrPayload = /* @__PURE__ */ markRaw({
    actions: {},
    getters: {},
    state: [],
    hotState
  });
  const partialStore = {
    _p: pinia,
    // _s: scope,
    $id,
    $onAction: addSubscription.bind(null, actionSubscriptions),
    $patch,
    $reset,
    $subscribe(callback, options2 = {}) {
      const removeSubscription = addSubscription(subscriptions, callback, options2.detached, () => stopWatcher());
      const stopWatcher = scope.run(() => watch(() => pinia.state.value[$id], (state) => {
        if (options2.flush === "sync" ? isSyncListening : isListening) {
          callback({
            storeId: $id,
            type: MutationType.direct,
            events: debuggerEvents
          }, state);
        }
      }, assign({}, $subscribeOptions, options2)));
      return removeSubscription;
    },
    $dispose
  };
  const store = reactive(assign(
    {
      _hmrPayload,
      _customProperties: markRaw(/* @__PURE__ */ new Set())
      // devtools custom properties
    },
    partialStore
    // must be added later
    // setupStore
  ));
  pinia._s.set($id, store);
  const runWithContext = pinia._a && pinia._a.runWithContext || fallbackRunWithContext;
  const setupStore = runWithContext(() => pinia._e.run(() => (scope = effectScope()).run(() => setup({ action }))));
  for (const key in setupStore) {
    const prop = setupStore[key];
    if (isRef(prop) && !isComputed(prop) || isReactive(prop)) {
      if (hot) {
        set$2(hotState.value, key, toRef(setupStore, key));
      } else if (!isOptionsStore) {
        if (initialState && shouldHydrate(prop)) {
          if (isRef(prop)) {
            prop.value = initialState[key];
          } else {
            mergeReactiveObjects(prop, initialState[key]);
          }
        }
        {
          pinia.state.value[$id][key] = prop;
        }
      }
      {
        _hmrPayload.state.push(key);
      }
    } else if (typeof prop === "function") {
      const actionValue = hot ? prop : action(prop, key);
      {
        setupStore[key] = actionValue;
      }
      {
        _hmrPayload.actions[key] = prop;
      }
      optionsForPlugin.actions[key] = prop;
    } else {
      if (isComputed(prop)) {
        _hmrPayload.getters[key] = isOptionsStore ? (
          // @ts-expect-error
          options.getters[key]
        ) : prop;
        if (IS_CLIENT) {
          const getters = setupStore._getters || // @ts-expect-error: same
          (setupStore._getters = markRaw([]));
          getters.push(key);
        }
      }
    }
  }
  {
    assign(store, setupStore);
    assign(toRaw(store), setupStore);
  }
  Object.defineProperty(store, "$state", {
    get: () => hot ? hotState.value : pinia.state.value[$id],
    set: (state) => {
      if (hot) {
        throw new Error("cannot set hotState");
      }
      $patch(($state) => {
        assign($state, state);
      });
    }
  });
  {
    store._hotUpdate = markRaw((newStore) => {
      store._hotUpdating = true;
      newStore._hmrPayload.state.forEach((stateKey) => {
        if (stateKey in store.$state) {
          const newStateTarget = newStore.$state[stateKey];
          const oldStateSource = store.$state[stateKey];
          if (typeof newStateTarget === "object" && isPlainObject$1(newStateTarget) && isPlainObject$1(oldStateSource)) {
            patchObject(newStateTarget, oldStateSource);
          } else {
            newStore.$state[stateKey] = oldStateSource;
          }
        }
        set$2(store, stateKey, toRef(newStore.$state, stateKey));
      });
      Object.keys(store.$state).forEach((stateKey) => {
        if (!(stateKey in newStore.$state)) {
          del(store, stateKey);
        }
      });
      isListening = false;
      isSyncListening = false;
      pinia.state.value[$id] = toRef(newStore._hmrPayload, "hotState");
      isSyncListening = true;
      nextTick$1().then(() => {
        isListening = true;
      });
      for (const actionName in newStore._hmrPayload.actions) {
        const actionFn = newStore[actionName];
        set$2(store, actionName, action(actionFn, actionName));
      }
      for (const getterName in newStore._hmrPayload.getters) {
        const getter = newStore._hmrPayload.getters[getterName];
        const getterValue = isOptionsStore ? (
          // special handling of options api
          computed(() => {
            setActivePinia(pinia);
            return getter.call(store, store);
          })
        ) : getter;
        set$2(store, getterName, getterValue);
      }
      Object.keys(store._hmrPayload.getters).forEach((key) => {
        if (!(key in newStore._hmrPayload.getters)) {
          del(store, key);
        }
      });
      Object.keys(store._hmrPayload.actions).forEach((key) => {
        if (!(key in newStore._hmrPayload.actions)) {
          del(store, key);
        }
      });
      store._hmrPayload = newStore._hmrPayload;
      store._getters = newStore._getters;
      store._hotUpdating = false;
    });
  }
  if (IS_CLIENT) {
    const nonEnumerable = {
      writable: true,
      configurable: true,
      // avoid warning on devtools trying to display this property
      enumerable: false
    };
    ["_p", "_hmrPayload", "_getters", "_customProperties"].forEach((p2) => {
      Object.defineProperty(store, p2, assign({ value: store[p2] }, nonEnumerable));
    });
  }
  pinia._p.forEach((extender) => {
    if (IS_CLIENT) {
      const extensions = scope.run(() => extender({
        store,
        app: pinia._a,
        pinia,
        options: optionsForPlugin
      }));
      Object.keys(extensions || {}).forEach((key) => store._customProperties.add(key));
      assign(store, extensions);
    } else {
      assign(store, scope.run(() => extender({
        store,
        app: pinia._a,
        pinia,
        options: optionsForPlugin
      })));
    }
  });
  if (store.$state && typeof store.$state === "object" && typeof store.$state.constructor === "function" && !store.$state.constructor.toString().includes("[native code]")) {
    console.warn(`[🍍]: The "state" must be a plain object. It cannot be
	state: () => new MyClass()
Found in store "${store.$id}".`);
  }
  if (initialState && isOptionsStore && options.hydrate) {
    options.hydrate(store.$state, initialState);
  }
  isListening = true;
  isSyncListening = true;
  return store;
}
/*! #__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function defineStore(idOrOptions, setup, setupOptions) {
  let id;
  let options;
  const isSetupStore = typeof setup === "function";
  {
    id = idOrOptions;
    options = isSetupStore ? setupOptions : setup;
  }
  function useStore(pinia, hot) {
    const hasContext = hasInjectionContext();
    pinia = // in test mode, ignore the argument provided as we can always retrieve a
    // pinia instance with getActivePinia()
    pinia || (hasContext ? inject(piniaSymbol, null) : null);
    if (pinia)
      setActivePinia(pinia);
    if (!activePinia) {
      throw new Error(`[🍍]: "getActivePinia()" was called but there was no active Pinia. Are you trying to use a store before calling "app.use(pinia)"?
See https://pinia.vuejs.org/core-concepts/outside-component-usage.html for help.
This will fail in production.`);
    }
    pinia = activePinia;
    if (!pinia._s.has(id)) {
      if (isSetupStore) {
        createSetupStore(id, setup, options, pinia);
      } else {
        createOptionsStore(id, options, pinia);
      }
      {
        useStore._pinia = pinia;
      }
    }
    const store = pinia._s.get(id);
    if (hot) {
      const hotId = "__hot:" + id;
      const newStore = isSetupStore ? createSetupStore(hotId, setup, options, pinia, true) : createOptionsStore(hotId, assign({}, options), pinia, true);
      hot._hotUpdate(newStore);
      delete pinia.state.value[hotId];
      pinia._s.delete(hotId);
    }
    if (IS_CLIENT) {
      const currentInstance2 = getCurrentInstance();
      if (currentInstance2 && currentInstance2.proxy && // avoid adding stores that are just built for hot module replacement
      !hot) {
        const vm = currentInstance2.proxy;
        const cache = "_pStores" in vm ? vm._pStores : vm._pStores = {};
        cache[id] = store;
      }
    }
    return store;
  }
  useStore.$id = id;
  return useStore;
}
function storeToRefs(store) {
  {
    const rawStore = toRaw(store);
    const refs = {};
    for (const key in rawStore) {
      const value2 = rawStore[key];
      if (value2.effect) {
        refs[key] = // ...
        computed({
          get: () => store[key],
          set(value22) {
            store[key] = value22;
          }
        });
      } else if (isRef(value2) || isReactive(value2)) {
        refs[key] = // ---
        toRef(store, key);
      }
    }
    return refs;
  }
}
const defineMixin = (options) => {
  return options;
};
function email(value2) {
  return /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(value2);
}
function mobile(value2) {
  return /^1[23456789]\d{9}$/.test(value2);
}
function url(value2) {
  return /^((https|http|ftp|rtsp|mms):\/\/)(([0-9a-zA-Z_!~*'().&=+$%-]+: )?[0-9a-zA-Z_!~*'().&=+$%-]+@)?(([0-9]{1,3}.){3}[0-9]{1,3}|([0-9a-zA-Z_!~*'()-]+.)*([0-9a-zA-Z][0-9a-zA-Z-]{0,61})?[0-9a-zA-Z].[a-zA-Z]{2,6})(:[0-9]{1,4})?((\/?)|(\/[0-9a-zA-Z_!~*'().;?:@&=+$,%#-]+)+\/?)$/.test(value2);
}
function date$2(value2) {
  if (!value2)
    return false;
  if (typeof value2 === "number") {
    if (value2.toString().length !== 10 && value2.toString().length !== 13) {
      return false;
    }
    return !isNaN(new Date(value2).getTime());
  }
  if (typeof value2 === "string") {
    const numV = Number(value2);
    if (!isNaN(numV)) {
      if (numV.toString().length === 10 || numV.toString().length === 13) {
        return !isNaN(new Date(numV).getTime());
      }
    }
    if (value2.length < 10 || value2.length > 19) {
      return false;
    }
    const dateRegex = /^\d{4}[-\/]\d{2}[-\/]\d{2}( \d{1,2}:\d{2}(:\d{2})?)?$/;
    if (!dateRegex.test(value2)) {
      return false;
    }
    const dateValue = new Date(value2);
    return !isNaN(dateValue.getTime());
  }
  return false;
}
function dateISO(value2) {
  return /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test(value2);
}
function number$2(value2) {
  return /^[\+-]?(\d+\.?\d*|\.\d+|\d\.\d+e\+\d+)$/.test(value2);
}
function string$2(value2) {
  return typeof value2 === "string";
}
function digits(value2) {
  return /^\d+$/.test(value2);
}
function idCard(value2) {
  return /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(
    value2
  );
}
function carNo(value2) {
  const xreg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF]$)|([DF][A-HJ-NP-Z0-9][0-9]{4}$))/;
  const creg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$/;
  if (value2.length === 7) {
    return creg.test(value2);
  }
  if (value2.length === 8) {
    return xreg.test(value2);
  }
  return false;
}
function amount(value2) {
  return /^[1-9]\d*(,\d{3})*(\.\d{1,2})?$|^0\.\d{1,2}$/.test(value2);
}
function chinese(value2) {
  const reg = /^[\u4e00-\u9fa5]+$/gi;
  return reg.test(value2);
}
function letter(value2) {
  return /^[a-zA-Z]*$/.test(value2);
}
function enOrNum(value2) {
  const reg = /^[0-9a-zA-Z]*$/g;
  return reg.test(value2);
}
function contains(value2, param) {
  return value2.indexOf(param) >= 0;
}
function range$3(value2, param) {
  return value2 >= param[0] && value2 <= param[1];
}
function rangeLength(value2, param) {
  return value2.length >= param[0] && value2.length <= param[1];
}
function landline(value2) {
  const reg = /^\d{3,4}-\d{7,8}(-\d{3,4})?$/;
  return reg.test(value2);
}
function empty(value2) {
  switch (typeof value2) {
    case "undefined":
      return true;
    case "string":
      if (value2.replace(/(^[ \t\n\r]*)|([ \t\n\r]*$)/g, "").length == 0)
        return true;
      break;
    case "boolean":
      if (!value2)
        return true;
      break;
    case "number":
      if (value2 === 0 || isNaN(value2))
        return true;
      break;
    case "object":
      if (value2 === null || value2.length === 0)
        return true;
      for (const i in value2) {
        return false;
      }
      return true;
  }
  return false;
}
function jsonString(value2) {
  if (typeof value2 === "string") {
    try {
      const obj = JSON.parse(value2);
      if (typeof obj === "object" && obj) {
        return true;
      }
      return false;
    } catch (e2) {
      return false;
    }
  }
  return false;
}
function array$2(value2) {
  if (typeof Array.isArray === "function") {
    return Array.isArray(value2);
  }
  return Object.prototype.toString.call(value2) === "[object Array]";
}
function object$2(value2) {
  return Object.prototype.toString.call(value2) === "[object Object]";
}
function code(value2, len = 6) {
  return new RegExp(`^\\d{${len}}$`).test(value2);
}
function func(value2) {
  return typeof value2 === "function";
}
function promise(value2) {
  return object$2(value2) && func(value2.then) && func(value2.catch);
}
function image(value2) {
  const newValue = value2.split("?")[0];
  const IMAGE_REGEXP = /\.(jpeg|jpg|gif|png|svg|webp|jfif|bmp|dpg)/i;
  return IMAGE_REGEXP.test(newValue);
}
function video(value2) {
  const VIDEO_REGEXP = /\.(mp4|mpg|mpeg|dat|asf|avi|rm|rmvb|mov|wmv|flv|mkv|m3u8)/i;
  return VIDEO_REGEXP.test(value2);
}
function regExp(o2) {
  return o2 && Object.prototype.toString.call(o2) === "[object RegExp]";
}
const test = {
  email,
  mobile,
  url,
  date: date$2,
  dateISO,
  number: number$2,
  digits,
  idCard,
  carNo,
  amount,
  chinese,
  letter,
  enOrNum,
  contains,
  range: range$3,
  rangeLength,
  empty,
  isEmpty: empty,
  jsonString,
  landline,
  object: object$2,
  array: array$2,
  code,
  func,
  promise,
  video,
  image,
  regExp,
  string: string$2
};
function strip(num, precision = 15) {
  return +parseFloat(Number(num).toPrecision(precision));
}
function digitLength(num) {
  const eSplit = num.toString().split(/[eE]/);
  const len = (eSplit[0].split(".")[1] || "").length - +(eSplit[1] || 0);
  return len > 0 ? len : 0;
}
function float2Fixed(num) {
  if (num.toString().indexOf("e") === -1) {
    return Number(num.toString().replace(".", ""));
  }
  const dLen = digitLength(num);
  return dLen > 0 ? strip(Number(num) * Math.pow(10, dLen)) : Number(num);
}
function checkBoundary(num) {
  {
    if (num > Number.MAX_SAFE_INTEGER || num < Number.MIN_SAFE_INTEGER) {
      console.warn(`${num} 超出了精度限制，结果可能不正确`);
    }
  }
}
function iteratorOperation(arr, operation) {
  const [num1, num2, ...others] = arr;
  let res = operation(num1, num2);
  others.forEach((num) => {
    res = operation(res, num);
  });
  return res;
}
function times(...nums) {
  if (nums.length > 2) {
    return iteratorOperation(nums, times);
  }
  const [num1, num2] = nums;
  const num1Changed = float2Fixed(num1);
  const num2Changed = float2Fixed(num2);
  const baseNum = digitLength(num1) + digitLength(num2);
  const leftValue = num1Changed * num2Changed;
  checkBoundary(leftValue);
  return leftValue / Math.pow(10, baseNum);
}
function divide(...nums) {
  if (nums.length > 2) {
    return iteratorOperation(nums, divide);
  }
  const [num1, num2] = nums;
  const num1Changed = float2Fixed(num1);
  const num2Changed = float2Fixed(num2);
  checkBoundary(num1Changed);
  checkBoundary(num2Changed);
  return times(num1Changed / num2Changed, strip(Math.pow(10, digitLength(num2) - digitLength(num1))));
}
function round(num, ratio) {
  const base = Math.pow(10, ratio);
  let result = divide(Math.round(Math.abs(times(num, base))), base);
  if (num < 0 && result !== 0) {
    result = times(result, -1);
  }
  return result;
}
const version = "3";
{
  console.log(`
 %c uview-plus V${version} %c https://ijry.github.io/uview-plus/ 

`, "color: #ffffff; background: #3c9cff; padding:5px 0;", "color: #3c9cff;background: #ffffff; padding:5px 0;");
}
const config = {
  v: version,
  version,
  // 主题名称
  type: [
    "primary",
    "success",
    "info",
    "error",
    "warning"
  ],
  // 颜色部分，本来可以通过scss的:export导出供js使用，但是奈何nvue不支持
  color: {
    "u-primary": "#2979ff",
    "u-warning": "#ff9900",
    "u-success": "#19be6b",
    "u-error": "#fa3534",
    "u-info": "#909399",
    "u-main-color": "#303133",
    "u-content-color": "#606266",
    "u-tips-color": "#909399",
    "u-light-color": "#c0c4cc",
    "up-primary": "#2979ff",
    "up-warning": "#ff9900",
    "up-success": "#19be6b",
    "up-error": "#fa3534",
    "up-info": "#909399",
    "up-main-color": "#303133",
    "up-content-color": "#606266",
    "up-tips-color": "#909399",
    "up-light-color": "#c0c4cc"
  },
  // 默认单位，可以通过配置为rpx，那么在用于传入组件大小参数为数值时，就默认为rpx
  unit: "px"
};
function range$2(min = 0, max = 0, value2 = 0) {
  return Math.max(min, Math.min(max, Number(value2)));
}
function getPx(value2, unit = false) {
  if (number$2(value2)) {
    return unit ? `${value2}px` : Number(value2);
  }
  if (/(rpx|upx)$/.test(value2)) {
    return unit ? `${index$1.upx2px(parseInt(value2))}px` : Number(index$1.upx2px(parseInt(value2)));
  }
  return unit ? `${parseInt(value2)}px` : parseInt(value2);
}
function sleep(value2 = 30) {
  return new Promise((resolve2) => {
    setTimeout(() => {
      resolve2();
    }, value2);
  });
}
function os() {
  return index$1.getSystemInfoSync().platform.toLowerCase();
}
function sys() {
  return index$1.getSystemInfoSync();
}
function random(min, max) {
  if (min >= 0 && max > 0 && max >= min) {
    const gab = max - min + 1;
    return Math.floor(Math.random() * gab + min);
  }
  return 0;
}
function guid(len = 32, firstU = true, radix = null) {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
  const uuid = [];
  radix = radix || chars.length;
  if (len) {
    for (let i = 0; i < len; i++)
      uuid[i] = chars[0 | Math.random() * radix];
  } else {
    let r2;
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = "-";
    uuid[14] = "4";
    for (let i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r2 = 0 | Math.random() * 16;
        uuid[i] = chars[i == 19 ? r2 & 3 | 8 : r2];
      }
    }
  }
  if (firstU) {
    uuid.shift();
    return `u${uuid.join("")}`;
  }
  return uuid.join("");
}
function $parent(name = void 0) {
  let parent = this.$parent;
  while (parent) {
    name = name.replace(/up-([a-zA-Z0-9-_]+)/g, "u-$1");
    if (parent.$options && parent.$options.name !== name) {
      parent = parent.$parent;
    } else {
      return parent;
    }
  }
  return false;
}
function addStyle(customStyle, target = "object") {
  if (empty(customStyle) || typeof customStyle === "object" && target === "object" || target === "string" && typeof customStyle === "string") {
    return customStyle;
  }
  if (target === "object") {
    customStyle = trim$1(customStyle);
    const styleArray = customStyle.split(";");
    const style = {};
    for (let i = 0; i < styleArray.length; i++) {
      if (styleArray[i]) {
        const item = styleArray[i].split(":");
        style[trim$1(item[0])] = trim$1(item[1]);
      }
    }
    return style;
  }
  let string2 = "";
  if (typeof customStyle === "object") {
    customStyle.forEach((val, i) => {
      const key = i.replace(/([A-Z])/g, "-$1").toLowerCase();
      string2 += `${key}:${val};`;
    });
  }
  return trim$1(string2);
}
function addUnit(value2 = "auto", unit = "") {
  if (!unit) {
    unit = config.unit || "px";
  }
  if (unit == "rpx" && number$2(String(value2))) {
    value2 = value2 * 2;
  }
  value2 = String(value2);
  return number$2(value2) ? `${value2}${unit}` : value2;
}
function deepClone(obj) {
  if ([null, void 0, NaN, false].includes(obj))
    return obj;
  if (typeof obj !== "object" && typeof obj !== "function") {
    return obj;
  }
  const o2 = array$2(obj) ? [] : {};
  for (const i in obj) {
    if (obj.hasOwnProperty(i)) {
      o2[i] = typeof obj[i] === "object" ? deepClone(obj[i]) : obj[i];
    }
  }
  return o2;
}
function deepMerge$3(targetOrigin = {}, source = {}) {
  let target = deepClone(targetOrigin);
  if (typeof target !== "object" || typeof source !== "object")
    return false;
  for (const prop in source) {
    if (!source.hasOwnProperty(prop))
      continue;
    if (prop in target) {
      if (source[prop] == null) {
        target[prop] = source[prop];
      } else if (typeof target[prop] !== "object") {
        target[prop] = source[prop];
      } else if (typeof source[prop] !== "object") {
        target[prop] = source[prop];
      } else if (target[prop].concat && source[prop].concat) {
        target[prop] = target[prop].concat(source[prop]);
      } else {
        target[prop] = deepMerge$3(target[prop], source[prop]);
      }
    } else {
      target[prop] = source[prop];
    }
  }
  return target;
}
function shallowMerge(target, source = {}) {
  if (typeof target !== "object" || typeof source !== "object")
    return false;
  for (const prop in source) {
    if (!source.hasOwnProperty(prop))
      continue;
    if (prop in target) {
      if (source[prop] == null) {
        target[prop] = source[prop];
      } else if (typeof target[prop] !== "object") {
        target[prop] = source[prop];
      } else if (typeof source[prop] !== "object") {
        target[prop] = source[prop];
      } else if (target[prop].concat && source[prop].concat) {
        target[prop] = target[prop].concat(source[prop]);
      } else {
        target[prop] = shallowMerge(target[prop], source[prop]);
      }
    } else {
      target[prop] = source[prop];
    }
  }
  return target;
}
function error(err) {
  {
    console.error(`uView提示：${err}`);
  }
}
function randomArray(array2 = []) {
  return array2.sort(() => Math.random() - 0.5);
}
if (!String.prototype.padStart) {
  String.prototype.padStart = function(maxLength, fillString = " ") {
    if (Object.prototype.toString.call(fillString) !== "[object String]") {
      throw new TypeError(
        "fillString must be String"
      );
    }
    const str = this;
    if (str.length >= maxLength)
      return String(str);
    const fillLength = maxLength - str.length;
    let times2 = Math.ceil(fillLength / fillString.length);
    while (times2 >>= 1) {
      fillString += fillString;
      if (times2 === 1) {
        fillString += fillString;
      }
    }
    return fillString.slice(0, fillLength) + str;
  };
}
function timeFormat(dateTime = null, formatStr = "yyyy-mm-dd") {
  let date2;
  if (!dateTime) {
    date2 = /* @__PURE__ */ new Date();
  } else if (/^\d{10}$/.test(dateTime.toString().trim())) {
    date2 = new Date(dateTime * 1e3);
  } else if (typeof dateTime === "string" && /^\d+$/.test(dateTime.trim())) {
    date2 = new Date(Number(dateTime));
  } else {
    date2 = new Date(
      typeof dateTime === "string" ? dateTime.replace(/-/g, "/") : dateTime
    );
  }
  const timeSource = {
    "y": date2.getFullYear().toString(),
    // 年
    "m": (date2.getMonth() + 1).toString().padStart(2, "0"),
    // 月
    "d": date2.getDate().toString().padStart(2, "0"),
    // 日
    "h": date2.getHours().toString().padStart(2, "0"),
    // 时
    "M": date2.getMinutes().toString().padStart(2, "0"),
    // 分
    "s": date2.getSeconds().toString().padStart(2, "0")
    // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };
  for (const key in timeSource) {
    const [ret] = new RegExp(`${key}+`).exec(formatStr) || [];
    if (ret) {
      const beginIndex = key === "y" && ret.length === 2 ? 2 : 0;
      formatStr = formatStr.replace(ret, timeSource[key].slice(beginIndex));
    }
  }
  return formatStr;
}
function timeFrom(timestamp = null, format2 = "yyyy-mm-dd") {
  if (timestamp == null)
    timestamp = Number(/* @__PURE__ */ new Date());
  timestamp = parseInt(timestamp);
  if (timestamp.toString().length == 10)
    timestamp *= 1e3;
  let timer = (/* @__PURE__ */ new Date()).getTime() - timestamp;
  timer = parseInt(timer / 1e3);
  let tips = "";
  switch (true) {
    case timer < 300:
      tips = "刚刚";
      break;
    case (timer >= 300 && timer < 3600):
      tips = `${parseInt(timer / 60)}分钟前`;
      break;
    case (timer >= 3600 && timer < 86400):
      tips = `${parseInt(timer / 3600)}小时前`;
      break;
    case (timer >= 86400 && timer < 2592e3):
      tips = `${parseInt(timer / 86400)}天前`;
      break;
    default:
      if (format2 === false) {
        if (timer >= 2592e3 && timer < 365 * 86400) {
          tips = `${parseInt(timer / (86400 * 30))}个月前`;
        } else {
          tips = `${parseInt(timer / (86400 * 365))}年前`;
        }
      } else {
        tips = timeFormat(timestamp, format2);
      }
  }
  return tips;
}
function trim$1(str, pos = "both") {
  str = String(str);
  if (pos == "both") {
    return str.replace(/^\s+|\s+$/g, "");
  }
  if (pos == "left") {
    return str.replace(/^\s*/, "");
  }
  if (pos == "right") {
    return str.replace(/(\s*$)/g, "");
  }
  if (pos == "all") {
    return str.replace(/\s+/g, "");
  }
  return str;
}
function queryParams(data = {}, isPrefix = true, arrayFormat = "brackets") {
  const prefix = isPrefix ? "?" : "";
  const _result = [];
  if (["indices", "brackets", "repeat", "comma"].indexOf(arrayFormat) == -1)
    arrayFormat = "brackets";
  for (const key in data) {
    const value2 = data[key];
    if (["", void 0, null].indexOf(value2) >= 0) {
      continue;
    }
    if (value2.constructor === Array) {
      switch (arrayFormat) {
        case "indices":
          for (let i = 0; i < value2.length; i++) {
            _result.push(`${key}[${i}]=${value2[i]}`);
          }
          break;
        case "brackets":
          value2.forEach((_value) => {
            _result.push(`${key}[]=${_value}`);
          });
          break;
        case "repeat":
          value2.forEach((_value) => {
            _result.push(`${key}=${_value}`);
          });
          break;
        case "comma":
          let commaStr = "";
          value2.forEach((_value) => {
            commaStr += (commaStr ? "," : "") + _value;
          });
          _result.push(`${key}=${commaStr}`);
          break;
        default:
          value2.forEach((_value) => {
            _result.push(`${key}[]=${_value}`);
          });
      }
    } else {
      _result.push(`${key}=${value2}`);
    }
  }
  return _result.length ? prefix + _result.join("&") : "";
}
function toast(title, duration = 2e3) {
  index$1.showToast({
    title: String(title),
    icon: "none",
    duration
  });
}
function type2icon(type2 = "success", fill = false) {
  if (["primary", "info", "error", "warning", "success"].indexOf(type2) == -1)
    type2 = "success";
  let iconName = "";
  switch (type2) {
    case "primary":
      iconName = "info-circle";
      break;
    case "info":
      iconName = "info-circle";
      break;
    case "error":
      iconName = "close-circle";
      break;
    case "warning":
      iconName = "error-circle";
      break;
    case "success":
      iconName = "checkmark-circle";
      break;
    default:
      iconName = "checkmark-circle";
  }
  if (fill)
    iconName += "-fill";
  return iconName;
}
function priceFormat(number2, decimals = 0, decimalPoint = ".", thousandsSeparator = ",") {
  number2 = `${number2}`.replace(/[^0-9+-Ee.]/g, "");
  const n2 = !isFinite(+number2) ? 0 : +number2;
  const prec = !isFinite(+decimals) ? 0 : Math.abs(decimals);
  const sep = typeof thousandsSeparator === "undefined" ? "," : thousandsSeparator;
  const dec = typeof decimalPoint === "undefined" ? "." : decimalPoint;
  let s2 = "";
  s2 = (prec ? round(n2, prec) + "" : `${Math.round(n2)}`).split(".");
  const re = /(-?\d+)(\d{3})/;
  while (re.test(s2[0])) {
    s2[0] = s2[0].replace(re, `$1${sep}$2`);
  }
  if ((s2[1] || "").length < prec) {
    s2[1] = s2[1] || "";
    s2[1] += new Array(prec - s2[1].length + 1).join("0");
  }
  return s2.join(dec);
}
function getDuration(value2, unit = true) {
  const valueNum = parseInt(value2);
  if (unit) {
    if (/s$/.test(value2))
      return value2;
    return value2 > 30 ? `${value2}ms` : `${value2}s`;
  }
  if (/ms$/.test(value2))
    return valueNum;
  if (/s$/.test(value2))
    return valueNum > 30 ? valueNum : valueNum * 1e3;
  return valueNum;
}
function padZero(value2) {
  return `00${value2}`.slice(-2);
}
function formValidate(instance, event) {
  const formItem = $parent.call(instance, "u-form-item");
  const form = $parent.call(instance, "u-form");
  if (formItem && form) {
    form.validateField(formItem.prop, () => {
    }, event);
  }
}
function getProperty(obj, key) {
  if (typeof obj !== "object" || null == obj) {
    return "";
  }
  if (typeof key !== "string" || key === "") {
    return "";
  }
  if (key.indexOf(".") !== -1) {
    const keys = key.split(".");
    let firstObj = obj[keys[0]] || {};
    for (let i = 1; i < keys.length; i++) {
      if (firstObj) {
        firstObj = firstObj[keys[i]];
      }
    }
    return firstObj;
  }
  return obj[key];
}
function setProperty(obj, key, value2) {
  if (typeof obj !== "object" || null == obj) {
    return;
  }
  const inFn = function(_obj, keys, v) {
    if (keys.length === 1) {
      _obj[keys[0]] = v;
      return;
    }
    while (keys.length > 1) {
      const k = keys[0];
      if (!_obj[k] || typeof _obj[k] !== "object") {
        _obj[k] = {};
      }
      keys.shift();
      inFn(_obj[k], keys, v);
    }
  };
  if (typeof key !== "string" || key === "")
    ;
  else if (key.indexOf(".") !== -1) {
    const keys = key.split(".");
    inFn(obj, keys, value2);
  } else {
    obj[key] = value2;
  }
}
function page() {
  const pages2 = getCurrentPages();
  return `/${pages2[pages2.length - 1].route || ""}`;
}
function pages() {
  const pages2 = getCurrentPages();
  return pages2;
}
function getValueByPath(obj, path) {
  const pathArr = path.split(".");
  return pathArr.reduce((acc, curr) => {
    return acc && acc[curr] !== void 0 ? acc[curr] : void 0;
  }, obj);
}
const index = {
  range: range$2,
  getPx,
  sleep,
  os,
  sys,
  random,
  guid,
  $parent,
  addStyle,
  addUnit,
  deepClone,
  deepMerge: deepMerge$3,
  shallowMerge,
  error,
  randomArray,
  timeFormat,
  timeFrom,
  trim: trim$1,
  queryParams,
  toast,
  type2icon,
  priceFormat,
  getDuration,
  padZero,
  formValidate,
  getProperty,
  setProperty,
  page,
  pages,
  getValueByPath
  // setConfig
};
class Router {
  constructor() {
    this.config = {
      type: "navigateTo",
      url: "",
      delta: 1,
      // navigateBack页面后退时,回退的层数
      params: {},
      // 传递的参数
      animationType: "pop-in",
      // 窗口动画,只在APP有效
      animationDuration: 300,
      // 窗口动画持续时间,单位毫秒,只在APP有效
      intercept: false
      // 是否需要拦截
    };
    this.route = this.route.bind(this);
  }
  // 判断url前面是否有"/"，如果没有则加上，否则无法跳转
  addRootPath(url2) {
    return url2[0] === "/" ? url2 : `/${url2}`;
  }
  // 整合路由参数
  mixinParam(url2, params) {
    url2 = url2 && this.addRootPath(url2);
    let query = "";
    if (/.*\/.*\?.*=.*/.test(url2)) {
      query = queryParams(params, false);
      return url2 += `&${query}`;
    }
    query = queryParams(params);
    return url2 += query;
  }
  // 对外的方法名称
  async route(options = {}, params = {}) {
    let mergeConfig2 = {};
    if (typeof options === "string") {
      mergeConfig2.url = this.mixinParam(options, params);
      mergeConfig2.type = "navigateTo";
    } else {
      mergeConfig2 = deepMerge$3(this.config, options);
      mergeConfig2.url = this.mixinParam(options.url, options.params);
    }
    if (mergeConfig2.url === page())
      return;
    if (params.intercept) {
      this.config.intercept = params.intercept;
    }
    mergeConfig2.params = params;
    mergeConfig2 = deepMerge$3(this.config, mergeConfig2);
    if (typeof index$1.$u.routeIntercept === "function") {
      const isNext = await new Promise((resolve2, reject) => {
        index$1.$u.routeIntercept(mergeConfig2, resolve2);
      });
      isNext && this.openPage(mergeConfig2);
    } else {
      this.openPage(mergeConfig2);
    }
  }
  // 执行路由跳转
  openPage(config2) {
    const {
      url: url2,
      type: type2,
      delta,
      animationType,
      animationDuration
    } = config2;
    if (config2.type == "navigateTo" || config2.type == "to") {
      index$1.navigateTo({
        url: url2,
        animationType,
        animationDuration
      });
    }
    if (config2.type == "redirectTo" || config2.type == "redirect") {
      index$1.redirectTo({
        url: url2
      });
    }
    if (config2.type == "switchTab" || config2.type == "tab") {
      index$1.switchTab({
        url: url2
      });
    }
    if (config2.type == "reLaunch" || config2.type == "launch") {
      index$1.reLaunch({
        url: url2
      });
    }
    if (config2.type == "navigateBack" || config2.type == "back") {
      index$1.navigateBack({
        delta
      });
    }
  }
}
const route = new Router().route;
const mixin = defineMixin({
  // 定义每个组件都可能需要用到的外部样式以及类名
  props: {
    // 每个组件都有的父组件传递的样式，可以为字符串或者对象形式
    customStyle: {
      type: [Object, String],
      default: () => ({})
    },
    customClass: {
      type: String,
      default: ""
    },
    // 跳转的页面路径
    url: {
      type: String,
      default: ""
    },
    // 页面跳转的类型
    linkType: {
      type: String,
      default: "navigateTo"
    }
  },
  data() {
    return {};
  },
  onLoad() {
    this.$u.getRect = this.$uGetRect;
  },
  created() {
    this.$u.getRect = this.$uGetRect;
  },
  computed: {
    // 在2.x版本中，将会把$u挂载到uni对象下，导致在模板中无法使用uni.$u.xxx形式
    // 所以这里通过computed计算属性将其附加到this.$u上，就可以在模板或者js中使用uni.$u.xxx
    // 只在nvue环境通过此方式引入完整的$u，其他平台会出现性能问题，非nvue则按需引入（主要原因是props过大）
    $u() {
      return deepMerge$3(index$1.$u, {
        props: void 0,
        http: void 0,
        mixin: void 0
      });
    },
    /**
     * 生成bem规则类名
     * 由于微信小程序，H5，nvue之间绑定class的差异，无法通过:class="[bem()]"的形式进行同用
     * 故采用如下折中做法，最后返回的是数组（一般平台）或字符串（支付宝和字节跳动平台），类似['a', 'b', 'c']或'a b c'的形式
     * @param {String} name 组件名称
     * @param {Array} fixed 一直会存在的类名
     * @param {Array} change 会根据变量值为true或者false而出现或者隐藏的类名
     * @returns {Array|string}
     */
    bem() {
      return function(name, fixed, change) {
        const prefix = `u-${name}--`;
        const classes = {};
        if (fixed) {
          fixed.map((item) => {
            classes[prefix + this[item]] = true;
          });
        }
        if (change) {
          change.map((item) => {
            this[item] ? classes[prefix + item] = this[item] : delete classes[prefix + item];
          });
        }
        return Object.keys(classes);
      };
    }
  },
  methods: {
    // 跳转某一个页面
    openPage(urlKey = "url") {
      const url2 = this[urlKey];
      if (url2) {
        route({ type: this.linkType, url: url2 });
      }
    },
    navTo(url2 = "", linkType = "navigateTo") {
      route({ type: this.linkType, url: url2 });
    },
    // 查询节点信息
    // 目前此方法在支付宝小程序中无法获取组件跟接点的尺寸，为支付宝的bug(2020-07-21)
    // 解决办法为在组件根部再套一个没有任何作用的view元素
    $uGetRect(selector, all) {
      return new Promise((resolve2) => {
        index$1.createSelectorQuery().in(this)[all ? "selectAll" : "select"](selector).boundingClientRect((rect) => {
          if (all && Array.isArray(rect) && rect.length) {
            resolve2(rect);
          }
          if (!all && rect) {
            resolve2(rect);
          }
        }).exec();
      });
    },
    getParentData(parentName = "") {
      if (!this.parent)
        this.parent = {};
      this.parent = $parent.call(this, parentName);
      if (this.parent.children) {
        this.parent.children.indexOf(this) === -1 && this.parent.children.push(this);
      }
      if (this.parent && this.parentData) {
        Object.keys(this.parentData).map((key) => {
          this.parentData[key] = this.parent[key];
        });
      }
    },
    // 阻止事件冒泡
    preventEvent(e2) {
      e2 && typeof e2.stopPropagation === "function" && e2.stopPropagation();
    },
    // 空操作
    noop(e2) {
      this.preventEvent(e2);
    }
  },
  onReachBottom() {
    index$1.$emit("uOnReachBottom");
  },
  beforeUnmount() {
    if (this.parent && test.array(this.parent.children)) {
      const childrenList = this.parent.children;
      childrenList.map((child, index2) => {
        if (child === this) {
          childrenList.splice(index2, 1);
        }
      });
    }
  }
});
const mpMixin = defineMixin({
  // 将自定义节点设置成虚拟的，更加接近Vue组件的表现，能更好的使用flex属性
  options: {
    virtualHost: true
  }
});
const { toString: toString$2 } = Object.prototype;
function isArray(val) {
  return toString$2.call(val) === "[object Array]";
}
function isObject(val) {
  return val !== null && typeof val === "object";
}
function isDate(val) {
  return toString$2.call(val) === "[object Date]";
}
function isURLSearchParams(val) {
  return typeof URLSearchParams !== "undefined" && val instanceof URLSearchParams;
}
function forEach(obj, fn) {
  if (obj === null || typeof obj === "undefined") {
    return;
  }
  if (typeof obj !== "object") {
    obj = [obj];
  }
  if (isArray(obj)) {
    for (let i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}
function isPlainObject(obj) {
  return Object.prototype.toString.call(obj) === "[object Object]";
}
function deepMerge$2() {
  const result = {};
  function assignValue2(val, key) {
    if (typeof result[key] === "object" && typeof val === "object") {
      result[key] = deepMerge$2(result[key], val);
    } else if (typeof val === "object") {
      result[key] = deepMerge$2({}, val);
    } else {
      result[key] = val;
    }
  }
  for (let i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue2);
  }
  return result;
}
function isUndefined(val) {
  return typeof val === "undefined";
}
function encode(val) {
  return encodeURIComponent(val).replace(/%40/gi, "@").replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
}
function buildURL(url2, params) {
  if (!params) {
    return url2;
  }
  let serializedParams;
  if (isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    const parts = [];
    forEach(params, (val, key) => {
      if (val === null || typeof val === "undefined") {
        return;
      }
      if (isArray(val)) {
        key = `${key}[]`;
      } else {
        val = [val];
      }
      forEach(val, (v) => {
        if (isDate(v)) {
          v = v.toISOString();
        } else if (isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(`${encode(key)}=${encode(v)}`);
      });
    });
    serializedParams = parts.join("&");
  }
  if (serializedParams) {
    const hashmarkIndex = url2.indexOf("#");
    if (hashmarkIndex !== -1) {
      url2 = url2.slice(0, hashmarkIndex);
    }
    url2 += (url2.indexOf("?") === -1 ? "?" : "&") + serializedParams;
  }
  return url2;
}
function isAbsoluteURL(url2) {
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url2);
}
function combineURLs(baseURL, relativeURL) {
  return relativeURL ? `${baseURL.replace(/\/+$/, "")}/${relativeURL.replace(/^\/+/, "")}` : baseURL;
}
function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
}
function settle(resolve2, reject, response) {
  const { validateStatus: validateStatus2 } = response.config;
  const status = response.statusCode;
  if (status && (!validateStatus2 || validateStatus2(status))) {
    resolve2(response);
  } else {
    reject(response);
  }
}
const mergeKeys$1 = (keys, config2) => {
  const config3 = {};
  keys.forEach((prop) => {
    if (!isUndefined(config2[prop])) {
      config3[prop] = config2[prop];
    }
  });
  return config3;
};
const adapter = (config2) => new Promise((resolve2, reject) => {
  const fullPath = buildURL(buildFullPath(config2.baseURL, config2.url), config2.params);
  const _config = {
    url: fullPath,
    header: config2.header,
    complete: (response) => {
      config2.fullPath = fullPath;
      response.config = config2;
      try {
        if (typeof response.data === "string") {
          response.data = JSON.parse(response.data);
        }
      } catch (e2) {
      }
      settle(resolve2, reject, response);
    }
  };
  let requestTask;
  if (config2.method === "UPLOAD") {
    delete _config.header["content-type"];
    delete _config.header["Content-Type"];
    const otherConfig = {
      filePath: config2.filePath,
      name: config2.name
    };
    const optionalKeys = [
      "formData"
    ];
    requestTask = index$1.uploadFile({ ..._config, ...otherConfig, ...mergeKeys$1(optionalKeys, config2) });
  } else if (config2.method === "DOWNLOAD") {
    requestTask = index$1.downloadFile(_config);
  } else {
    const optionalKeys = [
      "data",
      "method",
      "timeout",
      "dataType",
      "responseType"
    ];
    requestTask = index$1.request({ ..._config, ...mergeKeys$1(optionalKeys, config2) });
  }
  if (config2.getTask) {
    config2.getTask(requestTask, config2);
  }
});
const dispatchRequest = (config2) => adapter(config2);
function InterceptorManager() {
  this.handlers = [];
}
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled,
    rejected
  });
  return this.handlers.length - 1;
};
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};
InterceptorManager.prototype.forEach = function forEach2(fn) {
  this.handlers.forEach((h) => {
    if (h !== null) {
      fn(h);
    }
  });
};
const mergeKeys = (keys, globalsConfig, config2) => {
  const config3 = {};
  keys.forEach((prop) => {
    if (!isUndefined(config2[prop])) {
      config3[prop] = config2[prop];
    } else if (!isUndefined(globalsConfig[prop])) {
      config3[prop] = globalsConfig[prop];
    }
  });
  return config3;
};
const mergeConfig = (globalsConfig, config2 = {}) => {
  const method2 = config2.method || globalsConfig.method || "GET";
  let config3 = {
    baseURL: globalsConfig.baseURL || "",
    method: method2,
    url: config2.url || "",
    params: config2.params || {},
    custom: { ...globalsConfig.custom || {}, ...config2.custom || {} },
    header: deepMerge$2(globalsConfig.header || {}, config2.header || {})
  };
  const defaultToConfig2Keys = ["getTask", "validateStatus"];
  config3 = { ...config3, ...mergeKeys(defaultToConfig2Keys, globalsConfig, config2) };
  if (method2 === "DOWNLOAD")
    ;
  else if (method2 === "UPLOAD") {
    delete config3.header["content-type"];
    delete config3.header["Content-Type"];
    const uploadKeys = [
      "filePath",
      "name",
      "formData"
    ];
    uploadKeys.forEach((prop) => {
      if (!isUndefined(config2[prop])) {
        config3[prop] = config2[prop];
      }
    });
  } else {
    const defaultsKeys = [
      "data",
      "timeout",
      "dataType",
      "responseType"
    ];
    config3 = { ...config3, ...mergeKeys(defaultsKeys, globalsConfig, config2) };
  }
  return config3;
};
const defaults = {
  baseURL: "",
  header: {},
  method: "GET",
  dataType: "json",
  responseType: "text",
  custom: {},
  timeout: 6e4,
  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};
var clone = function() {
  function _instanceof(obj, type2) {
    return type2 != null && obj instanceof type2;
  }
  var nativeMap;
  try {
    nativeMap = Map;
  } catch (_) {
    nativeMap = function() {
    };
  }
  var nativeSet;
  try {
    nativeSet = Set;
  } catch (_) {
    nativeSet = function() {
    };
  }
  var nativePromise;
  try {
    nativePromise = Promise;
  } catch (_) {
    nativePromise = function() {
    };
  }
  function clone2(parent, circular, depth, prototype, includeNonEnumerable) {
    if (typeof circular === "object") {
      depth = circular.depth;
      prototype = circular.prototype;
      includeNonEnumerable = circular.includeNonEnumerable;
      circular = circular.circular;
    }
    var allParents = [];
    var allChildren = [];
    var useBuffer = typeof Buffer != "undefined";
    if (typeof circular == "undefined")
      circular = true;
    if (typeof depth == "undefined")
      depth = Infinity;
    function _clone(parent2, depth2) {
      if (parent2 === null)
        return null;
      if (depth2 === 0)
        return parent2;
      var child;
      var proto;
      if (typeof parent2 != "object") {
        return parent2;
      }
      if (_instanceof(parent2, nativeMap)) {
        child = new nativeMap();
      } else if (_instanceof(parent2, nativeSet)) {
        child = new nativeSet();
      } else if (_instanceof(parent2, nativePromise)) {
        child = new nativePromise(function(resolve2, reject) {
          parent2.then(function(value2) {
            resolve2(_clone(value2, depth2 - 1));
          }, function(err) {
            reject(_clone(err, depth2 - 1));
          });
        });
      } else if (clone2.__isArray(parent2)) {
        child = [];
      } else if (clone2.__isRegExp(parent2)) {
        child = new RegExp(parent2.source, __getRegExpFlags(parent2));
        if (parent2.lastIndex)
          child.lastIndex = parent2.lastIndex;
      } else if (clone2.__isDate(parent2)) {
        child = new Date(parent2.getTime());
      } else if (useBuffer && Buffer.isBuffer(parent2)) {
        if (Buffer.from) {
          child = Buffer.from(parent2);
        } else {
          child = new Buffer(parent2.length);
          parent2.copy(child);
        }
        return child;
      } else if (_instanceof(parent2, Error)) {
        child = Object.create(parent2);
      } else {
        if (typeof prototype == "undefined") {
          proto = Object.getPrototypeOf(parent2);
          child = Object.create(proto);
        } else {
          child = Object.create(prototype);
          proto = prototype;
        }
      }
      if (circular) {
        var index2 = allParents.indexOf(parent2);
        if (index2 != -1) {
          return allChildren[index2];
        }
        allParents.push(parent2);
        allChildren.push(child);
      }
      if (_instanceof(parent2, nativeMap)) {
        parent2.forEach(function(value2, key) {
          var keyChild = _clone(key, depth2 - 1);
          var valueChild = _clone(value2, depth2 - 1);
          child.set(keyChild, valueChild);
        });
      }
      if (_instanceof(parent2, nativeSet)) {
        parent2.forEach(function(value2) {
          var entryChild = _clone(value2, depth2 - 1);
          child.add(entryChild);
        });
      }
      for (var i in parent2) {
        var attrs = Object.getOwnPropertyDescriptor(parent2, i);
        if (attrs) {
          child[i] = _clone(parent2[i], depth2 - 1);
        }
        try {
          var objProperty = Object.getOwnPropertyDescriptor(parent2, i);
          if (objProperty.set === "undefined") {
            continue;
          }
          child[i] = _clone(parent2[i], depth2 - 1);
        } catch (e2) {
          if (e2 instanceof TypeError) {
            continue;
          } else if (e2 instanceof ReferenceError) {
            continue;
          }
        }
      }
      if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(parent2);
        for (var i = 0; i < symbols.length; i++) {
          var symbol = symbols[i];
          var descriptor = Object.getOwnPropertyDescriptor(parent2, symbol);
          if (descriptor && !descriptor.enumerable && !includeNonEnumerable) {
            continue;
          }
          child[symbol] = _clone(parent2[symbol], depth2 - 1);
          Object.defineProperty(child, symbol, descriptor);
        }
      }
      if (includeNonEnumerable) {
        var allPropertyNames = Object.getOwnPropertyNames(parent2);
        for (var i = 0; i < allPropertyNames.length; i++) {
          var propertyName = allPropertyNames[i];
          var descriptor = Object.getOwnPropertyDescriptor(parent2, propertyName);
          if (descriptor && descriptor.enumerable) {
            continue;
          }
          child[propertyName] = _clone(parent2[propertyName], depth2 - 1);
          Object.defineProperty(child, propertyName, descriptor);
        }
      }
      return child;
    }
    return _clone(parent, depth);
  }
  clone2.clonePrototype = function clonePrototype(parent) {
    if (parent === null)
      return null;
    var c = function() {
    };
    c.prototype = parent;
    return new c();
  };
  function __objToStr(o2) {
    return Object.prototype.toString.call(o2);
  }
  clone2.__objToStr = __objToStr;
  function __isDate(o2) {
    return typeof o2 === "object" && __objToStr(o2) === "[object Date]";
  }
  clone2.__isDate = __isDate;
  function __isArray(o2) {
    return typeof o2 === "object" && __objToStr(o2) === "[object Array]";
  }
  clone2.__isArray = __isArray;
  function __isRegExp(o2) {
    return typeof o2 === "object" && __objToStr(o2) === "[object RegExp]";
  }
  clone2.__isRegExp = __isRegExp;
  function __getRegExpFlags(re) {
    var flags = "";
    if (re.global)
      flags += "g";
    if (re.ignoreCase)
      flags += "i";
    if (re.multiline)
      flags += "m";
    return flags;
  }
  clone2.__getRegExpFlags = __getRegExpFlags;
  return clone2;
}();
class Request {
  /**
  * @param {Object} arg - 全局配置
  * @param {String} arg.baseURL - 全局根路径
  * @param {Object} arg.header - 全局header
  * @param {String} arg.method = [GET|POST|PUT|DELETE|CONNECT|HEAD|OPTIONS|TRACE] - 全局默认请求方式
  * @param {String} arg.dataType = [json] - 全局默认的dataType
  * @param {String} arg.responseType = [text|arraybuffer] - 全局默认的responseType。支付宝小程序不支持
  * @param {Object} arg.custom - 全局默认的自定义参数
  * @param {Number} arg.timeout - 全局默认的超时时间，单位 ms。默认60000。H5(HBuilderX 2.9.9+)、APP(HBuilderX 2.9.9+)、微信小程序（2.10.0）、支付宝小程序
  * @param {Boolean} arg.sslVerify - 全局默认的是否验证 ssl 证书。默认true.仅App安卓端支持（HBuilderX 2.3.3+）
  * @param {Boolean} arg.withCredentials - 全局默认的跨域请求时是否携带凭证（cookies）。默认false。仅H5支持（HBuilderX 2.6.15+）
  * @param {Boolean} arg.firstIpv4 - 全DNS解析时优先使用ipv4。默认false。仅 App-Android 支持 (HBuilderX 2.8.0+)
  * @param {Function(statusCode):Boolean} arg.validateStatus - 全局默认的自定义验证器。默认statusCode >= 200 && statusCode < 300
  */
  constructor(arg = {}) {
    if (!isPlainObject(arg)) {
      arg = {};
      console.warn("设置全局参数必须接收一个Object");
    }
    this.config = clone({ ...defaults, ...arg });
    this.interceptors = {
      request: new InterceptorManager(),
      response: new InterceptorManager()
    };
  }
  /**
  * @Function
  * @param {Request~setConfigCallback} f - 设置全局默认配置
  */
  setConfig(f2) {
    this.config = f2(this.config);
  }
  middleware(config2) {
    config2 = mergeConfig(this.config, config2);
    const chain = [dispatchRequest, void 0];
    let promise2 = Promise.resolve(config2);
    this.interceptors.request.forEach((interceptor) => {
      chain.unshift(interceptor.fulfilled, interceptor.rejected);
    });
    this.interceptors.response.forEach((interceptor) => {
      chain.push(interceptor.fulfilled, interceptor.rejected);
    });
    while (chain.length) {
      promise2 = promise2.then(chain.shift(), chain.shift());
    }
    return promise2;
  }
  /**
  * @Function
  * @param {Object} config - 请求配置项
  * @prop {String} options.url - 请求路径
  * @prop {Object} options.data - 请求参数
  * @prop {Object} [options.responseType = config.responseType] [text|arraybuffer] - 响应的数据类型
  * @prop {Object} [options.dataType = config.dataType] - 如果设为 json，会尝试对返回的数据做一次 JSON.parse
  * @prop {Object} [options.header = config.header] - 请求header
  * @prop {Object} [options.method = config.method] - 请求方法
  * @returns {Promise<unknown>}
  */
  request(config2 = {}) {
    return this.middleware(config2);
  }
  get(url2, options = {}) {
    return this.middleware({
      url: url2,
      method: "GET",
      ...options
    });
  }
  post(url2, data, options = {}) {
    return this.middleware({
      url: url2,
      data,
      method: "POST",
      ...options
    });
  }
  put(url2, data, options = {}) {
    return this.middleware({
      url: url2,
      data,
      method: "PUT",
      ...options
    });
  }
  delete(url2, data, options = {}) {
    return this.middleware({
      url: url2,
      data,
      method: "DELETE",
      ...options
    });
  }
  connect(url2, data, options = {}) {
    return this.middleware({
      url: url2,
      data,
      method: "CONNECT",
      ...options
    });
  }
  head(url2, data, options = {}) {
    return this.middleware({
      url: url2,
      data,
      method: "HEAD",
      ...options
    });
  }
  options(url2, data, options = {}) {
    return this.middleware({
      url: url2,
      data,
      method: "OPTIONS",
      ...options
    });
  }
  trace(url2, data, options = {}) {
    return this.middleware({
      url: url2,
      data,
      method: "TRACE",
      ...options
    });
  }
  upload(url2, config2 = {}) {
    config2.url = url2;
    config2.method = "UPLOAD";
    return this.middleware(config2);
  }
  download(url2, config2 = {}) {
    config2.url = url2;
    config2.method = "DOWNLOAD";
    return this.middleware(config2);
  }
}
function colorGradient(startColor = "rgb(0, 0, 0)", endColor = "rgb(255, 255, 255)", step = 10) {
  const startRGB = hexToRgb(startColor, false);
  const startR = startRGB[0];
  const startG = startRGB[1];
  const startB = startRGB[2];
  const endRGB = hexToRgb(endColor, false);
  const endR = endRGB[0];
  const endG = endRGB[1];
  const endB = endRGB[2];
  const sR = (endR - startR) / step;
  const sG = (endG - startG) / step;
  const sB = (endB - startB) / step;
  const colorArr = [];
  for (let i = 0; i < step; i++) {
    let hex = rgbToHex(`rgb(${Math.round(sR * i + startR)},${Math.round(sG * i + startG)},${Math.round(sB * i + startB)})`);
    if (i === 0)
      hex = rgbToHex(startColor);
    if (i === step - 1)
      hex = rgbToHex(endColor);
    colorArr.push(hex);
  }
  return colorArr;
}
function hexToRgb(sColor, str = true) {
  const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
  sColor = String(sColor).toLowerCase();
  if (sColor && reg.test(sColor)) {
    if (sColor.length === 4) {
      let sColorNew = "#";
      for (let i = 1; i < 4; i += 1) {
        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
      }
      sColor = sColorNew;
    }
    const sColorChange = [];
    for (let i = 1; i < 7; i += 2) {
      sColorChange.push(parseInt(`0x${sColor.slice(i, i + 2)}`));
    }
    if (!str) {
      return sColorChange;
    }
    return `rgb(${sColorChange[0]},${sColorChange[1]},${sColorChange[2]})`;
  }
  if (/^(rgb|RGB)/.test(sColor)) {
    const arr = sColor.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
    return arr.map((val) => Number(val));
  }
  return sColor;
}
function rgbToHex(rgb) {
  const _this = rgb;
  const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
  if (/^(rgb|RGB)/.test(_this)) {
    const aColor = _this.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
    let strHex = "#";
    for (let i = 0; i < aColor.length; i++) {
      let hex = Number(aColor[i]).toString(16);
      hex = String(hex).length == 1 ? `${0}${hex}` : hex;
      if (hex === "0") {
        hex += hex;
      }
      strHex += hex;
    }
    if (strHex.length !== 7) {
      strHex = _this;
    }
    return strHex;
  }
  if (reg.test(_this)) {
    const aNum = _this.replace(/#/, "").split("");
    if (aNum.length === 6) {
      return _this;
    }
    if (aNum.length === 3) {
      let numHex = "#";
      for (let i = 0; i < aNum.length; i += 1) {
        numHex += aNum[i] + aNum[i];
      }
      return numHex;
    }
  } else {
    return _this;
  }
}
function colorToRgba(color2, alpha) {
  color2 = rgbToHex(color2);
  const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
  let sColor = String(color2).toLowerCase();
  if (sColor && reg.test(sColor)) {
    if (sColor.length === 4) {
      let sColorNew = "#";
      for (let i = 1; i < 4; i += 1) {
        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
      }
      sColor = sColorNew;
    }
    const sColorChange = [];
    for (let i = 1; i < 7; i += 2) {
      sColorChange.push(parseInt(`0x${sColor.slice(i, i + 2)}`));
    }
    return `rgba(${sColorChange.join(",")},${alpha})`;
  }
  return sColor;
}
const colorGradient$1 = {
  colorGradient,
  hexToRgb,
  rgbToHex,
  colorToRgba
};
let timeout = null;
function debounce$2(func2, wait = 500, immediate = false) {
  if (timeout !== null)
    clearTimeout(timeout);
  if (immediate) {
    const callNow = !timeout;
    timeout = setTimeout(() => {
      timeout = null;
    }, wait);
    if (callNow)
      typeof func2 === "function" && func2();
  } else {
    timeout = setTimeout(() => {
      typeof func2 === "function" && func2();
    }, wait);
  }
}
let flag;
function throttle(func2, wait = 500, immediate = true) {
  if (immediate) {
    if (!flag) {
      flag = true;
      typeof func2 === "function" && func2();
      setTimeout(() => {
        flag = false;
      }, wait);
    }
  } else if (!flag) {
    flag = true;
    setTimeout(() => {
      flag = false;
      typeof func2 === "function" && func2();
    }, wait);
  }
}
const ActionSheet = {
  // action-sheet组件
  actionSheet: {
    show: false,
    title: "",
    description: "",
    actions: [],
    index: "",
    cancelText: "",
    closeOnClickAction: true,
    safeAreaInsetBottom: true,
    openType: "",
    closeOnClickOverlay: true,
    round: 0,
    wrapMaxHeight: "600px"
  }
};
const Album = {
  // album 组件
  album: {
    urls: [],
    keyName: "",
    singleSize: 180,
    multipleSize: 70,
    space: 6,
    singleMode: "scaleToFill",
    multipleMode: "aspectFill",
    maxCount: 9,
    previewFullImage: true,
    rowCount: 3,
    showMore: true,
    autoWrap: false,
    unit: "px",
    stop: true
  }
};
const Alert = {
  // alert警告组件
  alert: {
    title: "",
    type: "warning",
    description: "",
    closable: false,
    showIcon: false,
    effect: "light",
    center: false,
    fontSize: 14
  }
};
const Avatar = {
  // avatar 组件
  avatar: {
    src: "",
    shape: "circle",
    size: 40,
    mode: "scaleToFill",
    text: "",
    bgColor: "#c0c4cc",
    color: "#ffffff",
    fontSize: 18,
    icon: "",
    mpAvatar: false,
    randomBgColor: false,
    defaultUrl: "",
    colorIndex: "",
    name: ""
  }
};
const AvatarGroup = {
  // avatarGroup 组件
  avatarGroup: {
    urls: [],
    maxCount: 5,
    shape: "circle",
    mode: "scaleToFill",
    showMore: true,
    size: 40,
    keyName: "",
    gap: 0.5,
    extraValue: 0
  }
};
const Backtop = {
  // backtop组件
  backtop: {
    mode: "circle",
    icon: "arrow-upward",
    text: "",
    duration: 100,
    scrollTop: 0,
    top: 400,
    bottom: 100,
    right: 20,
    zIndex: 9,
    iconStyle: {
      color: "#909399",
      fontSize: "19px"
    }
  }
};
const Badge = {
  // 徽标数组件
  badge: {
    isDot: false,
    value: "",
    show: true,
    max: 999,
    type: "error",
    showZero: false,
    bgColor: null,
    color: null,
    shape: "circle",
    numberType: "overflow",
    offset: [],
    inverted: false,
    absolute: false
  }
};
const Button = {
  // button组件
  button: {
    hairline: false,
    type: "info",
    size: "normal",
    shape: "square",
    plain: false,
    disabled: false,
    loading: false,
    loadingText: "",
    loadingMode: "spinner",
    loadingSize: 15,
    openType: "",
    formType: "",
    appParameter: "",
    hoverStopPropagation: true,
    lang: "en",
    sessionFrom: "",
    sendMessageTitle: "",
    sendMessagePath: "",
    sendMessageImg: "",
    showMessageCard: false,
    dataName: "",
    throttleTime: 0,
    hoverStartTime: 0,
    hoverStayTime: 200,
    text: "",
    icon: "",
    iconColor: "",
    color: "",
    stop: true
  }
};
const Calendar = {
  // calendar 组件
  calendar: {
    title: "日期选择",
    showTitle: true,
    showSubtitle: true,
    mode: "single",
    startText: "开始",
    endText: "结束",
    customList: [],
    color: "#3c9cff",
    minDate: 0,
    maxDate: 0,
    defaultDate: null,
    maxCount: Number.MAX_SAFE_INTEGER,
    // Infinity
    rowHeight: 56,
    formatter: null,
    showLunar: false,
    showMark: true,
    confirmText: "确定",
    confirmDisabledText: "确定",
    show: false,
    closeOnClickOverlay: false,
    readonly: false,
    showConfirm: true,
    maxRange: Number.MAX_SAFE_INTEGER,
    // Infinity
    rangePrompt: "",
    showRangePrompt: true,
    allowSameDay: false,
    round: 0,
    monthNum: 3
  }
};
const CarKeyboard = {
  // 车牌号键盘
  carKeyboard: {
    random: false
  }
};
const Cell = {
  // cell组件的props
  cell: {
    customClass: "",
    title: "",
    label: "",
    value: "",
    icon: "",
    disabled: false,
    border: true,
    center: false,
    url: "",
    linkType: "navigateTo",
    clickable: false,
    isLink: false,
    required: false,
    arrowDirection: "",
    iconStyle: {},
    rightIconStyle: {},
    rightIcon: "arrow-right",
    titleStyle: {},
    size: "",
    stop: true,
    name: ""
  }
};
const CellGroup = {
  // cell-group组件的props
  cellGroup: {
    title: "",
    border: true,
    customStyle: {}
  }
};
const Checkbox = {
  // checkbox组件
  checkbox: {
    name: "",
    shape: "",
    size: "",
    checkbox: false,
    disabled: "",
    activeColor: "",
    inactiveColor: "",
    iconSize: "",
    iconColor: "",
    label: "",
    labelSize: "",
    labelColor: "",
    labelDisabled: ""
  }
};
const CheckboxGroup = {
  // checkbox-group组件
  checkboxGroup: {
    name: "",
    value: [],
    shape: "square",
    disabled: false,
    activeColor: "#2979ff",
    inactiveColor: "#c8c9cc",
    size: 18,
    placement: "row",
    labelSize: 14,
    labelColor: "#303133",
    labelDisabled: false,
    iconColor: "#ffffff",
    iconSize: 12,
    iconPlacement: "left",
    borderBottom: false
  }
};
const CircleProgress = {
  // circleProgress 组件
  circleProgress: {
    percentage: 30
  }
};
const Code = {
  // code 组件
  code: {
    seconds: 60,
    startText: "获取验证码",
    changeText: "X秒重新获取",
    endText: "重新获取",
    keepRunning: false,
    uniqueKey: ""
  }
};
const CodeInput = {
  // codeInput 组件
  codeInput: {
    adjustPosition: true,
    maxlength: 6,
    dot: false,
    mode: "box",
    hairline: false,
    space: 10,
    value: "",
    focus: false,
    bold: false,
    color: "#606266",
    fontSize: 18,
    size: 35,
    disabledKeyboard: false,
    borderColor: "#c9cacc",
    disabledDot: true
  }
};
const Col = {
  // col 组件
  col: {
    span: 12,
    offset: 0,
    justify: "start",
    align: "stretch",
    textAlign: "left"
  }
};
const Collapse = {
  // collapse 组件
  collapse: {
    value: null,
    accordion: false,
    border: true
  }
};
const CollapseItem = {
  // collapseItem 组件
  collapseItem: {
    title: "",
    value: "",
    label: "",
    disabled: false,
    isLink: true,
    clickable: true,
    border: true,
    align: "left",
    name: "",
    icon: "",
    duration: 300,
    showRight: true
  }
};
const ColumnNotice = {
  // columnNotice 组件
  columnNotice: {
    text: "",
    icon: "volume",
    mode: "",
    color: "#f9ae3d",
    bgColor: "#fdf6ec",
    fontSize: 14,
    speed: 80,
    step: false,
    duration: 1500,
    disableTouch: true,
    justifyContent: "flex-start"
  }
};
const CountDown = {
  // u-count-down 计时器组件
  countDown: {
    time: 0,
    format: "HH:mm:ss",
    autoStart: true,
    millisecond: false
  }
};
const CountTo = {
  // countTo 组件
  countTo: {
    startVal: 0,
    endVal: 0,
    duration: 2e3,
    autoplay: true,
    decimals: 0,
    useEasing: true,
    decimal: ".",
    color: "#606266",
    fontSize: 22,
    bold: false,
    separator: ""
  }
};
const DatetimePicker = {
  // datetimePicker 组件
  datetimePicker: {
    show: false,
    popupMode: "bottom",
    showToolbar: true,
    value: "",
    title: "",
    mode: "datetime",
    maxDate: new Date((/* @__PURE__ */ new Date()).getFullYear() + 10, 0, 1).getTime(),
    minDate: new Date((/* @__PURE__ */ new Date()).getFullYear() - 10, 0, 1).getTime(),
    minHour: 0,
    maxHour: 23,
    minMinute: 0,
    maxMinute: 59,
    filter: null,
    formatter: null,
    loading: false,
    itemHeight: 44,
    cancelText: "取消",
    confirmText: "确认",
    cancelColor: "#909193",
    confirmColor: "#3c9cff",
    visibleItemCount: 5,
    closeOnClickOverlay: false,
    defaultIndex: []
  }
};
const Divider = {
  // divider组件
  divider: {
    dashed: false,
    hairline: true,
    dot: false,
    textPosition: "center",
    text: "",
    textSize: 14,
    textColor: "#909399",
    lineColor: "#dcdfe6"
  }
};
const Empty = {
  // empty组件
  empty: {
    icon: "",
    text: "",
    textColor: "#c0c4cc",
    textSize: 14,
    iconColor: "#c0c4cc",
    iconSize: 90,
    mode: "data",
    width: 160,
    height: 160,
    show: true,
    marginTop: 0
  }
};
const Form$2 = {
  // form 组件
  form: {
    model: {},
    rules: {},
    errorType: "message",
    borderBottom: true,
    labelPosition: "left",
    labelWidth: 45,
    labelAlign: "left",
    labelStyle: {}
  }
};
const GormItem = {
  // formItem 组件
  formItem: {
    label: "",
    prop: "",
    rules: [],
    borderBottom: "",
    labelPosition: "",
    labelWidth: "",
    rightIcon: "",
    leftIcon: "",
    required: false,
    leftIconStyle: ""
  }
};
const Gap = {
  // gap组件
  gap: {
    bgColor: "transparent",
    height: 20,
    marginTop: 0,
    marginBottom: 0,
    customStyle: {}
  }
};
const Grid = {
  // grid组件
  grid: {
    col: 3,
    border: false,
    align: "left"
  }
};
const GridItem = {
  // grid-item组件
  gridItem: {
    name: null,
    bgColor: "transparent"
  }
};
const {
  color: color$4
} = config;
const Icon = {
  // icon组件
  icon: {
    name: "",
    color: color$4["u-content-color"],
    size: "16px",
    bold: false,
    index: "",
    hoverClass: "",
    customPrefix: "uicon",
    label: "",
    labelPos: "right",
    labelSize: "15px",
    labelColor: color$4["u-content-color"],
    space: "3px",
    imgMode: "",
    width: "",
    height: "",
    top: 0,
    stop: false
  }
};
const Image = {
  // image组件
  image: {
    src: "",
    mode: "aspectFill",
    width: "300",
    height: "225",
    shape: "square",
    radius: 0,
    lazyLoad: true,
    showMenuByLongpress: true,
    loadingIcon: "photo",
    errorIcon: "error-circle",
    showLoading: true,
    showError: true,
    fade: true,
    webp: false,
    duration: 500,
    bgColor: "#f3f4f6"
  }
};
const IndexAnchor = {
  // indexAnchor 组件
  indexAnchor: {
    text: "",
    color: "#606266",
    size: 14,
    bgColor: "#dedede",
    height: 32
  }
};
const IndexList = {
  // indexList 组件
  indexList: {
    inactiveColor: "#606266",
    activeColor: "#5677fc",
    indexList: [],
    sticky: true,
    customNavHeight: 0,
    safeBottomFix: false
  }
};
const Input = {
  // index 组件
  input: {
    value: "",
    type: "text",
    fixed: false,
    disabled: false,
    disabledColor: "#f5f7fa",
    clearable: false,
    password: false,
    maxlength: 140,
    placeholder: null,
    placeholderClass: "input-placeholder",
    placeholderStyle: "color: #c0c4cc",
    showWordLimit: false,
    confirmType: "done",
    confirmHold: false,
    holdKeyboard: false,
    focus: false,
    autoBlur: false,
    disableDefaultPadding: false,
    cursor: -1,
    cursorSpacing: 30,
    selectionStart: -1,
    selectionEnd: -1,
    adjustPosition: true,
    inputAlign: "left",
    fontSize: "15px",
    color: "#303133",
    prefixIcon: "",
    prefixIconStyle: "",
    suffixIcon: "",
    suffixIconStyle: "",
    border: "surround",
    readonly: false,
    shape: "square",
    formatter: null
  }
};
const Keyboard = {
  // 键盘组件
  keyboard: {
    mode: "number",
    dotDisabled: false,
    tooltip: true,
    showTips: true,
    tips: "",
    showCancel: true,
    showConfirm: true,
    random: false,
    safeAreaInsetBottom: true,
    closeOnClickOverlay: true,
    show: false,
    overlay: true,
    zIndex: 10075,
    cancelText: "取消",
    confirmText: "确定",
    autoChange: false
  }
};
const Line = {
  // line组件
  line: {
    color: "#d6d7d9",
    length: "100%",
    direction: "row",
    hairline: true,
    margin: 0,
    dashed: false
  }
};
const LineProgress = {
  // lineProgress 组件
  lineProgress: {
    activeColor: "#19be6b",
    inactiveColor: "#ececec",
    percentage: 0,
    showText: true,
    height: 12
  }
};
const {
  color: color$3
} = config;
const Link = {
  // link超链接组件props参数
  link: {
    color: color$3["u-primary"],
    fontSize: 15,
    underLine: false,
    href: "",
    mpTips: "链接已复制，请在浏览器打开",
    lineColor: "",
    text: ""
  }
};
const List = {
  // list 组件
  list: {
    showScrollbar: false,
    lowerThreshold: 50,
    upperThreshold: 0,
    scrollTop: 0,
    offsetAccuracy: 10,
    enableFlex: false,
    pagingEnabled: false,
    scrollable: true,
    scrollIntoView: "",
    scrollWithAnimation: false,
    enableBackToTop: false,
    height: 0,
    width: 0,
    preLoadScreen: 1
  }
};
const ListItem = {
  // listItem 组件
  listItem: {
    anchor: ""
  }
};
const {
  color: color$2
} = config;
const LoadingIcon = {
  // loading-icon加载中图标组件
  loadingIcon: {
    show: true,
    color: color$2["u-tips-color"],
    textColor: color$2["u-tips-color"],
    vertical: false,
    mode: "spinner",
    size: 24,
    textSize: 15,
    text: "",
    timingFunction: "ease-in-out",
    duration: 1200,
    inactiveColor: ""
  }
};
const LoadingPage = {
  // loading-page组件
  loadingPage: {
    loadingText: "正在加载",
    image: "",
    loadingMode: "circle",
    loading: false,
    bgColor: "#ffffff",
    color: "#C8C8C8",
    fontSize: 19,
    iconSize: 28,
    loadingColor: "#C8C8C8",
    zIndex: 10
  }
};
const Loadmore = {
  // loadmore 组件
  loadmore: {
    status: "loadmore",
    bgColor: "transparent",
    icon: true,
    fontSize: 14,
    iconSize: 17,
    color: "#606266",
    loadingIcon: "spinner",
    loadmoreText: "加载更多",
    loadingText: "正在加载...",
    nomoreText: "没有更多了",
    isDot: false,
    iconColor: "#b7b7b7",
    marginTop: 10,
    marginBottom: 10,
    height: "auto",
    line: false,
    lineColor: "#E6E8EB",
    dashed: false
  }
};
const Modal = {
  // modal 组件
  modal: {
    show: false,
    title: "",
    content: "",
    confirmText: "确认",
    cancelText: "取消",
    showConfirmButton: true,
    showCancelButton: false,
    confirmColor: "#2979ff",
    cancelColor: "#606266",
    buttonReverse: false,
    zoom: true,
    asyncClose: false,
    closeOnClickOverlay: false,
    negativeTop: 0,
    width: "650rpx",
    confirmButtonShape: "",
    contentTextAlign: "left"
  }
};
const color$1 = {
  primary: "#3c9cff",
  info: "#909399",
  default: "#909399",
  warning: "#f9ae3d",
  error: "#f56c6c",
  success: "#5ac725",
  mainColor: "#303133",
  contentColor: "#606266",
  tipsColor: "#909399",
  lightColor: "#c0c4cc",
  borderColor: "#e4e7ed"
};
const Navbar = {
  // navbar 组件
  navbar: {
    safeAreaInsetTop: true,
    placeholder: false,
    fixed: true,
    border: false,
    leftIcon: "arrow-left",
    leftText: "",
    rightText: "",
    rightIcon: "",
    title: "",
    titleColor: "",
    bgColor: "#ffffff",
    titleWidth: "400rpx",
    height: "44px",
    leftIconSize: 20,
    leftIconColor: color$1.mainColor,
    autoBack: false,
    titleStyle: ""
  }
};
const NoNetwork = {
  // noNetwork
  noNetwork: {
    tips: "哎呀，网络信号丢失",
    zIndex: "",
    image: "data:image/png;base64,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"
  }
};
const NoticeBar = {
  // noticeBar
  noticeBar: {
    text: [],
    direction: "row",
    step: false,
    icon: "volume",
    mode: "",
    color: "#f9ae3d",
    bgColor: "#fdf6ec",
    speed: 80,
    fontSize: 14,
    duration: 2e3,
    disableTouch: true,
    url: "",
    linkType: "navigateTo",
    justifyContent: "flex-start"
  }
};
const Notify = {
  // notify组件
  notify: {
    top: 0,
    type: "primary",
    color: "#ffffff",
    bgColor: "",
    message: "",
    duration: 3e3,
    fontSize: 15,
    safeAreaInsetTop: false
  }
};
const NumberBox = {
  // 步进器组件
  numberBox: {
    name: "",
    value: 0,
    min: 1,
    max: Number.MAX_SAFE_INTEGER,
    step: 1,
    integer: false,
    disabled: false,
    disabledInput: false,
    asyncChange: false,
    inputWidth: 35,
    showMinus: true,
    showPlus: true,
    decimalLength: null,
    longPress: true,
    color: "#323233",
    buttonSize: 30,
    bgColor: "#EBECEE",
    cursorSpacing: 100,
    disableMinus: false,
    disablePlus: false,
    iconStyle: ""
  }
};
const NumberKeyboard = {
  // 数字键盘
  numberKeyboard: {
    mode: "number",
    dotDisabled: false,
    random: false
  }
};
const Overlay = {
  // overlay组件
  overlay: {
    show: false,
    zIndex: 10070,
    duration: 300,
    opacity: 0.5
  }
};
const Parse = {
  // parse
  parse: {
    copyLink: true,
    errorImg: "",
    lazyLoad: false,
    loadingImg: "",
    pauseVideo: true,
    previewImg: true,
    setTitle: true,
    showImgMenu: true
  }
};
const Picker = {
  // picker
  picker: {
    show: false,
    popupMode: "bottom",
    showToolbar: true,
    title: "",
    columns: [],
    loading: false,
    itemHeight: 44,
    cancelText: "取消",
    confirmText: "确定",
    cancelColor: "#909193",
    confirmColor: "#3c9cff",
    visibleItemCount: 5,
    keyName: "text",
    closeOnClickOverlay: false,
    defaultIndex: [],
    immediateChange: true,
    zIndex: 10076
  }
};
const Popup = {
  // popup组件
  popup: {
    show: false,
    overlay: true,
    mode: "bottom",
    duration: 300,
    closeable: false,
    overlayStyle: {},
    closeOnClickOverlay: true,
    zIndex: 10075,
    safeAreaInsetBottom: true,
    safeAreaInsetTop: false,
    closeIconPos: "top-right",
    round: 0,
    zoom: true,
    bgColor: "",
    overlayOpacity: 0.5
  }
};
const Radio = {
  // radio组件
  radio: {
    name: "",
    shape: "",
    disabled: "",
    labelDisabled: "",
    activeColor: "",
    inactiveColor: "",
    iconSize: "",
    labelSize: "",
    label: "",
    labelColor: "",
    size: "",
    iconColor: "",
    placement: ""
  }
};
const RadioGroup = {
  // radio-group组件
  radioGroup: {
    value: "",
    disabled: false,
    shape: "circle",
    activeColor: "#2979ff",
    inactiveColor: "#c8c9cc",
    name: "",
    size: 18,
    placement: "row",
    label: "",
    labelColor: "#303133",
    labelSize: 14,
    labelDisabled: false,
    iconColor: "#ffffff",
    iconSize: 12,
    borderBottom: false,
    iconPlacement: "left",
    gap: "10px"
  }
};
const Rate = {
  // rate组件
  rate: {
    value: 1,
    count: 5,
    disabled: false,
    size: 18,
    inactiveColor: "#b2b2b2",
    activeColor: "#FA3534",
    gutter: 4,
    minCount: 1,
    allowHalf: false,
    activeIcon: "star-fill",
    inactiveIcon: "star",
    touchable: true
  }
};
const ReadMore = {
  // readMore
  readMore: {
    showHeight: 400,
    toggle: false,
    closeText: "展开阅读全文",
    openText: "收起",
    color: "#2979ff",
    fontSize: 14,
    textIndent: "2em",
    name: ""
  }
};
const Row = {
  // row
  row: {
    gutter: 0,
    justify: "start",
    align: "center"
  }
};
const RowNotice = {
  // rowNotice
  rowNotice: {
    text: "",
    icon: "volume",
    mode: "",
    color: "#f9ae3d",
    bgColor: "#fdf6ec",
    fontSize: 14,
    speed: 80
  }
};
const ScrollList = {
  // scrollList
  scrollList: {
    indicatorWidth: 50,
    indicatorBarWidth: 20,
    indicator: true,
    indicatorColor: "#f2f2f2",
    indicatorActiveColor: "#3c9cff",
    indicatorStyle: ""
  }
};
const Search = {
  // search
  search: {
    shape: "round",
    bgColor: "#f2f2f2",
    placeholder: "请输入关键字",
    clearabled: true,
    focus: false,
    showAction: true,
    actionStyle: {},
    actionText: "搜索",
    inputAlign: "left",
    inputStyle: {},
    disabled: false,
    borderColor: "transparent",
    searchIconColor: "#909399",
    searchIconSize: 22,
    color: "#606266",
    placeholderColor: "#909399",
    searchIcon: "search",
    margin: "0",
    animation: false,
    value: "",
    maxlength: "-1",
    height: 32,
    label: null
  }
};
const Section = {
  // u-section组件
  section: {
    title: "",
    subTitle: "更多",
    right: true,
    fontSize: 15,
    bold: true,
    color: "#303133",
    subColor: "#909399",
    showLine: true,
    lineColor: "",
    arrow: true
  }
};
const Skeleton = {
  // skeleton
  skeleton: {
    loading: true,
    animate: true,
    rows: 0,
    rowsWidth: "100%",
    rowsHeight: 18,
    title: true,
    titleWidth: "50%",
    titleHeight: 18,
    avatar: false,
    avatarSize: 32,
    avatarShape: "circle"
  }
};
const Slider = {
  // slider组件
  slider: {
    value: 0,
    blockSize: 18,
    min: 0,
    max: 100,
    step: 1,
    activeColor: "#2979ff",
    inactiveColor: "#c0c4cc",
    blockColor: "#ffffff",
    showValue: false,
    disabled: false,
    blockStyle: {},
    useNative: false,
    height: "2px"
  }
};
const StatusBar = {
  // statusBar
  statusBar: {
    bgColor: "transparent"
  }
};
const Steps = {
  // steps组件
  steps: {
    direction: "row",
    current: 0,
    activeColor: "#3c9cff",
    inactiveColor: "#969799",
    activeIcon: "",
    inactiveIcon: "",
    dot: false
  }
};
const StepsItem = {
  // steps-item组件
  stepsItem: {
    title: "",
    desc: "",
    iconSize: 17,
    error: false
  }
};
const Sticky = {
  // sticky组件
  sticky: {
    offsetTop: 0,
    customNavHeight: 0,
    disabled: false,
    bgColor: "transparent",
    zIndex: "",
    index: ""
  }
};
const Subsection = {
  // subsection组件
  subsection: {
    list: [],
    current: 0,
    activeColor: "#3c9cff",
    inactiveColor: "#303133",
    mode: "button",
    fontSize: 12,
    bold: true,
    bgColor: "#eeeeef",
    keyName: "name"
  }
};
const SwipeAction = {
  // swipe-action组件
  swipeAction: {
    autoClose: true
  }
};
const SwipeActionItem = {
  // swipeActionItem 组件
  swipeActionItem: {
    show: false,
    closeOnClick: true,
    name: "",
    disabled: false,
    threshold: 20,
    autoClose: true,
    options: [],
    duration: 300
  }
};
const Swiper = {
  // swiper 组件
  swiper: {
    list: [],
    indicator: false,
    indicatorActiveColor: "#FFFFFF",
    indicatorInactiveColor: "rgba(255, 255, 255, 0.35)",
    indicatorStyle: "",
    indicatorMode: "line",
    autoplay: true,
    current: 0,
    currentItemId: "",
    interval: 3e3,
    duration: 300,
    circular: false,
    previousMargin: 0,
    nextMargin: 0,
    acceleration: false,
    displayMultipleItems: 1,
    easingFunction: "default",
    keyName: "url",
    imgMode: "aspectFill",
    height: 130,
    bgColor: "#f3f4f6",
    radius: 4,
    loading: false,
    showTitle: false
  }
};
const SwipterIndicator = {
  // swiperIndicator 组件
  swiperIndicator: {
    length: 0,
    current: 0,
    indicatorActiveColor: "",
    indicatorInactiveColor: "",
    indicatorMode: "line"
  }
};
const Switch = {
  // switch
  switch: {
    loading: false,
    disabled: false,
    size: 25,
    activeColor: "#2979ff",
    inactiveColor: "#ffffff",
    value: false,
    activeValue: true,
    inactiveValue: false,
    asyncChange: false,
    space: 0
  }
};
const Tabbar = {
  // tabbar
  tabbar: {
    value: null,
    safeAreaInsetBottom: true,
    border: true,
    zIndex: 1,
    activeColor: "#1989fa",
    inactiveColor: "#7d7e80",
    fixed: true,
    placeholder: true
  }
};
const TabbarItem = {
  //
  tabbarItem: {
    name: null,
    icon: "",
    badge: null,
    dot: false,
    text: "",
    badgeStyle: "top: 6px;right:2px;"
  }
};
const Tabs = {
  //
  tabs: {
    duration: 300,
    list: [],
    lineColor: "#3c9cff",
    activeStyle: {
      color: "#303133"
    },
    inactiveStyle: {
      color: "#606266"
    },
    lineWidth: 20,
    lineHeight: 3,
    lineBgSize: "cover",
    itemStyle: {
      height: "44px"
    },
    scrollable: true,
    current: 0,
    keyName: "name"
  }
};
const Tag = {
  // tag 组件
  tag: {
    type: "primary",
    disabled: false,
    size: "medium",
    shape: "square",
    text: "",
    bgColor: "",
    color: "",
    borderColor: "",
    closeColor: "#C6C7CB",
    name: "",
    plainFill: false,
    plain: false,
    closable: false,
    show: true,
    icon: "",
    iconColor: ""
  }
};
const Text = {
  // text 组件
  text: {
    type: "",
    show: true,
    text: "",
    prefixIcon: "",
    suffixIcon: "",
    mode: "",
    href: "",
    format: "",
    call: false,
    openType: "",
    bold: false,
    block: false,
    lines: "",
    color: "#303133",
    size: 15,
    iconStyle: {
      fontSize: "15px"
    },
    decoration: "none",
    margin: 0,
    lineHeight: "",
    align: "left",
    wordWrap: "normal",
    flex1: true
  }
};
const Textarea = {
  // textarea 组件
  textarea: {
    value: "",
    placeholder: "",
    placeholderClass: "textarea-placeholder",
    placeholderStyle: "color: #c0c4cc",
    height: 70,
    confirmType: "done",
    disabled: false,
    count: false,
    focus: false,
    autoHeight: false,
    fixed: false,
    cursorSpacing: 0,
    cursor: "",
    showConfirmBar: true,
    selectionStart: -1,
    selectionEnd: -1,
    adjustPosition: true,
    disableDefaultPadding: false,
    holdKeyboard: false,
    maxlength: 140,
    border: "surround",
    formatter: null
  }
};
const Toast = {
  // toast组件
  toast: {
    zIndex: 10090,
    loading: false,
    text: "",
    icon: "",
    type: "",
    loadingMode: "",
    show: "",
    overlay: false,
    position: "center",
    params: {},
    duration: 2e3,
    isTab: false,
    url: "",
    callback: null,
    back: false
  }
};
const Toolbar = {
  // toolbar 组件
  toolbar: {
    show: true,
    cancelText: "取消",
    confirmText: "确认",
    cancelColor: "#909193",
    confirmColor: "#3c9cff",
    title: ""
  }
};
const Tooltip = {
  // tooltip 组件
  tooltip: {
    text: "",
    copyText: "",
    size: 14,
    color: "#606266",
    bgColor: "transparent",
    direction: "top",
    zIndex: 10071,
    showCopy: true,
    buttons: [],
    overlay: true,
    showToast: true
  }
};
const Transition = {
  // transition动画组件的props
  transition: {
    show: false,
    mode: "fade",
    duration: "300",
    timingFunction: "ease-out"
  }
};
const Upload = {
  // upload组件
  upload: {
    accept: "image",
    extension: [],
    capture: ["album", "camera"],
    compressed: true,
    camera: "back",
    maxDuration: 60,
    uploadIcon: "camera-fill",
    uploadIconColor: "#D3D4D6",
    useBeforeRead: false,
    previewFullImage: true,
    maxCount: 52,
    disabled: false,
    imageMode: "aspectFill",
    name: "",
    sizeType: ["original", "compressed"],
    multiple: false,
    deletable: true,
    maxSize: Number.MAX_VALUE,
    fileList: [],
    uploadText: "",
    width: 80,
    height: 80,
    previewImage: true
  }
};
const {
  color
} = config;
const defProps = {
  ...ActionSheet,
  ...Album,
  ...Alert,
  ...Avatar,
  ...AvatarGroup,
  ...Backtop,
  ...Badge,
  ...Button,
  ...Calendar,
  ...CarKeyboard,
  ...Cell,
  ...CellGroup,
  ...Checkbox,
  ...CheckboxGroup,
  ...CircleProgress,
  ...Code,
  ...CodeInput,
  ...Col,
  ...Collapse,
  ...CollapseItem,
  ...ColumnNotice,
  ...CountDown,
  ...CountTo,
  ...DatetimePicker,
  ...Divider,
  ...Empty,
  ...Form$2,
  ...GormItem,
  ...Gap,
  ...Grid,
  ...GridItem,
  ...Icon,
  ...Image,
  ...IndexAnchor,
  ...IndexList,
  ...Input,
  ...Keyboard,
  ...Line,
  ...LineProgress,
  ...Link,
  ...List,
  ...ListItem,
  ...LoadingIcon,
  ...LoadingPage,
  ...Loadmore,
  ...Modal,
  ...Navbar,
  ...NoNetwork,
  ...NoticeBar,
  ...Notify,
  ...NumberBox,
  ...NumberKeyboard,
  ...Overlay,
  ...Parse,
  ...Picker,
  ...Popup,
  ...Radio,
  ...RadioGroup,
  ...Rate,
  ...ReadMore,
  ...Row,
  ...RowNotice,
  ...ScrollList,
  ...Search,
  ...Section,
  ...Skeleton,
  ...Slider,
  ...StatusBar,
  ...Steps,
  ...StepsItem,
  ...Sticky,
  ...Subsection,
  ...SwipeAction,
  ...SwipeActionItem,
  ...Swiper,
  ...SwipterIndicator,
  ...Switch,
  ...Tabbar,
  ...TabbarItem,
  ...Tabs,
  ...Tag,
  ...Text,
  ...Textarea,
  ...Toast,
  ...Toolbar,
  ...Tooltip,
  ...Transition,
  ...Upload
};
const zIndex = {
  toast: 10090,
  noNetwork: 10080,
  // popup包含popup，actionsheet，keyboard，picker的值
  popup: 10075,
  mask: 10070,
  navbar: 980,
  topTips: 975,
  sticky: 970,
  indexListSticky: 965
};
let platform = "none";
platform = "vue3";
platform = "mp";
platform = "weixin";
const platform$1 = platform;
const http = new Request();
let themeType = ["primary", "success", "error", "warning", "info"];
function setConfig(configs) {
  index.shallowMerge(config, configs.config || {});
  index.shallowMerge(defProps, configs.props || {});
  index.shallowMerge(color$1, configs.color || {});
  index.shallowMerge(zIndex, configs.zIndex || {});
}
index.setConfig = setConfig;
const $u = {
  route,
  date: index.timeFormat,
  // 另名date
  colorGradient: colorGradient$1.colorGradient,
  hexToRgb: colorGradient$1.hexToRgb,
  rgbToHex: colorGradient$1.rgbToHex,
  colorToRgba: colorGradient$1.colorToRgba,
  test,
  type: themeType,
  http,
  config,
  // uview-plus配置信息相关，比如版本号
  zIndex,
  debounce: debounce$2,
  throttle,
  mixin,
  mpMixin,
  props: defProps,
  ...index,
  color: color$1,
  platform: platform$1
};
const install = (Vue) => {
  index$1.$u = $u;
  Vue.config.globalProperties.$u = $u;
  Vue.mixin(mixin);
};
const uviewPlus = {
  install
};
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var dayjs_min = { exports: {} };
(function(module2, exports2) {
  !function(t2, e2) {
    module2.exports = e2();
  }(commonjsGlobal, function() {
    var t2 = 1e3, e2 = 6e4, n2 = 36e5, r2 = "millisecond", i = "second", s2 = "minute", u = "hour", a = "day", o2 = "week", c = "month", f2 = "quarter", h = "year", d = "date", l = "Invalid Date", $ = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/, y = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g, M = { name: "en", weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"), months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"), ordinal: function(t3) {
      var e3 = ["th", "st", "nd", "rd"], n3 = t3 % 100;
      return "[" + t3 + (e3[(n3 - 20) % 10] || e3[n3] || e3[0]) + "]";
    } }, m2 = function(t3, e3, n3) {
      var r3 = String(t3);
      return !r3 || r3.length >= e3 ? t3 : "" + Array(e3 + 1 - r3.length).join(n3) + t3;
    }, v = { s: m2, z: function(t3) {
      var e3 = -t3.utcOffset(), n3 = Math.abs(e3), r3 = Math.floor(n3 / 60), i2 = n3 % 60;
      return (e3 <= 0 ? "+" : "-") + m2(r3, 2, "0") + ":" + m2(i2, 2, "0");
    }, m: function t3(e3, n3) {
      if (e3.date() < n3.date())
        return -t3(n3, e3);
      var r3 = 12 * (n3.year() - e3.year()) + (n3.month() - e3.month()), i2 = e3.clone().add(r3, c), s3 = n3 - i2 < 0, u2 = e3.clone().add(r3 + (s3 ? -1 : 1), c);
      return +(-(r3 + (n3 - i2) / (s3 ? i2 - u2 : u2 - i2)) || 0);
    }, a: function(t3) {
      return t3 < 0 ? Math.ceil(t3) || 0 : Math.floor(t3);
    }, p: function(t3) {
      return { M: c, y: h, w: o2, d: a, D: d, h: u, m: s2, s: i, ms: r2, Q: f2 }[t3] || String(t3 || "").toLowerCase().replace(/s$/, "");
    }, u: function(t3) {
      return void 0 === t3;
    } }, g = "en", D = {};
    D[g] = M;
    var p2 = "$isDayjsObject", S = function(t3) {
      return t3 instanceof _ || !(!t3 || !t3[p2]);
    }, w2 = function t3(e3, n3, r3) {
      var i2;
      if (!e3)
        return g;
      if ("string" == typeof e3) {
        var s3 = e3.toLowerCase();
        D[s3] && (i2 = s3), n3 && (D[s3] = n3, i2 = s3);
        var u2 = e3.split("-");
        if (!i2 && u2.length > 1)
          return t3(u2[0]);
      } else {
        var a2 = e3.name;
        D[a2] = e3, i2 = a2;
      }
      return !r3 && i2 && (g = i2), i2 || !r3 && g;
    }, O = function(t3, e3) {
      if (S(t3))
        return t3.clone();
      var n3 = "object" == typeof e3 ? e3 : {};
      return n3.date = t3, n3.args = arguments, new _(n3);
    }, b = v;
    b.l = w2, b.i = S, b.w = function(t3, e3) {
      return O(t3, { locale: e3.$L, utc: e3.$u, x: e3.$x, $offset: e3.$offset });
    };
    var _ = function() {
      function M2(t3) {
        this.$L = w2(t3.locale, null, true), this.parse(t3), this.$x = this.$x || t3.x || {}, this[p2] = true;
      }
      var m3 = M2.prototype;
      return m3.parse = function(t3) {
        this.$d = function(t4) {
          var e3 = t4.date, n3 = t4.utc;
          if (null === e3)
            return /* @__PURE__ */ new Date(NaN);
          if (b.u(e3))
            return /* @__PURE__ */ new Date();
          if (e3 instanceof Date)
            return new Date(e3);
          if ("string" == typeof e3 && !/Z$/i.test(e3)) {
            var r3 = e3.match($);
            if (r3) {
              var i2 = r3[2] - 1 || 0, s3 = (r3[7] || "0").substring(0, 3);
              return n3 ? new Date(Date.UTC(r3[1], i2, r3[3] || 1, r3[4] || 0, r3[5] || 0, r3[6] || 0, s3)) : new Date(r3[1], i2, r3[3] || 1, r3[4] || 0, r3[5] || 0, r3[6] || 0, s3);
            }
          }
          return new Date(e3);
        }(t3), this.init();
      }, m3.init = function() {
        var t3 = this.$d;
        this.$y = t3.getFullYear(), this.$M = t3.getMonth(), this.$D = t3.getDate(), this.$W = t3.getDay(), this.$H = t3.getHours(), this.$m = t3.getMinutes(), this.$s = t3.getSeconds(), this.$ms = t3.getMilliseconds();
      }, m3.$utils = function() {
        return b;
      }, m3.isValid = function() {
        return !(this.$d.toString() === l);
      }, m3.isSame = function(t3, e3) {
        var n3 = O(t3);
        return this.startOf(e3) <= n3 && n3 <= this.endOf(e3);
      }, m3.isAfter = function(t3, e3) {
        return O(t3) < this.startOf(e3);
      }, m3.isBefore = function(t3, e3) {
        return this.endOf(e3) < O(t3);
      }, m3.$g = function(t3, e3, n3) {
        return b.u(t3) ? this[e3] : this.set(n3, t3);
      }, m3.unix = function() {
        return Math.floor(this.valueOf() / 1e3);
      }, m3.valueOf = function() {
        return this.$d.getTime();
      }, m3.startOf = function(t3, e3) {
        var n3 = this, r3 = !!b.u(e3) || e3, f3 = b.p(t3), l2 = function(t4, e4) {
          var i2 = b.w(n3.$u ? Date.UTC(n3.$y, e4, t4) : new Date(n3.$y, e4, t4), n3);
          return r3 ? i2 : i2.endOf(a);
        }, $2 = function(t4, e4) {
          return b.w(n3.toDate()[t4].apply(n3.toDate("s"), (r3 ? [0, 0, 0, 0] : [23, 59, 59, 999]).slice(e4)), n3);
        }, y2 = this.$W, M3 = this.$M, m4 = this.$D, v2 = "set" + (this.$u ? "UTC" : "");
        switch (f3) {
          case h:
            return r3 ? l2(1, 0) : l2(31, 11);
          case c:
            return r3 ? l2(1, M3) : l2(0, M3 + 1);
          case o2:
            var g2 = this.$locale().weekStart || 0, D2 = (y2 < g2 ? y2 + 7 : y2) - g2;
            return l2(r3 ? m4 - D2 : m4 + (6 - D2), M3);
          case a:
          case d:
            return $2(v2 + "Hours", 0);
          case u:
            return $2(v2 + "Minutes", 1);
          case s2:
            return $2(v2 + "Seconds", 2);
          case i:
            return $2(v2 + "Milliseconds", 3);
          default:
            return this.clone();
        }
      }, m3.endOf = function(t3) {
        return this.startOf(t3, false);
      }, m3.$set = function(t3, e3) {
        var n3, o3 = b.p(t3), f3 = "set" + (this.$u ? "UTC" : ""), l2 = (n3 = {}, n3[a] = f3 + "Date", n3[d] = f3 + "Date", n3[c] = f3 + "Month", n3[h] = f3 + "FullYear", n3[u] = f3 + "Hours", n3[s2] = f3 + "Minutes", n3[i] = f3 + "Seconds", n3[r2] = f3 + "Milliseconds", n3)[o3], $2 = o3 === a ? this.$D + (e3 - this.$W) : e3;
        if (o3 === c || o3 === h) {
          var y2 = this.clone().set(d, 1);
          y2.$d[l2]($2), y2.init(), this.$d = y2.set(d, Math.min(this.$D, y2.daysInMonth())).$d;
        } else
          l2 && this.$d[l2]($2);
        return this.init(), this;
      }, m3.set = function(t3, e3) {
        return this.clone().$set(t3, e3);
      }, m3.get = function(t3) {
        return this[b.p(t3)]();
      }, m3.add = function(r3, f3) {
        var d2, l2 = this;
        r3 = Number(r3);
        var $2 = b.p(f3), y2 = function(t3) {
          var e3 = O(l2);
          return b.w(e3.date(e3.date() + Math.round(t3 * r3)), l2);
        };
        if ($2 === c)
          return this.set(c, this.$M + r3);
        if ($2 === h)
          return this.set(h, this.$y + r3);
        if ($2 === a)
          return y2(1);
        if ($2 === o2)
          return y2(7);
        var M3 = (d2 = {}, d2[s2] = e2, d2[u] = n2, d2[i] = t2, d2)[$2] || 1, m4 = this.$d.getTime() + r3 * M3;
        return b.w(m4, this);
      }, m3.subtract = function(t3, e3) {
        return this.add(-1 * t3, e3);
      }, m3.format = function(t3) {
        var e3 = this, n3 = this.$locale();
        if (!this.isValid())
          return n3.invalidDate || l;
        var r3 = t3 || "YYYY-MM-DDTHH:mm:ssZ", i2 = b.z(this), s3 = this.$H, u2 = this.$m, a2 = this.$M, o3 = n3.weekdays, c2 = n3.months, f3 = n3.meridiem, h2 = function(t4, n4, i3, s4) {
          return t4 && (t4[n4] || t4(e3, r3)) || i3[n4].slice(0, s4);
        }, d2 = function(t4) {
          return b.s(s3 % 12 || 12, t4, "0");
        }, $2 = f3 || function(t4, e4, n4) {
          var r4 = t4 < 12 ? "AM" : "PM";
          return n4 ? r4.toLowerCase() : r4;
        };
        return r3.replace(y, function(t4, r4) {
          return r4 || function(t5) {
            switch (t5) {
              case "YY":
                return String(e3.$y).slice(-2);
              case "YYYY":
                return b.s(e3.$y, 4, "0");
              case "M":
                return a2 + 1;
              case "MM":
                return b.s(a2 + 1, 2, "0");
              case "MMM":
                return h2(n3.monthsShort, a2, c2, 3);
              case "MMMM":
                return h2(c2, a2);
              case "D":
                return e3.$D;
              case "DD":
                return b.s(e3.$D, 2, "0");
              case "d":
                return String(e3.$W);
              case "dd":
                return h2(n3.weekdaysMin, e3.$W, o3, 2);
              case "ddd":
                return h2(n3.weekdaysShort, e3.$W, o3, 3);
              case "dddd":
                return o3[e3.$W];
              case "H":
                return String(s3);
              case "HH":
                return b.s(s3, 2, "0");
              case "h":
                return d2(1);
              case "hh":
                return d2(2);
              case "a":
                return $2(s3, u2, true);
              case "A":
                return $2(s3, u2, false);
              case "m":
                return String(u2);
              case "mm":
                return b.s(u2, 2, "0");
              case "s":
                return String(e3.$s);
              case "ss":
                return b.s(e3.$s, 2, "0");
              case "SSS":
                return b.s(e3.$ms, 3, "0");
              case "Z":
                return i2;
            }
            return null;
          }(t4) || i2.replace(":", "");
        });
      }, m3.utcOffset = function() {
        return 15 * -Math.round(this.$d.getTimezoneOffset() / 15);
      }, m3.diff = function(r3, d2, l2) {
        var $2, y2 = this, M3 = b.p(d2), m4 = O(r3), v2 = (m4.utcOffset() - this.utcOffset()) * e2, g2 = this - m4, D2 = function() {
          return b.m(y2, m4);
        };
        switch (M3) {
          case h:
            $2 = D2() / 12;
            break;
          case c:
            $2 = D2();
            break;
          case f2:
            $2 = D2() / 3;
            break;
          case o2:
            $2 = (g2 - v2) / 6048e5;
            break;
          case a:
            $2 = (g2 - v2) / 864e5;
            break;
          case u:
            $2 = g2 / n2;
            break;
          case s2:
            $2 = g2 / e2;
            break;
          case i:
            $2 = g2 / t2;
            break;
          default:
            $2 = g2;
        }
        return l2 ? $2 : b.a($2);
      }, m3.daysInMonth = function() {
        return this.endOf(c).$D;
      }, m3.$locale = function() {
        return D[this.$L];
      }, m3.locale = function(t3, e3) {
        if (!t3)
          return this.$L;
        var n3 = this.clone(), r3 = w2(t3, e3, true);
        return r3 && (n3.$L = r3), n3;
      }, m3.clone = function() {
        return b.w(this.$d, this);
      }, m3.toDate = function() {
        return new Date(this.valueOf());
      }, m3.toJSON = function() {
        return this.isValid() ? this.toISOString() : null;
      }, m3.toISOString = function() {
        return this.$d.toISOString();
      }, m3.toString = function() {
        return this.$d.toUTCString();
      }, M2;
    }(), k = _.prototype;
    return O.prototype = k, [["$ms", r2], ["$s", i], ["$m", s2], ["$H", u], ["$W", a], ["$M", c], ["$y", h], ["$D", d]].forEach(function(t3) {
      k[t3[1]] = function(e3) {
        return this.$g(e3, t3[0], t3[1]);
      };
    }), O.extend = function(t3, e3) {
      return t3.$i || (t3(e3, _, O), t3.$i = true), O;
    }, O.locale = w2, O.isDayjs = S, O.unix = function(t3) {
      return O(1e3 * t3);
    }, O.en = D[g], O.Ls = D, O.p = {}, O;
  });
})(dayjs_min);
var dayjs_minExports = dayjs_min.exports;
const dayjs = /* @__PURE__ */ getDefaultExportFromCjs(dayjs_minExports);
const props$j = defineMixin({
  props: {
    // 背景颜色（默认transparent）
    bgColor: {
      type: String,
      default: () => defProps.gap.bgColor
    },
    // 分割槽高度，单位px（默认30）
    height: {
      type: [String, Number],
      default: () => defProps.gap.height
    },
    // 与上一个组件的距离
    marginTop: {
      type: [String, Number],
      default: () => defProps.gap.marginTop
    },
    // 与下一个组件的距离
    marginBottom: {
      type: [String, Number],
      default: () => defProps.gap.marginBottom
    }
  }
});
const props$i = defineMixin({
  props: {
    bgColor: {
      type: String,
      default: () => defProps.statusBar.bgColor
    }
  }
});
const props$h = defineMixin({
  props: {
    // 头像图片路径(不能为相对路径)
    src: {
      type: String,
      default: () => defProps.avatar.src
    },
    // 头像形状，circle-圆形，square-方形
    shape: {
      type: String,
      default: () => defProps.avatar.shape
    },
    // 头像尺寸
    size: {
      type: [String, Number],
      default: () => defProps.avatar.size
    },
    // 裁剪模式
    mode: {
      type: String,
      default: () => defProps.avatar.mode
    },
    // 显示的文字
    text: {
      type: String,
      default: () => defProps.avatar.text
    },
    // 背景色
    bgColor: {
      type: String,
      default: () => defProps.avatar.bgColor
    },
    // 文字颜色
    color: {
      type: String,
      default: () => defProps.avatar.color
    },
    // 文字大小
    fontSize: {
      type: [String, Number],
      default: () => defProps.avatar.fontSize
    },
    // 显示的图标
    icon: {
      type: String,
      default: () => defProps.avatar.icon
    },
    // 显示小程序头像，只对百度，微信，QQ小程序有效
    mpAvatar: {
      type: Boolean,
      default: () => defProps.avatar.mpAvatar
    },
    // 是否使用随机背景色
    randomBgColor: {
      type: Boolean,
      default: () => defProps.avatar.randomBgColor
    },
    // 加载失败的默认头像(组件有内置默认图片)
    defaultUrl: {
      type: String,
      default: () => defProps.avatar.defaultUrl
    },
    // 如果配置了randomBgColor为true，且配置了此值，则从默认的背景色数组中取出对应索引的颜色值，取值0-19之间
    colorIndex: {
      type: [String, Number],
      // 校验参数规则，索引在0-19之间
      validator(n2) {
        return test.range(n2, [0, 19]) || n2 === "";
      },
      default: () => defProps.avatar.colorIndex
    },
    // 组件标识符
    name: {
      type: String,
      default: () => defProps.avatar.name
    }
  }
});
const icons = {
  "uicon-level": "",
  "uicon-column-line": "",
  "uicon-checkbox-mark": "",
  "uicon-folder": "",
  "uicon-movie": "",
  "uicon-star-fill": "",
  "uicon-star": "",
  "uicon-phone-fill": "",
  "uicon-phone": "",
  "uicon-apple-fill": "",
  "uicon-chrome-circle-fill": "",
  "uicon-backspace": "",
  "uicon-attach": "",
  "uicon-cut": "",
  "uicon-empty-car": "",
  "uicon-empty-coupon": "",
  "uicon-empty-address": "",
  "uicon-empty-favor": "",
  "uicon-empty-permission": "",
  "uicon-empty-news": "",
  "uicon-empty-search": "",
  "uicon-github-circle-fill": "",
  "uicon-rmb": "",
  "uicon-person-delete-fill": "",
  "uicon-reload": "",
  "uicon-order": "",
  "uicon-server-man": "",
  "uicon-search": "",
  "uicon-fingerprint": "",
  "uicon-more-dot-fill": "",
  "uicon-scan": "",
  "uicon-share-square": "",
  "uicon-map": "",
  "uicon-map-fill": "",
  "uicon-tags": "",
  "uicon-tags-fill": "",
  "uicon-bookmark-fill": "",
  "uicon-bookmark": "",
  "uicon-eye": "",
  "uicon-eye-fill": "",
  "uicon-mic": "",
  "uicon-mic-off": "",
  "uicon-calendar": "",
  "uicon-calendar-fill": "",
  "uicon-trash": "",
  "uicon-trash-fill": "",
  "uicon-play-left": "",
  "uicon-play-right": "",
  "uicon-minus": "",
  "uicon-plus": "",
  "uicon-info": "",
  "uicon-info-circle": "",
  "uicon-info-circle-fill": "",
  "uicon-question": "",
  "uicon-error": "",
  "uicon-close": "",
  "uicon-checkmark": "",
  "uicon-android-circle-fill": "",
  "uicon-android-fill": "",
  "uicon-ie": "",
  "uicon-IE-circle-fill": "",
  "uicon-google": "",
  "uicon-google-circle-fill": "",
  "uicon-setting-fill": "",
  "uicon-setting": "",
  "uicon-minus-square-fill": "",
  "uicon-plus-square-fill": "",
  "uicon-heart": "",
  "uicon-heart-fill": "",
  "uicon-camera": "",
  "uicon-camera-fill": "",
  "uicon-more-circle": "",
  "uicon-more-circle-fill": "",
  "uicon-chat": "",
  "uicon-chat-fill": "",
  "uicon-bag-fill": "",
  "uicon-bag": "",
  "uicon-error-circle-fill": "",
  "uicon-error-circle": "",
  "uicon-close-circle": "",
  "uicon-close-circle-fill": "",
  "uicon-checkmark-circle": "",
  "uicon-checkmark-circle-fill": "",
  "uicon-question-circle-fill": "",
  "uicon-question-circle": "",
  "uicon-share": "",
  "uicon-share-fill": "",
  "uicon-shopping-cart": "",
  "uicon-shopping-cart-fill": "",
  "uicon-bell": "",
  "uicon-bell-fill": "",
  "uicon-list": "",
  "uicon-list-dot": "",
  "uicon-zhihu": "",
  "uicon-zhihu-circle-fill": "",
  "uicon-zhifubao": "",
  "uicon-zhifubao-circle-fill": "",
  "uicon-weixin-circle-fill": "",
  "uicon-weixin-fill": "",
  "uicon-twitter-circle-fill": "",
  "uicon-twitter": "",
  "uicon-taobao-circle-fill": "",
  "uicon-taobao": "",
  "uicon-weibo-circle-fill": "",
  "uicon-weibo": "",
  "uicon-qq-fill": "",
  "uicon-qq-circle-fill": "",
  "uicon-moments-circel-fill": "",
  "uicon-moments": "",
  "uicon-qzone": "",
  "uicon-qzone-circle-fill": "",
  "uicon-baidu-circle-fill": "",
  "uicon-baidu": "",
  "uicon-facebook-circle-fill": "",
  "uicon-facebook": "",
  "uicon-car": "",
  "uicon-car-fill": "",
  "uicon-warning-fill": "",
  "uicon-warning": "",
  "uicon-clock-fill": "",
  "uicon-clock": "",
  "uicon-edit-pen": "",
  "uicon-edit-pen-fill": "",
  "uicon-email": "",
  "uicon-email-fill": "",
  "uicon-minus-circle": "",
  "uicon-minus-circle-fill": "",
  "uicon-plus-circle": "",
  "uicon-plus-circle-fill": "",
  "uicon-file-text": "",
  "uicon-file-text-fill": "",
  "uicon-pushpin": "",
  "uicon-pushpin-fill": "",
  "uicon-grid": "",
  "uicon-grid-fill": "",
  "uicon-play-circle": "",
  "uicon-play-circle-fill": "",
  "uicon-pause-circle-fill": "",
  "uicon-pause": "",
  "uicon-pause-circle": "",
  "uicon-eye-off": "",
  "uicon-eye-off-outline": "",
  "uicon-gift-fill": "",
  "uicon-gift": "",
  "uicon-rmb-circle-fill": "",
  "uicon-rmb-circle": "",
  "uicon-kefu-ermai": "",
  "uicon-server-fill": "",
  "uicon-coupon-fill": "",
  "uicon-coupon": "",
  "uicon-integral": "",
  "uicon-integral-fill": "",
  "uicon-home-fill": "",
  "uicon-home": "",
  "uicon-hourglass-half-fill": "",
  "uicon-hourglass": "",
  "uicon-account": "",
  "uicon-plus-people-fill": "",
  "uicon-minus-people-fill": "",
  "uicon-account-fill": "",
  "uicon-thumb-down-fill": "",
  "uicon-thumb-down": "",
  "uicon-thumb-up": "",
  "uicon-thumb-up-fill": "",
  "uicon-lock-fill": "",
  "uicon-lock-open": "",
  "uicon-lock-opened-fill": "",
  "uicon-lock": "",
  "uicon-red-packet-fill": "",
  "uicon-photo-fill": "",
  "uicon-photo": "",
  "uicon-volume-off-fill": "",
  "uicon-volume-off": "",
  "uicon-volume-fill": "",
  "uicon-volume": "",
  "uicon-red-packet": "",
  "uicon-download": "",
  "uicon-arrow-up-fill": "",
  "uicon-arrow-down-fill": "",
  "uicon-play-left-fill": "",
  "uicon-play-right-fill": "",
  "uicon-rewind-left-fill": "",
  "uicon-rewind-right-fill": "",
  "uicon-arrow-downward": "",
  "uicon-arrow-leftward": "",
  "uicon-arrow-rightward": "",
  "uicon-arrow-upward": "",
  "uicon-arrow-down": "",
  "uicon-arrow-right": "",
  "uicon-arrow-left": "",
  "uicon-arrow-up": "",
  "uicon-skip-back-left": "",
  "uicon-skip-forward-right": "",
  "uicon-rewind-right": "",
  "uicon-rewind-left": "",
  "uicon-arrow-right-double": "",
  "uicon-arrow-left-double": "",
  "uicon-wifi-off": "",
  "uicon-wifi": "",
  "uicon-empty-data": "",
  "uicon-empty-history": "",
  "uicon-empty-list": "",
  "uicon-empty-page": "",
  "uicon-empty-order": "",
  "uicon-man": "",
  "uicon-woman": "",
  "uicon-man-add": "",
  "uicon-man-add-fill": "",
  "uicon-man-delete": "",
  "uicon-man-delete-fill": "",
  "uicon-zh": "",
  "uicon-en": ""
};
const props$g = defineMixin({
  props: {
    // 图标类名
    name: {
      type: String,
      default: () => defProps.icon.name
    },
    // 图标颜色，可接受主题色
    color: {
      type: String,
      default: () => defProps.icon.color
    },
    // 字体大小，单位px
    size: {
      type: [String, Number],
      default: () => defProps.icon.size
    },
    // 是否显示粗体
    bold: {
      type: Boolean,
      default: () => defProps.icon.bold
    },
    // 点击图标的时候传递事件出去的index（用于区分点击了哪一个）
    index: {
      type: [String, Number],
      default: () => defProps.icon.index
    },
    // 触摸图标时的类名
    hoverClass: {
      type: String,
      default: () => defProps.icon.hoverClass
    },
    // 自定义扩展前缀，方便用户扩展自己的图标库
    customPrefix: {
      type: String,
      default: () => defProps.icon.customPrefix
    },
    // 图标右边或者下面的文字
    label: {
      type: [String, Number],
      default: () => defProps.icon.label
    },
    // label的位置，只能右边或者下边
    labelPos: {
      type: String,
      default: () => defProps.icon.labelPos
    },
    // label的大小
    labelSize: {
      type: [String, Number],
      default: () => defProps.icon.labelSize
    },
    // label的颜色
    labelColor: {
      type: String,
      default: () => defProps.icon.labelColor
    },
    // label与图标的距离
    space: {
      type: [String, Number],
      default: () => defProps.icon.space
    },
    // 图片的mode
    imgMode: {
      type: String,
      default: () => defProps.icon.imgMode
    },
    // 用于显示图片小图标时，图片的宽度
    width: {
      type: [String, Number],
      default: () => defProps.icon.width
    },
    // 用于显示图片小图标时，图片的高度
    height: {
      type: [String, Number],
      default: () => defProps.icon.height
    },
    // 用于解决某些情况下，让图标垂直居中的用途
    top: {
      type: [String, Number],
      default: () => defProps.icon.top
    },
    // 是否阻止事件传播
    stop: {
      type: Boolean,
      default: () => defProps.icon.stop
    }
  }
});
const props$f = defineMixin({
  props: {
    // 标题
    title: {
      type: [String, Number],
      default: () => defProps.cell.title
    },
    // 标题下方的描述信息
    label: {
      type: [String, Number],
      default: () => defProps.cell.label
    },
    // 右侧的内容
    value: {
      type: [String, Number],
      default: () => defProps.cell.value
    },
    // 左侧图标名称，或者图片链接(本地文件建议使用绝对地址)
    icon: {
      type: String,
      default: () => defProps.cell.icon
    },
    // 是否禁用cell
    disabled: {
      type: Boolean,
      default: () => defProps.cell.disabled
    },
    // 是否显示下边框
    border: {
      type: Boolean,
      default: () => defProps.cell.border
    },
    // 内容是否垂直居中(主要是针对右侧的value部分)
    center: {
      type: Boolean,
      default: () => defProps.cell.center
    },
    // 点击后跳转的URL地址
    url: {
      type: String,
      default: () => defProps.cell.url
    },
    // 链接跳转的方式，内部使用的是uView封装的route方法，可能会进行拦截操作
    linkType: {
      type: String,
      default: () => defProps.cell.linkType
    },
    // 是否开启点击反馈(表现为点击时加上灰色背景)
    clickable: {
      type: Boolean,
      default: () => defProps.cell.clickable
    },
    // 是否展示右侧箭头并开启点击反馈
    isLink: {
      type: Boolean,
      default: () => defProps.cell.isLink
    },
    // 是否显示表单状态下的必填星号(此组件可能会内嵌入input组件)
    required: {
      type: Boolean,
      default: () => defProps.cell.required
    },
    // 右侧的图标箭头
    rightIcon: {
      type: String,
      default: () => defProps.cell.rightIcon
    },
    // 右侧箭头的方向，可选值为：left，up，down
    arrowDirection: {
      type: String,
      default: () => defProps.cell.arrowDirection
    },
    // 左侧图标样式
    iconStyle: {
      type: [Object, String],
      default: () => {
        return defProps.cell.iconStyle;
      }
    },
    // 右侧箭头图标的样式
    rightIconStyle: {
      type: [Object, String],
      default: () => {
        return defProps.cell.rightIconStyle;
      }
    },
    // 标题的样式
    titleStyle: {
      type: [Object, String],
      default: () => {
        return defProps.cell.titleStyle;
      }
    },
    // 单位元的大小，可选值为large
    size: {
      type: String,
      default: () => defProps.cell.size
    },
    // 点击cell是否阻止事件传播
    stop: {
      type: Boolean,
      default: () => defProps.cell.stop
    },
    // 标识符，cell被点击时返回
    name: {
      type: [Number, String],
      default: () => defProps.cell.name
    }
  }
});
const props$e = defineMixin({
  props: {
    // 分组标题
    title: {
      type: String,
      default: () => defProps.cellGroup.title
    },
    // 是否显示外边框
    border: {
      type: Boolean,
      default: () => defProps.cellGroup.border
    }
  }
});
const isEmptyVariableInDefault$1 = (variable, defaultValue = void 0) => {
  return variable === void 0 || variable === null ? defaultValue : variable;
};
const withInstall$1 = (main, extra) => {
  main.install = (app) => {
    for (const comp of [
      main,
      ...Object.values(isEmptyVariableInDefault$1(extra, {}))
    ]) {
      app.component(comp.name, comp);
    }
  };
  if (extra) {
    for (const [key, comp] of Object.entries(extra)) {
      main[key] = comp;
    }
  }
  return main;
};
const withNoopInstall$1 = (component) => {
  component.install = () => {
  };
  return component;
};
function fromPairs$1(pairs) {
  const result = {};
  if (pairs == null) {
    return result;
  }
  for (const pair of pairs) {
    result[pair[0]] = pair[1];
  }
  return result;
}
function isObjectLike$1(value2) {
  return value2 != null && typeof value2 == "object";
}
const objectProto$3 = Object.prototype;
const objectToString$1 = objectProto$3.toString;
const boolTag$1 = "[object Boolean]";
function isBoolean$1(value2) {
  return value2 === true || value2 === false || isObjectLike$1(value2) && objectToString$1.call(value2) == boolTag$1;
}
const numberTag$1 = "[object Number]";
function isNumber$1(value2) {
  return typeof value2 == "number" || isObjectLike$1(value2) && objectToString$1.call(value2) == numberTag$1;
}
const reIsPlainProp$1 = /^\w*$/;
const reIsDeepProp$1 = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/;
const reLeadingDot$1 = /^\./;
const rePropName$1 = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
const reEscapeChar$1 = /\\(\\)?/g;
const reIsUint$1 = /^(?:0|[1-9]\d*)$/;
const MAX_SAFE_INTEGER$1 = 9007199254740991;
function isKey$1(value2, object2) {
  if (Array.isArray(value2)) {
    return false;
  }
  const type2 = typeof value2;
  if (type2 == "number" || type2 == "symbol" || type2 == "boolean" || value2 == null || isSymbol(value2)) {
    return true;
  }
  return reIsPlainProp$1.test(value2) || !reIsDeepProp$1.test(value2) || // eslint-disable-next-line unicorn/new-for-builtins
  object2 != null && value2 in Object(object2);
}
const symbolProto$1 = Symbol ? Symbol.prototype : void 0;
const symbolToString$1 = symbolProto$1 ? symbolProto$1.toString : void 0;
function baseToString$1(value2) {
  if (typeof value2 == "string") {
    return value2;
  }
  if (isSymbol(value2)) {
    return symbolToString$1 ? symbolToString$1.call(value2) : "";
  }
  const result = `${value2}`;
  return result == "0" && 1 / value2 == -Infinity ? "-0" : result;
}
function toString$1(value2) {
  return value2 == null ? "" : baseToString$1(value2);
}
const stringToPath$1 = function(string2) {
  string2 = toString$1(string2);
  const result = [];
  if (reLeadingDot$1.test(string2)) {
    result.push("");
  }
  string2.replace(
    rePropName$1,
    (match, number2, quote, string22) => {
      result.push(quote ? string22.replace(reEscapeChar$1, "$1") : number2 || match);
      return "";
    }
  );
  return result;
};
function castPath$1(value2) {
  return Array.isArray(value2) ? value2 : stringToPath$1(value2);
}
function toKey$1(value2) {
  if (typeof value2 == "string" || isSymbol(value2)) {
    return value2;
  }
  const result = `${value2}`;
  return result == "0" && 1 / value2 == -Infinity ? "-0" : result;
}
function baseGet$1(object2, path) {
  path = isKey$1(path, object2) ? [path] : castPath$1(path);
  let index2 = 0;
  const length = path.length;
  while (object2 != null && index2 < length) {
    object2 = object2[toKey$1(path[index2++])];
  }
  return index2 && index2 == length ? object2 : void 0;
}
function get$1(object2, path, defaultValue) {
  const result = object2 == null ? void 0 : baseGet$1(object2, path);
  return result === void 0 ? defaultValue : result;
}
function isIndex$1(value2, length) {
  length = length == null ? MAX_SAFE_INTEGER$1 : length;
  return !!length && (typeof value2 == "number" || reIsUint$1.test(value2)) && value2 > -1 && value2 % 1 == 0 && value2 < length;
}
function eq$1(value2, other) {
  return value2 === other || value2 !== value2 && other !== other;
}
const objectProto$2 = Object.prototype;
const hasOwnProperty$1 = objectProto$2.hasOwnProperty;
function assignValue$1(object2, key, value2) {
  const objValue = object2[key];
  if (!(hasOwnProperty$1.call(object2, key) && eq$1(objValue, value2)) || value2 === void 0 && !(key in object2)) {
    object2[key] = value2;
  }
}
function baseSet$1(object2, path, value2, customizer) {
  if (!isObject$1(object2)) {
    return object2;
  }
  path = isKey$1(path, object2) ? [path] : castPath$1(path);
  let index2 = -1;
  const length = path.length;
  const lastIndex = length - 1;
  let nested = object2;
  while (nested != null && ++index2 < length) {
    const key = toKey$1(path[index2]);
    let newValue = value2;
    if (index2 != lastIndex) {
      const objValue = nested[key];
      newValue = void 0;
      if (newValue === void 0) {
        newValue = isObject$1(objValue) ? objValue : isIndex$1(path[index2 + 1]) ? [] : {};
      }
    }
    assignValue$1(nested, key, newValue);
    nested = nested[key];
  }
  return object2;
}
function set$1(object2, path, value2) {
  return object2 == null ? object2 : baseSet$1(object2, path, value2);
}
const NAN$1 = 0 / 0;
const reTrim$1 = /^\s+|\s+$/g;
const reIsBinary$1 = /^0b[01]+$/i;
const reIsOctal$1 = /^0o[0-7]+$/i;
const reIsBadHex$1 = /^[-+]0x[0-9a-f]+$/i;
function toNumber$1(value2) {
  if (typeof value2 == "number") {
    return value2;
  }
  if (isSymbol(value2)) {
    return NAN$1;
  }
  if (isObject$1(value2)) {
    const other = typeof value2.valueOf == "function" ? value2.valueOf() : value2;
    value2 = isObject$1(other) ? `${other}` : other;
  }
  if (typeof value2 != "string") {
    return value2 === 0 ? value2 : +value2;
  }
  value2 = value2.replace(reTrim$1, "");
  const isBinary = reIsBinary$1.test(value2);
  return isBinary || reIsOctal$1.test(value2) ? Number.parseInt(value2.slice(2), isBinary ? 2 : 8) : reIsBadHex$1.test(value2) ? NAN$1 : +value2;
}
const FUNC_ERROR_TEXT$1 = "Expected a function";
function debounce$1(func2, wait, options) {
  let lastArgs;
  let lastThis;
  let maxWait;
  let result;
  let timerId;
  let lastCallTime;
  let lastInvokeTime = 0;
  let leading = false;
  let maxing = false;
  let trailing = true;
  if (typeof func2 != "function") {
    throw new TypeError(FUNC_ERROR_TEXT$1);
  }
  wait = toNumber$1(wait) || 0;
  if (isObject$1(options)) {
    leading = !!options.leading;
    maxing = "maxWait" in options;
    maxWait = maxing ? Math.max(toNumber$1(options.maxWait) || 0, wait) : maxWait;
    trailing = "trailing" in options ? !!options.trailing : trailing;
  }
  function invokeFunc(time) {
    const args = lastArgs, thisArg = lastThis;
    lastArgs = lastThis = void 0;
    lastInvokeTime = time;
    result = func2.apply(thisArg, args);
    return result;
  }
  function leadingEdge(time) {
    lastInvokeTime = time;
    timerId = setTimeout(timerExpired, wait);
    return leading ? invokeFunc(time) : result;
  }
  function remainingWait(time) {
    const timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime, result2 = wait - timeSinceLastCall;
    return maxing ? Math.max(result2, maxWait - timeSinceLastInvoke) : result2;
  }
  function shouldInvoke(time) {
    const timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime;
    return lastCallTime === void 0 || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
  }
  function timerExpired() {
    const time = Date.now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    timerId = setTimeout(timerExpired, remainingWait(time));
  }
  function trailingEdge(time) {
    timerId = void 0;
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = void 0;
    return result;
  }
  function cancel() {
    if (timerId !== void 0) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = void 0;
  }
  function flush() {
    return timerId === void 0 ? result : trailingEdge(Date.now());
  }
  function debounced() {
    const time = Date.now(), isInvoking = shouldInvoke(time);
    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;
    if (isInvoking) {
      if (timerId === void 0) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === void 0) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}
function castArray$1(value2) {
  if (!value2 || Array.isArray(value2) && !value2.length) {
    return [];
  }
  return Array.isArray(value2) ? value2 : [value2];
}
const isEmpty$1 = (val) => !val && val !== 0 || isArray$1(val) && val.length === 0 || isObject$1(val) && !Object.keys(val).length;
const getProp$1 = (obj, path, defaultValue) => {
  return {
    get value() {
      return get$1(obj, path, defaultValue);
    },
    set value(val) {
      set$1(obj, path, val);
    }
  };
};
const tnPropKey$1 = "__tnPropKey";
const definePropType$1 = (val) => val;
const isTnProp$1 = (val) => isObject$1(val) && !!val[tnPropKey$1];
const buildProp$1 = (prop, key) => {
  if (!isObject$1(prop) || isTnProp$1(prop))
    return prop;
  const { values, required: required2, default: defaultValue, type: type2, validator } = prop;
  const _validator = values || validator ? (val) => {
    let valid = false;
    let allowedValues = [];
    if (values) {
      allowedValues = Array.from(values);
      if (hasOwn(prop, "default")) {
        allowedValues.push(defaultValue);
      }
      valid || (valid = allowedValues.includes(val));
    }
    if (validator)
      valid || (valid = validator(val));
    if (!valid && allowedValues.length > 0) {
      const allowValuesText = [...new Set(allowedValues)].map((value2) => JSON.stringify(value2)).join(", ");
      warn(
        `Invalid prop: validation failed${key ? ` for prop "${key}"` : ""}. Expected one of [${allowValuesText}], got value ${JSON.stringify(
          val
        )}.`
      );
    }
    return valid;
  } : void 0;
  const tnProp = {
    type: type2,
    required: !!required2,
    validator: _validator,
    [tnPropKey$1]: true
  };
  if (hasOwn(prop, "default"))
    tnProp.default = defaultValue;
  return tnProp;
};
const buildProps$1 = (props2) => fromPairs$1(
  Object.entries(props2).map(([key, option]) => [
    key,
    buildProp$1(option, key)
  ])
);
const iconPropType$1 = definePropType$1([String]);
const formatDomSizeValue$1 = (value2, unit = "rpx", empty2 = true) => {
  if (!value2)
    return empty2 ? "" : `0${unit}`;
  if (isString(value2) && /(^calc)|(%|vw|vh|px|rpx|auto)$/.test(value2))
    return value2;
  return `${value2}${unit}`;
};
const generateId$1 = () => Math.floor(Math.random() * 1e4);
let TuniaoUIError$1 = class TuniaoUIError extends Error {
  constructor(message) {
    super(message);
    this.name = "TuniaoUIError";
  }
};
function throwError$1(scope, msg) {
  throw new TuniaoUIError$1(`[${scope}] ${msg}`);
}
function debugWarn$1(scope, message) {
  {
    const error2 = isString(scope) ? new TuniaoUIError$1(`[${scope}] ${message}`) : scope;
    console.warn(error2);
  }
}
const cloneDeep$1 = (value2, visited = /* @__PURE__ */ new WeakMap()) => {
  if (value2 === null || typeof value2 !== "object") {
    return value2;
  }
  if (visited.has(value2)) {
    return visited.get(value2);
  }
  if (Array.isArray(value2)) {
    const clonedArray = value2.map((item) => cloneDeep$1(item, visited));
    visited.set(value2, clonedArray);
    return clonedArray;
  }
  if (value2 instanceof Date) {
    return new Date(value2.getTime());
  }
  if (value2 instanceof RegExp) {
    const flags = value2.flags;
    return new RegExp(value2.source, flags);
  }
  const clonedObject = {};
  visited.set(value2, clonedObject);
  for (const key in value2) {
    if (Object.prototype.hasOwnProperty.call(value2, key)) {
      clonedObject[key] = cloneDeep$1(value2[key], visited);
    }
  }
  const prototype = Object.getPrototypeOf(value2);
  Object.setPrototypeOf(clonedObject, cloneDeep$1(prototype, visited));
  return clonedObject;
};
const componentSizes$1 = ["", "sm", "lg", "xl"];
const formComponentSizes$1 = ["", "sm", "lg"];
const componentShapes$1 = ["", "circle", "round"];
const componentImgModes$1 = [
  "scaleToFill",
  "aspectFit",
  "aspectFill",
  "widthFix",
  "heightFix",
  "top",
  "bottom",
  "center",
  "left",
  "right",
  "top left",
  "top right",
  "bottom left",
  "bottom right"
];
const componentTypes$1 = [
  "",
  "primary",
  "success",
  "warning",
  "danger",
  "info"
];
const UPDATE_MODEL_EVENT$1 = "update:modelValue";
const CHANGE_EVENT$1 = "change";
const ZIndex$1 = {
  /** popup 弹出层 */
  popup: 20075,
  /** mask 遮罩 */
  mask: 9999
};
buildProp$1({
  type: [Boolean, void 0],
  default: void 0
});
const useComponentSizeProp$1 = buildProp$1({
  type: String,
  values: componentSizes$1,
  required: false
});
buildProp$1({
  type: String,
  values: formComponentSizes$1,
  required: false
});
const useComponentCustomStyleProp$1 = buildProp$1({
  type: Object,
  default: () => ({})
});
buildProp$1({
  type: definePropType$1([String, Number]),
  default: () => generateId$1()
});
const useComponentSafeAreaInsetBottomProp$1 = buildProp$1({
  type: Boolean,
  default: true
});
const iconProps$1 = buildProps$1({
  /**
   * @description 图标名称，支持图鸟内置图标和图片地址(只支持绝对路径)
   */
  name: {
    type: iconPropType$1,
    required: true
  },
  /**
   * @description 图标颜色类型
   */
  type: {
    type: String,
    values: componentTypes$1,
    default: ""
  },
  /**
   * @description 图标颜色, 以tn开头则使用图鸟内置的颜色
   */
  color: String,
  /**
   * @description 图标大小
   */
  size: {
    type: [String, Number]
  },
  /**
   * @description 图标加粗
   */
  bold: Boolean,
  /**
   * @description 图标是否为透明
   */
  transparent: Boolean,
  /**
   * @description 透明图标背景
   */
  transparentBg: String,
  /**
   * @description 图片模式，当name为图片地址时生效
   */
  imgMode: {
    type: String,
    values: componentImgModes$1,
    default: "aspectFill"
  },
  /**
   * @description 垂直方向上的偏移量
   */
  offsetTop: {
    type: [String, Number]
  },
  /**
   * @description 自定义样式
   */
  customStyle: useComponentCustomStyleProp$1,
  /**
   * @description 自定义类
   */
  customClass: String
});
const iconEmits$1 = {
  /**
   * @description 点击图标时触发
   */
  click: () => true
};
const defaultNamespace$1 = "tn";
const _bem$1 = (namespace, block, blockSuffix, element, modifier) => {
  let cls = `${namespace}-${block}`;
  if (blockSuffix) {
    cls += `-${blockSuffix}`;
  }
  if (element) {
    cls += `__${element}`;
  }
  if (modifier) {
    cls += `--${modifier}`;
  }
  return cls;
};
const namespaceContextKey$1 = Symbol("localContextKey");
const useGetDerivedNamespace$1 = () => {
  const derivedNamespace = inject(namespaceContextKey$1, ref(defaultNamespace$1));
  const namespace = computed(() => {
    return unref(derivedNamespace) || defaultNamespace$1;
  });
  return namespace;
};
const useNamespace$1 = (block) => {
  const namespace = useGetDerivedNamespace$1();
  const b = (blockSuffix = "") => _bem$1(namespace.value, block, blockSuffix, "", "");
  const e2 = (element) => element ? _bem$1(namespace.value, block, "", element, "") : "";
  const m2 = (modifier) => modifier ? _bem$1(namespace.value, block, "", "", modifier) : "";
  const be = (blockSuffix, element) => blockSuffix && element ? _bem$1(namespace.value, block, blockSuffix, element, "") : "";
  const em = (element, modifier) => element && modifier ? _bem$1(namespace.value, block, "", element, modifier) : "";
  const bm = (blockSuffix, modifier) => blockSuffix && modifier ? _bem$1(namespace.value, block, blockSuffix, "", modifier) : "";
  const bem = (blockSuffix, element, modifier) => blockSuffix && element && modifier ? _bem$1(namespace.value, block, blockSuffix, element, modifier) : "";
  const is = (name, ...args) => {
    const state = args.length >= 1 ? args[0] : true;
    return name && state ? `is-${name}` : "";
  };
  const cssVar = (object2) => {
    const styles = {};
    for (const key in object2) {
      if (object2[key]) {
        styles[`--${namespace.value}-${key}`] = object2[key];
      }
    }
    return styles;
  };
  const cssVarBlock = (object2) => {
    const styles = {};
    for (const key in object2) {
      if (object2[key]) {
        styles[`--${namespace.value}-${block}-${key}`] = object2[key];
      }
    }
    return styles;
  };
  const cssVarName = (name) => `--${namespace.value}-${name}`;
  const cssVarBlockName = (name) => `--${namespace.value}-${block}-${name}`;
  return {
    namespace,
    b,
    e: e2,
    m: m2,
    be,
    em,
    bm,
    bem,
    is,
    // css
    cssVar,
    cssVarName,
    cssVarBlock,
    cssVarBlockName
  };
};
const useComponentColor$1 = (prop, type2 = "") => {
  const classColor = ref("");
  const styleColor = ref("");
  const innerColorReg = /^(tn-|gradient)/;
  const styleColorReg = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{8}|[A-Fa-f0-9]{3})$|^rgb\(\d{1,3}(,\s?\d{1,3}){2}\)$|^rgba\(\d{1,3}(,\s?\d{1,3}){2},\s?0?\.?\d{1,}\)|transparent/i;
  const handleColorValue = (value2) => {
    classColor.value = "";
    styleColor.value = "";
    if (value2 === void 0)
      return;
    if (innerColorReg.test(value2)) {
      if (type2 === "bg" && /.*gradient.*/.test(value2)) {
        const gradientValue = value2.split("__")[1];
        classColor.value = `tn-gradient-bg__${gradientValue}`;
        return;
      }
      classColor.value = `${value2}_${type2}`;
    }
    if (styleColorReg.test(value2)) {
      styleColor.value = value2;
    }
  };
  handleColorValue(prop.value);
  watch(
    () => prop.value,
    (val) => {
      handleColorValue(val);
    }
  );
  const updateColor = (value2) => {
    handleColorValue(value2);
  };
  return [classColor, styleColor, updateColor];
};
const useComponentSize$1 = (size2) => {
  const sizeType = computed(() => {
    if (!size2)
      return "none";
    return componentSizes$1.includes(size2) ? "inner" : "custom";
  });
  return {
    sizeType
  };
};
const useIcon$1 = (props2) => {
  const ns = useNamespace$1("icon");
  const [colorClass, colorStyle] = useComponentColor$1(
    toRef(props2, "color"),
    "text"
  );
  const [transparentBgClass] = useComponentColor$1(
    toRef(props2, "transparentBg"),
    "bg"
  );
  const { sizeType } = useComponentSize$1(props2.size);
  const isImg = computed(
    () => !!(props2 == null ? void 0 : props2.name) && props2.name.includes("/")
  );
  const iconClass = computed(() => {
    const cls = [];
    cls.push(ns.b());
    if (isImg.value) {
      cls.push(ns.m("image"));
    } else {
      if (props2.type)
        cls.push(`tn-type-${props2.type}_text`);
      if (props2.transparent) {
        cls.push("tn-text-transparent", transparentBgClass.value);
      } else {
        if (colorClass.value)
          cls.push(colorClass.value);
      }
      if (props2.bold)
        cls.push("tn-text-bold");
    }
    if (sizeType.value === "inner")
      cls.push(ns.m(props2.size));
    if (props2.customClass)
      cls.push(props2.customClass);
    return cls.join(" ");
  });
  const iconStyle = computed(() => {
    const style = {};
    if (isImg.value) {
      if (sizeType.value === "custom" && props2.size) {
        style.width = style.height = formatDomSizeValue$1(props2.size);
      }
    } else {
      if (colorStyle.value)
        style.color = colorStyle.value;
      if (sizeType.value === "custom" && props2.size)
        style.fontSize = formatDomSizeValue$1(props2.size);
    }
    if (props2.offsetTop)
      style.transform = `translateY(${formatDomSizeValue$1(props2.offsetTop)})`;
    if (!isEmpty$1(props2.customStyle))
      Object.assign(style, props2.customStyle);
    return style;
  });
  return {
    isImg,
    iconClass,
    iconStyle
  };
};
const useProp$1 = (name) => {
  const vm = getCurrentInstance();
  return computed(
    () => {
      var _a2;
      return isEmptyVariableInDefault$1((_a2 = vm == null ? void 0 : vm.proxy) == null ? void 0 : _a2.$props)[name];
    }
  );
};
const useSelectorQuery$1 = (instance) => {
  let query = null;
  if (!instance) {
    instance = getCurrentInstance();
  }
  if (!instance) {
    debugWarn$1("useSelectorQuery", "useSelectorQuery必须在setup函数中使用");
  }
  query = index$1.createSelectorQuery().in(instance);
  const getSelectorNodeInfo = (selector) => {
    return new Promise((resolve2, reject) => {
      if (query) {
        query.select(selector).boundingClientRect((res) => {
          const selectRes = res;
          if (selectRes) {
            resolve2(selectRes);
          } else {
            reject(new Error(`未找到对应节点: ${selector}`));
          }
        }).exec();
      } else {
        reject(new Error("未找到对应的SelectorQuery实例"));
      }
    });
  };
  const getSelectorNodeInfos = (selector) => {
    return new Promise((resolve2, reject) => {
      if (query) {
        query.selectAll(selector).boundingClientRect((res) => {
          const selectRes = res;
          if (selectRes && selectRes.length > 0) {
            resolve2(selectRes);
          } else {
            reject(new Error(`未找到对应节点: ${selector}`));
          }
        }).exec();
      } else {
        reject(new Error("未找到对应的SelectorQuery实例"));
      }
    });
  };
  return {
    query,
    getSelectorNodeInfo,
    getSelectorNodeInfos
  };
};
ref(0);
const useObserver$1 = (instance) => {
  if (!instance) {
    instance = getCurrentInstance();
  }
  if (!instance) {
    debugWarn$1("useObserver", "请在 setup 中使用 useObserver");
  }
  let observerInstance = null;
  const connectObserver = (selector, fn, fnOptions, options) => {
    disconnectObserver();
    observerInstance = index$1.createIntersectionObserver(instance, options);
    if (fnOptions.type === "relativeTo")
      observerInstance.relativeTo((fnOptions == null ? void 0 : fnOptions.selector) || "", fnOptions.margins);
    else if (fnOptions.type === "relativeToViewport")
      observerInstance.relativeToViewport(fnOptions.margins);
    observerInstance.observe(selector, (res) => {
      fn && fn(res);
    });
  };
  const disconnectObserver = () => {
    if (observerInstance) {
      observerInstance.disconnect();
      observerInstance = null;
    }
  };
  return {
    connectObserver,
    disconnectObserver
  };
};
const isEmptyVariableInDefault = (variable, defaultValue = void 0) => {
  return variable === void 0 || variable === null ? defaultValue : variable;
};
const isEmptyDoubleVariableInDefault = (variable1, variable2, defaultValue = void 0) => {
  return isEmptyVariableInDefault(
    variable1,
    isEmptyVariableInDefault(variable2, defaultValue)
  );
};
const withInstall = (main, extra) => {
  main.install = (app) => {
    for (const comp of [
      main,
      ...Object.values(isEmptyVariableInDefault(extra, {}))
    ]) {
      app.component(comp.name, comp);
    }
  };
  if (extra) {
    for (const [key, comp] of Object.entries(extra)) {
      main[key] = comp;
    }
  }
  return main;
};
const withNoopInstall = (component) => {
  component.install = () => {
  };
  return component;
};
function fromPairs(pairs) {
  const result = {};
  if (pairs == null) {
    return result;
  }
  for (const pair of pairs) {
    result[pair[0]] = pair[1];
  }
  return result;
}
function isObjectLike(value2) {
  return value2 != null && typeof value2 == "object";
}
const objectProto$1 = Object.prototype;
const objectToString = objectProto$1.toString;
const boolTag = "[object Boolean]";
function isBoolean(value2) {
  return value2 === true || value2 === false || isObjectLike(value2) && objectToString.call(value2) == boolTag;
}
const numberTag = "[object Number]";
function isNumber(value2) {
  return typeof value2 == "number" || isObjectLike(value2) && objectToString.call(value2) == numberTag;
}
const reIsPlainProp = /^\w*$/;
const reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/;
const reLeadingDot = /^\./;
const rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
const reEscapeChar = /\\(\\)?/g;
const reIsUint = /^(?:0|[1-9]\d*)$/;
const MAX_SAFE_INTEGER = 9007199254740991;
function isKey(value2, object2) {
  if (Array.isArray(value2)) {
    return false;
  }
  const type2 = typeof value2;
  if (type2 == "number" || type2 == "symbol" || type2 == "boolean" || value2 == null || isSymbol(value2)) {
    return true;
  }
  return reIsPlainProp.test(value2) || !reIsDeepProp.test(value2) || // eslint-disable-next-line unicorn/new-for-builtins
  object2 != null && value2 in Object(object2);
}
const symbolProto = Symbol ? Symbol.prototype : void 0;
const symbolToString = symbolProto ? symbolProto.toString : void 0;
function baseToString(value2) {
  if (typeof value2 == "string") {
    return value2;
  }
  if (isSymbol(value2)) {
    return symbolToString ? symbolToString.call(value2) : "";
  }
  const result = `${value2}`;
  return result == "0" && 1 / value2 == -Infinity ? "-0" : result;
}
function toString(value2) {
  return value2 == null ? "" : baseToString(value2);
}
const stringToPath = function(string2) {
  string2 = toString(string2);
  const result = [];
  if (reLeadingDot.test(string2)) {
    result.push("");
  }
  string2.replace(
    rePropName,
    (match, number2, quote, string22) => {
      result.push(quote ? string22.replace(reEscapeChar, "$1") : number2 || match);
      return "";
    }
  );
  return result;
};
function castPath(value2) {
  return Array.isArray(value2) ? value2 : stringToPath(value2);
}
function toKey(value2) {
  if (typeof value2 == "string" || isSymbol(value2)) {
    return value2;
  }
  const result = `${value2}`;
  return result == "0" && 1 / value2 == -Infinity ? "-0" : result;
}
function baseGet(object2, path) {
  path = isKey(path, object2) ? [path] : castPath(path);
  let index2 = 0;
  const length = path.length;
  while (object2 != null && index2 < length) {
    object2 = object2[toKey(path[index2++])];
  }
  return index2 && index2 == length ? object2 : void 0;
}
function get(object2, path, defaultValue) {
  const result = object2 == null ? void 0 : baseGet(object2, path);
  return result === void 0 ? defaultValue : result;
}
function isIndex(value2, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length && (typeof value2 == "number" || reIsUint.test(value2)) && value2 > -1 && value2 % 1 == 0 && value2 < length;
}
function eq(value2, other) {
  return value2 === other || value2 !== value2 && other !== other;
}
const objectProto = Object.prototype;
const hasOwnProperty = objectProto.hasOwnProperty;
function assignValue(object2, key, value2) {
  const objValue = object2[key];
  if (!(hasOwnProperty.call(object2, key) && eq(objValue, value2)) || value2 === void 0 && !(key in object2)) {
    object2[key] = value2;
  }
}
function baseSet(object2, path, value2, customizer) {
  if (!isObject$1(object2)) {
    return object2;
  }
  path = isKey(path, object2) ? [path] : castPath(path);
  let index2 = -1;
  const length = path.length;
  const lastIndex = length - 1;
  let nested = object2;
  while (nested != null && ++index2 < length) {
    const key = toKey(path[index2]);
    let newValue = value2;
    if (index2 != lastIndex) {
      const objValue = nested[key];
      newValue = void 0;
      if (newValue === void 0) {
        newValue = isObject$1(objValue) ? objValue : isIndex(path[index2 + 1]) ? [] : {};
      }
    }
    assignValue(nested, key, newValue);
    nested = nested[key];
  }
  return object2;
}
function set(object2, path, value2) {
  return object2 == null ? object2 : baseSet(object2, path, value2);
}
const NAN = 0 / 0;
const reTrim = /^\s+|\s+$/g;
const reIsBinary = /^0b[01]+$/i;
const reIsOctal = /^0o[0-7]+$/i;
const reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
function toNumber(value2) {
  if (typeof value2 == "number") {
    return value2;
  }
  if (isSymbol(value2)) {
    return NAN;
  }
  if (isObject$1(value2)) {
    const other = typeof value2.valueOf == "function" ? value2.valueOf() : value2;
    value2 = isObject$1(other) ? `${other}` : other;
  }
  if (typeof value2 != "string") {
    return value2 === 0 ? value2 : +value2;
  }
  value2 = value2.replace(reTrim, "");
  const isBinary = reIsBinary.test(value2);
  return isBinary || reIsOctal.test(value2) ? Number.parseInt(value2.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value2) ? NAN : +value2;
}
const FUNC_ERROR_TEXT = "Expected a function";
function debounce(func2, wait, options) {
  let lastArgs;
  let lastThis;
  let maxWait;
  let result;
  let timerId;
  let lastCallTime;
  let lastInvokeTime = 0;
  let leading = false;
  let maxing = false;
  let trailing = true;
  if (typeof func2 != "function") {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject$1(options)) {
    leading = !!options.leading;
    maxing = "maxWait" in options;
    maxWait = maxing ? Math.max(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = "trailing" in options ? !!options.trailing : trailing;
  }
  function invokeFunc(time) {
    const args = lastArgs, thisArg = lastThis;
    lastArgs = lastThis = void 0;
    lastInvokeTime = time;
    result = func2.apply(thisArg, args);
    return result;
  }
  function leadingEdge(time) {
    lastInvokeTime = time;
    timerId = setTimeout(timerExpired, wait);
    return leading ? invokeFunc(time) : result;
  }
  function remainingWait(time) {
    const timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime, result2 = wait - timeSinceLastCall;
    return maxing ? Math.max(result2, maxWait - timeSinceLastInvoke) : result2;
  }
  function shouldInvoke(time) {
    const timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime;
    return lastCallTime === void 0 || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
  }
  function timerExpired() {
    const time = Date.now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    timerId = setTimeout(timerExpired, remainingWait(time));
  }
  function trailingEdge(time) {
    timerId = void 0;
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = void 0;
    return result;
  }
  function cancel() {
    if (timerId !== void 0) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = void 0;
  }
  function flush() {
    return timerId === void 0 ? result : trailingEdge(Date.now());
  }
  function debounced() {
    const time = Date.now(), isInvoking = shouldInvoke(time);
    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;
    if (isInvoking) {
      if (timerId === void 0) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === void 0) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}
function castArray(value2) {
  if (!value2 || Array.isArray(value2) && !value2.length) {
    return [];
  }
  return Array.isArray(value2) ? value2 : [value2];
}
const reWhitespace = /\s/;
function trimmedEndIndex(string2) {
  let index2 = string2.length;
  while (index2-- && reWhitespace.test(string2.charAt(index2))) {
  }
  return index2;
}
const reTrimStart = /^\s+/;
function baseTrim(string2) {
  return string2 ? string2.slice(0, trimmedEndIndex(string2) + 1).replace(reTrimStart, "") : string2;
}
function asciiToArray(string2) {
  return string2.split("");
}
const rsAstralRange$1 = "\\ud800-\\udfff", rsComboMarksRange$1 = "\\u0300-\\u036f", reComboHalfMarksRange$1 = "\\ufe20-\\ufe2f", rsComboSymbolsRange$1 = "\\u20d0-\\u20ff", rsComboRange$1 = rsComboMarksRange$1 + reComboHalfMarksRange$1 + rsComboSymbolsRange$1, rsVarRange$1 = "\\ufe0e\\ufe0f";
const rsZWJ$1 = "\\u200d";
const reHasUnicode = new RegExp(
  `[${rsZWJ$1}${rsAstralRange$1}${rsComboRange$1}${rsVarRange$1}]`
);
function hasUnicode(string2) {
  return reHasUnicode.test(string2);
}
const rsAstralRange = "\\ud800-\\udfff", rsComboMarksRange = "\\u0300-\\u036f", reComboHalfMarksRange = "\\ufe20-\\ufe2f", rsComboSymbolsRange = "\\u20d0-\\u20ff", rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange, rsVarRange = "\\ufe0e\\ufe0f";
const rsAstral = `[${rsAstralRange}]`, rsCombo = `[${rsComboRange}]`, rsFitz = "\\ud83c[\\udffb-\\udfff]", rsModifier = `(?:${rsCombo}|${rsFitz})`, rsNonAstral = `[^${rsAstralRange}]`, rsRegional = "(?:\\ud83c[\\udde6-\\uddff]){2}", rsSurrPair = "[\\ud800-\\udbff][\\udc00-\\udfff]", rsZWJ = "\\u200d";
const reOptMod = `${rsModifier}?`, rsOptVar = `[${rsVarRange}]?`, rsOptJoin = `(?:${rsZWJ}(?:${[rsNonAstral, rsRegional, rsSurrPair].join(
  "|"
)})${rsOptVar}${reOptMod})*`, rsSeq = rsOptVar + reOptMod + rsOptJoin, rsSymbol = `(?:${[
  `${rsNonAstral + rsCombo}?`,
  rsCombo,
  rsRegional,
  rsSurrPair,
  rsAstral
].join("|")})`;
const reUnicode = new RegExp(`${rsFitz}(?=${rsFitz})|${rsSymbol}${rsSeq}`, "g");
function unicodeToArray(string2) {
  return string2.match(reUnicode) || [];
}
function stringToArray(string2) {
  return hasUnicode(string2) ? unicodeToArray(string2) : asciiToArray(string2);
}
function baseFindIndex(array2, predicate, fromIndex, fromRight = false) {
  const length = array2.length;
  let index2 = fromIndex + (fromRight ? 1 : -1);
  while (fromRight ? index2-- : ++index2 < length) {
    if (predicate(array2[index2], index2, array2)) {
      return index2;
    }
  }
  return -1;
}
function baseIsNaN(value2) {
  return value2 !== value2;
}
function strictIndexOf(array2, value2, fromIndex) {
  let index2 = fromIndex - 1;
  const length = array2.length;
  while (++index2 < length) {
    if (array2[index2] === value2) {
      return index2;
    }
  }
  return -1;
}
function baseIndexOf(array2, value2, fromIndex) {
  return value2 === value2 ? strictIndexOf(array2, value2, fromIndex) : baseFindIndex(array2, baseIsNaN, fromIndex);
}
function charsStartIndex(strSymbols, chrSymbols) {
  let index2 = -1;
  const length = strSymbols.length;
  while (++index2 < length && baseIndexOf(chrSymbols, strSymbols[index2], 0) > -1) {
  }
  return index2;
}
function charsEndIndex(strSymbols, chrSymbols) {
  let index2 = strSymbols.length;
  while (index2-- && baseIndexOf(chrSymbols, strSymbols[index2], 0) > -1) {
  }
  return index2;
}
function baseSlice(array2, start, end) {
  let index2 = -1;
  let length = array2.length;
  if (start < 0) {
    start = -start > length ? 0 : length + start;
  }
  end = end > length ? length : end;
  if (end < 0) {
    end += length;
  }
  length = start > end ? 0 : end - start >>> 0;
  start >>>= 0;
  const result = Array.from({ length });
  while (++index2 < length) {
    result[index2] = array2[index2 + start];
  }
  return result;
}
function castSlice(array2, start, end) {
  const length = array2.length;
  end = end === void 0 ? length : end;
  return !start && end >= length ? array2 : baseSlice(array2, start, end);
}
function trim(string2, chars) {
  string2 = toString(string2);
  if (string2 && chars === void 0) {
    return baseTrim(string2);
  }
  if (!string2 || !(chars = baseToString(chars))) {
    return string2;
  }
  const strSymbols = stringToArray(string2), chrSymbols = stringToArray(chars), start = charsStartIndex(strSymbols, chrSymbols), end = charsEndIndex(strSymbols, chrSymbols) + 1;
  return castSlice(strSymbols, start, end).join("");
}
const isEmpty = (val) => !val && val !== 0 || isArray$1(val) && val.length === 0 || isObject$1(val) && !Object.keys(val).length;
const getProp = (obj, path, defaultValue) => {
  return {
    get value() {
      return get(obj, path, defaultValue);
    },
    set value(val) {
      set(obj, path, val);
    }
  };
};
const tnPropKey = "__tnPropKey";
const definePropType = (val) => val;
const isTnProp = (val) => isObject$1(val) && !!val[tnPropKey];
const buildProp = (prop, key) => {
  if (!isObject$1(prop) || isTnProp(prop))
    return prop;
  const { values, required: required2, default: defaultValue, type: type2, validator } = prop;
  const _validator = values || validator ? (val) => {
    let valid = false;
    let allowedValues = [];
    if (values) {
      allowedValues = Array.from(values);
      if (hasOwn(prop, "default")) {
        allowedValues.push(defaultValue);
      }
      valid || (valid = allowedValues.includes(val));
    }
    if (validator)
      valid || (valid = validator(val));
    if (!valid && allowedValues.length > 0) {
      const allowValuesText = [...new Set(allowedValues)].map((value2) => JSON.stringify(value2)).join(", ");
      warn(
        `Invalid prop: validation failed${key ? ` for prop "${key}"` : ""}. Expected one of [${allowValuesText}], got value ${JSON.stringify(
          val
        )}.`
      );
    }
    return valid;
  } : void 0;
  const tnProp = {
    type: type2,
    required: !!required2,
    validator: _validator,
    [tnPropKey]: true
  };
  if (hasOwn(prop, "default"))
    tnProp.default = defaultValue;
  return tnProp;
};
const buildProps = (props2) => fromPairs(
  Object.entries(props2).map(([key, option]) => [
    key,
    buildProp(option, key)
  ])
);
const iconPropType = definePropType([String]);
const FormValidateIconsMap = {
  validating: "loading",
  success: "success-circle",
  error: "close-circle"
};
const formatDomSizeValue = (value2, unit = "rpx", empty2 = true) => {
  if (!value2)
    return empty2 ? "" : `0${unit}`;
  if (isString(value2) && /(^calc)|(%|vw|vh|px|rpx|auto)$/.test(value2))
    return value2;
  return `${value2}${unit}`;
};
const generateId = () => Math.floor(Math.random() * 1e4);
class TuniaoUIError2 extends Error {
  constructor(message) {
    super(message);
    this.name = "TuniaoUIError";
  }
}
function throwError(scope, msg) {
  throw new TuniaoUIError2(`[${scope}] ${msg}`);
}
function debugWarn(scope, message) {
  {
    const error2 = isString(scope) ? new TuniaoUIError2(`[${scope}] ${message}`) : scope;
    console.warn(error2);
  }
}
const cloneDeep = (value2, visited = /* @__PURE__ */ new WeakMap()) => {
  if (value2 === null || typeof value2 !== "object") {
    return value2;
  }
  if (visited.has(value2)) {
    return visited.get(value2);
  }
  if (Array.isArray(value2)) {
    const clonedArray = value2.map((item) => cloneDeep(item, visited));
    visited.set(value2, clonedArray);
    return clonedArray;
  }
  if (value2 instanceof Date) {
    return new Date(value2.getTime());
  }
  if (value2 instanceof RegExp) {
    const flags = value2.flags;
    return new RegExp(value2.source, flags);
  }
  const clonedObject = {};
  visited.set(value2, clonedObject);
  for (const key in value2) {
    if (Object.prototype.hasOwnProperty.call(value2, key)) {
      clonedObject[key] = cloneDeep(value2[key], visited);
    }
  }
  const prototype = Object.getPrototypeOf(value2);
  Object.setPrototypeOf(clonedObject, cloneDeep(prototype, visited));
  return clonedObject;
};
const defaultNamespace = "tn";
const _bem = (namespace, block, blockSuffix, element, modifier) => {
  let cls = `${namespace}-${block}`;
  if (blockSuffix) {
    cls += `-${blockSuffix}`;
  }
  if (element) {
    cls += `__${element}`;
  }
  if (modifier) {
    cls += `--${modifier}`;
  }
  return cls;
};
const namespaceContextKey = Symbol("localContextKey");
const useGetDerivedNamespace = () => {
  const derivedNamespace = inject(namespaceContextKey, ref(defaultNamespace));
  const namespace = computed(() => {
    return unref(derivedNamespace) || defaultNamespace;
  });
  return namespace;
};
const useNamespace = (block) => {
  const namespace = useGetDerivedNamespace();
  const b = (blockSuffix = "") => _bem(namespace.value, block, blockSuffix, "", "");
  const e2 = (element) => element ? _bem(namespace.value, block, "", element, "") : "";
  const m2 = (modifier) => modifier ? _bem(namespace.value, block, "", "", modifier) : "";
  const be = (blockSuffix, element) => blockSuffix && element ? _bem(namespace.value, block, blockSuffix, element, "") : "";
  const em = (element, modifier) => element && modifier ? _bem(namespace.value, block, "", element, modifier) : "";
  const bm = (blockSuffix, modifier) => blockSuffix && modifier ? _bem(namespace.value, block, blockSuffix, "", modifier) : "";
  const bem = (blockSuffix, element, modifier) => blockSuffix && element && modifier ? _bem(namespace.value, block, blockSuffix, element, modifier) : "";
  const is = (name, ...args) => {
    const state = args.length >= 1 ? args[0] : true;
    return name && state ? `is-${name}` : "";
  };
  const cssVar = (object2) => {
    const styles = {};
    for (const key in object2) {
      if (object2[key]) {
        styles[`--${namespace.value}-${key}`] = object2[key];
      }
    }
    return styles;
  };
  const cssVarBlock = (object2) => {
    const styles = {};
    for (const key in object2) {
      if (object2[key]) {
        styles[`--${namespace.value}-${block}-${key}`] = object2[key];
      }
    }
    return styles;
  };
  const cssVarName = (name) => `--${namespace.value}-${name}`;
  const cssVarBlockName = (name) => `--${namespace.value}-${block}-${name}`;
  return {
    namespace,
    b,
    e: e2,
    m: m2,
    be,
    em,
    bm,
    bem,
    is,
    // css
    cssVar,
    cssVarName,
    cssVarBlock,
    cssVarBlockName
  };
};
const useComponentColor = (prop, type2 = "") => {
  const classColor = ref("");
  const styleColor = ref("");
  const innerColorReg = /^(tn-|gradient)/;
  const styleColorReg = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{8}|[A-Fa-f0-9]{3})$|^rgb\(\d{1,3}(,\s?\d{1,3}){2}\)$|^rgba\(\d{1,3}(,\s?\d{1,3}){2},\s?0?\.?\d{1,}\)|transparent/i;
  const handleColorValue = (value2) => {
    classColor.value = "";
    styleColor.value = "";
    if (value2 === void 0)
      return;
    if (innerColorReg.test(value2)) {
      if (type2 === "bg" && /.*gradient.*/.test(value2)) {
        const gradientValue = value2.split("__")[1];
        classColor.value = `tn-gradient-bg__${gradientValue}`;
        return;
      }
      classColor.value = `${value2}_${type2}`;
    }
    if (styleColorReg.test(value2)) {
      styleColor.value = value2;
    }
  };
  handleColorValue(prop.value);
  watch(
    () => prop.value,
    (val) => {
      handleColorValue(val);
    }
  );
  const updateColor = (value2) => {
    handleColorValue(value2);
  };
  return [classColor, styleColor, updateColor];
};
const componentSizes = ["", "sm", "lg", "xl"];
const formComponentSizes = ["", "sm", "lg"];
const componentShapes = ["", "circle", "round"];
const componentImgModes = [
  "scaleToFill",
  "aspectFit",
  "aspectFill",
  "widthFix",
  "heightFix",
  "top",
  "bottom",
  "center",
  "left",
  "right",
  "top left",
  "top right",
  "bottom left",
  "bottom right"
];
const componentTypes = [
  "",
  "primary",
  "success",
  "warning",
  "danger",
  "info"
];
const UPDATE_MODEL_EVENT = "update:modelValue";
const CHANGE_EVENT = "change";
const INPUT_EVENT = "input";
const ZIndex = {
  /** popup 弹出层 */
  popup: 20075,
  /** mask 遮罩 */
  mask: 9999
};
const useComponentSize = (size2) => {
  const sizeType = computed(() => {
    if (!size2)
      return "none";
    return componentSizes.includes(size2) ? "inner" : "custom";
  });
  return {
    sizeType
  };
};
const useProp = (name) => {
  const vm = getCurrentInstance();
  return computed(
    () => {
      var _a2;
      return isEmptyVariableInDefault((_a2 = vm == null ? void 0 : vm.proxy) == null ? void 0 : _a2.$props)[name];
    }
  );
};
const useSelectorQuery = (instance) => {
  let query = null;
  if (!instance) {
    instance = getCurrentInstance();
  }
  if (!instance) {
    debugWarn("useSelectorQuery", "useSelectorQuery必须在setup函数中使用");
  }
  query = index$1.createSelectorQuery().in(instance);
  const getSelectorNodeInfo = (selector) => {
    return new Promise((resolve2, reject) => {
      if (query) {
        query.select(selector).boundingClientRect((res) => {
          const selectRes = res;
          if (selectRes) {
            resolve2(selectRes);
          } else {
            reject(new Error(`未找到对应节点: ${selector}`));
          }
        }).exec();
      } else {
        reject(new Error("未找到对应的SelectorQuery实例"));
      }
    });
  };
  const getSelectorNodeInfos = (selector) => {
    return new Promise((resolve2, reject) => {
      if (query) {
        query.selectAll(selector).boundingClientRect((res) => {
          const selectRes = res;
          if (selectRes && selectRes.length > 0) {
            resolve2(selectRes);
          } else {
            reject(new Error(`未找到对应节点: ${selector}`));
          }
        }).exec();
      } else {
        reject(new Error("未找到对应的SelectorQuery实例"));
      }
    });
  };
  return {
    query,
    getSelectorNodeInfo,
    getSelectorNodeInfos
  };
};
const useToggle = (initState) => {
  const state = ref(initState);
  const toggle = () => {
    state.value = !state.value;
  };
  return [state, toggle];
};
ref(0);
const useOrderedChildren = () => {
  const children = {};
  const orderedChildren = shallowRef([]);
  const addChild = (child) => {
    children[child.uid] = child;
    orderedChildren.value.push(child);
  };
  const removeChild = (uid2) => {
    delete children[uid2];
    orderedChildren.value = orderedChildren.value.filter(
      (child) => child.uid !== uid2
    );
  };
  return {
    children: orderedChildren,
    addChild,
    removeChild
  };
};
const useObserver = (instance) => {
  if (!instance) {
    instance = getCurrentInstance();
  }
  if (!instance) {
    debugWarn("useObserver", "请在 setup 中使用 useObserver");
  }
  let observerInstance = null;
  const connectObserver = (selector, fn, fnOptions, options) => {
    disconnectObserver();
    observerInstance = index$1.createIntersectionObserver(instance, options);
    if (fnOptions.type === "relativeTo")
      observerInstance.relativeTo((fnOptions == null ? void 0 : fnOptions.selector) || "", fnOptions.margins);
    else if (fnOptions.type === "relativeToViewport")
      observerInstance.relativeToViewport(fnOptions.margins);
    observerInstance.observe(selector, (res) => {
      fn && fn(res);
    });
  };
  const disconnectObserver = () => {
    if (observerInstance) {
      observerInstance.disconnect();
      observerInstance = null;
    }
  };
  return {
    connectObserver,
    disconnectObserver
  };
};
const useLongPress = (event, enabled2, longPressIntervel = 250) => {
  let longPressTimer = null;
  const clearLongPressTimer = () => {
    if (longPressTimer) {
      clearInterval(longPressTimer);
      longPressTimer = null;
    }
  };
  const handleLongPressEvent = (...args) => {
    if (enabled2.value) {
      event(...args);
      clearLongPressTimer();
      longPressTimer = setInterval(() => {
        event(...args);
      }, longPressIntervel);
    } else {
      event(...args);
    }
  };
  return {
    handleLongPressEvent,
    clearLongPressTimer
  };
};
const timeLineKey = Symbol("timeLineKey");
const timeLineProps = buildProps$1({
  /**
   * @description 显示竖线
   */
  showLine: {
    type: Boolean,
    default: true
  }
});
const timeLineItemProps = buildProps$1({
  /**
   * @description 标题
   */
  title: String,
  /**
   * @description 标题icon
   */
  titleIcon: String,
  /**
   * @description 节点背景
   */
  dotBgColor: String,
  /**
   * @description 节点字体颜色
   */
  dotTextColor: String
});
const timeLineItemEmits = {
  /**
   * @description 点击事件
   */
  click: () => true
};
const useTimeLineCustomStyle = (props2) => {
  const ns = useNamespace$1("time-line-item");
  const [dotBgColorClass, dotBgColorStyle] = useComponentColor$1(
    toRef(props2, "dotBgColor"),
    "bg"
  );
  const [dotTextColorClass, dotTextColorStyle] = useComponentColor$1(
    toRef(props2, "dotTextColor"),
    "text"
  );
  const dotClass = computed(() => {
    const cls = [];
    if (dotBgColorClass.value)
      cls.push(dotBgColorClass.value);
    if (dotTextColorClass.value)
      cls.push(dotTextColorClass.value);
    return cls.join(" ");
  });
  const dotStyle = computed(() => {
    const style = {};
    if (!dotBgColorClass.value) {
      style.backgroundColor = dotBgColorStyle.value || "var(--tn-color-blue)";
    }
    if (dotTextColorStyle.value) {
      style.color = dotTextColorStyle.value;
    } else if (!dotBgColorClass.value && !dotTextColorClass.value) {
      style.color = "#fff";
    }
    return style;
  });
  return {
    ns,
    dotClass,
    dotStyle
  };
};
const useTimeLineDataCustomStyle = (props2) => {
  const ns = useNamespace$1("time-line-data");
  const [dotColorClass, dotColorStyle] = useComponentColor$1(
    toRef(props2, "dotColor"),
    "text"
  );
  const dotClass = computed(() => {
    const cls = [];
    if (dotColorClass.value)
      cls.push(dotColorClass.value);
    return cls.join(" ");
  });
  const dotStyle = computed(() => {
    const style = {};
    if (!dotColorClass.value) {
      style.color = dotColorStyle.value || "var(--tn-color-red)";
    }
    return style;
  });
  return {
    ns,
    dotClass,
    dotStyle
  };
};
const timeLineDataProps = buildProps$1({
  /**
   * @description 节点图标
   */
  dotIcon: {
    type: String,
    default: "circle-fill"
  },
  /**
   * @description 节点颜色
   */
  dotColor: String
});
const timeLineDataEmits = {
  /**
   * @description 点击事件
   */
  click: () => true
};
const photoAlbumProps$1 = buildProps$1({
  /**
   * @description 图片地址列表
   */
  data: {
    type: definePropType$1(Array),
    default: () => []
  },
  /**
   * @description 最大允许显示图片的数量
   */
  max: {
    type: Number,
    default: 9
  },
  /**
   * @description 一行显示的图片数量
   */
  column: {
    type: Number,
    default: 3
  },
  /**
   * @description 图片模式
   */
  imgMode: {
    type: String,
    values: componentImgModes$1,
    default: "aspectFill"
  },
  /**
   * @description 是否开启懒加载
   */
  lazyLoad: {
    type: Boolean,
    default: true
  },
  /**
   * @description 点击图片进行预览
   */
  preview: {
    type: Boolean,
    default: true
  }
});
const photoAlbumEmits$1 = {
  /**
   * @description 点击图片时触发
   */
  click: (index2) => isNumber$1(index2)
};
const usePhotoAlbum$1 = (props2, emits) => {
  const imageData = computed(() => {
    const maxLength = Math.min(props2.data.length, props2.max);
    return props2.data.slice(0, maxLength);
  });
  const imageClickEvent = (index2) => {
    emits("click", index2);
    if (!props2.preview)
      return;
    index$1.previewImage({
      urls: imageData.value,
      current: index2
    });
  };
  return {
    imageData,
    imageClickEvent
  };
};
const switchTabProps = buildProps$1({
  /**
   * @description 当前激活的标签索引
   */
  modelValue: {
    type: Number,
    default: 0
  },
  /**
   * @description 标签列表
   */
  tabs: {
    type: definePropType$1(Array),
    default: () => []
  },
  /**
   * @description 是否禁用
   */
  disabled: Boolean,
  /**
   * @description 未选中时标签的背景颜色，以tn开头使用图鸟内置的颜色
   */
  inactiveBgColor: String,
  /**
   * @description 选中时标签的背景颜色，以tn开头使用图鸟内置的颜色
   */
  activeBgColor: String,
  /**
   * @description 未选中时标签的字体颜色，以tn开头使用图鸟内置的颜色
   */
  inactiveTextColor: String,
  /**
   * @description 选中时标签的字体颜色，以tn开头使用图鸟内置的颜色
   */
  activeTextColor: String
});
const switchTabEmits = {
  [UPDATE_MODEL_EVENT$1]: (value2) => isNumber$1(value2),
  [CHANGE_EVENT$1]: (value2) => isNumber$1(value2)
};
const useSwitchTabCustomStyle = (props2) => {
  const ns = useNamespace$1("switch-tab");
  const [inactiveBgColorClass, inactiveBgColorStyle] = useComponentColor$1(
    toRef(props2, "inactiveBgColor"),
    "bg"
  );
  const [activeBgColorClass, activeBgColorStyle] = useComponentColor$1(
    toRef(props2, "activeBgColor"),
    "bg"
  );
  const [inactiveTextColorClass, inactiveTextColorStyle] = useComponentColor$1(
    toRef(props2, "inactiveTextColor"),
    "text"
  );
  const [activeTextColorClass, activeTextColorStyle] = useComponentColor$1(
    toRef(props2, "activeTextColor"),
    "text"
  );
  const switchTabClass = computed(() => {
    const cls = [ns.b()];
    if (activeBgColorClass.value)
      cls.push(activeBgColorClass.value);
    return cls.join(" ");
  });
  const switchTabStyle = computed(() => {
    const style = {};
    if (!activeBgColorClass.value) {
      style.backgroundColor = activeBgColorStyle.value || "var(--tn-color-white)";
    }
    return style;
  });
  const tabClass = computed(() => {
    return (index2) => {
      const cls = [
        ns.e("tab"),
        ns.is("active", index2 === props2.modelValue)
      ];
      if (index2 === props2.modelValue) {
        if (activeBgColorClass.value)
          cls.push(activeBgColorClass.value);
        if (activeTextColorClass.value)
          cls.push(activeTextColorClass.value);
      } else {
        if (inactiveBgColorClass.value)
          cls.push(inactiveBgColorClass.value);
        if (inactiveTextColorClass.value)
          cls.push(inactiveTextColorClass.value);
      }
      return cls.join(" ");
    };
  });
  const tabStyle = computed(() => {
    return (index2) => {
      const style = {};
      if (index2 === props2.modelValue) {
        if (!activeBgColorClass.value) {
          style.backgroundColor = activeBgColorStyle.value || "var(--tn-color-white)";
        }
        if (activeTextColorStyle.value) {
          style.color = activeTextColorStyle.value;
        } else if (!activeTextColorClass.value && !activeBgColorClass.value) {
          style.color = "var(--tn-text-color-primary)";
        }
      } else {
        if (!inactiveBgColorClass.value) {
          style.backgroundColor = inactiveBgColorStyle.value || "var(--tn-color-primary-light-7)";
        }
        if (inactiveTextColorStyle.value) {
          style.color = inactiveTextColorStyle.value;
        } else if (!inactiveTextColorClass.value && !inactiveBgColorClass.value) {
          style.color = "var(--tn-text-color-primary)";
        }
        if (index2 === props2.modelValue - 1) {
          style.borderBottomRightRadius = "30rpx";
        }
        if (index2 === props2.modelValue + 1) {
          style.borderBottomLeftRadius = "30rpx";
        }
      }
      return style;
    };
  });
  return {
    ns,
    tabClass,
    tabStyle,
    switchTabClass,
    switchTabStyle
  };
};
const useSwitchTab = (props2, emits) => {
  const tabClickEvent = (index2) => {
    if (props2.disabled)
      return;
    emits("update:modelValue", index2);
    nextTick$1(() => {
      emits("change", index2);
    });
  };
  return {
    tabClickEvent
  };
};
const lazyLoadProps$1 = buildProps$1({
  /**
   * @description 图片地址
   */
  src: String,
  /**
   * @description 图片高度
   */
  height: String,
  /**
   * @description 图片宽度
   */
  width: String,
  /**
   * @description 图片裁剪模式
   */
  mode: {
    type: String,
    values: componentImgModes$1,
    default: "aspectFill"
  },
  /**
   * @description 开始加载图片的位置，单位为 px，如果设置为负数表示距离底部还有多少个像素就开始加载
   */
  threshold: {
    type: Number,
    default: 100
  },
  /**
   * @description 是否开启过度效果
   */
  transition: {
    type: Boolean,
    default: true
  }
});
const lazyLoadEmits$1 = {
  /**
   * @description 图片加载完成
   */
  loaded: () => true,
  /**
   * @description 图片加载失败
   */
  error: () => true
};
const useLazyLoadCustomStyle$1 = (props2) => {
  const ns = useNamespace$1("lazy-load");
  const lazyLoadStyle = computed(() => {
    const style = {};
    if (props2.width)
      style.width = formatDomSizeValue$1(props2.width);
    if (props2.height)
      style.height = formatDomSizeValue$1(props2.height);
    return style;
  });
  return {
    ns,
    lazyLoadStyle
  };
};
const useLazyLoad$1 = (props2) => {
  const instance = getCurrentInstance();
  if (!instance) {
    debugWarn$1("TnLazyLoad", "请在 setup 中使用 useLazyLoad");
  }
  const { emit: emit2 } = instance;
  const { getSelectorNodeInfo } = useSelectorQuery$1(instance);
  const { connectObserver, disconnectObserver } = useObserver$1(instance);
  const componentId = `tll-${generateId$1()}`;
  const threshold = computed(
    () => isEmptyVariableInDefault$1(props2.threshold, 100)
  );
  const imageStatus = ref("waiting");
  const showImage = ref(false);
  let initCount = 0;
  const initObserver = async () => {
    disconnectObserver();
    try {
      await getSelectorNodeInfo(`#${componentId}`);
      initCount = 0;
      const bottomThreshold = threshold.value < 0 ? -Math.abs(threshold.value) : Math.abs(threshold.value);
      connectObserver(
        `#${componentId}`,
        (res) => {
          if (res.intersectionRatio > 0) {
            showImage.value = true;
            imageStatus.value = "loading";
            disconnectObserver();
          }
        },
        {
          type: "relativeToViewport",
          margins: {
            bottom: bottomThreshold
          }
        }
      );
    } catch (err) {
      if (initCount > 10) {
        initCount = 0;
        debugWarn$1("TnLazyLoad", `获取图片节点信息失败：${err}`);
        return;
      }
      initCount++;
      setTimeout(() => {
        initObserver();
      }, 150);
    }
  };
  const handleImageLoadedSuccess = () => {
    imageStatus.value = "loaded";
    emit2("loaded");
  };
  const handleImageLoadedFailed = (err) => {
    debugWarn$1("TnLazyLoad", `图片加载失败: ${err}`);
    imageStatus.value = "error";
    emit2("error");
  };
  onMounted(() => {
    nextTick$1(() => {
      initObserver();
    });
  });
  onUnmounted(() => {
    disconnectObserver();
  });
  return {
    componentId,
    imageStatus,
    showImage,
    handleImageLoadedSuccess,
    handleImageLoadedFailed
  };
};
const tagShape = [
  ...componentShapes$1,
  "circleLeft",
  "circleRight"
];
const tagProps = buildProps$1({
  /**
   * @description 按钮颜色类型
   */
  type: {
    type: String,
    values: componentTypes$1,
    default: "primary"
  },
  /**
   * @description 背景颜色，以tn开头使用图鸟内置的颜色
   */
  bgColor: String,
  /**
   * @description 标签字体颜色，以tn开头使用图鸟内置的颜色
   */
  textColor: String,
  /**
   * @description 字体大小，默认单位 rpx
   */
  fontSize: String,
  /**
   * @description 宽度，默认单位 rpx
   */
  width: String,
  /**
   * @description 高度，默认单位 rpx
   */
  height: String,
  /**
   * @description 标签尺寸，内置`sm`、`lg`、`xl`，同时也可以传递指定的尺寸的值
   */
  size: useComponentSizeProp$1,
  /**
   * @description 标签形状
   */
  shape: {
    type: String,
    values: tagShape,
    default: ""
  },
  /**
   * @description 是否显示边框
   */
  border: Boolean,
  /**
   * @description 边框颜色，以tn开头使用图鸟内置的颜色
   */
  borderColor: String,
  /**
   * @description 边框加粗
   */
  borderBold: Boolean,
  /**
   * @description 自定义样式
   */
  customStyle: useComponentCustomStyleProp$1,
  /**
   * @description 自定义类
   */
  customClass: String
});
const tagEmits = {
  /**
   * @description 标签点击事件
   */
  click: () => true
};
const useTagCustomStyle = (props2) => {
  const ns = useNamespace$1("tag");
  const [bgColorClass, bgColorStyle] = useComponentColor$1(
    toRef(props2, "bgColor"),
    "bg"
  );
  const [textColorClass, textColorStyle] = useComponentColor$1(
    toRef(props2, "textColor"),
    "text"
  );
  const [borderColorClass, borderColorStyle] = useComponentColor$1(
    toRef(props2, "borderColor"),
    "border"
  );
  const tagClass = computed(() => {
    const cls = [];
    cls.push(ns.b());
    if (props2.size)
      cls.push(ns.m(props2.size));
    if (props2.shape)
      cls.push(ns.m(props2.shape));
    if (props2.type)
      cls.push(`tn-type-${props2.type}_bg`);
    if (bgColorClass.value)
      cls.push(bgColorClass.value);
    if (textColorClass.value)
      cls.push(textColorClass.value);
    if (props2.border) {
      cls.push("tn-border");
      if (borderColorClass.value)
        cls.push(borderColorClass.value);
    }
    if (props2.borderBold)
      cls.push("tn-border-bold");
    if (props2.customClass)
      cls.push(props2.customClass);
    return cls.join(" ");
  });
  const tagStyle = computed(() => {
    const style = {};
    if (props2.fontSize)
      style.fontSize = formatDomSizeValue$1(props2.fontSize);
    if (props2.width)
      style.width = formatDomSizeValue$1(props2.width);
    if (props2.height)
      style.height = formatDomSizeValue$1(props2.height);
    if (bgColorStyle.value)
      style.backgroundColor = bgColorStyle.value;
    if (textColorStyle.value)
      style.color = textColorStyle.value;
    if (borderColorStyle.value)
      style.borderColor = borderColorStyle.value;
    if (!isEmpty$1(props2.customStyle)) {
      Object.assign(style, props2.customStyle);
    }
    return style;
  });
  return {
    tagStyle,
    tagClass
  };
};
const useTag = (props2, emits) => {
  const tagClickHandle = () => {
    emits("click");
  };
  return {
    tagClickHandle
  };
};
const buttonMixin = defineMixin({
  props: {
    lang: String,
    sessionFrom: String,
    sendMessageTitle: String,
    sendMessagePath: String,
    sendMessageImg: String,
    showMessageCard: Boolean,
    appParameter: String,
    formType: String,
    openType: String
  }
});
const openType = defineMixin({
  props: {
    openType: String
  },
  methods: {
    onGetUserInfo(event) {
      this.$emit("getuserinfo", event.detail);
    },
    onContact(event) {
      this.$emit("contact", event.detail);
    },
    onGetPhoneNumber(event) {
      this.$emit("getphonenumber", event.detail);
    },
    onError(event) {
      this.$emit("error", event.detail);
    },
    onLaunchApp(event) {
      this.$emit("launchapp", event.detail);
    },
    onOpenSetting(event) {
      this.$emit("opensetting", event.detail);
    }
  }
});
const props$d = defineMixin({
  props: {
    // 是否细边框
    hairline: {
      type: Boolean,
      default: () => defProps.button.hairline
    },
    // 按钮的预置样式，info，primary，error，warning，success
    type: {
      type: String,
      default: () => defProps.button.type
    },
    // 按钮尺寸，large，normal，small，mini
    size: {
      type: String,
      default: () => defProps.button.size
    },
    // 按钮形状，circle（两边为半圆），square（带圆角）
    shape: {
      type: String,
      default: () => defProps.button.shape
    },
    // 按钮是否镂空
    plain: {
      type: Boolean,
      default: () => defProps.button.plain
    },
    // 是否禁止状态
    disabled: {
      type: Boolean,
      default: () => defProps.button.disabled
    },
    // 是否加载中
    loading: {
      type: Boolean,
      default: () => defProps.button.loading
    },
    // 加载中提示文字
    loadingText: {
      type: [String, Number],
      default: () => defProps.button.loadingText
    },
    // 加载状态图标类型
    loadingMode: {
      type: String,
      default: () => defProps.button.loadingMode
    },
    // 加载图标大小
    loadingSize: {
      type: [String, Number],
      default: () => defProps.button.loadingSize
    },
    // 开放能力，具体请看uniapp稳定关于button组件部分说明
    // https://uniapp.dcloud.io/component/button
    openType: {
      type: String,
      default: () => defProps.button.openType
    },
    // 用于 <form> 组件，点击分别会触发 <form> 组件的 submit/reset 事件
    // 取值为submit（提交表单），reset（重置表单）
    formType: {
      type: String,
      default: () => defProps.button.formType
    },
    // 打开 APP 时，向 APP 传递的参数，open-type=launchApp时有效
    // 只微信小程序、QQ小程序有效
    appParameter: {
      type: String,
      default: () => defProps.button.appParameter
    },
    // 指定是否阻止本节点的祖先节点出现点击态，微信小程序有效
    hoverStopPropagation: {
      type: Boolean,
      default: () => defProps.button.hoverStopPropagation
    },
    // 指定返回用户信息的语言，zh_CN 简体中文，zh_TW 繁体中文，en 英文。只微信小程序有效
    lang: {
      type: String,
      default: () => defProps.button.lang
    },
    // 会话来源，open-type="contact"时有效。只微信小程序有效
    sessionFrom: {
      type: String,
      default: () => defProps.button.sessionFrom
    },
    // 会话内消息卡片标题，open-type="contact"时有效
    // 默认当前标题，只微信小程序有效
    sendMessageTitle: {
      type: String,
      default: () => defProps.button.sendMessageTitle
    },
    // 会话内消息卡片点击跳转小程序路径，open-type="contact"时有效
    // 默认当前分享路径，只微信小程序有效
    sendMessagePath: {
      type: String,
      default: () => defProps.button.sendMessagePath
    },
    // 会话内消息卡片图片，open-type="contact"时有效
    // 默认当前页面截图，只微信小程序有效
    sendMessageImg: {
      type: String,
      default: () => defProps.button.sendMessageImg
    },
    // 是否显示会话内消息卡片，设置此参数为 true，用户进入客服会话会在右下角显示"可能要发送的小程序"提示，
    // 用户点击后可以快速发送小程序消息，open-type="contact"时有效
    showMessageCard: {
      type: Boolean,
      default: () => defProps.button.showMessageCard
    },
    // 额外传参参数，用于小程序的data-xxx属性，通过target.dataset.name获取
    dataName: {
      type: String,
      default: () => defProps.button.dataName
    },
    // 节流，一定时间内只能触发一次
    throttleTime: {
      type: [String, Number],
      default: () => defProps.button.throttleTime
    },
    // 按住后多久出现点击态，单位毫秒
    hoverStartTime: {
      type: [String, Number],
      default: () => defProps.button.hoverStartTime
    },
    // 手指松开后点击态保留时间，单位毫秒
    hoverStayTime: {
      type: [String, Number],
      default: () => defProps.button.hoverStayTime
    },
    // 按钮文字，之所以通过props传入，是因为slot传入的话
    // nvue中无法控制文字的样式
    text: {
      type: [String, Number],
      default: () => defProps.button.text
    },
    // 按钮图标
    icon: {
      type: String,
      default: () => defProps.button.icon
    },
    // 按钮图标
    iconColor: {
      type: String,
      default: () => defProps.button.icon
    },
    // 按钮颜色，支持传入linear-gradient渐变色
    color: {
      type: String,
      default: () => defProps.button.color
    },
    // 停止冒泡
    stop: {
      type: Boolean,
      default: () => defProps.button.stop
    }
  }
});
const imageExtensions$1 = [
  "jpg",
  "jpeg",
  "png",
  "gif",
  "webp",
  "ico"
];
const imageUploadProps$1 = buildProps$1({
  /**
   * @description 已上传的图片列表绑定值，传递的是图片的url地址
   */
  modelValue: {
    type: definePropType$1(Array),
    default: () => []
  },
  /**
   * @description 禁止上传
   */
  disabled: Boolean,
  /**
   * @description 图片上传地址
   */
  action: String,
  /**
   * @description 图片上传的字段名称
   */
  name: {
    type: String,
    default: "file"
  },
  /**
   * @description 图片上传的header, header 中不能设置 Referer
   */
  header: {
    type: Object,
    default: () => ({})
  },
  /**
   * @description 图片上传HTTP 请求中其他额外的 form data
   */
  formData: {
    type: Object,
    default: () => ({})
  },
  /**
   * @description 最大允许上传个数
   */
  limit: {
    type: Number,
    default: 9
  },
  /**
   * @description 自动上传
   */
  autoUpload: {
    type: Boolean,
    default: true
  },
  /**
   * @description 显示删除按钮
   */
  showRemove: {
    type: Boolean,
    default: true
  },
  /**
   * @description 显示错误提示信息
   */
  showErrorTips: {
    type: Boolean,
    default: true
  },
  /**
   * @description 显示上传进度条
   */
  showUploadProgress: {
    type: Boolean,
    default: true
  },
  /**
   * @description 上传图片的SizeType
   */
  sizeType: {
    type: definePropType$1(Array),
    default: () => ["original", "compressed"]
  },
  /**
   * @description 上传图片的来源
   */
  sourceType: {
    type: definePropType$1(Array),
    default: () => ["album", "camera"]
  },
  /**
   * @description 允许多选图片
   */
  multiple: {
    type: Boolean,
    default: true
  },
  /**
   * @description 允许上传的最大图片大小，单位为byte
   */
  maxSize: {
    type: Number,
    default: 10 * 1024 * 1024
  },
  /**
   * @description 允许上传的图片类型
   */
  extensions: {
    type: definePropType$1(Array),
    default: () => imageExtensions$1
  },
  /**
   * @description 自动移除上传失败的图片
   */
  autoRemoveFaildFile: {
    type: Boolean,
    default: false
  },
  /**
   * @description 自定义上传函数
   */
  customUploadHandler: {
    type: definePropType$1(Function)
  },
  /**
   * @description 自定义上传回调处理函数
   */
  customUploadCallback: {
    type: definePropType$1(Function)
  },
  /**
   * @description 上传前的钩子函数
   */
  beforeUpload: {
    type: definePropType$1(Function)
  },
  /**
   * @description 删除前的钩子函数
   */
  beforeRemove: {
    type: definePropType$1(Function)
  },
  /**
   * @description 值发生修改时是否触发表单验证
   */
  validateEvent: {
    type: Boolean,
    default: true
  }
});
const imageUploadEmits$1 = {
  [UPDATE_MODEL_EVENT$1]: (value2) => isArray$1(value2),
  [CHANGE_EVENT$1]: (value2) => isArray$1(value2),
  /**
   * @description 图片超过最大尺寸或者文件不支持时触发
   */
  oversizeOrNoSupport: (file) => true,
  /**
   * @description 图片上传成功回调
   */
  success: (file) => true,
  /**
   * @description 图片上传失败回调
   */
  fail: (error2, file) => true,
  /**
   * @description 图片删除成功回调
   */
  remove: (url2) => true,
  /**
   * @description 图片预览回调
   */
  preview: (url2) => true
};
const formContextKey$1 = Symbol("formContextKey");
const formItemContextKey$1 = Symbol("formItemContextKey");
const formMetaProps$1 = buildProps$1({
  /**
   * @description 设置表单下组件的尺寸
   */
  size: {
    type: String,
    values: formComponentSizes$1
  },
  /**
   * @description 是否禁用表单内的所有组件，优先级比组件自身的禁用属性高
   */
  disabled: Boolean
});
const formProps$1 = buildProps$1({
  ...formMetaProps$1,
  /**
   * @description 表单数据对象
   */
  model: Object,
  /**
   * @description 表单校验规则
   */
  rules: {
    type: definePropType$1([Object, Array])
  },
  /**
   * @description label标签位置
   */
  labelPosition: {
    type: String,
    values: ["left", "right", "top"],
    default: "right"
  },
  /**
   * @description 必填星号显示位置
   */
  requireAsteriskPosition: {
    type: String,
    values: ["left", "right"],
    default: "left"
  },
  /**
   * @description label的宽度，默认单位为rpx，支持传入数字、带单位的数值和auto
   */
  labelWidth: {
    type: [String, Number],
    default: ""
  },
  /**
   * @description 表单域标签的后缀
   */
  labelSuffix: {
    type: String,
    default: ""
  },
  /**
   * @description 是否在输入框中显示校验结果反馈图标
   */
  statusIcon: Boolean,
  /**
   * @description 是否显示校验结果
   */
  showMessage: {
    type: Boolean,
    default: true
  },
  /**
   * @description 是否在校验规则修改后立马触发一次校验
   */
  validateOnRuleChange: {
    type: Boolean,
    default: true
  },
  /**
   * @description 是否隐藏必填星号
   */
  hideRequiredAsterisk: Boolean
});
const formEmits$1 = {
  validate: (prop, isValid, message) => (isArray$1(prop) || isString(prop)) && isBoolean$1(isValid) && isString(message)
};
const useFormCustomStyle$1 = () => {
  const ns = useNamespace$1("form");
  const formClass = computed(() => {
    const cls = [ns.b()];
    return cls.join(" ");
  });
  return {
    formClass
  };
};
const useFormSize$1 = (fallback, ignore = {}) => {
  const emptyRef = ref(void 0);
  const size2 = ignore.prop ? emptyRef : useProp$1("size");
  const form = ignore.form ? { size: void 0 } : inject(formContextKey$1, void 0);
  const formItem = ignore.formItem ? { size: void 0 } : inject(formItemContextKey$1, void 0);
  return computed(
    () => size2.value || unref(fallback) || (formItem == null ? void 0 : formItem.size) || (form == null ? void 0 : form.size) || ""
  );
};
const useFormItemCustomStyle$1 = (props2, hasLabel, isRequired) => {
  const form = inject(formContextKey$1, void 0);
  const ns = useNamespace$1("form-item");
  const size2 = useFormSize$1(void 0, { formItem: false });
  const { getSelectorNodeInfo } = useSelectorQuery$1();
  const labelWidth = computed(
    () => formatDomSizeValue$1(props2.labelWidth || (form == null ? void 0 : form.labelWidth) || "")
  );
  const labelPosition = computed(
    () => props2.labelPosition || (form == null ? void 0 : form.labelPosition) || "right"
  );
  const hideRequiredAsterisk = computed(
    () => (form == null ? void 0 : form.hideRequiredAsterisk) || false
  );
  const requireAsteriskPosition = computed(
    () => (form == null ? void 0 : form.requireAsteriskPosition) || "left"
  );
  const labelContainerWidth = ref(0);
  const labelId = `label-${generateId$1()}`;
  const initLabelContainerWidth = () => {
    if (!hasLabel.value)
      return;
    getSelectorNodeInfo(`#${labelId}`).then((res) => {
      labelContainerWidth.value = (res == null ? void 0 : res.width) || 0;
    });
  };
  const formItemClass = computed(() => {
    const cls = [ns.b()];
    if (size2.value)
      cls.push(ns.m(size2.value));
    if (labelPosition.value)
      cls.push(ns.m(`label-${labelPosition.value}`));
    return cls.join(" ");
  });
  const formItemLabelClass = computed(() => {
    const cls = [ns.e("label")];
    if (!hideRequiredAsterisk.value && isRequired.value) {
      cls.push(
        ns.em("label", "required"),
        ns.em("label", `asterisk-${requireAsteriskPosition.value}`)
      );
    }
    return cls.join(" ");
  });
  const formItemLabelStyle = computed(() => {
    const style = {};
    if (labelPosition.value !== "top" && labelWidth.value)
      style.width = labelWidth.value;
    return style;
  });
  const formItemErrorMessageStyle = computed(() => {
    const style = {};
    if (labelPosition.value !== "top" && hasLabel.value) {
      style.paddingLeft = `${labelContainerWidth.value}px`;
    }
    return style;
  });
  return {
    ns,
    labelId,
    formItemClass,
    formItemLabelClass,
    formItemLabelStyle,
    formItemErrorMessageStyle,
    initLabelContainerWidth
  };
};
const useFormItem$1 = () => {
  const form = inject(formContextKey$1, void 0);
  const formItem = inject(formItemContextKey$1, void 0);
  return {
    form,
    formItem
  };
};
const formatRegExp$1 = /%[sdj%]/g;
let warning$1 = () => {
};
if (typeof process !== "undefined" && process.env && true && typeof window !== "undefined" && typeof document !== "undefined") {
  warning$1 = (type2, errors) => {
    if (typeof console !== "undefined" && console.warn && typeof ASYNC_VALIDATOR_NO_WARNING === "undefined") {
      if (errors.every((e2) => typeof e2 === "string")) {
        console.warn(type2, errors);
      }
    }
  };
}
function convertFieldsError$1(errors) {
  if (!errors || !errors.length)
    return null;
  const fields = {};
  errors.forEach((error2) => {
    const field = error2.field;
    fields[field] = fields[field] || [];
    fields[field].push(error2);
  });
  return fields;
}
function format$1(template, ...args) {
  let i = 0;
  const len = args.length;
  if (typeof template === "function") {
    return template.apply(null, args);
  }
  if (typeof template === "string") {
    let str = template.replace(formatRegExp$1, (x) => {
      if (x === "%%") {
        return "%";
      }
      if (i >= len) {
        return x;
      }
      switch (x) {
        case "%s":
          return String(args[i++]);
        case "%d":
          return Number(args[i++]);
        case "%j":
          try {
            return JSON.stringify(args[i++]);
          } catch (_) {
            return "[Circular]";
          }
          break;
        default:
          return x;
      }
    });
    return str;
  }
  return template;
}
function isNativeStringType$1(type2) {
  return type2 === "string" || type2 === "url" || type2 === "hex" || type2 === "email" || type2 === "date" || type2 === "pattern";
}
function isEmptyValue$1(value2, type2) {
  if (value2 === void 0 || value2 === null) {
    return true;
  }
  if (type2 === "array" && Array.isArray(value2) && !value2.length) {
    return true;
  }
  if (isNativeStringType$1(type2) && typeof value2 === "string" && !value2) {
    return true;
  }
  return false;
}
function asyncParallelArray$1(arr, func2, callback) {
  const results = [];
  let total = 0;
  const arrLength = arr.length;
  function count(errors) {
    results.push(...errors || []);
    total++;
    if (total === arrLength) {
      callback(results);
    }
  }
  arr.forEach((a) => {
    func2(a, count);
  });
}
function asyncSerialArray$1(arr, func2, callback) {
  let index2 = 0;
  const arrLength = arr.length;
  function next(errors) {
    if (errors && errors.length) {
      callback(errors);
      return;
    }
    const original = index2;
    index2 = index2 + 1;
    if (original < arrLength) {
      func2(arr[original], next);
    } else {
      callback([]);
    }
  }
  next([]);
}
function flattenObjArr$1(objArr) {
  const ret = [];
  Object.keys(objArr).forEach((k) => {
    ret.push(...objArr[k] || []);
  });
  return ret;
}
let AsyncValidationError$1 = class AsyncValidationError extends Error {
  constructor(errors, fields) {
    super("Async Validation Error");
    this.errors = errors;
    this.fields = fields;
  }
};
function asyncMap$1(objArr, option, func2, callback, source) {
  if (option.first) {
    const pending2 = new Promise((resolve2, reject) => {
      const next = (errors) => {
        callback(errors);
        return errors.length ? reject(new AsyncValidationError$1(errors, convertFieldsError$1(errors))) : resolve2(source);
      };
      const flattenArr = flattenObjArr$1(objArr);
      asyncSerialArray$1(flattenArr, func2, next);
    });
    pending2.catch((e2) => e2);
    return pending2;
  }
  const firstFields = option.firstFields === true ? Object.keys(objArr) : option.firstFields || [];
  const objArrKeys = Object.keys(objArr);
  const objArrLength = objArrKeys.length;
  let total = 0;
  const results = [];
  const pending = new Promise((resolve2, reject) => {
    const next = (errors) => {
      results.push.apply(results, errors);
      total++;
      if (total === objArrLength) {
        callback(results);
        return results.length ? reject(
          new AsyncValidationError$1(results, convertFieldsError$1(results))
        ) : resolve2(source);
      }
    };
    if (!objArrKeys.length) {
      callback(results);
      resolve2(source);
    }
    objArrKeys.forEach((key) => {
      const arr = objArr[key];
      if (firstFields.indexOf(key) !== -1) {
        asyncSerialArray$1(arr, func2, next);
      } else {
        asyncParallelArray$1(arr, func2, next);
      }
    });
  });
  pending.catch((e2) => e2);
  return pending;
}
function isErrorObj$1(obj) {
  return !!(obj && obj.message !== void 0);
}
function getValue$1(value2, path) {
  let v = value2;
  for (let i = 0; i < path.length; i++) {
    if (v == void 0) {
      return v;
    }
    v = v[path[i]];
  }
  return v;
}
function complementError$1(rule, source) {
  return (oe) => {
    let fieldValue;
    if (rule.fullFields) {
      fieldValue = getValue$1(source, rule.fullFields);
    } else {
      fieldValue = source[oe.field || rule.fullField];
    }
    if (isErrorObj$1(oe)) {
      oe.field = oe.field || rule.fullField;
      oe.fieldValue = fieldValue;
      return oe;
    }
    return {
      message: typeof oe === "function" ? oe() : oe,
      fieldValue,
      field: oe.field || rule.fullField
    };
  };
}
function deepMerge$1(target, source) {
  if (source) {
    for (const s2 in source) {
      if (source.hasOwnProperty(s2)) {
        const value2 = source[s2];
        if (typeof value2 === "object" && typeof target[s2] === "object") {
          target[s2] = {
            ...target[s2],
            ...value2
          };
        } else {
          target[s2] = value2;
        }
      }
    }
  }
  return target;
}
const required$3 = (rule, value2, source, errors, options, type2) => {
  if (rule.required && (!source.hasOwnProperty(rule.field) || isEmptyValue$1(value2, type2 || rule.type))) {
    errors.push(format$1(options.messages.required, rule.fullField));
  }
};
const whitespace$1 = (rule, value2, source, errors, options) => {
  if (/^\s+$/.test(value2) || value2 === "") {
    errors.push(format$1(options.messages.whitespace, rule.fullField));
  }
};
let urlReg$1;
const getUrlRegex$1 = () => {
  if (urlReg$1) {
    return urlReg$1;
  }
  const word = "[a-fA-F\\d:]";
  const b = (options) => options && options.includeBoundaries ? `(?:(?<=\\s|^)(?=${word})|(?<=${word})(?=\\s|$))` : "";
  const v4 = "(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}";
  const v6seg = "[a-fA-F\\d]{1,4}";
  const v6 = `
(?:
(?:${v6seg}:){7}(?:${v6seg}|:)|                                    // 1:2:3:4:5:6:7::  1:2:3:4:5:6:7:8
(?:${v6seg}:){6}(?:${v4}|:${v6seg}|:)|                             // 1:2:3:4:5:6::    1:2:3:4:5:6::8   1:2:3:4:5:6::8  1:2:3:4:5:6::1.2.3.4
(?:${v6seg}:){5}(?::${v4}|(?::${v6seg}){1,2}|:)|                   // 1:2:3:4:5::      1:2:3:4:5::7:8   1:2:3:4:5::8    1:2:3:4:5::7:1.2.3.4
(?:${v6seg}:){4}(?:(?::${v6seg}){0,1}:${v4}|(?::${v6seg}){1,3}|:)| // 1:2:3:4::        1:2:3:4::6:7:8   1:2:3:4::8      1:2:3:4::6:7:1.2.3.4
(?:${v6seg}:){3}(?:(?::${v6seg}){0,2}:${v4}|(?::${v6seg}){1,4}|:)| // 1:2:3::          1:2:3::5:6:7:8   1:2:3::8        1:2:3::5:6:7:1.2.3.4
(?:${v6seg}:){2}(?:(?::${v6seg}){0,3}:${v4}|(?::${v6seg}){1,5}|:)| // 1:2::            1:2::4:5:6:7:8   1:2::8          1:2::4:5:6:7:1.2.3.4
(?:${v6seg}:){1}(?:(?::${v6seg}){0,4}:${v4}|(?::${v6seg}){1,6}|:)| // 1::              1::3:4:5:6:7:8   1::8            1::3:4:5:6:7:1.2.3.4
(?::(?:(?::${v6seg}){0,5}:${v4}|(?::${v6seg}){1,7}|:))             // ::2:3:4:5:6:7:8  ::2:3:4:5:6:7:8  ::8             ::1.2.3.4
)(?:%[0-9a-zA-Z]{1,})?                                             // %eth0            %1
`.replace(/\s*\/\/.*$/gm, "").replace(/\n/g, "").trim();
  const v46Exact = new RegExp(`(?:^${v4}$)|(?:^${v6}$)`);
  const v4exact = new RegExp(`^${v4}$`);
  const v6exact = new RegExp(`^${v6}$`);
  const ip = (options) => options && options.exact ? v46Exact : new RegExp(
    `(?:${b(options)}${v4}${b(options)})|(?:${b(options)}${v6}${b(
      options
    )})`,
    "g"
  );
  ip.v4 = (options) => options && options.exact ? v4exact : new RegExp(`${b(options)}${v4}${b(options)}`, "g");
  ip.v6 = (options) => options && options.exact ? v6exact : new RegExp(`${b(options)}${v6}${b(options)}`, "g");
  const protocol = `(?:(?:[a-z]+:)?//)`;
  const auth = "(?:\\S+(?::\\S*)?@)?";
  const ipv4 = ip.v4().source;
  const ipv6 = ip.v6().source;
  const host2 = "(?:(?:[a-z\\u00a1-\\uffff0-9][-_]*)*[a-z\\u00a1-\\uffff0-9]+)";
  const domain = "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*";
  const tld = `(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))`;
  const port = "(?::\\d{2,5})?";
  const path = '(?:[/?#][^\\s"]*)?';
  const regex = `(?:${protocol}|www\\.)${auth}(?:localhost|${ipv4}|${ipv6}|${host2}${domain}${tld})${port}${path}`;
  urlReg$1 = new RegExp(`(?:^${regex}$)`, "i");
  return urlReg$1;
};
const pattern$5 = {
  // http://emailregex.com/
  email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+\.)+[a-zA-Z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]{2,}))$/,
  // url: new RegExp(
  //   '^(?!mailto:)(?:(?:http|https|ftp)://|//)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-*)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-*)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$',
  //   'i',
  // ),
  hex: /^#?([a-f0-9]{6}|[a-f0-9]{3})$/i
};
const types$1 = {
  integer(value2) {
    return types$1.number(value2) && parseInt(value2, 10) === value2;
  },
  float(value2) {
    return types$1.number(value2) && !types$1.integer(value2);
  },
  array(value2) {
    return Array.isArray(value2);
  },
  regexp(value2) {
    if (value2 instanceof RegExp) {
      return true;
    }
    try {
      return !!new RegExp(value2);
    } catch (e2) {
      return false;
    }
  },
  date(value2) {
    return typeof value2.getTime === "function" && typeof value2.getMonth === "function" && typeof value2.getYear === "function" && !isNaN(value2.getTime());
  },
  number(value2) {
    if (isNaN(value2)) {
      return false;
    }
    return typeof value2 === "number";
  },
  object(value2) {
    return typeof value2 === "object" && !types$1.array(value2);
  },
  method(value2) {
    return typeof value2 === "function";
  },
  email(value2) {
    return typeof value2 === "string" && value2.length <= 320 && !!value2.match(pattern$5.email);
  },
  url(value2) {
    return typeof value2 === "string" && value2.length <= 2048 && !!value2.match(getUrlRegex$1());
  },
  hex(value2) {
    return typeof value2 === "string" && !!value2.match(pattern$5.hex);
  }
};
const type$3 = (rule, value2, source, errors, options) => {
  if (rule.required && value2 === void 0) {
    required$3(rule, value2, source, errors, options);
    return;
  }
  const custom = [
    "integer",
    "float",
    "array",
    "regexp",
    "object",
    "method",
    "email",
    "number",
    "date",
    "url",
    "hex"
  ];
  const ruleType = rule.type;
  if (custom.indexOf(ruleType) > -1) {
    if (!types$1[ruleType](value2)) {
      errors.push(
        format$1(options.messages.types[ruleType], rule.fullField, rule.type)
      );
    }
  } else if (ruleType && typeof value2 !== rule.type) {
    errors.push(
      format$1(options.messages.types[ruleType], rule.fullField, rule.type)
    );
  }
};
const range$1 = (rule, value2, source, errors, options) => {
  const len = typeof rule.len === "number";
  const min = typeof rule.min === "number";
  const max = typeof rule.max === "number";
  const spRegexp = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
  let val = value2;
  let key = null;
  const num = typeof value2 === "number";
  const str = typeof value2 === "string";
  const arr = Array.isArray(value2);
  if (num) {
    key = "number";
  } else if (str) {
    key = "string";
  } else if (arr) {
    key = "array";
  }
  if (!key) {
    return false;
  }
  if (arr) {
    val = value2.length;
  }
  if (str) {
    val = value2.replace(spRegexp, "_").length;
  }
  if (len) {
    if (val !== rule.len) {
      errors.push(format$1(options.messages[key].len, rule.fullField, rule.len));
    }
  } else if (min && !max && val < rule.min) {
    errors.push(format$1(options.messages[key].min, rule.fullField, rule.min));
  } else if (max && !min && val > rule.max) {
    errors.push(format$1(options.messages[key].max, rule.fullField, rule.max));
  } else if (min && max && (val < rule.min || val > rule.max)) {
    errors.push(
      format$1(options.messages[key].range, rule.fullField, rule.min, rule.max)
    );
  }
};
const ENUM$3 = "enum";
const enumerable$3 = (rule, value2, source, errors, options) => {
  rule[ENUM$3] = Array.isArray(rule[ENUM$3]) ? rule[ENUM$3] : [];
  if (rule[ENUM$3].indexOf(value2) === -1) {
    errors.push(
      format$1(options.messages[ENUM$3], rule.fullField, rule[ENUM$3].join(", "))
    );
  }
};
const pattern$4 = (rule, value2, source, errors, options) => {
  if (rule.pattern) {
    if (rule.pattern instanceof RegExp) {
      rule.pattern.lastIndex = 0;
      if (!rule.pattern.test(value2)) {
        errors.push(
          format$1(
            options.messages.pattern.mismatch,
            rule.fullField,
            value2,
            rule.pattern
          )
        );
      }
    } else if (typeof rule.pattern === "string") {
      const _pattern = new RegExp(rule.pattern);
      if (!_pattern.test(value2)) {
        errors.push(
          format$1(
            options.messages.pattern.mismatch,
            rule.fullField,
            value2,
            rule.pattern
          )
        );
      }
    }
  }
};
const rules$1 = {
  required: required$3,
  whitespace: whitespace$1,
  type: type$3,
  range: range$1,
  enum: enumerable$3,
  pattern: pattern$4
};
const string$1 = (rule, value2, callback, source, options) => {
  const errors = [];
  const validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
  if (validate) {
    if (isEmptyValue$1(value2, "string") && !rule.required) {
      return callback();
    }
    rules$1.required(rule, value2, source, errors, options, "string");
    if (!isEmptyValue$1(value2, "string")) {
      rules$1.type(rule, value2, source, errors, options);
      rules$1.range(rule, value2, source, errors, options);
      rules$1.pattern(rule, value2, source, errors, options);
      if (rule.whitespace === true) {
        rules$1.whitespace(rule, value2, source, errors, options);
      }
    }
  }
  callback(errors);
};
const method$1 = (rule, value2, callback, source, options) => {
  const errors = [];
  const validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
  if (validate) {
    if (isEmptyValue$1(value2) && !rule.required) {
      return callback();
    }
    rules$1.required(rule, value2, source, errors, options);
    if (value2 !== void 0) {
      rules$1.type(rule, value2, source, errors, options);
    }
  }
  callback(errors);
};
const number$1 = (rule, value2, callback, source, options) => {
  const errors = [];
  const validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
  if (validate) {
    if (value2 === "") {
      value2 = void 0;
    }
    if (isEmptyValue$1(value2) && !rule.required) {
      return callback();
    }
    rules$1.required(rule, value2, source, errors, options);
    if (value2 !== void 0) {
      rules$1.type(rule, value2, source, errors, options);
      rules$1.range(rule, value2, source, errors, options);
    }
  }
  callback(errors);
};
const boolean$1 = (rule, value2, callback, source, options) => {
  const errors = [];
  const validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
  if (validate) {
    if (isEmptyValue$1(value2) && !rule.required) {
      return callback();
    }
    rules$1.required(rule, value2, source, errors, options);
    if (value2 !== void 0) {
      rules$1.type(rule, value2, source, errors, options);
    }
  }
  callback(errors);
};
const regexp$1 = (rule, value2, callback, source, options) => {
  const errors = [];
  const validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
  if (validate) {
    if (isEmptyValue$1(value2) && !rule.required) {
      return callback();
    }
    rules$1.required(rule, value2, source, errors, options);
    if (!isEmptyValue$1(value2)) {
      rules$1.type(rule, value2, source, errors, options);
    }
  }
  callback(errors);
};
const integer$1 = (rule, value2, callback, source, options) => {
  const errors = [];
  const validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
  if (validate) {
    if (isEmptyValue$1(value2) && !rule.required) {
      return callback();
    }
    rules$1.required(rule, value2, source, errors, options);
    if (value2 !== void 0) {
      rules$1.type(rule, value2, source, errors, options);
      rules$1.range(rule, value2, source, errors, options);
    }
  }
  callback(errors);
};
const floatFn$1 = (rule, value2, callback, source, options) => {
  const errors = [];
  const validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
  if (validate) {
    if (isEmptyValue$1(value2) && !rule.required) {
      return callback();
    }
    rules$1.required(rule, value2, source, errors, options);
    if (value2 !== void 0) {
      rules$1.type(rule, value2, source, errors, options);
      rules$1.range(rule, value2, source, errors, options);
    }
  }
  callback(errors);
};
const array$1 = (rule, value2, callback, source, options) => {
  const errors = [];
  const validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
  if (validate) {
    if ((value2 === void 0 || value2 === null) && !rule.required) {
      return callback();
    }
    rules$1.required(rule, value2, source, errors, options, "array");
    if (value2 !== void 0 && value2 !== null) {
      rules$1.type(rule, value2, source, errors, options);
      rules$1.range(rule, value2, source, errors, options);
    }
  }
  callback(errors);
};
const object$1 = (rule, value2, callback, source, options) => {
  const errors = [];
  const validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
  if (validate) {
    if (isEmptyValue$1(value2) && !rule.required) {
      return callback();
    }
    rules$1.required(rule, value2, source, errors, options);
    if (value2 !== void 0) {
      rules$1.type(rule, value2, source, errors, options);
    }
  }
  callback(errors);
};
const ENUM$2 = "enum";
const enumerable$2 = (rule, value2, callback, source, options) => {
  const errors = [];
  const validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
  if (validate) {
    if (isEmptyValue$1(value2) && !rule.required) {
      return callback();
    }
    rules$1.required(rule, value2, source, errors, options);
    if (value2 !== void 0) {
      rules$1[ENUM$2](rule, value2, source, errors, options);
    }
  }
  callback(errors);
};
const pattern$3 = (rule, value2, callback, source, options) => {
  const errors = [];
  const validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
  if (validate) {
    if (isEmptyValue$1(value2, "string") && !rule.required) {
      return callback();
    }
    rules$1.required(rule, value2, source, errors, options);
    if (!isEmptyValue$1(value2, "string")) {
      rules$1.pattern(rule, value2, source, errors, options);
    }
  }
  callback(errors);
};
const date$1 = (rule, value2, callback, source, options) => {
  const errors = [];
  const validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
  if (validate) {
    if (isEmptyValue$1(value2, "date") && !rule.required) {
      return callback();
    }
    rules$1.required(rule, value2, source, errors, options);
    if (!isEmptyValue$1(value2, "date")) {
      let dateObject;
      if (value2 instanceof Date) {
        dateObject = value2;
      } else {
        dateObject = new Date(value2);
      }
      rules$1.type(rule, dateObject, source, errors, options);
      if (dateObject) {
        rules$1.range(rule, dateObject.getTime(), source, errors, options);
      }
    }
  }
  callback(errors);
};
const required$2 = (rule, value2, callback, source, options) => {
  const errors = [];
  const type2 = Array.isArray(value2) ? "array" : typeof value2;
  rules$1.required(rule, value2, source, errors, options, type2);
  callback(errors);
};
const type$2 = (rule, value2, callback, source, options) => {
  const ruleType = rule.type;
  const errors = [];
  const validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
  if (validate) {
    if (isEmptyValue$1(value2, ruleType) && !rule.required) {
      return callback();
    }
    rules$1.required(rule, value2, source, errors, options, ruleType);
    if (!isEmptyValue$1(value2, ruleType)) {
      rules$1.type(rule, value2, source, errors, options);
    }
  }
  callback(errors);
};
const any$1 = (rule, value2, callback, source, options) => {
  const errors = [];
  const validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
  if (validate) {
    if (isEmptyValue$1(value2) && !rule.required) {
      return callback();
    }
    rules$1.required(rule, value2, source, errors, options);
  }
  callback(errors);
};
const validators$1 = {
  string: string$1,
  method: method$1,
  number: number$1,
  boolean: boolean$1,
  regexp: regexp$1,
  integer: integer$1,
  float: floatFn$1,
  array: array$1,
  object: object$1,
  enum: enumerable$2,
  pattern: pattern$3,
  date: date$1,
  url: type$2,
  hex: type$2,
  email: type$2,
  required: required$2,
  any: any$1
};
function newMessages$1() {
  return {
    default: "Validation error on field %s",
    required: "%s is required",
    enum: "%s must be one of %s",
    whitespace: "%s cannot be empty",
    date: {
      format: "%s date %s is invalid for format %s",
      parse: "%s date could not be parsed, %s is invalid ",
      invalid: "%s date %s is invalid"
    },
    types: {
      string: "%s is not a %s",
      method: "%s is not a %s (function)",
      array: "%s is not an %s",
      object: "%s is not an %s",
      number: "%s is not a %s",
      date: "%s is not a %s",
      boolean: "%s is not a %s",
      integer: "%s is not an %s",
      float: "%s is not a %s",
      regexp: "%s is not a valid %s",
      email: "%s is not a valid %s",
      url: "%s is not a valid %s",
      hex: "%s is not a valid %s"
    },
    string: {
      len: "%s must be exactly %s characters",
      min: "%s must be at least %s characters",
      max: "%s cannot be longer than %s characters",
      range: "%s must be between %s and %s characters"
    },
    number: {
      len: "%s must equal %s",
      min: "%s cannot be less than %s",
      max: "%s cannot be greater than %s",
      range: "%s must be between %s and %s"
    },
    array: {
      len: "%s must be exactly %s in length",
      min: "%s cannot be less than %s in length",
      max: "%s cannot be greater than %s in length",
      range: "%s must be between %s and %s in length"
    },
    pattern: {
      mismatch: "%s value %s does not match pattern %s"
    },
    clone() {
      const cloned = JSON.parse(JSON.stringify(this));
      cloned.clone = this.clone;
      return cloned;
    }
  };
}
const messages$1 = newMessages$1();
let Schema$1 = (_a = class {
  constructor(descriptor) {
    this.rules = null;
    this._messages = messages$1;
    this.define(descriptor);
  }
  define(rules2) {
    if (!rules2) {
      throw new Error("Cannot configure a schema with no rules");
    }
    if (typeof rules2 !== "object" || Array.isArray(rules2)) {
      throw new Error("Rules must be an object");
    }
    this.rules = {};
    Object.keys(rules2).forEach((name) => {
      const item = rules2[name];
      this.rules[name] = Array.isArray(item) ? item : [item];
    });
  }
  messages(messages2) {
    if (messages2) {
      this._messages = deepMerge$1(newMessages$1(), messages2);
    }
    return this._messages;
  }
  validate(source_, o2 = {}, oc = () => {
  }) {
    let source = source_;
    let options = o2;
    let callback = oc;
    if (typeof options === "function") {
      callback = options;
      options = {};
    }
    if (!this.rules || Object.keys(this.rules).length === 0) {
      if (callback) {
        callback(null, source);
      }
      return Promise.resolve(source);
    }
    function complete(results) {
      let errors = [];
      let fields = {};
      function add2(e2) {
        if (Array.isArray(e2)) {
          errors = errors.concat(...e2);
        } else {
          errors.push(e2);
        }
      }
      for (let i = 0; i < results.length; i++) {
        add2(results[i]);
      }
      if (!errors.length) {
        callback(null, source);
      } else {
        fields = convertFieldsError$1(errors);
        callback(errors, fields);
      }
    }
    if (options.messages) {
      let messages2 = this.messages();
      if (messages2 === messages$1) {
        messages2 = newMessages$1();
      }
      deepMerge$1(messages2, options.messages);
      options.messages = messages2;
    } else {
      options.messages = this.messages();
    }
    const series = {};
    const keys = options.keys || Object.keys(this.rules);
    keys.forEach((z) => {
      const arr = this.rules[z];
      let value2 = source[z];
      arr.forEach((r2) => {
        let rule = r2;
        if (typeof rule.transform === "function") {
          if (source === source_) {
            source = { ...source };
          }
          value2 = source[z] = rule.transform(value2);
        }
        if (typeof rule === "function") {
          rule = {
            validator: rule
          };
        } else {
          rule = { ...rule };
        }
        rule.validator = this.getValidationMethod(rule);
        if (!rule.validator) {
          return;
        }
        rule.field = z;
        rule.fullField = rule.fullField || z;
        rule.type = this.getType(rule);
        series[z] = series[z] || [];
        series[z].push({
          rule,
          value: value2,
          source,
          field: z
        });
      });
    });
    const errorFields = {};
    return asyncMap$1(
      series,
      options,
      (data, doIt) => {
        var _a2;
        const rule = data.rule;
        let deep = (rule.type === "object" || rule.type === "array") && (typeof rule.fields === "object" || typeof rule.defaultField === "object");
        deep = deep && (rule.required || !rule.required && data.value);
        rule.field = data.field;
        function addFullField(key, schema) {
          return {
            ...schema,
            fullField: `${rule.fullField}.${key}`,
            fullFields: rule.fullFields ? [...rule.fullFields, key] : [key]
          };
        }
        function cb(e2 = []) {
          let errorList = Array.isArray(e2) ? e2 : [e2];
          if (!options.suppressWarning && errorList.length) {
            _a.warning("async-validator:", errorList);
          }
          if (errorList.length && rule.message !== void 0) {
            errorList = [].concat(rule.message);
          }
          let filledErrors = errorList.map(complementError$1(rule, source));
          if (options.first && filledErrors.length) {
            errorFields[rule.field] = 1;
            return doIt(filledErrors);
          }
          if (!deep) {
            doIt(filledErrors);
          } else {
            if (rule.required && !data.value) {
              if (rule.message !== void 0) {
                filledErrors = [].concat(rule.message).map(complementError$1(rule, source));
              } else if (options.error) {
                filledErrors = [
                  options.error(
                    rule,
                    format$1(options.messages.required, rule.field)
                  )
                ];
              }
              return doIt(filledErrors);
            }
            let fieldsSchema = {};
            if (rule.defaultField) {
              Object.keys(data.value).map((key) => {
                fieldsSchema[key] = rule.defaultField;
              });
            }
            fieldsSchema = {
              ...fieldsSchema,
              ...data.rule.fields
            };
            const paredFieldsSchema = {};
            Object.keys(fieldsSchema).forEach((field) => {
              const fieldSchema = fieldsSchema[field];
              const fieldSchemaList = Array.isArray(fieldSchema) ? fieldSchema : [fieldSchema];
              paredFieldsSchema[field] = fieldSchemaList.map(
                addFullField.bind(null, field)
              );
            });
            const schema = new _a(paredFieldsSchema);
            schema.messages(options.messages);
            if (data.rule.options) {
              data.rule.options.messages = options.messages;
              data.rule.options.error = options.error;
            }
            schema.validate(data.value, data.rule.options || options, (errs) => {
              const finalErrors = [];
              if (filledErrors && filledErrors.length) {
                finalErrors.push(...filledErrors);
              }
              if (errs && errs.length) {
                finalErrors.push(...errs);
              }
              doIt(finalErrors.length ? finalErrors : null);
            });
          }
        }
        let res;
        if (rule.asyncValidator) {
          res = rule.asyncValidator(rule, data.value, cb, data.source, options);
        } else if (rule.validator) {
          try {
            res = rule.validator(rule, data.value, cb, data.source, options);
          } catch (error2) {
            (_a2 = console.error) == null ? void 0 : _a2.call(console, error2);
            if (!options.suppressValidatorError) {
              setTimeout(() => {
                throw error2;
              }, 0);
            }
            cb(error2.message);
          }
          if (res === true) {
            cb();
          } else if (res === false) {
            cb(
              typeof rule.message === "function" ? rule.message(rule.fullField || rule.field) : rule.message || `${rule.fullField || rule.field} fails`
            );
          } else if (res instanceof Array) {
            cb(res);
          } else if (res instanceof Error) {
            cb(res.message);
          }
        }
        if (res && res.then) {
          res.then(
            () => cb(),
            (e2) => cb(e2)
          );
        }
      },
      (results) => {
        complete(results);
      },
      source
    );
  }
  getType(rule) {
    if (rule.type === void 0 && rule.pattern instanceof RegExp) {
      rule.type = "pattern";
    }
    if (typeof rule.validator !== "function" && rule.type && !validators$1.hasOwnProperty(rule.type)) {
      throw new Error(format$1("Unknown rule type %s", rule.type));
    }
    return rule.type || "string";
  }
  getValidationMethod(rule) {
    if (typeof rule.validator === "function") {
      return rule.validator;
    }
    const keys = Object.keys(rule);
    const messageIndex = keys.indexOf("message");
    if (messageIndex !== -1) {
      keys.splice(messageIndex, 1);
    }
    if (keys.length === 1 && keys[0] === "required") {
      return validators$1.required;
    }
    return validators$1[this.getType(rule)] || void 0;
  }
}, _a.register = function register(type2, validator) {
  if (typeof validator !== "function") {
    throw new Error(
      "Cannot register a validator by type, validator is not a function"
    );
  }
  validators$1[type2] = validator;
}, _a.warning = warning$1, _a.messages = messages$1, _a.validators = validators$1, _a);
const useFormItemOperation$1 = (props2, slots) => {
  const formContext = inject(formContextKey$1, void 0);
  let initialValue = void 0;
  let isResettingField = false;
  const validateState = ref("");
  const validateStateDebounced = ref("");
  const validateMessage = ref("");
  const hasLabel = computed(() => {
    return !!(props2.label || slots.label);
  });
  const currentLabel = computed(
    () => `${props2.label || ""}${(formContext == null ? void 0 : formContext.labelSuffix) || ""}`
  );
  const fieldValue = computed(() => {
    const model = formContext == null ? void 0 : formContext.model;
    if (!model || !props2.prop) {
      return;
    }
    return getProp$1(model, props2.prop).value;
  });
  const propString = computed(() => {
    if (!props2.prop)
      return "";
    return isString(props2.prop) ? props2.prop : props2.prop.join(".");
  });
  const normalizedRules = computed(() => {
    const rules2 = [];
    if (props2.rules)
      rules2.push(...castArray$1(props2.rules));
    const formRules = formContext == null ? void 0 : formContext.rules;
    if (formRules && props2.prop) {
      const _rules = getProp$1(
        formRules,
        props2.prop
      ).value;
      if (_rules)
        rules2.push(...castArray$1(_rules));
    }
    if (props2.required !== void 0) {
      const requiredRules = rules2.map((rule, index2) => [rule, index2]).filter(([rule]) => Object.keys(rule).includes("required"));
      if (requiredRules.length) {
        for (const [rule, index2] of requiredRules) {
          if (rule.required === props2.required)
            continue;
          rules2[index2] = { ...rule, required: props2.required };
        }
      } else {
        rules2.push({ required: props2.required });
      }
    }
    return rules2;
  });
  const validateEnabled = computed(() => normalizedRules.value.length > 0);
  const isRequired = computed(
    () => normalizedRules.value.some((rule) => rule.required)
  );
  const shouldShowError = computed(
    () => validateStateDebounced.value === "error" && props2.showMessage && isEmptyVariableInDefault$1(formContext == null ? void 0 : formContext.showMessage, true)
  );
  const setValidateState = (state) => {
    validateState.value = state;
  };
  const getFilterRule = (trigger2) => {
    const rules2 = normalizedRules.value;
    return rules2.filter((rule) => {
      if (!rule.trigger || !trigger2)
        return true;
      if (Array.isArray(rule.trigger)) {
        return rule.trigger.includes(trigger2);
      } else {
        return rule.trigger === trigger2;
      }
    }).map(({ trigger: trigger22, ...rule }) => rule);
  };
  const onValidationFailed = (error2) => {
    var _a2;
    const { errors, fields } = error2;
    if (!errors || !fields) {
      console.error(error2);
    }
    setValidateState("error");
    validateMessage.value = errors ? isEmptyVariableInDefault$1((_a2 = errors == null ? void 0 : errors[0]) == null ? void 0 : _a2.message, `${props2.prop} 为必填项`) : "";
    formContext == null ? void 0 : formContext.emits("validate", props2.prop, false, validateMessage.value);
  };
  const onValidationSucceded = () => {
    setValidateState("success");
    validateMessage.value = "";
    formContext == null ? void 0 : formContext.emits("validate", props2.prop, true, "");
  };
  const doValidate = async (rules2) => {
    const modelName = propString.value;
    const validator = new Schema$1({
      [modelName]: rules2
    });
    return validator.validate({ [modelName]: fieldValue.value }, { firstFields: true }).then(() => {
      onValidationSucceded();
      return true;
    }).catch((err) => {
      onValidationFailed(err);
      return Promise.reject(err);
    });
  };
  const validate = async (trigger2, callback) => {
    if (isResettingField || !props2.prop)
      return false;
    const hasCallback2 = isFunction(callback);
    if (!validateEnabled.value) {
      callback == null ? void 0 : callback(false);
      return false;
    }
    const rules2 = getFilterRule(trigger2);
    if (rules2.length === 0) {
      callback == null ? void 0 : callback(true);
      return true;
    }
    setValidateState("validating");
    return doValidate(rules2).then(() => {
      callback == null ? void 0 : callback(true);
      return true;
    }).catch((err) => {
      const { fields } = err;
      callback == null ? void 0 : callback(false, fields);
      return hasCallback2 ? false : Promise.reject(fields);
    });
  };
  const clearValidate = () => {
    setValidateState("");
    validateMessage.value = "";
    isResettingField = false;
  };
  const resetField = async () => {
    const model = formContext == null ? void 0 : formContext.model;
    if (!model || !props2.prop)
      return;
    const computedValue = getProp$1(model, props2.prop);
    isResettingField = true;
    computedValue.value = cloneDeep$1(initialValue);
    await nextTick$1();
    clearValidate();
    isResettingField = false;
  };
  const initFieldValue = () => {
    initialValue = cloneDeep$1(fieldValue.value);
  };
  const validateStateDebouncedUpdater = debounce$1(() => {
    validateStateDebounced.value = validateState.value;
  }, 100);
  watch(
    () => validateState.value,
    () => validateStateDebouncedUpdater()
  );
  watch(
    () => props2.error,
    (val) => {
      validateMessage.value = val || "";
      setValidateState(val ? "error" : "");
    },
    {
      immediate: true
    }
  );
  watch(
    () => props2.validateStatus,
    (val) => {
      setValidateState(val || "");
    }
  );
  return {
    formContext,
    hasLabel,
    currentLabel,
    validateState,
    validateMessage,
    isRequired,
    shouldShowError,
    doValidate,
    validate,
    clearValidate,
    resetField,
    initFieldValue
  };
};
const filterFields$1 = (fields, props2) => {
  const normalized = castArray$1(props2);
  return normalized.length > 0 ? fields.filter((field) => field.prop && normalized.includes(field.prop)) : fields;
};
const useForm$1 = (props2) => {
  const fields = [];
  const addField = (field) => {
    fields.push(field);
  };
  const removeField = (field) => {
    if (field.prop) {
      fields.splice(fields.indexOf(field), 1);
    }
  };
  const resetFields = (properties = []) => {
    if (!props2.model) {
      return console.warn("[TnForm] model参数未定义");
    }
    filterFields$1(fields, properties).forEach((field) => field.resetField());
  };
  const clearValidate = (props22 = []) => {
    filterFields$1(fields, props22).forEach((field) => field.clearValidate());
  };
  const isValidatable = computed(() => {
    const hasModel = !!props2.model;
    if (!hasModel) {
      console.warn("[TnForm] model参数未定义");
    }
    return hasModel;
  });
  const obtainValidateFields = (props22) => {
    if (fields.length === 0)
      return [];
    const filteredFields = filterFields$1(fields, props22);
    if (!filteredFields.length) {
      console.warn("[TnForm] 未找到需要校验的字段");
      return [];
    }
    return filteredFields;
  };
  const validate = async (callback) => validateField(void 0, callback);
  const doValidateField = async (props22) => {
    if (!isValidatable.value)
      return false;
    const fields2 = obtainValidateFields(props22);
    if (fields2.length === 0)
      return false;
    let validationErrors = {};
    for (const field of fields2) {
      try {
        await field.validate("");
      } catch (fields3) {
        validationErrors = {
          ...validationErrors,
          ...fields3
        };
      }
    }
    if (Object.keys(validationErrors).length === 0)
      return true;
    return Promise.reject(validationErrors);
  };
  const validateField = async (modelProps = [], callback) => {
    const shouldThrow = !isFunction(callback);
    try {
      const result = await doValidateField(modelProps);
      if (result === true) {
        callback == null ? void 0 : callback(true);
      }
      return result;
    } catch (e2) {
      if (e2 instanceof Error)
        throw e2;
      const invalidFields = e2;
      callback == null ? void 0 : callback(false, invalidFields);
      return shouldThrow && Promise.reject(invalidFields);
    }
  };
  return {
    addField,
    removeField,
    resetFields,
    clearValidate,
    validate,
    validateField
  };
};
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "form",
  props: formProps$1,
  emits: formEmits$1,
  setup(__props, { expose: __expose, emit: __emit }) {
    const props2 = __props;
    const emits = __emit;
    const { formClass } = useFormCustomStyle$1();
    const {
      addField,
      removeField,
      resetFields,
      clearValidate,
      validate,
      validateField
    } = useForm$1(props2);
    watch(
      () => props2.rules,
      () => {
        if (props2.validateOnRuleChange)
          validate();
      },
      {
        deep: true
      }
    );
    provide(
      formContextKey$1,
      reactive({
        ...toRefs(props2),
        emits,
        resetFields,
        clearValidate,
        validateField,
        addField,
        removeField
      })
    );
    __expose({
      /**
       * @description 对整个表单的内容进行验证。 接收一个回调函数或返回Promise
       */
      validate,
      /**
       * @description 验证具体的某个字段
       */
      validateField,
      /**
       * @description 重置表单
       */
      resetFields,
      /**
       * @description 清除表单验证
       */
      clearValidate
    });
    return (_ctx, _cache) => {
      return {
        a: n(unref(formClass)),
        b: gei(_ctx, "")
      };
    };
  }
});
const Form$1 = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-b2b814ec"]]);
const formItemValidateStates$1 = [
  "",
  "error",
  "validating",
  "success"
];
const formItemProps$1 = buildProps$1({
  /**
   * @description label文本
   */
  label: String,
  /**
   * @description label的宽度，默认单位为rpx，支持传入数字和auto
   */
  labelWidth: {
    type: [String, Number],
    default: ""
  },
  /**
   * @description label标签位置
   */
  labelPosition: {
    type: String,
    values: ["left", "right", "top"],
    default: ""
  },
  /**
   * @description model中的key，如果需要使用校验，该字段为必填，可以是一个路径数组(['user', 'name', 0])
   */
  prop: {
    type: definePropType$1([String, Array])
  },
  /**
   * @description 标记字段是否为必填，如果不填写则根据校验规则自动生成
   */
  required: {
    type: Boolean,
    default: void 0
  },
  /**
   * @description 表单校验规则
   */
  rules: {
    type: definePropType$1([Object, Array])
  },
  /**
   * @description 字段错误信息，如果设置了该字段则校验状态会变成error，并显示该字段的内容
   */
  error: String,
  /**
   * @description 校验状态
   */
  validateStatus: {
    type: String,
    values: formItemValidateStates$1
  },
  /**
   * @description 是否显示校验结果
   */
  showMessage: {
    type: Boolean,
    default: true
  },
  /**
   * @description 控制表单组件尺寸
   */
  size: {
    type: String,
    values: formComponentSizes$1
  }
});
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "form-item",
  props: formItemProps$1,
  setup(__props, { expose: __expose }) {
    const props2 = __props;
    const slots = useSlots();
    const {
      formContext,
      validateState,
      validateMessage,
      hasLabel,
      currentLabel,
      shouldShowError,
      isRequired,
      resetField,
      clearValidate,
      validate,
      initFieldValue
    } = useFormItemOperation$1(props2, slots);
    const {
      ns: formItemNs,
      labelId,
      formItemClass,
      formItemLabelClass,
      formItemLabelStyle,
      formItemErrorMessageStyle,
      initLabelContainerWidth
    } = useFormItemCustomStyle$1(props2, hasLabel, isRequired);
    const _size = useFormSize$1(void 0, { formItem: false });
    const context = reactive({
      ...toRefs(props2),
      size: _size,
      validateState,
      hasLabel,
      resetField,
      clearValidate,
      validate
    });
    onMounted(() => {
      if (props2.prop) {
        formContext == null ? void 0 : formContext.addField(context);
        initFieldValue();
      }
      nextTick$1(() => {
        initLabelContainerWidth();
      });
    });
    onBeforeUnmount(() => {
      formContext == null ? void 0 : formContext.removeField(context);
    });
    provide(formItemContextKey$1, context);
    __expose({
      /**
       * @description 表单尺寸
       */
      size: _size,
      /**
       * @description 校验信息
       */
      validateMessage,
      /**
       * @description 校验状态
       */
      validateState,
      /**
       * @description 对表单Item的内容进行验证。 接收一个回调函数或返回Promise
       */
      validate,
      /**
       * @description 重置当前字段信息
       */
      resetField,
      /**
       * @description 清除表单字段验证
       */
      clearValidate
    });
    return (_ctx, _cache) => {
      return e({
        a: unref(hasLabel)
      }, unref(hasLabel) ? {
        b: t(unref(currentLabel)),
        c: unref(labelId),
        d: n(unref(formItemLabelClass)),
        e: s(unref(formItemLabelStyle))
      } : {}, {
        f: n(unref(formItemNs).e("content")),
        g: n(unref(formItemNs).e("wrapper")),
        h: unref(shouldShowError)
      }, unref(shouldShowError) ? {
        i: t(unref(validateMessage)),
        j: n(unref(formItemNs).e("error-message")),
        k: s(unref(formItemErrorMessageStyle))
      } : {}, {
        l: n(unref(formItemClass)),
        m: gei(_ctx, "")
      });
    };
  }
});
const FormItem$1 = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-944bef13"]]);
withInstall$1(Form$1, {
  FormItem: FormItem$1
});
withNoopInstall$1(FormItem$1);
const isJsonString$1 = (value2) => {
  if (typeof value2 == "string") {
    try {
      const obj = JSON.parse(value2);
      if (typeof obj == "object" && obj) {
        return true;
      } else {
        return false;
      }
    } catch (e2) {
      return false;
    }
  }
  return false;
};
function useUploadHandleFunction$1(props2) {
  const chooseImage = (count) => {
    return new Promise((resolve2, reject) => {
      index$1.chooseImage({
        count,
        sizeType: props2.sizeType,
        // extension: props.extensions,
        sourceType: props2.sourceType,
        success: (res) => {
          resolve2(isArray$1(res.tempFiles) ? res.tempFiles : [res.tempFiles]);
        },
        fail: (err) => {
          reject(err);
        }
      });
    });
  };
  const uploading = ref(false);
  watch(
    () => uploading.value,
    (val) => {
      if (props2.showErrorTips) {
        if (val)
          index$1.showLoading({ title: "上传中" });
        else
          index$1.hideLoading();
      }
    }
  );
  const uploadProcess = (item) => {
    const { customUploadHandler, customUploadCallback } = props2;
    if (uploading.value)
      return Promise.reject("有文件正在上传");
    return new Promise((resolve2, reject) => {
      if (customUploadHandler) {
        const uploadHandlerResult = customUploadHandler(item.file);
        const isUploadHandlePromiseOrString = [
          isPromise(uploadHandlerResult),
          isString(uploadHandlerResult)
        ].includes(true);
        if (!isUploadHandlePromiseOrString) {
          console.error(
            "[TnImageUpload]自定义上传处理函数必须返回Promise和String"
          );
          reject("自定义上传处理函数必须返回Promise和String");
          return;
        }
        uploading.value = true;
        item.status = "uploading";
        if (isPromise(uploadHandlerResult)) {
          uploadHandlerResult.then((res) => {
            if (res) {
              item.url = res;
              resolve2(true);
            } else {
              resolve2(false);
            }
          }).catch((err) => {
            console.error("[TnImageUpload]上传文件发生错误", err);
            reject((err == null ? void 0 : err.errMsg) || "上传文件发生错误");
          }).finally(() => {
            uploading.value = false;
          });
        } else {
          if (uploadHandlerResult) {
            item.url = uploadHandlerResult;
            resolve2(true);
          } else {
            resolve2(false);
          }
          uploading.value = false;
        }
      } else {
        uploading.value = true;
        item.status = "uploading";
        const task = index$1.uploadFile({
          url: props2.action,
          filePath: item.url,
          name: props2.name,
          formData: props2.formData,
          header: props2.header,
          success: (res) => {
            if (customUploadCallback) {
              const customUploadCallbackResult = customUploadCallback(res);
              const isCustomUploadCallbackPromiseOrString = [
                isPromise(customUploadCallbackResult),
                isString(customUploadCallbackResult)
              ].includes(true);
              if (!isCustomUploadCallbackPromiseOrString) {
                console.error(
                  "[TnImageUpload]自定义上传回调函数必须返回Promise和String"
                );
                reject("自定义上传回调函数必须返回Promise和String");
                return;
              }
              if (isPromise(customUploadCallbackResult)) {
                customUploadCallbackResult.then((res2) => {
                  if (res2) {
                    item.url = res2;
                    resolve2(true);
                  } else {
                    resolve2(false);
                  }
                }).catch((err) => {
                  console.error("[TnImageUpload]上传文件发生错误", err);
                  reject((err == null ? void 0 : err.errMsg) || "上传文件发生错误");
                });
              } else {
                if (customUploadCallbackResult) {
                  item.url = customUploadCallbackResult;
                  resolve2(true);
                } else {
                  resolve2(false);
                }
              }
            } else {
              const { statusCode, data: resData } = res;
              if (![200, 201, 204].includes(statusCode)) {
                console.error("[TnImageUpload]上传文件发生错误", res);
                reject((res == null ? void 0 : res.errMsg) || "上传文件发生错误");
                return;
              } else {
                const data = isJsonString$1(resData) ? JSON.parse(resData) : resData;
                if (data.code === 200 && data.data.errCode === 0) {
                  item.url = data.data.url;
                  resolve2(true);
                } else {
                  console.error("[TnImageUpload]上传文件发生错误", res);
                  reject(
                    isEmptyVariableInDefault$1(
                      data == null ? void 0 : data.message,
                      (data == null ? void 0 : data.msg) || "上传文件发生错误"
                    )
                  );
                }
              }
            }
          },
          fail: (err) => {
            console.error("[TnImageUpload]上传文件发生错误", err);
            reject((err == null ? void 0 : err.errMsg) || "上传文件发生错误");
          },
          complete: () => {
            uploading.value = false;
            resolve2(true);
          }
        });
        item.uploadTask = task;
        task.onProgressUpdate((res) => {
          if (res.progress > 0) {
            item.progress = res.progress;
          }
        });
      }
    });
  };
  const checkFileSizeAndExtension = (files) => {
    const { extensions, maxSize } = props2;
    const extReg = /.+\./;
    return files.filter((item) => {
      let fileExt = "";
      fileExt = item.path.replace(extReg, "").toLowerCase();
      return !extensions.some((ext) => ext.toLowerCase() === fileExt) || item.size > maxSize;
    });
  };
  const showErrorTips = (msg) => {
    if (!props2.showErrorTips)
      return;
    index$1.showToast({
      icon: "none",
      title: msg
    });
  };
  return {
    chooseImage,
    uploadProcess,
    checkFileSizeAndExtension,
    showErrorTips
  };
}
const useImageUpload$1 = (props2) => {
  const { emit: emit2 } = getCurrentInstance();
  const {
    chooseImage,
    uploadProcess,
    checkFileSizeAndExtension,
    showErrorTips
  } = useUploadHandleFunction$1(props2);
  const { formItem } = useFormItem$1();
  const fileList = ref([]);
  let isInnerUpdate = false;
  watch(
    () => props2.modelValue,
    (val) => {
      if (isInnerUpdate) {
        isInnerUpdate = false;
        return;
      }
      fileList.value = val.map((item) => ({
        url: item,
        status: "done",
        progress: 100
      }));
    },
    {
      immediate: true
    }
  );
  const isExceedMaxCount = computed(
    () => fileList.value.length >= props2.limit
  );
  const currentRemainFileCount = computed(() => {
    if (props2.multiple) {
      return props2.limit - fileList.value.length;
    } else {
      return props2.limit - fileList.value.length > 0 ? 1 : 0;
    }
  });
  const chooseFile = async () => {
    const { disabled, action, customUploadHandler } = props2;
    if (disabled)
      return;
    if (!action && !customUploadHandler) {
      showErrorTips("请设置action或者自定义图片上传处理函数");
      debugWarn$1("TnImageUpload", "请设置action或者自定义图片上传处理函数");
      return;
    }
    const prevUploadedFileCount = fileList.value.length;
    chooseImage(currentRemainFileCount.value).then((res) => {
      let selectFile = res;
      const checkFailFiles = checkFileSizeAndExtension(selectFile);
      if (checkFailFiles.length) {
        showErrorTips("文件格式或大小不符合要求");
        emit2("oversizeOrNoSupport", checkFailFiles);
        selectFile = selectFile.filter(
          (item) => !checkFailFiles.includes(item)
        );
      }
      fileList.value.push(
        ...selectFile.map((item) => {
          const url2 = item.path;
          return {
            url: url2,
            status: "ready",
            progress: 0,
            file: item
          };
        })
      );
      if (props2.autoUpload && selectFile.length)
        uploadFile(prevUploadedFileCount);
    }).catch((err) => {
      debugWarn$1("TnImageUpload", `选择图片失败: ${err}`);
      showErrorTips((err == null ? void 0 : err.errMsg) || "选择图片失败");
    });
  };
  const handleUploadEvent = (item, index2, uploadSingle = false) => {
    uploadProcess(item).then((res) => {
      if (res) {
        handleUploadSuccess(item);
      } else {
        handleUploadError(item, "上传失败");
      }
    }).catch((err) => {
      handleUploadError(item, err);
    }).finally(() => {
      if (!uploadSingle)
        uploadFile(index2 + 1);
    });
  };
  const uploadFile = (startIndex, uploadSingle = false) => {
    const { autoUpload, beforeUpload } = props2;
    const autoNextUpload = autoUpload && !uploadSingle;
    if (startIndex >= fileList.value.length) {
      if (props2.autoRemoveFaildFile)
        handleUploadCompleteFailFile();
      return;
    }
    const fileItem = fileList.value[startIndex];
    if (fileItem.progress === 100) {
      fileItem.status = "done";
      fileItem.uploadTask = void 0;
      if (autoNextUpload)
        uploadFile(startIndex + 1);
      return;
    }
    if (!beforeUpload) {
      handleUploadEvent(fileItem, startIndex, uploadSingle);
      return;
    }
    const shouldUpload = beforeUpload(fileItem.file);
    const isBeforeUploadPromiseOrBoolean = [
      isPromise(shouldUpload),
      isBoolean$1(shouldUpload)
    ].includes(true);
    if (!isBeforeUploadPromiseOrBoolean) {
      throwError$1(
        "[TnImageUpload]",
        "beforeUpload返回值必须是Promise或者Boolean"
      );
    }
    if (isPromise(shouldUpload)) {
      shouldUpload.then((res) => {
        if (res)
          handleUploadEvent(fileItem, startIndex, uploadSingle);
        else {
          removeFile(startIndex);
          if (autoNextUpload)
            uploadFile(startIndex);
        }
      }).catch((err) => {
        debugWarn$1("TnImageUpload", `beforeUpload出错: ${err}`);
        fileItem.status = "failed";
      });
    } else {
      if (shouldUpload)
        handleUploadEvent(fileItem, startIndex, uploadSingle);
      else {
        removeFile(startIndex);
        if (autoNextUpload)
          uploadFile(startIndex);
      }
    }
  };
  const getUploadSuceesFileUrlValue = () => {
    return fileList.value.filter((item) => item.status === "done").map((item) => item.url);
  };
  const uploadSuccessFileListChange = () => {
    isInnerUpdate = true;
    const value2 = getUploadSuceesFileUrlValue();
    emit2(UPDATE_MODEL_EVENT$1, value2);
    nextTick$1(() => {
      var _a2;
      emit2(CHANGE_EVENT$1, value2);
      if (props2.validateEvent) {
        (_a2 = formItem == null ? void 0 : formItem.validate) == null ? void 0 : _a2.call(formItem, "change").catch((err) => {
          debugWarn$1(err);
        });
      }
    });
  };
  const handleUploadSuccess = (item) => {
    item.status = "done";
    item.progress = 100;
    item.uploadTask = void 0;
    item.file = void 0;
    emit2("success", item);
    uploadSuccessFileListChange();
  };
  const handleUploadError = (item, errorMsg) => {
    item.status = "failed";
    item.progress = 0;
    item.uploadTask = void 0;
    item.file = void 0;
    showErrorTips(errorMsg);
    emit2("fail", new Error(errorMsg), item);
  };
  const handleUploadCompleteFailFile = () => {
    const tempFileList = [...fileList.value];
    tempFileList.forEach((item, index2) => {
      if (item.status === "failed") {
        removeFile(index2);
      }
    });
  };
  const retryUploadFile = (index2) => {
    const fileItem = fileList.value[index2];
    fileItem.status = "ready";
    fileItem.progress = 0;
    uploadFile(index2, true);
  };
  const retryAllUpload = () => {
    const firstFailedFileIndex = fileList.value.findIndex(
      (item) => item.status === "failed"
    );
    uploadFile(firstFailedFileIndex);
  };
  const customUploadHandle = () => {
    if (!fileList.value.length)
      return;
    uploadFile(0);
  };
  const removeFile = (index2) => {
    const fileItem = fileList.value[index2];
    if (fileItem.status === "uploading" && fileItem.uploadTask && fileItem.progress > 0 && fileItem.progress < 100) {
      fileItem.uploadTask.abort();
    }
    fileList.value.splice(index2, 1);
    if (fileItem.status === "done") {
      emit2("remove", fileItem.url);
      uploadSuccessFileListChange();
    }
  };
  const removeFileEvent = (index2) => {
    const { disabled, beforeRemove } = props2;
    if (disabled)
      return;
    const fileItem = fileList.value[index2];
    if (!fileItem)
      return;
    index$1.showModal({
      title: "操作提示",
      content: "确认需要移除该图片吗?",
      showCancel: true,
      cancelText: "取 消",
      confirmText: "确 认",
      success: (res) => {
        if (res.confirm) {
          if (!beforeRemove) {
            removeFile(index2);
            return;
          }
          const shouldRemove = beforeRemove(fileItem);
          const isShouldRemovePromiseOrBoolean = [
            isPromise(shouldRemove),
            isBoolean$1(shouldRemove)
          ].includes(true);
          if (!isShouldRemovePromiseOrBoolean) {
            throwError$1(
              "[TnImageUpload]",
              "beforeRemove返回值必须是Promise或者Boolean"
            );
          }
          if (isPromise(shouldRemove)) {
            shouldRemove.then((res2) => {
              if (res2)
                removeFile(index2);
            }).catch((err) => {
              debugWarn$1("TnImageUpload", `beforeRemove出错: ${err}`);
            });
          } else {
            if (shouldRemove)
              removeFile(index2);
          }
        }
      }
    });
  };
  const clearAllFile = () => {
    fileList.value.forEach((item) => {
      if (item.status === "uploading" && item.uploadTask && item.progress > 0 && item.progress < 100) {
        item.uploadTask.abort();
      }
    });
    fileList.value = [];
    uploadSuccessFileListChange();
  };
  const previewImage2 = (index2) => {
    const previewImageList = fileList.value.filter((item) => item.status === "done").map((item) => item.url);
    index$1.previewImage({
      current: index2,
      urls: previewImageList
    });
    emit2("preview", previewImageList[index2]);
  };
  return {
    fileList,
    isExceedMaxCount,
    chooseFile,
    retryUploadFile,
    retryAllUpload,
    customUploadHandle,
    removeFileEvent,
    clearAllFile,
    previewImage: previewImage2
  };
};
const props$c = defineMixin({
  props: {
    // 主题颜色
    type: {
      type: String,
      default: () => defProps.text.type
    },
    // 是否显示
    show: {
      type: Boolean,
      default: () => defProps.text.show
    },
    // 显示的值
    text: {
      type: [String, Number],
      default: () => defProps.text.text
    },
    // 前置图标
    prefixIcon: {
      type: String,
      default: () => defProps.text.prefixIcon
    },
    // 后置图标
    suffixIcon: {
      type: String,
      default: () => defProps.text.suffixIcon
    },
    // 文本处理的匹配模式
    // text-普通文本，price-价格，phone-手机号，name-姓名，date-日期，link-超链接
    mode: {
      type: String,
      default: () => defProps.text.mode
    },
    // mode=link下，配置的链接
    href: {
      type: String,
      default: () => defProps.text.href
    },
    // 格式化规则
    format: {
      type: [String, Function],
      default: () => defProps.text.format
    },
    // mode=phone时，点击文本是否拨打电话
    call: {
      type: Boolean,
      default: () => defProps.text.call
    },
    // 小程序的打开方式
    openType: {
      type: String,
      default: () => defProps.text.openType
    },
    // 是否粗体，默认normal
    bold: {
      type: Boolean,
      default: () => defProps.text.bold
    },
    // 是否块状
    block: {
      type: Boolean,
      default: () => defProps.text.block
    },
    // 文本显示的行数，如果设置，超出此行数，将会显示省略号
    lines: {
      type: [String, Number],
      default: () => defProps.text.lines
    },
    // 文本颜色
    color: {
      type: String,
      default: () => defProps.text.color
    },
    // 字体大小
    size: {
      type: [String, Number],
      default: () => defProps.text.size
    },
    // 图标的样式
    iconStyle: {
      type: [Object, String],
      default: () => defProps.text.iconStyle
    },
    // 文字装饰，下划线，中划线等，可选值 none|underline|line-through
    decoration: {
      tepe: String,
      default: () => defProps.text.decoration
    },
    // 外边距，对象、字符串，数值形式均可
    margin: {
      type: [Object, String, Number],
      default: () => defProps.text.margin
    },
    // 文本行高
    lineHeight: {
      type: [String, Number],
      default: () => defProps.text.lineHeight
    },
    // 文本对齐方式，可选值left|center|right
    align: {
      type: String,
      default: () => defProps.text.align
    },
    // 文字换行，可选值break-word|normal|anywhere
    wordWrap: {
      type: String,
      default: () => defProps.text.wordWrap
    },
    // 占满剩余空间
    flex1: {
      type: Boolean,
      default: () => defProps.text.flex1
    }
  }
});
const value = {
  computed: {
    // 经处理后需要显示的值
    value() {
      const {
        text,
        mode,
        format: format2,
        href
      } = this;
      if (mode === "price") {
        if (!/^\d+(\.\d+)?$/.test(text)) {
          error("金额模式下，text参数需要为金额格式");
        }
        if (test.func(format2)) {
          return format2(text);
        }
        return priceFormat(text, 2);
      }
      if (mode === "date") {
        !test.date(text) && error("日期模式下，text参数需要为日期或时间戳格式");
        if (test.func(format2)) {
          return format2(text);
        }
        if (format2) {
          return timeFormat(text, format2);
        }
        return timeFormat(text, "yyyy-mm-dd");
      }
      if (mode === "phone") {
        if (test.func(format2)) {
          return format2(text);
        }
        if (format2 === "encrypt") {
          return `${text.substr(0, 3)}****${text.substr(7)}`;
        }
        return text;
      }
      if (mode === "name") {
        !(typeof text === "string") && error("姓名模式下，text参数需要为字符串格式");
        if (test.func(format2)) {
          return format2(text);
        }
        if (format2 === "encrypt") {
          return this.formatName(text);
        }
        return text;
      }
      if (mode === "link") {
        !test.url(href) && error("超链接模式下，href参数需要为URL格式");
        return text;
      }
      return text;
    }
  },
  methods: {
    // 默认的姓名脱敏规则
    formatName(name) {
      let value2 = "";
      if (name.length === 2) {
        value2 = name.substr(0, 1) + "*";
      } else if (name.length > 2) {
        let char = "";
        for (let i = 0, len = name.length - 2; i < len; i++) {
          char += "*";
        }
        value2 = name.substr(0, 1) + char + name.substr(-1, 1);
      } else {
        value2 = name;
      }
      return value2;
    }
  }
};
const props$b = defineMixin({
  props: {
    color: {
      type: String,
      default: () => defProps.line.color
    },
    // 长度，竖向时表现为高度，横向时表现为长度，可以为百分比，带px单位的值等
    length: {
      type: [String, Number],
      default: () => defProps.line.length
    },
    // 线条方向，col-竖向，row-横向
    direction: {
      type: String,
      default: () => defProps.line.direction
    },
    // 是否显示细边框
    hairline: {
      type: Boolean,
      default: () => defProps.line.hairline
    },
    // 线条与上下左右元素的间距，字符串形式，如"30px"、"20px 30px"
    margin: {
      type: [String, Number],
      default: () => defProps.line.margin
    },
    // 是否虚线，true-虚线，false-实线
    dashed: {
      type: Boolean,
      default: () => defProps.line.dashed
    }
  }
});
const props$a = defineMixin({
  props: {
    // 是否开启顶部安全区适配
    safeAreaInsetTop: {
      type: Boolean,
      default: () => true
    },
    // 是否固定在顶部
    fixed: {
      type: Boolean,
      default: () => true
    },
    // 左边的图标
    leftIcon: {
      type: String,
      default: "arrow-leftward"
    },
    // 背景颜色
    bgColor: {
      type: String,
      default: () => "rgba(0,0,0,.15)"
    },
    // 导航栏高度
    height: {
      type: [String, Number],
      default: () => "32px"
    },
    // 图标的大小
    iconSize: {
      type: [String, Number],
      default: "20px"
    },
    // 图标的颜色
    iconColor: {
      type: String,
      default: "#fff"
    },
    // 点击左侧区域(返回图标)，是否自动返回上一页
    autoBack: {
      type: Boolean,
      default: () => true
    },
    // 首页路径
    homeUrl: {
      type: [String],
      default: ""
    }
  }
});
const updateUserInfoPopupProps = buildProps$1({
  /**
   * @description 控制弹框显示、隐藏
   */
  show: {
    type: Boolean,
    default: false
  },
  /**
   * @description 用户头像地址
   */
  avatar: {
    type: String,
    default: ""
  },
  /**
   * @description 用户昵称
   */
  nickname: {
    type: String,
    default: ""
  },
  /**
   * @description 弹框标题
   */
  title: {
    type: String,
    default: "获取您的昵称、头像"
  },
  /**
   * @description 弹框提示
   */
  tips: {
    type: String,
    default: "获取用户头像、昵称，主要用于向用户提供具有辨识度的用户体验"
  },
  /**
   * @description 弹框确认按钮文案
   */
  confirmText: {
    type: String,
    default: "保 存"
  },
  /**
   * @description 弹框按钮背景颜色，以tn开头使用图鸟内置的颜色
   */
  confirmBgColor: {
    type: String,
    default: "tn-type-primary"
  },
  /**
   * @description 弹框按钮文字颜色，以tn开头使用图鸟内置的颜色
   */
  confirmTextColor: {
    type: String,
    default: "tn-white"
  }
});
const updateUserInfoPopupEmits = {
  "update:show": (val) => isBoolean$1(val),
  "update:avatar": (val) => isString(val),
  "update:nickname": (val) => isString(val),
  /**
   * @description 点击弹框确认按钮时触发
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  confirm: (avatar, nickname) => true,
  /**
   * @description 选择头像后触发
   */
  "choose-avatar": (val) => isString(val)
};
const useUpdateUserInfoPopupCustomStyle = (props2) => {
  const ns = useNamespace$1("update-user-info-popup");
  const [confirmBtnBgColorClass, confirmBtnBgColorStyle] = useComponentColor$1(
    toRef(props2, "confirmBgColor"),
    "bg"
  );
  const [confirmBtnTextColorClass, confirmBtnTextColorStyle] = useComponentColor$1(toRef(props2, "confirmTextColor"), "text");
  const submitBtnClass = computed(() => {
    const cls = [ns.e("submit-btn")];
    if (confirmBtnBgColorClass.value) {
      cls.push(confirmBtnBgColorClass.value);
    }
    if (confirmBtnTextColorClass.value) {
      cls.push(confirmBtnTextColorClass.value);
    }
    return cls.join(" ");
  });
  const submitBtnStyle = computed(() => {
    const style = {};
    if (!confirmBtnBgColorClass.value) {
      style.backgroundColor = confirmBtnBgColorStyle.value || "var(--tn-color-primary)";
    }
    if (confirmBtnTextColorStyle.value) {
      style.color = confirmBtnTextColorStyle.value;
    } else if (!confirmBtnBgColorClass.value) {
      style.color = "var(--tn-color-white)";
    }
    if (!props2.avatar || !props2.nickname) {
      style.backgroundColor = "var(--tn-color-gray-disabled)";
      style.color = "var(--tn-color-gray-dark)";
    }
    return style;
  });
  return {
    ns,
    submitBtnClass,
    submitBtnStyle
  };
};
const useUpdateUserInfoPopup = (props2, emits) => {
  const showUpdatePopup = ref(false);
  const inputNickname = ref(props2.nickname);
  watch(
    () => props2.show,
    (val) => {
      showUpdatePopup.value = val;
    },
    {
      immediate: true
    }
  );
  const nickNameInputHandle = (e2) => {
    const value2 = e2.detail.value;
    inputNickname.value = value2;
    emits("update:nickname", value2);
  };
  const avatarChooseHandle = (e2) => {
    emits("choose-avatar", e2.detail.avatarUrl);
  };
  const submitBtnClickHandle = () => {
    if (!inputNickname.value || !props2.avatar) {
      return;
    }
    emits("confirm", props2.avatar, inputNickname.value);
    emits("update:show", false);
  };
  const popupCloseHandle = () => {
    emits("update:show", false);
  };
  return {
    showUpdatePopup,
    inputNickname,
    nickNameInputHandle,
    popupCloseHandle,
    submitBtnClickHandle,
    avatarChooseHandle
  };
};
const useComponentBoolean = buildProp({
  type: [Boolean, void 0],
  default: void 0
});
const useComponentSizeProp = buildProp({
  type: String,
  values: componentSizes,
  required: false
});
const useFormSizeProps = buildProp({
  type: String,
  values: formComponentSizes,
  required: false
});
const useComponentCustomStyleProp = buildProp({
  type: Object,
  default: () => ({})
});
const useComponentIndexProp = buildProp({
  type: definePropType([String, Number]),
  default: () => generateId()
});
const useComponentSafeAreaInsetBottomProp = buildProp({
  type: Boolean,
  default: true
});
const buttonFormTypes = ["submit", "reset"];
const buttonOpenTypes = [
  "feedback",
  "share",
  "contact",
  "getPhoneNumber",
  "getRealtimePhoneNumber",
  "launchApp",
  "openSetting",
  "getUserInfo",
  "chooseAvatar",
  "agreePrivacyAuthorization"
];
const buttonProps = buildProps({
  /**
   * @description 按钮宽度
   */
  width: {
    type: [String, Number]
  },
  /**
   * @description 按钮高度
   */
  height: {
    type: [String, Number]
  },
  /**
   * @description 按钮尺寸
   */
  size: useComponentSizeProp,
  /**
   * @description 按钮形状
   */
  shape: {
    type: String,
    values: componentShapes,
    default: ""
  },
  /**
   * @description 按钮颜色类型
   */
  type: {
    type: String,
    values: componentTypes,
    default: "primary"
  },
  /**
   * @description 按钮图标
   */
  icon: {
    type: iconPropType
  },
  /**
   * @description 是否加粗字体
   */
  bold: Boolean,
  /**
   * @description 字体大小
   */
  fontSize: {
    type: [String, Number]
  },
  /**
   * @description 背景颜色，以tn开头则使用图鸟内置的颜色
   */
  bgColor: String,
  /**
   * @description 文字颜色，以tn开头则使用图鸟内置的颜色
   */
  textColor: String,
  /**
   * @description 是否显示为文本按钮
   */
  text: Boolean,
  /**
   * @description 是否为朴素按钮
   */
  plain: Boolean,
  /**
   * @description 边框颜色，以tn开头则使用图鸟内置的颜色
   */
  borderColor: String,
  /**
   * @description 是否加粗边框
   */
  borderBold: Boolean,
  /**
   * @description 是否显示阴影
   */
  shadow: Boolean,
  /**
   * @description 阴影颜色，以tn开头则使用图鸟内置的颜色
   */
  shadowColor: String,
  /**
   * @description 点击时触发的类
   */
  hoverClass: {
    type: String,
    default: "tn-u-btn-hover"
  },
  /**
   * @description 自定义样式
   */
  customStyle: useComponentCustomStyleProp,
  /**
   * @description 自定义类
   */
  customClass: String,
  /**
   * @description 是否禁用按钮
   */
  disabled: Boolean,
  /**
   * @description 是否只为一个按钮，不作用任何样式
   */
  onlyButton: Boolean,
  /**
   * @description 是否显示加载中
   */
  loading: Boolean,
  /**
   * @description 是否防抖
   */
  debounce: {
    type: Boolean,
    default: false
  },
  /**
   * @description 触发form表单的事件类型
   */
  formType: {
    type: String,
    values: buttonFormTypes
  },
  /**
   * @description 按钮开放能力，具体能力参考官网https://uniapp.dcloud.io/component/button.html
   */
  openType: {
    type: String,
    values: buttonOpenTypes
  },
  /**
   * @description 打开app时向app传递的参数, 在微信、QQ小程序和openType为launchApp时生效
   */
  appParameter: {
    type: String,
    default: ""
  },
  /**
   * @description 会话来源, 在微信小程序和openType为contact时生效
   */
  sessionFrom: {
    type: String,
    default: ""
  },
  /**
   * @description 会话内消息卡片标题, 默认为当前标题, 在微信小程序和openType为contact时生效
   */
  sendMessageTitle: {
    type: String,
    default: ""
  },
  /**
   * @description 会话内消息卡片点击跳转小程序路径, 默认为当前路径, 在微信小程序和openType为contact时生效
   */
  sendMessagePath: {
    type: String,
    default: ""
  },
  /**
   * @description 会话内消息卡片图片, 默认为截图, 在微信小程序和openType为contact时生效
   */
  sendMessageImg: {
    type: String,
    default: ""
  },
  /**
   * @description 是否显示会话内消息卡片, 设置此参数为true, 用户进入客服会话会在右下角显示"可能要发送的小程序"提示, 用户点击后可以快速发送小程序消息, 在微信小程序和openType为contact时生效
   */
  showMessageCard: {
    type: Boolean,
    default: false
  },
  /**
   * @description 当手机号快速验证或手机号实时验证额度用尽时，是否对用户展示“申请获取你的手机号，但该功能使用次数已达当前小程序上限，暂时无法使用”的提示
   */
  phoneNumberNoQuotaToast: {
    type: Boolean,
    default: true
  },
  clickModifiers: {
    type: String
  }
});
const buttonEmits = {
  /**
   * @description 按钮点击事件
   */
  click: () => true,
  /**
   * @description 获取用户手机号码回调
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getphonenumber: (e2) => true,
  /**
   * @description 获取用户手机号实时验证回调
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getrealtimephonenumber: (e2) => true,
  /**
   * @description 打开权限设置面板并关闭时回调
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  opensetting: (e2) => true,
  /**
   * @description 打开APP成功时回调
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  launchapp: (e2) => true,
  /**
   * @description 获取用户信息回调
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getuserinfo: (e2) => true,
  /**
   * @description 获取用户头像回调
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  chooseavatar: (e2) => true,
  /**
   * @description 同意隐私授权回调
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  agreeprivacyauthorization: (e2) => true,
  /**
   * @description 客服消息回调
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  contact: (e2) => true,
  /**
   * @description 开放能力调用发生错误时回调
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  error: (e2) => true
};
const useButtonCustomStyle = (props2) => {
  const ns = useNamespace("button");
  const [bgColorClass, bgColorStyle] = useComponentColor(
    toRef(props2, "bgColor"),
    "bg"
  );
  const [textColorClass, textColorStyle] = useComponentColor(
    toRef(props2, "textColor"),
    "text"
  );
  const [borderColorClass, borderColorStyle] = useComponentColor(
    toRef(props2, "borderColor"),
    "border"
  );
  const [shadowColorClass, shadowColorStyle] = useComponentColor(
    toRef(props2, "shadowColor"),
    "shadow"
  );
  const buttonClass = computed(() => {
    const cls = [ns.b()];
    if (props2.onlyButton) {
      cls.push(ns.m("only-button"));
      return cls.join(" ");
    }
    if (props2.text)
      cls.push(ns.m("text"));
    if (props2.plain) {
      cls.push(ns.m("plain"));
      if (props2.borderBold)
        cls.push(ns.m("plain-bold"));
    }
    if (props2.type) {
      if (props2.text) {
        if (!props2.textColor)
          cls.push(`tn-type-${props2.type}_text`);
      } else if (props2.plain) {
        if (!props2.borderColor)
          cls.push(`tn-type-${props2.type}_border`);
      } else {
        if (!props2.bgColor)
          cls.push(`tn-type-${props2.type}_bg`);
      }
    }
    if (props2.size)
      cls.push(ns.m(props2.size));
    if (!props2.text && props2.shape)
      cls.push(ns.m(props2.shape));
    if (props2.bold)
      cls.push("tn-text-bold");
    if (!props2.text && !props2.plain) {
      if (bgColorClass.value)
        cls.push(bgColorClass.value);
    }
    if (textColorClass.value)
      cls.push(textColorClass.value);
    if (props2.plain) {
      if (borderColorClass.value)
        cls.push(borderColorClass.value);
    }
    if (props2.shadow) {
      cls.push("tn-shadow");
      if (shadowColorClass.value)
        cls.push(shadowColorClass.value);
    }
    if (props2.customClass)
      cls.push(props2.customClass);
    return cls.join(" ");
  });
  const buttonStyle = computed(() => {
    const style = {};
    if (props2.onlyButton)
      return style;
    if (props2.width) {
      style.width = formatDomSizeValue(props2.width);
      if (props2.shape === "circle")
        style.height = style.width;
    }
    if (props2.height && props2.shape !== "circle")
      style.height = formatDomSizeValue(props2.height);
    if (props2.fontSize)
      style.fontSize = formatDomSizeValue(props2.fontSize);
    if (!props2.text && !props2.plain) {
      if (bgColorStyle.value)
        style.backgroundColor = bgColorStyle.value;
    }
    if (textColorStyle.value) {
      style.color = textColorStyle.value;
    }
    if (props2.plain && borderColorStyle.value) {
      style.borderColor = borderColorStyle.value;
    }
    if (props2.shadow && shadowColorStyle.value)
      style.boxShadow = shadowColorStyle.value;
    if (!isEmpty(props2.customStyle)) {
      Object.assign(style, props2.customStyle);
    }
    return style;
  });
  return {
    ns,
    buttonClass,
    buttonStyle
  };
};
const useButton = (props2, emits) => {
  const buttonClickHandle = () => {
    if (props2.disabled || props2.loading)
      return;
    emits("click");
  };
  const buttonClick = props2.debounce ? debounce(buttonClickHandle, 250) : buttonClickHandle;
  const getPhoneNumber = (e2) => {
    emits("getphonenumber", e2);
  };
  const getRealTimePhoneNumber = (e2) => {
    emits("getrealtimephonenumber", e2);
  };
  const openSetting = (e2) => {
    emits("opensetting", e2);
  };
  const launchApp = (e2) => {
    emits("launchapp", e2);
  };
  const getUserInfo = (e2) => {
    emits("getuserinfo", e2);
  };
  const chooseAvatar = (e2) => {
    emits("chooseavatar", e2);
  };
  const agreePrivacyAuthorization = (e2) => {
    emits("agreeprivacyauthorization", e2);
  };
  const contact = (e2) => {
    emits("contact", e2);
  };
  const openTypeError = (e2) => {
    emits("error", e2);
  };
  return {
    buttonClick,
    getPhoneNumber,
    getRealTimePhoneNumber,
    openSetting,
    launchApp,
    getUserInfo,
    chooseAvatar,
    agreePrivacyAuthorization,
    contact,
    openTypeError
  };
};
const iconProps = buildProps({
  /**
   * @description 图标名称，支持图鸟内置图标和图片地址(只支持绝对路径)
   */
  name: {
    type: iconPropType,
    required: true
  },
  /**
   * @description 图标颜色类型
   */
  type: {
    type: String,
    values: componentTypes,
    default: ""
  },
  /**
   * @description 图标颜色, 以tn开头则使用图鸟内置的颜色
   */
  color: String,
  /**
   * @description 图标大小
   */
  size: {
    type: [String, Number]
  },
  /**
   * @description 图标加粗
   */
  bold: Boolean,
  /**
   * @description 图标是否为透明
   */
  transparent: Boolean,
  /**
   * @description 透明图标背景
   */
  transparentBg: String,
  /**
   * @description 图片模式，当name为图片地址时生效
   */
  imgMode: {
    type: String,
    values: componentImgModes,
    default: "aspectFill"
  },
  /**
   * @description 垂直方向上的偏移量
   */
  offsetTop: {
    type: [String, Number]
  },
  /**
   * @description 自定义样式
   */
  customStyle: useComponentCustomStyleProp,
  /**
   * @description 自定义类
   */
  customClass: String
});
const iconEmits = {
  /**
   * @description 点击图标时触发
   */
  click: () => true
};
const useIcon = (props2) => {
  const ns = useNamespace("icon");
  const [colorClass, colorStyle] = useComponentColor(
    toRef(props2, "color"),
    "text"
  );
  const [transparentBgClass] = useComponentColor(
    toRef(props2, "transparentBg"),
    "bg"
  );
  const { sizeType } = useComponentSize(props2.size);
  const isImg = computed(
    () => !!(props2 == null ? void 0 : props2.name) && props2.name.includes("/")
  );
  const iconClass = computed(() => {
    const cls = [];
    cls.push(ns.b());
    if (isImg.value) {
      cls.push(ns.m("image"));
    } else {
      if (props2.type)
        cls.push(`tn-type-${props2.type}_text`);
      if (props2.transparent) {
        cls.push("tn-text-transparent", transparentBgClass.value);
      } else {
        if (colorClass.value)
          cls.push(colorClass.value);
      }
      if (props2.bold)
        cls.push("tn-text-bold");
    }
    if (sizeType.value === "inner")
      cls.push(ns.m(props2.size));
    if (props2.customClass)
      cls.push(props2.customClass);
    return cls.join(" ");
  });
  const iconStyle = computed(() => {
    const style = {};
    if (isImg.value) {
      if (sizeType.value === "custom" && props2.size) {
        style.width = style.height = formatDomSizeValue(props2.size);
      }
    } else {
      if (colorStyle.value)
        style.color = colorStyle.value;
      if (sizeType.value === "custom" && props2.size)
        style.fontSize = formatDomSizeValue(props2.size);
    }
    if (props2.offsetTop)
      style.transform = `translateY(${formatDomSizeValue(props2.offsetTop)})`;
    if (!isEmpty(props2.customStyle))
      Object.assign(style, props2.customStyle);
    return style;
  });
  return {
    isImg,
    iconClass,
    iconStyle
  };
};
const photoAlbumProps = buildProps({
  /**
   * @description 图片地址列表
   */
  data: {
    type: definePropType(Array),
    default: () => []
  },
  /**
   * @description 最大允许显示图片的数量
   */
  max: {
    type: Number,
    default: 9
  },
  /**
   * @description 一行显示的图片数量
   */
  column: {
    type: Number,
    default: 3
  },
  /**
   * @description 图片模式
   */
  imgMode: {
    type: String,
    values: componentImgModes,
    default: "aspectFill"
  },
  /**
   * @description 是否开启懒加载
   */
  lazyLoad: {
    type: Boolean,
    default: true
  },
  /**
   * @description 点击图片进行预览
   */
  preview: {
    type: Boolean,
    default: true
  }
});
const photoAlbumEmits = {
  /**
   * @description 点击图片时触发
   */
  click: (index2) => isNumber(index2)
};
const usePhotoAlbum = (props2, emits) => {
  const imageData = computed(() => {
    const maxLength = Math.min(props2.data.length, props2.max);
    return props2.data.slice(0, maxLength);
  });
  const imageClickEvent = (index2) => {
    emits("click", index2);
    if (!props2.preview)
      return;
    index$1.previewImage({
      urls: imageData.value,
      current: index2
    });
  };
  return {
    imageData,
    imageClickEvent
  };
};
const avatarShape = ["circle", "square"];
const avatarProps = buildProps({
  /**
   * @description 头像地址(url地址和绝对地址)
   */
  url: String,
  /**
   * @descripttion 头像图标
   */
  icon: String,
  /**
   * @description 头像图标配置
   */
  iconConfig: {
    type: definePropType(Object),
    default: () => ({})
  },
  /**
   * @description 头像颜色类型
   */
  type: {
    type: String,
    values: componentTypes,
    default: ""
  },
  /**
   * @description 头像大小
   */
  size: {
    type: [String, Number]
  },
  /**
   * @description 头像形状
   */
  shape: {
    type: String,
    values: avatarShape,
    default: "circle"
  },
  /**
   * @description 头像图片模式
   */
  imgMode: {
    type: String,
    values: componentImgModes,
    default: "aspectFill"
  },
  /**
   * @description 背景颜色
   */
  bgColor: String,
  /**
   * @description 显示边框
   */
  border: useComponentBoolean,
  /**
   * @description 边框颜色
   */
  borderColor: String,
  /**
   * @description 是否加粗边框
   */
  borderBold: useComponentBoolean,
  /**
   * @description 显示阴影
   */
  shadow: useComponentBoolean,
  /**
   * @description 阴影颜色
   */
  shadowColor: String,
  /**
   * @description 角标内容
   */
  badge: {
    type: [String, Number]
  },
  /**
   * @description 角标配置
   */
  badgeConfig: {
    type: definePropType(Object),
    default: () => ({})
  }
});
const avatarEmits = {
  /**
   * @description 点击事件
   */
  click: () => true
};
const avatarGroupContextKey = Symbol(
  "avatarGroupContextKey"
);
const formContextKey = Symbol("formContextKey");
const formItemContextKey = Symbol("formItemContextKey");
const useAvatarIconConfig = (config2) => {
  const avatarGroup = inject(avatarGroupContextKey, void 0);
  const iconColor = computed(() => {
    var _a2;
    return (config2 == null ? void 0 : config2.color) || ((_a2 = avatarGroup == null ? void 0 : avatarGroup.iconConfig) == null ? void 0 : _a2.color) || "";
  });
  const iconSize = computed(() => {
    var _a2;
    return (config2 == null ? void 0 : config2.size) || ((_a2 = avatarGroup == null ? void 0 : avatarGroup.iconConfig) == null ? void 0 : _a2.size) || "";
  });
  const iconBold = computed(() => {
    var _a2;
    return (config2 == null ? void 0 : config2.bold) || ((_a2 = avatarGroup == null ? void 0 : avatarGroup.iconConfig) == null ? void 0 : _a2.bold) || false;
  });
  return {
    iconColor,
    iconSize,
    iconBold
  };
};
const useAvatarProps = (props2) => {
  const avatarGroup = inject(avatarGroupContextKey, void 0);
  const type2 = computed(() => {
    return isEmptyDoubleVariableInDefault(props2 == null ? void 0 : props2.type, avatarGroup == null ? void 0 : avatarGroup.type, "");
  });
  const size2 = computed(() => {
    return isEmptyDoubleVariableInDefault(props2 == null ? void 0 : props2.size, avatarGroup == null ? void 0 : avatarGroup.size, "");
  });
  const shape = computed(() => {
    return isEmptyDoubleVariableInDefault(
      props2 == null ? void 0 : props2.shape,
      avatarGroup == null ? void 0 : avatarGroup.shape,
      "circle"
    );
  });
  const imgMode = computed(() => {
    return isEmptyDoubleVariableInDefault(
      props2 == null ? void 0 : props2.imgMode,
      avatarGroup == null ? void 0 : avatarGroup.imgMode,
      "aspectFill"
    );
  });
  const bgColor = computed(() => {
    return isEmptyDoubleVariableInDefault(
      props2 == null ? void 0 : props2.bgColor,
      avatarGroup == null ? void 0 : avatarGroup.bgColor,
      "tn-gray-light"
    );
  });
  const border = computed(() => {
    return isEmptyDoubleVariableInDefault(
      props2 == null ? void 0 : props2.border,
      avatarGroup == null ? void 0 : avatarGroup.border,
      false
    );
  });
  const borderColor = computed(() => {
    return isEmptyDoubleVariableInDefault(
      props2 == null ? void 0 : props2.borderColor,
      avatarGroup == null ? void 0 : avatarGroup.borderColor,
      ""
    );
  });
  const borderBold = computed(() => {
    return isEmptyDoubleVariableInDefault(
      props2 == null ? void 0 : props2.borderBold,
      avatarGroup == null ? void 0 : avatarGroup.borderBold,
      false
    );
  });
  const shadow = computed(() => {
    return isEmptyDoubleVariableInDefault(
      props2 == null ? void 0 : props2.shadow,
      avatarGroup == null ? void 0 : avatarGroup.shadow,
      false
    );
  });
  const shadowColor = computed(() => {
    return isEmptyDoubleVariableInDefault(
      props2 == null ? void 0 : props2.shadowColor,
      avatarGroup == null ? void 0 : avatarGroup.shadowColor,
      ""
    );
  });
  const avatarGap = computed(() => {
    let gap = Number(isEmptyVariableInDefault(avatarGroup == null ? void 0 : avatarGroup.gap, 0));
    if (gap < 0)
      gap = 0;
    if (gap > 1)
      gap = 1;
    return gap;
  });
  return {
    type: type2,
    size: size2,
    shape,
    imgMode,
    bgColor,
    border,
    borderColor,
    borderBold,
    shadow,
    shadowColor,
    avatarGap
  };
};
const useAvatarCustomStyle = (props2, groupIndex, avatarWidth) => {
  const ns = useNamespace("avatar");
  const {
    type: type2,
    size: size2,
    shape,
    bgColor,
    border,
    borderColor,
    shadow,
    shadowColor,
    avatarGap
  } = useAvatarProps(props2);
  const [bgColorClass, bgColorStyle] = useComponentColor(bgColor, "bg");
  const [borderColorClass, borderColorStyle] = useComponentColor(
    borderColor,
    "border"
  );
  const [shadowColorClass] = useComponentColor(shadowColor, "shadow");
  const { sizeType } = useComponentSize(size2.value);
  const avatarClass = computed(() => {
    const cls = [];
    cls.push(ns.b());
    if (type2.value)
      cls.push(`tn-type-${type2.value}_bg`);
    if (!type2.value && bgColorClass.value)
      cls.push(bgColorClass.value);
    if (sizeType.value === "inner")
      cls.push(ns.m(size2.value));
    if (shape.value)
      cls.push(ns.m(shape.value));
    if (border.value) {
      cls.push("tn-border");
      if (borderColorClass.value)
        cls.push(borderColorClass.value);
    }
    if (shadow.value) {
      cls.push("tn-shadow");
      if (shadowColorClass.value)
        cls.push(shadowColorClass.value);
    }
    return cls.join(" ");
  });
  const avatarStyle = computed(() => {
    const style = {};
    if (sizeType.value === "custom") {
      style.width = formatDomSizeValue(size2.value);
      style.height = style.width;
    }
    if (bgColorStyle.value)
      style.backgroundColor = bgColorStyle.value;
    if (border.value && borderColorStyle.value)
      style.borderColor = borderColorStyle.value;
    if (groupIndex.value != -1) {
      style.zIndex = groupIndex.value + 1;
      if (groupIndex.value > 0) {
        style.marginLeft = `calc(-${avatarWidth.value * avatarGap.value}px)`;
      } else {
        style.marginLeft = "0px";
      }
    }
    return style;
  });
  return {
    ns,
    avatarClass,
    avatarStyle
  };
};
const useAvatar = (props2, emits) => {
  const instance = getCurrentInstance();
  if (!instance) {
    debugWarn("TnAvatarGroup", "请在 setup 中使用 useAvatarGroup");
  }
  const { uid: uid2 } = instance;
  const avatarGroup = inject(avatarGroupContextKey, void 0);
  avatarGroup == null ? void 0 : avatarGroup.addItem({ uid: uid2 });
  const componentId = `ta-${generateId()}`;
  const { getSelectorNodeInfo } = useSelectorQuery(instance);
  const groupAvatarCount = computed(() => {
    return isEmptyVariableInDefault(avatarGroup == null ? void 0 : avatarGroup.avatarItems.length, 0);
  });
  const avatarGroupIndex = ref(-1);
  nextTick$1(() => {
    const avatarIndex = avatarGroup == null ? void 0 : avatarGroup.avatarItems.findIndex(
      (item) => item.uid === uid2
    );
    avatarGroupIndex.value = isEmptyVariableInDefault(avatarIndex, -1);
    if (!avatarWidth.value && avatarGroupIndex.value !== -1) {
      getAvatarWidthNodeInfo();
    }
  });
  const avatarWidth = ref(0);
  let initCount = 0;
  const getAvatarWidthNodeInfo = async () => {
    try {
      const rectInfo = await getSelectorNodeInfo(`#${componentId}`);
      if (!rectInfo.width) {
        throw new Error("获取头像宽度信息失败");
      }
      avatarWidth.value = rectInfo.width || 0;
    } catch (err) {
      if (initCount > 10) {
        initCount = 0;
        debugWarn("TnAvatar", `获取头像宽度信息失败：${err}`);
        return;
      }
      initCount++;
      setTimeout(() => {
        getAvatarWidthNodeInfo();
      }, 150);
    }
  };
  const avatarClick = () => {
    avatarGroup == null ? void 0 : avatarGroup.handleItemClick(uid2);
    emits("click");
  };
  onUnmounted(() => {
    avatarGroup == null ? void 0 : avatarGroup.removeItem(uid2);
  });
  return {
    componentId,
    groupAvatarCount,
    avatarGroupIndex,
    avatarWidth,
    avatarClick
  };
};
const useAvatarGroup = (props2, emits) => {
  const {
    children: avatarItems,
    addChild: addItem,
    removeChild: removeItem
  } = useOrderedChildren();
  const handleItemClick = (uid2) => {
    const index2 = avatarItems.value.findIndex((item) => item.uid === uid2);
    emits("click", index2);
  };
  provide(
    avatarGroupContextKey,
    reactive({
      ...toRefs(props2),
      avatarItems,
      addItem,
      removeItem,
      handleItemClick
    })
  );
};
const useAvatarBadgeProps = (props2) => {
  const avatarGroup = inject(avatarGroupContextKey, void 0);
  const max = computed(() => {
    var _a2, _b;
    return isEmptyDoubleVariableInDefault(
      (_a2 = props2 == null ? void 0 : props2.badgeConfig) == null ? void 0 : _a2.max,
      (_b = avatarGroup == null ? void 0 : avatarGroup.badgeConfig) == null ? void 0 : _b.max
    );
  });
  const type2 = computed(() => {
    var _a2, _b;
    return isEmptyDoubleVariableInDefault(
      (_a2 = props2 == null ? void 0 : props2.badgeConfig) == null ? void 0 : _a2.type,
      (_b = avatarGroup == null ? void 0 : avatarGroup.badgeConfig) == null ? void 0 : _b.type,
      "primary"
    );
  });
  const bgColor = computed(() => {
    var _a2, _b;
    return isEmptyDoubleVariableInDefault(
      (_a2 = props2 == null ? void 0 : props2.badgeConfig) == null ? void 0 : _a2.bgColor,
      (_b = avatarGroup == null ? void 0 : avatarGroup.badgeConfig) == null ? void 0 : _b.bgColor
    );
  });
  const textColor = computed(() => {
    var _a2, _b;
    return isEmptyDoubleVariableInDefault(
      (_a2 = props2 == null ? void 0 : props2.badgeConfig) == null ? void 0 : _a2.textColor,
      (_b = avatarGroup == null ? void 0 : avatarGroup.badgeConfig) == null ? void 0 : _b.textColor
    );
  });
  const fontSize = computed(() => {
    var _a2, _b;
    return isEmptyDoubleVariableInDefault(
      (_a2 = props2 == null ? void 0 : props2.badgeConfig) == null ? void 0 : _a2.fontSize,
      (_b = avatarGroup == null ? void 0 : avatarGroup.badgeConfig) == null ? void 0 : _b.fontSize
    );
  });
  const size2 = computed(() => {
    var _a2, _b;
    return isEmptyDoubleVariableInDefault(
      (_a2 = props2 == null ? void 0 : props2.badgeConfig) == null ? void 0 : _a2.size,
      (_b = avatarGroup == null ? void 0 : avatarGroup.badgeConfig) == null ? void 0 : _b.size
    );
  });
  const bold = computed(() => {
    var _a2, _b;
    return isEmptyDoubleVariableInDefault(
      (_a2 = props2 == null ? void 0 : props2.badgeConfig) == null ? void 0 : _a2.bold,
      (_b = avatarGroup == null ? void 0 : avatarGroup.badgeConfig) == null ? void 0 : _b.bold,
      false
    );
  });
  const dot = computed(() => {
    var _a2, _b;
    return isEmptyDoubleVariableInDefault(
      (_a2 = props2 == null ? void 0 : props2.badgeConfig) == null ? void 0 : _a2.dot,
      (_b = avatarGroup == null ? void 0 : avatarGroup.badgeConfig) == null ? void 0 : _b.dot,
      false
    );
  });
  const absolutePosition = computed(() => {
    var _a2, _b;
    return isEmptyDoubleVariableInDefault(
      (_a2 = props2 == null ? void 0 : props2.badgeConfig) == null ? void 0 : _a2.absolutePosition,
      (_b = avatarGroup == null ? void 0 : avatarGroup.badgeConfig) == null ? void 0 : _b.absolutePosition,
      {}
    );
  });
  const absoluteCenter = computed(() => {
    var _a2, _b;
    return isEmptyDoubleVariableInDefault(
      (_a2 = props2 == null ? void 0 : props2.badgeConfig) == null ? void 0 : _a2.absoluteCenter,
      (_b = avatarGroup == null ? void 0 : avatarGroup.badgeConfig) == null ? void 0 : _b.absoluteCenter,
      true
    );
  });
  const badgeConfig = computed(() => {
    return {
      value: props2.badge,
      max: max.value,
      type: type2.value,
      bgColor: bgColor.value,
      textColor: textColor.value,
      fontSize: fontSize.value,
      size: size2.value,
      bold: bold.value,
      customClass: "",
      customStyle: {},
      dot: dot.value,
      absolute: true,
      absolutePosition: absolutePosition.value,
      absoluteCenter: absoluteCenter.value,
      index: ""
    };
  });
  return {
    badgeConfig
  };
};
const avatarGroupProps = buildProps({
  /**
   * @description 头像图标配置
   */
  iconConfig: avatarProps.iconConfig,
  /**
   * @description 头像颜色类型
   */
  type: avatarProps.type,
  /**
   * @description 头像大小
   */
  size: avatarProps.size,
  /**
   * @description 头像形状
   */
  shape: avatarProps.shape,
  /**
   * @description 头像图片模式
   */
  imgMode: avatarProps.imgMode,
  /**
   * @description 背景颜色
   */
  bgColor: avatarProps.bgColor,
  /**
   * @description 显示边框
   */
  border: {
    type: Boolean,
    default: true
  },
  /**
   * @description 边框颜色
   */
  borderColor: {
    type: String,
    default: "tn-white"
  },
  /**
   * @description 是否加粗边框
   */
  borderBold: avatarProps.borderBold,
  /**
   * @description 显示阴影
   */
  shadow: avatarProps.shadow,
  /**
   * @description 阴影颜色
   */
  shadowColor: avatarProps.shadowColor,
  /**
   * @description 头像角标配置
   */
  badgeConfig: avatarProps.badgeConfig,
  /**
   * @description 头像之间遮挡比例
   */
  gap: {
    type: [String, Number],
    default: 0.4
  }
});
const avatarGroupEmits = {
  /**
   * @description 点击头像
   */
  click: (index2) => typeof index2 === "number"
};
const lazyLoadProps = buildProps({
  /**
   * @description 图片地址
   */
  src: String,
  /**
   * @description 图片高度
   */
  height: String,
  /**
   * @description 图片宽度
   */
  width: String,
  /**
   * @description 图片裁剪模式
   */
  mode: {
    type: String,
    values: componentImgModes,
    default: "aspectFill"
  },
  /**
   * @description 开始加载图片的位置，单位为 px，如果设置为负数表示距离底部还有多少个像素就开始加载
   */
  threshold: {
    type: Number,
    default: 100
  },
  /**
   * @description 是否开启过度效果
   */
  transition: {
    type: Boolean,
    default: true
  }
});
const lazyLoadEmits = {
  /**
   * @description 图片加载完成
   */
  loaded: () => true,
  /**
   * @description 图片加载失败
   */
  error: () => true
};
const useLazyLoadCustomStyle = (props2) => {
  const ns = useNamespace("lazy-load");
  const lazyLoadStyle = computed(() => {
    const style = {};
    if (props2.width)
      style.width = formatDomSizeValue(props2.width);
    if (props2.height)
      style.height = formatDomSizeValue(props2.height);
    return style;
  });
  return {
    ns,
    lazyLoadStyle
  };
};
const useLazyLoad = (props2) => {
  const instance = getCurrentInstance();
  if (!instance) {
    debugWarn("TnLazyLoad", "请在 setup 中使用 useLazyLoad");
  }
  const { emit: emit2 } = instance;
  const { getSelectorNodeInfo } = useSelectorQuery(instance);
  const { connectObserver, disconnectObserver } = useObserver(instance);
  const componentId = `tll-${generateId()}`;
  const threshold = computed(
    () => isEmptyVariableInDefault(props2.threshold, 100)
  );
  const imageStatus = ref("waiting");
  const showImage = ref(false);
  let initCount = 0;
  const initObserver = async () => {
    disconnectObserver();
    try {
      await getSelectorNodeInfo(`#${componentId}`);
      initCount = 0;
      const bottomThreshold = threshold.value < 0 ? -Math.abs(threshold.value) : Math.abs(threshold.value);
      connectObserver(
        `#${componentId}`,
        (res) => {
          if (res.intersectionRatio > 0) {
            showImage.value = true;
            imageStatus.value = "loading";
            disconnectObserver();
          }
        },
        {
          type: "relativeToViewport",
          margins: {
            bottom: bottomThreshold
          }
        }
      );
    } catch (err) {
      if (initCount > 10) {
        initCount = 0;
        debugWarn("TnLazyLoad", `获取图片节点信息失败：${err}`);
        return;
      }
      initCount++;
      setTimeout(() => {
        initObserver();
      }, 150);
    }
  };
  const handleImageLoadedSuccess = () => {
    imageStatus.value = "loaded";
    emit2("loaded");
  };
  const handleImageLoadedFailed = (err) => {
    debugWarn("TnLazyLoad", `图片加载失败: ${err}`);
    imageStatus.value = "error";
    emit2("error");
  };
  onMounted(() => {
    nextTick$1(() => {
      initObserver();
    });
  });
  onUnmounted(() => {
    disconnectObserver();
  });
  return {
    componentId,
    imageStatus,
    showImage,
    handleImageLoadedSuccess,
    handleImageLoadedFailed
  };
};
const props$9 = defineMixin({
  props: {
    // 搜索框形状，round-圆形，square-方形
    shape: {
      type: String,
      default: () => defProps.search.shape
    },
    // 搜索框背景色，默认值#f2f2f2
    bgColor: {
      type: String,
      default: () => defProps.search.bgColor
    },
    // 占位提示文字
    placeholder: {
      type: String,
      default: () => defProps.search.placeholder
    },
    // 是否启用清除控件
    clearabled: {
      type: Boolean,
      default: () => defProps.search.clearabled
    },
    // 是否自动聚焦
    focus: {
      type: Boolean,
      default: () => defProps.search.focus
    },
    // 是否在搜索框右侧显示取消按钮
    showAction: {
      type: Boolean,
      default: () => defProps.search.showAction
    },
    // 右边控件的样式
    actionStyle: {
      type: Object,
      default: () => defProps.search.actionStyle
    },
    // 取消按钮文字
    actionText: {
      type: String,
      default: () => defProps.search.actionText
    },
    // 输入框内容对齐方式，可选值为 left|center|right
    inputAlign: {
      type: String,
      default: () => defProps.search.inputAlign
    },
    // input输入框的样式，可以定义文字颜色，大小等，对象形式
    inputStyle: {
      type: Object,
      default: () => defProps.search.inputStyle
    },
    // 是否启用输入框
    disabled: {
      type: Boolean,
      default: () => defProps.search.disabled
    },
    // 边框颜色
    borderColor: {
      type: String,
      default: () => defProps.search.borderColor
    },
    // 搜索图标的颜色，默认同输入框字体颜色
    searchIconColor: {
      type: String,
      default: () => defProps.search.searchIconColor
    },
    // 输入框字体颜色
    color: {
      type: String,
      default: () => defProps.search.color
    },
    // placeholder的颜色
    placeholderColor: {
      type: String,
      default: () => defProps.search.placeholderColor
    },
    // 左边输入框的图标，可以为uView图标名称或图片路径
    searchIcon: {
      type: String,
      default: () => defProps.search.searchIcon
    },
    searchIconSize: {
      type: [Number, String],
      default: () => defProps.search.searchIconSize
    },
    // 组件与其他上下左右元素之间的距离，带单位的字符串形式，如"30px"、"30px 20px"等写法
    margin: {
      type: String,
      default: () => defProps.search.margin
    },
    // 开启showAction时，是否在input获取焦点时才显示
    animation: {
      type: Boolean,
      default: () => defProps.search.animation
    },
    // 输入框的初始化内容
    modelValue: {
      type: String,
      default: () => defProps.search.value
    },
    value: {
      type: String,
      default: () => defProps.search.value
    },
    // 输入框最大能输入的长度，-1为不限制长度(来自uniapp文档)
    maxlength: {
      type: [String, Number],
      default: () => defProps.search.maxlength
    },
    // 搜索框高度，单位px
    height: {
      type: [String, Number],
      default: () => defProps.search.height
    },
    // 搜索框左侧文本
    label: {
      type: [String, Number, null],
      default: () => defProps.search.label
    },
    // 键盘弹起时，是否自动上推页面	
    adjustPosition: {
      type: Boolean,
      default: () => true
    },
    // 键盘收起时，是否自动失去焦点	
    autoBlur: {
      type: Boolean,
      default: () => false
    }
  }
});
const props$8 = defineMixin({
  props: {
    // 滑块的移动过渡时间，单位ms
    duration: {
      type: Number,
      default: () => defProps.tabs.duration
    },
    // tabs标签数组
    list: {
      type: Array,
      default: () => defProps.tabs.list
    },
    // 滑块颜色
    lineColor: {
      type: String,
      default: () => defProps.tabs.lineColor
    },
    // 菜单选择中时的样式
    activeStyle: {
      type: [String, Object],
      default: () => defProps.tabs.activeStyle
    },
    // 菜单非选中时的样式
    inactiveStyle: {
      type: [String, Object],
      default: () => defProps.tabs.inactiveStyle
    },
    // 滑块长度
    lineWidth: {
      type: [String, Number],
      default: () => defProps.tabs.lineWidth
    },
    // 滑块高度
    lineHeight: {
      type: [String, Number],
      default: () => defProps.tabs.lineHeight
    },
    // 滑块背景显示大小，当滑块背景设置为图片时使用
    lineBgSize: {
      type: String,
      default: () => defProps.tabs.lineBgSize
    },
    // 菜单item的样式
    itemStyle: {
      type: [String, Object],
      default: () => defProps.tabs.itemStyle
    },
    // 菜单是否可滚动
    scrollable: {
      type: Boolean,
      default: () => defProps.tabs.scrollable
    },
    // 当前选中标签的索引
    current: {
      type: [Number, String],
      default: () => defProps.tabs.current
    },
    // 默认读取的键名
    keyName: {
      type: String,
      default: () => defProps.tabs.keyName
    }
  }
});
const waterFallModes = ["normal", "calc"];
const waterFallProps = buildProps({
  /**
   * @description 列表数据
   */
  data: {
    type: Array,
    default: () => []
  },
  /**
   * @description 瀑布流模式
   */
  mode: {
    type: String,
    values: waterFallModes,
    default: "normal"
  }
});
const useWaterFall = (props2) => {
  const instance = getCurrentInstance();
  if (!instance) {
    debugWarn("TnWaterFall", "请在 setup 中使用 useWaterFall");
  }
  const componentId = `twf-${generateId()}`;
  const { getSelectorNodeInfo } = useSelectorQuery(instance);
  const leftData = ref([]);
  const rightData = ref([]);
  let leftContainerHeight = 0;
  let rightContainerHeight = 0;
  const getContainerHeight = async () => {
    try {
      const leftContainerRectInfo = await getSelectorNodeInfo(
        `#${componentId}-left`
      );
      const rightContainerRectInfo = await getSelectorNodeInfo(
        `#${componentId}-right`
      );
      leftContainerHeight = leftContainerRectInfo.height || leftContainerHeight;
      rightContainerHeight = rightContainerRectInfo.height || rightContainerHeight;
    } catch (err) {
      debugWarn("TnWaterFall", `获取容器高度信息失败：${err}`);
    }
  };
  let oldUserData = [];
  const splitData = async (data) => {
    if (!data || !data.length)
      return;
    if (props2.mode === "calc") {
      await getContainerHeight();
      if (leftContainerHeight <= rightContainerHeight) {
        leftData.value.push(data.shift());
      } else {
        rightData.value.push(data.shift());
      }
      nextTick$1(() => {
        setTimeout(() => {
          splitData(data);
        }, 200);
      });
    } else if (props2.mode === "normal") {
      let firstLeft = true;
      await getContainerHeight();
      if (leftData.value.length > rightData.value.length) {
        firstLeft = false;
      }
      let leftSmall = false;
      if (leftContainerHeight < rightContainerHeight) {
        leftSmall = true;
      }
      data.forEach((item, index2) => {
        if (index2 % 2 === 0 && firstLeft || leftSmall) {
          leftData.value.push(item);
        } else {
          rightData.value.push(item);
        }
        if (!firstLeft) {
          firstLeft = true;
        }
        if (leftSmall && index2 >= 2) {
          leftSmall = false;
        }
      });
    }
  };
  const resetWaterFall = () => {
    if (!props2.data)
      return;
    leftData.value = [];
    rightData.value = [];
    leftContainerHeight = 0;
    rightContainerHeight = 0;
    nextTick$1(() => {
      oldUserData = props2.data;
      splitData(props2.data);
    });
  };
  watch(
    () => props2.data,
    (val) => {
      if (!val)
        return;
      if (oldUserData.length === val.length)
        return;
      const newData = cloneDeep(val.slice(oldUserData.length));
      if (!newData.length) {
        leftData.value = [];
        rightData.value = [];
        leftContainerHeight = 0;
        rightContainerHeight = 0;
      }
      nextTick$1(() => {
        oldUserData = val;
        splitData(newData);
      });
    },
    {
      immediate: true
    }
  );
  return {
    componentId,
    leftData,
    rightData,
    resetWaterFall
  };
};
const overlayProps$1 = buildProps({
  /**
   * @description 是否显示遮罩层
   */
  show: {
    type: Boolean,
    default: false
  },
  /**
   * @description 动画时间，单位毫秒
   */
  duration: {
    type: Number,
    default: 300
  },
  /**
   * @description 遮罩层透明度，有效值0-1
   */
  opacity: {
    type: Number,
    default: 0.5
  },
  /**
   * @description zIndex
   */
  zIndex: {
    type: Number,
    default: ZIndex.mask
  }
});
const overlayEmits$1 = {
  "update:show": (value2) => isBoolean(value2),
  click: () => true
};
const useOverlay$1 = (props2, emits) => {
  const ns = useNamespace("overlay");
  const overlayClass = computed(() => {
    const cls = [ns.b()];
    if (props2.show)
      cls.push(ns.m("show"));
    return cls.join(" ");
  });
  const overlayStyle = computed(() => {
    const style = {};
    style.transitionDuration = `${isEmptyVariableInDefault(
      props2.duration,
      300
    )}ms`;
    style.backgroundColor = `rgba(0, 0, 0, ${isEmptyVariableInDefault(
      props2.opacity,
      0.5
    )})`;
    if (props2.zIndex)
      style.zIndex = props2.zIndex;
    return style;
  });
  const overlayClick = () => {
    emits("update:show", false);
    emits("click");
  };
  return {
    ns,
    overlayClass,
    overlayStyle,
    overlayClick
  };
};
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "overlay",
  props: overlayProps$1,
  emits: overlayEmits$1,
  setup(__props, { emit: __emit }) {
    const props2 = __props;
    const emits = __emit;
    const { overlayClass, overlayStyle, overlayClick } = useOverlay$1(props2, emits);
    return (_ctx, _cache) => {
      return {
        a: n(unref(overlayClass)),
        b: s(unref(overlayStyle)),
        c: o(
          //@ts-ignore
          (...args) => unref(overlayClick) && unref(overlayClick)(...args)
        ),
        d: o(() => {
        }),
        e: gei(_ctx, "")
      };
    };
  }
});
const Component$2 = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-052cb609"]]);
withNoopInstall(Component$2);
const popupOpenDirection$1 = [
  "top",
  "bottom",
  "left",
  "right",
  "center"
];
const popupCloseBtnPosition$1 = [
  "left-top",
  "right-top",
  "left-bottom",
  "right-bottom"
];
const popupProps$1 = buildProps({
  /**
   * @description 控制弹框是否显示
   */
  modelValue: Boolean,
  /**
   * @description 弹框打开的方向
   */
  openDirection: {
    type: String,
    values: popupOpenDirection$1,
    default: "center"
  },
  /**
   * @description 弹窗的宽度，在 openDirection 为 left 或 right 或 center 时生效
   */
  width: {
    type: [String, Number]
  },
  /**
   * @description 弹窗的高度，在 openDirection 为 top 或 bottom 或 center 时生效
   */
  height: {
    type: [String, Number]
  },
  /**
   * @description 弹框的内容的背景颜色
   */
  bgColor: {
    type: String,
    default: "#fff"
  },
  /**
   * @description 弹框的内容的圆角
   */
  radius: {
    type: [String, Number],
    default: 15
  },
  /**
   * @description 是否显示overlay遮罩层
   */
  overlay: {
    type: Boolean,
    default: true
  },
  /**
   * @description overlay遮罩层的透明度
   */
  overlayOpacity: overlayProps$1["opacity"],
  /**
   * @description 点击overlay关闭弹框
   */
  overlayCloseable: {
    type: Boolean,
    default: true
  },
  /**
   * @description 是否显示关闭按钮
   */
  closeBtn: Boolean,
  /**
   * @description 关闭按钮的位置
   */
  closeBtnPosition: {
    type: String,
    values: popupCloseBtnPosition$1,
    default: "right-top"
  },
  /**
   * @description 底部是否开启安全区域
   */
  safeAreaInsetBottom: useComponentSafeAreaInsetBottomProp,
  /**
   * @description zIndex
   */
  zIndex: {
    type: Number,
    default: ZIndex.popup
  },
  /**
   * @description 距离顶部的距离，在 openDirection 为 top 或 left 或 right 时生效，默认单位为`px`
   */
  top: {
    type: [String, Number]
  }
});
const popupEmits$1 = {
  [UPDATE_MODEL_EVENT]: (value2) => isBoolean(value2),
  open: () => true,
  close: () => true,
  ["overlay-click"]: () => true
};
const usePopupCustomStyle$1 = (props2) => {
  const ns = useNamespace("popup");
  const zIndex2 = computed(() => Number(props2.zIndex));
  const overlayZIndex = computed(() => zIndex2.value - 1);
  const [contentBgColorClass, contentBgColorStyle] = useComponentColor(
    toRef(props2, "bgColor"),
    "bg"
  );
  const popupContentClass = computed(() => {
    const cls = [ns.e("content")];
    if (props2.openDirection)
      cls.push(ns.em("content", props2.openDirection));
    if (props2.openDirection === "bottom" && props2.safeAreaInsetBottom) {
      cls.push("tn-u-safe-area");
    }
    if (contentBgColorClass.value)
      cls.push(contentBgColorClass.value);
    return cls.join(" ");
  });
  const popupContentStyle = computed(() => {
    const style = {};
    if (contentBgColorStyle.value)
      style.backgroundColor = contentBgColorStyle.value;
    if (props2.radius) {
      style.overflow = "hidden";
      if (props2.openDirection === "center") {
        style.borderRadius = formatDomSizeValue(props2.radius);
      }
      if (props2.openDirection === "top") {
        style.borderBottomLeftRadius = formatDomSizeValue(props2.radius);
        style.borderBottomRightRadius = formatDomSizeValue(props2.radius);
      }
      if (props2.openDirection === "left") {
        style.borderTopRightRadius = formatDomSizeValue(props2.radius);
        style.borderBottomRightRadius = formatDomSizeValue(props2.radius);
      }
      if (props2.openDirection === "right") {
        style.borderTopLeftRadius = formatDomSizeValue(props2.radius);
        style.borderBottomLeftRadius = formatDomSizeValue(props2.radius);
      }
      if (props2.openDirection === "bottom") {
        style.borderTopLeftRadius = formatDomSizeValue(props2.radius);
        style.borderTopRightRadius = formatDomSizeValue(props2.radius);
      }
    }
    if (props2.top && (props2.openDirection === "top" || props2.openDirection === "left" || props2.openDirection === "right")) {
      style.top = formatDomSizeValue(props2.top, "px");
    }
    if (props2.width && (props2.openDirection === "left" || props2.openDirection === "right" || props2.openDirection === "center")) {
      style.width = formatDomSizeValue(props2.width);
    }
    if (props2.height && (props2.openDirection === "top" || props2.openDirection === "bottom" || props2.openDirection === "center")) {
      style.height = formatDomSizeValue(props2.height);
    }
    if (props2.openDirection === "left" || props2.openDirection === "right") {
      if (props2.top)
        style.height = `calc(100% - ${formatDomSizeValue(props2.top, "px")})`;
    }
    style.zIndex = zIndex2.value;
    return style;
  });
  return {
    ns,
    zIndex: zIndex2,
    overlayZIndex,
    popupContentClass,
    popupContentStyle
  };
};
const usePopup$1 = (props2) => {
  const { emit: emit2 } = getCurrentInstance();
  const iosDevice = computed(() => {
    const systemInfo = index$1.getSystemInfoSync();
    return systemInfo.osName === "ios" || systemInfo.osName === "macos";
  });
  const showOverlay = ref(false);
  const showPopup = ref(false);
  const visiblePopup = ref(false);
  let initPopupModelValue = false;
  watch(
    () => props2.modelValue,
    (value2) => {
      if (value2) {
        visiblePopup.value = true;
        if (iosDevice.value) {
          setTimeout(() => {
            showPopup.value = true;
            if (props2.overlay)
              showOverlay.value = true;
            initPopupModelValue && emit2("open");
          }, 0);
        } else {
          showPopup.value = true;
          if (props2.overlay)
            showOverlay.value = true;
          initPopupModelValue && emit2("open");
        }
      } else {
        showPopup.value = false;
        showOverlay.value = false;
        setTimeout(() => {
          visiblePopup.value = false;
        }, 250);
        initPopupModelValue && emit2("close");
      }
      initPopupModelValue = true;
    },
    {
      immediate: true
    }
  );
  const updateModelValue = (value2) => {
    emit2(UPDATE_MODEL_EVENT, value2);
  };
  const onClickCloseBtn = () => {
    updateModelValue(false);
    emit2("close");
  };
  const onClickOverlay = () => {
    if (props2.overlayCloseable) {
      updateModelValue(false);
      emit2("close");
      emit2("overlay-click");
    }
  };
  return {
    iosDevice,
    showOverlay,
    showPopup,
    visiblePopup,
    updateModelValue,
    onClickCloseBtn,
    onClickOverlay
  };
};
const propgressBaseProps = buildProps({
  /**
   * @description 当前进度百分比
   */
  percent: {
    type: Number,
    default: 0
  },
  /**
   * @description 激活时的颜色，以tn开头则使用图鸟内置的颜色，在为圆环进度条是无法使用内置的颜色
   */
  activeColor: String,
  /**
   * @description 未激活时的颜色，以tn开头则使用图鸟内置的颜色，在为圆环进度条是无法使用内置的颜色
   */
  inactiveColor: String,
  /**
   * @description 显示当前进度
   */
  showPercent: Boolean,
  /**
   * @description 动画执行时间，单位ms
   */
  duration: {
    type: Number,
    default: 1500
  }
});
const circleProgressProps = buildProps({
  ...propgressBaseProps,
  /**
   * @description 圆环的半径，单位 px，只支持传递固定的值
   */
  radius: {
    type: Number,
    default: 50
  },
  /**
   * @description 圆环的宽度，单位 px，只支持传递固定的值
   */
  ringWidth: {
    type: Number,
    default: 7
  }
});
const useCircleProgress = (props2) => {
  const instance = getCurrentInstance();
  const ns = useNamespace("circle-progress");
  const radius = computed(() => {
    return isEmptyVariableInDefault(props2 == null ? void 0 : props2.radius, 50);
  });
  const ringWidth = computed(() => {
    return isEmptyVariableInDefault(props2 == null ? void 0 : props2.ringWidth, 14);
  });
  const circleColor = computed(() => {
    return isEmptyVariableInDefault(props2 == null ? void 0 : props2.inactiveColor, "#e6e6e6");
  });
  const activeCircleColor = computed(() => {
    return isEmptyVariableInDefault(props2 == null ? void 0 : props2.activeColor, "#01beff");
  });
  const duration = computed(() => {
    return isEmptyVariableInDefault(props2 == null ? void 0 : props2.duration, 1500);
  });
  let currentPercent = 0;
  let prevPercent = 0;
  const canvasId = String(generateId());
  let progressCanvas = null;
  const startAngle = -90 * (Math.PI / 180);
  const drawProgressCircle = (percent) => {
    if (!progressCanvas) {
      progressCanvas = index$1.createCanvasContext(canvasId, instance);
    }
    progressCanvas.clearRect(0, 0, radius.value * 2, radius.value * 2);
    progressCanvas.beginPath();
    progressCanvas.setLineWidth(ringWidth.value);
    progressCanvas.setStrokeStyle(circleColor.value);
    progressCanvas.arc(
      radius.value,
      radius.value,
      radius.value - ringWidth.value / 2,
      startAngle,
      Math.PI * 1.5,
      false
    );
    progressCanvas.stroke();
    if (percent === 0) {
      progressCanvas.draw();
      return;
    }
    progressCanvas.beginPath();
    progressCanvas.setLineCap("round");
    progressCanvas.setLineWidth(ringWidth.value);
    progressCanvas.setStrokeStyle(activeCircleColor.value);
    const endAngle = Math.PI * 2 * percent / 100 - Math.PI / 2;
    progressCanvas.arc(
      radius.value,
      radius.value,
      radius.value - ringWidth.value / 2,
      startAngle,
      endAngle,
      false
    );
    progressCanvas.stroke();
    progressCanvas.draw();
  };
  function easeOutCubic(t2, b, c, d) {
    return c * ((t2 = t2 / d - 1) * t2 * t2 + 1) + b;
  }
  let startTime = null;
  const progressAnimation = () => {
    if (!startTime)
      startTime = Date.now();
    const elapsed = Date.now() - startTime;
    let percent = easeOutCubic(
      elapsed,
      prevPercent,
      currentPercent - prevPercent,
      duration.value
    );
    if (percent < 0)
      percent = 0;
    drawProgressCircle(percent);
    if (elapsed < duration.value) {
      setTimeout(progressAnimation, 16);
    }
  };
  watch(
    () => props2.percent,
    (nVal, oVal) => {
      currentPercent = nVal > 100 ? 100 : nVal;
      prevPercent = !oVal || oVal < 0 ? 0 : oVal;
      nextTick$1(() => {
        startTime = null;
        progressAnimation();
      });
    },
    {
      immediate: true
    }
  );
  return {
    ns,
    canvasId,
    radius,
    activeCircleColor
  };
};
const scrollListProps = buildProps({
  /**
   * @description 是否显示指示器
   */
  indicator: {
    type: Boolean,
    default: true
  },
  /**
   * @description 指示器的宽度，单位 px
   */
  indicatorWidth: {
    type: Number,
    default: 40
  },
  /**
   * @description 指示器滑块的宽度，单位 px
   */
  indicatorBlockWidth: {
    type: Number,
    default: 20
  },
  /**
   * @description 指示器的背景颜色，以tn开头使用图鸟内置的颜色
   */
  indicatorColor: String,
  /**
   * @description 指示器滑块的背景颜色，以tn开头使用图鸟内置的颜色
   */
  indicatorBlockColor: String
});
const scrollListEmits = {
  /**
   * @description 滚动到左边时触发
   */
  "scroll-left": () => true,
  /**
   * @description 滚动到右边时触发
   */
  "scroll-right": () => true
};
const useScrollListCustomStyle = (props2) => {
  const ns = useNamespace("scroll-list");
  const [indicatorColorClass, indicatorColorStyle] = useComponentColor(
    toRef(props2, "indicatorColor"),
    "bg"
  );
  const [indicatorBlockColorClass, indicatorBlockColorStyle] = useComponentColor(toRef(props2, "indicatorBlockColor"), "bg");
  const indicatorClass = computed(() => {
    const cls = [ns.e("indicator")];
    if (indicatorColorClass.value)
      cls.push(indicatorColorClass.value);
    return cls.join(" ");
  });
  const indicatorStyle = computed(() => {
    const style = {};
    if (props2.indicatorWidth)
      style.width = formatDomSizeValue(props2.indicatorWidth, "px");
    if (!indicatorColorClass.value) {
      style.backgroundColor = indicatorColorStyle.value || "var(--tn-color-gray-disabled)";
    }
    return style;
  });
  const indicatorBlockClass = computed(() => {
    const cls = [ns.e("indicator-block")];
    if (indicatorBlockColorClass.value)
      cls.push(indicatorBlockColorClass.value);
    return cls.join(" ");
  });
  const indicatorBlockStyle = computed(
    () => {
      return (distance) => {
        const style = {};
        if (props2.indicatorBlockWidth)
          style.width = formatDomSizeValue(props2.indicatorBlockWidth, "px");
        style.left = `${distance}px`;
        if (!indicatorBlockColorClass.value) {
          style.backgroundColor = indicatorBlockColorStyle.value || "var(--tn-color-primary)";
        }
        return style;
      };
    }
  );
  return {
    ns,
    indicatorClass,
    indicatorStyle,
    indicatorBlockClass,
    indicatorBlockStyle
  };
};
const useScrollList = (props2, emits) => {
  const instance = getCurrentInstance();
  if (!instance) {
    debugWarn("TnScrollList", "请在setup函数中使用useScrollList");
  }
  const componentId = `tsl-${generateId()}`;
  const componentContentId = `${componentId}-content`;
  const { getSelectorNodeInfo } = useSelectorQuery(instance);
  let componentWidth = 0;
  let comoponentContentWidth = 0;
  const indicatorBlockScrollDistance = ref(0);
  let initCount = 0;
  const getContentRectInfo = async () => {
    try {
      const componentRectInfo = await getSelectorNodeInfo(`#${componentId}`);
      const contentRectInfo = await getSelectorNodeInfo(
        `#${componentContentId}`
      );
      initCount = 0;
      componentWidth = componentRectInfo.width || 0;
      comoponentContentWidth = contentRectInfo.width || 0;
    } catch (err) {
      if (initCount > 10) {
        initCount = 0;
        debugWarn("TnScrollList", `获取内容容器的宽度失败: ${err}`);
        return;
      }
      initCount++;
      setTimeout(() => {
        getContentRectInfo();
      }, 150);
    }
  };
  const scrollViewScrollEvent = (e2) => {
    const scrollLeft = e2.detail.scrollLeft;
    indicatorBlockScrollDistance.value = scrollLeft * (props2.indicatorWidth - props2.indicatorBlockWidth) / (comoponentContentWidth - componentWidth);
  };
  const scrollToLeftEvent = () => {
    emits("scroll-left");
  };
  const scrollToRightEvent = () => {
    emits("scroll-right");
  };
  onMounted(() => {
    nextTick$1(() => {
      getContentRectInfo();
    });
  });
  return {
    componentId,
    componentContentId,
    indicatorBlockScrollDistance,
    scrollViewScrollEvent,
    scrollToLeftEvent,
    scrollToRightEvent
  };
};
const props$7 = defineMixin({
  props: {
    // 是否显示组件
    show: {
      type: Boolean,
      default: () => defProps.loadingIcon.show
    },
    // 颜色
    color: {
      type: String,
      default: () => defProps.loadingIcon.color
    },
    // 提示文字颜色
    textColor: {
      type: String,
      default: () => defProps.loadingIcon.textColor
    },
    // 文字和图标是否垂直排列
    vertical: {
      type: Boolean,
      default: () => defProps.loadingIcon.vertical
    },
    // 模式选择，circle-圆形，spinner-花朵形，semicircle-半圆形
    mode: {
      type: String,
      default: () => defProps.loadingIcon.mode
    },
    // 图标大小，单位默认px
    size: {
      type: [String, Number],
      default: () => defProps.loadingIcon.size
    },
    // 文字大小
    textSize: {
      type: [String, Number],
      default: () => defProps.loadingIcon.textSize
    },
    // 文字内容
    text: {
      type: [String, Number],
      default: () => defProps.loadingIcon.text
    },
    // 动画模式
    timingFunction: {
      type: String,
      default: () => defProps.loadingIcon.timingFunction
    },
    // 动画执行周期时间
    duration: {
      type: [String, Number],
      default: () => defProps.loadingIcon.duration
    },
    // mode=circle时的暗边颜色
    inactiveColor: {
      type: String,
      default: () => defProps.loadingIcon.inactiveColor
    }
  }
});
const imageExtensions = [
  "jpg",
  "jpeg",
  "png",
  "gif",
  "webp",
  "ico"
];
const imageUploadProps = buildProps({
  /**
   * @description 已上传的图片列表绑定值，传递的是图片的url地址
   */
  modelValue: {
    type: definePropType(Array),
    default: () => []
  },
  /**
   * @description 禁止上传
   */
  disabled: Boolean,
  /**
   * @description 图片上传地址
   */
  action: String,
  /**
   * @description 图片上传的字段名称
   */
  name: {
    type: String,
    default: "file"
  },
  /**
   * @description 图片上传的header, header 中不能设置 Referer
   */
  header: {
    type: Object,
    default: () => ({})
  },
  /**
   * @description 图片上传HTTP 请求中其他额外的 form data
   */
  formData: {
    type: Object,
    default: () => ({})
  },
  /**
   * @description 最大允许上传个数
   */
  limit: {
    type: Number,
    default: 9
  },
  /**
   * @description 自动上传
   */
  autoUpload: {
    type: Boolean,
    default: true
  },
  /**
   * @description 显示删除按钮
   */
  showRemove: {
    type: Boolean,
    default: true
  },
  /**
   * @description 显示错误提示信息
   */
  showErrorTips: {
    type: Boolean,
    default: true
  },
  /**
   * @description 显示上传进度条
   */
  showUploadProgress: {
    type: Boolean,
    default: true
  },
  /**
   * @description 上传图片的SizeType
   */
  sizeType: {
    type: definePropType(Array),
    default: () => ["original", "compressed"]
  },
  /**
   * @description 上传图片的来源
   */
  sourceType: {
    type: definePropType(Array),
    default: () => ["album", "camera"]
  },
  /**
   * @description 允许多选图片
   */
  multiple: {
    type: Boolean,
    default: true
  },
  /**
   * @description 允许上传的最大图片大小，单位为byte
   */
  maxSize: {
    type: Number,
    default: 10 * 1024 * 1024
  },
  /**
   * @description 允许上传的图片类型
   */
  extensions: {
    type: definePropType(Array),
    default: () => imageExtensions
  },
  /**
   * @description 自动移除上传失败的图片
   */
  autoRemoveFaildFile: {
    type: Boolean,
    default: false
  },
  /**
   * @description 自定义上传函数
   */
  customUploadHandler: {
    type: definePropType(Function)
  },
  /**
   * @description 自定义上传回调处理函数
   */
  customUploadCallback: {
    type: definePropType(Function)
  },
  /**
   * @description 上传前的钩子函数
   */
  beforeUpload: {
    type: definePropType(Function)
  },
  /**
   * @description 删除前的钩子函数
   */
  beforeRemove: {
    type: definePropType(Function)
  },
  /**
   * @description 值发生修改时是否触发表单验证
   */
  validateEvent: {
    type: Boolean,
    default: true
  }
});
const imageUploadEmits = {
  [UPDATE_MODEL_EVENT]: (value2) => isArray$1(value2),
  [CHANGE_EVENT]: (value2) => isArray$1(value2),
  /**
   * @description 图片超过最大尺寸或者文件不支持时触发
   */
  oversizeOrNoSupport: (file) => true,
  /**
   * @description 图片上传成功回调
   */
  success: (file) => true,
  /**
   * @description 图片上传失败回调
   */
  fail: (error2, file) => true,
  /**
   * @description 图片删除成功回调
   */
  remove: (url2) => true,
  /**
   * @description 图片预览回调
   */
  preview: (url2) => true
};
const formMetaProps = buildProps({
  /**
   * @description 设置表单下组件的尺寸
   */
  size: {
    type: String,
    values: formComponentSizes
  },
  /**
   * @description 是否禁用表单内的所有组件，优先级比组件自身的禁用属性高
   */
  disabled: Boolean
});
const formProps = buildProps({
  ...formMetaProps,
  /**
   * @description 表单数据对象
   */
  model: Object,
  /**
   * @description 表单校验规则
   */
  rules: {
    type: definePropType([Object, Array])
  },
  /**
   * @description label标签位置
   */
  labelPosition: {
    type: String,
    values: ["left", "right", "top"],
    default: "right"
  },
  /**
   * @description 必填星号显示位置
   */
  requireAsteriskPosition: {
    type: String,
    values: ["left", "right"],
    default: "left"
  },
  /**
   * @description label的宽度，默认单位为rpx，支持传入数字、带单位的数值和auto
   */
  labelWidth: {
    type: [String, Number],
    default: ""
  },
  /**
   * @description 表单域标签的后缀
   */
  labelSuffix: {
    type: String,
    default: ""
  },
  /**
   * @description 是否在输入框中显示校验结果反馈图标
   */
  statusIcon: Boolean,
  /**
   * @description 是否显示校验结果
   */
  showMessage: {
    type: Boolean,
    default: true
  },
  /**
   * @description 是否在校验规则修改后立马触发一次校验
   */
  validateOnRuleChange: {
    type: Boolean,
    default: true
  },
  /**
   * @description 是否隐藏必填星号
   */
  hideRequiredAsterisk: Boolean
});
const formEmits = {
  validate: (prop, isValid, message) => (isArray$1(prop) || isString(prop)) && isBoolean(isValid) && isString(message)
};
const useFormCustomStyle = () => {
  const ns = useNamespace("form");
  const formClass = computed(() => {
    const cls = [ns.b()];
    return cls.join(" ");
  });
  return {
    formClass
  };
};
const useFormSize = (fallback, ignore = {}) => {
  const emptyRef = ref(void 0);
  const size2 = ignore.prop ? emptyRef : useProp("size");
  const form = ignore.form ? { size: void 0 } : inject(formContextKey, void 0);
  const formItem = ignore.formItem ? { size: void 0 } : inject(formItemContextKey, void 0);
  return computed(
    () => size2.value || unref(fallback) || (formItem == null ? void 0 : formItem.size) || (form == null ? void 0 : form.size) || ""
  );
};
const useFormDisabled = (fallback) => {
  const disabled = useProp("disabled");
  const form = inject(formContextKey, void 0);
  return computed(
    () => disabled.value || unref(fallback) || (form == null ? void 0 : form.disabled) || false
  );
};
const useFormItemCustomStyle = (props2, hasLabel, isRequired) => {
  const form = inject(formContextKey, void 0);
  const ns = useNamespace("form-item");
  const size2 = useFormSize(void 0, { formItem: false });
  const { getSelectorNodeInfo } = useSelectorQuery();
  const labelWidth = computed(
    () => formatDomSizeValue(props2.labelWidth || (form == null ? void 0 : form.labelWidth) || "")
  );
  const labelPosition = computed(
    () => props2.labelPosition || (form == null ? void 0 : form.labelPosition) || "right"
  );
  const hideRequiredAsterisk = computed(
    () => (form == null ? void 0 : form.hideRequiredAsterisk) || false
  );
  const requireAsteriskPosition = computed(
    () => (form == null ? void 0 : form.requireAsteriskPosition) || "left"
  );
  const labelContainerWidth = ref(0);
  const labelId = `label-${generateId()}`;
  const initLabelContainerWidth = () => {
    if (!hasLabel.value)
      return;
    getSelectorNodeInfo(`#${labelId}`).then((res) => {
      labelContainerWidth.value = (res == null ? void 0 : res.width) || 0;
    });
  };
  const formItemClass = computed(() => {
    const cls = [ns.b()];
    if (size2.value)
      cls.push(ns.m(size2.value));
    if (labelPosition.value)
      cls.push(ns.m(`label-${labelPosition.value}`));
    return cls.join(" ");
  });
  const formItemLabelClass = computed(() => {
    const cls = [ns.e("label")];
    if (!hideRequiredAsterisk.value && isRequired.value) {
      cls.push(
        ns.em("label", "required"),
        ns.em("label", `asterisk-${requireAsteriskPosition.value}`)
      );
    }
    return cls.join(" ");
  });
  const formItemLabelStyle = computed(() => {
    const style = {};
    if (labelPosition.value !== "top" && labelWidth.value)
      style.width = labelWidth.value;
    return style;
  });
  const formItemErrorMessageStyle = computed(() => {
    const style = {};
    if (labelPosition.value !== "top" && hasLabel.value) {
      style.paddingLeft = `${labelContainerWidth.value}px`;
    }
    return style;
  });
  return {
    ns,
    labelId,
    formItemClass,
    formItemLabelClass,
    formItemLabelStyle,
    formItemErrorMessageStyle,
    initLabelContainerWidth
  };
};
const useFormItem = () => {
  const form = inject(formContextKey, void 0);
  const formItem = inject(formItemContextKey, void 0);
  return {
    form,
    formItem
  };
};
const formatRegExp = /%[sdj%]/g;
let warning = () => {
};
if (typeof process !== "undefined" && process.env && true && typeof window !== "undefined" && typeof document !== "undefined") {
  warning = (type2, errors) => {
    if (typeof console !== "undefined" && console.warn && typeof ASYNC_VALIDATOR_NO_WARNING === "undefined") {
      if (errors.every((e2) => typeof e2 === "string")) {
        console.warn(type2, errors);
      }
    }
  };
}
function convertFieldsError(errors) {
  if (!errors || !errors.length)
    return null;
  const fields = {};
  errors.forEach((error2) => {
    const field = error2.field;
    fields[field] = fields[field] || [];
    fields[field].push(error2);
  });
  return fields;
}
function format(template, ...args) {
  let i = 0;
  const len = args.length;
  if (typeof template === "function") {
    return template.apply(null, args);
  }
  if (typeof template === "string") {
    let str = template.replace(formatRegExp, (x) => {
      if (x === "%%") {
        return "%";
      }
      if (i >= len) {
        return x;
      }
      switch (x) {
        case "%s":
          return String(args[i++]);
        case "%d":
          return Number(args[i++]);
        case "%j":
          try {
            return JSON.stringify(args[i++]);
          } catch (_) {
            return "[Circular]";
          }
          break;
        default:
          return x;
      }
    });
    return str;
  }
  return template;
}
function isNativeStringType(type2) {
  return type2 === "string" || type2 === "url" || type2 === "hex" || type2 === "email" || type2 === "date" || type2 === "pattern";
}
function isEmptyValue(value2, type2) {
  if (value2 === void 0 || value2 === null) {
    return true;
  }
  if (type2 === "array" && Array.isArray(value2) && !value2.length) {
    return true;
  }
  if (isNativeStringType(type2) && typeof value2 === "string" && !value2) {
    return true;
  }
  return false;
}
function asyncParallelArray(arr, func2, callback) {
  const results = [];
  let total = 0;
  const arrLength = arr.length;
  function count(errors) {
    results.push(...errors || []);
    total++;
    if (total === arrLength) {
      callback(results);
    }
  }
  arr.forEach((a) => {
    func2(a, count);
  });
}
function asyncSerialArray(arr, func2, callback) {
  let index2 = 0;
  const arrLength = arr.length;
  function next(errors) {
    if (errors && errors.length) {
      callback(errors);
      return;
    }
    const original = index2;
    index2 = index2 + 1;
    if (original < arrLength) {
      func2(arr[original], next);
    } else {
      callback([]);
    }
  }
  next([]);
}
function flattenObjArr(objArr) {
  const ret = [];
  Object.keys(objArr).forEach((k) => {
    ret.push(...objArr[k] || []);
  });
  return ret;
}
class AsyncValidationError2 extends Error {
  constructor(errors, fields) {
    super("Async Validation Error");
    this.errors = errors;
    this.fields = fields;
  }
}
function asyncMap(objArr, option, func2, callback, source) {
  if (option.first) {
    const pending2 = new Promise((resolve2, reject) => {
      const next = (errors) => {
        callback(errors);
        return errors.length ? reject(new AsyncValidationError2(errors, convertFieldsError(errors))) : resolve2(source);
      };
      const flattenArr = flattenObjArr(objArr);
      asyncSerialArray(flattenArr, func2, next);
    });
    pending2.catch((e2) => e2);
    return pending2;
  }
  const firstFields = option.firstFields === true ? Object.keys(objArr) : option.firstFields || [];
  const objArrKeys = Object.keys(objArr);
  const objArrLength = objArrKeys.length;
  let total = 0;
  const results = [];
  const pending = new Promise((resolve2, reject) => {
    const next = (errors) => {
      results.push.apply(results, errors);
      total++;
      if (total === objArrLength) {
        callback(results);
        return results.length ? reject(
          new AsyncValidationError2(results, convertFieldsError(results))
        ) : resolve2(source);
      }
    };
    if (!objArrKeys.length) {
      callback(results);
      resolve2(source);
    }
    objArrKeys.forEach((key) => {
      const arr = objArr[key];
      if (firstFields.indexOf(key) !== -1) {
        asyncSerialArray(arr, func2, next);
      } else {
        asyncParallelArray(arr, func2, next);
      }
    });
  });
  pending.catch((e2) => e2);
  return pending;
}
function isErrorObj(obj) {
  return !!(obj && obj.message !== void 0);
}
function getValue(value2, path) {
  let v = value2;
  for (let i = 0; i < path.length; i++) {
    if (v == void 0) {
      return v;
    }
    v = v[path[i]];
  }
  return v;
}
function complementError(rule, source) {
  return (oe) => {
    let fieldValue;
    if (rule.fullFields) {
      fieldValue = getValue(source, rule.fullFields);
    } else {
      fieldValue = source[oe.field || rule.fullField];
    }
    if (isErrorObj(oe)) {
      oe.field = oe.field || rule.fullField;
      oe.fieldValue = fieldValue;
      return oe;
    }
    return {
      message: typeof oe === "function" ? oe() : oe,
      fieldValue,
      field: oe.field || rule.fullField
    };
  };
}
function deepMerge(target, source) {
  if (source) {
    for (const s2 in source) {
      if (source.hasOwnProperty(s2)) {
        const value2 = source[s2];
        if (typeof value2 === "object" && typeof target[s2] === "object") {
          target[s2] = {
            ...target[s2],
            ...value2
          };
        } else {
          target[s2] = value2;
        }
      }
    }
  }
  return target;
}
const required$1 = (rule, value2, source, errors, options, type2) => {
  if (rule.required && (!source.hasOwnProperty(rule.field) || isEmptyValue(value2, type2 || rule.type))) {
    errors.push(format(options.messages.required, rule.fullField));
  }
};
const whitespace = (rule, value2, source, errors, options) => {
  if (/^\s+$/.test(value2) || value2 === "") {
    errors.push(format(options.messages.whitespace, rule.fullField));
  }
};
let urlReg;
const getUrlRegex = () => {
  if (urlReg) {
    return urlReg;
  }
  const word = "[a-fA-F\\d:]";
  const b = (options) => options && options.includeBoundaries ? `(?:(?<=\\s|^)(?=${word})|(?<=${word})(?=\\s|$))` : "";
  const v4 = "(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}";
  const v6seg = "[a-fA-F\\d]{1,4}";
  const v6 = `
(?:
(?:${v6seg}:){7}(?:${v6seg}|:)|                                    // 1:2:3:4:5:6:7::  1:2:3:4:5:6:7:8
(?:${v6seg}:){6}(?:${v4}|:${v6seg}|:)|                             // 1:2:3:4:5:6::    1:2:3:4:5:6::8   1:2:3:4:5:6::8  1:2:3:4:5:6::1.2.3.4
(?:${v6seg}:){5}(?::${v4}|(?::${v6seg}){1,2}|:)|                   // 1:2:3:4:5::      1:2:3:4:5::7:8   1:2:3:4:5::8    1:2:3:4:5::7:1.2.3.4
(?:${v6seg}:){4}(?:(?::${v6seg}){0,1}:${v4}|(?::${v6seg}){1,3}|:)| // 1:2:3:4::        1:2:3:4::6:7:8   1:2:3:4::8      1:2:3:4::6:7:1.2.3.4
(?:${v6seg}:){3}(?:(?::${v6seg}){0,2}:${v4}|(?::${v6seg}){1,4}|:)| // 1:2:3::          1:2:3::5:6:7:8   1:2:3::8        1:2:3::5:6:7:1.2.3.4
(?:${v6seg}:){2}(?:(?::${v6seg}){0,3}:${v4}|(?::${v6seg}){1,5}|:)| // 1:2::            1:2::4:5:6:7:8   1:2::8          1:2::4:5:6:7:1.2.3.4
(?:${v6seg}:){1}(?:(?::${v6seg}){0,4}:${v4}|(?::${v6seg}){1,6}|:)| // 1::              1::3:4:5:6:7:8   1::8            1::3:4:5:6:7:1.2.3.4
(?::(?:(?::${v6seg}){0,5}:${v4}|(?::${v6seg}){1,7}|:))             // ::2:3:4:5:6:7:8  ::2:3:4:5:6:7:8  ::8             ::1.2.3.4
)(?:%[0-9a-zA-Z]{1,})?                                             // %eth0            %1
`.replace(/\s*\/\/.*$/gm, "").replace(/\n/g, "").trim();
  const v46Exact = new RegExp(`(?:^${v4}$)|(?:^${v6}$)`);
  const v4exact = new RegExp(`^${v4}$`);
  const v6exact = new RegExp(`^${v6}$`);
  const ip = (options) => options && options.exact ? v46Exact : new RegExp(
    `(?:${b(options)}${v4}${b(options)})|(?:${b(options)}${v6}${b(
      options
    )})`,
    "g"
  );
  ip.v4 = (options) => options && options.exact ? v4exact : new RegExp(`${b(options)}${v4}${b(options)}`, "g");
  ip.v6 = (options) => options && options.exact ? v6exact : new RegExp(`${b(options)}${v6}${b(options)}`, "g");
  const protocol = `(?:(?:[a-z]+:)?//)`;
  const auth = "(?:\\S+(?::\\S*)?@)?";
  const ipv4 = ip.v4().source;
  const ipv6 = ip.v6().source;
  const host2 = "(?:(?:[a-z\\u00a1-\\uffff0-9][-_]*)*[a-z\\u00a1-\\uffff0-9]+)";
  const domain = "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*";
  const tld = `(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))`;
  const port = "(?::\\d{2,5})?";
  const path = '(?:[/?#][^\\s"]*)?';
  const regex = `(?:${protocol}|www\\.)${auth}(?:localhost|${ipv4}|${ipv6}|${host2}${domain}${tld})${port}${path}`;
  urlReg = new RegExp(`(?:^${regex}$)`, "i");
  return urlReg;
};
const pattern$2 = {
  // http://emailregex.com/
  email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+\.)+[a-zA-Z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]{2,}))$/,
  // url: new RegExp(
  //   '^(?!mailto:)(?:(?:http|https|ftp)://|//)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-*)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-*)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$',
  //   'i',
  // ),
  hex: /^#?([a-f0-9]{6}|[a-f0-9]{3})$/i
};
const types = {
  integer(value2) {
    return types.number(value2) && parseInt(value2, 10) === value2;
  },
  float(value2) {
    return types.number(value2) && !types.integer(value2);
  },
  array(value2) {
    return Array.isArray(value2);
  },
  regexp(value2) {
    if (value2 instanceof RegExp) {
      return true;
    }
    try {
      return !!new RegExp(value2);
    } catch (e2) {
      return false;
    }
  },
  date(value2) {
    return typeof value2.getTime === "function" && typeof value2.getMonth === "function" && typeof value2.getYear === "function" && !isNaN(value2.getTime());
  },
  number(value2) {
    if (isNaN(value2)) {
      return false;
    }
    return typeof value2 === "number";
  },
  object(value2) {
    return typeof value2 === "object" && !types.array(value2);
  },
  method(value2) {
    return typeof value2 === "function";
  },
  email(value2) {
    return typeof value2 === "string" && value2.length <= 320 && !!value2.match(pattern$2.email);
  },
  url(value2) {
    return typeof value2 === "string" && value2.length <= 2048 && !!value2.match(getUrlRegex());
  },
  hex(value2) {
    return typeof value2 === "string" && !!value2.match(pattern$2.hex);
  }
};
const type$1 = (rule, value2, source, errors, options) => {
  if (rule.required && value2 === void 0) {
    required$1(rule, value2, source, errors, options);
    return;
  }
  const custom = [
    "integer",
    "float",
    "array",
    "regexp",
    "object",
    "method",
    "email",
    "number",
    "date",
    "url",
    "hex"
  ];
  const ruleType = rule.type;
  if (custom.indexOf(ruleType) > -1) {
    if (!types[ruleType](value2)) {
      errors.push(
        format(options.messages.types[ruleType], rule.fullField, rule.type)
      );
    }
  } else if (ruleType && typeof value2 !== rule.type) {
    errors.push(
      format(options.messages.types[ruleType], rule.fullField, rule.type)
    );
  }
};
const range = (rule, value2, source, errors, options) => {
  const len = typeof rule.len === "number";
  const min = typeof rule.min === "number";
  const max = typeof rule.max === "number";
  const spRegexp = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
  let val = value2;
  let key = null;
  const num = typeof value2 === "number";
  const str = typeof value2 === "string";
  const arr = Array.isArray(value2);
  if (num) {
    key = "number";
  } else if (str) {
    key = "string";
  } else if (arr) {
    key = "array";
  }
  if (!key) {
    return false;
  }
  if (arr) {
    val = value2.length;
  }
  if (str) {
    val = value2.replace(spRegexp, "_").length;
  }
  if (len) {
    if (val !== rule.len) {
      errors.push(format(options.messages[key].len, rule.fullField, rule.len));
    }
  } else if (min && !max && val < rule.min) {
    errors.push(format(options.messages[key].min, rule.fullField, rule.min));
  } else if (max && !min && val > rule.max) {
    errors.push(format(options.messages[key].max, rule.fullField, rule.max));
  } else if (min && max && (val < rule.min || val > rule.max)) {
    errors.push(
      format(options.messages[key].range, rule.fullField, rule.min, rule.max)
    );
  }
};
const ENUM$1 = "enum";
const enumerable$1 = (rule, value2, source, errors, options) => {
  rule[ENUM$1] = Array.isArray(rule[ENUM$1]) ? rule[ENUM$1] : [];
  if (rule[ENUM$1].indexOf(value2) === -1) {
    errors.push(
      format(options.messages[ENUM$1], rule.fullField, rule[ENUM$1].join(", "))
    );
  }
};
const pattern$1 = (rule, value2, source, errors, options) => {
  if (rule.pattern) {
    if (rule.pattern instanceof RegExp) {
      rule.pattern.lastIndex = 0;
      if (!rule.pattern.test(value2)) {
        errors.push(
          format(
            options.messages.pattern.mismatch,
            rule.fullField,
            value2,
            rule.pattern
          )
        );
      }
    } else if (typeof rule.pattern === "string") {
      const _pattern = new RegExp(rule.pattern);
      if (!_pattern.test(value2)) {
        errors.push(
          format(
            options.messages.pattern.mismatch,
            rule.fullField,
            value2,
            rule.pattern
          )
        );
      }
    }
  }
};
const rules = {
  required: required$1,
  whitespace,
  type: type$1,
  range,
  enum: enumerable$1,
  pattern: pattern$1
};
const string = (rule, value2, callback, source, options) => {
  const errors = [];
  const validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
  if (validate) {
    if (isEmptyValue(value2, "string") && !rule.required) {
      return callback();
    }
    rules.required(rule, value2, source, errors, options, "string");
    if (!isEmptyValue(value2, "string")) {
      rules.type(rule, value2, source, errors, options);
      rules.range(rule, value2, source, errors, options);
      rules.pattern(rule, value2, source, errors, options);
      if (rule.whitespace === true) {
        rules.whitespace(rule, value2, source, errors, options);
      }
    }
  }
  callback(errors);
};
const method = (rule, value2, callback, source, options) => {
  const errors = [];
  const validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
  if (validate) {
    if (isEmptyValue(value2) && !rule.required) {
      return callback();
    }
    rules.required(rule, value2, source, errors, options);
    if (value2 !== void 0) {
      rules.type(rule, value2, source, errors, options);
    }
  }
  callback(errors);
};
const number = (rule, value2, callback, source, options) => {
  const errors = [];
  const validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
  if (validate) {
    if (value2 === "") {
      value2 = void 0;
    }
    if (isEmptyValue(value2) && !rule.required) {
      return callback();
    }
    rules.required(rule, value2, source, errors, options);
    if (value2 !== void 0) {
      rules.type(rule, value2, source, errors, options);
      rules.range(rule, value2, source, errors, options);
    }
  }
  callback(errors);
};
const boolean = (rule, value2, callback, source, options) => {
  const errors = [];
  const validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
  if (validate) {
    if (isEmptyValue(value2) && !rule.required) {
      return callback();
    }
    rules.required(rule, value2, source, errors, options);
    if (value2 !== void 0) {
      rules.type(rule, value2, source, errors, options);
    }
  }
  callback(errors);
};
const regexp = (rule, value2, callback, source, options) => {
  const errors = [];
  const validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
  if (validate) {
    if (isEmptyValue(value2) && !rule.required) {
      return callback();
    }
    rules.required(rule, value2, source, errors, options);
    if (!isEmptyValue(value2)) {
      rules.type(rule, value2, source, errors, options);
    }
  }
  callback(errors);
};
const integer = (rule, value2, callback, source, options) => {
  const errors = [];
  const validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
  if (validate) {
    if (isEmptyValue(value2) && !rule.required) {
      return callback();
    }
    rules.required(rule, value2, source, errors, options);
    if (value2 !== void 0) {
      rules.type(rule, value2, source, errors, options);
      rules.range(rule, value2, source, errors, options);
    }
  }
  callback(errors);
};
const floatFn = (rule, value2, callback, source, options) => {
  const errors = [];
  const validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
  if (validate) {
    if (isEmptyValue(value2) && !rule.required) {
      return callback();
    }
    rules.required(rule, value2, source, errors, options);
    if (value2 !== void 0) {
      rules.type(rule, value2, source, errors, options);
      rules.range(rule, value2, source, errors, options);
    }
  }
  callback(errors);
};
const array = (rule, value2, callback, source, options) => {
  const errors = [];
  const validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
  if (validate) {
    if ((value2 === void 0 || value2 === null) && !rule.required) {
      return callback();
    }
    rules.required(rule, value2, source, errors, options, "array");
    if (value2 !== void 0 && value2 !== null) {
      rules.type(rule, value2, source, errors, options);
      rules.range(rule, value2, source, errors, options);
    }
  }
  callback(errors);
};
const object = (rule, value2, callback, source, options) => {
  const errors = [];
  const validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
  if (validate) {
    if (isEmptyValue(value2) && !rule.required) {
      return callback();
    }
    rules.required(rule, value2, source, errors, options);
    if (value2 !== void 0) {
      rules.type(rule, value2, source, errors, options);
    }
  }
  callback(errors);
};
const ENUM = "enum";
const enumerable = (rule, value2, callback, source, options) => {
  const errors = [];
  const validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
  if (validate) {
    if (isEmptyValue(value2) && !rule.required) {
      return callback();
    }
    rules.required(rule, value2, source, errors, options);
    if (value2 !== void 0) {
      rules[ENUM](rule, value2, source, errors, options);
    }
  }
  callback(errors);
};
const pattern = (rule, value2, callback, source, options) => {
  const errors = [];
  const validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
  if (validate) {
    if (isEmptyValue(value2, "string") && !rule.required) {
      return callback();
    }
    rules.required(rule, value2, source, errors, options);
    if (!isEmptyValue(value2, "string")) {
      rules.pattern(rule, value2, source, errors, options);
    }
  }
  callback(errors);
};
const date = (rule, value2, callback, source, options) => {
  const errors = [];
  const validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
  if (validate) {
    if (isEmptyValue(value2, "date") && !rule.required) {
      return callback();
    }
    rules.required(rule, value2, source, errors, options);
    if (!isEmptyValue(value2, "date")) {
      let dateObject;
      if (value2 instanceof Date) {
        dateObject = value2;
      } else {
        dateObject = new Date(value2);
      }
      rules.type(rule, dateObject, source, errors, options);
      if (dateObject) {
        rules.range(rule, dateObject.getTime(), source, errors, options);
      }
    }
  }
  callback(errors);
};
const required = (rule, value2, callback, source, options) => {
  const errors = [];
  const type2 = Array.isArray(value2) ? "array" : typeof value2;
  rules.required(rule, value2, source, errors, options, type2);
  callback(errors);
};
const type = (rule, value2, callback, source, options) => {
  const ruleType = rule.type;
  const errors = [];
  const validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
  if (validate) {
    if (isEmptyValue(value2, ruleType) && !rule.required) {
      return callback();
    }
    rules.required(rule, value2, source, errors, options, ruleType);
    if (!isEmptyValue(value2, ruleType)) {
      rules.type(rule, value2, source, errors, options);
    }
  }
  callback(errors);
};
const any = (rule, value2, callback, source, options) => {
  const errors = [];
  const validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
  if (validate) {
    if (isEmptyValue(value2) && !rule.required) {
      return callback();
    }
    rules.required(rule, value2, source, errors, options);
  }
  callback(errors);
};
const validators = {
  string,
  method,
  number,
  boolean,
  regexp,
  integer,
  float: floatFn,
  array,
  object,
  enum: enumerable,
  pattern,
  date,
  url: type,
  hex: type,
  email: type,
  required,
  any
};
function newMessages() {
  return {
    default: "Validation error on field %s",
    required: "%s is required",
    enum: "%s must be one of %s",
    whitespace: "%s cannot be empty",
    date: {
      format: "%s date %s is invalid for format %s",
      parse: "%s date could not be parsed, %s is invalid ",
      invalid: "%s date %s is invalid"
    },
    types: {
      string: "%s is not a %s",
      method: "%s is not a %s (function)",
      array: "%s is not an %s",
      object: "%s is not an %s",
      number: "%s is not a %s",
      date: "%s is not a %s",
      boolean: "%s is not a %s",
      integer: "%s is not an %s",
      float: "%s is not a %s",
      regexp: "%s is not a valid %s",
      email: "%s is not a valid %s",
      url: "%s is not a valid %s",
      hex: "%s is not a valid %s"
    },
    string: {
      len: "%s must be exactly %s characters",
      min: "%s must be at least %s characters",
      max: "%s cannot be longer than %s characters",
      range: "%s must be between %s and %s characters"
    },
    number: {
      len: "%s must equal %s",
      min: "%s cannot be less than %s",
      max: "%s cannot be greater than %s",
      range: "%s must be between %s and %s"
    },
    array: {
      len: "%s must be exactly %s in length",
      min: "%s cannot be less than %s in length",
      max: "%s cannot be greater than %s in length",
      range: "%s must be between %s and %s in length"
    },
    pattern: {
      mismatch: "%s value %s does not match pattern %s"
    },
    clone() {
      const cloned = JSON.parse(JSON.stringify(this));
      cloned.clone = this.clone;
      return cloned;
    }
  };
}
const messages = newMessages();
const _Schema = class _Schema {
  constructor(descriptor) {
    this.rules = null;
    this._messages = messages;
    this.define(descriptor);
  }
  define(rules2) {
    if (!rules2) {
      throw new Error("Cannot configure a schema with no rules");
    }
    if (typeof rules2 !== "object" || Array.isArray(rules2)) {
      throw new Error("Rules must be an object");
    }
    this.rules = {};
    Object.keys(rules2).forEach((name) => {
      const item = rules2[name];
      this.rules[name] = Array.isArray(item) ? item : [item];
    });
  }
  messages(messages2) {
    if (messages2) {
      this._messages = deepMerge(newMessages(), messages2);
    }
    return this._messages;
  }
  validate(source_, o2 = {}, oc = () => {
  }) {
    let source = source_;
    let options = o2;
    let callback = oc;
    if (typeof options === "function") {
      callback = options;
      options = {};
    }
    if (!this.rules || Object.keys(this.rules).length === 0) {
      if (callback) {
        callback(null, source);
      }
      return Promise.resolve(source);
    }
    function complete(results) {
      let errors = [];
      let fields = {};
      function add2(e2) {
        if (Array.isArray(e2)) {
          errors = errors.concat(...e2);
        } else {
          errors.push(e2);
        }
      }
      for (let i = 0; i < results.length; i++) {
        add2(results[i]);
      }
      if (!errors.length) {
        callback(null, source);
      } else {
        fields = convertFieldsError(errors);
        callback(errors, fields);
      }
    }
    if (options.messages) {
      let messages$12 = this.messages();
      if (messages$12 === messages) {
        messages$12 = newMessages();
      }
      deepMerge(messages$12, options.messages);
      options.messages = messages$12;
    } else {
      options.messages = this.messages();
    }
    const series = {};
    const keys = options.keys || Object.keys(this.rules);
    keys.forEach((z) => {
      const arr = this.rules[z];
      let value2 = source[z];
      arr.forEach((r2) => {
        let rule = r2;
        if (typeof rule.transform === "function") {
          if (source === source_) {
            source = { ...source };
          }
          value2 = source[z] = rule.transform(value2);
        }
        if (typeof rule === "function") {
          rule = {
            validator: rule
          };
        } else {
          rule = { ...rule };
        }
        rule.validator = this.getValidationMethod(rule);
        if (!rule.validator) {
          return;
        }
        rule.field = z;
        rule.fullField = rule.fullField || z;
        rule.type = this.getType(rule);
        series[z] = series[z] || [];
        series[z].push({
          rule,
          value: value2,
          source,
          field: z
        });
      });
    });
    const errorFields = {};
    return asyncMap(
      series,
      options,
      (data, doIt) => {
        var _a2;
        const rule = data.rule;
        let deep = (rule.type === "object" || rule.type === "array") && (typeof rule.fields === "object" || typeof rule.defaultField === "object");
        deep = deep && (rule.required || !rule.required && data.value);
        rule.field = data.field;
        function addFullField(key, schema) {
          return {
            ...schema,
            fullField: `${rule.fullField}.${key}`,
            fullFields: rule.fullFields ? [...rule.fullFields, key] : [key]
          };
        }
        function cb(e2 = []) {
          let errorList = Array.isArray(e2) ? e2 : [e2];
          if (!options.suppressWarning && errorList.length) {
            _Schema.warning("async-validator:", errorList);
          }
          if (errorList.length && rule.message !== void 0) {
            errorList = [].concat(rule.message);
          }
          let filledErrors = errorList.map(complementError(rule, source));
          if (options.first && filledErrors.length) {
            errorFields[rule.field] = 1;
            return doIt(filledErrors);
          }
          if (!deep) {
            doIt(filledErrors);
          } else {
            if (rule.required && !data.value) {
              if (rule.message !== void 0) {
                filledErrors = [].concat(rule.message).map(complementError(rule, source));
              } else if (options.error) {
                filledErrors = [
                  options.error(
                    rule,
                    format(options.messages.required, rule.field)
                  )
                ];
              }
              return doIt(filledErrors);
            }
            let fieldsSchema = {};
            if (rule.defaultField) {
              Object.keys(data.value).map((key) => {
                fieldsSchema[key] = rule.defaultField;
              });
            }
            fieldsSchema = {
              ...fieldsSchema,
              ...data.rule.fields
            };
            const paredFieldsSchema = {};
            Object.keys(fieldsSchema).forEach((field) => {
              const fieldSchema = fieldsSchema[field];
              const fieldSchemaList = Array.isArray(fieldSchema) ? fieldSchema : [fieldSchema];
              paredFieldsSchema[field] = fieldSchemaList.map(
                addFullField.bind(null, field)
              );
            });
            const schema = new _Schema(paredFieldsSchema);
            schema.messages(options.messages);
            if (data.rule.options) {
              data.rule.options.messages = options.messages;
              data.rule.options.error = options.error;
            }
            schema.validate(data.value, data.rule.options || options, (errs) => {
              const finalErrors = [];
              if (filledErrors && filledErrors.length) {
                finalErrors.push(...filledErrors);
              }
              if (errs && errs.length) {
                finalErrors.push(...errs);
              }
              doIt(finalErrors.length ? finalErrors : null);
            });
          }
        }
        let res;
        if (rule.asyncValidator) {
          res = rule.asyncValidator(rule, data.value, cb, data.source, options);
        } else if (rule.validator) {
          try {
            res = rule.validator(rule, data.value, cb, data.source, options);
          } catch (error2) {
            (_a2 = console.error) == null ? void 0 : _a2.call(console, error2);
            if (!options.suppressValidatorError) {
              setTimeout(() => {
                throw error2;
              }, 0);
            }
            cb(error2.message);
          }
          if (res === true) {
            cb();
          } else if (res === false) {
            cb(
              typeof rule.message === "function" ? rule.message(rule.fullField || rule.field) : rule.message || `${rule.fullField || rule.field} fails`
            );
          } else if (res instanceof Array) {
            cb(res);
          } else if (res instanceof Error) {
            cb(res.message);
          }
        }
        if (res && res.then) {
          res.then(
            () => cb(),
            (e2) => cb(e2)
          );
        }
      },
      (results) => {
        complete(results);
      },
      source
    );
  }
  getType(rule) {
    if (rule.type === void 0 && rule.pattern instanceof RegExp) {
      rule.type = "pattern";
    }
    if (typeof rule.validator !== "function" && rule.type && !validators.hasOwnProperty(rule.type)) {
      throw new Error(format("Unknown rule type %s", rule.type));
    }
    return rule.type || "string";
  }
  getValidationMethod(rule) {
    if (typeof rule.validator === "function") {
      return rule.validator;
    }
    const keys = Object.keys(rule);
    const messageIndex = keys.indexOf("message");
    if (messageIndex !== -1) {
      keys.splice(messageIndex, 1);
    }
    if (keys.length === 1 && keys[0] === "required") {
      return validators.required;
    }
    return validators[this.getType(rule)] || void 0;
  }
};
_Schema.register = function register(type2, validator) {
  if (typeof validator !== "function") {
    throw new Error(
      "Cannot register a validator by type, validator is not a function"
    );
  }
  validators[type2] = validator;
};
_Schema.warning = warning;
_Schema.messages = messages;
_Schema.validators = validators;
let Schema = _Schema;
const useFormItemOperation = (props2, slots) => {
  const formContext = inject(formContextKey, void 0);
  let initialValue = void 0;
  let isResettingField = false;
  const validateState = ref("");
  const validateStateDebounced = ref("");
  const validateMessage = ref("");
  const hasLabel = computed(() => {
    return !!(props2.label || slots.label);
  });
  const currentLabel = computed(
    () => `${props2.label || ""}${(formContext == null ? void 0 : formContext.labelSuffix) || ""}`
  );
  const fieldValue = computed(() => {
    const model = formContext == null ? void 0 : formContext.model;
    if (!model || !props2.prop) {
      return;
    }
    return getProp(model, props2.prop).value;
  });
  const propString = computed(() => {
    if (!props2.prop)
      return "";
    return isString(props2.prop) ? props2.prop : props2.prop.join(".");
  });
  const normalizedRules = computed(() => {
    const rules2 = [];
    if (props2.rules)
      rules2.push(...castArray(props2.rules));
    const formRules = formContext == null ? void 0 : formContext.rules;
    if (formRules && props2.prop) {
      const _rules = getProp(
        formRules,
        props2.prop
      ).value;
      if (_rules)
        rules2.push(...castArray(_rules));
    }
    if (props2.required !== void 0) {
      const requiredRules = rules2.map((rule, index2) => [rule, index2]).filter(([rule]) => Object.keys(rule).includes("required"));
      if (requiredRules.length) {
        for (const [rule, index2] of requiredRules) {
          if (rule.required === props2.required)
            continue;
          rules2[index2] = { ...rule, required: props2.required };
        }
      } else {
        rules2.push({ required: props2.required });
      }
    }
    return rules2;
  });
  const validateEnabled = computed(() => normalizedRules.value.length > 0);
  const isRequired = computed(
    () => normalizedRules.value.some((rule) => rule.required)
  );
  const shouldShowError = computed(
    () => validateStateDebounced.value === "error" && props2.showMessage && isEmptyVariableInDefault(formContext == null ? void 0 : formContext.showMessage, true)
  );
  const setValidateState = (state) => {
    validateState.value = state;
  };
  const getFilterRule = (trigger2) => {
    const rules2 = normalizedRules.value;
    return rules2.filter((rule) => {
      if (!rule.trigger || !trigger2)
        return true;
      if (Array.isArray(rule.trigger)) {
        return rule.trigger.includes(trigger2);
      } else {
        return rule.trigger === trigger2;
      }
    }).map(({ trigger: trigger22, ...rule }) => rule);
  };
  const onValidationFailed = (error2) => {
    var _a2;
    const { errors, fields } = error2;
    if (!errors || !fields) {
      console.error(error2);
    }
    setValidateState("error");
    validateMessage.value = errors ? isEmptyVariableInDefault((_a2 = errors == null ? void 0 : errors[0]) == null ? void 0 : _a2.message, `${props2.prop} 为必填项`) : "";
    formContext == null ? void 0 : formContext.emits("validate", props2.prop, false, validateMessage.value);
  };
  const onValidationSucceded = () => {
    setValidateState("success");
    validateMessage.value = "";
    formContext == null ? void 0 : formContext.emits("validate", props2.prop, true, "");
  };
  const doValidate = async (rules2) => {
    const modelName = propString.value;
    const validator = new Schema({
      [modelName]: rules2
    });
    return validator.validate({ [modelName]: fieldValue.value }, { firstFields: true }).then(() => {
      onValidationSucceded();
      return true;
    }).catch((err) => {
      onValidationFailed(err);
      return Promise.reject(err);
    });
  };
  const validate = async (trigger2, callback) => {
    if (isResettingField || !props2.prop)
      return false;
    const hasCallback2 = isFunction(callback);
    if (!validateEnabled.value) {
      callback == null ? void 0 : callback(false);
      return false;
    }
    const rules2 = getFilterRule(trigger2);
    if (rules2.length === 0) {
      callback == null ? void 0 : callback(true);
      return true;
    }
    setValidateState("validating");
    return doValidate(rules2).then(() => {
      callback == null ? void 0 : callback(true);
      return true;
    }).catch((err) => {
      const { fields } = err;
      callback == null ? void 0 : callback(false, fields);
      return hasCallback2 ? false : Promise.reject(fields);
    });
  };
  const clearValidate = () => {
    setValidateState("");
    validateMessage.value = "";
    isResettingField = false;
  };
  const resetField = async () => {
    const model = formContext == null ? void 0 : formContext.model;
    if (!model || !props2.prop)
      return;
    const computedValue = getProp(model, props2.prop);
    isResettingField = true;
    computedValue.value = cloneDeep(initialValue);
    await nextTick$1();
    clearValidate();
    isResettingField = false;
  };
  const initFieldValue = () => {
    initialValue = cloneDeep(fieldValue.value);
  };
  const validateStateDebouncedUpdater = debounce(() => {
    validateStateDebounced.value = validateState.value;
  }, 100);
  watch(
    () => validateState.value,
    () => validateStateDebouncedUpdater()
  );
  watch(
    () => props2.error,
    (val) => {
      validateMessage.value = val || "";
      setValidateState(val ? "error" : "");
    },
    {
      immediate: true
    }
  );
  watch(
    () => props2.validateStatus,
    (val) => {
      setValidateState(val || "");
    }
  );
  return {
    formContext,
    hasLabel,
    currentLabel,
    validateState,
    validateMessage,
    isRequired,
    shouldShowError,
    doValidate,
    validate,
    clearValidate,
    resetField,
    initFieldValue
  };
};
const filterFields = (fields, props2) => {
  const normalized = castArray(props2);
  return normalized.length > 0 ? fields.filter((field) => field.prop && normalized.includes(field.prop)) : fields;
};
const useForm = (props2) => {
  const fields = [];
  const addField = (field) => {
    fields.push(field);
  };
  const removeField = (field) => {
    if (field.prop) {
      fields.splice(fields.indexOf(field), 1);
    }
  };
  const resetFields = (properties = []) => {
    if (!props2.model) {
      return console.warn("[TnForm] model参数未定义");
    }
    filterFields(fields, properties).forEach((field) => field.resetField());
  };
  const clearValidate = (props22 = []) => {
    filterFields(fields, props22).forEach((field) => field.clearValidate());
  };
  const isValidatable = computed(() => {
    const hasModel = !!props2.model;
    if (!hasModel) {
      console.warn("[TnForm] model参数未定义");
    }
    return hasModel;
  });
  const obtainValidateFields = (props22) => {
    if (fields.length === 0)
      return [];
    const filteredFields = filterFields(fields, props22);
    if (!filteredFields.length) {
      console.warn("[TnForm] 未找到需要校验的字段");
      return [];
    }
    return filteredFields;
  };
  const validate = async (callback) => validateField(void 0, callback);
  const doValidateField = async (props22) => {
    if (!isValidatable.value)
      return false;
    const fields2 = obtainValidateFields(props22);
    if (fields2.length === 0)
      return false;
    let validationErrors = {};
    for (const field of fields2) {
      try {
        await field.validate("");
      } catch (fields3) {
        validationErrors = {
          ...validationErrors,
          ...fields3
        };
      }
    }
    if (Object.keys(validationErrors).length === 0)
      return true;
    return Promise.reject(validationErrors);
  };
  const validateField = async (modelProps = [], callback) => {
    const shouldThrow = !isFunction(callback);
    try {
      const result = await doValidateField(modelProps);
      if (result === true) {
        callback == null ? void 0 : callback(true);
      }
      return result;
    } catch (e2) {
      if (e2 instanceof Error)
        throw e2;
      const invalidFields = e2;
      callback == null ? void 0 : callback(false, invalidFields);
      return shouldThrow && Promise.reject(invalidFields);
    }
  };
  return {
    addField,
    removeField,
    resetFields,
    clearValidate,
    validate,
    validateField
  };
};
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "form",
  props: formProps,
  emits: formEmits,
  setup(__props, { expose: __expose, emit: __emit }) {
    const props2 = __props;
    const emits = __emit;
    const { formClass } = useFormCustomStyle();
    const {
      addField,
      removeField,
      resetFields,
      clearValidate,
      validate,
      validateField
    } = useForm(props2);
    watch(
      () => props2.rules,
      () => {
        if (props2.validateOnRuleChange)
          validate();
      },
      {
        deep: true
      }
    );
    provide(
      formContextKey,
      reactive({
        ...toRefs(props2),
        emits,
        resetFields,
        clearValidate,
        validateField,
        addField,
        removeField
      })
    );
    __expose({
      /**
       * @description 对整个表单的内容进行验证。 接收一个回调函数或返回Promise
       */
      validate,
      /**
       * @description 验证具体的某个字段
       */
      validateField,
      /**
       * @description 重置表单
       */
      resetFields,
      /**
       * @description 清除表单验证
       */
      clearValidate
    });
    return (_ctx, _cache) => {
      return {
        a: n(unref(formClass)),
        b: gei(_ctx, "")
      };
    };
  }
});
const Form = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-e202e7e7"]]);
const formItemValidateStates = [
  "",
  "error",
  "validating",
  "success"
];
const formItemProps = buildProps({
  /**
   * @description label文本
   */
  label: String,
  /**
   * @description label的宽度，默认单位为rpx，支持传入数字和auto
   */
  labelWidth: {
    type: [String, Number],
    default: ""
  },
  /**
   * @description label标签位置
   */
  labelPosition: {
    type: String,
    values: ["left", "right", "top"],
    default: ""
  },
  /**
   * @description model中的key，如果需要使用校验，该字段为必填，可以是一个路径数组(['user', 'name', 0])
   */
  prop: {
    type: definePropType([String, Array])
  },
  /**
   * @description 标记字段是否为必填，如果不填写则根据校验规则自动生成
   */
  required: {
    type: Boolean,
    default: void 0
  },
  /**
   * @description 表单校验规则
   */
  rules: {
    type: definePropType([Object, Array])
  },
  /**
   * @description 字段错误信息，如果设置了该字段则校验状态会变成error，并显示该字段的内容
   */
  error: String,
  /**
   * @description 校验状态
   */
  validateStatus: {
    type: String,
    values: formItemValidateStates
  },
  /**
   * @description 是否显示校验结果
   */
  showMessage: {
    type: Boolean,
    default: true
  },
  /**
   * @description 控制表单组件尺寸
   */
  size: {
    type: String,
    values: formComponentSizes
  }
});
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "form-item",
  props: formItemProps,
  setup(__props, { expose: __expose }) {
    const props2 = __props;
    const slots = useSlots();
    const {
      formContext,
      validateState,
      validateMessage,
      hasLabel,
      currentLabel,
      shouldShowError,
      isRequired,
      resetField,
      clearValidate,
      validate,
      initFieldValue
    } = useFormItemOperation(props2, slots);
    const {
      ns: formItemNs,
      labelId,
      formItemClass,
      formItemLabelClass,
      formItemLabelStyle,
      formItemErrorMessageStyle,
      initLabelContainerWidth
    } = useFormItemCustomStyle(props2, hasLabel, isRequired);
    const _size = useFormSize(void 0, { formItem: false });
    const context = reactive({
      ...toRefs(props2),
      size: _size,
      validateState,
      hasLabel,
      resetField,
      clearValidate,
      validate
    });
    onMounted(() => {
      if (props2.prop) {
        formContext == null ? void 0 : formContext.addField(context);
        initFieldValue();
      }
      nextTick$1(() => {
        initLabelContainerWidth();
      });
    });
    onBeforeUnmount(() => {
      formContext == null ? void 0 : formContext.removeField(context);
    });
    provide(formItemContextKey, context);
    __expose({
      /**
       * @description 表单尺寸
       */
      size: _size,
      /**
       * @description 校验信息
       */
      validateMessage,
      /**
       * @description 校验状态
       */
      validateState,
      /**
       * @description 对表单Item的内容进行验证。 接收一个回调函数或返回Promise
       */
      validate,
      /**
       * @description 重置当前字段信息
       */
      resetField,
      /**
       * @description 清除表单字段验证
       */
      clearValidate
    });
    return (_ctx, _cache) => {
      return e({
        a: unref(hasLabel)
      }, unref(hasLabel) ? {
        b: t(unref(currentLabel)),
        c: unref(labelId),
        d: n(unref(formItemLabelClass)),
        e: s(unref(formItemLabelStyle))
      } : {}, {
        f: n(unref(formItemNs).e("content")),
        g: n(unref(formItemNs).e("wrapper")),
        h: unref(shouldShowError)
      }, unref(shouldShowError) ? {
        i: t(unref(validateMessage)),
        j: n(unref(formItemNs).e("error-message")),
        k: s(unref(formItemErrorMessageStyle))
      } : {}, {
        l: n(unref(formItemClass)),
        m: gei(_ctx, "")
      });
    };
  }
});
const FormItem = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-d88902b9"]]);
withInstall(Form, {
  FormItem
});
withNoopInstall(FormItem);
const isJsonString = (value2) => {
  if (typeof value2 == "string") {
    try {
      const obj = JSON.parse(value2);
      if (typeof obj == "object" && obj) {
        return true;
      } else {
        return false;
      }
    } catch (e2) {
      return false;
    }
  }
  return false;
};
function useUploadHandleFunction(props2) {
  const chooseImage = (count) => {
    return new Promise((resolve2, reject) => {
      index$1.chooseImage({
        count,
        sizeType: props2.sizeType,
        // extension: props.extensions,
        sourceType: props2.sourceType,
        success: (res) => {
          resolve2(isArray$1(res.tempFiles) ? res.tempFiles : [res.tempFiles]);
        },
        fail: (err) => {
          reject(err);
        }
      });
    });
  };
  const uploading = ref(false);
  watch(
    () => uploading.value,
    (val) => {
      if (props2.showErrorTips) {
        if (val)
          index$1.showLoading({ title: "上传中" });
        else
          index$1.hideLoading();
      }
    }
  );
  const uploadProcess = (item) => {
    const { customUploadHandler, customUploadCallback } = props2;
    if (uploading.value)
      return Promise.reject("有文件正在上传");
    return new Promise((resolve2, reject) => {
      if (customUploadHandler) {
        const uploadHandlerResult = customUploadHandler(item.file);
        const isUploadHandlePromiseOrString = [
          isPromise(uploadHandlerResult),
          isString(uploadHandlerResult)
        ].includes(true);
        if (!isUploadHandlePromiseOrString) {
          console.error(
            "[TnImageUpload]自定义上传处理函数必须返回Promise和String"
          );
          reject("自定义上传处理函数必须返回Promise和String");
          return;
        }
        uploading.value = true;
        item.status = "uploading";
        if (isPromise(uploadHandlerResult)) {
          uploadHandlerResult.then((res) => {
            if (res) {
              item.url = res;
              resolve2(true);
            } else {
              resolve2(false);
            }
          }).catch((err) => {
            console.error("[TnImageUpload]上传文件发生错误", err);
            reject((err == null ? void 0 : err.errMsg) || "上传文件发生错误");
          }).finally(() => {
            uploading.value = false;
          });
        } else {
          if (uploadHandlerResult) {
            item.url = uploadHandlerResult;
            resolve2(true);
          } else {
            resolve2(false);
          }
          uploading.value = false;
        }
      } else {
        uploading.value = true;
        item.status = "uploading";
        const task = index$1.uploadFile({
          url: props2.action,
          filePath: item.url,
          name: props2.name,
          formData: props2.formData,
          header: props2.header,
          success: (res) => {
            if (customUploadCallback) {
              const customUploadCallbackResult = customUploadCallback(res);
              const isCustomUploadCallbackPromiseOrString = [
                isPromise(customUploadCallbackResult),
                isString(customUploadCallbackResult)
              ].includes(true);
              if (!isCustomUploadCallbackPromiseOrString) {
                console.error(
                  "[TnImageUpload]自定义上传回调函数必须返回Promise和String"
                );
                reject("自定义上传回调函数必须返回Promise和String");
                return;
              }
              if (isPromise(customUploadCallbackResult)) {
                customUploadCallbackResult.then((res2) => {
                  if (res2) {
                    item.url = res2;
                    resolve2(true);
                  } else {
                    resolve2(false);
                  }
                }).catch((err) => {
                  console.error("[TnImageUpload]上传文件发生错误", err);
                  reject((err == null ? void 0 : err.errMsg) || "上传文件发生错误");
                });
              } else {
                if (customUploadCallbackResult) {
                  item.url = customUploadCallbackResult;
                  resolve2(true);
                } else {
                  resolve2(false);
                }
              }
            } else {
              const { statusCode, data: resData } = res;
              if (![200, 201, 204].includes(statusCode)) {
                console.error("[TnImageUpload]上传文件发生错误", res);
                reject((res == null ? void 0 : res.errMsg) || "上传文件发生错误");
                return;
              } else {
                const data = isJsonString(resData) ? JSON.parse(resData) : resData;
                if (data.code === 200 && data.data.errCode === 0) {
                  item.url = data.data.url;
                  resolve2(true);
                } else {
                  console.error("[TnImageUpload]上传文件发生错误", res);
                  reject(
                    isEmptyVariableInDefault(
                      data == null ? void 0 : data.message,
                      (data == null ? void 0 : data.msg) || "上传文件发生错误"
                    )
                  );
                }
              }
            }
          },
          fail: (err) => {
            console.error("[TnImageUpload]上传文件发生错误", err);
            reject((err == null ? void 0 : err.errMsg) || "上传文件发生错误");
          },
          complete: () => {
            uploading.value = false;
            resolve2(true);
          }
        });
        item.uploadTask = task;
        task.onProgressUpdate((res) => {
          if (res.progress > 0) {
            item.progress = res.progress;
          }
        });
      }
    });
  };
  const checkFileSizeAndExtension = (files) => {
    const { extensions, maxSize } = props2;
    const extReg = /.+\./;
    return files.filter((item) => {
      let fileExt = "";
      fileExt = item.path.replace(extReg, "").toLowerCase();
      return !extensions.some((ext) => ext.toLowerCase() === fileExt) || item.size > maxSize;
    });
  };
  const showErrorTips = (msg) => {
    if (!props2.showErrorTips)
      return;
    index$1.showToast({
      icon: "none",
      title: msg
    });
  };
  return {
    chooseImage,
    uploadProcess,
    checkFileSizeAndExtension,
    showErrorTips
  };
}
const useImageUpload = (props2) => {
  const { emit: emit2 } = getCurrentInstance();
  const {
    chooseImage,
    uploadProcess,
    checkFileSizeAndExtension,
    showErrorTips
  } = useUploadHandleFunction(props2);
  const { formItem } = useFormItem();
  const fileList = ref([]);
  let isInnerUpdate = false;
  watch(
    () => props2.modelValue,
    (val) => {
      if (isInnerUpdate) {
        isInnerUpdate = false;
        return;
      }
      fileList.value = val.map((item) => ({
        url: item,
        status: "done",
        progress: 100
      }));
    },
    {
      immediate: true
    }
  );
  const isExceedMaxCount = computed(
    () => fileList.value.length >= props2.limit
  );
  const currentRemainFileCount = computed(() => {
    if (props2.multiple) {
      return props2.limit - fileList.value.length;
    } else {
      return props2.limit - fileList.value.length > 0 ? 1 : 0;
    }
  });
  const chooseFile = async () => {
    const { disabled, action, customUploadHandler } = props2;
    if (disabled)
      return;
    if (!action && !customUploadHandler) {
      showErrorTips("请设置action或者自定义图片上传处理函数");
      debugWarn("TnImageUpload", "请设置action或者自定义图片上传处理函数");
      return;
    }
    const prevUploadedFileCount = fileList.value.length;
    chooseImage(currentRemainFileCount.value).then((res) => {
      let selectFile = res;
      const checkFailFiles = checkFileSizeAndExtension(selectFile);
      if (checkFailFiles.length) {
        showErrorTips("文件格式或大小不符合要求");
        emit2("oversizeOrNoSupport", checkFailFiles);
        selectFile = selectFile.filter(
          (item) => !checkFailFiles.includes(item)
        );
      }
      fileList.value.push(
        ...selectFile.map((item) => {
          const url2 = item.path;
          return {
            url: url2,
            status: "ready",
            progress: 0,
            file: item
          };
        })
      );
      if (props2.autoUpload && selectFile.length)
        uploadFile(prevUploadedFileCount);
    }).catch((err) => {
      debugWarn("TnImageUpload", `选择图片失败: ${err}`);
      showErrorTips((err == null ? void 0 : err.errMsg) || "选择图片失败");
    });
  };
  const handleUploadEvent = (item, index2, uploadSingle = false) => {
    uploadProcess(item).then((res) => {
      if (res) {
        handleUploadSuccess(item);
      } else {
        handleUploadError(item, "上传失败");
      }
    }).catch((err) => {
      handleUploadError(item, err);
    }).finally(() => {
      if (!uploadSingle)
        uploadFile(index2 + 1);
    });
  };
  const uploadFile = (startIndex, uploadSingle = false) => {
    const { autoUpload, beforeUpload } = props2;
    const autoNextUpload = autoUpload && !uploadSingle;
    if (startIndex >= fileList.value.length) {
      if (props2.autoRemoveFaildFile)
        handleUploadCompleteFailFile();
      return;
    }
    const fileItem = fileList.value[startIndex];
    if (fileItem.progress === 100) {
      fileItem.status = "done";
      fileItem.uploadTask = void 0;
      if (autoNextUpload)
        uploadFile(startIndex + 1);
      return;
    }
    if (!beforeUpload) {
      handleUploadEvent(fileItem, startIndex, uploadSingle);
      return;
    }
    const shouldUpload = beforeUpload(fileItem.file);
    const isBeforeUploadPromiseOrBoolean = [
      isPromise(shouldUpload),
      isBoolean(shouldUpload)
    ].includes(true);
    if (!isBeforeUploadPromiseOrBoolean) {
      throwError(
        "[TnImageUpload]",
        "beforeUpload返回值必须是Promise或者Boolean"
      );
    }
    if (isPromise(shouldUpload)) {
      shouldUpload.then((res) => {
        if (res)
          handleUploadEvent(fileItem, startIndex, uploadSingle);
        else {
          removeFile(startIndex);
          if (autoNextUpload)
            uploadFile(startIndex);
        }
      }).catch((err) => {
        debugWarn("TnImageUpload", `beforeUpload出错: ${err}`);
        fileItem.status = "failed";
      });
    } else {
      if (shouldUpload)
        handleUploadEvent(fileItem, startIndex, uploadSingle);
      else {
        removeFile(startIndex);
        if (autoNextUpload)
          uploadFile(startIndex);
      }
    }
  };
  const getUploadSuceesFileUrlValue = () => {
    return fileList.value.filter((item) => item.status === "done").map((item) => item.url);
  };
  const uploadSuccessFileListChange = () => {
    isInnerUpdate = true;
    const value2 = getUploadSuceesFileUrlValue();
    emit2(UPDATE_MODEL_EVENT, value2);
    nextTick$1(() => {
      var _a2;
      emit2(CHANGE_EVENT, value2);
      if (props2.validateEvent) {
        (_a2 = formItem == null ? void 0 : formItem.validate) == null ? void 0 : _a2.call(formItem, "change").catch((err) => {
          debugWarn(err);
        });
      }
    });
  };
  const handleUploadSuccess = (item) => {
    item.status = "done";
    item.progress = 100;
    item.uploadTask = void 0;
    item.file = void 0;
    emit2("success", item);
    uploadSuccessFileListChange();
  };
  const handleUploadError = (item, errorMsg) => {
    item.status = "failed";
    item.progress = 0;
    item.uploadTask = void 0;
    item.file = void 0;
    showErrorTips(errorMsg);
    emit2("fail", new Error(errorMsg), item);
  };
  const handleUploadCompleteFailFile = () => {
    const tempFileList = [...fileList.value];
    tempFileList.forEach((item, index2) => {
      if (item.status === "failed") {
        removeFile(index2);
      }
    });
  };
  const retryUploadFile = (index2) => {
    const fileItem = fileList.value[index2];
    fileItem.status = "ready";
    fileItem.progress = 0;
    uploadFile(index2, true);
  };
  const retryAllUpload = () => {
    const firstFailedFileIndex = fileList.value.findIndex(
      (item) => item.status === "failed"
    );
    uploadFile(firstFailedFileIndex);
  };
  const customUploadHandle = () => {
    if (!fileList.value.length)
      return;
    uploadFile(0);
  };
  const removeFile = (index2) => {
    const fileItem = fileList.value[index2];
    if (fileItem.status === "uploading" && fileItem.uploadTask && fileItem.progress > 0 && fileItem.progress < 100) {
      fileItem.uploadTask.abort();
    }
    fileList.value.splice(index2, 1);
    if (fileItem.status === "done") {
      emit2("remove", fileItem.url);
      uploadSuccessFileListChange();
    }
  };
  const removeFileEvent = (index2) => {
    const { disabled, beforeRemove } = props2;
    if (disabled)
      return;
    const fileItem = fileList.value[index2];
    if (!fileItem)
      return;
    index$1.showModal({
      title: "操作提示",
      content: "确认需要移除该图片吗?",
      showCancel: true,
      cancelText: "取 消",
      confirmText: "确 认",
      success: (res) => {
        if (res.confirm) {
          if (!beforeRemove) {
            removeFile(index2);
            return;
          }
          const shouldRemove = beforeRemove(fileItem);
          const isShouldRemovePromiseOrBoolean = [
            isPromise(shouldRemove),
            isBoolean(shouldRemove)
          ].includes(true);
          if (!isShouldRemovePromiseOrBoolean) {
            throwError(
              "[TnImageUpload]",
              "beforeRemove返回值必须是Promise或者Boolean"
            );
          }
          if (isPromise(shouldRemove)) {
            shouldRemove.then((res2) => {
              if (res2)
                removeFile(index2);
            }).catch((err) => {
              debugWarn("TnImageUpload", `beforeRemove出错: ${err}`);
            });
          } else {
            if (shouldRemove)
              removeFile(index2);
          }
        }
      }
    });
  };
  const clearAllFile = () => {
    fileList.value.forEach((item) => {
      if (item.status === "uploading" && item.uploadTask && item.progress > 0 && item.progress < 100) {
        item.uploadTask.abort();
      }
    });
    fileList.value = [];
    uploadSuccessFileListChange();
  };
  const previewImage2 = (index2) => {
    const previewImageList = fileList.value.filter((item) => item.status === "done").map((item) => item.url);
    index$1.previewImage({
      current: index2,
      urls: previewImageList
    });
    emit2("preview", previewImageList[index2]);
  };
  return {
    fileList,
    isExceedMaxCount,
    chooseFile,
    retryUploadFile,
    retryAllUpload,
    customUploadHandle,
    removeFileEvent,
    clearAllFile,
    previewImage: previewImage2
  };
};
const props$6 = defineMixin({
  props: {
    // 最小可选值
    min: {
      type: [Number, String],
      default: () => defProps.slider.min
    },
    // 最大可选值
    max: {
      type: [Number, String],
      default: () => defProps.slider.max
    },
    // 步长，取值必须大于 0，并且可被(max - min)整除
    step: {
      type: [Number, String],
      default: () => defProps.slider.step
    },
    // 当前取值
    modelValue: {
      type: [String, Number],
      default: () => defProps.slider.value
    },
    // 是否区间模式
    isRange: {
      type: Boolean,
      default: false
    },
    // 双滑块时值
    rangeValue: {
      type: [Array],
      default: [0, 0]
    },
    // 滑块右侧已选择部分的背景色
    activeColor: {
      type: String,
      default: () => defProps.slider.activeColor
    },
    // 滑块左侧未选择部分的背景色
    inactiveColor: {
      type: String,
      default: () => defProps.slider.inactiveColor
    },
    // 滑块的大小，取值范围为 12 - 28
    blockSize: {
      type: [Number, String],
      default: () => defProps.slider.blockSize
    },
    // 滑块的颜色
    blockColor: {
      type: String,
      default: () => defProps.slider.blockColor
    },
    // 用户对滑块的自定义颜色
    blockStyle: {
      type: Object,
      default: () => defProps.slider.blockStyle
    },
    // 禁用状态
    disabled: {
      type: Boolean,
      default: () => defProps.slider.disabled
    },
    // 是否显示当前的选择值
    showValue: {
      type: Boolean,
      default: () => defProps.slider.showValue
    },
    // 是否渲染uni-app框架内置组件
    useNative: {
      type: Boolean,
      default: () => defProps.slider.useNative
    },
    // 滑块高度
    height: {
      type: String,
      default: () => defProps.slider.height
    }
  }
});
const inputTypes = [
  "text",
  "number",
  "idcard",
  "digit",
  "textarea",
  "password",
  "select"
];
const inputConfirmTypes = [
  "",
  "send",
  "search",
  "next",
  "go",
  "done",
  "return"
];
const inputProps = buildProps({
  /**
   * @description 绑定的值
   */
  modelValue: {
    type: definePropType([
      String,
      Number,
      Object
    ]),
    default: ""
  },
  /**
   * @description 输入框尺寸
   */
  size: useFormSizeProps,
  /**
   * @description 输入框高度
   */
  height: {
    type: [String, Number]
  },
  /**
   * @description 是否禁用
   */
  disabled: Boolean,
  /**
   * @description 输入框类型
   */
  type: {
    type: String,
    values: inputTypes,
    default: "text"
  },
  /**
   * @description 输入框占位文本
   */
  placeholder: String,
  /**
   * @description 文字对齐方式
   */
  textAlign: {
    type: String,
    values: ["left", "center", "right"],
    default: "left"
  },
  /**
   * @description 输入框占位文本的样式
   */
  placeholderStyle: useComponentCustomStyleProp,
  /**
   * @description 是否显示边框
   */
  border: {
    type: Boolean,
    default: true
  },
  /**
   * @description 边框颜色
   */
  borderColor: {
    type: String,
    default: "tn-gray-disabled"
  },
  /**
   * @description 下划线边框
   */
  underline: Boolean,
  /**
   * @description 自定义样式
   */
  customStyle: useComponentCustomStyleProp,
  /**
   * @description 自定义类名
   */
  customClass: String,
  /**
   * @description 最大可输入长度，设置为 -1 的时候不限制最大长度
   */
  maxlength: {
    type: Number,
    default: -1
  },
  /**
   * @description 根据内容自动调整高度，仅在 textarea 模式下生效，如果设置了 height 则优先级最高
   */
  autoHeight: {
    type: Boolean,
    default: true
  },
  /**
   * @description 设置键盘右下角按钮的文字，仅在使用系统键盘时生效
   */
  confirmType: {
    type: String,
    values: inputConfirmTypes,
    default: "done"
  },
  /**
   * @description 获取焦点
   */
  focus: Boolean,
  /**
   * @description 是否展示清除按钮
   */
  clearable: Boolean,
  /**
   * @description 是否显示切换密码显示/隐藏按钮，仅在 type="password" 时生效
   */
  showPassword: {
    type: Boolean,
    default: true
  },
  /**
   * @description 指定光标与键盘的距离，单位 px
   */
  cursorSpacing: {
    type: Number,
    default: 0
  },
  /**
   * @description 光标起始位置，自动聚集时有效，需与selection-end搭配使用
   */
  selectionStart: {
    type: Number,
    default: -1
  },
  /**
   * @description 光标结束位置，自动聚集时有效，需与selection-start搭配使用
   */
  selectionEnd: {
    type: Number,
    default: -1
  },
  /**
   * @description 是否展示键盘上方带有”完成“按钮那一栏
   */
  showConfirmBar: {
    type: Boolean,
    default: true
  },
  /**
   * @description 显示输入框右图标
   */
  rightIcon: String,
  /**
   * @description 自动去除两端空格
   */
  trim: {
    type: Boolean,
    default: true
  },
  /**
   * @description 显示字数统计，只有在 textarea 模式下且设置maxlength时生效
   */
  showWordLimit: {
    type: Boolean,
    default: false
  },
  /**
   * @description 字数统计文字颜色，以tn开头使用图鸟内置的颜色
   */
  wordLimitColor: String,
  /**
   * @description 输入时是否触发表单验证
   */
  validateEvent: {
    type: Boolean,
    default: true
  }
});
const inputEmits = {
  [UPDATE_MODEL_EVENT]: (value2) => isString(value2) || isNumber(value2),
  /**
   * @description 输入框输入内容时触发
   */
  [INPUT_EVENT]: (value2) => isString(value2) || isNumber(value2),
  /**
   * @description 输入框内容变化时触发
   */
  [CHANGE_EVENT]: (value2) => isString(value2) || isNumber(value2),
  /**
   * @description 输入框点击时触发
   */
  click: () => true,
  /**
   * @description 输入框聚焦时触发
   */
  focus: (e2) => isObject$1(e2),
  /**
   * @description 输入框失去焦点时触发
   */
  blur: (e2) => isObject$1(e2),
  /**
   * @description 点击清除按钮时触发
   */
  clear: () => true,
  /**
   * @description 点击键盘右下角按钮时触发
   */
  confirm: (value2) => isString(value2) || isNumber(value2)
};
const useInputCustomStyle = (props2, validateState, disabled) => {
  const ns = useNamespace("input");
  const inputSize = useFormSize(props2.size);
  const [borderColorClass, borderColorStyle] = useComponentColor(
    toRef(props2, "borderColor"),
    "border"
  );
  const [wordLimitColorClass, wordLimitColorStyle] = useComponentColor(
    toRef(props2, "wordLimitColor"),
    "text"
  );
  const placeholderStyle = computed(() => {
    const style = {
      color: "var(--tn-text-color-secondary)"
    };
    if (!isEmpty(props2.placeholderStyle))
      Object.assign(style, props2.placeholderStyle);
    return Object.entries(style).map(([key, value2]) => `${key}:${value2}`).join(";");
  });
  const inputClass = computed(() => {
    const cls = [ns.b()];
    if (disabled.value && props2.type !== "select")
      cls.push(ns.m("disabled"));
    if (inputSize.value)
      cls.push(ns.m(inputSize.value));
    if (props2.textAlign)
      cls.push(ns.m(`text-${props2.textAlign}`));
    if (validateState.value === "error")
      cls.push(ns.m("error"));
    if (props2.border || props2.underline || validateState.value === "error") {
      cls.push(props2.underline ? "tn-border-bottom" : "tn-border");
      if (validateState.value === "error")
        cls.push("tn-red_border");
      else if (borderColorClass.value)
        cls.push(borderColorClass.value);
    }
    if (props2.underline) {
      cls.push(ns.m("underline"));
    }
    if (props2.customClass)
      cls.push(props2.customClass);
    return cls.join(" ");
  });
  const inputStyle = computed(() => {
    const style = {};
    if (props2.height)
      style.height = formatDomSizeValue(props2.height);
    if (props2.border && borderColorStyle.value && validateState.value !== "error")
      style.borderColor = borderColorStyle.value;
    if (!isEmpty(props2.customStyle))
      Object.assign(style, props2.customStyle);
    return style;
  });
  const wordLimitClass = computed(() => {
    const cls = [ns.e("word-limit")];
    if (wordLimitColorClass.value)
      cls.push(wordLimitColorClass.value);
    return cls.join(" ");
  });
  const wordLimitStyle = computed(() => {
    const style = {};
    if (!wordLimitColorClass.value) {
      style.color = wordLimitColorStyle.value || "var(--tn-color-gray)";
    }
    return style;
  });
  return {
    ns,
    inputClass,
    inputStyle,
    placeholderStyle,
    wordLimitClass,
    wordLimitStyle
  };
};
const useInput = (props2, emits) => {
  const { form, formItem } = useFormItem();
  const inputText = ref(
    String(isEmptyVariableInDefault(props2.modelValue, ""))
  );
  watch(
    () => props2.modelValue,
    (val) => {
      var _a2;
      inputText.value = String(isEmptyVariableInDefault(val, ""));
      if (props2.validateEvent) {
        (_a2 = formItem == null ? void 0 : formItem.validate) == null ? void 0 : _a2.call(formItem, "change").catch((err) => {
          debugWarn(err);
        });
      }
    }
  );
  const [passwordVisible, togglePasswordVisible] = useToggle(false);
  const needStatusIcon = computed(
    () => isEmptyVariableInDefault(form == null ? void 0 : form.statusIcon, false)
  );
  const validateState = computed(
    () => isEmptyVariableInDefault(
      formItem == null ? void 0 : formItem.validateState,
      ""
    )
  );
  const validateIcon = computed(
    () => validateState.value && FormValidateIconsMap[validateState.value]
  );
  const passwordIcon = computed(
    () => passwordVisible.value ? "eye-hide" : "eye"
  );
  const showIcon = computed(() => {
    let status = false;
    if (validateState.value && needStatusIcon.value && validateIcon.value)
      status = true;
    if (props2.showPassword)
      status = true;
    if (props2.rightIcon)
      status = true;
    if (props2.clearable)
      status = true;
    return status;
  });
  const disabled = useFormDisabled(props2.disabled);
  const showWordLimit = computed(
    () => props2.type === "textarea" && !!(props2 == null ? void 0 : props2.maxlength) && !!(props2 == null ? void 0 : props2.showWordLimit)
  );
  const currentWordCount = computed(() => {
    var _a2;
    if (props2.showWordLimit && props2.type === "textarea") {
      return ((_a2 = inputText.value) == null ? void 0 : _a2.length) || 0;
    }
    return 0;
  });
  const inputInputEvent = (event) => {
    const { value: value2 } = event.detail;
    _updateInputText(value2);
  };
  const inputFocusEvent = (event) => {
    emits("focus", event);
  };
  const inputBlurEvent = (event) => {
    var _a2;
    emits("blur", event);
    if (props2.validateEvent) {
      (_a2 = formItem == null ? void 0 : formItem.validate) == null ? void 0 : _a2.call(formItem, "blur").catch((err) => {
        debugWarn(err);
      });
    }
  };
  const confirmEvent = (event) => {
    const { value: value2 } = event.detail;
    emits("confirm", _formatInputText(value2));
  };
  const clearClickEvent = () => {
    if (disabled.value)
      return;
    _updateInputText("");
    emits("clear");
  };
  const _updateInputText = (value2) => {
    value2 = props2.trim ? trim(value2) : value2;
    emits(UPDATE_MODEL_EVENT, _formatInputText(value2));
    nextTick$1(() => {
      emits(INPUT_EVENT, _formatInputText(value2));
      emits(CHANGE_EVENT, _formatInputText(value2));
    });
  };
  const inputClickEvent = () => {
    if (props2.type === "select") {
      emits("click");
    }
  };
  const _formatInputText = (value2) => {
    if (value2 === "")
      return "";
    if (props2.type === "number" || props2.type === "digit")
      return Number.parseFloat(value2);
    return value2;
  };
  return {
    inputText,
    needStatusIcon,
    validateState,
    validateIcon,
    passwordVisible,
    passwordIcon,
    showIcon,
    disabled,
    showWordLimit,
    currentWordCount,
    togglePasswordVisible,
    inputInputEvent,
    inputFocusEvent,
    inputBlurEvent,
    clearClickEvent,
    confirmEvent,
    inputClickEvent
  };
};
const titleModes = [
  "normal",
  "vLine",
  "dot",
  "hLine",
  "subTitle",
  "transparent"
];
const titleAlign = ["left", "center", "right"];
const titleProps = buildProps({
  /**
   * @description 标题内容
   */
  title: String,
  /**
   * @description 子标题内容，设置 mode 为 subTitle 时生效
   */
  subTitle: String,
  /**
   * @description 标题模式
   */
  mode: {
    type: String,
    values: titleModes,
    default: "normal"
  },
  /**
   * @description 标题大小，内置`sm`、`lg`、`xl`，同时也可以传递指定的尺寸
   */
  size: String,
  /**
   * @description 标题对齐方式
   */
  align: {
    type: String,
    values: titleAlign,
    default: "left"
  },
  /**
   * @description 标题颜色，以tn开头则使用图鸟内置的颜色
   */
  color: String,
  /**
   * @description 辅助元素颜色，以tn开头则使用图鸟内置的颜色
   */
  assistColor: String
});
const titleEmits = {
  /**
   * @description 点击事件
   */
  click: () => true
};
const useTitleCustomStyle = (props2) => {
  const ns = useNamespace("title");
  const [titleTextColorClass, titleTextColorStyle] = useComponentColor(
    toRef(props2, "color"),
    "text"
  );
  const [titleBgColorClass, titleBgColorStyle] = useComponentColor(
    toRef(props2, "color"),
    "bg"
  );
  const [assistTextColorClass, assistTextColorStyle] = useComponentColor(
    toRef(props2, "assistColor"),
    "text"
  );
  const [assistBgColorClass, assistBgColorStyle] = useComponentColor(
    toRef(props2, "assistColor"),
    "bg"
  );
  const { sizeType } = useComponentSize(props2.size);
  const titleClass = computed(() => {
    const cls = [ns.e("title"), ns.em("title", props2.mode)];
    if (props2.mode === "transparent") {
      cls.push("tn-text-transparent");
      if (titleBgColorClass.value)
        cls.push(titleBgColorClass.value);
    } else {
      if (titleTextColorClass.value)
        cls.push(titleTextColorClass.value);
    }
    if (props2.size && sizeType.value === "inner")
      cls.push(ns.em("title", props2.size));
    return cls.join(" ");
  });
  const titleStyle = computed(() => {
    const style = {};
    if (props2.mode === "transparent") {
      if (!titleBgColorClass.value)
        style.backgroundColor = titleBgColorStyle.value || "var(--tn-color-primary)";
    } else {
      if (!titleTextColorClass.value)
        style.color = titleTextColorStyle.value || "var(--tn-text-color-primary)";
    }
    if (props2.size && sizeType.value === "custom")
      style.fontSize = formatDomSizeValue(props2.size);
    if (props2.align)
      style.textAlign = props2.align;
    return style;
  });
  const assistColorClass = computed(() => {
    const cls = [];
    if (props2.mode === "subTitle") {
      if (assistTextColorClass.value)
        cls.push(assistTextColorClass.value);
    } else {
      if (assistBgColorClass.value)
        cls.push(assistBgColorClass.value);
    }
    return cls.join(" ");
  });
  const assistColorStyle = computed(() => {
    const style = {};
    if (props2.mode === "subTitle") {
      if (!assistTextColorClass.value)
        style.color = assistTextColorStyle.value || "var(--tn-color-primary-light-7)";
    } else {
      if (!assistBgColorClass.value)
        style.backgroundColor = assistBgColorStyle.value || "var(--tn-color-primary)";
    }
    return style;
  });
  return {
    ns,
    titleClass,
    titleStyle,
    assistColorClass,
    assistColorStyle
  };
};
const pickerBaseProps = buildProps({
  /**
   * @description 显示取消按钮
   */
  showCancel: {
    type: Boolean,
    default: true
  },
  /**
   * @description 取消按钮的文本
   */
  cancelText: {
    type: String,
    default: "取 消"
  },
  /**
   * @description 取消按钮的字体颜色，支持图鸟内置的字体颜色
   */
  cancelColor: String,
  /**
   * @description 显示确定按钮
   */
  showConfirm: {
    type: Boolean,
    default: true
  },
  /**
   * @description 确定按钮的文本
   */
  confirmText: {
    type: String,
    default: "确 定"
  },
  /**
   * @description 确定按钮的字体颜色，支持图鸟内置的字体颜色
   */
  confirmColor: String,
  /**
   * @description 显示遮罩
   */
  mask: Boolean,
  /**
   * zIndex
   */
  zIndex: {
    type: Number,
    default: ZIndex.popup
  }
});
const pickerProps = buildProps({
  ...pickerBaseProps,
  /**
   * @description picker绑定的值
   */
  modelValue: {
    type: definePropType([String, Number, Array]),
    default: ""
  },
  /**
   * @description 显示picker选项弹框
   */
  open: Boolean,
  /**
   * @description picker选项的数据
   */
  data: {
    type: definePropType([Array]),
    default: () => []
  },
  /**
   * @description 允许滑动结束前点击confirm按钮
   */
  allowConfirmBeforeScrollEnd: {
    type: Boolean,
    default: false
  },
  /**
   * @description 是否在手指松开时立即触发 change 事件。若不开启则会在滚动动画结束后触发 change 事件。
   */
  immediateChange: {
    type: Boolean,
    default: true
  },
  /**
   * @description indicator的高度, 单位px
   */
  indicatorHeight: {
    type: Number,
    default: 44
  },
  /**
   * @description picker选项的数据label属性名
   */
  labelKey: {
    type: String,
    default: "label"
  },
  /**
   * @description picker选项的数据value属性名
   */
  valueKey: {
    type: String,
    default: "value"
  },
  /**
   * @description picker选项的数据children属性名, 在级联选择器模式下生效
   */
  childrenKey: {
    type: String,
    default: "children"
  }
});
const pickerEmits = {
  [UPDATE_MODEL_EVENT]: (value2) => isString(value2) || isNumber(value2) || isArray$1(value2),
  "update:open": (value2) => isBoolean(value2),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  [CHANGE_EVENT]: (value2, index2, item) => true,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  confirm: (value2, item) => true,
  pickstart: () => true,
  pickend: () => true,
  cancel: () => true,
  close: () => true
};
const usePickerCustomStyle = (props2) => {
  const ns = useNamespace("picker");
  const [cancelColorClass, cancelColorStyle] = useComponentColor(
    toRef(props2, "cancelColor"),
    "text"
  );
  const [confirmColorClass, confirmColorStyle] = useComponentColor(
    toRef(props2, "confirmColor"),
    "text"
  );
  const overlayOpacity = computed(() => {
    return props2.mask ? 0.5 : 0;
  });
  const operationBtnClass = computed(() => {
    return (type2, disabled) => {
      const cls = [
        ns.e("operation-btn"),
        ns.em("operation-btn", type2)
      ];
      if (!props2.allowConfirmBeforeScrollEnd && disabled) {
        cls.push(ns.em("operation-btn", "disabled"));
      }
      if (type2 === "cancel") {
        if (cancelColorClass.value)
          cls.push(cancelColorClass.value);
      } else if (type2 === "confirm") {
        if (confirmColorClass.value)
          cls.push(confirmColorClass.value);
      }
      return cls.join(" ");
    };
  });
  const operationBtnStyle = computed(() => {
    return (type2) => {
      const style = {};
      if (type2 === "cancel") {
        if (!cancelColorClass.value)
          style.color = cancelColorStyle.value || "var(--tn-color-danger)";
      } else if (type2 === "confirm") {
        if (!confirmColorClass.value)
          style.color = confirmColorStyle.value || "var(--tn-color-primary)";
      }
      return style;
    };
  });
  return {
    ns,
    overlayOpacity,
    operationBtnClass,
    operationBtnStyle
  };
};
const usePicker = (props2) => {
  const { emit: emit2 } = getCurrentInstance();
  const openPopup = ref(false);
  const showPicker = ref(true);
  watch(
    () => props2.open,
    (value2) => {
      openPopup.value = value2;
    }
  );
  const _closePopup = () => {
    emit2("update:open", false);
  };
  const closePopupEvent = () => {
    _closePopup();
    _generatePickerViewData(props2.modelValue);
    emit2("close");
  };
  let pickerMode = "signle";
  const _generateData = (data) => {
    if (isObject$1(data)) {
      const originalData = cloneDeep(data);
      if (Object.prototype.hasOwnProperty.call(originalData, props2.childrenKey)) {
        delete originalData[props2.childrenKey];
      }
      return {
        label: data[props2.labelKey],
        value: data[props2.valueKey],
        originalData
      };
    } else {
      return {
        label: data,
        value: data,
        originalData: data
      };
    }
  };
  const _generateOrUpdateCascadeData = (data, generateIndex = 1, defaultValue = []) => {
    if (pickerData.value.length < generateIndex) {
      pickerData.value.push(
        ...Array.from(
          { length: generateIndex - pickerData.value.length },
          () => []
        )
      );
    }
    pickerData.value[generateIndex - 1] = [
      ...data.map((item) => _generateData(item))
    ];
    let childrenIndex = 0;
    if (defaultValue.length) {
      childrenIndex = pickerData.value[generateIndex - 1].findIndex(
        (item) => item.value === defaultValue[generateIndex - 1]
      );
      childrenIndex = ~childrenIndex ? childrenIndex : 0;
    }
    if (data[childrenIndex] && Object.prototype.hasOwnProperty.call(
      data[childrenIndex],
      props2.childrenKey
    )) {
      _generateOrUpdateCascadeData(
        data[childrenIndex][props2.childrenKey],
        generateIndex + 1,
        defaultValue
      );
    }
  };
  const isPickerScrolling = ref(false);
  let isBeforeConfirm = false;
  const pickerData = ref([]);
  const currentPickerIndex = ref([]);
  const initDefaultPickerIndex = () => {
    let indexValue = [];
    if (props2.modelValue === void 0 || !props2.modelValue && ["multiple", "cascade"].includes(pickerMode) || isArray$1(props2.modelValue) && !props2.modelValue.length) {
      indexValue = Array.from({ length: pickerData.value.length }, () => 0);
    } else {
      if (isArray$1(props2.modelValue)) {
        indexValue = pickerData.value.map((item, index2) => {
          let pickerIndex = 0;
          if (!props2.modelValue[index2])
            pickerIndex = 0;
          else {
            pickerIndex = item.findIndex((childItem) => {
              return childItem.value === props2.modelValue[index2];
            });
          }
          return ~pickerIndex ? pickerIndex : 0;
        });
      } else {
        indexValue = pickerData.value.map((_, k) => {
          const index2 = pickerData.value[k].findIndex(
            (item) => item.value === props2.modelValue
          );
          return index2 === -1 ? 0 : index2;
        });
      }
    }
    currentPickerIndex.value = indexValue;
  };
  const splitUserPickerData = () => {
    const { data } = props2;
    if (!data)
      return;
    if (!isArray$1(data)) {
      throwError("TnPicker", "picker选择器数据不正确，请传递数组格式的数据");
    }
    if (data.length === 0)
      return;
    if (isArray$1(data[0])) {
      pickerMode = "multiple";
      pickerData.value = data.reduce(
        (prev, cur) => {
          prev.push(cur.map((item) => _generateData(item)));
          return prev;
        },
        []
      );
    } else if (!isArray$1(data[0]) && isObject$1(data[0]) && Object.prototype.hasOwnProperty.call(data[0], props2.childrenKey)) {
      pickerMode = "cascade";
      _generateOrUpdateCascadeData(
        data,
        1,
        props2.modelValue
      );
    } else {
      pickerMode = "signle";
      pickerData.value = [data.map((item) => _generateData(item))];
    }
    nextTick$1(() => {
      initDefaultPickerIndex();
    });
  };
  watch(
    () => props2.data,
    () => {
      splitUserPickerData();
    },
    {
      immediate: true,
      deep: true
    }
  );
  const _getCurrentPickerValue = () => {
    if (pickerMode === "signle" && !isArray$1(props2.data[0])) {
      return pickerData.value[0][currentPickerIndex.value[0]].value;
    } else {
      const pickerIndex = cloneDeep(currentPickerIndex.value);
      pickerIndex.splice(pickerData.value.length);
      return pickerIndex.map(
        (item, index2) => {
          var _a2;
          return isEmptyVariableInDefault((_a2 = pickerData.value[index2][item]) == null ? void 0 : _a2.value, 0);
        }
      );
    }
  };
  const _getCurrentPickerOriginData = () => {
    if (pickerMode === "signle" && !isArray$1(props2.data[0])) {
      return pickerData.value[0][currentPickerIndex.value[0]].originalData;
    } else {
      const pickerIndex = cloneDeep(currentPickerIndex.value);
      pickerIndex.splice(pickerData.value.length);
      return pickerIndex.map(
        (item, index2) => {
          var _a2;
          return isEmptyVariableInDefault(
            (_a2 = pickerData.value[index2][item]) == null ? void 0 : _a2.originalData,
            void 0
          );
        }
      );
    }
  };
  const _generatePickerViewData = (val) => {
    if (pickerMode === "cascade") {
      _generateOrUpdateCascadeData(
        props2.data,
        1,
        val
      );
    }
    nextTick$1(() => {
      initDefaultPickerIndex();
    });
  };
  let isInnerUpdate = false;
  watch(
    () => props2.modelValue,
    (val) => {
      if (isInnerUpdate) {
        isInnerUpdate = false;
        return;
      }
      _generatePickerViewData(val);
    },
    {
      deep: true
    }
  );
  const pickerViewPickStartEvent = () => {
    isPickerScrolling.value = true;
    emit2("pickstart");
  };
  const pickerViewPickerEndEvent = () => {
    isPickerScrolling.value = false;
    emit2("pickend");
  };
  let changeTimer = null;
  let continuousChangeStatus = false;
  const pickerViewChangeEvent = (e2) => {
    if (continuousChangeStatus) {
      return;
    }
    changeTimer = setTimeout(() => {
      continuousChangeStatus = false;
      changeTimer && clearTimeout(changeTimer);
      changeTimer = null;
    }, 300);
    continuousChangeStatus = true;
    let changePickerColumnIndex = currentPickerIndex.value.findIndex(
      (item, index2) => item !== e2.detail.value[index2]
    );
    changePickerColumnIndex = ~changePickerColumnIndex ? changePickerColumnIndex : 0;
    currentPickerIndex.value = e2.detail.value;
    if (pickerMode === "cascade") {
      let data = props2.data;
      for (let i = 0; i < changePickerColumnIndex; i++) {
        data = data[currentPickerIndex.value[i]][props2.childrenKey];
      }
      const pickerIndex = currentPickerIndex.value[changePickerColumnIndex];
      pickerData.value.splice(changePickerColumnIndex + 1);
      if (data[pickerIndex] && Object.prototype.hasOwnProperty.call(
        data[pickerIndex],
        props2.childrenKey
      )) {
        _generateOrUpdateCascadeData(
          data[pickerIndex][props2.childrenKey],
          changePickerColumnIndex + 2
        );
        currentPickerIndex.value = pickerData.value.map((item, index2) => {
          return index2 <= changePickerColumnIndex ? currentPickerIndex.value[index2] : 0;
        });
      }
    }
    isInnerUpdate = true;
    const value2 = _getCurrentPickerValue();
    const originData = _getCurrentPickerOriginData();
    emit2(CHANGE_EVENT, value2, changePickerColumnIndex, originData);
    if (isBeforeConfirm) {
      isBeforeConfirm = false;
      emit2(UPDATE_MODEL_EVENT, value2);
    }
  };
  const resetPickerIndexWithPosition = (start, end) => {
    currentPickerIndex.value = currentPickerIndex.value.map((item, index2) => {
      return index2 >= start && (!end || index2 <= end) ? 0 : item;
    });
  };
  const confirmEvent = () => {
    if (isPickerScrolling.value) {
      if (props2.allowConfirmBeforeScrollEnd) {
        isBeforeConfirm = true;
      } else {
        return;
      }
    }
    const value2 = _getCurrentPickerValue();
    const originData = _getCurrentPickerOriginData();
    isInnerUpdate = true;
    emit2(UPDATE_MODEL_EVENT, value2);
    nextTick$1(() => {
      emit2("confirm", value2, originData);
    });
    _closePopup();
  };
  const cancelEvent = () => {
    _generatePickerViewData(props2.modelValue);
    emit2("cancel");
    _closePopup();
  };
  return {
    openPopup,
    showPicker,
    pickerData,
    currentPickerIndex,
    isPickerScrolling,
    closePopupEvent,
    pickerViewPickStartEvent,
    pickerViewPickerEndEvent,
    pickerViewChangeEvent,
    confirmEvent,
    cancelEvent,
    initDefaultPickerIndex,
    resetPickerIndexWithPosition
  };
};
const numberBoxProps = buildProps({
  /**
   * @description 步进器绑定的值
   */
  modelValue: {
    type: Number,
    default: 0
  },
  /**
   * @description 步进器的尺寸
   */
  size: useComponentSizeProp,
  /**
   * @description 步进器的宽度
   */
  width: String,
  /**
   * @description 步进器的高度
   */
  height: String,
  /**
   * @description 文字大小
   */
  fontSize: String,
  /**
   * @description 步进器背景颜色，以tn开头则使用图鸟内置的颜色只支持普通颜色
   */
  bgColor: String,
  /**
   * @description 步进器字体颜色，以tn开头则使用图鸟内置的颜色只支持普通颜色
   */
  textColor: String,
  /**
   * @description 步进器的最小值
   */
  min: {
    type: Number,
    default: 0
  },
  /**
   * @description 步进器的最大值
   */
  max: {
    type: Number,
    default: 100
  },
  /**
   * @description 步进器的步长
   */
  step: {
    type: Number,
    default: 1
  },
  /**
   * @description 禁止步进器操作
   */
  disabled: Boolean,
  /**
   * @description 禁止步进器输入
   */
  inputDisabled: Boolean,
  /**
   * @description 输入框与键盘的间距，单位px
   */
  inputSpacing: {
    type: Number,
    default: 20
  },
  /**
   * @description 长按递增减
   */
  longPress: {
    type: Boolean,
    default: true
  },
  /**
   * @description 长按递增减的间隔时间，单位ms
   */
  longPressInterval: {
    type: Number,
    default: 250
  },
  /**
   * @description 值发生修改时是否触发表单验证
   */
  validateEvent: {
    type: Boolean,
    default: true
  }
});
const numberBoxEmits = {
  [UPDATE_MODEL_EVENT]: (val) => isNumber(val),
  [CHANGE_EVENT]: (val) => isNumber(val),
  [INPUT_EVENT]: (val) => isNumber(val)
};
const useNumberBoxCustomStyle = (props2, inputValue) => {
  const ns = useNamespace("number-box");
  const [bgColorClass, bgColorStyle] = useComponentColor(
    toRef(props2, "bgColor"),
    "bg"
  );
  const [textColorClass, textColorStyle] = useComponentColor(
    toRef(props2, "textColor"),
    "text"
  );
  const numberBoxClass = computed(() => {
    const cls = [ns.b()];
    if (props2.size)
      cls.push(ns.m(props2.size));
    if (props2.disabled)
      cls.push(ns.m("disabled"));
    return cls.join(" ");
  });
  const numberBoxStyle = computed(() => {
    const style = {};
    if (props2.width)
      style.width = formatDomSizeValue(props2.width);
    if (props2.height)
      style.height = formatDomSizeValue(props2.height);
    if (props2.fontSize)
      style.fontSize = formatDomSizeValue(props2.fontSize);
    return style;
  });
  const numberBoxOperationWrapperClass = computed(() => {
    return (type2) => {
      const cls = [];
      if (bgColorClass.value)
        cls.push(bgColorClass.value);
      if (textColorClass.value)
        cls.push(textColorClass.value);
      if (type2 === "minus" && inputValue.value <= props2.min || type2 === "plus" && inputValue.value >= props2.max) {
        cls.push(ns.is("disabled"));
      }
      return cls.join(" ");
    };
  });
  const numberBoxOperationWrapperStyle = computed(() => {
    return (type2) => {
      const style = {};
      if (!bgColorClass.value)
        style.backgroundColor = bgColorStyle.value || "var(--tn-color-gray-light)";
      if (textColorStyle.value)
        style.color = textColorStyle.value;
      if (type2 === "minus" || type2 === "plus") {
        if (props2.height) {
          style.width = formatDomSizeValue(props2.height);
          style.height = style.width;
        }
        if (props2.fontSize) {
          style.fontSize = `calc(${formatDomSizeValue(props2.fontSize)} * 1.2)`;
        }
      }
      return style;
    };
  });
  return {
    ns,
    numberBoxClass,
    numberBoxStyle,
    numberBoxOperationWrapperClass,
    numberBoxOperationWrapperStyle
  };
};
const useNumberBox = (props2) => {
  const { emit: emit2 } = getCurrentInstance();
  const { formItem } = useFormItem();
  const inputValue = ref(0);
  watch(
    () => props2.modelValue,
    (val) => {
      const value2 = isEmptyVariableInDefault(val, 0);
      inputValue.value = Math.max(props2.min, Math.min(value2, props2.max));
    },
    {
      immediate: true
    }
  );
  const step = computed(() => props2.step || 1);
  const operationEvent = (type2) => {
    if (props2.disabled)
      return;
    let value2 = inputValue.value;
    if (type2 === "minus")
      value2 -= step.value;
    else if (type2 === "plus")
      value2 += step.value;
    if (value2 < props2.min) {
      value2 = props2.min;
      props2.longPress && clearLongPressTimer();
    }
    if (value2 > props2.max) {
      value2 = props2.max;
      props2.longPress && clearLongPressTimer();
    }
    updateNumberBoxValue(value2);
  };
  const { clearLongPressTimer, handleLongPressEvent: handleOperationEvent } = useLongPress(
    operationEvent,
    toRef(props2, "longPress"),
    props2.longPressInterval
  );
  const numberBoxInputEvent = (e2) => {
    const inputEventValue = e2.detail.value || 0;
    let value2 = Number(inputEventValue);
    if (value2 < props2.min) {
      value2 = props2.min;
    }
    if (value2 > props2.max) {
      value2 = props2.max;
    }
    emit2(INPUT_EVENT, inputEventValue);
    if (props2.validateEvent) {
      formItem == null ? void 0 : formItem.validate("input").catch(() => {
      });
    }
    updateNumberBoxValue(value2);
  };
  const updateNumberBoxValue = (value2) => {
    const stepValueArray = step.value.toString().split(".");
    const decimalCount = stepValueArray.length > 1 ? stepValueArray[1].length : 0;
    value2 = Number(value2.toFixed(decimalCount));
    nextTick$1(() => {
      setTimeout(() => {
        inputValue.value = value2;
      }, 0);
    });
    emit2(UPDATE_MODEL_EVENT, value2);
    nextTick$1(() => {
      var _a2;
      emit2(CHANGE_EVENT, value2);
      if (props2.validateEvent) {
        (_a2 = formItem == null ? void 0 : formItem.validate) == null ? void 0 : _a2.call(formItem, "change").catch((err) => {
          debugWarn(err);
        });
      }
    });
  };
  return {
    inputValue,
    handleOperationEvent,
    clearLongPressTimer,
    numberBoxInputEvent
  };
};
const props$5 = defineMixin({
  props: {
    // 列表数组，元素可为字符串，如为对象可通过keyName指定目标属性名
    list: {
      type: Array,
      default: () => defProps.swiper.list
    },
    // 是否显示面板指示器
    indicator: {
      type: Boolean,
      default: () => defProps.swiper.indicator
    },
    // 指示器非激活颜色
    indicatorActiveColor: {
      type: String,
      default: () => defProps.swiper.indicatorActiveColor
    },
    // 指示器的激活颜色
    indicatorInactiveColor: {
      type: String,
      default: () => defProps.swiper.indicatorInactiveColor
    },
    // 指示器样式，可通过bottom，left，right进行定位
    indicatorStyle: {
      type: [String, Object],
      default: () => defProps.swiper.indicatorStyle
    },
    // 指示器模式，line-线型，dot-点型
    indicatorMode: {
      type: String,
      default: () => defProps.swiper.indicatorMode
    },
    // 是否自动切换
    autoplay: {
      type: Boolean,
      default: () => defProps.swiper.autoplay
    },
    // 当前所在滑块的 index
    current: {
      type: [String, Number],
      default: () => defProps.swiper.current
    },
    // 当前所在滑块的 item-id ，不能与 current 被同时指定
    currentItemId: {
      type: String,
      default: () => defProps.swiper.currentItemId
    },
    // 滑块自动切换时间间隔
    interval: {
      type: [String, Number],
      default: () => defProps.swiper.interval
    },
    // 滑块切换过程所需时间
    duration: {
      type: [String, Number],
      default: () => defProps.swiper.duration
    },
    // 播放到末尾后是否重新回到开头
    circular: {
      type: Boolean,
      default: () => defProps.swiper.circular
    },
    // 前边距，可用于露出前一项的一小部分，nvue和支付宝不支持
    previousMargin: {
      type: [String, Number],
      default: () => defProps.swiper.previousMargin
    },
    // 后边距，可用于露出后一项的一小部分，nvue和支付宝不支持
    nextMargin: {
      type: [String, Number],
      default: () => defProps.swiper.nextMargin
    },
    // 当开启时，会根据滑动速度，连续滑动多屏，支付宝不支持
    acceleration: {
      type: Boolean,
      default: () => defProps.swiper.acceleration
    },
    // 同时显示的滑块数量，nvue、支付宝小程序不支持
    displayMultipleItems: {
      type: Number,
      default: () => defProps.swiper.displayMultipleItems
    },
    // 指定swiper切换缓动动画类型，有效值：default、linear、easeInCubic、easeOutCubic、easeInOutCubic
    // 只对微信小程序有效
    easingFunction: {
      type: String,
      default: () => defProps.swiper.easingFunction
    },
    // list数组中指定对象的目标属性名
    keyName: {
      type: String,
      default: () => defProps.swiper.keyName
    },
    // 图片的裁剪模式
    imgMode: {
      type: String,
      default: () => defProps.swiper.imgMode
    },
    // 组件高度
    height: {
      type: [String, Number],
      default: () => defProps.swiper.height
    },
    // 背景颜色
    bgColor: {
      type: String,
      default: () => defProps.swiper.bgColor
    },
    // 组件圆角，数值或带单位的字符串
    radius: {
      type: [String, Number],
      default: () => defProps.swiper.radius
    },
    // 是否加载中
    loading: {
      type: Boolean,
      default: () => defProps.swiper.loading
    },
    // 是否显示标题，要求数组对象中有title属性
    showTitle: {
      type: Boolean,
      default: () => defProps.swiper.showTitle
    }
  }
});
const props$4 = defineMixin({
  props: {
    // 文字颜色
    color: {
      type: String,
      default: () => defProps.link.color
    },
    // 字体大小，单位px
    fontSize: {
      type: [String, Number],
      default: () => defProps.link.fontSize
    },
    // 是否显示下划线
    underLine: {
      type: Boolean,
      default: () => defProps.link.underLine
    },
    // 要跳转的链接
    href: {
      type: String,
      default: () => defProps.link.href
    },
    // 小程序中复制到粘贴板的提示语
    mpTips: {
      type: String,
      default: () => defProps.link.mpTips
    },
    // 下划线颜色
    lineColor: {
      type: String,
      default: () => defProps.link.lineColor
    },
    // 超链接的问题，不使用slot形式传入，是因为nvue下无法修改颜色
    text: {
      type: String,
      default: () => defProps.link.text
    }
  }
});
const overlayProps = buildProps$1({
  /**
   * @description 是否显示遮罩层
   */
  show: {
    type: Boolean,
    default: false
  },
  /**
   * @description 动画时间，单位毫秒
   */
  duration: {
    type: Number,
    default: 300
  },
  /**
   * @description 遮罩层透明度，有效值0-1
   */
  opacity: {
    type: Number,
    default: 0.5
  },
  /**
   * @description zIndex
   */
  zIndex: {
    type: Number,
    default: ZIndex$1.mask
  }
});
const overlayEmits = {
  "update:show": (value2) => isBoolean$1(value2),
  click: () => true
};
const useOverlay = (props2, emits) => {
  const ns = useNamespace$1("overlay");
  const overlayClass = computed(() => {
    const cls = [ns.b()];
    if (props2.show)
      cls.push(ns.m("show"));
    return cls.join(" ");
  });
  const overlayStyle = computed(() => {
    const style = {};
    style.transitionDuration = `${isEmptyVariableInDefault$1(
      props2.duration,
      300
    )}ms`;
    style.backgroundColor = `rgba(0, 0, 0, ${isEmptyVariableInDefault$1(
      props2.opacity,
      0.5
    )})`;
    if (props2.zIndex)
      style.zIndex = props2.zIndex;
    return style;
  });
  const overlayClick = () => {
    emits("update:show", false);
    emits("click");
  };
  return {
    ns,
    overlayClass,
    overlayStyle,
    overlayClick
  };
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "overlay",
  props: overlayProps,
  emits: overlayEmits,
  setup(__props, { emit: __emit }) {
    const props2 = __props;
    const emits = __emit;
    const { overlayClass, overlayStyle, overlayClick } = useOverlay(props2, emits);
    return (_ctx, _cache) => {
      return {
        a: n(unref(overlayClass)),
        b: s(unref(overlayStyle)),
        c: o(
          //@ts-ignore
          (...args) => unref(overlayClick) && unref(overlayClick)(...args)
        ),
        d: o(() => {
        }),
        e: gei(_ctx, "")
      };
    };
  }
});
const Component$1 = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-40a804f4"]]);
withNoopInstall$1(Component$1);
const popupOpenDirection = [
  "top",
  "bottom",
  "left",
  "right",
  "center"
];
const popupCloseBtnPosition = [
  "left-top",
  "right-top",
  "left-bottom",
  "right-bottom"
];
const popupProps = buildProps$1({
  /**
   * @description 控制弹框是否显示
   */
  modelValue: Boolean,
  /**
   * @description 弹框打开的方向
   */
  openDirection: {
    type: String,
    values: popupOpenDirection,
    default: "center"
  },
  /**
   * @description 弹窗的宽度，在 openDirection 为 left 或 right 或 center 时生效
   */
  width: {
    type: [String, Number]
  },
  /**
   * @description 弹窗的高度，在 openDirection 为 top 或 bottom 或 center 时生效
   */
  height: {
    type: [String, Number]
  },
  /**
   * @description 弹框的内容的背景颜色
   */
  bgColor: {
    type: String,
    default: "#fff"
  },
  /**
   * @description 弹框的内容的圆角
   */
  radius: {
    type: [String, Number],
    default: 15
  },
  /**
   * @description 是否显示overlay遮罩层
   */
  overlay: {
    type: Boolean,
    default: true
  },
  /**
   * @description overlay遮罩层的透明度
   */
  overlayOpacity: overlayProps["opacity"],
  /**
   * @description 点击overlay关闭弹框
   */
  overlayCloseable: {
    type: Boolean,
    default: true
  },
  /**
   * @description 是否显示关闭按钮
   */
  closeBtn: Boolean,
  /**
   * @description 关闭按钮的位置
   */
  closeBtnPosition: {
    type: String,
    values: popupCloseBtnPosition,
    default: "right-top"
  },
  /**
   * @description 底部是否开启安全区域
   */
  safeAreaInsetBottom: useComponentSafeAreaInsetBottomProp$1,
  /**
   * @description zIndex
   */
  zIndex: {
    type: Number,
    default: ZIndex$1.popup
  },
  /**
   * @description 距离顶部的距离，在 openDirection 为 top 或 left 或 right 时生效，默认单位为`px`
   */
  top: {
    type: [String, Number]
  }
});
const popupEmits = {
  [UPDATE_MODEL_EVENT$1]: (value2) => isBoolean$1(value2),
  open: () => true,
  close: () => true,
  ["overlay-click"]: () => true
};
const usePopupCustomStyle = (props2) => {
  const ns = useNamespace$1("popup");
  const zIndex2 = computed(() => Number(props2.zIndex));
  const overlayZIndex = computed(() => zIndex2.value - 1);
  const [contentBgColorClass, contentBgColorStyle] = useComponentColor$1(
    toRef(props2, "bgColor"),
    "bg"
  );
  const popupContentClass = computed(() => {
    const cls = [ns.e("content")];
    if (props2.openDirection)
      cls.push(ns.em("content", props2.openDirection));
    if (props2.openDirection === "bottom" && props2.safeAreaInsetBottom) {
      cls.push("tn-u-safe-area");
    }
    if (contentBgColorClass.value)
      cls.push(contentBgColorClass.value);
    return cls.join(" ");
  });
  const popupContentStyle = computed(() => {
    const style = {};
    if (contentBgColorStyle.value)
      style.backgroundColor = contentBgColorStyle.value;
    if (props2.radius) {
      style.overflow = "hidden";
      if (props2.openDirection === "center") {
        style.borderRadius = formatDomSizeValue$1(props2.radius);
      }
      if (props2.openDirection === "top") {
        style.borderBottomLeftRadius = formatDomSizeValue$1(props2.radius);
        style.borderBottomRightRadius = formatDomSizeValue$1(props2.radius);
      }
      if (props2.openDirection === "left") {
        style.borderTopRightRadius = formatDomSizeValue$1(props2.radius);
        style.borderBottomRightRadius = formatDomSizeValue$1(props2.radius);
      }
      if (props2.openDirection === "right") {
        style.borderTopLeftRadius = formatDomSizeValue$1(props2.radius);
        style.borderBottomLeftRadius = formatDomSizeValue$1(props2.radius);
      }
      if (props2.openDirection === "bottom") {
        style.borderTopLeftRadius = formatDomSizeValue$1(props2.radius);
        style.borderTopRightRadius = formatDomSizeValue$1(props2.radius);
      }
    }
    if (props2.top && (props2.openDirection === "top" || props2.openDirection === "left" || props2.openDirection === "right")) {
      style.top = formatDomSizeValue$1(props2.top, "px");
    }
    if (props2.width && (props2.openDirection === "left" || props2.openDirection === "right" || props2.openDirection === "center")) {
      style.width = formatDomSizeValue$1(props2.width);
    }
    if (props2.height && (props2.openDirection === "top" || props2.openDirection === "bottom" || props2.openDirection === "center")) {
      style.height = formatDomSizeValue$1(props2.height);
    }
    if (props2.openDirection === "left" || props2.openDirection === "right") {
      if (props2.top)
        style.height = `calc(100% - ${formatDomSizeValue$1(props2.top, "px")})`;
    }
    style.zIndex = zIndex2.value;
    return style;
  });
  return {
    ns,
    zIndex: zIndex2,
    overlayZIndex,
    popupContentClass,
    popupContentStyle
  };
};
const usePopup = (props2) => {
  const { emit: emit2 } = getCurrentInstance();
  const iosDevice = computed(() => {
    const systemInfo = index$1.getSystemInfoSync();
    return systemInfo.osName === "ios" || systemInfo.osName === "macos";
  });
  const showOverlay = ref(false);
  const showPopup = ref(false);
  const visiblePopup = ref(false);
  let initPopupModelValue = false;
  watch(
    () => props2.modelValue,
    (value2) => {
      if (value2) {
        visiblePopup.value = true;
        if (iosDevice.value) {
          setTimeout(() => {
            showPopup.value = true;
            if (props2.overlay)
              showOverlay.value = true;
            initPopupModelValue && emit2("open");
          }, 0);
        } else {
          showPopup.value = true;
          if (props2.overlay)
            showOverlay.value = true;
          initPopupModelValue && emit2("open");
        }
      } else {
        showPopup.value = false;
        showOverlay.value = false;
        setTimeout(() => {
          visiblePopup.value = false;
        }, 250);
        initPopupModelValue && emit2("close");
      }
      initPopupModelValue = true;
    },
    {
      immediate: true
    }
  );
  const updateModelValue = (value2) => {
    emit2(UPDATE_MODEL_EVENT$1, value2);
  };
  const onClickCloseBtn = () => {
    updateModelValue(false);
    emit2("close");
  };
  const onClickOverlay = () => {
    if (props2.overlayCloseable) {
      updateModelValue(false);
      emit2("close");
      emit2("overlay-click");
    }
  };
  return {
    iosDevice,
    showOverlay,
    showPopup,
    visiblePopup,
    updateModelValue,
    onClickCloseBtn,
    onClickOverlay
  };
};
const loadingModes = ["semicircle", "circle", "flower"];
const loadingProps = buildProps({
  /**
   * @description 显示加载状态
   */
  show: Boolean,
  /**
   * @description 加载动画
   */
  animation: Boolean,
  /**
   * @description 加载模式
   */
  mode: {
    type: String,
    values: loadingModes,
    default: "circle"
  },
  /**
   * @description 加载颜色类型
   */
  type: {
    type: String,
    values: componentTypes,
    default: "primary"
  },
  /**
   * @description 颜色，以tn开头则使用图鸟内置的颜色
   */
  color: String,
  /**
   * @description 加载动画大小
   */
  size: {
    type: [String, Number]
  },
  /**
   * @description 加载动画执行时间，单位s
   */
  duration: {
    type: [String, Number]
  },
  /**
   * @description 加载动画执行时间函数，仅mode为circle和semicircle时有效
   */
  timeFunction: String
});
const useLoadingCustomStyle = (props2) => {
  const ns = useNamespace("loading");
  const [colorClass, colorStyle, updateColor] = useComponentColor(
    toRef(props2, "color"),
    "bg"
  );
  const { sizeType } = useComponentSize(props2.size);
  const loadingClass = computed(() => {
    const cls = [];
    cls.push(ns.b());
    if (props2.size && sizeType.value === "inner")
      cls.push(ns.m(props2.size));
    return cls.join(" ");
  });
  const loadingStyle = computed(() => {
    const style = {};
    if (props2.size && sizeType.value === "custom")
      style.width = style.height = formatDomSizeValue(props2.size);
    return style;
  });
  const loadingContentClass = computed(() => {
    const cls = [];
    cls.push(ns.b());
    if (props2.animation)
      cls.push(ns.m("animation"));
    return cls.join(" ");
  });
  const loadingContentStyle = computed(() => {
    const style = {};
    if (props2.type)
      style["--loading-color"] = `var(--tn-color-${props2.type})`;
    if (props2.color && colorClass.value) {
      const color2 = props2.color.replace("tn-", "");
      style["--loading-color"] = `var(--tn-color-${color2})`;
    }
    if (colorStyle.value)
      style["--loading-color"] = colorStyle.value;
    if (props2.duration)
      style.animationDuration = `${props2.duration}s`;
    if (props2.mode === "circle" || props2.mode === "semicircle") {
      if (props2.timeFunction)
        style.animationTimingFunction = props2.timeFunction;
    }
    return style;
  });
  return {
    ns,
    loadingClass,
    loadingStyle,
    loadingContentClass,
    loadingContentStyle,
    updateColor
  };
};
const props$3 = defineMixin({
  props: {
    // 返回顶部的形状，circle-圆形，square-方形
    mode: {
      type: String,
      default: () => defProps.backtop.mode
    },
    // 自定义图标
    icon: {
      type: String,
      default: () => defProps.backtop.icon
    },
    // 提示文字
    text: {
      type: String,
      default: () => defProps.backtop.text
    },
    // 返回顶部滚动时间
    duration: {
      type: [String, Number],
      default: () => defProps.backtop.duration
    },
    // 滚动距离
    scrollTop: {
      type: [String, Number],
      default: () => defProps.backtop.scrollTop
    },
    // 距离顶部多少距离显示，单位px
    top: {
      type: [String, Number],
      default: () => defProps.backtop.top
    },
    // 返回顶部按钮到底部的距离，单位px
    bottom: {
      type: [String, Number],
      default: () => defProps.backtop.bottom
    },
    // 返回顶部按钮到右边的距离，单位px
    right: {
      type: [String, Number],
      default: () => defProps.backtop.right
    },
    // 层级
    zIndex: {
      type: [String, Number],
      default: () => defProps.backtop.zIndex
    },
    // 图标的样式，对象形式
    iconStyle: {
      type: Object,
      default: () => defProps.backtop.iconStyle
    }
  }
});
const badgeProps = buildProps({
  /**
   * @description 徽标内容，可以是数字或者字符串，当为数字时，超过max会显示{max}+，以icon-开头则显示图标
   */
  value: {
    type: [String, Number]
  },
  /**
   * @description 徽标内容最大值，在value为number时有效，超过最大值会显示{max}+
   */
  max: {
    type: [String, Number]
  },
  /**
   * @description 徽标颜色类型
   */
  type: {
    type: String,
    values: componentTypes,
    default: "primary"
  },
  /**
   * @description 徽标背景颜色, 以tn开头则使用图鸟内置的颜色
   */
  bgColor: String,
  /**
   * @description 徽标文字颜色, 以tn开头则使用图鸟内置的颜色
   */
  textColor: String,
  /**
   * @description 徽标大小
   */
  size: {
    type: [String, Number]
  },
  /**
   * @description 字体大小
   */
  fontSize: {
    type: [String, Number]
  },
  /**
   * @description 徽标加粗
   */
  bold: Boolean,
  /**
   * @description 自定义徽标样式
   */
  customStyle: useComponentCustomStyleProp,
  /**
   * @description 自定义徽标类
   */
  customClass: String,
  /**
   * @description 是否显示点徽标
   */
  dot: Boolean,
  /**
   * @description 是否绝对定位徽标
   */
  absolute: {
    type: Boolean,
    default: true
  },
  /**
   * @description 绝对定位的位置
   */
  absolutePosition: {
    type: definePropType(Object),
    default: () => ({})
  },
  /**
   * @description 绝对居中对齐
   */
  absoluteCenter: {
    type: Boolean,
    default: true
  },
  /**
   * @description 点击标识
   */
  index: useComponentIndexProp
});
const badgeEmits = {
  /**
   * @description 点击事件
   */
  click: (index2) => typeof index2 === "number" || typeof index2 === "string"
};
const useBadge = (props2, emits) => {
  const showBadge = computed(() => {
    return !!props2.dot || props2.value !== "" && props2.value !== void 0;
  });
  const contentType = computed(() => {
    let type2 = "string";
    if (isNumber(props2.value))
      type2 = "number";
    if (isString(props2.value) && props2.value.startsWith("icon-"))
      type2 = "icon";
    return type2;
  });
  const content = computed(() => {
    if (props2.dot)
      return "";
    if (contentType.value === "number" && props2.max) {
      const value2 = Number(props2.value || 0);
      const max = Number(props2.max || 0);
      return value2 > max ? `${max}+` : `${value2}`;
    }
    if (contentType.value === "icon")
      return props2.value.replace("icon-", "");
    return props2.value;
  });
  const badgeClick = () => {
    if (emits)
      emits("click", props2.index);
  };
  return {
    showBadge,
    contentType,
    content,
    badgeClick
  };
};
const useBadgeCustomStyle = (props2) => {
  const ns = useNamespace("badge");
  const contentNs = useNamespace("badge-content");
  const { contentType } = useBadge(props2);
  const [bgColorClass, bgColorStyle] = useComponentColor(
    toRef(props2, "bgColor"),
    "bg"
  );
  const [textColorClass, textColorStyle] = useComponentColor(
    toRef(props2, "textColor"),
    "text"
  );
  const { sizeType } = useComponentSize(props2.size);
  const badgeContentClass = computed(() => {
    const cls = [];
    cls.push(contentNs.b());
    if (props2.dot)
      cls.push(contentNs.m("dot"));
    if (contentType.value === "icon")
      cls.push(contentNs.m("icon"));
    if (props2.absolute) {
      cls.push(contentNs.e("absolute"));
      if (props2.absoluteCenter)
        cls.push(contentNs.em("absolute", "center"));
    }
    if (props2.type)
      cls.push(`tn-type-${props2.type}_bg`);
    if (bgColorClass.value)
      cls.push(bgColorClass.value);
    if (textColorClass.value)
      cls.push(textColorClass.value);
    if (props2.size && sizeType.value === "inner")
      cls.push(contentNs.m(props2.size));
    if (props2.bold)
      cls.push("tn-text-bold");
    if (props2.customClass)
      cls.push(props2.customClass);
    return cls.join(" ");
  });
  const badgeContentStyle = computed(() => {
    const style = {};
    if (bgColorStyle.value)
      style.backgroundColor = bgColorStyle.value;
    if (textColorStyle.value)
      style.color = textColorStyle.value;
    if (props2.size && (sizeType.value === "custom" || contentType.value === "icon"))
      style.width = style.height = formatDomSizeValue(props2.size);
    if (props2.fontSize)
      style.fontSize = formatDomSizeValue(props2.fontSize);
    if (props2.absolutePosition.top)
      style.top = formatDomSizeValue(props2.absolutePosition.top);
    if (props2.absolutePosition.right)
      style.right = formatDomSizeValue(props2.absolutePosition.right);
    if (!isEmpty(props2.customStyle)) {
      Object.assign(style, props2.customStyle);
    }
    return style;
  });
  return {
    ns,
    contentNs,
    badgeContentClass,
    badgeContentStyle
  };
};
const props$2 = defineMixin({
  props: {
    // 是否显示圆点
    isDot: {
      type: Boolean,
      default: () => defProps.badge.isDot
    },
    // 显示的内容
    value: {
      type: [Number, String],
      default: () => defProps.badge.value
    },
    // 显示的内容
    modelValue: {
      type: [Number, String],
      default: () => defProps.badge.modelValue
    },
    // 是否显示
    show: {
      type: Boolean,
      default: () => defProps.badge.show
    },
    // 最大值，超过最大值会显示 '{max}+'
    max: {
      type: [Number, String],
      default: () => defProps.badge.max
    },
    // 主题类型，error|warning|success|primary
    type: {
      type: String,
      default: () => defProps.badge.type
    },
    // 当数值为 0 时，是否展示 Badge
    showZero: {
      type: Boolean,
      default: () => defProps.badge.showZero
    },
    // 背景颜色，优先级比type高，如设置，type参数会失效
    bgColor: {
      type: [String, null],
      default: () => defProps.badge.bgColor
    },
    // 字体颜色
    color: {
      type: [String, null],
      default: () => defProps.badge.color
    },
    // 徽标形状，circle-四角均为圆角，horn-左下角为直角
    shape: {
      type: String,
      default: () => defProps.badge.shape
    },
    // 设置数字的显示方式，overflow|ellipsis|limit
    // overflow会根据max字段判断，超出显示`${max}+`
    // ellipsis会根据max判断，超出显示`${max}...`
    // limit会依据1000作为判断条件，超出1000，显示`${value/1000}K`，比如2.2k、3.34w，最多保留2位小数
    numberType: {
      type: String,
      default: () => defProps.badge.numberType
    },
    // 设置badge的位置偏移，格式为 [x, y]，也即设置的为top和right的值，absolute为true时有效
    offset: {
      type: Array,
      default: () => defProps.badge.offset
    },
    // 是否反转背景和字体颜色
    inverted: {
      type: Boolean,
      default: () => defProps.badge.inverted
    },
    // 是否绝对定位
    absolute: {
      type: Boolean,
      default: () => defProps.badge.absolute
    }
  }
});
const props$1 = defineMixin({
  props: {
    // 轮播的长度
    length: {
      type: [String, Number],
      default: () => defProps.swiperIndicator.length
    },
    // 当前处于活动状态的轮播的索引
    current: {
      type: [String, Number],
      default: () => defProps.swiperIndicator.current
    },
    // 指示器非激活颜色
    indicatorActiveColor: {
      type: String,
      default: () => defProps.swiperIndicator.indicatorActiveColor
    },
    // 指示器的激活颜色
    indicatorInactiveColor: {
      type: String,
      default: () => defProps.swiperIndicator.indicatorInactiveColor
    },
    // 指示器模式，line-线型，dot-点型
    indicatorMode: {
      type: String,
      default: () => defProps.swiperIndicator.indicatorMode
    }
  }
});
const props = defineMixin({
  props: {
    // 是否展示组件
    show: {
      type: Boolean,
      default: () => defProps.transition.show
    },
    // 使用的动画模式
    mode: {
      type: String,
      default: () => defProps.transition.mode
    },
    // 动画的执行时间，单位ms
    duration: {
      type: [String, Number],
      default: () => defProps.transition.duration
    },
    // 使用的动画过渡函数
    timingFunction: {
      type: String,
      default: () => defProps.transition.timingFunction
    }
  }
});
const getClassNames = (name) => ({
  enter: `u-${name}-enter u-${name}-enter-active`,
  "enter-to": `u-${name}-enter-to u-${name}-enter-active`,
  leave: `u-${name}-leave u-${name}-leave-active`,
  "leave-to": `u-${name}-leave-to u-${name}-leave-active`
});
const transitionMixin = {
  methods: {
    // 组件被点击发出事件
    clickHandler() {
      this.$emit("click");
    },
    // vue版本的组件进场处理
    async vueEnter() {
      const classNames = getClassNames(this.mode);
      this.status = "enter";
      this.$emit("beforeEnter");
      this.inited = true;
      this.display = true;
      this.classes = classNames.enter;
      await nextTick$1();
      {
        await sleep(20);
        this.$emit("enter");
        this.transitionEnded = false;
        this.$emit("afterEnter");
        this.classes = classNames["enter-to"];
      }
    },
    // 动画离场处理
    async vueLeave() {
      if (!this.display)
        return;
      const classNames = getClassNames(this.mode);
      this.status = "leave";
      this.$emit("beforeLeave");
      this.classes = classNames.leave;
      await nextTick$1();
      {
        this.transitionEnded = false;
        this.$emit("leave");
        setTimeout(this.onTransitionEnd, this.duration);
        this.classes = classNames["leave-to"];
      }
    },
    // 完成过渡后触发
    onTransitionEnd() {
      if (this.transitionEnded)
        return;
      this.transitionEnded = true;
      this.$emit(this.status === "leave" ? "afterLeave" : "afterEnter");
      if (!this.show && this.display) {
        this.display = false;
        this.inited = false;
      }
    }
  }
};
exports.Component = Component$2;
exports.Component$1 = Component$1;
exports._export_sfc = _export_sfc;
exports.addStyle = addStyle;
exports.addUnit = addUnit;
exports.avatarEmits = avatarEmits;
exports.avatarGroupEmits = avatarGroupEmits;
exports.avatarGroupProps = avatarGroupProps;
exports.avatarProps = avatarProps;
exports.badgeEmits = badgeEmits;
exports.badgeProps = badgeProps;
exports.buildProps = buildProps;
exports.buttonEmits = buttonEmits;
exports.buttonMixin = buttonMixin;
exports.buttonProps = buttonProps;
exports.circleProgressProps = circleProgressProps;
exports.color = color$1;
exports.colorGradient = colorGradient;
exports.computed = computed;
exports.config = config;
exports.createPinia = createPinia;
exports.createSSRApp = createSSRApp;
exports.dayjs = dayjs;
exports.deepMerge = deepMerge$3;
exports.defProps = defProps;
exports.defineComponent = defineComponent;
exports.definePropType = definePropType;
exports.defineStore = defineStore;
exports.e = e;
exports.error = error;
exports.f = f;
exports.gei = gei;
exports.getPx = getPx;
exports.iconEmits = iconEmits$1;
exports.iconEmits$1 = iconEmits;
exports.iconProps = iconProps$1;
exports.iconProps$1 = iconProps;
exports.icons = icons;
exports.imageUploadEmits = imageUploadEmits$1;
exports.imageUploadEmits$1 = imageUploadEmits;
exports.imageUploadProps = imageUploadProps$1;
exports.imageUploadProps$1 = imageUploadProps;
exports.index = index$1;
exports.inject = inject;
exports.inputEmits = inputEmits;
exports.inputProps = inputProps;
exports.isEmptyVariableInDefault = isEmptyVariableInDefault;
exports.isRef = isRef;
exports.lazyLoadEmits = lazyLoadEmits$1;
exports.lazyLoadEmits$1 = lazyLoadEmits;
exports.lazyLoadProps = lazyLoadProps$1;
exports.lazyLoadProps$1 = lazyLoadProps;
exports.loadingProps = loadingProps;
exports.m = m;
exports.mergeModels = mergeModels;
exports.mixin = mixin;
exports.mpMixin = mpMixin;
exports.n = n;
exports.nextTick$1 = nextTick$1;
exports.numberBoxEmits = numberBoxEmits;
exports.numberBoxProps = numberBoxProps;
exports.o = o;
exports.onHide = onHide;
exports.onLoad = onLoad;
exports.onMounted = onMounted;
exports.onPageScroll = onPageScroll;
exports.onReady = onReady;
exports.onShareAppMessage = onShareAppMessage;
exports.onShareTimeline = onShareTimeline;
exports.onShow = onShow;
exports.onUnload = onUnload;
exports.onUnmounted = onUnmounted;
exports.openType = openType;
exports.p = p;
exports.photoAlbumEmits = photoAlbumEmits$1;
exports.photoAlbumEmits$1 = photoAlbumEmits;
exports.photoAlbumProps = photoAlbumProps$1;
exports.photoAlbumProps$1 = photoAlbumProps;
exports.pickerEmits = pickerEmits;
exports.pickerProps = pickerProps;
exports.popupEmits = popupEmits$1;
exports.popupEmits$1 = popupEmits;
exports.popupProps = popupProps$1;
exports.popupProps$1 = popupProps;
exports.props = props$j;
exports.props$1 = props$i;
exports.props$10 = props$9;
exports.props$11 = props$8;
exports.props$12 = props$7;
exports.props$13 = props$6;
exports.props$14 = props$5;
exports.props$15 = props$4;
exports.props$16 = props$3;
exports.props$17 = props$2;
exports.props$18 = props$1;
exports.props$19 = props;
exports.props$2 = props$h;
exports.props$3 = props$g;
exports.props$4 = props$f;
exports.props$5 = props$e;
exports.props$6 = props$d;
exports.props$7 = props$c;
exports.props$8 = props$b;
exports.props$9 = props$a;
exports.provide = provide;
exports.r = r;
exports.random = random;
exports.reactive = reactive;
exports.ref = ref;
exports.resolveComponent = resolveComponent;
exports.s = s;
exports.scrollListEmits = scrollListEmits;
exports.scrollListProps = scrollListProps;
exports.sleep = sleep;
exports.sr = sr;
exports.storeToRefs = storeToRefs;
exports.switchTabEmits = switchTabEmits;
exports.switchTabProps = switchTabProps;
exports.sys = sys;
exports.t = t;
exports.tagEmits = tagEmits;
exports.tagProps = tagProps;
exports.test = test;
exports.throttle = throttle;
exports.timeLineDataEmits = timeLineDataEmits;
exports.timeLineDataProps = timeLineDataProps;
exports.timeLineItemEmits = timeLineItemEmits;
exports.timeLineItemProps = timeLineItemProps;
exports.timeLineKey = timeLineKey;
exports.timeLineProps = timeLineProps;
exports.titleEmits = titleEmits;
exports.titleProps = titleProps;
exports.toRef = toRef;
exports.toast = toast;
exports.transitionMixin = transitionMixin;
exports.unref = unref;
exports.updateUserInfoPopupEmits = updateUserInfoPopupEmits;
exports.updateUserInfoPopupProps = updateUserInfoPopupProps;
exports.useAvatar = useAvatar;
exports.useAvatarBadgeProps = useAvatarBadgeProps;
exports.useAvatarCustomStyle = useAvatarCustomStyle;
exports.useAvatarGroup = useAvatarGroup;
exports.useAvatarIconConfig = useAvatarIconConfig;
exports.useAvatarProps = useAvatarProps;
exports.useBadge = useBadge;
exports.useBadgeCustomStyle = useBadgeCustomStyle;
exports.useButton = useButton;
exports.useButtonCustomStyle = useButtonCustomStyle;
exports.useCircleProgress = useCircleProgress;
exports.useComponentColor = useComponentColor;
exports.useIcon = useIcon$1;
exports.useIcon$1 = useIcon;
exports.useImageUpload = useImageUpload$1;
exports.useImageUpload$1 = useImageUpload;
exports.useInput = useInput;
exports.useInputCustomStyle = useInputCustomStyle;
exports.useLazyLoad = useLazyLoad$1;
exports.useLazyLoad$1 = useLazyLoad;
exports.useLazyLoadCustomStyle = useLazyLoadCustomStyle$1;
exports.useLazyLoadCustomStyle$1 = useLazyLoadCustomStyle;
exports.useLoadingCustomStyle = useLoadingCustomStyle;
exports.useModel = useModel;
exports.useNamespace = useNamespace;
exports.useNamespace$1 = useNamespace$1;
exports.useNumberBox = useNumberBox;
exports.useNumberBoxCustomStyle = useNumberBoxCustomStyle;
exports.usePhotoAlbum = usePhotoAlbum$1;
exports.usePhotoAlbum$1 = usePhotoAlbum;
exports.usePicker = usePicker;
exports.usePickerCustomStyle = usePickerCustomStyle;
exports.usePopup = usePopup$1;
exports.usePopup$1 = usePopup;
exports.usePopupCustomStyle = usePopupCustomStyle$1;
exports.usePopupCustomStyle$1 = usePopupCustomStyle;
exports.useScrollList = useScrollList;
exports.useScrollListCustomStyle = useScrollListCustomStyle;
exports.useSlots = useSlots;
exports.useSwitchTab = useSwitchTab;
exports.useSwitchTabCustomStyle = useSwitchTabCustomStyle;
exports.useTag = useTag;
exports.useTagCustomStyle = useTagCustomStyle;
exports.useTimeLineCustomStyle = useTimeLineCustomStyle;
exports.useTimeLineDataCustomStyle = useTimeLineDataCustomStyle;
exports.useTitleCustomStyle = useTitleCustomStyle;
exports.useUpdateUserInfoPopup = useUpdateUserInfoPopup;
exports.useUpdateUserInfoPopupCustomStyle = useUpdateUserInfoPopupCustomStyle;
exports.useWaterFall = useWaterFall;
exports.uviewPlus = uviewPlus;
exports.value = value;
exports.w = w;
exports.watch = watch;
exports.waterFallProps = waterFallProps;
exports.wx$1 = wx$1;
