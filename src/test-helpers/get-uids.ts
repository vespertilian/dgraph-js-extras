import * as messages from "dgraph-js/generated/api_pb";

export function getUids(params: {numberOfIdsToGet: number, result: messages.Assigned}): string[] {
    let uids = [];
    for(let i=0; i < params.numberOfIdsToGet; i++) {
        const key = `blank-${i}`;
        const uid = params.result.getUidsMap().get(key);
        uids.push(uid)
    }
    return uids;
}