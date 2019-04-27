/**
 * @module Query
 */

import * as dgraph from 'dgraph-js'
import {Txn} from 'dgraph-js';

export interface IxQueryParams {
  query: string;
  vars?: {[k: string]: any}
}

type getJSON = any;

/**
 * xQuery is shorthand for:
 *
 * ```ts
 * const res = await txn.query(query);
 * return res.getJson();
 * ```
 */
export async function xQuery(query: string, txn: Txn): Promise<getJSON> {
  const res = await txn.query(query);
  return res.getJson();
}

/**
 * xQueryTxn is shorthand for:
 *
 * ```ts
 * const txn = dgraphClient.newTxn();
 * const res = await txn.query(query);
 * res.getJson();
 * ```
 */
export async function xQueryTxn(query: string, dgraphClient: dgraph.DgraphClient): Promise<getJSON> {
  const txn = dgraphClient.newTxn();
  return await xQuery(query, txn)
}

/**
 * xQueryWithVars is shorthand for:
 *
 * ```ts
 * const res = await txn.queryWithVars(query, vars);
 * return res.getJson();
 * ```
 */
export async function xQueryWithVars({query, vars}: IxQueryParams, txn: Txn): Promise<getJSON> {
  const res = await txn.queryWithVars(query, vars);
  return res.getJson();
}

/**
 * xQueryWithVarsTxn is shorthand for:
 *
 * ```ts
 * const txn = dgraphClient.newTxn();
 * const res = await txn.queryWithVars(query, vars);
 * return res.getJson();
 * ```
 */
export async function xQueryWithVarsTxn({query, vars}: IxQueryParams, dgraphClient: dgraph.DgraphClient): Promise<getJSON> {
  const txn = dgraphClient.newTxn();
  return await xQueryWithVars({query, vars}, txn);
}
