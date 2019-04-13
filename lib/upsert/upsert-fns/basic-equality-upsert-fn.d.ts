/**
 * @module Upsert
 */
import { IUpsertFnReturnValues } from '../upsert';
/**
 * #### Return a dgraph query and a node found function
 *
 * The dgraph query is just a generic dgraph query that has been constructed with string concatenation.
 * The node found function is used by upsertFunctions to understand how to extract the uid from the query.
 *
 *
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
 * await xUpsertCommitTxn(upsertFn, updates, dgraphClient);
 * ```
 *
 * If no node matched both skill 'Javascript' and level '10' a new node would be created
 *
 * @returns A function that takes a node and returns dgraphQuery and nodeFoundFn. fn => {dgraphQuery, nodeFoundFn}
 */
export declare const basicEqualityUpsertFn: (searchPredicates: string | string[]) => (node: any) => IUpsertFnReturnValues;
