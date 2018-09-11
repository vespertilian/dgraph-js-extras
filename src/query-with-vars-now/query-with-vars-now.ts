import * as dgraph from 'dgraph-js'

export interface IxQueryParams {
  query: string;
  vars?: {[k: string]: any}
}

export async function xQueryNow({query, vars}: IxQueryParams, dgraphClient: dgraph.DgraphClient) {
  const res = await dgraphClient.newTxn().queryWithVars(query, vars);
  return res.getJson();
}