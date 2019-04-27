/**
 * @module DropDB
 */
import * as dgraph from 'dgraph-js';
/**
 * xDropDBAlt is shorthand for:
 *
 * ```ts
 * const op = new _dgraph.Operation();
 * op.setDropAll(true);
 * return c.alter(op);
 * ```
 */
export declare function xDropDBAlt(c: dgraph.DgraphClient, _dgraph?: any): Promise<dgraph.Payload>;
