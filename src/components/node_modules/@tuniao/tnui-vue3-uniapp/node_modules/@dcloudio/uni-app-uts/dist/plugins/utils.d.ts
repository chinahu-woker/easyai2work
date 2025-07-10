export declare const ENTRY_FILENAME = "index.uts";
export declare function parseImports(code: string): Promise<string>;
export declare function uvueOutDir(): string;
export declare function genClassName(fileName: string, prefix?: string): string;
export declare function isVue(filename: string): boolean;
export declare function stringifyMap(obj: unknown): string;
export declare function parseUTSRelativeFilename(filename: string): string;
export declare function parseUTSImportFilename(filename: string): string;
