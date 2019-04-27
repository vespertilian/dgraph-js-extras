/**
 * @module Delete
 */
import * as dgraph from 'dgraph-js';
import * as messages from "dgraph-js/generated/api_pb";
import { Mutation } from 'dgraph-js';
/**
 * xDeleteJson is shorthand for:
 *
 * ```ts
 * const mu = new _dgraph.Mutation();
 * mu.setDeleteJson(json);
 * return mu;
 * ```
 */
export declare function xDeleteJSON(json: any, _dgraph?: any): Mutation;
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
export declare function xDeleteJSONCommit(json: any): Mutation;
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
export declare function xDeleteJSONCommitTxn(json: object, dgraphClient: dgraph.DgraphClient): Promise<messages.Assigned>;
