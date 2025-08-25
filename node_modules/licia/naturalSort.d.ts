declare namespace naturalSort {
    interface INaturalSort {
        <T extends any[]>(arr: T): T;
        comparator(a: any, b: any): number;
    }
}
declare const naturalSort: naturalSort.INaturalSort;

export = naturalSort;
