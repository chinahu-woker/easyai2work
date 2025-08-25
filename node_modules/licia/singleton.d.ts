import types = require('./types');
import has = require('./has');

declare function singleton<F extends types.Fn<Promise<any>>>(
    fn: F,
    hashFn?: types.AnyFn
): F;

export = singleton;
