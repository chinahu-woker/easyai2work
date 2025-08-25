import Emitter = require('./Emitter');

declare namespace dpr {
    interface IDpr extends Emitter {
        get(): number;
    }
}
declare const dpr: dpr.IDpr;

export = dpr;
