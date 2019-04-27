/**
 * @module Set
 */
import * as dgraph from 'dgraph-js';
import * as messages from "dgraph-js/generated/api_pb";
import { Mutation } from 'dgraph-js';
/**
 * xSetJSON is shorthand for:
 *
 * ```ts
 * const mu = new _dgraph.Mutation();
 * mu.setSetJson(object);
 * return mu;
 * ```
 */
export declare function xSetJSON(object: object, _dgraph?: any): Mutation;
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
export declare function xSetJSONCommit(object: object, _dgraph?: any): Mutation;
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
export declare function xSetJSONCommitTxn(object: object, dgraphClient: dgraph.DgraphClient): Promise<messages.Assigned>;
