import { CacheExpression, ComponentNode, ConstantTypes, DirectiveNode, ElementNode, ExpressionNode, JSChildNode, ParentNode, PlainElementNode, Property, RootNode, TemplateChildNode, TemplateLiteral, TemplateNode } from '@vue/compiler-core';
import { TransformOptions } from './options';
export type NodeTransform = (node: RootNode | TemplateChildNode, context: TransformContext) => void | (() => void) | (() => void)[];
export type DirectiveTransform = (dir: DirectiveNode, node: ElementNode, context: TransformContext, augmentor?: (ret: DirectiveTransformResult) => DirectiveTransformResult) => DirectiveTransformResult;
export interface DirectiveTransformResult {
    props: Property[];
    needRuntime?: boolean | symbol;
    ssrTagParts?: TemplateLiteral['elements'];
}
export type StructuralDirectiveTransform = (node: ElementNode, dir: DirectiveNode, context: TransformContext) => void | (() => void);
export interface ImportItem {
    exp: string | ExpressionNode;
    path: string;
}
export interface TransformContext extends Required<Omit<TransformOptions, 'filename'>> {
    selfName: string | null;
    root: RootNode;
    helpers: Map<symbol, number>;
    components: Set<string>;
    directives: Set<string>;
    imports: ImportItem[];
    temps: number;
    cached: number;
    identifiers: {
        [name: string]: number | undefined;
    };
    scopes: {
        vFor: number;
        vSlot: number;
        vPre: number;
        vOnce: number;
    };
    parent: ParentNode | null;
    childIndex: number;
    currentNode: RootNode | TemplateChildNode | null;
    inVOnce: boolean;
    helper<T extends symbol>(name: T): T;
    removeHelper<T extends symbol>(name: T): void;
    helperString(name: symbol): string;
    replaceNode(node: TemplateChildNode): void;
    removeNode(node?: TemplateChildNode): void;
    onNodeRemoved(): void;
    addIdentifiers(exp: ExpressionNode | string): void;
    removeIdentifiers(exp: ExpressionNode | string): void;
    cache<T extends JSChildNode>(exp: T, isVNode?: boolean): CacheExpression | T;
    constantCache: Map<TemplateChildNode, ConstantTypes>;
}
export declare function createTransformContext(root: RootNode, { targetLanguage, filename, prefixIdentifiers, nodeTransforms, directiveTransforms, scopeId, slotted, isBuiltInComponent, isCustomElement, onError, onWarn, }: TransformOptions): TransformContext;
export declare function transform(root: RootNode, options: TransformOptions): void;
export declare function isSingleElementRoot(root: RootNode, child: TemplateChildNode): child is PlainElementNode | ComponentNode | TemplateNode;
export declare function traverseChildren(parent: ParentNode, context: TransformContext): void;
export declare function traverseNode(node: RootNode | TemplateChildNode, context: TransformContext): void;
export declare function createStructuralDirectiveTransform(name: string | RegExp, fn: StructuralDirectiveTransform): NodeTransform;
