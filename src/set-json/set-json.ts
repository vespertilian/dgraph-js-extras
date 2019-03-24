import * as dgraph from 'dgraph-js'
import * as messages from "dgraph-js/generated/api_pb";
import {Mutation} from 'dgraph-js';

export function xSetJSON(object: object, _dgraph: any = dgraph): Mutation  {
    const mu = new _dgraph.Mutation();
    mu.setSetJson(object);
    return mu;
}

export function xSetJSONNow(object: object, _dgraph: any = dgraph): Mutation {
   const mu = xSetJSON(object, _dgraph);
   mu.setCommitNow(true);
   return mu
}

export async function xSetJSONNowTxn(object: object, dgraphClient: dgraph.DgraphClient): Promise<messages.Assigned> {
  return dgraphClient.newTxn().mutate(xSetJSONNow(object));
}
