"use strict";
/**
 * @module ExtractUids
 */
Object.defineProperty(exports, "__esModule", { value: true });
var is_promise_1 = require("../util/is-promise");
// core function
function extractNamedUids(mutation, names) {
    return names.map(function (name) {
        var result = mutation.getUidsMap().get(name);
        if (!result)
            throw new Error("No named uid present for '" + name + "'");
        return result;
    });
}
function xExtractNamedUids(names, mutation) {
    var result = [];
    try {
        result = is_promise_1.isPromise(mutation) ?
            extractUidsFromPromise(mutation) :
            extractNamedUids(mutation, names);
    }
    catch (e) {
        ThrowExtractError(e, mutation);
    }
    function extractUidsFromPromise(p) {
        return p.then(function (r) {
            try {
                return extractNamedUids(r, names);
            }
            catch (e) {
                return ThrowExtractError(e, r);
            }
        });
    }
    // needs to be a function so we can call it from the promise
    // as well as from the main function
    function ThrowExtractError(e, r) {
        throw new Error("\n        xExtractNamedUids could not extract named uids\n        \n        Original Error: " + e.message + "\n        \n        Mutation result: " + JSON.stringify(r) + "\n        ");
    }
    return result;
}
exports.xExtractNamedUids = xExtractNamedUids;
