/**
 * @module ExtractUids
 */

import {Assigned} from "dgraph-js/generated/api_pb"
import {isPromise} from '../util/is-promise';

// core function
function extractUids(mutation: Assigned, limitTo: number | null = null): string[] {
    let uids = [];
    const uidsToReturn = limitTo || mutation.toObject().uidsMap.length;
    for(let i=0; i < uidsToReturn; i++) {
        const key = `blank-${i}`;
        const uid = mutation.getUidsMap().get(key);
        uids.push(uid)
    }
    return uids;
}

/**
 *
 * xExtractUids lets you wrap any of the set commands that return a dgraph assigned value or a **promise** that returns a dgraph assigned value
 *
 * ```ts
 * const users = [
 *  { username: 'foo' }
 *  { username: 'bar' }
 * ]
 *
 * // Wrapping the xSetJSONCommitTxn promise. Nice.
 * const [id1, id2] = await xExtractUids(xSetJSONCommitTxn(users, dgraphClient));
 * ```
 *
 */

// fancy way to let us use this function with an existing Async function (promise) or existing mutation
export function xExtractUids(mutation: Promise<Assigned>, limitTo?: number): Promise<string[]>
export function xExtractUids(mutation: Assigned, limitTo?: number): string[]
export function xExtractUids(mutation: Promise<Assigned> | Assigned, limitTo?: number): Promise<string[]> | string[] {
    let result = [];
    try {
        result = isPromise(mutation) ?
            extractUidsFromPromise(mutation) :
            extractUids(mutation, limitTo);
    } catch(e) {
       ThrowExtractError(e, mutation);
    }

    function extractUidsFromPromise(p) {
        return p.then((r) => {
            try {
                return extractUids(r, limitTo)
            } catch(e) {
                return ThrowExtractError(e, r);
            }
        })
    }

    // needs to be a function so we can call it from the promise
    // as well as from the main function
    function ThrowExtractError(e, r){
       throw new Error(`
        xExtractUids could not extract uids from: ${JSON.stringify(r)}
        Original Error: ${e.message}
        `)
    }
    return result;
}

/**
 *
 * xExtractFirstUid is useful when you expect only one value and dont want to destructure the returned array.
 * It's effectively just {@link xExtractUids} limited to one result
 *
 * ```ts
 * const users = [
 *  { username: 'foo' }
 *  { username: 'bar' }
 * ]
 *
 * // Wrapping the xSetJSONCommitTxn promise. Nice.
 * const id1 = await xExtractFirstUid(xSetJSONCommitTxn(users, dgraphClient));
 * ```
 *
 */
export function xExtractFirstUid(mutation: Promise<Assigned>): Promise<string>
export function xExtractFirstUid(mutation: Assigned): string
export function xExtractFirstUid(mutation: Promise<Assigned> | Assigned): Promise<string> | string {
    return isPromise(mutation) ?
        xExtractUids(mutation, 1).then(r => r[0]) :
        xExtractUids(mutation)[0]
}

