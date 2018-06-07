"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dgraph = require("dgraph-js");
function xSetJSON(object, _dgraph) {
    if (_dgraph === void 0) { _dgraph = dgraph; }
    var mu = new _dgraph.Mutation();
    mu.setSetJson(object);
    return mu;
}
exports.xSetJSON = xSetJSON;
function xSetJSONCommitNow(object, _dgraph) {
    if (_dgraph === void 0) { _dgraph = dgraph; }
    var mu = xSetJSON(object, _dgraph);
    mu.setCommitNow(true);
    return mu;
}
exports.xSetJSONCommitNow = xSetJSONCommitNow;
