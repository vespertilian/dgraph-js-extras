/**
 * @module Delete
 */

import * as dgraph from 'dgraph-js'
import * as messages from "dgraph-js/generated/api_pb";
import {Mutation} from 'dgraph-js';

/**
 * xDeleteJson is shorthand for:
 *
 * ```ts
 * const mu = new _dgraph.Mutation();
 * mu.setDeleteJson(json);
 * return mu;
 * ```
 */
export function xDeleteJSON(json, _dgraph: any = dgraph): Mutation {
  const mu = new _dgraph.Mutation();
  mu.setDeleteJson(json);
  return mu
}

/**
 * xDeleteJsonCommit is shorthand for:
 *
 * ```ts
 * const mu = new _dgraph.Mutation();
 * mu.setDeleteJson(json);
 * mu.setCommitNow(true);
 * return mu;
 * ```
 */
export function xDeleteJSONCommit(json): Mutation {
  const mu = xDeleteJSON(json);
  mu.setCommitNow(true);
  return mu
}

/**
 * xDeleteJsonCommit is shorthand for:
 *
 * ```ts
 * const mu = new _dgraph.Mutation();
 * mu.setDeleteJson(json);
 * mu.setCommitNow(true);
 * dgraphClient.newTxn().mutate(mu);
 * ```
 */
export async function xDeleteJSONCommitTxn(json: object, dgraphClient: dgraph.DgraphClient): Promise<messages.Assigned> {
  const mu = xDeleteJSONCommit(json);
  return dgraphClient.newTxn().mutate(mu);
}
