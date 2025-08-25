import { SourceMapGenerator } from 'source-map';
import { JSChildNode, RootNode, SSRCodegenNode, TemplateChildNode } from '@vue/compiler-core';
import { CodegenOptions, CodegenResult } from './options';
type CodegenNode = TemplateChildNode | JSChildNode | SSRCodegenNode;
export interface CodegenContext extends Required<CodegenOptions> {
    source: string;
    code: string;
    importEasyComponents: string[];
    importUTSComponents: string[];
    line: number;
    column: number;
    offset: number;
    indentLevel: number;
    map?: SourceMapGenerator;
    helper(key: symbol): string;
    push(code: string, node?: CodegenNode): void;
    indent(): void;
    deindent(withoutNewLine?: boolean): void;
    newline(): void;
}
export declare function generate(ast: RootNode, options: CodegenOptions): CodegenResult;
export {};
