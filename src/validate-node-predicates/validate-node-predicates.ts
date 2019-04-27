/**
 * @module Validate
 */

import * as dgraph from 'dgraph-js'
import {Txn} from 'dgraph-js';
import {xQuery} from '..';

export interface IValidateNodePredicates {
  nodes: string[]
  predicates: string[]
}

// use to validate the node you are linking to is the shape you want
/**
 * Same as {@link xValidateNodePredicates} but it creates it's own transaction
 */
export async function xValidateNodePredicatesTxn(params: IValidateNodePredicates, dgraphClient: dgraph.DgraphClient): Promise<boolean> {
  const txn = dgraphClient.newTxn();
  return xValidateNodePredicates(params, txn)
}

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
export async function xValidateNodePredicates(params: IValidateNodePredicates, txn: Txn) {
  // With the @cascade directive, nodes that don’t have all predicates specified in the query are removed.
  const query = `{
    q(func: uid(${params.nodes.join(",")})) @cascade {
      ${params.predicates.join("\n")} 
    }
  }`;

  const {q} = await xQuery(query, txn);
  return (q.length === params.nodes.length)
}
