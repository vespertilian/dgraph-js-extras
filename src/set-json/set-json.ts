import * as dgraph from 'dgraph-js'
import {Mutation} from 'dgraph-js';

export function XSetJSON(object: object, _dgraph=dgraph): Mutation  {
    const mu = new _dgraph.Mutation();
    mu.setSetJson(object);
    return mu;
}

export function XSetJSONCommitNow(object: object, _dgraph=dgraph): Mutation {
   const mu = XSetJSON(object, _dgraph);
   mu.setCommitNow(true);
   return mu
}