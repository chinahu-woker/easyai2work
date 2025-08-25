import { CompilerOptions } from './options';
import { ExpressionNode } from '@vue/compiler-core';
export declare function genRenderFunctionDecl({ targetLanguage, filename, }: CompilerOptions): string;
export declare const objectExp: RegExp;
export declare function object2Map(exp: ExpressionNode | string, wrap?: boolean): string;
