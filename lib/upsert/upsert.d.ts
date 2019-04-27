/**
 * @module Upsert
 */
import * as dgraph from 'dgraph-js';
import { Txn } from 'dgraph-js';
export declare type uid = string;
export interface INodeFoundFunction {
    existingUid: string | null;
    newNodeFn?: (node: any) => object;
}
export interface IUpsertFnReturnValues {
    dgraphQuery: string;
    nodeFoundFn: (queryResult: dgraph.Response) => INodeFoundFunction;
}
/**
 * #### Return a dgraph query and a node found function
 *
 * The basicEqualityUpsertFn below will find any nodes that has skill and level predicates.
 * ```ts
 * const updateJunior = {
 *   skill: 'Javascript',
 *   level: 10,
 *   x: 'y',
 *   y: 'y',
 *   z: 'y'
 * };
 *
 * // So if you already had a node in the db that looks like:
 * const existingNode = {
 *   skill: 'Javascript',
 *   level: 10,
 *   x: 'foo',
 *   y: 'foo',
 *   z: 'foo'
 * };
 *
 * /// x, y and z would be updated from 'foo' to 'y'
 * const updates = [updateJunior];
 * const upsertFn = basicEqualityUpsertFn(['skill', 'level']);
 *
 * // takes a upsertFn as well as an array or single object returns a uid or an array of uids
 * await xUpsertCommitTxn(upsertFn, updates, dgraphClient);
 * ```
 *
 * If no node matched both skill 'Javascript' and level '10' a new node would be created
 */
export declare function xUpsertCommitTxn(upsertFn: (input?: any) => IUpsertFnReturnValues, data: object[], dgraphClient: dgraph.DgraphClient, _dgraph?: any): Promise<uid[]>;
export declare function xUpsertCommitTxn(upsertFn: (input?: any) => IUpsertFnReturnValues, data: object, dgraphClient: dgraph.DgraphClient, _dgraph?: any): Promise<uid>;
/** * @ignore */
export declare function xUpsertObject(upsertFn: (input?: any) => IUpsertFnReturnValues, node: object, transaction: Txn): Promise<uid | null>;
