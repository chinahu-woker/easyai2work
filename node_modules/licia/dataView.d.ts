declare const dataView: {
    getInt8(buf: Uint8Array, offset: number): number;
    getInt16(buf: Uint8Array, offset: number, le?: boolean): number;
    setInt16(buf: Uint8Array, offset: number, val: number, le?: boolean): void;
    getUint16(buf: Uint8Array, offset: number, le?: boolean): number;
    setUint16(buf: Uint8Array, offset: number, val: number, le?: boolean): void;
    getInt32(buf: Uint8Array, offset: number, le?: boolean): number;
    setInt32(buf: Uint8Array, offset: number, val: number, le?: boolean): void;
    getUint32(buf: Uint8Array, offset: number, le?: boolean): number;
    setUint32(buf: Uint8Array, offset: number, val: number, le?: boolean): void;
};

export = dataView;
