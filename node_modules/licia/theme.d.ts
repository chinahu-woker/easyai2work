import Emitter = require('./Emitter');

declare namespace theme {
    interface ITheme extends Emitter {
        get(): string;
    }
}
declare const theme: theme.ITheme;

export = theme;
