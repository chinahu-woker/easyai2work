var each = require('./each');
var strWidth = require('./strWidth');
var map = require('./map');
var repeat = require('./repeat');
var cloneDeep = require('./cloneDeep');
var defaults = require('./defaults');
var trim = require('./trim');
var rtrim = require('./rtrim');
var filter = require('./filter');
exports = function(rows) {
    var options =
        arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    rows = cloneDeep(rows);
    options.border = options.border || {};
    defaults(options.border, defBorder);
    options.columns = getColumns(rows);
    padData(rows, options);
    return render(rows, options);
};
function padData(rows, options) {
    var columnCount = options.columns.length;
    for (var i = 0, len = rows.length; i < len; i++) {
        while (rows[i].length < columnCount) {
            rows[i].push('');
        }
    }
    return loopData(rows, function(data, row, column) {
        var _options$columns$colu = options.columns[column],
            paddingLeft = _options$columns$colu.paddingLeft,
            width = _options$columns$colu.width,
            paddingRight = _options$columns$colu.paddingRight;
        return (
            repeat(' ', paddingLeft) +
            data +
            repeat(' ', width - strWidth(data) - paddingRight)
        );
    });
}
function loopData(rows, handler) {
    for (var i = 0, len = rows.length; i < len; i++) {
        var row = rows[i];
        for (var j = 0, _len = row.length; j < _len; j++) {
            var data = handler(row[j], i, j);
            if (data) {
                row[j] = data;
            }
        }
    }
}
function getColumns(rows) {
    var columns = [];
    var paddingLeft = 1;
    var paddingRight = 1;
    loopData(rows, function(data, row, column) {
        columns[column] = columns[column] || {
            width: paddingLeft + paddingRight,
            paddingLeft: paddingLeft,
            paddingRight: paddingRight
        };
        var width = strWidth(data) + paddingLeft + paddingRight;
        if (width > columns[column].width) {
            columns[column].width = width;
        }
    });
    return columns;
}
function render(rows, options) {
    var ret = '';
    ret += renderBorder('top', options);
    each(rows, function(row, idx) {
        ret += renderRow(row, options);
        if (idx === rows.length - 1) {
            ret += renderBorder('bottom', options);
        } else {
            ret += renderBorder('join', options);
        }
    });
    return ret;
}
function renderRow(columns, options) {
    var border = options.border;
    return (
        border.bodyLeft +
        columns.join(border.bodyJoin) +
        border.bodyRight +
        '\n'
    );
}
function renderBorder(type, options) {
    var border = options.border,
        columns = options.columns;
    var left = border[type + 'Left'];
    var right = border[type + 'Right'];
    var body = border[type + 'Body'];
    var join = border[type + 'Join'];
    var ret = map(columns, function(column) {
        return repeat(body, column.width);
    }).join(join);
    ret = left + ret + right;
    if (type !== 'bottom') {
        ret += '\n';
    }
    return ret;
}
exports.parse = function(table) {
    var options =
        arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    options.border = options.border || {};
    defaults(options.border, defBorder);
    var lines = splitLines(table, options.border);
    return parseLines(lines, options);
};
function splitLines(table, border) {
    var lines = table.split(/\n/);
    var trimLines = [];
    var chars = ' ';
    each(border, function(val) {
        return (chars += val);
    });
    each(lines, function(line, idx) {
        line = trim(line);
        line = trim(line, chars);
        trimLines[idx] = line;
    });
    return filter(lines, function(line, idx) {
        return trimLines[idx] !== '';
    });
}
function parseLines(lines, options) {
    var border = options.border;
    var maxLen = 0;
    each(lines, function(line) {
        var len = strWidth(line);
        if (len > maxLen) {
            maxLen = len;
        }
    });
    lines = map(lines, function(line) {
        return line + repeat(' ', maxLen - strWidth(line));
    });
    var start = -1;
    var end = -1;
    var firstLine = lines[0];
    if (border.bodyLeft) {
        start = firstLine.indexOf(border.bodyLeft);
    }
    if (border.bodyRight) {
        end = firstLine.lastIndexOf(border.bodyRight);
    }
    lines = map(lines, function(line) {
        if (start > -1) {
            if (end > -1) {
                line = line.slice(start + 1, end);
            } else {
                line = line.slice(start + 1);
            }
        }
        return line;
    });
    maxLen = lines[0].length;
    var rows = [];
    var rowCount = lines.length;
    var column = [];
    var _loop = function() {
        var isSeparator = true;
        var isFakeColumn = false;
        for (var r = 0; r < rowCount; r++) {
            column[r] = column[r] || '';
            var c = lines[r][i] || '';
            if (c !== border.bodyJoin) {
                isSeparator = false;
            }
            column[r] += lines[r][i];
        }
        if (isSeparator || i === maxLen - 1) {
            var emptyLineCount = 0;
            each(column, function(data) {
                data = rtrim(data, ' ' + border.bodyJoin);
                if (data === '') {
                    emptyLineCount++;
                }
            });
            if (emptyLineCount >= rowCount - 1) {
                isFakeColumn = true;
            }
            if (isSeparator) {
                column = map(column, function(data) {
                    return data.slice(0, data.length - 1);
                });
            }
            column = map(column, function(data) {
                return trim(data);
            });
            for (var _r = 0; _r < rowCount; _r++) {
                var row = rows[_r] || [];
                var data = column[_r];
                if (isFakeColumn) {
                    if (row.length !== 0 && data) {
                        row[row.length - 1] += border.bodyJoin + data;
                    }
                } else {
                    row.push(data);
                }
                rows[_r] = row;
            }
            column = [];
        }
    };
    for (var i = 0; i < maxLen; i++) {
        _loop();
    }
    return rows;
}
var defBorder = {
    topBody: '─',
    topJoin: '┬',
    topLeft: '┌',
    topRight: '┐',
    bottomBody: '─',
    bottomJoin: '┴',
    bottomLeft: '└',
    bottomRight: '┘',
    bodyLeft: '│',
    bodyRight: '│',
    bodyJoin: '│',
    joinBody: '─',
    joinLeft: '├',
    joinRight: '┤',
    joinJoin: '┼'
};

module.exports = exports;
