"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setSrcDescriptor = exports.getSrcDescriptor = exports.getDescriptor = exports.setPrevDescriptor = exports.getPrevDescriptor = exports.createDescriptor = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const crypto_1 = require("crypto");
const uni_cli_shared_1 = require("@dcloudio/uni-cli-shared");
const cache = new Map();
const prevCache = new Map();
function createDescriptor(filename, source, { root, sourceMap, compiler }) {
    const { descriptor, errors } = compiler.parse(source, {
        filename,
        sourceMap,
    });
    // ensure the path is normalized in a way that is consistent inside
    // project (relative to root) and on different systems.
    const normalizedPath = (0, uni_cli_shared_1.normalizePath)(path_1.default.normalize(path_1.default.relative(root, filename)));
    descriptor.id = getHash(normalizedPath);
    cache.set(filename, descriptor);
    return { descriptor, errors };
}
exports.createDescriptor = createDescriptor;
function getPrevDescriptor(filename) {
    return prevCache.get(filename);
}
exports.getPrevDescriptor = getPrevDescriptor;
function setPrevDescriptor(filename, entry) {
    prevCache.set(filename, entry);
}
exports.setPrevDescriptor = setPrevDescriptor;
function getDescriptor(filename, options, createIfNotFound = true) {
    if (cache.has(filename)) {
        return cache.get(filename);
    }
    if (createIfNotFound) {
        const { descriptor, errors } = createDescriptor(filename, fs_1.default.readFileSync(filename, 'utf-8'), options);
        if (errors.length) {
            throw errors[0];
        }
        return descriptor;
    }
}
exports.getDescriptor = getDescriptor;
function getSrcDescriptor(filename) {
    return cache.get(filename);
}
exports.getSrcDescriptor = getSrcDescriptor;
function setSrcDescriptor(filename, entry) {
    cache.set(filename, entry);
}
exports.setSrcDescriptor = setSrcDescriptor;
function getHash(text) {
    return (0, crypto_1.createHash)('sha256').update(text).digest('hex').substring(0, 8);
}
