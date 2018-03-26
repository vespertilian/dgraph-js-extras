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
export function XExtractUids(_result: Promise<Assigned>, limitTo?: number): Promise<string[]>
export function XExtractUids(_result: Assigned, limitTo?: number): string[]
export function XExtractUids(_result: Promise<Assigned> | Assigned, limitTo?: number): Promise<string[]> | string[] | void {
    let result;
    try {
        result = _result instanceof Promise ?
            _result.then((r) => extractUids(r, limitTo)).catch(ThrowExtractError) :
            extractUids(_result, limitTo);
        return result
    } catch(e) {
       ThrowExtractError(e);
    }

    // needs to be a function so we can call it from the promise or the try catch
    function ThrowExtractError(e){
       throw new Error(`
        XExtractUids could not extract uids from: ${JSON.stringify(_result)}
        Original Error: ${e.message}
        `)
    }
}

export function XExtractFirstUid(result: Promise<Assigned>): Promise<string>
export function XExtractFirstUid(result: Assigned): string
export function XExtractFirstUid(result: any): Promise<string> | string {
    return result instanceof Promise ?
        XExtractUids(result, 1).then(r => r[0]) :
        XExtractUids(result)[0]
}