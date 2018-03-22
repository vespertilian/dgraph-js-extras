"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dgraph = require("dgraph-js");
function XDropDBNow(c, _dgraph) {
    if (_dgraph === void 0) { _dgraph = dgraph; }
    var op = new _dgraph.Operation();
    op.setDropAll(true);
    return c.alter(op);
}
exports.XDropDBNow = XDropDBNow;
