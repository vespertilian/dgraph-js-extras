/**
 * @module Query
 */

import * as dgraph from 'dgraph-js'
import {Txn} from 'dgraph-js';

export interface IxQueryParams {
  query: string;
  vars?: {[k: string]: any}
}


export async function xQuery(query: string, txn: Txn) {
  const res = await txn.query(query);
  return res.getJson();
}

export async function xQueryTxn(query: string, dgraphClient: dgraph.DgraphClient) {
  const txn = dgraphClient.newTxn();
  return await xQuery(query, txn)
}

export async function xQueryWithVars({query, vars}: IxQueryParams, txn: Txn) {
  const res = await txn.queryWithVars(query, vars);
  return res.getJson();
}

export async function xQueryWithVarsTxn({query, vars}: IxQueryParams, dgraphClient: dgraph.DgraphClient) {
  const txn = dgraphClient.newTxn();
  return await xQueryWithVars({query, vars}, txn);
}
