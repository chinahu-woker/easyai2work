import {
  presets
} from "./chunk-DTT25XJ5.js";

// node_modules/.pnpm/@antfu+utils@9.0.0/node_modules/@antfu/utils/dist/index.mjs
function toArray(array) {
  array = array != null ? array : [];
  return Array.isArray(array) ? array : [array];
}
var VOID = Symbol("p-void");
function slash(str) {
  return str.replace(/\\/g, "/");
}
function throttle$1(delay, callback, options) {
  var _ref = options || {}, _ref$noTrailing = _ref.noTrailing, noTrailing = _ref$noTrailing === void 0 ? false : _ref$noTrailing, _ref$noLeading = _ref.noLeading, noLeading = _ref$noLeading === void 0 ? false : _ref$noLeading, _ref$debounceMode = _ref.debounceMode, debounceMode = _ref$debounceMode === void 0 ? void 0 : _ref$debounceMode;
  var timeoutID;
  var cancelled = false;
  var lastExec = 0;
  function clearExistingTimeout() {
    if (timeoutID) {
      clearTimeout(timeoutID);
    }
  }
  function cancel(options2) {
    var _ref2 = options2 || {}, _ref2$upcomingOnly = _ref2.upcomingOnly, upcomingOnly = _ref2$upcomingOnly === void 0 ? false : _ref2$upcomingOnly;
    clearExistingTimeout();
    cancelled = !upcomingOnly;
  }
  function wrapper() {
    for (var _len = arguments.length, arguments_ = new Array(_len), _key = 0; _key < _len; _key++) {
      arguments_[_key] = arguments[_key];
    }
    var self = this;
    var elapsed = Date.now() - lastExec;
    if (cancelled) {
      return;
    }
    function exec() {
      lastExec = Date.now();
      callback.apply(self, arguments_);
    }
    function clear() {
      timeoutID = void 0;
    }
    if (!noLeading && debounceMode && !timeoutID) {
      exec();
    }
    clearExistingTimeout();
    if (debounceMode === void 0 && elapsed > delay) {
      if (noLeading) {
        lastExec = Date.now();
        if (!noTrailing) {
          timeoutID = setTimeout(debounceMode ? clear : exec, delay);
        }
      } else {
        exec();
      }
    } else if (noTrailing !== true) {
      timeoutID = setTimeout(debounceMode ? clear : exec, debounceMode === void 0 ? delay - elapsed : delay);
    }
  }
  wrapper.cancel = cancel;
  return wrapper;
}
function throttle(...args) {
  return throttle$1(...args);
}

// src/core/unplugin.ts
import { isPackageExists as isPackageExists2 } from "local-pkg";
import pm from "picomatch";
import { createUnplugin } from "unplugin";

// src/core/ctx.ts
import { existsSync, promises as fs } from "node:fs";
import { dirname, isAbsolute, relative, resolve } from "node:path";
import process from "node:process";
import { isPackageExists } from "local-pkg";
import MagicString from "magic-string";
import { createUnimport, resolvePreset } from "unimport";
import { createFilter } from "unplugin-utils";

// src/core/biomelintrc.ts
function generateBiomeLintConfigs(imports) {
  const names = imports.map((i) => {
    var _a;
    return (_a = i.as) != null ? _a : i.name;
  }).filter(Boolean).sort();
  const config = { javascript: { globals: names } };
  const jsonBody = JSON.stringify(config, null, 2);
  return jsonBody;
}

// src/core/eslintrc.ts
function generateESLintConfigs(imports, eslintrc, globals = {}) {
  const eslintConfigs = { globals };
  imports.map((i) => {
    var _a;
    return (_a = i.as) != null ? _a : i.name;
  }).filter(Boolean).sort().forEach((name) => {
    eslintConfigs.globals[name] = eslintrc.globalsPropValue;
  });
  const jsonBody = JSON.stringify(eslintConfigs, null, 2);
  return jsonBody;
}

