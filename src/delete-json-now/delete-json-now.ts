import * as dgraph from 'dgraph-js'
import * as messages from "dgraph-js/generated/api_pb";

export async function xDeleteJSONNow(json: object, dgraphClient: dgraph.DgraphClient, _dgraph=dgraph): Promise<messages.Assigned> {
  const mu = new _dgraph.Mutation();
  mu.setDeleteJson(json);
  mu.setCommitNow(true);
  return dgraphClient.newTxn().mutate(mu)
}