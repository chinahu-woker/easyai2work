"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = void 0;
const source_map_1 = require("source-map");
const compiler_core_1 = require("@vue/compiler-core");
const shared_1 = require("@vue/shared");
const utils_1 = require("./utils");
const runtimeHelpers_1 = require("./runtimeHelpers");
const utils_2 = require("./utils");
function createCodegenContext(ast, { targetLanguage, mode = 'default', prefixIdentifiers = false, bindingMetadata = {}, sourceMap = false, filename = '', matchEasyCom = shared_1.NOOP, parseUTSComponent = shared_1.NOOP, }) {
    const context = {
        targetLanguage,
        mode,
        prefixIdentifiers,
        bindingMetadata,
        sourceMap,
        filename,
        source: ast.loc.source,
        code: ``,
        importEasyComponents: [],
        importUTSComponents: [],
        column: 1,
        line: 1,
        offset: 0,
        indentLevel: 0,
        map: undefined,
        matchEasyCom,
        parseUTSComponent,
        helper(key) {
            return `${compiler_core_1.helperNameMap[key]}`;
        },
        push(code, node) {
            context.code += code;
            if (context.map) {
                if (node) {
                    let name;
                    if (node.type === 4 /* NodeTypes.SIMPLE_EXPRESSION */) {
                        const content = node.content.replace(/^_ctx\./, '');
                        if (content !== node.content && (0, compiler_core_1.isSimpleIdentifier)(content)) {
                            name = content;
                        }
                    }
                    addMapping(node.loc.start, name);
                }
                (0, compiler_core_1.advancePositionWithMutation)(context, code);
                if (node && node.loc !== compiler_core_1.locStub) {
                    addMapping(node.loc.end);
                }
            }
        },
        indent() {
            newline(++context.indentLevel);
        },
        deindent(withoutNewLine = false) {
            if (withoutNewLine) {
                --context.indentLevel;
            }
            else {
                newline(--context.indentLevel);
            }
        },
        newline() {
            newline(context.indentLevel);
        },
    };
    function newline(n) {
        context.push('\n' + `  `.repeat(n));
    }
    function addMapping(loc, name) {
        context.map.addMapping({
            name,
            source: context.filename,
            original: {
                line: loc.line,
                column: loc.column - 1, // source-map column is 0 based
            },
            generated: {
                line: context.line,
                column: context.column - 1,
            },
        });
    }
    if (sourceMap) {
        // lazy require source-map implementation, only in non-browser builds
        context.map = new source_map_1.SourceMapGenerator();
        context.map.setSourceContent(filename, context.source);
    }
    return context;
}
function generate(ast, options) {
    const context = createCodegenContext(ast, options);
    const { mode, deindent, indent, push, newline } = context;
    if (mode === 'function') {
        genEasyComImports(ast.components, context);
        push((0, utils_1.genRenderFunctionDecl)(options) + ` {`);
        // generate asset resolution statements
        if (ast.components.length) {
            newline();
            genAssets(ast.components, 'component', context);
            if (ast.directives.length || ast.temps > 0) {
                newline();
            }
        }
        if (ast.directives.length) {
            genAssets(ast.directives, 'directive', context);
            if (ast.temps > 0) {
                newline();
            }
        }
        if (ast.components.length || ast.directives.length || ast.temps) {
            newline();
        }
        indent();
        push(`return `);
    }
    if (ast.codegenNode) {
        genNode(ast.codegenNode, context);
    }
    else {
        push(`null`);
    }
    if (mode === 'function') {
        deindent();
        push(`}`);
    }
    return {
        code: context.code,
        importEasyComponents: context.importEasyComponents,
        importUTSComponents: context.importUTSComponents,
        // SourceMapGenerator does have toJSON() method but it's not in the types
        map: context.map ? context.map.toJSON() : undefined,
    };
}
exports.generate = generate;
function genEasyComImports(components, { push, newline, matchEasyCom, targetLanguage }) {
    for (let i = 0; i < components.length; i++) {
        let id = components[i];
        const maybeSelfReference = id.endsWith('__self');
        if (maybeSelfReference) {
            id = id.slice(0, -6);
        }
        const source = matchEasyCom(id, true);
        if (source) {
            const componentId = (0, compiler_core_1.toValidAssetId)(id, 'easycom');
            push(`import ${componentId} from '${source}'`);
            newline();
        }
    }
}
function genAssets(assets, type, { helper, push, newline, importEasyComponents, matchEasyCom }) {
    const resolver = helper(type === 'component' ? runtimeHelpers_1.RESOLVE_COMPONENT : runtimeHelpers_1.RESOLVE_DIRECTIVE);
    for (let i = 0; i < assets.length; i++) {
        let id = assets[i];
        // potential component implicit self-reference inferred from SFC filename
        const maybeSelfReference = id.endsWith('__self');
        if (maybeSelfReference) {
            id = id.slice(0, -6);
        }
        let assetCode = '';
        if (type === 'component') {
            const source = matchEasyCom(id, false);
            if (source) {
                const easyComponentId = (0, compiler_core_1.toValidAssetId)(id, 'easycom');
                const componentId = (0, compiler_core_1.toValidAssetId)(id, type);
                assetCode = `const ${componentId} = ${helper(runtimeHelpers_1.RESOLVE_EASY_COMPONENT)}(${JSON.stringify(id)},${easyComponentId}${maybeSelfReference ? `, true` : ``})`;
                const importCode = `import ${easyComponentId} from '${source}';`;
                if (!importEasyComponents.includes(importCode)) {
                    importEasyComponents.push(importCode);
                }
            }
        }
        if (!assetCode) {
            assetCode = `const ${(0, compiler_core_1.toValidAssetId)(id, type)} = ${resolver}(${JSON.stringify(id)}${maybeSelfReference ? `, true` : ``})`;
        }
        push(assetCode);
        if (i < assets.length - 1) {
            newline();
        }
    }
}
function isText(n) {
    return ((0, shared_1.isString)(n) ||
        n.type === 4 /* NodeTypes.SIMPLE_EXPRESSION */ ||
        n.type === 2 /* NodeTypes.TEXT */ ||
        n.type === 5 /* NodeTypes.INTERPOLATION */ ||
        n.type === 8 /* NodeTypes.COMPOUND_EXPRESSION */);
}
function genNodeListAsArray(nodes, context) {
    const multilines = nodes.length > 3 || nodes.some((n) => (0, shared_1.isArray)(n) || !isText(n));
    context.push(`[`);
    multilines && context.indent();
    genNodeList(nodes, context, multilines);
    multilines && context.deindent();
    context.push(`]`);
}
function genNodeList(nodes, context, multilines = false, comma = true) {
    const { push, newline } = context;
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if ((0, shared_1.isString)(node)) {
            push(node);
        }
        else if ((0, shared_1.isArray)(node)) {
            genNodeListAsArray(node, context);
        }
        else {
            genNode(node, context);
        }
        if (i < nodes.length - 1) {
            if (multilines) {
                comma && push(',');
                newline();
            }
            else {
                comma && push(', ');
            }
        }
    }
}
function genNode(node, context) {
    if ((0, shared_1.isString)(node)) {
        context.push(node);
        return;
    }
    if ((0, shared_1.isSymbol)(node)) {
        context.push(context.helper(node));
        return;
    }
    switch (node.type) {
        case 1 /* NodeTypes.ELEMENT */:
        case 9 /* NodeTypes.IF */:
        case 11 /* NodeTypes.FOR */:
            genNode(node.codegenNode, context);
            break;
        case 2 /* NodeTypes.TEXT */:
            genText(node, context);
            break;
        case 4 /* NodeTypes.SIMPLE_EXPRESSION */:
            genExpression(node, context);
            break;
        case 5 /* NodeTypes.INTERPOLATION */:
            genInterpolation(node, context);
            break;
        case 12 /* NodeTypes.TEXT_CALL */:
            genNode(node.codegenNode, context);
            break;
        case 8 /* NodeTypes.COMPOUND_EXPRESSION */:
            genCompoundExpression(node, context);
            break;
        case 3 /* NodeTypes.COMMENT */:
            genComment(node, context);
            break;
        case 13 /* NodeTypes.VNODE_CALL */:
            genVNodeCall(node, context);
            break;
        case 14 /* NodeTypes.JS_CALL_EXPRESSION */:
            genCallExpression(node, context);
            break;
        case 15 /* NodeTypes.JS_OBJECT_EXPRESSION */:
            genObjectExpression(node, context);
            break;
        case 17 /* NodeTypes.JS_ARRAY_EXPRESSION */:
            genArrayExpression(node, context);
            break;
        case 18 /* NodeTypes.JS_FUNCTION_EXPRESSION */:
            genFunctionExpression(node, context);
            break;
        case 19 /* NodeTypes.JS_CONDITIONAL_EXPRESSION */:
            genConditionalExpression(node, context);
            break;
        case 20 /* NodeTypes.JS_CACHE_EXPRESSION */:
            genCacheExpression(node, context);
            break;
        /* istanbul ignore next */
        case 10 /* NodeTypes.IF_BRANCH */:
            // noop
            break;
        default:
    }
}
function genText(node, context) {
    context.push(JSON.stringify(node.content), node);
}
function genExpression(node, context) {
    const { content, isStatic } = node;
    context.push(isStatic ? JSON.stringify(content) : content, node);
}
function genInterpolation(node, context) {
    const { push, helper } = context;
    push(`${helper(compiler_core_1.TO_DISPLAY_STRING)}(`);
    genNode(node.content, context);
    push(`)`);
}
function genCompoundExpression(node, context) {
    for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        if ((0, shared_1.isString)(child)) {
            context.push(child);
        }
        else {
            genNode(child, context);
        }
    }
}
function genExpressionAsPropertyKey(node, context) {
    const { push } = context;
    if (node.type === 8 /* NodeTypes.COMPOUND_EXPRESSION */) {
        // dynamic arg genObjectExpression have added []
        // push(`[`)
        genCompoundExpression(node, context);
        // push(`]`)
    }
    else if (node.isStatic) {
        // only quote keys if necessary
        const text = JSON.stringify(node.content);
        push(text, node);
    }
    else {
        // dynamic arg genObjectExpression have added []
        // push(`[${node.content}]`, node)
        push(`${node.content}`, node);
    }
}
function genComment(node, context) {
    const { push, helper } = context;
    push(`${helper(compiler_core_1.CREATE_COMMENT)}(${JSON.stringify(node.content)})`, node);
}
function parseTag(tag, { parseUTSComponent, targetLanguage, importUTSComponents }) {
    if ((0, shared_1.isString)(tag)) {
        // 原生UTS组件
        const utsComponentOptions = parseUTSComponent(tag.slice(1, -1), targetLanguage);
        if (utsComponentOptions) {
            const importCode = `import '${utsComponentOptions.source}';`;
            if (!importUTSComponents.includes(importCode)) {
                importUTSComponents.push(importCode);
            }
            return (utsComponentOptions.namespace +
                '.' +
                utsComponentOptions.className +
                '.name');
        }
    }
    return tag;
}
function genVNodeCall(node, context) {
    const { push, helper } = context;
    const { tag, props, children, patchFlag, dynamicProps, directives, 
    // isBlock,
    disableTracking, isComponent, } = node;
    if (directives) {
        push(helper(compiler_core_1.WITH_DIRECTIVES) + `(`);
    }
    const isBlock = false;
    if (isBlock) {
        push(`(${helper(compiler_core_1.OPEN_BLOCK)}(${disableTracking ? `true` : ``}), `);
    }
    const callHelper = isBlock
        ? (0, compiler_core_1.getVNodeBlockHelper)(false, isComponent)
        : (0, compiler_core_1.getVNodeHelper)(false, isComponent);
    push(helper(callHelper) + `(`, node);
    genNodeList(genNullableArgs([
        parseTag(tag, context),
        props,
        children,
        patchFlag,
        dynamicProps,
    ]), context);
    push(`)`);
    if (isBlock) {
        push(`)`);
    }
    if (directives) {
        push(`, `);
        genNode(directives, context);
        push(`)`);
    }
}
function genNullableArgs(args) {
    let i = args.length;
    while (i--) {
        if (args[i] != null)
            break;
    }
    return args.slice(0, i + 1).map((arg) => arg || `null`);
}
// JavaScript
function genCallExpression(node, context) {
    const { push, helper } = context;
    const callee = (0, shared_1.isString)(node.callee) ? node.callee : helper(node.callee);
    push(callee + `(`, node);
    if (callee === helper(runtimeHelpers_1.RENDER_LIST)) {
        genRenderList(node);
    }
    if (callee === helper(runtimeHelpers_1.TO_HANDLERS)) {
        genToHandlers(node, push);
    }
    genNodeList(node.arguments, context);
    push(`)`);
}
function genRenderList(node) {
    node.arguments.forEach((argument) => {
        if (argument.type === 18 /* NodeTypes.JS_FUNCTION_EXPRESSION */) {
            argument.returnType = 'VNode';
        }
    });
}
function genToHandlers(node, push) {
    push(`new Map<string, any | null>([`);
    const argument = node.arguments[0];
    if (argument?.type === 8 /* NodeTypes.COMPOUND_EXPRESSION */) {
        ;
        argument.children.forEach((child, index) => {
            if ((0, shared_1.isString)(child)) {
                if (index ===
                    argument.children.length - 1) {
                    ;
                    argument.children[index] =
                        child.replace('}', '])');
                }
                else {
                    ;
                    argument.children[index] = child
                        .replace('{', '["')
                        .replace(',', ',["')
                        .replace(':', '",')
                        .replaceAll(' ', '');
                }
            }
            else {
                child.content = child.content += ']';
            }
        });
    }
    if (argument?.type === 4 /* NodeTypes.SIMPLE_EXPRESSION */) {
        ;
        argument.content =
            (0, utils_2.object2Map)(argument.content, false) + '])';
    }
}
function genObjectExpression(node, context) {
    const { push, indent, deindent, newline } = context;
    const { properties } = node;
    if (!properties.length) {
        push(`new Map<string, any | null>()`, node);
        return;
    }
    const multilines = properties.length > 1 ||
        properties.some((p) => p.value.type !== 4 /* NodeTypes.SIMPLE_EXPRESSION */);
    push(`new Map<string, any | null>([`);
    multilines && indent();
    for (let i = 0; i < properties.length; i++) {
        const { key, value } = properties[i];
        push(`[`);
        // key
        genExpressionAsPropertyKey(key, context);
        push(`, `);
        // value
        genNode(value, context);
        push(`]`);
        if (i < properties.length - 1) {
            // will only reach this if it's multilines
            push(`,`);
            newline();
        }
    }
    multilines && deindent();
    push(`])`);
}
function genArrayExpression(node, context) {
    genNodeListAsArray(node.elements, context);
}
function genFunctionExpression(node, context) {
    const { push, indent, deindent } = context;
    const { params, returns, body, newline, isSlot } = node;
    if (isSlot) {
        // wrap slot functions with owner context
        // push(`_${helperNameMap[WITH_CTX]}(`)
        push('(');
    }
    push(`(`, node);
    if ((0, shared_1.isArray)(params)) {
        genNodeList(params, context);
    }
    else if (params) {
        genNode(params, context);
    }
    if (node.returnType) {
        push(`):${node.returnType} => `);
    }
    else {
        if (isSlot) {
            // TODO: supplement types slots params type based on user-defined slots
            if (params) {
                push(`: Map<string, any | null>): any[] => `);
            }
            else {
                push(`): any[] => `);
            }
        }
        else {
            push(`) => `);
        }
    }
    if (newline || body) {
        push(`{`);
        indent();
    }
    if (returns) {
        if (newline) {
            push(`return `);
        }
        if ((0, shared_1.isArray)(returns)) {
            genNodeListAsArray(returns, context);
        }
        else {
            genNode(returns, context);
        }
    }
    else if (body) {
        genNode(body, context);
    }
    if (newline || body) {
        deindent();
        push(`}`);
    }
    if (isSlot) {
        push(`)`);
    }
}
function genConditionalExpression(node, context) {
    const { test, consequent, alternate, newline: needNewline } = node;
    const { push, indent, deindent, newline } = context;
    push(`${context.helper(runtimeHelpers_1.IS_TRUE)}(`);
    if (test.type === 4 /* NodeTypes.SIMPLE_EXPRESSION */) {
        genExpression(test, context);
    }
    else {
        genNode(test, context);
    }
    push(`)`);
    needNewline && indent();
    context.indentLevel++;
    needNewline || push(` `);
    push(`? `);
    genNode(consequent, context);
    context.indentLevel--;
    needNewline && newline();
    needNewline || push(` `);
    push(`: `);
    const isNested = alternate.type === 19 /* NodeTypes.JS_CONDITIONAL_EXPRESSION */;
    if (!isNested) {
        context.indentLevel++;
    }
    genNode(alternate, context);
    if (!isNested) {
        context.indentLevel--;
    }
    needNewline && deindent(true /* without newline */);
}
function genCacheExpression(node, context) {
    const { push, helper, indent, deindent, newline } = context;
    push(`_cache[${node.index}] || (`);
    if (node.isVNode) {
        indent();
        push(`${helper(compiler_core_1.SET_BLOCK_TRACKING)}(-1),`);
        newline();
    }
    push(`_cache[${node.index}] = `);
    genNode(node.value, context);
    if (node.isVNode) {
        push(`,`);
        newline();
        push(`${helper(compiler_core_1.SET_BLOCK_TRACKING)}(1),`);
        newline();
        push(`_cache[${node.index}]`);
        deindent();
    }
    push(`)`);
}
