"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dgraph = require("dgraph-js");
function XSetJSON(object, _dgraph) {
    if (_dgraph === void 0) { _dgraph = dgraph; }
    var mu = new _dgraph.Mutation();
    mu.setSetJson(object);
    return mu;
}
exports.XSetJSON = XSetJSON;
function XSetJSONCommitNow(object, _dgraph) {
    if (_dgraph === void 0) { _dgraph = dgraph; }
    var mu = XSetJSON(object, _dgraph);
    mu.setCommitNow(true);
    return mu;
}
exports.XSetJSONCommitNow = XSetJSONCommitNow;
