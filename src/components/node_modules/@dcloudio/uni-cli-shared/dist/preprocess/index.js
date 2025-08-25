"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.preUVueJson = exports.preUVueCss = exports.preUVueHtml = exports.preUVueJs = exports.preNVueJson = exports.preNVueCss = exports.preNVueHtml = exports.preNVueJs = exports.preJson = exports.preCss = exports.preHtml = exports.preJs = exports.initPreContext = void 0;
const path_1 = __importDefault(require("path"));
const utils_1 = require("../utils");
const context_1 = require("./context");
/* eslint-disable no-restricted-globals */
const { preprocess: preprocessLib } = require('../../lib/preprocess');
var context_2 = require("./context");
Object.defineProperty(exports, "initPreContext", { enumerable: true, get: function () { return context_2.initPreContext; } });
function normalizeFilename(filename) {
    return () => {
        if (filename && process.env.UNI_INPUT_DIR) {
            const inputDir = (0, utils_1.normalizePath)(process.env.UNI_INPUT_DIR);
            filename = (0, utils_1.normalizePath)(filename.split('?')[0]);
            if (filename.startsWith(inputDir)) {
                return 'at ' + (0, utils_1.normalizePath)(path_1.default.relative(inputDir, filename)) + ':1';
            }
            return 'at ' + filename + ':1';
        }
    };
}
function preJs(jsCode, filename) {
    if (process.env.UNI_APP_X === 'true') {
        return preUVueJs(jsCode, filename);
    }
    return preprocess(jsCode, (0, context_1.getPreVueContext)(), {
        type: 'js',
        filename: normalizeFilename(filename),
    });
}
exports.preJs = preJs;
function preHtml(htmlCode, filename) {
    if (process.env.UNI_APP_X === 'true') {
        return preUVueHtml(htmlCode, filename);
    }
    return preprocess(htmlCode, (0, context_1.getPreVueContext)(), {
        type: 'html',
        filename: normalizeFilename(filename),
    });
}
exports.preHtml = preHtml;
exports.preCss = preJs;
exports.preJson = preJs;
function preNVueJs(jsCode, filename) {
    return preprocess(jsCode, (0, context_1.getPreNVueContext)(), {
        type: 'js',
        filename: normalizeFilename(filename),
    });
}
exports.preNVueJs = preNVueJs;
function preNVueHtml(htmlCode, filename) {
    return preprocess(htmlCode, (0, context_1.getPreNVueContext)(), {
        type: 'html',
        filename: normalizeFilename(filename),
    });
}
exports.preNVueHtml = preNVueHtml;
exports.preNVueCss = preNVueJs;
exports.preNVueJson = preNVueJs;
function preUVueJs(jsCode, filename) {
    return preprocess(jsCode, (0, context_1.getPreUVueContext)(), {
        type: 'js',
        filename: normalizeFilename(filename),
    });
}
exports.preUVueJs = preUVueJs;
function preUVueHtml(htmlCode, filename) {
    return preprocess(htmlCode, (0, context_1.getPreUVueContext)(), {
        type: 'html',
        filename: normalizeFilename(filename),
    });
}
exports.preUVueHtml = preUVueHtml;
exports.preUVueCss = preUVueJs;
exports.preUVueJson = preUVueJs;
const ERRORS = {
    html: `条件编译失败
%FILENAME%
参考示例(注意 ifdef 与 endif 必须配对使用):
<!--  #ifdef  %PLATFORM% -->
模板代码
<!--  #endif -->
`,
    js: `条件编译失败
%FILENAME%
参考示例(注意 ifdef 与 endif 必须配对使用):
// #ifdef  %PLATFORM%
代码
// #endif
`,
    css: `条件编译失败
%FILENAME%
参考示例(注意 ifdef 与 endif 必须配对使用):
/*  #ifdef  %PLATFORM%  */
代码
/*  #endif  */
`,
};
function preprocess(code, context, options) {
    try {
        return preprocessLib(code, context, options);
    }
    catch (e) {
        const msg = ERRORS[options.type];
        if (msg) {
            console.error(msg.replace('%FILENAME%', options.filename?.() || ''));
        }
        else {
            throw e;
        }
    }
    return code;
}
