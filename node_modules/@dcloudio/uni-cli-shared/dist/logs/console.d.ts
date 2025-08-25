import type { TransformResult } from 'vite';
import type * as tsTypes from 'typescript';
export declare function rewriteConsoleExpr(method: string, id: string, filename: string, code: string, sourceMap?: boolean): TransformResult;
export declare function restoreConsoleExpr(code: string): string;
export declare function appendConsoleExpr(filename: string, code: string, ts: typeof tsTypes): string;
