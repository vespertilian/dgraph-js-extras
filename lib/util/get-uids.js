"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// used by upsert functions
/** * @ignore */
function getUids(params) {
    var uids = [];
    for (var i = 0; i < params.numberOfIdsToGet; i++) {
        var key = "blank-" + i;
        var uid = params.result.getUidsMap().get(key);
        uids.push(uid);
    }
    return uids;
}
exports.getUids = getUids;
