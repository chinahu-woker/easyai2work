interface AppXUniConfig {
    pages: unknown[];
    globalStyle: unknown;
    appname: string;
    compilerVersion: string;
    fallbackLocale: unknown;
    tabBar: unknown;
    entryPagePath: string;
    entryPageQuery?: string;
    conditionUrl?: string;
    realEntryPagePath?: string;
    themeConfig?: unknown;
}
export declare function normalizeAppXUniConfig(pagesJson: UniApp.PagesJson, manifestJson: Record<string, any>): AppXUniConfig;
export {};
