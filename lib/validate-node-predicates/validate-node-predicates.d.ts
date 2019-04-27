/**
 * @module Validate
 */
import * as dgraph from 'dgraph-js';
import { Txn } from 'dgraph-js';
export interface IValidateNodePredicates {
    nodes: string[];
    predicates: string[];
}
/**
 * Same as {@link xValidateNodePredicates} but it creates it's own transaction
 */
export declare function xValidateNodePredicatesTxn(params: IValidateNodePredicates, dgraphClient: dgraph.DgraphClient): Promise<boolean>;
/**
 * Validates a node has the specified attributes
 *
 * ```ts
 * const users = [
 *  { username: 'user1', age: 33, street: '123 state'},
 *  { username: 'user2', age: 35},
 *  { username: 'user3'}
 * ];
 *
 * // will return true username is a predicate for every user
 * const result = await xValidateNodePredicatesTxn({
 *     nodes: userUids,
 *     predicates: ['username']
 * }, dgraphClient);
 * ```
 */
export declare function xValidateNodePredicates(params: IValidateNodePredicates, txn: Txn): Promise<boolean>;
