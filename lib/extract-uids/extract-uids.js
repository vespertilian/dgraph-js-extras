"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var is_promise_1 = require("../util/is-promise");
// core function
function extractUids(mutation, limitTo) {
    if (limitTo === void 0) { limitTo = null; }
    var uids = [];
    var uidsToReturn = limitTo || mutation.toObject().uidsMap.length;
    for (var i = 0; i < uidsToReturn; i++) {
        var key = "blank-" + i;
        var uid = mutation.getUidsMap().get(key);
        uids.push(uid);
    }
    return uids;
}
function xExtractUids(mutation, limitTo) {
    var result = [];
    try {
        result = is_promise_1.isPromise(mutation) ?
            extractUidsFromPromise(mutation) :
            extractUids(mutation, limitTo);
    }
    catch (e) {
        ThrowExtractError(e, mutation);
    }
    function extractUidsFromPromise(p) {
        return p.then(function (r) {
            try {
                return extractUids(r, limitTo);
            }
            catch (e) {
                return ThrowExtractError(e, r);
            }
        });
    }
    // needs to be a function so we can call it from the promise
    // as well as from the main function
    function ThrowExtractError(e, r) {
        throw new Error("\n        xExtractUids could not extract uids from: " + JSON.stringify(r) + "\n        Original Error: " + e.message + "\n        ");
    }
    return result;
}
exports.xExtractUids = xExtractUids;
function xExtractFirstUid(mutation) {
    return is_promise_1.isPromise(mutation) ?
        xExtractUids(mutation, 1).then(function (r) { return r[0]; }) :
        xExtractUids(mutation)[0];
}
exports.xExtractFirstUid = xExtractFirstUid;
