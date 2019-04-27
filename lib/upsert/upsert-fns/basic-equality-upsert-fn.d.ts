/**
 * @module Upsert
 */
import { IUpsertFnReturnValues } from '../upsert';
/**
 * #### Return a dgraph query and a node found function
 *
 * The basicEqualityUpsertFn below will find any nodes that has skill and level predicates.
 * ```ts
 * const updateJunior = {
 *   skill: 'Javascript',
 *   level: 10,
 *   x: 'y',
 * };
 *
 * // So if you already had a node in the db that looks like:
 * const existingNode = {
 *   skill: 'Javascript',
 *   level: 10,
 *   x: 'foo',
 * };
 *
 * /// update will match the existing node as skill and level match
 * const updates = [updateJunior];
 * const upsertFn = basicEqualityUpsertFn(['skill', 'level']);
 * ```
 * See {@link xUpsertCommitTxn}
 *
 * @returns A function that takes a node and returns dgraphQuery and nodeFoundFn. fn => {dgraphQuery, nodeFoundFn}
 */
export declare const basicEqualityUpsertFn: (searchPredicates: string | string[]) => (node: any) => IUpsertFnReturnValues;
