"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Typescript signature is "User-Defined Type Guard"
// http://www.typescriptlang.org/docs/handbook/advanced-types.html
/** * @ignore */
function isPromise(potentialPromise) {
    return Promise.resolve(potentialPromise) == potentialPromise;
}
exports.isPromise = isPromise;
