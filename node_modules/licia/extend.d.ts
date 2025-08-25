declare function extend<T, T1>(destination: T, source1: T1): T & T1;
declare function extend<T, T1, T2>(
    destination: T,
    source1: T1,
    source2: T2
): T & T1 & T2;
declare function extend<T, T1, T2, T3>(
    destination: T,
    source1: T1,
    source2: T2,
    source3: T3
): T & T1 & T2 & T3;
declare function extend(destination: any, ...sources: any[]): any;

export = extend;
