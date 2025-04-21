var isStr = require('./isStr');
var Class = require('./Class');
exports = function(xpath, optimized) {
    if (isStr(xpath)) {
        return findEl(xpath);
    } else {
        return getXpath(xpath, optimized);
    }
};
function findEl(xpath) {
    var ret = [];
    var nodesSnapshot = document.evaluate(
        xpath,
        document,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null
    );
    for (var i = 0; i < nodesSnapshot.snapshotLength; i++) {
        ret.push(nodesSnapshot.snapshotItem(i));
    }
    return ret;
}

function getXpath(node) {
    var optimized =
        arguments.length > 1 && arguments[1] !== undefined
            ? arguments[1]
            : false;
    if (node.nodeType === Node.DOCUMENT_NODE) {
        return '/';
    }
    var steps = [];
    var contextNode = node;
    while (contextNode) {
        var step = xPathValue(contextNode, optimized);
        if (!step) {
            break;
        }
        steps.push(step);
        if (step.optimized) {
            break;
        }
        contextNode = contextNode.parentNode;
    }
    steps.reverse();
    return (steps.length && steps[0].optimized ? '' : '/') + steps.join('/');
}
function xPathValue(node, optimized) {
    var ownValue;
    var ownIndex = xPathIndex(node);
    if (ownIndex === -1) {
        return null;
    }
    switch (node.nodeType) {
        case Node.ELEMENT_NODE:
            if (optimized && node.getAttribute('id')) {
                return new Step(
                    '//*[@id="' + node.getAttribute('id') + '"]',
                    true
                );
            }
            ownValue = node.localName;
            break;
        case Node.ATTRIBUTE_NODE:
            ownValue = '@' + node.nodeName();
            break;
        case Node.TEXT_NODE:
        case Node.CDATA_SECTION_NODE:
            ownValue = 'text()';
            break;
        case Node.PROCESSING_INSTRUCTION_NODE:
            ownValue = 'processing-instruction()';
            break;
        case Node.COMMENT_NODE:
            ownValue = 'comment()';
            break;
        case Node.DOCUMENT_NODE:
            ownValue = '';
            break;
        default:
            ownValue = '';
            break;
    }
    if (ownIndex > 0) {
        ownValue += '[' + ownIndex + ']';
    }
    return new Step(ownValue, node.nodeType === Node.DOCUMENT_NODE);
}
function xPathIndex(node) {
    function areNodesSimilar(left, right) {
        if (left === right) {
            return true;
        }
        if (
            left.nodeType === Node.ELEMENT_NODE &&
            right.nodeType === Node.ELEMENT_NODE
        ) {
            return left.localName === right.localName;
        }
        if (left.nodeType === right.nodeType) {
            return true;
        }
        var leftType =
            left.nodeType === Node.CDATA_SECTION_NODE
                ? Node.TEXT_NODE
                : left.nodeType;
        var rightType =
            right.nodeType === Node.CDATA_SECTION_NODE
                ? Node.TEXT_NODE
                : right.nodeType;
        return leftType === rightType;
    }
    var siblings = node.parentNode ? node.parentNode.children : null;
    if (!siblings) {
        return 0;
    }
    var hasSameNamedElements;
    for (var i = 0; i < siblings.length; ++i) {
        if (areNodesSimilar(node, siblings[i]) && siblings[i] !== node) {
            hasSameNamedElements = true;
            break;
        }
    }
    if (!hasSameNamedElements) {
        return 0;
    }
    var ownIndex = 1;
    for (var _i = 0; _i < siblings.length; ++_i) {
        if (areNodesSimilar(node, siblings[_i])) {
            if (siblings[_i] === node) {
                return ownIndex;
            }
            ++ownIndex;
        }
    }
    return -1;
}
var Step = Class({
    initialize: function(value, optimized) {
        this.value = value;
        this.optimized = optimized || false;
    },
    toString: function() {
        return this.value;
    }
});

module.exports = exports;
