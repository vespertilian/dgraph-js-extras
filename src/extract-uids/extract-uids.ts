import {Assigned} from "dgraph-js/generated/api_pb"

// core function
function extractUids(result: Assigned, limitTo: number | null = null): string[] {
    let uids = [];
    const uidsToReturn = limitTo || result.toObject().uidsMap.length;
    for(let i=0; i < uidsToReturn; i++) {
        const key = `blank-${i}`;
        const uid = result.getUidsMap().get(key);
        uids.push(uid)
    }
    return uids;
}

// fancy way to let us use this function with an existing Async function (promise) or a result
export function xExtractUids(_result: Promise<Assigned>, limitTo?: number): Promise<string[]>
export function xExtractUids(_result: Assigned, limitTo?: number): string[]
export function xExtractUids(_result: Promise<Assigned> | Assigned, limitTo?: number): Promise<string[]> | string[] | void {
    try {
        const result = isPromise(_result) ?
            extractUidsFromPromise(_result) :
            extractUids(_result, limitTo);
        return result;
    } catch(e) {
       ThrowExtractError(e, _result);
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
}

export function xExtractFirstUid(result: Promise<Assigned>): Promise<string>
export function xExtractFirstUid(result: Assigned): string
export function xExtractFirstUid(result: Promise<Assigned> | Assigned): Promise<string> | string {
    return isPromise(result) ?
        xExtractUids(result, 1).then(r => r[0]) :
        xExtractUids(result)[0]
}

// Typescript signature is "User-Defined Type Guard"
// http://www.typescriptlang.org/docs/handbook/advanced-types.html
export function isPromise(potentialPromise: Promise<any> | any): potentialPromise is Promise<any> {
    return Promise.resolve(potentialPromise) == potentialPromise
}