// src/core/resolvers.ts
function normalizeImport(info, name) {
  if (typeof info === "string") {
    return {
      name: "default",
      as: name,
      from: info
    };
  }
  if ("path" in info) {
    return {
      from: info.path,
      as: info.name,
      name: info.importName,
      sideEffects: info.sideEffects
    };
  }
  return {
    name,
    as: name,
    ...info
  };
}
async function firstMatchedResolver(resolvers, fullname) {
  let name = fullname;
  for (const resolver of resolvers) {
    if (typeof resolver === "object" && resolver.type === "directive") {
      if (name.startsWith("v"))
        name = name.slice(1);
      else
        continue;
    }
    const resolved = await (typeof resolver === "function" ? resolver(name) : resolver.resolve(name));
    if (resolved)
      return normalizeImport(resolved, fullname);
  }
}
function resolversAddon(resolvers) {
  return {
    name: "unplugin-auto-import:resolvers",
    async matchImports(names, matched) {
      if (!resolvers.length)
        return;
      const dynamic = [];
      const sideEffects = [];
      await Promise.all([...names].map(async (name) => {
        const matchedImport = matched.find((i) => i.as === name);
        if (matchedImport) {
          if ("sideEffects" in matchedImport)
            sideEffects.push(...toArray(matchedImport.sideEffects).map((i) => normalizeImport(i, "")));
          return;
        }
        const resolved = await firstMatchedResolver(resolvers, name);
        if (resolved)
          dynamic.push(resolved);
        if (resolved == null ? void 0 : resolved.sideEffects)
          sideEffects.push(...toArray(resolved == null ? void 0 : resolved.sideEffects).map((i) => normalizeImport(i, "")));
      }));
      if (dynamic.length) {
        this.dynamicImports.push(...dynamic);
        this.invalidate();
      }
      if (dynamic.length || sideEffects.length)
        return [...matched, ...dynamic, ...sideEffects];
    }
  };
}

