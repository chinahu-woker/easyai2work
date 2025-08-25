import type * as _compiler from '@vue/compiler-sfc';
import type { CompilerError, SFCDescriptor } from '@vue/compiler-sfc';
export interface ResolvedOptions {
    compiler: typeof _compiler;
    root: string;
    sourceMap: boolean;
    targetLanguage?: 'kotlin' | 'swift' | 'javascript';
    classNamePrefix?: string;
}
export interface SFCParseResult {
    descriptor: SFCDescriptor;
    errors: Array<CompilerError | SyntaxError>;
}
declare module '@vue/compiler-sfc' {
    interface SFCDescriptor {
        id: string;
    }
}
export declare function createDescriptor(filename: string, source: string, { root, sourceMap, compiler }: ResolvedOptions): SFCParseResult;
export declare function getPrevDescriptor(filename: string): SFCDescriptor | undefined;
export declare function setPrevDescriptor(filename: string, entry: SFCDescriptor): void;
export declare function getDescriptor(filename: string, options: ResolvedOptions, createIfNotFound?: boolean): SFCDescriptor | undefined;
export declare function getSrcDescriptor(filename: string): SFCDescriptor;
export declare function setSrcDescriptor(filename: string, entry: SFCDescriptor): void;
