declare namespace table {
    interface IOptions {
        border?: {
            topBody?: string;
            topJoin?: string;
            topLeft?: string;
            topRight?: string;
            bottomBody?: string;
            bottomJoin?: string;
            bottomLeft?: string;
            bottomRight?: string;
            bodyLeft?: string;
            bodyRight?: string;
            bodyJoin?: string;
            joinBody?: string;
            joinLeft?: string;
            joinRight?: string;
            joinJoin?: string;
        };
    }
    function parse(table: string, options?: IOptions): Array<string[]>;
}
declare function table(rows: Array<string[]>, options?: table.IOptions): string;

export = table;
