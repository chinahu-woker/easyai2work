"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genScript = void 0;
function genScript({ script }, _options) {
    if (!script) {
        return `
export default {}
`;
    }
    return ('\n'.repeat(script.loc.start.line - 1) +
        `${script.content}
`);
}
exports.genScript = genScript;
