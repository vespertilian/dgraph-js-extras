import * as dgraph from 'dgraph-js'
import * as messages from "dgraph-js/generated/api_pb";
import {Mutation} from 'dgraph-js';

export function xSetJSON(object: object, _dgraph=dgraph): Mutation  {
    const mu = new _dgraph.Mutation();
    mu.setSetJson(object);
    return mu;
}

export function xSetJSONNow(object: object, _dgraph=dgraph): Mutation {
   const mu = xSetJSON(object, _dgraph);
   mu.setCommitNow(true);
   return mu
}

export async function xSetJSONNowTxn(object: object, dgraphClient: dgraph.DgraphClient, _dgraph=dgraph): Promise<messages.Assigned> {
  return dgraphClient.newTxn().mutate(xSetJSONNow(object));
}