// src/core/ctx.ts
function createContext(options = {}, root = process.cwd()) {
  var _a, _b, _c;
  root = slash(root);
  const {
    dts: preferDTS = isPackageExists("typescript"),
    dirsScanOptions,
    dirs,
    vueDirectives,
    vueTemplate
  } = options;
  const eslintrc = options.eslintrc || {};
  eslintrc.enabled = eslintrc.enabled === void 0 ? false : eslintrc.enabled;
  eslintrc.filepath = eslintrc.filepath || "./.eslintrc-auto-import.json";
  eslintrc.globalsPropValue = eslintrc.globalsPropValue === void 0 ? true : eslintrc.globalsPropValue;
  const biomelintrc = options.biomelintrc || {};
  biomelintrc.enabled = biomelintrc.enabled !== void 0;
  biomelintrc.filepath = biomelintrc.filepath || "./.biomelintrc-auto-import.json";
  const dumpUnimportItems = options.dumpUnimportItems === true ? "./.unimport-items.json" : (_a = options.dumpUnimportItems) != null ? _a : false;
  const resolvers = options.resolvers ? [options.resolvers].flat(2) : [];
  const injectAtEnd = options.injectAtEnd !== false;
  const unimport = createUnimport({
    imports: [],
    presets: (_c = (_b = options.packagePresets) == null ? void 0 : _b.map((p) => typeof p === "string" ? { package: p } : p)) != null ? _c : [],
    dirsScanOptions: {
      ...dirsScanOptions,
      cwd: root
    },
    dirs,
    injectAtEnd,
    parser: options.parser,
    addons: {
      addons: [
        resolversAddon(resolvers),
        {
          name: "unplugin-auto-import:dts",
          declaration(dts2) {
            return `${`
/* eslint-disable */
/* prettier-ignore */
// @ts-nocheck
// noinspection JSUnusedGlobalSymbols
// Generated by unplugin-auto-import
// biome-ignore lint: disable
${dts2}`.trim()}
`;
          }
        }
      ],
      vueDirectives,
      vueTemplate
    }
  });
  const importsPromise = flattenImports(options.imports).then((imports) => {
    var _a2, _b2;
    if (!imports.length && !resolvers.length && !(dirs == null ? void 0 : dirs.length))
      console.warn("[auto-import] plugin installed but no imports has defined, see https://github.com/antfu/unplugin-auto-import#configurations for configurations");
    const compare = (left, right) => {
      return right instanceof RegExp ? right.test(left) : right === left;
    };
    (_a2 = options.ignore) == null ? void 0 : _a2.forEach((name) => {
      const i = imports.find((i2) => compare(i2.as, name));
      if (i)
        i.disabled = true;
    });
    (_b2 = options.ignoreDts) == null ? void 0 : _b2.forEach((name) => {
      const i = imports.find((i2) => compare(i2.as, name));
      if (i)
        i.dtsDisabled = true;
    });
    return unimport.getInternalContext().replaceImports(imports);
  });
  const filter = createFilter(
    options.include || [/\.[jt]sx?$/, /\.astro$/, /\.vue$/, /\.vue\?vue/, /\.svelte$/],
    options.exclude || [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/]
  );
  const dts = preferDTS === false ? false : preferDTS === true ? resolve(root, "auto-imports.d.ts") : resolve(root, preferDTS);
  const multilineCommentsRE = /\/\*.*?\*\//gs;
  const singlelineCommentsRE = /\/\/.*$/gm;
  const dtsReg = /declare\s+global\s*\{(.*?)[\n\r]\}/s;
  const componentCustomPropertiesReg = /interface\s+ComponentCustomProperties\s*\{(.*?)[\n\r]\}/gs;
  function parseDTS(dts2) {
    var _a2;
    dts2 = dts2.replace(multilineCommentsRE, "").replace(singlelineCommentsRE, "");
    const code = (_a2 = dts2.match(dtsReg)) == null ? void 0 : _a2[0];
    if (!code)
      return;
    return Object.fromEntries(Array.from(code.matchAll(/['"]?(const\s*[^\s'"]+)['"]?\s*:\s*(.+?)[,;\r\n]/g)).map((i) => [i[1], i[2]]));
  }
  async function generateDTS(file) {
    await importsPromise;
    const dir = dirname(file);
    const originalContent = existsSync(file) ? await fs.readFile(file, "utf-8") : "";
    const originalDTS = parseDTS(originalContent);
    let currentContent = await unimport.generateTypeDeclarations({
      resolvePath: (i) => {
        if (i.from.startsWith(".") || isAbsolute(i.from)) {
          const related = slash(relative(dir, i.from).replace(/\.ts(x)?$/, ""));
          return !related.startsWith(".") ? `./${related}` : related;
        }
        return i.from;
      }
    });
    const currentDTS = parseDTS(currentContent);
    if (options.vueTemplate) {
      currentContent = currentContent.replace(
        componentCustomPropertiesReg,
        ($1) => `interface GlobalComponents {}
  ${$1}`
      );
    }
    if (originalDTS) {
      Object.keys(currentDTS).forEach((key) => {
        originalDTS[key] = currentDTS[key];
      });
      const dtsList = Object.keys(originalDTS).sort().map((k) => `  ${k}: ${originalDTS[k]}`);
      return currentContent.replace(dtsReg, () => `declare global {
${dtsList.join("\n")}
}`);
    }
    return currentContent;
  }
  async function parseESLint() {
    if (!eslintrc.filepath)
      return {};
    if (eslintrc.filepath.match(/\.[cm]?[jt]sx?$/))
      return {};
    const configStr = existsSync(eslintrc.filepath) ? await fs.readFile(eslintrc.filepath, "utf-8") : "";
    const config = JSON.parse(configStr || '{ "globals": {} }');
    return config.globals;
  }
  async function generateESLint() {
    return generateESLintConfigs(await unimport.getImports(), eslintrc, await parseESLint());
  }
  async function generateBiomeLint() {
    return generateBiomeLintConfigs(await unimport.getImports());
  }
  const writeConfigFilesThrottled = throttle(500, writeConfigFiles, { noLeading: false });
  async function writeFile(filePath, content = "") {
    await fs.mkdir(dirname(filePath), { recursive: true });
    return await fs.writeFile(filePath, content, "utf-8");
  }
  let lastDTS;
  let lastESLint;
  let lastBiomeLint;
  let lastUnimportItems;
  async function writeConfigFiles() {
    const promises = [];
    if (dts) {
      promises.push(
        generateDTS(dts).then((content) => {
          if (content !== lastDTS) {
            lastDTS = content;
            return writeFile(dts, content);
          }
        })
      );
    }
    if (eslintrc.enabled && eslintrc.filepath) {
      const filepath = eslintrc.filepath;
      promises.push(
        generateESLint().then(async (content) => {
          if (filepath.endsWith(".cjs"))
            content = `module.exports = ${content}`;
          else if (filepath.endsWith(".mjs") || filepath.endsWith(".js"))
            content = `export default ${content}`;
          content = `${content}
`;
          if (content.trim() !== (lastESLint == null ? void 0 : lastESLint.trim())) {
            lastESLint = content;
            return writeFile(eslintrc.filepath, content);
          }
        })
      );
    }
    if (biomelintrc.enabled) {
      promises.push(
        generateBiomeLint().then((content) => {
          if (content !== lastBiomeLint) {
            lastBiomeLint = content;
            return writeFile(biomelintrc.filepath, content);
          }
        })
      );
    }
    if (dumpUnimportItems) {
      promises.push(
        unimport.getImports().then((items) => {
          if (!dumpUnimportItems)
            return;
          const content = JSON.stringify(items, null, 2);
          if (content !== lastUnimportItems) {
            lastUnimportItems = content;
            return writeFile(dumpUnimportItems, content);
          }
        })
      );
    }
    return Promise.all(promises);
  }
  async function scanDirs() {
    await unimport.modifyDynamicImports(async (imports) => {
      const exports_ = await unimport.scanImportsFromDir();
      exports_.forEach((i) => i.__source = "dir");
      return modifyDefaultExportsAlias([
        ...imports.filter((i) => i.__source !== "dir"),
        ...exports_
      ], options);
    });
    writeConfigFilesThrottled();
  }
  async function transform(code, id) {
    await importsPromise;
    const s = new MagicString(code);
    await unimport.injectImports(s, id);
    if (!s.hasChanged())
      return;
    writeConfigFilesThrottled();
    return {
      code: s.toString(),
      map: s.generateMap({ source: id, includeContent: true, hires: true })
    };
  }
  return {
    root,
    dirs,
    filter,
    scanDirs,
    writeConfigFiles,
    writeConfigFilesThrottled,
    transform,
    generateDTS,
    generateESLint,
    unimport
  };
}
async function flattenImports(map) {
  const promises = await Promise.all(toArray(map).map(async (definition) => {
    if (typeof definition === "string") {
      if (!presets[definition])
        throw new Error(`[auto-import] preset ${definition} not found`);
      const preset = presets[definition];
      definition = typeof preset === "function" ? preset() : preset;
    }
    if ("from" in definition && "imports" in definition) {
      return await resolvePreset(definition);
    } else {
      const resolved = [];
      for (const mod of Object.keys(definition)) {
        for (const id of definition[mod]) {
          const meta = {
            from: mod
          };
          if (Array.isArray(id)) {
            meta.name = id[0];
            meta.as = id[1];
          } else {
            meta.name = id;
            meta.as = id;
          }
          resolved.push(meta);
        }
      }
      return resolved;
    }
  }));
  return promises.flat();
}
function modifyDefaultExportsAlias(imports, options) {
  if (options.defaultExportByFilename) {
    imports.forEach((i) => {
      var _a, _b, _c;
      if (i.name === "default")
        i.as = (_c = (_b = (_a = i.from.split("/").pop()) == null ? void 0 : _a.split(".")) == null ? void 0 : _b.shift()) != null ? _c : i.as;
    });
  }
  return imports;
}

