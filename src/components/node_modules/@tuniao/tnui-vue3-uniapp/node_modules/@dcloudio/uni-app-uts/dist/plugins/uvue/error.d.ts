import type { CompilerError } from '@vue/compiler-sfc';
import type { RollupError } from 'rollup';
export declare function createRollupError(id: string, error: CompilerError | SyntaxError): RollupError;
