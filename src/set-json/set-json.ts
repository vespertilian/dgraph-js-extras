/**
 * @module Set
 */

import * as dgraph from 'dgraph-js'
import * as messages from "dgraph-js/generated/api_pb";
import {Mutation} from 'dgraph-js';

/**
 * xSetJSON is shorthand for:
 *
 * ```ts
 * const mu = new _dgraph.Mutation();
 * mu.setSetJson(object);
 * return mu;
 * ```
 */
export function xSetJSON(object: object, _dgraph: any = dgraph): Mutation  {
    const mu = new _dgraph.Mutation();
    mu.setSetJson(object);
    return mu;
}

/**
 * xSetJSONCommit is shorthand for:
 *
 * ```ts
 * const mu = new _dgraph.Mutation();
 * mu.setSetJson(object);
 * mu.setCommitNow(true);
 * return mu;
 * ```
 */
export function xSetJSONCommit(object: object, _dgraph: any = dgraph): Mutation {
   const mu = xSetJSON(object, _dgraph);
   mu.setCommitNow(true);
   return mu
}

/**
 * xSetJSONCommitTxn is shorthand for:
 *
 * ```ts
 * const mu = new _dgraph.Mutation();
 * mu.setSetJson(object);
 * mu.setCommitNow(true);
 * return dgraphClient.newTxn().mutate(mu);
 * ```
 */
export async function xSetJSONCommitTxn(object: object, dgraphClient: dgraph.DgraphClient): Promise<messages.Assigned> {
  return dgraphClient.newTxn().mutate(xSetJSONCommit(object));
}
