"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRollupError = void 0;
function createRollupError(id, error) {
    const { message, name, stack } = error;
    const rollupError = {
        id,
        plugin: 'vue',
        message,
        name,
        stack,
    };
    if ('code' in error && error.loc) {
        rollupError.loc = {
            file: id,
            line: error.loc.start.line,
            column: error.loc.start.column,
        };
    }
    return rollupError;
}
exports.createRollupError = createRollupError;