// src/core/unplugin.ts
var unplugin_default = createUnplugin((options) => {
  let ctx = createContext(options);
  return {
    name: "unplugin-auto-import",
    enforce: "post",
    transformInclude(id) {
      return ctx.filter(id);
    },
    async transform(code, id) {
      return ctx.transform(code, id);
    },
    async buildStart() {
      await ctx.scanDirs();
    },
    async buildEnd() {
      await ctx.writeConfigFiles();
    },
    vite: {
      async config(config) {
        var _a;
        if (options.viteOptimizeDeps === false)
          return;
        const exclude = ((_a = config.optimizeDeps) == null ? void 0 : _a.exclude) || [];
        const imports = new Set((await ctx.unimport.getImports()).map((i) => i.from).filter((i) => i.match(/^[a-z@]/) && !exclude.includes(i) && isPackageExists2(i)));
        if (!imports.size)
          return;
        return {
          optimizeDeps: {
            include: [...imports]
          }
        };
      },
      async handleHotUpdate({ file }) {
        var _a;
        if ((_a = ctx.dirs) == null ? void 0 : _a.some((dir) => pm.isMatch(slash(file), slash(typeof dir === "string" ? dir : dir.glob))))
          await ctx.scanDirs();
      },
      async configResolved(config) {
        if (ctx.root !== config.root) {
          ctx = createContext(options, config.root);
          await ctx.scanDirs();
        }
      }
    }
  };
});

export {
  unplugin_default
};
