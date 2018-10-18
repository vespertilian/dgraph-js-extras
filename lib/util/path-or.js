"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// this function has been copied by Ramda
// just didn't want and dependencies
function pathOr(defaultValue, _path, obj) {
    return defaultTo(defaultValue, path(_path, obj));
}
exports.pathOr = pathOr;
function path(paths, obj) {
    var val = obj;
    var idx = 0;
    while (idx < paths.length) {
        if (val == null) {
            return;
        }
        val = val[paths[idx]];
        idx += 1;
    }
    return val;
}
function defaultTo(d, v) {
    return v == null || v !== v ? d : v;
}
