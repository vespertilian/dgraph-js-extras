/**
 * @module Query
 */
import * as dgraph from 'dgraph-js';
import { Txn } from 'dgraph-js';
export interface IxQueryParams {
    query: string;
    vars?: {
        [k: string]: any;
    };
}
declare type getJSON = any;
/**
 * xQuery is shorthand for:
 *
 * ```ts
 * const res = await txn.query(query);
 * return res.getJson();
 * ```
 */
export declare function xQuery(query: string, txn: Txn): Promise<getJSON>;
/**
 * xQueryTxn is shorthand for:
 *
 * ```ts
 * const txn = dgraphClient.newTxn();
 * const res = await txn.query(query);
 * res.getJson();
 * ```
 */
export declare function xQueryTxn(query: string, dgraphClient: dgraph.DgraphClient): Promise<getJSON>;
/**
 * xQueryWithVars is shorthand for:
 *
 * ```ts
 * const res = await txn.queryWithVars(query, vars);
 * return res.getJson();
 * ```
 */
export declare function xQueryWithVars({ query, vars }: IxQueryParams, txn: Txn): Promise<getJSON>;
/**
 * xQueryWithVarsTxn is shorthand for:
 *
 * ```ts
 * const txn = dgraphClient.newTxn();
 * const res = await txn.queryWithVars(query, vars);
 * return res.getJson();
 * ```
 */
export declare function xQueryWithVarsTxn({ query, vars }: IxQueryParams, dgraphClient: dgraph.DgraphClient): Promise<getJSON>;
export {};
