import * as dgraph from 'dgraph-js'
import {Mutation} from 'dgraph-js';

export function XSetJs(object: object, _dgraph=dgraph): Mutation  {
    const mu = new _dgraph.Mutation();
    mu.setSetJson(object);
    return mu;
}

export function XSetJSCommitNow(object: object, _dgraph=dgraph): Mutation {
   const mu = XSetJs(object, _dgraph);
   mu.setCommitNow(true);
   return mu
}