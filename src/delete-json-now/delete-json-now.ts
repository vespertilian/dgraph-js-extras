import * as dgraph from 'dgraph-js'
import * as messages from "dgraph-js/generated/api_pb";
import {Mutation} from 'dgraph-js';

export function xDeleteJSON(json, _dgraph=dgraph): Mutation {
  const mu = new _dgraph.Mutation();
  mu.setDeleteJson(json);
  return mu
}

export async function xDeleteJSONNow(json: object, dgraphClient: dgraph.DgraphClient): Promise<messages.Assigned> {
  const mu = xDeleteJSON(json);
  mu.setCommitNow(true);
  return dgraphClient.newTxn().mutate(mu);
}