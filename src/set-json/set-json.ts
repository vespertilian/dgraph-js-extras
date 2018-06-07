import * as dgraph from 'dgraph-js'
import {Mutation} from 'dgraph-js';

export function xSetJSON(object: object, _dgraph=dgraph): Mutation  {
    const mu = new _dgraph.Mutation();
    mu.setSetJson(object);
    return mu;
}

export function xSetJSONCommitNow(object: object, _dgraph=dgraph): Mutation {
   const mu = xSetJSON(object, _dgraph);
   mu.setCommitNow(true);
   return mu
}