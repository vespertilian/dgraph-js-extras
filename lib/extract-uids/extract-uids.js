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
    var result;
    try {
        result = _result instanceof Promise ?
            _result.then(function (r) { return extractUids(r, limitTo); }).catch(ThrowExtractError) :
            extractUids(_result, limitTo);
        return result;
    }
    catch (e) {
        ThrowExtractError(e);
    }
    // needs to be a function so we can call it from the promise or the try catch
    function ThrowExtractError(e) {
        throw new Error("\n        XExtractUids could not extract uids from: " + JSON.stringify(_result) + "\n        Original Error: " + e.message + "\n        ");
    }
}
exports.XExtractUids = XExtractUids;
function XExtractFirstUid(result) {
    return XExtractUids(result, 1);
}
exports.XExtractFirstUid = XExtractFirstUid;
