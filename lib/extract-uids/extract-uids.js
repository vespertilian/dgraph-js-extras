"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// core function
function extractUids(result, limitTo) {
    if (limitTo === void 0) { limitTo = null; }
    var uids = [];
    var uidsToReturn = limitTo || result.toObject().uidsMap.length;
    for (var i = 0; i < uidsToReturn; i++) {
        var key = "blank-" + i;
        var uid = result.getUidsMap().get(key);
        uids.push(uid);
    }
    return uids;
}
function XExtractUids(_result, limitTo) {
    try {
        var result = isPromise(_result) ?
            extractUidsFromPromise(_result) :
            extractUids(_result, limitTo);
        return result;
    }
    catch (e) {
        ThrowExtractError(e, _result);
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
        throw new Error("\n        XExtractUids could not extract uids from: " + JSON.stringify(r) + "\n        Original Error: " + e.message + "\n        ");
    }
}
exports.XExtractUids = XExtractUids;
function XExtractFirstUid(result) {
    return isPromise(result) ?
        XExtractUids(result, 1).then(function (r) { return r[0]; }) :
        XExtractUids(result)[0];
}
exports.XExtractFirstUid = XExtractFirstUid;
// Typescript signature is "User-Defined Type Guard"
// http://www.typescriptlang.org/docs/handbook/advanced-types.html
function isPromise(potentialPromise) {
    return Promise.resolve(potentialPromise) == potentialPromise;
}
exports.isPromise = isPromise;
