"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeUniAppXAppPagesJson = void 0;
const path_1 = __importDefault(require("path"));
const shared_1 = require("@vue/shared");
const json_1 = require("./json");
const pages_1 = require("./pages");
const utils_1 = require("../utils");
function normalizeUniAppXAppPagesJson(jsonStr) {
    const pagesJson = {
        pages: [],
        globalStyle: {},
    };
    let userPagesJson = {
        pages: [],
        globalStyle: {},
    };
    // preprocess
    try {
        userPagesJson = (0, json_1.parseJson)(jsonStr, true);
    }
    catch (e) {
        console.error(`[vite] Error: pages.json parse failed.\n`, jsonStr, e);
    }
    // pages
    (0, pages_1.validatePages)(userPagesJson, jsonStr);
    userPagesJson.subPackages =
        userPagesJson.subPackages || userPagesJson.subpackages;
    // subPackages
    if (userPagesJson.subPackages) {
        userPagesJson.pages.push(...normalizeSubPackages(userPagesJson.subPackages));
    }
    pagesJson.pages = userPagesJson.pages;
    // pageStyle
    normalizePages(pagesJson.pages);
    // globalStyle
    pagesJson.globalStyle = normalizePageStyle(userPagesJson.globalStyle);
    // tabBar
    if (userPagesJson.tabBar) {
        pagesJson.tabBar = userPagesJson.tabBar;
    }
    return pagesJson;
}
exports.normalizeUniAppXAppPagesJson = normalizeUniAppXAppPagesJson;
function normalizeSubPackages(subPackages) {
    const pages = [];
    if ((0, shared_1.isArray)(subPackages)) {
        subPackages.forEach(({ root, pages: subPages }) => {
            if (root && subPages.length) {
                subPages.forEach((subPage) => {
                    subPage.path = (0, utils_1.normalizePath)(path_1.default.join(root, subPage.path));
                    subPage.style = subPage.style;
                    pages.push(subPage);
                });
            }
        });
    }
    return pages;
}
function normalizePages(pages) {
    pages.forEach((page) => {
        page.style = normalizePageStyle(page.style);
    });
}
function normalizePageStyle(pageStyle) {
    if (pageStyle) {
        (0, shared_1.extend)(pageStyle, pageStyle['app']);
        (0, pages_1.removePlatformStyle)(pageStyle);
        return pageStyle;
    }
    return {};
}
