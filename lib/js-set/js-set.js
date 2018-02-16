"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dgraph = require("dgraph-js");
function XSetJs(object, _dgraph) {
    if (_dgraph === void 0) { _dgraph = dgraph; }
    var mu = new _dgraph.Mutation();
    mu.setSetJson(object);
    return mu;
}
exports.XSetJs = XSetJs;
function XSetJSCommitNow(object, _dgraph) {
    if (_dgraph === void 0) { _dgraph = dgraph; }
    var mu = XSetJs(object, _dgraph);
    mu.setCommitNow(true);
    return mu;
}
exports.XSetJSCommitNow = XSetJSCommitNow;
